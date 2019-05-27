<template>
    <div class="sendee MXscroll">
        <!--大标题-->
        <page-title title="短信营销" iconfont="icon-message">
        </page-title>
        <div class="pageTab">
            <el-tabs class="subTabs-pullRight" v-model="tabData">
                <el-tab-pane label="短信任务" name="0">
                </el-tab-pane>
                <el-tab-pane label="短信模板" name="1">
                </el-tab-pane>
                <el-tab-pane label="短信签名" name="2">
                </el-tab-pane>
            </el-tabs>
        </div>
        <tab1 v-if="tabData=='0'"></tab1>
        <tab2 v-if="tabData=='1'"></tab2>
        <tab3 v-if="tabData=='2'"></tab3>
    </div>
</template>

<script>
import PageTitle from '@/components/PageTitle/index' // 大标题
import tab1 from './vue/tab1' // 大标题
import tab2 from './vue/tab2' // 大标题
import tab3 from './vue/tab3' // 大标题
export default {
    name: 'messageMarketing',
    props: {

    },
    data() {
        return {
            tabData: '0'
        }
    },
    created() {
        let _this = this
        this.routeUrl = this.$route.path
        ep.tail('messageMarketingTopage', function(data) {
            _this.tabDataCheck(data.type, data)
        })
    },
    methods: {
        tabDataCheck(type, item) {
            this.tabData = type
        }
    },
    watch: {
        '$route': function(val, old) {
            if (val.path == this.routeUrl) {
                this.tabData = '0'
            }
        }
    },
    components: {
        'page-title': PageTitle,
        'tab1': tab1,
        'tab2': tab2,
        'tab3': tab3
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
