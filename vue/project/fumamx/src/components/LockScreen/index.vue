<template>
    <div class="lockScreen" v-show="active">
      <div class="logo">
        <i class="iconfont icon-logo"></i>
      </div>
      <div class="loginBox">
        <div class="titleBox">
          <div class="lock">
            <i class="iconfont icon-lock"></i>
          </div>
          <div class="titleText">{{ $t('mxpcweb.components.1532162955569') }}</div>
        </div>
        <div class="formBox">
          <div class="formTitle">{{ this.$t('mxpcweb.components.1532163026736') }}</div>
          <el-form :model="lockScreenFrom" :rules="lockScreenFromRules" ref="lockScreenFrom" label-width="0px">
            <el-form-item label="" prop="password">
              <el-input size="large" type="password" v-model="lockScreenFrom.password" @keyup.enter.native="submitForm('lockScreenFrom')" :placeholder="$t('mxpcweb.components.1532163183424')"></el-input>
            </el-form-item>
            <input type="text" style="display:none">
            <el-form-item>
              <el-button type="primary" size="large" style="width:100%;" @click="submitForm('lockScreenFrom')">{{ $t('mxpcweb.components.1532163150437') }}</el-button>
            </el-form-item>
          </el-form>
          <div class="signOutTitle">{{ this.$t('mxpcweb.components.1532163059352') }},<span class="signOut" @click="loginEnterprise()">{{ $t('mxpcweb.components.1532163119624') }}</span></div>
        </div>
      </div>
    </div>
</template>

<script>
import { setStore, getStore, isObject, setItem } from '@/libs/utils.js'
export default {
  name: 'lockScreen',
  props: {},
  data () {
    let _this = this
    return {
      active: false,
      lockScreenFrom: {
        password: ''
      },
      lockScreenFromRules: {
        password: [
          { required: true, message: _this.$t('mxpcweb.components.1535010072707'), trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // 执行此全局锁屏
    ep.tail('showLockScreen', (data) => {
      this.active = true
    })
  },
  methods: {
    // 提交表单
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) { // 检验通过
          let auth = getStore('auth')
          if (!auth) {
            return
          }
          let { mobile, email, userName } = auth
          let data = {
            user: mobile || email || userName,
            pass: this.lockScreenFrom.password,
            refer: ''
          }
          this.$http.post(this.Global.baseURL + this.Global.api.v2.auth, data).then((res) => {
            if (res.body.code.toString() == this.Global.RES_OK && isObject(res.body.data)) {
              // 下面，如果验证密码成功，更新下cookie
              let companyID = getStore('company').cId
              let comArr = res.body.data.companies
              if (_.isArray(comArr)) {
                for (var i = 0; i < comArr.length; i++) {
                  if (companyID == comArr[i].cId && comArr[i].accessToken && comArr[i].accessToken.value) {
                    setItem(this.Global.accessToken, JSON.stringify(comArr[i].accessToken))
                    setStore('company', comArr[i])
                    this.active = false
                    window.AppLockScreen()
                    return
                  }
                }
              }
            } else {
              this.$message.error(this.msg(res.body))
            }
          }, (res) => {
            this.$message.error(this.$t(this.Global.errorTitle))
          })
        }
      })
    }
  },
  components: {}
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
    @import "./zh-cn.less";
    @import "./en.less";
</style>
