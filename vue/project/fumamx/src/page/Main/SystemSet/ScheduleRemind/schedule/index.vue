<template>
    <div class="Schedule">
        <div class="filter">
            <div class="dateTime">
                <!--  消息筛选 -->{{$t('mxpcweb.systemset.scheduleremind.1530349345051')}}
                <!--选择时间范围  -->
                <el-date-picker v-model="screenDate" type="datetimerange" :picker-options="screenDateOptions" :placeholder="$t('mxpcweb.systemset.logaction.1530342578081')" align="right" size="small" @change="screenDateEvent()" :format="individualConfigInfo.dateFormat+' '+individualConfigInfo.timeFormat" style="width:300px">
                </el-date-picker>
            </div>
            <div class="pull-right">
                <div class="listItem" :class="selectType == 1 ? 'action':''" @click="operation(1)">
                    <!-- 明天 -->{{$t('mxpcweb.systemset.scheduleremind.1530349441149')}}
                </div>
                <div class="listItem" :class="selectType == 2 ? 'action':''" @click="operation(2)">
                    <!-- 后天 -->{{$t('mxpcweb.systemset.scheduleremind.1530349453595')}}
                </div>
                <div class="listItem" :class="selectType == 3 ? 'action':''" @click="operation(3)">
                    <!-- 本周 -->{{$t('mxpcweb.systemset.scheduleremind.1530349472459')}}
                </div>
                <div class="listItem" :class="selectType == 4 ? 'action':''" @click="operation(4)">
                    <!-- 本月 -->{{$t('mxpcweb.systemset.scheduleremind.1530349483722')}}
                </div>
                <div class="listItem" :class="selectType == 5 ? 'action':''" @click="operation(5)">
                    <!-- 全部 -->{{$t('mxpcweb.systemset.scheduleremind.1530349502861')}}
                </div>
            </div>
        </div>
        <loading v-show="isloading"></loading>
        <nodata v-show="isNodata"></nodata>

        <el-checkbox-group v-model="checkedItems" @change="handleCheckedCitiesChange">
        <ul class="msgList MXscroll" :style="{height: listHeight + 'px'}">
          <template v-if="!isloading">
            <li v-for="(item,index) in list" :key="index">
              <span class="selectItem" :style="{display: isIndeterminate || checkAll ? 'block' : ''}">
                <el-checkbox :label="index">&nbsp;</el-checkbox>
              </span>
                <div class="left">
                    <span class="time">{{ judgeTime(item.deliveryTime) }}</span>
                    <span class="plan">
                        <!-- 计划 -->{{$t('mxpcweb.systemset.scheduleremind.1530350048428')}}
                    </span>
                    <span class="customer text-hover" @click="msgJump(item)">{{item.body.msgBody}}</span>
                </div>
                <div class="right">
                    <span class="icons">
                        <i class="iconfont icon-time" @click.stop="setDelayTime(item)"></i>
                    </span>
                    <span class="icons">
                        <i class="iconfont icon-del" @click.stop="deleteSchedule(item,index)"></i>
                    </span>
                </div>
            </li>
          </template>
        </ul>
        </el-checkbox-group>

        <div class="paginationBox">
          <div class="operation">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{$t('mxpcweb.client.1529053640498')}}</el-checkbox>
            <span class="btns" v-if="isIndeterminate || checkAll"><em @click="allDel()" :title="$t('mxpcweb.systemset.scheduleremind.1538299036148')"><i class="iconfont icon-del"></i></em></span>
          </div>
            <el-pagination class="pagination" v-show="!isNodata" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[50, 100, 200, 300, 400]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="rowTotal"></el-pagination>
        </div>

        <!-- 选择延迟时间 -->
        <el-dialog :title="$t('mxpcweb.systemset.scheduleremind.1530349053051')" :visible.sync="delayTimeDialogVisible" size="tiny"
        :before-close="delayTimeDialogHandleClose" :modal-append-to-body="false">
            <!-- 选择日期时间 -->
            <el-date-picker v-model="delayTime" type="datetime" :placeholder="$t('mxpcweb.systemset.scheduleremind.1530349088468')" align="right" :picker-options="pickerOptions" :format="individualConfigInfo.dateFormat+' '+individualConfigInfo.timeFormat" style="width:100%;"></el-date-picker>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateDelayTime()">
                    <!-- 确 定 -->{{$t('mxpcweb.systemset.scheduleremind.1530349118956')}}
                </el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import { isObject, isArray } from '@/libs/utils'
