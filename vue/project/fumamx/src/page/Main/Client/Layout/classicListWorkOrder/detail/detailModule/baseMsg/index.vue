<template>
    <div class="baseMsgBox">
        <div class="historyTitle">
            工单信息
        </div>
        <div class="baseMsgContent">
            <div class="baseMsgList" v-for="(item,index) in viewSet" :key="index">
                <span class="fieldName">{{item.cnFieldCaption}}</span>
                <component v-bind:is="'control'+item.controlTypeId" ref="control" :itemData="item"  :list="feedbackDetail" :value="{value:feedbackDetail[item.fieldName]}" :owners="owners" :dKeys="dKeys"></component>
            </div>
        </div>
    </div>
</template>

<script>
import ListShow from '@/components/ListShowControls/index.js'
export default {
    name: 'baseMsg',
    props: {
        viewSet: {
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
        },
        owners: {
            type: Array,
            default: function () {
                return []
            }
        },
        dKeys: {
            type: Array,
            default: function () {
                return []
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

    },
    components: {
    },
    watch: {
    },
    components: Object.assign({}, ListShow)
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
