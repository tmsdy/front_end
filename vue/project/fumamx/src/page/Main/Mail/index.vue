<template>
    <div class="Mail">
        <!-- 客户抽屉 -->
        <!--  <customer-slider></customer-slider> -->

        <!-- 菜单伸展按钮 -->
        <div @click="navSlider" :class="[isNavSlider ? 'navSlider' : 'navSliderClose']">
            <i class="iconfont" :class="[isNavSlider ? 'icon-page-left' : 'icon-page-right']"></i>
        </div>

        <aside class="navLeft" ref="navLeft" style="overflow: hidden;">
            <div class="userItem">
                <span class="userAvatar"><img :src="picUrl"></span>
                <span class="userName">{{svalue==''?personalInfo.realName:svalue}}</span>
                <span class="showBranch text-hover pull-right">
                    <!-- 下属 -->
                    <!-- <el-dropdown menu-align="start" @command="StaffSwitching">
                        <span class="el-dropdown-link text-hover">
                            <i class="iconfont icon-search-not"></i>
                            {{$t('mxpcweb.mail.1528941738999')}}
                        </span>
                        <el-dropdown-menu slot="dropdown" class="MXscroll" style="min-height:100px;max-height:300px;overflow:auto;">
                            <el-dropdown-item v-for="(item,index) in options" :key="index" :command='{name:item.realName,value:item.ctId,avatar:item.avatar}'>
                                <span :class="item.ctId==company.ctId?'text-red':''"> {{item.realName}}</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown> -->
                    <drop-search :value="selStaff" @change="StaffSwitching2" :list="options" :getDisabled="staffIsDisabled" labelKey="realName" valueKey="ctId">
                        <span class="el-dropdown-link text-hover">
                            <i class="iconfont icon-search-not"></i>
                            <!-- 下属 -->
                            {{$t('mxpcweb.mail.1528941738999')}}
                        </span>
                    </drop-search>
                </span>
            </div>

            <div class="receiveItem">
                <div v-loading.body="receiveMailLoading">
                    <span @click="receiveMail">
                        <!-- 收邮件 -->
                        {{$t('mxpcweb.mail.1528941745307')}}</span>
                    <span v-if="isShowReceiveMailError" class="icoWarn">
                        <i class="iconfont icon-sign" @click.stop="showMailLogDialog"></i>
                    </span>
                    <span @click.stop="">
                        <el-dropdown trigger="click" menu-align="start" @command="handleCommand">
                            <span class="el-dropdown-link text-hover">
                                <i class="iconfont icon-page-down"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown" style="margin-top:-5px">
                                <el-dropdown-item :command='{actionName:"showLogDialog"}'>
                                    <!-- 邮件日志 -->
                                    {{$t('mxpcweb.mail.1528941746305')}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </span>
                </div>
                <div>
                    <span @click="openNewMailWithoutTemplate">
                        <!-- 写邮件 -->
                        {{$t('mxpcweb.mail.1528941747561')}}</span>
                    <span @click.stop="">
                        <el-dropdown trigger="click" menu-align="start" @command="openNewMail">
                            <span class="el-dropdown-link text-hover">
                                <i class="iconfont icon-page-down"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown" v-if="newMailTemplateList.length > 0" style="margin-top:-5px">
                                <el-dropdown-item v-for="(templateItem,index) in newMailTemplateList" :key="index" :command='{templateId:templateItem.templateId,type:"W"}'>{{templateItem.templateName}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </span>
                </div>
            </div>
            <div class="logmx" v-if="logShow&&logMXShow">
                <div class="logmini">
                    <el-progress :text-inside="true" :percentage="80" :show-text="false" class="progress"></el-progress>
                    <label class="lable">54/122</label>
                    <span class="iconclose" @click="logShow=false"><i class="iconfont icon-close"></i></span>
                    <span class="iconleft"><i class="iconfont icon-page-left"></i></span>
                    <span class="iconright"><i class="iconfont icon-page-right"></i></span>
                    <div class="detailbox MXscroll">
                        <div class="labeltitle"><span class="dateStr">14:04:02</span><span>正在连接到服务器pop.qq.com:955连接成功</span></div>
                        <div class="labeltitle"><span class="dateStr">14:04:02</span><span>正在连接到服务器pop.qq.com:955连接成功</span></div>

                    </div>

                    <div class="icondown" @click="logMXShow=false"><i class="iconfont icon-page-up"></i></div>
                </div>
            </div>
            <div class="log">
                <div class="logmini" v-if="logShow">
                    <el-progress :text-inside="true" :percentage="80" :show-text="false" class="progress"></el-progress>
                    <label class="lable">54/122</label>
                    <span class="iconclose" @click="logShow=false"><i class="iconfont icon-close"></i></span>
                    <span class="iconleft"><i class="iconfont icon-page-left"></i></span>
                    <div class="labeltitle">正在连接到服务器pop.qq.com:955连接成功</div>
                    <span class="iconright"><i class="iconfont icon-page-right"></i></span>
                    <div class="icondown" @click="logMXShow=true"><i class="iconfont icon-page-down"></i></div>
                </div>

            </div>

            <!-- 树在这 -->
            <left-navigation-bar ref="LeftNavigationBar" @showMail="showMail" :style="{top:logShow?'150px':'90px'}"></left-navigation-bar>
            <router-link to="/main/systemset/mailset/setindex">
                <div class="btnMailSet">
                    <i class="iconfont icon-switch-main"></i>
                    <!-- 邮件设置 -->
                    {{$t('mxpcweb.mail.1528941849537')}}</div>
            </router-link>
        </aside>
        <section class="mainRight" ref="mainRight">
            <el-tabs v-model="editableTabsValue" closable @tab-remove="removeTabTips" @tab-click="handleClick">
                <el-tab-pane v-for="(item, index) in editableTabs" :key="item.name" :label="item.title" :name="item.name">
                    <span v-if="index == 0" slot="label" :class="'tab_fixed'">
                        <i class="iconfont" :class="item.iconURI"></i>{{item.title}}
                    </span>
                    <span v-else slot="label" :class="'tab_width'" :title="item.title">{{item.title}}</span>
                    <component v-bind:is="item.content" :ref="'NewMail'+index" @OperationTrigger="OperationTrigger"></component>
                </el-tab-pane>
            </el-tabs>
        </section>

        <!-- 添加文件夹 -->
        <dialog-add-folder ref="DialogAddFolder" @mailsMailboxesGet="mailsMailboxesGet()"></dialog-add-folder>
        <dialog-user ref="DialogUser"></dialog-user>
        <Dialog-Mail-Logs ref="DialogMailLogs" @reReceiveMail="receiveMail"></Dialog-Mail-Logs>
        <!-- 邮件,弹窗 -->
        <dialog-mail ref="DialogMail"></dialog-mail>
        <merging-time ref="MergingTime"></merging-time>
        <!-- 新建邮箱账户 -->
        <dialog-mailAccount ref="mailAccount"></dialog-mailAccount>
        <audio ref="audio" src="/static/audio/dingdong.mp3" style="display:none" preload="auto"></audio>
        <puablic-action ref="puablicAction" @LastListCenter="LastListCenter"></puablic-action>
    </div>
</template>

<script>
/**
 * 描述：邮件部分
 * 作者：向士健：UI /逻辑：陈媛媛/后台：刘孟金
 * 时间：2017/11/11
 */
// import TreeMenu from './Vue/TreeMenu'
import TabRoute from '@/components/TabRoute/index.vue'
import DialogAddFolder from './Vue/DialogAddFolder'
import { isArray, isObject } from '@/libs/utils.js'
import { mapGetters, mapMutations } from 'vuex'
import Home from './Home/index.vue'
import Detail from './Detail/index.vue'
import NewMail from './NewMail/index.vue'
import DialogUser from './Vue/DialogUser/index.vue'
import DialogMailLogs from './Vue/DialogMailLogs/index.vue'
import DialogMail from './Vue/DialogMail'
import CustomerSlider from '@/components/CustomerSlider/index.vue'
import NewMailAccountPopup from '../SystemSet/MailSet/MailAccount/Popup/index.vue'
import MergingTime from './Vue/MergingTime/index'
import LeftNavigationBar from './LeftNavigationBar/index'
import mixin from './mixin.js'
import puablicAction from './Home/vue/puablicAction'
import DropSearch from '@/components/DropSearch'
export default {
    name: 'Mail',
    props: {},
    mixins: [mixin],
    data() {
        return {
            picUrl: '/static/images/noAvatar.png',
            editableTabsValue: 'index',
            editableTabs: [{
                title: this.$t('mxpcweb.mail.1528959525973'), // "邮件管理",
                name: 'index',
                content: 'home'
            }],
            isNavSlider: true, // 左菜单导航，展开开关
            isShowReceiveMailError: false, // 错误邮件提示
            receiveMailLoading: false, // 收件loading
            mailErrorList: [], // 邮件出错列表
            svalue: '',
            selStaff: null,
            options: [], // 下属
            mailTemplateList: [], // 模板列表
            newMailTemplateList: [],
            currentUrl: '/main/mail/home/index',
            AccountNmber: '', // 当前选中的账号
            showName: '',
            frequency: 0,
            logShow: false,
            logMXShow: false,
            tableIndex: 0,
            IsMessageReminder: true

        }
    },

    computed: {
        ...mapGetters(['company', 'personalInfo']),
        ...mapGetters('mail', [
            'refurbishBool',
            'selectedBoxId',
            'treeCustmerBool',
            'subordinateCtid',
            'boxCount'
        ])
    },
    created() {
        let _this = this
        _this.set_selectedBoxId({})
        _this.set_selectedBoxName('')
        _this.set_subordinateCtid(0)
        _this.getMailStatus() // 获取收件错误提示
        // 注册弹出邮件消息气泡
        ep.tail('receiveMailMessage', function (data) {
            _this.mailTipMessage(data)
        })
        // 打开新邮件tab
        ep.tail('openNewMail', function (data = {}) {
            _this.openNewMail(data)
        })
        // 注册打开邮件详情页事件
        ep.tail('openMailDetail', function ({ mId, boxId }) {
            _this.openDetail(mId, boxId)
        })
        // 注册关闭tab邮件tab事件
        ep.tail('closeMailTab', function (targetName) {
            _this.closeMailTab(targetName)
        })
        // 注册修改当前邮件标题事件
        ep.tail('editMailTabTitle', function ({ title, name }) {
            _this.editableTabs.forEach((tab, index) => {
                if (name != '') {
                    if (tab.name == name) {
                        tab.title = title
                    }
                } else {
                    if (tab.name == _this.$route.params.id) {
                        tab.title = title
                    }
                }
            })
        })
        // 到邮件固定页
        ep.tail('mailTabIndex', () => {
            this.editableTabsValue = 'index'
            this.editHash('index')
        })

        // 关闭已删除窗体
        ep.tail('removeTabAuto', function (obj) {
            _this.removeTabAuto(obj)
        })
        this.editHash('index')
        this.getSrc(this.personalInfo.avatar)
        ep.tail('mailEvent', data => {
            this.$refs.LeftNavigationBar.mailsMailboxesGet() // 获取文件夹列表
            this.set_refurbishListBool(3) // 刷新邮件列表
        })
    },
    mounted() {
        this.InitializationPage()// 页面初始化
        /// this.autoGetMail('mxMailDB', 1, 'Mail', this.company.cId + '_' + this.company.ctId + 'table', 'table')
    },
    methods: {
        staffIsDisabled(item) {
            return item === this.selStaff
        },
        LastListCenter(mIds, actionName) {
            this.$refs['NewMail' + this.tableIndex][0].LastListCenter(mIds, actionName)
        },
        // 操作
        OperationTrigger(key, key2, key3, key4) {
            this.$refs.puablicAction.OperationTrigger(key, key2, key3, key4)
        },
        mailsMailboxesGet() {
            this.$refs.LeftNavigationBar.mailsMailboxesGet()
        },
        getSrc(id) {
            // let id = this.personalInfo.avatar
            if (id && id != '' && id != '5,01a572250c77') {
                this.picUrl = this.getGlobalImgSrc(id, '32x32')
            } else {
                this.picUrl = '/static/images/noAvatar.png'
            }
        },
        async   GetRightsCheck(data) {
            let blg = false
            if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                data.targetCtid = this.subordinateCtid
            } else {
                data.targetCtid = this.company.ctId
            }
            let res = await this.$http.get(this.Global.baseURL + this.Global.api.Mail.GetRightsCheck, {
                params: data
            })
            if (res.body.code.toString() == this.Global.RES_OK) {
                blg = true
            } else {
                this.$message.error(this.msg(res.body))
                blg = false
            }
            return blg
        },
        /**
         * 显示邮件新建账号页面
         */
        showMail() {
            this.$refs.mailAccount.showMail()
            // let _this = this
            // _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.mailset.mailaccount.accounts, { params: { type: 'all' } }).then(function (res) {
            //     if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data) && isArray(
            //         res.body.data.mailAccountsInfo)) {
            //         // let data = res.body.data.mailAccountsInfo
            //     } else if (res.body.code.toString() == _this.Global.RES_OK) {
            //         _this.$refs.mailAccount.showMail()
            //     } else {
            //         this.$message.error(this.msg(res.body))
            //     }
            // },
            //     function (res) {
            //         _this.$message.error(_this.$t(_this.Global.errorTitle))
            //     }
            // )
        },
        /**
         * 加载模板列表
         */
        getMailTemplate() {
            let _this = this
            _this.mailTemplateList = []
            _this.newMailTemplateList = []
            var subCtid = this.subordinateCtid == 0 ? '' : this.subordinateCtid
            this.$http.get(this.Global.baseURL + this.Global.api.Mail.mailsTmplSelectGet, { params: { type: '', ctid: subCtid } }).then(function (res) {
                if (res.body.code.toString() == this.Global.RES_OK && isArray(res.body.data) && res.body.data.length > 0) {
                    _this.mailTemplateList = []
                    _this.newMailTemplateList = []
                    _this.mailTemplateList = res.body.data
                    _this.mailTemplateList.forEach(element => {
                        if (element.templateType == 2) {
                            _this.newMailTemplateList.push(element)
                        }
                    })
                } else {
                    _this.mailTemplateList = []
                    _this.newMailTemplateList = []
                }
            },
                function (res) {
                    this.$message.error(this.$t(this.Global.errorTitle))
                }
            )
        },
        // 下属人员显示
        StaffShow() {
            this.$http.get(this.Global.baseURL + this.Global.api.Mail.GetPersonnels, { params: {} }).then(function (res) {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    // console.log(res.body.data)
                    let Arry = [{
                        ctId: this.company.ctId,
                        avatar: this.personalInfo.avatar,
                        // "我自己"
                        realName: this.$t('mxpcweb.mail.1528957810380')
                    }]
                    let data = res.body.data
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].ctId != this.company.ctId) {
                            Arry.push({
                                ctId: data[i].ctId,
                                avatar: data[i].avatar,
                                realName: data[i].realName
                            })
                        }
                    }
                    this.options = Object.freeze(Arry)
                    this.selStaff = Arry[0]
                } else {
                    this.$message.error(this.msg(res.body))
                }
            },
                function (res) {
                    this.$message.error(this.$t(this.Global.errorTitle))
                }
            )
        },
        // 获取收件错误提示
        getMailStatus() {
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.Mail.getMailStatus, {}).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    // if (isArray(res.body.data)) {
                    //     var tipText = ''
                    //     // 根据状态值来获取有问题的账户信息（列表）
                    //     res.body.data.forEach(element => {
                    //         if (element.status == '-1') {
                    //             tipText =
                    //                 tipText + element.mailAccount + ':'
                    //             tipText = tipText + _this.$t('mxpcweb.mail.1530002866891')// "账号认证失败;";
                    //         } else if (element.status == '-2') {
                    //             tipText =
                    //                 tipText + element.mailAccount + ':'
                    //             tipText = tipText + _this.$t('mxpcweb.mail.1530002887711')// "超时;";
                    //         }
                    //     })
                    //     if (tipText != '') {
                    //         // 不为空则说明有错误邮箱，如果为空则说明都是对的 不需要显示了。
                    //         _this.isShowReceiveMailError = true
                    //         _this.$message.error(tipText)
                    //     }
                    //     _this.mailErrorList = res.body.data
                    // }
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            },
                function (res) {
                    _this.$message.error(_this.Global.errorTitle)
                }
            )
        },
        /**
         * 操作下拉
         */
        handleCommand(command) {
            if (command.actionName == 'showLogDialog') {
                // 显示收件日志
                // this.$refs.DialogMailLogs.initData(this.mailErrorList)
                this.$refs.DialogMailLogs.isDialog('open')
                this.isShowReceiveMailError = false
            }
        },
        /**
         * 收件
         */
        receiveMail() {
            let _this = this
            _this.receiveMailLoading = true // 暂时注释
            _this.$http.get(_this.Global.baseURL + _this.Global.api.Mail.getMailsManualRec, {}).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    setTimeout(() => {
                        _this.receiveMailLoading = false
                        _this.$message.success(
                            _this.$t('mxpcweb.mail.1528959584948') // "您的接收邮件请求已发送到服务器"
                        )
                    }, 2000)
                    // ep.emit("reloadList", "");
                } else {
                    setTimeout(() => {
                        _this.receiveMailLoading = false
                        _this.$message.error(_this.msg(res.body))
                    }, 2000)
                }
            },
                function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
        },
        /**
         * 新邮件提醒
         */
        mailTipMessage(messageData) {
            console.log('新邮件提醒')
            console.log(messageData)
            let _this = this
            if (typeof messageData.body == 'object' && (messageData.msgSubType == 5 || messageData.msgSubType == 13)) {
                // 声音提醒
                // this.$refs['audio'].play()
                // 刷新文件夹数量
                this.$refs.LeftNavigationBar.mailsMailscountGet()
                // 刷新邮件列表
                this.set_refurbishListBool(3)
                if (!this.IsMessageReminder) { // 不弹出消息提醒
                    return
                }
                if (messageData.msgSubType == 13) {
                    if (!isObject(messageData.body.rawData)) {
                        messageData.body.rawData = JSON.parse(messageData.body.rawData)
                    }
                }
                let str = messageData.deliveryTime.split(' ')
                let deliveryTime = str.length == 2 ? str[1] : messageData.deliveryTime
                if (isObject(messageData.body.rawData, true)) {
                    // 单封邮件提醒
                    var boxId = messageData.body.rawData.folder
                    var mid = messageData.body.rawData.mId
                    var sendMail = messageData.body.rawData.fromEx[0].address // 发件人
                    var mailSubject = messageData.body.rawData.subject // 主题
                    var msgbody = mailSubject

                    _this.$notify.info({
                        title: sendMail,
                        message: deliveryTime + ' ' + msgbody,
                        duration: 30000,
                        customClass: 'text-hover',
                        onClick() {
                            this.close()
                            _this.openDetail(mid, boxId)
                        }
                    })
                } else {
                    // 多封邮件提醒
                    _this.$notify.info({
                        title: _this.$t('mxpcweb.mail.1528959634364'), // "邮件提醒",
                        message: deliveryTime + ' ' + messageData.body.msgBody,
                        duration: 30000,
                        customClass: 'text-hover',
                        onClick() {
                            this.close()
                            // _this.openDetail(mid, boxId);
                            // 刷新文件夹数量
                            // _this.mailsMailscountGet()
                            // 刷新邮件列表
                            // _this.set_refurbishListBool(3)
                        }
                    })
                }
            }
        },
        /**
         * 显示日志窗口
         */
        showMailLogDialog() {
            this.$refs.DialogMailLogs.isDialog('open')
            this.isShowReceiveMailError = false
        },
        // 写邮件
        async   openNewMailWithoutTemplate() {
            if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                let blg = await this.GetRightsCheck({ 'optCode': 'otReplies', 'moduleCode': 'EM001' })
                if (!blg) {
                    return
                }
            }
            ep.emit('openNewMail', {
                title: this.$t('mxpcweb.mail.1528941747561'), // "写邮件",
                type: 'W'
            })
        },
        // 点击邮件详情tab
        async openDetail(mId, boxId) {
            // let getMailsMail = await this.$http.get(this.Global.baseURL + this.Global.api.Mail.getMailsMail, {
            //     params: {
            //         type: 'details',
            //         mId: mId
            //     }
            // }
            // )
            let title = this.$t('mxpcweb.mail.1528959777676')// "邮件详情";
            // if (getMailsMail.body.data && getMailsMail.body.data.subject) {
            //     title = getMailsMail.body.data.subject
            // }
            this.boxId = boxId == undefined ? 0 : boxId
            let name = 'detail_' + mId + '_' + boxId + '_0'
            let isOpen = true
            // 判断打开详情页的页面是否被打开
            this.editableTabs.forEach(element => {
                if (element.name == name) {
                    isOpen = false
                    return false
                }
            })
            if (isOpen) {
                this.editHash(name)
                this.editableTabs.push({
                    title: title,
                    name: name,
                    detaiId: mId,
                    content: 'detail'
                })
                this.editableTabsValue = name
            } else {
                this.editableTabsValue = name
            }
        },
        // 点击写邮件tab
        openNewMail(data = {}) {
            let name = ''
            if (data.mId == undefined) { // 新建
                name = `newmail_${btoa(encodeURIComponent(JSON.stringify(data)))}_${new Date() * 1}`
            } else { // 回复
                name = `Reply_${btoa(encodeURIComponent(JSON.stringify(data)))}_${new Date() * 1}_` + data.mId
            }
            this.editHash(name)
            // 没传说明用户是打开了新邮件，只是刷新页面这样的场景
            this.editableTabs.push({
                title: data.title || this.$t('mxpcweb.mail.1528941747561'), // "写邮件",
                name: name,
                content: 'newmail'
            })
            //   this.autoSaveMail('mxMailDB', 1, 'Mail', { unionId: this.company.cId + '_' + this.company.ctId + 'table', editableTabs: this.editableTabs })
            this.editableTabsValue = name
            if (data.recipientsPicking) {
                let { id } = this.$route.params
                let ids = id.split('_')
                setTimeout(() => {
                    ep.emit('CustmerWriteMail' + ids[2], { recipientsPicking: data.recipientsPicking })
                }, 100)
            }
        },
        // 关闭删除界面
        removeTabAuto(detaiIds) {
            if (this.editableTabs.length > 1) {
                for (let index = 0; index < this.editableTabs.length; index++) {
                    const element = this.editableTabs[index]
                    if (detaiIds.length > 1) {
                        for (let index2 = 0; index2 < detaiIds.length; index2++) {
                            const element2 = detaiIds[index2]
                            if (element.detaiId == element2) {
                                this.closeMailTab(element.name)
                            }
                        }
                    } else {
                        if (element.detaiId == detaiIds[0]) {
                            this.closeMailTab(element.name)
                        }
                    }
                }
            }
        },
        // 关闭提示
        removeTabTips(targetName) {
            // 判断关闭的是否是写邮件
            if (targetName.indexOf('newmail') > -1 || targetName.indexOf('Reply') > -1) {
                // this.$confirm("是否关闭编辑邮件?", "提示", {
                this.$confirm(this.$t('mxpcweb.mail.1528969598154'), this.$t('mxpcweb.mail.1528969862511'), {
                    confirmButtonText: this.$t('mxpcweb.mail.1528942374762'), // "确定",
                    cancelButtonText: this.$t('mxpcweb.mail.1528942364802'), // "取消",
                    type: 'warning'
                }).then(() => {
                    this.closeMailTab(targetName)
                }).catch(() => { })
            } else {
                this.closeMailTab(targetName)
            }
        },
        // 关闭table页
        closeMailTab(targetName) {
            let tabs = this.editableTabs
            let activeName = this.editableTabsValue
            if (activeName === targetName) {
                tabs.forEach((tab, index) => {
                    if (tab.name === targetName) {
                        let nextTab = tabs[index + 1] || tabs[index - 1]
                        if (nextTab) {
                            activeName = nextTab.name
                        }
                    }
                })
                if (targetName.split('_')[0] != 'detail') {
                    // this.$refs.LeftNavigationBar.mailsMailboxesGet() // 获取文件夹列表
                    // this.set_refurbishListBool(2) // 刷新邮件列表
                    // 调用写邮件的关闭处理
                    ep.emit(targetName, {})
                }
            }
            this.editableTabsValue = activeName
            this.editableTabs = tabs.filter(tab => tab.name !== targetName)
            this.editHash(activeName)
            // this.autoSaveMail('mxMailDB', 1, 'Mail', { unionId: this.company.cId + '_' + this.company.ctId + 'table', editableTabs: this.editableTabs })
            // this.deleteAutoMail('mxMailDB', 1, 'Mail', targetName) // 删除详情
        },
        // 切换table页
        handleClick(tab, event) {
            this.tableIndex = tab.index
            this.editHash(this.editableTabs[tab.index].name)
            if (tab.index > 0) {
                this.$refs['NewMail' + tab.index][0].openShow()
            }
        },
        // 同步设置
        ...mapMutations('mail', {
            set_selectedBoxId: 'SET_SELECTEDBOXID',
            set_selectedBoxName: 'SET_SELECTEDBOXNAME',
            set_refurbishListBool: 'SET_REFURBISHLISTBOOL',
            set_subordinateCtid: 'SET_SUBORDINATECTID',
            set_mailTemplateListG: 'SET_MAILTEMPLATELISTG',
            set_boxCount: 'SET_BOXCOUNT'

        }),
        InitializationPage() {
            this.StaffShow() // 下属人员显示
            this.getMailTemplate() // 获取模板列表
            this.$refs.LeftNavigationBar.mailsMailboxesGet() // 获取文件夹列表
            this.$refs.LeftNavigationBar.getcustomer() // 获取关注客户
            this.$refs.LeftNavigationBar.MailAccountList(2)
            this.GetOptions() // 获取设置项  是否提示新邮件信息
        },
        // 仅限左菜单大项高亮
        menuHightLight() {
            let $this = $(event.target)
            $this.parents('.navLeft').find('.active').removeClass('active')
            $this.addClass('active')
        },
        // 左菜单树抽屉，开关
        navSlider() {
            let fixW = '230px'
            this.$refs.navLeft.style.width = this.isNavSlider ? '0' : fixW
            this.$refs.navLeft.style.marginLeft = this.isNavSlider ? '-1px' : '0'// 去一个边框
            this.$refs.mainRight.style.marginLeft = this.isNavSlider ? '0' : fixW
            this.isNavSlider = !this.isNavSlider
        },
        // 修改哈希
        editHash(hash) {
            // 添加哈希值
            this.$router.push('/main/mail/home/' + hash)
        }, // 人员切换
        StaffSwitching(command) {
            // 我自己
            this.svalue = command.name == this.$t('mxpcweb.mail.1528957810380') ? this.personalInfo.realName : command.name
            this.set_subordinateCtid(command.value)
            this.getMailTemplate() // 获取模板列表
            this.AccountNmber = ''
            // 我的全部邮件
            this.showName = this.$t('mxpcweb.mail.1528957772500')// 我的全部邮件";
            // this.$refs.LeftNavigationBar.MailAccountList(2)// cyy
            // this.$refs.LeftNavigationBar.getcustomer()
            this.getSrc(command.avatar)// 头像切换
        },

        StaffSwitching2(item) {
            this.selStaff = item

            // 我自己
            this.svalue = item.realName == this.$t('mxpcweb.mail.1528957810380') ? this.personalInfo.realName : item.realName
            this.set_subordinateCtid(item.ctId)
            this.getMailTemplate() // 获取模板列表
            this.AccountNmber = ''
            // 我的全部邮件
            this.showName = this.$t('mxpcweb.mail.1528957772500')// 我的全部邮件";
            // this.$refs.LeftNavigationBar.MailAccountList(2)// cyy
            // this.$refs.LeftNavigationBar.getcustomer()
            this.getSrc(item.avatar)// 头像切换
        },
        GetOptions() {
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.mailset.setindex.GetOptions, { params: { itemCode: 'MessageReminder' } }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    if (res.body.data.mailOptionList && isArray(res.body.data.mailOptionList) && res.body.data.mailOptionList.length > 0) {
                        this.IsMessageReminder = res.body.data.mailOptionList[0].value == 0
                    } else {
                        this.IsMessageReminder = true
                    }
                } else {
                    this.IsMessageReminder = true
                    console.log(res.body)
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        }

    },
    components: {
        // 'tree-menu': TreeMenu,
        'tab-route': TabRoute,
        'dialog-add-folder': DialogAddFolder,
        'home': Home,
        'detail': Detail,
        'newmail': NewMail,
        'dialog-user': DialogUser,
        'Dialog-Mail-Logs': DialogMailLogs,
        'dialog-mail': DialogMail,
        'merging-time': MergingTime,
        'customer-slider': CustomerSlider,
        'dialog-mailAccount': NewMailAccountPopup,
        'left-navigation-bar': LeftNavigationBar,
        'puablic-action': puablicAction,
        'drop-search': DropSearch
    },
    watch: {
        // 刷新文件夹列表
        refurbishBool: {
            handler(curVal, oldvalue) {
                if (curVal == 1) {
                    this.$refs.LeftNavigationBar.mailsMailboxesGet() // 获取文件夹列表
                    this.$refs.LeftNavigationBar.MailAccountList(1)// 刷新下拉框数量
                }
            }
        },

        treeCustmerBool: {
            handler(curVal, oldvalue) {
                if (curVal == 1) {
                    this.$refs.LeftNavigationBar.getcustomer()
                }
            }
        },
        // 切换下属
        subordinateCtid: {
            handler(curVal, oldvalue) {
                if (curVal != 0) {
                    this.$refs.LeftNavigationBar.MailAccountList(2)// cyy
                    this.$refs.LeftNavigationBar.mailsMailboxesGet() // 获取文件夹列表
                    this.set_refurbishListBool(2) // 刷新邮件列表
                    this.$refs.LeftNavigationBar.getcustomer()
                }
            }
        },
        mailTemplateList: {
            handler(curVal, oldvalue) {
                this.set_mailTemplateListG(curVal)
            }
        },
        $route(newValue, oldValue) {
            if (oldValue.path.indexOf('/main/mail/home') == -1 && newValue.path.indexOf('/main/mail/home') > -1) {
                if (newValue.query && newValue.query.type == 'W') {
                    this.openNewMail(newValue.query)
                }
                // if (this.frequency != 0) {
                // console.log('刷新')
                this.getMailStatus() // 获取邮件日志
                this.getMailTemplate()
                this.$refs.LeftNavigationBar.mailsMailboxesGet() // 获取文件夹列表
                this.set_refurbishListBool(3) // 刷新邮件列表
                this.$refs.LeftNavigationBar.getcustomer()// 客户数
                // }
                // this.frequency = 1
            } else if (oldValue.path.indexOf('/main/mail/home/index') > -1 && newValue.path.indexOf('/main/mail/home/index') > -1) {
                this.openNewMail(oldValue.query)
            }

            // 切换路由，获取模板列表
            // if (this.mailTemplateList != undefined && newValue.path.indexOf('/main/mail/home') > -1) {
            //     this.getMailTemplate()
            // }
            // 切换到别的页面再切回来
            // if (newValue.fullPath == this.currentUrl && this.frequency != 0) {
            //     this.StaffShow() // 下属人员显示
            //     this.$refs.LeftNavigationBar.MailAccountList(1)// cyy
            //     this.$refs.LeftNavigationBar.mailsMailboxesGet() // 获取文件夹列表
            //     this.set_refurbishListBool(3) // 刷新邮件列表
            //     this.$refs.LeftNavigationBar.getcustomer()
            // } else if (newValue.fullPath == this.currentUrl && this.frequency == 0) {
            //     this.frequency = 1
            // }
            // 左侧导航进入
            // if (newValue.path == '/main/mail/home') {
            //     this.editHash(this.editableTabsValue)
            // }
        },
        boxCount: {
            handler(curVal, oldvalue) {
                if (curVal == 1) {
                    this.set_boxCount(0)
                    this.$refs.LeftNavigationBar.mailsMailscountGet()
                    this.$refs.LeftNavigationBar.MailAccountList(1)
                }
            }
        }
    }
}

</script>

<style lang="less" rel="stylesheet/less">
@import "./zh-cn.less";
@import "./en.less";
</style>
