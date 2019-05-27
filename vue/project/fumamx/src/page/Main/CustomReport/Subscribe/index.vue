<template>
    <div class="List">
        <!-- 弹出框-嵌入表格-->
        <!-- <el-dialog :visible.sync="dialogVisible" size="full" class="customReportDialog">
            <dialog-inset></dialog-inset>
        </el-dialog> -->
        <div class="tableRowClassName">
            <template>
                <page-title title="自定义报表" iconfont="icon-share-set"></page-title>
                <div class="boxList">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            报表名称
                        </el-col>
                        <el-col :span="12">
                            报表描述
                        </el-col>
                    </el-row>
                    <div class="posRight">
                        删除时间
                    </div>
                </div>
                <div class="customerTables MXscroll" ref="customerTables">
                    <div class="customerTable">
                        <ul class="customerList">
                            <!--  v-for="(list,index) in tableData" :key="index" v-if="list!==undefined" -->
                            <li>
                                <div :class="[controlData.checkedCities.length==0 ? 'listCheckNone' : 'listChecks']">
                                    <!-- :label="list[moduleStruct.identField]"  -->
                                    <el-checkbox size="small">&nbsp;</el-checkbox>
                                </div>
                                <el-row :gutter="20" class="customerInfo">
                                    <el-col :span="12">
                                        客户关系
                                    </el-col>
                                    <el-col :span="12">
                                        报表描述
                                    </el-col>
                                </el-row>
                                <div class="listTimes3">
                                    <!-- useType="customer" :moduleCode="moduleCode" :moduleStructName="moduleStruct.titleField" :moduleStructId="moduleStruct.identField" @getListData="getListData" :detailOptData="detailOpt" -->
                                    <detail-opt :detailOptData="detailOpt"></detail-opt>
                                </div>
                                <div class="listTimes1 ellipsis">
                                    1.10 14:55
                                    <!-- <component v-bind:is="'control24'" ref="control" :value="{value:list.ownerCtId}"></component> -->
                                </div>
                                <span v-if="true" class="starBox">
                                    <i class="iconfont icon-star-card"></i>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                <!--footer-->
                <!--  @getListData="getListDatas" :listOpt="listOpt" :naxtArgument="naxtArgument" :customerLists="customerLists" :controlData="controlData" iseType="通用" @getListSet="getListSet" -->
                <foot-control ref="footControl" :moduleCode="moduleCode" :moduleStruct="moduleStruct"></foot-control>
                <!--分页 :blockData="blockData" @getListData="getListData2"-->
                <list-page v-show="controlData.checkedCities.length==0" ref="listPage" style="text-align:center;background:#f7f8f9" :moduleCode="moduleCode"></list-page>
            </template>
        </div>
    </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import PageTitle from '@/components/PageTitle/index'
import detailOpt from '../components/detailOpt/index'
import footControl from '../components/footControl/index'
import ListShow from '@/components/ListShowControls/index.js'
import listPage from '@/components/listPage/index'
export default {
    name: 'currency',
    props: {
        listSet: {
            type: Object,
            default: function () {
                return {}
            }
        },
        controlData: {
            type: Object,
            default: function () {
                return {
                    checkedCities: []
                }
            }
        },
        detailOpt: {
            type: Array,
            default: function () {
                return [
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
                    },
                    {
                        iconURI: 'icon-star',
                        optCode: 'otFocus',
                        optModuleCode: 'BF004',
                        optName: '星标置顶'
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
            tableData: [],
            baseData: [],
            firstData: true,
            hasScrollbarValue: true,
            viewType: '',
            listOpt: [],
            search: ''
        }
    },
    created() {
        this.viewType = this.getRoute().viewType
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        // 判断是否为关注单据
        isFocusBills(list) {
            return this.isFocusBill(list)
        },
        listaddTab(list) { // 跳转客户详情
            list.billId = list.custId
            list.billName = list.custName
            list.moduleCode = 'BF001'
            ep.emit('addTab', list)
        },
        showDialog(useType, id) {
            this.$emit('showDialog', useType, id)
        },
        switchList(customerLists, sortName, load) {
            if (load) {
                this.$nextTick(() => {
                    if (this.$refs.customerTables) {
                        this.$refs.customerTables.scrollTo(0, '0')
                    }
                })
                this.tableData = []
                this.tableData = customerLists.slice(0, 15)
                this.$emit('closeListLoad')
                if (customerLists.length > 15) {
                    let _this = this
                    let time = setTimeout(function () {
                        _this.tableData = customerLists
                        _this.hasScrollbar()
                        window.clearTimeout(time)
                    }, 10)
                }
            } else {
                this.tableData = []
                this.tableData = customerLists
            }
            this.firstData = false
            this.hasScrollbar()
        },
        getListData(upData) {
            this.$emit('getListData', false, upData)
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
        handleIconClick(ev) {
            // console.log(ev)
        }
    },
    watch: {

    },
    components: Object.assign({
        'detail-opt': detailOpt,
        'page-title': PageTitle,
        'list-page': listPage,
        'foot-control': footControl
    }, ListShow),
    beforeDestroy: function () {
        this.tableData = null
        this.hasScrollbar = null
        this.isFocusBills = null
        this.showDialog = null
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
