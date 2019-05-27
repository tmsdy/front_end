/*
 * Discription:海关数据深挖对话框
 * -----
 * Created Date: Tuesday, 9th April 2019 05:12:20 pm
 * Author: 郭兵 (guobing93@163.com)
 * -----
 * Last Modified: Tuesday, 9th April 2019 05:12:24 pm
 * Modified By: name (email)
 */
<template>
    <div>
        <el-dialog :title="(companyInfo&&companyInfo.companyName)||''" v-dialogDrag :visible.sync="dialogVisible" custom-class="width820">
            <div>
                <el-tabs v-model="nowType" @tab-click="handleTypeChange()" class="subTabs-pullRight">
                    <el-tab-pane v-for="(item,index) in typeList" :label="item.label" :name="item.value" :key="index"></el-tab-pane>
                </el-tabs>
                <div class="ResBox">
                    <div v-if="!isLoading&&listData.length>0" class="MXscroll ListBox">
                        <res-item v-for="(item,index) in listData" :item="item" :isAdmin='isAdmin' :isSocial='nowType!="all"' :pageType='nowType' :selected="item.id==selectedId" @selClick="handleToggleSelectItem(item.id)" @lookInfo="handleLookSocialInfo(item.id)" :key="index"></res-item>
                    </div>
                    <transition name="el-fade-in-linear">
                        <loading v-if="isLoading" class="atCenter"></loading>
                    </transition>
                    <transition name="el-fade-in-linear">
                        <no-data v-if="!isLoading&&listData.length<=0" class="atCenter"></no-data>
                    </transition>
                </div>
            </div>
            <div slot="footer" class="findDialog-footer clearfix">
                <span v-if="!isLoading" class="pull-left ">
                    <el-button @click="handlePrevPage()" :disabled="page.now<=1" type="text">上一页</el-button>
                    <span class="pageNum">第{{page.now}}页</span>
                    <el-button @click="handleNextPage()" :disabled="!page.next" type="text">下一页</el-button>
                </span>
                <span class="pull-right">
                    <el-button @click="handleCancle()">取 消</el-button>
                    <el-button :disabled="!selectedId" :loading="isFinding" type="primary" @click="handleSure()">确 定</el-button>
                </span>
            </div>
        </el-dialog>
        <!-- facebook信息 -->
        <social-info ref='socialInfo' :type="nowType"></social-info>
    </div>
</template>
<script>
import Loading from '@/basecomponents/Loading'
import NoData from '@/basecomponents/NoData'
import ResItem from './ResItem'
import SocialInfo from '../SocialInfo'
export default {
    name: 'FindDialog',
    data() {
        return {
            dialogVisible: false,
            companyInfo: null,
            isLoading: false,
            isFinding: false,
            listData: [],
            filterKeywords: '',
            nowType: 'all',
            typeList: [
                { label: '搜索引擎', value: 'all' },
                { label: 'Facebook', value: 'fb-pages' },
                { label: 'Linkedin', value: 'linkedin' },
                { label: 'Twitter', value: 'twitter' }
            ],
            isAdmin: false,
            page: {
                now: 1,
                size: 10,
                next: true
            },
            previousRequest: null,
            selectedId: '',
            stateChange: null
        }
    },
    methods: {
        open(item, stateChange) {
            this.companyInfo = item
            this.dialogVisible = true
            this.selectedId = ''
            this.stateChange = stateChange
            this.getData()
        },
        _clearData() {
            this.dialogVisible = false
            this.isFinding = false
            this.companyInfo = null
            this.selectedId = ''
            this.stateChange = null
        },
        handleCancle() {
            this._clearData()
        },
        async handleSure() {
            let item = this.companyInfo
            await this._deepFind(item, this.selectedId, this.stateChange)
            this._clearData()
        },

        handleToggleSelectItem(id) {
            this.selectedId = this.selectedId == id ? '' : id
        },
        handleLookSocialInfo(id) {
            this.$refs.socialInfo.open(id)
        },
        handlePrevPage() {
            this.page.now -= 1
            if (this.page.now < 1) {
                this.page.now = 1
            }
            this.getData()
        },
        handleNextPage() {
            this.page.now += 1
            this.getData()
        },
        handleTypeChange() {
            this.page.now = 1
            this.getData()
        },
        async _deepFind(item, searchId, stateChange) {
            stateChange && stateChange(2)
            this.isFinding = true
            try {
                const url = this.Global.baseURL + this.Global.api.v2.find_customsAttentionDeep
                let data = {
                    searchId,
                    companyId: item.companyId,
                    country: item.country
                }
                let res = await this.$http.put(url, data)
                if (res.body.code.toString() == this.Global.RES_OK) {
                    // item.is_deep = 3
                    // item.searchId = res.body.data.id
                    stateChange && stateChange(3, res.body.data.id)
                } else {
                    stateChange && stateChange(1)
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                stateChange && stateChange(1)
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.isFinding = false
        },
        async getData() {
            this.isLoading = true
            this.listData = []
            try {
                let url = this.Global.baseURL + this.Global.api.v2.find_search
                let params = {
                    keywords: this.companyInfo.companyName,
                    searchType: this.nowType,
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
                let res = await this.$http.get(url, data)
                if (res.body.code.toString() === this.Global.RES_OK) {
                    this.isAdmin = res.body.data.is_admin == 1
                    this.listData = res.body.data.result || []
                    this.page.next = res.body.data.is_next == 1
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                if (error.status == 0) {
                    return
                }

                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.isLoading = false
        }
    },
    components: {
        'loading': Loading,
        'no-data': NoData,
        'res-item': ResItem,
        'social-info': SocialInfo
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./en.less";
@import "./zh-cn.less";
</style>
