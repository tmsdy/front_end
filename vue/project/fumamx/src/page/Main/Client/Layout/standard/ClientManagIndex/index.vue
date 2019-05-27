<template>
    <div class="ClientManagIndex MXscroll" ref="ClientManagIndex">
        <div class="ClientManagIndexBox">
            <!--客户信息表格-->
            <customer-lists :viewType="viewType" @controlScreenmenuRowShow="controlScreenmenuRowShow" @errorMsg="errorMsgs"  @setHeights="setHeights" @upListSet="upListSet" :topHeight="topHeight" :moduleCode="moduleCode" :moduleStruct="itemData.moduleStruct" :listSet="itemData.listSet" :fastOpt="itemData.moduleOptSet.fastOpt" :fastMenuShows="fastMenuShows"  v-show="!loading" ref="customerList" :detailOpt="itemData.moduleOptSet.detailOpt"  :listOpt="itemData.moduleOptSet.listOpt" :nowSort="nowSort"  @closeLoading="closeLoading"></customer-lists>
            <!--筛选客户-->
            <div class="topBox" ref="topBox" v-show="!loading&&errorMsgs==''">
                <div class="screenMenu">
                     <transition name="el-zoom-in-top" v-if="itemData.quickSearchSet != ''">
                        <div v-show="fastMenuShows" class="fastMenu">
                            <el-input class="fastSeach" :placeholder="itemData.quickSearchSet" icon="search" :on-icon-click="getFastListData" v-model="fastSeach" @keyup.enter.native="getFastListData">
                            </el-input>
                            <!-- 收起 -->
                            <i class="iconfont icon-close close text-hover fastSeachClose" :title="$t('mxpcweb.client.1529042202539')" @click="fastMenuShow(false)"></i>
                        </div>
                    </transition>
                    <div :class="fastMenuShows?'fastBox':''">
                        <screen-menuRow v-if="screenmenuRowShow" :moduleCode="moduleCode" ref="screenmenuRow"  @setHeights="setHeights" :searchSetRow="itemData.searchSetRow" @getListData="getListData" ></screen-menuRow>
                    </div>
                </div>
                <!--右边控件-->
                <rightTop-controls  :moduleCode="moduleCode" :sortSet="itemData.sortSet" ref="rightTopControls" :fastOpt="itemData.moduleOptSet.fastOpt" @fastMenuShow="fastMenuShow" @dialogSeniorClick="dialogSeniorClick" @getListData="getListData"  :nowSort.sync="nowSort" :fastMenuShows="fastMenuShows"></rightTop-controls>
            </div>
            <!--弹框区域-->
            <!--客户筛选弹框-->
            <!-- 高级查询 -->
            <el-dialog v-dialogDrag :title="$t('mxpcweb.client.1529042391642')" :visible.sync="dialogFormVisible" :closeOnClickModal="false" custom-class="width520">
                <span class="setSelection text-hover" @click="dialogClick" v-if="contactCheck.isAdmin">
                    <!-- 设置查询字段 -->
                    <el-tooltip :content="$t('mxpcweb.client.1529042407380')" placement="bottom" effect="light">
                        <i class="iconfont icon-setting"></i>
                    </el-tooltip>
                </span>
                <senior-screen :isContact="contactCheck.isAdmin" v-if="dialogFormVisibleFirst" v-show="dialogFormVisible" :moduleCode="moduleCode"  :searchSet="itemData.searchSet" @dialogSeniorClick="dialogSeniorClick" @getSearchSet="getSearchSet" @getListData="getListData"></senior-screen>
            </el-dialog>
            <!-- 设置查询字段 -->
            <el-dialog v-dialogDrag :title="$t('mxpcweb.client.1529042407380')" :visible.sync="dialogSetScreen" :closeOnClickModal="false" custom-class="width520">
                <span class="setSelection text-hover" @click="dialogClick">
                    <!-- 高级查询 -->
                    <el-tooltip :content="$t('mxpcweb.client.1529042391642')" placement="bottom" effect="light">
                        <i class="iconfont icon-setting"></i>
                    </el-tooltip>
                </span>
                <set-screen v-if="dialogSetScreenFirst" v-show="dialogSetScreen" :moduleCode="moduleCode"  ref="setScreen"  @getSearchSet="getSearchSet"></set-screen>
            </el-dialog>
        </div>
    </div>
