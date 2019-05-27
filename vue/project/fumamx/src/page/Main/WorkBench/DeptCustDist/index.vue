<template>
    <div class="dashboardBox DeptCustDist" v-bind:class='bindClass'>
        <div class="workTitle">
            <span class="pull-right">
                <ul class="tabWrap">
                    <li @click="searchByType($event,1)" :class="activeIndex == 1 ? 'active':''">
                        <span>
                            <!-- 新增 -->{{$t('mxpcweb.workbench.1530671409518')}}
                        </span>
                    </li>
                    <li @click="searchByType($event,2)" :class="activeIndex == 2 ? 'active':''">
                        <span>
                            <!-- 跟进 -->{{$t('mxpcweb.workbench.1530671424637')}}
                        </span>
                    </li>
                    <li @click="searchByType($event,3)" :class="activeIndex == 3 ? 'active':''">
                        <span>
                            <!-- 成交 -->{{$t('mxpcweb.workbench.1530680869247')}}
                        </span>
                    </li>
                    <li @click="searchByType($event,4)" :class="activeIndex == 4 ? 'active':''">
                        <span>
                            <!-- 全部 -->{{$t('mxpcweb.workbench.1530672950422')}}
                        </span>
                    </li>
                </ul>
                <!-- 请选择 -->
                <el-select v-model="region" @change="changeDatePeriod()" :placeholder="$t('mxpcweb.workbench.1530671363646')" size="small">
                    <el-option v-for="item in statinterval" :key="item.intervalCode" :value="item.intervalCode" :label="item.intervalName"> </el-option>
                </el-select>
            </span>
            <!--部门客户分布-->
            <span class="name">{{pannelName}}</span>
        </div>

        <div class="workBody">
            <div class="customerHow" v-loading="isload">
                <div class="numClass">
                    <span class="pull-right">{{spanInfo}}</span>
                </div>
                <div class="content">
                    <ul class="left">
                        <li v-for="(item,index) in dicts" class="button tab-link" :class="cindex == (index+1) ? 'active':''" @click="changeCondition($event,item.dictCode,item.dictName,index)" :key="index">{{item.dictName}} </li>
                    </ul>
                    <div v-show="!isNoData" class="right" ref="customerDistribObj"></div>
                </div>
                <!-- 暂无数据 -->
                <nodata v-show="isNoData" :title="$t('mxpcweb.workbench.1530682446647')" style="margin:-30px 0 0 120px;"></nodata>
            </div>
        </div>
    </div>
