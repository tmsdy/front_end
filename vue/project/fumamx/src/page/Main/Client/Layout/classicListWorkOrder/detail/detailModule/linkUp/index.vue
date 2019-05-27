<template>
    <div class="linkUp">
        <div class="titleList">
            沟通记录
        </div>
        <div class="historyContent">
            <template v-if="orderRecd&&orderRecd.length>0">
                <div v-if="orderRecd&&orderRecd.length>0" class="historyContentBox" v-for="(item,index) in orderRecd" :key="index">
                    <div class="historyContentImg">
                        <img class="avatar"  v-imgsrc="avatarSrc(item.accountInfo.avatar)">
                        <!-- <img src="./u16684.jpg" alt=""> -->
                    </div>
                    <div class="historyContentMsg">
                        <span :style="item.modifyCtId!=feedbackDetail.ownerCtId?'color:black;font-weight:bold':''">
                            <span v-if="item.accountInfo">{{item.accountInfo.realName}}：</span>
                            {{item.recdContent}}
                        </span>
                        <div v-if="item.attachfile">
                            <orderFileUpload ref="orderFileUpload" :fileList="item.attachfile" :billId="feedbackDetail.workId+''" isOverCid="1"></orderFileUpload>
                        </div>
                        <div class="modifyDate">
                            {{item.modifyDate}}
                        </div>
                    </div>
                </div>
            </template>
            <div v-else class="historyContentNo">
                暂无沟通记录
            </div>
        </div>
    </div>
</template>

<script>
import orderFileUpload from '@/components/orderFileUpload/showList'
export default {
    name: 'linkUp',
    props: {
        orderRecd: {
            type: Array,
            default: function () {
                return []
            }
        },
        owners: {
            type: Array,
            default: function () {
                return []
            }
        },
        feedbackDetail: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data() {
        return {
        }
    },
    mounted() {

    },
    created() {
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        // 图像
        avatarSrc(url) {
            if (!url || url.length === 0) {
                url = '3,107d091f7e2d' // 为空时，默认灰头像
            }
            return this.getGlobalImgSrc(url, '55x55')
        },
        returnCtIdName(itemCode) {
            let userName = ''
            this.owners.forEach(element => {
                if (element.ctId == itemCode) {
                    userName = element.realName
                }
            })
            return userName
        }
    },
    components: {
    },
    watch: {
    },
    components: {
        'orderFileUpload': orderFileUpload
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
