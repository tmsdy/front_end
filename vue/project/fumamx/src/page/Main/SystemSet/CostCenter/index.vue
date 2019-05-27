<template>
    <div class="mainWrap CostCenter MXscroll">
        <!--大标题-->
        <!-- 费用中心 -->
        <page-title v-if="tabModel!='5'" :showTitle="false"></page-title>
        <el-tabs v-model="tabModel" @tab-click="handleClick" class="subTabs-pullRight">
            <!-- 我的账户 -->
            <el-tab-pane :label="$t('mxpcweb.am.1533022880132')" name="0">
            </el-tab-pane>
            <!-- 消费明细 -->
            <el-tab-pane :label="$t('mxpcweb.am.1533022948858')" name="1">
            </el-tab-pane>
            <!-- 充值记录 -->
            <el-tab-pane :label="$t('mxpcweb.am.1534299861139')" name="2">
            </el-tab-pane>
            <!-- 发票管理 -->
            <el-tab-pane :label="$t('mxpcweb.am.1533023014984')" name="3">
            </el-tab-pane>
            <!-- 发票设置 -->
            <el-tab-pane :label="$t('mxpcweb.am.1533023038850')" name="4">
            </el-tab-pane>
        </el-tabs>
        <div v-if="tabModel=='0'" style="margin-top:33px;">
            <div class="borderBox">
                <el-row>
                    <el-col :span="8">
                        <div class="borderImg" style="text-align:center">
                            <img src="./img/u121.png" alt="">
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="userInfo">
                            <div class="userName">
                                <!-- 您好！ -->
                                {{userName}} {{$t('mxpcweb.am.1531904949067')}}
                            </div>
                            <div class="userTip">
                                <!-- 欢迎来到您的新工作区！ -->
                                {{$t('mxpcweb.am.1531904951975')}}
                            </div>
                            <div class="money">
                                <!-- 余额： -->
                                {{$t('mxpcweb.am.1531904952199')}}<span class="moneyShow">￥{{parseFloat(avaliableBalance).toFixed(2)}}</span>
                                <!-- 充值 -->
                                <el-button class="moneyAdd" type="success" @click="tabModel = '5'">{{$t('mxpcweb.am.1531904952432')}}</el-button>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <template v-if="tabModel=='1'">
            <tab1 class="tabComponent"></tab1>
        </template>

        <template v-if="tabModel=='2'">
            <tab2 class="tabComponent"></tab2>
        </template>

        <template v-if="tabModel=='3'">
            <tab3 class="tabComponent" @backPage="backPage"></tab3>
        </template>
        <template v-if="tabModel=='4'">
            <tab4 class="tabComponent"></tab4>
        </template>
        <template v-if="tabModel=='5'">
            <recharge ref="recharge" :avaliableBalance="avaliableBalance+''" @backPage="backPage" @getListData="getListData"></recharge>
        </template>
    </div>
</template>

<script>
import PageTitle from '@/components/PageTitle/index' // 大标题
import score from '../../AM/sendSet/vue/score.vue'
import tab1 from './tab/tab1.vue'
import tab2 from './tab/tab2.vue'
import tab3 from './tab/tab3.vue'
import tab4 from './tab/tab4.vue'
import recharge from './tab/recharge.vue'
export default {
    name: 'CostCenter',
    props: {

    },
    data() {
        return {
            tabModel: '0',
            loading: true,
            avaliableBalance: '0',
            userName: '',
            scoreData: '6',
            itemData: {
                domain_name: 'test.laifuyun.com'
            }
        }
    },
    mounted() {

    },
    created() {
        this.routeUrl = this.$route.path
        this.getAvaliableBalance()
    },
    mounted() {
    },
    methods: {
        backPage(type) {
            this.tabModel = type
            // this.getAvaliableBalance()
        },
        getAvaliableBalance() {
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.pay_ac_info).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK && res.body.data.entity != null) {
                    _this.avaliableBalance = res.body.data.entity.overallbalancestring
                } else if (res.body.code.toString() != '-3') {
                    _this.avaliableBalance = 0
                    // _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        getListData(obj) {
            let _this = this
            var p1 = new Promise((resolve, reject) => {
                _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.setting_mis_scuser).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        resolve(res.body.data.entity)
                    } else if (res.body.code.toString() != '-3') {
                        //   _this.$message.error(_this.msg(res.body))
                        _this.loading = false
                    } else {
                        _this.loading = false
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            var p2 = new Promise((resolve, reject) => {
                _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.pay_ac_info).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        resolve(res.body.data)
                    } else if (res.body.code.toString() != '-3') {
                        resolve({
                            entity: {
                                overallbalancestring: '0'
                            }
                        })
                        _this.$message.error(_this.msg(res.body))
                    } else {
                        resolve({
                            entity: {
                                overallbalancestring: '0'
                            }
                        })
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            Promise.all([p1, p2]).then(function (results) {
                _this.loading = false
                _this.avaliableBalance = results[1].entity.overallbalancestring
                // _this.scoreData = Math.floor(results[0].reputation) / 10 + ''
                // _this.userName = results[0].userName
            })
        },
        handleClick() {
            if (this.tabModel == '0') {
                this.getListData()
            }
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
    },
    components: {
        'page-title': PageTitle,
        'score': score,
        'recharge': recharge,
        'tab1': tab1,
        'tab2': tab2,
        'tab3': tab3,
        'tab4': tab4
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
