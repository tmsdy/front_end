<template>
    <div class="dashboardBox DeptActivity" v-bind:class='bindClass'>
        <div class="workTitle">
            <span class="name">{{pannelName}}</span>
        </div>
        <div class="workBody MXscroll">
            <div class="liveness">
                <div class="numClass">
                    <span class="pull-right">
                        <!-- 客户总数： -->{{$t('mxpcweb.workbench.1530686213246')}}
                        <span class="text-red">{{custCount}}</span>
                    </span>
                </div>
                <table cellspacing="0">
                    <tr>
                        <td width="100">
                            <!-- 7天内有联系 -->{{$t('mxpcweb.workbench.1530686239792')}}
                        </td>
                        <td>
                            <div class="progress">
                                <span v-if="sevenCountPer==0" style="width:2%"></span>
                                <span v-else :style="{width:parseFloat(sevenCountPer)+2+'%'}"></span>
                            </div>
                        </td>
                        <td width="50" align="center">
                            <span class="text-red">{{sevenCount}}</span>
                        </td>
                        <td width="50" align="right">{{sevenCountPer}}%</td>
                    </tr>
                    <tr>
                        <td>
                            <!-- 15天内有联系 -->{{$t('mxpcweb.workbench.1530686266050')}}
                        </td>
                        <td>
                            <div class="progress">
                                <span v-if="fifteenCountPer==0" style="width:2%"></span>
                                <span v-else :style="{width:parseFloat(fifteenCountPer)+2+'2%'}"></span>
                            </div>
                        </td>
                        <td align="center">
                            <span class="text-red">{{fifteenCount}}</span>
                        </td>
                        <td align="right">{{fifteenCountPer}}%</td>
                    </tr>
                    <tr>
                        <td>
                            <!-- 30天内有联系 -->{{$t('mxpcweb.workbench.1530686292374')}}
                        </td>
                        <td>
                            <div class="progress">
                                <span v-if="thirtyCountPer==0" style="width:2%"></span>
                                <span v-else :style="{width:parseFloat(thirtyCountPer)+2+'%'}"></span>
                            </div>
                        </td>
                        <td align="center">
                            <span class="text-red">{{thirtyCount}}</span>
                        </td>
                        <td align="right">{{thirtyCountPer}}%</td>
                    </tr>
                    <tr>
                        <td>
                            <!-- 60天内有联系 -->{{$t('mxpcweb.workbench.1530686318725')}}
                        </td>
                        <td>
                            <div class="progress">
                                <span v-if="sixtyCountPer==0" style="width:2%"></span>
                                <span v-else :style="{width:parseFloat(sixtyCountPer)+2+'%'}"></span>
                            </div>
                        </td>
                        <td align="center">
                            <span class="text-red">{{sixtyCount}}</span>
                        </td>
                        <td align="right">{{sixtyCountPer}}%</td>
                    </tr>
                    <tr>
                        <td>
                            <!-- 90天内有联系 -->{{$t('mxpcweb.workbench.1530686345351')}}
                        </td>
                        <td>
                            <div class="progress">
                                <span v-if="ninetyCountPer==0" style="width:2%"></span>
                                <span v-else :style="{width:parseFloat(ninetyCountPer)+2+'%'}"></span>
                            </div>
                        </td>
                        <td align="center">
                            <span class="text-red">{{ninetyCount}}</span>
                        </td>
                        <td align="right">{{ninetyCountPer}}%</td>
                    </tr>
                    <tr>
                        <td>
                            <!-- 从未有联系 -->{{$t('mxpcweb.workbench.1530686372268')}}
                        </td>
                        <td>
                            <div class="progress">
                                <span v-if="inactionCountPer==0" style="width:2%"></span>
                                <span v-else :style="{width:parseFloat(inactionCountPer)+2+'%'}"></span>
                            </div>
                        </td>
                        <td align="center">
                            <span class="text-red">{{inactionCount}}</span>
                        </td>
                        <td align="right">{{inactionCountPer}}%</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import { isObject } from '@/libs/utils.js'
