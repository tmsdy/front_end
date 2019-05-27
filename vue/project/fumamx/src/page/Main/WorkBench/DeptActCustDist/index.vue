<template>
    <div class="dashboardBox DeptActCustDist" v-bind:class='bindClass'>
        <div class="workTitle">
            <span class="pull-right">
                <!-- 请选择 -->
                <el-select v-model="region" @change="chageOption()" :placeholder="$t('mxpcweb.workbench.1530671363646')" size="small">
                    <el-option v-for="item in statinterval" :key="'a'+item.intervalCode" :value="item.intervalCode" :label="item.intervalName"> </el-option>
                </el-select>
            </span>
            <!--业务员客户分布TOP10-->
            <span class="name">{{pannelName}}</span>
        </div>
        <div class="workBody" v-loading="isload">
            <el-row v-if="!isNoData">
                <el-col :span="16">
                    <div class="content">
                        <div id="divContaion" ref="customerDistribObj"></div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="rightTable">
                        <div class="rightHeader">
                            <span>{{$t('mxpcweb.workbench.1530683995688')}}</span>
                            <span>{{$t('mxpcweb.workbench.1530702002146')}}</span>
                            <span>{{$t('mxpcweb.workbench.1530702016107')}}</span>
                            <span></span>
                        </div>
                        <div class="rightBody">
                            <div v-for="(item,index) in tableArray" :key="'b'+index" :style="styleObject">
                                <span>{{item.totalCust}}</span>
                                <span>{{item.actCustCount}}</span>
                                <span>
                                    <div class="progressData">
                                        <span class="bar">
                                            <i v-if="item.activePer == 0" style="width:5%"></i>
                                            <i v-else :style="{width: parseFloat(item.activePer)+3+ '%'}"></i>
                                        </span>
                                    </div>
                                </span>
                                <span>{{item.activePer}}%</span>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <div v-else>
                <!-- 暂无数据 -->
                <nodata v-show="isNoData" :title="$t('mxpcweb.workbench.1530682446647')"></nodata>
            </div>
        </div>
    </div>
</template>

<script>
import { isObject, setStore, getStore } from '@/libs/utils.js'
import NoData from '@/basecomponents/NoData/index'

