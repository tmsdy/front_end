<template>
    <div class="mailMarketing">
        <div v-if="tabData=='1'" style="padding-bottom:43px;">
            <!-- 下属 -->
            <!-- <span class="userName">{{peopleWork.name}}{{$t('mxpcweb.am.1531901623725')}}</span>
            <span class="showBranch text-hover">
                <el-dropdown trigger="click" class="pull-right" @command="StaffSwitching">
                    <span class="el-dropdown-link text-hover rightButton">
                        <i class="iconfont icon-search-not" style="font-size:12px;margin-right:5px"></i>{{$t('mxpcweb.am.1531901411892')}}
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(item,index) in owneroptions" :key="index" :command='{name:item.realName,value:item.ctId}'>
                            <span :class="item.ctId==peopleWork.value?'text-red':''"> {{item.realName}}</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </span> -->
            <div class="mailMarketingBox">
                <div class="mailMarketingSearch">
                    <div class="addButtonBox">
                        <!-- 新建任务 -->
                        <el-button class="addButton" type="primary" @click="addButton()" size="small">{{$t('mxpcweb.am.1531897439702')}}</el-button>
                    </div>
                    <!-- 任务名称 -->
                    <el-input class="addInput" v-model="keywords" :placeholder="$t('mxpcweb.am.1531897456597')" icon="search" @keyup.enter.native="getListData" :on-icon-click="getListData"></el-input>
                    <el-select class="addInput" v-model="peopleWork.value" filterable @change="getListData()">
                        <template v-for="item in owneroptions">
                            <el-option v-if="item.inUse==1" :key="item.ctId" :label="item.realName" :value="item.ctId">
                            </el-option>
                        </template>
                    </el-select>
                </div>
            </div>
            <div class="title">
                <el-row :gutter="20">
                    <el-col :span="7" class="listCol1">
                        {{$t('mxpcweb.am.1531897456597')}}
                    </el-col>
                    <el-col :span="9" class="listCol2">
                        <el-row :gutter="20" class="listCol2Box">
                            <el-col :span="5">
                                <!-- 请求 -->
                                {{$t('mxpcweb.am.1532672369386')}}
                            </el-col>
                            <el-col :span="5">
                                <!-- 送达 -->
                                {{$t('mxpcweb.am.1531900669464')}}
                            </el-col>
                            <el-col :span="5">
                                <!-- 打开 -->
                                {{$t('mxpcweb.am.1531901433719')}}
                            </el-col>
                            <el-col :span="5">
                                <!-- 点击 -->
                                {{$t('mxpcweb.am.1531901259662')}}
                            </el-col>
                            <el-col :span="4">
                                <!-- 无效 -->
                                {{$t('mxpcweb.am.1531900978904')}}
                            </el-col>
                        </el-row>
                    </el-col>
                    <!-- 状态 -->
                    <el-col :span="2" class="listCol3" style="padding:0 5px;">
                        {{$t('mxpcweb.am.1531903971129')}}
                    </el-col>
                    <!-- 创建人 -->
                    <el-col :span="2" class="listCol3" style="padding:0 5px;">
                        {{$t('mxpcweb.am.1543298040653')}}
                    </el-col>
                </el-row>
            </div>
            <div class="boxList MXscroll" v-loading="loading">
                <no-data v-if="mailMarkList.length==0" style="background:rgba(255,255,255,0)"></no-data>
                <div v-else class="list" v-for="(item,index) in mailMarkList" :key="index">
                    <el-row :gutter="20">
                        <!-- style="padding-left:82px;"  -->
                        <el-col :span="7" class="listCol1" :title="item.taskName">
                            <!-- <div class="ellipsis" style="position:absolute;top:0;left:10px">
                                <img src="./img/u18267.png" style="width:60px;height:70px;">
                            </div> -->
                            <div style="font-size:16px;height:30px;overflow: hidden;    white-space: nowrap;    text-overflow: ellipsis;">{{item.taskName}}</div>
                            <div style="color:RGBA(144, 147, 153, 1)">{{item.createDate}}</div>
                        </el-col>
                        <el-col :span="9" class="listCol2">
                            <el-row :gutter="20" class="listCol2Box">
                                <el-col :span="5">
                                    <!-- 请求 -->
                                    <span class="count">{{item.requestCount}}</span>
                                    <!-- <span v-else class="text-hover count" style=" text-decoration: underline;" @click="$refs.dialogLook.show(item,'request')"><a>{{item.requestCount}}</a></span> -->
                                </el-col>
                                <el-col :span="5">
                                    <!-- 送达 -->
                                    <span v-if="item.deliverCount==0" class="count">{{item.deliverCount}}</span>
                                    <span v-else class="text-hover count" style=" text-decoration: underline;" @click="$refs.dialogLook.show(item,'deliver')">{{item.deliverCount}}</span>
                                </el-col>
                                <el-col :span="5">
                                    <!-- 打开 -->
                                    <span v-if="item.openCount==0" class="count">{{item.openCount}}</span>
                                    <span v-else class="text-hover count" style=" text-decoration: underline;" @click="$refs.dialogLook.show(item,'open')">{{item.openCount}}</span>
                                </el-col>
                                <el-col :span="5">
                                    <!-- 点击 -->
                                    <span v-if="item.clickCount==0" class="count">{{item.clickCount}}</span>
                                    <span v-else class="text-hover count" style=" text-decoration: underline;" @click="$refs.dialogLook.show(item,'click')">{{item.clickCount}}</span>
                                </el-col>
                                <el-col :span="4">
                                    <!-- 无效 -->
                                    <span v-if="item.invalidCount==0" class="count">{{item.invalidCount}}</span>
                                    <span v-else class="text-hover count" style=" text-decoration: underline;" @click="$refs.dialogLook.show(item,'invalid')">{{item.invalidCount}}</span>
                                </el-col>
                            </el-row>
                        </el-col>
                        <!-- 描述： -->
                        <el-col :span="2" class="listCol3" :title="item.description&&item.description!=''?$t('mxpcweb.am.1531901446696')+item.description:''">
                            {{getStatusName(item.status,item.taskType)}}
                            <div v-if="item.status!='FINISH'&&item.status!='FAIL'&&item.taskType=='D'">
                                <!-- 发送 -->
                                <div style="color:#D0021B">{{(item.deliveryDate && item.deliveryDate != '' ? dateFormat(item.deliveryDate,'yyyy-MM-dd hh:mm'):'')+' '+$t('mxpcweb.am.1531900969998')}}</div>
                            </div>
                            <div v-if="item.status!='FINISH'&&item.status!='FAIL'&&item.taskType=='C'">
                                <div style="color:#D0021B">{{returnCTime(item.deliveryDate)}}</div>
                                <!-- 结束 -->
                                <div style="color:#D0021B">{{(item.endDate && item.endDate != '' ? dateFormat(item.endDate,'yyyy-MM-dd hh:mm'):'')+' '+$t('mxpcweb.am.1541658166639')}}</div>
                            </div>
                        </el-col>
                        <el-col :span="2" class="listCol3">
                            {{getOwneroptions(item.createCtId)}}
                        </el-col>
                        <el-col :span="4" class="listCol4">
                            <div class="listCol4Item">
                                <!-- 查看 -->
                                <!-- <span class="optButton" v-if="item.status !== 'DRAFT'" style="margin-right:10px;" @click="itemData=item;tabData='5'" :title="$t('mxpcweb.am.1531978974212')"> -->
                                <i class="iconfont icon-look" v-if="item.status !== 'DRAFT'" style="margin-right:10px;" @click="itemData=item;tabData='5'" :title="$t('mxpcweb.am.1531978974212')"></i>
                                <!-- </span> -->
                                <!-- 报告 -->
                                <!-- <span class="optButton" style="margin-right:10px;" v-if="item.status == 'FINISH'" @click="itemData=item;tabData='3';" :title="$t('mxpcweb.am.1531901458206')"> -->
                                <i class="iconfont icon-inform" style="margin-right:10px;" v-if="item.status == 'FINISH'" @click="itemData=item;tabData='3';" :title="$t('mxpcweb.am.1531901458206')"></i>
                                <!-- </span> -->
                                <!-- 编辑 -->
                                <!-- <span class="optButton" style="margin-right:10px;" v-if="(item.status == 'DRAFT'||item.status == 'FAIL'||(item.taskType=='C'&&item.status=='PENDING')||(item.taskType=='D'&&item.status=='PENDING'))&&item.createCtId==company.ctId" @click="itemData=item;tabData='4';" :title="$t('mxpcweb.am.1531893071733')"> -->
                                <i class="iconfont icon-edit" style="margin-right:10px;" v-if="(item.status == 'DRAFT'||item.status == 'FAIL'||(item.taskType=='C'&&item.status=='PENDING')||(item.taskType=='D'&&item.status=='PENDING'))&&item.createCtId==company.ctId" @click="itemData=item;tabData='4';" :title="$t('mxpcweb.am.1531893071733')"></i>
                                <!-- </span> -->
                                <!-- 二次营销 -->
                                <!-- <span class="optButton" style="margin-right:10px;" v-if="item.status == 'FINISH'" @click="itemData=item;dialogMarketingType=true" :title="$t('mxpcweb.am.1531901463838')"> -->
                                <i class="iconfont icon-send" style="margin-right:10px;" v-if="item.status == 'FINISH'" @click="itemData=item;dialogMarketingType=true" :title="$t('mxpcweb.am.1531901463838')"></i>
                                <!-- </span> -->
                                <!-- 删除 -->
                                <!-- <span class="optButton" style="margin-right:10px;" v-if="item.createCtId==company.ctId" @click="deleteItem(item)" :title="$t('mxpcweb.am.1531893085173')"> -->
                                <i class="iconfont icon-del" style="margin-right:10px;" v-if="item.createCtId==company.ctId" @click="deleteItem(item)" :title="$t('mxpcweb.am.1531893085173')"></i>
                                <!-- </span> -->
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <!-- 选择营销类型 -->
            <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('mxpcweb.am.1531901471126')" :visible.sync="dialogMarketingType" :closeOnClickModal="false" custom-class="width620" :modal-append-to-body="false">
                <div class="dialogMark">
                    <!-- 营销类型： -->
                    {{$t('mxpcweb.am.1531901476030')}}
                    <el-select v-model="marketingType" style="width:340px;margin-left:20px">
                        <el-option v-for="(item,index) in marketingOptions" :key="index" :label="item.name" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div slot="footer" class="dialogFooter">
                    <!-- 确定 -->
                    <el-button type="primary" @click="autoBook()" :loading="dialogLookLoading">{{$t('mxpcweb.am.1531893129621')}}</el-button>
                    <!-- 取消 -->
                    <el-button @click="dialogMarketingType=false">{{$t('fumamx-web-templateeditor.1531901134034')}}</el-button>
                </div>
            </el-dialog>
            <!--分页-->
            <list-page style="background:#f7f8f9;text-align:center" :blockData="blockData" @getListData="getListData"></list-page>
            <!--大标题-->
            <!-- 邮件营销 -->
            <page-title :title="$t('mxpcweb.am.1531897436358')" iconfont="icon-mail">
            </page-title>
        </div>
        <add-work v-if="tabData=='2'" @tabDataCheck="tabDataCheck" :ctid="company.ctId+''"></add-work>
        <presentate :itemData="itemData" v-if="tabData=='3'" :ctid="company.ctId+''" @tabDataCheck="tabDataCheck"></presentate>
        <edit-work :itemData="itemData" v-if="tabData=='4'" :ctid="company.ctId+''" @tabDataCheck="tabDataCheck"></edit-work>
        <dialog-look ref="dialogLook" :ctid="company.ctId+''" @getListData="getListData"></dialog-look>
        <preview :itemData="itemData" v-if="tabData=='5'" @tabDataCheck="tabDataCheck" ref="preview" :peopleWork="peopleWork"></preview>
        <guide-type v-if="tabData=='10'" @tabDataCheck="tabDataCheck" ref="guideType"></guide-type>
    </div>
