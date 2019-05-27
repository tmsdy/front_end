<template>
    <div class="SecuritySet">
        <el-form :model="systemParameter" :inline="true" :label-position="labelPosition">
            <div class="input_title">
                <!-- 用户密码策略规则 -->{{$t('mxpcweb.systemset.systemparameter.1530350854754')}}
            </div>
            <div class="">
                <!-- 密码长度至少6位，需要同时含字母加数字 -->{{$t('mxpcweb.systemset.systemparameter.1530350870083')}}
            </div>
        </el-form>
        <el-form :inline="true">
            <div class="input_title">
                <!-- 全员重置密码 -->
                {{$t('mxpcweb.systemset.systemparameter.1530350915656')}}
            </div>
            <div class="" style="padding-bottom:12px;">
                <span>
                    <!-- 为了保证企业信息的安全,企业所有人员要求重置密码。启动后所有成员登陆系统后需要重置密码，同时也会收到邀请重置密码的短信或邮件。 -->{{$t('mxpcweb.systemset.systemparameter.1530350929977')}}
                </span>
            </div>
            <div class="">
                <el-button size="large" type="primary" @click="allResetPWD">
                    <!-- 立即要求全员重置密码 -->{{$t('mxpcweb.systemset.systemparameter.1530350960890')}}
                </el-button>
            </div>
        </el-form>
        <el-form :model="systemParameter" ref="SystemParameterWhiteList" :inline="true" :label-position="labelPosition">
            <div class="input_title">
                <!-- 企业登录IP白名单 -->{{$t('mxpcweb.systemset.systemparameter.1530351000665')}}
            </div>
            <div class="" style="margin:-10px 0 -15px">
                <el-form-item label="" prop="whiteListOpen">
                    <el-radio-group v-model="systemParameter.whiteListOpen">
                        <el-radio :label="0">
                            <!-- 不启用白名单 -->{{$t('mxpcweb.systemset.systemparameter.1530351013242')}}
                        </el-radio>
                        <el-radio :label="1">
                            <!-- 启用白名单（属于白名单的用户允许登陆） -->{{$t('mxpcweb.systemset.systemparameter.1530351025082')}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </div>
            <div v-if="systemParameter.whiteListOpen == 1">
                <div class="">
                  <white-list></white-list>
                </div>
                <div class="">
                    <!-- 不在白名单的IP登录限制 -->
                    <div>{{$t('mxpcweb.systemset.systemparameter.1530351121021')}}</div>
                    <el-form-item label="" prop="whiteListLimit" style="color:blue;">
                        <el-radio-group v-model="systemParameter.whiteListLimit">

                            <el-radio :label="1">
                                <!-- 禁止登陆 -->{{$t('mxpcweb.systemset.systemparameter.1530351157812')}}
                            </el-radio>
                            <el-radio :label="2">
                                <!-- 需要输入验证码（短信或邮件）方可登陆 -->{{$t('mxpcweb.systemset.systemparameter.1530351172267')}}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
            </div>
            <div style="margin-top:-8px;">
                <el-button size="large" type="primary" @click="SystemParameterWhiteList('SystemParameterWhiteList')">
                    <!-- 保存设置 -->{{$t('mxpcweb.systemset.systemparameter.1530351198177')}}
                </el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import whiteList from './whiteList'
export default {
  name: 'SecuritySet',
  props: {

  },
  data () {
    return {
      flag: false, // 密码策略级别标识
      labelPosition: 'top', // 每条表单标签位置
      systemParameter: {
        whiteListOpen: 0, // 白名单
        whiteListLimit: 1 // 登录限制
      }
    }
  },
  created () {
  },
  mounted () {
    this.getInitData() // 获取数据
  },
  methods: {
    // 获取数据
    getInitData () {
      let _this = this
      let url = this.Global.baseURL + this.Global.api.UniversalInterface.companysettingGet
      this.$http.get(url, { params: {} }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK) {
          let backData = res.body.data
          _this.systemParameter.whiteListOpen = backData.whiteListOpen
          _this.systemParameter.whiteListLimit = backData.whiteListLimit
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    // 点击全员重置密码
    allResetPWD () {
      let _this = this
      /* 启动后所有成员将会收到通知，是否确定？ */
      let c = this.$t('mxpcweb.systemset.systemparameter.1530351522540')
      /* '提示' */
      let t = this.$t('mxpcweb.systemset.systemparameter.1530351536522')
      /* '确定' */
      let s = this.$t('mxpcweb.systemset.systemparameter.1530351547890')
      /* '取消' */
      let n = this.$t('mxpcweb.systemset.systemparameter.1530351558481')
      _this.$confirm(c, t, {
        confirmButtonText: s,
        cancelButtonText: n,
        type: 'warning'
      }).then(() => {
        let url = _this.Global.baseURL + _this.Global.api.SystemSet.systemparameter.companysettingGet
        _this.$http.get(url, { params: { type: 'allReset' } }).then(function (res) {
          // console.log(res.data)
          if (res.data.code == '0') {
            /* 全员重置密码成功 */
            _this.$message.success(this.$t('mxpcweb.systemset.systemparameter.1530351588393'))
          } else {
            _this.$message.error(res.data.msg)
          }
        }, function (res) {
          _this.$message.error(_this.$t(_this.Global.errorTitle))
        })
      }).catch(() => {

      })
    },
    // 修改企业配置信息
    SystemParameterWhiteList (formName) {
      // 验证后提交
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 先修改企业配置信息
          let data = {
            'whiteListOpen': this.systemParameter.whiteListOpen,
            'whiteListLimit': this.systemParameter.whiteListLimit
          }
          let url = this.Global.baseURL + this.Global.api.UniversalInterface.companysettingUpdate
          this.$http.post(url, data).then(function (res) {
            // console.log(res.body)
            if (res.body.code.toString() == this.Global.RES_OK) {
              this.$message.success(this.msg(res.body))
            } else {
              this.$message.error(this.msg(res.body))
            }
          }, function (res) {
            this.$message.error(this.$t(this.Global.errorTitle))
          })
        } else {
          console.log('error submit!!')
        }
      })
    }
  },
  components: {
    'white-list': whiteList
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