let echarts = require('echarts/lib/echarts') // 引入基本模板
require('echarts/lib/chart/bar') // 线图
require('echarts/lib/component/tooltip') // 鼠标经过tips
require('echarts/lib/component/title') // 线图引导点tabs
export default {
    name: 'DeptActCustDist',
    props: ['isshow', 'data'],
    data() {
        return {
            selectOption: [],
            region: '',
            interval: 1,
            pannelName: '',
            fieldId: 1,
            statId: 7,
            isload: false,
            isNoData: false,
            bindClass: '',
            targetResults: [],
            objectResults: [],
            NoDataCss: 'NoDataCss',
            ctId: 0,
            activeIndex: 1,
            statinterval: [],
            depts: [],
            departName: '',
            departUserName: [],
            activeData: [],
            unactiveData: [],
            tableArray: []
        }
    },
    created() {
        if (this.data.length > 0) {
            this.pannelName = this.data[0].statname
            this.ctId = this.data[0].ctId
            if (this.data[0].index == '1') {
                this.bindClass = 'rightmargin'
            } else {
                this.bindClass = 'leftmargin'
            }
            this.startId = this.data[0].statid
            this.statinterval = this.data[0].statinterval
            if (this.statinterval.length > 0) {
                let selectedinterval = getStore('deptactDistinterval')
                var selectinterval
                if (selectedinterval != undefined && selectedinterval != '') {
                    selectinterval = selectedinterval
                } else {
                    selectinterval = this.statinterval[0].intervalCode
                    setStore('deptactDistinterval', selectinterval)
                }
                this.interval = selectinterval
            }

            var cname = this.getName(this.interval)
            this.region = cname

            this.depts = this.data[0].depts
            if (this.depts.length > 0) {
                this.dkey = this.depts[0].dkey
                this.departName = this.depts[0].deptName
                this.getDeptActCustDistData()
            }
        }
    },
    computed: {
        styleObject() {
            let val = 100 / this.tableArray.length
            return {height: val + '%'}
        }
     },
    methods: {
        toDecimal(x) {
            var float = parseFloat(x)
            if (isNaN(float)) {
                return false
            }
            var f = Math.round(x * 10) / 10
            var s = f.toString()
            var rs = s.indexOf('.')
            if (rs < 0) {
                rs = s.length
                s += '.'
            }
            while (s.length <= rs + 1) {
                s += '0'
            }
            return s
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
        chageOption() {
            var selectRegin = this.region
            this.interval = selectRegin
            setStore('deptactDistinterval', this.interval)
            this.isload = true
            this.tableArray = []
            this.getDeptActCustDistData()
        },
        getDeptActCustDistData() {
            let _this = this
            var url =
                _this.Global.baseURL + _this.Global.api.v2.stat_dept_actCustDist_get
            _this.$http
                .get(url, {
                    params: {
                        statId: this.startId,
                        interval: this.interval,
                        fieldId: this.fieldId,
                        dkey: this.dkey,
                        size: 10
                    }
                })
                .then(
                    (res) => {
                        if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data)) {
                            // console.log(res.body);
                            $('#divContaion').height('340px')
                            $('#divContaion').width('100%')

                            if (res.body.data.objectResults == undefined) {
                                this.isNoData = true
                                return
                            }

                            let customerDistrib = echarts.init(this.$refs.customerDistribObj)
                            this.objectResults = res.body.data.objectResults
                            if (this.objectResults.length == 0) {
                                this.isNoData = true
                            } else {
                                this.isNoData = false
                            }

                            this.departUserName = []
                            this.activeData = []
                            this.unactiveData = []
                            for (var i = 0; i < this.objectResults.length; i++) {
                                var item = this.objectResults[i]
                                var totalCust = item.totalCust
                                var actCustCount = item.actCustCount
                                var unactCustCount = totalCust - actCustCount

                                this.activeData.push(actCustCount)
                                this.unactiveData.push(unactCustCount)
                                /* '未知' */
                                this.departUserName.push(item.realName || this.$t('mxpcweb.workbench.1530702071883'))
                                // console.log(this.departUserName)
                                var activePer
                                if (actCustCount == 0 || totalCust == 0) {
                                    activePer = 0
                                } else {
                                    activePer = this.toDecimal(
                                        parseFloat(actCustCount / totalCust) * 100
                                    )
                                }

                                var cust = {
                                    actCustCount: actCustCount,
                                    activePer: activePer,
                                    totalCust: totalCust
                                }
                                this.tableArray.push(cust)
                            }

                            if (this.tableArray.length > 0) {
                                this.tableArray.reverse()
                            }

                            let option = {
                                tooltip: {
                                    trigger: 'axis',
                                    axisPointer: {
                                        type: 'shadow',
                                        shadowStyle: {
                                            color: 'rgba(150,150,150,0.05)'
                                        }
                                    }
                                },
                                legend: {
                                    /* '活跃客户', '非活跃' */
                                    data: [this.$t('mxpcweb.workbench.1530691214227'), this.$t('mxpcweb.workbench.1530702128539')],
                                    top: '3%',
                                    right: '3%',
                                    itemGap: 15,
                                    itemWidth: 10,
                                    itemHeight: 10,
                                    textStyle: {
                                        color: '#606266'
                                    }
                                },
                                grid: {
                                    top: '12%',
                                    left: '3%',
                                    right: '4%',
                                    bottom: '3%',
                                    containLabel: true,
                                    borderWidth: '0',
                                    borderColor: '#606266'
                                },

                                xAxis: {
                                    type: 'value',
                                    boundaryGap: [0, 0.01],
                                    axisLine: {
                                        lineStyle: {
                                            color: '#909399'
                                        }
                                    }
                                },
                                yAxis: {
                                    type: 'category',
                                    data: this.departUserName,
                                    axisLine: {
                                        lineStyle: {
                                            color: '#909399'
                                        }
                                    }
                                },
                                series: [
                                    {
                                        /* '活跃客户' */
                                        name: this.$t('mxpcweb.workbench.1530691214227'),
                                        type: 'bar',
                                        color: ['#FF4D3E'],
                                        data: this.activeData
                                    },
                                    {
                                        /* '非活跃' */
                                        name: this.$t('mxpcweb.workbench.1530702128539'),
                                        type: 'bar',
                                        color: ['#D6D6D6'],
                                        data: this.unactiveData
                                    }
                                ]
                            }

                            this.isNoData = false
                            this.isload = false
                            // 使用刚指定的配置项和数据显示图表。
                            customerDistrib.setOption(option)
                            return customerDistrib
                        } else {
                            _this.isNoData = true
                            _this.isload = false
                            _this.$message.error(res.data.msg)
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
        nodata: NoData
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
