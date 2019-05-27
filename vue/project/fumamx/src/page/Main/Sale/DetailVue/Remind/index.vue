<template>
    <div class="Remind">
        <loading v-if="isLoading" style="margin-top: 55px;"></loading>
        <!-- 暂无提醒 -->
        <nodata v-if="!isLoading && msglist.length === 0" :title="$t('mxpcweb.client.detail.1529998811228')" img="noDate"></nodata>
        <template v-if="msglist.length > 0">
            <div class="listWrap" v-for="(item,index) in msglist" :key="index">
                <div class="date">{{ item.date }}</div>
                <ul class="listBox">
                    <template v-for="(item2,index2) in item.group">

                        <li :key="index2" v-if="item2.msgBody != undefined">
                            <span class="time">{{dateConver(item2.deliveryTime)}}</span>

                            <span class="describe">
                                <!-- 提醒 -->
                                <span>【{{$t('mxpcweb.client.detail.1529998862595')}}】</span>{{item2.msgBody}}
                            </span>

                            <div class="operation">
                                <!-- 延时 -->
                                <span :title="$t('mxpcweb.client.detail.1529998909130')" @click="delayMsgClick(item2)">
                                    <i class="iconfont icon-time-solid"></i>
                                </span>
                                <!-- 删除 -->
                                <span :title="$t('mxpcweb.client.detail.1529993888369')" @click="deleteMsgClick(item2)">
                                    <i class="iconfont icon-del"></i>
                                </span>
                            </div>
                        </li>

                        <li :key="index2" v-else>
                            <span class="time">{{dateConver(item2.deliveryTime)}}</span>
                            <span class="describe" v-if="item2.body != undefined">
                                <!-- 日程 -->
                                <span>【{{$t('mxpcweb.client.detail.1529998976652')}}】</span>{{item2.body.msgBody}}
                            </span>

                            <div class="operation">
                                <!-- 延时 -->
                                <span :title="$t('mxpcweb.client.detail.1529998909130')">
                                    <i class="iconfont icon-time-solid" @click="delayMsgClick(item2)"></i>
                                </span>
                                <!-- 删除 -->
                                <span :title="$t('mxpcweb.client.detail.1529993888369')">
                                    <i class="iconfont icon-del" @click="deleteScheduleClick(item2)"></i>
                                </span>
                            </div>
                        </li>

                    </template>
                </ul>
            </div>
        </template>
        <!-- 选择延时发送时间 -->
        <el-dialog v-dialogDrag :title="$t('mxpcweb.client.detail.1529999128877')" :visible.sync="dialogVisible" custom-class="width420" :modal-append-to-body="false">
            <!-- 请填写提醒时间 -->
            <el-date-picker v-model="delayTime" type="datetime" format="yyyy-MM-dd HH:mm" :placeholder="$t('mxpcweb.client.detail.1529999250820')" align="center" :picker-options="remindTimeOptions" style="width:100%;"></el-date-picker>
            <span slot="footer" class="dialog-footer">
                <!--取消  -->
                <el-button @click="dialogVisible = false">{{$t('mxpcweb.client.detail.1529994393355')}}</el-button>
                <!-- 确定 -->
                <el-button type="primary" @click="submitClick">{{$t('mxpcweb.client.detail.1529994368552')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
/**
 * 单据详情
 * 作者：向士健
 * 时间：2018/01/30
 * */
import NoData from '@/basecomponents/NoData/index'
import Loading from '@/basecomponents/Loading/index'
export default {
    name: 'Remind',
    props: {
        itemId: {
            type: String,
            default: ''
        },
        moduleCode: {
            type: String,
            default: ''
        },
        activeName: {
            type: String,
            default: ''
        },
        itemActive: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isLoading: true,
            msglist: [],

            dialogVisible: false,

            delayTime: '',
            actionItem: null,
            remindTimeOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7
                },
                shortcuts: [{
                    /* 明天 */
                    text: this.$t('mxpcweb.client.detail.1529999500604'),
                    onClick(picker) {
                        const date = new Date()
                        date.setTime(date.getTime() + 3600 * 1000 * 24 * 1)
                        picker.$emit('pick', date)
                    }
                }, {
                    /* 后天 */
                    text: this.$t('mxpcweb.client.detail.1529999532442'),
                    onClick(picker) {
                        const date = new Date()
                        date.setTime(date.getTime() + 3600 * 1000 * 24 * 2)
                        picker.$emit('pick', date)
                    }
                }, {
                    /* 一周后 */
                    text: this.$t('mxpcweb.client.detail.1529999559124'),
                    onClick(picker) {
                        const date = new Date()
                        date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', date)
                    }
                }]
            }
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
        // 取数据
        getTabData() {
            var p0 = new Promise((resolve, reject) => {
                let data = {
                    type: 'unHandleList',
                    sort: 'deliveryTime',
                    billId: this.itemId,
                    moduleCode: this.moduleCode,
                    order: 'desc'
                }
                this.$http.get(this.Global.baseURL + this.Global.api.v2.message_get, { params: data }).then((res) => {
                    if (res.body.code.toString() === this.Global.RES_OK && res.body.data) {
                        resolve(res.body.data)
                    }
                }, (res) => {
                    this.$message.error(this.msg(res.body))
                })
            })
            var p1 = new Promise((resolve, reject) => {
                let data = {
                    sort: 'deliveryTime',
                    billId: this.itemId,
                    moduleCode: this.moduleCode,
                    order: 'desc'
                }
                this.$http.get(this.Global.baseURL + this.Global.api.v2.messenger_get, { params: data }).then((res) => {
                    if (res.body.code.toString() === this.Global.RES_OK && res.body.data) {
                        resolve(res.body.data)
                    }
                }, (res) => {
                    this.$message.error(this.msg(res.body))
                })
            })
            Promise.all([p0, p1]).then((results) => {
                this.isLoading = false
                // console.log(' ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ')
                // console.log(results)
                // console.log(' ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ')
                // 组织格式化数据到页面
                let backData = results[0].messageRecordList.concat(results[1].timingTaskList)

                let arrGroup = []
                backData.forEach((item) => {
                    if (arrGroup.indexOf(this.timeShow_custom(item.deliveryTime, 'YYYY-MM-DD')) == -1) {
                        arrGroup.push(this.timeShow_custom(item.deliveryTime, 'YYYY-MM-DD'))
                    }
                })
                let newBackData = []
                arrGroup.forEach((item) => {
                    let group = []
                    backData.forEach((item2) => {
                        if (item == this.timeShow_custom(item2.deliveryTime, 'YYYY-MM-DD')) {
                            group.push(item2)
                        }
                    })
                    newBackData.push({
                        date: item,
                        group: group
                    })
                })
                this.msglist = newBackData
            })
        },
        // 删除日程点击
        deleteScheduleClick(item) {
            /* 此操作将删除该【日程】, 是否继续? */
            let c = this.$t('mxpcweb.client.detail.1529999678163')
            /* 提示 */
            let t = this.$t('mxpcweb.client.detail.1529994349587')
            /* 确定 */
            let s = this.$t('mxpcweb.client.detail.1529994368552')
            /* 取消 */
            let n = this.$t('mxpcweb.client.detail.1529994393355')
            this.$confirm(c, t, {
                confirmButtonText: s,
                cancelButtonText: n,
                type: 'warning'
            }).then(() => {
                this.$http.delete(this.Global.baseURL + this.Global.api.v2.messenger_delete, { params: { jobName: item.jobName } }).then((res) => {
                    if (res.body.code.toString() === this.Global.RES_OK) {
                        this.$message.success(this.msg(res.body))
                        this.getTabData()
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                }, (res) => {
                    this.$message.error(this.msg(res.body))
                })
            }).catch(() => { })
        },
        // 日期格式转换
        dateConver(val) {
            return this.timeShow_custom(val, 'HH:mm')
        },
        // 提交延时设置
        submitClick() {
            // console.log(this.actionItem);
            if (this.delayTime == '') {
                /* 请选择时间！ */
                this.$message(this.$t('mxpcweb.client.detail.1529999818509'))
                return
            }
            /**
             * 判断是提醒，还是日程，没有this.actionItem.body 即为提醒时：
             * */
            if (this.actionItem.body == undefined) {
                let data = {
                    msgId: this.actionItem.msgId,
                    type: 'delay',
                    deliveryTime: this.$m_unifiedTime(this.delayTime),
                    sourceId: 'pc'
                }
                this.messagePut(data)
            } else {
                this.delaySchedule()
            }
        },
        // 延时日程
        delaySchedule() {
            let data = {
                jobName: this.actionItem.jobName,
                deliveryTime: this.$m_unifiedTime(this.delayTime)
            }
            this.$http.put(this.Global.baseURL + this.Global.api.v2.messenger_put, data).then((res) => {
                if (res.body.code.toString() === this.Global.RES_OK) {
                    this.dialogVisible = false
                    this.$message.success(this.msg(res.body))
                    this.getTabData()
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                this.$message.error(this.msg(res.body))
            })
        },
        // 打开延时弹窗
        delayMsgClick(item) {
            this.dialogVisible = true
            this.actionItem = item // item
            this.delayTime = ''
        },
        // 删除这条提醒点击
        deleteMsgClick(item) {
            /* 此操作将删除该【提醒】, 是否继续? */
            let c = this.$t('mxpcweb.client.detail.1529999903172')
            /* 提示 */
            let t = this.$t('mxpcweb.client.detail.1529994349587')
            /* 确定 */
            let s = this.$t('mxpcweb.client.detail.1529994368552')
            /* 取消 */
            let n = this.$t('mxpcweb.client.detail.1529994393355')
            this.$confirm(c, t, {
                confirmButtonText: s,
                cancelButtonText: n,
                type: 'warning'
            }).then(() => {
                let data = {
                    msgId: item.msgId,
                    type: 'delete',
                    sourceId: 'pc'
                }
                this.messagePut(data)
            }).catch(() => { })
        },
        // 修改消息接口
        messagePut(data) {
            // console.log(data)
            this.$http.put(this.Global.baseURL + this.Global.api.v2.message_put, data).then((res) => {
                if (res.body.code.toString() === this.Global.RES_OK) {
                    this.dialogVisible = false
                    this.$message.success(this.msg(res.body))
                    this.getTabData()
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                this.$message.error(this.msg(res.body))
            })
        }
    },
    components: {
        'nodata': NoData,
        'loading': Loading
    },
    watch: {
        activeName(val) {
            if (val == this.itemActive) {
                this.getTabData()
            }
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
