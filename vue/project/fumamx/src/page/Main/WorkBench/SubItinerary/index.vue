<template>
    <div class="dashboardBox SubItinerary" v-bind:class='bindClass'>
        <div class="workTitle">
            <span class="pull-right">
                <ul class="tabWrap">
                    <li @click="changeItineraryType($event,1)" :class="activeIndex == 1 ? 'active':''">
                        <span>
                            <!-- 待处理 -->{{$t('mxpcweb.workbench.1530673362989')}}
                        </span>
                    </li>
                    <li @click="changeItineraryType($event,2)" :class="activeIndex == 2 ? 'active':''">
                        <span>
                            <!-- 日程 -->{{$t('mxpcweb.workbench.1530673375515')}}
                        </span>
                    </li>
                </ul>
            </span>
            <span class="name">{{this.pannelName}}</span>
        </div>
        <div class="workBody">
            <ul class="moveList MXscroll" v-loading="isload" v-show="!isNoData">
                <li v-for="(item,index) in list" :key="index" v-bind:class="{'newest':index==0}">
                    <span class="pull-right" style="display:block;">{{judgeTime(item.deliveryTime)}}</span>
                    <span class="descr" v-if="activeIndex==1 && item.msgBody!=undefined">{{substrByLen(item.msgBody,50)}}</span>
                    <span class="descr" v-if="activeIndex==2 && item.body.msgBody!=undefined">{{substrByLen(item.body.msgBody,50)}}</span>
                </li>
            </ul>
            <!-- 暂无数据 -->
            <nodata v-show="isNoData" :title="$t('mxpcweb.workbench.1530682446647')" style="padding-top:15px;"></nodata>
        </div>
    </div>
</template>

<script>
import { isObject, isArray } from '@/libs/utils'
import { mapGetters } from 'vuex'
import NoData from '@/basecomponents/NoData/index'
export default {
    name: 'Itinerary',
    props: ['data'],
    data() {
        return {
            region: this.$t('mxpcweb.workbench.1530672871996'),
            isload: false,
            isNoData: false,
            pannelName: '',
            pageN: 1,
            pageSize: 5,
            startEndDate: {},
            list: [],
            rowTotal: 0,
            delayTimeDialogVisible: false,
            selectList: null,
            delayTime: '',
            bindClass: '',
            ctId: 0,
            activeIndex: 1,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7
                },
                shortcuts: [
                    {
                        /* '明天' */
                        text: this.$t('mxpcweb.workbench.1530673462060'),
                        onClick(picker) {
                            const date = new Date()
                            date.setTime(date.getTime() + 3600 * 1000 * 24 * 1)
                            picker.$emit('pick', date)
                        }
                    },
                    {
                        /* '后天' */
                        text: this.$t('mxpcweb.workbench.1530673476541'),
                        onClick(picker) {
                            const date = new Date()
                            date.setTime(date.getTime() + 3600 * 1000 * 24 * 2)
                            picker.$emit('pick', date)
                        }
                    },
                    {
                        /* '一周后' */
                        text: this.$t('mxpcweb.workbench.1530673488255'),
                        onClick(picker) {
                            const date = new Date()
                            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
                            picker.$emit('pick', date)
                        }
                    }
                ]
            }
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
        }
        this.getRemindList(1)
    },
    computed: {
        ...mapGetters(['individualConfigInfo'])
    },
    mounted() { },
    methods: {
        judgeTime(time) {
            return this.$m_formulateTime(time)
        },
        // 字符串截取
        substrByLen(str, leng) {
            if (str == undefined) {
                return ''
            }
            if (str.length > leng) {
                var i = leng
                while (str.length > leng) {
                    i--
                    str = str.substring(0, i)
                }
                str = str + '...'
            }
            return str
        },
        getRemindList(type) {
            let _this = this
            _this.pageN = 1
            _this.pageSize = 5
            _this.isload = true
            _this.isNoData = false
            _this.$http
                .get(
                    _this.Global.baseURL +
                    _this.Global.api.SystemSet.scheduleremind.messageGet,
                    {
                        params: {
                            type: 'unHandleList',
                            targetCtId: _this.ctId,
                            pageN: _this.pageN,
                            pageSize: _this.pageSize,
                            sort: 'deliveryTime',
                            order: 'desc'
                        }
                    }
                )
                .then(
                    (res) => {
                        if (res.body.code.toString() === _this.Global.RES_OK && isObject(res.body.data)) {
                            _this.isload = false
                            if (isArray(res.body.data.messageRecordList)) {
                                _this.list = res.body.data.messageRecordList
                                if (res.body.data.messageRecordList.length == 0) {
                                    _this.isNoData = true
                                    return
                                } else {
                                    _this.isNoData = false
                                }
                            } else {
                                _this.isNoData = false
                            }
                            _this.activeIndex = type
                            _this.rowTotal = res.body.data.rowTotal
                        }
                    },
                    (res) => {
                        _this.$message.error(_this.msg(res.body))
                    }
                )
        },
        getItineraryData(type) {
            let _this = this
            _this.pageN = 1
            _this.pageSize = 5
            _this.isload = true
            _this.isNoData = false
            const start = new Date()
            const end = new Date()
            // let startEndDate = {}

            let day = new Date(start.getFullYear(), start.getMonth() + 1, 0)
            let daycount = day.getDate() // 获取本月天数
            end.setTime(
                start.getTime() + 3600 * 1000 * 24 * (daycount - start.getDate())
            )
            // startEndDate = {
            //   startDate: unifiedTime(start),
            //   endDate:
            //     unifiedTime(end, {
            //       format: 'YYYY-MM-DD'
            //     }) + ' 23:59:59'
            // }

            let params = Object.assign(_this.startEndDate, {
                targetCtId: _this.ctId,
                pageN: _this.pageN,
                pageSize: _this.pageSize
            })
            _this.$http
                .get(
                    _this.Global.baseURL +
                    _this.Global.api.SystemSet.scheduleremind.messengerGet,
                    {
                        params: params
                    }
                )
                .then(
                    (res) => {
                        if (res.body.code.toString() === _this.Global.RES_OK && isObject(res.body.data)) {
                            if (isArray(res.body.data.timingTaskList)) {
                                if (res.body.data.timingTaskList.length == 0) {
                                    _this.isNoData = true
                                    return
                                } else {
                                    _this.isNoData = false
                                    _this.list = res.body.data.timingTaskList
                                }
                            } else {
                                _this.isNoData = true
                                return
                            }
                            _this.activeIndex = type
                            _this.rowTotal = res.body.data.rowTotal
                            _this.isload = false
                        }
                    },
                    (res) => {
                        _this.isload = false
                        _this.$message.error(_this.msg(res.body))
                    }
                )
        },
        changeItineraryType(event, type) {
            this.isload = true
            var target = event.currentTarget
            var element = $(target)
            element.parents('ul').find('li').removeClass('active')
            element.addClass('active')
            if (type == '1') {
                this.getRemindList(type)
            } else {
                this.getItineraryData(type)
            }
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
