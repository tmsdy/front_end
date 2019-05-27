<template>
    <div class="CustomsSearch">
        <p v-if="showTitle" class="navTitle">海关数据</p>
        <div class="InputBox">
            <i class="iconfont icon-search"></i>
            <input class="input pull-left" v-model="keywords" placeholder="输入公司名称关键字进行查询" @keyup.enter="handleSearch()" type="text">
            <div @click="handleSearch()" class="pull-left btn">Search</div>
        </div>
        <div v-show="!isLoadingCountry&&countryList.length>0" class="TypeBox">
            <div class="clearfix">
                <p class="pull-left typeLabel">国家/地区</p>
                <ul class="typeList clearfix countryList" :class="{'isOpen':isLookMore}">
                    <li v-for="(item,index) in countryList" :class="{'active':selCountry==item.country}" @click="handleSelCountry(item.country)" class="pull-left typeItem" :key="index">{{`${item.countryEn}(${item.impCount+item.expCount})`}}</li>
                </ul>
            </div>
            <p class="lookMore" @click="isLookMore=!isLookMore">{{isLookMore?'收起':'查看更多'}} <i :class="{'isOpen':isLookMore}" class="iconfont icon-arrow-down"></i></p>
        </div>
        <loading v-if="isLoadingCountry" />
        <no-data v-if="!isLoadingCountry&&countryList.length<=0" title="未查询到贸易数据，请调整关键词后重新搜索" />
        <div v-show="!isLoadingCountry&&countryList.length>0" class="ResultBox">
            <el-row class="tableHeader">
                <el-col :span="9" class="firstCol">公司名称</el-col>
                <el-col :span="3" class="clearfix">
                    交易额(百万)
                </el-col>
                <el-col :span="3" class="clearfix">
                    交易笔数
                </el-col>
                <el-col :span="3">最近交易时间</el-col>
                <el-col :span="3">地理位置</el-col>
                <el-col :span="3">&nbsp;</el-col>
            </el-row>
            <div v-if="!isLoadingData&&dataList.length>0" class="tableBody">
                <el-row v-for="(item,index) in dataList" class="ResItem" :key="index">
                    <el-col :span="9" class="firstCol ">
                        <div class="ellipsis companyName" v-html="item.title||'&nbsp;'"></div>
                    </el-col>
                    <el-col :span="3">{{getMoney(item.money)}}</el-col>
                    <el-col :span="3">{{item.count||0}}</el-col>
                    <el-col :span="3">{{item.lastDate||'-'}}</el-col>
                    <el-col :span="3">{{item.countryEn||'&nbsp;'}}</el-col>
                    <el-col :span="3" class="clearfix">
                        <div class="selBtn" @click="handleSelCompany(item)" :class="{'active':selCompany===item}">
                            <i v-if="selCompany===item" class="iconfont icon-correct"></i>
                            {{selCompany===item?'':'选择'}}
                        </div>
                    </el-col>
                </el-row>
            </div>

            <transition name="el-fade-in-linear">
                <loading v-if="isLoadingData"></loading>
            </transition>
            <transition name="el-fade-in-linear">
                <no-data v-if="!isLoadingData&&dataList.length<=0"></no-data>
            </transition>
            <div class="page clearfix" v-if="!isLoadingData">
                <template v-if="page.total>page.size">
                    <el-pagination class="pull-left" @current-change="handleChangePage" background layout="total,prev,pager,next" :page-size="page.size" :current-page="page.now" :total="page.total">
                    </el-pagination>
                </template>
                <el-button type="primary" @click="handleSure()" :loading="isBinding" :disabled="!selCompany" class="pull-right">确定</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { hasHan } from '@/libs/utils.js'
import Loading from '@/basecomponents/Loading'
import NoData from '@/basecomponents/NoData'
export default {
    name: 'CustomsSearch',
    props: {
        custName: {
            type: String,
            default: ''
        },
        asyncFun: {
            type: Function,
            default: () => { }
        },
        showTitle: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isLoadingCountry: false,
            isLoadingData: false,
            isLookMore: false,
            isBinding: false,
            keywords: '',
            countryList: Object.freeze([]),
            dataList: Object.freeze([]),
            sort: 0,
            searchType: '0',
            selTrade: 'all',
            selCountry: '',
            page: {
                now: 1,
                size: 10,
                total: 0
            },
            selCompany: ''
        }
    },
    mounted() {
        if (!hasHan(this.custName)) {
            this.keywords = this.custName
            this.handleSearch()
        }
    },
    methods: {
        getMoney(money) {
            if (money) {
                return `$${(money / 1000000).toFixed(2)}M`
            } else {
                return '-'
            }
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
            this.keywords = keywords
            this.handleSearch()
        },
        handleSelCompany(company) {
            if (this.selCompany === company) {
                this.selCompany = ''
            } else {
                this.selCompany = company
            }
        },
        async handleSure() {
            this.isBinding = true
            await this.asyncFun(this.selCompany)
            this.isBinding = false
        },
        async _BindCompany() {
            this.isBinding = true
            try {
                const url = this.Global.baseURL + this.Global.api.v2.find_customsCust
                let data = {
                    companys: this.selCompany.companyId,
                    country: this.selCompany.country,
                    custId: this.custId
                }
                let res = await this.$http.post(url, data)
                if (res.body.code.toString() === this.Global.RES_OK) {
                    this.$emit('binded', { customsId: this.selCompany.companyId, country: this.selCompany.country })
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                console.log(error)

                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.isBinding = false
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
            this.selCompany = ''
            await this._getCountryCountData()
            if (this.countryList.length > 0) {
                this.selCountry = this.countryList[0].country
                this._getCompanyList()
            } else {
                this.dataList = Object.freeze([])
                this.page.total = 0
            }
        },
        handleChangePage(i) {
            this.page.now = i
            this.selCompany = ''
            this._getCompanyList()
        },

        handleSelCountry(code) {
            if (this.selCountry == code) { return }
            this.selCountry = code
            this.page.now = 1
            this.selCompany = ''
            this._getCompanyList()
        },

        async _getCountryCountData() {
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
        async _getCompanyList() {
            this.isLoadingData = true
            try {
                this.checkList = []
                this.dataList = Object.freeze([])
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
                    this.dataList = Object.freeze(result || [])
                    this.page.total = (impCount || 0) + (expCount || 0)
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.isLoadingData = false
        }
    },
    components: {
        'loading': Loading,
        'no-data': NoData
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "../common.less";
@import "./zh-cn.less";
@import "./en.less";
</style>
