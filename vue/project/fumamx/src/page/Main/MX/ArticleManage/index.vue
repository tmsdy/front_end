<template>
    <div class="ArticleManage mainWrap  ">
        <div v-show="!isEdit">
            <!-- 文章管理 -->
            <page-title title="文章管理" iconfont="icon-article-admin"></page-title>
            <div class="mainBody MXscroll">
                <div class="toolbar">
                    <div class="pull-right">
                        <el-input class="search " placeholder="请输入标题" icon="search" v-model="searchKey" :on-icon-click="handleSearch" @keyup.enter.native="handleSearch">
                        </el-input>
                        <el-button type="primary" class="button " @click="handleCreate">发布文章</el-button>
                    </div>
                </div>
                <el-table v-loading.body="isloading" class="listBox" :data="articleList" style="width: 100%">
                    <el-table-column prop="noticeCaption" label="标题">
                        <template slot-scope="scope">
                            <span @click="handleLook(scope.row.noticeId)" class="articleTitle">{{scope.row.noticeCaption}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="类型" width="120" align="center">
                        <template slot-scope="scope">
                            <div>{{getTypeByNo(scope.row.noticeType)}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="modifyDate" label="时间" align="center" width="180">
                    </el-table-column>
                    <el-table-column prop="author" label="作者" align="center" width="130">
                    </el-table-column>
                    <el-table-column prop="readCount" label="阅读量" align="center" width="80">
                    </el-table-column>
                    <el-table-column prop="praiseCount" label="点赞数" align="center" width="80">
                    </el-table-column>
                    <el-table-column prop="" label="状态" align="center" width="100">
                        <template slot-scope="scope">
                            <div>{{getStateByNo(scope.row.noticeState)}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="操作" align="center" width="150">
                        <template slot-scope="scope">

                            <div class="operationBox clearfix">
                                <div class="pull-left clearfix">
                                    <i @click="handleLook(scope.row.noticeId)" class="iconfont icon-eye"></i>
                                    <i @click="handleEdit(scope.row.noticeId)" class="iconfont icon-edit"></i>
                                    <i @click="handleDelete(scope.row.noticeId)" class="iconfont icon-del"></i>
                                </div>
                            </div>
                        </template>
                    </el-table-column>

                </el-table>
                <el-pagination v-show="page.total>page.size&&!isloading" @current-change="changePage" background layout="total,prev, pager, next" :page-size="page.size" :current-page="page.now" :total="page.total">
                </el-pagination>
            </div>
        </div>
        <edit-article v-show='isEdit' ref='editArticle' :moduleCode="moduleCode" @pageBack="isEdit = false" @editSuccess="editSuccess"></edit-article>
        <preview-article ref="previewArticle" :moduleCode="moduleCode"></preview-article>
    </div>
</template>

<script>
/**
 * 文章管理
 * 郭兵
 * 2018-07-28
 */
import EditArticle from './EditArticle/index'
import PageTitle from '@/components/PageTitle/index' // 大标题
import PreviewArticle from './PreviewArticle/index'
export default {
    name: 'ArticleManage',
    data() {
        return {
            isloading: false,
            isEdit: false,
            articleList: [],
            searchKey: '',
            moduleCode: 'MO002',
            page: {
                now: 1,
                size: 10,
                total: 0
            }
        }
    },
    created() {
        this.getArticleList()
    },
    methods: {
        handleCreate() {
            this.isEdit = true
            this.$refs.editArticle.open('new')
        },
        handleLook(noticeId) {
            this.$refs.previewArticle.open(noticeId)
        },
        handleEdit(noticeId) {
            this.isEdit = true
            this.$refs.editArticle.open('edit', noticeId)
        },
        getTypeByNo(typeNo) {
            let type = ''
            switch (typeNo) {
                case 1:
                    type = '升级日志'
                    break
                case 2:
                    type = '官方活动'
                    break
                case 3:
                    type = '企业动态'
                    break
                default:
                    type = ''
                    break
            }
            return type
        },
        editSuccess() {
            this.isEdit = false
            this.getArticleList()
        },
        getStateByNo(stateNo) {
            let state = ''
            switch (stateNo) {
                case 0:
                    state = '草稿'
                    break
                case 1:
                    state = '已发布'
                    break
                case 2:
                    state = '定时发布'
                    break
                default:
                    state = ''
                    break
            }
            return state
        },
        handleSearch() {
            this.searchKey = this.searchKey.toString().trim()
            if (!this.searchKey || this.searchKey == '') {
                // return false
                this.page.now = 1
            }
            this.getArticleList()
        },
        /* 点击分页 */
        changePage(i) {
            this.page.now = i
            this.getArticleList()
        },

        handleDelete(noticeId) {
            let url = this.Global.baseURL + this.Global.api.v2.sysNotice_put
            let data = {
                type: 'delete',
                noticeId: noticeId
            }
            this.$http.put(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.$message.success('删除成功')
                        this.getArticleList()
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                })
                .catch(err => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        getArticleList() {
            this.isloading = true
            let url = this.Global.baseURL + this.Global.api.v2.sysNotice_get
            let params = {
                type: this.searchKey ? 'search' : 'list',
                moduleCode: this.moduleCode,
                pageN: this.page.now,
                pageSize: this.page.size,
                sort: 'releaseDate',
                order: 'desc'
            }
            if (this.searchKey) {
                Object.assign(params, { keyWord: this.searchKey })
            }
            this.$http.get(url, { params })
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.articleList = res.body.data.result
                        this.page.total = res.body.data.totalNum
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                    this.isloading = false
                })
                .catch(err => {
                    this.isloading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        }
    },
    components: {
        'page-title': PageTitle,
        'edit-article': EditArticle,
        'preview-article': PreviewArticle
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../../public-zh-cn.less";
@import "../../public-en.less";
@import "./zh-cn.less";
@import "./en.less";
</style>
