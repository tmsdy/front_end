<template>
    <div class="forgotPassword">
        <!--使用手机短信重置密码-->
        <el-dialog v-dialogDrag class="passwordDialog" :title="$t('mxpcweb.login.1528187788609')" :visible.sync="forgetPassworldPhoneData.dialogVisible" :before-close="handleClose" @close="resetForm('forgetPassworldPhoneData')" custom-class="width420">
            <p class="forgetPassworld">
                <span>{{$t('mxpcweb.login.1528339353900')}}</span>
                <span class="title" @click="forgetPassworldPhoneData.dialogVisible = false , forgetPassworldMailData.dialogVisible = true , forgetPassworldPhoneData.phone = ''">{{$t('mxpcweb.login.1528349083995')}}</span>
            </p>
            <el-input :placeholder="$t('mxpcweb.login.1528702815507')" v-model="forgetPassworldPhoneData.phone" prop="phone">
                <el-select v-model="forgetPassworldPhoneData.areaCode" slot="prepend" :placeholder="$t('mxpcweb.login.1528702888027')" style="width:102px;">
                    <el-option label="+86" value=""></el-option>
                </el-select>
            </el-input>
            <div class="marginTop20">
                <el-row :gutter="20">
                    <el-col :span="14">
                        <el-input v-model="forgetPassworldPhoneData.verificationCode" :placeholder="$t('mxpcweb.login.1528703017724')" prop="verificationCode"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <img :src="forgetPassworldPhoneData.codeImgUrl" class="codeImgUrl">
                    </el-col>
                    <el-col :span="4">
                        <span class="forMap" @click="usePhoneSwitchImg()">{{$t('mxpcweb.login.1528703094194')}}</span>
                    </el-col>
                </el-row>
            </div>
            <div class="marginTop20">
                <el-row :gutter="20">
                    <el-col :span="14">
                        <el-input v-model="forgetPassworldPhoneData.smsVerificationCode" :placeholder="$t('mxpcweb.login.1528703165210')"></el-input>
                    </el-col>
                    <el-col :span="10">
                        <el-button v-show="forgetPassworldPhoneData.VerificationCodeButtonStatus" type="primary" @click="getSmsVerificationCode()" class="widthFull">{{$t('mxpcweb.login.1528703192698')}}</el-button>
                        <i></i>
                        <el-button v-show="!forgetPassworldPhoneData.VerificationCodeButtonStatus" type="primary" :disabled="true" class="widthFull" style="color:#666">{{forgetPassworldPhoneData.time}} S</el-button>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="forgetPassworldPhoneData.dialogVisible = false">{{$t('mxpcweb.login.1528703242867')}}</el-button>
                <el-button type="primary" @click="resetPhonePassword()">{{$t('mxpcweb.login.1528696139283')}}</el-button>
            </span>
        </el-dialog>

        <!--使用邮件找回密码-->
        <el-dialog v-dialogDrag class="passwordDialog" :title="$t('mxpcweb.login.1528349083995')" :visible.sync="forgetPassworldMailData.dialogVisible" @close="resetForm('forgetPassworldMailData')" :before-close="handleClose" custom-class="width420">
            <p class="forgetPassworld">
                <span>{{$t('mxpcweb.login.1528703330833')}}</span>
                <span class="title" @click="forgetPassworldPhoneData.dialogVisible = true , forgetPassworldMailData.dialogVisible = false , forgetPassworldMailData.mail = ''">{{$t('mxpcweb.login.1528703360409')}}</span>
            </p>
            <el-input v-model="forgetPassworldMailData.mail" :placeholder="$t('mxpcweb.login.1528703393572')"></el-input>
            <el-row :gutter="20" class="marginTop20">
                <el-col :span="14">
                    <el-input v-model="forgetPassworldMailData.mailVerificationCode" :placeholder="$t('mxpcweb.login.1528703446056')"></el-input>
                </el-col>
                <el-col :span="10">
                    <el-button type="primary" v-show="forgetPassworldMailData.btnStatus" @click="sendCodeToMail" class="widthFull">{{$t('mxpcweb.login.1528703472255')}}</el-button>
                    <i></i>
                    <el-button type="primary" v-show="!forgetPassworldMailData.btnStatus" :disabled="true" class="widthFull" style="color:#666">{{forgetPassworldMailData.time}} S</el-button>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="forgetPassworldMailData.dialogVisible = false">{{$t('mxpcweb.login.1528703242867')}}</el-button>
                <el-button type="primary" @click="authenticationEmail()">{{$t('mxpcweb.login.1528696139283')}}</el-button>
            </span>
        </el-dialog>

        <!--重置密码-->
        <el-dialog v-dialogDrag class="passwordDialog" :title="$t('mxpcweb.login.1528703593213')" :visible.sync="resetPasswordData.dialogVisible" size="tiny" :before-close="handleClose" custom-class="width420">
            <p class="forgetPassworld">{{$t('mxpcweb.login.1528703622586')}}<br>{{$t('mxpcweb.login.1528703650529')}}</p>
            <div>
                <el-input type="password" v-model="resetPasswordData.password" :placeholder="$t('mxpcweb.login.1528703665726')"></el-input>
            </div>
            <div class="marginTop20">
                <el-input type="password" v-model="resetPasswordData.newPassword" :placeholder="$t('mxpcweb.login.1528703714372')"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetPasswordData.dialogVisible = false">{{$t('mxpcweb.login.1528703242867')}}</el-button>
                <el-button type="primary" @click="resetPassword()">{{$t('mxpcweb.login.1528696139283')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { setStore, getStore, checkPhone, checkEmail, checkPWD, getNewFlags } from '@/libs/utils.js'
import getImgVerificationCode from '../vue/getImgVerificationCode.js'
export default {
  name: '',
  props: {

  },
  data () {
    return {
      // 使用手机短信重置密码
      forgetPassworldPhoneData: {
        dialogVisible: false,
        areaCode: '',
        phone: '',
        verificationCode: '',
        codeImgUrl: '',
        smsVerificationCode: '',
        VerificationCodeButtonStatus: true,
        time: 60
      },
      // 使用邮件重置密码
      forgetPassworldMailData: {
        dialogVisible: false,
        mail: '',
        mailVerificationCode: '',
        btnStatus: true,
        time: 300
      },
      // 请重置登录密码
      resetPasswordData: {
        dialogVisible: false,
        phone: '',
        mail: '',
        password: '',
        newPassword: ''
      }
    }
  },
  created () {
    let _this = this
    // 获取图片验证码
    this.getImgVerificationCode((imgData) => {
      _this.forgetPassworldPhoneData.codeImgUrl = imgData.imgUrl
      _this.forgetPassworldPhoneData.code = imgData.code
    })
  },
  mounted () {

  },
  methods: {
    // 获取图片验证码基础方法
    getImgVerificationCode,
    usePhoneSwitchImg () {
      let _this = this
      // 获取图片验证码
      this.getImgVerificationCode((imgData) => {
        _this.forgetPassworldPhoneData.codeImgUrl = imgData.imgUrl
        _this.forgetPassworldPhoneData.code = imgData.code
      })
    },
    // 获取短信验证码
    getSmsVerificationCode () {
      let _this = this
      let phone = ''
      if (checkPhone(_this.forgetPassworldPhoneData.phone)) {
        phone = _this.forgetPassworldPhoneData.areaCode + _this.forgetPassworldPhoneData.phone
      } else {
        _this.$message.error(_this.$t('mxpcweb.login.1528704624877')); return
      }
      // 图片验证码是否通过
      if (_this.forgetPassworldPhoneData.verificationCode == '') {
        _this.$message.error(_this.$t('mxpcweb.login.1528703017724')); return
      }
      if (_this.forgetPassworldPhoneData.verificationCode != _this.forgetPassworldPhoneData.code) {
        _this.$message.error(_this.$t('mxpcweb.login.1528704734594')); return
      }
      let data = {
        mobile: phone,
        action: 'send', // 发送
        code: '',
        module: 'resetpwd'// 重置密码
      }
      this.$http.post(this.Global.baseURL + this.Global.api.v2.verifySMS, data).then((res) => {
        if (res.body && res.body.code.toString() === _this.Global.RES_OK) {
          _this.$message.success(_this.$t('mxpcweb.login.1528704780895'))
          let time = _this.forgetPassworldPhoneData.time
          _this.forgetPassworldPhoneData.VerificationCodeButtonStatus = false
          let t = setInterval(() => {
            time--
            _this.forgetPassworldPhoneData.time = time
            if (time == 0) {
              _this.forgetPassworldPhoneData.time = 60
              _this.forgetPassworldPhoneData.VerificationCodeButtonStatus = true
              clearInterval(t)
            }
          }, 1000)
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, (res) => {
        _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
      })
    },
    // 点击重置手机密码按钮
    resetPhonePassword () {
      let _this = this
      // 验证手机号
      let phone = ''
      if (checkPhone(_this.forgetPassworldPhoneData.phone)) {
        phone = _this.forgetPassworldPhoneData.areaCode + _this.forgetPassworldPhoneData.phone
      } else {
        _this.$message.error(_this.$t('mxpcweb.login.1528704624877'))
        return
      }
      // 图片验证码是否通过
      if (_this.forgetPassworldPhoneData.verificationCode == '') {
        _this.$message.error(_this.$t('mxpcweb.login.1528703017724')); return
      }
      if (_this.forgetPassworldPhoneData.verificationCode != _this.forgetPassworldPhoneData.code) {
        _this.$message.error(_this.$t('mxpcweb.login.1528704734594')); return
      }
      // 短信验证码
      if (_this.forgetPassworldPhoneData.smsVerificationCode == '') {
        _this.$message.error(_this.$t('mxpcweb.login.1528703165210'))
        return
      }
      // api
      let data = {
        mobile: phone,
        action: 'check',
        code: _this.forgetPassworldPhoneData.smsVerificationCode,
        module: 'resetpwd'
      }
      this.$http.post(this.Global.baseURL + this.Global.api.v2.verifySMS, data).then((res) => {
        // 验证成功
        if (res.body && res.body.code.toString() === _this.Global.RES_OK) {
          // 记录手机号 和 输入的验证码
          _this.resetPasswordData.phone = phone
          _this.resetPasswordData.verificationCode = _this.forgetPassworldPhoneData.smsVerificationCode
          // 调用登录接口
          _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.auth, { pass: _this.resetPasswordData.verificationCode, refer: 'reset', user: _this.resetPasswordData.phone }).then((res) => {
            if (res.body.code.toString() === _this.Global.RES_OK) {
              // 显示修改密码对话框
              _this.forgetPassworldPhoneData.dialogVisible = false
              _this.resetPasswordData.dialogVisible = true
            } else {
              _this.$message.error(_this.msg(res.body))
            }
            setStore('auth', res.body.data)// 存一下，后面用到flags
          })
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, (res) => {
        _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
      })
    },
    // 获取邮箱验证码
    sendCodeToMail () {
      let _this = this
      if (_this.forgetPassworldMailData.mail == '') {
        _this.$message.error(_this.$t('mxpcweb.login.1528705460673')); return
      }
      if (!checkEmail(_this.forgetPassworldMailData.mail)) {
        _this.$message.error(_this.$t('mxpcweb.login.1528708277382')); return
      }
      let data = {
        email: _this.forgetPassworldMailData.mail,
        action: 'send',
        code: '',
        module: 'resetpwd'
      }
      this.$http.post(this.Global.baseURL + this.Global.api.v2.verifyemail, data).then((res) => {
        // 邮箱验证码发送成功
        if (res.body && res.body.code.toString() == _this.Global.RES_OK) {
          _this.$message.success(_this.msg(res.body))
          _this.forgetPassworldMailData.btnStatus = false
          let time = _this.forgetPassworldMailData.time
          let t = setInterval(() => {
            time--
            _this.forgetPassworldMailData.time = time
            if (time == 0) {
              _this.forgetPassworldMailData.time = 60
              _this.forgetPassworldMailData.btnStatus = true
              clearInterval(t)
            }
          }, 1000)
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, (res) => {
        _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
      })
    },
    // 点击邮箱重置密码
    authenticationEmail () {
      let _this = this
      if (!checkEmail(_this.forgetPassworldMailData.mail)) {
        _this.$message.error(_this.$t('mxpcweb.login.1528708277382'))
        return
      }
      let data = {
        email: _this.forgetPassworldMailData.mail,
        code: _this.forgetPassworldMailData.mailVerificationCode,
        action: 'check',
        module: 'resetpwd'
      }
      // 校验code
      this.$http.post(this.Global.baseURL + this.Global.api.v2.verifyemail, data).then((res) => {
        if (res.body && res.body.code.toString() === _this.Global.RES_OK) {
          // 邮箱
          _this.resetPasswordData.mail = _this.forgetPassworldMailData.mail
          _this.resetPasswordData.verificationCode = _this.forgetPassworldMailData.mailVerificationCode
          // 调用登录接口
          _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.auth, { pass: _this.resetPasswordData.verificationCode, refer: 'reset', user: _this.resetPasswordData.mail }).then((res) => {
            if (res.body && res.body.code.toString() === _this.Global.RES_OK) {

            } else {
              _this.$message.error(_this.msg(res.body))
              _this.resetPasswordData.dialogVisible = false // 失败关闭重置窗口
            }
            setStore('auth', res.body.data)// 存一下，后面用到flags
          })
          // 关闭对话框
          _this.forgetPassworldMailData.dialogVisible = false
          _this.resetPasswordData.dialogVisible = true
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, (res) => {
        _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
      })
    },
    // 重置密码提交
    resetPassword () {
      let _this = this
      if (!checkPWD(_this.resetPasswordData.password)) {
        _this.$message.info(_this.$t('mxpcweb.login.1528703650529')); return
      }
      if (_this.resetPasswordData.password !== _this.resetPasswordData.newPassword) {
        _this.$message.info(_this.$t('mxpcweb.login.1528781531782')); return
      }
      // 手机1 邮箱2， 解绑0 绑定1
      let flagsOld = getStore('auth').flags
      let flagsNew
      if (_this.resetPasswordData.phone != '') {
        flagsNew = getNewFlags(flagsOld, 1, 1)// 手机1 邮箱2， 解绑0 绑定1
      }
      if (_this.resetPasswordData.mail != '') {
        flagsNew = getNewFlags(flagsOld, 2, 1)// 手机1 邮箱2， 解绑0 绑定1
      }
      let data = {
        mobile: _this.resetPasswordData.phone,
        email: _this.resetPasswordData.mail,
        code: _this.resetPasswordData.verificationCode,
        // aId: '',
        // oldPassword: '',
        newPassword: _this.resetPasswordData.newPassword,
        flags: flagsNew
      }
      // 重置密码API
      this.$http.post(this.Global.baseURL + this.Global.api.v2.resetpwd, data).then((res) => {
        if (res.body && res.body.code.toString() === _this.Global.RES_OK) {
          _this.$message.success(_this.msg(res.body))
          // 重置完成，调用登录
          let user = ''
          if (_this.resetPasswordData.phone != '') {
            user = _this.resetPasswordData.phone
          } else if (_this.resetPasswordData.mail != '') {
            user = _this.resetPasswordData.mail
          }
          let data = {
            user: user,
            pass: _this.resetPasswordData.newPassword
          }
          // 重置完成，进入系统
          _this.$emit('forgotPasswordAuth', data)
          // 关闭、清空对话框
          _this.resetPasswordData.dialogVisible = false
          // _this.resetPasswordData.phone = '';
          // _this.resetPasswordData.mail = '';
          // _this.resetPasswordData.password = '';
          // _this.resetPasswordData.newPassword = '';
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, (res) => {
        _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
      })
    },
    // 清空表单
    resetForm (formName) {
      // this.$refs[formName].resetFields();
      switch (formName) {
        case 'forgetPassworldPhoneData':
          this.forgetPassworldPhoneData.phone = ''
          this.forgetPassworldPhoneData.verificationCode = ''
          this.forgetPassworldPhoneData.smsVerificationCode = ''
          break
        case 'forgetPassworldMailData':
          this.forgetPassworldMailData.mail = ''
          this.forgetPassworldMailData.mailVerificationCode = ''
          break
      }
    },
    handleClose (done) {
      done()
    }
  },
  components: {

  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.forgotPassword {
    .passwordDialog {
        .marginTop20 {
            margin-top: 20px;
        }
        .codeImgUrl {
            margin-top: 2px;
        }
        .forMap {
            display: inline-block;
            height: 30px;
            line-height: 30px;
        }
        .forMap:hover {
            cursor: pointer;
            color: #008cee;
        }
        .forgetPassworld {
            font-size: 14px;
            color: #999;
            margin-bottom: 15px;
            .title {
                color: #FF9900;
                cursor: pointer;
            }
        }
    }
}
</style>
