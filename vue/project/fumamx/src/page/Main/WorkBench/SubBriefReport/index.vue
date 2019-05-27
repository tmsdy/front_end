<template>
    <div class="dashboardBox SubBriefReport">
        <div class="workTitle">
            <!-- 简报 -->
            <span class="name">{{pannelName}}</span>
        </div>
        <div class="workBody" v-loading="isload">
            <table class="widthFull">
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
                        <td>
                            <!-- 日期 -->{{$t('mxpcweb.workbench.1530692925389')}}
                        </td>
                        <td>
                            <!-- 客户数 -->{{$t('mxpcweb.workbench.1530686701602')}}
                        </td>
                        <td>
                            <!-- 跟进数 -->{{$t('mxpcweb.workbench.1530672455895')}}
                        </td>
                        <td>
                            <!-- 跟进客户数 -->{{$t('mxpcweb.workbench.1530672470013')}}
                        </td>
                        <td>
                            <!-- 邮件数 -->{{$t('mxpcweb.workbench.1530672486079')}}
                        </td>
                        <td v-for="item in TractInfo[0]" :key="item.dictItemCode">{{item.itemName}}</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in SubData" :key="index">
                        <td>
                            {{item.intervalName }}
                        </td>
                        <td>
                            <strong class="text-hover" @click="toClient('BF001',false,item.interval)">{{item.newCount}}</strong>
                        </td>
                        <td>
                            <strong class="text-hover" @click="toClient('BF004',false,item.interval)">{{item.trackCount}}</strong>
                        </td>
                        <td>
                            <!-- <strong class="text-hover" @click="toClient('BF001',false,item.interval,'3')">{{item.trackCustCount}}</strong> -->
                            <strong>{{item.trackCustCount}}</strong>
                        </td>
                        <td>
                            <strong>{{item.mailCount}}</strong>
                        </td>
                        <td v-for="item in item.trackInfo" :key="item.dictItemCode">
                            <strong class="text-hover" @click="toClient('BF004',{trackMode:item.dictItemCode},item.interval)">{{item.count}}</strong>
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>
    </div>
</template>
<script>
import { isObject } from '@/libs/utils.js'
export default {
    name: 'SubBriefReport',
    props: ['data'],
    data() {
        return {
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
            SubPerData: [],
            TractInfo: [],
            ctId: 0,
            statinterval: [],
            isload: true
        }
    },
    created() {
        if (this.data.length > 0) {
            this.pannelName = this.data[0].statname
            this.ctId = this.data[0].ctId
            this.startId = this.data[0].statid
            var selectinterval = this.data[0].selectinterval
            this.interval = selectinterval
            this.statinterval = this.data[0].statinterval
            this.isload = true
            this.getBriefReportData(this.data[0].statinterval)
        }
    },
    methods: {
        toClient(modelCode, obj, interval, timeType) { // 跳转客户
            let _this = this
            let data = {
                modelCode: modelCode,
                interval: interval,
                argument: {}
            }
            if (obj) {
                data.argument = obj
            };
            data.argument.ownerCtId = this.ctId
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

        // 接口获取工作简报数据
        async getBriefReportData(statintervalArray) {
            let _this = this
            var url = _this.Global.baseURL + _this.Global.api.v2.stat_pers_get
            for (var i = 0; i < statintervalArray.length; i++) {
                var value = statintervalArray[i].intervalCode
                this.interval = value
                var name = this.getName(this.interval)
                let reprtData = await _this.$http.get(url, {
                    params: {
                        statId: this.startId,
                        interval: value,
                        staffId: this.ctId
                    }
                })
                if (reprtData.body.code.toString() == _this.Global.RES_OK && isObject(reprtData.body.data)) {
                    this.addCount = reprtData.body.data.objectResults.addCount
                    var dataResult = {
                        intervalName: name,
                        newCount: this.addCount.newCount,
                        trackCount: this.addCount.trackCount,
                        trackCustCount: this.addCount.trackCustCount,
                        mailCount: this.addCount.mailCount,
                        trackInfo: reprtData.body.data.objectResults.trackCount,
                        interval: value
                    }
                    if (this.TractInfo.length == 0) {
                        if (reprtData.body.data != undefined) {
                            this.TractInfo.push(reprtData.body.data.objectResults.trackCount)
                        }
                    }
                    this.SubPerData.push(dataResult)
                }
            }
            this.SubData = this.SubPerData
            this.isload = false
        }
    },
    components: {}
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
