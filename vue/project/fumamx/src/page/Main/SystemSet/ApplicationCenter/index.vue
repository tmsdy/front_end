<template>
    <div class="mainWrap ApplicationCenter">
        <!--大标题-->
        <!-- 应用中心 -->
        <page-title :showTitle="false" :title="$t('mxpcweb.systemset.accountsettings.1530586689576')" iconfont="icon-apps"></page-title>

        <el-tabs v-model="activeName" class="subTabs-pullRight" @tab-click="handleClick">
            <!-- 许可信息 -->
            <el-tab-pane :label="$t('mxpcweb.systemset.applicationcenter.1530257613119')" name="first">
                <to-order class="mainBodyTab" v-if="toRenew" @close="toRenew = false" />
                <div class="mainBodyTab appMsg MXscroll" ref="appMsg" v-loading="showData">
                    <div class="topCard">
                        <div>
                            <el-button class="toRenew pull-right" type="primary" @click="toRenew = true" v-if="powerObj.isBoss">续费和升级配置</el-button>

                            <span class="version">
                                <em>
                                    <i class="iconfont icon-MX"></i>
                                </em>{{pkname}}</span>
                            <!--<span style="margin-left:80px;">如需更多帐号、存储空间或延长有效期，请前往套餐与付费购买。</span>
                        <el-button type="primary" @click="$refs.upgradeComp.showPage()" class="pull-right">续费和升级配置</el-button>-->
                        </div>
                        <!--Charts-->
                        <ul class="charts">
                            <li>
                                <div id="useDaychart"></div>
                                <!-- 到期时间 -->
                                <i style="background:#FF7165;"></i>{{$t('mxpcweb.systemset.applicationcenter.1530252220214')}} {{expirationtime}}
                                <!-- 已用 -->
                                <!-- 天 -->
                                <span class="toUsed">{{$t('mxpcweb.systemset.applicationcenter.1530258053640')}}<div style="color:#FF7165">{{useDays}}{{$t('mxpcweb.systemset.applicationcenter.1530258156720')}}</div>
                                </span>
                            </li>
                            <li>
                                <div id="usePersonChart"></div>
                                <i style="background:#5EA3F6;"></i>
                                <!-- 用户许可人数 (共{0}个) -->{{$t('mxpcweb.systemset.applicationcenter.1530258378081',[authcount])}}
                                <!-- 已用 -->
                                <!-- 个 -->
                                <span class="toUsed">{{$t('mxpcweb.systemset.applicationcenter.1530258053640')}}<div style="color:#5EA3F6">{{useauthCount}}{{$t('mxpcweb.systemset.applicationcenter.1530258317598')}}</div>
                                </span>
                            </li>
                            <li>
                                <div id="useSpaceChart"></div>
                                <i style="background:#FFB735;"></i>
                                {{$t('mxpcweb.systemset.applicationcenter.1530258497296',[spacecount])}}
                                <span class="toUsed">
                                    <!-- 已用 -->{{$t('mxpcweb.systemset.applicationcenter.1530258053640')}}
                                    <div style="color:#FFB735">{{usedSpace.toFixed(3)}}G</div>
                                </span>
                            </li>
                        </ul>
                    </div>

                    <!--用户列表-->
                    <div class="userList">
                        <el-table :data="tableData">
                            <!-- 姓名 -->
                            <el-table-column :label="$t('mxpcweb.systemset.applicationcenter.1530259240312')" width="150">
                                <template slot-scope="scope">
                                    <div class="userName">
                                        <span class="avatar"><img v-imgsrc="getGlobalImgSrc(scope.row.avatar, '30x30')"> </span>{{scope.row.realName}}</div>
                                </template>
                            </el-table-column>
                            <!-- 部门 -->
                            <el-table-column prop="dept" :label="$t('mxpcweb.systemset.applicationcenter.1530259276895')" min-width="100"></el-table-column>
                            <!-- 角色 -->
                            <el-table-column prop="roleName" :label="$t('mxpcweb.systemset.applicationcenter.1530259307656')" min-width="100"></el-table-column>
                            <!-- 手机 -->
                            <el-table-column prop="mobile" :label="$t('mxpcweb.systemset.applicationcenter.1530259331519')" min-width="100"></el-table-column>
                            <!-- 邮箱 -->
                            <el-table-column prop="email" :label="$t('mxpcweb.systemset.applicationcenter.1530259377487')" min-width="100"></el-table-column>
                            <!-- 状态 -->
                            <el-table-column prop="operationname" :label="$t('mxpcweb.systemset.applicationcenter.1530259404792')" min-width="90">
                                <template slot-scope="scope">
                                    <span :style="{'color': !scope.row.showClickName ? '#909399' : ''}">{{scope.row.operationname}}</span>
                                </template>
                            </el-table-column>
                            <!-- 授权 -->
                            <el-table-column :label="$t('mxpcweb.systemset.applicationcenter.1530259435107')">
                                <template slot-scope="scope">
                                    <el-switch v-model="scope.row.showClickName" on-text="" off-text="" @change="setAuthEmployee(scope.row,'cancel')"> </el-switch>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>

                </div>
            </el-tab-pane>
            <!-- 当前应用 -->
            <el-tab-pane :label="$t('mxpcweb.systemset.applicationcenter.1530259487316')" name="second">
                <current-app class="mainBodyTab"></current-app>
            </el-tab-pane>
            <!-- 购买记录 -->
            <el-tab-pane label="购买记录" name="third">
                <buy-order ref="BuyOrder" class="mainBodyTab" />
            </el-tab-pane>
        </el-tabs>

        <!-- 升级套餐和配置 -->
        <upgrade-Comp ref="upgradeComp"></upgrade-Comp>
    </div>