</template>

<script>
/**
 * 描述：客户管理-客户列表
 * 作者：何俊峰
 * 时间：2017/11/10
 */
import PageTitle from '@/components/PageTitle/index' // 大标题
import seniorScreen from './seniorScreen/index'
import setScreen from './setScreen/index'
import screenMenuRow from './screenMenuRow/index'
import customerLists from './customerLists/index'
import rightTopControls from './rightTopControls/index'
import { mapGetters, mapMutations } from 'vuex'
import { getModleConfig, swidchEditSet, getQuickSearchSet, getListSet, updateSearchSet, updateListSet } from '../../../mixins/index.js'
export default {
    name: 'ClientManagIndex',
    props: {
        tabName: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            activeName: 'first', // 当前活动的右tab
            // 弹框
            dialogFormVisibleFirst: false,
            dialogFormVisible: false, // 客户筛选弹框
            dialogSetScreen: false, // 设置客户筛选字段弹框
            dialogSetScreenFirst: false, //
            screenMenu: true, // 筛选菜单切换横纵状态弹框
            // 创建时间
            nowSort: { cnFieldCaption: '', fieldName: 'createDate' }, // 当前排序方式
            loading: true,
            moduleCode: '',
            fastMenuShows: false, // 快捷搜索展示隐藏
            fastSeach: '', // 快捷输入内容
            isContact: false,
            errorMsgs: '',
            viewType: '',
            itemData: {
                moduleOptSet: {
                    fastOpt: [], // 快速操作（右上角按钮）
                    listOpt: [], // 批量操作
                    detailOpt: [] // 单项操作
                },
                moduleStruct: {},
                quickSearchSet: '',
                searchSet: [],
                searchSetRow: [],
                listSet: {},
                sortSet: []
            },
            topHeight: 66,
            screenmenuRowShow: true
        }
    },
    created() {
        let { viewLayout, viewType, moduleCode } = this.getRoute()
        this.viewLayout = viewLayout
        this.viewType = viewType
        this.moduleCode = moduleCode
        if (this.viewLayout == 'classicSeasCustomer') {
            // 掉入公海时间
            this.nowSort = { cnFieldCaption: '', fieldName: 'inSeaDate' }
        }
        this.getModleConfig({
            moduleCode: this.moduleCode,
            viewType: this.viewType,
            viewLayout: this.viewLayout
        }, this.getItemData, this.error)
    },
    mounted() {
        this.setHeights()
    },
    computed: {
        ...mapGetters([
            'contactCheck',
            'screenWidth'
        ]),
        ...mapGetters('client', [
            'moduleConfig'
        ])
    },
    methods: {
        getListSet,
        getModleConfig,
        swidchEditSet,
        getQuickSearchSet,
        updateSearchSet,
        updateListSet,
        // 同步设置
        ...mapMutations('client', {
            set_moduleConfig: 'SET_MODULECONFIG'
        }),
        error() {
            this.$emit('removeTab', this.tabName)
        },
        getItemData(item) {
            let searchSet = []
            let searchSetRow = []
            item.searchSet.forEach(element => {
                let obj = JSON.stringify(element)
                searchSet.push(JSON.parse(obj))
            })
            item.searchSetRow.forEach(element => {
                let obj = JSON.stringify(element)
                searchSetRow.push(JSON.parse(obj))
            })
            this.itemData = {
                moduleOptSet: item.moduleOptSet,
                moduleStruct: item.moduleStruct,
                quickSearchSet: item.quickSearchSet,
                searchSet: searchSet,
                searchSetRow: searchSetRow,
                listSet: item.listSet,
                sortSet: item.sortSet
            }
            this.closeLoading()
            this.$nextTick(() => {
                this.setHeights()
            })
        },
        errorMsg(val) { // 错误信息
            this.errorMsgs = val
        },
        getFastListData() { // 获取快速查询列
            this.$refs.customerList.getFastListData(this.fastSeach)
        },
        fastMenuShow(isShow) {
            if (isShow) {
                this.fastMenuShows = true
            } else {
                this.fastSeach = ''
                this.fastMenuShows = false
                let time = setTimeout(() => {
                    this.$refs.customerList.getListDatas()
                    clearTimeout(time)
                }, 50)
            }
        },
         // 样式
        setHeights() { // 获取Tab栏高度
            this.$nextTick(() => {
                if (this.$refs.topBox) {
                    if (this.$refs.topBox.offsetHeight) {
                        let topHeight = this.$refs.topBox.offsetHeight + 16
                        this.topHeight = topHeight > 66 ? topHeight : 66
                    }
                } else {
                    setTimeout(() => {
                        this.setHeights()
                    }, 20)
                }
            })
        },
        dialogClick() { // 高级筛选，设置筛选弹窗右上角设置按钮点击事件
            this.dialogFormVisible = !this.dialogFormVisible
            this.dialogSetScreen = !this.dialogSetScreen
            if (this.dialogSetScreen && !this.dialogSetScreenFirst) {
                this.dialogSetScreenFirst = true
            }
        },
        dialogSeniorClick() { // 高级筛选开关
            this.dialogFormVisible = !this.dialogFormVisible
            if (!this.dialogFormVisibleFirst) {
                this.dialogFormVisibleFirst = true
            }
        },
        getSearchSet() { // 获取筛选数据
            this.updateSearchSet({
                viewLayout: this.viewLayout,
                viewType: this.viewType,
                moduleCode: this.moduleCode
            }, (list) => {
                let searchSet = []
                let searchSetRow = []
                list.forEach(element => {
                    let obj = JSON.stringify(element)
                    searchSet.push(JSON.parse(obj))
                })
                list.forEach(element => {
                    let obj = JSON.stringify(element)
                    searchSetRow.push(JSON.parse(obj))
                })
                this.itemData.searchSet = searchSet
                this.itemData.searchSetRow = searchSetRow
                this.$nextTick(() => {
                    this.setHeights()
                })
            })
        },
        upListSet() {
            this.updateListSet({
                viewLayout: this.viewLayout,
                viewType: this.viewType,
                moduleCode: this.moduleCode
            }, (list) => {
                this.itemData.listSet = list
            })
        },
        closeLoading() {
            this.loading = false
        },
        getListData(otherArgument, update, sortSet, save) { // 获取列表数据（筛选，排序时用）
            this.$refs['customerList'].getListDatas(otherArgument, update, sortSet, save)
        },
        controlScreenmenuRowShow() {
            this.screenmenuRowShow = false
            this.$nextTick(() => {
                this.screenmenuRowShow = true
            })
        }
    },
    watch: {
        screenWidth(val) { // 监听屏幕宽度变化
            if (this.setHeights) {
                this.setHeights()
            }
        }
    },
    beforeDestroy: () => {
        this.itemData = null
        this.setHeights = null
        this.getListSet = null
        this.getModleConfig = null
        this.swidchEditSet = null
        this.getQuickSearchSet = null
        this.updateSearchSet = null
        this.updateListSet = null
        this.fastMenuShow = null
        this.getListData = null
        this.getItemData = null
        this.errorMsg = null
    },
    components: {
        'page-title': PageTitle,
        'senior-screen': seniorScreen,
        'set-screen': setScreen,
        'screen-menuRow': screenMenuRow,
        'customer-lists': customerLists,
        'rightTop-controls': rightTopControls
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
