<template>
    <el-dialog title="选择关联公司" v-dialogDrag :visible.sync="dialogVisible" custom-class="width820">
        <div class="mainBox">
            <el-row class="tableHeader">
                <el-col :span="8" class="firstCol">公司名称</el-col>
                <el-col :span="4" class="clearfix">
                    <span class="pull-left">交易额</span>
                    <i @click="handleSetSort(0)" :class="{'active':sort==0}" class="sortBtn iconfont icon-arrow-down"></i>
                </el-col>
                <el-col :span="4" class="clearfix">
                    <span class="pull-left">交易笔数</span>
                    <i @click="handleSetSort(1)" :class="{'active':sort==1}" class="sortBtn iconfont icon-arrow-down"></i>
                </el-col>
                <el-col :span="4">最近交易时间</el-col>
                <el-col :span="4">地理位置</el-col>
            </el-row>
            <div class="tableBody">
                <el-checkbox-group v-model="checkList">
                    <el-row v-for="(item,index) in listData" class="ResItem" :key="index">
                        <el-col :span="8" class="firstCol ">
                            <el-checkbox class="checkBox" true-label="" :disabled="list[0]==item.companyId" :label="item.companyId"></el-checkbox>
                            <div class="ellipsis companyName">{{item.companyName||'&nbsp;'}}</div>
                        </el-col>
                        <el-col :span="4">{{item.money||0}}</el-col>
                        <el-col :span="4">{{item.count||0}}</el-col>
                        <el-col :span="4">{{item.lastDate||'-'}}</el-col>
                        <el-col :span="4">{{item.countryEn||'&nbsp;'}}</el-col>
                    </el-row>
                </el-checkbox-group>
            </div>
            <loading v-if="isLoading"></loading>
            <no-data v-if="!isLoading&&listData.length<=0"></no-data>

        </div>
        <span slot="footer" class="footerBox clearfix">
            <div class="pull-left" v-if="page.total>page.size&&!isLoading">
                <el-pagination @current-change="handleChangePage" background layout="total,prev,pager,next" :page-size="page.size" :current-page="page.now" :total="page.total">
                </el-pagination>
            </div>
            <span class="pull-right">
                <el-button @click="handleCancel()">取 消</el-button>
                <el-button type="primary" :disabled="checkList.length<=0" @click="handleSure()">确 定</el-button>
            </span>
        </span>
    </el-dialog>
</template>

<script>
import Loading from '@/basecomponents/Loading'
import NoData from '@/basecomponents/NoData'
export default {
    name: '',
    props: {
        params: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            dialogVisible: false,
            isLoading: false,
            listData: Object.freeze([]),
            checkList: [],
            sort: 0,
            page: {
                now: 1,
                size: 10,
                total: 0
            },
            list: []
        }
    },
    methods: {
        open(list = []) {
            this.dialogVisible = true

            this.list = list
            this.checkList = list

            Object.assign(this.page, { now: 1, total: 0 })

            this.getData()
        },
        handleSetSort(sort) {
            this.sort = sort
            this.getData()
        },
        handleChangePage(i) {
            this.page.now = i
            this.getData()
        },
        handleCancel() {
            this.dialogVisible = false
        },
        handleSure() {
            this.$emit('sure', this.checkList)
            this.dialogVisible = false
        },
        async getData() {
            this.isLoading = true
            let listData = []
            try {
                this.listData = []
                const url = this.Global.baseURL + this.Global.api.v2.find_customsCorpration
                const data = {
                    pagesize: this.page.size,
                    pageindex: this.page.now,
                    sort: this.sort,
                    ...this.params
                }
                let res = await this.$http.put(url, data)

                if (res.body.code.toString() === this.Global.RES_OK) {
                    let { result, impCount, expCount } = res.body.data
                    listData = result || []
                    this.page.total = this.selTrade == 'imp'
                        ? (impCount || 0)
                        : this.selTrade == 'exp'
                            ? (expCount || 0)
                            : (impCount || 0) + (expCount || 0)
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
    components: {
        'loading': Loading,
        'no-data': NoData
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./en.less";
@import "./zh-cn.less";
</style>
