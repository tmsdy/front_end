<template>
  <div class="CompanyRegister">

    <template v-if="isRegShow">
      <a href="/" class="reg_logo" title="孚盟MX"><i class="iconfont icon-logo"></i><span>孚盟软件旗下品牌</span></a>
      <div class="reg_img">
        <img src="https://sf.fumamx.com/img/orig/1,05b1bd1e77be">
      </div>
      <div class="reg_box">
        <div class="reg_body">

          <!-- 输手机，点下一步 -->
          <template v-if="VerificationEnterpriseisShow">
            <!--企业注册-->
            <h1>{{$t('mxpcweb.companyregister.1528869946624')}}</h1>
            <el-form label-width="63px" label-position="left">
              <!-- 手机号 -->
              <el-form-item :label="$t('mxpcweb.companyregister.1534232054869')" prop="">
                <el-input size="large" :placeholder="$t('mxpcweb.companyregister.1528870083974')" v-model="phone">
                  <el-select v-model="areaCode" slot="prepend" :placeholder="$t('mxpcweb.companyregister.1528870127866')" style="width:88px;">
                    <el-option label="+86" value=""></el-option>
                    <el-option label="+81" value="81,"></el-option>
                    <el-option label="+1" value="1,"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
              <!-- 验证码 -->
              <el-form-item :label="$t('mxpcweb.companyregister.1534232091237')" prop="">
                  <!--请输入验证码-->
                  <el-input v-model="verificationCode" size="large" style="width:140px;" :placeholder="$t('mxpcweb.companyregister.1528870171411')"></el-input>

                  <span class="pull-right">
                    <el-button type="primary" size="large" style="width:145px" class="transition_all" @click="_getValidateCode()" v-show="validateCode.isShowVC">
                      <!--获取验证码-->
                      {{$t('mxpcweb.companyregister.1528870195783')}}
                    </el-button><i></i>
                    <el-button type="primary" size="large" style="width:110px" @keyup.enter.native="_next()" v-show="!validateCode.isShowVC" :disabled="true">{{ validateCode.time }} S</el-button>
                  </span>
              </el-form-item>

              <el-form-item label="" prop="">
                <div style="margin:-6px 0 1px;line-height:22px;">
                  <el-checkbox v-model="agreeIdea">{{ $t('mxpcweb.companyregister.1528870256600') }}</el-checkbox>
                  <span class="text-blue text-hover" @click="agreeIdeaClick()">《{{ $t('mxpcweb.companyregister.1528870298523') }}》</span>
                </div>
              </el-form-item>
              <!--下一步-->
              <div class="text-center">
                <el-button type="primary" size="large" class="widthFull transition_all" @click="_next()" :disabled="!agreeIdea">{{ $t('mxpcweb.companyregister.1528870350294') }}</el-button>
              </div>
            </el-form>
            <!-- 返回登录 -->
            <router-link tag="div" class="rightTopBtn" to="/login">
              <el-button size="large">{{ $t('mxpcweb.companyregister.1528870020042') }}</el-button>
            </router-link>
          </template>

          <!-- 选企业/登录企业-->
          <template v-if="isEnterpriseSelectShow">
            <!--您已注册以下企业-->
            <h1>{{$t('mxpcweb.companyregister.1528869892420')}}</h1>
            <company-select @showPayment="showPaymentPage" :companySelectList="companySelectList" v-on:toSelectCompany="toSelectCompany"></company-select>
            <div class="text-center" style="margin-top:28px;">
              <!--继续注册企业-->
              <el-button size="large" @click="_newEnterprises">{{$t('mxpcweb.companyregister.1528869919793')}}</el-button>
            </div>
          </template>

          <!-- 注册企业，信息录入 -->
          <template v-if="CompanyRegisterisShow">
            <!--企业注册-->
            <h1>{{$t('mxpcweb.companyregister.1528869946624')}}
              <router-link tag="span" to="/login" class="pull-right text-hover">{{ $t('mxpcweb.companyregister.1528870020042') }}</router-link>
            </h1>
            <el-form :model="companyInf" :rules="companyInfRules" ref="companyInfForm" label-width="85px" label-position="left">
              <!--企业名称-->
              <el-form-item :label="$t('mxpcweb.companyregister.1534231856599')" prop="name">
                <!--要注册的企业名称-->
                <el-input size="large" v-model="companyInf.name" :placeholder="$t('mxpcweb.companyregister.1528870400206')" :disabled="companyNameDisabled"></el-input>
              </el-form-item>
              <!--企业域名-->
                <!--企业二级域名-->
              <!-- <el-form-item :label="$t('mxpcweb.companyregister.1528870434080')" prop="prefix">
                <el-input size="large" :placeholder="$t('mxpcweb.companyregister.1528870479383')" v-model="companyInf.prefix" style="width:275px;">
                  <template slot="append">
                    <span style="color:#222;">.fumamx.com</span>
                  </template>
                </el-input>
              </el-form-item> -->
              <!--您的姓名-->
              <el-form-item :label="$t('mxpcweb.companyregister.1528870511664')" :prop="isProp.realName">
                <el-input size="large" v-model="companyInf.realName" :disabled="disabled.realName" :placeholder="$t('mxpcweb.companyregister.1528870540695')"></el-input>
              </el-form-item>
              <!--昵称/称谓-->
              <el-form-item :label="$t('mxpcweb.companyregister.1528870565538')" prop="nickName">
                <!--昵称/称谓-->
                <el-input size="large" v-model="companyInf.nickName" :disabled="disabled.nickName" :placeholder="$t('mxpcweb.companyregister.1528870587327')" @keyup.enter.native="_submitForm('companyInfForm')"></el-input>
              </el-form-item>
              <!--邮箱-->
              <el-form-item :label="$t('mxpcweb.companyregister.1528870610106')" :prop="isProp.email">
                <el-input size="large" v-model="companyInf.email" :disabled="disabled.email" :placeholder="$t('mxpcweb.companyregister.1528870692734')"></el-input>
              </el-form-item>
              <!--用户名-->
              <el-form-item :label="$t('mxpcweb.companyregister.1528870724830')" :prop="isProp.userName">
                <!--请输入登录用户名-->
                <el-input size="large" v-model="companyInf.userName" :disabled="disabled.userName" :placeholder="$t('mxpcweb.companyregister.1528870746683')"></el-input>
              </el-form-item>
              <!--密码-->
              <el-form-item :label="$t('mxpcweb.companyregister.1528870768818')" :prop="isProp.password">
                <!--请输入登录密码-->
                <el-input size="large" type="password" v-model="companyInf.password" :disabled="disabled.password" :placeholder="$t('mxpcweb.companyregister.1528870793980')" @keyup.enter.native="_submitForm('companyInfForm')"></el-input>
              </el-form-item>
              <el-form-item>
                <!--立刻创建-->
                <el-button size="large" class="transition_all" style="width:130px;margin-top:15px;" type="primary" :loading="isCompanyRegister" @click="_submitForm('companyInfForm')">{{$t('mxpcweb.companyregister.1528870883536')}}</el-button>
                <!--重置-->
                <el-button size="large" class="transition_all pull-right" style="width:130px;margin-top:15px;" @click="_resetForm('companyInfForm')">{{$t('mxpcweb.companyregister.1528870900603')}}</el-button>
              </el-form-item>
            </el-form>
          </template>

        </div>

        <!-- 底部版权 -->
          <div class="copyright">
            <div>
              Copyright © 2018 Shanghai Fumasoft co.,Ltd.
              <a href="http://www.miitbeian.gov.cn" target="_blank" style="margin-left:5px;">沪ICP备12009685号-4</a>
            </div>
          </div>
      </div>
    </template>

    <paymentPage ref="payment"></paymentPage>
  </div>
