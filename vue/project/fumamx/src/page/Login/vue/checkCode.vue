<template>
    <div class="checkCode">
        <!-- 手机短信验证 -->
        <el-dialog v-dialogDrag class="passwordDialog" :title="$t('mxpcweb.login.1528785352252')" :visible.sync="checkCodePhoneData.dialogVisible" :before-close="handleClose" @close="resetForm('checkCodePhoneData')" custom-class="width420">
            <p class="forgetPassworld">
                <span>{{ $t('mxpcweb.login.1528785400033') }}</span>
                <span class="title" @click="checkCodePhoneData.dialogVisible = false , checkCodeMailData.dialogVisible = true ">{{ $t('mxpcweb.login.1528785450881') }}</span>
            </p>
            <el-input :placeholder="$t('mxpcweb.login.1528702815507')" v-model="checkCodePhoneData.phone" prop="phone" readonly="readonly">
                <el-select v-model="checkCodePhoneData.areaCode" slot="prepend" :placeholder="$t('mxpcweb.login.1528702888027')" style="width:102px;">
                    <el-option label="+86" value=""></el-option>
                </el-select>
            </el-input>
            <div class="marginTop20">
                <el-row :gutter="20">
                    <el-col :span="14">
                        <el-input v-model="checkCodePhoneData.verificationCode" :placeholder="$t('mxpcweb.login.1528703017724')" prop="verificationCode"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <img :src="checkCodePhoneData.codeImgUrl" class="codeImgUrl">
                    </el-col>
                    <el-col :span="4">
                        <span class="forMap" @click="usePhoneSwitchImg()">{{$t('mxpcweb.login.1528703094194')}}</span>
                    </el-col>
                </el-row>
            </div>
            <div class="marginTop20">
                <el-row :gutter="20">
                    <el-col :span="14">
                        <el-input v-model="checkCodePhoneData.smsVerificationCode" :placeholder="$t('mxpcweb.login.1528703165210')"></el-input>
                    </el-col>
                    <el-col :span="10">
                        <el-button v-show="checkCodePhoneData.VerificationCodeButtonStatus" type="primary" @click="sendCodeToPhone()" class="widthFull">{{$t('mxpcweb.login.1528703192698')}}</el-button>
                        <i></i>
                        <el-button v-show="!checkCodePhoneData.VerificationCodeButtonStatus" type="primary" :disabled="true" class="widthFull" style="color:#666">{{checkCodePhoneData.time}} S</el-button>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="checkCodePhoneData.dialogVisible = false">{{ $t('mxpcweb.login.1528703242867') }}</el-button>
                <el-button type="primary" @click="checkCodePhoneSubmit()">{{ $t('mxpcweb.login.1528696139283') }}</el-button>
            </span>
        </el-dialog>

        <!-- 邮件验证码验证 -->
        <el-dialog v-dialogDrag class="passwordDialog" :title="$t('mxpcweb.login.1528785450881')" :visible.sync="checkCodeMailData.dialogVisible" @close="resetForm('checkCodeMailData')" :before-close="handleClose" custom-class="width420">
            <p class="forgetPassworld">
                <span>{{ $t('mxpcweb.login.1528785792670') }}</span>
                <span class="title" @click="checkCodePhoneData.dialogVisible = true , checkCodeMailData.dialogVisible = false ">{{ $t('mxpcweb.login.1528785352252') }}</span>
            </p>
            <el-input v-model="checkCodeMailData.mail" :placeholder="$t('mxpcweb.login.1528705460673')" readonly="readonly"></el-input>
            <el-row :gutter="20" class="marginTop20">
                <el-col :span="14">
                    <el-input v-model="checkCodeMailData.mailVerificationCode" :placeholder="$t('mxpcweb.login.1528703446056')"></el-input>
                </el-col>
                <el-col :span="10">
                    <el-button type="primary" v-show="checkCodeMailData.btnStatus" @click="sendCodeToMail" class="widthFull">{{ $t('mxpcweb.login.1528703472255') }}</el-button>
                    <i></i>
                    <el-button type="primary" v-show="!checkCodeMailData.btnStatus" :disabled="true" class="widthFull" style="color:#666">{{checkCodeMailData.time}} S</el-button>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="checkCodeMailData.dialogVisible = false">{{ $t('mxpcweb.login.1528703242867') }}</el-button>
                <el-button type="primary" @click="checkCodeMailSubmit()">{{ $t('mxpcweb.login.1528696139283') }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getStore, checkPhone, checkEmail } from '@/libs/utils.js'
