<template>
    <div class="sliderMailDetail">
        <transition name="slider-customer">
            <div class="sliderBody" :class="windowMode ? 'windowMode' : ''" v-if="isOpen" v-loading="loading">
                <div class="header">
                    {{DetailDataList.subject}}
                    <!-- 关闭 -->
                    <span class="close text-hover" :title="$t('mxpcweb.client.detail.1529998142058')" @click="isOpen = false">
                        <i class="iconfont icon-close"></i>
                    </span>
                </div>
                <div class="body MXscroll" ref="mailDetail">
                    <detail-right :DetailDataList="DetailDataList" :content="content" ref="detail-right" :isSlider="true" @OperationTrigger="OperationTrigger"></detail-right>
                </div>
            </div>
        </transition>
        <puablic-action ref="puablicAction"></puablic-action>
    </div>
</template>

<script>
import { isObject, escape2Html } from '@/libs/utils.js'
import DetailRight from '@/page/Main/Mail/Home/DetailRight/index'
import puablicAction from '@/page/Main/Mail/Home/vue/puablicAction'
export default {
    name: 'sliderMailDetail',
    props: {
        windowMode: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isOpen: false,
            loading: true,
            mId: '',
            DetailDataList: {},
            content: '<a>j</a>'
        }
    },
    methods: {
        // 操作
        OperationTrigger(key, key2, key3, key4) {
            this.$refs.puablicAction.OperationTrigger(key, key2, key3, key4)
            console.log(key)
            console.log(key2)
        },
        // 打开抽屉
        show(mId) {
            this.isOpen = true
            this.loading = true
            this.mId = mId
            this.getData(mId) //
        },
        // 获取邮件详情
        getData(mId) {
            this.$http.get(this.Global.baseURL + this.Global.api.Mail.getMailCurrent, { params: { mId: mId, type: 'details' } }).then(function (res) {
                if (res.body.code.toString() == this.Global.RES_OK && isObject(res.body.data)) {
                    this.loading = false
                    let detailObject = res.body.data

                    this.DetailDataList = detailObject

                    this.content = detailObject.htmlContent == '' ? detailObject.content : detailObject.htmlContent
                    this.content = escape2Html(this.content) // 转义解析成html
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, function (res) {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        }
    },
    components: {
        'detail-right': DetailRight,
        'puablic-action': puablicAction
    },
    watch: {
        // 路由变化时，关闭
        $route(to, from) {
            this.isOpen = false
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
