<template>
    <div class="optItemBox">
        <div class="itemLine" v-if="item.nodeStatus == '1'" :title="item.progress ? parseInt(item.progress) + '%' : '0%'" :style="'width:' + (item.progress ? parseInt(item.progress) + '%' : '0%')" :class="'lineBg' + getProgressColor(item.progress)">
            <div class="nodeProgress" v-if="isProgress && finStatus != '0'">
                <i class="iconfont icon-qipao"></i>
                <div class="nodeProgressBlock" :class="'qipaoColor' + getProgressColor(item.progress)" :style="'height:' + (item.progress ? parseInt(item.progress) + '%' : '0%')">
                    <i class="iconfont icon-qipao"></i>
                </div>
                <div class="text">{{item.progress ? parseInt(item.progress) + '%' : '0%'}}</div>
            </div>
        </div>
        <template v-else>
            <div class="itemLine" v-if="!item.taskStatus || item.taskStatus == '1'" :class="'lineBg' + (item.taskStatus || '1')"></div>
            <div class="itemLine" v-else :class="'lineBg' + (item.taskStatus || '1')" style="width:100%;"></div>
        </template>
        <span class="optItemColorBox">
            <!-- <i v-if="item.taskStatus && item.taskStatus == '3'" class="iconfont optItemColor" style="color:white;font-size:12px;"  :class="['optItemColor' + (item.taskStatus || '1'), 'icon-finished']"></i>
            <i v-else-if="item.nodeUrl" class="iconfont optItemColor" style="color:white;font-size:12px;"  :class="['optItemColor' + (item.taskStatus || '1'), item.nodeUrl]"></i> -->
            <span v-if="item.nodeStatus && item.nodeStatus == '1'" class="optItemColor" :class="'optItemColor' + getProgressColor(item.progress)"></span>
            <span v-else class="optItemColor" :class="'optItemColor' + (item.taskStatus || '1')"></span>
        </span>
        <div class="optItemContentBox">
            <div class="contentTit">
                <template v-if="optCode=='otView' && item.chargeCtId != ''">
                    {{item.nodeName}}
                    <template v-if="isUse && isItemPeople() && item.taskStatus != '3' && item.taskStatus != '4'">
                        <span class="text-hover" @click="optClick(item, 'statusTask')">
                            <i class="iconfont icon-arrow-down-empty" style="font-size: 14px;"></i>
                        </span>
                        <span class="notice text-hover" @click.stop="optClick(item, 'notice')">
                            <i class="iconfont icon-notice" style="font-size: 14px;"></i>
                            <el-popover
                                placement="bottom"
                                width="240"
                                @click.stop
                                v-if="item.msgNum && item.msgNum != '0'"
                                @show="$refs.noticeList.getData()"
                                trigger="click">
                                <span @click.stop class="noticeNum" slot="reference">{{item.msgNum}}</span>
                                <notice-list @getData="getData" ref="noticeList" :itemData="item"></notice-list>
                            </el-popover>
                        </span>
                    </template>
                </template>
                <template v-else>
                    {{item.nodeName}}
                </template>
            </div>
            <template v-if="item.chargeCtId == ''">
                <!-- 未指派 -->
                <div v-if="isItemPeople()" class="text-hover" style="color:#008CEE" @click="assign()">{{$t('mxpcweb.sale.components.1557564834105')}}</div>
                <!-- 未指派 -->
                <div v-else style="color:#008CEE">{{$t('mxpcweb.sale.components.1557564834105')}}</div>
            </template>
            <template v-else>
                <div v-if="isItemPeople() && ((item.nodeStatus == '2' && (!item.taskStatus || (item.taskStatus != '3') && (item.taskStatus != '4'))) || (item.nodeStatus == '1' && finStatus != '-1' && finStatus != '2'))" class="peopleBox text-hover" @click="assign()">
                    <!-- 负责人(可修改) -->
                    <span :title="$t('mxpcweb.sale.components.1557564834331')">{{returnRealName(item.chargeCtId)}}</span>
                    <!-- 指定时间 -->
                    <span :title="$t('mxpcweb.sale.components.1557564616039')">{{item.deadline == '' ? item.deadline : timeShow_custom(item.deadline, 'YYYY-MM-DD')}}</span>
                </div>
                <div v-else class="peopleBox">
                    <!-- 负责人 -->
                    <span :title="$t('mxpcweb.sale.components.1557564615823')">{{returnRealName(item.chargeCtId)}}</span>
                    <!-- 指定时间 -->
                    <span :title="$t('mxpcweb.sale.components.1557564616039')">{{item.deadline == '' ? item.deadline : timeShow_custom(item.deadline, 'YYYY-MM-DD')}}</span>
                </div>
                <template>
                    <div v-if="item.strucId_2 && item.strucId_2.length > 0">
                        <div>
                            <div class="lastContent ellipsis" v-if="item.nodeStatus == '2'" :style="item.overdue == 1 ? 'padding-right:110px;' : ''" :title="item.strucId_2[0].followDesc + ' (' + timeShow_custom(item.strucId_2[0].followDate, 'MM-DD HH:mm') + ')'">
                                {{item.strucId_2[0].followDesc}}
                                <span class="time">
                                    ({{timeShow_custom(item.strucId_2[0].followDate, 'MM-DD HH:mm')}})
                                    <!-- 逾期 -->
                                    <span style="color:red;" v-if="item.overdue == 1">{{$t('mxpcweb.sale.components.1557564841949')}}</span>
                                </span>
                            </div>
                            <div class="lastContent ellipsis" :style="item.overdue == 1 ? 'padding-right:110px;' : ''" v-else-if="item.nodeStatus == '1'" :title="item.strucId_2[0].receiptDesc">
                                {{item.strucId_2[0].receiptDesc}}
                                <span class="time">
                                    ({{timeShow_custom(item.strucId_2[0].receiptDate, 'MM-DD HH:mm')}})
                                    <!-- 逾期 -->
                                    <span style="color:red;" v-if="item.overdue == 1">{{$t('mxpcweb.sale.components.1557564841949')}}</span>
                                </span>
                            </div>
                        </div>
                        <el-popover
                            placement="bottom"
                            width="240"
                            trigger="click">
                            <span slot="reference" class="text-hover" style="margin-left:10px;">
                                <i style="font-size:12px;" class="el-icon-caret-bottom"></i>
                            </span>
                            <opt-list @getData="getData" :list="item.strucId_2" :nodeStatus="item.nodeStatus + ''" :nodeName="item.nodeName"></opt-list>
                        </el-popover>
                    </div>
                </template>
            </template>
        </div>
    </div>
