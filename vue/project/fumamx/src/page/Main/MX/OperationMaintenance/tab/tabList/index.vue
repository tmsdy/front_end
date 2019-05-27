<template>
    <div class="tabList">
        <!-- 文章管理 -->
        <page-detail title="运营参谋" iconfont="icon-operation-admin" detailTitle="企业汇总" @toList="$emit('tabChange','1')"></page-detail>
        <div class="mainBody">
            <div class="toolbar">
                <!-- 列表名称 -->
                <el-input v-model="keywords" placeholder="请输入企业用户关键字" @keyup.enter.native="getListData" style="width:220px;margin-right:5px;"></el-input>
                <el-date-picker v-model="startTime" type="daterange" align="right" placeholder="开通时间范围" style="margin-right:5px;" :picker-options="pickerOptions">
                </el-date-picker>
                <el-date-picker v-model="endTime" type="daterange" align="right" placeholder="到期时间范围" style="margin-right:5px;" :picker-options="pickerOptions">
                </el-date-picker>
                <el-button type="primary" size="small" style="position:relative;top:-1px;" @click="getListData">查询</el-button>
            </div>
            <div class="search">
                <span style="margin-right:16px;">产品</span>
                <span class="text-hover" :class="searchCheck == 'all' ? 'labelCheck' : 'label'" @click="searchClick('all')">不限</span>
                <span class="text-hover" :class="searchCheck == 'PK0001' ? 'labelCheck' : 'label'" @click="searchClick('PK0001')">CRM</span>
                <span class="text-hover" :class="searchCheck == 'PK0002' ? 'labelCheck' : 'label'" @click="searchClick('PK0002')">发现</span>
                <span class="text-hover" :class="searchCheck == 'PK0004' ? 'labelCheck' : 'label'" @click="searchClick('PK0004')">发现light</span>
                <span class="text-hover" :class="searchCheck == 'PK0003' ? 'labelCheck' : 'label'" @click="searchClick('PK0003')">营销云</span>
                <!-- <span class="text-hover" :class="searchCheck == '5' ? 'labelCheck' : 'label'" @click="searchClick('5')">销售云</span> -->
            </div>
            <div class="list" :style="{'padding-right': hasScrollbarValue ? '27px' : '22px' }">
                <el-row :gutter="20">
                    <el-col :span="4">企业名称</el-col>
                    <el-col :span="2">产品</el-col>
                    <el-col :span="4">开通人数/许可人数</el-col>
                    <el-col class="orderBox" :span="3">开通时间
                        <span class="titleTimeBox text-hover">
                            <div v-if="order === 'paydate asc'" class="triangle-up-blue"></div>
                            <div v-else class="triangle-up-grey" @click="upSort('paydate asc')"></div>
                            <div v-if="order === 'paydate desc'" class="triangle-down-blue"></div>
                            <div v-else class="triangle-down-grey" @click="upSort('paydate desc')"></div>
                        </span>
                    </el-col>
                    <el-col :span="3" class="orderBox">到期时间
                        <span class="titleTimeBox text-hover">
                            <div v-if="order === 'expirationtime asc'" class="triangle-up-blue"></div>
                            <div v-else class="triangle-up-grey" @click="upSort('expirationtime asc')"></div>
                            <div v-if="order === 'expirationtime desc'" class="triangle-down-blue"></div>
                            <div v-else class="triangle-down-grey" @click="upSort('expirationtime desc')"></div>
                        </span>
                    </el-col>
                    <el-col :span="3" class="orderBox">7天活跃数
                        <span class="titleTimeBox text-hover">
                            <div v-if="order === 'count asc'" class="triangle-up-blue"></div>
                            <div v-else class="triangle-up-grey" @click="upSort('count asc')"></div>
                            <div v-if="order === 'count desc'" class="triangle-down-blue"></div>
                            <div v-else class="triangle-down-grey" @click="upSort('count desc')"></div>
                        </span>
                    </el-col>
                    <el-col :span="2">服务人员</el-col>
                    <el-col :span="3"></el-col>
                </el-row>
            </div>
            <div class="contentBox MXscroll" v-loading="loading" ref="customerTables">
                <no-data v-if="list.length==0&&!loading" style="background:rgba(255,255,255,0)"></no-data>
                <el-row v-else class="list1" :gutter="20" v-for="(item,index) in list" :key="index">
                    <el-col :span="4" class="text-hover" :title="item.enterprise"><span @click="$emit('tabChange','3', item)">{{item.enterprise}}&nbsp;</span></el-col>
                    <el-col :span="2" :title="item.pkname">{{item.pkname}}&nbsp;</el-col>
                    <el-col :span="4" :title="item.user_count + '/' + item.authcount">{{item.user_count + '/' + item.authcount}}&nbsp;</el-col>
                    <el-col :span="3" :title="item.paydate">{{item.paydate}}&nbsp;</el-col>
                    <el-col :span="3" :title="item.expirationtime">{{item.expirationtime}}&nbsp;</el-col>
                    <el-col :span="3" :title="item.count">{{item.count}}&nbsp;</el-col>
                    <el-col :span="2" :title="item.service">{{item.service}}&nbsp;</el-col>
                    <el-col :span="3" class="listCol4">
                        <div class="listCol4Item">
                            <!-- 分配 -->
                            <span class="optButton left10" style="margin-left:10px;" title="分配" @click="distribute(item)">
                                <i class="iconfont icon-distribute"></i>
                            </span>
                            <!-- 查看 -->
                            <span class="optButton left10" style="margin-left:10px;" :title="$t('mxpcweb.am.1531978974212')" @click="$emit('tabChange','3', item)">
                                <i class="iconfont  icon-eye"></i>
                            </span>
                            <!-- 账号绑定 -->
                            <span class="optButton left10" style="margin-left:10px;" :title="$t('mxpcweb.am.1545288910899')" @click="$refs.BindOnAccount.showDialog(item)">
                                <i class="iconfont  icon-attachment"></i>
                            </span>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <!--分页-->
            <list-page style="background:#f7f8f9;text-align:center" :blockData="blockData" @getListData="getListData"></list-page>
        </div>
        <otDistribute ref="otDistribute" @getData="getListData"></otDistribute>
        <bind-on-account ref="BindOnAccount"></bind-on-account>
    </div>
