<template>
    <div class="mainWrap PrintTemplateManagement">
        <!--大标题-->
        <!-- 打印模板管理 -->

        <page-title v-show="isView" :showTitle="false" :title="$t('mxpcweb.systemset.mailset.setindex.1552876651585')"></page-title>
        <el-tabs v-show="isView" v-model="activeName" @tab-click="handleClick" class="subTabs-pullRight">
            <!-- 客户 -->
            <el-tab-pane :label="$t('mxpcweb.workbench.1530703521879')" name="BF001">

            </el-tab-pane>
            <!-- 订单 -->
            <el-tab-pane :label="$t('mxpcweb.client.1529056921708')" name="SC002">

            </el-tab-pane>
            <!-- 报价 -->
            <el-tab-pane :label="$t('mxpcweb.client.1529056897952')" name="SC001">

            </el-tab-pane>
        </el-tabs>
        <!-- <template> -->
        <div class="divList MXscroll" ref="divList" v-show="isView">
            <el-form :inline="true" ref="dialogForm" label-width="100px">

                <!-- 快速查找 -->
                <el-form-item :label="$t('mxpcweb.systemset.mailset.setindex.1528979084946')" label-width="100px">
                    <el-input v-model="keyword" size="small" style="width:215px;"></el-input>
                </el-form-item>
                <el-form-item>
                    <!-- 搜索 -->
                    <el-button type="primary" @click="PrintListGet({})">{{$t('mxpcweb.systemset.mailset.setindex.1528978960400')}}</el-button>
                </el-form-item>
                <el-form-item>
                    <!-- 新建模板 -->
                    <el-button type="primary" @click="addTemplate()">{{$t('mxpcweb.systemset.mailset.templatemanage.1528977165522')}}</el-button>
                </el-form-item>

            </el-form>

            <el-table class="columnClass" :data="tableData" :height="listHeight" @selection-change="handleSelectionChange">
                <!-- <el-table-column type="selection" width="55">
                </el-table-column> -->
                <el-table-column width="55" class-name="default__Class_column_cyy">
                    <template slot-scope="{ row }">
                        <p class="tag" v-if="row.defaultFlag==1"><span class="text">默认</span></p>
                    </template>
                </el-table-column>
                <!-- 模板名称 -->
                <el-table-column :label="$t('mxpcweb.systemset.mailset.setindex.1552876690626')">
                    <template slot-scope="{ row }">
                        <div>{{row.reportName}}</div>
                    </template>
                </el-table-column>
                <!-- 模板类型 -->
                <el-table-column prop="" :label="$t('mxpcweb.systemset.mailset.setindex.1552876705430')">
                    <template slot-scope="{ row }">
                        <div>{{row.reportType==1?'企业报表':'系统报表'}}</div>
                    </template>
                </el-table-column>
                <!--  适用范围-->
                <el-table-column prop="" :label="$t('mxpcweb.systemset.mailset.setindex.1552876717233')">
                    <template slot-scope="{ row }">
                        <div v-if="row.scopeType==0">公共</div>
                        <div v-else-if="row.scope">
                            <span v-for="(item,index) in row.scope.split(',')" :key="index">{{contactList[item]}},&nbsp;</span>
                        </div>
                    </template>
                </el-table-column>
                <!-- 状态 -->
                <el-table-column prop="" :label="$t('mxpcweb.PP001.PP001List.1540347662369')">
                    <template slot-scope="{ row }">
                        <div v-if="row.disableFlag==0">{{$t('mxpcweb.basecomponents.1531105627500')}}</div>
                        <div v-else>{{$t('mxpcweb.systemset.bizfield.1530335350572')}}</div>
                    </template>
                </el-table-column>

                <!-- 最近更新时间 -->
                <el-table-column prop="modifyDate" :label="$t('mxpcweb.systemset.mailset.setindex.1552876728409')">
                </el-table-column>
                <!--  更新人-->
                <el-table-column :label="$t('mxpcweb.systemset.mailset.setindex.1552876738525')">
                    <template slot-scope="{ row }">
                        <span>{{contactList[row.modifyCtId]}}</span>
                    </template>
                </el-table-column>

                <!-- 操作 -->
                <el-table-column width="300">

                    <template slot-scope="{ row }">
                        <!-- 启用 -->
                        <div v-if="row.disableFlag==1" class="pull-right" :title="$t('mxpcweb.basecomponents.1531105627500')">
                            <i class="iconfont icon-play1" @click="handleAction(row.reportId,'use')">

                            </i>
                        </div>
                        <!-- 禁用 -->
                        <div v-if="row.disableFlag==0" class="pull-right" :title="$t('mxpcweb.systemset.bizfield.1530335350572')">
                            <i class="iconfont icon-pause" @click="handleAction(row.reportId,'disable')">

                            </i>
                        </div>
                        <!-- 默认 -->
                        <div v-if="row.defaultFlag!=1" class="pull-right" :title="$t('mxpcweb.am.1533202380303')">
                            <i class="iconfont icon-setDefault" @click="handleAction(row.reportId,'default')">

                            </i>
                        </div>
                        <!-- 转抄 -->
                        <div class="pull-right" :title="$t('mxpcweb.systemset.mailset.mailaccount.1553500270858')">
                            <i class="iconfont icon-copy" @click="DuplicateValidation(row.moduleCode, row.reportName,row)">

                            </i>
                        </div>
                        <!-- 模板设置 -->
                        <div v-if="row.reportType==1" class="pull-right" :title="$t('mxpcweb.systemset.mailset.mailaccount.1553500228713')">
                            <i class="iconfont icon-setting-main" @click="editTemplte(row)">

                            </i>
                        </div>
                        <!-- 删除 -->
                        <div v-if="row.reportType==1" class="pull-right" :title="$t('mxpcweb.am.1531893085173')">
                            <i class="iconfont icon-del" @click="deleteShow(row.reportId,'delete',row)"></i>
                        </div>
                        <!-- 编辑 -->
                        <div v-if="row.reportType==1" class="pull-right" :title="$t('mxpcweb.systemset.mailset.mailaccount.1529042764836')">
                            <i class="iconfont icon-edit-square" @click="$refs.TemplateSettings.showOpenCheckVisible('edit',row,row.defaultFlag)">

                            </i>
                        </div>
                        <!-- 查看 -->
                        <div class="pull-right" :title="$t('mxpcweb.PP001.PP001List.1542266515374')">
                            <i class="iconfont icon-eye" @click="$refs.TemplateSettings.showOpenCheckVisible('preview',row,row.defaultFlag)">
                            </i>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="paging.currentPage" :page-size="paging.eachNum" :page-sizes="paging.arrEachNum" :total="paging.total" layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
            </div>

        </div>

        <!-- </template> -->
        <template-sSettings ref="TemplateSettings" @getParmars="getParmars"></template-sSettings>

        <online-report-designer ref="OnlineReportDesigner" @addTemplate="addTemplate" @handleAction="handleAction" @editTemplte="editTemplte" @PrintListGet="RefreshList" :AvailableTemplate="AvailableTemplate" @DuplicateValidation="DuplicateValidation"></online-report-designer>
    </div>
