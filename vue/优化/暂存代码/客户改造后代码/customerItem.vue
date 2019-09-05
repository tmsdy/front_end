<template>
    <div class="customerTable">
        <template v-if="customerItem!==undefined">
            <ul class="customerListView">
                <p class="titleTime" v-if="customerItem.title">
                    <i class="iconfont icon-kehu-liebiaoriqi"></i>
                    <span>{{returnTitleTime(customerItem.titleTime)}}</span>
                </p>
                <li v-else :style="{'padding-right': showCustoms ? '370px' : '200px'}">
                    <div v-show="isShowCheck" :class="[controlData.checkedCities.length==0 ? 'listCheckNone' : 'listChecks']">
                        <el-checkbox :label="customerItem[moduleStruct.identField]" size="small">&nbsp;</el-checkbox>
                    </div>
                    <el-row :gutter="20" class="customerInfo">
                        <el-col :span="6">
                            <div class="grid-content bg-purple ellipsis custName" :title="customerItem[moduleStruct.titleField]">
                                <span class="text-hover" @click="listaddTab(customerItem)" v-if="customerItem[moduleStruct.titleField]&&customerItem[moduleStruct.titleField]!=''">
                                    {{customerItem[moduleStruct.titleField]}}
                                </span>
                                <span @click="listaddTab(customerItem)" v-else>&nbsp;</span>
                            </div>
                        </el-col>
                        <el-col :span="18">
                            <div class="grid-content bg-purple">
                                <span v-if="listSet.listSetAllow && listSet.listSetAllow.length==0">
                                    &nbsp;
                                </span>
                                <div v-else class="grid-content bg-purple" style="display:inline-block;width:100%">
                                    <span class="ellipsis" v-for="(fieldItem,fieldIndex) in listSet.listSetAllow" :key="fieldIndex" style="display:inline-block;width:16%;text-align:left" :style="{'width': parseInt(fieldItem.columnWidth)/listSet.allColumnWidth*99+'%'}">
                                        <component v-bind:is="'control'+fieldItem.controlTypeId" ref="control" :itemData="fieldItem" :value="{value:fieldItem.fieldName?customerItem[fieldItem.fieldName]:''}"></component>
                                    </span>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" class="customerMessage" style="font-size: 12px;color: #999999;">
                        <el-col :span="10">
                            <div class="grid-content bg-purple">
                                <div v-if="customerItem.dynamics" class="track" :title="JSON.parse(customerItem.dynamics).content">
                                    <div class="ellipsis" v-if="!isNaN(parseInt(JSON.parse(customerItem.dynamics).type))">
                                        <template v-if="JSON.parse(customerItem.dynamics).type=='1'">
                                            <i class="iconfont icon-kehuzhuangtai-genjin"></i>
                                            <!-- 跟进 -->
                                            [{{$t('mxpcweb.client.1529045936384')}}]
                                        </template>
                                        <template v-else-if="JSON.parse(customerItem.dynamics).type=='4'">
                                            <i class="iconfont icon-kehuzhuangtai-tixing"></i>
                                            <!-- [提醒] -->
                                            [{{$t('mxpcweb.client.1529056941188')}}]
                                        </template>
                                        <template v-else-if="JSON.parse(customerItem.dynamics).type=='8'">
                                            <i class="iconfont icon-kehuzhuangtai-shangchuanfujian"></i>
                                            <!-- [上传附件] -->
                                            [{{$t('mxpcweb.client.1529056859354')}}]
                                        </template>
                                        <template v-else-if="JSON.parse(customerItem.dynamics).type=='7'">
                                            <i class="iconfont icon-dot" :style="setCommentsColor(JSON.parse(customerItem.dynamics).special)"></i>
                                            <!-- [批注] -->
                                            [{{$t('mxpcweb.client.1529056877668')}}]
                                        </template>
                                        <template v-else-if="JSON.parse(customerItem.dynamics).type=='2'">
                                            <i class="iconfont icon-kehuzhuangtai-fayoujian"></i>
                                            <!-- 发邮件 -->
                                            [{{$t('mxpcweb.client.1529056976908')}}]
                                        </template>
                                        <template v-else-if="JSON.parse(customerItem.dynamics).type=='3'">
                                            <i class="iconfont icon-kehuzhuangtai-youjianam"></i>
                                            <!-- 邮件AM -->
                                            [{{$t('mxpcweb.client.1529056959076')}}]
                                        </template>
                                        <template v-else-if="JSON.parse(customerItem.dynamics).type=='5'">
                                            <i class="iconfont icon-kehuzhuangtai-hetong"></i>
                                            <!-- 订单 -->
                                            [{{$t('mxpcweb.client.1529056921708')}}]
                                        </template>
                                        <template v-else-if="JSON.parse(customerItem.dynamics).type=='6'">
                                            <i class="iconfont icon-kehuzhuangtai-baojia"></i>
                                            <!-- 报价 -->
                                            [{{$t('mxpcweb.client.1529056897952')}}]
                                        </template>
                                        <template v-else>
                                            [{{dynamicsType[JSON.parse(customerItem.dynamics).type]}}]
                                        </template>
                                        [<component v-bind:is="'control24'" ref="control" :value="{value:JSON.parse(customerItem.dynamics).operateCtId}"></component>]
                                        {{JSON.parse(customerItem.dynamics).content}}
                                        <span class="trackName">
                                            (
                                            {{returnTimeShow(JSON.parse(customerItem.dynamics).date, 'MM-DD HH:mm')}}
                                            )
                                            <!-- 跟进动态 -->
                                            <el-popover ref="elPopover" v-if="customerItem.custTracksData&&customerItem.custTracksData.length>0" placement="bottom" :title="$t('mxpcweb.client.1529057099070')" width="400" trigger="hover">
                                                <template v-for="(tracks,tracksIndex) in customerItem.custTracksData.slice(0,5)">
                                                    <div v-if="tracks.delState=='0'" :key="tracksIndex">
                                                        {{tracks.trackDate ? returnTimeShow(tracks.trackDate) : ''}}
                <li class="ellipsis" :title="tracks.trackContent" style="color: rgb(153, 153, 153);height:30px;line-height:30px">
                    [<component v-bind:is="'control24'" ref="control" :value="{value:tracks.modifyCtId}"></component>]{{tracks.trackContent}}
                </li>
    </div>
