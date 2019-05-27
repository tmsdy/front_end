/*
 * Discription: 采购供应 商品
 * -----
 * Created Date: Wednesday, 27th March 2019 2:37:46 pm
 * Author: 郭兵 (guobing93@163.com)
 * -----
 * Last Modified: Wednesday, 27th March 2019 2:40:21 pm
 * Modified By: name (email)
 */
<template>
    <div class="Commodity">
        <p class="navTitle">{{inout=='imp'?'采购商品':'出口产品分布'}}</p>
        <div class="clearfix topBar">
            <p class="topOne pull-left ellipsis">{{inout=='imp'?'主要进口产品':'主要出口产品'}} <span class="name">{{top10Data[0]&&top10Data[0]['desc']}}</span></p>
            <span class="centerText">{{inout=='imp'?'Top10 采购商品分布图':'Top10 出口商品分布图'}}</span>
            <!--  <el-select class="select pull-right" v-model="dateType" value-key="label" @change="handleDateTypeChange()" placeholder="请选择">
                <el-option v-for="(item ,index) in dateOptions" :key="index" :label="item.label" :value="item">
                </el-option>
            </el-select> -->
        </div>
        <div v-show="!isLoading" class="ChartShow" ref="EchartShowBox"></div>
        <div v-if="isLoading" class="noDataBox">
            <loading class="atCenter"></loading>
        </div>
        <el-table v-show="!isLoading" class="TableBox" :data="listData" border style="width: 100%">
            <el-table-column prop="hsCode" header-align="center" align="center" label-class-name="customs-data-hItem" label="HS Code" width="140">
            </el-table-column>
            <el-table-column label-class-name="customs-data-hItem" header-align="center" prop="desc" label="产品描述">
            </el-table-column>
            <el-table-column label-class-name="customs-data-hItem" header-align="center" align="center" prop="count" label="交易次数" width="90">
            </el-table-column>
            <el-table-column label-class-name="customs-data-hItem" header-align="center" align="center" prop="money" label="交易金额" width="120">
                <template slot-scope="scope">{{getMillMoney(scope.row.money)}} </template>
            </el-table-column>
            <el-table-column label-class-name="customs-data-hItem" header-align="center" align="center" label="占比" width="80">
                <template slot-scope="scope">
                    {{`${AllMoney==0?0:((scope.row.money/AllMoney)*100).toFixed(2)}%`}}
                </template>
            </el-table-column>
        </el-table>
        <div class="page" v-if="page.total>page.size">
            <el-pagination @current-change="handlePageChange" layout="total,prev, pager, next" :page-size="page.size" :current-page="page.now" :total="page.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import Loading from '@/basecomponents/Loading'
export default {
    name: 'Commodity',
    props: {
        inout: {
            type: String,
            default: 'imp'
        },
        scomid: {
            type: String,
            default: ''
        },
        country: { type: String, default: '' },
        dateType: { type: Object, default: () => ({}) }
        /* dateOptions: { type: Array, default: () => [] } */
    },
    data() {
        return {
            isLoading: false,
            /* dateType: '', */
            AllMoney: 0,
            myChart: null,
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
                ldata.push(item.desc)
                let money = parseInt(item.money)
                data.push({ value: money, name: item.desc })
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
                        return `${name} <br/>$${mVal}M (${percent}%)`
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
        /*  handleDateTypeChange() {
             this.page.now = 1
             this.getData()
         }, */
        handlePageChange(i) {
            this.page.now = i
            this.getData()
        },
        async getData(isInit = false) {
            if (isInit) {
                this.top10Data = Object.freeze([])
                this.isLoading = true
            }
            let AllCount = 0
            let Row = []
            let AllMoney = 0
            try {
                const url = this.Global.baseURL + this.Global.api.v2.find_customsTrading
                let data = {
                    bdate: this.dateType.bdate,
                    edate: this.dateType.edate,
                    scomid: this.scomid,
                    inout: this.inout,
                    country: this.country,
                    pageindex: this.page.now,
                    pagesize: this.page.size
                }
                let res = await this.$http.put(url, data)
                if (res.body.code.toString() === this.Global.RES_OK) {
                    let { allCount, row, allMoney } = res.body.data
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
.Commodity {
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
