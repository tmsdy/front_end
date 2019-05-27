<template>
    <div class="tableRowClassName">
        <!-- 暂无跟进 -->
        <!-- 立即创建 -->
        <no-data class="marginTop15" v-show="!firstData" v-if="tableData.length==0" :fastOpt="fastOpt" :title="$t('mxpcweb.client.1529056221948')" img="noFollow" :btnText="$t('mxpcweb.client.1529028045434')" @getListData="getListData"></no-data>
        <template v-else>
            <div  class="boxList">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <!-- 客户名称 -->
                            {{$t('mxpcweb.client.1529055956170')}}
                    </el-col>
                    <el-col :span="18">
                        <div class="grid-content bg-purple" style="display:inline-block;width:100%">
                            <span v-for="(fieldItem,fieldIndex) in listSet.listSetAllow" :key="fieldIndex" class="ellipsis" :title="fieldItem.cnFieldCaption" style="display:inline-block;text-align:left" :style="{'width':(parseInt(fieldItem.columnWidth)/listSet.allColumnWidth)*99+'%'}">
                                {{fieldItem.cnFieldCaption}}
                            </span>
                        </div>
                    </el-col>
                </el-row>
                <div class="posRight">
                    <!-- 跟进拥有人 -->
                    {{$t('mxpcweb.client.1529056296487')}}
                </div>
            </div>
            <div class="customerTables MXscroll" ref="customerTables" :style="{'padding-right': hasScrollbarValue ? '10px' : '15px' }">
                <div class="customerTable">
                        <ul class="customerList">
                            <li v-for="(list,index) in tableData" :key="index">
                                <div :class="[controlData.checkedCities && controlData.checkedCities.length==0 ? 'listCheckNone' : 'listChecks']">
                                    <el-checkbox :label="list[moduleStruct.identField]" size="small">&nbsp;</el-checkbox>
                                </div>
                                <el-row :gutter="20" class="customerInfo" >
                                    <el-col :span="6">
                                        <div class="grid-content bg-purple ellipsis custName" :title="list.custName">
                                            <span class="text-hover" @click="listaddTab(list)" v-if="list.custName&&list.custName!=''">
                                                {{list.custName}}
                                            </span>
                                            <span @click="listaddTab(list)"  v-else>&nbsp;</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="18">
                                        <div class="grid-content bg-purple">
                                            <span v-if="listSet.listSetAllow.length==0">
                                                &nbsp;
                                            </span>
                                            <div v-else class="grid-content bg-purple" style="display:inline-block;width:100%">
                                                <span class="ellipsis" v-for="(fieldItem,fieldIndex) in listSet.listSetAllow" :key="fieldIndex"  style="display:inline-block;width:16%;text-align:left" :style="{'width':(parseInt(fieldItem.columnWidth)/listSet.allColumnWidth)*99+'%'}">
                                                    <component :list="list" v-bind:is="'control'+fieldItem.controlTypeId" ref="control" :itemData="fieldItem" :value="{value:fieldItem.fieldName?list[fieldItem.fieldName]:''}"></component>
                                                </span>
                                            </div>
                                        </div>
                                    </el-col>
                                </el-row>
                                <div class="listTimes3">
                                    <detail-opt useType="customer" :moduleCode="moduleCode" :moduleStructName="moduleStruct.titleField" :moduleStructId="moduleStruct.identField"  @getListData="getListData" :detailOptData="detailOpt" :itemData="list"></detail-opt>
                                </div>
                                <div class="listTimes1 ellipsis">
                                    <component v-bind:is="'control24'" ref="control" :value="{value:list.ownerCtId}"></component>
                                </div>
                                <span v-if="isFocusBill(list.focusTargets)&&viewType!='seas'" class="starBox">
                                    <i class="iconfont icon-star-card" style="font-size:16px;"></i>
                                </span>
                            </li>
                        </ul>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
/**
 * 描述：客户管理-客户列表-编辑客户
 * 作者：何俊峰
 * 时间：2017/11/22
 */
import detailOpt from '../../detailOpt/index'
import NoData from './NoData/index'
import ListShow from '@/components/ListShowControls/index.js'
export default {
    name: 'currency',
    props: {
        listSet: {
            type: Object,
            default: function() {
                return {}
            }
        },
        controlData: {
            type: Object,
            default: function() {
                return {
                    checkedCities: []
                }
            }
        },
        detailOpt: {
            type: Array,
            default: function() {
                return []
            }
        },

        fastOpt: {// 获取空间操作按钮列表
            type: Array,
            default: function() {
                return []
            }
        },
        moduleStruct: {
            type: Object,
            default: function() {
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
            viewType: ''
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
                    let time = setTimeout(function() {
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
            let time = setTimeout(function() {
                let thisDom = _this.$refs.customerTables
                if (thisDom) {
                    _this.hasScrollbarValue = thisDom.scrollHeight > thisDom.clientHeight
                } else {
                    _this.hasScrollbarValue = false
                }
                window.clearTimeout(time)
            }, 5)
        }
    },
    watch: {

    },
    components: Object.assign({
        'detail-opt': detailOpt,
        'no-data': NoData
    }, ListShow),
    beforeDestroy: function () {
        this.tableData = null
        this.hasScrollbar = null
        this.showDialog = null
        this.switchList = null
        this.getListData = null
        this.listaddTab = null
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../zh-cn.less";
@import "../en.less";
@import "./less/currency/zh-cn.less";
@import "./less/currency/en.less";
</style>
