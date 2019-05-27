<template>
    <div class="List">
        <component v-bind:is="currentView"></component>
        <!-- 弹出框-嵌入表格-->
    </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import collectPage from './collectReport/index'
export default {
    name: 'fm-Tabs',
    props: {},
    data() {
        return {
            // menuNavList: []
            currentView: 'collect-page',
            dialogVisible: false
        }
    },
    created() {
        // this.getMenuNavList()
    },
    computed: {
        // ...mapGetters([
        //     'navigator'
        // ])
    },
    methods: {
    },
    components: {
        'collect-page': collectPage
    },
    watch: {
        // 监听导航数据变化
        // navigator(val, old) {
        //     this.getMenuNavList()
        // },
        // $route() {
        //     this.toPage()
        // }
    }
}
</script>
<style lang="less">
.customReportDialog {
    .el-dialog--full {
        display: flex;
        flex-direction: column;
    }
    .el-dialog__body {
        flex: 1;
        width: 100%;
        padding: 0;
        height: 100%;
        overflow: hidden;
    }
}
</style>
<style lang="less" rel="stylesheet/less">
@import "./zh-cn.less";
@import "./en.less";
</style>
