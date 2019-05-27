<template>
    <div class="Popup">
        <!-- 添加邮箱账号 -->
        <el-dialog v-dialogDrag :title="$t('mxpcweb.systemset.mailset.mailaccount.1529027710876')" size="small" :visible.sync="fastDialogFormVisible" custom-class="width420" @close="windowClose()">
            <!-- 正在验证邮箱服务器... -->
            <el-form :label-position="labelPosition" v-loading="loading2" :element-loading-text="$t('mxpcweb.systemset.mailset.mailaccount.1529029232359')">
                <table class="tableClass">
                    <tr>
                        <td class="text-center">
                            <!-- 邮箱账号: -->
                            <span class="tdTitle">{{$t('mxpcweb.systemset.mailset.mailaccount.1529029232576')}}</span>
                            <template>
                                <!-- 请输入邮箱账号 -->
                                <el-input auto-complete="off" v-model="mailAddress" :placeholder="$t('mxpcweb.systemset.mailset.mailaccount.1529033402697')" class="pull-right f-width">
                                </el-input>
                            </template>
                        </td>

                    </tr>
                    <tr>
                        <td class="text-center">
                            <!-- 邮箱密码: -->
                            <span class="tdTitle">{{$t('mxpcweb.systemset.mailset.mailaccount.1529029232798')}}</span>
                            <template>
                                <!-- 请输入邮箱密码 -->
                                <el-input v-model="recPassword" type="password" :placeholder="$t('mxpcweb.systemset.mailset.mailaccount.1529029233003')" class="pull-right f-width">
                                </el-input>
                            </template>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-center" style="higth:80px;"></td>
                    </tr>
                    <tr>
                        <td class="text-center">
                            <!-- 立即保存 -->
                            <el-button type="primary" @click="accountAdd()">{{$t('mxpcweb.systemset.mailset.mailaccount.1529029233196')}}</el-button>
                            <!-- 高级设置 -->
                            <el-button type="text" @click="showSer('0',{},company.ctId,true)">{{$t('mxpcweb.systemset.mailset.mailaccount.1529029233401')}}</el-button>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-center text-red">
                            <!-- {{errorMessage}} -->
                            <el-button type="text" v-if="RightOrWrong">
                                <!-- 帮助 -->
                                <a href="http://service.mail.qq.com/cgi-bin/help?subtype=1&&id=28&&no=1001256" target="view_window">{{$t('mxpcweb.systemset.mailset.mailaccount.1529029233761')}}</a>
                            </el-button>
                        </td>
                    </tr>

                </table>
            </el-form>
        </el-dialog>

        <el-dialog v-dialogDrag :title="titleName" custom-class="width890" :visible.sync="serDialogVisible" @close="windowClose()">
            <div :class="!blgs?'coverDiv':''"></div>
            <!-- 正在验证邮箱服务器 -->
            <el-form v-loading="loading2" :element-loading-text="$t('mxpcweb.systemset.mailset.mailaccount.1529029232359')">
                <table class="tableClass">
                    <tr class="titleClass">
                        <td colspan="8">
                            <!-- 基本信息 -->
                            <div>{{$t('mxpcweb.systemset.mailset.mailaccount.1529029368239')}}</div>
                        </td>
                    </tr>
                    <tr>
                        <!-- 邮箱账户: -->
                        <td>{{$t('mxpcweb.systemset.mailset.mailaccount.1529029368518')}}</td>
                        <td colspan="3">
                            <!-- 请输入内容 -->
                            <el-input :disabled="disabledAll" v-model="mailAddress" :placeholder="$t('mxpcweb.systemset.mailset.mailaccount.1529029414385')" v-on:blur="blurSelect()" class="pull-right f-width"></el-input>
                        </td>
                        <!-- 账户类型: -->
                        <td>{{$t('mxpcweb.systemset.mailset.mailaccount.1529029414620')}}</td>
                        <td colspan="3">
                            <!-- 请选择 -->
                            <el-select clearable :placeholder="$t('mxpcweb.systemset.mailset.mailaccount.1529033277257')" v-model="accountType" class="pull-right f-width">
                                <el-option v-for="item in accountTypeOption" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <!-- 邮箱密码: -->
                        <td>{{$t('mxpcweb.systemset.mailset.mailaccount.1529029232798')}}</td>
                        <td colspan="3">
                            <!-- 请输入内容 -->
                            <el-input v-model="recPassword" :placeholder="$t('mxpcweb.systemset.mailset.mailaccount.1529029414385')" type="password" class="pull-right f-width"></el-input>
                        </td>
                        <!-- 拥有人: -->
                        <td>{{$t('mxpcweb.systemset.mailset.mailaccount.1529029414827')}}</td>
                        <td colspan="3">
                            <!-- 请输入内容 -->
                            <!-- <el-input v-model="owner" :placeholder="$t('mxpcweb.systemset.mailset.mailaccount.1529029414385')" class="pull-right f-width" disabled="disabled"></el-input> -->
                            <el-select class="pull-right f-width" v-model="owner" :placeholder="$t('mxpcweb.systemset.mailset.mailaccount.1529029414385')">
                                <el-option v-for="itemP in personnelTable" :key="itemP.ctId" :label="itemP.realName" :value="itemP.ctId">
                                </el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <!-- 显示名字: -->
                        <td>{{$t('mxpcweb.systemset.mailset.mailaccount.1529029415003')}}</td>
                        <td colspan="3">
                            <!-- 请输入内容 -->
                            <el-input v-model="displayName" :placeholder="$t('mxpcweb.systemset.mailset.mailaccount.1529029414385')" class="pull-right f-width"></el-input>
                        </td>
                        <!-- 回复地址: -->
                        <td>{{$t('mxpcweb.systemset.mailset.mailaccount.1529029415181')}}</td>
                        <td colspan="3">
                            <!-- 请输入内容 -->
                            <el-input v-model="recMailAddress" :placeholder="$t('mxpcweb.systemset.mailset.mailaccount.1529029414385')" class="pull-right f-width"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <!-- 邮箱协议: -->
                        <td>{{$t('mxpcweb.systemset.mailset.mailaccount.1529033173322')}}</td>
                        <td colspan="3">
                            <!-- 请选择 -->
                            <el-select :disabled="disableAgree" clearable :placeholder="$t('mxpcweb.systemset.mailset.mailaccount.1529033277257')" v-model="mailboxProtocol" @change="changeOption(mailboxProtocol)">
                                <el-option v-for="item in mailboxProtocolOption" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </td>
                        <td></td>
                        <td colspan="3">

                        </td>
                    </tr>

                    <tr class="titleClass">
                        <td colspan="8">
                            <!-- 收信设置 -->
                            <div>{{$t('mxpcweb.systemset.mailset.mailaccount.1529030221891')}}</div>
                        </td>
                    </tr>
                    <tr>
                        <!-- 接收账户: -->
                        <td>{{$t('mxpcweb.systemset.mailset.mailaccount.1529030240880')}}</td>
                        <td colspan="3">
                            <!-- 请输入内容 -->
                            <el-input v-model="recUser" :placeholder="$t('mxpcweb.systemset.mailset.mailaccount.1529029414385')" class="pull-right f-width"></el-input>
                        </td>
                        <td></td>
                        <td colspan="3">

                        </td>
                    </tr>
                    <tr v-if="accountType==0">
                        <!-- 允许接收: -->
                        <td>{{$t('mxpcweb.systemset.mailset.mailaccount.1529030241264')}}</td>
                        <td colspan="7">
                            <el-button v-for="(items,index2) in recipientArry" :key="index2">
                                {{items.sendName}}
                                <i class="iconfont icon-close" @click.stop="targetRemove(items,0)"></i>
                            </el-button>
                            <el-dropdown trigger="click" @command="sortListClick">
                                <span class="el-dropdown-link">
                                    <el-button type="primary">{{$t('mxpcweb.systemset.mailset.setindex.1528980783777')}}</el-button>
                                </span>
                                <el-dropdown-menu slot="dropdown" class="MXscroll" style="overflow:auto;min-height:100px;max-height:200px;">
                                    <el-dropdown-item v-for="(item,index) in personnelTable" :key="index" :command="{userCtid:item.ctId,sendName:item.realName,mailType:0}">
                                        <div>
                                            <span v-if="item.selected">
                                                <i class="iconfont icon-correct text-blue"></i>
                                            </span>
                                            <span style="display: inline-block;width: 21px;line-height: 20px;" v-else></span>
                                            {{item.realName}}
                                        </div>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>

                        </td>
                        <!-- <td></td>
            <td colspan="3">

            </td> -->
                    </tr>
                    <tr>
                        <!-- 保存邮件副本: -->
                        <td>{{$t('mxpcweb.systemset.mailset.mailaccount.1529030261658')}}</td>
                        <td colspan="7">
                            <el-radio-group v-model="copySaveradio">
                                <!-- 永久保留 -->
                                <el-radio :label="0">{{$t('mxpcweb.systemset.mailset.mailaccount.1529030262137')}}</el-radio>
                                <!-- 保留10天 -->
                                <el-radio :label="10">{{$t('mxpcweb.systemset.mailset.mailaccount.1529030275725')}}</el-radio>
                                <!-- 保留30天 -->
                                <el-radio :label="30">{{$t('mxpcweb.systemset.mailset.mailaccount.1529030276011')}}</el-radio>
                                <!-- 保留60天 -->
                                <el-radio :label="60">{{$t('mxpcweb.systemset.mailset.mailaccount.1529030305769')}}</el-radio>
                                <!-- 不保留副本 -->
                                <el-radio :label="1">{{$t('mxpcweb.systemset.mailset.mailaccount.1529030306021')}}</el-radio>
                            </el-radio-group>
                        </td>
                    </tr>

                    <tr class="titleClass">
                        <td colspan="8">
                            <!-- 发信设置 -->
                            <div>{{$t('mxpcweb.systemset.mailset.mailaccount.1529030306243')}}</div>
                        </td>
                    </tr>
                    <tr>
                        <!-- 发信认证: -->
                        <td>{{$t('mxpcweb.systemset.mailset.mailaccount.1529030357933')}}</td>
                        <td colspan="5">
                            <!-- 请选择 -->
                            <el-select v-model="ESMTP" clearable :placeholder="$t('mxpcweb.systemset.mailset.mailaccount.1529033277257')" class="f-width">
                                <el-option v-for="item in ESMTPOption" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </td>
                        <td></td>
                        <td colspan="1">

                        </td>
                    </tr>
                    <tr v-if="ESMTP==1">
                        <!-- 发送账号: -->
                        <td>{{$t('mxpcweb.systemset.mailset.mailaccount.1529032674536')}}</td>
                        <td colspan="3">
                            <!-- 请输入内容 -->
                            <el-input v-model="sendUser" :placeholder="$t('mxpcweb.systemset.mailset.mailaccount.1529029414385')" class="pull-right f-width"></el-input>
                        </td>
                        <!-- 密码: -->
                        <td>{{$t('mxpcweb.systemset.mailset.mailaccount.1529030389843')}}</td>
                        <td colspan="3">
                            <!-- 请输入内容 -->
                            <el-input v-model="sendPass" :placeholder="$t('mxpcweb.systemset.mailset.mailaccount.1529029414385')" class="pull-right f-width" type="password"></el-input>
                        </td>
                    </tr>
                    <tr v-if="accountType==0">
                        <!-- 允许发送: -->
                        <td style="min-width: 99px;">{{$t('mxpcweb.systemset.mailset.mailaccount.1529030390377')}}</td>
                        <td colspan="7">
                            <sender-component ref="SenderComponent" v-for="(item,index) in senderArry" :key="index" :Detail="item" :index="index" @senderRemove="targetRemove" :show="1" @changeName="changeName"></sender-component>

                            <el-dropdown style=" float: left;" trigger="click" @command="sortListClick">
                                <span class="el-dropdown-link">
                                    <el-button type="primary">{{$t('mxpcweb.systemset.mailset.setindex.1528980783777')}}</el-button>
                                </span>
                                <el-dropdown-menu slot="dropdown" class="MXscroll" style="overflow:auto;min-height:100px;max-height:200px;">
                                    <el-dropdown-item v-for="(item,index) in personnelTable" :key="index" :command="{userCtid:item.ctId,sendName:item.realName,mailType:1}">
                                        <div>
                                            <span v-if="item.selected">
                                                <i class="iconfont icon-correct text-blue"></i>
                                            </span>
                                            <span style="display: inline-block;width: 21px;line-height: 20px;" v-else></span>
                                            {{item.realName}}
                                        </div>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>

                        </td>
                    </tr>

                    <tr class="titleClass" v-if="show">
                        <td>
                            <!-- 服务器 -->
                            <div>{{$t('mxpcweb.systemset.mailset.mailaccount.1529030413632')}}</div>
                        </td>
                        <td colspan="7">
                            <!-- 当前服务器参数取自平台的邮箱智库 -->
                            <em style="font-size:6pt;">{{$t('mxpcweb.systemset.mailset.mailaccount.1529030428265')}} </em>
                            <!-- 修改设置 -->
                            <el-button type="text" size="mini" @click="UpdateInput()">{{$t('mxpcweb.systemset.mailset.mailaccount.1529030440307')}}</el-button>
                        </td>
                    </tr>
                    <tr>
                        <!-- 收信服务器: -->
                        <td>{{$t('mxpcweb.systemset.mailset.mailaccount.1529030440554')}}</td>
                        <td colspan="3">
                            <!-- 请输入内容 -->
                            <el-input v-model="PulicPortServer" :placeholder="$t('mxpcweb.systemset.mailset.mailaccount.1529029414385')" class="pull-right f-width" :disabled="EdiPulicPort"></el-input>
                        </td>
                        <td>
                            <el-checkbox v-model="PulicPortSSL" :disabled="EdiPulicPort">SSL</el-checkbox>
                        </td>
                        <!-- 端口: -->
                        <td>{{$t('mxpcweb.systemset.mailset.mailaccount.1529030440756')}}</td>
                        <td colspan="2">
                            <!-- 请输入内容 -->
                            <el-input v-model="PulicPortPort" :placeholder="$t('mxpcweb.systemset.mailset.mailaccount.1529029414385')" class="pull-right f-width" :disabled="EdiPulicPort"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <!-- SMTP服务器: -->
                        <td>{{$t('mxpcweb.systemset.mailset.mailaccount.1529030476107')}}</td>
                        <td colspan="3">
                            <!-- 请输入内容 -->
                            <el-input v-model="smtpServer" :placeholder="$t('mxpcweb.systemset.mailset.mailaccount.1529029414385')" class="pull-right f-width" :disabled="Edismtp"></el-input>
                        </td>
                        <td>
                            <el-checkbox v-model="smtpSSL" :disabled="Edismtp">SSL</el-checkbox>
                        </td>
                        <!-- 端口: -->
                        <td>{{$t('mxpcweb.systemset.mailset.mailaccount.1529030440756')}}</td>
                        <td colspan="2">
                            <!-- 请输入内容 -->
                            <el-input v-model="smtpPort" :placeholder="$t('mxpcweb.systemset.mailset.mailaccount.1529029414385')" class="pull-right f-width" :disabled="Edismtp"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="8">
                            <!-- 如果服务器支持就使用STARTTLS加密传输 -->
                            <el-checkbox v-model="startTls" :disabled="EdistartTls">{{$t('mxpcweb.systemset.mailset.mailaccount.1529030476327')}}</el-checkbox>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-center" colspan="8">
                            <!-- 保存 -->
                            <el-button type="primary" style="width:200px;" size="large" @click="AccountAddSenior(dialogtype)">{{$t('mxpcweb.systemset.mailset.mailaccount.1529030476549')}}</el-button>
                            <!-- 返回到快速添加 -->
                            <!-- 添加 -->
                            <el-button v-if="typeName==$t('mxpcweb.systemset.mailset.mailaccount.1529032463835')" type="text" @click="showMail(0)">{{$t('mxpcweb.systemset.mailset.mailaccount.1529030523469')}}</el-button>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-center text-red" colspan="8">
                            <!-- {{errorMessage}} -->
                            <el-button type="text" v-if="RightOrWrong">
                                <!-- 帮助 -->
                                <a href="http://service.mail.qq.com/cgi-bin/help?subtype=1&&id=28&&no=1001256" target="view_window">{{$t('mxpcweb.systemset.mailset.mailaccount.1529029233761')}}</a>
                            </el-button>
                        </td>
                    </tr>
                </table>
            </el-form>

        </el-dialog>
    </div>
