<template>
  <div class="routine">
    <el-form class="formCheckbox">
      <div v-for="(item,index) in itemList" :key="index">
        <div v-if="(index!=itemList.length-2&&index!=itemList.length-1)">
          <el-checkbox v-model="item.completed">{{item.textShow}}</el-checkbox><br>
        </div>
        <div v-else-if="(index==itemList.length-2)">
          <el-checkbox v-model="item.completed">
            {{item.textShow}}

            <el-input size="small" :placeholder="请输入" style="width: 55px;" v-model="checkForm.value"></el-input> 分钟
          </el-checkbox><br>
        </div>
      </div>
    </el-form>
    <!-- 保存设置 -->
    <el-button type="primary" style="margin-left:28px;" @click="fSaveRoutine()">{{$t('mxpcweb.systemset.mailset.setindex.1528979424189')}}</el-button>
  </div>
</template>

<script>
export default {
  name: 'routine',
  props: {
    arrylist: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    let _this = this
    return {
      checkForm: {
        checked: false,
        value: 30
      },
      itemList: [
        // { variable: "AfterLoggingIntoTheMailManagement", textShow: "登录后直接进入邮件管理", completed: false },
        // { variable: "CheckSetUpMailboxAccount", textShow: "进入邮件模块检查是否设置了邮箱账号", completed: false },
        // 移动邮件时显示更多操作选择确认窗口
        { variable: 'EmailsAcknowledgement', textShow: _this.$t('mxpcweb.systemset.mailset.setindex.1528980153243'), completed: false },
        // 开启诈骗邮件和钓鱼邮件智能检测
        { variable: 'OpenIntelligentDetection', textShow: _this.$t('mxpcweb.systemset.mailset.setindex.1528980151082'), completed: false }
        // { variable: "NewWindowViewAndEdit", textShow: "新窗口查看和编辑邮件", completed: false },
        // { variable: "AutomaticallyDelay", textShow: "每次发邮件时自动延时", completed: false },
        // { variable: "Timevalue", textShow: "30", completed: false }
      ]
    }
  },
  created () { },
  mounted () { },
  methods: {
    // 保存设置
    fSaveRoutine () {
      let _this = this
      let data = {
        mailOptionsList: [],
        sendCheckList: []
      }
      let checkedY = false
      _this.itemList.forEach((element, index) => {
        if (element.variable != 'Timevalue') {
          if (element.variable == 'AutomaticallyDelay' && element.completed) {
            checkedY = true
          }
          data.mailOptionsList.push({
            type: 0,
            variable: element.variable,
            value: element.completed ? '1' : '0'
          })
        } else if (checkedY) {
          data.mailOptionsList.push({
            type: 0,
            variable: element.variable,
            value: _this.checkForm.value
          })
        }
      })
      _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.mailset.setindex.updateOptions, data).then(
        function (res) {
          if (res.body.code.toString() == _this.Global.RES_OK) {
            _this.$message(this.$t('mxpcweb.systemset.mailset.setindex.1528979427238'))// 修改成功
          } else {
            _this.$message.error(_this.msg(res.body))
          }
        },
        function (res) {
          _this.$message.error(_this.$t(_this.Global.errorTitle))
        }
      )
    }
  },
  watch: {
    arrylist: {
      handler (curVal, oldvalue) {
        let _this = this
        if (curVal.length > 0) {
          curVal.forEach((element1, index1) => {
            _this.itemList.forEach((element2, index2) => {
              if (element1.variable == 'Timevalue') {
                _this.checkForm.value = element1.value
                _this.checkForm.checked = true
              } else
              if (element1.variable == element2.variable) {
                element2.completed = element1.value == '1'
              }
            })
          })
        }
      },
      deep: true
    }
  },
  components: {}
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.routine {
  @import "./publicLess/formCheckbox.less";
}
</style>
