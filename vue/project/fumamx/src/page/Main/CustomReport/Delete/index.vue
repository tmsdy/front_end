<template>
    <div class="tableRowClassName">
        <template>
            <page-title title="已删除的报表" iconfont="icon-share-set"></page-title>
            <div class="boxList">
                <el-row :gutter="20">
                    <el-col :span="12">
                        报表名称
                    </el-col>
                    <el-col :span="12">
                        报表描述
                    </el-col>
                    <!-- <el-col :span="5">
                        所属分类
                    </el-col>
                    <el-col :span="4">
                        创建者
                    </el-col>
                    <el-col :span="4">
                        报表类型
                    </el-col> -->
                </el-row>
                <div class="posRight">
                    删除时间
                </div>
            </div>
            <!-- loading?classA:classB -->
            <div class="customerTables MXscroll" ref="customerTables" v-loading='loading' :class="{ scrollHidden: loading}">
                <div class="customerTable">
                    <no-data v-show="listData.length==0"></no-data>
                    <el-checkbox-group v-model="controlData.checkedCities" @change="handleCheckedCitiesChange">
                        <ul class="customerList" v-show="listData!=0">
                            <li v-for="(item,index) in listData" :key="index">
                                <div :class="[controlData.checkedCities.length==0 ? 'listCheckNone' : 'listChecks']">
                                    <el-checkbox size="small" :label="item.reportFolderId+'_'+item.reportId">&nbsp;</el-checkbox>
                                </div>
                                <el-row :gutter="20" class="customerInfo">
                                    <el-col :span="12" style="cursor: pointer;">
                                        <span>{{(item.name) ? item.name:'&nbsp;'}}</span>
                                    </el-col>
                                    <el-col :span="12">
                                        <span class="hidden">{{item.describe || '&nbsp;'}}</span>
                                    </el-col>
                                </el-row>
                                <div class="listTimes3">
                                    <detail-opt :detailOptData="detailOpt" :itemData="item" @iconLoading="iconLoading" @getListReport="getDustbinData"></detail-opt>
                                </div>
                                <div class="listTimes1 ellipsis">
                                    {{item.lastViewTime}}
                                    <!-- <component v-bind:is="'control24'" ref="control" :value="{value:list.ownerCtId}"></component> -->
                                </div>
                                <!-- 标记收藏 -->
                                <span v-if="item.collect" class="starBox">
                                    <i class="iconfont icon-star-card"></i>
                                </span>
                            </li>
                        </ul>
                    </el-checkbox-group>
                </div>
            </div>
            <!--footer-->
            <foot-control ref="footControl" :moduleCode="moduleCode" :moduleStruct="moduleStruct" :listOpt="listOpt" :customerLists="customerLists" :controlData="controlData" @getListReport="getDustbinData" @clearChecked="clearChecked"></foot-control>
            <!--分页 :blockData="blockData" @getListData="getListData2"-->
            <list-page v-show="controlData.checkedCities.length==0" ref="listPage" style="text-align:center;background:#f7f8f9" :moduleCode="moduleCode" :blockData="blockData" @getListData="getDustbinData"></list-page>
        </template>
    </div>
</template>
<script>
import PageTitle from '@/components/PageTitle/index'
import detailOpt from '../components/detailOpt/index'
import footControl from '../components/footControl/index'
import ListShow from '@/components/ListShowControls/index.js'
import listPage from '@/components/listPage/index'
import NoData from '@/basecomponents/NoData/index'
export default {
    name: 'currency',
    props: {
        listSet: {
            type: Object,
            default: function () {
                return {}
            }
        },
        detailOpt: {
            type: Array,
            default: function () {
                return [
                    {
                        iconURI: 'icon-copy',
                        optCode: 'otRestore',
                        optModuleCode: 'BF004',
                        optName: '恢复'
                    },
                    {
                        iconURI: 'icon-del',
                        optCode: 'otPerDelete',
                        optModuleCode: 'BF004',
                        optName: '永久删除'
                    }
                ]
            }
        },

        fastOpt: {// 获取空间操作按钮列表
            type: Array,
            default: function () {
                return []
            }
        },
        moduleStruct: {
            type: Object,
            default: function () {
                return {}
            }
        },
        moduleCode: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            loading: false,
            listData: [],
            // 分页操作
            blockData: {
                pageSize: 20,
                total: 0,
                fromNum: 0
            },
            controlData: {
                checkedCities: [],
                checkAll: false, // 列表全选状态弹框
                isIndeterminate: false//
            },
            customerLists: [], // 留给多选框备份数据列表数据
            // 批量操作按钮
            listOpt: [
                {
                    iconURI: 'icon-copy',
                    optCode: 'otRestore',
                    optModuleCode: 'BF004',
                    optName: '恢复'
                },
                {
                    iconURI: 'icon-del',
                    optCode: 'otPerDelete',
                    optModuleCode: 'BF004',
                    optName: '永久删除'
                }
            ]
        }
    },
    created() {
        this.getDustbinData()
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        clearChecked() {
            this.controlData.checkedCities = []
        },
        iconLoading(n) {
            this.loading = n
        },
        // 获取列表数据
        getDustbinData() {
            this.loading = true
            // let { id } = this.$route.params
            let data = {
                from: this.blockData.fromNum,
                size: this.blockData.pageSize
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v1.dustbin, { params: data })
                .then(res => {
                    this.loading = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        // this.menuNavList = res.body.data.packageList
                        if (res.body.data.reportList) {
                            this.listData = res.body.data.reportList
                            this.customerLists = res.body.data.reportList
                            this.blockData.total = res.body.data.totalCount
                        }
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        // 单选触发事件
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length
            this.controlData.checkAll = checkedCount === this.customerLists.length// 选中的个数是否等于总个数
            this.controlData.isIndeterminate = checkedCount > 0 && checkedCount < this.customerLists.length
        }
    },
    watch: {
        // 路由变化时
        $route(to, from) {
            if (this.$route.path.indexOf('/main/customReport/list') >= 0) {
                this.getDustbinData()
            }
        }
    },
    components: Object.assign({
        'detail-opt': detailOpt,
        'page-title': PageTitle,
        'list-page': listPage,
        'foot-control': footControl,
        'no-data': NoData
    }, ListShow),
    beforeDestroy: function () {
        // this.hasScrollbar = null
        // this.showDialog = null
        this.switchList = null
        this.getListData = null
        this.listaddTab = null
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
