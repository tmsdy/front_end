<template>
    <div class="mainWrap FinancialManage MXscroll">
        <!--大标题-->
        <!-- 财务管理 -->
        <page-title :showTitle="false" title="财务管理" iconfont="icon-setting">
        </page-title>
        <template v-if="tabModel=='1'">
            <tab1></tab1>
        </template>

        <template v-if="tabModel=='2'">
            <tab2></tab2>
        </template>

        <template v-if="tabModel=='3'">
            <tab3></tab3>
        </template>
        <template v-if="tabModel=='4'">
            <tab4></tab4>
        </template>
        <!-- <template v-if="tabModel=='5'">
            <tab5></tab5>
        </template> -->
        <div class="pageTab" style="z-index:0">
            <el-tabs v-model="tabModel" @tab-click="handleClick" class="subTabs-pullRight">
                <!-- 消费明细 -->
                <el-tab-pane :label="$t('mxpcweb.am.1533022948858')" name="1">
                </el-tab-pane>
                <!-- 充值记录 -->
                <el-tab-pane :label="$t('mxpcweb.am.1534299861139')" name="2">
                </el-tab-pane>
                <!-- 退款记录 -->
                <el-tab-pane :label="$t('mxpcweb.am.1533542824367')" name="3">
                </el-tab-pane>
                <!-- 开票邮寄 -->
                <el-tab-pane :label="$t('mxpcweb.am.1533542850285')" name="4">
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import PageTitle from '@/components/PageTitle/index' // 大标题
import tab1 from './tab/tab1.vue'
import tab2 from './tab/tab2.vue'
import tab3 from './tab/tab3.vue'
import tab4 from './tab/tab4.vue'
export default {
    name: 'FinancialManage',
    props: {

    },
    data() {
        return {
            tabModel: '1',
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
        // this.getListData()
    },
    mounted() {
    },
    methods: {
        backPage(type) {
            this.tabModel = type
            this.getAvaliableBalance()
        },
        getAvaliableBalance() {
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.pay_ac_info).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.avaliableBalance = res.body.data.entity.overallbalancestring
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
                _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.setting_mis_scuser).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        resolve(res.body.data.entity)
                    } else if (res.body.code.toString() != '-3') {
                        //  _this.$message.error(_this.msg(res.body))
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
                        resolve(res.body.data.entity)
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
            Promise.all([p1, p2]).then(function (results) {
                _this.loading = false
                _this.avaliableBalance = results[1].entity.overallbalancestring
                // _this.scoreData = Math.floor(results[0].reputation) / 10 + ''
                // _this.userName = results[0].userName
            })
        },
        handleClick() {
            if (this.tabModel == '1') {
                this.getListData()
            }
        }
    },
    watch: {
        '$route': function (val, old) {
            if (val.path == this.routeUrl) {
                this.tabModel = '1'
                this.handleClick()
            }
        }
    },
    computed: {
    },
    components: {
        'page-title': PageTitle,
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
