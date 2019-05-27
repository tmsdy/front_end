<template>
    <div class="tableRowClassName TrackingProcedureTemplate" v-loading="loading">
        <template>
            <page-title title="跟单流程模板" iconfont="icon-share-set"></page-title>
            <div class="boxHeader clearfix">
                <el-input v-model="search" placeholder="输入跟进模板名称"></el-input>
                <el-button type="primary" @click="searchList">搜索</el-button>
                <el-button type="primary" @click="addTracking" class="left">新增跟单流程</el-button>
            </div>
            <div class="customerTables MXscroll" ref="customerTables" v-loading='loading' :class="{ scrollHidden: loading}">
                <div class="customerTable">
                    <item-procedure :dataList="dataList" @editItem="editItem" @getListData="getOrderTemplate" v-if="dataList.length>0"></item-procedure>
                    <no-data v-else style="padding-top:10px;"></no-data>
                </div>
            </div>
            <list-page v-show="controlData.checkedCities.length==0" ref="listPage" style="text-align:center;" :moduleCode="moduleCode" :blockData="blockData" @getListData="getOrderTemplate"></list-page>
            <add-tracking ref="addtracking" v-if="openDialog" @changeOpenDialog="openDialog = !openDialog" @getOrderList="getOrderTemplate"></add-tracking>
        </template>
    </div>
</template>
<script>
import AddTracking from './components/AddTracking/index'
import PageTitle from '@/components/PageTitle/index'
import listPage from '@/components/listPage/index'
import NoData from '@/basecomponents/NoData/index'
import ItemProcedure from './ItemProcedure/index'
export default {
    name: 'TrackingProcedureTemplate',
    data() {
        return {
            search: '',
            loading: false,
            // 分页操作
            blockData: {
                pageSize: 20,
                total: 0,
                fromNum: 0
            },
            controlData: {
                checkedCities: []
            },
            moduleCode: '',
            openDialog: false,
            dataList: []
        }
    },
    created() {
        this.getOrderTemplate()
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        editItem(n) {
            this.openDialog = true
            this.$nextTick(() => {
                this.$refs.addtracking.showDialog()
                this.$refs.addtracking.getOrderNode().then(() => {
                    this.$refs.addtracking.edit(n)
                })
            })
        },
        addTracking() {
            this.openDialog = true
            // this.editDialog = {}
            this.$nextTick(() => {
                this.$refs.addtracking.showDialog()
                this.$refs.addtracking.getOrderNode()
                this.$refs.addtracking.clear()
            })
            // this.$refs.addtracking.getpersonOption()
        },
        getOrderTemplate() {
            this.loading = true
            let data = {
                type: 'list',
                pageSize: this.blockData.pageSize,
                pageN: (this.blockData.fromNum / this.blockData.pageSize) + 1
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v2.orderTemplate, { params: data })
                .then(res => {
                    this.loading = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.dataList = res.body.data.list
                        if (this.dataList.length > 0) {
                            this.dataList.map(item => {
                                if (item.queueFlag == 1) {
                                    item.queueFlag = true
                                } else if (item.queueFlag == 0) {
                                    item.queueFlag = false
                                }
                            })
                        }
                        this.blockData.total = res.body.data.totalNums
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        searchList() {
            this.loading = true
            let data = {
                type: 'search',
                templateName: this.search,
                pageSize: this.blockData.pageSize,
                pageN: (this.blockData.fromNum / this.blockData.pageSize) + 1
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v2.orderTemplate, { params: data })
                .then(res => {
                    this.loading = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.dataList = res.body.data.list
                        if (this.dataList.length > 0) {
                            this.dataList.map(item => {
                                if (item.queueFlag == 1) {
                                    item.queueFlag = true
                                } else if (item.queueFlag == 0) {
                                    item.queueFlag = false
                                }
                            })
                        }
                        this.blockData.total = res.body.data.totalNums
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        }
    },
    watch: {
        // 路由变化时
        // $route(to, from) {
        //     if (this.$route.path.indexOf('/main/customReport/list') >= 0) {
        //         this.getOrderTemplate()
        //     }
        // }
    },
    components: {
        'page-title': PageTitle,
        'list-page': listPage,
        'no-data': NoData,
        'item-procedure': ItemProcedure,
        'add-tracking': AddTracking
    }
    // beforeDestroy: function () {
    //     // this.tableData = null
    //     this.hasScrollbar = null
    //     // this.showDialog = null
    //     this.switchList = null
    //     this.getListData = null
    //     this.listaddTab = null
    // }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
// @import "../zh-cn.less";
// @import "../en.less";
@import "./zh-cn.less";
@import "./en.less";
</style>