</template>

<script>
/**
 * 描述：系统设置=>应用中心
 * 作者：向士健
 * 时间：2017/7/8
 */
import { isObject, isArray } from '@/libs/utils.js'
import PageTitle from '@/components/PageTitle/index' // 大标题
import { mapGetters } from 'vuex'

import upgradeComp from './Upgrade/index'
import CurrentApp from './CurrentApp/index'
import BuyOrder from './BuyOrder/index'
import ToOrder from './ToOrder/index'

let echarts = require('echarts/lib/echarts') // 引入基本模板
require('echarts/lib/chart/line') // 线图
require('echarts/lib/chart/pie') // 饼图
require('echarts/lib/component/tooltip') // 鼠标经过tips
require('echarts/lib/component/legend')

export default {
    name: 'ApplicationCenter',
    props: {},
    data() {
        return {
            // tableHeight: '300',
            showData: true,
            pkname: '',
            spacecount: 0, // 总云空间
            usedSpace: 0, // 已使用云空间 （2018.7.27新增）
            totalamount: 0,
            unitprice: 0,
            monthcount: 0,
            authcount: 0,
            useauthCount: 0,
            expirationtime: '',
            totalDays: 0,
            useDays: 0,
            cId: 0,
            ctId: 0,
            activeName: 'first',
            rolesList: [],
            DataArray: [],
            tableData: [],
            authData: [],

            routeUrl: '/main/systemset/applicationcenter',
            toRenew: false,
            powerObj: {}
        }
    },
    created() {
        // console.log(this.$route.path)
        let _this = this
        setTimeout(() => {
            if (_this.$route.path) {
                _this.routeUrl = _this.$route.path
            }

            let { cId, ctId } = _this.company
            _this.cId = cId
            _this.ctId = ctId
            _this.getCompanyUseInfo()
        }, 55)
        this.getUseSpace()
        this.getPower()
    },
    mounted() {
        setTimeout(() => {
            this.getWinHeight()
        }, 200)
        $(window).resize(() => {
            this.getWinHeight()
        })
    },
    computed: {
        ...mapGetters(['company']),
        notProd() {
            return window.runtime != 'prod'
        }
    },
    methods: {
        handleClick() {
            if (this.activeName == 'third') {
                this.$refs.BuyOrder.getDataList()
            }
        },
        getPower() {
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.manageFlag, { params: {} })
                .then(
                    function (res) {
                        // console.log(res)
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            _this.powerObj = res.body.data
                        }
                    },
                    function (res) {
                        /* 网络异常 */
                        _this.$message.error(this.$t('mxpcweb.mai.sys.gro.networkAnomaly'))
                    }
                )
        },
        // 设置固定高
        getWinHeight() {
            const _this = this
            let winHeight = document.body.clientHeight
            _this.$refs.appMsg.style.height = winHeight - 130 + 'px'
            this.tableHeight = winHeight - 250
        },
        // 获取角色字段
        getRole(roleIds = [], allRoles = []) {
            let roleName = ''
            roleIds.forEach(element1 => {
                allRoles.forEach(element2 => {
                    if (element1 == element2.roleId) {
                        roleName += element2.roleName + ','
                    }
                })
            })
            return roleName.substr(0, roleName.length - 1)
        },

        // 获取部门名称
        getDepartName(Departs = []) {
            let departname = ''
            Departs.forEach(element2 => {
                departname += element2.deptName + ','
            })
            if (departname == '') {
                /* 未分配部门 */
                return this.$t('mxpcweb.systemset.applicationcenter.1530259522866')
            } else {
                return departname.substr(0, departname.length - 1)
            }
        },

        // 获取角色
        getRolesList() {
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.rolemanag.roles, { params: { type: 'all' } })
                .then(
                    function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                            _this.rolesList = res.body.data
                        }
                    },
                    function (res) {
                        /* 网络异常 */
                        _this.$message.error(this.$t('mxpcweb.mai.sys.gro.networkAnomaly'))
                    }
                )
        },
        // 授权列表
        getAuthList() {
            let _this = this
            let { cId } = this.company
            let data = { cid: cId }
            this.$http.get(this.Global.baseURL + this.Global.api.v2.getAuthMembers, { params: data })
                .then(
                    function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            this.authData = res.body.data.dataList
                            var userCount = this.authData.length
                            this.useauthCount = userCount
                            this.getChartsData()
                        }
                    },
                    function (res) {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    }
                )
        },
        // 获取人员列表
        getUserList() {
            let _this = this
            let data = { dCode: 0 }
            this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.groupstructure.getTable, { params: data }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    var jsonData = res.body.data.tableList

                    let newArr = []
                    for (var i = 0; i < jsonData.length; i++) {
                        var ctId = jsonData[i].ctId
                        var realName = jsonData[i].realName
                        var dept = this.getDepartName(jsonData[i].departments)
                        var mobile = jsonData[i].mobile
                        var email = jsonData[i].email
                        var authFlag = 0
                        /* 未授权 */
                        var operationname = this.$t('mxpcweb.systemset.applicationcenter.1530259545775')
                        var showClickName = false
                        let avatar = !jsonData[i].avatar ? '3,107d091f7e2d' : jsonData[i].avatar

                        for (var k = 0; k < this.authData.length; k++) {
                            if (this.authData[k].ctid == ctId) {
                                authFlag = '1'
                                /*  已授权 */
                                operationname = this.$t('mxpcweb.systemset.applicationcenter.1530259568270')
                                showClickName = true
                            }
                        }
                        var roleName = this.getRole(jsonData[i].contactRoles, this.rolesList)
                        var userInfo = {
                            ctId: ctId,
                            realName: realName,
                            dept: dept,
                            roleName: roleName,
                            mobile: mobile,
                            email: email,
                            authFlag: authFlag,
                            operationname: operationname,
                            showClickName: showClickName,
                            avatar: avatar
                        }
                        newArr.push(userInfo)
                    }
                    this.tableData = newArr

                    _this.showData = false
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            }
            )
        },
        // 获取图表数据
        getChartsData() {
            // 使用天数
            let useDaysObj = echarts.init(document.getElementById('useDaychart'))
            let optionuseDay = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{b} : {c}天({d}%)'
                },
                color: ['#FF7165', '#efe2e4'], // 手动设置每个图例的颜色
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: ['54%', '60%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    fontSize: '10',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [
                            /* 已使用 */
                            { value: this.useDays, name: this.$t('mxpcweb.systemset.applicationcenter.1530259605654') },
                            /*  未使用 */
                            { value: this.totalDays, name: this.$t('mxpcweb.systemset.applicationcenter.1530259638967') }
                        ]
                    }
                ]
            }
            useDaysObj.setOption(optionuseDay)

            // 用户许可
            let usePersonObj = echarts.init(document.getElementById('usePersonChart'))
            let usePersonoption = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{b} : {c}个({d}%)'
                },
                color: ['#5EA3F6', '#efe2e4'], // 手动设置每个图例的颜色
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: ['54%', '60%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    fontSize: '10',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [
                            /* 已使用 */
                            { value: this.useauthCount, name: this.$t('mxpcweb.systemset.applicationcenter.1530259605654') },
                            /*  未使用 */
                            { value: this.authcount - this.useauthCount, name: this.$t('mxpcweb.systemset.applicationcenter.1530259638967') }
                        ]
                    }
                ]
            }
            usePersonObj.setOption(usePersonoption)

            // 使用空间
            let useSpaceObj = echarts.init(document.getElementById('useSpaceChart'))
            let useSpaceoption = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{b} : {c}G({d}%)'
                },
                color: ['#FFB735', '#efe2e4'], // 手动设置每个图例的颜色
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: ['54%', '60%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    fontSize: '10',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [
                            /* 已使用 */
                            { value: this.usedSpace, name: this.$t('mxpcweb.systemset.applicationcenter.1530259605654') },
                            /*  未使用 */
                            { value: this.spacecount, name: this.$t('mxpcweb.systemset.applicationcenter.1530259638967') }
                        ]
                    }
                ]
            }
            useSpaceObj.setOption(useSpaceoption)
        },
        /**
         * 取云空间使用量，(2018.7.27 新增字段)
         * **/
        getUseSpace() {
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.company_query, {}).then(function (res) {
                if (res.body.code.toString() === _this.Global.RES_OK && isObject(res.body.data)) {
                    let backArr = res.body.data
                    let used = backArr.useSpace / 1024 / 1024 / 1024 // 字节换成G
                    this.usedSpace = used
                }
            }, function (res) {
                _this.$message.error(_this.msg(res.body))
            })
        },
        // 获取企业使用情况
        async getCompanyUseInfo() {
            let reprtData = await this.$http.get(this.Global.baseURL + this.Global.api.v2.getAuthInfo,
                { params: { cid: this.cId } }
            )
            if (reprtData.body.code.toString() == this.Global.RES_OK && isObject(reprtData.body.data)) {
                let authInfo = reprtData.body.data
                // console.log('authInfo')
                // console.log(authInfo)
                this.pkname = authInfo.pkname

                var expirationtime = this.timeShow_custom(authInfo.expirationtime, 'YYYY-MM-DD')

                this.expirationtime = expirationtime
                this.spacecount = authInfo.spacecount
                this.authcount = authInfo.authcount
                this.useDays = authInfo.useDays
                this.totalDays = authInfo.totalDays

                let { cId } = this.company
                let data = { cid: cId }
                let authMembers = await this.$http.get(this.Global.baseURL + this.Global.api.v2.getAuthMembers,
                    { params: data }
                )
                if (authMembers.body.code.toString() == this.Global.RES_OK) {
                    this.authData = authMembers.body.data.dataList
                    var userCount = this.authData.length
                    this.useauthCount = userCount
                }
                // 绘制图表
                this.getChartsData()
                // 角色信息
                this.getRolesList()
                // 用户列表
                this.getUserList()
            } else {
                this.showData = false
                this.$message.error(reprtData.body.msg)
            }
        },
        padLeftZero(str) {
            return ('00' + str).substr(str.length)
        },
        // 授权或者取消授权
        setAuthEmployee(t) {
            let _this = this
            _this.$http.post(this.Global.baseURL + this.Global.api.v2.toAuthEmployee, {
                type: t.authFlag == '0' ? 'add' : 'cancel',
                cid: this.cId,
                ctid: t.ctId
            })
                .then(function (res) {
                    if (res.body && res.body.code.toString() == _this.Global.RES_OK) {
                        this.tableData.forEach(element => {
                            var msg = ''
                            if (element.ctId == t.ctId) {
                                if (element.authFlag == '1') {
                                    element.authFlag = '0'
                                    /* 未授权 */
                                    element.operationname = this.$t('mxpcweb.systemset.applicationcenter.1530259545775')
                                    element.showClickName = false
                                    /* 取消授权成功 */
                                    msg = this.$t('mxpcweb.systemset.applicationcenter.1530260092327')
                                } else {
                                    element.authFlag = '1'
                                    /* 已授权 */
                                    element.operationname = this.$t('mxpcweb.systemset.applicationcenter.1530259568270')
                                    element.showClickName = true
                                    /* 授权成功 */
                                    msg = this.$t('mxpcweb.systemset.applicationcenter.1530260114265')
                                }
                                this.$message.success(msg)
                                this.getAuthList()
                            }
                        })
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                    this.getCompanyUseInfo()
                })
        }
    },
    watch: {
        '$route': function (val, old) {
            if (val.path == this.routeUrl) {
                this.getCompanyUseInfo()
                this.getUseSpace()
            }
        }
    },
    components: {
        'page-title': PageTitle,
        'upgrade-Comp': upgradeComp,
        'current-app': CurrentApp,
        'buy-order': BuyOrder,
        'to-order': ToOrder
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
