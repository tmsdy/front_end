<template>
  <div class="login">
    <div class="login-bg">
      <img class="login-bg__img"
        src="../../assets/bg.png"
        alt="">
      <div class="login-bg__gradient"></div>
    </div>
    <div class="login-content">
      <section class="login-intro">
        <div class="login-intro__content">
          <img class="login-intro__logo"
            src="../../assets/logo.png"
            alt="">
          <img class="login-intro__logotext"
            src="../../assets/logo-text.png"
            alt="">
          <span class="login-intro__name">人工智能经编断纱检测系统</span>
          <span class="login-intro__info"></span>
        </div>
      </section>
      <section class="login-form__wrap"
        v-loading.lock="isLoging">
        <span class="login-form__title">登录</span>
        <el-form ref="form"
          :model="form"
          :rules="rules"
          class="login-form"
          @submit.native.prevent>
          <el-form-item prop="name">
            <el-input v-model="form.name"
              class="login-form__uname"
              placeholder="请输入您的账号"
              autofocus
              @keyup.enter.native="$refs.pwd.focus()">
              <div class="login-form__suffix_name"
                slot="suffix"></div>
            </el-input>
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input v-model="form.pwd"
              class="login-form__pwd"
              placeholder="请输入您的密码"
              :type="pwdType"
              ref="pwd"
              @keyup.enter.native="formCheck()">
              <i slot="suffix"
                class="iconfont"
                :class="{'icon-eye-open':showPwd,'icon-eye-close':!showPwd}"
                @click="showPwd = !showPwd"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox label="下次自动登录"
              name="autologin"
              class="login-form__autologin"
              v-model="form.autologin"></el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
              class="login-form__submit"
              @click="formCheck">登录</el-button>
          </el-form-item>
        </el-form>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import c from '@/config'
import { AxiosResponse } from 'node_modules/axios'

export default Vue.extend({
  data() {
    return {
      isLoging: false,
      form: {
        name: 'fei.han',
        pwd: 'fei.han',
        autologin: this.$user.autologin,
      },
      // 数据校验规则
      rules: {
        name: [
          { required: true, message: '请输入您的账号', trigger: 'change' },
          {
            min: 3,
            max: 15,
            message: '账号长度在 3 到 15 个字符',
            trigger: 'change',
          },
        ],
        pwd: [{ required: true, message: '请输入您的密码', trigger: 'change' }],
      },
      showPwd: false,
    }
  },
  created() {
    this.$user.logout()
  },
  computed: {
    // 密码框的类型，用于显示/隐藏密码
    pwdType(): string {
      return this.showPwd ? 'text' : 'password'
    },
  },
  methods: {
    // 数据校验
    formCheck() {
      // @ts-ignore
      this.$refs.form.validate((valid: boolean) => {
        if (valid) {
          this.login()
        }
      })
    },
    // 执行登陆操作
    login() {
      // avoid frequently click
      if (this.isLoging) return
      this.isLoging = true
      // 开始请求
      this.$http
        .post('/mes/login', {
          username: this.form.name,
          password: this.form.pwd,
        })
        .then(res => {
          switch (res.status) {
            case 200:
              this.loginSuccess(res.data)
              break
            case 401:
              this.passwdOrUnameWrong()
              break
            default:
              this.netError(res.status)
          }
          if (res.status === 200) {
          }
        })
        .catch(this.unknownError)
        .finally(() => {
          this.isLoging = false
        })
    },
    loginSuccess(data: AxiosResponse['data']) {
      this.$user.setToken(data.token, new Date(data.expire))
      // route to home page
      this.$goto(c.URL_HOME)
    },
    passwdOrUnameWrong() {
      this.$message.error('用户名或密码错误')
    },
    // Error handler
    netError(status: number) {
      this.$message.error(`网络错误: ${status}`)
    },
    unknownError(reason: any) {
      this.$message.error(`未知错误: ${reason}`)
    },
  },
  watch: {
    'form.autologin'(val: boolean) {
      this.$user.autologin = val
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

+b('login') {
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
      m('autologin');
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
