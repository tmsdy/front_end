
<template>
    <div class="custList" v-loading="loading">
        <div class="operation">
            {{$t('mxpcweb.systemset.highseas.1528791793228')}}
            <!-- 添加规则 -->
            <el-button  type="primary" class="operationBut" @click="addRule" size="small">{{$t('mxpcweb.mail.1528883319872')}}</el-button>
        </div>
        <no-data v-show="!loading" v-if="maxLimitRules.length==0"></no-data>
        <el-row :gutter="20"  v-if="maxLimitRules.length!=0" class="list listTit">
            <el-col :span="12">
                <!-- 适用角色 -->
                {{$t('mxpcweb.systemset.highseas.1529024977541')}}
            </el-col>

            <el-col :span="8">
                <!-- 限制规则 -->
                {{$t('mxpcweb.systemset.highseas.1529026066055')}}
            </el-col>
            <el-col :span="4" style="text-align:center">
                <!-- 启用 -->
                {{$t('mxpcweb.systemset.highseas.1529025082189')}}
            </el-col>
        </el-row>
        <el-row :gutter="20" v-for="(item,index) in maxLimitRules" :key="index" class="list list1">
            <el-col :span="12" class="ellipsis">
                <el-popover trigger="hover"  placement="bottom">
                  <span v-for="(items,indexs) in item.applyRoles" :key="indexs">{{returnRoleName(items)}}&nbsp;&nbsp;</span>
                  <div slot="reference">
                    <span v-for="(items,indexs) in item.applyRoles" :key="indexs">{{returnRoleName(items)}}&nbsp;&nbsp;</span>
                  </div>
                </el-popover>
            </el-col>

            <el-col :span="8">
                <el-popover trigger="hover"  placement="bottom">
                    <p style="font-size:12px;max-width:238px;">
                        <!-- 未成交客户 -->
                        <span  style="color: RGBA(208, 2, 27, 1);" v-if="item.custState==1">{{$t('mxpcweb.systemset.highseas.1529025462254')}}</span>
                        <!-- 所有客户 -->
                        <span  style="color: RGBA(208, 2, 27, 1);" v-if="item.custState==0">{{$t('mxpcweb.systemset.highseas.1529399337494')}}</span>
                        <span v-if="item.ruleType==1">
                            <!-- 总数量限制为 -->
                            <span>{{$t('mxpcweb.systemset.highseas.1528792050500')}}</span>
                            <span  style="color: RGBA(208, 2, 27, 1);">{{ item.totalLimit }}</span>
                        </span>
                        <span v-if="item.ruleType==2">
                            <!-- 客户等级限制中 -->
                            <span>{{$t('mxpcweb.systemset.highseas.1529026125109')}}</span>
                            <br>
                            <span  v-for="(list,indexs) in JSON.parse(item.fieldLimit)" :key="indexs">
                                <!-- 限制为 -->
                                <span  style="color: RGBA(208, 2, 27, 1);">{{list.dictItemName}}&nbsp;</span>{{$t('mxpcweb.systemset.highseas.1528792123221')}}<span style="color: RGBA(208, 2, 27, 1);">{{list.limitNum}}&nbsp;</span>
                                <span v-if="(indexs % 3) == 2"><br></span>
                            </span>
                        </span>
                        <span v-if="item.ruleType==3">
                            <!-- 客户来源限制中 -->
                            <span>{{$t('mxpcweb.g.1528792144113')}}&nbsp;</span>
                            <br>
                            <span  v-for="(list,indexs) in JSON.parse(item.fieldLimit)" :key="indexs">
                                <template v-if="list.limitNum!=0">
                                    <!-- 限制为 -->
                                    <span  style="color: RGBA(208, 2, 27, 1);">{{list.dictItemName}}&nbsp;</span>{{$t('mxpcweb.systemset.highseas.1528792123221')}}<span  style="color: RGBA(208, 2, 27, 1);">{{list.limitNum}}&nbsp;</span>
                                    <span v-if="(indexs % 3) == 2"><br></span>
                                </template>
                            </span>
                        </span>
                    </p>

                    <div  slot="reference" class="ellipsis">
                        <!-- 未成交客户 -->
                        <span class="text-reds" v-if="item.custState==1">{{$t('mxpcweb.systemset.highseas.1529025462254')}}</span>
                        <!-- 所有客户 -->
                        <span class="text-reds" v-if="item.custState==0">{{$t('mxpcweb.systemset.highseas.1529399337494')}}</span>
                        <span v-if="item.ruleType==1">
                            <!-- 总数量限制为 -->
                            <span>{{$t('mxpcweb.systemset.highseas.1528792050500')}}</span>
                            <span class="text-reds">{{ item.totalLimit }}</span>
                        </span>
                        <span v-if="item.ruleType==2">
                            <!-- 客户等级限制中 -->
                            <span>{{$t('mxpcweb.systemset.highseas.1529026125109')}}</span>
                            <span  v-for="(list,index) in JSON.parse(item.fieldLimit)" :key="index">
                                <!-- 限制为 -->
                                <span class="text-reds">{{list.dictItemName}}&nbsp;</span>{{$t('mxpcweb.systemset.highseas.1528792123221')}}<span class="text-reds">{{list.limitNum}}&nbsp;</span>
                            </span>
                            <span>...</span>
                        </span>
                        <span v-if="item.ruleType==3">
                            <!-- 客户来源限制中 -->
                            <span>{{$t('mxpcweb.g.1528792144113')}}&nbsp;</span>
                            <span  v-for="(list,indexs) in JSON.parse(item.fieldLimit)" :key="indexs">
                                <template v-if="list.limitNum!=0">
                                    <!-- 限制为 -->
                                    <span class="text-reds">{{list.dictItemName}}&nbsp;</span>{{$t('mxpcweb.systemset.highseas.1528792123221')}}<span class="text-reds">{{list.limitNum}}&nbsp;</span>
                                </template>
                            </span>
                        </span>
                    </div>
                </el-popover>
            </el-col>
            <el-col :span="4" style="text-align:center">
                <div class="useFlagModel">
                    <el-checkbox v-model="item.useFlagModel"></el-checkbox>
                </div>
                <div class="iconBox">
                    <span class="iBox" @click="handleEdit(item)" :title="$t('mxpcweb.systemset.mailset.autographmanage.1528975040916')">
                        <i class="iconfont icon-edit-square"></i>
                    </span>
                    <span class="iBox" @click="handleDelete(item)" :title="$t('mxpcweb.mail.1528702683911')">
                        <i class="iconfont icon-del"></i>
                    </span>
                </div>
            </el-col>
        </el-row>
        <!-- 弹窗，最大保护客户限制规则 -->
        <cust-dialog ref="custAdd" :maxLimit="maxLimit" :selectList="selectList" @getLists="getLists"></cust-dialog>
    </div>
