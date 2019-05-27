<template>
  <div class="functionPower MXscroll">
    <loading v-if="!ruleForm.apps.length > 0"></loading>
    <el-form v-if="ruleForm.apps.length > 0" :model="ruleForm" ref="ruleForm">

      <div>
        <!-- 设置角色应用的功能类权限，系统设置权限等 -->{{$t('mxpcweb.systemset.rolemanag.1530597279330')}}</div>
      <el-checkbox v-model="ruleForm.admin.valueChecked" @change="adminChange" :disabled='isSysDefine' style="margin:10px 0; color:#555;">{{ruleForm.admin.name}}</el-checkbox>
      <span>
        <!-- （具备最大权限） -->{{$t('mxpcweb.systemset.rolemanag.1530597306981')}}</span>

      <table class="table">
        <div v-for="(item,index) in ruleForm.apps" :key="'a'+index">
          <tr>
            <td :colspan="index">
              <span class="name">{{item.appName}}</span>
            </td>
          </tr>
          <tr>
            <td>
              <el-checkbox-group class="checkbox_item" v-model="item.functions.valueChecked" @change="itemCheckboxChange">
                <span v-for="(item,index) in item.functions.labels" :key="'b'+index" :class="[itemDisabled ? 'disabled' : '']">
                  <el-checkbox :label="item" name="type" :disabled="itemDisabled"></el-checkbox>
                </span>
              </el-checkbox-group>
            </td>
          </tr>
        </div>
      </table>
      <el-button type="primary" @click="submit()">
        <!-- 保存设置 -->{{$t('mxpcweb.systemset.rolemanag.1530596084320')}}</el-button>

    </el-form>
  </div>
</template>

