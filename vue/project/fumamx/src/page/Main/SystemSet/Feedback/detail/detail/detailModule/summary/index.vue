<template>
    <div class="summary">
        <div class="title">
            <div class="titleList">
                <!-- 问题标题： -->
                <span class="titleIcon">?</span>
                <span class="titleContent1">{{feedbackDetail.caption}}&nbsp;</span>
            </div>
            <div class="titleList titleList1">
                <span>
                {{$t('mxpcweb.systemset.feedback.1529065210353')}}:
                <span class="titleContent">{{feedbackDetail.workCode}}</span>
                </span>
                <span style="margin-left:80px;">
                {{$t('mxpcweb.systemset.feedback.1529065381426')}}:
                <span class="titleContent">{{feedbackDetail.createDate}}</span>
                </span>
                <span style="margin-left:80px;">
                {{$t('mxpcweb.systemset.feedback.1529065457990')}}:
                <span class="titleContent">{{returnWorkState('21', feedbackDetail.workState)}}</span>
                </span>
                <!-- 关闭问题 -->
                <span :title="$t('mxpcweb.systemset.feedback.1529066288158')" v-if="feedbackDetail.workState=='1'||feedbackDetail.workState=='2'" class="close text-hover"   @click="$emit('PopupClick', {optCode: 'otCloseWork', optModuleCode: 'WO001'})">
                    {{$t('mxpcweb.systemset.feedback.1529066288158')}}
                </span>
                <!-- 重新开启 -->
                <span :title="$t('mxpcweb.systemset.feedback.1529066671059')" v-if="feedbackDetail.workState=='4'" class="close text-hover"   @click="$emit('PopupClick', {optCode: 'otReopen', optModuleCode: 'WO001'})">
                    {{$t('mxpcweb.systemset.feedback.1529066671059')}}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'summaryVue',
    props: {
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
        ...mapGetters([
            'sysBoxValue'
        ])
    },
    methods: {
        returnWorkState (dictCode, value) {
            let options = []
            let name = ''
            if (this.sysBoxValue instanceof Array) {
                this.sysBoxValue.forEach(element => {
                if (element.dictCode == dictCode) {
                    options = element.dictItems
                }
                })
            }
            options.forEach(element => {
                if (element.dictItemCode == value) {
                    name = element.itemName
                }
            })
            return name
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
