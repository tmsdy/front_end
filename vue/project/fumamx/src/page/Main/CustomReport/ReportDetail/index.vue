<template>
    <div class="dialogWrap">
        <page-detail :detailTitle="subtitle" @toList="back" class="pageTitle"></page-detail>
        <div v-loading="isloading" class="tableBox">
            <div class="tableChioceBox">
                <div class="selectBox" v-if="qFilters.length > 0">
                    <el-select v-model="quickValue" placeholder="快速查询项" @change="quickSearch" clearable>
                        <el-option v-for="(item,index) in qFilters" :key="index" :label="item.cnFilterName" :value="item.qFilterId">
                        </el-option>
                    </el-select>
                </div>
                <condition-edit ref="conditionEdit" :modules="modules" style="float: left" @getFilters='getFilters' @clearQuick="clearQuick" v-show="filtersField.length > 0"></condition-edit>
                <div style="float:left" v-if="qFilters.length > 0 || filtersField.length > 0">
                    <el-button type="primary" @click="filterCondition">筛选</el-button>
                    <el-button @click="clearSelect">清空</el-button>
                </div>
                <div class="btnBox">
                    <el-button type="primary" v-show="authority.print">打印</el-button>
                    <el-dropdown @command="exportExcel">
                        <el-button type="primary" v-show="authority.export" :loading="btnLoading">
                            导出<i class="el-icon-caret-bottom el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="excel">EXCEL</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button type="primary" @click="insertOption('email')" v-show="authority.print">发送邮件</el-button>
                    <el-button type="primary" @click="openSubscribe" v-show="authority.subscribe && notProd">订阅</el-button>
                </div>
            </div>
            <div class="tablewrap MXscroll">
                <div class="tableMain">
                    <chart-box v-show="defaultData.chartType != -1 && chartFields.length > 0" :defaultData="defaultData" :chartData="chartData" ref="chartBox"></chart-box>
                    <table-data :defaultData="defaultData" :tableBody="tableBody"></table-data>
                </div>
                <div class="pagination">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="blockData.currentPage" :page-sizes="pageSizes" :page-size="blockData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="blockData.total">
                    </el-pagination>
                </div>
            </div>
            <!-- 弹出框-发送邮件-->
            <dialog-inset ref="dialogWrap"></dialog-inset>
            <!-- 弹出框-订阅-->
            <dialog-subscribe ref="dialogSubscribe" :subscriberAuthor="subscriberAuthor" :reportType="reportType"></dialog-subscribe>
        </div>
    </div>
</template>

