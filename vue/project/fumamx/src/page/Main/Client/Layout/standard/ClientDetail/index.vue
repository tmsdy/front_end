<template>
    <!-- 拼命加载中 -->
    <div class="ClientDetail" v-loading="loading" :element-loading-text="$t('mxpcweb.client.detail.1529993193937')">
        <div ref="detailScroll" class="custWrap MXscroll">
            <div class="detailHeader">
                <template v-if="companyName">
                    <span class="corporateName">{{companyName}}</span>
                    <span class="ownerComponent" v-if="showTopDeparent">
                        <template v-for="(item,index) in topDataField">
                            <span :span="5" :key="index">
                                <component v-bind:is="'group'+item.fieldGroup" :itemData="item" @modifyData="modifyData" labelWidth="78px" labelPosition="right"></component>
                            </span>
                        </template>
                    </span>
                    <template v-if="!windowMode">
                        <span class="cooperate" v-if="mainObj.cooperate && mainObj.cooperate.length>0">
                            <!-- 共享协助 18.07.26 名称要求去了换图标 -->
                            <!-- <span>{{$t('mxpcweb.client.detail.1529993289129')}}</span>  -->
                            <i class="iconfont icon-coperation"></i>
                            {{coperation}}
                        </span>
                    </template>
                    <detail-opt class="rightOpt" :detailOptData="detailOptData" :itemData="mainObj" @getListData="tellFather()" :moduleStructName="tabsListAll[0].titleField" :moduleStructId="tabsListAll[0].identField" :moduleCode='moduleCode'></detail-opt>
                </template>
            </div>

            <div class="detailBody">

                <!-- 摘要 -->
                <div class="summary">
                    <!-- 印章处理 -->
                    <!-- 已删除 -->
                    <div class="watermark delState" v-if="mainObj.delState == 1">{{$t('mxpcweb.client.detail.1529993232986')}}</div>
                    <!-- 公海客户 -->
                    <div class="watermark seasFlag" v-if="mainObj.seasFlag == 1">{{$t('mxpcweb.client.detail.1529993254801')}} </div>
                    <ul class="summaryList">
                        <template v-for="(item2,index2) in summaryDataList">
                            <li :key="index2" v-if="item2.fieldGroup == 0">
                                <component v-bind:is="'control'+item2.controlTypeId" :itemData="item2" @modifyData="modifyData" labelWidth="75px"></component>
                            </li>
                            <li :key="index2" v-else>
                                test
                            </li>
                        </template>
                    </ul>
                    <div class="clearfix"></div>

                    <!-- 标签展示 -->
                    <tag-show :dataList="tagsList" @tagEditShow="flyBtnClick(moduleCode, 'otTag')" labelWidth="75px"></tag-show>

                    <!-- 批注展示 -->
                    <comments-show :dataList="mainObj.comments" :moduleCode='moduleCode' :pageId="pageId"></comments-show>

                    <!-- 客户定制的展示功能，星标关注 -->
                    <custom-made ref="customMade" v-if="companyName && !windowMode && moduleCode == 'BF001'" :itemData="mainObj" :moduleCode='moduleCode' :pageId="pageId" @tellFather="tellFather()"></custom-made>
                </div>
                <!-- tab选项卡 -->
                <div ref="detailTabs" class="detailTabs">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <!-- 详情 -->
                        <el-tab-pane :label="$t('mxpcweb.client.detail.1529993364826')" name="tab">
                            <detail ref="tab" :moduleCode="moduleCode" :pageId="pageId" :propData="detailTabsData" :mainObj="mainObj" @flyBtnClick="flyBtnClick" @tellFather="tellFather()"></detail>
                        </el-tab-pane>
                        <el-tab-pane v-for="(item,index) in tabsList" :key="index" :label="item.cnStrucName" :name="'tab'+index">
                            <template v-if="lazyTabCache.includes('tab'+index)">
                                <component :ref="'tab'+index" :moduleCode="moduleCode" :pageId="pageId" v-bind:is="tabsIdToComponent[item.strucId]" :itemData="item" :mainObj="mainObj" @flyBtnClick="flyBtnClick" @tellFather="tellFather()" :customsTabIndex="customsTabIndex" :customsNavIndex="customsNavIndex" :customsNavArr="customsNavArr" :customsImpDateType.sync="customsImpDateType" :customsExpDateType.sync="customsExpDateType" @heightChange="customsHeightChange" @dateOptionsChange="setCustomsDateOptions" @changeTabNav='handelSetTabNav' @toggleScrollListener="handleToggleEventListener" :windowMode="windowMode" :custId="(mainObj.custId).toString()" @OperationTrigger="OperationTrigger" :iscustTable="iscustTable"></component>
                            </template>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
        <div v-if="`tab${customsActiveNameIndex}` == activeName&&activeName!=='tab'" class="CustomsNavBox clearfix" :class="{'show':customsTopBarShow}">
            <ul class="NavBar clearfix">
                <li v-for="(item,index) in customsNavArr" @click="handelSetTabNav(item.tabIndex,index)" :class="{'active':customsTabIndex==item.tabIndex&&index==customsNavIndex}" class="navItem" :key="index">{{item.label}}</li>
            </ul>
            <el-select v-show="customsTabIndex==0" class="dateSelect pull-right" v-model="customsImpDateType" value-key="label" placeholder="请选择">
                <el-option v-for="(item ,index) in customsDateOptions" :key="index" :label="item.label" :value="item">
                </el-option>
            </el-select>
            <el-select v-show="customsTabIndex==1" class="dateSelect pull-right" v-model="customsExpDateType" value-key="label" placeholder="请选择">
                <el-option v-for="(item ,index) in customsDateOptions" :key="index" :label="item.label" :value="item">
                </el-option>
            </el-select>
            <!--  <p class="updateTime pull-right">更新日期:{{mainObj.customs?mainObj.customs.customsUpdate:''}}</p> -->
        </div>
        <puablic-action ref="puablicAction" @LastListCenter="LastListCenter"></puablic-action>
    </div>
