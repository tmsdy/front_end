<template>
    <div class="dashboardBox CustomerDistribution">
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
                <el-select v-model="region" @change="changeDatePeriod()" :placeholder="$t('mxpcweb.workbench.1530671363646')" size="small" :disabled="fieldId == 4">
                    <el-option v-for="item in statinterval" :key="item.intervalCode" :value="item.intervalCode" :label="item.intervalName"> </el-option>
                </el-select>
            </span>
            <span class="name">{{pannelName}}</span>
        </div>
        <div class="workBody">
            <!-- <div class="customerHow" v-loading="isload"> -->
            <div class="customerHow">
                <div class="numClass">
                    <span class="pull-right" v-show="!isNoData">{{spanInfo}}</span>
                </div>
                <div class="content">
                    <ul class="left MXscroll">
                        <li v-for="(item,index) in dicts" class="button tab-link" :class="cindex == (index+1) ? 'active':''" @click="changeCondition($event,item.dictCode,item.dictName,index)" :key="index">{{item.dictName}} </li>
                    </ul>

                    <div v-loading="isload" style="min-height:240px; margin-left:135px;position:relative; border:1px solid transparent;">
                        <!-- 销售漏斗（这里特殊展示） -->
                        <dl class="funnel" v-if="!isNoData && cindex == 1 && activeIndex == 4">
                            <div class="mark">
                                <!-- 全部 -->
                                <!-- <span>
                                    <em>100%</em>
                                    <span class="text">{{$t('mxpcweb.mail.1533353380357')}}<i>{{totalCount}}</i></span>
                                </span> -->
                                <span v-for="(item, index) in items" :key="'a'+index">
                                    <em>{{percentCust(item.value)}}</em>
                                    <span class="text">{{item.name}}<i>{{item.value}}</i></span>
                                </span>
                            </div>
                        </dl>
                        <div class="right" v-else ref="customerDistribObj"></div>
                        <div v-show="isNoData" style="position:absolute;left:0;top:0;right:0;bottom:0;">
                            <nodata style="margin-top:18px;"></nodata>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import NoData from '@/basecomponents/NoData/index'
import { isObject } from '@/libs/utils.js'
let echarts = require('echarts/lib/echarts') // 引入基本模板
require('echarts/lib/chart/pie') // 饼图
require('echarts/lib/component/tooltip') // 鼠标经过tips
require('echarts/lib/component/legend') // 线图引导点tabs

