<template>
    <div class="ListBox">
        <!-- 自动化策略 -->
        <page-title :title="$t('mxpcweb.am.1536044305010')" iconfont="icon-share-set">
        </page-title>
        <div class="strategyListBox">
            <div class="toolbar">
                <div class="pull-right">
                    <el-input class="search " placeholder="请输入策略名称" icon="search" v-model="searchKey" :on-icon-click="handleSearch" @keyup.enter.native="handleSearch">
                    </el-input>
                    <el-button type="primary" class="button " @click="$emit('create')">新建自动化策略</el-button>
                </div>
            </div>
            <div class="strategyList">
                <el-row class="listHeader">
                    <el-col class="listItem" :span="4">
                        策略名
                    </el-col>
                    <el-col class="listItem" :span="3">
                        所属模块
                    </el-col>
                    <el-col class="listItem" :span="3">
                        何时开始
                    </el-col>
                    <el-col class="listItem" :span="3">
                        描述
                    </el-col>
                    <el-col class="listItem" :span="3">
                        创建人
                    </el-col>
                    <el-col class="listItem" :span="3">
                        修改时间
                    </el-col>
                    <el-col class="listItem" :span="2">
                        启用
                    </el-col>

                </el-row>
                <div class="listBody MXscroll" :class="{'hasPage':page.total>page.size}">
                    <template v-if="!isLoading">
                        <item v-for="(item,index) in strategyList" :item="item" @remove="removeItem(index)" @lookDetail="$emit('lookDetail',item.strategyId)" :key="item.strategyId"></item>
                    </template>
                </div>
                <div class="paging" v-if="page.total>page.size">
                    <el-pagination @current-change="changePage" background layout="total,prev, pager, next" :page-size="page.size" :current-page="page.now" :total="page.total">
                    </el-pagination>
                </div>
                <loading v-if="isLoading"></loading>
                <no-data v-if="!isLoading&&page.total<=0" style="background:rgba(255,255,255,0)"></no-data>
            </div>
        </div>
    </div>
</template>

<script>
import PageTitle from '@/components/PageTitle/index'
import NoData from '@/basecomponents/NoData/index'
import Loading from '@/basecomponents/Loading/index.vue'
import Item from './Item'
export default {
    name: 'List',
    data() {
        return {
            isLoading: false,
            searchKey: '',
            strategyList: [],
            page: {
                now: 1,
                size: 10,
                total: 0
            },
            previousRequest: null
        }
    },
    created() {
        this.getList()
    },
    methods: {
        /* 搜索 */
        handleSearch() {
            this.page.now = 1
            this.getList()
        },

        removeItem(index) {
            /*  this.strategyList.splice(index, 1) */
            this.getList(true)
        },
        changePage(i) {
            this.page.now = i
            this.getList()
        },

        getList(isReload = false) {
            if (!isReload) {
                this.isLoading = true
            }
            let url = this.Global.baseURL + this.Global.api.v2.autoStrategy_strategy
            let params = {
                type: 'list',
                pageN: this.page.now,
                pageSize: this.page.size,
                sort: 'createDate',
                order: 'DESC'
            }
            if (this.searchKey) {
                Object.assign(params, { wildWords: this.searchKey })
            }
            let data = {
                params,
                before(request) {
                    if (this.previousRequest) {
                        this.previousRequest.abort()
                    }
                    this.previousRequest = request
                }
            }
            this.$http.get(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.strategyList = res.body.data.list
                        this.page.total = res.body.data.totalNum
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                    this.isLoading = false
                })
                .catch(err => {
                    if (err.status == 0) {
                        return false
                    }
                    this.isLoading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        }
    },
    components: {
        'page-title': PageTitle,
        'no-data': NoData,
        'loading': Loading,
        'item': Item
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
