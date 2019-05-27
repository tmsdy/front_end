<template>
    <div @click="disabled?'':$emit('select')" class="ellipsis list-item" :class="{'active':selectedValue===value,'disabled':disabled}">
        <span class="list-item-text">{{label}}</span>
    </div>
</template>

<script>
export default {
    name: 'Item',
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        selectedValue: {
            type: [Number, String, Object],
            default: ''
        },
        value: {
            type: [Number, String, Object],
            default: ''
        },
        label: {
            type: [Number, String],
            default: ''
        }
    },
    data() {
        return {

        }
    },
    methods: {

    },
    components: {

    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
