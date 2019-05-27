<template>
    <div class="NoticeAction">
        <template v-if="!isEdit">
            <page-title :showTitle="false"></page-title>
            <div class="mainBox MXscroll" :class="{'hasPage':page.total>page.size}" v-loading="isLoading">
                <div class="toolBar clearfix">
                    <div class="pull-right">
                        <!-- 搜索邮件名称 -->
                        <el-input class="search" placeholder="搜索通知名称" icon="search" v-model="searchKey" :on-icon-click="toSearch" @keyup.enter.native="toSearch">
                        </el-input>
                        <!-- 新建触发邮件 -->
                        <el-button type="primary" class="button" @click="addNotice()">新建提醒通知</el-button>
                    </div>
                </div>
                <div class="tableBox">
                    <el-row class="headerBox">
                        <el-col class="item ellipsis" :span="5" style="padding-left:30px;">
                            通知主题
                        </el-col>
                        <el-col class="item ellipsis" :span="4">
                            所属模块
                        </el-col>
                        <el-col class="item ellipsis" :span="4">
                            提醒谁
                        </el-col>
                        <el-col class="item ellipsis" :span="4">
                            创建时间
                        </el-col>
                        <el-col class="item ellipsis" :span="4">
                            创建人
                        </el-col>
                    </el-row>
                    <div class="bodyBox">
                        <el-row v-for="(item,index) in list" class="Line" :key="index">
                            <el-col class="item ellipsis" :span="5" style="padding-left:30px;">
                                {{item.subjectForView}}
                            </el-col>
                            <el-col class="item ellipsis" :span="4">
                                {{item.moduleName}}
                            </el-col>
                            <el-col class="item ellipsis" :span="4">
                                {{item.remindFieldsNames||'&nbsp;'}}
                            </el-col>
                            <el-col class="item ellipsis" :span="4">
                                {{item.createDate}}
                            </el-col>
                            <el-col class="item ellipsis" :span="4">
                                {{item.createRealName}}
                            </el-col>
                            <el-col class="item ellipsis" :span="3">
                                <div class="optBox">
                                    <el-tooltip effect="dark" content="修改" placement="top">
                                        <i @click="editItem(item)" class="editBtn iconfont icon-edit"></i>
                                    </el-tooltip>
                                    <el-tooltip effect="dark" content="删除" placement="top">
                                        <i @click="removeItem(item.detailActionId)" class="delBtn iconfont icon-del"></i>
                                    </el-tooltip>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <no-data v-if="list.length<=0&&!isLoading" style="background:rgba(255,255,255,0)"></no-data>
                </div>
            </div>
            <div class="page" v-if="page.total>page.size&&!isLoading">
                <el-pagination @current-change="changePage" background layout="total,prev,pager,next" :page-size="page.size" :current-page="page.now" :total="page.total">
                </el-pagination>
            </div>
        </template>
        <add-notice ref="addNotice" v-if="isEdit" @pageBack="pageBack()"></add-notice>
    </div>
</template>

<script>
import NoData from '@/basecomponents/NoData/index'
import AddNotice from './AddNotice'
import PageTitle from '@/components/PageTitle/index'
export default {
    name: 'NoticeAction',
    data() {
        return {
            isLoading: false,
            isEdit: false,
            searchKey: '',
            list: [],
            page: {
                now: 1,
                size: 10,
                total: 0
            }
        }
    },
    created() {
        this.getData()
    },
    methods: {
        pageBack() {
            this.isEdit = false
            this.$emit('tabToggle', true)
            this.getData()
        },
        addNotice() {
            this.isEdit = true
            this.$emit('tabToggle', false)
        },
        toSearch() {
            this.searchKey = this.searchKey.trim()
            this.getData()
        },
        editItem(item) {
            this.addNotice()
            this.$nextTick(() => {
                this.$refs.addNotice.setModify(item)
            })
        },
        removeItem(detailActionId) {
            let url = this.Global.baseURL + this.Global.api.v2.autoStrategy_actions
            let data = {
                body: {
                    actionId: 2,
                    detailActionId
                }
            }
            this.$http.delete(url, data)
                .then(res => {
                    if (res.body.code.toString() === this.Global.RES_OK) {
                        this.getData()
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                })
                .catch(err => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        changePage(i) {
            this.page.now = i
            this.getData()
        },
        getData() {
            this.isLoading = true
            let url = this.Global.baseURL + this.Global.api.v2.autoStrategy_actions
            let params = {
                actionId: 2,
                type: 'list',
                pageN: this.page.now,
                pageSize: this.page.size
            }
            if (this.searchKey) {
                Object.assign(params, { wildcardWords: this.searchKey })
            }
            this.$http.get(url, { params })
                .then(res => {
                    if (res.body.code.toString() === this.Global.RES_OK) {
                        this.list = res.body.data.list || []
                        this.page.total = res.body.data.totalNum || 0
                    } else {

                    }
                    this.isLoading = false
                })
                .catch(err => {
                    this.isLoading = false
                })
        }
    },
    components: {
        'no-data': NoData,
        'page-title': PageTitle,
        'add-notice': AddNotice
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
