<template>
    <div class="CheckBinding">
        <!-- 绑定手机弹窗  -->
        <el-dialog v-dialogDrag :title="$t('mxpcweb.login.1528788237811')" :visible.sync="bindingPhone.popupShow" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" custom-class="width420" @close="resetForm('bindingPhone')">
            <div style="margin-bottom: 13px; color: #999;">
                {{$t('mxpcweb.login.1528788300171')}}
                <span class="text-yellow text-hover transition_all" @click="changePhone">{{$t('mxpcweb.login.1528788325412')}}</span>
            </div>
            <el-form :model="bindingPhone" :rules="rulesBindingPhone" ref="bindingPhone" :inline="true" label-width="80px">
                <el-form-item :label="$t('mxpcweb.login.1528788372666')" prop="number" style="margin-bottom:18px;">
                    <el-input v-model="bindingPhone.number" auto-complete="off" :placeholder="$t('mxpcweb.login.1528788421456')" style="width:280px;"></el-input>
                </el-form-item>
                <el-form-item :label="$t('mxpcweb.login.1528695648163')" prop="code">
                    <el-input :placeholder="$t('mxpcweb.login.1528695733514')" v-model="bindingPhone.code" style="width:145px;"></el-input>
                    <el-button type="primary" @click="phoneSendCode('bindingPhone')" style="width:130px;" v-show="bindingPhone.btnIsShow">{{$t('mxpcweb.login.1528695733514')}}</el-button>
                    <i></i>
                    <el-button type="primary" :disabled="true" style="width:130px;color:#777;" v-show="!bindingPhone.btnIsShow">{{bindingPhone.countDown}} S</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="padding-right:20px;">
                <el-button @click="bindingPhone.popupShow = false">{{$t('mxpcweb.login.1528788552227')}}</el-button>
                <el-button type="primary" @click="bindingPhoneFn('bindingPhone')">{{$t('mxpcweb.login.1528788613407')}}</el-button>
            </div>
        </el-dialog>

        <!-- 绑定邮箱弹窗 -->
        <el-dialog v-dialogDrag :title="$t('mxpcweb.login.1528788639416')" :visible.sync="bindingMail.popupShow" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" custom-class="width420" @close="resetForm('bindingMail')">
            <div style="margin-bottom: 13px; color: #999;">
                {{$t('mxpcweb.login.1528788682377')}}
                <span class="text-yellow text-hover transition_all" @click="changeMail">{{$t('mxpcweb.login.1528788711058')}}</span>
            </div>
            <el-form :model="bindingMail" :rules="rulesBindingMail" ref="bindingMail" :inline="true" label-width="80px">
                <el-form-item :label="$t('mxpcweb.login.1528788740372')" prop="mail" style="margin-bottom:18px;">
                    <el-input v-model="bindingMail.mail" auto-complete="off" :placeholder="$t('mxpcweb.login.1528788771631')" style="width:280px;"></el-input>
                </el-form-item>
                <el-form-item :label="$t('mxpcweb.login.1528695648163')" prop="code">
                    <el-input :placeholder="$t('mxpcweb.login.1528695733514')" v-model="bindingMail.code" style="width:130px;"></el-input>
                    <el-button type="primary" @click="mailSendCode" style="width:145px;" v-show="bindingMail.btnIsShow">{{$t('mxpcweb.login.1528788896835')}}</el-button>
                    <i></i>
                    <el-button type="primary" :disabled="true" style="width:145px;color:#777;" v-show="!bindingMail.btnIsShow">{{bindingMail.countDown}} S</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="padding-right:20px;">
                <el-button @click="bindingMail.popupShow = false">{{$t('mxpcweb.login.1528788552227')}}</el-button>
                <el-button type="primary" @click="bindingMailFn('bindingMail')">{{$t('mxpcweb.login.1528788613407')}}</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import { setStore, getStore, checkPhone, checkEmail, getNewFlags, getByte } from '@/libs/utils.js'
