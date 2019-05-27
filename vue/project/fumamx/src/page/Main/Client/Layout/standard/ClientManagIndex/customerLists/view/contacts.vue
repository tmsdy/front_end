<template>
    <div class="contactsBox">
            <!-- 暂无联系人 -->
            <!-- 立即创建 -->
            <no-data class="marginTop15" @getListData="getListData" v-if="!firstData&&customerListsData.length==0" :title="$t('mxpcweb.client.1529055791035')"  img="noAddress" :fastOpt="fastOpt" :btnText="$t('mxpcweb.client.1529028045434')"></no-data>
            <template v-else>
                <div  class="boxList">
                    <el-row :gutter="20">
                        <el-col :span="6">
                                <!-- 客户 -->
                                <span style="margin-left:-50px;">{{$t('mxpcweb.client.1529049476377')}}</span>
                        </el-col>
                        <el-col :span="18">
                            <div>
                                <div style="display:inline-block;width:100%">
                                    <span class="ellipsis" :title="$t('mxpcweb.client.1529056115984')" style="display:inline-block;text-align:left" :style="{'width':(60/3.2)+'%'}">
                                        <!-- 联系方式 -->
                                        {{$t('mxpcweb.client.1529056115984')}}
                                    </span>
                                    <span class="ellipsis" :title="$t('mxpcweb.client.1529056101685')" style="display:inline-block;text-align:left" :style="{'width':40+'%'}">
                                        <!-- 邮箱 -->
                                        {{$t('mxpcweb.client.1529056101685')}}
                                    </span>
                                    <span class="ellipsis" :title="$t('mxpcweb.client.1529056083516')" style="display:inline-block;text-align:left" :style="{'width':(60/3.2)+'%'}">
                                        <!-- 部门 -->
                                        {{$t('mxpcweb.client.1529056083516')}}
                                    </span>
                                    <span class="ellipsis" :title="$t('mxpcweb.client.1529056067677')" style="display:inline-block;text-align:left" :style="{'width':(60/3.2)+'%'}">
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
                <div class="customerTables MXscroll" ref="customerTables" :style="{'padding-right': hasScrollbarValue ? '10px' : '15px' }">
                    <div class="customerTable" v-for="(list,indexs) in customerListsData" :key="indexs">
                        <template v-if="list!==undefined">
                            <ul class="customerList">
                                <p class="titleTime" v-if="list.title">
                                    <i class="iconfont" :class="list.focus ? 'icon-star' : 'icon-kehu-liebiaoriqi'"></i>
                                    <span>{{returnTitleTime(list.titleTime)}}</span>
                                </p>
                                <li v-else>
                                    <!-- <img class="avatar"  v-imgsrc="list.imagesId&&list.imagesId.length!=0?avatarSrc(list.imagesId):'img/contacts.png'"> -->
                                    <img class="avatar" v-if="updata" v-lazy="avatarSrc(list)">
                                    <div  :class="[controlData.checkedCities.length==0 ? 'listCheckNone' : 'listChecks']">
                                        <el-checkbox :label="list[moduleStruct.identField]" size="small">&nbsp;</el-checkbox>
                                    </div>
                                    <el-row :gutter="20" class="customerInfo" >
                                        <el-col :span="6">
                                            <div style="height:20px;">
                                                <!-- 姓名 -->
                                                <span class="custNameBox ellipsis">
                                                    <span class="text-hover custName ellipsis" v-if="list[moduleStruct.titleField]&&list[moduleStruct.titleField]!=''" :title="$t('mxpcweb.client.1529056034251')+':'+list[moduleStruct.titleField]" @click="showDetail(list)">
                                                        {{list[moduleStruct.titleField]}}
                                                    </span>
                                                    <span v-else>&nbsp;</span>
                                                    <span style="color:rgba(144,147,153,1);">
                                                        <template v-if="list.nickName !== '' && list.nickName !== undefined">
                                                            <!-- 昵称 -->
                                                            (<span :title="$t('mxpcweb.client.1529056014003')+':'+list.nickName" >{{list.nickName}}</span>)
                                                        </template>
                                                        <template v-if="list.jobs !== '' && list.jobs !== undefined&&checkIsShow('jobs')">
                                                            <!-- 职位 -->
                                                            <span :title="$t('mxpcweb.client.1529055995566')+':'+list.jobs" >{{list.jobs}}</span>
                                                        </template>
                                                        <span v-if="checkIsShow('sex')" class="sex">
                                                            <component v-bind:is="'control39'" ref="control" :value="{value:list.sex}"></component>
                                                        </span>
                                                    </span>
                                                </span>
                                            </div>
                                        </el-col>
                                        <el-col :span="18">
                                            <div>
                                                <div style="display:inline-block;width:100%">
                                                    <span class="ellipsis"  style="display:inline-block;text-align:left" :style="{'width':(60/3.2)+'%'}">
                                                        <template   v-if="list.mobile != '' && list.mobile !== undefined&&checkIsShow('mobile')" :title="list.mobile">
                                                            <component v-bind:is="'control12'" ref="control" :value="{value:list.mobile}"></component>
                                                        </template>
                                                        <span v-else>&nbsp;</span>
                                                    </span>
                                                    <span class="ellipsis"  style="display:inline-block;text-align:left;position:relative;" :style="{'width':40+'%'}">
                                                        <template v-if="list.mailAddress != ''&&checkIsShow('mailAddress')">
                                                            <component class="mailBox" v-bind:is="'control13'" ref="control" :value="{value:list.mailAddress}"></component>
                                                        </template>
                                                        <span v-else>&nbsp;</span>
                                                    </span>
                                                    <span class="ellipsis"  style="display:inline-block;text-align:left" :style="{'width':(60/3.2)+'%'}">
                                                        <template  v-if="list.deptName !== undefined&&checkIsShow('deptName')">
                                                            <component v-bind:is="'control1'" ref="control" :value="{value:list.deptName}"></component>
                                                        </template>
                                                        <span v-else>&nbsp;</span>
                                                    </span>
                                                    <span style="display:inline-block;text-align:left;position:relative;height: 20px;z-index: 3;" :style="{'width':(60/3.2)+'%'}">
                                                        <div v-if="list.social !== undefined&&checkIsShow('social')" style="position:absolute;">
                                                            <component v-bind:is="'control41'" ref="control" :value="{value:list.social}"></component>
                                                        </div>
                                                        <span v-else>&nbsp;</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="20" class="customerInfo1" >
                                        <el-col :span="6" style="margin-top: -3px;">
                                            <div class="grid-content bg-purple ellipsis">
                                                <!-- 客户名称 -->
                                                <span class="text-hover" style="color:RGBA(144, 147, 153, 1)" :title="$t('mxpcweb.client.1529055956170')+':'+list.custName" @click="listaddTab(list)">
                                                    {{list.custName}}
                                                </span>
                                            </div>
                                        </el-col>
                                        <el-col :span="18" style="margin-top: -3px;">
                                            <div>
                                                <div style="display:inline-block;width:100%;">
                                                    <span class="ellipsis"  style="display:inline-block;text-align:left" :style="{'width':(60/3.2)+'%'}">
                                                        <template   v-if="list.tel != '' && list.tel !== undefined&&checkIsShow('tel')" :title="list.tel">
                                                            <component v-bind:is="'control42'" ref="control" :value="{value:list.tel}"></component>
                                                        </template>
                                                        <span v-else></span>
                                                    </span>
                                                    <!-- 标签 -->
                                                    <show-label  :title="$t('mxpcweb.client.1529057053276')" style="overflow:hidden;height:20px;text-align:right" :style="{'width':(41+60/3.2)+'%'}" :moduleCode="moduleCode"  ref="label" :dynamicTags="dynamicTags" :tags="list.tags"></show-label>
                                                </div>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <div class="listTimes3 listControl1">
                                        <detail-opt useType="customer"  :moduleStructName="moduleStruct.titleField" :moduleStructId="moduleStruct.identField" :moduleCode="moduleCode"  @getListData="getListData" :detailOptData="detailOpt" :itemData="list"></detail-opt>
                                    </div>
                                    <div class="grid-content bg-purple listTimes">
                                        <span dataOn="true">
                                            <component v-bind:is="'controlListTime'" ref="control" :value="{value:list[nowSort.fieldName]}"></component>
                                        </span>
                                    </div>
                                    <div class="listTimes1 ellipsi">
                                        <component v-bind:is="'control24'" ref="control" :value="{value:list.ownerCtId}"></component>
                                    </div>
                                    <span v-if="isFocusBill(list.focusTargets)&&viewType!='seas'" class="starBox">
                                        <i class="iconfont icon-star-card" style="font-size:16px;"></i>
                                    </span>
                                </li>
                            </ul>
                        </template>
                    </div>
                </div>
            </template>
        <!-- 联系人详情，弹窗 -->
        <contacts-detail ref="contactsDetail" @tellFather="$emit('getListData')"></contacts-detail>
    </div>
