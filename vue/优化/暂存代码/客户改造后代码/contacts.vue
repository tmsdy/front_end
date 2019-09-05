<template>
    <div class="contactsBox">
        <!-- 暂无联系人 -->
        <!-- 立即创建 -->
        <no-data class="marginTop15" @getListData="getListData" v-if="!firstData&&customerListsData.length==0" :title="$t('mxpcweb.client.1529055791035')" img="noAddress" :fastOpt="fastOpt" :btnText="$t('mxpcweb.client.1529028045434')"></no-data>
        <template v-else>
            <div class="boxList">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <!-- 客户 -->
                        <span style="margin-left:-50px;">{{$t('mxpcweb.client.1529049476377')}}</span>
                    </el-col>
                    <el-col :span="18">
                        <div>
                            <div style="display:inline-block;width:100%">
                                <span class="ellipsis" :title="$t('mxpcweb.client.list.1563945581424')" style="display:inline-block;text-align:left" :style="{'width':(75/5.3)+'%'}">
                                    <!-- 决策角色 -->
                                    {{$t('mxpcweb.client.list.1563945581424')}}
                                </span>
                                <span class="ellipsis" :title="$t('mxpcweb.client.list.1563945656194')" style="display:inline-block;text-align:left" :style="{'width':(75/5.3)+'%'}">
                                    <!-- 亲密度 -->
                                    {{$t('mxpcweb.client.list.1563945656194')}}
                                </span>
                                <span class="ellipsis" :title="$t('mxpcweb.client.1529056115984')" style="display:inline-block;text-align:left" :style="{'width':(75/5.3)+'%'}">
                                    <!-- 联系方式 -->
                                    {{$t('mxpcweb.client.1529056115984')}}
                                </span>
                                <span class="ellipsis" :title="$t('mxpcweb.client.1529056101685')" style="display:inline-block;text-align:left" :style="{'width':25+'%'}">
                                    <!-- 邮箱 -->
                                    {{$t('mxpcweb.client.1529056101685')}}
                                </span>
                                <span class="ellipsis" :title="$t('mxpcweb.client.1529056083516')" style="display:inline-block;text-align:left" :style="{'width':(75/5.3)+'%'}">
                                    <!-- 部门 -->
                                    {{$t('mxpcweb.client.1529056083516')}}
                                </span>
                                <span class="ellipsis" :title="$t('mxpcweb.client.1529056067677')" style="display:inline-block;text-align:left" :style="{'width':(75/5.3)+'%'}">
                                    <!-- 社交 -->
                                    {{$t('mxpcweb.client.1529056067677')}}
                                </span>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <div class="posRight">
                    <!-- 拥有人 -->
                    {{$t('mxpcweb.client.1529043616422')}}
                </div>
            </div>
            <div :class="isShowCheck ? 'customerTables MXscroll' : ''" :style="{'padding-right': hasScrollbarValue ? '10px' : '15px' }">
                <virtual-list class="MXscroll" :size="68" ref="customerTables" :remain="remain" :start="0" :item="contactItem" :itemcount="customerListsData.length" :variable="getVariableHeight" :itemprops="getItemProps" />
            </div>
        </template>

    </div>
</template>
<script>
/**
 * 描述：客户管理-客户列表
 * 作者：何俊峰
 * 时间：2017/11/10
 */