</template>

<script>
import { setStore, getStore, setCookie, setItem, trim, checkInitial, checkEmail, checkPWD } from '@/libs/utils.js'
import companySelect from '../Login/vue/companySelect.vue'
import PaymentPage from './Payment/index.vue'
export default {
  name: 'CompanyRegister',
  props: {},
  data () {
    let _this = this
    // 用户名验证
    var validatorUsername = (rule, value, callback) => {
      value = trim(value, 'g') // 去所有空格
      if (!checkInitial(value)) {
        callback(new Error(_this.$t('mxpcweb.companyregister.1528873137155')))
      } else if (checkEmail(value)) {
        callback(new Error(_this.$t('mxpcweb.companyregister.1528873198057')))
      } else {
        callback()
      }
    }
    // var validatorPrefix = (rule, value, callback) => {
    //   if (!checkInitial(value)) {
    //     callback(new Error(_this.$t('mxpcweb.companyregister.1528873137155')))
    //   } else {
    //     callback()
    //   }
    // }
    var validatorEmail = (rule, value, callback) => {
      if (value == '') {
        callback(new Error(_this.$t('mxpcweb.companyregister.1528870692734')))
      } else {
        if (checkEmail(value)) {
          callback()
        } else {
          callback(new Error(_this.$t('mxpcweb.companyregister.1528873281898')))
        }
      }
    }
    // 密码
    var validatePass = (rule, value, callback) => {
      if (!checkPWD(value)) {
        callback(new Error(_this.$t('mxpcweb.companyregister.1528873310195')))
      } else {
        callback()
      }
    }
    return {
      isCompanyRegister: false,
      tempOfflineNo: '',
      companyNameDisabled: false,
      agreeIdea: true, // 协议
      isRegShow: true,
      isEnterpriseSelectShow: false,
      VerificationEnterpriseisShow: true,
      CompanyRegisterisShow: false,
      areaCode: '', // 国际区号
      phone: '', // 手机
      validateCode: {
        isShowVC: true,
        time: 60
      },
      verificationCode: '', // 验证码
      companyInf: {
        mobile: '', // 手机号
        name: '', // 企业名称
        // prefix: '', // 域名前缀
        realName: '', // 您的姓名 realName
        email: '', // 邮箱
        userName: '', // 登录用户名
        password: '', // 密码
        nickName: '' // 昵称
      },
      companyInfRules: {
        name: [
          { required: true, message: _this.$t('mxpcweb.companyregister.1528873647693'), trigger: 'blur' },
          { min: 0, max: 50, message: _this.$t('mxpcweb.companyregister.1528875730696', { a: 50 }), trigger: 'blur' }
        ],
        // prefix: [
        //   { required: true, message: _this.$t('mxpcweb.companyregister.1528873715682'), trigger: 'blur' },
        //   { validator: validatorPrefix, trigger: 'blur' }
        // ],
        realName: [
          { required: true, message: _this.$t('mxpcweb.companyregister.1528873740818'), trigger: 'blur' },
          { min: 0, max: 15, message: _this.$t('mxpcweb.companyregister.1528875730696', { a: 15 }), trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: _this.$t('mxpcweb.companyregister.1528875683860'), trigger: 'blur' },
          { min: 0, max: 12, message: _this.$t('mxpcweb.companyregister.1528875730696', { a: 12 }), trigger: 'blur' }
        ],
        email: [
          { required: true, message: _this.$t('mxpcweb.companyregister.1528875869180'), trigger: 'blur' },
          { validator: validatorEmail, trigger: 'blur' }
        ],
        userName: [
          { required: true, message: _this.$t('mxpcweb.companyregister.1528875915649'), trigger: 'blur' },
          { validator: validatorUsername, trigger: 'blur' }
        ],
        password: [
          { required: true, message: _this.$t('mxpcweb.companyregister.1528875948898'), trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      },
      disabled: {
        realName: false, // 您的姓名 sysAdminName
        email: false, // 邮箱 sysAdminEmail
        userName: false, // 登录用户名 sysAdminTitle
        password: false, // 密码
        nickName: false // 昵称
      },
      isProp: {
        realName: 'realName',
        email: 'email',
        userName: 'userName',
        password: 'password'
      },
      // 登录认证信息
      authInf: {},
      // 公司列表
      companies: []
    }
  },
  mounted () {
    this.authRegister() // url传参注册企业
  },
  methods: {
    // url传参注册企业
    authRegister () {
      var _this = this
      let urlObj = this.$route.query
      if (urlObj.fumakey && urlObj.fumakey != '') {
        this.companyNameDisabled = true
        _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.orderDetail, {
            params: { fumakey: urlObj.fumakey }
          }).then(res => {
            //  console.log(res)
              if (res.body.code.toString() == _this.Global.RES_OK && res.body.data.entity != null) {
                _this.tempOfflineNo = res.body.data.entity.offlineauthno
                this.companyInf.name = res.body.data.entity.companyname
              } else {
                _this.$message.error(_this.msg(res.body))
              }
            }, res => {
              _this.$message.error(_this.t(_this.$t(_this.Global.errorTitle)))
            }
          )
        setCookie('authRegister', urlObj)
      }
    },
    // 查找协议内容
    agreeIdeaClick () {
      let domain = this.Global.domain
      // console.log(domain)
      window.open(
        domain + '/pc/userLicenseAgreement',
        'newwindow',
        'height=700, width=800, top=100, left=300, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no'
      )
    },
    // 监听组件，进所选企业系统
    toSelectCompany (company) {
      this.enterSystem({
        company,
        localLanguage: getStore('language')
      })
    },
    // 去登录页面
    _gotoLogin () {
      this.$router.push('/login')
    },
    // 获取短信验证码
    _getValidateCode () {
      let _this = this
      if (this.phone == '') {
        this.$message(_this.$t('mxpcweb.companyregister.1528870083974'))
        return
      }
      if (!/^1[34578]\d{9}$/.test(this.phone)) {
        this.$message(_this.$t('mxpcweb.companyregister.1528871579128'))
        return
      }
      let phone = this.areaCode + this.phone
      // api
      let data = {
        mobile: phone,
        module: 'register', // 注册
        action: 'send', // 发送
        code: '' // 验证码
      }
      let baseURL = this.Global.baseURL
      this.$http.post(baseURL + this.Global.api.v2.verifySMS, data).then(
        res => {
          if (res.body && res.body.code.toString() == _this.Global.RES_OK) {
            _this.$message.success(_this.msg(res.body))
            _this.validateCode.isShowVC = false
            var time = _this.validateCode.time
            let t = setInterval(() => {
              time--
              _this.validateCode.time = time
              if (time == 0) {
                _this.validateCode.time = 60
                _this.validateCode.isShowVC = true
                clearInterval(t)
              }
            }, 1000)
          } else {
            _this.$message.error(_this.msg(res.body))
          }
        },
        res => {
          _this.$message.error(_this.$t('mxpcweb.companyregister.1528871727912'))
        }
      )
    },
    _next () {
      let _this = this
      if (this.phone == '') {
        this.$message(_this.$t('mxpcweb.companyregister.1528870083974'))
        return
      }
      if (!/^1[34578]\d{9}$/.test(this.phone)) {
        this.$message(_this.$t('mxpcweb.companyregister.1528871579128'))
        return
      }
      if (this.verificationCode == '') {
        this.$message(_this.$t('mxpcweb.companyregister.1528870171411'))
        return
      }
      // api
      let phone = this.areaCode + this.phone
      let verificationCode = this.verificationCode
      let data = {
        mobile: phone, // 手机号
        code: verificationCode, // 验证码
        module: 'register', // 注册
        action: 'check' // 认证
      }
      // 验证验证码
      this.$http
        .post(this.Global.baseURL + this.Global.api.v2.verifySMS, data)
        .then(
          res => {
            if (res.body.code.toString() == _this.Global.RES_OK) {
            // 调用登录接口
              _this.$http
                .post(_this.Global.baseURL + _this.Global.api.v2.auth, {
                  user: phone,
                  pass: verificationCode,
                  refer: 'register'
                })
                .then(
                  res => {
                    if (
                      res.body.code.toString() == _this.Global.RES_OK &&
                  res.body.data != ''
                    ) {
                      // 登录认证信息
                      _this.authInf = res.body.data
                      _this.isNewUser = false // 不是新用户，是个已经存在的用户
                      if (
                        res.body.data.companies &&
                    Array.isArray(res.body.data.companies) &&
                    res.body.data.companies.length > 0
                      ) {
                        // 有企业，选择企业
                        _this.VerificationEnterpriseisShow = false
                        _this.companies = res.body.data.companies
                        // console.log(res.body.data.companies)
                        _this.companySelectList = res.body.data.companies // 传给企业列表组件
                        _this.isEnterpriseSelectShow = true // 企业列表显示
                      } else {
                        // 没企业,去注册企业
                        _this.isEnterpriseSelectShow = false
                        _this.VerificationEnterpriseisShow = false
                        _this.CompanyRegisterisShow = true
                        // 显示默认回显得企业信息
                        _this._defaultEcho()
                      }
                    } else {
                      // 用户输入的是一个新的手机号，直接去企业注册
                      _this.isNewUser = true // 是一个新用户
                      _this.isEnterpriseSelectShow = false
                      _this.VerificationEnterpriseisShow = false
                      _this.CompanyRegisterisShow = true
                    }
                  },
                  res => {
                    _this.$message.error(_this.msg(_this.$t(_this.Global.errorTitle)))
                  }
                )
            } else {
              _this.$message.error(_this.msg(res.body))
            }
          },
          res => {
            _this.$message.error(_this.msg(_this.$t(_this.Global.errorTitle)))
          }
        )
    },
    /**
     * 提交企业注册信息
     * 先验证是否新手机号（手机短信后调登录）
     * 新号就 accountAdd 后写入 Cookie 再注册企业
     * 老号已记录 Cookie 就注册企业
     * 企业注册成功，记录公司Token，直接进企业
     */
    async _submitForm (formName) {
      let _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          _this.companyInf.mobile = _this.phone

          function add () {
            // 调用注册企业接口,注册成功，返回的数据中是：企业对象，不是（没有）令牌对象，因此这里不能保存企业accessToken
            _this.isCompanyRegister = true
            _this.$http.post(
                _this.Global.baseURL +
              _this.Global.api.CompanyRegister.companyAdd,
                _this.companyInf
              ).then(
                res => {
                  if (
                    res.body.code.toString() == _this.Global.RES_OK &&
                  res.body.data &&
                  Array.isArray(res.body.data.companies) &&
                  res.body.data.companies.length > 0
                  ) {
                    _this.$message.success(_this.msg(res.body))
                    // 企业注册成功，记录公司Token，直接进企业
                    let currentCompany = res.body.data.companies[0]
                    if (
                      _this.tempOfflineNo != undefined &&
                    _this.tempOfflineNo != null &&
                    _this.tempOfflineNo != ''
                    ) {
                    // 如果有直接离线开通的信息
                      console.log('got the auth no')
                      _this.$refs.payment.initOfflineInfo(
                        _this.tempOfflineNo,
                        currentCompany
                      )
                      _this.$refs.payment.offlineCreateAuth()
                    } else {
                      _this.showPaymentPage(currentCompany) // 显示开通支付页面
                    }
                  } else {
                    _this.$message.error(_this.msg(res.body))
                  }
                  _this.isCompanyRegister = false
                },
                res => {
                  _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
                  _this.isCompanyRegister = false
                }
              )
          }

          if (_this.isNewUser) {
            // 是新用户
            let data = {
              email: _this.companyInf.email,
              mobile: _this.companyInf.mobile,
              userName: _this.companyInf.userName,
              password: _this.companyInf.password,
              realName: _this.companyInf.realName,
              flags: 1
            }
            _this.$http
              .post(
                _this.Global.baseURL + _this.Global.api.v2.account_add,
                data
              )
              .then(res => {
                if (
                  res.body.code.toString() == _this.Global.RES_OK &&
                  res.body.data &&
                  res.body.data.accessToken
                ) {
                  // 存全部登录信息
                  setStore('auth', res.body.data)
                  // 将个人Token写入本地
                  if (res.body.data.accessToken) {
                    setItem(
                      _this.Global.individualAccessToken,
                      JSON.stringify(res.body.data.accessToken)
                    )
                  }
                  add()
                } else {
                  _this.isNewUser = true // 出现各种注册失败，依然是新企业
                  _this.$message.error(_this.msg(res.body))
                }
              })
          } else {
            add()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * 显示开通支付页面
     */
    showPaymentPage (currentCompany) {
      if (
        currentCompany != undefined &&
        currentCompany != null &&
        currentCompany.cId != undefined &&
        currentCompany.cId != null &&
        currentCompany.cId > 0
      ) {
        this.$refs.payment.showPage({
          cId: currentCompany.cId,
          ctId: currentCompany.ctId,
          corpName: currentCompany.corpName,
          status: currentCompany.status
        })
        this.isRegShow = false
      }
    },
    _resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 继续注册新企业
    _newEnterprises () {
      let _this = this
      _this.isEnterpriseSelectShow = false
      _this.VerificationEnterpriseisShow = false
      _this.CompanyRegisterisShow = true
      _this._defaultEcho()
    },
    // 填写企业注册信息默认显示
    _defaultEcho () {
      let _this = this
      // 给表单设置默认显示值,并设置值
      Object.keys(_this.disabled).forEach(function (key) {
        // 设置密码，如果等于X禁用
        if (key == 'password' && _this.authInf[key] == 'X') {
          _this.companyInf[key] = _this.authInf[key]
          _this.disabled[key] = true
          _this.isProp[key] = '' // 解除验证
        } else if (_this.authInf[key] && _this.authInf[key] != '') {
          _this.companyInf[key] = _this.authInf[key]
          _this.disabled[key] = true
          _this.isProp[key] = '' // 解除验证
        }
      })
    }
  },
  components: {
    'company-select': companySelect,
    paymentPage: PaymentPage
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../less/base.less";
@import "./zh-cn.less";
@import "./en.less";
</style>
