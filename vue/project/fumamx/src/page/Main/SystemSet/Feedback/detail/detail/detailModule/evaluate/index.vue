<template>
    <div class="linkUp">
        <div class="titleList">
            评价
        </div>
        <div class="historyContent">
            <div  class="historyContentBox">
                <template v-if="feedbackDetail.score != 0">
                    <div class="historyContentImg">
                        <img class="avatar" v-imgsrc="avatarSrc()">
                    </div>
                    <div class="historyContentMsg">
                        <div>
                            <span>
                                {{returnCtIdName(feedbackDetail.ownerCtId)}}
                            </span>
                        </div>
                        <div style="line-height:24px;height:30px">
                            <span style="float:left">
                                <!-- 推荐指数： -->
                                {{$t('mxpcweb.systemset.feedback.1529066372363')}}：
                            </span>
                            <el-rate style="float:left;padding:0 10px;" v-model="feedbackDetail.score" :texts="evaluateText" text-color="rgb(247, 186, 42)" show-text></el-rate>
                            <div class="starMask"></div>
                        </div>
                        <div>
                            <span>
                                <!-- 评价内容 -->
                                <!-- 无建议和意见 -->
                                {{$t('mxpcweb.systemset.feedback.1529066398319')}}：{{feedbackDetail.evaluate==""?$t('mxpcweb.systemset.feedback.1529066411038'):feedbackDetail.evaluate}}
                            </span>
                        </div>
                        <div style="font-size:12px">
                            {{feedbackDetail.modifyDate}}
                        </div>
                    </div>
                </template>
                <div v-else-if="feedbackDetail.ownerCtId == optCtId" class="historyContentMsg">
                    <!-- 您尚未做出评价,是否立即评价? -->
                    {{$t('mxpcweb.systemset.feedback.1529066429522')}}
                    <!-- 评价 -->
                    <span class="text-hover" style="color:#6CA2FF;margin-left:10px;" @click="$emit('PopupClick', {optCode: 'otEvaluate', optModuleCode: 'WO001'})">{{$t('mxpcweb.systemset.feedback.1529066447183')}}</span>
                </div>
                <div v-else class="historyContentMsg">
                    <!-- 此用户尚未做出评价 -->
                    {{$t('mxpcweb.systemset.feedback.1529066461495')}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'linkUp',
    props: {
        optCtId: {
            type: String,
            default: ''
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
            // ['1.0  产品功能差', '2.0  产品功能一般', '3.0  产品功能还行', '4.0  产品很稳定，愿意推荐', '5.0  产品很好用，非常愿意推荐']
            evaluateText: [this.$t('mxpcweb.systemset.feedback.1529066792860'), this.$t('mxpcweb.systemset.feedback.1529066807345'), this.$t('mxpcweb.systemset.feedback.1529066810103'), this.$t('mxpcweb.systemset.feedback.1529066818838'), this.$t('mxpcweb.systemset.feedback.1529066839511')]
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
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
