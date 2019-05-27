<template>
    <div class="sendSet MXscroll">
        <!--大标题-->
        <!-- 发送设置 -->
        <page-title :showTitle="false" style="z-index:1;" :title="$t('mxpcweb.am.1531903938449')" iconfont="icon-setting">
        </page-title>
        <div v-show="listTab=='0'" style="padding-bottom:0px;height:100%" v-loading="loading">
            <div v-if="tabModel=='0'">
                <div class="borderBox">
                    <el-row style="margin-bottom:42px">
                        <el-col :span="8">
                            <div class="title">
                                信誉度
                            </div>
                            <div>
                                <score :scoreData="scoreData"></score>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div style="width:167px;margin: 0 auto;text-align:left">
                                <div class="title">
                                    当天请求额度
                                </div>
                                <div class="userInfo">
                                    <el-progress style="margin-top:26px;" :stroke-width="8" :percentage="percentage"></el-progress>
                                    <div style="margin-top:20px;">
                                        <span style="color:#FF0000">{{haveMoney}}</span>
                                        of {{allMoney}}
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div style="width:157px;margin: 0 auto;text-align:left">
                                <div class="title">
                                    <!-- 余额： -->
                                    {{$t('mxpcweb.am.1531904952199')}}<span class="moneyShow">￥{{avaliableBalance>0?avaliableBalance.toFixed(2):avaliableBalance}}</span>
                                </div>
                                <div class="userInfo">
                                    <div class="money">
                                        <!-- 余额： -->
                                        <!-- 充值 -->
                                        <el-button class="moneyAdd" type="success" @click="tabModel = '4'">{{$t('mxpcweb.am.1531904952432')}}</el-button>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                    <div class="stepsSet" :style="{height:domainList.length!==0&&sendList.length!==0?'130px':''}">
                        <div class="list list1">
                            <div v-if="MaxVerify==39">
                                <div class="circle circle1">1</div>
                                <!-- 网站域名已验证 -->
                                <div style="color: rgb(87, 184, 130);font-weight:bold">{{$t('mxpcweb.am.1531904987984')}}</div>
                                <!-- 加入网站域名可以改善邮件的到达率。 -->
                                <div style="font-size:12px;margin-top:10px;color:RGBA(144, 147, 153, 1)">{{$t('mxpcweb.am.1531904952816')}}</div>
                            </div>
                            <div v-else>
                                <div class="circle circle1">1</div>
                                <!-- 提供您的网站域名 -->
                                <div style="font-weight:bold">{{$t('mxpcweb.am.1531903698979')}}</div>
                                <!-- 加入网站域名可以改善邮件的到达率。 -->
                                <div style="font-size:12px;margin-top:10px;color:RGBA(144, 147, 153, 1)">{{$t('mxpcweb.am.1531904952816')}}</div>
                                <!-- 新增发信域名 -->
                                <el-button style="margin-top:10px;" type="primary" @click="openAddWebsite">{{$t('mxpcweb.am.1531904784321')}}</el-button>
                            </div>
                        </div>
                        <div class="list list2">
                            <div v-if="sendList.length==0">
                                <div class="circle circle2">2</div>
                                <!-- 设置发件人 -->
                                <div style="color: #3D425E;font-weight:bold">{{$t('mxpcweb.am.1531904988403')}}</div>
                                <!-- 验证您的邮箱，让收件人知道您是可信任的发件人。 -->
                                <div style="font-size:12px;margin-top:10px;color:RGBA(144, 147, 153, 1)">{{$t('mxpcweb.am.1531904999704')}}</div>
                                <!-- 添加发件人 -->
                                <el-button style="margin-top:15px;" type="primary" @click="openAddSendPeople('0')">{{$t('mxpcweb.am.1531903046900')}}</el-button>
                            </div>
                            <div v-else>
                                <div class="circle circle2">2</div>
                                <!-- 发件人已设置 -->
                                <div style="color: rgb(87, 184, 130);font-weight:bold">{{$t('mxpcweb.am.1531905010152')}}</div>
                                <!-- 验证您的邮箱，让收件人知道您是可信任的发件人。 -->
                                <div style="font-size:12px;margin-top:10px;color:RGBA(144, 147, 153, 1)">{{$t('mxpcweb.am.1531904999704')}}</div>
                            </div>
                        </div>
                        <div class="listStep" :style="{'line-height':domainList.length!==0&&sendList.length!==0?'56px':''}">
                            <i class="iconfont icon-page-right listStepIcon"></i>
                        </div>
                    </div>
                </div>
                <div class="tableBox">
                    <el-row class="title">
                        <el-col :span="10">
                            <!-- 发信域名 -->
                            {{$t('mxpcweb.am.1531904784544')}}
                        </el-col>
                        <el-col :span="11">
                            <!-- IP类型 -->
                            {{$t('mxpcweb.am.1531904784744')}}
                        </el-col>
                        <el-col :span="3">
                            <!-- 状态 -->
                            {{$t('mxpcweb.am.1531903971129')}}
                        </el-col>
                    </el-row>
                    <no-data v-if="domainList.length==0" style="background:rgba(255,255,255,0)"></no-data>
                    <el-row v-else v-for="(item,index) in domainList" :key="index" class="list listBorder">
                        <el-col :span="10">
                            {{item.domainName}}
                        </el-col>
                        <el-col :span="11">
                            <!-- IP类型 -->
                            {{$t('mxpcweb.am.1531904784744')}}
                        </el-col>
                        <el-col :span="3" :style="{color:statusColor[item.domainVerify]}">
                            {{getStatusName(item.domainVerify)}}
                        </el-col>
                    </el-row>
                    <div class="list1">
                        <!-- 更多域名配置 -->
                        <el-button type="primary" @click="tabModel='1'">{{$t('mxpcweb.am.1531905016543')}}</el-button>
                    </div>
                </div>

                <div class="tableBox">
                    <el-row class="title">
                        <el-col :span="10">
                            <!-- 发件人地址 -->
                            {{$t('mxpcweb.am.1531904457425')}}
                        </el-col>
                        <el-col :span="11">
                            <!-- 默认显示名称 -->
                            {{$t('mxpcweb.am.1531905046687')}}
                        </el-col>
                        <el-col :span="3">
                            <!-- 使用人员 -->
                            {{$t('mxpcweb.am.1531904286368')}}
                        </el-col>
                    </el-row>
                    <no-data v-if="sendList.length==0"></no-data>
                    <el-row v-else class="list listBorder" v-for="(item,index) in sendList" :key="index">
                        <el-col :span="10">
                            {{item.address}}
                        </el-col>
                        <el-col :span="11">
                            {{item.name}}
                        </el-col>
                        <el-col :span="3">
                            <people-show :ctid="item.ctId" :owners="owners"></people-show>
                        </el-col>
                    </el-row>
                    <div class="list1">
                        <!-- 更多发件人设置 -->
                        <el-button type="primary" @click="tabModel='2'">{{$t('mxpcweb.am.1531905060759')}}</el-button>
                    </div>
                </div>
                <div class="itemTip">
                    <!-- 本系统仅限商业用途、严禁传送任何反政府或是违反法律等相关内容。 -->
                    <span style="color:#adc6dd;background:#f2f2f2;font-size:12px;">{{$t('mxpcweb.am.1531905061015')}}</span>
                </div>
            </div>
            <template v-if="tabModel=='1'">
                <tab-sendWebsite ref="tabSendWebsite" @openAddWebsite="openAddWebsite" @openDetail="openDetail"></tab-sendWebsite>
            </template>

            <template v-if="tabModel=='2'">
                <tab-sendset ref="tabSendSet" :owners="owners" @openAddSendPeople="openAddSendPeople"></tab-sendset>
            </template>

            <template v-if="tabModel=='3'">
                <tab-replySet ref="tabReplySet" :owners="owners" @openAddSendPeople="openAddSendPeople"></tab-replySet>
            </template>
            <template v-if="tabModel=='4'">
                <recharge ref="recharge" :avaliableBalance="avaliableBalance+''" :productType="'am'" @backPage="backPage" @getListData="getListData"></recharge>
            </template>
            <set-website ref="setWebsite"></set-website>
            <add-website ref="addWebsite" @getListData="getListDatas"></add-website>
            <add-sendPeople ref="addSendPeople" :owners="owners" :domainList="domainList" @getListDatas="getListDatas"></add-sendPeople>
        </div>
        <domain-config v-if="listTab=='1'" :itemData="itemData" @openList="openList" style="z-index:2">
        </domain-config>
        <div class="pageTab" style="z-index:1">
            <el-tabs v-model="tabModel" @tab-click="handleClick" class="subTabs-pullRight">
                <!-- 发送设置 -->
                <el-tab-pane :label="$t('mxpcweb.am.1531903938449')" name="0">
                </el-tab-pane>
                <!-- 发信域名 -->
                <el-tab-pane :label="$t('mxpcweb.am.1531904784544')" name="1">
                </el-tab-pane>
                <!-- 发件人设置 -->
                <el-tab-pane :label="$t('mxpcweb.am.1531905080352')" name="2">
                </el-tab-pane>
                <!-- 回复人设置 -->
                <el-tab-pane :label="$t('mxpcweb.am.1531905091335')" name="3">
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import PageTitle from '@/components/PageTitle/index' // 大标题
import listPage from '@/components/listPageTwo/index' // 分页
import { isArray } from '@/libs/utils.js'
import { mapGetters } from 'vuex'
import NoData from '@/basecomponents/NoData/index'
import setWebsite from './dialog/setWebsite.vue'
import addSendPeople from './dialog/addSendPeople.vue'
import addWebsite from './dialog/addWebsite.vue'
import tabSendWebsite from './vue/tabSendWebsite.vue'
import tabSendset from './vue/tabSendset.vue'
import tabReplySet from './vue/tabReplySet.vue'
import score from './vue/score.vue'
import peopleShow from './vue/peopleShow.vue'
import domainConfig from './vue/domainConfig.vue'
// import recharge from './vue/recharge.vue'
import recharge from '../../SystemSet/CostCenter/tab/recharge'
export default {
    name: 'sendSet',
    props: {

    },
    data() {
        return {
            tabModel: '0',
            loading: true,
            avaliableBalance: '0',
            userName: '',
            scoreData: '0',
            domainList: [],
            sendList: [],
            listTab: '0',
            itemData: {
                domainName: 'test.laifuyun.com'
            },
            owners: [],
            haveMoney: 0,
            allMoney: 0,
            percentage: 0,
            statusColor: {
                0: 'RGBA(255, 113, 101, 1)', // 未经证实的
                2: 'RGBA(255, 113, 101, 1)', // 未经证实的
                7: 'RGBA(255, 183, 53, 1)', // 可获得的
                39: 'RGBA(139, 216, 103, 1)' // 已证实的
            },
            MaxVerify: 0
        }
    },
    mounted() {

    },
    created() {
        let _this = this
        this.routeUrl = this.$route.path
        ep.tail('upDateSendSetList', function (obj) {
            _this.getListData()
        })
        this.getListData()
    },
    mounted() {
    },
    methods: {
        getStatusName(key) {
            if (key > this.MaxVerify) {
                this.MaxVerify = key
            }
            let name = ''
            switch (parseInt(key)) {
                case 0:
                case 2:
                    name = '未验证'
                    break
                case 7:
                    name = '可使用'
                    break
                case 39:
                    name = '已验证'
                    break

                default:
                    name = '未验证'
                    break
            }
            return name
        },

        backPage(type) {
            this.tabModel = type
            this.getAvaliableBalance()
        },
        openDetail(item) {
            this.itemData = item
            this.listTab = '1'
        },
        openList() {
            this.listTab = '0'
            this.$refs.tabSendWebsite.getListData()
        },
        getAvaliableBalance() {
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.pay_ac_info).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.avaliableBalance = res.body.data.entity.overallbalance
                } else if (res.body.code.toString() != '-3') {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        getListData(obj) {
            let _this = this
            var p1 = new Promise((resolve, reject) => {
                this.$http.get(this.Global.baseURL + this.Global.api.v2.domainManage_Get, { params: {} }).then((res) => {
                    if (res.body.code.toString() === this.Global.RES_OK) {
                        if (isArray(res.body.data.domainList)) {
                            resolve(res.body.data.domainList)
                        } else {
                            resolve([])
                        }
                    } else if (res.body.code.toString() != '-3') {
                        this.$message.error(_this.msg(res.body))
                        this.loading = false
                    } else {
                        this.loading = false
                    }
                }, (res) => {
                    this.loading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
            })
            var p2 = new Promise((resolve, reject) => {
                this.$http.get(this.Global.baseURL + this.Global.api.v2.sendAndReply_Get, { params: { type: 'send' } }).then((res) => {
                    if (res.body.code.toString() === this.Global.RES_OK) {
                        if (isArray(res.body.data.addressList)) {
                            resolve(res.body.data.addressList)
                        } else {
                            resolve([])
                        }
                    } else if (res.body.code.toString() != '-3') {
                        this.$message.error(_this.msg(res.body))
                        this.loading = false
                    } else {
                        this.loading = false
                    }
                }, function (res) {
                    this.$message.error(this.$t(this.Global.errorTitle))
                    this.loading = false
                })
            })

            var p3 = new Promise((resolve, reject) => {
                let contactData = {
                    dataType: 'contact',
                    funType: 'all'
                }
                _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.accountDropList_get, { params: contactData }).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.owners = res.body.data
                        resolve([])
                    } else if (res.body.code.toString() != '-3') {
                        _this.$message.error(_this.msg(res.body))
                        resolve([])
                    } else {
                        resolve([])
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            var p4 = new Promise((resolve, reject) => {
                _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.setting_mis_scuser).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        resolve(res.body.data.entity)
                    } else if (res.body.code.toString() != '-3') {
                        _this.$message.error(_this.msg(res.body))
                        _this.loading = false
                    } else {
                        _this.loading = false
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            var p5 = new Promise((resolve, reject) => {
                _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.pay_ac_info).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        resolve(res.body.data)
                    } else if (res.body.code.toString() != '-3') {
                        resolve({
                            entity: {
                                overallbalance: '0'
                            }
                        })
                        _this.$message.error(_this.msg(res.body))
                    } else {
                        resolve({
                            entity: {
                                overallbalance: '0'
                            }
                        })
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            var p6 = new Promise((resolve, reject) => {
                _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.am_userInfo).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        resolve(res.body.data)
                    } else {
                        resolve({})
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            Promise.all([p1, p2, p3, p4, p5, p6]).then(function (results) {
                _this.domainList = results[0]
                _this.sendList = results[1]
                _this.loading = false
                _this.avaliableBalance = results[4].entity.overallbalance
                _this.scoreData = results[3] && (results[3].reputation + '' || '0')
                _this.allMoney = results[5] && (results[5].quota || 0)
                _this.haveMoney = results[5] && (results[5].todayUsedQuota || 0)
                let percentage = _this.allMoney != 0 ? (parseInt(_this.haveMoney) / parseInt(_this.allMoney)) * 100 : 0
                _this.percentage = Math.floor(percentage * 10) / 10
                _this.userName = _this.personalInfo.realName
            })
        },
        handleClick() {
            this.listTab = '0'
            if (this.tabModel == '0') {
                this.getListData()
            }
        },
        getListDatas() {
            let _this = this
            if (_this.tabModel == '0') {
                _this.getListData()
            } else if (_this.tabModel == '1') {
                _this.$refs.tabSendWebsite.getListData()
            } else if (_this.tabModel == '2') {
                _this.$refs.tabSendSet.getListData()
            } else if (_this.tabModel == '3') {
                _this.$refs.tabReplySet.getListData()
            }
        },
        openAddWebsite() {
            this.$refs.addWebsite.showDialog()
        },
        openAddSendPeople(type) {
            this.$refs.addSendPeople.showDialog(type)
        }
    },
    watch: {
        '$route': function (val, old) {
            if (val.path == this.routeUrl) {
                this.tabModel = '0'
                this.handleClick()
            }
        }
    },
    computed: {
        ...mapGetters([
            'personalInfo'
        ])
    },
    components: {
        'page-title': PageTitle,
        'list-page': listPage,
        'no-data': NoData,
        'set-website': setWebsite,
        'add-sendPeople': addSendPeople,
        'add-website': addWebsite,
        'tab-replySet': tabReplySet,
        'tab-sendset': tabSendset,
        'tab-sendWebsite': tabSendWebsite,
        'score': score,
        'people-show': peopleShow,
        'domain-config': domainConfig,
        'recharge': recharge
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
