<template>
    <div class="OperationMaintenance mainWrap" v-if="show">
        <tab-list ref="pageItem2" @tabChange="tabChange" v-show="tabData == '2'"></tab-list>
        <tab-index ref="pageItem" @tabChange="tabChange" v-if="tabData == '1'"></tab-index>
        <tab-detail ref="pageItem" @tabChange="tabChange" v-else-if="tabData == '3'" :itemData="detailItem"></tab-detail>
    </div>
</template>

<script>
/**
 * 运维管理
 * 何俊峰
 * 2018-11-18
 */
import tabIndex from './tab/tabIndex/index'
import tabList from './tab/tabList/index'
import tabDetail from './tab/tabDetail/index'
export default {
    name: 'OperationMaintenance',
    data() {
        return {
            moduleCode: '',
            tabData: '1',
            detailItem: {},
            pageUrl: '',
            show: true
        }
    },
    created() {
        this.pageUrl = this.$route.path
    },
    methods: {
        tabChange(value, item) {
            if (value == '3') {
                this.detailItem = item
            }
            this.tabData = value
            if (this.$refs.pageItem2) {
                this.$nextTick(() => {
                    this.$refs.pageItem2.getListData()
                })
            }
        }
    },
    components: {
        'tab-index': tabIndex,
        'tab-list': tabList,
        'tab-detail': tabDetail
    },
    watch: {
        $route(val, old) {
            if (val.path === this.pageUrl) {
                this.show = true
            } else {
                this.tabData = '1'
                this.show = false
            }
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../../public-zh-cn.less";
@import "../../public-en.less";
@import "./zh-cn.less";
@import "./en.less";
</style>
