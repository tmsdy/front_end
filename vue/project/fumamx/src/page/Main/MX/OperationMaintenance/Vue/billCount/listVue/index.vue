<template>
    <div>
        <div class="title">
            <i class="iconfont" :class="itemData.iconfont" style="font-size: 24px;position:relative;top:2px;"></i>
            <span style="font-weight:500;">
                {{itemData.label}}
            </span>
        </div>
        <div class="contentBox" v-if="itemData.value">
            <div class="list" v-for="(item, index) in itemData.value" :key="index">
                <div class="listCount">
                    <strong class="text-hover">{{item.value}}</strong>
                </div>
                <div class="listTitle">
                    {{item.label}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/**
 * 运维管理
 * 何俊峰
 * 2018-11-18
 */
export default {
    name: 'allCount',
    props: {
        itemData: {
            type: Object,
            default: function() {
                return {
                    label: '',
                    value: []
                }
            }
        }
    },
    data() {
        return {
        }
    },
    created() {
    },
    methods: {
    },
    components: {
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
