<template>
    <div class="chartWrap">
        <el-tabs v-model="activeName" @tab-click="handleClick" class="chartWrapTab">
            <el-tab-pane label="饼状图" name="first">
                <div id="pieChart" style="width: 800px;height:450px;"></div>
            </el-tab-pane>
            <el-tab-pane label="柱状图" name="second">
                <div id="barChart" style="width: 1000px;height:450px;"></div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
// 柱状图
let echarts = require('echarts/lib/echarts') // 引入基本模板
require('echarts/lib/chart/pie') // 饼图
require('echarts/lib/chart/bar')
require('echarts/lib/component/legend')
require('echarts/lib/component/tooltip') // 鼠标经过tips
require('echarts/lib/component/title')
export default {
    name: 'chartWrap',
    data() {
        return {
            activeName: 'first',
            chartFields: {},
            items: {
                c_customers_custSource: 101
            },
            xData: [],
            yData: [],
            yLabel: {},
            yDataVerb: [], // y轴字典值对象数组
            mychart1: null,
            mychart2: null
        }
    },
    props: {
        defaultData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        chartData: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    created() {
        // this.getDetailPage()
        // this.$nextTick(function () {
        //     this.get_barChart()
        //     this.get_pieChart()
        // })
    },
    computed: {
        ...mapGetters(['sysBoxValueShow']),
        chartDefaultData() {
            const { chartData, defaultData } = this
            return {
                chartData,
                defaultData
            }
        }
    },
    mounted() { },
    methods: {
        returnValue(item, data) {
            if (item.key) {
                return data[item.key]
            }
        },
        handleClick(tab, event) {
            console.log(tab, event)
        },
        get_pieChart(piex, y, label) {
            this.mychart1 = echarts.init(document.getElementById('pieChart'))
            var option = {
                title: {
                    show: false,
                    text: '',
                    subtext: '',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: y
                },
                series: [
                    {
                        name: label,
                        type: 'pie',
                        radius: '70%',
                        center: ['50%', '50%'],
                        data: piex,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                            // normal: {
                            //     label: {
                            //         show: true,
                            //         formatter: '{a}-{b} : {c}'
                            //     },
                            //     labelLine: { show: true }
                            // }
                        }
                    }
                ]
            }
            // 使用刚指定的配置项和数据显示图表。
            this.mychart1.setOption(option)
        },
        get_barChart(x, y, label) {
            this.mychart2 = echarts.init(document.getElementById('barChart'))

            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: ''
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['0']
                },
                xAxis: {
                    data: x
                },
                yAxis: {},
                series: [{
                    name: label,
                    type: 'bar',
                    data: y,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            }

            // 使用刚指定的配置项和数据显示图表。
            this.mychart2.setOption(option)
        },
        processChartData() {
            let pieXData = []
            let _this = this
            if (this.dictCode != undefined) {
                let yData = []
                let xData = []
                this.chartData.map(item => {
                    let pieXDataOb = {}
                    if (item.xAxial && item.xAxial) {
                        // 如果是字典值
                        if (_this.sysBoxValueShow.hasOwnProperty(_this.dictCode)) {
                            let data = _this.sysBoxValueShow[this.dictCode]
                            let dataValue = data.dictItem[item.xAxial]
                            if (dataValue == undefined) {
                                xData.push(' ')
                                pieXDataOb.name = ' '
                            } else {
                                xData.push(dataValue.itemName)
                                pieXDataOb.name = dataValue.itemName
                            }
                        } else {
                            xData.push(item.xAxial)
                            pieXDataOb.name = item.xAxial
                        }
                        yData.push(item.yAxial)
                        pieXDataOb.value = item.yAxial
                        pieXData.push(pieXDataOb)
                    } else {
                        // this.xData.push('其他')
                        // this.yData.push(item['其他'])
                        pieXDataOb.value = item['其他']
                        pieXDataOb.name = '其他'
                        pieXData.push(pieXDataOb)
                    }
                })
                this.yData = yData
                this.xData = xData
                this.get_barChart(this.xData, this.yData, this.yLabel.value)
                this.get_pieChart(pieXData, this.xData, this.yLabel.value)
            }
        },
        destroy() {
            // this.mychart2.dispose()
            // this.mychart1.dispose()
        }
    },
    watch: {
        defaultData() {
            this.chartFields = this.defaultData.chartFields[0]
            this.defaultData.chartFields.map(item => {
                if (item.yAxial) {
                    this.yLabel = item
                }
                if (item.xAxial) {
                    this.dictCode = item.dictCode
                    this.xData.map(items => {
                        let a = {}
                        let b = item.key
                        if (items != '其他') {
                            a[b] = parseInt(items)
                            this.yDataVerb.push(a)
                        }
                    })
                }
            })
        },
        chartDefaultData: {
            handler: function (val) {
                this.processChartData()
            },
            deep: true
        }
    }
}
</script>
<style lang="less" >
.chartWrap {
    .chartWrapTab {
        .el-tabs__header {
            border-bottom: none;
        }
        .el-tabs__item.is-active {
            background: #d0021b;
            color: #fff;
            border: 1px solid #d0021b;
        }
        .el-tabs__active-bar {
            display: none;
        }
        .el-tabs__item {
            border: 1px solid #dfe2e4;
        }
    }
}
</style>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
