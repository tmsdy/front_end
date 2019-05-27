<template>
    <div class="dashboardBox MonthTrend" v-bind:class='bindClass'>
        <div class="workTitle">
            <span class="pull-right">
                <ul class="tabWrap">
                    <li @click="changeType(1,$event)" :class="activeIndex == 1 ? 'active':''">
                        <span>
                            <!-- 新增 -->{{$t('mxpcweb.workbench.1530671409518')}}
                        </span>
                    </li>
                    <li @click="changeType(2,$event)" :class="activeIndex == 2 ? 'active':''">
                        <span>
                            <!-- 跟进客户 -->{{$t('mxpcweb.workbench.1530684144110')}}
                        </span>
                    </li>
                    <li @click="changeType(3,$event)" :class="activeIndex == 3 ? 'active':''">
                        <span>
                            <!-- 跟进数 -->{{$t('mxpcweb.workbench.1530672455895')}}
                        </span>
                    </li>
                    <li @click="changeType(4,$event)" :class="activeIndex == 4 ? 'active':''">
                        <span>
                            <!-- 成交 -->{{$t('mxpcweb.workbench.1530680869247')}}
                        </span>
                    </li>
                    <li @click="changeType(5,$event)" :class="activeIndex == 5 ? 'active':''">
                        <span>
                            <!-- 客户总数 -->{{$t('mxpcweb.workbench.1530684194288')}}
                        </span>
                    </li>
                </ul>
                <!-- 请选择 -->
                <el-select v-model="regionNum" :placeholder="$t('mxpcweb.workbench.1530671363646')" size="small" @change="chartMonthTrend">
                    <el-option v-for="(item, index) in selectOption" :key="index" :value="item.intervalCode" :label="item.intervalName"> </el-option>
                </el-select>
            </span>
            <span class="name">{{pannelName}}</span>
        </div>
        <div class="workBody" v-loading="isload">
            <div v-show="!isNoData" class="chartMonth" ref="monthTrendObj"></div>
            <!-- 暂无数据 -->
            <nodata class='NoDataCss' v-show="isNoData" :title="$t('mxpcweb.workbench.1530682446647')"></nodata>
        </div>
    </div>
</template>

<script>
import { isObject } from '@/libs/utils.js'
import NoData from '@/basecomponents/NoData/index'