export default {
    name: 'DeptActivity',
    props: ['isshow', 'data'],
    data() {
        return {
            /* '本周' */
            region: this.$t('mxpcweb.workbench.1530672871996'),
            isload: false,
            pannelName: '',
            startId: 5,
            custCount: 0, // 总客户数
            fifteenCount: 0, // 15天内有联系
            inactionCount: 0, // 从未有联系
            ninetyCount: 0, // 90天内有联系
            sevenCount: 0, // 7天内有联系
            sixtyCount: 0, // 60天内有联系
            thirtyCount: 0, // 30天内有联系
            fifteenCountPer: 0,
            inactionCountPer: 0,
            ninetyCountPer: 0,
            sevenCountPer: 0,
            sixtyCountPer: 0,
            thirtyCountPer: 0,
            bindClass: '',
            ctId: 0,
            dkey: '',
            depts: []
        }
    },
    created() {
        if (this.data.length > 0) {
            this.pannelName = this.data[0].statname
            this.ctId = this.data[0].ctId
            if (this.data[0].index == '1') {
                this.bindClass = 'rightmargin'
            } else {
                this.bindClass = 'leftmargin'
            }
            this.startId = this.data[0].statid
            this.depts = this.data[0].depts
            if (this.depts.length > 0) {
                this.dkey = this.depts[0].dkey
            }
            this.getActiveData()
        }
    },
    mounted() { },
    methods: {
        toDecimal(x) {
            var float = parseFloat(x)
            if (isNaN(float)) {
                return false
            }
            var f = Math.round(x * 10) / 10
            var s = f.toString()
            var rs = s.indexOf('.')
            if (rs < 0) {
                rs = s.length
                s += '.'
            }
            while (s.length <= rs + 1) {
                s += '0'
            }
            return s
        },
        getActiveData() {
            let _this = this
            var url =
                _this.Global.baseURL + _this.Global.api.v2.stat_dept_activity_get
            _this.$http
                .get(url, { params: { statId: this.startId, dkey: this.dkey } })
                .then(
                    (res) => {
                        if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data)) {
                            // console.log(res.body);
                            var objectResults = res.body.data.objectResults
                            if (objectResults) {
                                if (objectResults.custCount != undefined) {
                                    this.custCount = objectResults.custCount
                                }

                                if (
                                    objectResults.fifteenCount != undefined &&
                                    objectResults.custCount != 0
                                ) {
                                    this.fifteenCount = objectResults.fifteenCount
                                    this.fifteenCountPer = this.toDecimal(
                                        parseFloat(this.fifteenCount / this.custCount) * 100
                                    )
                                }

                                if (
                                    objectResults.inactionCount != undefined &&
                                    objectResults.custCount != 0
                                ) {
                                    this.inactionCount = objectResults.inactionCount
                                    this.inactionCountPer = this.toDecimal(
                                        parseFloat(this.inactionCount / this.custCount) * 100
                                    )
                                }

                                if (
                                    objectResults.ninetyCount != undefined &&
                                    objectResults.custCount != 0
                                ) {
                                    this.ninetyCount = objectResults.ninetyCount
                                    this.ninetyCountPer = this.toDecimal(
                                        parseFloat(this.ninetyCount / this.custCount) * 100
                                    )
                                }

                                if (
                                    objectResults.sevenCount != undefined &&
                                    objectResults.custCount != 0
                                ) {
                                    this.sevenCount = objectResults.sevenCount
                                    this.sevenCountPer = this.toDecimal(
                                        parseFloat(this.sevenCount / this.custCount) * 100
                                    )
                                }

                                if (
                                    objectResults.sixtyCount != undefined &&
                                    objectResults.custCount != 0
                                ) {
                                    this.sixtyCount = objectResults.sixtyCount
                                    this.sixtyCountPer = this.toDecimal(
                                        parseFloat(this.sixtyCount / this.custCount) * 100
                                    )
                                }

                                if (
                                    objectResults.thirtyCount != undefined &&
                                    objectResults.custCount != 0
                                ) {
                                    this.thirtyCount = objectResults.thirtyCount
                                    this.thirtyCountPer = this.toDecimal(
                                        parseFloat(this.thirtyCount / this.custCount) * 100
                                    )
                                }
                            }
                        } else {
                            _this.$message.error(res.data.msg)
                        }
                    }, (res) => {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    }
                )
        }
    },
    components: {}
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