import getImgVerificationCode from '../vue/getImgVerificationCode.js'

export default {
  name: 'checkCode',
  props: {
    companySelected: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      // 手机短信验证
      checkCodePhoneData: {
        dialogVisible: false,
        areaCode: '',
        phone: '',
        verificationCode: '',
        codeImgUrl: '',
        smsVerificationCode: '',
        VerificationCodeButtonStatus: true,
        time: 60
      },
      // 邮件验证码验证
      checkCodeMailData: {
        dialogVisible: false,
        mail: '',
        mailVerificationCode: '',
        btnStatus: true,
        time: 300
      }
    }
  },
  created () {
    let _this = this
    // 获取图片验证码
    this.getImgVerificationCode((imgData) => {
      _this.checkCodePhoneData.codeImgUrl = imgData.imgUrl
      _this.checkCodePhoneData.code = imgData.code
    })
  },
  mounted () {

  },
  methods: {
    // 父组件来调用
    isShowPhone () {
      let _this = this
      // 把账号的手机或邮箱显示上
      let auth = getStore('auth')
      // 手机号码为空，就先邮件弹窗显示
      if (auth.mobile == '') {
        _this.checkCodeMailData.dialogVisible = true
        _this.checkCodePhoneData.phone = _this.$t('mxpcweb.login.1528787294171')
      } else {
        _this.checkCodePhoneData.dialogVisible = true
        _this.checkCodePhoneData.phone = auth.mobile
      }
      if (auth.email == '') {
        _this.checkCodeMailData.mail = _this.$t('mxpcweb.login.1528787340739')
      } else {
        _this.checkCodeMailData.mail = auth.email
      }
    },
    // 获取图片验证码基础方法
    getImgVerificationCode,
    usePhoneSwitchImg () {
      let _this = this
      // 获取图片验证码
      this.getImgVerificationCode((imgData) => {
        _this.checkCodePhoneData.codeImgUrl = imgData.imgUrl
        _this.checkCodePhoneData.code = imgData.code
      })
    },
    // 发送短信验证码
    sendCodeToPhone () {
      let _this = this
      let phone = ''
      if (checkPhone(_this.checkCodePhoneData.phone)) {
        phone = _this.checkCodePhoneData.areaCode + _this.checkCodePhoneData.phone
      } else {
        _this.$message.error(_this.$t('mxpcweb.login.1528704624877')); return
      }
      // 图片验证码是否通过
      if (_this.checkCodePhoneData.verificationCode == '') {
        _this.$message.error(_this.$t('mxpcweb.login.1528703017724')); return
      }
      if (_this.checkCodePhoneData.verificationCode != _this.checkCodePhoneData.code) {
        _this.$message.error(_this.$t('mxpcweb.login.1528704734594')); return
      }
      let data = {
        mobile: phone,
        action: 'send', // 发送
        code: '',
        module: 'verifyIP'// 白名单验证
      }
      this.$http.post(this.Global.baseURL + this.Global.api.v2.verifySMS, data).then((res) => {
        if (res.body && res.body.code.toString() === _this.Global.RES_OK) {
          _this.$message.success(_this.$t('mxpcweb.login.1528704780895'))
          let time = _this.checkCodePhoneData.time
          _this.checkCodePhoneData.VerificationCodeButtonStatus = false
          let t = setInterval(() => {
            time--
            _this.checkCodePhoneData.time = time
            if (time == 0) {
              _this.checkCodePhoneData.time = 60
              _this.checkCodePhoneData.VerificationCodeButtonStatus = true
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
    // 短信验证码，确定提交
    checkCodePhoneSubmit () {
      let _this = this
      // 验证手机号
      let phone = ''
      if (checkPhone(_this.checkCodePhoneData.phone)) {
        phone = _this.checkCodePhoneData.areaCode + _this.checkCodePhoneData.phone
      } else {
        _this.$message.error(_this.$t('mxpcweb.login.1528704624877'))
        return
      }
      // 图片验证码是否通过
      if (_this.checkCodePhoneData.verificationCode == '') {
        _this.$message.error(_this.$t('mxpcweb.login.1528703017724')); return
      }
      if (_this.checkCodePhoneData.verificationCode != _this.checkCodePhoneData.code) {
        _this.$message.error(_this.$t('mxpcweb.login.1528704734594')); return
      }
      // 短信验证码
      if (_this.checkCodePhoneData.smsVerificationCode == '') {
        _this.$message.error(_this.$t('mxpcweb.login.1528703165210'))
        return
      }
      let data = {
        mobile: phone,
        action: 'check',
        code: _this.checkCodePhoneData.smsVerificationCode,
        module: 'verifyIP'
      }
      // 校验code
      this.$http.post(this.Global.baseURL + this.Global.api.v2.verifySMS, data).then((res) => {
        if (res.body && res.body.code.toString() === _this.Global.RES_OK) {
          let company = _this.companySelected
          this.enterSystem({
            company,
            localLanguage: getStore('language')
          })
          // setItem(_this.Global.accessToken, JSON.stringify(_this.companySelected.accessToken))// 将企业Token写入本地
          // setStore('company', _this.companySelected)// 公司信息保存在本地
          // _this.checkCodePhoneData.dialogVisible = false // 关弹窗
          // _this.$router.push('/') // 跳转进企业
        } else {
          _this.$message.error(_this.$t(res.body))
        }
      }, (res) => {
        _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
      })
    },
    // 发送邮箱验证码
    sendCodeToMail () {
      let _this = this
      if (_this.checkCodeMailData.mail == '') {
        _this.$message.error(_this.$t('mxpcweb.login.1528705460673')); return
      }
      if (!checkEmail(_this.checkCodeMailData.mail)) {
        _this.$message.error(_this.$t('mxpcweb.login.1528708277382')); return
      }
      let data = {
        email: _this.checkCodeMailData.mail,
        action: 'send',
        code: '',
        module: 'verifyIP'
      }
      this.$http.post(this.Global.baseURL + this.Global.api.v2.verifyemail, data).then((res) => {
        // 邮箱验证码发送成功
        if (res.body && res.body.code.toString() == _this.Global.RES_OK) {
          _this.$message.success(_this.msg(res.body))
          _this.checkCodeMailData.btnStatus = false
          let time = _this.checkCodeMailData.time
          let t = setInterval(() => {
            time--
            _this.checkCodeMailData.time = time
            if (time == 0) {
              _this.checkCodeMailData.time = 60
              _this.checkCodeMailData.btnStatus = true
              clearInterval(t)
            }
          }, 1000)
        } else {
          _this.$message.error(_this.$t(res.body))
        }
      }, (res) => {
        _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
      })
    },
    // 邮箱验证码，确定提交
    checkCodeMailSubmit () {
      let _this = this
      if (!checkEmail(_this.checkCodeMailData.mail)) {
        _this.$message.error(_this.$t('mxpcweb.login.1528708277382'))
        return
      }
      let data = {
        email: _this.checkCodeMailData.mail,
        code: _this.checkCodeMailData.mailVerificationCode,
        action: 'check',
        module: 'verifyIP'
      }
      // 校验code
      this.$http.post(this.Global.baseURL + this.Global.api.v2.verifyemail, data).then((res) => {
        if (res.body && res.body.code.toString() === _this.Global.RES_OK) {
          let company = _this.companySelected
          this.enterSystem({
            company,
            localLanguage: getStore('language')
          })
          // setItem(_this.Global.accessToken, JSON.stringify(_this.companySelected.accessToken))// 将企业Token写入本地
          // setStore('company', _this.companySelected)// 公司信息保存在本地
          // _this.checkCodeMailData.dialogVisible = false // 关弹窗
          // _this.$router.push('/') // 跳转进企业
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
        case 'checkCodePhoneData':
          // this.checkCodePhoneData.phone = "";
          this.checkCodePhoneData.verificationCode = ''
          this.checkCodePhoneData.smsVerificationCode = ''
          break
        case 'checkCodeMailData':
          // this.checkCodeMailData.mail = "";
          this.checkCodeMailData.mailVerificationCode = ''
          break
      }
    },
    handleClose (done) {
      done()
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.checkCode {
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
