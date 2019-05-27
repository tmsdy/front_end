<template>
    <div class="tableRowClassName">
        <template>
            <page-title title="自定义报表" iconfont="icon-share-set"></page-title>
            <div class="boxHeader">
                <el-input placeholder="报表名称" icon="search" v-model="search" :on-icon-click="handleIconClick" @keyup.enter.native="searchEnterFun"></el-input>
                <el-button type="primary" @click="addReport">新建报表</el-button>
            </div>
            <div class="boxList">
                <el-row :gutter="20">
                    <el-col :span="5">
                        报表名称
                    </el-col>
                    <el-col :span="6">
                        报表描述
                    </el-col>
                    <el-col :span="5">
                        所属分类
                    </el-col>
                    <el-col :span="4">
                        创建者
                    </el-col>
                    <el-col :span="4">
                        报表类型
                    </el-col>
                </el-row>
                <div class="posRight">
                    上次查看时间
                </div>
            </div>
            <!-- loading?classA:classB -->
            <div class="customerTables MXscroll" ref="customerTables" v-loading='loading' :class="{ scrollHidden: loading}">
                <div class="customerTable">
                    <no-data v-show="listData.length==0"></no-data>
                    <el-checkbox-group v-model="controlData.checkedCities" @change="handleCheckedCitiesChange">
                        <ul class="customerList" v-show="listData!=0">
                            <li v-for="(item,index) in listData" :key="index">
                                <div :class="[controlData.checkedCities.length==0 ? 'listCheckNone' : 'listChecks']">
                                    <!-- :label="list[moduleStruct.identField]"  -->
                                    <el-checkbox size="small" :label="item.reportFolderId+'_'+item.reportId">&nbsp;</el-checkbox>
                                </div>
                                <el-row :gutter="20" class="customerInfo">
                                    <el-col :span="5" style="cursor: pointer;">
                                        <span @click="enterReport(item.reportId)">{{(item.name) ? item.name:'&nbsp;'}}</span>
                                    </el-col>
                                    <el-col :span="6">
                                        <span class="hidden">{{item.describe || '&nbsp;'}}</span>
                                    </el-col>
                                    <el-col :span="5">
                                        {{item.reportFolder|| '&nbsp;'}}
                                    </el-col>
                                    <el-col :span="4">
                                        {{item.creator|| '&nbsp;'}}
                                    </el-col>
                                    <el-col :span="4">
                                        {{item.reportType|| '&nbsp;'}}
                                    </el-col>
                                </el-row>
                                <div class="listTimes3">
                                    <!-- useType="customer" :moduleCode="moduleCode" :moduleStructName="moduleStruct.titleField" :moduleStructId="moduleStruct.identField" @getListData="getListData" :detailOptData="detailOpt" -->
                                    <detail-opt :detailOptData="detailOpt" :itemData="item" @iconLoading="iconLoading" @getListReport="getReportData"></detail-opt>
                                </div>
                                <div class="listTimes1 ellipsis">
                                    {{item.lastViewTime}}
                                    <!-- <component v-bind:is="'control24'" ref="control" :value="{value:list.ownerCtId}"></component> -->
                                </div>
                                <!-- 标记收藏 -->
                                <span v-if="item.collect" class="starBox">
                                    <i class="iconfont icon-star-card"></i>
                                </span>
                            </li>
                        </ul>
                    </el-checkbox-group>
                </div>
            </div>
            <!--footer-->
            <!--  @getListData="getListDatas" :listOpt="listOpt" :naxtArgument="naxtArgument" :customerLists="customerLists" :controlData="controlData" iseType="通用" @getListSet="getListSet" -->
            <foot-control ref="footControl" :moduleCode="moduleCode" :moduleStruct="moduleStruct" :listOpt="listOpt" :customerLists="customerLists" :controlData="controlData" @getListReport="getReportData" @clearChecked="clearChecked"></foot-control>
            <!--分页 :blockData="blockData" @getListData="getListData2"-->
            <list-page v-show="controlData.checkedCities.length==0" ref="listPage" style="text-align:center;background:#f7f8f9" :moduleCode="moduleCode" :blockData="blockData" @getListData="getReportData"></list-page>
        </template>
    </div>
