<template>
    <div>
        <page-title />
        <div class="list">
            <div class="wrapBox">
                <div class="wrapScroll ">
                    <div class="subtitleBox">
                        <div class="subtitle">{{subtitle}}</div>
                        <el-button class="addButton" type="primary" size="small" @click="addLandingPage">{{createbtn}}</el-button>
                    </div>
                    <el-table :data="tableData" style="width: 100%!" class="MXscroll tableList" :height="tableH" v-loading="isLoading">
                        <el-table-column prop="pageName" label="页面名称">
                        </el-table-column>
                        <el-table-column prop="moduleCode" label="模块">
                            <template slot-scope="scope">
                                <div v-if="scope.row.moduleCode == 'PS001'">客户询盘</div>
                                <div v-if="scope.row.moduleCode == 'WO001'">工单中心</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="status" label="状态">
                            <template slot-scope="scope">
                                <span @click.prevent="switchChange(scope.row, scope.$index)">
                                    <el-switch v-model="scope.row.status" on-value="1" off-value="0" on-text="" off-text=""></el-switch>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createDate" label="创建时间" width="180">
                        </el-table-column>
                        <el-table-column prop="createCtId" label="创建人">
                            <template slot-scope="scope">
                                <div>{{contactList[scope.row.createCtId]}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="insert" label="">
                            <template slot-scope="scope">
                                <button @click="insertOption(scope.row)" class="insertBtn" v-if="scope.row.status == '1'">嵌入选项</button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="handle" label="">
                            <template slot-scope="scope">
                                <div class="iconBox">
                                    <span class="optButton" @click="deldataList(scope.row)"><i class="iconfont icon-del" style="font-size: 14px"></i></span>
                                    <span class="optButton" @click="editdataList(scope.row)"><i class="iconfont icon-edit-single" style="font-size: 14px"></i></span>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!--分页-->
                <div v-show="tableData.length>0" style="text-align:center;position:inherit;padding: 15px 0 20px;">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="blockData.currentPage" :page-sizes="pageSizes" :page-size="blockData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="blockData.total">
                    </el-pagination>
                </div>
            </div>
            <!-- 弹出框-嵌入选项-->
            <dialog-inset ref="dialogWrap"></dialog-inset>
        </div>
    </div>
</template>

<script>
import PageTitle from '@/components/PageTitle/index' // 大标题
import listPage from '@/components/listPage/index' // 分页
import dialogInset from './DialogInset/index'
import { mapGetters } from 'vuex'

export default {
    name: 'List',
    data() {
        return {
            dd: '0',
            isLoading: false,
            tableH: '',
            tableData: [],
            subtitle: '几分钟内即可设计和创建各种页面，并可将数据无缝推送到您的CRM系统。此外还可将您的页面嵌入官网、营销邮件等...',
            createbtn: '创建LandingPage',
            dialogVisible: false,
            itemData: '',
            // 分页操作
            blockData: {
                pageSize: 20,
                total: 0,
                currentPage: 1
            },
            pageSizes: [20, 30, 40, 50, 100, 200]
        }
    },
    filters: {
        switch(data) {
            return data.toString()
        }
    },
    created() {
        this.getTableHeight()
        this.getList()
    },
    mounted() { },
    methods: {
        handleSizeChange(val) {
            this.blockData.pageSizes = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.blockData.currentPage = val
            this.getList()
        },
        getListData() {

        },
        addLandingPage() {
            this.$emit('changeTabData', '2')
        },
        insertOption(x) { // 打开弹框并赋值行数据给子组件
            this.$refs.dialogWrap.open(x)
        },
        getTableHeight() {
            let tableHeight = window.window.innerHeight - 260
            this.tableH = tableHeight
        },
        handleClose() {
            this.dialogVisible = false
        },
        getList() {
            this.isLoading = true
            let { accessToken } = this.getToken()
            let data = {
                accessToken: accessToken,
                type: 'list',
                pageN: this.blockData.currentPage,
                pageSize: this.blockData.pageSize
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v2.landingPage, { params: data })
                .then(res => {
                    this.isLoading = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.blockData.total = res.body.data.totalNums
                        this.tableData = res.body.data.landingPages.map(function (item) {
                            item.status = item.status.toString()
                            return item
                        })
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        switchChange(x, index) {
            let msg = ''
            if (x.status == 1) {
                msg = '禁用网页表单后，通过该表单提交的所有记录都将被忽略。您确定要禁用这个网页表单吗？'
            } else {
                msg = '您确定要激活这个网页表单吗？'
            }
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.updataList(x, index)
            }).catch(() => {
            })
        },
        updataList(x, index) {
            this.isLoading = true
            let status = Math.abs(x.status - 1)
            this.$http.put(this.Global.baseURL + this.Global.api.v2.landingPage, {
                type: 'edit',
                pageId: x.pageId.toString(),
                status: status
            }).then(res => {
                this.isLoading = false
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.$message({
                        type: 'success',
                        message: res.body.msg
                    })
                    this.tableData[index].status = Math.abs(x.status - 1).toString()
                } else {
                    this.$message.error(this.msg(res.body))
                }
            },
                res => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                }
            )
        },
        deldataList(row) { // 删除列表
            this.$confirm('真的确定要删除' + row.pageName + '吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.isLoading = true
                return this.$http.put(this.Global.baseURL + this.Global.api.v2.landingPage, {
                    type: 'delete',
                    pageId: row.pageId.toString()
                }).then(res => {
                    this.isLoading = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.$message({
                            type: 'success',
                            message: res.body.msg
                        })
                        this.getList()
                    } else {
                        this.$message.error(this.msg(res.body))
                        return false
                    }
                },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                        return false
                    }
                )
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        editdataList(row) { // 编辑列表
            this.$emit('changeTabData', '3')
            this.$emit('basicForm', row)
        }
    },
    computed: {
        ...mapGetters([
            'contactList'
        ])
    },
    components: {
        'page-title': PageTitle,
        'list-page': listPage,
        'dialog-inset': dialogInset
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