</template>
<script>
/**
 * 描述：客户管理-客户列表
 * 作者：何俊峰
 * 时间：2017/11/10
 */
import detailOpt from '../../detailOpt/index'
import NoData from './NoData/index'
import showLabel from './showLabel/index.vue'
import ContactsDetail from './ContactsDetail/index'// 联系人详情，弹窗
import ListShow from '@/components/ListShowControls/index.js'
export default {
    name: 'contacts',
    props: {
        listSet: {
            type: Object,
            default: function() {
                return {}
            }
        },
        detailOpt: {
            type: Array,
            default: function() {
                return []
            }
        },
        fastOpt: {// 获取空间操作按钮列表
            type: Array,
            default: function() {
                return []
            }
        },
        moduleStruct: {
            type: Object,
            default: function() {
                return {}
            }
        },
        nowSort: {
            type: Object,
            default: function() {
                return {
                    fieldName: 'creatDate'
                }
            }
        },
        controlData: {
            type: Object,
            default: function() {
                return {
                    checkedCities: []
                }
            }
        },
        dynamicTags: {
            type: Array,
            default: function() {
                return []
            }
        },
        moduleCode: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            customerListsData: [],
            titleTime: true, // 升序降序显示
            firstData: true,
            hasScrollbarValue: true,
            viewType: '',
            updata: false
        }
    },
    created() {
        this.viewType = this.getRoute().viewType
    },
    mounted() {
    },
    methods: {
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
        // 打开弹窗，联系人详情
        showDetail(item) {
            this.$refs.contactsDetail.showDialog(item)
        },
        checkIsShow(itemName) {
            let isShow = false
            if (this.listSet.listSetAllow) {
                this.listSet.listSetAllow.forEach(function(item) {
                    if (itemName == item.fieldName) {
                        isShow = true
                    }
                })
            }
            return isShow
        },
        listaddTab(list) {
            list.billId = list.custId
            list.billName = list.custName
            list.moduleCode = 'BF001'
            ep.emit('addTab', list)
        },
        showDialog(useType, id) {
            this.$emit('showDialog', useType, id)
        },
        getListData(upData) {
            this.$emit('getListData', false, upData)
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
                        this.$refs.customerTables.scrollTo(0, '0')
                    }
                })
                this.$emit('closeListLoad')
                this.customerListsData = []
                this.customerListsData = this.focus(focusList)
                this.renderingList(customerLists.slice(0, 10), titleTime, sortName)
                if (customerLists.length > 10) {
                    let _this = this
                    setTimeout(function() {
                        _this.renderingList(customerLists.slice(10, customerLists.length), titleTime, sortName)
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
        // 图像
        avatarSrc(list) {
            if (!list.imagesId || list.imagesId.length === 0) {
                if (list.sex && list.sex == '2') {
                    return '/static/images/noAvatarWoman.png'
                } else {
                    return '/static/images/noAvatar.png'
                }
            } else {
                let imgId = list.imagesId[0] // 取第一个数组项为默认头像
                return this.getGlobalImgSrc(imgId, '55x55')
            }
        },
        renderingList(customerLists, titleTime, sortName) {
            let _this = this
            customerLists.forEach(function(element) { // 按天把列表归类
                if (element.custTracks) {
                    element.custTracks.sort(function(a, b) {
                        return b['trackDate'] - a['trackDate']
                    })

                    element.custTracksData = []
                    element.custTracks.forEach(function(items) {
                        if (items.delState != 1) {
                            element.custTracksData.push(items)
                        }
                    })
                }
                if (element[sortName]) {
                    if (titleTime != element[sortName].substring(0, 10)) {
                        titleTime = element[sortName].substring(0, 10)
                        _this.customerListsData.push({
                            title: true,
                            titleTime: titleTime
                        })
                    }
                } else {
                    if (titleTime != _this.$t('mxpcweb.client.1529056745088')) {
                        titleTime = _this.$t('mxpcweb.client.1529056745088')
                        _this.customerListsData.push({
                            title: true,
                            titleTime: titleTime
                        })
                    }
                }
                _this.customerListsData.push(element)
            })
        },
        renderingList1(customerLists, titleTime, sortName) {
            let _this = this
            let customerListsData = []
            customerLists.forEach(function(element) { // 按天把列表归类
                if (element.custTracks) {
                    element.custTracks.sort(function(a, b) {
                        return b['trackDate'] - a['trackDate']
                    })

                    element.custTracksData = []
                    element.custTracks.forEach(function(items) {
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
                    if (titleTime != _this.$t('mxpcweb.client.1529056745088')) {
                        titleTime = _this.$t('mxpcweb.client.1529056745088')
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
            let _this = this
            let time = setTimeout(function() {
                let thisDom = _this.$refs.customerTables
                if (thisDom) {
                    _this.hasScrollbarValue = thisDom.scrollHeight > thisDom.clientHeight
                } else {
                    _this.hasScrollbarValue = false
                }
                window.clearTimeout(time)
            }, 5)
        }
    },
    computed: {
    },
    components: Object.assign({
        'detail-opt': detailOpt,
        'no-data': NoData,
        'contacts-detail': ContactsDetail,
        'show-label': showLabel
    }, ListShow),
    beforeDestroy: function () {
        this.customerListsData = null
        this.hasScrollbar = null
        this.returnTitleTime = null
        this.renderingList = null
        this.renderingList1 = null
        this.avatarSrc = null
        this.descOrAsc = null
        this.focus = null
        this.switchList = null
        this.getListData = null
        this.showDialog = null
        this.showDetail = null
        this.checkIsShow = null
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../zh-cn.less";
@import "../en.less";
//颜色
@blue: #008cee!important;
@blue-light: #3bc2b5!important;
@red: #f00!important;
@yellow: #ff943e!important;
@gray: #ccc!important;
@black: #000!important;
.contactsBox{
    min-height: 300px;
    .boxList{
        height:32px;
        line-height: 32px;
        background:#F7F8F9;
        border-radius:4px 4px 0px 0px;
        color: #606266;
        font-size: 12px;
        padding-left:84px;
        padding-right:200px;
        position: relative;
        margin-top:16px;
        .posRight{
            position: absolute;
            top: 0;
            height: 100%;
            right:95px;
            width: 90px;
        }
    }

    .customerTable{
        .titleTime{
            padding-left:34px;
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            color: #222222;
            .iconfont{
                position: absolute;
                left: 12px;
                font-size: 12px;
                color: #222222;
            }
        }
        .customerList{
            // margin-bottom: 6px;
            // >:last-child{
            //     border-bottom:0;
            // }
            li{
                background: white;
                padding:14px 200px 13px 84px;
                border-bottom:1px solid #f7f8f9;
                font-size: 12px;
                position:relative;
                .avatar{
                    position: absolute;
                    left: 34px;
                    top: 14px;
                    width:40px;
                    height:40px;
                    border-radius: 50%;
                }
                .starBox{
                    position: absolute;
                    left: 9px;
                    top: -1px;
                    width:16px;
                    height:16px;
                    text-align: center;
                    line-height: 16px;
                    color: rgba(208,2,27,1);
                    font-size: 12px;
                }
                .listCheckNone1,.listCheckNone,.listChecks{
                    position:absolute;
                    top:24px;
                    left:10px;
                }
                .listCheckNone1,.listChecks{
                    display: inline-block;
                }
                .listCheckNone{
                    display: none;
                }
                .listCheck{
                    display: none;
                }
                .customerInfo1{
                    height: 20px;
                    line-height: 14px;
                }
                .customerInfo{
                    height: 20px;
                    line-height: 20px;
                    .custNameBox{
                        position: relative;
                        display: inline-block;
                        padding-right:30px;
                        max-width: 100%;
                        .custName{
                            font-size:14px;

                            color:rgba(34,34,34,1);
                            font-weight: 600;
                        }
                        .sex{
                            position: absolute;
                            top: 0;
                            right: 0;
                        }
                    }
                    .el-dropdown-menu__item {
                            line-height: 30px;
                            height: 30px;
                    }
                    .listMenu{
                        display: none;
                    }
                    .toCustomerDetai{
                        display: none;
                    }
                }
                .listTimes1{
                    position:absolute;
                    top:14px;
                    right:95px;
                    width: 90px;
                }
                .listTimes2{
                    position:absolute;
                    bottom:12px;
                    right:95px;
                    width: 90px;
                }
                .listTimes3{
                    position:absolute;
                    top:12px;
                    right:18px;
                    width: 177px;
                }
                .listTimes{
                    position:absolute;
                    top:14px;
                    right:20px;
                    width: 70px;
                }
                .listControl{
                    width: 130px;
                    display: none;
                    color: #cdcdcd;
                    .text-blue-hover {
                        color: @blue;
                        cursor: pointer;
                    }
                    .hover{
                        cursor: pointer;
                    }
                }
                .listControl1{
                    display: none;
                }
                .rank-box{
                    width:100px;
                    display:inline-block;
                    color: rgb(153, 153, 153);
                    .score{
                        display:inline-block;
                        text-align:center;
                        width:38px;
                        height:20px;
                        line-height: 20px;
                        background:rgba(192,196,204,1);
                        border-radius:10px;
                        font-size: 12px;
                        .iconfont{
                            font-size:12px;
                            margin-right:4px;
                        }
                    }
                }
            }
            >li:hover{
                background:#FAFAFA;
                .listTime,.listTimes,.listTimes1,.listTimes2{
                    display: none;
                }
                .listControl,.listTimes3{
                    display: inline-block;
                }
                .toCustomerDetai{
                    display: inline-block;
                }
                .listCheck{
                    display: inline-block;
                }
                .listMenu{
                    display: inline-block;
                }
                .listCheckNone{
                    display: inline-block;
                }
                .listCheckNone1{
                    display: none;
                }
            }

        }
    }
}

</style>
