<template>
    <div class="seasList" v-loading="loading">
        <div class="operation">
            {{$t('mxpcweb.systemset.highseas.1528791752939')}}
            <!-- 添加规则 -->
            <el-button class="operationBut" type="primary" @click="addClick()" size="small">{{$t('mxpcweb.mail.1528883319872')}}</el-button>
        </div>
        <no-data v-show="!loading" v-if="highSeasRules.length==0"></no-data>
        <el-row v-else :gutter="20" class="list listTit">
            <el-col :span="4">
                <!-- 规则名称 -->
                 {{$t('mxpcweb.systemset.highseas.1528796511223')}}
            </el-col>
            <el-col :span="10">
                <!-- 适用角色 -->
                {{$t('mxpcweb.systemset.highseas.1529024977541')}}
            </el-col>

            <el-col :span="6">
                <!-- 自动放入规则 -->
                {{$t('mxpcweb.systemset.highseas.1529025039985')}}
            </el-col>
            <el-col :span="4" style="text-align:center">
                <!-- 启用 -->
                {{$t('mxpcweb.systemset.highseas.1529025082189')}}
            </el-col>
        </el-row>
        <el-row :gutter="20" v-for="(item,index) in highSeasRules" :key="index" class="list list1">
            <el-col :span="4">
                {{item.ruleName}}
            </el-col>
            <el-col :span="10" class="ellipsis">
                <el-popover trigger="hover"  placement="bottom">
                  <span v-for="(items,indexs) in item.applyRoles" :key="indexs">{{returnRoleName(items)}}&nbsp;&nbsp;</span>
                  <div slot="reference">
                    <span v-for="(items,indexs) in item.applyRoles" :key="indexs">{{returnRoleName(items)}}&nbsp;&nbsp;</span>
                  </div>
                </el-popover>
            </el-col>

            <el-col :span="6">
                <el-popover trigger="hover" placement="top">
                    <p style="width:236px;font-size:12px;">
                        <span v-for="(list,index1) in item.seasInRulesList" :key="index1">
                            <!-- 未跟进 -->
                            <span v-if="list.limitType==1" style="color: RGBA(208, 2, 27, 1);">{{$t('mxpcweb.systemset.highseas.1529025269744')}}</span>
                            <!-- 未成交 -->
                            <span v-if="list.limitType==2" style="color: RGBA(208, 2, 27, 1);">{{$t('mxpcweb.systemset.highseas.1529399298680')}}</span>
                            <!-- 超过 -->
                            <span>{{$t('mxpcweb.systemset.highseas.1529025317839')}}</span>
                            <span  style="color: RGBA(208, 2, 27, 1);">{{ list.limitDays }}</span>
                            <!-- 天的 -->
                            <span>{{$t('mxpcweb.systemset.highseas.1529024696899')}}</span>
                            <!-- 未成交客户 -->
                            <span v-if="list.custScope==1"  style="color: RGBA(208, 2, 27, 1);">{{$t('mxpcweb.systemset.highseas.1529025462254')}}</span>
                            <!-- 成交客户 -->
                            <span v-if="list.custScope==2"  style="color: RGBA(208, 2, 27, 1);">{{$t('mxpcweb.systemset.highseas.1529025403094')}}</span>
                            <!-- 所有客户 -->
                            <span v-if="list.custScope==3"  style="color: RGBA(208, 2, 27, 1);">{{$t('mxpcweb.systemset.highseas.1529399337494')}}</span>
                            <span v-for="(items,indexs) in list.fieldWhere" :key="indexs">
                                <!-- 并且 -->
                                <span>{{$t('mxpcweb.systemset.highseas.1529025504790')}}</span>
                                <span  style="color: RGBA(208, 2, 27, 1);">{{ returnDictCode(items.dictCode) }}</span>
                                <!-- 为 -->
                                <span>{{$t('mxpcweb.systemset.highseas.1529025560326')}}</span>
                                <span style="color: RGBA(208, 2, 27, 1);">{{ returnDictItemCode(items.dictCode,items.dictItemCode) }}</span>
                            </span>
                            <br>
                        </span>
                    </p>
                    <div slot="reference" style="height:55px;" class="ellipsis">
                        <span v-for="(list,index1) in item.seasInRulesList" :key="index1">
                            <!-- 未跟进 -->
                            <span v-if="list.limitType==1" class="text-reds">{{$t('mxpcweb.systemset.highseas.1529025269744')}}</span>
                            <!-- 未成交 -->
                            <span v-if="list.limitType==2" class="text-reds">{{$t('mxpcweb.systemset.highseas.1529399298680')}}</span>
                            <!-- 超过 -->
                            <span>{{$t('mxpcweb.systemset.highseas.1529025317839')}}</span>
                            <span class="text-reds">{{ list.limitDays }}</span>
                            <!-- 天的 -->
                            <span>{{$t('mxpcweb.systemset.highseas.1529024696899')}}</span>
                            <!-- 未成交客户 -->
                            <span v-if="list.custScope==1" class="text-reds">{{$t('mxpcweb.systemset.highseas.1529025462254')}}</span>
                            <!-- 成交客户 -->
                            <span v-if="list.custScope==2" class="text-reds">{{$t('mxpcweb.systemset.highseas.1529025403094')}}</span>
                            <!-- 所有客户 -->
                            <span v-if="list.custScope==3" class="text-reds">{{$t('mxpcweb.systemset.highseas.1529399337494')}}</span>
                            <span v-for="(items,indexs) in list.fieldWhere" :key="indexs">
                                <!-- 并且 -->
                                <span>{{$t('mxpcweb.systemset.highseas.1529025504790')}}</span>
                                <span class="text-reds">{{ returnDictCode(items.dictCode) }}</span>
                                <!-- 为 -->
                                <span>{{$t('mxpcweb.systemset.highseas.1529025560326')}}</span>
                                <span class="text-reds">{{ returnDictItemCode(items.dictCode,items.dictItemCode) }}</span>
                            </span>
                            <br>
                        </span>
                    </div>
                </el-popover>
            </el-col>
            <el-col :span="4" style="text-align:center">
                <div class="useFlagModel">
                    <el-checkbox :disabled="!item.useFlagModel" v-model="useFlagModel"></el-checkbox>
                </div>
                <div class="iconBox">
                    <span class="iBox" @click="editSeasRulesList(item)" :title="$t('mxpcweb.systemset.mailset.autographmanage.1528975040916')">
                        <i class="iconfont icon-edit-square"></i>
                    </span>
                    <span class="iBox" @click="delSeasRulesList(item)" :title="$t('mxpcweb.mail.1528702683911')">
                        <i class="iconfont icon-del"></i>
                    </span>
                </div>
            </el-col>
        </el-row>
        <!-- 弹窗，新建公海设置 -->
        <seas-dialog ref="seasAdd" :highSeasData="highSeasData" @getSeasRulesList="getSeasRulesList" @clearHighSeasForm="clearHighSeasForm"></seas-dialog>
    </div>
