<template>
    <div class="dashboardBox DeptBriefReport">
        <div class="workTitle">
            <span class="pull-right">
                <!-- 请选择 -->
                <el-select v-model="region" :placeholder="$t('mxpcweb.workbench.1530671363646')" size="small" @change="chageOption()">
                    <el-option v-for="item in statinterval" :key="item.intervalCode" :value="item.intervalCode" :label="item.intervalName"> </el-option>
                </el-select>
            </span>
            <!--员工工作简报-->
            <span class="name">{{pannelName}}</span>
        </div>
        <div class="workBody" v-loading="isload">

            <table class="widthFull" v-if="SubData.length>0 && TractInfo.length>0">
                <thead>
                    <tr>
                        <td></td>
                        <td colspan="4">
                            <!-- 新增 -->{{$t('mxpcweb.workbench.1530671409518')}}
                        </td>
                        <td colspan="5">
                            <!-- 跟进 -->{{$t('mxpcweb.workbench.1530671424637')}}
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td @click="custSortData($event)" sortname="newCount" ordername="desc">
                            <!-- 客户数 -->{{$t('mxpcweb.workbench.1530686701602')}}
                        </td>
                        <td @click="custSortData($event)" sortname="trackCount" ordername="desc">
                            <!-- 跟进数 -->{{$t('mxpcweb.workbench.1530672455895')}}
                        </td>
                        <td @click="custSortData($event)" sortname="trackCustCount" ordername="desc">
                            <!-- 跟进客户数 -->{{$t('mxpcweb.workbench.1530672470013')}}
                        </td>
                        <td @click="custSortData($event)" sortname="mailCount" ordername="desc">
                            <!-- 邮件数 -->{{$t('mxpcweb.workbench.1530672486079')}}
                        </td>
                        <td v-for="item in TractInfo[0]" :key="item.dictItemCode" @click="trackSortData($event)" :sortname="item.dictItemCode" ordername="desc">{{item.itemName}}</td>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(item,index) in SubData">
                        <tr :key="index" v-if="index<showNum">
                            <td>
                                {{item.realName }}
                            </td>
                            <td>
                                <strong class="text-hover" @click="toClient('BF001',{ownerCtId:item.ctId})">{{item.objectResults.addCount.newCount}}</strong>
                            </td>
                            <td>
                                <strong class="text-hover" @click="toClient('BF004',{ownerCtId:item.ctId})">{{item.objectResults.addCount.trackCount}}</strong>
                            </td>
                            <td>
                                <strong>{{item.objectResults.addCount.trackCustCount}}</strong>
                            </td>
                            <td>
                                <strong>{{item.objectResults.addCount.mailCount}}</strong>
                            </td>
                            <td v-for="item in item.objectResults.trackCount" :key="item.dictItemCode">
                                <strong class="text-hover" @click="toClient('BF004',{trackMode:item.dictItemCode,ownerCtId:item.ctId})">{{item.count}}</strong>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
            <div style="height:200px;" v-else>
                <!-- 暂无数据 -->
                <nodata :title="$t('mxpcweb.workbench.1530682446647')"></nodata>
            </div>
            <div class="showMore text-hover" v-if="SubData.length>=showNum">
                <span v-if="showNum === 8" @click="showNum = SubData.length">
                    <!-- 查看全部 -->{{$t('mxpcweb.workbench.1530689647157')}}
                </span>
                <span v-else @click="showNum = 8">
                    <!-- 收起 -->{{$t('mxpcweb.workbench.1530689674165')}}
                </span>
            </div>
        </div>
    </div>
</template>
<script>
import { setStore, getStore } from '@/libs/utils.js'
import NoData from '@/basecomponents/NoData/index'
export default {
    name: 'DeptBriefReport',
    props: ['isshow', 'data'],
    data() {
        return {
            showNum: 8, // 默认展示条数
            region: '',
            pannelName: '',
            selectOption: [],
            interval: 1,
            newCount: 0, // 客户数
            trackCount: 0, // 跟进数
            trackCustCount: 0, // 客户跟进数
            mailCount: 0, // 邮件数
            startId: 1,
            addCount: [], // 客户统计数据
            SubData: [],
            TractInfo: [],
            ctId: 0,
            statinterval: [],
            isload: false,
            dkey: '',
            sort: '',
            order: ''
        }
    },
    created() {
        if (this.data.length > 0) {
            this.pannelName = this.data[0].statname
            this.ctId = this.data[0].ctId
            this.startId = this.data[0].statid

            this.statinterval = this.data[0].statinterval
            if (this.statinterval.length > 0) {
                let selectedinterval = getStore('deptbriefinterval')
                var selectinterval
                if (selectedinterval != undefined && selectedinterval != '') {
                    selectinterval = selectedinterval
                } else {
                    selectinterval = this.statinterval[0].intervalCode
                    setStore('deptbriefinterval', selectinterval)
                }
                this.interval = selectinterval
            }

            this.isload = true
            var cname = this.getName(this.interval)
            this.region = cname

            this.dkey = this.data[0].depts[0].dkey
            this.getDeptBriefData()
            this.isload = false
        }
    },
    mounted() { },
    methods: {

        toClient(modelCode, obj, timeType) { // 跳转客户
            let _this = this
            let data = {
                modelCode: modelCode,
                interval: _this.interval,
                argument: {}
            }
            if (obj) {
                data.argument = obj
            };
            if (timeType) {
                data.timeType = timeType
            };
            _this.toClient_g(data)
        },
        getName(itemCode) {
            var itemName = ''
            for (var i = 0; i < this.statinterval.length; i++) {
                if (this.statinterval[i].intervalCode == itemCode) {
                    itemName = this.statinterval[i].intervalName
                    return itemName
                }
            }
            return itemCode
        },

        chageOption() {
            var selectRegin = this.region
            this.interval = selectRegin
            setStore('deptbriefinterval', this.interval)
            this.getDeptBriefData()
        },
        getDeptBriefData() {
            let _this = this
            var url = _this.Global.baseURL + _this.Global.api.v2.stat_dept_briefReport
            let paramsData = {
                statId: this.startId,
                dkey: this.dkey,
                interval: this.interval,
                sort: this.sort,
                order: this.order
            }
            this.$http.get(url, { params: paramsData }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    if (this.TractInfo.length == 0) {
                        if (res.body.data && res.body.data.length > 0) {
                            this.TractInfo.push(res.body.data[0].objectResults.trackCount)
                        }
                    }
                    if (res.body.data) {
                        this.SubData = res.body.data
                    }
                }
            }, (res) => {
                    this.$message.error(_this.$t(_this.Global.errorTitle))
                }
            )
        },
        custSortData(obj) {
            var target = event.currentTarget
            var element = $(target)
            var sortname = element.attr('sortname')
            var ordername = element.attr('ordername')

            if (ordername == 'asc') {
                element.attr('ordername', 'desc')
            } else if (ordername == 'desc') {
                element.attr('ordername', 'asc')
            }

            this.sort = sortname
            this.order = ordername
            this.getDeptBriefData()
        },

        trackSortData(obj) {
            var target = event.currentTarget
            var element = $(target)
            var sortname = 'trackMode_' + element.attr('sortname')
            var ordername = element.attr('ordername')

            if (ordername == 'asc') {
                element.attr('ordername', 'desc')
            } else if (ordername == 'desc') {
                element.attr('ordername', 'asc')
            }

            this.sort = sortname
            this.order = ordername
            this.getDeptBriefData()
        }
    },
    components: {
        nodata: NoData
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
