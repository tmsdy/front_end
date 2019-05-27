<template>
    <div class="mainWrap ScheduleRemind">
        <!--大标题-->
        <!-- 日程和提醒 -->
        <page-title :showTitle="false" :title="$t('mxpcweb.systemset.scheduleremind.1530348935365')" iconfont="icon-notice-solid"></page-title>
        <el-tabs v-model="activeName" class="subTabs-pullRight" @tab-click="refreshList">
            <!--待处理  -->
            <el-tab-pane :label="$t('mxpcweb.systemset.scheduleremind.1530348919612')" name="first">
                <current class="mainBodyTab" ref="current"></current>
            </el-tab-pane>
            <!--日程  -->
            <el-tab-pane :label="$t('mxpcweb.systemset.scheduleremind.1530348904963')" name="two">
                <schedule class="mainBodyTab" ref="schedule"></schedule>
            </el-tab-pane>
            <!-- 历史 -->
            <el-tab-pane :label="$t('mxpcweb.systemset.scheduleremind.1530348868613')" name="three">
                <history class="mainBodyTab" ref="history"></history>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
/**
 * 描述：系统设置=>日志和提醒
 * 作者：高俊峰
 * 时间：2017/7/30
 */
import PageTitle from '@/components/PageTitle/index'
import Current from './Current/index'
import Schedule from './Schedule/index'
import History from './History/index'
export default {
    name: 'ScheduleRemind',
    props: {

    },
    data() {
        return {
            activeName: 'first'// 当前活动的右tab
        }
    },
    created() {
        let _this = this
        // 暴露全局方法
        ep.tail('refreshScheduleRemindList', function () {
            _this.refreshList()
        })
    },
    methods: {
        refreshList() {
            this.$refs['current'].refreshList()
            this.$refs['schedule'].refreshList()
            this.$refs['history'].refreshList()
        }
    },
    components: {
        'page-title': PageTitle,
        'current': Current,
        'schedule': Schedule,
        'history': History
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