</template>
<script>
import { isArray } from '@/libs/utils.js'
import seasDialog from './Vue/seasDialog.vue'
import NoData from '@/basecomponents/NoData/index'
export default {
  name: 'seasList',
  props: {
  },
  data () {
    return {
      highSeasRules: [], // 公海规则列表
      loading: true,
      useFlagModel: true,
      highSeasData: { // 新增和修改弹窗开关
        seasPopup: false,
        addOrEdit: 'add', // 弹出弹窗时判断是添加还是修改
        highSeasForm: {
          type: 'seasRules', // 规则类别
          ruleName: '', // 规则名称
          applyRoles: [], // 适用角色（角色Id,逗号隔开）
          useFlag: 1, // 是否启用
          useFlagModel: true,
          limitRules: [], // 自动放入规则(自动放入规则id,逗号隔开)
          exectime: '', // 每天执行时间
          exectimed: new Date(2016, 9, 10, 12, 0),
          reminderDays: '7', // 提前提醒天数
          reminderTime: '', // 每天提醒时间
          reminderTimed: new Date(2016, 9, 10, 12, 0)
        },
        selectList: [] // 自动放入规则条件筛选数据
      },
      firstInto: true,
      roleOptionLists: []
    }
  },
  created () {
    this.getSeasRulesList()
    this.getSelectList()
    this.getRoles()
  },
  methods: {
    addClick () { // 调起弹窗时清除上次数据
      let _this = this
      _this.highSeasData.seasPopup = true
      _this.highSeasData.addOrEdit = 'add'
      _this.clearHighSeasForm()
    },
    getSeasRulesList () { // 获取公海规则列表
      let _this = this
      _this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.highseas.seasSettingSeasGet, {
        params: {
          type: 'list'
        }
      }).then((res) => {
        if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
          _this.highSeasRules = res.body.data
          _this.switchRole(_this.highSeasRules)
          _this.loading = false
          _this.$emit('closeLoad')
        } else {
          _this.$message.error(_this.msg(res.body))
          _this.loading = false
          _this.$emit('closeLoad')
        }
      }, (res) => {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
        _this.loading = false
        _this.$emit('closeLoad')
      })
    },
    returnDictCode (thisDictCode) { // 返回字段名字
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
    getSelectList () { // 获取下拉菜单列表
      let _this = this
      _this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.highseas.seasSettingSeasGet, {
        params: {
          type: 'control'
        }
      }).then((res) => {
        if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
          _this.highSeasData.selectList = res.body.data
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, (res) => {
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
        items.seasInRulesList.forEach(function (listItem) {
          listItem.fieldWhere = JSON.parse(listItem.fieldWhere)
        })
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
    editSeasRulesList (item) { // 编辑公海规则列表
      let _this = this
      _this.highSeasData.addOrEdit = 'edit' // 弹窗判断条件改为--修改
      if (item.useFlag == 1) {
        item.useFlagModel = true
      } else {
        item.useFlagModel = false
      };
      let limitRules = []
      item.seasInRulesList.forEach(function (list) {
        limitRules.push(list)
      })
      let {applyRoles, useFlagModel, ruleId, ruleName } = item
      _this.highSeasData.highSeasForm = {
        applyRoles: applyRoles, // 适用角色（角色Id,数组）
        useFlagModel: useFlagModel, // 是否启用
        limitRules: limitRules,
        ruleId: ruleId,
        ruleName: ruleName
      }
      // console.log(_this.highSeasData.highSeasForm);
      _this.highSeasData.seasPopup = true
    },
    delSeasRulesList (item) { // 删除公海规则列表
      let _this = this
      // '此操作将删除规则：' + ruleName + ', 是否继续？'
      this.$confirm(this.$t('mxpcweb.systemset.highseas.1528797270099', {ruleName: item.ruleName}), '提示', {// 提示
        // 确定
        confirmButtonText: this.$t('mxpcweb.login.1528696139283'),
        // 取消
        cancelButtonText: this.$t('mxpcweb.login.1528703242867'),
        type: 'warning'
      }).then(() => {
        _this.$http.post(this.Global.baseURL + this.Global.api.SystemSet.highseas.seasSettingSeasDelete, {
          'type': 'seasRules',
          'ruleId': item.ruleId
        }).then((res) => {
          if (res.body.code.toString() == _this.Global.RES_OK) {
            _this.$message.success(_this.msg(res.body))
            _this.getSeasRulesList()
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

    clearHighSeasForm () {
      let _this = this
      _this.highSeasData.highSeasForm = {
        type: 'seasRules', // 规则类别
        ruleName: '', // 规则名称
        applyRoles: [], // 适用角色（角色Id,逗号隔开）
        limitRules: '', // 自动放入规则(自动放入规则id,逗号隔开)
        useFlagModel: true, // 是否启用
        useFlag: 1,
        limitRules: [
        ],
        exectime: '', // 每天执行时间
        exectimed: new Date(2016, 9, 10, 12, 0),
        reminderDays: '7', // 提前提醒天数
        reminderTime: '',
        reminderTimed: new Date(2016, 9, 10, 18, 0)// 每天提醒时间
      }
      if (_this.firstInto) {
        _this.firstInto = false
      } else {
        _this.$refs.seasAdd.clearData()
      }
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
    }
  },
  components: {
    'seas-dialog': seasDialog,
    'no-data': NoData
  },
  beforeDestroy: function () {
    this.highSeasData.highSeasForm.exectimed = null
    this.highSeasData.highSeasForm.reminderTimed = null
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
    @import "./zh-cn.less";
    @import "./en.less";
</style>
