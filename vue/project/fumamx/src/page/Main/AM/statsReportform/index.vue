<template>
    <div class="statsReportform">
        <div v-show="tabData=='0'">
            <div class="overView">
                <!-- 请求时间： -->
                {{$t('mxpcweb.am.1531905957429')}}
                <div class="selectBox">
                    <!-- 今天 -->
                    <span class="selectItem text-hover" :class="selectTime==='3'?'selectItem1':''" @click="selectTimeTab('3')">{{$t('mxpcweb.am.1532155762510')}}</span>
                    <!-- 昨天 -->
                    <span class="selectItem text-hover" :class="selectTime==='4'?'selectItem1':''" @click="selectTimeTab('4')">{{$t('mxpcweb.am.1532155791814')}}</span>
                    <!-- 最近一周 -->
                    <span class="selectItem text-hover" :class="selectTime==='0'?'selectItem1':''" @click="selectTimeTab('0')">{{$t('mxpcweb.am.1531906012570')}}</span>
                    <!-- 最近一个月 -->
                    <span class="selectItem text-hover" :class="selectTime==='1'?'selectItem1':''" @click="selectTimeTab('1')">{{$t('mxpcweb.am.1531905991654')}}</span>
                    <span class="selectItem text-hover">
                        <!-- 自定义时间 -->
                        <el-date-picker v-model="selectTimeAuto" type="daterange" align="right" :placeholder="$t('mxpcweb.am.1531906032143')" :picker-options="pickerOptions2" @change="selectTimeTab('2')">
                        </el-date-picker>
                    </span>
                </div>
                <!-- 导出数据 -->
                <el-button class="addButton" type="primary" size="small" @click="exportReport()">{{$t('mxpcweb.am.1531906049630')}}</el-button>
            </div>
            <div class="listBox MXscroll">
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
                            <div ref="statsReportformEchart" style="height: 270px;width:500px"></div>
                        </el-col>
                    </el-row>
                </div>
                <div class="list list1">
                    <div class="listItem1">
                        <!-- 点击互动 -->
                        <div class="title">{{$t('mxpcweb.am.1531900910591')}}</div>
                        <div class="listItem1Pie">
                            <div ref="listItem1PieEchart" style="height: 240px;width:300px;"></div>
                            <!-- <el-progress type="circle" :percentage="reportData.clickPercent" :show-text="false" :stroke-width="25" :width="170"></el-progress> -->
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
                                    <!-- <el-progress :show-text="false" :stroke-width="10" :percentage="reportData.uniqueClicksPercent"></el-progress> -->
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
                <div class="list list2" ref="statsReportformEchart1Box">
                    <!-- 发送表现 -->
                    <div class="title">{{$t('mxpcweb.am.1532157775315')}}</div>
                    <div class="list2EchartBox" :style="{opacity:!isEmptyObject(dialogLookListBase1)?'':0}">
                        <!-- 接收人 -->
                        <span class="echartName">{{$t('mxpcweb.am.1531897676549')}}</span>
                        <div ref="statsReportformEchart1" style="min-height: 245px;width:100%;margin-top:40px;">
                        </div>
                    </div>
                    <no-data class="noData" v-show="isEmptyObject(dialogLookListBase1)" style="margin-top:10px;"></no-data>
                </div>
            </div>

        </div>
        <report v-if="tabData=='1'"></report>
        <!--大标题-->
        <!-- 统计报表 -->
        <page-title :showTitle="false" :title="$t('mxpcweb.am.1531906158882')" iconfont="icon-report">
        </page-title>

        <div class="pageTab">
            <el-tabs class="subTabs-pullRight" v-model="tabData">
                <!-- 报告总览 -->
                <el-tab-pane :label="$t('mxpcweb.am.1531906161136')" name="0">
                </el-tab-pane>
                <!-- 统计报表 -->
                <el-tab-pane :label="$t('mxpcweb.am.1531906158882')" name="1">
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>

</template>

