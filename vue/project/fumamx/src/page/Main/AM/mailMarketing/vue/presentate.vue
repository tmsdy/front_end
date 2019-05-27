<template>
    <div class="presentate MXscroll">
        <!-- 邮件营销 -->
        <page-detail :title="$t('mxpcweb.am.1531897436358')" iconfont="icon-mail" :detailTitle="itemData.taskName" @toList="$emit('tabDataCheck','1')"></page-detail>
        <div class="overView">
            <div class="overViewImg">
                <img src="../img/u18267.png" style="width:60px;height:70px;">
            </div>
            <div class="overViewitem">
                <div class="titleName">{{itemData.taskName}}</div>
                <div class="detail">
                    <span class="detailName">{{itemData.status}}</span>
                    <span class="detailValue" style="margin-left:30px;">{{itemData.createDate}}</span>
                    <!-- 接收人总数 -->
                    <span class="detailName" style="margin-left:66px;">{{$t('mxpcweb.am.1531900898202')}}</span>
                    <span class="detailValue" style="margin-left:30px;">{{reportData.requestNum}}</span>
                </div>
            </div>
        </div>
        <div class="listBox">
            <div class="list list2" style="height:307px;">
                <!-- 发送绩效 -->
                <div class="title">{{$t('mxpcweb.am.1531900909943')}}</div>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div class="reportImg">
                            <img src="/static/images/amTemplateImg/round.png" alt="">
                            <div class="requestNumBox">{{reportData.requestNum}}</div>
                            <!-- 请求量 -->
                            <div class="requestNumTip">{{$t('mxpcweb.am.1531900910384')}}</div>
                        </div>
                    </el-col>
                    <el-col :span="12" style="position:relative;">
                        <div ref="statsReportformEchart" style="height: 270px;width:100%;"></div>
                    </el-col>
                </el-row>
            </div>
            <div class="list list1">
                <div class="listItem1">
                    <!-- 点击互动 -->
                    <div class="title">{{$t('mxpcweb.am.1531900910591')}}</div>
                    <div class="listItem1Pie">
                        <div ref="listItem1PieEchart" style="height: 240px;width:340px;"></div>
                    </div>
                    <div class="listItem1PieTip">
                        <div class="pieTipList">
                            <span class="pieTipListCont">{{reportData.clickNum}}</span><br>
                            <!-- 点击的接收人 -->
                            <span class="pieTipListTitle">{{$t('mxpcweb.am.1531900921799')}}</span>
                        </div>
                    </div>
                </div>
                <div class="listItem2">
                    <!-- 邮件回应 -->
                    <div class="title">{{$t('mxpcweb.am.1531900922022')}}</div>
                    <div class="listItem2Box">
                        <div class="listItem2List">
                            <!-- 独立点击 -->
                            <div class="listTitle">{{$t('mxpcweb.am.1531900922230')}}</div>
                            <div class="listProgress">
                                <div class="progress progress1">
                                    <span v-if="reportData.uniqueClicksPercent==0" style="width:2%"></span>
                                    <span v-else :style="{width:parseFloat(reportData.uniqueClicksPercent)+2+'%'}"></span>
                                </div>
                            </div>
                            <div class="listProgressCount">
                                <span class="listProgressCountLeft">{{reportData.uniqueClicksNum}}</span>
                                <span class="listProgressCountRight">{{reportData.uniqueClicksPercent}}%</span>
                            </div>
                        </div>
                        <div class="listItem2List">
                            <!-- 取消订阅 -->
                            <div class="listTitle">{{$t('mxpcweb.am.1531900935855')}}</div>
                            <div class="listProgress">
                                <div class="progress progress2">
                                    <span v-if="reportData.unsubscribePercent==0" style="width:2%"></span>
                                    <span v-else :style="{width:parseFloat(reportData.unsubscribePercent)+2+'%'}"></span>
                                </div>
                            </div>
                            <div class="listProgressCount">
                                <span class="listProgressCountLeft">{{reportData.unsubscribeNum}}</span>
                                <span class="listProgressCountRight">{{reportData.unsubscribePercent}}%</span>
                            </div>
                        </div>
                        <div class="listItem2List">
                            <!-- 垃圾邮件举报 -->
                            <div class="listTitle">{{$t('mxpcweb.am.1531900936087')}}</div>
                            <div class="listProgress">
                                <div class="progress progress3">
                                    <span v-if="reportData.spamReportedPercent==0" style="width:2%"></span>
                                    <span v-else :style="{width:parseFloat(reportData.spamReportedPercent)+2+'%'}"></span>
                                </div>
                            </div>
                            <div class="listProgressCount">
                                <span class="listProgressCountLeft">{{reportData.spamReportedNum}}</span>
                                <span class="listProgressCountRight">{{reportData.spamReportedPercent}}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="list list2">
                <!-- 72小时发送表现 -->
                <div class="title">{{$t('mxpcweb.am.1531900936279')}}</div>
                <div :style="{opacity:!isEmptyObject(dialogLookListBase1)?'':0}">
                    <!-- 接收人 -->
                    <span class="echartName">{{$t('mxpcweb.am.1531897676549')}}</span>
                    <div ref="statsReportformEchart1" style="height:245px;width:100%;margin-top:40px;">
                    </div>
                </div>
                <no-data class="noData" v-show="isEmptyObject(dialogLookListBase1)"></no-data>
            </div>
        </div>
    </div>

