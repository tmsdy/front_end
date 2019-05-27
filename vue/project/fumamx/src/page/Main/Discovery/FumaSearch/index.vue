<template>
    <div class="FumaSearch">
        <div v-show="!isShowDetail">
            <div v-if="!isSearch" class="startPage">
                <div class="swiperBox">
                    <ul class="pageBox">
                        <transition v-for="(item,index) in swiperData" name="el-fade-in-linear" :key="index">
                            <li class="swiperItem" v-show="swiperIndex==index">
                                <img v-if="index==0" class="topImg" src="/static/images/find/sou011.png" alt="">
                                <div class="content">
                                    <img v-for="(img,i) in item" :class="img.class" :src="img.src" alt="" :key="i">
                                </div>
                                <div class="text">
                                    <span>
                                        {{showText[index]}}
                                    </span>
                                </div>
                            </li>
                        </transition>
                    </ul>
                    <ul class="navBox">
                        <li v-for="(item,index) in swiperData" @click="setSwiperShow(index)" class="navItem" :class="{'active':index==swiperIndex}" :key="index"></li>
                    </ul>
                </div>
                <div class="searchBox">
                    <div class="searchBar">
                        <input class="searchInput  pull-left" v-model="keywords" @keyup.enter="toSearch()" placeholder="输入公司名称、关键词、行业、域名" />
                        <i class="iconfont icon-sou-filter  pull-left"></i>
                        <div class="Btn pull-left" @click="toSearch()">Search</div>
                    </div>
                </div>
            </div>
            <div v-else class="searchPage">
                <div class="searchBox">
                    <div class="searchBar">
                        <input type="text" class="Input" v-model="keywords" @keyup.enter="toSearch()" placeholder="输入公司名称、关键词、行业、域名" />
                        <i class="iconfont icon-sou-filter" @click="filterShow()"></i>
                        <div class="Btn" v-on:click="toSearch()">Search</div>
                    </div>
                    <div class="toolBox clearfix">
                        <ul class="typeBar clearfix pull-left">
                            <li v-for="(item,index) in typeList" @click="typeChange(index)" :class="{'active':index==typeIndex}" :key="index" class="typeItem pull-left">
                                {{item.title}}
                            </li>
                        </ul>
                        <p class="pull-right msg">通过深挖还可获取公司的社媒账号以及员工对应的邮箱和社交账号</p>
                    </div>
                </div>
                <div class="resultBox MXscroll" ref="resultBox">
                    <transition name="el-fade-in-linear">
                        <div v-show="!isLoading" class="resultList" ref="resultList">

                            <res-item v-for="(item,index) in resData" :item="item" :isAdmin='isAdmin' :isSocial='typeIndex!=0' :pageType='typeList[typeIndex].type' :key="index" @lookDetail="lookDetail(item)" @lookInfo="lookSocialInfo(item.id)"></res-item>

                            <div v-if="resData.length>0" class="hasMore">
                                <template v-if="page.isNext">
                                    <div v-show="!isLoadingMore" class="btn" @click="loadMoreHandle()">查看更多</div>
                                    <transition name="el-fade-in-linear">
                                        <loading v-show="isLoadingMore"></loading>
                                    </transition>
                                </template>
                                <template v-if="!page.isNext">
                                    <div class="btn">没有更多</div>
                                </template>
                            </div>
                        </div>
                    </transition>
                    <transition name="el-fade-in-linear">
                        <loading v-show="isLoading" class="atCenter"></loading>
                    </transition>
                    <!-- 没有记录 -->
                    <transition name="el-fade-in-linear">
                        <no-data v-show="resData.length<=0&&!isLoading" class="noDataBox atCenter"></no-data>
                    </transition>
                </div>
            </div>
            <transition name="el-zoom-in-top">
                <filter-bar v-if="isfilterShow" @showRecord="showSearchRecord()" @hide="filterHide()" v-model="filterKeywords"></filter-bar>
            </transition>
        </div>
        <!-- 深挖详情 -->
        <!--  <record-detail v-if="isShowDetail" :id="detailItem.id" @pageBack="pageBack"></record-detail> -->
        <find-detail v-if="isShowDetail" :id="detailItem.id" :companyInfo.sync="detailItem.company" @pageBack="pageBack"></find-detail>
        <!-- 搜索记录 -->
        <search-record ref="dialogSearchRecord" @reSearch="reSearch"></search-record>
        <!-- facebook信息 -->
        <social-info ref='socialInfo' :type="typeList[typeIndex].type"></social-info>
    </div>
