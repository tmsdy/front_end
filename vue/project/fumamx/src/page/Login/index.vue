<template>
    <div style="height:100%;">
        <div class="Login MXscroll" v-if="isLoginShow">
            <!-- 第二次改版 2018.09.01 -->
            <a href="/" class="reg_logo" title="孚盟MX"><i class="iconfont icon-logo"></i><span>孚盟软件旗下品牌</span></a>
            <div class="reg_img">
                <login-ad />
            </div>
            <div class="reg_box">
                <div class="reg_body">
                    <template v-if="!switchCompany">
                        <!-- 登录 -->
                        <h1>{{$t('mxpcweb.login.1528183839984')}}</h1>
                        <el-form :model="loginForm" :rules="loginFormRules" ref="loginForm" label-width="70px" class="loginForm" label-position="left">
                            <el-form-item :label="$t('mxpcweb.login.1528183907374')" prop="user">
                                <el-input size="large" v-model="loginForm.user" :placeholder="$t('mxpcweb.login.1528184527841')" @keyup.enter.native="clickLogin('loginForm')"></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('mxpcweb.login.1528184459617')" prop="pass">
                                <el-input size="large" v-model="loginForm.pass" type="password" @keyup.enter.native="clickLogin('loginForm')" :placeholder="$t('mxpcweb.login.1528184580539')"></el-input>
                            </el-form-item>

                            <!--第一次点击登录没有，失败就有了-->
                            <el-form-item :label="$t('mxpcweb.login.1528695648163')" v-if="loginForm.isShowVerificationCode" prop="newVerificationCode">
                                <!--请输入验证码-->
                                <el-input size="large" v-model="loginForm.newVerificationCode" style="width:118px;" @keyup.enter.native="clickLogin('loginForm')" :placeholder="$t('mxpcweb.login.1528695733514')"></el-input>
                                <div class="verificationCodeImgBox">
                                    <img :src="loginForm.verificationCodeImg" @click="loginFormVerificationCodeImg">
                                </div>
                            </el-form-item>
                            <!--语言 -->
                            <el-form-item :label="$t('mxpcweb.login.1528184680089')" prop="language">
                                <el-select size="large" v-model="loginForm.language" :placeholder="$t('mxpcweb.login.1528184757730')" style="width:100%;" @change="languageLabelChange()">
                                    <el-option v-for="item in languageList" :key="item.dictItemCode" :label="item.itemName" :value="item.itemValue"></el-option>
                                </el-select>
                            </el-form-item>
                            <!--区时-->
                            <!-- <el-form-item :label="$t('mxpcweb.login.1528186471248')" prop="timezone">
                <el-select size="large" v-model="loginForm.timezone" :placeholder="$t('mxpcweb.login.1528791436783')" style="width:100%;" @change="timezoneLabelChange()">
                  <el-option v-for="(item,index) in timezoneList" :key="index" :label="item.itemName" :value="item.itemEnName"></el-option>
                </el-select>
              </el-form-item> -->
                            <div class="getPWD">
                                <el-checkbox v-model="rememberPassword" @change="rememberPasswordChange()">{{ $t('mxpcweb.login.1528185072847') }}</el-checkbox>
                                <span class="getPWDtext text-hover" @click="$refs.forgotPassword.forgetPassworldPhoneData.dialogVisible = true">{{ $t('mxpcweb.login.1528185215760') }}</span>
                            </div>
                            <!--登录-->
                            <div>
                                <el-button size="large" :loading="windowLoading" v-buriedPoint='{"id":"submitLoginForm","data":"samplepg"}' type="primary" @click="clickLogin('loginForm')" class="widthFull transition_all">{{$t('mxpcweb.login.1528183839984')}}</el-button>
                            </div>
                            <div class="rightTopBtn">
                                <!-- 注册新企业 -->
                                <router-link tag="span" to="/companyregister" class="goRegister">
                                    <el-button size="large">{{$t('mxpcweb.login.1528183814659')}}</el-button>
                                </router-link>
                            </div>
                        </el-form>
                    </template>
                    <!-- 企业列表，当大于1个企业时显示 -->
                    <template v-else>
                        <h1>{{$t('mxpcweb.login.1528185828206')}}</h1>
                        <company-select @showPayment="showPaymentPage" :companySelectList="companySelectList" @toSelectCompany="serInf"></company-select>
                        <div class="rightTopBtn">
                            <el-button size="large" @click="backLogin">{{$t('mxpcweb.login.1528186245541')}}</el-button>
                        </div>
                    </template>
                </div>

                <!-- 底部版权 -->
                <div class="copyright">
                    <ul>
                        <li @click="fumamxClientDownload('Windows')">
                            <div class="tip">
                                <i class="iconfont icon-windows"></i>
                                <p>
                                    Windows
                                </p>
                            </div>
                            <div class="todo">
                                <i class="iconfont icon-download-line"></i>
                                <p>
                                    Windows{{$t('mxpcweb.login.1530770401422')}}
                                </p>
                            </div>
                        </li>
                        <li @click="fumamxClientDownload('Mac')">
                            <div class="tip">
                                <i class="iconfont icon-AppStore"></i>
                                <p>
                                    Mac
                                </p>
                            </div>
                            <div class="todo">
                                <i class="iconfont icon-download-line"></i>
                                <p>
                                    Mac{{$t('mxpcweb.login.1530770401422')}}
                                </p>
                            </div>
                        </li>

                        <li>
                            <div class="tip">
                                <i class="iconfont icon-mac"></i>
                                <p>
                                    iPhone
                                </p>
                            </div>
                            <div class="todo">
                                <img src="https://sf.fumamx.com/img/orig/2,49a3e45ff4ad">
                                <p>
                                    iPhone{{$t('mxpcweb.login.1530770401422')}}
                                </p>
                            </div>
                        </li>
                        <li>
                            <div class="tip">
                                <i class="iconfont icon-Android"></i>
                                <p>
                                    Android
                                </p>
                            </div>
                            <div class="todo">
                                <img :src="getAndroidQR()">
                                <!-- <i class="iconfont icon-download-line"></i> -->
                                <p>
                                    Android{{$t('mxpcweb.login.1530770401422')}}
                                </p>
                            </div>
                        </li>
                    </ul>
                    <div>
                        Copyright © 2019 Shanghai Fumasoft co.,Ltd.
                        <a href="http://www.miitbeian.gov.cn" target="_blank" style="margin-left:5px;">赣ICP备18002562号-4</a>
                    </div>
                </div>

            </div>

            <!-- 检查绑定，登录时，强制检查手机邮箱是否绑定 -->
            <check-binding ref="checkBinding" v-on:loginSuccess="loginSuccess"></check-binding>
            <!-- 忘记密码，找回密码 -->
            <forgot-password ref="forgotPassword" v-on:forgotPasswordAuth="forgotPasswordAuth"></forgot-password>
            <!-- 重置成新密码 -->
            <cover-password ref="coverPassword" :companySelected="companySelected"></cover-password>
            <!-- IP禁用，需手机、邮箱校验 -->
            <check-code ref="checkCode" :companySelected="companySelected"></check-code>
        </div>
        <paymentPage ref="payment"></paymentPage>
    </div>
