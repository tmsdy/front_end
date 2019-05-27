<template>
    <div class="onlineChart">
        <div class="title">
            <div class="onlineTabs">
                <span class="onlineTab text-hover" :class="activeName == 'first'?'active-onlineTab':''" @click="activeName = 'first';getData()">在线趋势图</span>
                <span class="onlineTab text-hover" :class="activeName == 'tow'?'active-onlineTab':''" @click="activeName = 'tow';getData()">增量趋势图</span>
            </div>
            <div class="titleRight">
                <el-select v-model="value1" @change="getData()" placeholder="请选择" style="width:80px;">
                    <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="value2" @change="getData()" placeholder="请选择" style="width: 117px;">
                    <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="chartBox" v-if="activeName == 'first'">
            <div class="chartItem" ref="statsReportformEchart1">
            </div>
        </div>
        <div class="chartBox" v-else>
            <div class="chartItem" ref="statsReportformEchart2">
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
let echarts = require('echarts/lib/echarts') // 引入基本模板
require('echarts/lib/chart/line') // 线图
require('echarts/lib/component/tooltip') // 鼠标经过tips
require('echarts/lib/component/dataZoom') // 线图引导点tabs
require('echarts/lib/component/dataZoom') // 线图引导点tabs
/**
 * 运维管理
 * 何俊峰
 * 2018-11-18
 */
export default {
    name: 'onlineChart',
    data() {
        return {
            activeName: 'first',
            value1: 'consumer',
            value2: 'today',
            options1: [{
                label: '用户',
                value: 'consumer'
            }, {
                label: '企业',
                value: 'enterprise'
            }],
            options2: [{
                label: '今天',
                value: 'today'
            }, {
                label: '昨天',
                value: 'ayer'
            }, {
                label: '最近30天',
                value: 'month'
            }, {
                label: '最近12个月',
                value: 'year'
            }],
            mainChart1: ''
        }
    },
    created() {
    },
    mounted () {
        this.mainChart1 = echarts.init(this.$refs.statsReportformEchart1)
        // this.mainChart2 = echarts.init(this.$refs.statsReportformEchart2)
        this.getData()
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event)
        },
        setChart(list) {
            let values = []
            let times = []
            list.forEach(element => {
                values.push(element.count)
                times.push(element.time)
            })
            let itemName = ''
            if (this.activeName == 'first') {
                itemName += '在线'
            } else {
                itemName += '新增'
            }
            if (this.value1 == 'enterprise') {
                itemName += '企业数'
            } else {
                itemName += '用户数'
            }
            itemName += '  '
            let options1 = {
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '10%',
                    top: '15%',
                    containLabel: true
                },
                tooltip: {
                    trigger: 'axis',
                    borderRadius: 6, // 边框圆角
                    padding: [0],
                    position: function (point, params, dom, rect, size) {
                        let html = '<div style="background:white;border-radius: 5px;box-shadow: 0 0 20px #ededed">'
                        html += '<div style="padding:10px 20px;border-bottom:1px solid #e8e8ea;color:#393939;font-weight:bold;">'
                        html += params[0].axisValueLabel
                        html += '</div><div style="padding:15px 20px;color:#808088">'
                        html += params[0].marker
                        html += itemName + params[0].value
                        html += '</div></div>'
                        $(dom).html(html)
                    }
                },
                dataZoom: [{
                    type: 'inside'
                }, {
                    show: false,
                    realtime: true,
                    backgroundColor: '#ededed',
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '100%',
                    handleStyle: {
                        color: '#fff',
                        shadowBlur: 3,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    }
                }],
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    nameTextStyle: {
                        color: 'RGBA(223, 226, 228, 1)'
                    },
                    nameGap: 40,
                    axisLine: {
                        lineStyle: {
                            color: 'RGBA(223, 226, 228, 1)'
                        }
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        color: 'RGBA(144, 147, 153, 1)'
                    },
                    data: times
                },
                // xAxis: {
                //     type: 'category',
                //     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                // },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        // onZero: false,
                        lineStyle: {
                            color: 'RGBA(223, 226, 228, 1)'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'RGBA(223, 226, 228, 1)'
                        }
                    },
                    axisLabel: {
                        color: 'RGBA(144, 147, 153, 1)'
                    },
                    axisTick: {
                        show: false
                    }
                },
                series: [{
                    name: itemName,
                    data: values,
                    type: 'line',
                    symbol: 'circle',
                    symbolSize: 6,
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                color: '#ff8a7f'
                            },
                            color: '#ff8a7f',
                            borderColor: '#ff8a7f',
                            borderWidth: 1
                        }
                    }
                }]
            }
            this.mainChart1.setOption(options1)
        },
        getData() {
            if (this.activeName == 'first') {
                this.getData1()
            } else {
                this.getData2()
            }
        },
        getData1() {
            let _this = this
            _this.$http.get(this.Global.baseURL + this.Global.api.mx.online_count, {
              params: {
                  searchType: _this.value1,
                  dateType: _this.value2
              }
            }).then(function(res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    if (res.body.data.onLine) {
                        _this.setChart(res.body.data.onLine)
                    } else {
                        _this.mainChart1.clear()
                    }
                } else {
                    _this.mainChart1.clear()
                    _this.$message.error(_this.msg(res.body))
                }
            }, function(res) {
                _this.mainChart1.clear()
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        getData2() {
            let _this = this
            _this.$http.get(this.Global.baseURL + this.Global.api.mx.register_count, {
              params: {
                  searchType: _this.value1,
                  dateType: _this.value2
              }
            }).then(function(res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    if (res.body.data.register) {
                        _this.setChart(res.body.data.register)
                    } else {
                        _this.mainChart1.clear()
                    }
                } else {
                    _this.mainChart1.clear()
                    _this.$message.error(_this.msg(res.body))
                }
            }, function(res) {
                _this.mainChart1.clear()
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
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