</template>

<script>
import PageTitle from '@/components/PageTitle/index' // 大标题@/components/PageTitle/index
import { isObject } from '@/libs/utils.js'
import { mapGetters } from 'vuex'
import TemplateSettings from './Dialog/TemplateSettings'
import OnlineReportDesigner from './Dialog/OnlineReportDesigner'
export default {
    name: 'PrintTemplateManagement',
    props: {
        isView: {
            type: Boolean,
            default: function () {
                return true
            }
        }

    },
    data() {
        return {
            activeName: 'BF001', // 当前活动的右tab
            tableData: [],
            keyword: '',
            listHeight: '0',
            paging: {
                total: 0, // 总条数
                currentPage: 1, // 默认当前第几页
                eachNum: 20, // 每页条数
                arrEachNum: [10, 20, 40] // 可选的每页条数
            },
            urlId: '',
            AvailableTemplate: []

        }
    },
    computed: {
        ...mapGetters([
            'contactList',
            'company'
        ])
    },
    created() {
        this.PrintListGet({})
        this.AvailableTemplateGet()
    },
    mounted() {
        setTimeout(() => {
            this.getWinHeight()
        }, 200)
        // $(window).resize(() => {
        //     this.getWinHeight()
        // })
        this.$refs.TemplateSettings.getCheckData(this.activeName)
    },
    methods: {
        RefreshList() {
            this.PrintListGet({})
            this.AvailableTemplateGet()
        },
        addTemplate() {
            this.$refs.TemplateSettings.showOpenVisible(this.activeName, '1')
        },
        editTemplte(obj) {
            this.$refs.TemplateSettings.editTemplte(obj)
        },
        deleteShow(reportId, action, item) {
            let _this = this
            this.$confirm('请确认是否删除该打印模板', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                _this.handleAction(reportId, action, item)
            }).catch(() => { })
        },
        handleAction(reportId, action, item) {
            let _this = this
            _this.$http.delete(this.Global.baseURL + this.Global.api.v2.reportManage, {
                params: {
                    'reportId': reportId,
                    'operate': action
                }
            }).then(function (res) {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.$message.success(this.msg(res.body))
                    this.PrintListGet({})
                    if (action == 'delete') { // 彻底删除文件
                        this.$refs.OnlineReportDesigner.showOpen(action, item)
                    }
                } else {
                    this.$message.error(this.msg(res.body))
                }
            })
        },
        getParmars(type, dataParmart, blg = false) {
            this.$refs.OnlineReportDesigner.showOpen(type, dataParmart, blg)
        },
        // 打印列表列表
        PrintListGet(data) {
            data.pageN = this.paging.currentPage
            data.pageSize = this.paging.eachNum
            data.type = 'list'
            data.delState = 0
            data.moduleCode = this.activeName
            if (this.keyword != '') {
                data.reportName = this.keyword
            }

            this.$http.get(this.Global.baseURL + this.Global.api.v2.reportManage, {
                params: data
            }).then(function (res) {
                if (res.body.code.toString() == this.Global.RES_OK && isObject(res.body.data)) {
                    let datas = res.body.data
                    this.paging.total = datas.rowTotal
                    this.tableData = datas.reportManageList
                } else {
                    this.$message.error(this.msg(res.body))
                }
            })
        },
        AvailableTemplateGet() {
            let data = { type: 'useList', disableFlag: 0, delState: 0, moduleCode: this.activeName }
            this.$http.get(this.Global.baseURL + this.Global.api.v2.reportManage, {
                params: data
            }).then(function (res) {
                if (res.body.code.toString() == this.Global.RES_OK && isObject(res.body.data)) {
                    let datas = res.body.data
                    this.AvailableTemplate = datas.reportManageList
                } else {
                    this.$message.error(this.msg(res.body))
                }
            })
        },
        // 点右上角的tab切换
        handleClick(tab, event) {
            this.paging.currentPage = 0
            this.$refs.TemplateSettings.getCheckData(this.activeName)
            this.PrintListGet({})
            this.AvailableTemplateGet()
        },
        handleSelectionChange(val) {
            // this.multipleSelection = val
        },
        // 设置固定高
        getWinHeight() {
            const _this = this
            let winHeight = document.body.clientHeight
            _this.$refs.divList.style.height = winHeight - 150 + 'px'
            this.listHeight = winHeight - 240
        },
        /**
        * 每页数量改变
        */
        handleSizeChange(val) {
            this.paging.eachNum = val
            this.PrintListGet({})
        },

        //    页数变更
        handleCurrentChange(val) {
            this.paging.currentPage = val
            this.PrintListGet({})
        },
        // 名称重复验证
        DuplicateValidation(moduleCode, reportName, row) {
            let _this = this
            let params = {
                moduleCode: moduleCode,
                reportName: reportName + '_复制',
                type: 'checkName'
            }
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.reportManage, { params: params })
                .then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        this.$refs.OnlineReportDesigner.showOpen('copy', row, false)
                    } else {
                        _this.$message.error(res.body.msg)
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
        }
    },
    components: {
        'page-title': PageTitle,
        'template-sSettings': TemplateSettings,
        'online-report-designer': OnlineReportDesigner
    }
}
</script>
<style lang="less">
.default__Class_column_cyy {
    position: relative;
    overflow: hidden;
}
</style>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
