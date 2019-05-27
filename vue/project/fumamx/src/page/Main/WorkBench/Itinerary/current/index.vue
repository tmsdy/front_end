<template>
    <div class="Current">
        <!-- 暂无待处理 -->
        <nodata v-show="isNodata" :title="$t('mxpcweb.workbench.1530673942550')" img="noDate" style="padding-top:15px;"></nodata>
        <ul class="moveList MXscroll" v-show="!isNodata" v-loading="isloading">
            <li v-for="(item,index) in list" :key="index" :class="item.readFlag == 0 ? 'newest' : ''">
                <div class="hoverBtn">
                    <span :title="$t('mxpcweb.components.1530839967303')">
                        <i class="iconfont icon-user-logs" @click="setDelayTime(item)"></i>
                    </span>
                    <span :title="$t('mxpcweb.systemset.bizfield.1530335441748')">
                        <i class="iconfont icon-del" @click="deleteItem(item,index)"></i>
                    </span>
                </div>
                <span class="pull-right">{{ judgeTime(item.deliveryTime) }}</span>
                <span class="text" :class="[item.msgSubType != 0 ? 'text-hover' : '']" @click="msgClick(item)">{{item.msgBody}}</span>
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
    name: 'Current',
    props: ['isshowData'],
    data() {
        return {
            isloading: false,
            isNodata: false,
            list: [],
            selectList: null,
            delayTimeDialogVisible: false,
            delayTime: '',
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
            pageN: 1, // 当前第几期
            pageSize: 20, // 每页多少条
            rowTotal: 0
        }
    },
    created() {
        this.getList()
    },
    computed: {
        ...mapGetters([
            'individualConfigInfo'
        ])
    },
    methods: {
        // 消息点击
        msgClick(item) {
            // console.log(item)
            let _this = this
            let data = {
                msgId: item.msgId,
                type: 'read',
                sourceId: 'pc'
            }
            _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.scheduleremind.messagePut, data).then((res) => {
                if (res.body.code.toString() === _this.Global.RES_OK) {
                    item.readFlag = 1
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.msg(res.body))
            })
            // 处理跳转
            this.msgJump(item) // 全局处理跳转
        },
        // 刷新列表，对外使用
        refreshList() {
            // 重置请求参数
            this.pageN = 1
            this.pageSize = 20
            this.getList()
        },
        // 获取列表
        getList() {
            let _this = this
            _this.isloading = true
            _this.isNodata = false
            _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.scheduleremind.messageGet, {
                params: {
                    type: 'unHandleList',
                    pageN: _this.pageN,
                    pageSize: _this.pageSize,
                    sort: 'deliveryTime',
                    order: 'desc'
                }
            }).then((res) => {
                if (res.body.code.toString() === _this.Global.RES_OK && isObject(res.body.data)) {
                    _this.isloading = false
                    if (isArray(res.body.data.messageRecordList)) {
                        // console.log(res.body.data.messageRecordList)
                        _this.list = res.body.data.messageRecordList
                        if (res.body.data.messageRecordList.length == 0) {
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
        // 点击延迟时间
        setDelayTime(item, index) {
            this.delayTimeDialogVisible = true
            this.selectList = item
            this.itemIndex = index
        },
        // 关闭对话框
        delayTimeDialogHandleClose() {
            this.delayTimeDialogVisible = false
            this.delayTime = ''
        },
        // 修改消息接口
        messagePut(data) {
            let _this = this
            _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.scheduleremind.messagePut, data).then((res) => {
                if (res.body.code.toString() === _this.Global.RES_OK) {
                    _this.$message.success(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.msg(res.body))
            })
        },
        // 更新延迟时间
        updateDelayTime() {
            let _this = this
            let delayTime = this.delayTime
            if (delayTime) {
                let data = {
                    msgId: this.selectList.msgId,
                    type: 'delay',
                    deliveryTime: _this.$m_unifiedTime(delayTime),
                    sourceId: 'pc'
                }
                _this.messagePut(data)
                _this.list.splice(_this.itemIndex, 1)
                if (_this.list.length == 0) {
                    _this.getList()
                }
            }
            _this.delayTimeDialogHandleClose()
        },
        // 关闭提醒
        closeItem(item, index) {
            let _this = this
            let {
                msgId
            } = item
            let data = {
                msgId: msgId,
                type: 'close',
                sourceId: 'pc'
            }
            _this.messagePut(data)
            _this.list.splice(index, 1)
            if (_this.list.length == 0) {
                _this.getList()
            }
        },
        // 删除提醒
        deleteItem(item, index) {
            let _this = this
            let data = {
                msgId: item.msgId,
                type: 'close',
                sourceId: 'pc'
            }
            _this.messagePut(data)
            _this.list.splice(index, 1)
            if (_this.list.length == 0) {
                _this.getList()
            }
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
