<template>
    <div class="showList MXscroll">
        <div class="listBox">
            <div class="list" v-for="(item, index) in list" :key="index">
                <template v-if="item.nodeStatus == '2'">
                    <div class="time">{{timeShow_custom(item.followDate, 'YYYY-MM-DD HH:mm:ss')}}</div>
                    <div class="content">更新状态为{{returnTaskStatus(item.taskStatus)}}</div>
                    <div class="content">
                        <span v-if="item.createCtId">
                            [{{contactList[item.createCtId] || ''}}]
                        </span>
                        {{item.followDesc}}
                    </div>
                    <div :class="index == (list.length - 1) ? 'line1' : 'line'">
                        <span class="circular" :class="getColor(item.taskStatus)">
                            <div class="name ellipsis" :title="item.nodeName">
                                {{item.nodeName}}
                            </div>
                        </span>
                    </div>
                </template>
                <template v-else-if="item.nodeStatus == '1'">
                    <div class="time">{{timeShow_custom(item.receiptDate, 'YYYY-MM-DD HH:mm:ss')}}</div>
                    <div class="content">添加了一笔{{item.proceeds}}收款</div>
                    <div class="content">
                        <span v-if="item.createCtId">
                            [{{contactList[item.createCtId] || ''}}]
                        </span>
                        {{item.receiptDesc}}
                    </div>
                    <div :class="index == (list.length - 1) ? 'line1' : 'line'">
                        <span class="circular" :class="getProgressColor(item.progress)">
                            <div class="name ellipsis" :title="item.nodeName">
                                {{item.nodeName}}
                            </div>
                        </span>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
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
                    return '未开始'
                } else if (taskStatus == '2') {
                    return '进行中'
                } else if (taskStatus == '3') {
                    return '完成'
                } else if (taskStatus == '4') {
                    return '跳过'
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
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
    .showList{
        width:100%;
        height:190px;
        overflow: auto;
        // box-shadow:0px 2px 5px 0px rgba(0,0,0,0.1);
        border-radius:3px;
        background: white;
        padding-left: 80px;
        padding-top: 10px;
        .listBox{
            .list{
                padding-bottom: 8px;
                padding-right: 14px;
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
                        .name{
                            position: relative;
                            width: 50px;
                            right: 100%;
                            margin-left: -44px;
                            margin-top: -8px;
                        }
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