</template>

<script>
import guideType from './guideType/index'
import PageTitle from '@/components/PageTitle/index' // 大标题
import listPage from '@/components/listPageTwo/index' // 分页
import { isArray, setStore, getStore } from '@/libs/utils.js'
import NoData from '@/basecomponents/NoData/index'
import addWork from './vue/addWork'
import editWork from './vue/editWork'
import presentate from './vue/presentate'
import preview from './vue/preview'
import dialogLook from './vue/dialogLook'
import { mapGetters } from 'vuex'
import mixin from '../mixin.js'
export default {
    name: 'mailMarketing',
    mixins: [mixin],
    props: {},
    data() {
        return {
            tabData: '1',
            tabDefault: '0',
            loading: false,
            keywords: '',
            dialogMarketingType: false,
            marketingType: 'deliver',
            mailMarkList: [],
            owneroptions: [],
            marketingOptions: [{
                // 已送达成功的联系人
                name: this.$t('mxpcweb.am.1532161227782'),
                value: 'deliver'
            }, {
                // 已打开的联系人
                name: this.$t('mxpcweb.am.1532161280294'),
                value: 'open'
            }, {
                // 已点击的联系人
                name: this.$t('mxpcweb.am.1532161295984'),
                value: 'click'
            }],
            // , {
            //     name: '已送达且未打开的联系人',
            //     value: '0'
            // }
            itemData: '',
            peopleWork: {
                // 我的
                name: this.$t('mxpcweb.am.1531901772937'),
                value: ''
            },
            // 分页操作
            blockData: {
                pageSize: 20,
                total: 0,
                fromNum: 1
            },
            dialogLookLoading: false,
            routeUrl: '',
            moduleCode: '',
            // 星期日
            // 星期一
            // 星期二
            // 星期三
            // 星期四
            // 星期五
            // 星期六
            weekData: ['', this.$t('mxpcweb.am.1531899922192'), this.$t('mxpcweb.am.1531899914414'), this.$t('mxpcweb.am.1531899919352'), this.$t('mxpcweb.am.1531899919696'), this.$t('mxpcweb.am.1531899920064'), this.$t('mxpcweb.am.1531899920888'), this.$t('mxpcweb.am.1531899921696')],
            isAdd: false
        }
    },
    created() {
        this.routeUrl = this.$route.path
        this.moduleCode = this.getRoute().moduleCode
        // this.peopleWork.value = this.company.ctId
        this.StaffShow()
        let storeData = getStore('sendMailTopageData')
        if (storeData) {
            if (storeData.type && storeData.type != '') {
                this.tabData = storeData.type
            }
        } else {
            this.getListData()
        }
    },
    computed: {
        ...mapGetters(['company', 'personalInfo'])
    },
    methods: {
        addButton() {
            this.isAdd = true
            this.tabData = '2'
            // this.tabData = '10'
        },
        getStatusName(status, type) {
            let title = ''
            switch (status) {
                case 'FINISH':// 已完成
                    title = this.$t('mxpcweb.am.1533015322808')
                    break
                case 'PENDING':// 执行过程中
                    if (type == 'D') { // 定时任务
                        title = this.$t('mxpcweb.am.1541582003220')
                    } else if (type == 'C') { // 周期性任务
                        title = this.$t('mxpcweb.am.1541582009601')
                    } else {
                        title = this.$t('mxpcweb.am.1541395191504')
                    }
                    break
                case 'DRAFT':// 草稿
                    title = this.$t('mxpcweb.am.1541387866960')
                    break
                case 'FAIL':// 失败
                    title = this.$t('mxpcweb.am.1541575515357')
                    break
            }
            return title
        },
        tabClick() {

        },
        // 人员切换
        // StaffSwitching(command) {
        //     this.peopleWork = command
        //     this.getListData()
        // },
        tabDataCheck(type) {
            this.tabData = type
            if (type == '1') {
                if (this.isAdd) {
                    this.blockData.fromNum = 1
                    this.isAdd = false
                }
                this.getListData()
            }
        },
        returnCTime(Time) {
            let _this = this
            let name = ''
            let CCtime = ''
            let thisTime = Time.split(' ')

            if (thisTime[3] == '?' && thisTime[5] !== '*') {
                // 每周
                // let weekTime = _this.$moment(_this.$utcToLocal('2018-06-10 ' + (thisTime[2].length == 2 ? thisTime[2] : '0' + thisTime[2]) + ':' + (thisTime[1].length == 2 ? thisTime[1] : '0' + thisTime[1]) + ':00'))
                // let weekTime = parseInt(thisTime[5]) - 1
                let dataName = new Date('2018/06/10 ' + (thisTime[2].length == 2 ? thisTime[2] : '0' + thisTime[2]) + ':' + (thisTime[1].length == 2 ? thisTime[1] : '0' + thisTime[1]) + ':00')
                let weekDate = parseInt(thisTime[5]) // (parseInt(thisTime[5]) + parseInt(weekTime.format('DD')) - 10) % 7
                if (weekDate == 0) {
                    weekDate = 7
                }
                name = _this.$t('mxpcweb.am.1531900125000') + _this.weekData[weekDate]
                CCtime = '  ' + dataName.getHours() + ':' + dataName.getMinutes()
            } else if (thisTime[3] !== '*' && thisTime[3] !== '?') {
                // 每月
                // name = _this.$t('mxpcweb.am.1531900145370')
                // CCtime = _this.$moment(_this.$utcToLocal('2018-07-' + (thisTime[3].length == 2 ? thisTime[3] : '0' + thisTime[3]) + ' ' + (thisTime[2].length == 2 ? thisTime[2] : '0' + thisTime[2]) + ':' + (thisTime[1].length == 2 ? thisTime[1] : '0' + thisTime[1]) + ':00')).format('DD HH:mm')
                name = _this.$t('mxpcweb.am.1531900145370')
                let dataName = new Date('2018/07/' + (thisTime[3].length == 2 ? thisTime[3] : '0' + thisTime[3]) + ' ' + (thisTime[2].length == 2 ? thisTime[2] : '0' + thisTime[2]) + ':' + (thisTime[1].length == 2 ? thisTime[1] : '0' + thisTime[1]) + ':00')
                CCtime = dataName.getDate() + '  ' + ('00' + dataName.getHours()).slice(-2) + ':' + ('00' + dataName.getMinutes()).slice(-2)
            } else {
                // 每天
                // utcToLocal
                // name = _this.$t('mxpcweb.am.1531900110152')
                // CCtime = _this.$moment(_this.$utcToLocal('2018-06-10 ' + (thisTime[2].length == 2 ? thisTime[2] : '0' + thisTime[2]) + ':' + (thisTime[1].length == 2 ? thisTime[1] : '0' + thisTime[1]) + ':00')).format('HH:mm')
                name = _this.$t('mxpcweb.am.1531900110152')
                let dataName = new Date('2018/06/10 ' + (thisTime[2].length == 2 ? thisTime[2] : '0' + thisTime[2]) + ':' + (thisTime[1].length == 2 ? thisTime[1] : '0' + thisTime[1]) + ':00')
                CCtime = ('00' + dataName.getHours()).slice(-2) + ':' + ('00' + dataName.getMinutes()).slice(-2)
            }
            return name + CCtime
        },
        autoBook() {
            let _this = this
            _this.dialogLookLoading = true
            let data = {
                taskId: this.itemData.taskId,
                eventName: this.marketingType
            }
            _this.$http.post(this.Global.baseURL + this.Global.api.v2.addrGenerate_Add, data).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    setStore('sendMailTopageData', { invokeName: res.body.data.addrInovkeName, type: '2' })
                    _this.dialogMarketingType = false
                    _this.dialogLookLoading = false
                    _this.tabData = '2'
                } else if (res.body.code.toString() != '-3') {
                    _this.$message.error(_this.msg(res.body.msg))
                    _this.dialogLookLoading = false
                } else {
                    _this.dialogLookLoading = false
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        StaffShow() {
            let _this = this
            let contactData = {
                dataType: 'contact',
                funType: 'withRight',
                moduleCode: this.moduleCode,
                optCode: 'otView'
            }
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.accountDropList_get, { params: contactData }).then(function (res) {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    let data = res.body.data
                    let str = _this.$t('mxpcweb.am.1541747843192')
                    data.splice(0, 0, { ctId: '', inUse: 1, realName: str })
                    this.owneroptions = data
                } else if (res.body.code.toString() != '-3') {
                    this.owneroptions = []
                    this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                this.owneroptions = []
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        getListData() {
            let _this = this
            let data = {
                pageN: _this.blockData.fromNum, // parseInt(_this.blockData.fromNum / _this.blockData.pageSize) + 1,
                pageSize: _this.blockData.pageSize
            }
            if (this.peopleWork.value != '') {
                data.subCtId = this.peopleWork.value
            };
            if (this.keywords != '') {
                data.keyword = this.keywords
            };
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.task_Get, { params: data }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    if (res.body.data.dataList && isArray(res.body.data.dataList)) {
                        _this.mailMarkList = res.body.data.dataList
                        _this.blockData.total = res.body.data.rowTotal
                    } else {
                        _this.mailMarkListList = []
                        _this.blockData.total = 0
                    }
                    _this.loading = false
                } else if (res.body.code.toString() != '-3') {
                    _this.loading = false
                    _this.$message.error(_this.msg(res.body))
                } else {
                    _this.loading = false
                }
            }, function (res) {
                _this.loading = false
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        deleteItem(item) {
            let _this = this
            // 即将删除此任务, 是否继续？
            // 提示
            // 确定
            // 取消
            this.$confirm(this.$t('mxpcweb.am.1531901505320'), this.$t('mxpcweb.am.1531893166645'), {
                confirmButtonText: this.$t('mxpcweb.am.1531893129621'),
                cancelButtonText: this.$t('fumamx-web-templateeditor.1531901134034'),
                type: 'warning'
            }).then(() => {
                _this.$http.delete(this.Global.baseURL + this.Global.api.v2.task_Delete, {
                    params: {
                        taskId: item.taskId
                    }
                }).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.getListData()
                        _this.$message.success(_this.msg(res.body))
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
        },
        getOwneroptions(createCtId) {
            var name = ''
            for (let index = 0; index < this.owneroptions.length; index++) {
                const element = this.owneroptions[index]
                if (element.ctId == createCtId) {
                    name = element.realName
                    break
                }
            }
            return name
        }

    },
    components: {
        'page-title': PageTitle,
        'list-page': listPage,
        'no-data': NoData,
        'add-work': addWork,
        'edit-work': editWork,
        'presentate': presentate,
        'dialog-look': dialogLook,
        'preview': preview,
        'guide-type': guideType
    },
    watch: {
        $tabData: function (newVal) {
            if (newVal == '1') {
                this.getListData()
            }
        },
        '$route': function (val, old) {
            if (val.path == this.routeUrl) {
                this.peopleWork = {
                    value: this.company.ctId,
                    // 我的
                    name: this.$t('mxpcweb.am.1531901772937')
                }
                let storeData = getStore('sendMailTopageData')
                if (storeData) {
                    if (storeData.type && storeData.type != '') {
                        this.tabData = storeData.type
                    }
                } else {
                    this.getListData()
                    this.tabData = '1'
                }
            } else {
                this.tabData = '1'
            }
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
