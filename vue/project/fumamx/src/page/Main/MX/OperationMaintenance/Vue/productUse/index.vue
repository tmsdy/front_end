<template>
    <div class="onlineChart">
        <div class="title">
            产品使用分布
        </div>
        <div class="chartBox">
            <div class="echartLeft" ref="listItem1PieEchart"></div>
            <div class="listBox">
                <div class="listItem2List" v-for="(item, index) in allData.ratio" :key="index">
                    <div class="listTitle">{{item.cnname}}</div>
                    <div class="listProgress">
                        <div class="progress" :class="'progress'+(index + 1)">
                            <span v-if="!item.count || item.count == 0" style="width:2%"></span>
                            <span v-else :style="{width:getNum(item.count)+2+'%'}"></span>
                        </div>
                    </div>
                    <div class="listProgressCount">
                        <span class="listProgressCountLeft">{{item.cnname}}</span>
                        <span class="listProgressCountRight">{{getNum(item.count)}}%</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
let echarts = require('echarts/lib/echarts') // 引入基本模板
require('echarts/lib/chart/pie') // 饼图
require('echarts/lib/component/legend') // 线图引导点tabs
/**
 * 运维管理
 * 何俊峰
 * 2018-11-18
 */
export default {
    name: 'onlineChart',
    data() {
        return {
            mainChart1: '',
            allData: {
                all: 0,
                ratio: []
            }
        }
    },
    created() {
    },
    mounted() {
        this.mainChart1 = echarts.init(this.$refs.listItem1PieEchart)
        this.getData()
    },
    methods: {
        getNum(value) {
            return parseFloat(value / this.allData.all * 100).toFixed(2)
        },
        getData() {
            let _this = this
            _this.$http.get(this.Global.baseURL + this.Global.api.mx.product_count).then(function(res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.allData = res.body.data
                    _this.setOption(res.body.data)
                } else {
                    _this.allData = {
                        all: 0,
                        ratio: []
                    }
                    _this.mainChart1.clear()
                    _this.$message.error(_this.msg(res.body))
                }
            }, function(res) {
                _this.allData = {}
                _this.mainChart1.clear()
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        setOption(data) {
            let label = {
                normal: {
                    formatter: [
                        '{abg|}{title|{b}}',
                        '{abg|}{rateHead|{d}%}'
                    ].join('\n'),
                    rich: {
                        title: {
                            color: 'RGBA(96, 98, 102, 1)',
                            fontSize: 14
                        },
                        abg: {
                            width: 15,
                            height: 20
                        },
                        rateHead: {
                            color: 'RGBA(48, 49, 51, 1)',
                            fontSize: 14
                        }
                    }
                }
            }
            let data1 = []
            let data2 = []
            data.ratio.forEach(element => {
                data1.push({
                    name: element.cnname,
                    // 强制设置图形为圆。
                    icon: 'circle'
                })
                data2.push({
                    value: element.count,
                    // 点击率
                    name: element.cnname,
                    label: label
                })
            })
            let options1 = {
                title: {
                    show: false
                },
                calculable: true,
                color: ['#78AFF1', '#9CD97F', '#55D0DE', '#F8BA3E', '#F8877D'],
                legend: {
                    bottom: 0,
                    left: 'center',
                    itemWidth: 5,
                    itemHeight: 5,
                    itemGap: 30,
                    data: data1
                },
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: ['40%', '50%'],
                        center: ['50%', '44%'],
                        hoverAnimation: false,
                        itemStyle: {
                            normal: {
                                label: {
                                }
                            }
                        },
                        data: data2
                    }
                ]
            }
            this.mainChart1.setOption(options1)
        }
    },
    computed: {
        ...mapGetters([
            'screenWidth'
        ])
    },
    components: {
    },
    beforeDestroy: function () {
        this.mainChart1.clear()
    },
    watch: {
        screenWidth(val) { // 监听屏幕宽度变化
            if (this.mainChart1 && this.mainChart1 != '') {
                this.mainChart1.resize()
            }
        }
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
