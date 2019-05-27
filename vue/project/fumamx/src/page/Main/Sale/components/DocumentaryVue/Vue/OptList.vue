<template>
    <div class="showList MXscroll">
        <no-data v-if="list.length == 0" style="padding-top:10px;"></no-data>
        <div v-else class="listBox">
            <template v-if="nodeStatus == '2'">
                <div class="list" v-for="(item, index) in list" :key="index">
                    <div class="time">{{timeShow_custom(item.followDate, 'YYYY-MM-DD HH:mm:ss')}}</div>
                    <!-- 更新状态为 -->
                    <div class="content">{{$t('mxpcweb.sale.components.1557564842715')}}{{returnTaskStatus(item.taskStatus)}}</div>
                    <div class="content">
                        <span v-if="item.createCtId">
                            [{{contactList[item.createCtId] || ''}}]
                        </span>
                        {{item.followDesc}}
                    </div>
                    <div :class="index == (list.length - 1) ? 'line1' : 'line'">
                        <span class="circular" :class="getColor(item.taskStatus)"></span>
                    </div>
                </div>
            </template>
            <template v-else-if="nodeStatus == '1'">
                <div class="list" v-for="(item, index) in list" :key="index">
                    <div class="time">{{timeShow_custom(item.receiptDate, 'YYYY-MM-DD HH:mm:ss')}}</div>
                    <!-- 添加了一笔{{item.proceeds}}收款 -->
                    <div class="content">{{$t('mxpcweb.sale.components.1557564883885', {ok: item.proceeds})}}</div>
                    <div class="content">
                        <span v-if="item.createCtId">
                            [{{contactList[item.createCtId] || ''}}]
                        </span>
                        {{item.receiptDesc}}
                    </div>
                    <div :class="index == (list.length - 1) ? 'line1' : 'line'">
                        <span class="circular" :class="getProgressColor(item.progress)"></span>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import NoData from '@/basecomponents/NoData/index'
export default {
    name: 'optList',
    props: {
        nodeStatus: {
            type: String,
            default: ''
        },
        nodeName: {
            type: String,
            default: ''
        },
        list: {
            type: Array,
            default: () => {
                return []
            }
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
            'contactList'
        ])
    },
    methods: {
        returnTaskStatus(taskStatus) {
            if (taskStatus) {
                if (taskStatus == '1') {
                    // 未开始
                    return this.$t('mxpcweb.sale.components.1557564915723')
                } else if (taskStatus == '2') {
                    // 进行中
                    return this.$t('mxpcweb.sale.components.1557564915950')
                } else if (taskStatus == '3') {
                    // 完成
                    return this.$t('mxpcweb.sale.components.1557564916526')
                } else if (taskStatus == '4') {
                    // 跳过
                    return this.$t('mxpcweb.sale.components.1557564916333')
                }
            } else {
                return ''
            }
        },
        getProgressColor(progress) {
            if (!progress || progress == 0) {
                return 'color1'
            }
            if (progress > 0 && progress < 100) {
                return 'color2'
            }
            if (progress >= 100) {
                return 'color3'
            }
        },
        getColor(taskStatus) {
            if (taskStatus && taskStatus != '') {
                return 'color' + taskStatus
            } else {
                return 'color1'
            }
        }
    },
    components: {
        'no-data': NoData
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
    .showList{
        width:220px;
        height: 180px;
        overflow: auto;
        // box-shadow:0px 2px 5px 0px rgba(0,0,0,0.1);
        border-radius:3px;
        background: white;
        padding-left: 24px;
        .listBox{
            .list{
                padding-bottom: 8px;
                position: relative;
                .time{
                    font-size: 12px;
                    color: #909399;
                }
                .content{
                    color: #606266;
                }
                .time, .content{
                    min-height: 17px;
                    line-height: 17px;
                }
                .line{
                    background: #E9E9E9;
                }
                .line, .line1{
                    height: 100%;
                    width: 1px;
                    position: absolute;
                    left: -19px;
                    top: 4px;
                    .circular{
                        display: inline-block;
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        border: 1px solid #E9E9E9;
                        background: white;
                        position: absolute;
                        top: 0;
                        left: -4px;
                    }
                    .color1{
                        background: #909399;
                        color: #909399;
                        border-color: #909399;
                    }
                    .color2{
                        background: #FFB735;
                        color: #FFB735;
                        border-color: #FFB735;
                    }
                    .color3{
                        background: #00C2B3;
                        color: #00C2B3;
                        border-color: #00C2B3;
                    }
                    .color4{
                        background: #D0021B;
                        color: #D0021B;
                        border-color: #D0021B;
                    }
                    .color5{
                        background: #FFB735;
                        color: #FFB735;
                        border-color: #FFB735;
                    }
                }
            }
        }
    }
</style>
