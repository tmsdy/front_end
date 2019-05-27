<template>
  <div class="bizDict MXscroll">
    <loading v-if="ruleForm.modules.length == []"></loading>
    <el-form v-else :model="ruleForm" ref="ruleForm">
      <div class="descript">
        <!-- 设置角色对基础数据操作的权限 -->{{$t('mxpcweb.systemset.rolemanag.1530596058348')}}</div>
      <table class="table">
        <caption></caption>
        <tbody>
          <div v-for="(item,index) in ruleForm.modules" :key="index">
            <tr>
              <td :colspan="index">
                <span class="name">{{item.moduleName}}</span>
              </td>
            </tr>
            <tr>
              <!--<td width="80" style="color:#555;">{{item.moduleName}}</td>-->
              <td>
                <el-checkbox-group class="checkbox_item" v-model="item.functions.value">
                  <span v-for="(item,index) in item.functions.text" :key="index">
                    <el-checkbox :label="item" name="type"></el-checkbox>
                  </span>
                </el-checkbox-group>
              </td>
            </tr>

          </div>

        </tbody>
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
  name: 'bizDict',
  props: {
    thisRoleId: {
      type: Number
    }
  },
  data() {
    return {
      roleId: '',
      tabCode: 'T02',
      ruleForm: {
        modules: []
      }
    }
  },
  created() { },
  mounted() {
    this.getData(this.thisRoleId)

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
    // 获取功能数据
    getData(roleId) {
      let _this = this
      // _this.ruleForm.modules = '';    //先清空数据，再加载
      _this.roleId = roleId
      var p1 = new Promise((resolve, reject) => {
        _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.rolemanag.permissionsGet, { params: { type: 'item', tabCode: _this.tabCode } }).then(function (res) {
          if (res.body.code.toString() == _this.Global.RES_OK) {
            resolve(res.body.data)
          } else {
            _this.$message.error(_this.msg(res.body))
          }
        }, function (res) {
          _this.$message.error(_this.$t(_this.Global.errorTitle))
        })
      })
      var p2 = new Promise((resolve, reject) => {
        _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.rolemanag.permissionsGet, { params: { roleId: roleId, type: 'right', tabCode: _this.tabCode } }).then(function (res) {
          if (res.body.code.toString() == _this.Global.RES_OK) {
            resolve(res.body.data)
          } else {
            _this.$message.error(_this.msg(res.body))
          }
        }, function (res) {
          _this.$message.error(_this.$t(_this.Global.errorTitle))
        })
      })
      Promise.all([p1, p2]).then(function (results) {
        // console.log(" ++++++++++++ ")
        // console.log(results)
        /**
                 * 数组的每项和项值 先合并，再分解成所需
                */
        if (!isArray(results[0]) || !isArray(results[1])) {
          return
        }
        // 两数组合并
        let p1Res = results[0]
        let p2Res = results[1]
        p1Res.forEach((item1) => {
          p2Res.forEach((item2) => {
            if (item1.funCode == item2.funCode) {
              Object.assign(item1, item2)
            }
          })
        })

        // 合并相同项: (moduleName)
        let arrModule = []
        p1Res.forEach(function (item) {
          if (arrModule.indexOf(item.moduleName) == -1) {
            arrModule.push(item.moduleName)
          }
        })
        // console.log(p1Res)

        // 新组合成渲染所需数组
        let arrNewModule = []
        arrModule.forEach(function (item1) {
          let arrFunc = {
            text: [],
            value: [],
            valueAll: []
          }
          p1Res.forEach(function (item2) {
            if (item2.moduleName == item1) {
              arrFunc.text.push(item2.funName)
              item2.rightValue == '1' && arrFunc.value.push(item2.funName)
              arrFunc.valueAll.push({
                text: item2.funName,
                funCode: item2.funCode,
                rightValue: '1'
              })
            }
          })
          arrNewModule.push({
            moduleName: item1,
            functions: arrFunc
          })
        })
        _this.ruleForm.modules = arrNewModule
        // console.log(arrNewModule)
      }).catch(function (error) {
        console.log(error)
      })
    },
    // 提交
    submit() {
      let _this = this
      let arrNew_codeValue = []
      _this.ruleForm.modules.forEach((item1) => {
        item1.functions.valueAll.forEach((item3) => {
          let objItem = {
            funCode: item3.funCode,
            rightValue: 0,
            text: item3.text
          }
          item1.functions.value.forEach((item2) => {
            if (item3.text == item2) {
              objItem.rightValue = 1
            }
          })
          arrNew_codeValue.push(objItem)
        })
      })
      let data = {
        codeValue: arrNew_codeValue,
        roleId: _this.roleId,
        tabCode: _this.tabCode
      }
      // console.log(arrNew_codeValue)
      // console.log(arrNew_codeValue)

      _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.rolemanag.permissionsPut, data).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK) {
          /* 保存成功 */
          _this.$message({ message: this.$t('mxpcweb.systemset.rolemanag.1530596143028'), type: 'success' })
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    }
  },
  watch: {
    thisRoleId(curVal, oldVal) {
      this.getData(curVal)
    }
  },
  components: {
    'loading': Loading
  }
}
</script>
