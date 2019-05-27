/*
 * Discription:海关数据搜索页
 * -----
 * Created Date: Friday, 22nd March 2019 11:28:38 am
 * Author: 郭兵 (guobing93@163.com)
 * -----
 * Last Modified: Friday, 22nd March 2019 11:29:02 am
 * Modified By: name (email)
 */
<template>
    <div class="CustomsData">
        <div v-if="!isDetail" class="Search">
            <!-- 开始页，展示图  -->
            <start-page v-if="isStart" v-model="searchType" :typeList='searchTypeList' @search="toSearch"></start-page>
            <!-- 搜索列表页 -->
            <div v-if="!isStart" class="SearchPage ">
                <div class="SearchBox clearfix">
                    <div class="SearchTypeBox">
                        <el-dropdown class="dropdown" @command="changeType" menu-align="start" trigger="click">
                            <span class="el-dropdown-link">
                                {{searchTypeList[searchType].label}} <i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="(item,key) in searchTypeList" :command="key" :key="key">{{item.label}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <!--  <el-select class="SearchTypeBox" v-model="searchType" size="large">
                        <el-option v-for="(item ,key) in searchTypeList" :key="key" :label="item.label" :value="key">
                        </el-option>
                    </el-select> -->
                    <div class="InputBox">
                        <i class="iconfont icon-search"></i>
                        <input class="input pull-left" v-model="keywords" :placeholder="searchTypeList[searchType].placeholder" @keyup.enter="handleSearch()" type="text">
                        <div @click="handleSearch()" class="pull-left btn">Search</div>
                    </div>
                </div>
                <div class="mainBox MXscroll">
                    <div v-show="!isLoadingCountry&&countryList.length>0" class="TypeBox">
                        <div class="clearfix">
                            <p class="pull-left typeLabel">国家/地区</p>
                            <ul class="typeList clearfix countryList" :class="{'isOpen':isLookMore}">
                                <li v-for="(item,index) in countryList" :class="{'active':selCountry==item.country}" @click="handleSelCountry(item.country)" class="pull-left typeItem" :key="index">{{`${item.countryEn}(${item.impCount+item.expCount})`}}</li>
                            </ul>
                        </div>
                        <div class="clearfix">
                            <p class="pull-left typeLabel">贸易类型</p>
                            <ul class="typeList clearfix tradeList">
                                <li v-for="(item,index) in tradeList" @click="handleSelTrade(item)" :class="{'active':selTrade==item.value}" class="pull-left typeItem" :key="index">{{item.name}}</li>
                            </ul>
                        </div>
                        <p class="lookMore" @click="isLookMore=!isLookMore">{{isLookMore?'收起':'查看更多'}} <i :class="{'isOpen':isLookMore}" class="iconfont icon-arrow-down"></i></p>
                    </div>
                    <loading v-if="isLoadingCountry"> </loading>
                    <no-data v-if="!isLoadingCountry&&countryList.length<=0"></no-data>
                    <div v-show="!isLoadingCountry&&countryList.length>0" class="ResultBox">
                        <div class="resTitle">共查出 {{this.page.total}} 家公司
                            <el-button @click="handleLookDetailAll()" class="mergeBtn" size="small" type="primary">执行合并搜索</el-button>
                        </div>
                        <el-row class="tableHeader">
                            <el-col :span="7" class="firstCol">公司名称</el-col>
                            <el-col :span="3" class="clearfix">
                                <span class="pull-left">交易额(百万)</span>
                                <i @click="handleSetSort(0)" :class="{'active':sort==0}" class="sortBtn iconfont icon-arrow-down"></i>
                            </el-col>
                            <el-col :span="3" class="clearfix">
                                <span class="pull-left">交易笔数</span>
                                <i @click="handleSetSort(1)" :class="{'active':sort==1}" class="sortBtn iconfont icon-arrow-down"></i>
                            </el-col>
                            <el-col :span="3">最近交易时间</el-col>
                            <el-col :span="3">地理位置</el-col>
                            <el-col :span="5">&nbsp;</el-col>
                        </el-row>
                        <div v-if="!isLoadingData&&dataList.length>0" class="tableBody">
                            <el-checkbox-group v-model="checkList">
                                <res-item v-for="(item,index) in dataList" :item="item" @lookDetail="handleLookDetail(item)" @toFind="handleToFind(item)" :key="index"></res-item>
                            </el-checkbox-group>
                        </div>

                        <transition name="el-fade-in-linear">
                            <loading v-if="isLoadingData"></loading>
                        </transition>
                        <transition name="el-fade-in-linear">
                            <no-data v-if="!isLoadingData&&dataList.length<=0"></no-data>
                        </transition>
                        <div class="page" v-if="page.total>page.size&&!isLoadingData">
                            <el-pagination @current-change="changePage" background layout="total,prev,pager,next" :page-size="page.size" :current-page="page.now" :total="page.total">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <detail v-if="isDetail" :companyInfo="lookedItem" :searchParams="searchParams" :depth="detailStack.length" @openCompany="handleOpenCompany" @pageBack="handlePageBack()" ref="Detail"></detail>
        <find-dialog ref="findDialog"></find-dialog>
    </div>
</template>
<script>
import { hasHan } from '@/libs/utils.js'
import StartPage from './StartPage'
import ResItem from './ResItem'
import Loading from '@/basecomponents/Loading'
import NoData from '@/basecomponents/NoData'
import { FindDialog } from '@/components/DiscoveryItem'
import Detail from './Detail'
export default {
    name: 'Search',
    data() {
        return {
            isDetail: false,
            checkList: [],

            isStart: true,
            isLookMore: false,
            isLoadingCountry: false,
            isLoadingData: false,
            keywords: '',
            searchType: '0',
            searchTypeList: Object.freeze({
                '0': { icon: 'icon-company-set', label: '按公司查', placeholder: '输入公司名称关键字进行查询' },
                '1': { icon: 'icon-goods-list', label: '按产品查', placeholder: '输入产品名称关键字/HS编码进行查询' }
            }),
            selCountry: '',
            countryList: Object.freeze([]),
            selTrade: 'all',
            tradeList: Object.freeze([
                {
                    name: '全部',
                    value: 'all'
                },
                {
                    name: '采购商',
                    value: 'imp'
                },
                {
                    name: '供应商',
                    value: 'exp'
                }]),
            dataList: [],
            sort: 0,
            page: {
                now: 1,
                size: 10,
                total: 0
            },
            detailStack: [],
            lookedItem: null
        }
    },
    created() {
        this.initPage()
    },
    computed: {

        searchParams() {
            return this.detailStack[this.detailStack.length - 1].params
            /*  return {
                 keywords: this.keywords,
                 country: this.selCountry,
                 inout: this.selTrade,
                 type: this.searchType
             } */
        }
    },
    methods: {
        handlePageBack() {
            let len = this.detailStack.length
            if (len > 0) {
                let { item: prevLookedItem } = this.detailStack.pop()
                len = this.detailStack.length
                if (len <= 0) {
                    this.isDetail = false
                    this.lookedItem = null
                    if (prevLookedItem.hasOwnProperty('isNotListOpen')) {
                        this.$router.back()
                    }
                } else {
                    this.lookedItem = this.detailStack[len - 1].item
                }
            }
        },
        handleLookDetail(item) {
            this.detailStack.push({
                item,
                params: {
                    keywords: this.keywords,
                    country: this.selCountry,
                    inout: this.selTrade,
                    type: this.searchType
                }
            })

            this.lookedItem = item
            this.isDetail = true
        },
        handleOpenCompany(item) {
            let lookedItem = {
                companyName: item.companyName,
                companyId: item.companyId,
                country: item.country,
                countryEn: item.countryEn,
                companyType: item.companyType,
                isNotListOpen: true
            }
            this.detailStack.push({
                item: lookedItem,
                params: {
                    keywords: item.companyName,
                    country: item.country,
                    inout: item.companyType == '0' ? 'imp' : 'exp',
                    type: '0'
                }
            })
            this.lookedItem = lookedItem
        },
        handleLookDetailAll() {
            if (this.checkList.length <= 0) {
                return
            }
            let mainCompanyId = this.checkList[0]
            let companyItem
            let money = 0
            let count = 0
            this.dataList.forEach(item => {
                if (this.checkList.includes(item.companyId)) {
                    money += item.money
                    count += item.count
                }
                if (item.companyId == mainCompanyId) {
                    companyItem = Object.assign({}, item)
                }
            })

            if (!companyItem) { return }
            Object.assign(companyItem, { money, count })

            this.checkList.forEach(item => {
                if (item != mainCompanyId) {
                    companyItem.companyId += `,${item}`
                }
            })
            this.detailStack.push({
                item: companyItem,
                params: {
                    keywords: this.keywords,
                    country: this.selCountry,
                    inout: this.selTrade,
                    type: this.searchType
                }
            })
            this.lookedItem = companyItem
            this.isDetail = true
        },
        changeType(type) {
            this.searchType = type
        },
        toSearch(keywords) {
            if (hasHan(keywords)) {
                this.$alert('不能包含中文', '注意', {
                    confirmButtonText: '确定',
                    callback: action => {

                    }
                })
                return
            }
            this.isStart = false
            this.keywords = keywords
            this.handleSearch()
        },
        changePage(i) {
            this.page.now = i
            this.getCompanyList()
        },
        handleToFind(item) {
            this.$refs.findDialog.open(item, (is_deep, searchId) => {
                item.is_deep = is_deep
                if (is_deep == 3) {
                    item.searchId = searchId
                }
            })
        },
        handleSetSort(sort) {
            if (this.sort == sort) { return }
            this.sort = sort
            this.getCompanyList()
        },
        async handleSearch() {
            if (!this.keywords) {
                return
            }
            if (hasHan(this.keywords)) {
                this.$alert('不能包含中文', '注意', {
                    confirmButtonText: '确定',
                    callback: action => {

                    }
                })
                return
            }
            this.isLookMore = false
            this.selCountry = ''
            this.selTrade = 'all'
            this.checkList = []
            await this.getCountryCountData()
            if (this.countryList.length > 0) {
                this.selCountry = this.countryList[0].country

                this.getCompanyList()
            } else {
                this.dataList = []
                this.page.total = 0
            }
        },

        /* 获取国家统计列表 */
        async getCountryCountData() {
            this.isLoadingCountry = true
            try {
                const url = this.Global.baseURL + this.Global.api.v2.find_customsCorpration
                const data = {
                    keywords: this.keywords,
                    inout: this.selTrade,
                    type: this.searchType
                }
                let res = await this.$http.post(url, data)

                if (res.body.code.toString() === this.Global.RES_OK) {
                    this.countryList = Object.freeze(res.body.data || [])
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.isLoadingCountry = false
        },

        async getCompanyList() {
            this.isLoadingData = true
            try {
                this.dataList = []
                const url = this.Global.baseURL + this.Global.api.v2.find_customsCorpration
                const data = {
                    keywords: this.keywords,
                    country: this.selCountry,
                    inout: this.selTrade,
                    type: this.searchType,
                    pagesize: this.page.size,
                    pageindex: this.page.now,
                    sort: this.sort
                }
                let res = await this.$http.put(url, data)

                if (res.body.code.toString() === this.Global.RES_OK) {
                    let { result, impCount, expCount } = res.body.data
                    this.dataList = result || []
                    this.page.total = this.selTrade == 'imp'
                        ? (impCount || 0)
                        : this.selTrade == 'exp'
                            ? (expCount || 0)
                            : (impCount || 0) + (expCount || 0)
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.isLoadingData = false
        },

        handleSelCountry(code) {
            if (this.selCountry == code) { return }
            this.selCountry = code
            this.page.now = 1
            this.checkList = []
            this.getCompanyList()
        },

        handleSelTrade(item) {
            if (item.value == this.selTrade) return
            this.selTrade = item.value
            this.page.now = 1
            this.checkList = []
            this.getCompanyList()
        },
        initPage() {
            let { row } = this.$route.params
            if (row) {
                this.handleOpenCompany(row)
                this.isDetail = true
            }
        }
    },
    watch: {
        $route() {
            this.initPage()
        }
    },
    components: {
        'loading': Loading,
        'no-data': NoData,
        'res-item': ResItem,
        'start-page': StartPage,
        'find-dialog': FindDialog,
        'detail': Detail
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