</template>

<script>
import PageDetail from '@/components/PageDetail/index' // 大标题
import NoData from '@/basecomponents/NoData/index'
import listPage from '@/components/listPageTwo/index' // 分页
import otDistribute from './otDistribute/index' // 分页
import BindOnAccount from '@/components/BindOnAccount/index'
/**
 * 运维管理
 * 何俊峰
 * 2018-11-18
 */
export default {
    name: 'tabList',
    data() {
        return {
            moduleCode: '',
            startTime: ['', ''],
            endTime: ['', ''],
            keywords: '',
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                        picker.$emit('pick', [start, end])
                    }
                }]
            },
            list: [],
            blockData: {
                pageSize: 20,
                total: 0,
                fromNum: 1
            },
            searchCheck: 'all',
            loading: true,
            order: 'count desc',
            hasScrollbarValue: true
        }
    },
    created() {
        this.getListData()
    },
    methods: {
        upSort(val) {
            this.order = val
            this.getListData()
        },
        distribute(item) {
            this.$refs.otDistribute.openWindow(item)
        },
        searchClick(value) {
            this.searchCheck = value
            this.getListData()
        },
        getListData() {
            let _this = this
            let data = {
                from: (_this.blockData.fromNum - 1) * _this.blockData.pageSize,
                size: _this.blockData.pageSize,
                order: _this.order,
                product: _this.searchCheck
            }
            if (_this.keywords != '') {
                data.enterprise = _this.keywords
            }
            let startBeginDate = _this.timeShow_custom(_this.$m_unifiedTime(this.startTime[0]), 'YYYY-MM-DD')
            let startEndDate = _this.timeShow_custom(_this.$m_unifiedTime(this.startTime[1]), 'YYYY-MM-DD')
            let endBeginDate = _this.timeShow_custom(_this.$m_unifiedTime(this.endTime[0]), 'YYYY-MM-DD')
            let endEndDate = _this.timeShow_custom(_this.$m_unifiedTime(this.endTime[1]), 'YYYY-MM-DD')
            if (startBeginDate != '' && startEndDate != '') {
                data.startTime = startBeginDate + ',' + startEndDate
            }
            if (endBeginDate != '' && endEndDate != '') {
                data.endTime = endBeginDate + ',' + endEndDate
            }
            _this.loading = true
            _this.$http.get(this.Global.baseURL + this.Global.api.mx.enterprise_list, {
                params: data
            }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.list = res.body.data.enterpriseList
                    _this.blockData.total = res.body.data.totalNums
                    _this.loading = false
                    _this.hasScrollbar()
                } else {
                    _this.list = []
                    _this.blockData.total = 0
                    _this.loading = false
                    _this.hasScrollbar()
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        hasScrollbar() {
            let _this = this
            let time = setTimeout(function() {
                let thisDom = _this.$refs.customerTables
                if (thisDom) {
                    _this.hasScrollbarValue = thisDom.scrollHeight > thisDom.clientHeight
                } else {
                    _this.hasScrollbarValue = false
                }
                window.clearTimeout(time)
            }, 5)
        }
    },
    components: {
        'page-detail': PageDetail,
        'list-page': listPage,
        'no-data': NoData,
        'bind-on-account': BindOnAccount,
        'otDistribute': otDistribute
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
