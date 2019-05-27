<template>
    <div class="DynamicTab">
        <component v-bind:is="currentView"></component>
    </div>
</template>

<script>
import detailPage from '@/page/Main/Client/Layout/standard/ClientDetail/index.vue'
import woDetail from '@/page/Main/Client/Layout/classicListWorkOrder/detail/index.vue'
export default {
    name: 'DynamicTab',
    props: {

    },
    data() {
        return {
            currentView: detailPage
        }
    },
    async created() {
        let _this = this
        // 详情页，决定使用的布局
        let Route = this.getRoute()
        // let documentViewsetGet = await this.$http.get(this.Global.baseURL + this.Global.api.v2.document_viewset_get, { params: {
        //     moduleCode: _this.$route.params.moduleCode
        // }})
        let { viewLayout } = Route
        if (viewLayout == 'standard') {
            this.currentView = detailPage
        } else if (_this.$route.params.moduleCode == 'WO001') { // 后台配置前，先用这个判断
            this.currentView = woDetail
            // this.currentView = detailPage
        } else if (viewLayout == 'classicListCustomer') {
            this.currentView = detailPage
        }
    },
    computed: {

    },
    methods: {

    },
    watch: {

    },
    components: {
       detailPage
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.DynamicTab{
    height:100%;
}
</style>
