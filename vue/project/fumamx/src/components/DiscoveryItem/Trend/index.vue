
/*
 * Discription:采购趋势
 * -----
 * Created Date: 2019-3-26 07:13:22
 * Author: 郭兵 (guobing93@163.com)
 * -----
 * Last Modified: 2019-05-17 02:13:59
 * Modified By: name (email)
 */

<template>
    <div class="PurchaseTrend">
        <div class="navTitle clearfix">
            {{inout=='imp'?'采购趋势':'出口趋势'}}
            <div v-if="isRelink" class="pull-right">
                <span class="hintText">海关数据不准确？</span>
                <el-button @click="$emit('relink')" type="primary" class="btnItem">重新匹配</el-button>
            </div>
        </div>
        <ul class="TrendList clearfix">
            <li class="trendItem">
                <i class="Max iconBox iconfont icon-industry"></i>
                <p class="content ellipsis">{{maxCompany||'-'}}</p>
                <span class="label">{{inout=='imp'?'最大供应商':'最大采购商'}}</span>
            </li>
            <li class="trendItem">
                <i class="Money iconBox iconfont icon-money"></i>
                <p class="content ellipsis">{{inOutMoney?`$${inOutMoney}M`:'0'}}</p>
                <span class="label">{{inout=='imp'?'进口金额':'出口金额'}}(美金)</span>
            </li>
            <li class="trendItem">
                <i class="Count iconBox iconfont icon-count"></i>
                <p class="content ellipsis">{{inOutCount||'0'}}</p>
                <span class="label">{{inout=='imp'?'进口次数':'出口次数'}}</span>
            </li>
            <li class="trendItem">
                <i class="Time iconBox iconfont icon-time"></i>
                <p class="content ellipsis ">{{LastInOutDate||'-'}}</p>
                <span class="label">{{inout=='imp'?'最后进口时间':'最后出口时间'}}</span>
            </li>
        </ul>
        <div class="ChartBox">
            <p class="clearfix">
                <!--  <el-select class="select pull-right" v-model="dateType" @change="handleDateTypeChange()" value-key="label" placeholder="请选择">
                    <el-option v-for="(item, index) in dateOptions" :key="index" :label="item.label" :value="item">
                    </el-option>
                </el-select> -->
            </p>
            <div v-show="!isLoading" class="ShowBox" ref="EchartShowBox"></div>
            <div v-if="isLoading" class="noDataBox">
                <loading class="atCenter"></loading>
            </div>
            <!-- !isLoading&&dataList.length<=0 -->
            <div v-if="false" class="noDataBox">
                <no-data class="atCenter"></no-data>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import NoData from '@/basecomponents/NoData'
