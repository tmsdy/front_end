<template>
    <div class="List">
        <bill-list></bill-list>
    </div>
</template>

<script>
import billList from '@/page/Main/Client/Layout/standard/ClientManagIndex/index.vue'
export default {
    name: 'List',
    props: {
    },
    data() {
        return {
        }
    },
    created() {
    },
    computed: {
    },
    methods: {
    },
    watch: {
    },
    components: {
        'bill-list': billList
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