</template>
<script>
import OptList from './OptList'
import NoticeList from './NoticeList'
import { mapGetters } from 'vuex'
export default {
    name: 'optList',
    props: {
        finStatus: {
            type: [String, Number],
            default: 'set'
        },
        optCode: {
            type: String,
            default: 'set'
        },
        orderId: {
            type: String,
            default: ''
        },
        doctryId: {
            type: String,
            default: ''
        },
        isUse: {
            type: Boolean,
            default: false
        },
        isProgress: {
            type: Boolean,
            default: false
        },
        item: {
            type: Object,
            default: () => {
                return {}
            }
        },
        ownerCtId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
        }
    },
    created() {
    },
    computed: {
        ...mapGetters([
            'contactList',
            'company'
        ])
    },
    methods: {
        getData() {
            this.$emit('getData')
        },
        isItemPeople() {
            return this.optCode == 'otNew' ? true : (this.company.ctId == this.ownerCtId || this.company.ctId == this.item.chargeCtId)
        },
        getProgressColor(progress) {
            if (this.finStatus == '-1' || this.finStatus == '2') {
                return '3'
            } else {
                if (!progress || progress == 0) {
                    return '1'
                }
                if (progress > 0 && progress < 100) {
                    return '2'
                }
                if (progress >= 100) {
                    return '3'
                }
            }
        },
        assign() {
            let itemObj = JSON.parse(JSON.stringify(this.item))
            itemObj.next = this.updata
            itemObj.doctryId = this.doctryId
            itemObj.orderId = this.orderId
            this.$emit('optClick', itemObj, 'assign')
        },
        updata(item) {
            if (item) {
                this.item.chargeCtId = item.chargeCtId || ''
                this.item.deadline = item.deadline || ''
            }
        },
        returnRealName(val) {
            if (val && val != '') {
                if (val == '${ownerCtId}') {
                    // 拥有人
                    return this.$t('mxpcweb.sale.components.1557564616443')
                } else {
                    return this.contactList[val]
                }
            }
            return ''
        },
        optClick(item, type) {
            let itemObj = JSON.parse(JSON.stringify(item))
            itemObj.doctryId = this.doctryId
            itemObj.orderId = this.orderId
            this.$emit('optClick', itemObj, type)
        }
    },
    components: {
        'opt-list': OptList,
        'notice-list': NoticeList
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
    .optItemBox{
        width: 212px;
        position: relative;
        display: inline-block;
        vertical-align: top;
        font-size: 12px;
        padding-top: 20px;
        padding-left: 3px;
        .optItemColorBox{
            position: absolute;
            left: 0;
            top: 0;
            display: inline-block;
            width: 20px;
            height: 20px;
            border-radius: 10px;
            padding-top: 4px;
            background: #f2f2f2;
            box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.05);
            text-align: center;
            z-index: 2;
            .optItemColor{
                display: inline-block;
                width: 12px;
                height: 12px;
                border-radius: 6px;
            }
            .optItemColor1{
                background: #909399;
            }
            .optItemColor2{
                background: #FFB735;
            }
            .optItemColor3{
                background: #00C2B3;
            }
            .optItemColor4{
                background: #D0021B;
            }
            .optItemColor5{
                background: #FFB735;
            }
        }
        .itemLine{
            position: absolute;
            left: 10px;
            top: 8px;
            height: 4px;
            border-radius: 2px;
            z-index: 1;
            .nodeProgress{
                position: absolute;
                top: -44px;
                width: 32px;
                height: 38px;
                left: 91%;
                margin-left: -16px;
                >i{
                    color: #F5F6F7;
                    font-size: 36px;
                    position: absolute;
                    top: -2px;
                    left: -2px;
                }
                .nodeProgressBlock{
                    overflow: hidden;
                    width: 100%;
                    height: 60%;
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    >i{
                        font-size: 37px;
                        position: absolute;
                        bottom: 0;
                        left: -2px;
                    }
                }
                .text{
                    width: 100%;
                    color: #222222;
                    font-size: 12px;
                    position: absolute;
                    top: 10px;
                    text-align: center;
                }
                .qipaoColor1{
                    color: #909399;
                }
                .qipaoColor2{
                    color: #FFB735;
                }
                .qipaoColor3{
                    color: #00C2B3;
                }
                .qipaoColor4{
                    color: #D0021B;
                }
            }
        }
        .lineBg1{
            background:linear-gradient(270deg,rgba(144, 147, 153, 0.2) 0%,rgba(144, 147, 153, 1) 100%);
        }
        .lineBg2{
            background:linear-gradient(270deg,rgba(255,220,101,1) 0%,rgba(255,183,53,1) 100%);
        }
        .lineBg3{
            background:linear-gradient(270deg,rgba(101,235,225,1) 0%,rgba(0,194,179,1) 100%);
        }
        .lineBg4{
            background:linear-gradient(270deg,rgba(255,105,124,1) 0%,rgba(208,2,27,1) 100%);
        }
        .lineBg5{
            background:linear-gradient(270deg,rgba(255,220,101,1) 0%,rgba(255,183,53,1) 100%);
        }
        .optItemContentBox{
            color: #909399;
            font-size: 12px;
            .contentTit{
                color: #222222;
                font-weight:500;
                font-size: 14px;
                margin-top: 8px;
                height: 16px;
                .notice{
                    display: none;
                    position: relative;
                    .noticeNum{
                        display: none;
                        width:16px;
                        height:16px;
                        background:rgba(208,2,27,1);
                        border-radius:12px;
                        text-align: center;
                        line-height: 16px;
                        color: white;
                        position: absolute;
                        top: -8px;
                        right: -8px;
                        font-size: 12px;
                    }
                    &:hover{
                        .noticeNum{
                            display: inline-block;
                        }
                    }
                }
            }
            >div{
                margin-top: 2px;
                .iconfont{
                    font-size: 12px;
                }
            }
            .lastContent{
                display: inline-block;
                min-width: 80px;
                max-width: 100%;
                padding-right: 80px;
                position: relative;
                .time{
                    position: absolute;
                    right: 5px;
                    top: 0px;
                    height: 14px;
                    line-height: 15px;
                }
            }
            &:hover{
                .contentTit{
                    .notice{
                        display: inline-block;
                    }
                }
            }
        }
    }
</style>
