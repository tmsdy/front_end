<template>
    <div class="Main">
        <!--导航条-->
        <div class="header">
            <a href="javascript:void(0);" class="logo transition_all" style="-webkit-app-region: drag">
                <!--<span class="img"><img v-imgsrc="logo" /></span>-->
                <!--  上级要求先固定不可改logo的  -->
                <!--<span class="img"><img src="" /></span>-->
                <span class="img"><img src="/static/images/logo.png" /></span>
                <span class="companyName">{{companyBasicInfo.name}}</span>
            </a>
            <div class="drag" style="-webkit-app-region: drag"></div>
            <electron-operation></electron-operation>
            <!--用户和头像-->
            <user-avatar></user-avatar>
            <!-- 帮助中心 -->
            <go-help />
            <!--消息小闹钟-->
            <message-clock ref="message-clock" :messageNumber="messageNumber"></message-clock>
            <!-- 上传下载 -->
            <upload-download></upload-download>
            <!-- 快捷菜单 -->
            <shortcut-menu @clickMenu="clickMenu"></shortcut-menu>
            <!--顶部全局搜索框暂时注释 -->
            <!--<search-header></search-header>-->
            <!-- <fm-select :options="options" :value="value" filterable></fm-select> -->
        </div>
        <!--左侧菜单-->
        <div class="leftMenu MXscroll">
            <template v-for="(item,index) in navigator.navs">
                <el-tooltip :enterable="false" effect="light" :hide-after="1500" placement="right" :content="item.display" :key="index" v-if="item.naviCode != 'NV004'">
                    <router-link tag="div" class="menuList transition_all" :to="item.uRI" :data-url="item.uRI">
                        <i class="iconfont" :class="[item.iconURI]"></i>
                    </router-link>
                </el-tooltip>
            </template>
        </div>
        <!-- 设置项，特殊固定 -->
        <template v-for="(item,index) in navigator.navs">
            <el-tooltip :enterable="false" effect="light" :hide-after="1500" placement="right" :content="item.display" :key="index" v-if="item.naviCode == 'NV004'">
                <router-link tag="div" class="systemSet transition_all" :to="item.uRI">
                    <i class="iconfont icon-setting-main"></i>
                </router-link>
            </el-tooltip>
        </template>

        <!--右侧窗口-->
        <div class="rightWindow" :class="isNoBoder ? 'isNoBoder' : ''">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </div>
        <!-- 锁屏 -->
        <lock-screen></lock-screen>
        <!-- 超时 -->
        <over-time v-if="!isElectron"></over-time>
        <!-- 系统消息 -->
        <system-message v-for="(item,index) in systemMessageList" :key="index" :index="index" :item="item" @close="closeSystemMessage" ref="system-message"></system-message>
        <!-- 编辑质料 -->
        <edit-material ref="editMaterial"></edit-material>
        <!-- 快捷操作设置 -->
        <short-set ref="ShortSet"></short-set>

        <!-- 客户抽屉 -->
        <customer-slider></customer-slider>
        <!-- 自动化的提醒确认弹框 -->
        <strategy-notify ref="strategyNotify"></strategy-notify>
        <!-- 踢掉提醒 -->
        <el-dialog :title="$t('mxpcweb.g.1532499312023')" :visible.sync="loginEnterpriseDialogVisible" size="tiny">
            <span>{{ $t('mxpcweb.g.1532500201938') }}{{ loginEnterpriseTime }}{{ $t('mxpcweb.g.1532501168821') }}</span>
            <br /><br />
        </el-dialog>
        <!-- 系统通知 （发新版本通知） -->
        <system-notice></system-notice>

        <div class="globalLoading" v-show="globalLoading">
            <div class="globalLoadingText">{{globalLoadingText}}</div>
        </div>
        <popup></popup>

    </div>
</template>

