/*
 * Discription: 供应商，采购商
 * -----
 * Created Date: 2019-04-04 06:03:45
 * Author: 郭兵 (guobing93@163.com)
 * -----
 * Last Modified: 2019-04-30 10:54:50
 * Modified By: name (email)
 */

<template>
    <div class="Merchant">
        <p class="navTitle">{{inout=='imp'?'供应商':'采购商'}}</p>
        <div class="clearfix topBar">
            <p class="topOne pull-left ellipsis">{{inout=='imp'?'最大供应商':'最大采购商'}} <span class="name clickLink">{{(top10Data[0]&&top10Data[0]['companyName'])||'-'}}</span></p>
            <span class="centerText">{{inout=='imp'?'Top10 供应商分布图':'Top10 采购商分布图'}}</span>
        </div>

        <div v-show="!isLoading" class="ChartShow" ref="EchartShowBox"></div>
        <div v-if="isLoading" class="noDataBox">
            <loading class="atCenter"></loading>
        </div>
        <el-table v-show="!isLoading" class="TableBox" :data="listData" border style="width: 100%">
            <el-table-column label-class-name="customs-data-hItem" header-align="center" align="center" prop="companyName" :label="inout=='imp'?'供应商':'采购商'">
                <template slot-scope="scope">
                    <div class="clickLink" @click="handleOpenCompany(scope.row)">{{scope.row.companyName}}</div>
                </template>
            </el-table-column>
            <el-table-column label-class-name="customs-data-hItem" header-align="center" align="center" prop="countryEn" label="国家">
            </el-table-column>
            <el-table-column label-class-name="customs-data-hItem" header-align="center" align="center" prop="count" label="交易次数" width="120">
            </el-table-column>
            <el-table-column label-class-name="customs-data-hItem" header-align="center" align="center" label="交易金额(美元)" width="160">
                <template slot-scope="scope">{{getMillMoney(scope.row.money)}} </template>
            </el-table-column>
            <el-table-column label-class-name="customs-data-hItem" header-align="center" align="center" label="占比" width="100">
                <template slot-scope="scope">{{`${AllMoney==0?0:((scope.row.money/AllMoney)*100).toFixed(2)}%`}}</template>
            </el-table-column>
        </el-table>
        <div class="page" v-if="page.total>page.size">
            <el-pagination @current-change="handlePageChange" small layout="total,prev, pager, next" :page-size="page.size" :current-page="page.now" :total="page.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import Loading from '@/basecomponents/Loading'
export default {
    name: 'Merchant',
    props: {
        inout: { type: String, default: 'imp' },
        scomid: { type: String, default: '' },
        country: { type: String, default: '' },
        dateType: { type: Object, default: () => ({}) }
        /*  dateOptions: { type: Array, default: () => [] } */
    },
    data() {
        return {
            isLoading: false,
            /*   dateType: '', */
            myChart: null,
            AllMoney: 0,
            top10Data: Object.freeze([]),
            listData: Object.freeze([]),
            page: {
                now: 1,
                size: 10,
                total: 0
            }
        }
    },
    created() {
        /*  this.dateType = this.dateOptions[0] */
    },
    mounted() {
        this.myChart = echarts.init(this.$refs.EchartShowBox)
        this.getData(true)
        window.addEventListener('resize', this.resize)
    },
    beforeDestroy() {
        this.myChart && this.myChart.dispose()
        this.myChart = null
        window.removeEventListener('resize', this.resize)
    },
    methods: {
        getMillMoney(m) {
            if (!m) {
                return 0
            }
            return `$${(m / 1000000).toFixed(2)}M`
        },
        resize() {
            this.myChart && this.myChart.resize()
        },
        setOption() {
            let ldata = []
            let data = []
            let top10Money = 0
            for (let index = 0; index < this.top10Data.length; index++) {
                const item = this.top10Data[index]
                ldata.push(item.companyName)
                let money = parseInt(item.money)
                data.push({ value: money, name: item.companyName })
                top10Money += money
            }
            ldata.push('其他')
            data.push({ value: this.AllMoney - top10Money, name: '其他' })
            const options = {
                grid: {
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    containLabel: true
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        let { name, value, percent } = params
                        let mVal = parseFloat((value / 1000000).toFixed(2))
                        return `${name} <br/> $${mVal}M (${percent}%)`
                    }
                },
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    y: 'center',
                    left: '70%',
                    itemWidth: 10,
                    itemHeight: 20,
                    padding: [0, 10, 0, 0],
                    inactiveColor: '#C0C4CC',
                    data: ldata
                },
                color: ['#47D83F', '#f8ba3e', '#58cfe2', '#d0d064', '#f69b94', '#9B80F2', '#BFBF17'],
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: ['80', '180'],
                        center: ['35%', '50%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: true,
                                position: 'inside',
                                formatter: '{d}%'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: data
                    }
                ]
            }
            this.myChart && this.myChart.setOption(options)
        },
        handleOpenCompany(company) {
            if (!company.companyName || company.companyName == '-') {
                return
            }
            this.$emit('openCompany', company)
        },
        handlePageChange(i) {
            this.page.now = i
            this.getData()
        },
        async getData(isInit = false) {
            if (isInit) {
                this.isLoading = true
                this.top10Data = Object.freeze([])
            }
            let AllCount = 0
            let Row = []
            let AllMoney = 0
            try {
                const url = this.Global.baseURL + this.Global.api.v2.find_customsCommerce
                let data = {
                    bdate: this.dateType.bdate,
                    edate: this.dateType.edate,
                    scomid: this.scomid,
                    inout: this.inout,
                    country: this.country,
                    pageindex: this.page.now,
                    pagesize: this.page.size
                }
                let res = await this.$http.post(url, data)
                if (res.body.code.toString() === this.Global.RES_OK) {
                    let { allCount, allMoney, row } = res.body.data
                    AllMoney = allMoney || 0
                    AllCount = allCount || 0
                    Row = row || []
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.AllMoney = AllMoney
            this.page.total = AllCount
            this.listData = Object.freeze(Row)
            if (isInit) {
                this.isLoading = false
                this.top10Data = Row
                this.setOption()
            }
        }
    },
    watch: {
        scomid() {
            if (this.scomid) {
                this.page.now = 1
                this.getData(true)
            }
        },
        dateType() {
            this.page.now = 1
            this.getData(true)
        }
    },
    components: {
        'loading': Loading
    }
}
</script>
<style lang="less">
.Merchant {
    .TableBox {
        .customs-data-hItem {
            font-size: 12px;
            color: #606266;
            background-color: #f7f8f9;
        }
    }
}
</style>
<style lang='less' rel='stylesheet/less' scoped>
@import "../common.less";
@import "./zh-cn.less";
@import "./en.less";
</style>
