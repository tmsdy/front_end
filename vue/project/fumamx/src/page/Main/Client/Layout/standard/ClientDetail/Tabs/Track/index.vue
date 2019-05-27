<template>
    <div class="Track" style="padding:0 15px;">
        <track-detail-body v-if="isShow" ref="trackDetailBody" :moduleCode="moduleCode" :pageId="pageId" />
    </div>
</template>
<script>
import TrackDetailBody from '@/basecomponents/TrackDetailBody/index'
export default {
    name: 'Track',
    props: {
        moduleCode: {
            type: String,
            default: ''
        },
        pageId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isShow: false
        }
    },
    created() {

    },
    mounted() {

    },
    methods: {
        getTabData() {
            this.isShow = true
            this.$nextTick(_ => {
                this.$refs.trackDetailBody.getCustAboutData()
            })
        }
    },
    components: {
        'track-detail-body': TrackDetailBody
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
// @import "./zh-cn.less";
// @import "./en.less";
</style>
