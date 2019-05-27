/*
 * Discription: 我的关注(my follow)
 * -----
 * Created Date: Wednesday, 6th March 2019 10:35:36 am
 * Author: 郭兵 (guobing93@163.com)
 * -----
 * Last Modified: Wednesday, 6th March 2019 10:36:40 am
 * Modified By: name (email)
 */

<template>
    <div class="MyFollow">
        <div v-show="!isShowDetail&&!isShowCustomsDetail">
            <!-- 标题 -->
            <page-title :showTitle="false"></page-title>

            <!-- tabs -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick" class="tabBox subTabs-pullRight">
                <el-tab-pane v-for="(item,index) in tabNameEnum" :label="item.label" :name="item.value2" :key="index"></el-tab-pane>
            </el-tabs>
            <!-- 主体 -->
            <div class="mainBox MXscroll" :class="{'hasPage':page.total>page.size&&!isLoading}">

                <div class="cardBody clearfix ">
                    <template v-if="!isLoading">
                        <el-row :gutter="30">
                            <el-col v-for="(item,index) in list" :xs="24" :sm="8" :md="8" :lg="6" :key="index">
                                <card-item :item="item" :isSocial="isSocial" @customsFind="handleCustomsFind(item)" @lookDetail="handleLookDetail(item)"></card-item>
                            </el-col>
                        </el-row>
                    </template>
                    <!-- loading -->
                    <transition name="el-fade-in-linear">
                        <loading v-show="isLoading" class="atCenter"></loading>
                    </transition>
                    <!-- 没有记录 -->
                    <transition name="el-fade-in-linear">
                        <no-data v-show="list.length<=0&&!isLoading" class="noDataBox atCenter"></no-data>
                    </transition>
                </div>
            </div>
            <!-- 分页 -->
            <transition name="el-fade-in-linear">
                <div class="page" v-if="page.total>page.size&&!isLoading">
                    <el-pagination @current-change="changePage" background layout="total,prev,pager,next" :page-size="page.size" :current-page="page.now" :total="page.total">
                    </el-pagination>
                </div>
            </transition>
        </div>
        <find-dialog ref="findDialog"></find-dialog>
        <!-- 深挖详情 -->
        <find-detail v-if="isShowDetail" :id="detailItem.searchId" :companyInfo.sync="detailItem.company" @pageBack="handlePageBack()">
        </find-detail>
        <!-- 海关数据的详情 -->
        <customs-detail v-if="isShowCustomsDetail" :companyInfo="detailItem" :searchParams="searchParams" @pageBack="handlePageBack()"></customs-detail>
    </div>
</template>

<script>
import PageTitle from '@/components/PageTitle'
import NoData from '@/basecomponents/NoData/index'
import Loading from '@/basecomponents/Loading/index'
import CardItem from './CardItem'
import FindDetail from '../Vue/FindDetail'
import { FindDialog } from '@/components/DiscoveryItem'
import CustomsDetail from '../CustomsData/Detail'
export default {
    name: 'MyFollow',
    data() {
        return {
            isLoading: false,
            activeName: '1',
            tabNameEnum: Object.freeze([
                {
                    label: 'Facebook',
                    value: 'fb-pages',
                    value2: '1'
                },
                {
                    label: 'Linkedin',
                    value: 'linkedin',
                    value2: '2'
                },
                {
                    label: 'twitter',
                    value: 'twitter',
                    value2: '3'
                },
                {
                    label: '贸易大数据',
                    value: 'hs-data',
                    value2: '4'
                }
            ]),
            list: [],
            page: {
                now: 1,
                size: 20,
                total: 0
            },
            isShowDetail: false,

            isShowCustomsDetail: false,
            detailItem: '',
            previousRequest: null
        }
    },
    mounted() {

    },
    created() {
        this.getData()
    },
    computed: {
        isSocial() {
            return this.activeName !== '4'
        },
        searchParams() {
            return {
                keywords: this.detailItem.companyName,
                country: this.detailItem.country,
                inout: this.detailItem.companyType == 0 ? 'imp' : 'exp',
                type: '0',
                sort: '0'
            }
        }
    },
    methods: {
        handleTabClick() {
            this.page.now = 1
            this.page.total = 0
            this.getData()
        },
        handleCustomsFind(item) {
            this.$refs.findDialog.open(item, (is_deep, searchId) => {
                item.is_deep = is_deep
                if (is_deep == 3) {
                    item.searchId = searchId
                }
            })
        },
        handleLookDetail(item) {
            this.detailItem = item
            if (this.isSocial) {
                this.isShowDetail = true
            } else {
                this.isShowCustomsDetail = true
            }
        },
        handlePageBack(pageType) {
            if (this.isSocial) {
                this.isShowDetail = false
            } else {
                this.isShowCustomsDetail = false
            }
            this.detailItem = ''
        },
        changePage(i) {
            this.page.now = i
            this.getData()
        },
        async getData() {
            this.isLoading = true
            let resData = []
            let total = 0
            try {
                const url = this.Global.baseURL + this.Global.api.v2.find_attention

                let data = {
                    params: {
                        pageType: this.activeName,
                        page: this.page.now,
                        pageSize: this.page.size,
                        attentionType: this.activeName
                    },
                    before(request) {
                        if (this.previousRequest) {
                            this.previousRequest.abort()
                        }
                        this.previousRequest = request
                    }
                }
                let res = await this.$http.get(url, data)
                if (res.body.code.toString() === this.Global.RES_OK) {
                    resData = res.body.data.list || []
                    total = res.body.data.totalNum
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                if (error.status == 0) {
                    return
                }
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.list = resData
            this.page.total = total
            this.isLoading = false
        }
    },
    components: {
        'page-title': PageTitle,
        'card-item': CardItem,
        'find-detail': FindDetail,
        'no-data': NoData,
        'loading': Loading,
        'find-dialog': FindDialog,
        'customs-detail': CustomsDetail
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
