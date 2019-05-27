<template>
    <div class="Interactive">
        <page-title :showTitle="false"></page-title>
        <div class="main">
            <div class="tabBar">
                <ul class="tabBox clearfix">
                    <li v-for="(item,index) in accountList" class="tabItem" :class="{'active':tabIndex==index}" @click="tabChange(index)" :key="index">
                        <i class="iconfont icon-facebook facebookIcon"></i>
                        {{item.account}}
                    </li>
                </ul>
            </div>
            <div class="resBox MXscroll">
                <!-- resList.length>0&&!isLoading" -->
                <ul v-if="resList.length>0&&!isLoading" class=" resListBox">
                    <li v-for="(item,index) in resList" :key="index" class="resItem">
                        <div class="userBox">
                            <i class="avatarIcon iconfont icon-facebook"></i>
                            <div class="infoBox">
                                <a :href="`https://www.facebook.com/${item.post_id.split('_')[0]}`" target="_blank">
                                    <p class="name">{{accountList[tabIndex].account}}</p>
                                </a>
                                <p class="time">{{item.created_time}}</p>
                            </div>
                        </div>
                        <div class="contentBox">
                            {{item.message}}
                            <a :href="item.link" class="link" target="_blank">{{item.link}}</a>
                        </div>
                        <div class="pictureBox">
                            <img v-if="item.full_picture" :src="item.full_picture" class="pictureItem" alt="">
                        </div>
                        <ul class="dynamicBox clearfix">
                            <li class="zanItem pull-left">
                                <i class="iconfont icon-praise-solid"></i>
                                <span class="dunamicNum">0</span>
                            </li>
                            <li class="msgItem pull-left">
                                <i class="iconfont icon-feedback"></i>
                                <span class="dunamicNum">{{item.inner.comment_num}}</span>
                            </li>
                        </ul>
                    </li>
                    <!-- v-if="resList.length>4" -->
                    <div v-if="resList.length>4" class="lookMore">
                        <transition name="el-fade-in-linear">
                            <div v-show="!isLoadMore" class="btn" @click="lookMore()">查看更多</div>
                        </transition>
                        <transition name="el-fade-in-linear">
                            <loading v-show="isLoadMore" class="atCenter"></loading>
                        </transition>
                    </div>
                </ul>
                <!-- loading -->
                <transition name="el-fade-in-linear">
                    <loading v-show="isLoading" class="atCenter"></loading>
                </transition>
                <!-- 没有记录 -->
                <transition name="el-fade-in-linear">
                    <no-data v-show="resList.length<=0&&!isLoading" class="noDataBox atCenter"></no-data>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import NoData from '@/basecomponents/NoData/index'
import Loading from '@/basecomponents/Loading/index'
import PageTitle from '@/components/PageTitle/index'
import { isArray } from '@/libs/utils'
export default {
    name: 'Interactive',
    data() {
        return {
            isLoading: false,
            isLoadMore: false,
            tabIndex: 0,
            accountList: [],
            resList: [],
            page: {
                now: 1,
                size: 10
            }
        }
    },
    created() {
        this.init()
    },
    methods: {
        async init() {
            this.isLoading = true
            let flag = await this.getAccountList()
            if (flag && this.accountList.length > 0) {
                let arr = await this.getInteractiveList()
                this.resList = arr || []
            }
            this.isLoading = false
        },
        async tabChange(index) {
            this.isLoading = true
            this.tabIndex = index
            this.page = {
                now: 1,
                size: 10
            }
            let arr = await this.getInteractiveList()
            this.resList = arr
            this.isLoading = false
        },
        async lookMore() {
            this.isLoadMore = true
            this.page.now += 1
            let arr = await this.getInteractiveList()
            this.resList = this.resList.concat(arr)
            this.isLoadMore = false
        },

        async getAccountList() {
            let flag = false
            try {
                let url = this.Global.baseURL + this.Global.api.v2.find_socialAccount
                let res = await this.$http.get(url)
                if (res.body.code.toString() == this.Global.RES_OK) {
                    let arr = []
                    if (isArray(res.body.data)) {
                        res.body.data.forEach(item => {
                            if (item.account_type == 'fb-pages') {
                                arr.push(item)
                            }
                        })
                    }
                    this.accountList = arr
                    flag = true
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            return flag
        },
        async  getInteractiveList() {
            let returnData = []
            try {
                let url = this.Global.baseURL + this.Global.api.v2.find_socialReleaseList
                let { account, outer_id } = this.accountList[this.tabIndex]
                let data = {
                    account: account,
                    facebookPagesId: outer_id,
                    page: this.page.now,
                    pageSize: this.page.size
                }
                let res = await this.$http.post(url, data)

                if (res.body.code.toString() == this.Global.RES_OK) {
                    returnData = res.body.data
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            return returnData
        }
    },
    components: {
        'no-data': NoData,
        'loading': Loading,
        'page-title': PageTitle
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
