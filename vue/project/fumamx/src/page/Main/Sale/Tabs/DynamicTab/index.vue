<template>
    <div class="DynamicTab">
        <component v-bind:is="currentView" @removeTab="removeTab" @updateTab="updateTab"></component>
    </div>
</template>

<script>
import detailPage from '../../Detail/index.vue'
import newPage from '../../New/index.vue'
import editPage from '../../Edit/index.vue'
export default {
    name: 'DynamicTab',
    props: {
        tabName: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            currentView: detailPage
        }
    },
    async created() {
        // 详情页，决定使用的布局
        let { viewName } = this.$route.params
        if (viewName == 'edit') {
            this.currentView = editPage
        } else if (viewName == 'new') {
            this.currentView = newPage
        } else {
            this.currentView = detailPage
        }
    },
    computed: {

    },
    methods: {
        removeTab() {
            this.$emit('removeTab', this.tabName)
        },
        updateTab(val) {
            this.$emit('updateTab', this.tabName, val)
        }
    },
    watch: {

    },
    components: {
       detailPage,
       newPage,
       editPage
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.DynamicTab{
    height:100%;
}
</style>