<script>
import Loading from '@/basecomponents/Loading/index'
import { isArray } from '@/libs/utils'
export default {
  name: 'functionPower',
  props: {
    thisRoleId: {
      type: Number
    },
    thisIsSysDefine: {
      type: Number
    }
  },
  data() {
    return {
      tabCode: 'T01',
      itemDisabled: false, // 全选了，说明为系统角色
      isSysDefine: false, // 判断是不是系统角色
      ruleForm: {
        admin: {
          /* 管理员角色 */
          name: this.$t('mxpcweb.systemset.rolemanag.1530597334290'),
          valueChecked: false,
          funCode: ''
        },
        apps: []
      }
      // ruleFormBak: {}
    }
  },
  created() {

  },
  mounted() {
    this.getData(this.thisRoleId, this.thisIsSysDefine)
    setTimeout(() => {
        this.getWinHeight()
    }, 200)
    $(window).resize(() => {
        this.getWinHeight()
    })
  },
  methods: {
    getWinHeight() {
        let height = document.documentElement.clientHeight - 230
        this.$el.style.height = `${height}px`
    },
    // 管理员角色change，功能则全选
    adminChange(event) {
      let _this = this
      _this.ruleForm.apps.forEach(function (item) {
        item.functions.valueChecked = event.target.checked ? item.functions.labels : []// 全选
        _this.itemDisabled = !!event.target.checked// 禁用
      })
    },
    // 系统管理下的每项
    itemCheckboxChange(value) {
      let _this = this
      // console.log(_this.ruleForm.apps);
      let numTotal = 0
      let numChecked = 0
      _this.ruleForm.apps.forEach(function (item) {
        numTotal += item.functions.labels.length
        numChecked += item.functions.valueChecked.length
      })
      // console.log(numTotal);
      // console.log(numChecked);

      if (numChecked === numTotal) {
        _this.ruleForm.admin.valueChecked = true// 选中
        _this.itemDisabled = true// 禁用
      } else {
        _this.ruleForm.admin.valueChecked = false
      }
    },
    // 获取功能数据
    getData(roleId, isSysDefine) {
      let _this = this
      // _this.ruleForm.apps = '';    //先清空数据，再加载
      _this.roleId = roleId // 更新角色ID
      _this.isSysDefine = isSysDefine == 1 // 系统角色，则disabled
      _this.itemDisabled = isSysDefine == 1 // 系统角色，则disabled
      var p1 = new Promise((resolve, reject) => {
        _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.rolemanag.permissionsGet, { params: { type: 'item', tabCode: _this.tabCode } }).then(function (res) {
          if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
            resolve(res.body.data)
          } else {
            _this.$message.error(_this.msg(res.body))
          }
        }, function (res) {
          _this.$message.error(_this.$t(_this.Global.errorTitle))
        })
      })
      var p2 = new Promise((resolve, reject) => {
        _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.rolemanag.permissionsGet, { params: { roleId: _this.roleId, type: 'right', tabCode: _this.tabCode } }).then(function (res) {
          if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
            resolve(res.body.data)
          } else {
            _this.$message.error(_this.msg(res.body))
          }
        }, function (res) {
          _this.$message.error(_this.$t(_this.Global.errorTitle))
        })
      })
      Promise.all([p1, p2]).then(function (results) {
        if (!isArray(results[0]) || !isArray(results[1])) {
          return
        }
        /**
                * 数组的每项和项值 先合并，再分解成所需
                */
        // 两数组合并
        let arrAllData = results[0]
        arrAllData.forEach((item1) => {
          results[1].forEach((item2) => {
            if (item1.funCode == item2.funCode) {
              Object.assign(item1, item2)
            }
          })
        })

        // 再过滤掉管理员特殊项
        let arrAllNoAdmin = arrAllData.filter(function (item) {
          return (item.funCode != 'S00001')
        })

        // 循环，取得相同appName的新array
        let arrNewAppName = []
        arrAllNoAdmin.forEach(function (item) {
          if (arrNewAppName.indexOf(item.appName) == -1) {
            arrNewAppName.push(item.appName)
          }
        })

        // 再循环新数组和原数组，取得相同 appCode 下的 funCode 组成新数组
        let arrForRuleForm = []
        arrNewAppName.forEach(function (item) {
          let arrFormFun = {
            labels: [],
            valueChecked: [],
            valueAll: []
          }
          arrAllNoAdmin.forEach(function (item2) {
            if (item2.appName == item) {
              arrFormFun.labels.push(item2.funName)
              item2.rightValue == '1' && arrFormFun.valueChecked.push(item2.funName)
              arrFormFun.valueAll.push({
                label: item2.funName,
                funCode: item2.funCode,
                rightValue: '1'// 判断，与开启相同
              })
            }
          })
          arrForRuleForm.push({
            appName: item,
            functions: arrFormFun
          })
        })
        _this.ruleForm.apps = arrForRuleForm
        // console.log(arrForRuleForm);

        /**
                 * 管理员角色单独判断
                 * 过滤出管理员
                 **/
        let dataAdmin = arrAllData.filter(function (item) {
          // return (item.appCode == '')
          return (item.funCode == 'S00001')
        })

        _this.ruleForm.admin.name = dataAdmin[0].funName
        _this.ruleForm.admin.valueChecked = !(dataAdmin[0].rightValue == undefined || dataAdmin[0].rightValue == 0)// 判断是否选中
        _this.ruleForm.admin.funCode = dataAdmin[0].funCode
      })
    },
    // 提交
    submit() {
      let _this = this
      let arrNewCode = []
      _this.ruleForm.apps.forEach((item1) => {
        item1.functions.valueAll.forEach((item3) => {
          let objItem = {
            funCode: item3.funCode,
            label: item3.label,
            rightValue: 0
          }
          item1.functions.valueChecked.forEach((item2) => {
            if (item3.label == item2) {
              objItem.rightValue = 1
            }
          })
          arrNewCode.push(objItem)
        })
      })
      let data = {
        codeValue: arrNewCode,
        roleId: _this.roleId,
        tabCode: _this.tabCode
      }
      // console.log(_this.ruleForm.apps);
      // console.log(arrNewCode);

      // 管理员选中与否合并，这单独处理
      data.codeValue.push({
        funCode: _this.ruleForm.admin.funCode,
        rightValue: _this.ruleForm.admin.valueChecked ? '1' : '0'
      })
      // console.log(_this.ruleForm.admin.valueChecked);
      // console.log(data);

      _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.rolemanag.permissionsPut, data).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK) {
          /* 设置成功 */
          _this.$message.success(this.$t('mxpcweb.systemset.rolemanag.1530597386509'))
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    }
  },
  watch: {
    thisRoleId(curVal, oldVal) {
      this.getData(curVal, this.isSysDefine)
    },
    thisIsSysDefine(curVal, oldVal) {
      this.getData(this.thisRoleId, curVal)
    }
  },
  components: {
    'loading': Loading
  }
}
</script>
