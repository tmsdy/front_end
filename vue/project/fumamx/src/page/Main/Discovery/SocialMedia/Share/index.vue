<template>
    <div class="Share">
        <div v-if="!isAddGoods">
            <page-title :showTitle="false"></page-title>
            <div class="main MXscroll" :class="{'hasPage':page.total>page.size}">
                <div class="toolBar">
                    <div class="pull-right">
                        <el-button type="primary" @click="addGoods">新增商品发布</el-button>
                    </div>
                </div>
                <div class="tableBox">
                    <el-row class="tableHeader">
                        <el-col class="item" :span="6">
                            创建时间
                        </el-col>
                        <el-col class="item" :span="6">
                            开始结束时间
                        </el-col>
                        <el-col class="item" :span="6">
                            当前进度
                        </el-col>
                        <el-col class="item" :span="6">
                            操作
                        </el-col>
                    </el-row>
                    <div class="tableBody">
                        <div v-if="resList.length>0&&!isLoading">
                            <el-row v-for="(item, index) in resList" :key="index" class="row">
                                <el-col class="item" :span="6">
                                    {{item.createdate}} &nbsp;
                                </el-col>
                                <el-col class="item" :span="6">
                                    <!--  {{item.type==0?'循环发布':'循环发布结束后继续循环'}} -->
                                    定时发布
                                </el-col>

                                <el-col class="item" :span="6">
                                    {{getProgress(item.status)}}&nbsp;
                                </el-col>

                                <el-col class="item" :span="6">
                                    <el-button size="mini">详情</el-button>
                                    <el-button v-if="item.status!=3&&item.status!=4" @click="delItem(item.id,index)" type="primary" size="mini">结束任务</el-button>
                                </el-col>

                            </el-row>
                        </div>
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
            <transition name="el-fade-in-linear">
                <div class="page" v-if="page.total>page.size">
                    <el-pagination @current-change="changePage" background layout="total,prev,pager,next" :page-size="page.size" :current-page="page.now" :total="page.total">
                    </el-pagination>
                </div>
            </transition>
        </div>
        <add-share v-if="isAddGoods" @pageBack="pageBack" @addSuccess="addSuccess"></add-share>
    </div>
</template>
<script>
import PageTitle from '@/components/PageTitle/index'
import NoData from '@/basecomponents/NoData/index'
import Loading from '@/basecomponents/Loading/index'
import AddShare from '../AddShare'
export default {
    name: 'Share',
    data() {
        return {
            isLoading: false,
            isAddGoods: false,
            resList: [],
            page: {
                now: 1,
                size: 10,
                total: 0
            },
            previousRequest: null
        }
    },
    created() {
        this.getList()
    },
    methods: {
        addGoods() {
            this.isAddGoods = true
            this.$emit('tabToggle', false)
        },
        changePage(i) {
            this.page.now = i
            this.getList()
        },
        getProgress(code) {
            let status = ''

            switch (code.toString()) {
                case '0':
                    status = '待发布'
                    break
                case '1':
                    status = '发布成功'
                    break
                case '2':
                    status = '任务进行中'
                    break
                case '3':
                    status = '任务已结束'
                    break
                case '4':
                    status = '发布错误'
                    break

                default:
                    break
            }
            return status
        },
        getList() {
            this.isLoading = true
            this.resList = []
            let url = this.Global.baseURL + this.Global.api.v2.find_socialReleaseList
            let data = {
                params: {
                    page: this.page.now,
                    pageSize: this.page.size,
                    isLoop: true
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
                    if (res.body.code.toString() === this.Global.RES_OK) {
                        this.page.total = res.body.data.totalRow
                        this.resList = res.body.data.result
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                    this.isLoading = false
                })
                .catch(err => {
                    if (err.status === 0) {
                        return
                    }
                    this.isLoading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        delItem(id, index) {
            let url = this.Global.baseURL + this.Global.api.v2.find_socialReleaseList
            let data = {
                body: {
                    id
                }
            }
            this.$http.delete(url, data)
                .then(res => {
                    if (res.body.code.toString() === this.Global.RES_OK) {
                        this.resList[index].status = 3
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                })
                .catch(err => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        addSuccess() {
            this.getList()
            this.pageBack()
        },
        pageBack() {
            this.isAddGoods = false
            this.$emit('tabToggle', true)
        }
    },
    components: {
        'no-data': NoData,
        'loading': Loading,
        'page-title': PageTitle,
        'add-share': AddShare
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
