<template>
    <div class="summary">
        <div class="titleList" v-for="(item,index) in summarySet" :key="index">
            <span class="titleContent">{{feedbackDetail[item.fieldName]}}</span>
        </div>
        <template v-if="feedbackDetail.workState == '4'&&feedbackDetail.ownerCtId==optCtId">
            <el-button size="small" class="otReopen" v-for="(items, indexs) in detailOpt" v-if="items.optCode == 'otReopen'" :key="indexs + 'opt'" @click="$emit('PopupClick', items)">{{items.optName}}</el-button>
        </template>
    </div>
</template>

<script>
export default {
    name: 'summaryVue',
    props: {
        detailOpt: {
            type: Array,
            default: function () {
                return []
            }
        },
        optCtId: {
            type: String,
            default: ''
        },
        summarySet: {
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
