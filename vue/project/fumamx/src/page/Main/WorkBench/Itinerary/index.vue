<template>
  <div class="dashboardBox Itinerary" v-bind:class='bindClass'>
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
        <span @click="toRemind()" class="remind">
          <i class="iconfont icon-plus-file"></i>
          <span>
            <!-- 提醒 -->{{$t('mxpcweb.workbench.1530673385973')}}
          </span>
        </span>
      </span>
      <span class="name">{{this.pannelName}}</span>
    </div>
    <div class="workBody">
      <current v-show="showUnHandle" :isshowData="showUnHandle" ref="current"></current>
      <schedule v-show="showReminder" :isshowData="showReminder" ref="schedule"></schedule>
    </div>
    <!--设置提醒-->
    <add-msg ref="addMsg" @addMsgSuccess="addMsgSuccess"></add-msg>
  </div>
</template>

<script>
import { isObject, isArray } from '@/libs/utils'
import { mapGetters } from 'vuex'

import Current from './current/index'
import Schedule from './Schedule/index'
import AddMsg from '@/components/AddMsg/index'

export default {
  name: 'Itinerary',
  props: ['data'],
  data() {
    return {
      showUnHandle: true,
      showReminder: false,
      /* '本周' */
      region: this.$t('mxpcweb.workbench.1530672871996'),
      isload: false,
      isUnHandle: false,
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
      NoDataCss: 'NoDataCss',
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
  },
  computed: {
    ...mapGetters(['individualConfigInfo'])
  },
  mounted() {
    if (this.data.length > 0) {
      this.pannelName = this.data[0].statname
      this.ctId = this.data[0].ctId
      if (this.data[0].index == '1') {
        this.bindClass = 'rightmargin'
      } else {
        this.bindClass = 'leftmargin'
      }
    }

    // 刷新数据
    ep.tail('refreshScheduleRemindListWorkbench', () => {
      this.$refs.current.refreshList()
    })
  },
  methods: {
    // 添加消息成功回调
    addMsgSuccess() {
      this.activeIndex = 2 // 日程高亮
      // this.$refs['schedule'].isshowData = true
      // this.$refs.schedule.refreshList() // 刷新日程提醒列表

      this.showReminder = true
        this.showUnHandle = false
        this.$refs['schedule'].isshowData = true
        this.$refs['schedule'].refreshList()
    },
    toRemind() {
      this.$refs['addMsg'].showDialog()
    },

    getUnHandleList() {
      let _this = this
      _this.pageN = 1
      _this.pageSize = 5
      _this.isload = true
      _this.isNoData = false
      _this.isUnHandle = false
      _this.$http
        .get(
          _this.Global.baseURL +
          _this.Global.api.SystemSet.scheduleremind.messageGet,
          {
            params: {
              type: 'unHandleList',
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
                  _this.isUnHandle = true
                } else {
                  _this.isUnHandle = false
                }
              } else {
                _this.isUnHandle = false
              }
              _this.rowTotal = res.body.data.rowTotal
            }
          },
          (res) => {
            _this.$message.error(_this.msg(res.body))
          }
        )
    },

    getItineraryData() {
      let _this = this
      _this.pageN = 1
      _this.pageSize = 5
      _this.isload = true
      _this.isNoData = false
      _this.isUnHandle = false

      // 一周内的日程
      const start = new Date()
      const end = new Date()
      // let startEndDate = {}

      let day = new Date(start.getFullYear(), start.getMonth() + 1, 0)
      let daycount = day.getDate() // 获取本月天数
      end.setTime(start.getTime() + 3600 * 1000 * 24 * (daycount - start.getDate()))
      // startEndDate = {
      //   startDate: unifiedTime(start),
      //   endDate: unifiedTime(end, { format: 'YYYY-MM-DD' }) + ' 23:59:59'
      // }

      let params = Object.assign(_this.startEndDate, {
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
                } else {
                  _this.isNoData = false
                  _this.list = res.body.data.timingTaskList
                }
              }
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
      this.activeIndex = type
      this.isload = true
      var target = event.currentTarget
      var element = $(target)
      element.parents('ul').find('li').removeClass('active')
      element.parent().addClass('active')

      if (type == '1') {
        this.showUnHandle = true
        this.showReminder = false
        this.$refs['current'].refreshList()
      } else {
        this.showReminder = true
        this.showUnHandle = false
        this.$refs['schedule'].isshowData = true
        this.$refs['schedule'].refreshList()
      }
    }
  },
  components: {
    'add-msg': AddMsg,
    'current': Current,
    'schedule': Schedule
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
