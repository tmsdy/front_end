<template>
    <div class="BasicSet">

        <!--  修改用户名  -->
        <!-- 用户名 -->
        <div class="input_title">{{$t('mxpcweb.systemset.accountsettings.1530510667050')}}</div>
        <div class="input_line">
            <!-- 修改 -->
            <el-button type="primary" class="pull-right" @click="isShowCurrent = isShowCurrent == 1 ? 0 : 1; clearInput()">
                {{$t('mxpcweb.systemset.accountsettings.1530251374036')}}
                <i class="iconfont" :class="[isShowCurrent == 1 ? 'icon-page-up' : 'icon-page-down']"></i>
            </el-button>

            <div class="text">
                <!-- 您的登录用户名为 -->
                <span>{{$t('mxpcweb.systemset.accountsettings.1530510855285')}}</span>
                <span class="text-red">{{updateUserName.userName}}</span>
            </div>
            <el-form v-if="isShowCurrent == 1" :model="updateUserName" :rules="rulesUpdateUserName" ref="updateUserName" label-width="88px" label-position="left">
                <!-- 新用户名 -->
                <el-form-item :label="$t('mxpcweb.systemset.accountsettings.1530581824120')" prop="userName2">
                    <!-- 首位以字母开头不少于4位 -->
                    <el-input v-model="updateUserName.userName2" @keyup.enter.native="updateUserNameFn('updateUserName')" auto-complete="off" :placeholder="$t('mxpcweb.systemset.accountsettings.1530581852923')" style="width:280px;"></el-input>
                </el-form-item>
                <el-form-item label="" prop="">
                    <el-button size="large" style="width:100px;" type="primary" @click="updateUserNameFn('updateUserName')">
                        <!-- 确 定 -->{{$t('mxpcweb.systemset.accountsettings.1530581899578')}}</el-button>
                    <el-button size="large" style="width:100px;" @click="closeInput()">{{$t('mxpcweb.systemset.bizfield.1530338879661')}}</el-button><!-- 取消 -->
                </el-form-item>
            </el-form>
        </div>

        <!-- 绑定邮箱弹窗 -->
        <!-- 绑定邮箱 -->
        <div class="input_title">{{$t('mxpcweb.systemset.accountsettings.1530511239016')}}
            <small>
                <!-- （方便邮件通知您各种提醒、邮箱找回密码等） -->{{$t('mxpcweb.systemset.accountsettings.1530511358175')}}</small>
        </div>
        <div class="input_line">
            <el-button type="primary" class="pull-right" @click="isShowCurrent = isShowCurrent == 2 ? 0 : 2; clearInput()">
                <!-- 修改 -->
                {{$t('mxpcweb.systemset.accountsettings.1530251374036')}}
                <i class="iconfont" :class="[isShowCurrent == 2 ? 'icon-page-up' : 'icon-page-down']"></i>
            </el-button>

            <div class="text">
                <template v-if="bindingMail.state == '0' || bindingMail.state == ''">
                    <span>
                        <!-- 暂未绑定 -->{{$t('mxpcweb.systemset.accountsettings.1530511415388')}}</span>
                </template>
                <template v-else-if="bindingMail.state == '1'">
                    <span>
                        <!--  您的邮箱-->{{$t('mxpcweb.systemset.accountsettings.1530582365841')}}</span>
                    <span class="text-black">{{bindingMail.mail}}</span>
                    <span>
                        <!--未验证  -->{{$t('mxpcweb.systemset.accountsettings.1530582390754')}}</span>
                </template>
                <template v-else>
                    <span>
                        <!-- 您绑定的邮箱为 -->{{$t('mxpcweb.systemset.accountsettings.1530582438462')}}</span>
                    <span class="text-red">{{bindingMail.mail}}</span>
                </template>
            </div>

            <el-form v-if="isShowCurrent == 2" :model="bindingMail" :rules="rulesBindingMail" ref="bindingMail" label-width="88px" label-position="left">
                <!-- 邮 箱 -->
                <el-form-item :label="$t('mxpcweb.systemset.accountsettings.1530582487874')" prop="mail2" style="margin-bottom:18px;">
                    <!-- 请输入邮箱 -->
                    <el-input v-model="bindingMail.mail2" auto-complete="off" :placeholder="$t('mxpcweb.systemset.accountsettings.1530582534707')" style="width:280px;"></el-input>
                </el-form-item>
                <!-- 验证码 -->
                <el-form-item :label="$t('mxpcweb.systemset.accountsettings.1530582559340')" prop="code">
                    <!-- 请输入验证码 -->
                    <el-input :placeholder="$t('mxpcweb.systemset.accountsettings.1530582600130')" v-model="bindingMail.code" style="width:130px;"></el-input>
                    <!-- 发送验证码 -->
                    <el-button type="primary" @click="mailSendCode" style="width:145px;" v-show="bindingMail.btnIsShow">{{$t('mxpcweb.systemset.accountsettings.1530251428950')}}</el-button>
                    <i></i>
                    <el-button type="primary" :disabled="true" style="width:145px;color:#777;" v-show="!bindingMail.btnIsShow">{{bindingMail.countDown}} S</el-button>
                </el-form-item>
                <el-form-item label="" prop="">
                    <el-button size="large" style="width:100px;" type="primary" @click="bindingMailFn('bindingMail')">
                        <!-- 确 定 -->{{$t('mxpcweb.systemset.accountsettings.1530581899578')}}</el-button>
                    <el-button size="large" style="width:100px;" @click="closeInput()">{{$t('mxpcweb.systemset.bizfield.1530338879661')}}</el-button><!-- 取消 -->
                </el-form-item>
            </el-form>
        </div>

        <!-- 绑定手机弹窗  -->
        <div class="input_title">
            <!-- 绑定手机 -->{{$t('mxpcweb.systemset.accountsettings.1530582689374')}}
            <!-- 方便短信通知提醒和找回密码 -->
            <small>{{$t('mxpcweb.systemset.accountsettings.1530251650309')}}</small>
        </div>
        <div class="input_line">
            <!-- 修改 -->
            <el-button type="primary" class="pull-right" @click="isShowCurrent = isShowCurrent == 3 ? 0 : 3; clearInput()">
                {{$t('mxpcweb.systemset.accountsettings.1530251374036')}}
                <i class="iconfont" :class="[isShowCurrent == 3 ? 'icon-page-up' : 'icon-page-down']"></i>
            </el-button>

            <div class="text">
                <template v-if="bindingPhone.state == '0' || bindingPhone.state == ''">
                    <span>
                        <!-- 暂未绑定 -->{{$t('mxpcweb.systemset.accountsettings.1530511415388')}}</span>
                </template>
                <template v-else-if="bindingPhone.state == '1'">
                    <span>
                        <!-- 您的手机号 -->{{$t('mxpcweb.systemset.accountsettings.1530582740007')}}</span>
                    <span class="text-black">{{bindingPhone.number}}</span>
                    <span>
                        <!-- 未验证 -->{{$t('mxpcweb.systemset.accountsettings.1530582390754')}}</span>
                </template>
                <template v-else>
                    <span>
                        <!-- 您绑定的手机号码为 -->{{$t('mxpcweb.systemset.accountsettings.1530582769233')}}</span>
                    <span class="text-red">{{bindingPhone.number}}</span>
                </template>
            </div>

            <el-form v-if="isShowCurrent == 3" :model="bindingPhone" :rules="rulesBindingPhone" ref="bindingPhone" label-width="88px" label-position="left">
                <!-- 手机号 -->
                <el-form-item :label="$t('mxpcweb.systemset.accountsettings.1530582805894')" prop="number2" style="margin-bottom:18px;">
                    <!--请输入手机号 -->
                    <el-input v-model="bindingPhone.number2" auto-complete="off" :placeholder="$t('mxpcweb.systemset.accountsettings.1530582845557')" style="width:280px;"></el-input>
                </el-form-item>
                <!-- 验证码 -->
                <el-form-item :label="$t('mxpcweb.systemset.accountsettings.1530582559340')" prop="code">
                    <!-- 请输入验证码 -->
                    <el-input :placeholder="$t('mxpcweb.systemset.accountsettings.1530582600130')" v-model="bindingPhone.code" style="width:145px;"></el-input>
                    <!-- 发送验证码 -->
                    <el-button type="primary" @click="phoneSendCode('bindingPhone')" style="width:130px;" v-show="bindingPhone.btnIsShow">{{$t('mxpcweb.systemset.accountsettings.1530251428950')}}</el-button>
                    <i></i>
                    <el-button type="primary" :disabled="true" style="width:130px;color:#777;" v-show="!bindingPhone.btnIsShow">{{bindingPhone.countDown}} S</el-button>
                </el-form-item>
                <el-form-item label="" prop="">
                    <el-button size="large" style="width:100px;" type="primary" @click="bindingPhoneFn('bindingPhone')">
                        <!-- 确 定 -->{{$t('mxpcweb.systemset.accountsettings.1530581899578')}}</el-button>
                    <el-button size="large" style="width:100px;" @click="closeInput()">{{$t('mxpcweb.systemset.bizfield.1530338879661')}}</el-button><!-- 取消 -->
                </el-form-item>
            </el-form>
        </div>

        <!--  锁屏时间  -->
        <div class="input_title">
            <!-- 自动锁屏 -->{{$t('mxpcweb.systemset.accountsettings.1530582958648')}} </div>
        <div class="input_line">
            <!-- 修改 -->
            <el-button type="primary" class="pull-right" @click="isShowCurrent = isShowCurrent == 4 ? 0 : 4">
                {{$t('mxpcweb.systemset.accountsettings.1530251374036')}}
                <i class="iconfont" :class="[isShowCurrent == 4 ? 'icon-page-up' : 'icon-page-down']"></i>
            </el-button>
            <div class="text">
                <!--不锁屏-->
                <span v-if="lockScreen.time == '0' || lockScreen.time == ''">{{$t('mxpcweb.systemset.accountsettings.1530583304104')}}</span>
                <template v-else>
                    <!-- 当超过<span class="text-red">{0}</span>分钟不操作系统时将自动锁屏 -->
                    <span v-html="$t('mxpcweb.systemset.accountsettings.1530694408075',[lockScreen.time])"></span>
                </template>

                <div class="time_slider" v-if="isShowCurrent == 4">
                    <el-slider style="margin:0 20px -5px;" v-model="lockScreen.time2" @change="lockScreenFn" :step="15" :min="0" :max="120" :format-tooltip="formatTooltip" show-stops></el-slider>
                    <span>
                        <!-- 不锁屏 -->{{$t('mxpcweb.systemset.accountsettings.1530583304104')}}</span>
                    <span class="pull-right">
                        <!--120分钟 -->{{$t('mxpcweb.systemset.accountsettings.1530583372162')}}</span>
                </div>
            </div>
        </div>

        <!--  修改密码  -->
        <div class="input_title">
            <!--  用户密码-->{{$t('mxpcweb.systemset.accountsettings.1530583397448')}}</div>
        <div class="input_line" style="border-bottom:none;">
            <!-- 修改 -->
            <el-button type="primary" class="pull-right" @click="isShowCurrent = isShowCurrent == 5 ? 0 : 5; clearInput()">
                {{$t('mxpcweb.systemset.accountsettings.1530251374036')}}
                <i class="iconfont" :class="[isShowCurrent == 5 ? 'icon-page-up' : 'icon-page-down']"></i>
            </el-button>

            <div class="text">********</div>

            <el-form v-if="isShowCurrent == 5" :model="updatePWD" :rules="rulesUpdatePWD" ref="updatePWD" label-width="88px" label-position="left">
                <!-- 原密码 -->
                <el-form-item :label="$t('mxpcweb.systemset.accountsettings.1530583427522')" prop="oldPass" style="margin-bottom:18px;">
                    <!--输入原密码  -->
                    <el-input type="password" v-model="updatePWD.oldPass" auto-complete="off" :placeholder="$t('mxpcweb.systemset.accountsettings.1530583466802')" style="width:280px;"></el-input>
                </el-form-item>
                <!-- 新密码 -->
                <el-form-item :label="$t('mxpcweb.systemset.accountsettings.1530583498562')" prop="pass" style="margin-bottom:18px;">
                    <!-- 长度至少6位，需要同时含字母加数字 -->
                    <el-input type="password" v-model="updatePWD.pass" auto-complete="off" :placeholder="$t('mxpcweb.systemset.accountsettings.1530583536230')" style="width:280px;"></el-input>
                </el-form-item>
                <!-- 确认密码 -->
                <el-form-item :label="$t('mxpcweb.systemset.accountsettings.1530583565562')" prop="checkPass" style="margin-bottom:18px;">
                    <!-- 确认新密码 -->
                    <el-input type="password" v-model="updatePWD.checkPass" auto-complete="off" :placeholder="$t('mxpcweb.systemset.accountsettings.1530583596674')" style="width:280px;"></el-input>
                </el-form-item>
                <el-form-item label="" prop="">
                    <el-button size="large" style="width:100px;" type="primary" @click="updatePWDFn('updatePWD')">
                        <!-- 确 定 -->{{$t('mxpcweb.systemset.accountsettings.1530581899578')}}</el-button>
                    <el-button size="large" style="width:100px;" @click="closeInput()">{{$t('mxpcweb.systemset.bizfield.1530338879661')}}</el-button><!-- 取消 -->
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script>
import { checkPhone, checkEmail, checkInitial, trim, checkPWD, isObject } from '@/libs/utils.js'
import { mapActions } from 'vuex'
export default {
    name: '',
    props: {
    },
    data() {
        // 用户名验证
        var validatorUsername = (rule, value, callback) => {
            value = trim(value, 'g') // 去所有空格
            let oldName = this.updateUserName.userName
            if (value === '') {
                /* 请输入新用户名 */
                callback(new Error(this.$t('mxpcweb.systemset.accountsettings.1530583669320')))
            } else if (value === oldName) {
                /* 不能和原用户名相同 */
                callback(new Error(this.$t('mxpcweb.systemset.accountsettings.1530583698688')))
            } else if (!checkInitial(value)) {
                /* 首位必须以字母开头 */
                callback(new Error(this.$t('mxpcweb.systemset.accountsettings.1530583726556')))
            } else if (checkEmail(value)) {
                /* 用户名不能为邮箱格式 */
                callback(new Error(this.$t('mxpcweb.systemset.accountsettings.1530583754568')))
            } else {
                callback()
            }
        }
        // 验证手机号
        var validatorMobile = (rule, value, callback) => {
            if (checkPhone(value)) {
                callback()
            } else {
                /* 手机号码格式不正确！ */
                callback(new Error(this.$t('mxpcweb.systemset.accountsettings.1530583781616')))
            }
        }
        // 新密码
        var validatePass = (rule, value, callback) => {
            if (!checkPWD(value)) {
                /* 密码长度至少6位，需要同时含字母加数字 */
                callback(new Error(this.$t('mxpcweb.systemset.accountsettings.1530583808120')))
            } else {
                callback()
            }
        }
        // 确认密码
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                /* 请再次输入新密码 */
                callback(new Error(this.$t('mxpcweb.systemset.accountsettings.1530583835289')))
            } else if (value !== this.updatePWD.pass) {
                /* 两次输入密码不一致！ */
                callback(new Error(this.$t('mxpcweb.systemset.accountsettings.1530583862113')))
            } else {
                callback()
            }
        }
        return {
            isShowCurrent: 0,
            flags: '', // 手机邮件校验位
            updateUserName: { // 用户名及修改
                userName: '', // 用户名
                userName2: '' // 用户名修改
            },
            bindingMail: { // 绑定邮箱
                state: '', // 绑定状态，共3种
                countDown: 300, // 倒计时
                btnIsShow: true,
                mail: '', // 绑定的邮箱
                mail2: '', // 要修改
                code: ''
            },
            bindingPhone: { // 绑定手机号
                state: '', // 绑定状态，共3种
                countDown: 60, // 倒计时
                btnIsShow: true,
                number: '',
                number2: '',
                code: ''
            },
            lockScreen: { // 锁屏
                time: 0, // 锁屏时间
                time2: 0 // 弹窗调整的时间
            },
            updatePWD: { // 修改密码
                oldPass: '',
                pass: '',
                checkPass: ''
            },
            dingdingQRcode: { // 钉钉移动端
                mobile: false // 移动端，是否开通
            },
            // 表单验证
            rulesUpdateUserName: {
                userName2: [
                    /* 不能少于4位 */
                    { min: 4, max: 25, message: this.$t('mxpcweb.systemset.accountsettings.1530583892680'), trigger: 'blur' },
                    { validator: validatorUsername, trigger: 'blur' }
                ]
            },
            rulesBindingMail: {
                mail2: [
                    /* 请输入邮箱地址 */
                    { required: true, message: this.$t('mxpcweb.systemset.accountsettings.1530583916311'), trigger: 'blur' },
                    /* 请输入正确的邮箱地址！ */
                    { type: 'email', message: this.$t('mxpcweb.systemset.accountsettings.1530583987473'), trigger: 'blur,change' }
                ],
                code: [
                    /* 请输入验证码 */
                    { required: true, message: this.$t('mxpcweb.systemset.systemparameter.1530601063403'), trigger: 'blur' }
                ]
            },
            rulesBindingPhone: {
                number2: [
                    /* 请输入手机号 */
                    { required: true, message: this.$t('mxpcweb.systemset.accountsettings.1530582845557'), trigger: 'blur' },
                    { validator: validatorMobile, trigger: 'blur' }
                ],
                code: [
                    /* 请发送手机验证码 */
                    { required: true, message: this.$t('mxpcweb.systemset.accountsettings.1530584028888'), trigger: 'blur' }
                ]
            },
            rulesUpdatePWD: {
                oldPass: [
                    /* 请输入原密码 */
                    { required: true, message: this.$t('mxpcweb.systemset.accountsettings.1530584054543'), trigger: 'blur' }
                ],
                pass: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                checkPass: [
                    { validator: validatePass2, trigger: 'blur' }
                ]
            }
        }
    },
    created() {

    },
    mounted() {
        this.getLanguageZoneData() // 锁屏
        this.getPersonalData()
    },
    methods: {
        closeInput() {
            this.isShowCurrent = 0
            this.clearInput()
        },
        clearInput() {
            this.updateUserName.userName2 = this.bindingMail.mail2 = this.bindingMail.code = this.bindingPhone.number2 = this.bindingPhone.code = this.updatePWD.oldPass = this.updatePWD.pass = this.updatePWD.checkPass = ''
        },
        // 邮箱绑定的3种状态
        getMailState() {
            let flags = this.flags
            let mail = this.bindingMail.mail
            if (mail != '' && parseInt(flags) == 0) {
                this.bindingMail.state = '1'
            } else if (mail != '' && parseInt(flags) == 1) {
                this.bindingMail.state = '1'
            } else if (mail != '' && parseInt(flags) == 2) {
                this.bindingMail.state = '2'
            } else if (mail != '' && parseInt(flags) == 3) {
                this.bindingMail.state = '2'
            } else {
                this.bindingMail.state = '0'
            }
        },
        // 手机绑定的3种状态
        getPhoneState() {
            let flags = this.flags
            let number = this.bindingPhone.number
            if (number != '' && parseInt(flags) == 0) {
                this.bindingPhone.state = '1'
            } else if (number != '' && parseInt(flags) == 1) {
                this.bindingPhone.state = '2'
            } else if (number != '' && parseInt(flags) == 2) {
                this.bindingPhone.state = '1'
            } else if (number != '' && parseInt(flags) == 3) {
                this.bindingPhone.state = '2'
            } else {
                this.bindingPhone.state = '0'
            }
        },
        // 获取页面数据
        getPersonalData() {
            let _this = this
            let url = this.Global.baseURL + this.Global.api.SystemSet.personaldata.accountIndividualInf
            this.$http.get(url, { params: {} }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data)) {
                    let data = res.body.data
                    _this.flags = data.flags
                    this.updateUserName.userName = data.userName
                    this.bindingMail.mail = data.email
                    this.bindingPhone.number = data.mobile

                    _this.getMailState() // 邮箱绑定状态
                    _this.getPhoneState() // 手机绑定状态
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 获取锁屏时间，在语言时区接口
        getLanguageZoneData() {
            let _this = this
            let url = this.Global.baseURL + this.Global.api.SystemSet.accountsettings.personalsettingGet
            this.$http.get(url, { params: {} }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data)) {
                    let data = res.body.data
                    this.lockScreen.time = this.lockScreen.time2 = parseInt(data.minutesLockApp)
                } else {
                    _this.accountSet = []
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 修改用户名：
        updateUserNameFn(formName) {
            let _this = this
            let userNameNew = this.updateUserName.userName2
            // 表单验证：
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 更新数据
                    let urlApi = this.Global.baseURL + this.Global.api.SystemSet.personaldata.accountPut
                    let userNameJson = {
                        'userName': userNameNew,
                        'flags': _this.flags
                    }
                    this.$http.post(urlApi, userNameJson).then(function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            // console.log(res.body.data);
                            /* 修改成功 */
                            _this.$message({ message: this.$t('mxpcweb.systemset.accountsettings.1530584086728'), type: 'success' })
                            this.updateUserName.userName = userNameNew // 和页面同步一下
                            this.updateUserName.userName2 = ''
                        } else {
                            _this.$message.error(_this.msg(res.body))
                        }
                    }, function (res) {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    })
                } else {
                    /* 请检查表单！ */
                    // this.$message({ message: this.$t('mxpcweb.mai.sys.acc.checkForm'), type: 'warning' });
                    return false
                }
            })
        },
        // 绑定邮箱，弹窗开
        // mailWinOpen() {
        //     let state = this.bindingMail.state;
        //     if (state == '1') {
        //         this.bindingMail.mail2 = this.bindingMail.mail; //状态识别判断
        //     } else if (state == '2') {
        //     } else {
        //         this.bindingMail.mail2 = ""; //清空
        //     }
        // },
        // 绑定邮箱，点确定
        bindingMailFn(formName) {
            let _this = this
            let mail = this.bindingMail.mail2
            let mailCode_new = this.bindingMail.code
            let flags
            switch (this.flags) {
                case 0:
                    flags = 2
                    break
                case 1:
                    flags = 3
                    break
                case 2:
                    flags = 2
                    break
                case 3:
                    flags = 3
            }
            // 表单验证：
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 验证码是否通过：
                    let urlApi = _this.Global.baseURL + _this.Global.api.UniversalInterface.verifyemail
                    let verifySMS_json = {
                        'email': mail,
                        'action': 'check',
                        'code': mailCode_new,
                        'module': 'bind'
                    }
                    this.$http.post(urlApi, verifySMS_json).then(function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            // 通过后，更新数据：
                            let urlApi_mail = _this.Global.baseURL + _this.Global.api.SystemSet.accountsettings.accountPut
                            let mail_json = {
                                'email': mail,
                                'flags': flags
                            }
                            this.$http.post(urlApi_mail, mail_json).then(function (res) {
                                if (res.body.code.toString() == _this.Global.RES_OK) {
                                    _this.bindingMail.mail = mail // 同步数据
                                    _this.$message({
                                        type: 'success',
                                        /* 绑定成功 */

                                        message: this.$t('mxpcweb.systemset.accountsettings.1530584145199')
                                    })

                                    // 状态更新
                                    let state = _this.bindingMail.state
                                    if (state == '1' || state == '0') {
                                        _this.bindingMail.state = '2'
                                    }

                                    // 清零
                                    mail = ''
                                    mailCode_new = ''
                                } else {
                                    _this.$message.error(_this.msg(res.body))
                                }
                            }, function (res) {
                                _this.$message.error(_this.$t(_this.Global.errorTitle))
                            })
                            // this.$message({ type: 'info', message: _this.msg(res.body) });
                        } else {
                            _this.$message.error(_this.msg(res.body))
                        }
                    }, function (res) {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    })
                } else {
                    /* 请检查你的表单！ */
                    // this.$message({ message: this.$t('mxpcweb.systemset.accountsettings.1530586352479'), type: 'warning' });
                    return false
                }
            })
        },
        // 发邮箱验证码：
        mailSendCode() {
            let _this = this
            let mail = this.bindingMail.mail2
            if (!checkEmail(mail)) {
                _this.$message.error(this.$t('mxpcweb.systemset.accountsettings.1530583987473')); return
            }
            // 开始发送验证码：
            let urlApi = _this.Global.baseURL + _this.Global.api.UniversalInterface.verifyemail
            let mail_json = {
                'email': mail,
                'action': 'send',
                'module': 'bind'
            }
            this.$http.post(urlApi, mail_json).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    // console.log(res.body.data.code);
                    /* 发送成功！请注意查收邮件！ */
                    _this.$message({ type: 'success', message: this.$t('mxpcweb.systemset.accountsettings.1530586508574') })
                    // 倒计时
                    _this.bindingMail.btnIsShow = false
                    let countDown = this.bindingMail.countDown
                    let t = setInterval(function () {
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
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 绑定手机，弹窗开
        // phoneWinOpen() {
        //     let state = this.bindingPhone.state;
        //     // console.log(state)
        //     if (state == '1') {
        //         this.bindingPhone.number2 = this.bindingPhone.number; //状态识别判断
        //     } else if (state == '2') {
        //     } else {
        //         this.bindingPhone.number2 = ""; //清空
        //     }
        // },
        // 绑定手机，点确定：
        bindingPhoneFn(formName) {
            let _this = this
            let phoneNum = this.bindingPhone.number2
            let verifySMS_new = this.bindingPhone.code
            if (phoneNum == _this.bindingPhone.number) {
                _this.$message.error('不能绑定现有手机号！'); return
            }
            let flags
            switch (this.flags) {
                case 0:
                    flags = 1
                    break
                case 1:
                    flags = 1
                    break
                case 2:
                case 3:
                    flags = 3
                    break
            }
            // 表单验证：
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 验证码是否通过：
                    let urlApi = _this.Global.baseURL + _this.Global.api.UniversalInterface.verifySMS
                    let verifySMS_json = {
                        'mobile': phoneNum,
                        'action': 'check',
                        'code': verifySMS_new,
                        'module': 'bind'
                    }
                    this.$http.post(urlApi, verifySMS_json).then(function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            // 通过后，更新数据：
                            let urlApi_mobile = _this.Global.baseURL + _this.Global.api.SystemSet.accountsettings.accountPut
                            let mobile_json = {
                                'mobile': phoneNum,
                                'flags': flags
                            }
                            this.$http.post(urlApi_mobile, mobile_json).then(function (res) {
                                if (res.body.code.toString() == _this.Global.RES_OK) {
                                    _this.bindingPhone.number = phoneNum // 同步数据
                                    _this.$message({
                                        type: 'success',
                                        /* 绑定成功 */
                                        message: this.$t('mxpcweb.systemset.accountsettings.1530584145199')
                                    })

                                    // 状态更新
                                    let state = _this.bindingPhone.state
                                    if (state == '1' || state == '0') {
                                        _this.bindingPhone.state = '2'
                                    }

                                    // 清零
                                    phoneNum = ''
                                    verifySMS_new = ''
                                } else {
                                    _this.$message.error(_this.msg(res.body))
                                }
                            }, function (res) {
                                _this.$message.error(_this.$t(_this.Global.errorTitle))
                            })
                            // this.$message({ type: 'info', message: _this.msg(res.body) });
                        } else {
                            _this.$message.error(_this.msg(res.body))
                        }
                    }, function (res) {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    })
                } else {
                    /* 请检查你的表单！ */
                    // this.$message({ message: this.$t('mxpcweb.systemset.accountsettings.1530586352479'), type: 'warning' });
                    return false
                }
            })
        },
        // 发手机验证码：
        phoneSendCode() {
            let _this = this
            let phoneNum = this.bindingPhone.number2
            if (!checkPhone(phoneNum)) {
                /* 请输入正确的手机号码！ */
                _this.$message.error(this.$t('mxpcweb.systemset.accountsettings.1530584177386')); return
            }
            if (phoneNum == _this.bindingPhone.number) {
                /* 不能绑定现有手机号！ */
                _this.$message.error(this.$t('mxpcweb.systemset.accountsettings.1530585482057')); return
            }
            // 开始发送验证码：
            let urlApi = _this.Global.baseURL + _this.Global.api.UniversalInterface.verifySMS
            let verifySMS_json = {
                'mobile': phoneNum,
                'action': 'send',
                'module': 'bind'
            }
            this.$http.post(urlApi, verifySMS_json).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    // console.log(res.body.data.code);
                    /* 发送成功！请注意查收！ */
                    this.$message({ type: 'success', message: this.$t('mxpcweb.systemset.accountsettings.1530585524677') })
                    // 倒计时
                    this.bindingPhone.btnIsShow = false
                    let countDown = this.bindingPhone.countDown
                    let t = setInterval(function () {
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
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 锁屏修改提交
        lockScreenFn() {
            let _this = this
            let url = this.Global.baseURL + this.Global.api.SystemSet.accountsettings.personalsettingPut
            let postData = {
                minutesLockApp: this.lockScreen.time2
            }
            this.$http.post(url, postData).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    /* 修改成功 */
                    _this.$message({ message: this.$t('mxpcweb.systemset.accountsettings.1530584086728'), type: 'success' })
                    _this.lockScreen.time = _this.lockScreen.time2
                    _this.setIndividualConfigInfo()
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 修改密码
        updatePWDFn(formName) {
            // console.log(this.updatePWD.checkPass)
            let _this = this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 更新开始
                    let postData = {
                        'oldPassword': this.updatePWD.oldPass,
                        'newPassword': this.updatePWD.checkPass
                    }
                    this.$http.post(this.Global.baseURL + this.Global.api.v2.resetpwd, postData).then(function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            /* 修改成功 */
                            this.$message({ message: this.$t('mxpcweb.systemset.accountsettings.1530584086728'), type: 'success' })
                            this.updatePWD.oldPass = ''
                            this.updatePWD.pass = ''
                            this.updatePWD.checkPass = ''
                        } else {
                            _this.$message.error(_this.msg(res.body))
                        }
                    }, function (res) {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 滑动条
        formatTooltip(val) {
            /* x分钟 */
            let tip = this.$t('mxpcweb.systemset.accountsettings.1530585586593', [val])
            /* 不锁屏 */
            if (val == 0) { tip = this.$t('mxpcweb.systemset.accountsettings.1530583304104') }
            return tip
        },
        lockScreenClose() {
            this.lockScreen.time2 = this.lockScreen.time
        },
        // 清空表单
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        ...mapActions([
            'setIndividualConfigInfo'
        ])
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