<script>
import ConditionEdit from './ConditionEdit/index'
import PageDetail from '@/components/PageDetail/index' // 大标题
import ChartBox from './ChartBox/index'
import TableData from './TableData/index'
import DialogInset from './DialogInset/index'
import DialogSubscribe from '../components/DialogSubscribe/index'
export default {
    name: 'DialogInset',
    data() {
        return {
            btnLoading: false,
            isloading: true,
            subtitle: '新建报表',
            quickValue: '',
            defaultData: {},
            tableHeader: [],
            tableBody: {},
            // 分页操作
            blockData: {
                pageSize: 500,
                total: 0,
                currentPage: 1
            },
            pageSizes: [500, 1000, 2000],
            authority: {},
            qFilters: [],
            chartData: [],
            chartFields: [],
            crossoverData: [],
            modules: [],
            filtersOb: {},
            filtersField: [],
            arrLength: 0,
            indexId: 0,
            resultData: [],
            subscriberAuthor: {}, // 可以订阅的人或角色
            reportType: -1
        }
    },
    created() {
        let that = this
        Promise.all([this.getReportData(), this.getReportUnify(), this.getReportChart()]).then((res) => {
            that.isloading = false
            // 要把回调写在这里面
        })
        // this.getSubscriber()
    },
    computed: {
        notProd() {
            return window.runtime != 'prod'
        }
    },
    mounted() {
    },
    updated() {
        // var start = new Date()
        // console.log(start + '结束updated')
    },
    methods: {
        // 导出报表
        exportExcel(command) {
            let that = this
            var param = that.$route.query
            let dataParams = {
                reportId: param.selected,
                fileType: 'excel'
            }

            if (this.$refs.conditionEdit.collectData()) {
                if (this.quickValue != '' || this.filtersOb.hasOwnProperty('filters')) {
                    if (this.quickValue != '') {
                        dataParams.qFilterId = this.quickValue
                    } else {
                        dataParams.runFilter = JSON.stringify(this.filtersOb.filters[0])
                    }
                    this.reportExport(dataParams)
                } else {
                    this.reportExport(dataParams)
                }
            }
        },
        reportExport(data) {
            // this.btnLoading = true
            let link = 'http://120.27.196.85:8090/v1'
            let port = '/report/export'
            let params = '?'
            let accessToken = this.getToken()[this.Global.accessToken]
            for (let key in data) {
                params = params + key + '=' + data[key] + '&'
            }
            let href = link + port + params + 'accessToken' + '=' + accessToken
            this.openNewWindowTab(href)
        },
        clearQuick() {
            this.quickValue = ''
        },
        quickSearch() {
            if (this.quickValue != '') {
                this.$refs.conditionEdit.clearChildren()
            }
        },
        filterCondition() {
            let that = this
            var param = that.$route.query
            var from = (that.blockData.currentPage - 1) * that.blockData.pageSize
            let data = {
                reportId: param.selected,
                from: from,
                size: that.blockData.pageSize
            }
            // 如果没有下拉选项
            if (this.$refs.conditionEdit.collectData()) {
                this.isloading = true
                if (this.quickValue != '' || this.filtersOb.hasOwnProperty('filters')) {
                    let chartParame = {}
                    if (this.quickValue != '') {
                        data.qFilterId = this.quickValue
                        chartParame.qFilterId = this.quickValue
                    } else {
                        data.runFilter = JSON.stringify(this.filtersOb.filters[0])
                        chartParame.runFilter = JSON.stringify(this.filtersOb.filters[0])
                    }
                    this.filter(data, chartParame)
                } else {
                    Promise.all([this.getReportData(), this.getReportChart()]).then((res) => {
                        this.isloading = false
                    })
                }
            }
        },
        filter(params, chartdata) {
            let that = this
            that.$http.get(that.Global.baseURL + that.Global.api.v1.reportData, { params: params })
                .then(res => {
                    that.isloading = false
                    if (res.body.code.toString() == that.Global.RES_OK) {
                        that.tableBody = res.body.data
                        that.blockData.total = res.body.data.totalCount
                        that.getReportChart(chartdata) // 请求获取图表数据
                    } else {
                        that.$message.error(that.msg(res.body))
                    }
                },
                    res => {
                        that.isloading = false
                        that.$message.error(that.$t(that.Global.errorTitle))
                        // reject('统一数据返回失败')
                    }
                )
        },
        clearSelect() {
            this.quickValue = ''
            this.$refs.conditionEdit.clearChildren()
            this.filtersOb = {}
        },
        getFilters(n) {
            this.filtersOb = n
        },
        back() {
            let { listId } = this.$route.query
            if (listId) {
                this.$router.push('/main/customReport/list/' + listId)
            } else {
                this.$router.push('/main/customReport/list/3')
            }
        },
        handleSizeChange(val) {
            this.blockData.pageSize = val
            this.getReportData()
        },
        handleCurrentChange(val) {
            this.blockData.currentPage = val
            this.getReportData()
        },
        insertOption(x) { // 打开弹框并赋值行数据给子组件
            this.$refs.dialogWrap.open(x)
        },
        openSubscribe() { // 打开弹窗订阅邮件
            this.$refs.dialogSubscribe.open()
        },
        // 获取可订阅报表的人员
        getSubscriber() {
            let that = this
            return new Promise(function (resolve, reject) {
                var param = that.$route.query
                let data = {
                    reportId: param.selected
                }
                that.$http.get(that.Global.baseURL + that.Global.api.v1.subscriber, { params: data })
                    .then(res => {
                        if (res.body.code.toString() == that.Global.RES_OK) {
                            that.subscriberAuthor = res.body.data
                        } else {
                            that.$message.error(that.msg(res.body))
                        }
                        resolve(res.body.data)
                    },
                        res => {
                            // that.isloading = false
                            that.$message.error(that.$t(that.Global.errorTitle))
                            // reject('统一数据返回失败')
                        }
                    )
            })
        },
        // 报表统一数据
        getReportUnify() {
            let that = this
            return new Promise(function (resolve, reject) {
                var param = that.$route.query
                let data = {
                    reportId: param.selected
                }
                that.$http.get(that.Global.baseURL + that.Global.api.v1.reportUnify, { params: data })
                    .then(res => {
                        if (res.body.code.toString() == that.Global.RES_OK) {
                            that.defaultData = res.body.data
                            that.tableHeader = that.defaultData.fields
                            that.authority = that.defaultData.authority
                            that.qFilters = that.defaultData.qFilters
                            that.chartFields = that.defaultData.chartFields
                            that.reportType = res.body.data.reportType // 报表类型
                            let module = {}
                            that.filtersField = that.defaultData.filters.field
                            module.field = that.defaultData.filters.field
                            module.moduleName = '请选择'
                            that.modules = [module]
                            if (that.qFilters.length > 0) {
                                let defaultValue = that.qFilters.filter(item => item.isDefault == 0) // 筛选出快速筛选条件默认值
                                if (defaultValue[0]) {
                                    that.value = defaultValue[0].cnFilterName
                                }
                            }
                            if (that.authority.subscribe) { // 如果有订阅权限，获取可用人员角色
                                that.getSubscriber()
                            }
                        } else {
                            that.$message.error(that.msg(res.body))
                        }
                        resolve(res.body.data)
                    },
                        res => {
                            // that.isloading = false
                            that.$message.error(that.$t(that.Global.errorTitle))
                            // reject('统一数据返回失败')
                        }
                    )
            })
        },
        getReportData() {
            let that = this
            return new Promise(function (resolve, reject) {
                var param = that.$route.query
                var from = (that.blockData.currentPage - 1) * that.blockData.pageSize
                let data = {
                    reportId: param.selected,
                    from: from,
                    size: that.blockData.pageSize
                }
                that.$http.get(that.Global.baseURL + that.Global.api.v1.reportData, { params: data })
                    .then(res => {
                        // that.isloading = false
                        if (res.body.code.toString() == that.Global.RES_OK) {
                            let tableBody
                            tableBody = res.body.data
                            that.resultData = JSON.parse(JSON.stringify(tableBody.resultData))
                            // delete tableBody.resultData
                            that.tableBody = res.body.data
                            // that.tableBody.resultData = []
                            that.blockData.total = res.body.data.totalCount
                            // that.arrLength = Math.ceil(that.resultData.length / 50)
                            // that.indexId = 0
                            // that.settime()
                            // var start = new Date()
                            // console.log(start + '开始')
                            // console.log(resultData)
                            // console.log(that.tableBody.resultData)
                        } else {
                            that.$message.error(that.msg(res.body))
                        }
                        resolve(res.body.data)
                    },
                        res => {
                            // that.isloading = false
                            that.$message.error(that.$t(that.Global.errorTitle))
                            // reject('统一数据返回失败')
                        }
                    )
            })
        },
        settime() {
            if (this.indexId < this.arrLength) {
                let arr = this.resultData.splice(this.indexId * 100, (this.indexId + 1) * 100)
                this.tableBody.resultData.push(...arr)
                this.indexId++
                setTimeout(() => {
                    this.settime()
                }, 100)
            }
        },
        getReportChart(x) {
            let that = this
            return new Promise(function (resolve, reject) {
                let param = that.$route.query
                let data = {
                    reportId: param.selected
                }
                // 筛选条件时传入参数
                if (x != undefined) {
                    data = Object.assign(data, x)
                }
                that.$http.get(that.Global.baseURL + that.Global.api.v1.reportChart, { params: data })
                    .then(res => {
                        // that.isloading = false
                        if (res.body.code.toString() == that.Global.RES_OK) {
                            that.chartData = res.body.data.chartData
                        } else {
                            that.$message.error(that.msg(res.body))
                        }
                        resolve(res.body.data)
                    },
                        res => {
                            // that.isloading = false
                            that.$message.error(that.$t(that.Global.errorTitle))
                            // reject('统一数据返回失败')
                        }
                    )
            })
        }
    },
    components: {
        'page-detail': PageDetail,
        'chart-box': ChartBox,
        'table-data': TableData,
        'dialog-inset': DialogInset,
        'dialog-subscribe': DialogSubscribe,
        'condition-edit': ConditionEdit
    },
    beforeRouteLeave(to, from, next) {
        // 销毁echarts
        if (this.defaultData.chartType != -1) {
            //  this.$refs.chartBox.destroy()
        }
        next()
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
