<template>
    <div class="developmentLetter">
        <!-- <div class="PageTitle">
            <i class="iconfont icon-letter"></i>
            <span>{{$t('mxpcweb.am.1531893092789')}}</span>
            <div style="float: right;">
                <el-tabs class="subTabs-pullRight" v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="我的开发信" name="first"></el-tab-pane>
                    <el-tab-pane label="模板市场" name="second"></el-tab-pane>
                </el-tabs>
            </div>
        </div> -->
        <page-title :showTitle="false"></page-title>
        <div class="pageTab">
            <el-tabs class="subTabs-pullRight" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="我的开发信" name="first"></el-tab-pane>
                <el-tab-pane label="模板市场" name="second"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="developmentLetter MXscroll">
            <development-letter2 v-if="activeName=='first'" ref="developmentLetter2"></development-letter2>
            <template-market v-if="activeName=='second'" @change="pickItem"></template-market>
        </div>
    </div>
</template>

<script>
import PageTitle from '@/components/PageTitle/index'
import templateMarket from '../templateMarket/index'
import developmentLetter2 from '../developmentLetter2/index'
export default {
    name: 'developmentLetter',
    props: {

    },
    data() {
        return {
            activeName: 'first'
        }
    },
    created() {
    },
    methods: {
        handleClick(tab, event) {
            this.activeName = tab.name
        },
        pickItem(item) {
            this.activeName = 'first'
            setTimeout(() => {
                this.$refs.developmentLetter2.checkRouteByTemplateMarket(item)
            }, 100)
        }
    },
    computed: {

    },
    watch: {
        // '$route': function (val, old) {
        //     // let _this = this
        //     // if (val.path == _this.routeUrl) {
        //     //     _this.tabData = '1'
        //     //     _this.getListData()
        //     // }
        // },
        // tabData: function (val, old) {
        //     // 切走了，就清空
        //     if (val != '2') {
        //         this.templateMarketId = ''
        //         this.isOpenDrag = false
        //     }
        // }
    },
    components: {
        'page-title': PageTitle,
        'template-market': templateMarket,
        'development-letter2': developmentLetter2
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