</template>

<script>
import { getCookie, setCookie, getStore, encrypt, decrypt, downloadFile } from '@/libs/utils.js'
import getImgVerificationCode from './vue/getImgVerificationCode.js'
import checkBinding from './vue/checkBinding.vue'
import companySelect from './vue/companySelect.vue'
import forgotPassword from './vue/forgotPassword.vue'
import coverPassword from './vue/coverPassword.vue'
import checkCode from './vue/checkCode.vue'
import PaymentPage from '../CompanyRegister/Payment/index.vue'
import LoginAD from './vue/LoginAD.vue'

export default {
    name: 'Login',
    props: {},
    data() {
        let _this = this
        return {
            isLoginShow: true,
            windowLoading: false, // 加载中开关
            switchCompany: false, // 选企业框开关
            companySelected: {}, // 有且只有一个的企业数据
            languageList: [], // 语言列表
            timezoneList: [], // 时区列表
            tab: {
                tabIndex: 0
            },
            loginForm: {
                user: '',
                pass: '',
                newVerificationCode: '', // 用户输入的验证码
                verificationCode: '', // 服务端返回的验证码
                verificationCodeImg: '', // 验证码图片
                isShowVerificationCode: false,
                language: window.LOCALE,
                timezone: window.TIMEZONE
            },
            loginFormRules: {
                user: [
                    { required: true, message: _this.$t('mxpcweb.login.1528695896074'), trigger: 'blur' }, // 用户名不能为空
                    { min: 1, max: 50, message: _this.$t('mxpcweb.login.1528695924733'), trigger: 'blur' } // 长度不可多于50字节
                ],
                pass: [
                    { required: true, message: _this.$t('mxpcweb.login.1528695967186'), trigger: 'blur' }, // 密码不能为空
                    { min: 1, max: 50, message: _this.$t('mxpcweb.login.1528695924733'), trigger: 'blur' } // 长度不可多于50字节
                ],
                newVerificationCode: [
                    { required: true, message: _this.$t('mxpcweb.login.1528696000842'), trigger: 'blur' }
                ]
            },
            rememberPassword: false// 是否记住密码
        }
    },
    created() {
        // 读取cookie,设置用户名和密码
        if (getCookie('rememberPassword') === 'true') {
            this.rememberPassword = true
            let user = getCookie('user')
            let pass = getCookie('pass')
            if (user && pass) {
                this.loginForm.user = user
                this.loginForm.pass = decrypt(pass)
            }
        } else {
            this.rememberPassword = false
        }
        let language = getCookie('language')
        let timezone = getCookie('timezone')
        if (language && timezone) {
            this.loginForm.language = language
            this.loginForm.timezone = parseInt(timezone)
        }
    },
    mounted() {
        // 密码登录获取图片验证码
        this.getImgVerificationCode((imgData) => {
            this.loginForm.verificationCodeImg = imgData.imgUrl
            this.loginForm.verificationCode = imgData.code
        })
        this.languageChange() // 语言下拉
        this.timezoneChange() // 时区下拉
    },
    methods: {
        getAndroidQR() {
            let src = ''
            if (runtime == 'prod') {
                src = 'https://sf.fumamx.com/img/orig/1,45fb1bbd6959'
            } else {
                src = 'https://sf.fumamx.com/img/orig/3,45fd2c0199a3'
            }
            return src
        },
        // 显示开通支付页面
        showPaymentPage(currentCompany) {
            if (currentCompany != undefined && currentCompany != null && currentCompany.cId != undefined &&
                currentCompany.cId != null && currentCompany.cId > 0) {
                this.$refs.payment.showPage({ cId: currentCompany.cId, ctId: currentCompany.ctId, corpName: currentCompany.corpName, status: currentCompany.status })
                this.isLoginShow = false
            }
        },
        // 监听组件，密码重置成功，调登录
        forgotPasswordAuth(data) {
            this._auth(data)
        },
        // 切换语言
        languageLabelChange() {
            document.querySelector('html').setAttribute('lang', this.loginForm.language)
            document.querySelector('body').setAttribute('class', this.loginForm.language)
            this.$moment.locale(this.loginForm.language)
            this.$setI18nLanguage(this.loginForm.language)
        },
        // 切换时区
        timezoneLabelChange() {
            window.TIMEZONE = this.loginForm.timezone
            this.systimezone = this.loginForm.timezone
        },
        // 语言下拉
        languageChange() {
            let _this = this
            let url = this.Global.baseURL + this.Global.api.v2.dictionary + 'locallanguage'
            this.$http.get(url, { params: {} }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    this.languageList = res.body.data
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
            })
        },
        // 时区下拉
        timezoneChange() {
            let _this = this
            let url = this.Global.baseURL + this.Global.api.v2.dictionary + 'timezone'
            this.$http.get(url, { params: {} }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    this.timezoneList = res.body.data
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
            })
        },
        // 点击，返回登录
        backLogin() {
            this.loginForm.user = this.loginForm.pass = '' // 清空
            this.switchCompany = false // 切换弹窗
        },
        // 密码框处理
        passFocus(e) {
            e.target.type = 'password'
        },
        // 用户名密码登录，点击图片刷新验证码
        loginFormVerificationCodeImg() {
            let _this = this
            this.getImgVerificationCode((imgData) => {
                _this.loginForm.verificationCodeImg = imgData.imgUrl
                _this.loginForm.verificationCode = imgData.code
            })
        },
        // 监听绑定子组件事件，如果都绑定成功：
        loginSuccess() {
            let _this = this
            let companies = getStore('auth').companies

            // 检查如果为二级域名来登录的，则直接进相应系统
            let cId = window.cId
            if (cId !== '' && cId !== undefined) {
                for (var i = 0; i < companies.length; i++) {
                    if (companies[i].cId == cId) {
                        _this.serInf(companies[i])
                        return
                    }
                    if (i === companies.length - 1) {
                        _this.$message.warning(_this.$t('mxpcweb.login.1528696051510'))
                    }
                }
                return
            }

            // 否则接着选企业登入
            if (companies.length > 1) {
                // 多家企业，进弹窗组件选择
                _this.switchCompany = true
                _this.companySelectList = companies // 传给企业列表组件
            } else if (companies.length == 1) {
                // 只有一家企业，判断status是否进系统
                switch (companies[0].status) {
                    case -7:
                        this.$alert(_this.$t('mxpcweb.login.1528696098195'), {
                            confirmButtonText: _this.$t('mxpcweb.login.1528696139283'),
                            callback: action => {
                            }
                        })
                        break
                    case -6: // 同 -5  显示开通支付页面 （开通未付款、未开通）
                    case -5:
                        _this.showPaymentPage(companies[0]) // 显示开通支付页面
                        break
                    case -4: // 无角色
                        _this.$message.warning(_this.$t('mxpcweb.login.1528696175939'))
                        break
                    case -3: // IP限制，手机或邮箱验证
                        _this.$refs.checkCode.isShowPhone() // 弹出组件里手机号验证框
                        _this.companySelected = companies[0] // 当前企业组件传值
                        break
                    case -2: // IP禁止登录
                        _this.$message.warning(_this.$t('mxpcweb.login.1528696219483'))
                        break
                    case -1:
                        _this.$message.warning(_this.$t('mxpcweb.login.1528696245165'))
                        setTimeout(() => {
                            _this.loginForm.pass = '' // 清空
                        }, 1000)
                        break
                    case 0: // 要求全员重设密码
                        _this.$refs.coverPassword.isShow() // 弹出修改密码框
                        _this.companySelected = companies[0] // 当前企业传值
                        break
                    case 1:
                        _this.serInf(companies[0])
                        break
                }
            } else if (companies.length == 0) {
                // 没有企业，去注册
                this.$alert(_this.$t('mxpcweb.login.1528696258874'), _this.$t('mxpcweb.login.1528696474402'), {
                    confirmButtonText: _this.$t('mxpcweb.login.1528696139283'),
                    callback: action => {
                        if (action == 'confirm') {
                            _this.$router.push({ path: '/companyregister' })
                        }
                    }
                })
            }
        },
        // 调登录API
        _auth(data, fn) {
            let _this = this
            Object.assign(data, {
                refer: 'logon'
            })
            // 登录
            _this.windowLoading = true
            _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.auth, data).then((res) => {
                if (res.body && res.body.code.toString() === _this.Global.RES_OK) {
                    // 登录成功保存用户名密码到本地,实现记住密码功能
                    if (_this.rememberPassword) {
                        setCookie('rememberPassword', _this.rememberPassword, _this.Global.cookieConfig)
                        setCookie('pass', encrypt(data.pass), _this.Global.cookieConfig)
                        setCookie('user', data.user, _this.Global.cookieConfig)
                    }
                    setCookie('language', _this.loginForm.language, _this.Global.cookieConfig)
                    setCookie('timezone', _this.loginForm.timezone, _this.Global.cookieConfig)

                    setCookie('_t', res.body.data.accessToken.value, { path: '/', domain: (window.runtime === 'prod') ? '.fumamx.com' : '.laifuyun.com', secure: true }) // 用于行为跟踪

                    // 开始检查绑定情况。登录成功后需要：1、验证手机邮箱2、有没有企业，进行跳转
                    _this.$refs.checkBinding.checkBinding((status) => {
                        // 绑定一切成功时返回
                        if (status) {
                            fn && fn({
                                static: 'success'
                            })
                        }
                    })
                } else {
                    _this.$message({
                        showClose: true,
                        message: _this.msg(res.body),
                        duration: 3000,
                        type: 'error'
                    })
                    // 显示验证码
                    _this.loginForm.isShowVerificationCode = true
                    fn && fn({
                        static: 'fail'
                    })
                }
                _this.windowLoading = false
            }, (res) => {
                _this.$message({
                    showClose: true,
                    message: _this.$t('mxpcweb.login.1528696611714'),
                    duration: 3000,
                    type: 'error'
                })
                _this.windowLoading = false
            })
        },
        // 提交登录表单
        clickLogin(formName) {
            let _this = this
            this.$refs[formName].validate(valid => {
                if (valid) {
                    // 校验验证码，默认没有，有的时候就要校验
                    if (_this.loginForm.isShowVerificationCode) {
                        if (_this.loginForm.newVerificationCode != _this.loginForm.verificationCode) {
                            _this.$message({
                                showClose: true,
                                message: _this.$t('mxpcweb.login.1528696678636'),
                                duration: 3000,
                                type: 'error'
                            })
                            return
                        }
                    }
                    let data = {
                        user: _this.loginForm.user,
                        pass: _this.loginForm.pass,
                        refer: ''
                    }
                    _this._auth(data, (option) => {
                        if (option.static == 'fail') {
                            // 刷新验证码
                            _this.getImgVerificationCode((imgData) => {
                                _this.loginForm.verificationCodeImg = imgData.imgUrl
                                _this.loginForm.verificationCode = imgData.code
                            })
                        }
                    })
                } else {
                    return false
                }
            })
        },
        // 获取图片验证码基础方法
        getImgVerificationCode,
        usePhoneSwitchImg() {
            let _this = this
            // 获取图片验证码
            this.getImgVerificationCode((imgData) => {
                _this.forgetPassworldPhoneData.codeImgUrl = imgData.imgUrl
                _this.forgetPassworldPhoneData.code = imgData.code
            })
        },
        // 设置信息
        serInf(company) {
            this.enterSystem({
                company,
                localLanguage: this.loginForm.language
            })
        },
        // 是否记住密码
        rememberPasswordChange() {
            setCookie('rememberPassword', this.rememberPassword, this.Global.cookieConfig)
        },
        fumamxClientDownload(type) {
            if (type === 'Windows') {
                if (runtime === 'test' || runtime === 'sim') {
                    if (navigator.userAgent.indexOf('64') !== -1) { // 64位
                        downloadFile('https://static.laifuyun.com/fumamx-client/test/win/64/孚盟MX Setup 1.1.3.exe')
                    } else { // 32位
                        downloadFile('https://static.laifuyun.com/fumamx-client/test/win/32/孚盟MX Setup 1.1.3.exe')
                    }
                } else if (runtime === 'prod') {
                    if (navigator.userAgent.indexOf('64') !== -1) { // 64位
                        downloadFile('https://static.laifuyun.com/fumamx-client/prod/win/64/孚盟MX Setup 1.1.3.exe')
                    } else { // 32位
                        downloadFile('https://static.laifuyun.com/fumamx-client/prod/win/32/孚盟MX Setup 1.1.3.exe')
                    }
                }
            } else if (type === 'Mac') {
                if (runtime === 'test') {
                    downloadFile('https://static.laifuyun.com/fumamx-client/test/darwin/64/孚盟MX-1.1.0.dmg')
                } else if (runtime === 'prod') {
                    downloadFile('https://static.laifuyun.com/fumamx-client/prod/darwin/64/孚盟MX-1.1.0.dmg')
                }
            }
        }
    },
    components: {
        'check-binding': checkBinding,
        'company-select': companySelect,
        'forgot-password': forgotPassword,
        'cover-password': coverPassword,
        'check-code': checkCode,
        'paymentPage': PaymentPage,
        'login-ad': LoginAD
    }
}
</script>
<style lang="less" rel="stylesheet/less">
@import "./zh-cn.less";
@import "./en.less";
</style>