</template>
<!-- 查看更多 -->
<div v-if="customerItem.custTracksData.length>5" @click="listaddTab(customerItem)" class="text-hover" style="text-align:center">
  {{$t('mxpcweb.client.1529057083155')}}
</div>
<i class="iconfont icon-eye text-hover" slot="reference" title="" style="vertical-align: middle;"></i>
</el-popover>
</span>
</div>
<div class="ellipsis" v-else>
  <i class="iconfont icon-sign-round" style="vertical-align: middle;"></i>
  [{{JSON.parse(customerItem.dynamics).type}}]
  [<component v-bind:is="'control24'" ref="control" :value="{value:JSON.parse(customerItem.dynamics).operateCtId}"></component>]
  {{JSON.parse(customerItem.dynamics).content}}
  <span class="trackName">
    (
    {{returnTimeShow(JSON.parse(customerItem.dynamics).date, 'MM-DD HH:mm')}}
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
    <show-label :title="$t('mxpcweb.client.1529057053276')" :moduleCode="moduleCode" ref="label" :dynamicTags="dynamicTags" :tags="customerItem.tags"></show-label>
  </div>
</el-col>
</el-row>
<template v-if="showCustoms">
    <div class="customsBox" v-if="customerItem.customs && (
    (customerItem.customs.customsMoney && customerItem.customs.customsMoney != 0) ||
    (customerItem.customs.customsCount && customerItem.customs.customsCount != 0) ||
    (customerItem.customs.customsLastDate && customerItem.customs.customsLastDate != '')
)">
        <div class="ellipsis">
            <span :title="'$' + (customerItem.customs.customsMoney && customerItem.customs.customsMoney != '' ? (parseFloat(customerItem.customs.customsMoney)/1000000).toFixed(2) : '0') + 'M'">${{customerItem.customs.customsMoney && customerItem.customs.customsMoney != '' ? (parseFloat(customerItem.customs.customsMoney)/1000000).toFixed(2) : '0'}}M</span>
            <!-- 次 -->
            <span :title="(customerItem.customs.customsCount && customerItem.customs.customsMoney != '' ? customerItem.customs.customsCount : '0') + $t('mxpcweb.client.list.1555055730497')"> | {{customerItem.customs.customsCount && customerItem.customs.customsMoney != '' ? customerItem.customs.customsCount : '0'}}{{$t('mxpcweb.client.list.1555055730497')}}</span>
        </div>
        <div style="color:#606266;margin-top: 7px;">
            <!-- 最近 -->
            <!-- 暂无 -->
            <span>{{$t('mxpcweb.client.list.1555055806945')}}</span><span>{{customerItem.customs.customsLastDate ? customerItem.customs.customsLastDate : $t('mxpcweb.client.list.1555055810283')}}</span>
        </div>
    </div>
    <div class="customsBox" v-else>
        <div class="text-center" style="max-width:60px;">
            -
        </div>
    </div>
