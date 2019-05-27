<template>
    <div class="ConditionShow">
        <con-item v-for="(item,index) in conditions" :item="item" :modules="modules" :logic="expression[index]" :isLast="index==conditions.length-1" :key="index"></con-item>
    </div>
</template>

<script>
import ConItem from './ConItem'
export default {
    name: 'ConditionShow',
    props: {
        conditions: {
            type: Array,
            default: () => []
        },
        logicExpression: {
            type: String,
            default: ''
        },
        modules: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {

        }
    },
    computed: {
        expression() {
            return this.logicExpression.match(/\||\&/g) || []
        }
    },
    methods: {

    },
    components: {
        'con-item': ConItem
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