export default {
    name: 'CustomerDistribution',
    props: ['data'],
    data() {
        return {
            region: '8', // 查询周期
            searchType: '1', // 查询类型
            spanInfo: this.$t('mxpcweb.workbench.1530682626259'), // 本月新增总数
            isload: true,
            isNoData: false,
            pannelName: '',
            startId: 1,
            interval: 1,
            fieldId: 4, // 高亮字段ID
            activeIndex: 4, // 高亮tab项
            dictCode: '2',
            dictName: '',
            dicts: [],
            items: [],
            ctId: 0,
            statinterval: [],
            cindex: 1,
            totalCount: 0,
            myChart: null
        }
    },
    created() {
        this.init()
    },
    methods: {
        percentCust(value) {
            let percent = Math.round(Number(value / this.totalCount * 100).toFixed(2))
            if (isNaN(percent)) {
                percent = 0
            }
            return percent + '%'
        },
        init() {
            if (this.data.length > 0) {
                this.pannelName = this.data[0].statname
                this.ctId = this.data[0].ctId
                this.startId = this.data[0].statid

                this.dicts = this.data[0].dicts
                if (this.dicts.length > 0) {
                    this.dictCode = this.dicts[0].dictCode
                    this.dictName = this.dicts[0].dictName
                }

                this.statinterval = this.data[0].statinterval
                // console.log(this.statinterval)
                // console.log(this.statinterval)
                // console.log(this.statinterval)
                // var cname = this.getName(this.interval)
                // this.region = cname
                /* '本月' */
                // this.spanInfo = this.spanInfo.replace(this.$t('mxpcweb.workbench.1530672883646'), this.region)
            }
            this.chartCustomerDistrib() // 客户分布
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
                this.region = '8'
            }

            this.isload = true
            // var target = event.currentTarget;
            // var element = $(target);

            this.chartCustomerDistrib() // 客户分布
            //   '总数'
            this.spanInfo = regionInfo + searchTypeInfo + this.$t('mxpcweb.workbench.1530683995688')
        },

        changeDatePeriod() {
            var selectRegin = this.region
            this.interval = selectRegin
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
            /* 英文语义会错 */ /* 总数 */
            this.spanInfo = regionInfo + searchTypeInfo + this.$t('mxpcweb.workbench.1530683995688')
        },

        changeCondition(event, type, dictName, index) {
            this.dictCode = type
            this.dictName = dictName
            this.cindex = index + 1
            this.chartCustomerDistrib() // 客户分布
        },

        async chartCustomerDistrib() {
            this.totalCount = 0
            let _this = this
            let data = {
                interval: this.interval,
                fieldId: this.fieldId,
                dictCode: this.dictCode,
                staffId: this.ctId
            }
            this.isload = true
            this.isNoData = true
            // console.log(data)
            // console.log(data)
            // console.log(data)
            // console.log(data)
            await _this.$http
                .get(_this.Global.baseURL + _this.Global.api.v2.stat_custDist_get, { params: data })
                .then(
                    (res) => {
                        this.isNoData = false
                        this.isload = false
                        if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data)) {
                            // console.log(res.body)
                            this.items = []

                            if (res.body.data.items && res.body.data.items.length > 0) {
                                let backData = res.body.data.items
                                let dataItems = []
                                // 漏斗时，不过滤
                                if (this.cindex == 1 && this.activeIndex == 4) {
                                    // console.log('backData -----------')
                                    // console.log(backData)
                                    // 要求按顺利排列
                                    backData.forEach(item => {
                                        if (item.dictItemcode == 1) {
                                            dataItems.push(item) // 只要3个
                                        }
                                    })
                                    backData.forEach(item => {
                                        if (item.dictItemcode == 2) {
                                            dataItems.push(item) // 只要3个
                                        }
                                    })
                                    backData.forEach(item => {
                                        if (item.dictItemcode == 3) {
                                            dataItems.push(item) // 只要3个
                                        }
                                    })
                                    // console.log(dataItems)
                                } else {
                                    dataItems = backData.filter(item => {
                                        return item.count > 0
                                    })
                                }
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

                                // console.log(this.myChart)
                                // console.log(this.myChart)

                                // if (!this.myChart || this.myChart.isDisposed()) {
                                //     }
                                this.myChart = echarts.init(this.$refs.customerDistribObj)
                                // 指定图表的配置项和数据
                                // console.log(this.items)
                                let text = []
                                this.items.forEach(item => {
                                    text.push(item.name)
                                })

                                // console.log(this.items)
                                let option = {
                                    tooltip: {
                                        trigger: 'item',
                                        formatter: '{b}<br/> {c} ({d}%)'
                                    },
                                    legend: {
                                        orient: 'vertical',
                                        x: 'left',
                                        data: text
                                    },
                                    color: ['#FEB116', '#47D83F', '#33CDDE', '#f60', '#d0021b', '#348af3', '#7753e9', '#ff4d3e', '#348af3'],
                                    series: [
                                        {
                                            name: this.dictName,
                                            type: 'pie',
                                            radius: ['50%', '70%'],
                                            center: ['60%', '45%'],
                                            avoidLabelOverlap: false,
                                            hoverAnimation: false,
                                            cursor: 'default',
                                            label: {
                                                fontSize: 12,
                                                normal: {
                                                    show: true,
                                                    position: 'inside',
                                                    formatter: '{d}%'
                                                },
                                                emphasis: {
                                                    show: true,
                                                    textStyle: {
                                                        fontSize: '18'
                                                    }
                                                }
                                            },
                                            labelLine: {
                                                normal: {
                                                    show: true
                                                }
                                            },
                                            data: this.items
                                        }
                                    ]
                                }
                                this.isNoData = false
                                this.isload = false
                                // 使用刚指定的配置项和数据显示图表。
                                this.myChart.setOption(option)
                                return this.myChart
                            } else {
                                this.isNoData = true
                                // this.isload = false
                            }
                        } else {
                            _this.isNoData = true
                            _this.$message.error(_this.msg(res.body))
                            // _this.isload = false
                        }
                    },
                    (res) => {
                        // _this.isNoData = true
                        // _this.isload = false
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
