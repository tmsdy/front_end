<template>
    <div class="Schedule">
        <!-- 暂无日程  -->
        <nodata v-show="isNodata" :title="$t('mxpcweb.workbench.1530673545781')" img="noDate" style="padding-top:15px;"></nodata>
        <ul class="moveList MXscroll" v-show="!isNodata" v-loading="isloading">
            <li v-for="(item,index) in list" :key="index">

                <div class="hoverBtn">
                    <span :title="$t('mxpcweb.components.1530839967303')">
                        <i class="iconfont icon-time" @click="setDelayTime(item)"></i>
                    </span>
                    <span :title="$t('mxpcweb.client.detail.1529998142058')">
                        <i class="iconfont icon-close-bold" @click="deleteSchedule(item,index)"></i>
                    </span>
                </div>
                <span class="pull-right">{{ judgeTime(item.deliveryTime) }}</span>
                <span class="text" :class="[item.msgSubType != 0 ? 'text-hover' : '']" @click="msgClick(item)">{{item.body.msgBody}}</span>
            </li>
        </ul>
        <!-- 选择延迟时间 -->
        <el-dialog :title="$t('mxpcweb.workbench.1530673572243')" :visible.sync="delayTimeDialogVisible" size="tiny" :before-close="delayTimeDialogHandleClose">
            <!-- 选择日期时间 -->
            <el-date-picker v-model="delayTime" type="datetime" :placeholder="$t('mxpcweb.workbench.1530673610787')" align="right" :picker-options="pickerOptions" :format="individualConfigInfo.dateFormat+' '+individualConfigInfo.timeFormat" style="width:100%;"></el-date-picker>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateDelayTime()">
                    <!-- 确 定 -->{{$t('mxpcweb.workbench.1530673625277')}}
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isObject, isArray } from '@/libs/utils'
import NoData from '@/basecomponents/NoData/index'
export default {
    name: 'Schedule',
    props: {},
    data() {
        return {
            isshowData: false,
            selectType: 5, // 默认选择的类型
            screenDate: [], // 日程筛选
            screenDateOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7
                },
                shortcuts: [{
                    /* '最近一周' */
                    text: this.$t('mxpcweb.workbench.1530673756492'),
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        end.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    /* '最近一个月' */
                    text: this.$t('mxpcweb.workbench.1530673769146'),
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        end.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    /* '最近三个月' */
                    text: this.$t('mxpcweb.workbench.1530673780276'),
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        end.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                        picker.$emit('pick', [start, end])
                    }
                }]
            },
            isloading: false,
            isNodata: false,
            list: [],
            selectList: null,
            delayTime: '',
            delayTimeDialogVisible: false,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7
                },
                shortcuts: [{
                    /* '明天' */
                    text: this.$t('mxpcweb.workbench.1530673462060'),
                    onClick(picker) {
                        const date = new Date()
                        date.setTime(date.getTime() + 3600 * 1000 * 24 * 1)
                        picker.$emit('pick', date)
                    }
                }, {
                    /* '后天' */
                    text: this.$t('mxpcweb.workbench.1530673476541'),
                    onClick(picker) {
                        const date = new Date()
                        date.setTime(date.getTime() + 3600 * 1000 * 24 * 2)
                        picker.$emit('pick', date)
                    }
                }, {
                    /* '一周后' */
                    text: this.$t('mxpcweb.workbench.1530673488255'),
                    onClick(picker) {
                        const date = new Date()
                        date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', date)
                    }
                }]
            },
            startEndDate: {},
            pageN: 1, // 当前第几期
            pageSize: 20, // 每页多少条
            rowTotal: 0
        }
    },
    created() {
        this.operation(5)
    },
    computed: {
        ...mapGetters([
            'individualConfigInfo'
        ])
    },
    methods: {
        // 消息点击
        msgClick(item) {
            console.log(item)
            // 处理跳转
            this.msgJump(item) // 全局处理跳转
        },
        // 刷新列表，对外使用
        refreshList() {
            // 重置请求参数
            this.selectType = 5
            this.screenDate = []
            this.startEndDate = {}
            this.pageN = 1
            this.pageSize = 20
            this.getList()
        },
        // 获取日程列表
        getList() {
            if (this.isshowData == false) {
                return
            }
            let _this = this
            _this.isloading = true
            _this.isNodata = false
            let params = Object.assign(_this.startEndDate, {
                pageN: _this.pageN,
                pageSize: _this.pageSize,
                sort: 'deliveryTime',
                order: 'asc'
            })
            _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.scheduleremind.messengerGet, {
                params: params
            }).then((res) => {
                if (res.body.code.toString() === _this.Global.RES_OK && isObject(res.body.data)) {
                    if (isArray(res.body.data.timingTaskList)) {
                        // console.log(res.body.data)
                        _this.list = res.body.data.timingTaskList
                        _this.isloading = false
                        if (res.body.data.timingTaskList.length == 0) {
                            _this.isNodata = true
                        } else {
                            _this.isNodata = false
                        }
                    }
                    _this.rowTotal = res.body.data.rowTotal
                } else {
                    _this.isloading = false
                    _this.isNodata = true
                    _this.$message.error(res.data.msg)
                }
            }, (res) => {
                _this.$message.error(_this.msg(res.body))
            })
        },
        // 日历自定义范围查询
        screenDateEvent() {
            let _this = this
            this.startEndDate = {
                startDate: _this.$m_unifiedTime(_this.screenDate[0]),
                endDate: _this.$m_unifiedTime(_this.screenDate[1])
            }
            this.getList()
        },
        // 点击表头查询
        operation(type) {
            this.selectType = type
            const start = new Date()
            const end = new Date()
            let startEndDate = {}
            if (type == 1) { // 明天
                end.setTime(start.getTime() + 3600 * 1000 * 24 * 1)
                startEndDate = {
                    startDate: _this.$m_unifiedTime(start),
                    endDate: _this.$m_unifiedTime(end, {
                        format: 'YYYY-MM-DD'
                    }) + ' 23:59:59'
                }
            } else if (type == 2) { // 后天
                end.setTime(start.getTime() + 3600 * 1000 * 24 * 2)
                startEndDate = {
                    startDate: _this.$m_unifiedTime(start),
                    endDate: _this.$m_unifiedTime(end, {
                        format: 'YYYY-MM-DD'
                    }) + ' 23:59:59'
                }
            } else if (type == 3) { // 本周
                end.setTime(start.getTime() + 3600 * 1000 * 24 * (6 - end.getDay()))
                startEndDate = {
                    startDate: _this.$m_unifiedTime(start),
                    endDate: _this.$m_unifiedTime(end, {
                        format: 'YYYY-MM-DD'
                    }) + ' 23:59:59'
                }
            } else if (type == 4) { // 本月
                let day = new Date(start.getFullYear(), start.getMonth() + 1, 0)
                let daycount = day.getDate() // 获取本月天数
                end.setTime(start.getTime() + 3600 * 1000 * 24 * (daycount - start.getDate()))
                startEndDate = {
                    startDate: _this.$m_unifiedTime(start),
                    endDate: _this.$m_unifiedTime(end, {
                        format: 'YYYY-MM-DD'
                    }) + ' 23:59:59'
                }
            } else if (type == 5) { // 全部
                startEndDate = {}
            }
            this.startEndDate = startEndDate
            this.getList()
        },
        // 点击延迟按钮
        setDelayTime(item) {
            this.delayTimeDialogVisible = true
            this.selectList = item
        },
        // 关闭延迟对话框
        delayTimeDialogHandleClose() {
            this.delayTimeDialogVisible = false
            this.delayTime = ''
        },
        // 修改日程
        updateDelayTime() {
            let _this = this
            if (this.delayTime == '') {
                /* 请选择推迟的日期！ */
                _this.$message.error(this.$t('mxpcweb.workbench.1530673865373'))
                return
            }
            let {
                jobName
            } = this.selectList
            let delayTime = _this.$m_unifiedTime(this.delayTime)
            let data = {
                jobName: jobName,
                deliveryTime: delayTime
            }
            _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.scheduleremind.messengerPut, data).then((res) => {
                if (res.body.code.toString() === _this.Global.RES_OK) {
                    _this.$message(_this.msg(res.body))
                    _this.getList()
                    _this.delayTimeDialogHandleClose()
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.msg(res.body))
            })
        },
        // 删除日程
        deleteSchedule(item, index) {
            let _this = this
            // 删除成功，刷新列表
            _this.list.splice(index, 1)
            let {
                jobName
            } = item
            let data = {
                jobName: jobName
            }
            _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.scheduleremind.messengerDelete, data).then((res) => {
                if (res.body.code.toString() === _this.Global.RES_OK) {
                    if (_this.list.length == 0) {
                        _this.getList()
                    }
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.msg(res.body))
            })
        },
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.pageSize = val
            this.getList()
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.pageN = val
            this.getList()
        },
        judgeTime(time) {
            return this.$m_formulateTime(time)
        }
    },
    components: {
        'nodata': NoData
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
