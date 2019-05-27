<template>
    <div class="customerLists">
        <!-- 拼命加载中 -->
        <div class="customerListsBox MXscroll" v-loading="listLoading" :element-loading-text="$t('mxpcweb.client.detail.1529993193937')" ref="listWrap" :style="{bottom:customerLists.length==0?'0':'68px', 'top': topHeight + 'px'}">
            <div class="customerGroup">
                <el-checkbox-group v-model="controlData.checkedCities" @change="handleCheckedCitiesChange">
                    <currency :moduleCode="moduleCode" v-if="viewLayout=='standard'"  @closeListLoad="closeListLoad"  :dynamicTags="dynamicTags" ref="customerList" :controlData="controlData"  @getListData="getListDatas"  :moduleStruct="moduleStruct" :listSet="listSet" :detailOpt="detailOpt" :fastOpt="fastOpt"></currency>
                    <customer :moduleCode="moduleCode" v-else-if="viewLayout=='classicListCustomer'||viewLayout=='classicSeasCustomer'"  @getLabelList="getLabelList" @closeListLoad="closeListLoad" :dynamicTags="dynamicTags" :nowSort="nowSort" ref="customerList" :controlData="controlData"   @getListData="getListDatas"  :moduleStruct="moduleStruct" :listSet="listSet" :detailOpt="detailOpt" :fastOpt="fastOpt"></customer>
                    <contacts :moduleCode="moduleCode" v-else-if="viewLayout=='classicListContacts'"  @getLabelList="getLabelList" @closeListLoad="closeListLoad"  :dynamicTags="dynamicTags" :nowSort="nowSort" ref="customerList" :controlData="controlData"   @getListData="getListDatas" :moduleStruct="moduleStruct" :listSet="listSet" :detailOpt="detailOpt"  :fastOpt="fastOpt"></contacts>
                    <order-SC002 :moduleCode="moduleCode" v-else-if="moduleCode == 'SC002'"  @getLabelList="getLabelList" @closeListLoad="closeListLoad"  :dynamicTags="dynamicTags" :nowSort="nowSort" ref="customerList" :controlData="controlData"   @getListData="getListDatas"  :moduleStruct="moduleStruct" :listSet="listSet" :detailOpt="detailOpt" :fastOpt="fastOpt"></order-SC002>
                    <work-order :moduleCode="moduleCode" v-else  @getLabelList="getLabelList" @closeListLoad="closeListLoad"  :dynamicTags="dynamicTags" :nowSort="nowSort" ref="customerList" :controlData="controlData"   @getListData="getListDatas"  :moduleStruct="moduleStruct" :listSet="listSet" :detailOpt="detailOpt" :fastOpt="fastOpt"></work-order>
                </el-checkbox-group>
            </div>
            <span class="titleTimeControl ellipsis" :title="nowSort.cnFieldCaption" v-if="customerLists.length!=0&&(moduleCode=='BF001'||moduleCode=='BF003')">
                {{nowSort.cnFieldCaption}}
                <span class="titleTimeBox text-hover">
                    <div v-if="titleTime" @click="upSort()" class="triangle-up-grey"></div>
                    <div v-if="!titleTime" class="triangle-up-blue"></div>
                    <div v-if="!titleTime" @click="downSort()" class="triangle-down-grey"></div>
                    <div v-if="titleTime" class="triangle-down-blue"></div>
                </span>
            </span>
        </div>
        <!--footer-->
        <foot-control ref="footControl" :moduleCode="moduleCode" :moduleStruct="moduleStruct"  @getListData="getListDatas" :listOpt="listOpt" :naxtArgument="naxtArgument"  :customerLists="customerLists"  :controlData="controlData"  iseType="通用" @getListSet="getListSet"></foot-control>
        <!--分页-->
        <list-page v-show="controlData.checkedCities.length==0" ref="listPage" style="text-align:center;" :moduleCode="moduleCode"  :blockData="blockData"  @getListData="getListData2"></list-page>
    </div>