</template>
<div class="listTimes3" :class="[isShowCheck ?'listControl1':'']">
  <detail-opt useType="customer" :moduleStructName="moduleStruct.titleField" :moduleStructId="moduleStruct.identField" :moduleCode="moduleCode" @getListData="getListData" :detailOptData="detailOpt" :itemData="customerItem"></detail-opt>
</div>
<div class="grid-content bg-purple listTimes" :class="[isShowCheck ?'':'listControl1']">
  <span dataOn="true">
    <component v-bind:is="'controlListTime'" ref="control" :value="{value:customerItem[nowSort.fieldName]}"></component>
  </span>
</div>
<div class="listTimes1 ellipsis" :class="[isShowCheck ?'':'listControl1']">
  <component v-bind:is="'control24'" ref="control" :value="{value:customerItem.ownerCtId}"></component>
</div>
<div class="listTimes2 ellipsis" :class="[isShowCheck ?'':'listControl1']">
  <!-- 评分 -->
  <span v-if="customerItem.custScore||customerItem.custScore==0" class="rank-box" :title="$t('mxpcweb.client.1529057021459')">
    <span class="font-white score"><i class="iconfont icon-thumb scale"></i>{{customerItem.custScore}}</span>
  </span>
  <!-- 评分 -->
  <span v-else :title="$t('mxpcweb.client.1529057021459')" class="rank-box" style="padding-right:2px;">
    <!-- 暂无评分 -->
    {{$t('mxpcweb.client.1529057007512')}}
  </span>
</div>
<span v-if="isFocusBill(customerItem.focusTargets)&&viewType!='seas'" class="starBox">
  <i class="iconfont icon-star-card" style="font-size:16px;"></i>
</span>
</li>
</ul>
</template>
</div>
</template>

<script>
import { commentsColor, isArray } from '@/libs/utils.js'
import detailOpt from '../../detailOpt/index'
import showLabel from './showLabel/index.vue'
import ListShow from '@/components/ListShowControls/index.js'
export default {
    name: 'customerItem',
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
            dynamicsType: Object.freeze([
                '',
                this.$t('mxpcweb.client.1529045936384'),
                this.$t('mxpcweb.client.1529056976908'),
                this.$t('mxpcweb.client.1529056959076'),
                this.$t('mxpcweb.client.1529056941188'),
                this.$t('mxpcweb.client.1529056921708'),
                this.$t('mxpcweb.client.1529056897952'),
                this.$t('mxpcweb.client.1529056877668'),
                this.$t('mxpcweb.client.1529056859354')
            ])
        }
    },
    props: {
        customerItem: {
            type: Object,
            default: () => ({
                name: '',
                time: '',
                avatar: '',
                color: ''
            })
        },
        controlData: {
            type: Object,
            default: () => ({
                checkedCities: []
            })
        },
        detailOpt: {
            type: Array,
            default: () => []
        },
        moduleStruct: {
            type: Object,
            default: () => ({
                fieldName: 'createDate'
            })
        },
        listSet: {
            type: Object,
            default: () => ({})
        },
        nowSort: {
            type: Object,
            default: () => ({
                fieldName: 'createDate'
            })
        },
        dynamicTags: {
            type: Array,
            default: () => []
        },
        moduleCode: {
            type: String,
            default: ''
        },
        isShowCheck: {
            type: Boolean,
            default: true
        },
        viewType: {
            type: String,
            default: ''
        },
        showCustoms: {
            type: Boolean,
            default: false
        }
    },
    created() {
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
        // 批注色彩
        setCommentsColor(flag) {
            return commentsColor(flag)
        },
        listaddTab(list) {
            if (this.$refs.elPopover) {
                if (isArray(this.$refs.elPopover)) {
                    this.$refs.elPopover.forEach(item => {
                        if (item.$refs.popper) {
                            item.$refs.popper.style.display = 'none'
                        }
                    })
                }
            }
            list.billId = list.custId
            list.billName = list.custName
            list.moduleCode = this.moduleCode
            this.$MXEventBus.emit('addTab', list)
        },
        getListData(upData) {
            this.$MXEventBus.emit('getListDatas', false, upData)
        }
    },
    components: Object.assign({
        'detail-opt': detailOpt,
        'show-label': showLabel
    }, ListShow)
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "../zh-cn.less";
@import "../en.less";
.trackName {
    line-height: 16px;
}
</style>