<script>
import { isObject } from '@/libs/utils.js'
import PageTitle from '@/components/PageTitle/index' // 大标题
import Report from './Report/index.vue' // 报告
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
    name: 'statsReportform',
    props: {
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
            tabData: '0',
            routeUrl: '',
            selectTime: '3',
            selectTimeAuto: ['', ''],
            mainChart: '',
            mainChart1: '',
            mainChart2: '',
            dialogLookListBase1: {},
            dialogLookListBase2: [],
            pickerOptions2: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7 - 3600 * 1000 * 24 * 30 || time.getTime() > Date.now()
                }
            },
            loading: true
        }
    },
    created() {
        this.routeUrl = this.$route.path
    },
    mounted() {
        let _this = this
        _this.mainChart = echarts.init(_this.$refs.statsReportformEchart)
        _this.mainChart1 = echarts.init(_this.$refs.statsReportformEchart1)
        _this.mainChart2 = echarts.init(_this.$refs.listItem1PieEchart)
        // window.onresize = function () {
        //     _this.mainChart.resize()
        //     _this.mainChart2.resize()
        //     _this.mainChart1.resize()
        // }
        this.getData()
        _this.loading = false
    },
    computed: {
        ...mapGetters(['company', 'screenWidth'])
    },
    methods: {
        isEmptyObject(obj) {
            for (var key in obj) {
                return false
            }
            return true
        },
        exportReport() {
            let _this = this
            let beginDate = ''
            let endDate = ''
            if (_this.selectTime === '0') {
                let time = new Date()
                let time1 = _this.$m_unifiedTime(time)
                endDate = _this.timeShow_custom(time1, 'YYYY-MM-DD')
                beginDate = _this.timeShow_custom(_this.$m_unifiedTime(new Date(time.getTime() - 3600 * 1000 * 24 * 7)), 'YYYY-MM-DD')
            }
            if (_this.selectTime === '1') {
                let time = new Date()
                let time1 = _this.$m_unifiedTime(time)
                endDate = _this.timeShow_custom(time1, 'YYYY-MM-DD')
                beginDate = _this.timeShow_custom(_this.$m_unifiedTime(new Date(time.getTime() - 3600 * 1000 * 24 * 30)), 'YYYY-MM-DD')
            }
            if (_this.selectTime === '2') {
                if (this.selectTimeAuto[0] && this.selectTimeAuto[1]) {
                    // let time = new Date()
                    // let sTime = _this.timeShow_custom(_this.$m_unifiedTime(time), 'HH:mm:ss')
                    // beginDate = _this.timeShow_custom(_this.$m_unifiedTime(this.selectTimeAuto[0]), 'YYYY-MM-DD') + ' ' + sTime
                    // endDate = _this.timeShow_custom(_this.$m_unifiedTime(this.selectTimeAuto[1]), 'YYYY-MM-DD') + ' ' + sTime
                    beginDate = _this.timeShow_custom(_this.$m_unifiedTime(this.selectTimeAuto[0]), 'YYYY-MM-DD')
                    endDate = _this.timeShow_custom(_this.$m_unifiedTime(this.selectTimeAuto[1]), 'YYYY-MM-DD')
                }
            }
            // if (_this.selectTime === '3') {
            //     let time = new Date()
            //     let time1 = _this.$m_unifiedTime(time)
            //     endDate = _this.timeShow_custom(time1, 'YYYY-MM-DD')
            //     beginDate = _this.timeShow_custom(_this.$m_unifiedTime(new Date(time.getTime() - 3600 * 1000 * 24 * 1)), 'YYYY-MM-DD')
            // }
            if (_this.selectTime === '4') {
                let time = new Date()
                endDate = _this.timeShow_custom(_this.$m_unifiedTime(new Date(time.getTime() - 3600 * 1000 * 24 * 1)), 'YYYY-MM-DD')
                beginDate = _this.timeShow_custom(_this.$m_unifiedTime(new Date(time.getTime() - 3600 * 1000 * 24 * 2)), 'YYYY-MM-DD')
            }
            // let { accessToken } = this.getToken()
            let url = ''
            if (_this.selectTime == '3') {
                url = this.Global.baseURL + this.Global.api.v2.reportExport_Get + '?days=1'
            } else {
                url = this.Global.baseURL + this.Global.api.v2.reportExport_Get + '?dateBegin=' + beginDate + '&dateEnd=' + endDate
            }

            this.downloadFile(url)
        },
        selectTimeTab(type) {
            this.selectTime = type
            this.getData()
        },
        getData() {
            let _this = this
            _this.loading = true
            let beginDate = ''
            let endDate = ''
            if (_this.selectTime === '0') {
                let time = new Date()
                let time1 = _this.$m_unifiedTime(time)
                endDate = _this.timeShow_custom(time1, 'YYYY-MM-DD')
                beginDate = _this.timeShow_custom(_this.$m_unifiedTime(new Date(time.getTime() - 3600 * 1000 * 24 * 7)), 'YYYY-MM-DD')
            }
            if (_this.selectTime === '1') {
                let time = new Date()
                let time1 = _this.$m_unifiedTime(time)
                endDate = _this.timeShow_custom(time1, 'YYYY-MM-DD')
                beginDate = _this.timeShow_custom(_this.$m_unifiedTime(new Date(time.getTime() - 3600 * 1000 * 24 * 30)), 'YYYY-MM-DD')
            }
            if (_this.selectTime === '2') {
                if (this.selectTimeAuto[0] && this.selectTimeAuto[1]) {
                    // let time = new Date()
                    // let sTime = _this.timeShow_custom(_this.$m_unifiedTime(time), 'HH:mm:ss')
                    // beginDate = _this.timeShow_custom(_this.$m_unifiedTime(this.selectTimeAuto[0]), 'YYYY-MM-DD') + ' ' + sTime
                    // endDate = _this.timeShow_custom(_this.$m_unifiedTime(this.selectTimeAuto[1]), 'YYYY-MM-DD') + ' ' + sTime
                    beginDate = _this.timeShow_custom(_this.$m_unifiedTime(this.selectTimeAuto[0]), 'YYYY-MM-DD')
                    endDate = _this.timeShow_custom(_this.$m_unifiedTime(this.selectTimeAuto[1]), 'YYYY-MM-DD')
                }
            }
            if (_this.selectTime === '3') {
                let time = new Date()
                let time1 = _this.$m_unifiedTime(time)
                endDate = _this.timeShow_custom(time1, 'YYYY-MM-DD')
                beginDate = _this.timeShow_custom(time1, 'YYYY-MM-DD')
            }
            if (_this.selectTime === '4') {
                let time = new Date()
                endDate = _this.timeShow_custom(_this.$m_unifiedTime(new Date(time.getTime() - 3600 * 1000 * 24 * 1)), 'YYYY-MM-DD')
                beginDate = _this.timeShow_custom(_this.$m_unifiedTime(new Date(time.getTime() - 3600 * 1000 * 24 * 2)), 'YYYY-MM-DD')
            }
            let data1 = {}
            let data2 = {}
            // alert(_this.selectTime)
            if (_this.selectTime == '3') {
                data1.days = 1
                data2.days = 1
                data2.aggregate = '1'
            } else {
                data1.dateBegin = beginDate
                data1.dateEnd = endDate
                data2.dateBegin = beginDate
                data2.dateEnd = endDate
                data2.aggregate = '1'
            }
            var p1 = new Promise((resolve, reject) => {
                _this.$http.get(this.Global.baseURL + this.Global.api.v2.openAndClick_Get, { params: data1 }).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data.dataList)) {
                        resolve(res.body.data.dataList)
                    } else {
                        resolve([])
                        // _this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
                })
            })
            var p2 = new Promise((resolve, reject) => {
                _this.$http.get(this.Global.baseURL + this.Global.api.v2.report_Get, {
                    params: data2
                }).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        if (isObject(res.body.data.dataList)) {
                            resolve(res.body.data.dataList)
                        } else {
                            resolve({
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
                            })
                            // _this.$message.error(_this.msg(res.body))
                        }
                    } else if (res.body.code.toString() != '-3') {
                        _this.loading = false
                        _this.$message.error(_this.msg(res.body))
                    } else {
                        _this.loading = false
                    }
                }, function (res) {
                    _this.loading = false
                    _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
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
                _this.loading = false
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
                        left: 40,
                        right: 20,
                        bottom: 40
                    }
                ],
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
                series: [{
                    // 打开
                    name: this.$t('mxpcweb.am.1531901433719'),
                    data: data,
                    type: 'line',
                    symbol: 'circle',
                    symbolSize: 8,
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
                    symbolSize: 8,
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
    watch: {
        $route(val, old) {
            if (val.path == this.routeUrl) {
                this.tabData = '0'
                this.getData()
            }
        },
        screenWidth(val) { // 监听屏幕宽度变化
            this.mainChart.resize()
            this.mainChart2.resize()
            this.mainChart1.resize()
        }
    },
    components: {
        'page-title': PageTitle,
        'report': Report,
        'no-data': NoData
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
