<template>
    <div class="timeChart">
        <div class="title">
            <div class="onlineTabs">
                <span class="onlineTab text-hover">企业使用统计图</span>
            </div>
            <div class="titleRight">
                <el-select v-model="value" @change="getData()" placeholder="请选择" style="width: 117px;">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="contentBox">
            <div class="titleLeft">
                <div class="titleList" v-for="(item, index) in dataList" :key="index" :class="titleListCheck == item.key?'titleListCheck':''" @click="onclick(item)">{{item.label}}</div>
            </div>
            <div class="contentLeft">
                <div class="countTitle">图文数据</div>
                <div class="countBox">
                    <div class="countList" v-for="(item, index) in dataListItem" :key="index">
                        <div class="count">
                            <strong>{{item.value}}</strong>
                        </div>
                        <div class="countName">{{item.label}}</div>
                    </div>
                </div>
            </div>
            <div class="contentRight" ref="statsReportformEchart1">
            </div>
        </div>
    </div>
</template>

<script>
/**
 * 运维管理
 * 何俊峰
 * 2018-11-18
 */
import { mapGetters } from 'vuex'
let echarts = require('echarts/lib/echarts') // 引入基本模板
require('echarts/lib/chart/line') // 线图
require('echarts/lib/component/tooltip') // 鼠标经过tips
require('echarts/lib/component/dataZoom') // 线图引导点tabs
require('echarts/lib/component/dataZoom') // 线图引导点tabs
require('echarts/lib/component/legend') // 线图引导点tabs
export default {
    name: 'billCount',
    props: {
        itemData: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data() {
        return {
            value: 'today',
            options: [{
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
            titleListCheck: '',
            dataList: [{
                label: '客户',
                key: '1000',
                iconfont: 'icon-people_list_light',
                value: [
                    {
                        label: '新增客户数',
                        key: 'create',
                        value: '0'
                    },
                    {
                        label: '新增跟进数',
                        key: 'follow',
                        value: '0'
                    }
                ]
            }, {
                label: '孚盟邮',
                iconfont: 'icon-mail',
                key: '2000',
                value: [
                    {
                        label: '收件数',
                        key: 'receive',
                        value: '0'
                    },
                    {
                        label: '发件数',
                        key: 'deliver',
                        value: '0'
                    }
                ]
            }, {
                label: '发现',
                key: '3000',
                iconfont: 'icon-discover',
                value: [
                    {
                        label: '搜索次数',
                        key: 'search',
                        value: '0'
                    },
                    {
                        label: '深挖次数',
                        key: 'dig',
                        value: '0'
                    },
                    {
                        label: '社媒运营',
                        key: 'publish',
                        value: '0'
                    },
                    {
                        label: '获取邮箱次数',
                        key: 'digMail',
                        value: '0'
                    }
                ]
            }, {
                label: '营销AM',
                iconfont: 'icon-am-solid',
                key: '4000',
                value: [
                    {
                        label: '新建任务数',
                        key: 'taskCreate',
                        value: '0'
                    },
                    {
                        label: '发送数',
                        key: 'mailDelivery',
                        value: '0'
                    },
                    {
                        label: '开发信数',
                        key: 'mailTemplate',
                        value: '0'
                    }
                ]
            }, {
                label: '商品',
                key: '5000',
                iconfont: 'icon-goods-list',
                value: [
                    {
                        label: '上架商品数',
                        key: 'onStock',
                        value: '0'
                    },
                    {
                        label: '分享次数',
                        key: 'share',
                        value: '0'
                    },
                    {
                        label: '曝光次数',
                        key: 'read',
                        value: '0'
                    }
                ]
            }, {
                label: '知识管理',
                iconfont: 'icon-file-manager',
                key: '6000',
                value: [
                    {
                        label: '搜索次数',
                        key: 'search',
                        value: '0'
                    },
                    {
                        label: '存档次数',
                        key: 'create',
                        value: '0'
                    }
                ]
            }],
            dataListItem: [],
            color: ['#fc736e', '#F8BA3E', '#78AFF1', '#9CD97F']
        }
    },
    created() {
    },
    mounted () {
        this.mainChart1 = echarts.init(this.$refs.statsReportformEchart1)
        this.onclick(this.dataList[0])
    },
    computed: {
        ...mapGetters([
            'screenWidth'
        ])
    },
    methods: {
        onclick(item) {
            this.titleListCheck = item.key
            this.dataListItem = item.value
            this.getData()
        },
        setChart(itemList, obj) {
            let legentData = []
            let values = []
            let times = []
            itemList.forEach((item, index) => {
                legentData.push({
                    name: item.label,
                    borderColor: this.color[index],
                    icon: 'rect'
                })
                if (obj[item.key]) {
                    let list = []
                    obj[item.key].forEach((element) => {
                        list.push(element.count)
                        if (index == 0) {
                            times.push(element.time)
                        }
                    })
                    values.push({
                        name: item.label,
                        data: list,
                        type: 'line',
                        symbol: 'circle',
                        symbolSize: 6,
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    color: this.color[index]
                                },
                                color: this.color[index],
                                borderColor: this.color[index],
                                borderWidth: 1
                            }
                        }
                    })
                }
            })
            let options1 = {
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '15%',
                    top: '5%',
                    containLabel: true
                },
                legend: {
                    data: legentData,
                    bottom: 10,
                    left: 'center',
                    itemWidth: 30,
                    itemHeight: 5,
                    itemGap: 30,
                    borderRadius: 10,
                    padding: [0, 5]
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
                        params.forEach(item => {
                            html += '<div>'
                            html += item.marker
                            html += item.seriesName + '   ' + item.value
                            html += '</div>'
                        })
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
                series: values
            }
            this.mainChart1.clear()
            this.mainChart1.setOption(options1)
        },
        // getData() {
        //     let list = [{
        //         count: 1,
        //         count1: 3,
        //         time: '星期一'
        //     }, {
        //         count: 3,
        //         count1: 5,
        //         time: '星期二'
        //     }, {
        //         count: 6,
        //         count1: 23,
        //         time: '星期三'
        //     }, {
        //         count: 9,
        //         count1: 8,
        //         time: '星期四'
        //     }, {
        //         count: 7,
        //         count1: 23,
        //         time: '星期五'
        //     }, {
        //         count: 4,
        //         count1: 6,
        //         time: '星期六'
        //     }, {
        //         count: 8,
        //         count1: 9,
        //         time: '星期日'
        //     }]
        //     this.setChart(list)
        // },
        getData() {
            let _this = this
            _this.$http.get(this.Global.baseURL + this.Global.api.mx.enterprise_line_operation, {
                params: {
                  cid: _this.itemData.cid,
                  searchType: _this.titleListCheck,
                  dateType: _this.value
                }
            }).then(function(res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.updata(res.body.data)
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function(res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        updata(obj) {
            this.dataList.forEach(element => {
                if (element.key == this.titleListCheck) {
                    element.value.forEach(item => {
                        if (obj[item.key]) {
                            let count = 0
                            if (item.key == 'onStock') {
                                count = obj[item.key].length > 0 ? obj[item.key][obj[item.key].length - 1].count : 0
                            } else {
                                obj[item.key].forEach(item1 => {
                                    count += parseInt(item1.count)
                                })
                            }
                            item.value = count + ''
                        }
                    })
                    this.setChart(element.value, obj)
                }
            })
        }
    },
    components: {
    },
    beforeDestroy: function () {
        this.mainChart1.clear()
    },
    watch: {
        screenWidth(val) { // 监听屏幕宽度变化
            this.mainChart1.resize()
        }
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
