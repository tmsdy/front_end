<template>
    <div class="CycleTime">
        <!-- 发送周期设置 -->
        <el-dialog :close-on-click-modal="false" :title="$t('mxpcweb.am.1531900119032')" v-dialogDrag :visible.sync="cycleTimeDialog" custom-class="width620" :before-close="closeCycleTime" class="addRemindDialog" :modal-append-to-body="false">
            <template v-if="cycleTimeDialog">
                <el-tabs type="card" v-model="tabValue" @tab-click="handleClick">
                    <!-- 每天 -->
                    <el-tab-pane :label="$t('mxpcweb.am.1531900110152')" name="everyday">
                        <!-- 选择每天的时间 -->
                        <el-time-select v-model="value1Time" clearable :picker-options="{
                                start: '00:00',
                                step: '00:15',
                                end: '23:00'
                            }" @change="change1" :placeholder="$t('mxpcweb.am.1531900124824')" style="width:100%">
                        </el-time-select>
                    </el-tab-pane>
                    <!-- 每周 -->
                    <el-tab-pane :label="$t('mxpcweb.am.1531900125000')" name="weekly">
                        <div class="weekList">
                            <!-- 星期一
                            星期二
                            星期三
                            星期四
                            星期五
                            星期六
                            星期日 -->
                            <el-radio class="radio" v-model="radio" :label="2">{{$t('mxpcweb.am.1531899914414')}}</el-radio>
                            <el-radio class="radio" v-model="radio" :label="3">{{$t('mxpcweb.am.1531899919352')}}</el-radio>
                            <el-radio class="radio" v-model="radio" :label="4">{{$t('mxpcweb.am.1531899919696')}}</el-radio>
                            <el-radio class="radio" v-model="radio" :label="5">{{$t('mxpcweb.am.1531899920064')}}</el-radio>
                            <el-radio class="radio" v-model="radio" :label="6">{{$t('mxpcweb.am.1531899920888')}}</el-radio>
                            <el-radio class="radio" v-model="radio" :label="7">{{$t('mxpcweb.am.1531899921696')}}</el-radio>
                            <el-radio class="radio" v-model="radio" :label="1">{{$t('mxpcweb.am.1531899922192')}}</el-radio>
                        </div>
                        <!-- 选择每周的时间 -->
                        <el-time-select v-model="value2Time" clearable :picker-options="{
                                start: '00:00',
                                step: '00:15',
                                end: '23:00'
                            }" @change="change2" :placeholder="$t('mxpcweb.am.1531900133417')" style="width:100%">
                        </el-time-select>
                    </el-tab-pane>
                    <!-- 每月 -->
                    <el-tab-pane :label="$t('mxpcweb.am.1531900145370')" name="monthly">
                        <!-- 选择每月的时间 -->
                        <el-date-picker type="datetime" v-model="value3Time" clearable format="dd HH:mm" :placeholder="$t('mxpcweb.am.1531900145624')" @change="change3" style="width:100%">
                        </el-date-picker>
                    </el-tab-pane>
                </el-tabs>
                <div class="weekList">
                    <!-- 选择此周期的结束时间 -->
                    <el-date-picker clearable v-model="endValue" @change="change4" class="formItemInput" type="datetime" :placeholder="$t('mxpcweb.am.1531900155687')" format="yyyy-MM-dd HH:mm" style="width:100%;">
                    </el-date-picker>
                </div>
            </template>
            <div class="footBox text-center">
                <!-- 取 消 -->
                <el-button @click="cycleTimeDialog = false">{{$t('mxpcweb.am.1531900155919')}}</el-button>
                <!-- 保 存 -->
                <el-button type="primary" :loading="submitLoading" @click="submitForm()">{{$t('mxpcweb.am.1531900168144')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'CycleTime',
    props: {
        sendTime: { // 表达式
            type: String,
            default: ''
        },
        sendTimeBase: { // 几点
            type: String,
            default: ''
        },
        cycleTitle: {
            type: String,
            default: ''
        },
        cycleType: {// 日/周/月
            type: String,
            default: ''
        },
        cycleEndTime: {// 结束时间
            type: String,
            default: ''
        }
    },
    data() {
        return {
            cycleTimeDialog: false,
            value1Time: '',
            value2Time: '',
            value3Time: '',
            value1: '',
            value2: '',
            value3: '',
            radio: 2,
            endTime: '',
            endValue: '',
            tabValue: 'everyday',
            // 星期日
            // 星期一
            // 星期二
            // 星期三
            // 星期四
            // 星期五
            // 星期六
            weekData: ['', this.$t('mxpcweb.am.1531899922192'), this.$t('mxpcweb.am.1531899914414'), this.$t('mxpcweb.am.1531899919352'), this.$t('mxpcweb.am.1531899919696'), this.$t('mxpcweb.am.1531899920064'), this.$t('mxpcweb.am.1531899920888'), this.$t('mxpcweb.am.1531899921696')],
            submitLoading: false
        }
    },
    methods: {
        showDialog() {
            if (this.cycleType == 'everyday') {
                this.tabValue = this.cycleType
                this.value1Time = this.sendTimeBase
                this.value1 = this.sendTimeBase
            } else if (this.cycleType == 'monthly') {
                this.tabValue = this.cycleType
                this.value3Time = this.sendTimeBase
                this.value3 = this.sendTimeBase
            } else {
                this.tabValue = 'weekly'
                this.value2Time = this.sendTimeBase
                this.value2 = this.sendTimeBase
                this.radio = parseInt(this.cycleType)
            }
            this.endValue = this.cycleEndTime
            this.endTime = this.cycleEndTime
            this.cycleTimeDialog = true
        },
        submitForm() {
            let sendTime = ''
            let sendTimeBase = ''
            let cycleTitle = ''
            let weekly = ''
            this.submitLoading = true
            if (this.tabValue == 'everyday') {
                if (this.value1 == '') {
                    // 请选择每天的时间
                    this.$message(this.$t('mxpcweb.am.1531900190096'))
                    this.submitLoading = false
                    return false
                }
                // console.log(this.value1)
                let times = new Date('2018/06/01 ' + this.value1)
                // console.log(times)
                // let tt = new Date('2018/06/01 ' + this.value1)
                // console.log(this.$moment(new Date('2018/06/01 ' + this.value1)))
                let timeMin = times.getMinutes()
                let timeHour = times.getHours()
                // console.log(timeHour)
                sendTime = '0 ' + timeMin + ' ' + timeHour + ' * * ? *'
                // console.log(sendTime)
                // 每天
                cycleTitle = this.$t('mxpcweb.am.1531900110152') + this.value1
                sendTimeBase = this.value1
            } else if (this.tabValue == 'weekly') {
                if (this.value2 == '') {
                    // 请选择每周的时间
                    this.$message(this.$t('mxpcweb.am.1531900204337'))
                    this.submitLoading = false
                    return false
                }
                let times = new Date('2018/06/10 ' + this.value2) // this.$moment(new Date('2018/06/10 ' + this.value2)).utc()
                let timeMin = times.getMinutes()
                let timeHour = times.getHours()
                let weekDate = (this.radio + parseInt(times.getDate()) - 10) % 7
                if (weekDate == 0) {
                    weekDate = 7
                }
                weekly = weekDate
                sendTime = '0 ' + timeMin + ' ' + timeHour + ' ? * ' + weekDate
                // 每周
                cycleTitle = this.$t('mxpcweb.am.1531900125000') + this.weekData[this.radio] + this.value2
                sendTimeBase = this.value2
            } else if (this.tabValue == 'monthly') {
                if (this.value3 == '') {
                    // 请选择每月的时间
                    this.$message(this.$t('mxpcweb.am.1531900221208'))
                    this.submitLoading = false
                    return false
                }
                let times = new Date(this.value3.toSlash())// this.$moment(new Date(this.value3.toSlash())).utc()
                let timeMin = times.getMinutes()
                let timeHour = times.getHours()
                let timeDate = times.getDate()
                sendTime = '0 ' + timeMin + ' ' + timeHour + ' ' + timeDate + ' * ? * '
                // 每月
                cycleTitle = this.$t('mxpcweb.am.1531900145370') + this.value3
                sendTimeBase = this.value3
            }
            if (this.endTime == '') {
                // 请选择周期的结束时间
                this.$message(this.$t('mxpcweb.am.1531900227713'))
                this.submitLoading = false
                return false
            }
            this.$emit('update:cycleEndTime', this.endTime)
            this.$emit('update:sendTimeBase', sendTimeBase)
            this.$emit('update:sendTime', sendTime)
            this.$emit('update:cycleTitle', cycleTitle)
            let tabValue = this.tabValue
            if (tabValue == 'weekly') {
                this.$emit('update:cycleTypeBase', this.radio + tabValue)
                tabValue = weekly + tabValue
                this.submitLoading = false
                this.$emit('update:cycleType', tabValue)
            } else {
                this.submitLoading = false
                this.$emit('update:cycleType', tabValue)
            }
            this.cycleTimeDialog = false
        },
        change1(val) {
            this.value1 = val
        },
        change2(val) {
            this.value2 = val
        },
        change3(val) {
            this.value3 = '2018-06-' + val
        },
        change4(val) {
            this.endTime = val
        },
        closeCycleTime() {
            this.cycleTimeDialog = false
        },
        handleClick(val) {

        }
    },
    components: {
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.CycleTime {
    .weekList {
        padding: 20px 0;
    }
    .footBox {
        margin-top: 20px;
    }
}
</style>
