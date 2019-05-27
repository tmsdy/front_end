<template>
    <div class="mainWrap LogAction">
        <!-- 日志与行为 -->
        <page-title :showTitle="false" :title="$t('mxpcweb.systemset.logaction.1530341870584')" iconfont="icon-user-logs"></page-title>
        <el-tabs v-model="activeName" @tab-click="handleClick" class="subTabs-pullRight">
            <!-- 登录日志 -->
            <el-tab-pane :label="$t('mxpcweb.systemset.logaction.1530341926896')" name="log"></el-tab-pane>

            <!-- 用户行为 -->
            <el-tab-pane :label="$t('mxpcweb.systemset.logaction.1530341950097')" name="action"></el-tab-pane>
        </el-tabs>

        <login-Log v-if="pageCache.includes('log')" v-show="activeName=='log'" ref="log" :pickerOptions="pickerOptions" class="mainBodyTab"></login-Log>
        <user-action v-if="pageCache.includes('action')" v-show="activeName=='action'" ref="action" :pickerOptions="pickerOptions" class="mainBodyTab"></user-action>

    </div>
</template>

<script>
/**
 * 描述：系统设置=>日志与行为
 * 作者：向士健
 * 时间：2017/10/11
 */
import PageTitle from '@/components/PageTitle/index.vue'
import loginLog from './Tabs/loginLog/index.vue'
import userAction from './Tabs/userAction/index.vue'

export default {
    name: 'LogAction',
    props: {

    },
    data() {
        return {
            pickerOptions: Object.freeze({
                shortcuts: [{
                    /* 最近一周 */
                    text: this.$t('mxpcweb.systemset.logaction.1530345277441'),
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    /* 最近一个月  */
                    text: this.$t('mxpcweb.systemset.logaction.1530345304623'),
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    /* 最近三个月 */
                    text: this.$t('mxpcweb.systemset.logaction.1530345327648'),
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                        picker.$emit('pick', [start, end])
                    }
                }]
            }),
            activeName: 'log', // 当前活动的右tab,
            pageCache: ['log']
        }
    },
    created() {

    },
    mounted() {
        this.$refs[this.activeName].getData()
    },
    methods: {
        handleClick(tab, event) {
            if (!this.pageCache.includes(this.activeName)) {
                this.pageCache.push(this.activeName)
                this.$nextTick(() => {
                    this.$refs[this.activeName].getData()
                })
            } else {
                this.$refs[this.activeName].getData()
            }
        }
    },
    watch: {
        $route() {
            if (this.$route.path === '/main/systemset/logaction' ||
                this.$route.path === '/main/systemset/logaction/') {
                this.$refs[this.activeName].getData()
            }
        }
    },
    components: {
        'page-title': PageTitle,
        'login-Log': loginLog,
        'user-action': userAction
    }

}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
