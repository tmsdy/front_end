<template>

    <div class="ActionManage">
        <!-- 动作管理 -->
        <div class="pageTab" v-if="tabShow">
            <el-tabs class="subTabs-pullRight" v-model="activePage">
                <!-- 触发邮件-->
                <el-tab-pane :label="$t('mxpcweb.am.1543297977190')" name="0">
                </el-tab-pane>
                <!-- 提醒通知 -->
                <el-tab-pane label="提醒通知" name="1">
                </el-tab-pane>
                <!-- Webhook -->
                <!-- <el-tab-pane label="Webhook" name="3">
                    </el-tab-pane> -->
                <!-- 函数 -->
                <!-- <el-tab-pane label="函数" name="4">
                    </el-tab-pane> -->
                <!-- 短信通知 -->
                <!-- <el-tab-pane label="短信通知 " name="5">
                    </el-tab-pane> -->
            </el-tabs>
        </div>
        <mail-action v-if="activePage==0" @tabToggle="tabToggle"></mail-action>
        <notice-action v-if="activePage==1" @tabToggle="tabToggle"></notice-action>
    </div>
</template>
<script>
import MailAction from './MailAction'
import NoticeAction from './NoticeAction'
export default {
    name: 'ActionManage',
    data() {
        return {
            tabShow: true,
            activePage: 0,
            routeUrl: ''
        }
    },
    created() {
        this.routeUrl = this.$route.path
    },
    computed: {
    },
    methods: {
        tabToggle(bool) {
            this.tabShow = bool
        }
    },

    watch: {
        $route() {
            if (this.$route.path == this.routeUrl) {

            }
        }
    },
    components: {
        'mail-action': MailAction,
        'notice-action': NoticeAction
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
