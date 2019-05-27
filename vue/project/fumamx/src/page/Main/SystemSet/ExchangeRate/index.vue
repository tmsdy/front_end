<template>
    <div class="mainWrap ApplicationCenter">
        <!--大标题-->
        <!-- 应用中心 -->
        <!-- <page-title :showTitle="false" :title="$t('mxpcweb.systemset.accountsettings.1530586689576')" iconfont="icon-apps"></page-title> -->

        <el-tabs v-model="activeName" class="subTabs-pullRight" @tab-click="handleClick">
            <!-- 许可信息 -->
            <el-tab-pane label="业务参数" name="first">
            </el-tab-pane>
            <!-- 当前应用 -->
            <el-tab-pane label="出口公司" name="second">
            </el-tab-pane>
            <!-- 购买记录 -->
            <el-tab-pane label="汇率管理" name="third">
                <div ref="RateManageBox">
                    <rate-manage ref="RateManage" class="mainBodyTab" :tableHeight="tableHeight" />
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import PageTitle from '@/components/PageTitle/index' // 大标题
import RateManage from './RateManage/index'

export default {
    name: 'ExchangeRate',
    props: {},
    data() {
        return {
            activeName: 'third',
            tableHeight: 300
        }
    },
    created() {
    },
    mounted() {
        setTimeout(() => {
            this.getWinHeight()
        }, 200)
        $(window).resize(() => {
            this.getWinHeight()
        })
    },
    computed: {
    },
    methods: {
        handleClick(tab, event) {
            // console.log(tab, event)
        },
        // 设置固定高
        getWinHeight() {
            let winHeight = document.body.clientHeight
            this.$refs.RateManageBox.style.height = winHeight - 130 + 'px'
            this.tableHeight = winHeight - 130
        }
    },
    watch: {
        // '$route': function (val, old) {
        //     if (val.path == this.routeUrl) {

        //     }
        // }
    },
    components: {
        'page-title': PageTitle,
        'rate-manage': RateManage
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
