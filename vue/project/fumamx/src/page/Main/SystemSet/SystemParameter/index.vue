<template>
    <div class="mainWrap SystemParameter">
        <!--大标题-->
        <!-- 系统参数  -->
        <page-title :title="$t('mxpcweb.systemset.systemparameter.1530600083418')" :showTitle="false" iconfont="icon-system-parameter"></page-title>
        <el-tabs v-model="activeName" @tab-click="handleClick" class="subTabs-pullRight">
            <!-- 企业设置 2018.8.28迁移到此 -->
            <el-tab-pane :label="$t('mxpcweb.systemset.enterpriseset.1528941700600')" name="add01">
                <enterprise-set class="mainBodyTab"></enterprise-set>
            </el-tab-pane>

            <!-- 域名设置 -->
            <el-tab-pane :label="$t('mxpcweb.systemset.systemparameter.1530350466635')" name="first">
                <domain-notice class="mainBodyTab"></domain-notice>
            </el-tab-pane>
            <!-- 本地化设置 -->
            <el-tab-pane :label="$t('mxpcweb.systemset.systemparameter.1530600118383')" name="second">
                <local-set class="mainBodyTab"></local-set>
            </el-tab-pane>
            <!-- 安全设置 -->
            <el-tab-pane :label="$t('mxpcweb.systemset.systemparameter.1530600144290')" name="third">
                <security-set class="mainBodyTab"></security-set>
            </el-tab-pane>

            <!-- <el-tab-pane :label="$t('mxpcweb.systemset.systemparameter.1535014287354')" name="thirdparty">
                <third-party class="mainBodyTab"></third-party>
            </el-tab-pane> -->
            <!-- 员工邮箱白名单 -->
            <el-tab-pane :label="$t('mxpcweb.systemset.systemparameter.1535511457393')" name="last">
                <staff-whitelist class="mainBodyTab"></staff-whitelist>
            </el-tab-pane>
            <!-- 微信小程序 -->
            <el-tab-pane label="微信小程序" name="thirdparty">
                <WeChart class="mainBodyTab" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import PageTitle from '@/components/PageTitle/index'
import EnterpriseSet from './Tabs/EnterpriseSet/index'
import SecuritySet from './Tabs/SecuritySet/index'
import LocalSet from './Tabs/LocalSet/index'
import DomainNotice from './Tabs/DomainNotice/index'
// import ThirdParty from './Tabs/ThirdParty/index'
import WeChart from './Tabs/WeChart/index'
import StaffWhitelist from './Tabs/StaffWhitelist/index'

export default {
    name: 'SystemParameter',
    props: {

    },
    data() {
        return {
            activeName: 'add01' // 当前活动的右tab
        }
    },
    created() {

    },
    methods: {
        // 点右上角的tab切换
        handleClick(tab, event) {
            // console.log(tab, event);
        }
    },
    components: {
        'page-title': PageTitle,
        'enterprise-set': EnterpriseSet,
        'security-set': SecuritySet,
        'local-set': LocalSet,
        'domain-notice': DomainNotice,
        // 'third-party': ThirdParty,
        WeChart,
        'staff-whitelist': StaffWhitelist
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