<script>
import '@/libs/socket.js'
import { MXsocket/* , socketStatus */ } from '@/libs/socket2.js'
import Push from 'push.js'
import { setStore, getStore, clearCookiesStorege, loadScript } from '@/libs/utils.js'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import LockScreen from '@/components/LockScreen/index'
import Overtime from '@/components/Overtime/index.vue'
import ShortcutMenu from '@/components/ShortcutMenu/index'
import GoHelp from '@/basecomponents/GoHelp/index'
import ShortSet from '@/components/ShortSet/index'
import MsgClock from '@/components/MsgClock/index'
import UserAvatar from '@/components/UserAvatar/index'
import SystemMessage from '@/components/SystemMessage/index'
import StrategyNotify from '@/components/StrategyNotify/index'
import EditMaterial from '@/components/EditMaterial/index'
import UploadDownload from '@/components/UploadDownload/index.vue'
import SystemNotice from '@/basecomponents/SystemNotice/index.vue'
import ElectronOperation from '@/components/Electron/Operation/index.vue'
import Popup from '@/basecomponents/Popup/index.vue'
import CustomerSlider from '@/components/CustomerSlider/index.vue'
export default {
    name: 'Main',
    props: {},
    data() {
        return {
            isLockScreen: true,
            logo: this.Global.storeInitImg, // logo
            companyName: '', // 公司名称
            shortcutMenu: [], // 渲染快捷菜单数据
            systemMessageList: [], // 消息列表
            messageNumber: {}, // 消息数量
            loginEnterpriseDialogVisible: false,
            loginEnterpriseTime: 10,
            isElectron: navigator.userAgent.indexOf('Electron') !== -1,
            globalLoading: false,
            globalLoadingNum: 0,
            globalLoadingText: '',
            isNoBoder: true
        }
    },
    created() {
        // 1.进入系统后检查导航信息是否存在，存在继续，不存在退出系统，重新登录，来获取导航信息
        let navigator = getStore('navigator')
        if (navigator == undefined) {
            clearCookiesStorege() // 清空Cookies Storege
            location.reload() // 刷新
            return
        }
        this.set_navigator(navigator)

        this.initSocket()

        // 初始化全局状态
        this.storeInit()
        ep.tail('storeInit', () => {
            this.storeInit()
        })

        // 显示编辑资料
        ep.tail('editMaterialShow', data => {
            this.$refs['editMaterial'].show(data)
        })

        // 加载项目依赖的第三方包
        loadScript('https://webapi.amap.com/maps?v=1.4.11&key=18629938026b416e1a95925deba8f82f', () => {
            loadScript('https://webapi.amap.com/ui/1.0/main.js?v=1.0.11')
        })

        // 注册全局loading事件
        ep.tail('setGlobalLoading', data => {
            this.globalLoading = data.val
            this.globalLoadingText = data.text || ''
            if (data.val) {
                this.globalLoadingNum++
                let num = this.globalLoadingNum
                let time = setTimeout(() => {
                    if (num == this.globalLoadingNum) {
                        if (this.globalLoading) {
                            this.globalLoading = false
                            this.globalLoadingText = data.text || ''
                        }
                    }
                    window.clearTimeout(time)
                }, 20000)
            }
        })
    },
    computed: {
        ...mapGetters(['companyConfigInfo', 'navigator', 'companyBasicInfo'])
    },
    mounted() {
        this.initPush()
        $(window).resize(() => { // 定义窗口大小变更通知事件
            this.setScreenWidth()// 设置屏幕宽度
            this.setScreenHeight()// 设置屏幕高度
        })
        this.checkBoxStyle()
    },
    methods: {

        storeInit() {
            this.setNavigator({
                callback(data) {
                    // 更新本地数据
                    setStore(data)
                }
            }) // 设置导航数据
            this.set_company(getStore('company'))
            this.setPersonalInfo() // 设置个人信息
            this.setCompanyConfigInfo() // 设置企业配置信息
            this.setIndividualConfigInfo() // 设置个人配置信息
            this.setSysBoxValue() // 获取系统动态组件下拉框值
            this.setCusBoxValue() // 获取系统动态组件自定义下拉框值
            this.setFieldGroupType() // 获取组类型
            this.setDomain() // 获取系统后端域名前缀
            this.setSocialTypeList() // 获取社交类型
            this.setContactCheck()
            this.setContactList() // 获取企业内部所有人员
            this.setDepartmentList() // 获取企业内部所有部门
            // this.updatStaticResources()// 检查静态资源是否更新
            this.setCompanyBasicInfo()// 获取企业基础信息
            this.setScreenWidth()// 设置屏幕宽度
            this.setScreenHeight()// 设置屏幕高度
            this.set_unitList() // 商品模块计量单位
            this.set_currency() // 商品模块货币
            this.set_portList() // 商品港口

            this.set_customerInfo({})
            this.set_clientCheck({})
            this.set_routParameters({})
            this.set_moduleConfig([])
            this.set_countryList([])
            this.set_addEditSetList([])
            this.set_modifyEditSetList([])
        },
        initSocket() {
            // 线上先使用旧版本
            if (runtime === 'prod') {
                this.initOldSocket()
                return
            }

            MXsocket.connect()

            // 4.注册socket逻辑处理时间
            // ep.tail('weather', (data) => {
            MXsocket.on('weather', data => {
                if (typeof data !== 'object') {
                    return
                }
                if (document.hidden) {
                    this.notification(data)
                }

                switch (data.msgSubType) {
                    case 5:
                    case 13:
                        console.log('收到邮件提醒' + data.msgSubType, data)
                        // 收到邮件提醒
                        ep.emit('receiveMailMessage', data)
                        break
                    case 9:
                        console.log('消息类型9')
                        console.log(data)
                        // 添加邮件发送事件
                        ep.emit('mailsDeliveryStatusGet', data)
                        break
                    case 10:
                        console.log('消息类型10')
                        // 用于定时、延迟发送的邮件通知
                        ep.emit('MailDelayStateGet', data)
                        break
                    case 14:
                        // console.log(data)
                        ep.emit('systemNotice', data) // 打开弹窗，新版本通知
                        break
                    case 17:
                        /* 自动化通知的 */
                        this.$refs.strategyNotify.open(data)
                        break
                    default:
                        if (this.systemMessageList.length > 2) {
                            // 清空组件状态
                            let systemMessage = this.$refs['system-message']
                            if (systemMessage && systemMessage.length > 0) {
                                systemMessage.forEach(element => {
                                    element.initState()
                                })
                            }
                            this.systemMessageList.shift() // 删除第一个元素
                        }
                        if (this.systemMessageList.length < 3) {
                            this.systemMessageList.push(data)
                        }
                }
            })
            //   ep.tail('messageStats', (data) => {
            MXsocket.on('messageStats', data => {
                if (typeof data == 'object') {
                    this.messageNumber = data
                }
            })

            // 7.注册退出系统事件
            // ep.tail('loginEnterprise', () => {
            MXsocket.on('offsiteLogin', () => {
                this.loginEnterpriseDialogVisible = true
                setInterval(() => {
                    this.loginEnterpriseTime = this.loginEnterpriseTime - 1
                    if (this.loginEnterpriseTime === 0) {
                        this.loginEnterpriseDialogVisible = false
                        this.loginEnterprise()
                    }
                }, 1000)
            })
        },
        initOldSocket() {
            window.MXsocket()
            // 4.注册socket逻辑处理时间
            ep.tail('weather', (data) => {
                if (typeof data !== 'object') {
                    return
                }
                if (document.hidden) {
                    this.notification(data)
                }

                switch (data.msgSubType) {
                    case 5:
                    case 13:
                        console.log('收到邮件提醒' + data.msgSubType, data)
                        // 收到邮件提醒
                        ep.emit('receiveMailMessage', data)
                        break
                    case 9:
                        console.log('消息类型9')
                        console.log(data)
                        // 添加邮件发送事件
                        ep.emit('mailsDeliveryStatusGet', data)
                        break
                    case 10:
                        console.log('消息类型10')
                        // 用于定时、延迟发送的邮件通知
                        ep.emit('MailDelayStateGet', data)
                        break
                    case 14:
                        // console.log(data)
                        ep.emit('systemNotice', data) // 打开弹窗，新版本通知
                        break
                    case 17:
                        /* 自动化通知的 */
                        this.$refs.strategyNotify.open(data)
                        break
                    default:
                        if (this.systemMessageList.length > 2) {
                            // 清空组件状态
                            let systemMessage = this.$refs['system-message']
                            if (systemMessage && systemMessage.length > 0) {
                                systemMessage.forEach(element => {
                                    element.initState()
                                })
                            }
                            this.systemMessageList.shift() // 删除第一个元素
                        }
                        if (this.systemMessageList.length < 3) {
                            this.systemMessageList.push(data)
                        }
                }
            })
            //   ep.tail('messageStats', (data) => {
            ep.tail('messageStats', (data) => {
                if (typeof data == 'object') {
                    this.messageNumber = data
                }
            })

            // 7.注册退出系统事件
            // ep.tail('loginEnterprise', () => {
            ep.tail('loginEnterprise', () => {
                this.loginEnterpriseDialogVisible = true
                setInterval(() => {
                    this.loginEnterpriseTime = this.loginEnterpriseTime - 1
                    if (this.loginEnterpriseTime === 0) {
                        this.loginEnterpriseDialogVisible = false
                        this.loginEnterprise()
                    }
                }, 1000)
            })
        },
        initPush() {
            if (!Push.Permission.has()) {
                Push.Permission.request(() => { }, () => { })
            }
        },
        notification(data) {
            let options = {
                body: data.body.msgBody,
                timeout: 8000,
                onClick: function () {
                    window.focus()
                    this.close()
                }
            }
            if (!this.Global.isFMApp) {
                Object.assign(options, { icon: '/static/images/favicon.ico' })
            }
            Push.create('孚盟MX', options)
        },
        // 关闭消息
        closeSystemMessage(index) {
            this.systemMessageList.splice(index, 1)
        },
        // 点击快捷菜单选项
        clickMenu(str) {
            let _this = this
            if (str == 'setShort') {
                _this.$refs.ShortSet.openWindow()
                return false
            }
            ep.emit('setGlobalLoading', {
                val: true,
                // 权限校验中...
                text: this.$t('mxpcweb.client.list.1550126019122') + '...'
            })
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.document_rightCheck_do, {
                params: {
                    moduleCode: str.moduleCode,
                    identFieldValue: 0,
                    optCode: str.optCode
                }
            }).then(function (res) {
                ep.emit('setGlobalLoading', {
                    val: false,
                    text: ''
                })
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    let obj = {
                        optCode: str.optCode,
                        optModuleCode: str.moduleCode,
                        optName: str.caption
                    }
                    ep.emit('optClick', {
                        optData: obj
                    })
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                ep.emit('setGlobalLoading', {
                    val: false,
                    text: ''
                })
                _this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        // 添加消息成功回调
        addMsgSuccess() {
            // 刷新日程提醒列表
            ep.emit('refreshScheduleRemindList')
        },
        // 同步设置
        ...mapMutations({
            set_company: 'SET_COMPANY',
            set_navigator: 'SET_NAVIGATOR'
        }),
        // 异步实现
        ...mapActions([
            'setNavigator', // 异步定时刷
            'setPersonalInfo', // 设置
            'setCompanyConfigInfo', // 设置企业信息
            'setIndividualConfigInfo', // 设置个人配置信息
            'setSysBoxValue', // 获取系统下拉框值
            'setCusBoxValue', // 获取系统下拉框值
            'setFieldGroupType', // 获取组类型
            'setDomain', // 获取系统后端域名前缀
            'setCompanyBasicInfo', // 设置企业基础信息
            'setContactList', // 获取企业全部人员
            'setDepartmentList', // 获取企业全部部门
            'setSocialTypeList', // 获取社交类型
            'setContactCheck', // 获取是否为管理员权限
            'setScreenWidth', // 设置屏幕宽度
            'setScreenHeight' // 设置屏幕高度
        ]),
        // 同步设置
        ...mapActions('goods', [
            'set_unitList',
            'set_currency',
            'set_portList'
        ]),
        // 同步设置
        ...mapMutations('client', {
            set_customerInfo: 'SET_CUSTOMERINFO',
            set_clientCheck: 'SET_CLIENTCHECK',
            set_routParameters: 'SET_ROUTPARAMETERS',
            set_moduleConfig: 'SET_MODULECONFIG',
            set_countryList: 'SET_COUNTRYLIST',
            set_addEditSetList: 'SET_ADDEDITSETLIST',
            set_modifyEditSetList: 'SET_MODIFYEDITSETLIST'
        }),
        checkBoxStyle() {
            this.isNoBoder = this.$route.path.indexOf('workbench') > -1
        }
        // 提醒用户更新静态资源
        // updatStaticResources () {
        // 开发环境不操作
        // if (this.Global.isDev) {
        //   return
        // }
        // // Cookie有值，说明用户取消了提醒，不操作
        // if (getCookie('updatStaticResources') != undefined) {
        //   return
        // }
        // // 是否打开，保证对话框只有一个
        // let isOpen = true
        // if (isOpen) {
        //   this.$http.get(this.Global.baseURL + this.Global.api.UniversalInterface.versionInspect, { params: {} }).then((res) => {
        //     if (res.body.code.toString() === this.Global.RES_OK) {
        //       isOpen = false
        //       if (res.body.data.version.toString() != version.toString()) {
        //         this.$alert('发现新版本，是否刷新页面更新', '系统提醒', {
        //           confirmButtonText: '确定',
        //           cancelButtonText: '取消',
        //           callback: action => {
        //             isOpen = true
        //             if (action == 'confirm') {
        //               location.reload()
        //             }
        //             setCookie('updatStaticResources', action, { expires: 7 })
        //           }
        //         })
        //       }
        //     }
        //   })
        // }
        // },
        // 获取服务器端时间戳
        // getDictionary (id) {
        //    return this.$http.get(this.Global.baseURL + this.Global.api.v2.dictionary + id, { params: {} });
        // }
    },
    watch: {
        '$route'() {
            this.checkBoxStyle()
        },
        companyConfigInfo() {
            this.logo = this.getGlobalImgSrc(this.companyConfigInfo.logoUrl, '260x100')
        }
    },
    components: {
        'lock-screen': LockScreen,
        'over-time': Overtime,
        'shortcut-menu': ShortcutMenu,
        'go-help': GoHelp,
        'message-clock': MsgClock,
        'user-avatar': UserAvatar,
        'system-message': SystemMessage,
        'strategy-notify': StrategyNotify,
        'upload-download': UploadDownload,
        'edit-material': EditMaterial,
        'short-set': ShortSet,
        /* 'mgsstatustitle': MgsStatusTitle, */
        'system-notice': SystemNotice,
        'electron-operation': ElectronOperation,
        'popup': Popup,
        'customer-slider': CustomerSlider
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
