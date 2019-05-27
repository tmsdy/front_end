<template>
    <div class="UserAvatar">
        <div class="userHeader transition_all" @click="showUserBody()" :class="{userActive:isActive}">
            <span class="arrow">
                <i class="iconfont" :class="[isActive ? 'icon-page-up' : 'icon-page-down']"></i>
            </span>
            <span class="avatar" :class="socketStatusClass">
                <span class="imgBox">
                    <img :src="picUrl">
                </span>
                <el-tooltip :content="socketStatusTitle" placement="bottom" effect="light">
                    <span @click.stop="handleConnect()" class="socketStatusPoint"></span>
                </el-tooltip>
            </span>
        </div>

        <transition name="fade">
            <div class="sliderBg" v-if="isActive" @click="isActive=false"></div>
        </transition>

        <transition name="slider-customer">
            <div class="sliderBody" v-show="isActive">
                <!-- 标题 -->
                <div class="title">
                    <!--个人中心-->
                    {{$t('mxpcweb.components.1530794322863')}}
                    <span class="pull-right text-hover">
                        <i class="iconfont icon-close" @click="isActive=false"></i>
                    </span>
                </div>
                <div class="userMain MXscroll">
                    <div class="text-center">
                        <span class="avatar">
                            <img :src="picUrl" width="40" height="40">
                        </span>
                        <div class="name">
                            <router-link to="/main/systemset/accountsettings" tag="div">
                                <div class="text-hover" @click="isActive=false">{{personalInfo.realName}}</div>
                            </router-link>
                            {{personalInfo.email}}
                        </div>
                        <div class="btn">
                            <router-link to="/main/systemset/accountsettings" v-accessAuthority>
                                <el-button @click="isActive=false" :disabled="isAccessAuthority('/main/systemset/accountsettings')">
                                    <!-- 个人中心 -->
                                    {{$t('mxpcweb.components.1530794322863')}}
                                </el-button>
                            </router-link>
                            <el-button @click="loginEnterprise()">
                                <!--安全退出-->
                                {{$t('mxpcweb.components.1530794426453')}}
                            </el-button>
                        </div>
                    </div>
                    <hr>
                    <dl>
                        <dt>
                            <!--系统公告-->
                            {{$t('mxpcweb.components.1530794532846')}}
                        </dt>
                        <dd>
                            <nodata size="small" v-if="systemNotice.length === 0"></nodata>
                            <ul v-else>
                                <li class="text-hover" v-for="(item,index) in systemNotice" :key="index" @click="goThisNotice(item)" :title="item.noticeCaption">
                                    {{item.noticeCaption}}
                                    <span class="pull-right">{{getNoticeTime(item.releaseDate)}}</span>
                                </li>
                            </ul>
                        </dd>
                    </dl>
                    <hr>
                    <dl>
                        <dt>
                            <!--订购-->
                            {{$t('mxpcweb.components.1530794583759')}}
                        </dt>
                        <dd>
                            <span class="label">
                                <!-- 您当前处于： -->
                                {{$t('mxpcweb.components.1530794617960')}}：</span>
                            <em class="ico"><i class="iconfont icon-MX"></i></em> {{userVersion.pkname}}
                        </dd>
                        <dd>
                            <span class="label">
                                <!--到期时间-->
                                {{$t('mxpcweb.systemset.applicationcenter.1530252220214')}}：</span>
                            {{returnDate(userVersion.expirationtime)}}
                        </dd>
                        <dd>
                            <span class="label">
                                <!--用户许可人数-->
                                {{$t('mxpcweb.systemset.applicationcenter.1530252271308')}}：</span>
                            {{userVersion.authcount}}
                            <!--人-->
                            {{$t('mxpcweb.components.1530795359867')}}
                        </dd>
                        <dd>
                            <span class="label">
                                <!--云空间-->
                                {{$t('mxpcweb.systemset.applicationcenter.1530252390189')}}：</span>
                            {{userVersion.spacecount}}GB
                        </dd>
                    </dl>
                    <!--产品续费与升级-->
                    <!-- <router-link to="/main/systemset/applicationcenter">
                    <el-button type="primary" size="large" class="widthFull" @click="isActive=false">
                        {{$t('mxpcweb.components.1530795457099')}}
                    </el-button>
                    </router-link> -->
                    <hr>
                    <dl>
                        <dt>
                            <!--需要帮助？-->
                            {{$t('mxpcweb.components.1530795492254')}}
                        </dt>
                    </dl>
                    <div class="btns">
                        <!-- 帮助中心 -->
                        <el-button @click="goHelpCenter()"><i class="iconfont icon-document"></i>
                            {{$t('mxpcweb.login.1542187247607')}}
                        </el-button>

                        <!--提交反馈-->
                        <el-button class="pull-right" @click="goFeedback()"> <i class="iconfont icon-edit"></i>
                            {{$t('mxpcweb.systemset.feedback.1529065305866')}}
                        </el-button>

                        <!--电话-->
                        <i></i>
                        <el-tooltip :content="$t('mxpcweb.client.1529027307480')+'：400-888-9800'" placement="bottom">
                            <el-button>
                                <i class="iconfont icon-telephone"></i>
                                <!--联系我们-->
                                {{$t('mxpcweb.components.1530795577582')}}
                            </el-button>
                        </el-tooltip>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
/**
 * 描述：顶部用户和头像，下拉设置
 * 作者：向士健
 * 时间：2017/8/8
 */