</template>
<script>
/**
 * 描述：客户管理-客户列表
 * 作者：何俊峰
 * 时间：2017/11/10
 */
import { isArray, isObject } from '@/libs/utils.js'
import { mapGetters, mapMutations } from 'vuex'
import listPage from '@/components/listPage/index'
import footControl from './footControl/index'
import currency from './view/currency'
import contacts from './view/contacts'
import customer from './view/customer'
// import ControlsExhibition from '@/components/ControlsExhibition/index.js'
import workOrder from './view//workOrder'
import OrderSC002 from './view//OrderSC002'

export default {
    name: 'customerLists',
    props: {
        nowSort: {
            type: Object,
            default: function() {
                return {
                    fieldName: 'createDate'
                }
            }
        },
        topHeight: {
            type: Number,
            default: 0
        },
        listSet: {
            type: Object,
            default: function() {
                return {}
            }
        },
        detailOpt: {// 单个操作
            type: Array,
            default: function() {
                return []
            }
        },
        listOpt: {// 批量操作
            type: Array,
            default: function() {
                return []
            }
        },
        moduleCode: {
            type: String,
            default: ''
        },
        fastMenuShows: {
            type: Boolean,
            default: false
        },
        fastOpt: {// 获取空间操作按钮列表
            type: Array,
            default: function() {
                return []
            }
        },
        viewType: {
            type: String,
            default: ''
        },
        moduleStruct: {
            type: Object,
            default: function() {
                return {}
            }
        }
    },
    data() {
        return {
            order: 'desc', // 当前升序还是降序
            titleTime: true, // 升序降序显示
            // 列表
            sort: 'createDate',
            customerLists: [], // 留给多选框备份数据列表数据
            otherArgument: {}, // 请求列表数据的参数
            fastArgument: {}, // 请求快速查询列表数据的参数
            allArgument: {},
            dynamicTags: [], // 标签列表
            listLoading: true,
            // 底部操作
            controlData: {
                checkedCities: [],
                checkAll: false, // 列表全选状态弹框
                isIndeterminate: false//
            },

            // 分页操作
            blockData: {
                pageSize: 50,
                total: 0,
                fromNum: 0
            },
            totalNum: 0,
            naxtArgument: {}, // 上次请求的参数
            viewLayout: '',
            path: '',
            msgDialog: true,
            setTimeoutData: null
        }
    },
    created() {
        let { viewLayout } = this.getRoute()
        this.viewLayout = viewLayout
        this.path = this.$route.path
        this.unit()
    },
    mounted() {
    },
    methods: {
        ...mapMutations('client', {// 用于清空参数
            SET_ROUTPARAMETERS: 'SET_ROUTPARAMETERS'
        }),
        isEmptyObject(obj) {
            return Object.keys(obj).length !== 0
        },
        // 设置列表到顶部距离
        // setScrollTop(val) {
        //     if (!isNumber(val) || val <= 78) {
        //         val = 78
        //     }
        //     this.$refs.listWrap.style.top = val + 'px'
        // },
        // 设置列表到底部距离
        setScrollBottom(val) {
            this.$refs.listWrap.style.bottom = val + 'px'
        },
        // 页面初始化
        unit() {
            if (this.isEmptyObject(this.routParameters)) {
                this.getListDatas(this.routParameters, true)
            } else {
                this.getListDatas(false, true)
            }
        },
        // 获取结构字段数据
        getListSet() {
            this.$emit('upListSet')
        },
        // 转化结构字段数据
        swidchListSet(list) {
            let newLList = []
            list.forEach((element) => {
                if (element.fieldCategory == 2) {
                    newLList.push(element)
                }
            })
            return newLList
        },

        // // 列表栏复选框
        // 单选触发事件
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length
            this.controlData.checkAll = checkedCount === this.customerLists.length// 选中的个数是否等于总个数
            this.controlData.isIndeterminate = checkedCount > 0 && checkedCount < this.customerLists.length
        },

        upSort() { // 列表升序
            this.titleTime = !this.titleTime
            this.order = 'asc'
            this.getListDatas()
        },
        downSort() { // 列表降序
            this.titleTime = !this.titleTime
            this.order = 'desc'
            this.getListDatas()
        },
        getListData2() {
            this.getListDatas(false, true)
        },
        getFastListData(value) {
            this.getListDatas({
                keywords: value.replace(/(^\s*)|(\s*$)/g, '')
            }, true, false, true)
        },
        clearPageList() {
            this.blockData.fromNum = 0
            let time = setTimeout(() => {
                if (this.$refs.listPage) {
                    this.$refs.listPage.currentPageclear()
                }
                clearTimeout(time)
            }, 20)
        },
        // 列表
        getListDatas(otherArgument, upData, nowSort, saveArg) { // 获取列表数据
            if (this.setTimeoutData) {
                clearTimeout(this.setTimeoutData)
            }
            this.setTimeoutData = setTimeout(() => {
                this.setTimeoutData = null
                if (otherArgument) {
                    this.naxtArgument = otherArgument
                    this.clearPageList()
                }
                if (upData) {
                    this.listLoading = true
                }
                let searchType = ''
                let viewType = this.viewType
                if (viewType == '') {
                    viewType = this.getRoute().viewType
                }
                if (viewType == 'recycle') {
                    searchType = 'recycleList'
                } else if (viewType == 'focus') {
                    searchType = 'focusedList'
                } else if (viewType == 'list') {
                    searchType = 'list'
                } else if (viewType == 'seas') {
                    searchType = 'seasList'
                }
                let argument = {
                    moduleCode: this.moduleCode,
                    searchType: searchType,
                    order: this.order,
                    from: this.blockData.fromNum,
                    size: this.blockData.pageSize,
                    sort: this.nowSort.fieldName ? this.nowSort.fieldName : 'createDate'
                }
                let focusArgument = {}
                if (nowSort) {
                    argument['sort'] = nowSort
                    this.sort = nowSort
                }
                if (!saveArg) {
                    if (otherArgument) { // 记住上次查询参数
                        this.otherArgument = otherArgument
                    };
                    focusArgument = $.extend({}, argument, this.fastMenuShows ? this.fastArgument : this.otherArgument)
                    argument = $.extend({}, argument, this.fastMenuShows ? this.fastArgument : this.otherArgument)
                } else {
                    this.fastArgument = otherArgument
                    focusArgument = $.extend({}, argument, this.fastArgument)
                    argument = $.extend({}, argument, this.fastArgument)
                }
                let url = this.Global.baseURL + this.Global.api.Client.list.getList_Polymerization
                if (this.billParameter.moduleCode && this.billParameter.moduleCode == this.moduleCode) {
                    argument = $.extend({}, argument, this.billParameter.kocsJson)
                    focusArgument = $.extend({}, focusArgument, this.billParameter.kocsJson)
                    if (this.billParameter.sysOrderNum == 2) {
                        argument.isReq = true
                    }
                }
                if (this.viewLayout != 'classicListCustomer' && this.viewLayout != 'classicSeasCustomer') {
                    if (this.blockData.fromNum == 0) {
                        if (argument.from == 0) {
                            focusArgument.searchType = 'focusedList'
                            focusArgument.from = 0
                            focusArgument.size = 50
                            focusArgument.isReq = true
                        }
                    }
                }
                this.allArgument = argument
                let allArgument = {
                    customerList_get: argument,
                    customerFocusList_get: focusArgument,
                    label_get: {
                        searchType: 'list',
                        moduleCode: this.moduleCode
                    }
                }
                this.$http.get(url, { params: allArgument }).then((res) => {
                    if (res.body.code.toString() == this.Global.RES_OK && isObject(res.body.data)) {
                        this.closeListLoad()
                        let { res_customerFocusList, res_customerList, res_label } = res.body.data
                        // 接口失败判断
                        if (res_customerFocusList.code.toString() != this.Global.RES_OK) {
                            this.$message.error(res_customerFocusList.msg)
                            return false
                        }
                        if (res_customerList.code.toString() != this.Global.RES_OK) {
                            this.$message.error(res_customerList.msg)
                            return false
                        }
                        if (res_label.code.toString() != this.Global.RES_OK) {
                            this.$message.error(res_label.msg)
                            // return false
                        }
                        // 过期判断
                        if (
                            !isObject(res_customerFocusList.data) ||
                            !isObject(res_customerList.data)
                            ) {
                            this.$message.error('数据类型错误')
                            return
                        }
                        // 数据处理
                        this.dynamicTags = res_label.data || []// 标签

                        let customerList = []// 单据列表数据
                        if (res_customerList.data.list) {
                            customerList = res_customerList.data.list
                        }

                        let customerFocusList = []// 单据列表数据
                        if (res_customerFocusList.data.list) {
                            customerFocusList = res_customerFocusList.data.list
                        }

                        this.totalNum = res_customerList.data.totalNum
                        this.blockData.total = this.totalNum

                        this.controlData = {// 清除多选
                            checkedCities: [],
                            checkAll: false,
                            isIndeterminate: false
                        }
                        let allList = customerFocusList.concat(customerList)
                        this.customerLists = []
                        this.customerLists = allList
                        let time = setTimeout(() => {
                            if (this.$refs.customerList) {
                                if (this.$refs.customerList.switchList) {
                                    if (this.viewLayout == 'classicListContacts') {
                                        this.$refs.customerList.switchList(customerList, argument.sort, upData, customerFocusList)
                                    } else {
                                        this.$refs.customerList.switchList(allList, argument.sort, upData, false)
                                    }
                                    if (this.viewLayout == 'classicListCustomer' || this.viewLayout == 'classicSeasCustomer') {
                                        this.$emit('closeLoading')
                                    }
                                    if (this.isEmptyObject(this.routParameters)) {
                                        this.SET_ROUTPARAMETERS({})
                                    }
                                }
                            }
                            clearTimeout(time)
                        }, 5)
                    } else {
                        let errorMsg = this.msg(res.body)
                        this.$emit('errorMsg', errorMsg)
                        this.$emit('closeLoading')
                        this.closeListLoad()
                        this.$message.error(this.msg(res.body))
                    }
                }, (res) => {
                    this.$emit('closeLoading')
                    this.closeListLoad()
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
            }, 100)
        },
        closeListLoad() {
            this.listLoading = false
        },
        getLabelList() {
            this.$http.get(this.Global.baseURL + this.Global.api.v2.label_get, { params: {searchType: 'list', moduleCode: this.moduleCode } }).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK && isArray(res.body.data)) {
                    this.dynamicTags = res.body.data
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        }
    },
    watch: {
        billParameter(val) {
            if (val && val.moduleCode && val.moduleCode == this.moduleCode) {
                this.getListDatas(false, true)
            }
        },
        $route(val, old) {
            if (val.path === this.path) {
                this.$emit('setHeights')
                this.msgDialog = true
                if (this.isEmptyObject(this.routParameters)) {
                    this.$emit('controlScreenmenuRowShow')
                    let time = setTimeout(() => {
                        this.getListDatas(this.routParameters, true)
                        clearTimeout(time)
                    }, 1)
                } else {
                    let time = setTimeout(() => {
                        this.getListDatas()
                        clearTimeout(time)
                    }, 1)
                }
            } else if (this.msgDialog) {
                this.msgDialog = false
            }
        }
    },
    computed: {
        ...mapGetters('client', [
            'routParameters',
            'billParameter'
        ])
    },
    beforeDestroy: function () {
        this.getListDatas = null
        this.isEmptyObject = null
        this.getFastListData = null
        this.swidchListSet = null
        this.setScrollBottom = null
    },
    components: {
        'list-page': listPage,
        'foot-control': footControl,
        'currency': currency,
        'contacts': contacts,
        'customer': customer,
        'work-order': workOrder,
        'order-SC002': OrderSC002
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
