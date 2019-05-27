<template>
    <div class="Record">
        <div v-show="!isShowDetail" class="recordListBox">
            <page-title></page-title>
            <div class="toolBox">

                <!--  <drop-down :querySearchAsync="searchTest" v-model="testValue" labelKey='name' valueKey="staffid" preLoad></drop-down> -->
                <!--  <drop-down :list="staffList" v-model="staffid" labelKey='name' valueKey="staffid" needSearch></drop-down> -->
                <!-- <drop-search :querySearchAsync="searchTest" v-model="testValue" labelKey='name' valueKey="staffid" preLoad></drop-search> -->
                <drop-search :list="staffList" v-model="staffid" labelKey='name' valueKey="staffid" :getDisabled="getDisabled" needSearch></drop-search>
                <el-checkbox class="checkBox" v-model="isSocial">包含社媒账号</el-checkbox>
                <el-checkbox class="checkBox" v-model="isWorker">包含联系人员</el-checkbox>
                <el-checkbox class="checkBox" v-model="isDeleted">已删除</el-checkbox>

            </div>
            <div class="resultBox MXscroll" :class="{'canPage':page.total>page.size}">
                <transition name="el-fade-in-linear">
                    <div v-show="!isLoading" class="resultList">
                        <record-item v-for="(item,index) in resData" :item="item" :key="index" :isDeleted="isDeleted" @statusChange="removeItem(index)" @lookDetail="lookDetail(index)"></record-item>
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
            <transition name="el-fade-in-linear">
                <div class="page" v-if="page.total>page.size&&!isLoading">
                    <el-pagination @current-change="changePage" background layout="total,prev,pager,next" :page-size="page.size" :current-page="page.now" :total="page.total">
                    </el-pagination>
                </div>
            </transition>
        </div>
        <find-detail v-if="isShowDetail" :id="resData[detailIndex].id" :companyInfo.sync="resData[detailIndex].company" :isStart="detailIndex==0" :isEnd="detailIndex==resData.length-1" :isList="true" @next="nextDetail" @prev="prevDetail" @pageBack="pageBack"></find-detail>
    </div>
</template>
<script>
import NoData from '@/basecomponents/NoData/index'
import Loading from '@/basecomponents/Loading/index'
import PageTitle from '@/components/PageTitle/index'
import Dropdown from '@/components/Dropdown'
import DropSearch from '@/components/DropSearch'
import RecordItem from './RecordItem'
import FindDetail from '../Vue/FindDetail'
export default {
    name: 'Record',
    data() {
        return {
            isLoading: false,
            isShowDetail: false,
            isSocial: false,
            isWorker: false,
            detailIndex: 0,
            isDeleted: false,
            id: 0,
            idArr: [
                { value: 0, label: '全部' },
                { value: -1, label: '已删除' }
            ],
            staffid: 0,
            testValue: { staffid: 0, name: '我自己' },
            staffList: [],
            resData: [],
            page: {
                now: 1,
                size: 10,
                total: 0
            },
            previousRequest: null
        }
    },
    created() {
        this.getData()
        this.getStaffList()
    },
    methods: {
        getDisabled(item) {
            return item.staffid == this.staffid
        },
        searchTest({ keywords, callback, isLoadMore }) {
            setTimeout(() => {
                let a = this.staffList.filter((item, index) => index % 2 == 0)
                let b = this.staffList.filter((item, index) => index % 2 != 0)
                if (!isLoadMore) {
                    callback(a, true)
                } else {
                    callback(a.concat(b))
                }
            }, 5000)
        },
        pageBack() {
            this.isShowDetail = false
        },
        // 获取下属
        getStaffList() {
            let url = this.Global.baseURL + this.Global.api.v2.find_deep
            this.$http.get(url)
                .then(res => {
                    if (res.body.code.toString() === this.Global.RES_OK) {
                        this.staffList = res.body.data || []
                        if (this.staffList.length > 0) {
                            this.staffid = this.staffList[0].staffid || 0
                        }
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                })
                .catch(err => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        removeItem(index) {
            this.resData.splice(index, 1)
        },
        lookDetail(index) {
            this.detailIndex = index
            this.isShowDetail = true
        },
        nextDetail() {
            if (this.detailIndex == this.resData.length - 1) { return }
            this.detailIndex += 1
        },
        prevDetail() {
            if (this.detailIndex == 0) { return }
            this.detailIndex -= 1
        },
        changePage(i) {
            this.page.now = i
            this.getData()
        },
        getData() {
            this.resData = []
            let url = this.Global.baseURL + this.Global.api.v2.find_detailed
            let data = {
                staffId: this.staffid,
                id: this.isDeleted ? -1 : 0,
                trash: this.isDeleted ? 0 : 1,
                isSocial: this.isSocial ? 1 : 0,
                isWorker: this.isWorker ? 1 : 0,
                page: this.page.now,
                pageSize: this.page.size
            }
            let config = {
                before(request) {
                    if (this.previousRequest) {
                        this.previousRequest.abort()
                    }
                    this.previousRequest = request
                }
            }
            this.isLoading = true
            this.$http.post(url, data, config)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.resData = res.body.data.result
                        this.page.total = parseInt(res.body.data.count)
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
    watch: {
        staffid() {
            this.getData()
        },
        isSocial() {
            this.getData()
        },
        isWorker() {
            this.getData()
        },
        isDeleted() {
            this.getData()
        },
        $route() {
            if (this.$route.path == '/main/discovery/record' && !this.isShowDetail) {
                this.getData()
                this.getStaffList()
            }
        }

    },
    components: {
        'no-data': NoData,
        'loading': Loading,
        'page-title': PageTitle,
        'drop-down': Dropdown,
        'record-item': RecordItem,
        'find-detail': FindDetail,
        'drop-search': DropSearch
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