import { isObject } from '@/libs/utils.js'
import { MXsocket, socketStatus } from '@/libs/socket2.js'
import { mapGetters } from 'vuex'
import NoData from '@/basecomponents/NoData/index'

export default {
    name: 'UserAvatar',
    props: {

    },
    data() {
        return {
            // userAvatarImg: this.Global.initImg,
            picUrl: '/static/images/noAvatar.png',
            isActive: false,
            userVersion: {},
            systemNotice: [],
            socketStatusCode: 3,
            socketStatusItem: ''
        }
    },
    computed: {
        ...mapGetters(['personalInfo', 'company']),
        socketStatusClass() {
            let status = ''
            if (runtime === 'prod') {
                switch (this.socketStatusCode.toString()) {
                    case '1':
                        status = 'connecting'
                        break
                    case '2':
                        status = 'online'
                        break
                    case '3':
                        status = 'offline'
                        break
                    default:
                        break
                }
                return status
            }
            switch (this.socketStatusItem) {
                case socketStatus.connecting:
                    status = 'connecting'
                    break
                case socketStatus.success:
                    status = 'online'
                    break
                default:
                    status = 'offline'
                    break
            }
            return status
        },
        socketStatusTitle() {
            let title = ''
            if (runtime === 'prod') {
                switch (this.socketStatusCode.toString()) {
                    case '1':
                        title = '连接中'
                        break
                    case '2':
                        title = '连接正常'
                        break
                    case '3':
                        title = '连接失败'
                        break
                    default:
                        break
                }
                return title
            }

            switch (this.socketStatusItem) {
                case socketStatus.connecting:
                    title = '连接中'
                    break
                case socketStatus.success:
                    title = '连接正常'
                    break
                default:
                    title = '连接失败'
                    break
            }
            return title
        }
    },
    created() {
        this.getSrc()
        if (runtime === 'prod') {
            ep.tail('socketStatusChange', state => {
                console.log(`${state == 1 ? '😕' : state == 2 ? '🙂' : '🙁'}socket 连接状态改变:${state}`)
                this.socketStatusCode = state
            })
        } else {
            this.socketStatusItem = MXsocket.getStatus()
            MXsocket.on('statusChange', status => {
                this.socketStatusItem = status
            })
        }
    },
    methods: {
        handleConnect() {
            if (runtime === 'prod') {
                if (this.socketStatusCode == 3) {
                    console.log('手动连接')
                    ep.emit('handleSocketConnect')
                }
                return
            }

            if (this.socketStatusItem === socketStatus.failed) {
                console.log('手动连接')
                MXsocket.reconnect()
            }
        },
        goHelpCenter() {
            this.isActive = false // 关窗
            let helpUrl = window.runtime === 'prod'
                ? 'https://help.fumamx.com'
                : 'https://h3.laifuyun.com'

            if (this.Global.isFMApp) {
                this.openNewWindowTab('https://fumamx.com/pc/toHelpCenter?id=' + this.getToken()[this.Global.accessToken]) // 跳转到帮助
            } else {
                this.openNewWindowTab(helpUrl) // 跳转到帮助
            }
        },
        getNoticeTime(val) {
            return this.timeShow_custom(val, 'YYYY-MM-DD')
        },
        // 点击跳转到对应文章
        goThisNotice(item) {
            this.isActive = false // 关窗
            let url = '/main/systemset/systembulletin?noticeId=' + item.noticeId
            this.$router.push(url)
        },
        getData() {
            const url = this.Global.baseURL + this.Global.api.v2.getAuthInfo
            this.$http.get(url, { params: { cid: this.company.cId } })
                .then(res => {
                    if (res.body && res.body.code.toString() === this.Global.RES_OK && isObject(res.body.data)) {
                        // console.log(res.body.data)
                        this.userVersion = res.body.data
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                })
                .catch(res => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })

            // 系统公告，默认1条
            const url2 = this.Global.baseURL + this.Global.api.v2.sysNotice_get
            let params = {
                type: 'list',
                pageSize: 1,
                moduleCode: 'SY021',
                sort: 'releaseDate',
                order: 'desc' }
            this.$http.get(url2, { params })
                .then(res => {
                    if (res.body &&
                        res.body.code.toString() === this.Global.RES_OK &&
                        isObject(res.body.data)) {
                        this.systemNotice = res.body.data.result
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                })
                .catch(res => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        returnDate(date) {
            return this.$moment(date).format('YYYY-MM-DD') // 到期时间
        },
        goFeedback() {
            this.isActive = false

            ep.emit('optClick', {
                optData: {
                    optCode: 'otNew',
                    optModuleCode: 'WO002',
                    optName: this.$t('mxpcweb.systemset.feedback.1529065305866')
                }
            })
        },
        // 更新图片地址
        getSrc: function () {
            let id = this.personalInfo.avatar
            if (id && id != '' && id != '5,01a572250c77') {
                this.picUrl = this.getGlobalImgSrc(id, '64x64')
            } else {
                this.picUrl = '/static/images/noAvatar.png'
            }
        },
        // 点击控制弹窗呈现
        showUserBody: function () {
            this.isActive = !this.isActive
            if (this.isActive) {
                this.getData()
            }
            // 点击其他隐藏
            document.addEventListener('click', (e) => {
                if (!this.$el.contains(e.target)) this.isActive = false
            })
        }
    },
    watch: {
        // 一有改变，更新下图片地址
        personalInfo(val) {
            this.getSrc()
        }
    },
    components: {
        'nodata': NoData
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