export default {
  name: 'CheckBinding',
  props: {
  },
  data () {
    let _this = this
    return {
      fn: '',
      flags: '',
      bindingPhone: { // 绑定手机号
        popupShow: false, // 弹窗
        state: '', // 绑定状态，共3种
        countDown: 60, // 倒计时
        btnIsShow: true,
        number: '',
        code: ''
      },
      bindingMail: { // 绑定邮箱
        popupShow: false, // 弹窗
        state: '', // 绑定状态，共3种
        countDown: 300, // 倒计时
        btnIsShow: true,
        mail: '', // 绑定的邮箱
        code: ''
      },
      rulesBindingPhone: {
        number: [
          { required: true, message: _this.$t('mxpcweb.login.1528789595048'), trigger: 'blur' },
          { min: 11, max: 12, message: _this.$t('mxpcweb.login.1528789680014'), trigger: 'blur' }
        ],
        code: [
          { required: true, message: _this.$t('mxpcweb.login.1528789754158'), trigger: 'blur' }
        ]
      },
      rulesBindingMail: {
        mail: [
          { required: true, message: _this.$t('mxpcweb.login.1528789788725'), trigger: 'blur' },
          { type: 'email', message: _this.$t('mxpcweb.login.1528789814638'), trigger: 'blur,change' }
        ],
        code: [
          { required: true, message: _this.$t('mxpcweb.login.1528789842257'), trigger: 'blur' }
        ]
      }
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    // 获取flags,mobile,mail 并检测绑定
    checkBinding (fn) {
      // this.fn = fn;//全局这个fn
      let _this = this
      let jsonObj = getStore('auth')
      this.flags = jsonObj.flags
      let mobile = jsonObj.mobile
      let email = jsonObj.email
      this.bindingPhone.number = mobile
      this.bindingMail.mail = email
      // 手机可以为空，非空就必须验证，邮箱是必须绑定且验证的
      setTimeout(() => {
        if (mobile) {
          if (getByte(this.flags, 1) == 0) {
            _this.bindingPhone.popupShow = true
            return
          }
        }
        if (getByte(this.flags, 2) == 0) {
          _this.bindingMail.popupShow = true
          return
        }
        // _this.fn && _this.fn(true);
        _this.$emit('loginSuccess')// 成功通知父组件去跳转
        fn && fn(true)// 返回用于重置密码
      }, 300)
    },
    // 发手机验证码：
    phoneSendCode () {
      let _this = this
      let phoneNum = this.bindingPhone.number
      if (!checkPhone(phoneNum)) {
        _this.$message.error(_this.$t('mxpcweb.login.1528789917251')); return
      }
      // 开始发送验证码：
      let urlApi = _this.Global.baseURL + _this.Global.api.v2.verifySMS
      let verifySMS_json = {
        'mobile': phoneNum,
        'action': 'send',
        'module': 'bind'
      }
      this.$http.post(urlApi, verifySMS_json).then((res) => {
        if (res.body.code.toString() == _this.Global.RES_OK) {
          this.$message.success(_this.$t('mxpcweb.login.1528790166703'))
          // 倒计时
          this.bindingPhone.btnIsShow = false
          let countDown = this.bindingPhone.countDown
          let t = setInterval(() => {
            countDown--
            _this.bindingPhone.countDown = countDown
            if (countDown == 0) {
              _this.bindingPhone.btnIsShow = true
              _this.bindingPhone.countDown = '60'
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
    // 发邮箱验证码：
    mailSendCode () {
      let _this = this
      let mail = this.bindingMail.mail
      if (!checkEmail(mail)) {
        _this.$message.error(_this.$t('mxpcweb.login.1528790091075')); return
      }
      // 开始发送验证码：
      let urlApi = _this.Global.baseURL + _this.Global.api.v2.verifyemail
      let mail_json = {
        'email': mail,
        'action': 'send',
        'module': 'bind'
      }
      this.$http.post(urlApi, mail_json).then((res) => {
        if (res.body.code.toString() == _this.Global.RES_OK) {
          _this.$message.success(_this.$t('mxpcweb.login.1528790166703'))
          // 倒计时
          _this.bindingMail.btnIsShow = false
          let countDown = this.bindingMail.countDown
          let t = setInterval(() => {
            countDown--
            _this.bindingMail.countDown = countDown
            if (countDown == 0) {
              _this.bindingMail.btnIsShow = true
              _this.bindingMail.countDown = '300'
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
    // 绑定手机，点确定：
    bindingPhoneFn (formName) {
      let _this = this
      let phoneNum = this.bindingPhone.number
      let verifySMS_new = this.bindingPhone.code
      let newFlags = getNewFlags(this.flags, 1, 1)// 手机通过验证
      // 表单验证：
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let urlApi = _this.Global.baseURL + _this.Global.api.v2.verifySMS
          let verifySMS_json = {
            'mobile': phoneNum,
            'action': 'check',
            'code': verifySMS_new,
            'module': 'bind'
          }
          // 验证码是否通过：
          _this.$http.post(urlApi, verifySMS_json).then((res) => {
            if (res.body.code.toString() == _this.Global.RES_OK) {
              _this.$message.success(_this.msg(res.body))
              let urlApi_mobile = _this.Global.baseURL + _this.Global.api.v2.account_put
              let mobile_json = {
                'mobile': phoneNum,
                'flags': newFlags
              }
              // 通过后，更新数据：
              _this.$http.put(urlApi_mobile, mobile_json).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                  // 成功后，更新localStorage
                  let jsonObj = getStore('auth')
                  jsonObj.flags = newFlags
                  jsonObj.mobile = phoneNum
                  setStore('auth', jsonObj)
                  _this.bindingPhone.popupShow = false // 关闭窗口
                  _this.$message.success(_this.$t('mxpcweb.login.1528790419319'))
                  this.checkBinding() // 再次检查绑定
                } else {
                  _this.$message.error(_this.msg(res.body))
                }
              }, (res) => {
                _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
              })
            } else {
              _this.$message.error(_this.msg(res.body))
            }
          }, (res) => {
            _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
          })
        } else {
          this.$message({ message: _this.$t('mxpcweb.login.1528790526121'), type: 'warning' })
          return false
        }
      })
    },
    // 绑定邮箱，点确定
    bindingMailFn (formName) {
      let _this = this
      let mail = this.bindingMail.mail
      let mailCode_new = this.bindingMail.code
      let newFlags = getNewFlags(this.flags, 2, 1)// 邮箱通过验证
      // 表单验证：
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 验证码是否通过：
          let urlApi = _this.Global.baseURL + _this.Global.api.v2.verifyemail
          let verifySMS_json = {
            'email': mail,
            'action': 'check',
            'code': mailCode_new,
            'module': 'bind'
          }
          this.$http.post(urlApi, verifySMS_json).then((res) => {
            if (res.body.code.toString() == _this.Global.RES_OK) {
              // 通过后，更新数据：
              let urlApi_mail = _this.Global.baseURL + _this.Global.api.v2.account_put
              let mail_json = {
                'email': mail,
                'flags': newFlags
              }
              this.$http.put(urlApi_mail, mail_json).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                  // 成功后，更新localStorage
                  let jsonObj = getStore('auth')
                  jsonObj.flags = newFlags
                  jsonObj.email = mail
                  setStore('auth', jsonObj)
                  this.bindingMail.popupShow = false // 关闭窗口
                  _this.$message.success(_this.$t('mxpcweb.login.1528790809949'))
                  this.checkBinding() // 再次检查绑定
                } else {
                  _this.$message.error(_this.msg(res.body))
                }
              }, (res) => {
                _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
              })
            } else {
              _this.$message.error(_this.msg(res.body))
            }
          }, (res) => {
            _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
          })
        } else {
          this.$message({ message: _this.$t('mxpcweb.login.1528790526121'), type: 'warning' })
          return false
        }
      })
    },
    // 切换用新手机
    changePhone () {
      this.$message(this.$t('mxpcweb.login.1528790988201'))
      this.bindingPhone.number = ''
    },
    // 切换用新邮箱
    changeMail () {
      this.$message(this.$t('mxpcweb.login.1528791064362'))
      this.bindingMail.mail = ''
    },
    // 清空表单
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  components: {
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.CheckBinding {
  display: block;
}
</style>
