
<template>
    <div class="custDialog" >
        <!-- 弹窗，最大保护客户限制规则 -->
        <!-- 最大保护客户限制规则 -->
        <el-dialog :title="$t('mxpcweb.systemset.highseas.1528794156886')" v-dialogDrag :modal-append-to-body="false" :visible.sync="maxLimit.popup" custom-class="widthDefault">
            <div v-if="maxLimit.popup" class="MXscroll" style="min-height:300px;max-height:500px;overflow-y:scroll;">
                <el-form :model="maxLimit.maxLimitForm" ref="formName" :rules="rules" label-width="120px" label-position="left">
                    <!-- 适用角色 -->
                    <el-form-item :label="$t('mxpcweb.systemset.highseas.1529024977541')" prop="applyRoles">
                        <!-- 请输入人员关键词 -->
                        <el-select v-model="maxLimit.maxLimitForm.applyRoles" multiple filterable remote :placeholder="$t('mxpcweb.systemset.highseas.1529025812271')" :remote-method="roleRemoteMethod" :loading="roleLoading" style="width:410px;">
                            <el-option v-for="item in roleOptionLists" :key="item.id" :label="item.roleName" :value="item.roleId+''"> </el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 是否启用 -->
                    <el-form-item :label="$t('mxpcweb.systemset.highseas.1529025745541')" prop="enable">
                        <el-switch on-text="" off-text="" v-model="maxLimit.maxLimitForm.enable"></el-switch>
                    </el-form-item>
                    <!-- 客户状态 -->
                    <el-form-item :label="$t('mxpcweb.systemset.highseas.1529026216789')">
                        <!-- 仅未成交客户 -->
                        <el-checkbox  v-model="maxLimit.maxLimitForm.customerState" :label="$t('mxpcweb.systemset.highseas.1528794237686')" name="type"></el-checkbox>
                    </el-form-item>

                    <!-- 规则 -->
                    <el-form-item :label="$t('mxpcweb.systemset.highseas.1529026284279')">
                        <el-radio-group v-model="maxLimit.maxLimitForm.ruleType">
                            <!-- 总数限制为 -->
                            <span style="display:inline-block;width:120px;"><el-radio label="1">{{$t('mxpcweb.systemset.highseas.1528794284097')}}</el-radio></span>
                            <el-input-number v-model="maxLimit.maxLimitForm.totalLimit" :min="0" size="small" style="line-height:20px;width:110px;margin-left:8px;"></el-input-number>
                            <br>
                            <div  v-for="(list,index) in selectList" :key="index">
                                <el-radio :label="list.ruleType" style="margin-top:10px;">{{list.dictName}}</el-radio>
                                <ul v-show="maxLimit.maxLimitForm.ruleType==list.ruleType" class="listRadio">
                                    <li  v-for="(item,index) in list.dictItems" :key="index">
                                        <span class="itemName">{{item.itemName}}</span>
                                        <el-input-number v-model="item.limitNum"  :min="0" size="small" style="line-height:20px;width:110px;"></el-input-number>
                                    </li>
                                </ul>
                            </div>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer text-center">
                <!-- 取 消 -->
                <el-button  @click="maxLimit.popup = false">{{$t('mxpcweb.login.1528703242867')}}</el-button>
                <!-- 确 定 -->
                <el-button type="primary" @click="addLimitNum()" :loading="subLoading">{{$t('mxpcweb.login.1528696139283')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { isArray } from '@/libs/utils.js'
export default {
  name: 'custDialog',
  props: {
    maxLimit: { // 弹窗开关
      type: Object,
      required: true
    },
    selectList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      loading: true,
      roleLoading: false,
      subLoading: false,
      roleList: [],
      roleOptionLists: [], // 适用角色列表
      rules: {
        enable: [
          { required: true }
        ],
        applyRoles: [
          // 请选择适用角色
          { type: 'array', required: true, message: this.$t('mxpcweb.systemset.highseas.1528794319134'), trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.getRoles()
  },
  methods () {
  },
  methods: {
    roleRemoteMethod (query) {
      let _this = this
      if (query !== '') {
        _this.loading = true
        setTimeout(() => {
          _this.loading = false
          _this.roleOptionLists = []
          _this.roleList.forEach(function (item) {
            if (item.roleName.indexOf(query) > -1) {
              _this.roleOptionLists.push(item)
            }
          })
        }, 200)
      } else {
        _this.roleOptionLists = _this.roleList
      }
    },
    switchArguments () { // 转化提交参数
      let _this = this
      let { ruleType, enable, customerState, totalLimit, applyRoles, ruleId } = _this.maxLimit.maxLimitForm
      let arguments1 = {}
      let thisArguments = []
      _this.selectList.forEach(function (list) {
        if (list.ruleType == ruleType) {
          list.dictItems.forEach(function (item) {
            let argument = {
              dictItemCode: item.dictItemCode.toString(),
              limitNum: item.limitNum.toString()
            }
            thisArguments.push(argument)
          })
        }
      })
      arguments1.fieldLimit = thisArguments
      arguments1.ruleType = ruleType
      arguments1.ruleId = ruleId
      if (enable) {
        arguments1.useFlag = '1'
      } else {
        arguments1.useFlag = '0'
      };
      if (customerState) {
        arguments1.custState = '1'
      } else {
        arguments1.custState = '0'
      };
      arguments1.totalLimit = totalLimit.toString()
      arguments1.applyRoles = []
      applyRoles.forEach(function (item) {
        arguments1.applyRoles.push(item)
      })
      arguments1.applyRoles = arguments1.applyRoles.toString()
      return arguments1
    },
    addLimitNum () { // 提交表单
      let _this = this
      let next = true
      this.$refs['formName'].validate((valid) => {
        if (!valid) {
          next = false
        }
      })
      if (!next) {
        return false
      }
      this.subLoading = true
      let argument = _this.switchArguments()
      let url = _this.Global.api.SystemSet.highseas.custLimitAdd
      if (_this.maxLimit.addOrEdit == 'edit') {
        url = _this.Global.api.SystemSet.highseas.custLimitPut
      }
      _this.$http.post(_this.Global.baseURL + url, argument
      ).then((res) => {
        if (res.body.code.toString() == _this.Global.RES_OK) {
          _this.$message.success(_this.msg(res.body))
          _this.maxLimit.popup = false
          _this.$emit('getLists')
          _this.subLoading = false
        } else {
          _this.$message.error(_this.msg(res.body))
          _this.subLoading = false
        }
      }, (res) => {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
        _this.subLoading = false
      })
    },
    getRoles () { // 获取适用角色
      let _this = this
      _this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.rolemanag.roles, {
        params: {
          'type': 'all',
          'id': 'get'
        }
      }).then((res) => {
        if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
          _this.roleOptionLists = res.body.data
          this.roleList = res.body.data
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, (res) => {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
