/*
 * Discription:关联公司tab
 * -----
 * Created Date: Thursday, 28th March 2019 1:17:48 pm
 * Author: 郭兵 (guobing93@163.com)
 * -----
 * Last Modified: Thursday, 28th March 2019 1:18:33 pm
 * Modified By: name (email)
 */

<template>
    <div class="TabAffiliates">
        <div class="main MXscroll" :class="{'hasPage':page.total>page.size}">
            <div class="topStripe">
                共有 {{listData.length}} 家公司
                <el-button @click="handleJoinLinkedCompany()" :loading="isAddLinking" class="joinBtn">加入关联公司</el-button>
            </div>
            <el-row class="tableHeader">
                <el-col class="firstCol" :span="8">
                    公司名称
                </el-col>
                <el-col :span="4">
                    交易额
                </el-col>
                <el-col :span="5">
                    交易笔数
                </el-col>
                <el-col :span="7">
                    地理位置
                </el-col>
            </el-row>
            <div v-if="listData.length>0&&!isLoading" class="tableBody">
                <el-row v-for="(item,index) in listData" class="RowItem" :key="index">
                    <el-col class="firstCol" :span="8">
                        <div class="ellipsis">{{item.companyName||'-'}}</div>
                    </el-col>
                    <el-col :span="4">
                        <div class="ellipsis">{{item.money||'0'}}</div>
                    </el-col>
                    <el-col :span="5">
                        <div class="ellipsis">{{item.count||'0'}}</div>
                    </el-col>
                    <el-col :span="7">
                        <div class="ellipsis">{{item.countryEn||'-'}}</div>
                    </el-col>
                </el-row>
            </div>
            <loading v-if="isLoading"></loading>
            <no-data v-if="!isLoading&&listData.length<=0"></no-data>
        </div>
        <div class="page" v-if="false">
            <el-pagination @current-change="handlePageChange" layout="total,prev,pager,next" :page-size="page.size" :current-page="page.now" :total="page.total">
            </el-pagination>
        </div>
        <dialog-company ref="dialogCompany" @sure="handleCheckedLinkedCompany" :params="searchParams"></dialog-company>
    </div>
</template>
<script>
import Loading from '@/basecomponents/Loading'
import NoData from '@/basecomponents/NoData'
import DialogCompany from './DialogCompany'
export default {
    name: 'TabAffiliates',
    props: {
        companyId: {
            type: String,
            default: ''
        },
        country: {
            type: String,
            default: ''
        },
        searchParams: {
            type: Object,
            default: () => ({})
        },
        addLinked: {
            type: Function,
            default: null
        }
    },
    data() {
        return {
            isAddLinking: false,
            isLoading: false,
            listData: [],
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
    },
    methods: {
        handlePageChange(i) {
            this.page.now = i
            this.getData()
        },
        handleJoinLinkedCompany() {
            let arr = this.companyId.split(',')
            this.$refs.dialogCompany.open(arr)
        },
        async handleCheckedLinkedCompany(arr) {
            let companyId = `${arr.join(',')}`
            if (this.addLinked) {
                this.isAddLinking = true
                await this.addLinked(companyId)
                this.isAddLinking = false
            }
        },
        async getData() {
            this.isLoading = true
            let total = 0
            let list = []
            try {
                const url = this.Global.baseURL + this.Global.api.v2.find_customsCompany
                let config = {
                    before(request) {
                        if (this.previousRequest) {
                            this.previousRequest.abort()
                        }
                        this.previousRequest = request
                    }
                }
                let data = {
                    companys: this.companyId,
                    country: this.country
                }
                let res = await this.$http.post(url, data, config)
                if (res.body.code.toString() == this.Global.RES_OK) {
                    //  let { Count, Result } = res.body.data
                    //  total = Count || 0
                    //  list = Result || []
                    list = res.body.data || []
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                if (error.status != 0) {
                    return
                }
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.listData = Object.freeze(list)
            this.page.total = total
            this.isLoading = false
        }
    },
    watch: {
        companyId() {
            if (this.companyId) {
                this.getData()
            }
        }
    },
    components: {
        'loading': Loading,
        'no-data': NoData,
        'dialog-company': DialogCompany
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./en.less";
@import "./zh-cn.less";
</style>
