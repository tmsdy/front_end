<template>
    <div class="Recycle">
        <div class="tabsBox">
            <div class="tabs">
                <!-- 报价单 -->
                <div class="tabsItem tabsItem1" :class="moduleCode == 'SC001' ? 'tabsItemCheck' : ''" @click="moduleCode = 'SC001'">{{$t('mxpcweb.sale.components.1557565540790')}}</div>
                <!-- 订单 -->
                <div class="tabsItem tabsItem2" :class="moduleCode == 'SC002' ? 'tabsItemCheck' : ''" @click="moduleCode = 'SC002'">{{$t('mxpcweb.sale.components.1557565548543')}}</div>
            </div>
        </div>
        <div class="searchBox">
            <el-input class="searchInput" v-model="keywords"></el-input>
            <!-- 搜索 -->
            <el-button class="searchBut" type="primary">{{$t('mxpcweb.sale.components.1557565265083')}}</el-button>
        </div>
        <div class="listBox">
            <div class="list" :style="{'padding-right': hasScrollbarValue ? '27px' : '22px' }">
                <el-row :gutter="20">
                    <!-- 报价单 -->
                    <!-- 订单 -->
                    <!-- 编号 -->
                    <el-col :span="6">{{moduleCode == 'SC001' ? $t('mxpcweb.sale.components.1557565540790') : $t('mxpcweb.sale.components.1557565548543')}}{{$t('mxpcweb.sale.components.1557565549131')}}</el-col>
                    <!-- 主题 -->
                    <el-col :span="6">{{$t('mxpcweb.sale.components.1557565549307')}}</el-col>
                    <!-- 删除者 -->
                    <el-col :span="6">{{$t('mxpcweb.sale.components.1557565565613')}}</el-col>
                    <!-- 删除时间 -->
                    <el-col :span="6">{{$t('mxpcweb.sale.components.1557565565821')}}</el-col>
                </el-row>
            </div>
            <div class="contentBox MXscroll" v-loading="loading" ref="customerTables">
                <el-checkbox-group v-model="controlData.checkedCities" @change="handleCheckedCitiesChange">
                    <no-data v-if="list.length==0&&!loading" style="background:rgba(255,255,255,0)"></no-data>
                    <el-row v-else class="list1" :gutter="20" v-for="(item,index) in list" :key="index">
                        <div :class="[controlData.checkedCities.length==0 ? 'listCheckNone' : 'listChecks']">
                            <el-checkbox :label="item[moduleCode == 'SC001' ? moduleStruct.identField : moduleStruct1.identField]" size="small">&nbsp;</el-checkbox>
                        </div>
                        <el-col :span="6">{{item[moduleCode == 'SC001' ? moduleStruct.titleField : moduleStruct1.titleField]}}&nbsp;</el-col>
                        <el-col :span="6">{{item[moduleCode == 'SC001' ? moduleStruct.theme : moduleStruct1.theme]}}&nbsp;</el-col>
                        <el-col :span="6">
                            <ctId-name :value="{value:item.modifyCtId}"></ctId-name>
                            &nbsp;
                        </el-col>
                        <el-col :span="6">{{item.modifyDate}}&nbsp;</el-col>
                        <el-col :span="3" class="listCol4">
                            <div class="listCol4Item">
                                <!-- 恢复 -->
                                <span class="optButton left10" style="margin-left:10px;" :title="$t('mxpcweb.sale.components.1557565566053')" @click="reply(item)">
                                    <i class="iconfont icon-reply"></i>
                                </span>
                                <!-- 彻底删除 -->
                                <span class="optButton left10" style="margin-left:10px;" :title="$t('mxpcweb.sale.components.1557565566249')" @click="deleteItem(item)">
                                    <i class="iconfont icon-del"></i>
                                </span>
                            </div>
                        </el-col>
                    </el-row>
                </el-checkbox-group>
            </div>
            <!--分页-->
            <list-page v-show="controlData.checkedCities.length==0" style="background:#f7f8f9;text-align:center" :blockData="blockData" @getListData="getListData"></list-page>
            <!--footer-->
            <foot-control ref="footControl" :moduleCode="moduleCode" :moduleStruct="moduleCode == 'SC001' ? moduleStruct : moduleStruct1"  @getListData="getListData" :listOpt="moduleCode == 'SC001' ? listOpt : listOpt1"  :customerLists="list"  :controlData="controlData"  iseType="通用"></foot-control>
        </div>
    </div>
</template>

<script>
import NoData from '@/basecomponents/NoData/index'
import listPage from '@/components/listPage/index' // 分页
import ctIdName from '@/components/ListShowControls/Owner/index' // 分页
import footControl from '@/page/Main/Client/Layout/standard/ClientManagIndex/customerLists/footControl/index'

