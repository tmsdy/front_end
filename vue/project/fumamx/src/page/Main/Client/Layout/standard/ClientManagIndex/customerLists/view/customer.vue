<template>
    <div class="customerLists">
        <!-- 暂无客户 -->
        <!-- 立即创建 -->
        <no-data class="marginTop15" @getListData="getListData" v-show="!firstData" :fastOpt="fastOpt" v-if="customerListsData.length==0" :title="$t('mxpcweb.client.1529057210799')" :btnText="$t('mxpcweb.client.1529028045434')" img='noCustomer'></no-data>
        <template v-else>
            <div class="boxList" :style="{'padding-right': showCustoms ? '370px' : '200px'}">
                <el-row :gutter="20">
                    <el-col :span="6">
                            <!-- 客户名称 -->
                            {{$t('mxpcweb.client.1529055956170')}}
                    </el-col>
                    <el-col :span="18">
                        <div class="grid-content bg-purple" style="display:inline-block;width:100%">
                            <span v-for="(fieldItem,fieldIndex) in listSet.listSetAllow" :key="fieldIndex"  class="ellipsis" :title="fieldItem.cnFieldCaption" style="display:inline-block;text-align:left" :style="{'width':parseInt(fieldItem.columnWidth)/listSet.allColumnWidth*99+'%'}">
                                {{fieldItem.cnFieldCaption}}
                            </span>
                        </div>
                    </el-col>
                </el-row>
                <div class="customsBox" v-if="showCustoms">
                    <!-- 贸易大数据 -->
                    {{$t('mxpcweb.client.list.1555055650674')}}
                </div>
                <div class="posRight" v-if="isShowCheck">
                    <!-- 拥有人 -->
                    {{$t('mxpcweb.client.1529043616422')}}
                </div>
            </div>
            <div :class="isShowCheck?'customerTables MXscroll' : 'customerTablesDetailUse'" ref="customerTables" :style="{'padding-right': hasScrollbarValue ? '10px' : '15px' }">
                <div class="customerTable" v-for="(list,indexs) in customerListsData" :key="indexs">
                    <template v-if="list!==undefined">
                        <ul class="customerListView">
                            <p class="titleTime" v-if="list.title">
                                <i class="iconfont icon-kehu-liebiaoriqi"></i>
                                <span>{{returnTitleTime(list.titleTime)}}</span>
                            </p>
                            <li v-else :style="{'padding-right': showCustoms ? '370px' : '200px'}">
                                <div v-show="isShowCheck" :class="[controlData.checkedCities.length==0 ? 'listCheckNone' : 'listChecks']">
                                    <el-checkbox :label="list[moduleStruct.identField]" size="small">&nbsp;</el-checkbox>
                                </div>
                                <el-row :gutter="20" class="customerInfo" >
                                    <el-col :span="6">
                                        <div class="grid-content bg-purple ellipsis custName" :title="list[moduleStruct.titleField]">
                                            <span class="text-hover" @click="listaddTab(list)" v-if="list[moduleStruct.titleField]&&list[moduleStruct.titleField]!=''">
                                                {{list[moduleStruct.titleField]}}
                                            </span>
                                            <span @click="listaddTab(list)"  v-else>&nbsp;</span>
                                        </div>
                                    </el-col>
                                    <el-col :span="18">
                                        <div class="grid-content bg-purple">
                                            <span v-if="listSet.listSetAllow && listSet.listSetAllow.length==0">
                                                &nbsp;
                                            </span>
                                            <div v-else class="grid-content bg-purple" style="display:inline-block;width:100%">
                                                <span class="ellipsis" v-for="(fieldItem,fieldIndex) in listSet.listSetAllow" :key="fieldIndex"  style="display:inline-block;width:16%;text-align:left" :style="{'width': parseInt(fieldItem.columnWidth)/listSet.allColumnWidth*99+'%'}">
                                                    <component v-bind:is="'control'+fieldItem.controlTypeId" ref="control" :itemData="fieldItem" :value="{value:fieldItem.fieldName?list[fieldItem.fieldName]:''}"></component>
                                                </span>
                                            </div>
                                        </div>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20" class="customerMessage" style="font-size: 12px;color: #999999;">
                                    <el-col :span="10">
                                        <div class="grid-content bg-purple">
                                            <div v-if="list.dynamics" class="track" :title="JSON.parse(list.dynamics).content">
                                                <div class="ellipsis" v-if="!isNaN(parseInt(JSON.parse(list.dynamics).type))">
                                                    <template v-if="JSON.parse(list.dynamics).type=='1'">
                                                        <i class="iconfont icon-kehuzhuangtai-genjin"></i>
                                                        <!-- 跟进 -->
                                                        [{{$t('mxpcweb.client.1529045936384')}}]
                                                    </template>
                                                    <template v-else-if="JSON.parse(list.dynamics).type=='4'">
                                                        <i class="iconfont icon-kehuzhuangtai-tixing"></i>
                                                        <!-- [提醒] -->
                                                        [{{$t('mxpcweb.client.1529056941188')}}]
                                                    </template>
                                                    <template v-else-if="JSON.parse(list.dynamics).type=='8'">
                                                        <i class="iconfont icon-kehuzhuangtai-shangchuanfujian"></i>
                                                        <!-- [上传附件] -->
                                                        [{{$t('mxpcweb.client.1529056859354')}}]
                                                    </template>
                                                    <template v-else-if="JSON.parse(list.dynamics).type=='7'">
                                                        <i class="iconfont icon-dot" :style="setCommentsColor(JSON.parse(list.dynamics).special)"></i>
                                                        <!-- [批注] -->
                                                        [{{$t('mxpcweb.client.1529056877668')}}]
                                                    </template>
                                                    <template v-else-if="JSON.parse(list.dynamics).type=='2'">
                                                        <i class="iconfont icon-kehuzhuangtai-fayoujian"></i>
                                                        <!-- 发邮件 -->
                                                        [{{$t('mxpcweb.client.1529056976908')}}]
                                                    </template>
                                                    <template v-else-if="JSON.parse(list.dynamics).type=='3'">
                                                        <i class="iconfont icon-kehuzhuangtai-youjianam"></i>
                                                        <!-- 邮件AM -->
                                                        [{{$t('mxpcweb.client.1529056959076')}}]
                                                    </template>
                                                    <template v-else-if="JSON.parse(list.dynamics).type=='5'">
                                                        <i class="iconfont icon-kehuzhuangtai-hetong"></i>
                                                        <!-- 订单 -->
                                                        [{{$t('mxpcweb.client.1529056921708')}}]
                                                    </template>
                                                    <template v-else-if="JSON.parse(list.dynamics).type=='6'">
                                                        <i class="iconfont icon-kehuzhuangtai-baojia"></i>
                                                        <!-- 报价 -->
                                                        [{{$t('mxpcweb.client.1529056897952')}}]
                                                    </template>
                                                    <template v-else>
                                                        [{{dynamicsType[JSON.parse(list.dynamics).type]}}]
                                                    </template>
                                                    [<component v-bind:is="'control24'" ref="control" :value="{value:JSON.parse(list.dynamics).operateCtId}"></component>]
                                                    {{JSON.parse(list.dynamics).content}}
                                                    <span class="trackName">
                                                        (
                                                            {{returnTimeShow(JSON.parse(list.dynamics).date, 'MM-DD HH:mm')}}
                                                        )
                                                        <!-- 跟进动态 -->
                                                        <el-popover v-if="list.custTracksData&&list.custTracksData.length>0" placement="bottom" :title="$t('mxpcweb.client.1529057099070')" width="400" trigger="hover">
                                                            <template v-for="(tracks,tracksIndex) in list.custTracksData.slice(0,5)">
                                                                <div :key="tracksIndex" v-if="tracks.delState=='0'">
                                                                    {{tracks.trackDate ? returnTimeShow(tracks.trackDate) : ''}}
                                                                    <li class="ellipsis" :title="tracks.trackContent" style="color: rgb(153, 153, 153);height:30px;line-height:30px">
                                                                        [<component v-bind:is="'control24'" ref="control" :value="{value:tracks.modifyCtId}"></component>]
                                                                        {{tracks.trackContent}}
                                                                    </li>
                                                                </div>
                                                            </template>
                                                            <!-- 查看更多 -->
                                                            <div v-if="list.custTracksData.length>5" @click="listaddTab(list)" class="text-hover" style="text-align:center">{{$t('mxpcweb.client.1529057083155')}}</div>
                                                            <i class="iconfont icon-eye text-hover" slot="reference" title="" style="vertical-align: middle;"></i>
                                                        </el-popover>
                                                    </span>
                                                </div>
                                                <div class="ellipsis" v-else>
                                                    <i class="iconfont icon-sign-round" style="vertical-align: middle;"></i>
                                                    [{{JSON.parse(list.dynamics).type}}]
                                                    [<component v-bind:is="'control24'" ref="control" :value="{value:JSON.parse(list.dynamics).operateCtId}"></component>]
                                                    {{JSON.parse(list.dynamics).content}}
                                                    <span class="trackName">
                                                        (
                                                            {{returnTimeShow(JSON.parse(list.dynamics).date, 'MM-DD HH:mm')}}
                                                        )
                                                    </span>
                                                </div>
                                            </div>
                                            <div v-else class="trackNodata">
                                                <i class="iconfont icon-disabled"></i>
                                                <!-- 暂无动态 -->
                                                {{$t('mxpcweb.client.1529057068018')}}
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="14">
                                        <div class="grid-content bg-purple font-right" style="position:relative;overflow:hidden;height: 24px;line-height: 24px;">
                                            <!-- 标签 -->
                                            <show-label  :title="$t('mxpcweb.client.1529057053276')" :moduleCode="moduleCode"  ref="label" :dynamicTags="dynamicTags" :tags="list.tags"></show-label>
                                        </div>
                                    </el-col>
                                </el-row>
                                <template v-if="showCustoms">
                                    <div class="customsBox" v-if="list.customs && (
                                        (list.customs.customsMoney && list.customs.customsMoney != 0) ||
                                        (list.customs.customsCount && list.customs.customsCount != 0) ||
                                        (list.customs.customsLastDate && list.customs.customsLastDate != '')
                                    )">
                                        <div class="ellipsis">
                                            <span :title="'$' + (list.customs.customsMoney && list.customs.customsMoney != '' ? (parseFloat(list.customs.customsMoney)/1000000).toFixed(2) : '0') + 'M'">${{list.customs.customsMoney && list.customs.customsMoney != '' ? (parseFloat(list.customs.customsMoney)/1000000).toFixed(2) : '0'}}M</span>
                                            <!-- 次 -->
                                            <span :title="(list.customs.customsCount && list.customs.customsMoney != '' ? list.customs.customsCount : '0') + $t('mxpcweb.client.list.1555055730497')"> | {{list.customs.customsCount && list.customs.customsMoney != '' ? list.customs.customsCount : '0'}}{{$t('mxpcweb.client.list.1555055730497')}}</span>
                                        </div>
                                        <div style="color:#606266;margin-top: 7px;">
                                            <!-- 最近 -->
                                            <!-- 暂无 -->
                                            <span>{{$t('mxpcweb.client.list.1555055806945')}}:</span><span>{{list.customs.customsLastDate ? list.customs.customsLastDate : $t('mxpcweb.client.list.1555055810283')}}</span>
                                        </div>
                                    </div>
                                    <div class="customsBox" v-else>
                                        <div class="text-center" style="max-width:60px;">
                                            -
                                        </div>
                                    </div>
                                </template>
                                <div class="listTimes3" :class="[isShowCheck ?'listControl1':'']">
                                    <detail-opt useType="customer" :moduleStructName="moduleStruct.titleField" :moduleStructId="moduleStruct.identField" :moduleCode="moduleCode"  @getListData="getListData" :detailOptData="detailOpt" :itemData="list"></detail-opt>
                                </div>
                                <div class="grid-content bg-purple listTimes"  :class="[isShowCheck ?'':'listControl1']">
                                    <span dataOn="true">
                                        <component v-bind:is="'controlListTime'" ref="control" :value="{value:list[nowSort.fieldName]}"></component>
                                    </span>
                                </div>
                                <div class="listTimes1 ellipsis"  :class="[isShowCheck ?'':'listControl1']">
                                    <component v-bind:is="'control24'" ref="control" :value="{value:list.ownerCtId}"></component>
                                </div>
                                <div class="listTimes2 ellipsis"  :class="[isShowCheck ?'':'listControl1']">
                                    <!-- 评分 -->
                                    <span  v-if="list.custScore||list.custScore==0" class="rank-box"  :title="$t('mxpcweb.client.1529057021459')">
                                        <span class="font-white score"><i class="iconfont icon-thumb scale"></i>{{list.custScore}}</span>
                                    </span>
                                    <!-- 评分 -->
                                    <span v-else :title="$t('mxpcweb.client.1529057021459')" class="rank-box" style="padding-right:2px;">
                                        <!-- 暂无评分 -->
                                        {{$t('mxpcweb.client.1529057007512')}}
                                    </span>
                                </div>
                                <span v-if="isFocusBill(list.focusTargets)&&viewType!='seas'" class="starBox">
                                    <i class="iconfont icon-star-card" style="font-size:16px;"></i>
                                </span>
                            </li>
                        </ul>
                    </template>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
