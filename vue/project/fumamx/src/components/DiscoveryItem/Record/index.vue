/*
 * Discription: 海关记录
 * -----
 * Created Date: Wednesday, 27th March 2019 5:15:33 pm
 * Author: 郭兵 (guobing93@163.com)
 * -----
 * Last Modified: Wednesday, 27th March 2019 5:15:51 pm
 * Modified By: name (email)
 */
<template>
    <div class="Record">
        <div class="navTitle">
            海关记录
            <div class="pull-right searchBox">
                <i class="iconfont icon-search"></i>
                <input v-model="keywords" @keyup.enter="handleSearch()" type="text" placeholder="输入HS码或者关键词进行检索">
            </div>
        </div>
        <el-row class="tableHeader">
            <el-col :span="4" class="firstCol">到港时间</el-col>
            <el-col :span="5">{{inout=='imp'?'供应商':'采购商'}}</el-col>
            <el-col :span="4">HS Code</el-col>
            <el-col :span="7">产品描述</el-col>
            <el-col :span="4">金额</el-col>
        </el-row>
        <div v-if="listData.length>0&&!isLoading" class="tableBody">
            <res-item v-for="(item,index) in listData" @openCompany="handleOpenCompany(item)" :item="item" :inout="inout" :key="index"></res-item>
        </div>
        <div class="page" v-if="page.total>page.size&&!isLoading">
            <el-pagination @current-change="handlePageChange" layout="total,prev,pager,next" :page-size="page.size" :current-page="page.now" :total="page.total">
            </el-pagination>
        </div>

        <transition name="el-fade-in-linear">
            <div v-if="isLoading" class="noDataBox">
                <loading class="atCenter"></loading>
            </div>
        </transition>
        <transition name="el-fade-in-linear">
            <div v-if="!isLoading&&listData.length<=0" class="noDataBox">
                <no-data class="atCenter"></no-data>
            </div>
        </transition>

    </div>
</template>
<script>

import { hasHan } from '@/libs/utils.js'
import Loading from '@/basecomponents/Loading'
import NoData from '@/basecomponents/NoData'
import ResItem from './ResItem'
export default {
    name: 'Record',
    props: {
        inout: { type: String, default: 'imp' },
        scomid: { type: String, default: '' },
        country: { type: String, default: '' },
        dateType: { type: Object, default: () => ({}) }
    },
    data() {
        return {
            isLoading: false,
            listData: Object.freeze([]),
            keywords: '',
            page: {
                now: 1,
                size: 10,
                total: 0
            }
        }
    },
    created() {
    },
    mounted() {
        this.getData()
    },
    methods: {
        handleOpenCompany(item) {
            let companyName = this.inout == 'imp' ? item.supplierName : item.buyerName
            if (!companyName || companyName == '-') {
                return
            }
            let company = {
                countryEn: '',
                country: this.inout == 'imp' ? item.expCountry : item.impCountry,
                companyType: this.inout == 'imp' ? 1 : 0,
                companyId: this.inout == 'imp' ? item.exporterId : item.importerId,
                companyName: companyName
            }
            this.$emit('openCompany', company)
        },
        handleSearch() {
            if (hasHan(this.keywords)) {
                this.$alert('不能包含中文', '注意', {
                    confirmButtonText: '确定',
                    callback: action => {

                    }
                })
                return
            }
            this.page.now = 1
            this.getData()
        },
        handlePageChange(i) {
            this.page.now = i
            this.getData()
        },
        async getData() {
            let listData = []
            this.isLoading = true
            try {
                const url = this.Global.baseURL + this.Global.api.v2.find_customsCommerce
                let data = {
                    bdate: this.dateType.bdate,
                    edate: this.dateType.edate,
                    inout: this.inout,
                    scomid: this.scomid,
                    pagesize: this.page.size,
                    pageindex: this.page.now,
                    country: this.country
                }
                if (this.keywords) {
                    Object.assign(data, { keywords: this.keywords })
                }
                let res = await this.$http.put(url, data)
                if (res.body.code.toString() === this.Global.RES_OK) {
                    let { allCount, rows } = res.body.data
                    this.page.total = allCount || 0
                    listData = rows || []
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.listData = Object.freeze(listData)
            this.isLoading = false
        }
    },
    watch: {
        scomid() {
            if (this.scomid) {
                this.keywords = ''
                this.page.now = 1
                this.getData()
            }
        },
        dateType() {
            this.page.now = 1
            this.getData()
        }
    },
    components: {
        'res-item': ResItem,
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
