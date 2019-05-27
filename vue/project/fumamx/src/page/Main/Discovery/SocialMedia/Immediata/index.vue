<template>
    <div class="Immediata">
        <div v-if="!isAddIm">
            <page-title :showTitle="false"></page-title>
            <div class="main MXscroll" :class="{'hasPage':page.total>page.size}">
                <div class="toolBar">
                    <div class="pull-right">
                        <el-button type="primary" @click="addImme">新建任务</el-button>
                    </div>
                </div>
                <div class="tableBox">
                    <el-row class="tableHeader">
                        <el-col class="item" :span="7">
                            任务状态
                        </el-col>
                        <el-col class="item" :span="7">
                            发布时间
                        </el-col>
                        <el-col class="item" :span="10">
                            发布内容
                        </el-col>
                    </el-row>
                    <div class="tableBody">
                        <div v-if="resList.length>0&&!isLoading">
                            <el-row v-for="(item, index) in resList" :key="index" class="row">
                                <el-col class="item" :span="7">
                                    {{getProgress(item.status)}}&nbsp;
                                </el-col>
                                <el-col class="item" :span="7">
                                    {{item.last_issue_time}}&nbsp;
                                </el-col>
                                <el-col class="item" :span="10">
                                    {{item.issue_content}}&nbsp;
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
        <add-im v-if="isAddIm" @pageBack="pageBack" @addSuccess="addSuccess"></add-im>
    </div>
</template>

<script>
import AddIm from '../AddIm'
import NoData from '@/basecomponents/NoData/index'
import Loading from '@/basecomponents/Loading/index'
import PageTitle from '@/components/PageTitle/index'
export default {
    name: 'Immediata',
    data() {
        return {
            isAddIm: false,
            isLoading: false,
            resList: [],
            page: {
                now: 1,
                size: 10,
                total: 0
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        addImme() {
            this.isAddIm = true
            this.$emit('tabToggle', false)
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
        addSuccess() {
            this.pageBack()
            this.getList()
        },
        changePage(i) {
            this.page.now = i
            this.getList()
        },
        pageBack() {
            this.isAddIm = false
            this.$emit('tabToggle', true)
        },
        getList() {
            this.isLoading = true
            let url = this.Global.baseURL + this.Global.api.v2.find_socialReleaseList
            let params = {
                page: this.page.now,
                pageSize: this.page.size,
                isLoop: false
            }
            this.$http.get(url, { params })
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
                    this.isLoading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        }
    },
    components: {
        'add-im': AddIm,
        'no-data': NoData,
        'loading': Loading,
        'page-title': PageTitle
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
