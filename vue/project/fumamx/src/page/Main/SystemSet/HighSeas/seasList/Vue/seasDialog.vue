
<template>
    <div class="seasDialog">
        <!-- 弹窗，公海设置 -->
        <!-- 公海规则 -->
        <el-dialog :title="$t('mxpcweb.systemset.highseas.1528791752939')" v-dialogDrag :visible.sync="highSeasData.seasPopup" :modal-append-to-body="false" custom-class="widthDefault" v-loading="loading">
            <el-form v-if="highSeasData.seasPopup" :model="highSeasData.highSeasForm" ref="formName" :rules="rules" label-width="110px" label-position="left" >
                <!-- 规则名称 -->
                <el-form-item :label="$t('mxpcweb.systemset.highseas.1528796511223')" prop="ruleName">
                    <!-- 请填写公海规则名称 -->
                    <el-input v-model="highSeasData.highSeasForm.ruleName" :placeholder="$t('mxpcweb.systemset.highseas.1528798038690')" style="width:410px;"></el-input>
                </el-form-item>
                <!-- 适用角色 -->
                <el-form-item :label="$t('mxpcweb.systemset.highseas.1529024977541')" prop="applyRoles">
                    <!-- 请输入人员关键词 -->
                    <el-select v-model="highSeasData.highSeasForm.applyRoles" multiple filterable remote :placeholder="$t('mxpcweb.systemset.highseas.1529025812271')" :remote-method="roleRemoteMethod" :loading="roleLoading" style="width:410px;">
                        <el-option v-for="item in roleOptionLists" :key="item.id" :label="item.roleName" :value="item.roleId+''"> </el-option>
                    </el-select>
                </el-form-item>
                <!-- 是否启用 -->
                <el-form-item :label="$t('mxpcweb.systemset.highseas.1529025745541')" prop="useFlagModel">
                    <el-switch on-text="" off-text="" v-model="highSeasData.highSeasForm.useFlagModel"></el-switch>
                </el-form-item>
                <!-- 自动放入规则 -->
                <el-form-item :label="$t('mxpcweb.systemset.highseas.1529025039985')" prop="limitRules" style="margin-bottom:0;">
                    <div>
                        <ul v-if="highSeasData.highSeasForm.limitRules.length!=0" class="popupRulesList MXscroll">
                            <li class="list" v-for="(list,index) in highSeasData.highSeasForm.limitRules" :key="index">
                                <span class="pull-right">
                                    <!-- 删除 -->
                                    <i class="iconfont icon-close text-hover"  @click="deleteLimitRules(index)"></i>
                                </span>
                                <span class="italicBlue">
                                    <!-- 未跟进 -->
                                    <span v-if="list.limitType==1">{{$t('mxpcweb.systemset.highseas.1529025269744')}}</span>
                                    <!-- 未成交 -->
                                    <span v-if="list.limitType==2">{{$t('mxpcweb.systemset.highseas.1529399298680')}}</span>

                                </span>
                                <!-- 超过 -->
                                {{$t('mxpcweb.systemset.highseas.1529025317839')}}
                                <span class="italicBlue">{{list.limitDays}}</span>
                                <!-- 天的 -->
                                {{$t('mxpcweb.systemset.highseas.1529024696899')}}
                                <span class="italicBlue">
                                    <!-- 未成交客户 -->
                                    <span v-if="list.custScope==1">{{$t('mxpcweb.systemset.highseas.1529025462254')}}</span>
                                    <!-- 成交客户 -->
                                    <span v-if="list.custScope==2">{{$t('mxpcweb.systemset.highseas.1529025403094')}}</span>
                                    <!-- 所有客户 -->
                                    <span v-if="list.custScope==3">{{$t('mxpcweb.systemset.highseas.1529399337494')}}</span>
                                </span>
                                <span style="margin-right:4px;" v-for="(item,index) in list.fieldWhere" :key="index">
                                    <!-- 并且 -->
                                    <span class="selectModelPad">{{$t('mxpcweb.systemset.highseas.1529025504790')}}</span>
                                    <span class="italicBlue">{{returnDictCode(item.dictCode)}}</span>
                                    <!-- 为 -->
                                    {{$t('mxpcweb.systemset.highseas.1529025560326')}}
                                    <span class="italicBlue">{{returnDictItemCode(item.dictCode,item.dictItemCode)}}</span>
                                </span>
                            </li>
                        </ul>

                        <ul v-if="highSeasData.highSeasForm.limitRules.length==0" class="popupRulesList">
                            <!-- 暂时未设置任何规则 -->
                            <div class="popupListTip">{{$t('mxpcweb.systemset.highseas.1528798239694')}}</div>
                        </ul>

                    </div>
                </el-form-item>
                <div class="popupRuleAdd" v-show="!ruleAddwhether" style="margin-bottom:15px;">
                    <!-- 请选择 -->
                    <el-select v-model="popupRuleAddForm.limitType" :placeholder="$t('mxpcweb.login.1528702888027')" size="small" style="width:115px;">
                        <!-- 未跟进 -->
                        <el-option :label="$t('mxpcweb.systemset.highseas.1529025269744')" value="1"></el-option>
                        <!-- 未成交 -->
                        <el-option :label="$t('mxpcweb.systemset.highseas.1529399298680')" value="2"></el-option>
                    </el-select>
                    <!-- 超过 -->
                    <span class="selectModelPad">{{$t('mxpcweb.systemset.highseas.1529025317839')}}</span>
                    <el-input-number v-model="popupRuleAddForm.limitDays" :min="0" size="small" style="line-height:20px;width:115px;"></el-input-number>
                    <!-- 天的 -->
                    <span class="selectModelPad">{{$t('mxpcweb.systemset.highseas.1529024696899')}}</span>
                    <!-- 请选择 -->
                    <el-select v-model="popupRuleAddForm.custScope" :placeholder="$t('mxpcweb.login.1528702888027')" size="small" style="width:115px;">
                        <!-- 未成交客户 -->
                        <el-option :label="$t('mxpcweb.systemset.highseas.1529025462254')" value="1"></el-option>
                        <!-- 成交客户 -->
                        <el-option :label="$t('mxpcweb.systemset.highseas.1529025403094')" value="2"></el-option>
                        <!-- 所有客户 -->
                        <el-option :label="$t('mxpcweb.systemset.highseas.1529399337494')" value="3"></el-option>
                    </el-select>
                    <li v-for="(items,indexs) in selectModel" :key="indexs"  style="margin-top:10px;">
                        <!-- 并且 -->
                        <span class="selectModelPad">{{$t('mxpcweb.systemset.highseas.1529025504790')}}</span>
                        <!-- 请选择 -->
                        <el-select v-model="items.selectModel1" :placeholder="$t('mxpcweb.login.1528702888027')" size="small" style="width:115px;" @change="nextList(indexs)">
                            <el-option v-for="(item,index) in highSeasData.selectList" :label="item.dictName" :value="index" :key="index"></el-option>
                        </el-select>
                        <!-- 为 -->
                        <span class="selectModelPad" v-if="(items.selectModel1!=='')">{{$t('mxpcweb.systemset.highseas.1529025560326')}}</span>
                        <!-- 请选择 -->
                        <el-select v-if="(items.selectModel1!=='')" v-model="items.selectModel2" :placeholder="$t('mxpcweb.login.1528702888027')" size="small" style="width:115px;" @change="nextList(indexs,true)">
                            <el-option v-for="(item,index) in highSeasData.selectList[items.selectModel1].dictItems" :label="item.itemName" :value="item.dictItemCode" :key="index"></el-option>
                        </el-select>
                    </li>
                    <div class="pull-bottom" style="margin-top:15px;">
                        <!-- 添加 -->
                        <el-button size="mini" style="width:48px;height: 28px;" type="primary" @click="addPopup()" >{{$t('mxpcweb.systemset.mailset.setindex.1528980783777')}}</el-button>
                        <!-- 取消 -->
                        <el-button size="mini" style="width:48px;height: 28px;" @click="cancelPopup()">{{$t('mxpcweb.login.1528703242867')}}</el-button>
                    </div>
                </div>

                <div class="popupRuleAdd" v-show="ruleAddwhether">
                    <!-- 添加规则 -->
                    <el-button size="small" type="primary" @click="ruleAddwhether=false">{{$t('mxpcweb.mail.1528883319872')}}</el-button>
                </div>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <!-- 取 消 -->
                <el-button @click="highSeasData.seasPopup = false;">{{$t('mxpcweb.login.1528703242867')}}</el-button>
                <!-- 确 定 -->
                <el-button type="primary"  @click="addSubmit(highSeasData.highSeasForm)"  :loading="subLoading">{{$t('mxpcweb.login.1528696139283')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { isArray } from '@/libs/utils.js'
export default {
  name: 'seasDialog',
  props: {
    highSeasData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      popupRuleAddForm: {
        limitType: '', // 规则类别
        limitDays: '7', // 限制天数
        custScope: '', // 客户范围（1：未成交客户；2：成交客户；3：所有客户；）
        fieldWhere: [] // 字段条件
      },
      subLoading: false,
      rules: {
        ruleName: [
          // 请输入公海规则名称
          { required: true, message: this.$t('mxpcweb.systemset.highseas.1528798529547'), trigger: 'blur' }
        ],
        useFlagModel: [
          { required: true }
        ],
        applyRoles: [
          // 请选择适用角色
          { type: 'array', required: true, message: this.$t('mxpcweb.systemset.highseas.1528794319134'), trigger: 'change' }
        ],
        limitRules: [
          // 请至少设置一条规则
          { type: 'array', required: true, message: this.$t('mxpcweb.systemset.highseas.1528799555012'), trigger: 'change' }
        ]
        // reminderDays: [
        //     { required: true, }
        // ],
      },
      selectModel: [{ // 下拉框绑定数据
        selectModel1: '',
        selectModel2: ''
      }],
      addUrl: this.Global.api.SystemSet.highseas.seasSettingSeasAdd, // 添加规则接口路径
      editUrl: this.Global.api.SystemSet.highseas.seasSettingSeasPut, // 修改规则接口路径
      loading: true,
      roleLoading: false,
      roleList: [],
      ruleAddwhether: true, // 添加规则开关
      roleOptionLists: []// 适用角色列表
    }
  },
  created () {
    this.getRoles()
  },
  mounted () {

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
    addSubmit (argument) { // 确认提交表单
      let _this = this
      let next = true
      this.$refs['formName'].validate((valid) => {
        if (!valid) {
          next = false
        }
      })
      if (!next) {
        return false
      };
      this.subLoading = true
      let formList = argument
      if (formList.useFlagModel) {
        formList.useFlag = '1'
      } else {
        formList.useFlag = '0'
      }
      let applyRoles = []
      formList.applyRoles.forEach(function (item) {
        applyRoles.push(item)
      })
      let thisUrl, thisArgument
      // console.log(formList.limitRules);
      thisArgument = { // 接口所需参数
        'type': 'seasRules',
        'ruleName': formList.ruleName,
        'useFlag': formList.useFlag.toString(),
        'applyRoles': applyRoles.toString(),
        'limitRules': formList.limitRules
      }

      if (_this.highSeasData.addOrEdit == 'add') { // 判断是添加还是修改,参数是否加入规则Id
        thisUrl = _this.addUrl
      } else {
        thisUrl = _this.editUrl
        thisArgument.ruleId = formList.ruleId
      };
      _this.$http.post(this.Global.baseURL + thisUrl, thisArgument).then((res) => {
        if (res.body.code.toString() == _this.Global.RES_OK) {
          _this.$message.success(_this.msg(res.body))
          _this.$emit('getSeasRulesList')
          _this.highSeasData.seasPopup = false
          _this.subLoading = false
          // _this.$emit('clearHighSeasForm');
          _this.clearData()
        } else {
          _this.subLoading = false
          _this.$message.error(_this.msg(res.body))
        }
      }, (res) => {
        _this.subLoading = false
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    clearData () {
      this.clearPopupRuleAddForm()
      // this.$refs["formName"].resetFields();
    },
    addPopup () { // 添加自动放入规则
      let _this = this
      if (_this.checkoutPopupForm()) {
        return false
      }
      let list = {
        'limitType': _this.popupRuleAddForm.limitType,
        'limitDays': _this.popupRuleAddForm.limitDays.toString(),
        'custScope': _this.popupRuleAddForm.custScope,
        'fieldWhere': _this.popupRuleAddForm.fieldWhere
      }
      _this.highSeasData.highSeasForm.limitRules.push(list)
      _this.clearPopupRuleAddForm()
    },
    cancelPopup () { // 取消自动放入规则
      let _this = this
      _this.ruleAddwhether = true
      _this.clearPopupRuleAddForm()
    },
    deleteLimitRules (index) { // 删除自动放入规则
      let _this = this
      _this.highSeasData.highSeasForm.limitRules.splice(index, 1)
    },
    returnDictCode (thisDictCode) { // 返回字典名称
      let _this = this
      let dictName = ''
      _this.highSeasData.selectList.forEach(function (element) {
        if (element.dictCode == thisDictCode) {
          dictName = element.dictName
          return false
        }
      })
      return dictName
    },
    returnDictItemCode (thisDictCode, thisDictItemCode) {
      let _this = this
      let dictItemName = ''
      _this.highSeasData.selectList.forEach(function (element) {
        if (element.dictCode == thisDictCode) {
          element.dictItems.forEach(function (val) {
            if (thisDictItemCode == val.dictItemCode) {
              dictItemName = val.itemName
              return false
            }
          })
          return false
        }
      })
      return dictItemName
    },
    switch (time) { // 转换时间
      let hh = time.getHours()
      let mm = time.getMinutes()
      if (mm < 10) {
        mm += '0'
      }
      return hh + ':' + mm
    },
    checkoutPopupForm () { // 校验提交数据
      let _this = this
      let checkout = false
      if (_this.popupRuleAddForm.limitType == '') {
        checkout = true
        // 规则类别未选中，请选中后再添加
        _this.$message(this.$t('mxpcweb.systemset.highseas.1528799591514'))
        return checkout
      }
      if (_this.popupRuleAddForm.custScope == '') {
        checkout = true
        // 客户范围未选中，请选中后再添加
        _this.$message(_this.$t('mxpcweb.systemset.highseas.1529645335637'))
        return checkout
      }
      _this.popupRuleAddForm.fieldWhere.forEach(function (val) {
        if (val.dictItemCode == '') {
          // 添加信息不完整，请补充完整后再添加
          _this.$message(_this.$t('mxpcweb.systemset.highseas.1528799646757'))
          checkout = true
        }
      })
      if (_this.popupRuleAddForm.fieldWhere[1]) {
        if (_this.popupRuleAddForm.fieldWhere[0].dictCode == _this.popupRuleAddForm.fieldWhere[1].dictCode) {
          // 条件不能重复，请重新选择后再添加
          _this.$message(_this.$t('mxpcweb.systemset.highseas.1529645644623'))
          _this.popupRuleAddForm.fieldWhere[1] = { dictCode: '', dictItemCode: '' }
          checkout = true
          return checkout
        };
      }

      return checkout
    },
    nextList (index, lastItem) { // 添加下一条自动放入规则
      let _this = this
      if (_this.selectModel[index] !== undefined && _this.selectModel[index].selectModel1 !== '' && index < 2) {
        _this.popupRuleAddForm.fieldWhere[index] = {
          'dictCode': _this.highSeasData.selectList[_this.selectModel[index].selectModel1].dictCode.toString(),
          'dictItemCode': _this.selectModel[index].selectModel2.toString()
        }
        if (index == (_this.selectModel.length - 1) && lastItem && index !== 1) {
          _this.selectModel.push({
            selectModel1: '',
            selectModel2: ''
          })
        }
      }
    },
    clearPopupRuleAddForm () { // 清除自动放入规则数据
      let _this = this
      _this.popupRuleAddForm = {
        limitType: '', // 规则类别
        limitDays: '7', // 限制天数
        custScope: '', // 客户范围（1：未成交客户；2：成交客户；3：所有客户；）
        fieldWhere: []
      }
      _this.selectModel = [{
        selectModel1: '',
        selectModel2: ''
      }]
      _this.ruleAddwhether = true
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
.seasDialog {
    .popupRulesList {
        border: 1px solid #eee;
        border-bottom: none;
        max-height: 159px;
        overflow: auto;
        padding: 11px;
        >li {
            min-height:32px;
            font-size: 12px;
            line-height:17px;
            background:rgba(255,255,255,1);
            box-shadow:0px 1px 4px 0px rgba(0,0,0,0.25);
            border-radius:3px;
            border-bottom: 1px solid #eee;
            padding: 7px 156px 7px 11px;
            position: relative;
            margin-bottom:10px;
            .selectModelPad{
                color: #c2c3c7;
            }
            .italicBlue {
                color: RGBA(208, 2, 27, 1);
            }
            .pull-right {
                position: absolute;
                right: 13px;
                top:7px;
                i{
                    font-size: 12px;
                    font-weight: bold;
                }
            }
        }
        >.popupListTip {
            margin-top: 40px;
            padding-left: 20px;
            color: grey;
        }
        >li:last-child {
            border-bottom: none;
        }
        >li:hover {
            background-color: #f9f9f9;
            cursor: default;
        }
    }
    .popupRuleAdd {
        background-color: #eee;
        border: 1px solid #eee;
        padding: 15px;
        margin-left:110px;
        .selectModelPad{
            padding:0 9px;
            display: inline-block;
            color: #c2c3c7;
        }
    }
    .dialog-footer{
        text-align: center;
    }
}
</style>