</template>

<script>
import { isObject, encrypt, isArray } from '@/libs/utils.js'
import { mapGetters } from 'vuex'
import SenderComponent from '../RuleSet/SenderComponent/index'
export default {
    name: 'Popup',
    data() {
        let _this = this
        return {
            labelPosition: 'left',
            fastDialogFormVisible: false,
            errorMessage: '',
            serDialogVisible: false,
            copySaveradio: 0,
            accountType: 1, // 账户类型
            accountTypeOption: [{
                'label': _this.$t('mxpcweb.systemset.mailset.mailaccount.1529040021925'), // "个人",
                'value': 1
            }, {
                'label': _this.$t('mxpcweb.systemset.mailset.mailaccount.1529040024691'), // "公共",
                'value': 0
            }],
            mailboxProtocol: 'POP', // 邮箱协议
            mailboxProtocolOption: [
                { 'label': 'POP', 'value': 'POP' },
                { 'label': 'IMAP', 'value': 'IMAP' }],
            ESMTP: 0, // 发信认证
            ESMTPOption: [{
                'label': _this.$t('mxpcweb.systemset.mailset.mailaccount.1529040024924'), // "发信账户密码与收件相同（默认）",
                'value': 0
            }, {
                'label': _this.$t('mxpcweb.systemset.mailset.mailaccount.1529040025115'), // "指定发信账户",
                'value': 1
            }],
            loading2: false,
            mailAddress: '',
            recPassword: '',
            recMailAddress: '',
            displayName: '',
            recUser: '',
            sendUser: '',
            sendName: '',
            sendPass: '',
            serverType: '',
            owners: [], // 公共邮箱才有此项
            configs: [],
            owner: '',
            // 服务
            smtpServer: '', // smtp服务器地址
            smtpSSL: false, // smtp加密
            smtpPort: '', // smtp端口

            imapServer: '', // imap服务器地址
            imapSSL: false, // imap加密
            imapPort: '', // imap端口

            popServer: '', // pop服务器地址
            popSSL: false, // pop加密
            popPort: '', // pop端口

            PulicPortServer: '', // 服务器地址
            PulicPortSSL: false, // 加密
            PulicPortPort: '', // 端口
            // popSSLL: false,//pop加密
            startTls: false, // 加密传输
            dialogtype: 0,
            accountId: 0,
            cid: 0,
            ctid: 0,
            typeName: _this.$t('mxpcweb.systemset.mailset.mailaccount.1529032463835'), // "添加",
            titleName: _this.$t('mxpcweb.systemset.mailset.mailaccount.1529040025499'), // "添加邮箱帐号",
            disabledAll: false,
            disableAgree: true,
            EdiPulicPort: true,
            Edismtp: true,
            EdistartTls: true,
            source: 0,
            RightOrWrong: false,
            blgs: true,
            personnelTable: [], // 人员
            recipientArry: [],
            senderArry: [],
            recipientAddArry: [],
            recipientDelArry: [],
            senderAddArry: [],
            senderDelArry: [],
            AddArry: [],
            DelArry: [],
            tem: [],
            show: false

        }
    },
    computed: {
        // 使用对象展开运算符将 getters 混入 computed 对象中
        ...mapGetters([
            'company' // getters.js文件中company
        ])
    },
    created() {
    },
    methods: {
        windowClose() {
            this.RightOrWrong = false
        },
        // 快速添加111111
        showMail(type) {
            let _this = this
            _this.serDialogVisible = false
            _this.loading2 = false
            _this.errorMessage = ''
            _this.fastDialogFormVisible = true
            _this.dialog = {
                mailAddress: '',
                recPassword: ''
            }
            if (_this.mailAddress != '' && type == 0) { // 添加
                _this.mailAddress = _this.mailAddress
                _this.recPassword = _this.recPassword
            }
            _this.errorMessage = ''
        },
        // 高级设置
        async   showSer(type, DetailData, owner, blg) {
            this.getTable()
            this.clear()
            let _this = this
            _this.tem = []
            _this.blgs = blg
            if (type == '0' && _this.mailAddress != '') { // 添加
                _this.blurSelect()
            }
            _this.errorMessage = ''
            _this.loading2 = false
            _this.fastDialogFormVisible = false
            _this.serDialogVisible = true
            _this.dialogtype = 0
            _this.disabledAll = false // 启用pop下拉框
            _this.disableAgree = false
            _this.accountType = 1
            _this.personnelTable = []
            _this.recipientArry = []
            _this.senderArry = []
            _this.senderAddArry = []
            _this.owner = owner
            if (type == '1') { // 修改
                _this.disableAgree = true
                _this.disabledAll = true // 禁用pop下拉框
                _this.dialogtype = 1
                _this.typeName = _this.$t('mxpcweb.systemset.mailset.mailaccount.1529040025765') // "修改";
                _this.titleName = _this.$t('mxpcweb.systemset.mailset.mailaccount.1529040074802') // "修改邮箱帐号";
                _this.mailAddress = DetailData.mailAddress
                _this.recPassword = DetailData.recPassword
                _this.recMailAddress = DetailData.recMailAddress
                _this.displayName = DetailData.displayName
                _this.recUser = DetailData.recUser
                _this.serverType = DetailData.serverType
                _this.accountId = DetailData.accountId
                _this.accountType = DetailData.prop
                // 账户类型:1:个人，0：公共账户
                _this.accountType = DetailData.prop
                // 邮箱协议: 0 pop3 1 imap
                if (DetailData.serverType == 0) {
                    _this.mailboxProtocol = 'POP'
                } else {
                    _this.mailboxProtocol = 'IMAP'
                }
                _this.ESMTP = DetailData.sendAuthenticate
                // 发信认证:sendAuthenticate  0：与收信相同 1：指定发信账号
                if (_this.ESMTP == 1) {
                    _this.sendUser = DetailData.sendUser
                    _this.sendPass = DetailData.sendPass
                }
                // 保存邮件副本
                if (DetailData.leaveCopy == 1) {
                    _this.copySaveradio = DetailData.leaveDays
                } else {
                    _this.copySaveradio = 1
                }

                for (let i = 0; i < DetailData.configs.length; i++) {
                    if (DetailData.configs[i].serverType == '2') {
                        _this.smtpServer = DetailData.configs[i].server
                        _this.smtpSSL = DetailData.configs[i].ssl == 1
                        _this.smtpPort = DetailData.configs[i].port
                        _this.startTls = DetailData.configs[i].startTls == 1
                    }
                    if (DetailData.serverType == DetailData.configs[i].serverType) {
                        _this.PulicPortServer = DetailData.configs[i].server
                        _this.PulicPortSSL = DetailData.configs[i].ssl == 1
                        _this.PulicPortPort = DetailData.configs[i].port
                    }
                }
                if (isArray(DetailData.owners)) {
                    _this.tem = DetailData.owners
                }
            } else {
                _this.ESMTP = 0
                _this.typeName = _this.$t('mxpcweb.systemset.mailset.mailaccount.1529032463835') // "添加";
                _this.titleName = _this.$t('mxpcweb.systemset.mailset.mailaccount.1529040025499') // "添加邮箱帐号";
            }
        },
        GetOwners(arry) {
            for (let index = 0; index < arry.length; index++) {
                const element = arry[index]
                if (element.mailType == 0) { // 权限类型0接收 1发送
                    this.recipientArry.push(element)
                } else {
                    for (let r = 0; r < this.personnelTable.length; r++) {
                        const elementR = this.personnelTable[r]
                        if (elementR.ctId == element.userCtid) {
                            this.senderArry.push({ 'mailType': element.mailType, 'sendName': element.sendName, 'userCtid': element.userCtid, 'dispalyName': elementR.realName })
                        }
                    }
                }
            }
        },
        UpdateInput() {
            _this.EdiPulicPort = false
            _this.Edismtp = false
            _this.EdistartTls = false
        },
        // 快速添加立即保存
        accountAdd() {
            let _this = this
            _this.loading2 = true
            let data = {
                'mailAddress': _this.mailAddress,
                'recPassword': encrypt(_this.recPassword)
            }
            var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
            if (data.mailAddress == '' && data.recPassword == '') {
                _this.errorMessage = _this.$t('mxpcweb.systemset.mailset.mailaccount.1529040460251') // "账号和密码不允许为空";
                _this.loading2 = false
            } else if (data.mailAddress == '') {
                _this.errorMessage = _this.$t('mxpcweb.systemset.mailset.mailaccount.1529040463201') // "账号不允许为空";
                _this.loading2 = false
            } else if (data.recPassword == '') {
                _this.errorMessage = _this.$t('mxpcweb.systemset.mailset.mailaccount.1529040463412') // "密码不允许为空";
                _this.loading2 = false
            } else if (!reg.test(data.mailAddress)) {
                _this.errorMessage = _this.$t('mxpcweb.systemset.mailset.mailaccount.1529040463604') // "请输入正确的邮箱帐号";
                _this.loading2 = false
            } else {
                let mailAddressArry = _this.mailAddress.toLowerCase().split('@')
                _this.RightOrWrong = false
                if (mailAddressArry[1] == 'qq.com') {
                    var regTwo = /^[a-z]{16,16}$/g
                    if (!regTwo.test(_this.recPassword)) {
                        _this.loading2 = false
                        _this.errorMessage = _this.$t('mxpcweb.systemset.mailset.mailaccount.1529040463806') // "请使用授权码登录";
                        // _this.$message.error(_this.typeName + _this.$t('mxpcweb.mail.1531115868872'))// '失败'
                        _this.RightOrWrong = true
                    }
                }
                if (_this.RightOrWrong || _this.errorMessage != '') {
                    _this.$message.error(_this.errorMessage)
                    return
                }
            }

            _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.mailset.mailaccount.accountAdd, data)
                .then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.loading2 = false
                        _this.errorMessage = ''
                        _this.fastDialogFormVisible = false
                        _this.$message.success(_this.$t('mxpcweb.systemset.mailset.mailaccount.1529042127539'))// 添加成功
                        _this.$emit('getMailList')
                    } else {
                        _this.loading2 = false
                        // _this.errorMessage = _this.msg(res.body)
                        // _this.$message.error(_this.$t('mxpcweb.systemset.mailset.mailaccount.1529042124909'))// 添加失败
                        _this.$message.error(_this.msg(res.body))
                    }
                },
                    function (res) {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    })
        },
        // 获取参数
        blurSelect() {
            let _this = this
            if (_this.dialogtype != 0) { return }
            var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
            let mail = _this.mailAddress.trim()
            if (reg.test(mail)) {
                _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.mailset.mailaccount.config, {
                    params: {
                        'mail': mail
                    }
                }).then(
                    function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data)) {
                            _this.disableAgree = false
                            _this.startTls = false
                            _this.source = res.body.data.source
                            if (_this.source == 0) { // 不可以修改
                                _this.EdiPulicPort = true
                                _this.Edismtp = true
                                _this.EdistartTls = true
                            } else {
                                _this.EdiPulicPort = false
                                _this.Edismtp = false
                                _this.EdistartTls = false
                            }

                            if (res.body.data.popServer != undefined && res.body.data.imapServer != undefined) {
                                _this.popServer = res.body.data.popServer
                                _this.popSSL = res.body.data.popSSL == 1
                                _this.popPort = res.body.data.popPort
                                _this.imapServer = res.body.data.imapServer
                                _this.imapSSL = res.body.data.imapSSL == 1
                                _this.imapPort = res.body.data.imapPort
                            } else if (res.body.data.popServer != undefined) {
                                _this.popServer = res.body.data.popServer
                                _this.popSSL = res.body.data.popSSL == 1
                                _this.popPort = res.body.data.popPort
                                _this.mailboxProtocol = 'POP'
                                _this.imapServer = ''
                                _this.imapSSL = false
                                _this.imapPort = ''
                            } else if (res.body.data.imapServer != undefined) {
                                _this.imapServer = res.body.data.imapServer
                                _this.imapSSL = res.body.data.imapSSL == 1
                                _this.imapPort = res.body.data.imapPort
                                _this.mailboxProtocol = 'IMAP'
                                _this.popServer = ''
                                _this.popSSL = false
                                _this.popPort = ''
                            }
                            _this.changeOption(_this.mailboxProtocol)
                            _this.smtpServer = res.body.data.smtpServer
                            _this.smtpSSL = res.body.data.smtpSSL == 1
                            _this.smtpPort = res.body.data.smtpPort
                            _this.recMailAddress = mail
                            _this.displayName = _this.substringName(mail)
                            _this.recUser = mail
                        } else {
                            _this.$message.error(_this.msg(res.body))
                        }
                    },
                    function (res) {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    }
                )
            } else {
                _this.$message.error(_this.$t('mxpcweb.systemset.mailset.mailaccount.1529040463604')) // "请输入正确邮箱账号";
            }
        },
        // 名称截取
        substringName(adderss) {
            let str = adderss.split('@')
            return str[0]
        },
        // 邮箱协议改变
        changeOption(lable) {
            let _this = this
            if (!this.disableAgree) {
                if (lable == 'POP') {
                    if (_this.popServer == '' || _this.popServer == undefined) {
                        _this.EdiPulicPort = false
                        _this.PulicPortServer = ''
                        _this.PulicPortSSL = false
                        _this.PulicPortPort = ''
                        return
                    }
                    if (_this.source == 0) {
                        _this.EdiPulicPort = true
                    }
                    _this.PulicPortServer = _this.popServer
                    _this.PulicPortSSL = _this.popSSL
                    _this.PulicPortPort = _this.PulicPortSSL == true ? 995 : 110
                } else {
                    if (_this.imapServer == '' || _this.imapServer == undefined) {
                        _this.EdiPulicPort = false
                        _this.PulicPortServer = ''
                        _this.PulicPortSSL = false
                        _this.PulicPortPort = ''
                        return
                    }
                    if (_this.source == 0) {
                        _this.EdiPulicPort = true
                    }
                    _this.PulicPortServer = _this.imapServer
                    _this.PulicPortSSL = _this.imapSSL
                    _this.PulicPortPort = _this.PulicPortSSL == true ? 993 : 143
                }
            }
        }, // 高级设置保存 0--添加   1--修改
        AccountAddSenior(dialogtype) {
            let _this = this
            _this.loading2 = true
            let blg = _this.Verification()
            if (!blg) {
                return
            }
            let arry = _this.mailAddress.split('@')
            let data = {
                mailAddress: _this.mailAddress,
                recPassword: encrypt(_this.recPassword),
                leaveDays: 0,
                leaveCopy: 1,
                recMailAddress: _this.recMailAddress,
                prop: _this.accountType, // 1:个人，0：公共账户
                displayName: _this.displayName,
                recUser: _this.recUser, // 接收帐户名****
                sendAuthenticate: _this.ESMTP, // 0：与收信相同 1：指定发信账号
                sendUser: _this.sendUser, // 发送帐户名****
                sendPass: _this.sendPass, // 发信密码****
                serverType: _this.mailboxProtocol == 'POP' ? '0' : '1', // pop
                ctid: _this.owner,
                configs: [{
                    serverType: _this.mailboxProtocol == 'POP' ? '0' : '1',
                    server: _this.PulicPortServer,
                    port: _this.PulicPortPort,
                    ssl: _this.PulicPortSSL == true ? 1 : 0,
                    mail: '%@' + arry[1],
                    userType: 1,
                    smtpAuth: 1,
                    startTls: _this.startTls == true ? 1 : 0,
                    accType: 0
                },
                {
                    serverType: 2,
                    server: _this.smtpServer,
                    port: _this.smtpPort,
                    ssl: _this.smtpSSL == true ? 1 : 0,
                    mail: '%@' + arry[1],
                    userType: 1,
                    smtpAuth: 1,
                    startTls: _this.startTls == true ? 1 : 0,
                    accType: 0
                }
                ]
            }
            if (_this.copySaveradio != 0) { // 不是永久
                // 不保留
                if (_this.copySaveradio == 1) {
                    data.leaveDays = 0
                    data.leaveCopy = 0
                } else {
                    data.leaveDays = _this.copySaveradio
                }
            }

            // 公共账户添加
            if (_this.accountType == 0 && _this.dialogtype == 0) { // 1:个人，0：公共账户
                data.owners = this.recipientArry.concat(this.senderArry)
            } else if (_this.accountType == 0 && _this.dialogtype == 1) { // 公共账户修改
                this.AddArry = this.recipientAddArry.concat(this.senderAddArry)
                this.DelArry = this.recipientDelArry.concat(this.senderDelArry)
            }
            if (_this.dialogtype == 0) { // 添加
                _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.mailset.mailaccount.accountAdd,
                    data).then(function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            _this.loading2 = false
                            _this.errorMessage = ''
                            _this.serDialogVisible = false
                            _this.$message.success(_this.$t('mxpcweb.systemset.mailset.mailaccount.1529042127539'))// 添加成功
                            _this.$emit('getMailList')
                        } else {
                            _this.loading2 = false
                            // _this.errorMessage = res.body.msg
                            _this.$message.error(res.body.msg)// 添加失败
                        }
                    },
                        function (res) {
                            _this.$message.error(_this.$t(_this.Global.errorTitle))
                        })
            } else { // 修改
                data.accountId = _this.accountId
                data.cid = _this.cid
                data.ctid = _this.owner// _this.ctid
                _this.$http.put(_this.Global.baseURL + _this.Global.api.SystemSet.mailset.mailaccount.reviseAccount,
                    data).then(function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            _this.loading2 = false
                            _this.errorMessage = ''
                            _this.serDialogVisible = false
                            _this.$message.success(_this.$t('mxpcweb.systemset.mailset.mailaccount.1529042240356'))// 修改成功
                            _this.$emit('getMailList')
                            // }
                        } else {
                            _this.loading2 = false
                            // _this.errorMessage = res.body.msg
                            _this.$message.error(_this.msg(res.body))// 修改失败
                        }
                    },
                        function (res) {
                            _this.$message.error(_this.$t(_this.Global.errorTitle))
                        })
            }
        },
        // 获取表格数据
        getTable() {
            let _this = this
            this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.groupstructure.getTable, { params: { dCode: '0' } }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.personnelTable = res.body.data.tableList
                    if (_this.tem.length > 0) {
                        _this.GetOwners(_this.tem)
                    }
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        async   changeName(name, index) {
            if (this.dialogtype == 0) {
                this.$message.error(this.$t('mxpcweb.systemset.accountsettings.1543914565154'))
                return
            }
            this.senderArry[index].sendName = name
            let params = {
                action: 'alterName',
                accountId: this.accountId,
                senderCtid: this.senderArry[index].userCtid,
                senderName: name
            }
            let _this = this
            _this.$http.put(_this.Global.baseURL + _this.Global.api.SystemSet.mailset.mailaccount.reviseAccounts,
                params).then(function (res) {
                    if (res.body.code.toString() != _this.Global.RES_OK) {
                    }
                })
        },
        sortListClick(command) {
            let isHave = true
            if (command.mailType == 0) {
                for (let index = 0; index < this.recipientArry.length; index++) {
                    const element = this.recipientArry[index]
                    if (element.userCtid == command.userCtid) {
                        isHave = false
                        break
                    }
                }
                if (isHave) {
                    this.recipientArry.push(command)
                    if (this.dialogtype != 0) {
                        this.reviseAccount([{ 'mailType': command.mailType, 'sendName': command.sendName, 'userCtid': command.userCtid, 'dispalyName': command.sendName }], 1)
                    }
                }
            } else {
                for (let index = 0; index < this.senderArry.length; index++) {
                    const element = this.senderArry[index]
                    if (element.userCtid == command.userCtid) {
                        isHave = false
                        break
                    }
                }
                if (isHave) {
                    this.senderArry.push({ 'mailType': command.mailType, 'sendName': command.sendName, 'userCtid': command.userCtid, 'dispalyName': command.sendName })
                    if (this.dialogtype != 0) {
                        this.reviseAccount([{ 'mailType': command.mailType, 'sendName': command.sendName, 'userCtid': command.userCtid, 'dispalyName': command.sendName }], 1)
                    }
                }
            }
        },
        targetRemove(item, type) {
            if (type == 0) {
                for (let index = 0; index < this.recipientArry.length; index++) {
                    const element = this.recipientArry[index]
                    if (element.userCtid == item.userCtid) {
                        this.recipientArry.splice(index, 1)
                        if (this.dialogtype != 0) {
                            this.reviseAccount([element], 0)
                        }
                    }
                }
            } else { // 发送
                for (let index = 0; index < this.senderArry.length; index++) {
                    const element = this.senderArry[index]
                    if (element.userCtid == item.userCtid) {
                        this.senderArry.splice(index, 1)
                        if (this.dialogtype != 0) {
                            this.reviseAccount([element], 0)
                        }
                    }
                }
            }
        },
        reviseAccount(Arry, type) {
            let _this = this
            let paramsData = {
                'accountId': _this.accountId,
                'delUsers': type == 0 ? Arry : [],
                'action': 'alter',
                'addUsers': type == 1 ? Arry : []
            }
            _this.$http.put(_this.Global.baseURL + _this.Global.api.SystemSet.mailset.mailaccount.reviseAccounts,
                paramsData).then(function (res) {
                    if (res.body.code.toString() != _this.Global.RES_OK) {
                        _this.$message.error(_this.msg(res.body))
                        // if (type == 1) {
                        //     _this.$message.error(_this.$t('mxpcweb.systemset.mailset.mailaccount.1529042124909'))// 添加失败
                        // } else {
                        //     _this.$message.error(_this.$t('mxpcweb.systemset.accountsettings.1533287099718'))// 删除失败
                        // }
                    }
                })
        },
        clear() {
            this.mailAddress = ''
            this.recPassword = ''
            this.recMailAddress = ''
            this.displayName = ''
            this.recUser = ''
            this.sendUser = ''
            this.sendName = ''
            this.sendPass = ''
            this.serverType = ''
            this.owners = [] // 公共邮箱才有此项
            this.configs = []
            this.owner = ''
            // 服务
            this.smtpServer = '' // smtp服务器地址
            this.smtpSSL = false // smtp加密
            this.smtpPort = '' // smtp端口

            this.imapServer = '' // imap服务器地址
            this.imapSSL = false // imap加密
            this.imapPort = '' // imap端口

            this.popServer = '' // pop服务器地址
            this.popSSL = false // pop加密
            this.popPort = '' // pop端口

            this.PulicPortServer = '' // 服务器地址
            this.PulicPortSSL = false // 加密
            this.PulicPortPort = '' // 端口
            // popSSLL: false,//pop加密
            this.startTls = false // 加密传输
            this.dialogtype = 0
            this.accountId = 0
            this.typeName = this.$t('mxpcweb.systemset.mailset.mailaccount.1529032463835') // "添加",
            this.titleName = this.$t('mxpcweb.systemset.mailset.mailaccount.1529040025499') // "添加邮箱帐号",
            this.disabledAll = false
            this.disableAgree = true
            this.EdiPulicPort = true
            this.Edismtp = true
            this.EdistartTls = true
            this.source = 0
            this.RightOrWrong = false
        },
        Verification() {
            let _this = this
            let Message = ''
            let Stop = false
            var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/

            if (_this.mailAddress == '') {
                Message = _this.$t('mxpcweb.systemset.mailset.mailaccount.1529040463968') // "邮箱账号不允许为空";
                Stop = true
            } else if (_this.mailAddress != '') {
                if (!reg.test(_this.mailAddress)) {
                    Stop = true
                    Message = _this.$t('mxpcweb.systemset.mailset.mailaccount.1529040463604') // "请输入正确邮箱账号";
                }
            }
            if (_this.recPassword == '' && !Stop) {
                Message = _this.$t('mxpcweb.systemset.mailset.mailaccount.1529040511977') // "邮箱密码不允许为空";
                Stop = true
            } else if (!Stop) {
                let mailAddressArry = _this.mailAddress.toLowerCase().split('@')
                _this.RightOrWrong = false
                if (mailAddressArry[1] == 'qq.com') {
                    var regTwo = /^[a-z]{16,16}$/g
                    if (!regTwo.test(_this.recPassword)) {
                        Message = _this.$t('mxpcweb.systemset.mailset.mailaccount.1529040463806') // "请使用授权码登录";
                        _this.RightOrWrong = true
                        Stop = true
                    }
                }
            }
            if (_this.recMailAddress != '' && !Stop) {
                if (!reg.test(_this.recMailAddress)) {
                    Stop = true
                    Message = _this.$t('mxpcweb.systemset.mailset.mailaccount.1529041942939') // "请输入正确回复地址";
                }
            }
            if (_this.recMailAddress != '' && !Stop) {
                if (!reg.test(_this.recMailAddress)) {
                    Stop = true
                    Message = _this.$t('mxpcweb.systemset.mailset.mailaccount.1529041942939') // "请输入正确回复地址";
                }
            }
            if (!Stop) {
                if (_this.displayName == '') {
                    Message = _this.$t('mxpcweb.systemset.mailset.mailaccount.1529041915556') // "显示名字不允许为空";
                } else if (_this.recUser == '') {
                    Message = _this.$t('mxpcweb.systemset.mailset.mailaccount.1529041917864') // "接收账号名不允许为空";
                } else if (!reg.test(_this.recUser)) {
                    Message = _this.$t('mxpcweb.systemset.mailset.mailaccount.1529041918090') // "请输入正确接收账号名";
                } else if (_this.PulicPortServer == '') {
                    Message = _this.$t('mxpcweb.systemset.mailset.mailaccount.1529041918333') // "收信服务器不允许为空";
                } else if (_this.PulicPortPort == '') {
                    Message = _this.$t('mxpcweb.systemset.mailset.mailaccount.1529041932232') // "收信服务器端口不允许为空";
                } else if (_this.smtpServer == '') {
                    Message = _this.$t('mxpcweb.systemset.mailset.mailaccount.1529041932537') // "SMTP服务器不允许为空";
                } else if (_this.smtpPort == '') {
                    Message = _this.$t('mxpcweb.systemset.mailset.mailaccount.1529041942675') // "SMTP服务器端口不允许为空";
                } else if (_this.ESMTP == 1) { // 指定发信账号
                    if (_this.sendUser == '' && _this.sendPass == '') {
                        Message = _this.$t('mxpcweb.systemset.mailset.mailaccount.1529041943183') // "发送账号、发送账号密码不允许为空";
                    } else if (_this.sendUser == '') {
                        Message = _this.$t('mxpcweb.systemset.mailset.mailaccount.1529041962907') // "发送账号不允许为空";
                    } else if (_this.sendPass == '') {
                        Message = _this.$t('mxpcweb.systemset.mailset.mailaccount.1529041963159') // "发送账号密码不允许为空";
                    }
                    if (!reg.test(_this.sendUser)) {
                        Message = _this.$t('mxpcweb.systemset.mailset.mailaccount.1529041963380') // "请输入正确发送账号";
                    }
                }
            }

            _this.errorMessage = Message
            if (_this.errorMessage != '' || _this.RightOrWrong) {
                _this.loading2 = false
                _this.$message.error(_this.errorMessage)// '失败'
                return false
            } else {
                return true
            }
        }
    },
    components: {
        'sender-component': SenderComponent
    },
    watch: {

        PulicPortSSL: {
            handler(curVal, oldvalue) {
                if (curVal) {
                    if (this.mailboxProtocol == 'POP') {
                        this.PulicPortPort = 995
                    } else {
                        this.PulicPortPort = 993
                    }
                } else {
                    if (this.mailboxProtocol == 'POP') {
                        this.PulicPortPort = 110
                    } else {
                        this.PulicPortPort = 143
                    }
                }
            }
        },
        smtpSSL: {
            handler(curVal, oldvalue) {
                if (curVal) {
                    this.startTls = false
                    this.smtpPort = 465
                } else if (!this.startTls) {
                    this.smtpPort = 25
                }
            }
        },
        startTls: {
            handler(curVal, oldvalue) {
                if (curVal) {
                    this.smtpSSL = false
                    this.smtpPort = 587
                } else if (!this.smtpSSL) {
                    this.smtpPort = 25
                }
            }
        },
        smtpPort: {
            handler(curVal, oldvalue) {
                if (curVal == 587) {
                    this.startTls = true
                }
            }

        }
    }
}

</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
