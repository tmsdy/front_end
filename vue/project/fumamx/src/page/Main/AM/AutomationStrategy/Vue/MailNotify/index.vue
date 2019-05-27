<template>
    <div class="MailNotify">
        <el-dialog :close-on-click-modal="false" v-dialogDrag title="邮件通知" custom-class="width720" :visible.sync="dialogVisible" size="small" :before-close="close">
            <div class="toolBar clearfix">
                <div class="pull-right">
                    <el-input class="search" placeholder="搜索通知名称" icon="search" v-model="searchKey" :on-icon-click="handleSearch" @keyup.enter.native="handleSearch()">
                    </el-input>
                    <!--   <el-button type="primary" class="button " @click="handleCreate()">新建自动化策略</el-button> -->
                </div>
            </div>
            <div class="notifyListBox">
                <el-row class="headerBox">
                    <el-col class="item" :span="5">
                        名称
                    </el-col>
                    <el-col class="item" :span="5">
                        所属模块
                    </el-col>
                    <el-col class="item" :span="5">
                        开发信模版
                    </el-col>
                    <el-col class="item" :span="5">
                        创建时间
                    </el-col>
                    <el-col class="item" :span="4">
                        创建人
                    </el-col>
                </el-row>
                <div class="bodyBox MXscroll">
                    <el-checkbox-group v-model="checkList">
                        <template v-if="!isLoading&&dataList.length>0">
                            <el-row v-for="(item,index) in dataList" :key="index" class="row">
                                <el-col class="item checkBoxItem ellipsis" :span="5">
                                    <el-checkbox :disabled="disableCheck.includes(item.detailActionId)" class="checkbox" :label="item"></el-checkbox> {{item.detailActionName}}
                                </el-col>
                                <el-col class="item ellipsis" :span="5">
                                    {{item.moduleName}}
                                </el-col>
                                <el-col class="item ellipsis" :span="5">
                                    {{item.templateName}}
                                </el-col>
                                <el-col class="item ellipsis" :span="5">
                                    {{item.createDate}}
                                </el-col>
                                <el-col class="item ellipsis" :span="4">
                                    {{item.createRealName}}
                                </el-col>
                            </el-row>
                        </template>
                        <no-data v-if="!isLoading&&dataList.length<=0"></no-data>
                        <loading v-if="isLoading"></loading>
                    </el-checkbox-group>

                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-pagination class="pull-left" @current-change="changePage" background layout="total,prev, pager, next" :page-size="page.size" :current-page="page.now" :total="page.total">
                </el-pagination>
                <el-button @click="close()">取 消</el-button>
                <el-button type="primary" @click="commit()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Loading from '@/basecomponents/Loading'
import NoData from '@/basecomponents/NoData'
export default {
    name: 'MailNotify',
    props: {
        moduleCode: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            dialogVisible: false,
            searchKey: '',
            checkList: [],
            dataList: [],
            disableCheck: [],
            isLoading: false,
            page: {
                now: 1,
                size: 10,
                total: 10
            }
        }
    },
    methods: {
        open(checkedIdArr = []) {
            this.disableCheck = checkedIdArr
            this.dialogVisible = true
            this.getData()
        },
        close() {
            this.page = {
                now: 1,
                size: 10,
                total: 10
            }
            this.checkList = []
            this.dataList = []
            this.dialogVisible = false
        },
        commit() {
            if (this.checkList.length <= 0) {
                this.$message({
                    message: '没有选择内容',
                    type: 'warning'
                })
                return
            }
            this.$emit('sure', [].concat(this.checkList))
            this.close()
        },
        changePage(i) {
            this.page.now = i
        },
        handleCreate() { },
        handleSearch() {
            this.searchKey = this.searchKey.trim()
            this.getData()
        },
        getData() {
            this.isLoading = true
            let url = this.Global.baseURL + this.Global.api.v2.autoStrategy_actions
            let data = {
                params: {
                    moduleCode: this.moduleCode,
                    actionId: '1',
                    type: 'list',
                    sendType: '1',
                    pageN: this.page.now,
                    pageSize: this.page.size
                }
            }
            if (this.searchKey) {
                Object.assign(data.params, { wildcardWords: this.searchKey })
            }
            this.$http.get(url, data)
                .then(res => {
                    if (res.body.code.toString() === this.Global.RES_OK) {
                        this.page.total = res.body.data.totalNum
                        this.dataList = res.body.data.list || []
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
        'loading': Loading,
        'no-data': NoData
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
