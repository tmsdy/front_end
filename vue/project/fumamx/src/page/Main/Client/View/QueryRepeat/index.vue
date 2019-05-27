<template>
    <div class="QueryRepeat MXscroll">
        <div class="allBox">
            <div class="searchBox">
                <!-- 输入公司名称关键词、联系人、电话、手机、邮箱、网址、域名等 -->
                <el-input class="searchInput" @keyup.enter.native="checkRepeats()" size="large"
                 v-bind:placeholder="$t('mxpcweb.client.1529027712956')"
                 v-model="input" clearable>
                </el-input>
                <div class="iconBox"><i class="el-icon-search" @click="checkRepeats()"></i></div>
            </div>
            <div v-if="!unit" class="noData">
                <img src="/static/images/noData/noSearch.png" alt="">
            </div>
            <!-- 找到 -->
            <!-- 个 -->
            <!-- 相似客户信息 -->
            <div v-if="!list.totalNum==0&&unit" class="tip">
                {{$t('mxpcweb.client.detail.1532398291278')}}
                <span style="color:red;margin:0 5px">{{list.totalNum}}</span>
                {{$t('mxpcweb.client.1529027792262')}}
                {{$t('mxpcweb.client.detail.1532397174964')}}
                {{$t('mxpcweb.client.detail.1532398317425')}}
                <!-- 找到14个相似客户信息，当前仅展示前 6 条 -->
            </div>
            <div class="listBox MXscroll" v-if="unit" style="min-height:300px">
                <div v-if="list.totalNum==0" class="text-center">
                    <div class="noData">
                        <!-- 未发现重复，此客户系统内没有找到！ -->
                        {{$t('mxpcweb.client.1529046177230')}}
                    </div>
                    <!-- 立即创建 -->
                    <el-button type="primary" size="small" @click="newAdd()">{{$t('mxpcweb.client.1529028045434')}}</el-button>
                </div>
                <cust-card :list="list.list" :showList="showList" @lookCust="lookCust" @checkRepeats="checkRepeats"></cust-card>
            </div>
            <set-check ref="setCheck" @getSetData="getSetData"></set-check>
            <div v-if="isAdmin" class="setting text-hover" @click="setChecks()"><i class="iconfont icon-setting" style="font-size:24px"></i></div>
        </div>
    </div>
</template>
<script>
import { isArray, isString } from '@/libs/utils.js'
import setCheck from './Vue/setCheck.vue'
import CustCard from '@/components/CustCard/index.vue'
import { mapGetters } from 'vuex'
export default {
    name: 'QueryRepeats',
    props: {

    },
    data() {
        return {
            input: '',
            list: {
                list: [],
                totalNum: 0
            },
            unit: false,
            loading: false,
            showList: [],
            routeUrl: '',
            mainId: 'queryrepeatIndex',
            isAdmin: false
        }
    },
    created() {
    },
    mounted() {
        // 缓存页面路由
        this.routeUrl = this.$route.path
        if (isString(this.clientCheck)) {
            this.input = this.clientCheck
        }
        this.isAdmin = this.contactCheck.isAdmin
        this.getSetData()
    },
    watch: {
        '$route': function(val, old) {
            if (val.path == this.routeUrl) {
                this.getSetData(true)
                // $('#' + this.mainId).css('filter', '(0px)')
            } else {
                // $('#' + this.mainId).css('filter', '(2px)')
            }
        }
    },
    computed: {
        ...mapGetters([
            'contactCheck'
        ])
    },
    methods: {
        lookCust(item) {
            item.moduleCode = 'BF001'
            item.billId = item.custId
            this.clientDetailPage(item)
        },
        otReceive(id) {
            let _this = this
            ep.emit('setGlobalLoading', {
                val: true,
                // 权限校验中...
                text: this.$t('mxpcweb.client.list.1550126019122') + '...'
            })
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.document_rightCheck_do, { params: {
                moduleCode: 'BF001',
                identFieldValue: id,
                optCode: 'otReceive'
            } }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    let obj = {
                        billId: id
                    }
                    _this.$refs.otReceive.openWindow(obj)
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
                ep.emit('setGlobalLoading', {
                    val: false,
                    text: ''
                })
            }, (res) => {
                ep.emit('setGlobalLoading', {
                    val: false,
                    text: ''
                })
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        newAdd() {
            let _this = this
            let data = {
                moduleCode: 'BF001',
                optCode: 'otNew',
                identFieldValue: 0
            }
            ep.emit('setGlobalLoading', {
                val: true, // 打开loading
                // 权限校验中...
                text: this.$t('mxpcweb.client.list.1550126019122') + '...'
            })
            // 校验权限先
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.document_rightCheck_do, { params: data }).then(function (res) {
                ep.emit('setGlobalLoading', {
                    val: false // 关闭loading
                })
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    let obj = {
                        optData: {
                            optCode: 'otNew',
                            optName: this.$t('mxpcweb.client.1529042727717'),
                            optModuleCode: 'BF001'
                        },
                        otherObj: {
                            value: this.input,
                            fieldName: 'custName',
                            model: 'BF001',
                            disable: false
                        }
                    }
                    ep.emit('optClick', obj)
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            })
        },
        setChecks() {
            this.$refs.setCheck.dialogs()
        },
        getSetData() {
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.fieldShow_custCheck_do, { params: { type: 'show'} }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                    this.showList = res.body.data
                    _this.checkRepeats()
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        checkRepeats() {
            let _this = this
            if (_this.input == '') {
                this.list = {
                    list: [],
                    totalNum: 0
                }
                return false
            }
            _this.loading = true
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.customerCheck_get, { params: {
                size: 6,
                from: 0,
                type: '1',
                keywords: _this.input.replace(/(^\s*)|(\s*$)/g, '')
            } }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.list.totalNum = res.body.data.totalNum
                    _this.list.list = res.body.data.list
                    if (this.unit == false) {
                        this.unit = true
                    }
                    setTimeout(function() {
                        _this.loading = false
                    }, 20)
                } else {
                    _this.$message.error(_this.msg(res.body))
                    _this.loading = false
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
                    _this.loading = false
            })
        }
    },
    beforeDestroy: function () {
        this.lookCust = null
    },
    components: {
        'set-check': setCheck,
        'cust-card': CustCard
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