export default {
    name: 'Recycle',
    props: {
    },
    data() {
        return {
            moduleCode: 'SC001',
            keywords: '',
            list: [],
            pageUrl: '',
            blockData: {
                pageSize: 20,
                total: 0,
                fromNum: 0
            },
            // 底部操作
            controlData: {
                checkedCities: [],
                checkAll: false, // 列表全选状态弹框
                isIndeterminate: false//
            },
            listOpt: [{
                iconURI: 'icon-reply',
                optCode: 'otRecovery',
                optModuleCode: 'SC001',
                // 批量恢复
                optName: this.$t('mxpcweb.sale.components.1557565580201')
            }, {
                iconURI: 'icon-del',
                optCode: 'otSaleDelete',
                optModuleCode: 'SC001',
                // 彻底删除
                optName: this.$t('mxpcweb.sale.components.1557565566249')
            }],
            listOpt1: [{
                iconURI: 'icon-reply',
                optCode: 'otRecovery',
                optModuleCode: 'SC002',
                // 批量恢复
                optName: this.$t('mxpcweb.sale.components.1557565580201')
            }, {
                iconURI: 'icon-del',
                optCode: 'otSaleDelete',
                optModuleCode: 'SC002',
                // 彻底删除
                optName: this.$t('mxpcweb.sale.components.1557565566249')
            }],
            moduleStruct: {
                identField: 'quotaId',
                titleField: 'quotaCode',
                theme: 'quotaTheme'
            },
            moduleStruct1: {
                identField: 'orderId',
                titleField: 'orderCode',
                theme: 'orderTheme'
            },
            loading: true,
            hasScrollbarValue: false
        }
    },
    created() {
        this.pageUrl = this.$route.path
        this.getListData()
    },
    computed: {
    },
    methods: {
        // 单选触发事件
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length
            this.controlData.checkAll = checkedCount === this.list.length// 选中的个数是否等于总个数
            this.controlData.isIndeterminate = checkedCount > 0 && checkedCount < this.list.length
        },
        reply(itemData) {
            // 恢复
            let obj = {
                optData: {
                    iconURI: 'icon-reply',
                    optCode: 'otRecovery',
                    optModuleCode: this.moduleCode,
                    optName: this.$t('mxpcweb.sale.components.1557565566053')
                },
                itemData: itemData,
                billId: itemData[this.moduleCode == 'SC001' ? 'quotaId' : 'orderId'],
                billName: itemData[this.moduleCode == 'SC001' ? 'quotaCode' : 'orderCode'],
                moduleCode: this.moduleCode,
                next: () => {
                    this.getListData()
                }
            }
            ep.emit('optClick', obj)
        },
        deleteItem(itemData) {
            // 彻底删除
            this.$confirm(this.$t('mxpcweb.client.list.1544687338458', {ok: this.$t('mxpcweb.sale.components.1557565566249')}), this.$t('mxpcweb.client.1529047715824'), {
                confirmButtonText: this.$t('mxpcweb.client.1529047741736'),
                cancelButtonText: this.$t('mxpcweb.client.1529047588840'),
                type: 'warning'
            }).then(() => {
                let data = {
                    moduleCode: this.moduleCode
                }
                data.identFieldValue = itemData[this.moduleCode == 'SC001' ? 'quotaId' : 'orderId']
                this.$http.delete(this.Global.baseURL + this.Global.api.v2.document_quotation_delete, { params: data}).then((res) => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.$message.success(this.msg(res.body))
                        this.getListData()
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                }, (res) => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
            }).catch(() => {
            })
        },
        getListData() {
            this.$http.get(this.Global.baseURL + this.Global.api.v2.document_generalOperate_get, { params: {
                moduleCode: this.moduleCode,
                searchType: 'recycleList',
                from: this.blockData.fromNum,
                size: this.blockData.pageSize
            } }).then((res) => {
                this.loading = false
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.list = res.body.data.list || []
                    this.blockData.total = res.body.data.totalNum || 0
                } else {
                    this.list = []
                    this.blockData.total = 0
                    this.$message.error(this.msg(res.body))
                }
                this.hasScrollbar()
            }, (res) => {
                this.loading = false
                this.blockData.total = 0
                this.list = []
                this.hasScrollbar()
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        hasScrollbar() {
            let time = setTimeout(() => {
                let thisDom = this.$refs.customerTables
                if (thisDom) {
                    this.hasScrollbarValue = thisDom.scrollHeight > thisDom.clientHeight
                } else {
                    this.hasScrollbarValue = false
                }
                window.clearTimeout(time)
            }, 5)
        }
    },
    watch: {
        $route(val) {
            if (val.path == this.pageUrl) {
                this.getListData()
            }
        },
        moduleCode() {
            this.loading = true
            this.blockData = {
                pageSize: 20,
                total: 0,
                fromNum: 0
            }
            this.controlData = {
                checkedCities: [],
                checkAll: false, // 列表全选状态弹框
                isIndeterminate: false//
            }
            this.list = []
            this.getListData()
        }
    },
    components: {
        'no-data': NoData,
        'list-page': listPage,
        'ctId-name': ctIdName,
        'foot-control': footControl
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