import Loading from '@/basecomponents/Loading'
export default {
    name: 'Trend',
    props: {
        inout: { type: String, default: 'imp' },
        scomid: { type: String, default: '' },
        country: { type: String, default: '' },
        dateType: { type: Object, default: () => ({}) },
        isRelink: { type: Boolean, default: false }
    },
    data() {
        return {
            myChart: null,
            isLoading: false,
            dataList: Object.freeze([]),
            maxCompany: '',
            inOutCount: 0,
            inOutMoney: '--',
            LastInOutDate: '--'
        }
    },
    created() { },
    mounted() {
        this.myChart = echarts.init(this.$refs.EchartShowBox)
        this.getData()
        window.addEventListener('resize', this.resize)
    },
    beforeDestroy() {
        this.myChart && this.myChart.dispose()
        this.myChart = null
        window.removeEventListener('resize', this.resize)
    },
    methods: {
        resize() {
            this.myChart && this.myChart.resize()
        },
        initCharts(xAxisData, CountData, MoneyData) {
            const yAxisName01 = this.inout == 'imp' ? '进口金额（美元）' : '出口金额（美元）'
            const yAxisName02 = this.inout == 'imp' ? '进口次数' : '出口次数'
            const options = {
                grid: {
                    left: 10,
                    right: 10,
                    bottom: 20,
                    containLabel: true
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    },
                    formatter: '{a0}: ${c0}M <br/> {a1}: {c1}次'
                },
                legend: {
                    data: [yAxisName01, yAxisName02]
                },
                color: ['#FF7A6D', '#2DAEFF', '#61D9AC'],
                xAxis: [
                    {
                        type: 'category',
                        data: xAxisData,
                        axisPointer: {
                            type: 'shadow'
                        },
                        nameTextStyle: {
                            color: '#909399'
                        },
                        axisLine: {
                            lineStyle: { color: '#909399' }
                        },
                        axisTick: {
                            show: false
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: yAxisName01,
                        // min: 0,
                        // max: 100000000,
                        // interval: 20000000,
                        axisLabel: {
                            formatter: '${value}M'
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: { color: '#909399' }
                        },
                        splitLine: {
                            show: false
                        },
                        nameTextStyle: {
                            color: '#222'
                        }
                    },
                    {
                        type: 'value',
                        name: yAxisName02,
                        // min: 0,
                        // max: 2000,
                        // interval: 200,
                        axisLabel: {
                            formatter: '{value}'
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: { color: '#909399' }
                        },
                        splitLine: {
                            show: false
                        },
                        nameTextStyle: {
                            color: '#222'
                        }
                    }
                ],
                series: [
                    {
                        name: yAxisName01,
                        type: 'line',
                        //  itemStyle: { normal: { color: '#FF7A6D' } },
                        data: MoneyData
                    },
                    {
                        name: yAxisName02,
                        type: 'line',
                        // itemStyle: { normal: { color: '#FEBE2B' } },
                        yAxisIndex: 1,
                        data: CountData
                    }
                ]
            }

            this.myChart && this.myChart.setOption(options)
        },
        getXAxisData() {
            let btime = new Date(this.dateType.bdate.replace(/-/g, '/'))
            let etime = new Date(this.dateType.edate.replace(/-/g, '/'))
            let bYear = btime.getFullYear()
            let bMonth = btime.getMonth() + 1
            let eYear = etime.getFullYear()
            return {
                m: getFYMobj(bYear, bMonth, eYear),
                ym: getFYMobj(bYear, bMonth, eYear, true)
            }

            function getFYMobj(bY, bM = 1, eY, isYM = false) {
                let arr = []
                let len = (eY - bY) <= 0 ? 12 : (eY - bY) * 12
                for (let index = 0; index < len; index++) {
                    let temp = bM + index
                    let m = temp % 12 == 0 ? 12 : temp % 12
                    let y = bY + parseInt(temp / 12)
                    let mm = m < 10 ? '0' + m : m
                    let item = isYM ? `${y}-${mm}` : `${m}月`
                    arr.push(item)
                }
                return arr
            }
        },
        handleDateTypeChange() {
            this.getData()
        },
        async getData() {
            this.isLoading = true
            this.maxCompany = '-'
            this.inOutCount = 0
            this.inOutMoney = 0
            this.LastInOutDate = '-'

            let dataList = []
            let LastInOutDate = '-'
            try {
                const url = this.Global.baseURL + this.Global.api.v2.find_customsTrading
                let data = {
                    inout: this.inout,
                    scomid: this.scomid,
                    bdate: this.dateType.bdate,
                    edate: this.dateType.edate,
                    country: this.country
                }
                let res = await this.$http.post(url, data)
                if (res.body.code.toString() == this.Global.RES_OK) {
                    LastInOutDate = res.body.data.lastInOutDate
                    dataList = res.body.data.row || []
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.dataList = Object.freeze(dataList)
            this.LastInOutDate = LastInOutDate
            this.isLoading = false
            let { xAxisData, CountData, MoneyData } = this._calcData()
            this.initCharts(xAxisData, CountData, MoneyData)
        },
        _calcData() {
            let Count = 0
            let Money = 0
            let companyMap = {}
            let moneyMap = {}
            let countMap = {}
            this.dataList.forEach((item, index) => {
                let mMoney = parseFloat((item.money / 1000000).toFixed(2))

                Count += item.count
                Money += mMoney

                let { companyName: key01, month: key02 } = item
                if (key01) {
                    if (companyMap[key01]) {
                        companyMap[key01] = parseFloat((companyMap[key01] + mMoney).toFixed(2))
                    } else {
                        companyMap[key01] = mMoney
                    }
                }
                if (key02) {
                    let mKey = this.$moment(key02.replace(/-/g, '/'), 'YYYY/MM/DD').format('YYYY-MM')

                    if (moneyMap[mKey]) {
                        moneyMap[mKey] = parseFloat((moneyMap[mKey] + mMoney).toFixed(2))
                    } else {
                        moneyMap[mKey] = mMoney
                    }

                    if (countMap[mKey]) {
                        countMap[mKey] = countMap[mKey] + parseInt(item.count)
                    } else {
                        countMap[mKey] = parseInt(item.count)
                    }
                }
            })
            let keys = Object.keys(companyMap)
            let maxKey
            if (keys.length > 0) {
                maxKey = keys[0]
                for (let index = 0; index < keys.length; index++) {
                    let key = keys[index]
                    if (companyMap[key] >= companyMap[maxKey]) {
                        maxKey = key
                    }
                }
            }
            this.maxCompany = maxKey
            this.inOutCount = Count
            this.inOutMoney = Money.toFixed(2)

            let { m, ym } = this.getXAxisData()
            let CountData = []
            let MoneyData = []

            ym.forEach((key, index) => {
                CountData.push(countMap[key] || 0)
                MoneyData.push(moneyMap[key] || 0)
            })

            return { xAxisData: m, CountData, MoneyData }
        }

    },
    watch: {
        scomid() {
            if (this.scomid) {
                this.getData()
            }
        },
        dateType() {
            this.getData()
        }
    },
    components: {
        'no-data': NoData,
        'loading': Loading
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "../common.less";
@import "./en.less";
@import "./zh-cn.less";
</style>
