<template>
    <div class="Overtime" v-show="active">
      <div class="logo">
        <i class="iconfont icon-logo"></i>
      </div>
      <div class="loginBox">
        <div class="titleBox">
          <div class="lock">
            <i class="iconfont icon-lock"></i>
          </div>
          <div class="titleText">{{ $t('mxpcweb.components.1535005101533') }}</div>
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
import { getCookie, decrypt, setStore, getStore } from '@/libs/utils.js'
export default {
  name: 'Overtime',
  props: {},
  data () {
    let _this = this
    return {
      active: false,
      time: 0,
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
  mounted () {
    this.active = getStore('isOvertime')
    // 鼠标在系统上有移动交互
    $(document).on('mousemove', e => {
      if (!this.$el.contains(e.target)) {
        this.time = 0
        setStore('isOvertime', false)
      }
    })
  },
  methods: {
    // 提交表单
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) { // 检验通过
          if (decrypt(getCookie('pass')) === this.lockScreenFrom.password) {
            this.active = false
            setStore('isOvertime', false)
          } else {
            this.$message.error(this.$t('mxpcweb.components.1535010628644'))
          }
        }
      })
    },
    action () {
      let minutesLockApp = parseInt(this.individualConfigInfo.minutesLockApp)
      if (minutesLockApp === 0) {
        // 不锁屏
        this.active = false
        setStore('isOvertime', false)
      } else {
        // 一分钟执行一次
        setInterval(() => {
          ++this.time
          if (this.time >= minutesLockApp) {
            this.active = true
            setStore('isOvertime', true)
          }
        }, 60000)
      }
    }
  },
  watch: {
    individualConfigInfo () {
      if (this.individualConfigInfo) {
        this.action()
      }
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
    @import "./zh-cn.less";
    @import "./en.less";
</style>