</template>
<script>
import { isArray } from '@/libs/utils.js'
import custDialog from './custDialog/index.vue'
import NoData from '@/basecomponents/NoData/index'
export default {
  name: 'custList',
  props: {
  },
  data () {
    return {
      maxLimit: {
        popup: false, // 弹窗开关
        addOrEdit: 'add',
        maxLimitForm: {
          applyRoles: [], // 适用角色（角色Id,数组）
          enable: true, // 是否启用
          customerState: true,
          customerState: true, // 是否仅未成交客户（0：否、1：是）
          ruleType: '1', // 限制类型（1：总数量限制/2:客户等级限制/3：客户来源限制）
          totalLimit: 0, // 总数量限制数（当限制类型为1时起效）
          fieldLimit: [
          ]
          // useBackDay:true, //开启关闭抢回限制（0：关闭、1：开启）
          // backDays: 0  //抢回限制天数
        }
      },
      loading: true,
      selectList: [],
      maxLimitRules: [], // 最大保持数规则
      roleLoading: false,
      ruleAddwhether: true, // 添加规则开关
      roleOptionLists: [],
      firstInto: true
    }
  },
  created () {
    this.getLists()
    this.getControl()
    this.getRoles()
  },
  methods: {
    addRule () { // 新建规则
      this.maxLimit.popup = true
      this.maxLimit.addOrEdit = 'add'
      this.clearForm()
    },
    handleEdit (item) { // 操作
      let _this = this
      _this.maxLimit.addOrEdit = 'edit'
      let {applyRoles, custState, fieldLimit, useFlag, ruleId, ruleType, totalLimit} = item
      let enable, customerState
      if (useFlag == 1) {
        enable = true
      } else {
        enable = false
      }
      if (custState == 1) {
        customerState = true
      } else {
        customerState = false
      }
      _this.maxLimit.maxLimitForm = {
        applyRoles: applyRoles, // 适用角色（角色Id,数组）
        enable: enable, // 是否启用
        customerState: customerState, // 是否仅未成交客户（0：否、1：是）
        ruleType: ruleType.toString(), // 限制类型（1：总数量限制/2:客户等级限制/3：客户来源限制）
        totalLimit: totalLimit, // 总数量限制数（当限制类型为1时起效）
        fieldLimit: [],
        ruleId: ruleId
      }
      _this.maxLimit.popup = true
      this.selectList.forEach(function (list) {
        if (list.ruleType == ruleType) {
          list.dictItems = JSON.parse(fieldLimit)
        }
      })
    },
    handleDelete (item) {
      let _this = this
      this.$confirm(this.$t('mxpcweb.systemset.highseas.1528792257332') + ',' + this.$t('mxpcweb.systemset.highseas.1528792290899'), this.$t('mxpcweb.client.1529047715824'), {// 此操作将删除此规则, 是否继续？', '提示
        confirmButtonText: this.$t('mxpcweb.login.1528696139283'), // 确定
        cancelButtonText: this.$t('mxpcweb.login.1528703242867'), // 取消
        type: 'warning'
      }).then(() => {
        _this.$http.post(this.Global.baseURL + this.Global.api.SystemSet.highseas.custLimitDelete, {
          'ruleId': item.ruleId
        }).then((res) => {
          if (res.body.code.toString() == _this.Global.RES_OK) {
            _this.$message.success(_this.msg(res.body))
            _this.getLists()
          } else {
            _this.$message.error(_this.msg(res.body))
          }
        }, (res) => {
          _this.$message.error(_this.$t(_this.Global.errorTitle))
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('mxpcweb.g.1528792342250')// 已取消删除
        })
      })
    },
    getLists () { // 获取最大客户保护规则列表
      let _this = this
      _this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.highseas.custLimitGet, {
        params: {
          'type': 'list'
        }
      }).then((res) => {
        if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
          _this.maxLimitRules = res.body.data
          _this.switchRole(_this.maxLimitRules)
          _this.loading = false
          _this.$emit('closeLoad')
        } else {
          _this.loading = false
          _this.$emit('closeLoad')
          _this.$message.error(_this.msg(res.body))
        }
      }, (res) => {
        _this.loading = false
        _this.$emit('closeLoad')
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    switchRole (list) { // 处理角色数据
      list.forEach(function (items) {
        items.applyRoles = items.applyRoles.split(',')
        if (items.useFlag == 1) {
          items.useFlagModel = true
        } else {
          items.useFlagModel = false
        };
      })
    },
    getControl () { // 获取$条件筛选
      let _this = this
      _this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.highseas.custLimitGet, {
        params: {
          'type': 'control'
        }
      }).then((res) => {
        if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
          res.body.data.forEach(function (list) {
            if (list.dictCode == 8) {
              list.ruleType = '3'
            } else if (list.dictCode == 9) {
              list.ruleType = '2'
            }
            list.dictItems.forEach(function (item) {
              item.limitNum = ''
            })
            _this.selectList.push(list)
          })
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, (res) => {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    returnRoleName (roleId) { // 返回角色名称
      let _this = this
      let roleName = ''
      _this.roleOptionLists.forEach(function (element) {
        if (element.roleId == roleId) {
          roleName = element.roleName
          return false
        }
      })
      return roleName
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
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, (res) => {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    clearForm () { // 清除表单数据
      this.maxLimit.maxLimitForm = {
        applyRoles: [], // 适用角色（角色Id,数组）
        enable: true, // 是否启用
        customerState: true, // 是否仅未成交客户（0：否、1：是）
        ruleType: '1', // 限制类型（1：总数量限制/2:客户等级限制/3：客户来源限制）
        totalLimit: 0, // 总数量限制数（当限制类型为1时起效）
        fieldLimit: [
        ]
      }
      this.selectList.forEach(function (list) {
        list.dictItems.forEach(function (item) {
          item.limitNum = '0'
        })
      })
      if (this.firstInto) {
        this.firstInto = false
      }
    }
  },
  components: {
    'cust-dialog': custDialog,
    'no-data': NoData
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
    @import "./zh-cn.less";
    @import "./en.less";
</style>