</template>

<script>
import PageDetail from '@/components/PageDetail/index' // 大标题
import { isObject } from '@/libs/utils.js'
import NoData from '@/basecomponents/NoData/index'
import { mapGetters } from 'vuex'
let echarts = require('echarts/lib/echarts') // 引入基本模板
require('echarts/lib/chart/line') // 线图
require('echarts/lib/chart/pie') // 饼图
require('echarts/lib/component/tooltip') // 鼠标经过tips
require('echarts/lib/component/legend') // 线图引导点tabs
require('echarts/lib/component/dataZoom') // 线图引导点tabs
require('echarts/lib/component/title')
export default {
    name: 'presentate',
    props: {
        itemData: {
            type: Object,
            default: function () {
                return {

                }
            }
        },
        ctid: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            myChart: '',
            reportData: {
                'requestNum': 0,
                'deliveredNum': 0,
                'clickNum': 0,
                'openNum': 0,
                'bounceNum': 0,
                'spamReportedNum': 0,
                'unsubscribeNum': 0,
                'uniqueOpensNum': 0,
                'uniqueClicksNum': 0,
                'invalidEmailsNum': 0,
                'deliveredPercent': 0,
                'clickPercent': 0,
                'openPercent': 0,
                'bouncePercent': 0,
                'spamReportedPercent': 0,
                'unsubscribePercent': 0,
                'uniqueOpensPercent': 0,
                'uniqueClicksPercent': 0,
                'invalidEmailsPercent': 0
            },
            mainChart: '',
            mainChart1: '',
            mainChart2: '',
            dialogLookListBase1: {},
            dialogLookListBase2: []
        }
    },
    mounted() {
        let _this = this
        _this.mainChart = echarts.init(_this.$refs.statsReportformEchart)
        _this.mainChart1 = echarts.init(_this.$refs.statsReportformEchart1)
        _this.mainChart2 = echarts.init(_this.$refs.listItem1PieEchart)
        // window.onresize = function () {
        //     _this.mainChart.resize()
        //     _this.mainChart1.resize()
        //     _this.mainChart2.resize()
        // }
        _this.getData()
    },
    computed: {
        ...mapGetters([
            'screenWidth'
        ])
    },
    methods: {
        isEmptyObject(obj) {
            for (var key in obj) {
                return false
            }
            return true
        },
        getData() {
            let _this = this
            let data1 = {
                taskId: _this.itemData.taskId,

                // guidkey: _this.itemData.guidkey,
                // type: '0',
                // subctid: _this.ctid,
                days: '91'
                // timeOrder: '1'
            }
            var p1 = new Promise((resolve, reject) => {
                _this.$http.get(this.Global.baseURL + this.Global.api.v2.openAndClick_Get, { params: data1 }).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        resolve(res.body.data.dataList)
                    } else if (res.body.code.toString() != '-3') {
                        // _this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            var p2 = new Promise((resolve, reject) => {
                _this.$http.get(this.Global.baseURL + this.Global.api.v2.report_Get, {
                    params: {
                        days: 91,
                        taskId: _this.itemData.taskId
                    }
                }).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data.dataList)) {
                        resolve(res.body.data.dataList)
                    } else {
                        resolve([])
                        // _this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            Promise.all([p1, p2]).then(function (results) {
                if (results[0]) {
                    _this.dialogLookListBase1 = results[0]
                }
                // if (results[0].length > 1) {
                //     _this.dialogLookListBase2 = results[0]
                // }
                _this.reportData = results[1]
                _this.upOptions()
            })
        },

        upOptions() {
            let _this = this
            let options = {
                title: {
                    show: false,
                    text: _this.reportData.requestNum,
                    // 请求量
                    subtext: this.$t('mxpcweb.am.1531900910384'),
                    x: 'left',
                    y: 'center',
                    itemGap: 0,
                    padding: [0, 0, 0, 40],
                    textStyle: {
                        fontSize: '28',
                        color: 'rgb(61, 66, 94)',
                        fontWeight: 400
                    },
                    subtextStyle: {
                        color: '#6b6b6b'
                    }
                },
                calculable: true,
                color: ['RGBA(248, 135, 125, 1)', 'RGBA(139, 216, 103, 1)', 'RGBA(255, 183, 53, 1)'],
                tooltip: {
                    trigger: 'item',
                    formatter: '{b} : {c} ({d}%)'
                },
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: ['49%', '64%'],
                        center: ['50%', '68%'],
                        hoverAnimation: false,
                        label: {
                            normal: {
                                formatter: [
                                    '{title|{b}}',
                                    '{rateHead|{c} （{d}%）}'
                                ].join('\n'),
                                rich: {
                                    title: {
                                        color: 'RGBA(96, 98, 102, 1)',
                                        fontSize: 14,
                                        align: 'left',
                                        padding: [3, 10, 3, 10]
                                    },
                                    abg: {
                                        width: 15,
                                        height: 20
                                    },
                                    rateHead: {
                                        color: 'RGBA(48, 49, 51, 1)',
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        align: 'left',
                                        padding: [3, 10, 3, 10]
                                    }
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                label: {
                                }
                            }
                        },
                        data: [
                            {
                                value: _this.reportData.deliveredNum,
                                // 发送
                                name: this.$t('mxpcweb.am.1531900969998')
                            },
                            // 退件
                            { value: _this.reportData.bounceNum, name: this.$t('mxpcweb.am.1531900974095') },
                            // 无效
                            { value: _this.reportData.invalidEmailsNum, name: this.$t('mxpcweb.am.1531900978904') }
                        ]
                    }
                ]
            }
            this.mainChart.setOption(options)
            let options2 = {
                title: {
                    show: false
                },
                calculable: true,
                color: ['RGBA(139, 216, 103, 1)', 'RGBA(248, 135, 125, 1)', 'RGBA(255, 183, 53, 1)'],
                // tooltip: {
                //     trigger: 'item',
                //     formatter: '{b} : {c} ({d}%)'
                // },
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: ['49%', '64%'],
                        center: ['50%', '48%'],
                        hoverAnimation: false,
                        itemStyle: {
                            normal: {
                                label: {
                                }
                            }
                        },
                        data: [
                            {
                                value: _this.reportData.clickPercent,
                                // 点击率
                                name: this.$t('mxpcweb.am.1531900986271'),
                                label: {
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
                                                fontSize: 14,
                                                fontWeight: 'bold'
                                            }
                                        }
                                    }
                                }
                            }, {
                                value: 100 - parseInt(_this.reportData.clickNum),
                                // 未点击
                                name: this.$t('mxpcweb.am.1531900993030'),
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'center'
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
            this.mainChart2.setOption(options2)
            let data = []
            let anchor = []
            let openCount = 0
            let changeCount = 0
            for (var object in this.dialogLookListBase1) {
                openCount = 0
                changeCount = 0
                let dialogLookListBase1Arry = this.dialogLookListBase1[object]
                for (let index = 0; index < dialogLookListBase1Arry.length; index++) {
                    const element = dialogLookListBase1Arry[index]
                    if (element.trackType == 1) {
                        openCount++
                    } else {
                        changeCount++
                    }
                }
                if (openCount > 0) {
                    let obj = {
                        name: object,
                        value: [object, openCount]
                    }
                    data.push(obj)
                }
                if (changeCount > 0) {
                    let obj = {
                        name: object,
                        value: [object, changeCount]
                    }
                    anchor.push(obj)
                }
            }
            let options1 = {

                toolbox: {
                    feature: {
                        dataZoom: {
                            yAxisIndex: false
                        }
                    }
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    show: true,
                    // name: '时间',
                    nameTextStyle: {
                        color: 'RGBA(223, 226, 228, 1)'
                    },
                    nameGap: 40,
                    type: 'time',
                    axisLabel: {
                        textStyle: {
                        }
                    },
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
                    }
                },
                yAxis: {
                    show: true,
                    // 接收人
                    name: this.$t('mxpcweb.am.1531897676549'),
                    nameLocation: 'center',
                    nameTextStyle: {
                        color: 'RGBA(144, 147, 153, 1)'
                    },
                    nameGap: 50,
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
                    }
                },
                legend: {
                    data: [{
                        // 打开
                        name: this.$t('mxpcweb.am.1531901433719'),
                        borderColor: '#fc736e'
                    }, {
                        // 点击
                        name: this.$t('mxpcweb.am.1531901259662'),
                        borderColor: 'red'
                    }],
                    right: 50,
                    top: 10
                },
                grid: [
                    {
                        top: 43,
                        left: 30,
                        right: 20,
                        bottom: 40
                    }
                ],
                dataZoom: [{
                    type: 'inside'
                }, {
                    show: false
                    // realtime: true,
                    // backgroundColor: '#ededed',
                    // handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    // handleSize: '100%',
                    // handleStyle: {
                    //     color: '#fff',
                    //     shadowBlur: 3,
                    //     shadowColor: 'rgba(0, 0, 0, 0.6)',
                    //     shadowOffsetX: 2,
                    //     shadowOffsetY: 2
                    // }
                }],
                series: [{
                    // 打开
                    name: this.$t('mxpcweb.am.1531901433719'),
                    data: data,
                    type: 'line',
                    symbol: 'circle',
                    symbolSize: 1,
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                color: '#9cd97f'
                            },
                            color: '#9cd97f',
                            borderColor: '#9cd97f',
                            borderWidth: 1
                        }
                    }
                }, {
                    // 点击
                    name: this.$t('mxpcweb.am.1531901259662'),
                    data: anchor,
                    type: 'line',
                    symbol: 'circle',
                    symbolSize: 1,
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
            _this.mainChart.resize()
            _this.mainChart2.resize()
            _this.mainChart1.resize()
        }
    },
    components: {
        'page-detail': PageDetail,
        'no-data': NoData
    },
    watch: {
        screenWidth (val) { // 监听屏幕宽度变化
            // this.resize()
            this.mainChart.resize()
            this.mainChart1.resize()
            this.mainChart2.resize()
        }
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.presentate {
    height: 100%;
    overflow: auto;
    .overView {
        background: white;
        height: 120px;
        padding: 28px 0 41px 95px;
        color: #333333;
        position: relative;
        .overViewImg {
            position: absolute;
            top: 25px;
            left: 19px;
        }
        .overViewitem {
            float: left;
            min-width: 216px;
            .titleName {
                font-size: 20px;
                font-weight: bold;
                color: RGBA(48, 49, 51, 1);
            }
            .detail {
                font-size: 12px;
                margin-top: 10px;
                .detailName {
                    color: #94969c;
                }
                .detailValue {
                    color: RGBA(48, 49, 51, 1);
                }
            }
        }
    }
    .listBox {
        color: #3d425e;
        font-size: 12px;
        padding-bottom: 30px;
        .list {
            width: 100%;
            margin-top: 15px;
            .title {
                height: 40px;
                line-height: 40px;
                background: rgba(244, 244, 244, 1);
                border-radius: 4px 4px 0px 0px;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                padding: 0 15px;
                color: RGBA(48, 49, 51, 1);
                font-weight: bold;
                font-size: 16px;
            }
        }
        .list1 {
            height: 285px;
            > div {
                border: 1px solid #f2f2f2;
            }
            > .listItem1 {
                width: 48%;
                height: 285px;
                float: left;
                padding: 0px 40px;
                position: relative;
                background: white;
                .listItem1Pie {
                    position: absolute;
                    top: 43px;
                    right: 34px;
                }
                .listItem1PieTip {
                    position: absolute;
                    left: 109px;
                    top: 134px;
                    .pieTipListTitle {
                        margin-top: 6px;
                    }
                    .pieTipListCont {
                        font-size: 28px;
                    }
                    .pieTipList {
                        width: 100px;
                        text-align: center;
                    }
                }
            }
            > .listItem2 {
                width: 48%;
                height: 285px;
                float: right;
                position: relative;
                background: white;
                .listItem2Box {
                    margin-top: 70px;
                    .listItem2List {
                        height: 70px;
                        padding-left: 126px;
                        padding-right: 126px;
                        position: relative;
                        .listTitle {
                            position: absolute;
                            left: 16px;
                            top: 0;
                            text-align: right;
                            height: 40px;
                            line-height: 40px;
                            width: 89px;
                            font-size: 14px;
                            color: rgba(96, 98, 102, 1);
                        }
                        .listProgress {
                            padding: 15px 0;
                            .progress {
                                width: 100%;
                                height: 8px;
                                background: #efefef;
                                border-radius: 8px;
                                position: relative;
                                > span {
                                    position: absolute;
                                    left: 0;
                                    top: 0;
                                    bottom: 0;
                                    border-radius: 8px;
                                }
                            }
                            .progress1 {
                                > span {
                                    background: linear-gradient(
                                        136.4deg,
                                        rgba(255, 122, 109, 1),
                                        rgba(255, 77, 62, 1)
                                    );
                                }
                            }
                            .progress2 {
                                > span {
                                    background: linear-gradient(
                                        136.4deg,
                                        rgba(93, 219, 224, 1),
                                        rgba(0, 188, 218, 1)
                                    );
                                }
                            }
                            .progress3 {
                                > span {
                                    background: linear-gradient(
                                        136.4deg,
                                        rgba(59, 220, 72, 1),
                                        rgba(92, 209, 46, 1)
                                    );
                                }
                            }
                        }
                        .listProgressCount {
                            position: absolute;
                            right: 16px;
                            top: 0;
                            height: 40px;
                            line-height: 40px;
                            width: 89px;
                            .listProgressCountLeft {
                                font-size: 14px;
                                color: rgba(208, 2, 27, 1);
                                font-weight: bold;
                            }
                            .listProgressCountRight {
                                margin-left: 30px;
                                font-size: 14px;
                                color: rgba(144, 147, 153, 1);
                            }
                        }
                    }
                }
            }
        }
        .list2 {
            border: 1px solid #f2f2f2;
            padding: 0 40px;
            position: relative;
            background: white;
            .noData {
                position: absolute;
                top: 40px;
                left: 0;
                width: 100%;
                height: 245px;
            }
            .echartName {
                position: absolute;
                top: 54px;
                left: 90px;
                color: RGBA(96, 98, 102, 1);
            }
            .reportImg {
                margin: 79px auto 0;
                width: 192px;
                height: 192px;
                text-align: center;
                // background: url('/static/images/amTemplateImg/round.png');
                position: relative;
                color: white;
                text-align: center;

                .requestNumBox {
                    position: absolute;
                    top: 50px;
                    font-size: 30px;
                    width: 100%;
                }
                .requestNumTip {
                    position: absolute;
                    top: 90px;
                    font-size: 14px;
                    width: 100%;
                }
            }
            .statsReportformEchartBox {
                position: absolute;
                left: 50%;
                top: 100px;
                margin-left: 180px;
                margin-top: -10px;
                .statsReportformEchartBoxlist {
                    height: 76px;
                    .icon-dot {
                        font-size: 30px;
                        vertical-align: middle;
                    }
                }
            }
        }
    }
}
</style>