</template>
<script>
import NoData from '@/basecomponents/NoData/index'
import { isObject, setStore, getStore } from '@/libs/utils.js'
let echarts = require('echarts/lib/echarts') // 引入基本模板
require('echarts/lib/chart/line') // 线图
require('echarts/lib/chart/pie') // 饼图
require('echarts/lib/component/tooltip') // 鼠标经过tips
require('echarts/lib/component/legend') // 线图引导点tabs
export default {
    name: 'CustomerDistribution',
    props: ['isshow', 'data'],
    data() {
        return {
            region: '', // 查询周期
            searchType: '1', // 查询类型
            searchCondition: '', // 查询条件
            spanInfo: this.$t('mxpcweb.workbench.1530689943433'),
            isload: false,
            isNoData: false,
            pannelName: '',
            selectOption: [],
            startId: 1,
            interval: 1,
            fieldId: 1,
            dictCode: '2',
            dictName: '',
            dicts: [],
            items: [],
            bindClass: '',
            ctId: 0,
            statinterval: [],
            activeIndex: 1,
            cindex: 1,
            totalCount: 0,
            depts: [],
            departName: '',
            myChart: null
        }
    },
    created() {
        this.init()
    },
    mounted() {

    },
    methods: {
        init() {
            if (this.data.length > 0) {
                this.pannelName = this.data[0].statname
                this.ctId = this.data[0].ctId
                if (this.data[0].index == '1') {
                    this.bindClass = 'rightmargin'
                } else {
                    this.bindClass = 'leftmargin'
                }
                this.startId = this.data[0].statid

                this.dicts = this.data[0].dicts
                if (this.dicts.length > 0) {
                    this.dictCode = this.dicts[0].dictCode
                    this.dictName = this.dicts[0].dictName
                }

                this.statinterval = this.data[0].statinterval
                if (this.statinterval.length > 0) {
                    let selectedinterval = getStore('deptcustDistinterval')
                    var selectinterval
                    if (selectedinterval != undefined && selectedinterval != '') {
                        selectinterval = selectedinterval
                    } else {
                        selectinterval = this.statinterval[0].intervalCode
                        setStore('deptcustDistinterval', selectinterval)
                    }
                    this.interval = selectinterval
                }
                var cname = this.getName(this.interval)
                this.region = cname
                /* 今日 */
                this.spanInfo = this.spanInfo.replace(this.$t('mxpcweb.workbench.1530672603035'), this.region)

                this.depts = this.data[0].depts
                if (this.depts.length > 0) {
                    this.dkey = this.depts[0].dkey
                    this.departName = this.depts[0].deptName
                    this.chartCustomerDistrib() // 客户分布
                }
            }
        },
        getName(itemCode) {
            var itemName = ''
            for (var i = 0; i < this.statinterval.length; i++) {
                if (this.statinterval[i].intervalCode == itemCode) {
                    itemName = this.statinterval[i].intervalName
                    return itemName
                }
            }
            return itemCode
        },
        getIntervalByName(IntervalName) {
            var currentInterval = 1
            /* '今日' */
            if (IntervalName == this.$t('mxpcweb.workbench.1530672603035')) {
                currentInterval = 1
            }
            /* '本周' */
            if (IntervalName == this.$t('mxpcweb.workbench.1530672871996')) {
                currentInterval = 2
            }
            /* '本月' */
            if (IntervalName == this.$t('mxpcweb.workbench.1530672883646')) {
                currentInterval = 3
            }
            /* '本年' */
            if (IntervalName == this.$t('mxpcweb.workbench.1530672896949')) {
                currentInterval = 4
            }
            /* '去年' */
            if (IntervalName == this.$t('mxpcweb.workbench.1530672907991')) {
                currentInterval = 5
            }
            /* '最近6个月' */
            if (IntervalName == this.$t('mxpcweb.workbench.1530672921916')) {
                currentInterval = 6
            }
            /* '最近12个月' */
            if (IntervalName == this.$t('mxpcweb.workbench.1530672938092')) {
                currentInterval = 7
            }
            /* '全部' */
            if (IntervalName == this.$t('mxpcweb.workbench.1530672950422')) {
                currentInterval = 8
            }
            return currentInterval
        },
        getIntervalName(interval) {
            if (interval == '1') {
                /* '今日' */
                this.region = this.$t('mxpcweb.workbench.1530672603035')
            }
            if (interval == '2') {
                /* '本周' */
                this.region = this.$t('mxpcweb.workbench.1530672871996')
            }
            if (interval == '3') {
                /* '本月' */
                this.region = this.$t('mxpcweb.workbench.1530672883646')
            }
            if (interval == '4') {
                /* '本年' */
                this.region = this.$t('mxpcweb.workbench.1530672896949')
            }
            if (interval == '5') {
                /* '去年' */
                this.region = this.$t('mxpcweb.workbench.1530672907991')
            }
            if (interval == '6') {
                /* '最近6月' */
                this.region = this.$t('mxpcweb.workbench.1530672921916')
            }
            if (interval == '7') {
                /* '最近12个月' */
                this.region = this.$t('mxpcweb.workbench.1530672938092')
            }
            if (interval == '8') {
                /* '全部' */
                this.region = this.$t('mxpcweb.workbench.1530672950422')
            }
        },
        searchByType(event, type) {
            this.activeIndex = type
            this.searchType = type
            this.fieldId = this.searchType
            var regionInfo = this.getName(this.region)
            var searchTypeInfo = ''
            if (this.searchType == '1') {
                /* '新增' */
                searchTypeInfo = this.$t('mxpcweb.workbench.1530671409518')
            } else if (this.searchType == '2') {
                /* '跟进' */
                searchTypeInfo = this.$t('mxpcweb.workbench.1530671424637')
            } else if (this.searchType == '3') {
                /* '成交' */
                searchTypeInfo = this.$t('mxpcweb.workbench.1530680869247')
            } else {
                /* '全部' */
                searchTypeInfo = this.$t('mxpcweb.workbench.1530672950422')
            }
            this.isload = true
            this.chartCustomerDistrib() // 客户分布
            /* 总数 */
            this.spanInfo = regionInfo + searchTypeInfo + this.$t('mxpcweb.workbench.1530683995688')
        },
        changeDatePeriod() {
            var selectRegin = this.region
            this.interval = selectRegin
            setStore('deptcustDistinterval', this.interval)
            var regionInfo = this.getName(this.region)
            var searchTypeInfo = ''
            if (this.searchType == '1') {
                /* '新增' */
                searchTypeInfo = this.$t('mxpcweb.workbench.1530671409518')
            } else if (this.searchType == '2') {
                /* '跟进' */
                searchTypeInfo = this.$t('mxpcweb.workbench.1530671424637')
            } else if (this.searchType == '3') {
                /* '成交' */
                searchTypeInfo = this.$t('mxpcweb.workbench.1530680869247')
            } else {
                /* '全部' */
                searchTypeInfo = this.$t('mxpcweb.workbench.1530672950422')
            }
            this.isload = true
            this.chartCustomerDistrib() // 客户分布
            /* 总数 */
            this.spanInfo = regionInfo + searchTypeInfo + this.$t('mxpcweb.workbench.1530683995688')
        },
        changeCondition(event, type, dictName, index) {
            this.dictCode = type
            this.dictName = dictName
            this.isload = true
            this.isNoData = false
            this.cindex = index + 1
            this.chartCustomerDistrib() // 客户分布
        },

        async chartCustomerDistrib() {
            this.totalCount = 0
            let _this = this
            var url = _this.Global.baseURL + _this.Global.api.v2.stat_dept_custDist_get
            await _this.$http
                .get(url, {
                    params: {
                        interval: this.interval,
                        fieldId: this.fieldId,
                        dictCode: this.dictCode,
                        dkey: this.dkey
                    }
                })
                .then(
                    (res) => {
                        if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data)) {
                            // console.log(res.body);
                            this.items = []
                            if (res.body.data.items == undefined) {
                                this.myChart = echarts.init(
                                    this.$refs.customerDistribObj
                                )
                                this.spanInfo = this.spanInfo.replace(/[0-9]/ig, '') + this.totalCount
                                // 指定图表的配置项和数据
                                // console.log(this.items)
                                let text = []
                                this.items.forEach(item => {
                                    text.push(item.name)
                                })
                                // console.log(text)
                                let option = {
                                    tooltip: {
                                        trigger: 'item',
                                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                                    },
                                    legend: {
                                        orient: 'vertical',
                                        x: 'left',
                                        data: text
                                    },
                                    color: ['#FEB116', '#47D83F', '#33CDDE', '#f60', '#d0021b'],
                                    series: [
                                        {
                                            name: this.dictName,
                                            type: 'pie',
                                            radius: ['100%', '82%'],
                                            avoidLabelOverlap: false,
                                            hoverAnimation: false,
                                            cursor: 'default',
                                            label: {
                                                fontSize: 12,
                                                normal: {
                                                    show: false,
                                                    position: 'center'
                                                },
                                                emphasis: {
                                                    show: true,
                                                    textStyle: {
                                                        fontSize: '30',
                                                        fontWeight: 'bold'
                                                    }
                                                }
                                            },
                                            labelLine: {
                                                normal: {
                                                    show: false
                                                }
                                            },
                                            data: this.items
                                        }
                                    ]
                                }

                                // 指定图表的配置项和数据
                                this.isNoData = true
                                this.isload = false
                                // 使用刚指定的配置项和数据显示图表。
                                this.myChart.setOption(option)
                                return this.myChart
                            }
                            if (res.body.data.items.length > 0) {
                                var filterData = _.filter(res.body.data.items, (item) => { return item.count > 0 })
                                var dataItems = filterData
                                for (var i = 0; i < dataItems.length; i++) {
                                    var obj = {
                                        value: dataItems[i].count,
                                        name: dataItems[i].itemName,
                                        dictItemcode: dataItems[i].dictItemcode
                                    }
                                    this.items.push(obj)
                                    this.totalCount += obj.value
                                }

                                this.spanInfo = this.spanInfo.replace(/[0-9]/ig, '') + this.totalCount
                                let customerDistrib = echarts.init(
                                    this.$refs.customerDistribObj
                                )
                                // 指定图表的配置项和数据
                                let text = []
                                this.items.forEach(item => {
                                    text.push(item.name)
                                })
                                let option = {
                                    tooltip: {
                                        trigger: 'item',
                                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                                    },
                                    legend: {
                                        orient: 'vertical',
                                        x: 'left',
                                        data: text
                                    },
                                    color: ['#FEB116', '#47D83F', '#33CDDE', '#f60', '#d0021b'],
                                    series: [
                                        {
                                            name: this.dictName,
                                            type: 'pie',
                                            radius: ['100%', '82%'],
                                            avoidLabelOverlap: false,
                                            hoverAnimation: false,
                                            cursor: 'default',
                                            label: {
                                                fontSize: 12,
                                                normal: {
                                                    show: false,
                                                    position: 'center'
                                                },
                                                emphasis: {
                                                    show: true,
                                                    textStyle: {
                                                        fontSize: '30',
                                                        fontWeight: 'bold'
                                                    }
                                                }
                                            },
                                            labelLine: {
                                                normal: {
                                                    show: false
                                                }
                                            },
                                            data: this.items
                                        }
                                    ]
                                }

                                this.isNoData = false
                                this.isload = false
                                // 使用刚指定的配置项和数据显示图表。
                                customerDistrib.setOption(option)
                                return customerDistrib
                            } else {
                                this.isNoData = true
                                this.isload = false
                            }
                        } else {
                            _this.isNoData = true
                            _this.$message.error(_this.msg(res.body))
                            _this.isload = false
                        }
                    },
                    (res) => {
                        _this.isNoData = true
                        _this.isload = false
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    }
                )
        }
    },
    components: {
        'nodata': NoData
    },
    watch: {
        '$route': function (val, old) {
            if (val.path === '/main/workbench') {
                this.init()
            }
            if (old.path === '/main/workbench' && this.myChart !== null) {
                this.myChart.dispose()
                this.myChart = null
            }
        }
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