import Loading from '@/basecomponents/Loading/index'
import NoData from '@/basecomponents/NoData/index'
export default {
  name: 'Schedule',
  props: {},
  data () {
    return {
      checkAll: false,
      checkedItems: [],
      isIndeterminate: false,

      selectType: 5, // 默认选择的类型
      screenDate: [], // 日程筛选
      screenDateOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        },
        shortcuts: [{
          /* 最近一周 */
          text: this.$t('mxpcweb.systemset.scheduleremind.1530349630214'),
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          /* 最近一个月 */
          text: this.$t('mxpcweb.systemset.scheduleremind.1530349633398'),
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          /* 最近三个月 */
          text: this.$t('mxpcweb.systemset.scheduleremind.1530349642825'),
          onClick (picker) {
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
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        },
        shortcuts: [{
          /* '明天' */
          text: this.$t('mxpcweb.systemset.scheduleremind.1530349441149'),
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 1)
            picker.$emit('pick', date)
          }
        }, {
          /* '后天' */
          text: this.$t('mxpcweb.systemset.scheduleremind.1530349453595'),
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 2)
            picker.$emit('pick', date)
          }
        }, {
          /* '一周后' */
          text: this.$t('mxpcweb.systemset.scheduleremind.1530350283403'),
          onClick (picker) {
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
  created () {
    this.listHeight = window.innerHeight - 125 - 110
    $(window).resize(() => {
      this.listHeight = window.innerHeight - 125 - 110
    })
    this.operation(5)
  },
  methods: {
    // 点全选
    handleCheckAllChange(event) {
      let AllChecked = this.list.map((item, index) => {
        return index
      })
      this.checkedItems = event.target.checked ? AllChecked : []
      this.isIndeterminate = false
    },
    // 单个点击
    handleCheckedCitiesChange(value) {
      let AllChecked = this.list.map((item, index) => {
        return index
      })
      let checkedCount = value.length
      this.checkAll = checkedCount === AllChecked.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < AllChecked.length
    },
    // 批量删除所选
    allDel () {
      let _this = this
      let checkedObjArr = []
      this.checkedItems.forEach(item => {
        this.list.forEach((item2, index) => {
          if (item === index) {
            checkedObjArr.push(item2)
          }
        })
      })

      let jobNameArr = checkedObjArr.map(item => {
        return item.jobName
      })

      let data = {
        jobName: jobNameArr.toString()
      }
      _this.$http.delete(_this.Global.baseURL + _this.Global.api.v2.messenger_delete, {params: data}).then(function (res) {
        if (res.body.code.toString() === _this.Global.RES_OK) {
          _this.checkAll = false // 清空所选
          _this.checkedItems = [] // 清空所选
          _this.isIndeterminate = false // 清空所选

          _this.refreshList() // 刷新
          _this.$message.success('删除成功')
        } else {
          _this.$message.error(res.body.msg)
        }
      }, function (res) {
        _this.$message.error(_this.msg(res.body))
      })
    },
    // 刷新列表，对外使用
    refreshList () {
      // 重置请求参数
      this.selectType = 5
      this.screenDate = []
      this.startEndDate = {}
      this.pageN = 1
      this.pageSize = 20
      this.getList()
    },
    // 获取日程列表
    getList () {
      let _this = this
      _this.isloading = true
      _this.isNodata = false
      let params = Object.assign(_this.startEndDate, {
        pageN: _this.pageN,
        pageSize: _this.pageSize
      })
      _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.scheduleremind.messengerGet, {
        params: params
      }).then(function (res) {
        if (res.body.code.toString() === _this.Global.RES_OK && isObject(res.body.data)) {
          if (isArray(res.body.data.timingTaskList)) {
            _this.list = res.body.data.timingTaskList
            _this.isloading = false
            if (res.body.data.timingTaskList.length == 0) {
              _this.isNodata = true
            } else {
              _this.isNodata = false
            }
          }
          _this.rowTotal = res.body.data.rowTotal
        }
      }, function (res) {
        _this.$message.error(_this.msg(res.body))
      })
    },
    // 日历自定义范围查询
    screenDateEvent () {
      console.log(this.screenDate)
      let _this = this
      this.startEndDate = {
        startDate: _this.$m_unifiedTime(_this.screenDate[0]),
        endDate: _this.$m_unifiedTime(_this.screenDate[1])
      }
      this.getList()
    },
    // 点击表头查询
    operation (type) {
      let _this = this
      this.selectType = type
      const start = new Date()
      const end = new Date()
      let startEndDate = {}
      if (type == 1) { // 明天
        end.setTime(start.getTime() + 3600 * 1000 * 24 * 1)
        startEndDate = {
          startDate: _this.$moment(start).format('YYYY-MM-DD') + ' 00:00:00',
          endDate: _this.$moment(end).format('YYYY-MM-DD') + ' 23:59:59'
        }
      } else if (type == 2) { // 后天
        end.setTime(start.getTime() + 3600 * 1000 * 24 * 2)
        startEndDate = {
          startDate: _this.$moment(start).format('YYYY-MM-DD') + ' 00:00:00',
          endDate: _this.$moment(end).format('YYYY-MM-DD') + ' 23:59:59'
        }
      } else if (type == 3) { // 本周
        end.setTime(start.getTime() + 3600 * 1000 * 24 * (6))
        startEndDate = {
          startDate: _this.$moment(start).format('YYYY-MM-DD') + ' 00:00:00',
          endDate: _this.$moment(end).format('YYYY-MM-DD') + ' 23:59:59'
        }
      } else if (type == 4) { // 本月
        let day = new Date(start.getFullYear(), start.getMonth() + 1, 0)
        let daycount = day.getDate() // 获取本月天数
        end.setTime(start.getTime() + 3600 * 1000 * 24 * (daycount - start.getDate()))
        startEndDate = {
          startDate: _this.$moment(start).format('YYYY-MM-DD') + ' 00:00:00',
          endDate: _this.$moment(end).format('YYYY-MM-DD') + ' 23:59:59'
        }
      } else if (type == 5) { // 全部
        startEndDate = {}
      }
      this.startEndDate = startEndDate
      this.getList()
    },
    // 点击延迟按钮
    setDelayTime (item) {
      this.delayTimeDialogVisible = true
      this.selectList = item
    },
    // 关闭延迟对话框
    delayTimeDialogHandleClose () {
      this.delayTimeDialogVisible = false
      this.delayTime = ''
    },
    // 修改日程
    updateDelayTime () {
      let _this = this
      if (this.delayTime == '') {
        /* "请选择推迟的日期！" */
        _this.$message.error(this.$t('mxpcweb.systemset.scheduleremind.1530350311411'))
        return
      }
      let {
        jobName
      } = this.selectList
      let data = {
        jobName: jobName,
        deliveryTime: this.$m_unifiedTime(this.delayTime)
      }
      _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.scheduleremind.messengerPut, data).then(function (res) {
        if (res.body.code.toString() === _this.Global.RES_OK) {
          _this.$message(_this.msg(res.body))
          _this.getList()
          _this.delayTimeDialogHandleClose()
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.msg(res.body))
      })
    },
    // 删除日程
    deleteSchedule (item, index) {
      let _this = this
      // 删除成功，刷新列表
      _this.list.splice(index, 1)
      let {
        jobName
      } = item
      let data = {
        jobName: jobName
      }
      _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.scheduleremind.messengerDelete, data).then(function (res) {
        if (res.body.code.toString() === _this.Global.RES_OK) {
          if (_this.list.length == 0) {
            _this.getList()
          }
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.msg(res.body))
      })
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`);
      this.pageN = val
      this.getList()
    },
    judgeTime (time) {
      return this.timeShow_customized(time)
    }
  },
  components: {
    'loading': Loading,
    'nodata': NoData
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