</template>

<script>
import NoData from '@/basecomponents/NoData/index'
import Loading from '@/basecomponents/Loading/index'
import ResItem from './ResItem'
import FilterBar from './FilterBar'
import SearchRecord from './SearchRecord'
// import RecordDetail from '../Vue/RecordDetail'
import FindDetail from '../Vue/FindDetail/index.js'
import { SocialInfo } from '@/components/DiscoveryItem'
export default {
    name: 'FumaSearch',
    data() {
        return {
            detailItem: '',
            isShowDetail: false,
            isLoading: false,
            isLoadingMore: false,
            autoLoadError: false,
            keywords: '',
            oldKeywords: '',
            isSearch: false,
            filterKeywords: [],
            swiperIndex: 0,
            swiperTimer: null,
            showText: Object.freeze([
                '挖掘全球20个主流搜索引擎、8千万企业网站、4亿社媒账号，一网打尽',
                '发现目标买家、关键联系人、买手邮箱，100%可联系可激活',
                '大数据分析、智能推荐、精准跟踪买家行为',
                '自动化营销机制，主动赢得商机'
            ]),
            swiperData: Object.freeze([
                [{ src: '/static/images/find/sou01.png', class: 'mainImg' }],
                [{ src: '/static/images/find/sou02.png', class: 'mainImg' }],
                [{ src: '/static/images/find/sou03.png', class: 'mainImg' }],
                [{ src: '/static/images/find/sou04.png', class: 'mainImg' }]
            ]),
            typeIndex: 0,
            typeList: Object.freeze([
                { title: '搜索引擎', type: 'all' },
                { title: 'Facebook', type: 'fb-pages' },
                { title: 'Linkedin', type: 'linkedin' },
                { title: 'Twitter', type: 'twitter' }
            ]),
            resData: [],
            isAdmin: false,
            page: {
                now: 1,
                size: 10,
                isNext: false
            },
            cahceMap: new Map(),
            previousRequest: null,
            isfilterShow: false
        }
    },
    computed: {

    },
    created() {
        this.startSwiper()
        this.pageInit()
        this.getFilterWords()
    },
    methods: {
        listenScroll() {
            let resultBox = this.$refs.resultBox
            resultBox.onscroll = () => {
                let scrollHeight = resultBox.scrollHeight
                let scrollTop = resultBox.scrollTop
                let clientHeight = resultBox.clientHeight
                if (scrollHeight - clientHeight <= scrollTop + 30) {
                    if (!this.isLoadingMore && this.page.isNext && !this.autoLoadError) {
                        this.loadMore()
                    }
                }
            }
        },
        setScroll(top) {
            if (!isNaN(top)) {
                let resultBox = this.$refs.resultBox
                resultBox.scrollTop = top
            }
        },
        pageBack() {
            this.isShowDetail = false
            this.detailItem = ''
        },
        lookSocialInfo(id) {
            this.$refs.socialInfo.open(id)
        },
        lookDetail(item) {
            this.detailItem = item

            this.isShowDetail = true
        },
        startSwiper() {
            let len = this.swiperData.length
            this.swiperTimer = window.setInterval(() => {
                let index = this.swiperIndex
                index++
                index = index % len == 0 ? 0 : index
                this.swiperIndex = index
            }, 5000)
        },
        setSwiperShow(index) {
            this.swiperIndex = index
            window.clearInterval(this.swiperTimer)
            this.startSwiper()
        },
        showSearchRecord() {
            this.$refs.dialogSearchRecord.open()
        },
        filterShow() {
            this.isfilterShow = true
        },
        filterHide() {
            this.isfilterShow = false
        },
        reSearch(keywords) {
            this.keywords = keywords
            this.toSearch()
            this.filterHide()
        },
        async toSearch() {
            try {
                this.resData = []
                if (this.keywords.trim() == '') {
                    return false
                }
                this.oldKeywords = this.keywords
                this.page.now = 1
                this.page.isNext = false

                this.isSearch = true
                this.isLoading = true

                let res = await this.getData()

                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.isAdmin = res.body.data.is_admin == 1
                    this.resData = res.body.data.result || []
                    this.page.isNext = res.body.data.is_next == 1
                } else {
                    this.$message.error(this.msg(res.body))
                }
                this.isLoading = false
                this.$nextTick(() => {
                    this.listenScroll()
                })
            } catch (error) {
                if (error.status == 0) {
                    return
                }
                this.isLoading = false
                this.$message.error(this.$t(this.Global.errorTitle))
            }
        },
        loadMoreHandle() {
            this.autoLoadError = false
            this.page.now -= 1
            this.loadMore()
        },
        async loadMore() {
            try {
                if (this.keywords.trim() == '') {
                    return false
                }
                this.isLoadingMore = true
                this.page.now += 1
                let res = await this.getData()
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.isAdmin = res.body.data.is_admin == 1
                    this.resData = this.resData.concat(res.body.data.result || [])
                    this.page.isNext = res.body.data.is_next == 1
                } else {
                    this.$message.error(this.msg(res.body))
                    this.autoLoadError = true
                }
                this.isLoadingMore = false
            } catch (error) {
                if (error.status == 0) {
                    return
                }

                this.autoLoadError = true
                this.isLoadingMore = false
                this.$message.error(this.$t(this.Global.errorTitle))
            }
        },
        /* 修改警告：内部大量缓存处理 */
        typeChange(index) {
            let top = this.$refs.resultBox.scrollTop
            let oldIndex = this.typeIndex
            let oldData = this.resData
            let oldPage = Object.assign({}, this.page)

            this.typeIndex = index
            let hasCahce = false
            let cahce = this.cahceMap.get(index)

            if (cahce && cahce.keywords == this.keywords && cahce.data.length > 0) {
                if (this.previousRequest) {
                    this.isLoading = false
                    this.previousRequest.abort()
                    if (this.isLoadingMore) {
                        this.isLoadingMore = false
                        oldPage.now -= 1
                    }
                }
                this.resData = cahce.data
                this.page = cahce.page
                this.$nextTick(() => {
                    this.setScroll(cahce.top)
                    this.listenScroll()
                })
                hasCahce = true
            }
            this.cahceMap.set(oldIndex, { keywords: this.oldKeywords, data: oldData, top: top, page: oldPage })
            if (hasCahce) return
            this.toSearch()
        },
        getData() {
            let url = this.Global.baseURL + this.Global.api.v2.find_search
            let params = {
                keywords: this.keywords,
                searchType: this.typeList[this.typeIndex].type,
                page: this.page.now,
                pageSize: this.page.size
            }
            if (this.filterKeywords.length > 0) {
                Object.assign(params, { filterKeywords: this.filterKeywords.join(',') })
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

            return this.$http.get(url, data)
        },
        async getFilterWords() {
            try {
                const url = this.Global.baseURL + this.Global.api.v2.find_search
                let res = await this.$http.put(url)
                console.log(res)

                if (res.body.code.toString() === this.Global.RES_OK) {

                } else {

                }
            } catch (error) {

            }
        },
        pageInit() {
            if (this.$route.path == '/main/discovery/fumaSearch') {
                let { keyword } = this.$route.params
                if (keyword) {
                    /* 去搜索 */
                    this.typeIndex = 0
                    this.keywords = keyword
                    this.toSearch()
                }
            }
        }
    },
    watch: {
        $route() {
            this.pageInit()
        }
    },
    components: {
        'no-data': NoData,
        'loading': Loading,
        'res-item': ResItem,
        'filter-bar': FilterBar,
        //  'record-detail': RecordDetail,
        'social-info': SocialInfo,
        'search-record': SearchRecord,

        'find-detail': FindDetail
    }

}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
