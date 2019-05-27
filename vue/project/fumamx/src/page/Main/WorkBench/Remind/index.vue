<template>
    <div class="dashboardBox Remind" v-bind:class='bindClass'>
        <div class="workTitle">
            <!--提醒小秘书-->
            <span class="name">{{pannelName}}</span>
        </div>
        <div class="workBody MXscroll">
            <el-row class="smallSecretary">
                <el-col :span="8">
                    <div class="text-hover" @click="toClient('BF001')">{{custCount}}</div>
                    <div class="total">
                        <!-- 你的客户总数 -->{{$t('mxpcweb.workbench.1530674189421')}}
                    </div>
                    <!-- 比上月增加<span class="text-red">{0}</span>个-->
                    <div class="totalDesc" v-if="increaseCustCount>=0" v-html="$t('mxpcweb.workbench.1530675319308',[increaseCustCount])">

                    </div>
                    <!-- 比上月减少<span class="text-red">{0} </span>个 -->
                    <div class="totalDesc" v-else v-html="$t('mxpcweb.workbench.1530678760971',[increaseCustCount.replace('-','')])"></div>
                </el-col>
                <el-col :span="8">
                    <div>{{thirtyCount}}</div>
                    <div class="total">
                        <!-- 本月活跃客户 -->{{$t('mxpcweb.workbench.1530674854772')}}
                    </div>
                    <!-- 比上月增加<span class="text-red">{0}</span>个-->
                    <div class="totalDesc" v-if="increaseThirtyCount>=0" v-html="$t('mxpcweb.workbench.1530675319308',[increaseThirtyCount])"></div>
                    <!-- 比上月减少<span class="text-red">{0}</span>个 -->
                    <div class="totalDesc" v-else v-html="$t('mxpcweb.workbench.1530678760971',[increaseThirtyCount.replace('-','')])"></div>
                </el-col>
                <el-col :span="8">
                    <div>{{transTotal}}</div>
                    <div class="total">
                        <!-- 成交客户总数 -->{{$t('mxpcweb.workbench.1530675176429')}}
                    </div>
                    <!-- 比上月增加<span class="text-red">{0}</span>个-->
                    <div class="totalDesc" v-if="increaseTransCount>=0" v-html="$t('mxpcweb.workbench.1530675319308',[increaseTransCount])"></div>
                    <!-- 比上月减少<span class="text-red">{0}</span>个 -->
                    <div class="totalDesc" v-else v-html="$t('mxpcweb.workbench.1530678760971',[increaseTransCount.replace('-','')])"></div>
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
    name: 'Remind',
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
            transTotal: 0,
            willInSeasCount: 0,
            startId: 3,
            bindClass: '',
            ctId: 0
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
            this.getRemindData()
        }
    },
    mounted() { },
    methods: {
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
            data.argument.ownerCtId = this.ctId
            _this.toClient_g(data)
        },
        getRemindData() {
            let _this = this
            var url = _this.Global.baseURL + _this.Global.api.v2.stat_pers_get
            _this.$http.get(url, { params: { statId: this.startId, staffId: this.ctId } }).then(
                (res) => {
                    if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data)) {
                        // console.log(res.body.data);
                        var objectResults = res.body.data.objectResults
                        if (objectResults) {
                            if (objectResults.custCount != undefined) {
                                this.custCount = objectResults.custCount
                            }

                            if (objectResults.fifteenNotCount) {
                                this.fifteenNotCount = objectResults.fifteenNotCount
                            }

                            if (objectResults.increaseCustCount) {
                                this.increaseCustCount = objectResults.increaseCustCount
                            }
                            if (objectResults.increaseThirtyCount) {
                                this.increaseThirtyCount = objectResults.increaseThirtyCount
                            }

                            if (objectResults.increaseTransCount) {
                                this.increaseTransCount = objectResults.increaseTransCount
                            }

                            if (objectResults.thirtyCount) {
                                this.thirtyCount = objectResults.thirtyCount
                            }
                            if (objectResults.thirtyNotCount) {
                                this.thirtyNotCount = objectResults.thirtyNotCount
                            }
                            if (objectResults.transTotal) {
                                this.transTotal = objectResults.transTotal
                            }
                            if (objectResults.willInSeasCount) {
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
        }
    },
    components: {}
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
