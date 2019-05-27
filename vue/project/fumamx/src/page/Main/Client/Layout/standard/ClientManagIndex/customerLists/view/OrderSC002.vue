<template>
    <div class="tableRowClassName">
        <!-- 暂无工单 -->
        <!-- 立即创建 -->
        <no-data class="marginTop15" @getListData="getListData" v-show="!firstData" v-if="tableData.length==0" :fastOpt="fastOpt" :title="$t('mxpcweb.client.1529055628584')" img="noFollow" :btnText="$t('mxpcweb.client.1529028045434')"></no-data>
        <template v-else>
            <div  class="boxList">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <div class="grid-content bg-purple" style="display:inline-block;width:100%">
                            <span v-for="(fieldItem,fieldIndex) in listSet.listSetAllow" :key="fieldIndex" class="ellipsis" :title="fieldItem.cnFieldCaption" style="display:inline-block;text-align:left" :style="{'width':(parseInt(fieldItem.columnWidth)/listSet.allColumnWidth)*99+'%'}">
                                {{fieldItem.cnFieldCaption}}
                            </span>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div class="customerTables MXscroll" ref="customerTables" :style="{'padding-right': hasScrollbarValue ? '10px' : '15px' }">
                <div class="customerTable">
                        <ul class="customerList">
                            <li v-for="(list,index) in tableData" :key="index">
                                <div v-if="isShowCheck" :class="[controlData.checkedCities.length==0 ? 'listCheckNone' : 'listChecks']">
                                    <el-checkbox :label="list[moduleStruct.identField]" size="small">&nbsp;</el-checkbox>
                                </div>
                                <el-row :gutter="24" class="customerInfo" >
                                    <el-col :span="24">
                                        <div class="grid-content bg-purple">
                                            <span v-if="listSet.listSetAllow.length==0">
                                                &nbsp;
                                            </span>
                                            <div v-else class="grid-content bg-purple" style="display:inline-block;width:100%">
                                                <span class="ellipsis" v-for="(fieldItem,fieldIndex) in listSet.listSetAllow" :key="fieldIndex"  :class="classItem(fieldItem)" @click="listClick(fieldItem, list)" style="display:inline-block;width:16%;text-align:left" :style="{'width':(parseInt(fieldItem.columnWidth)/listSet.allColumnWidth)*99+'%'}">
                                                    <component :class="detailOpt.length > 0 && fieldIndex > 1 && fieldIndex > listSet.listSetAllow.length - 2 ? 'listTimes1' : ''" :list="list" v-bind:is="'control'+fieldItem.controlTypeId" ref="control" :itemData="fieldItem" :moduleCode="moduleCode" :accountInfo="list.accountInfo" :value="{value:fieldItem.fieldName?list[fieldItem.fieldName]:''}"></component>
                                                </span>
                                            </div>
                                        </div>
                                    </el-col>
                                </el-row>
                                <div class="listTimes3">
                                    <detail-opt useType="customer" :moduleStructName="moduleStruct.titleField" :moduleStructId="moduleStruct.identField" :moduleCode="moduleCode"  @getListData="getListData" :detailOptData="detailOpt" :itemData="list"></detail-opt>
                                </div>
                                <span v-if="isFocusBill(list.focusTargets)&&viewType!='seas'" class="starBox">
                                    <i class="iconfont icon-star-card" style="font-size:16px;"></i>
                                </span>
                                <div class="Documentary">
                                    <div class="DocumentaryListBox">
                                        <div class="DocumentaryList">
                                            <span v-if="list.dynamics" :title="JSON.parse(list.dynamics).content">
                                                <div class="ListVueBox ellipsis" v-if="!isNaN(parseInt(JSON.parse(list.dynamics).type))">
                                                    <span class="iconBox">
                                                        <i class="iconfont" :class="dynamicsType[JSON.parse(list.dynamics).type].icon"></i>
                                                    </span>
                                                    [{{dynamicsType[JSON.parse(list.dynamics).type].title}}]
                                                    [<component v-bind:is="'control24'" ref="control" :value="{value:JSON.parse(list.dynamics).operateCtId}"></component>]
                                                    {{JSON.parse(list.dynamics).content}}
                                                    <span class="trackName">
                                                        (
                                                            {{returnTimeShow(JSON.parse(list.dynamics).date, 'MM-DD HH:mm')}}
                                                        )
                                                    </span>
                                                </div>
                                                <!-- <template v-if="list.SC003_4 && JSON.stringify(list.SC003_4) != '{}'">
                                                    <span class="iconBox">
                                                        <i class="iconfont icon-dynamic"></i>
                                                    </span>
                                                    <list-vue useType="1" :SC003_3="list.SC003_4"></list-vue>
                                                </template> -->
                                            </span>
                                            <span v-else>
                                                <span class="iconBox">
                                                    <i class="iconfont icon-disabled"></i>
                                                </span>
                                                <span class="content">暂无动态</span>
                                            </span>
                                        </div>
                                        <div class="DocumentaryList">
                                            <template v-if="list.SC003_2 && JSON.stringify(list.SC003_2) != '{}'">
                                                <span class="iconBox1">
                                                    <i class="iconfont icon-orderProcess"></i>
                                                </span>
                                                <list-vue useType="2" :SC003_3="list.SC003_2"></list-vue>
                                            </template>
                                            <span v-else>
                                                <span class="iconBox1">
                                                    <i class="iconfont icon-disabled"></i>
                                                </span>
                                                <span class="content">暂无跟单动态</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="labelBox" style="overflow: hidden;height: 24px;">
                                        <show-label :title="$t('mxpcweb.client.1529057053276')" :moduleCode="moduleCode"  ref="label" :dynamicTags="dynamicTags" :tags="list.tags"></show-label>
                                    </div>
                                </div>
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
import ListVue from './Vue/SC002/index'
import ListShow from '@/components/ListShowControls/index.js'
import showLabel from './showLabel/index.vue'
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
        dynamicTags: {
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
            default: function () {
                return {}
            }
        },
        moduleCode: {
            type: String,
            default: ''
        },
        isShowCheck: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            // "跟进",
            // "发邮件",
            // "邮件AM",
            // "提醒",
            // "订单",
            // "报价",
            // "批注",
            // "上传附件",
            dynamicsType: [
                {
                    title: '',
                    icon: ''
                },
                {
                    title: this.$t('mxpcweb.client.1529045936384'),
                    icon: 'icon-kehuzhuangtai-genjin'
                },
                {
                    title: this.$t('mxpcweb.client.1529056976908'),
                    icon: 'icon-kehuzhuangtai-fayoujian'
                },
                {
                    title: this.$t('mxpcweb.client.1529056959076'),
                    icon: 'icon-kehuzhuangtai-youjianam'
                },
                {
                    title: this.$t('mxpcweb.client.1529056941188'),
                    icon: 'icon-kehuzhuangtai-tixing'
                },
                {
                    title: this.$t('mxpcweb.client.1529056921708'),
                    icon: 'icon-kehuzhuangtai-hetong'
                },
                {
                    title: this.$t('mxpcweb.client.1529056897952'),
                    icon: 'icon-kehuzhuangtai-baojia'
                },
                {
                    title: this.$t('mxpcweb.client.1529056877668'),
                    icon: 'icon-dot'
                },
                {
                    title: this.$t('mxpcweb.client.1529056859354'),
                    icon: 'icon-kehuzhuangtai-shangchuanfujian'
                },
                {
                    title: '收款提醒',
                    icon: 'icon-kehuzhuangtai-tixing'
                }
            ],
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
        classItem(item) {
            if (this.moduleStruct.titleField == item.fieldName || item.fieldName == 'orderTheme') {
                return 'text-hover'
            }
            return ''
        },
        returnTimeShow(titleTime, type) {
            let time = this.timeShow_custom(titleTime, type)
            return time
        },
        listClick(item, list) {
            if (this.moduleStruct.titleField == item.fieldName || item.fieldName == 'orderTheme') {
                this.listaddTab(list)
            }
        },
        listaddTab(list) {
            $('.el-popover').hide()
            list.billId = list[this.moduleStruct.identField]
            list.moduleCode = this.moduleCode
            list.billName = list[this.moduleStruct.titleField]
            if (list.moduleCode == 'PS001') {
            } else if (this.getRoute().parentNaviCode == 'NV011') {
                ep.emit('saleAddTab', list)
            } else {
                ep.emit('addTab', list)
            }
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
                    let time = setTimeout(() => {
                        this.tableData = []
                        this.tableData = customerLists
                        this.hasScrollbar()
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
        'no-data': NoData,
        'list-vue': ListVue,
        'show-label': showLabel
    }, ListShow),
    beforeDestroy: function () {
        this.tableData = null
        this.hasScrollbar = null
        this.listaddTab = null
        this.showDialog = null
        this.switchList = null
        this.getListData = null
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../zh-cn.less";
@import "../en.less";
@import "./less/OrderSC002/zh-cn.less";
@import "./less/OrderSC002/en.less";
.ListVueBox{
    padding-left: 30px;
}
</style>