let echarts = require('echarts/lib/echarts') // 引入基本模板
require('echarts/lib/chart/line') // 线图
require('echarts/lib/component/tooltip') // 鼠标经过tips
export default {
    name: 'MonthTrend',
    props: ['data'],
    data() {
        return {
            regionNum: '4',
            pannelName: '',
            fieldId: 1,
            statId: 7,
            monthTrendXArray: [],
            monthTrendYArray: [],
            targetXArray: [],
            targetYArray: [],
            legendArray: [],
            currentType: this.$t('mxpcweb.workbench.1530684296279'), // '新增客户数'
            isload: false,
            isNoData: false,
            targetResults: [],
            objectResults: [],
            ctId: 0,
            activeIndex: 1,
            selectOption: [],
            bindClass: '',
            myChart: null
        }
    },
    created() {
        this.init()
    },
    mounted() { },
    methods: {
        init() {
            if (this.data.length > 0) {
                this.pannelName = this.data[0].statname
                this.ctId = this.data[0].ctId
                this.startId = this.data[0].statid

                this.selectOption = this.data[0].statinterval

                if (this.data[0].index == '1') {
                    this.bindClass = 'rightmargin'
                } else {
                    this.bindClass = 'leftmargin'
                }
            }

            this.chartMonthTrend() // 月走势图
        },
        changeType(type, event) {
            this.activeIndex = type
            this.fieldId = type
            var typename = ''
            if (type == '1') {
                /* '新增客户数' */
                typename = this.$t('mxpcweb.workbench.1530684296279')
            } else if (type == '2') {
                /* '跟进客户数' */
                typename = this.$t('mxpcweb.workbench.1530672470013')
            } else if (type == '3') {
                /* '跟进数' */
                typename = this.$t('mxpcweb.workbench.1530672455895')
            } else if (type == '4') {
                /* '成交' */
                typename = this.$t('mxpcweb.workbench.1530680869247')
            } else if (type == '5') {
                /* '客户总数' */
                typename = this.$t('mxpcweb.workbench.1530684194288')
            }
            this.currentType = typename
            this.chartMonthTrend() // 月走势图
        },
        // 月走势图
        chartMonthTrend() {
            let _this = this
            let data = {
                statId: this.startId,
                interval: this.regionNum,
                fieldId: this.fieldId,
                staffId: this.ctId
            }
            // console.log('>>>')
            // console.log(this.data)
            // console.log(this.regionNum)
            // console.log(data)
            _this.isload = true
            _this.$http
                .get(_this.Global.baseURL + _this.Global.api.v2.stat_pers_get, { params: data })
                .then(
                    (res) => {
                        _this.isload = false
                        if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data)) {
                            this.objectResults = res.body.data.objectResults
                            this.targetResults = res.body.data.targetResults

                            if (this.targetResults.length == 0) {
                                this.isNoData = true
                            } else {
                                this.isNoData = false
                            }
                            this.monthTrendXArray = []
                            this.monthTrendYArray = []
                            this.targetXArray = []
                            this.targetYArray = []

                            for (var i = 0; i < this.objectResults.length; i++) {
                                this.monthTrendXArray.push(this.objectResults[i].month)
                                this.monthTrendYArray.push(this.objectResults[i].count)
                            }
                            for (var j = 0; j < this.targetResults.length; j++) {
                                this.targetXArray.push(this.targetResults[j].month)
                                this.targetYArray.push(this.targetResults[j].count)
                            }

                            this.legendArray = []
                            /* '指标' */
                            this.legendArray.push(this.$t('mxpcweb.workbench.1530685957014'))
                            this.legendArray.push(this.currentType)

                            // 基于准备好的dom，初始化echarts实例
                            if (!this.myChart || this.myChart.isDisposed()) {
                                this.myChart = echarts.init(this.$refs.monthTrendObj)
                            }
                            // 绘制图表
                            let option = {
                                tooltip: {
                                    trigger: 'axis'
                                },
                                legend: {
                                    data: this.legendArray,
                                    show: true,
                                    right: '0',
                                    itemWidth: 30,
                                    itemHeight: '8'
                                },
                                textStyle: {
                                    color: '#909399'
                                },
                                grid: {
                                    left: '1%',
                                    right: '5%',
                                    bottom: '3%',
                                    top: '18%',
                                    containLabel: true
                                },
                                calculable: true,
                                xAxis: [
                                    {
                                        type: 'category',
                                        axisLine: {
                                            lineStyle: { color: '#909399' }
                                        },
                                        boundaryGap: false,
                                        data: this.monthTrendXArray
                                    }
                                ],
                                yAxis: [
                                    {
                                        type: 'value',
                                        axisLine: {
                                            lineStyle: { color: '#909399' }
                                        },
                                        // 网格
                                        splitLine: {
                                            show: true,
                                            lineStyle: {
                                                color: '#eee'
                                            }
                                        }
                                    }
                                ],
                                series: [
                                    {
                                        /* '指标' */
                                        name: this.$t('mxpcweb.workbench.1530685957014'),
                                        type: 'line',
                                        smooth: true,
                                        symbol: 'roundRect',
                                        /* '总量' */
                                        stack: this.$t('mxpcweb.workbench.1530686084662'),
                                        itemStyle: {
                                            normal: { color: '#ff851b' },
                                            emphasis: { color: '#ff4141' }
                                        },
                                        data: this.targetYArray
                                    },
                                    {
                                        name: this.currentType,
                                        type: 'line',
                                        smooth: true,
                                        symbol: 'roundRect',
                                        /* '总量' */
                                        stack: this.$t('mxpcweb.workbench.1530686084662'),
                                        itemStyle: {
                                            normal: { color: '#ff4141' },
                                            emphasis: { color: '#008cee' }
                                        },
                                        data: this.monthTrendYArray
                                    }
                                ]
                            }
                            // 使用刚指定的配置项和数据显示图表。
                            this.myChart.setOption(option)
                            return this.myChart
                        } else {
                            _this.isNoData = true
                            _this.$message.error(res.data.msg)
                        }
                    },
                    (res) => {
                        _this.isNoData = true
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    }
                )
        }
    },
    components: {
        nodata: NoData
    },
    watch: {
        '$route': function (val, old) {
            if (val.path === '/main/workbench') {
                this.init()
            }
            if (old.path === '/main/workbench' && this.myChart !== null) {
                this.myChart.dispose()
                // console.log(this.myChart.isDisposed())
            }
        }
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
