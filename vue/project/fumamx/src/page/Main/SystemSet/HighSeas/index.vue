<template>
    <div class="mainWrap HighSeas">
        <!--公海设置-->
        <page-title :showTitle="false" :title="$t('mxpcweb.systemset.highseas.1528791504519')" iconfont="icon-high-seas-customer"></page-title>
        <template v-if="update" v-loading="loading">
            <!-- <hr class="no-el-tabs">  -->
            <el-tabs v-model="activeName" class="subTabs-pullRight" style="height:100%">
                <!--公海设置-->
                <el-tab-pane :label="$t('mxpcweb.systemset.highseas.1528791504519')" name="first">
                    <seas-set class="mainBodyTab" v-if="activeName=='first'" ref="seasSet" @closeLoad="closeLoad"></seas-set>
                </el-tab-pane>
                <!--公海规则-->
                <el-tab-pane :label="$t('mxpcweb.systemset.highseas.1528791752939')" name="two">
                    <seas-list class="mainBodyTab" v-if="seasActive||activeName=='two'" ref="seasList" @closeLoad="closeLoad"></seas-list>
                </el-tab-pane>
                <!--公海规则-->
                <el-tab-pane :label="$t('mxpcweb.systemset.highseas.1528791793228')" name="three">
                    <cust-list class="mainBodyTab" v-if="custActive||activeName=='three'" ref="custList" @closeLoad="closeLoad"></cust-list>
                </el-tab-pane>
            </el-tabs>
        </template>
    </div>
</template>

<script>
import PageTitle from '@/components/PageTitle/index' // 大标题
import seasList from './seasList/index'
import seasSet from './seasSet/index'
import custList from './custList/index'
export default {
    name: 'HighSeas',
    props: {

    },
    data() {
        return {
            activeName: 'first', // 当前活动的右tab
            seasList: 'seasList',
            custList: 'custList',
            seasActive: false,
            custActive: false,
            routeUrl: '',
            update: true,
            loading: true
        }
    },
    mounted() {

    },
    created() {
        this.routeUrl = this.$route.path
    },
    mounted() {
    },
    methods: {
        closeLoad() {
            let _this = this
            setTimeout(function () {
                _this.loading = false
            }, 200)
        }
    },
    components: {
        'page-title': PageTitle,
        'seas-list': seasList,
        'cust-list': custList,
        'seas-set': seasSet
    },
    watch: {
        activeName(value) {
            if (!this.seasActive && value == 'two') {
                this.seasActive = true
            } else {
                this.seasActive = false
            }
            if (!this.custActive && value == 'three') {
                this.custActive = true
            } else {
                this.custActive = false
            }
        },
        '$route': function (val, old) {
            let _this = this
            if (val.path == this.routeUrl) {
                _this.update = true
            } else {
                if (this.update) {
                    this.update = false
                    this.loading = true
                }
            }
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
