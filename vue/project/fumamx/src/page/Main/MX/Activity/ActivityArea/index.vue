<template>
    <div class="actionManageBox MXscroll" v-if="isShowList">
        <div class="toolBar clearfix">
            <el-button class="pull-right" type="primary" @click="addArea">新建区域</el-button>
        </div>

        <el-table class="detailTable widthFull" :data="tableData3" :height="tableHeight" v-if="tableData3.length > 0" v-loading="isLoading">
            <el-table-column prop="areaName" label="区域" width="180"> </el-table-column>
            <el-table-column label="部门">
                <template slot-scope="{ row }">
                    <span v-for="(item,index) in row.areaKey.split(',')" :key="index" class="depart">{{departmentList[item]}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="" label="操作" width="200">
                <template slot-scope="{ row }">
                    <div class="operation">
                        <span @click="editArea(row)">修改</span>
                        <span @click="areaStatus(row)">{{row.isUse==1?'禁用':'启用'}}</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <no-data v-if="tableData3.length === 0" style="background:rgba(255,255,255,0)"></no-data>

        <div class="paging">
            <el-pagination :current-page="page.now" @current-change="changePage" layout="total,prev, pager, next" :page-size="page.size" :total="page.total"></el-pagination>
        </div>
        <area-dialog ref="areaDialog" @getListData="getListData"></area-dialog>
    </div>
</template>
<script>
import { isArray } from '@/libs/utils.js'
import { mapGetters } from 'vuex'
import NoData from '@/basecomponents/NoData/index'
import AreaDialog from './AreaDialog'
export default {
    name: 'ActivityArea',
    props: {
    },
    data() {
        return {
            isLoading: false,
            page: {
                now: 1,
                size: 20,
                total: 0
            },
            tableData3: [],

            tableHeight: '333',
            isShowList: true
        }
    },
    computed: {
        ...mapGetters(['departmentList'])
    },
    created() {
        this.getListData()
    },
    mounted() {
        setTimeout(() => {
            this.getWinHeight()
        }, 200)
        $(window).resize(() => {
            this.getWinHeight()
        })
    },
    methods: {
        areaStatus(row) {
            let isUse = row.isUse == 1 ? 0 : 1
            let data = {
                areaId: row.areaId,
                isUse: isUse
            }
            this.$http
                .put(this.Global.baseURL + this.Global.api.v2.activityArea, data)
                .then(
                    res => {
                        this.submiting = false
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            this.$message.success(res.body.msg)
                            this.getListData()
                        } else {
                            this.$message.error(res.body.msg)
                        }
                    },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        // 设置固定高
        getWinHeight() {
            let winHeight = document.body.clientHeight
            this.tableHeight = winHeight - 230
        },
        changePage(val) {
            this.page.now = val
            this.getListData()
        },
        editArea(item) {
            this.$nextTick(_ => {
                this.$refs.areaDialog.open(this.departmentList, item)
            })
        },
        addArea() {
            this.$refs.areaDialog.open(this.departmentList)
        },
        // 操作
        doListData(item, operation) {
            let data = {
                type: operation,
                pictureIds: item.pictureId
            }
            this.$http
                .put(this.Global.baseURL + this.Global.api.v2.imgManage, data)
                .then(
                    res => {
                        this.submiting = false
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            this.$message.success(res.body.msg)
                            this.getListData()
                        } else {
                            this.$message.error(res.body.msg)
                        }
                    },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        // 查列表数据
        getListData() {
            this.$http
                .get(this.Global.baseURL + this.Global.api.v2.activityArea, { params: { type: 'list' } })
                .then(
                    res => {
                        if (res.body.code.toString() == this.Global.RES_OK && isArray(res.body.data)) {
                            this.tableData3 = res.body.data
                            this.page.total = res.body.data.length
                        } else {
                            this.$message.error(res.body.msg)
                        }
                    },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        }
    },
    components: {
        'no-data': NoData,
        'area-dialog': AreaDialog
    }
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
