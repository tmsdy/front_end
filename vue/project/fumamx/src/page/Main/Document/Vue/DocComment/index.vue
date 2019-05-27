<template>
    <div class="DocComment">
        <transition name="el-fade-in-linear">
            <div v-if="isOpen" class="mask" @click="close()"></div>
        </transition>
        <div v-if="isOpen" class="commentBox">
            <div class="title">
                评价
                <span class="pull-right text-hover">
                    <i class="iconfont icon-close" @click="close()"></i>
                </span>
            </div>
            <div class="formBox clearfix">
                <el-input class="comment" type="textarea" placeholder="请输入内容" :rows="5" resize="none" v-model="content">
                </el-input>
                <el-button type="primary" :loading="isSaving" class="pull-right" @click="addComment">提交评价</el-button>
            </div>
            <div class="commentList MXscroll">
                <ul v-if="!isLoading&&commentList.length>0">
                    <li v-for="(item,index) in commentList" class="commentItem clearfix" :key="index">
                        <div class="avatar pull-left">
                            <img :src="getAvatar(item.avatar)" alt="">
                        </div>
                        <div class="contentBox ">
                            <div class="content">
                                <span>{{item.createRealName}}:</span>
                                {{item.content}}
                            </div>
                            <p class="time">{{item.createDate}}</p>
                        </div>
                    </li>
                </ul>
                <!-- 加载中 -->
                <transition name="el-fade-in-linear">
                    <loading v-if="isLoading"></loading>
                </transition>
                <!-- 没有记录 -->
                <transition name="el-fade-in-linear">
                    <!-- 没有任何结果～ -->
                    <no-data v-show="commentList.length<=0&&!isLoading" title="暂无评价" class="noDataBox"></no-data>
                </transition>
            </div>

            <!--分页 -->
            <div class="paging ">
                <el-pagination v-if="page.total>page.size" @current-change="changePage" background layout="total,prev, pager, next" :page-size="page.size" :current-page="page.now" :total="page.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import Loading from '@/basecomponents/Loading/index.vue'
import NoData from '@/basecomponents/NoData/index'
export default {
    name: 'DocComment',
    data() {
        return {
            isOpen: false,
            isLoading: false,
            isSaving: false,
            content: '',
            fileItem: {},
            commentList: [],
            page: {
                now: 1,
                size: 10,
                total: 0
            },
            picUrl: '/static/images/noAvatar.png',
            previousRequest: null
        }
    },
    methods: {
        open(fileItem = {}) {
            this.fileItem = fileItem
            this.content = ''
            this.commentList = []
            this.page = {
                now: 1,
                size: 10,
                total: 0
            }
            this.isOpen = true
            this.getData()
        },
        close() {
            this.isOpen = false
        },
        changePage(i) {
            this.page.now = i
            this.getData()
        },
        getAvatar(avatar) {
            return avatar ? this.getGlobalImgSrc(avatar, '40x40') : this.picUrl
        },
        addComment() {
            if (!this.content.trim() && isSaving) {
                return false
            }
            this.isSaving = true
            let url = this.Global.baseURL + this.Global.api.v2.folders_fileInteraction
            let data = {
                content: this.content,
                dataType: 'contents',
                fileId: this.fileItem.fileId,
                fileVersion: this.fileItem.fileVersion
            }
            this.$http.post(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.getData()
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                    this.isSaving = false
                })
                .catch(err => {
                    this.isSaving = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        getData() {
            this.isLoading = true
            let url = this.Global.baseURL + this.Global.api.v2.folders_fileInteraction
            let data = {
                params: {
                    fileId: this.fileItem.fileId,
                    dataType: 'contents',
                    pageN: this.page.now,
                    pageSize: this.page.size,
                    sort: 'createDate',
                    order: 'DESC'
                },
                before(request) {
                    if (this.previousRequest) {
                        this.previousRequest.abort()
                    }
                    this.previousRequest = request
                }
            }
            this.$http.get(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.commentList = res.body.data.list
                        this.page.total = res.body.data.totalNum
                        this.fileItem.evaluateNum = res.body.data.totalNum
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                    this.isLoading = false
                })
                .catch(err => {
                    if (err.status == 0) {
                        return false
                    }
                    this.isLoading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        }
    },
    components: {
        'loading': Loading,
        'no-data': NoData
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
