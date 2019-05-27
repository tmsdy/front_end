/*
 * Discription: 发现商机 (discovery business opportunity)
 * -----
 * Created Date: Wednesday, 6th March 2019 10:35:36 am
 * Author: 郭兵 (guobing93@163.com)
 * -----
 * Last Modified: Wednesday, 6th March 2019 10:36:40 am
 * Modified By: name (email)
 */

<template>
    <div class="Opportunity">
        <!-- 标题 -->
        <page-title></page-title>
        <!-- 主体 -->
        <div class="mainBox MXscroll" :class="{'hasPage':page.total>page.size}">
            <div class="toolBar">
                <span class="hint-text">*系统会跟进设置的关键词每天早上8点至少推荐1条商机，商机来源是相同行业Facebook主页下的产品购买意向信息。</span>
                <div class="pull-right clearfix">
                    <el-button class="setting-btn" @click="setKeyWords()" type="primary">设置关键词</el-button>
                </div>
            </div>
            <div class="tableBox">
                <el-row class="tableHeader">
                    <el-col :span="6">来源主页</el-col>
                    <el-col :span="6">询盘内容</el-col>
                    <el-col :span="6">关键词</el-col>
                    <el-col :span="6">更新日期</el-col>
                </el-row>
                <div class="tableBody">
                    <template v-if="!isLoading">
                        <list-item v-for="(item,index) in list" :item="item" :key="index" @lookInfo="lookInfo(item.id)"></list-item>
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
        </div>
        <!-- 分页 -->
        <transition name="el-fade-in-linear">
            <div class="page" v-if="page.total>page.size&&!isLoading">
                <el-pagination @current-change="changePage" background layout="total,prev,pager,next" :page-size="page.size" :current-page="page.now" :total="page.total">
                </el-pagination>
            </div>
        </transition>
        <set-keywords ref="setKeywords"></set-keywords>
        <social-info ref="socialInfo" type='fb-pages'></social-info>
    </div>
</template>

<script>
import PageTitle from '@/components/PageTitle'
import NoData from '@/basecomponents/NoData/index'
import Loading from '@/basecomponents/Loading/index'
import { SocialInfo } from '@/components/DiscoveryItem'
import ListItem from './ListItem'
import SetKeywords from './SetKeywords'
export default {
    name: 'Opportunity',
    data() {
        return {
            isLoading: false,
            list: [],
            page: {
                now: 1,
                size: 10,
                total: 0
            }
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        /* 设置关键词 */
        setKeyWords() {
            this.$refs.setKeywords.open()
        },
        changePage(i) {
            this.page.now = i
            this.getList()
        },
        lookInfo(id) {
            this.$refs.socialInfo.open(id)
        },
        /* 获取询盘数据 */
        async getList() {
            this.isLoading = true
            try {
                const url = this.Global.baseURL + this.Global.api.v2.find_inquiryData
                let params = {
                    page: this.page.now,
                    pagesize: this.page.size,
                    order: 'time'
                }
                let res = await this.$http.get(url, { params })

                if (res.body.code.toString() === this.Global.RES_OK) {
                    this.list = res.body.data.result || []
                    this.page.total = res.body.data.totalRow || 0
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.isLoading = false
        }
    },
    components: {
        'page-title': PageTitle,
        'list-item': ListItem,
        'set-keywords': SetKeywords,
        'social-info': SocialInfo,
        'no-data': NoData,
        'loading': Loading
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