import NoData from './NoData/index'
import contactItem from './contactItem'
import ListShow from '@/components/ListShowControls/index.js'
import { mapGetters } from 'vuex'
export default {
    name: 'contacts',
    props: {
        listSet: {
            type: Object,
            default: () => {
                return {}
            }
        },
        detailOpt: {
            type: Array,
            default: () => {
                return []
            }
        },
        fastOpt: {// 获取空间操作按钮列表
            type: Array,
            default: () => {
                return []
            }
        },
        moduleStruct: {
            type: Object,
            default: () => {
                return {}
            }
        },
        nowSort: {
            type: Object,
            default: () => {
                return {
                    fieldName: 'creatDate'
                }
            }
        },
        controlData: {
            type: Object,
            default: () => {
                return {
                    checkedCities: []
                }
            }
        },
        dynamicTags: {
            type: Array,
            default: () => []
        },
        moduleCode: {
            type: String,
            default: ''
        },
        isShowCheck: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            customerListsData: [],
            contactItem,
            remain: 8,
            titleTime: true, // 升序降序显示
            firstData: true,
            hasScrollbarValue: true,
            viewType: '',
            updata: false
        }
    },
    created() {
        this.remain = parseInt((this.screenHeight - 360) / 56)
        this.viewType = this.getRoute().viewType
    },
    mounted() {
    },
    beforeDestroy() {

    },
    methods: {
        getItemProps(itemIndex) {
            return {
                key: itemIndex,
                props: {
                    index: itemIndex,
                    contactItem: this.customerListsData[itemIndex] || {},
                    controlData: this.controlData,
                    detailOpt: this.detailOpt,
                    moduleStruct: this.moduleStruct,
                    listSet: this.listSet,
                    nowSort: this.nowSort,
                    dynamicTags: this.dynamicTags,
                    moduleCode: this.moduleCode,
                    isShowCheck: this.isShowCheck,
                    viewType: this.viewType,
                    updata: this.updata
                }
            }
        },
        getVariableHeight(itemIndex) {
            return this.customerListsData[itemIndex].title ? 20 : 68
        },
        returnTitleTime(titleTime) {
            if (titleTime) {
                if (titleTime != this.$t('mxpcweb.client.1529056745088') && titleTime != this.$t('mxpcweb.client.1529055928867')) {
                    let time = this.timeShow_custom(titleTime + ' 00:00:00', 'YYYY-MM-DD')
                    return time
                } else {
                    return titleTime
                }
            } else {
                return this.$t('mxpcweb.client.1529056745088')
            }
        },
        listaddTab(list) {
            list.billId = list.custId
            list.billName = list.custName
            list.moduleCode = 'BF001'
            this.$MXEventBus.emit('addTab', list)
        },
        getListData(upData) {
            this.$MXEventBus.emit('getListDatas', false, upData)
        },
        switchList(customerLists, sortName, load, focusList) {
            this.updata = false
            if (customerLists.length == 0 && focusList.length == 0) {
                this.noData = true
            }
            if (!sortName) {
                sortName = 'createDate'
            }
            let titleTime = this.$t('mxpcweb.client.1529056745088')
            if (load) {
                this.$nextTick(() => {
                    if (this.$refs.customerTables) {
                        this.$refs.customerTables.$el.scrollTo(0, '0')
                    }
                })
                this.$emit('closeListLoad')
                this.customerListsData = []
                this.customerListsData = this.focus(focusList)
                this.renderingList(customerLists.slice(0, 10), titleTime, sortName)
                if (customerLists.length > 10) {
                    setTimeout(() => {
                        this.renderingList(customerLists.slice(10, customerLists.length), titleTime, sortName)
                    }, 10)
                }
            } else {
                this.customerListsData = []
                this.customerListsData = this.focus(focusList).concat(this.renderingList1(customerLists, titleTime, sortName))
            }
            this.hasScrollbar()
            this.$nextTick(() => {
                this.updata = true
            })
            if (this.firstData) {
                this.firstData = false
            }
        },
        renderingList(customerLists, titleTime, sortName) {
            customerLists.forEach((element) => { // 按天把列表归类
                if (element.custTracks) {
                    element.custTracks.sort((a, b) => {
                        return b['trackDate'] - a['trackDate']
                    })

                    element.custTracksData = []
                    element.custTracks.forEach((items) => {
                        if (items.delState != 1) {
                            element.custTracksData.push(items)
                        }
                    })
                }
                if (element[sortName]) {
                    if (titleTime != element[sortName].substring(0, 10)) {
                        titleTime = element[sortName].substring(0, 10)
                        this.customerListsData.push({
                            title: true,
                            titleTime: titleTime
                        })
                    }
                } else {
                    if (titleTime != this.$t('mxpcweb.client.1529056745088')) {
                        titleTime = this.$t('mxpcweb.client.1529056745088')
                        this.customerListsData.push({
                            title: true,
                            titleTime: titleTime
                        })
                    }
                }
                this.customerListsData.push(element)
            })
        },
        renderingList1(customerLists, titleTime, sortName) {
            let customerListsData = []
            customerLists.forEach((element) => { // 按天把列表归类
                if (element.custTracks) {
                    element.custTracks.sort((a, b) => {
                        return b['trackDate'] - a['trackDate']
                    })

                    element.custTracksData = []
                    element.custTracks.forEach((items) => {
                        if (items.delState != 1) {
                            element.custTracksData.push(items)
                        }
                    })
                }
                if (element[sortName]) {
                    if (titleTime != element[sortName].substring(0, 10)) {
                        titleTime = element[sortName].substring(0, 10)
                        customerListsData.push({
                            title: true,
                            titleTime: titleTime
                        })
                    }
                } else {
                    if (titleTime != this.$t('mxpcweb.client.1529056745088')) {
                        titleTime = this.$t('mxpcweb.client.1529056745088')
                        customerListsData.push({
                            title: true,
                            titleTime: titleTime
                        })
                    }
                }
                customerListsData.push(element)
            })
            return customerListsData
        },
        // 数组转换
        focus(rootArrList) {
            if (rootArrList.length == 0) {
                return []
            }
            let arrNewData = rootArrList
            arrNewData.unshift({
                title: true,
                titleTime: this.$t('mxpcweb.client.1529055928867'),
                focus: true
            })
            return arrNewData
        },
        // 点击，升降序
        descOrAsc() {
            this.order = this.order == 'desc' ? 'asc' : 'desc'
            this.getListData()
        },
        hasScrollbar() {
            let time = setTimeout(() => {
                let thisDom = this.$refs.customerTables
                if (thisDom) {
                    this.hasScrollbarValue = thisDom.$el.scrollHeight > thisDom.$el.clientHeight
                } else {
                    this.hasScrollbarValue = false
                }
                window.clearTimeout(time)
            }, 5)
        }
    },
    computed: {
        ...mapGetters(['screenHeight'])
    },
    watch: {
        screenHeight(height) {
            this.remain = parseInt((height - 360) / 56)
        }
    },
    components: Object.assign({
        'no-data': NoData
    }, ListShow)
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../zh-cn.less";
@import "../en.less";
//颜色
@blue: #008cee !important;
@blue-light: #3bc2b5 !important;
@red: #f00 !important;
@yellow: #ff943e !important;
@gray: #ccc !important;
@black: #000 !important;
.contactsBox {
    min-height: 300px;
    .boxList {
        height: 32px;
        line-height: 32px;
        background: #f7f8f9;
        border-radius: 4px 4px 0px 0px;
        color: #606266;
        font-size: 12px;
        padding-left: 84px;
        padding-right: 200px;
        position: relative;
        margin-top: 16px;
        .posRight {
            position: absolute;
            top: 0;
            height: 100%;
            right: 95px;
            width: 90px;
        }
    }
}
</style>
