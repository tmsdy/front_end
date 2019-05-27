<template>
    <div class="DialogSearchRecord">
        <el-dialog v-dialogDrag title="搜索记录" :visible.sync="dialogVisible" size="small" :before-close="handleClose">
            <el-table :data="list" stripe style="width: 100%" v-loading="loading">
                <el-table-column prop="createdate" label="搜索时间" width="180px">
                </el-table-column>
                <el-table-column prop="keywords" label="关键词">
                </el-table-column>
                <el-table-column prop="deep_count" label="深挖结果（条）" width="150px">
                </el-table-column>

                <el-table-column label="操作" width="80px">
                    <template slot-scope="scope">
                        <el-button @click="operation(scope.row)" type="text" size="small">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination @current-change="pageChange" :current-page="page.now" layout="total,  prev, pager, next, jumper" :total="page.total">
                </el-pagination>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'DialogSearchRecord',
    data() {
        return {
            dialogVisible: false,
            page: {
                now: 1,
                size: 10,
                total: 0
            },
            list: [],
            loading: false
        }
    },
    methods: {
        open() {
            this.dialogVisible = true
            this.getRecord()
        },
        operation(row) {
            this.$emit('reSearch', row.keywords)
            this.dialogVisible = false
        },
        sizeChange(sizeTemp) {
            this.page.size = sizeTemp
            this.getRecord()
        },
        pageChange(i) {
            this.page.now = i
            this.getRecord()
        },
        handleClose(done) {
            /*  */
            done()
        },
        getRecord() {
            this.loading = true
            let url = this.Global.baseURL + this.Global.api.v2.find_search
            let data = {
                page: this.page.now,
                pageSize: this.page.size
            }
            this.$http.post(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.list = res.body.data.result
                        this.page.total = parseInt(res.body.data.total_count)
                        this.loading = false
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                })
                .catch(err => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        }
    },
    components: {

    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