</template>
<script>
import PageTitle from '@/components/PageTitle/index'
import detailOpt from '../../components/detailOpt/index'
import footControl from '../../components/footControl/index'
import ListShow from '@/components/ListShowControls/index.js'
import listPage from '@/components/listPage/index'
import NoData from '@/basecomponents/NoData/index'
export default {
    name: 'currency',
    props: {
        // listOpt: {// 批量操作
        //     ay,
        //     default: function() {
        //         return []
        //     }
        // },
        listSet: {
            type: Object,
            default: function () {
                return {}
            }
        },
        // controlData: {
        //     type: Object,
        //     default: function () {
        //         return {
        //             checkedCities: []
        //         }
        //     }
        // },
        detailOpt: {
            type: Array,
            default: function () {
                return [
                    {
                        iconURI: 'icon-star',
                        optCode: 'otFocus',
                        optModuleCode: 'BF004',
                        optName: '收藏'
                    },
                    {
                        iconURI: 'icon-edit',
                        optCode: 'otEdit',
                        optModuleCode: 'BF004',
                        optName: '修改'
                    },
                    {
                        iconURI: 'icon-del',
                        optCode: 'otDelete',
                        optModuleCode: 'BF004',
                        optName: '放入回收站'
                    },
                    {
                        iconURI: 'icon-tag',
                        optCode: 'otTag',
                        optModuleCode: 'BF004',
                        optName: '标签'
                    }
                ]
            }
        },

        fastOpt: {// 获取空间操作按钮列表
            type: Array,
            default: function () {
                return []
            }
        },
        moduleStruct: {
            type: Object,
            default: function () {
                return {}
            }
        },
        moduleCode: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            hasScrollbarValue: true,
            search: '',
            loading: false,
            listData: [],
            // 分页操作
            blockData: {
                pageSize: 20,
                total: 0,
                fromNum: 0
            },
            controlData: {
                checkedCities: [],
                checkAll: false, // 列表全选状态弹框
                isIndeterminate: false//
            },
            customerLists: [], // 留给多选框备份数据列表数据
            // 批量操作按钮
            listOpt: [
                {
                    iconURI: 'icon-del',
                    optCode: 'otDelete',
                    optModuleCode: 'BF004',
                    optName: '放入回收站'
                },
                {
                    iconURI: 'icon-star',
                    optCode: 'otFocus',
                    optModuleCode: 'BF004',
                    optName: '批量收藏'
                }
            ]
        }
    },
    created() {
        this.getReportData()
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        clearChecked() {
            this.controlData.checkedCities = []
        },
        iconLoading(n) {
            this.loading = n
        },
        enterReport(val) {
            let { id } = this.$route.params
            this.$router.push({ path: '/main/customReport/reportdetail', query: { selected: val, listId: id } })
        },
        // 获取列表数据
        getReportData() {
            this.loading = true
            let { id } = this.$route.params
            let data = {
                folderId: id,
                from: this.blockData.fromNum,
                size: this.blockData.pageSize
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v1.reportList, { params: data })
                .then(res => {
                    this.loading = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        // this.menuNavList = res.body.data.packageList
                        if (res.body.data.reportList) {
                            this.listData = res.body.data.reportList
                            this.customerLists = res.body.data.reportList
                            this.blockData.total = res.body.data.totalCount
                        }
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        addReport() {
            this.$router.push('/main/customReport/create/')
        },
        // 单选触发事件
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length
            this.controlData.checkAll = checkedCount === this.customerLists.length// 选中的个数是否等于总个数
            this.controlData.isIndeterminate = checkedCount > 0 && checkedCount < this.customerLists.length
        },
        hasScrollbar() {
            let _this = this
            let time = setTimeout(function () {
                let thisDom = _this.$refs.customerTables
                if (thisDom) {
                    _this.hasScrollbarValue = thisDom.scrollHeight > thisDom.clientHeight
                } else {
                    _this.hasScrollbarValue = false
                }
                window.clearTimeout(time)
            }, 5)
        },
        handleIconClick() { // 模糊搜索
            if (this.search) {
                this.searchList()
            } else {
                this.getReportData()
            }
        },
        searchList() {
            this.loading = true
            let { id } = this.$route.params
            let data = {
                reportName: this.search,
                folderId: id,
                from: this.blockData.fromNum,
                size: this.blockData.pageSize
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v1.fuzzySearch, { params: data })
                .then(res => {
                    this.loading = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        // this.menuNavList = res.body.data.packageList
                        if (res.body.data.reportList) {
                            this.listData = res.body.data.reportList
                            this.customerLists = res.body.data.reportList
                            this.blockData.total = res.body.data.totalCount
                        }
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        searchEnterFun(e) {
            var keyCode = window.event ? e.keyCode : e.which
            if (keyCode) {
                this.handleIconClick()
            }
        }
    },
    watch: {
        // 路由变化时
        $route(to, from) {
            if (this.$route.path.indexOf('/main/customReport/list') >= 0) {
                this.getReportData()
            }
        }
    },
    components: Object.assign({
        'detail-opt': detailOpt,
        'page-title': PageTitle,
        'list-page': listPage,
        'foot-control': footControl,
        'no-data': NoData
    }, ListShow),
    beforeDestroy: function () {
        this.hasScrollbar = null
        // this.showDialog = null
        this.switchList = null
        this.getListData = null
        this.listaddTab = null
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
// @import "../zh-cn.less";
// @import "../en.less";
@import "./zh-cn.less";
@import "./en.less";
</style>