/**
 * 描述：客户管理-客户列表
 * 作者：何俊峰
 * 时间：2017/11/10
 */
import { commentsColor } from '@/libs/utils.js'
import detailOpt from '../../detailOpt/index'
import NoData from './NoData/index'
import showLabel from './showLabel/index.vue'
import ListShow from '@/components/ListShowControls/index.js'
import { mapGetters } from 'vuex'
export default {
    name: 'customerLists',
    props: {
         listSet: {
            type: Object,
            default: function() {
                return {}
            }
        },
        fastOpt: {// 获取空间操作按钮列表
            type: Array,
            default: function() {
                return []
            }
        },
        detailOpt: {
            type: Array,
            default: function() {
                return []
            }
        },
        moduleStruct: {
            type: Object,
            default: function() {
                return {
                    fieldName: 'createDate'
                }
            }
        },
        nowSort: {
            type: Object,
            default: function() {
                return {
                    fieldName: 'createDate'
                }
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
        dynamicTags: {
            type: Array,
            default: function() {
                return []
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
            customerListsData: [],
            firstData: true,
            // "跟进",
            // "发邮件",
            // "邮件AM",
            // "提醒",
            // "订单",
            // "报价",
            // "批注",
            // "上传附件",
            dynamicsType: [
                '',
                this.$t('mxpcweb.client.1529045936384'),
                this.$t('mxpcweb.client.1529056976908'),
                this.$t('mxpcweb.client.1529056959076'),
                this.$t('mxpcweb.client.1529056941188'),
                this.$t('mxpcweb.client.1529056921708'),
                this.$t('mxpcweb.client.1529056897952'),
                this.$t('mxpcweb.client.1529056877668'),
                this.$t('mxpcweb.client.1529056859354')
            ],
            language: {
                today: this.$t('mxpcweb.client.1529056807699'), // 今天
                yesterday: this.$t('mxpcweb.client.1529056766253'), // 昨天
                tomorrow: this.$t('mxpcweb.client.1529056827883'), // 明天
                noday: this.$t('mxpcweb.client.1529056745088') // 无具体时间
            },
            hasScrollbarValue: true,
            viewType: '',
            showCustoms: false
        }
    },
    created() {
        this.viewType = this.getRoute().viewType
    },
    mounted() {
        this.showCustoms = this.navigator.uRIs.indexOf('/main/discovery') != '-1'
    },
    methods: {
        returnTitleTime(titleTime) {
            if (titleTime) {
                if (titleTime != this.$t('mxpcweb.client.1529056745088')) {
                    let time = this.timeShow_custom(titleTime + ' 00:00:00', 'YYYY-MM-DD')
                    return time
                } else {
                    return titleTime
                }
            } else {
                return this.$t('mxpcweb.client.1529056745088')
            }
        },
        returnTimeShow(titleTime, type) {
            let time = this.timeShow_custom(titleTime, type)
            return time
        },
        listaddTab(list) {
            $('.el-popover').hide()
            list.billId = list.custId
            list.billName = list.custName
            list.moduleCode = this.moduleCode
            ep.emit('addTab', list)
        },
        // 批注色彩
        setCommentsColor(flag) {
            return commentsColor(flag)
        },
        switchList(customerLists, sortName, load) {
            if (this.firstData) {
                this.firstData = false
            }
            if (!sortName) {
                sortName = 'createDate'
            }
            let titleTime = this.$t('mxpcweb.client.1529056745088')
            if (load) {
                this.$nextTick(() => {
                    if (this.$refs.customerTables) {
                        this.$refs.customerTables.scrollTo(0, '0')
                    }
                })
                this.customerListsData = []
                this.renderingList(customerLists.slice(0, 10), titleTime, sortName)
                this.$emit('closeListLoad')
                if (customerLists.length > 10) {
                    setTimeout(() => {
                        // this.renderingList(customerLists.slice(10, customerLists.length), titleTime, sortName)
                        this.customerListsData = this.renderingList1(customerLists, titleTime, sortName)
                    }, 10)
                }
            } else {
                this.customerListsData = []
                this.customerListsData = this.renderingList1(customerLists, titleTime, sortName)
            }
            this.hasScrollbar()
        },
        renderingList(customerLists, titleTime, sortName) {
            customerLists.forEach((element) => { // 按天把列表归类
                if (element.custTracks) {
                    element.custTracks.sort((a, b) => {
                        return b['trackDate'] - a['trackDate']
                    })

                    element.custTracksData = []
                    element.custTracks.forEach((items) => {
                        if (items.delState != 1) {
                            element.custTracksData.push(items)
                        }
                    })
                }
                if (element[sortName]) {
                    if (titleTime != element[sortName].substring(0, 10)) {
                        titleTime = element[sortName].substring(0, 10)
                        this.customerListsData.push({
                            title: true,
                            titleTime: titleTime
                        })
                    }
                } else {
                    if (titleTime != this.$t('mxpcweb.client.1529056745088')) {
                        titleTime = this.$t('mxpcweb.client.1529056745088')
                        this.customerListsData.push({
                            title: true,
                            titleTime: titleTime
                        })
                    }
                }
                this.customerListsData.push(element)
            })
            this.hasScrollbar()
        },
        renderingList1(customerLists, titleTime, sortName) {
            let customerListsData = []
            customerLists.forEach((element) => { // 按天把列表归类
                if (element.custTracks) {
                    element.custTracks.sort((a, b) => {
                        return b['trackDate'] - a['trackDate']
                    })

                    element.custTracksData = []
                    element.custTracks.forEach((items) => {
                        if (items.delState != 1) {
                            element.custTracksData.push(items)
                        }
                    })
                }
                if (element[sortName]) {
                    if (titleTime != element[sortName].substring(0, 10)) {
                        titleTime = element[sortName].substring(0, 10)
                        customerListsData.push({
                            title: true,
                            titleTime: titleTime
                        })
                    }
                } else {
                    if (titleTime != this.$t('mxpcweb.client.1529056745088')) {
                        titleTime = this.$t('mxpcweb.client.1529056745088')
                        customerListsData.push({
                            title: true,
                            titleTime: titleTime
                        })
                    }
                }
                customerListsData.push(element)
            })
            return customerListsData
        },
        getListData(upData) {
            this.$emit('getListData', false, upData)
        },
        hasScrollbar() {
            let time = setTimeout(() => {
                let thisDom = this.$refs.customerTables
                if (thisDom) {
                    this.hasScrollbarValue = thisDom.scrollHeight > thisDom.clientHeight
                } else {
                    this.hasScrollbarValue = false
                }
                window.clearTimeout(time)
            }, 5)
        }
    },
    computed: {
        ...mapGetters(['navigator'])
    },
    components: Object.assign({
        'detail-opt': detailOpt,
        'no-data': NoData,
        'show-label': showLabel
    }, ListShow),
    beforeDestroy: function () {
        this.customerListsData = null
        this.hasScrollbar = null
        this.returnTitleTime = null
        this.returnTimeShow = null
        this.listaddTab = null
        this.renderingList1 = null
        this.renderingList = null
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../zh-cn.less";
@import "../en.less";
.trackName{
line-height: 16px;
}
</style>
