<template>
    <div class="BehaviorTrackDetail">
        <page-title title="" iconfont=""> </page-title>
        <!-- 返回 -->
        <el-button class="backBtn" size="small" @click="$router.push('/main/am/behaviorTrack/list')">{{$t('mxpcweb.am.1532586428420')}}</el-button>
        <div class="breadNav" v-if="tableData3.length > 0">
            <!-- 行为跟踪 -->
            <span class="text-hover" @click="$router.push('/main/am/behaviorTrack/list')">{{$t('api-am.1542271554050')}}</span> &nbsp;&gt;
            <span v-if="VisitorNum!=''">{{$t('mxpcweb.am.1550714321029',{a:VisitorNum})}}</span>
            <span v-else>{{ tableData3[0].email }}</span>
        </div>
        <div class="bodyWrap MXscroll">
            <track-detail-body @success="updata" />
        </div>
    </div>
</template>
<script>
import PageTitle from '@/components/PageTitle/index'
import TrackDetailBody from '@/basecomponents/TrackDetailBody/index'
export default {
    name: 'BehaviorTrackDetail',
    data() {
        return {
            isLoading: false,
            tableData3: [],
            VisitorNum: ''
        }
    },
    created() {

    },
    methods: {
        updata(data, VisitorNum) {
            this.tableData3 = data
            this.VisitorNum = VisitorNum
        }
    },
    components: {
        'page-title': PageTitle,
        'track-detail-body': TrackDetailBody
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
