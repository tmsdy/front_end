<template>
    <div class="FeedbackDetail">
        <detail v-if="tabData" ref="detail"></detail>
    </div>
</template>
<script>
import detail from './detail/index.vue'
export default {
    name: 'FeedbackDetail',
    props: {
    },
    data() {
        return {
            tabData: true,
            path: '',
            pathName: ''
        }
    },
    mounted() {
    },
    created() {
        // 缓存页面路由
        this.path = this.$route.path
        this.pathName = this.$route.name
    },
    mounted() {
    },
    computed: {
    },
    methods: {
    },
    components: {
        'detail': detail
    },
    watch: {
        '$route': function(val, old) {
            if (val.path !== this.path && val.name == this.pathName) {
                this.path = val.path
                this.$refs.detail.unit()
            }
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
