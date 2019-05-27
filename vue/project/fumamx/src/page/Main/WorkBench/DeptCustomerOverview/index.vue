<template>
    <div class="dashboardBox DeptCustomerOverview" v-bind:class='bindClass'>
        <div class="workTitle">
            <!-- 部门客户综述 -->
            <span class="name">{{pannelName}}</span>
        </div>
        <div class="workBody MXscroll">
            <el-row class="smallSecretary">
                <el-col :span="8">
                    <div class="text-hover" @click="toClient('BF001')">{{custCount}}</div>
                    <div class="total">
                        <!-- 客户总数 -->{{$t('mxpcweb.workbench.1530684194288')}}
                    </div>
                    <!-- 比上月增加<span class="text-red">x</span>个 -->
                    <div class="totalDesc" v-if="increaseCustCount>=0" v-html="$t('mxpcweb.workbench.1530675319308',[increaseCustCount])"></div>
                    <!-- 比上月减少<span class="text-red">x</span>个 -->
                    <div class="totalDesc" v-else v-html="$t('mxpcweb.workbench.1530678760971',[increaseCustCount.toString().replace('-','')])"></div>
                </el-col>
                <el-col :span="8">
                    <div>{{thirtyCount}}</div>
                    <div class="total">
                        <!-- 活跃客户 -->{{$t('mxpcweb.workbench.1530691214227')}}
                    </div>
                    <!-- 比上月增加<span class="text-red">x</span>个 -->
                    <div class="totalDesc" v-if="increaseThirtyCount>=0" v-html="$t('mxpcweb.workbench.1530675319308',[increaseThirtyCount])"></div>
                    <!-- 比上月减少<span class="text-red">x</span>个 -->
                    <div class="totalDesc" v-else v-html="$t('mxpcweb.workbench.1530678760971',[increaseThirtyCount.toString().replace('-','')])"></div>
                </el-col>
                <el-col :span="8">
                    <div>{{transCount}}</div>
                    <div class="total">
                        <!-- 成交总数 -->{{$t('mxpcweb.workbench.1530691236813')}}
                    </div>
                    <!-- 比上月增加<span class="text-red">x</span>个 -->
                    <div class="totalDesc" v-if="increaseTransCount>=0" v-html="$t('mxpcweb.workbench.1530675319308',[increaseTransCount])"></div>
                    <!-- 比上月减少<span class="text-red">x</span>个 -->
                    <div class="totalDesc" v-else v-html="$t('mxpcweb.workbench.1530678760971',[increaseTransCount.toString().replace('-','')])"></div>
                </el-col>
            </el-row>

            <el-row class="smallSecretary lineTwo">
                <el-col :span="8">
                    <div class="text-hover" @click="toClient('BF001',false,'2','a1')">{{willInSeasCount}}</div>
                    <div>
                        <!-- 7天内将掉入公海 -->{{$t('mxpcweb.workbench.1530675124320')}}
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="text-hover" @click="toClient('BF001',false,'3','a2')">{{fifteenNotCount}}</div>
                    <div>
                        <!-- 15天以上未跟进 -->{{$t('mxpcweb.workbench.1530675137987')}}
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="text-hover" @click="toClient('BF001',false,'3','a3')">{{thirtyNotCount}}</div>
                    <div>
                        <!-- 30天以上未跟进 -->{{$t('mxpcweb.workbench.1530675150824')}}
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { isObject } from '@/libs/utils.js'
export default {
    name: 'DeptCustomerOverview',
    props: ['data'],
    data() {
        return {
            region: '',
            pannelName: '',
            custCount: 0,
            fifteenNotCount: 0,
            increaseCustCount: 0,
            increaseThirtyCount: 0,
            increaseTransCount: 0,
            thirtyCount: 0,
            thirtyNotCount: 0,
            transCount: 0,
            willInSeasCount: 0,
            startId: 3,
            bindClass: '',
            ctId: 0,
            depts: []
        }
    },
    created() {
        if (this.data.length > 0) {
            this.pannelName = this.data[0].statname
            this.startId = this.data[0].statid
            this.ctId = this.data[0].ctId
            if (this.data[0].index == '1') {
                this.bindClass = 'rightmargin'
            } else {
                this.bindClass = 'leftmargin'
            }

            this.depts = this.data[0].depts
            if (this.depts.length > 0) {
                this.dkey = this.depts[0].dkey
                this.departName = this.depts[0].deptName
                this.getRemindData()
            }
        }
    },
    mounted() { },
    methods: {
        getRemindData() {
            let _this = this
            var url = _this.Global.baseURL + _this.Global.api.v2.stat_dept_custSummarize_get
            _this.$http.get(url, { params: { statId: this.startId, dkey: this.dkey } }).then(
                (res) => {
                    if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data)) {
                        // console.log(res.body.data);
                        if (!res.body.data.objectResults) { return }
                        var objectResults = res.body.data.objectResults
                        if (objectResults) {
                            if (objectResults.custCount != undefined) {
                                this.custCount = objectResults.custCount
                            }

                            if (objectResults.fifteenNotCount != undefined) {
                                this.fifteenNotCount = objectResults.fifteenNotCount
                            }
                            if (objectResults.increaseCustCount != undefined) {
                                this.increaseCustCount = objectResults.increaseCustCount
                            }
                            if (objectResults.increaseThirtyCount != undefined) {
                                this.increaseThirtyCount = objectResults.increaseThirtyCount
                            }
                            if (objectResults.increaseTransCount != undefined) {
                                this.increaseTransCount = objectResults.increaseTransCount
                            }
                            if (objectResults.thirtyCount != undefined) {
                                this.thirtyCount = objectResults.thirtyCount
                            }
                            if (objectResults.thirtyNotCount != undefined) {
                                this.thirtyNotCount = objectResults.thirtyNotCount
                            }
                            if (objectResults.totalTransCount != undefined) {
                                this.transCount = objectResults.totalTransCount
                            }
                            if (objectResults.willInSeasCount != undefined) {
                                this.willInSeasCount = objectResults.willInSeasCount
                            }
                        }
                    } else {
                        _this.$message.error(res.data.msg)
                    }
                },
                (res) => {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                }
            )
        },
        toClient(modelCode, obj, timeType, interval) { // 跳转客户
            let _this = this
            let data = {
                modelCode: modelCode,
                interval: interval,
                argument: {}
            }
            if (obj) {
                data.argument = obj
            };
            if (timeType) {
                data.timeType = timeType
            }
            data.argument.ownerDeptKey = this.dkey
            _this.toClient_g(data)
        }
    },
    components: {}
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