</template>
<script>
/**
 * 单据详情
 * 作者：向士健
 * 时间：2018/01/30
 * */
import { isObject, isArray } from '@/libs/utils.js'
import { mapGetters } from 'vuex'
import puablicAction from '@/page/Main/Mail/Home/vue/puablicAction.vue'
// 以下 tab 项
import Detail from './Tabs/Detail/index'
import FollowTrend from './Tabs/FollowTrend/index'
import Remind from './Tabs/Remind/index'
import Contacts from './Tabs/Contacts/index'
import ShareCooperation from './Tabs/ShareCooperation/index'
import Attachment from './Tabs/Attachment/index'
import SubordinateClient from './Tabs/SubordinateClient/index'
import OperationRecord from './Tabs/OperationRecord/index'
// import MailContact from './Tabs/MailContact/index'
import MailContact from '@/page/Main/Mail/Home/ListCenter/index.vue'
import Track from './Tabs/Track/index'
import workOrder from './Tabs/workOrder/index' // 工单
import CustomerPerspective from './Tabs/CustomerPerspective'
// 以下字段控件
import ControlsExhibition from '@/components/ControlsExhibition/index.js'
import GroupControlsExhibition from '@/components/GroupControlsExhibition/index.js'
// 以下右上角操作项
import detailOpt from '../ClientManagIndex/detailOpt/index'
// 其他
import CommentsShow from '@/basecomponents/CommentsShow/index' // 批注展示
import TagShow from '@/basecomponents/TagShow/index' // 标签展示
import CustomMade from './CustomMade/index' // 定制的 [资料完整度]
export default {
    name: 'ClientDetail',
    props: {
        // 是否窗口模式
        windowMode: {
            type: Boolean,
            default: false
        },
        // 窗口模式客户ID
        windowModeId: {
            type: String,
            default: ''
        },
        iscustTable: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            showTopDeparent: true,
            loading: true,
            activeName: 'tab',
            // activeName: 'tab4',

            companyName: '', // 头部公司名称

            summaryDataList: [], // 摘要字段展示
            tabsList: [], // 切换选项卡数据
            lazyTabCache: [],
            tabsListAll: [], // 切换选项卡数据
            tabsIdToComponent: {
                '2': 'follow-trend', // 跟进动态
                '3': 'remind', // 提醒
                '4': 'contacts', // 聯繫人
                '5': 'share-cooperation', // 共享協助
                '6': 'attachment', // 附件
                '7': 'subordinate-client', // 下級客戶
                '8': 'operation-record', // 操作記錄
                '9': 'mail-contact', // 操作記錄
                '10': 'work-order', // 工单中心
                '11': 'track-tab', // 行为跟踪
                '12': 'customer-perspective' // 客户透视
            },
            detailTabsData: [], // 详情选项数据
            topDataField: [{
                cnFieldCaption: '所属',
                fieldGroup: 3,
                group: [
                    {
                        // 'cnFieldCaption': this.$t('mxpcweb.client.1529043616422'), //  拥有人
                        'cnFieldCaption': '', //  拥有人
                        'cnFieldHint': '',
                        'columnWidth': 120,
                        'controlTypeId': 24,
                        'dictCode': 0,
                        'fieldCategory': 1,
                        'fieldGroup': 3,
                        'fieldLength': 10,
                        'fieldName': 'ownerCtId',
                        'inDefaultValue': '14889',
                        'isNotNull': 1,
                        'parFilterField': '',
                        'strucId': 1,
                        'uniqueCheck': 0
                    },
                    {
                        // 'cnFieldCaption': this.$t('mxpcweb.client.1529043630180'), // 所属部门
                        'cnFieldCaption': '', // 所属部门
                        'cnFieldHint': '',
                        'columnWidth': 120,
                        'controlTypeId': 36,
                        'dictCode': 0,
                        'fieldCategory': 1,
                        'fieldGroup': 3,
                        'fieldLength': 10,
                        'fieldName': 'ownerDeptKey',
                        'inDefaultValue': '34165',
                        'isNotNull': 1,
                        'parFilterField': '',
                        'strucId': 1,
                        'uniqueCheck': 0
                    }
                ]
            }], // 头部固定的拥有人部门

            detailOptData: [], // 列表右边的详情操作

            mainObj: {}, // 详情页主档详情数据值
            coperation: '', // 协作人员
            tagsList: [], // 标签数据
            moduleCode: '',
            pageId: '',
            pageUrl: '',
            routeUrl: '',
            scrollY: 0,
            scroll_is_listened: false,
            customsTopBarShow: false,
            customsActiveNameIndex: '',
            customsTabIndex: 0,
            customsNavIndex: 0,
            customsOffsetTop: 0,
            customsHeightArr: [],
            customsTimer: null,
            customsDateOptions: [],
            customsImpDateType: null,
            customsExpDateType: null,
            customsNavArr: Object.freeze([{
                label: '企业概况',
                tabIndex: 0
            },
            {
                label: '联系人',
                tabIndex: 0
            },
            {
                label: '采购趋势',
                tabIndex: 0
            },
            {
                label: '采购商品',
                tabIndex: 0
            },
            {
                label: '供应商',
                tabIndex: 0
            },
            {
                label: '海关记录',
                tabIndex: 0
            },
            {
                label: '出口数据',
                tabIndex: 1
            },
            {
                label: '关联公司',
                tabIndex: 2
            }
            ])

        }
    },
    created() {
        setTimeout(() => {
            this.routeUrl = this.$route.path
            this.moduleCode = this.windowMode ? 'BF001' : this.$route.params.moduleCode
            this.pageId = this.windowMode ? this.windowModeId : this.$route.params.id
            this.getAllData()
        }, 5)
    },
    beforeDestroy() {
        this.removeScrollListener()
    },
    computed: {
        ...mapGetters(['departmentList'])
    },
    methods: {
        LastListCenter(mIds, actionName) {
            this.$refs['tab7'][0].LastListCenter(mIds, actionName)
        },
        // 操作
        OperationTrigger(key, key2, key3, key4) {
            this.$refs.puablicAction.OperationTrigger(key, key2, key3, key4)
        },
        // 编辑成功，执行
        tellFather() {
            setTimeout(() => {
                this.$nextTick(_ => {
                    this.getAllData()
                })
            }, 500)
            this.handleClick() // 当前高亮tab数据也更新
        },
        // 子组件点击+号，弹出提醒 ==》 权限判断
        flyBtnClick(moduleNum, ot) {
            // console.log(moduleNum, ot)
            let _this = this
            let Mcode = moduleNum && moduleNum !== '' ? moduleNum : this.moduleCode
            if (!ot) { return }
            let data = {
                moduleCode: Mcode,
                optCode: ot,
                identFieldValue: this.pageId
            }
            ep.emit('setGlobalLoading', {
                val: true, // 打开loading
                text: '权限校验中...'
            })
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.document_rightCheck_do, { params: data }).then((res) => {
                ep.emit('setGlobalLoading', {
                    val: false // 关闭loading
                })
                if (res.body.code.toString() === _this.Global.RES_OK) {
                    // console.log(res.body)
                    _this.flyBtnCheck(ot, Mcode) // 调窗口
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.msg(res.body))
            })
        },
        // 子组件点击+号，弹出提醒
        flyBtnCheck(ot, Mcode) {
            let title = ''
            if (ot == 'otNew' && Mcode == 'BF003') {
                title = this.$t('mxpcweb.client.detail.1529994507329') // 新增联系人
            }
            if (ot == 'otNew' && Mcode == 'BF004') {
                title = this.$t('mxpcweb.client.detail.1529994896682') // 新增跟进
            }
            let obj = {
                optData: {
                    optCode: ot,
                    optModuleCode: Mcode,
                    optName: title
                },
                itemData: this.mainObj,
                billId: this.pageId,
                moduleCode: this.moduleCode,
                billName: this.companyName,
                next: () => {
                    this.tellFather() // update
                }
            }
            // console.log(obj)
            ep.emit('optClick', obj)
        },
        // TAB 点击 刷新数据
        handleClick(tab, event) {
            let name = this.activeName
            let _fn = () => {
                if (isArray(this.$refs[name])) {
                    if (name == 'tab7') {
                        this.$refs[name][0].filterGetMail('', '', '', '', '')
                        return
                    }
                    this.$refs[name][0].getTabData()
                } else {
                    try {
                        this.$refs[name].getTabData()// 刷新 详情TAB数据
                    } catch (e) {
                        console.log('this.$refs[name].getTabData();//刷新 详情TAB数据')
                    }
                }
            }
            if (!this.lazyTabCache.includes(name)) {
                this.lazyTabCache.push(name)
                this.$nextTick(() => {
                    _fn()
                })
            } else {
                _fn()
            }
        },
        setCustomsDateOptions(options) {
            this.customsDateOptions = options
        },
        customsHeightChange(arr) {
            this.customsHeightArr = arr
        },
        customsScrollTo(index) {
            let top = this.customsOffsetTop + 40 + this.customsHeightArr[index]
            this.$refs.detailScroll.scrollTop = top
        },
        // 添加滚动监听
        addScrollListener() {
            this.customsOffsetTop = this.$refs.detailTabs.offsetTop
            this.$refs.detailScroll.addEventListener('scroll', this._onScroll)
        },
        removeScrollListener() {
            this.$refs.detailScroll.removeEventListener('scroll', this._onScroll)
        },
        _onScroll() {
            let top = this.customsOffsetTop + 40 + 40
            let scroller = this.$refs.detailScroll
            if (scroller.scrollTop >= top) {
                this.customsTopBarShow = true
            } else {
                this.customsTopBarShow = false
            }
            this.scrollY = scroller.scrollTop
        },
        handleToggleEventListener(flag) {
            if (flag) {
                this.scroll_is_listened = true
                this.addScrollListener()
            } else {
                this.scroll_is_listened = true
                this.removeScrollListener()
                this.$nextTick(() => {
                    this._onScroll()
                })
            }
        },
        handelSetTabNav(tabIndex, navIndex) {
            var oldTabIndex = this.customsTabIndex
            this.customsTabIndex = tabIndex
            this.customsNavIndex = navIndex
            if (tabIndex == 0) {
                this.$nextTick(() => {
                    this.isLockScroll = true
                    this.customsScrollTo(navIndex)
                    clearTimeout(this.customsTimer)
                    this.customsTimer = setTimeout(() => {
                        this.isLockScroll = false
                    }, 200)
                })
            }
            if (oldTabIndex !== tabIndex && tabIndex != 0) {
                this.customsScrollTo(0)
            }
        },

        // 修改控件传来的值
        modifyData(modifyObj) {
            this.$nextTick(() => {
                this.$refs.tab.modifyData(modifyObj) // 子组件详情里也有这个，直接调用了
            })
        },
        // 聚合接口
        getAllData() {
            let _this = this
            let data = {
                // 接口名称: 获取模块结构 （如主档结构tab导航结构）
                moduleStruct: {
                    moduleCode: _this.moduleCode,
                    fieldValue: _this.pageId
                },
                // 接口名称: 获取业务字段展示（summarySet：摘要字段展示）
                fieldShow: {
                    moduleCode: _this.moduleCode,
                    type: 'summarySet'
                },
                // 接口名称: 获取单据详情（详情数据）
                generalOperate: {
                    searchType: 'detail',
                    moduleCode: _this.moduleCode,
                    identFieldValue: _this.pageId
                },
                // 接口名称: 获取业务字段展示（ viewSet:详情字段展示 ）
                fieldShow_viewSet: {
                    moduleCode: _this.moduleCode,
                    type: 'viewSet'
                },
                // 获取拥有人下拉 *********************
                accountDropList: {
                    dataType: 'contact',
                    funType: 'all'
                },
                // 部门 ****************
                accountDropList_department: {
                    dataType: 'department',
                    funType: 'all',
                    deptCascade: false
                },
                // 接口名称: 获取标签列表
                labelGet: {
                    searchType: 'list',
                    moduleCode: _this.moduleCode
                }
            }
            _this.$http.get(this.Global.baseURL + this.Global.api.Client.list.getListDetail, { params: data }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data)) {
                    // console.log(' ******************************* ')
                    // console.log(res.body.data)
                    // console.log(' ******************************* ')
                    let { res_moduleStruct, res_fieldShow, res_generalOperate, res_fieldShow_viewSet, res_accountDropList, res_accountDropList_department, res_labelGet } = res.body.data
                    // console.log(res_generalOperate)
                    // // 接口报错弹出提示
                    if (res_generalOperate.code.toString() != _this.Global.RES_OK) {
                        _this.$message.error(res_generalOperate.msg)
                        let sure = this.$t('mxpcweb.components.1531216430381')
                        let tip = _this.$t('mxpcweb.systemset.rolemanag.1530595863629') // 提示
                        this.$alert(res_generalOperate.msg, tip, {
                            confirmButtonText: sure,
                            callback: action => {
                                _this.$emit('close') // 通知关闭窗口 用于窗口模式
                            }
                        })
                    }

                    // 返回数据判断
                    if (!isArray(res_moduleStruct.data) ||
                        !isArray(res_fieldShow.data) ||
                        !isObject(res_generalOperate.data) ||
                        !isArray(res_fieldShow_viewSet.data) ||
                        !isArray(res_accountDropList.data) ||
                        !isArray(res_accountDropList_department.data) ||
                        !isArray(res_labelGet.data)) {
                        return
                    }
                    _this.loading = false

                    /**
                    *   详情所有值
                    */
                    _this.mainObj = res_generalOperate.data
                    // 协作人员处理 多个人时，显示 XXX 等 N 人
                    if (res_generalOperate.data.cooperate) {
                        let peopleArr = []
                        res_generalOperate.data.cooperate.forEach(function (item) {
                            res_accountDropList.data.forEach(function (item2) {
                                if (item == item2.ctId) {
                                    peopleArr.push(item2.realName)
                                }
                            })
                        })
                        // console.log(peopleArr)
                        if (peopleArr.length > 0) {
                            _this.coperation = peopleArr.length > 1 ? peopleArr[0] + this.$t('mxpcweb.client.1529042531686') + peopleArr.length + this.$t('mxpcweb.components.1530795359867') : peopleArr[0]
                        }
                        // console.log(res_generalOperate.data.cooperate)
                    }

                    /**
                     * 标签数据
                    */
                    if (isArray(_this.mainObj.tags) && _this.mainObj.tags.length > 0 && isArray(res_labelGet.data) && res_labelGet.data.length > 0) {
                        let newTags = []
                        _this.mainObj.tags.forEach(function (item) {
                            res_labelGet.data.forEach(function (item2) {
                                if (item == item2.labelId) {
                                    newTags.push(item2)
                                }
                            })
                        })
                        _this.tagsList = newTags
                        // console.log(_this.mainObj.tags);
                    }

                    /**
                     * tab 导航列表数据
                     * */
                    _this.tabsListAll = res_moduleStruct.data
                    _this.tabsList = res_moduleStruct.data.filter(function (item) {
                        if (item.strucLevel) {
                            return item.strucLevel == 2
                        }
                    })
                    _this.tabsList.forEach((item, index) => {
                        if (item.strucId == 12) {
                            _this.customsActiveNameIndex = index
                        }
                    })
                    // _this.tabsList.splice(7, 1)
                    // _this.tabsList = _this.tabsList.splice(2, 5)
                    // console.log(_this.tabsListAll)

                    /**
                     * 头部固定数据，拥有人和部门数据
                    */
                    _this.companyName = res_moduleStruct.data.filter(function (item) {
                        return item.strucLevel == 1
                    })[0].titleFieldValue
                    // console.log(_this.companyName)

                    // 拥有人和部门数据
                    _this.topDataField[0].group.forEach(function (item) {
                        Object.keys(res_generalOperate.data).forEach(function (item2) {
                            if (item2 == item.fieldName) {
                                item.fieldValue = res_generalOperate.data[item2]
                            }
                        })
                        item['owners'] = res_accountDropList.data
                        item['departments'] = res_accountDropList_department.data
                    })
                    // console.log(_this.topDataField)
                    /**
                     * 摘要字段展示
                    */
                    res_fieldShow.data.forEach(function (item) {
                        Object.keys(res_generalOperate.data).forEach(function (item2) {
                            if (item2 == item.fieldName) {
                                item.fieldValue = res_generalOperate.data[item2] + ''
                            }
                        })
                        // 没匹配到的，给了个空无
                        item.fieldValue = item.fieldValue || '0'

                        // 权限判断
                        if (res_generalOperate.data.delState == 1 || res_generalOperate.data.seasFlag == 1) {
                            item.editState = 0
                        }
                    })
                    _this.summaryDataList = res_fieldShow.data
                    // console.log(res_generalOperate.data.delState)
                    // console.log(res_fieldShow.data)res_generalOperate.data
                    // console.log(res_fieldShow.data)

                    /**
                     * 单据详情（详情数据，把值放进字段，拥有人也放入）
                    */
                    res_fieldShow_viewSet.data.forEach(function (item) {
                        Object.keys(res_generalOperate.data).forEach(function (item2) {
                            if (item2 == item.fieldName) {
                                item.fieldValue = res_generalOperate.data[item2]
                            }
                        })
                        item.Owners = res_accountDropList.data
                        // 权限判断
                        if (res_generalOperate.data.delState == 1 || res_generalOperate.data.seasFlag == 1) {
                            item.editState = 0
                        }
                    })
                    _this.detailTabsData = res_fieldShow_viewSet.data
                    // console.log(" ))) ")
                    // console.log(_this.detailTabsData)
                    // console.log(" ))) ")

                    if (!_this.windowMode) {
                        _this.$nextTick(_ => {
                            try {
                                _this.$refs.customMade.getData()// 客户资料完整度数据
                            } catch (e) { }
                        })
                    }

                    // 刷新拥有人部门处理
                    _this.showTopDeparent = false
                    setTimeout(function () {
                        _this.showTopDeparent = true
                    }, 5)

                    // 另取操作项，是否公海或回收站
                    _this.onlyGetOpt()
                    // console.log(_this.mainObj)
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 接口名称: 获取单据操作项
        onlyGetOpt() {
            let _this = this
            let type = 'recycle' // 默认给最低权限
            let seas = this.mainObj.seasFlag
            let del = this.mainObj.delState
            if (seas == 1 && del != 1) {
                type = 'seas'
            }
            if (seas != 1 && del != 1) {
                type = 'detail'
            }

            let data = {
                viewType: type,
                moduleCode: _this.moduleCode
            }
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.moduleOptSet_get, { params: data }).then(function (res) {
                if (res.body.code.toString() === _this.Global.RES_OK && res.body.data) {
                    _this.detailOptData = res.body.data.detailOpt
                }
            }, function (res) {
                _this.$message.error(_this.msg(res.body))
            })
        }
    },
    watch: {
        '$route': function (val, old) {
            if (val.path == this.routeUrl) {
                this.getAllData()
                this.handleClick() // 当前高亮tab数据也更新
            }
        },
        activeName(newVal, oldVal) {
            let customsTabStr = `tab${this.customsActiveNameIndex}`

            if (customsTabStr == newVal && newVal !== 'tab' && this.scroll_is_listened) {
                this.addScrollListener()
            } else if (customsTabStr == oldVal && oldVal !== 'tab' && this.scroll_is_listened) {
                this.removeScrollListener()
            }
        },
        scrollY(newY) {
            let h = this.customsHeightArr
            if (this.customsTabIndex != 0) {
                return
            }
            if (this.isLockScroll) {
                return
            }
            let sY = newY - (this.customsOffsetTop)

            if (sY <= 0) {
                this.customsNavIndex = 0
                return
            }
            for (let index = 0; index < h.length - 1; index++) {
                const h1 = h[index]
                const h2 = h[index + 1]
                if (sY >= h1 && sY <= h2) {
                    this.customsNavIndex = index
                    return
                }
            }
            this.customsNavIndex = h.length - 2
        }
    },
    components: Object.assign({
        'follow-trend': FollowTrend,
        'detail': Detail,
        'remind': Remind,
        'contacts': Contacts,
        'share-cooperation': ShareCooperation,
        'attachment': Attachment,
        'subordinate-client': SubordinateClient,
        'operation-record': OperationRecord,
        'mail-contact': MailContact,
        'work-order': workOrder,
        'customer-perspective': CustomerPerspective,

        'detail-opt': detailOpt,
        'comments-show': CommentsShow,
        'tag-show': TagShow,

        'custom-made': CustomMade,
        'puablic-action': puablicAction,
        'track-tab': Track
    }, ControlsExhibition, GroupControlsExhibition)
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
