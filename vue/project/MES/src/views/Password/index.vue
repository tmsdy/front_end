<template>
  <div class="password">
    <div class="password-bg">
      <img class="password-bg__img"
        src="../../assets/bg.png"
        alt="">
      <div class="password-bg__gradient"></div>
    </div>
    <div class="password-content">
      <section class="password-intro">
        <div class="password-intro__content">
          <img class="password-intro__logo"
            src="../../assets/logo.png"
            alt="">
          <img class="password-intro__logotext"
            src="../../assets/logo-text.png"
            alt="">
          <span class="password-intro__name">人工智能经编断纱检测系统</span>
          <span class="password-intro__info"></span>
        </div>
      </section>
      <section class="password-form__wrap"
        v-loading="showLoading">
        <span class="password-form__title">修改密码</span>
        <el-form ref="form"
          :model="form"
          :rules="rules"
          class="password-form"
          @submit.native.prevent>
          <el-form-item prop="oldPwd">
            <el-input v-model="form.oldPwd"
              class="password-form__pwd"
              placeholder="请输入您的旧密码"
              :type="oldPwdType"
              ref="oldPwd"
              @keyup.enter.native="$refs.pwd.focus()">
              <i slot="suffix"
                class="iconfont"
                @click="showOldPwd = !showOldPwd"
                :class="{'icon-eye-open':showOldPwd,'icon-eye-close':!showOldPwd}"></i>
            </el-input>
          </el-form-item>

          <el-form-item prop="pwd">
            <el-input v-model="form.pwd"
              class="password-form__pwd"
              placeholder="请输入您的新密码"
              :type="pwdType"
              ref="pwd"
              @keyup.enter.native="$refs.rePwd.focus()">
              <i slot="suffix"
                class="iconfont"
                :class="{'icon-eye-open':showPwd,'icon-eye-close':!showPwd}"
                @click="showPwd = !showPwd"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="rePwd">
            <el-input v-model="form.rePwd"
              class="password-form__pwd"
              placeholder="请重复输入新密码"
              :type="rePwdType"
              ref="rePwd"
              @keyup.enter.native="submit()">
              <i slot="suffix"
                class="iconfont"
                :class="{'icon-eye-open':showRePwd,'icon-eye-close':!showRePwd}"
                @click="showRePwd = !showRePwd"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
              class="password-form__submit"
              @click="submit()">确认修改</el-button>
          </el-form-item>
        </el-form>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { AxiosResponse } from 'axios'
import { setTimeout } from 'timers'
import c from '@/config'

const PASSWD_LENGTH_MIN = 6

export default Vue.extend({
  data() {
    return {
      showLoading: false,
      form: {
        oldPwd: '',
        pwd: '',
        rePwd: '',
      },
      // data check rules
      rules: {
        oldPwd: [
          { required: true, message: '请输入旧密码', trigger: 'change' },
        ],
        pwd: [
          { required: true, message: '请输入新密码', trigger: 'change' },
          {
            validator: (rule: any, value: string, cb: Function) => {
              if (
                value.length > PASSWD_LENGTH_MIN &&
                /[0-9]/.test(value) &&
                /[a-z]/.test(value) &&
                /[A-Z]/.test(value)
              ) {
                cb()
              }
              cb(
                new Error(
                  `密码须由至少 ${PASSWD_LENGTH_MIN} 个字符组成，并包含数字、大小写字母`,
                ),
              )
            },
            trigger: 'change',
          },
        ],
        rePwd: [
          { required: true, message: '请重复输入新密码', trigger: 'change' },
          {
            validator: (rule: any, value: any, cb: Function) => {
              // @ts-ignore
              if (value !== this.form.pwd) {
                cb(new Error('两次密码输入不一致'))
              }
              cb()
            },
            trigger: 'blur',
          },
        ],
      },
      showOldPwd: false,
      showPwd: false,
      showRePwd: false,
    }
  },
  computed: {
    // 密码框的类型，用于显示/隐藏密码
    pwdType(): string {
      return this.showPwd ? 'text' : 'password'
    },
    oldPwdType(): string {
      return this.showOldPwd ? 'text' : 'password'
    },
    rePwdType(): string {
      return this.showRePwd ? 'text' : 'password'
    },
  },
  methods: {
    // 数据校验
    submit() {
      // @ts-ignore
      this.$refs.form.validate((valid: boolean) => {
        if (valid) {
          this.password()
        }
      })
    },
    // 执行登陆操作
    password() {
      this.showLoading = true
      // 开始请求
      this.$http
        .put('/mes/user/password', {
          oldPassword: this.form.oldPwd,
          newPassword: this.form.pwd,
        })
        .then(({ status }) => {
          if (status === 200) {
            this.$message.success('修改密码成功')
            this.$user.logout()
            // redirect to login page
            this.$goto(c.URL_LOGIN)
          }
        })
        .catch(this.netErrorHandler)
        .finally(() => {
          this.showLoading = false
        })
    },
    // 错误处理
    netErrorHandler() {
      this.$message.error('未知网络错误')
    },
  },
})
</script>

<style lang="stylus">
body {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: white;
  background-image: radial-gradient(rgb(200, 195, 199) 6%, transparent 0);
  background-size: 2rem 2rem;
}

+b('password') {
  width: base-width;
  height: base-height;
  position: relative;

  +e('bg') {
    width: 100%;
    min-width: base-width;
    height: 100%;
    position: relative;

    +m('img') {
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }

    +m('gradient') {
      width: 100%;
      height: 100%;
      background: base-background;
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  +e('content') {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  +e('intro') {
    width: 826px;
    height: 64rem;
    overflow: hidden;

    +m('content') {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    +m('logo') {
      width: 12rem;
      margin-bottom: 2.5rem;
    }

    +m('logotext') {
      width: 7.666rem;
      margin-bottom: 4rem;
    }

    +m('name') {
      margin: 2rem;
      font-size: 2rem;
      font-weight: lighter;
      color: white;
    }

    +m('info') {
      font-size: 3rem;
    }
  }

  +e('form') {
    width: 100%;

    +m('wrap') {
      width: 420px;
      height: 428px;
      padding: 52px 60px;
      margin: 0 60px;
      border: solid 1px #979797;
      overflow: hidden;
      position: relative;
      background: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    +m('title') {
      font-size: 2rem;
      margin-bottom: 60px;
    }

    +group() {
      m('uname');
      m('pwd');
      m('autopassword');
      // margin-bottom: 30px;
    }

    +m('submit') {
      width: 100%;
      height: 40px;
      color: white;
      font-size: 14px;
      margin: 2px 0 0 0;
      outline: none;
      border-radius: 2px;
      background-image: linear-gradient(98deg, #5b549c, #12a1b6);
      border-color: transparent !important;

      &:hover, &:active, &:focus {
        background-image: linear-gradient(98deg, #8079bf, #32bcd0);
      }
    }
  }
}

.el-input__suffix {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 0.25rem;
  padding-top: 0.25rem;
}
</style>
