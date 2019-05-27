<template>
    <div class="mainWrap AccountSettings">
        <!--大标题-->
        <!-- 账号设置 -->
        <page-title :showTitle="false" :title="$t('mxpcweb.systemset.accountsettings.1530510373418')" iconfont="icon-account-set"></page-title>

        <el-tabs v-model="activeName" @tab-click="handleClick" class="subTabs-pullRight">
            <!-- 个人资料 2018.8.28迁移到此 -->
            <el-tab-pane :label="$t('mxpcweb.systemset.personaldata.1530594235877')" name="add01"></el-tab-pane>

            <!-- 基本设置 -->
            <el-tab-pane :label="$t('mxpcweb.systemset.accountsettings.1530510511682')" name="first"></el-tab-pane>
            <!-- 语言和时区 -->
            <el-tab-pane :label="$t('mxpcweb.systemset.accountsettings.1530510559136')" name="second"></el-tab-pane>
        </el-tabs>
        <div class="mainBodyBox MXscroll">
            <personal-data v-if="activeName=='add01'" class="mainBodyTab"></personal-data>
            <basic-setting v-if="activeName=='first'" class="mainBodyTab"></basic-setting>
            <language-timezone v-if="activeName=='second'" class="mainBodyTab"></language-timezone>
        </div>
    </div>
</template>

<script>
/**
 * 描述：系统设置=>账号设置
 * 作者：向士健
 * 时间：2017/7/8
 */
import PageTitle from '@/components/PageTitle/index' // 大标题
import PersonalData from './Tabs/PersonalData/index'
import LanguageZone from './Tabs/LanguageZone/index'
import BasicSet from './Tabs/BasicSet/index'

export default {
    name: 'AccountSettings',
    props: {
    },
    data() {
        return {
            activeName: 'add01' // 当前活动的右tab
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
        // 点右上角的tab切换
        handleClick(tab, event) {
            // console.log(tab, event);
        }
    },
    components: {
        'page-title': PageTitle,
        'personal-data': PersonalData,
        'language-timezone': LanguageZone,
        'basic-setting': BasicSet
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
