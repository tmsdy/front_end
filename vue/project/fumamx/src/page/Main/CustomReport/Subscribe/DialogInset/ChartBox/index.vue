<template>
    <div class="chartWrap">
        <el-tabs v-model="activeName" @tab-click="handleClick" class="chartWrapTab">
            <el-tab-pane label="饼状图" name="first">
                <div id="pieChart" style="width: 500px;height:350px;"></div>
            </el-tab-pane>
            <el-tab-pane label="柱状图" name="second">
                <div id="barChart" style="width: 500px;height:350px;"></div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
let echarts = require('echarts/lib/echarts') // 引入基本模板
require('echarts/lib/chart/pie') // 饼图
require('echarts/lib/chart/bar') // 柱状图
export default {
    name: 'chartWrap',
    data() {
        return {
            activeName: 'first'
        }
    },
    // props: {
    //     itemData: {
    //         type: Object,
    //         default: function () {
    //             return {

    //             }
    //         }
    //     }
    // },
    created() {
        // this.getDetailPage()

        this.$nextTick(function () {
            this.get_barChart()
            this.get_pieChart()
        })
    },
    mounted() { },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event)
        },
        get_pieChart() {
            var myChart = echarts.init(document.getElementById('pieChart'))
            var option = {
                title: {
                    text: '某站点用户访问来源',
                    subtext: '纯属虚构',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '70%',
                        center: ['50%', '50%'],
                        data: [
                            { value: 335, name: '直接访问' },
                            { value: 310, name: '邮件营销' },
                            { value: 234, name: '联盟广告' },
                            { value: 135, name: '视频广告' },
                            { value: 1548, name: '搜索引擎' }
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            }
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option)
        },
        get_barChart() {
            var myChart = echarts.init(document.getElementById('barChart'))

            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: 'ECharts 入门示例'
                },
                tooltip: {},
                legend: {
                    data: ['销量']
                },
                xAxis: {
                    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }]
            }

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option)
        }
    },
    components: {
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
