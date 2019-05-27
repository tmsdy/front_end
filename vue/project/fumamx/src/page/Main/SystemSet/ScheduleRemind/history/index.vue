<template>
    <div class="History">
        <div class="filter">
            <div class="dateTime">
                <!--  消息筛选 -->{{$t('mxpcweb.systemset.scheduleremind.1530349345051')}}
                <!-- 选择时间范围 -->
                <el-date-picker v-model="screenDate" type="datetimerange" :picker-options="screenDateOptions" :placeholder="$t('mxpcweb.systemset.scheduleremind.1530349378706')" align="right" size="small" @change="screenDateEvent()" :format="individualConfigInfo.dateFormat+' '+individualConfigInfo.timeFormat" style="width:300px">
                </el-date-picker>
            </div>
            <div class="pull-right">
                <div class="listItem" :class="selectType == 1 ? 'action':''" @click="operation(1)">
                    <!-- 明天 -->
                    {{$t('mxpcweb.systemset.scheduleremind.1530349441149')}}

                </div>
                <div class="listItem" :class="selectType == 2 ? 'action':''" @click="operation(2)">
                    <!-- 后天 -->
                    {{$t('mxpcweb.systemset.scheduleremind.1530349453595')}}
                </div>
                <div class="listItem" :class="selectType == 3 ? 'action':''" @click="operation(3)">
                    <!-- 本周 -->
                    {{$t('mxpcweb.systemset.scheduleremind.1530349472459')}}
                </div>
                <div class="listItem" :class="selectType == 4 ? 'action':''" @click="operation(4)">
                    <!-- 本月 -->
                    {{$t('mxpcweb.systemset.scheduleremind.1530349483722')}}
                </div>
                <div class="listItem" :class="selectType == 5 ? 'action':''" @click="operation(5)">
                    <!-- 全部 -->
                    {{$t('mxpcweb.systemset.scheduleremind.1530349502861')}}
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
                    <!--已完成-->
                    <template v-if="item.status == 2" style="color:#ccc;">
                        <span class="customer">
                            <!-- 已完成 -->{{$t('mxpcweb.systemset.scheduleremind.1530349551117')}}
                        </span>
                        <span>{{item.msgBody}}</span>
                        <span class="text-hover" @click="msgJump(item)">{{item.msgBody}}</span>
                    </template>
                    <!--已关闭-->
                    <template class="customer" v-if="item.status == 3">
                        <span class="customer">
                            <!-- 已关闭 -->{{$t('mxpcweb.systemset.scheduleremind.1530349562229')}}
                        </span>
                        <del>{{item.msgBody}}</del>
                    </template>
                </div>
                <div class="right">
                    <span class="icons">
                        <i class="iconfont icon-del" @click.stop="deleteHistoryList(item,index)"></i>
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
    </div>
</template>

<script>
import {
  isObject,
  isArray
} from '@/libs/utils'
import Loading from '@/basecomponents/Loading/index'
import NoData from '@/basecomponents/NoData/index'
export default {
  name: 'History',
  props: {},
  data () {
    return {
      checkAll: false,
      checkedItems: [],
      isIndeterminate: false,

      isloading: false,
      isNodata: false,
      list: [],
      selectType: 4,
      screenDate: [], // 日程筛选
      screenDateOptions: {
        // disabledDate(time) {
        //     return time.getTime() < Date.now() - 8.64e7;
        // },
        shortcuts: [{
          /* 最近一周 */
          text: this.$t('mxpcweb.systemset.scheduleremind.1530349630214'),
          onClick (picker) {
            const start = new Date()
            end.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {/* 最近一个月 */
          text: this.$t('mxpcweb.systemset.scheduleremind.1530349633398'),
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {/* 最近三个月 */
          text: this.$t('mxpcweb.systemset.scheduleremind.1530349642825'),
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
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
    this.getList()
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
      let checkedObjArr = []
      this.checkedItems.forEach(item => {
        this.list.forEach((item2, index) => {
          if (item === index) {
            checkedObjArr.push(item2)
          }
        })
      })

      let jobNameArr = checkedObjArr.map(item => {
        return item.msgId
      })
      let data = {
        msgId: jobNameArr.toString(),
        type: 'delete',
        deliveryTime: '',
        sourceId: 'pc'
      }
      let _this = this
      _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.scheduleremind.messagePut, data).then(res => {
        if (res.body.code.toString() === _this.Global.RES_OK) {
          this.checkAll = false // 清空所选
          this.checkedItems = [] // 清空所选
          this.isIndeterminate = false // 清空所选
          this.refreshList()
        }
      }, function (res) {
        _this.$message.error(_this.msg(res.body))
      })
    },
    // 刷新列表，对外使用
    refreshList () {
      // 重置请求参数
      this.selectType = 4
      this.screenDate = []
      this.startEndDate = {}
      this.pageN = 1
      this.pageSize = 20
      this.getList()
    },
    // 获取列表
    getList () {
      let _this = this
      _this.isloading = true
      _this.isNodata = false
      let data = Object.assign({
        type: 'historyList'
      }, _this.startEndDate, {
        pageN: _this.pageN,
        pageSize: _this.pageSize,
        sort: 'deliveryTime',
        order: 'desc'
      })
      _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.scheduleremind.messageGet, {
        params: data
      }).then(function (res) {
        if (res.body.code.toString() === _this.Global.RES_OK && isObject(res.body.data)) {
          if (isArray(res.body.data.messageRecordList)) {
            _this.list = res.body.data.messageRecordList
            if (res.body.data.messageRecordList.length == 0) {
              _this.isNodata = true
            } else {
              _this.isNodata = false
            }
          }
          _this.isloading = false
          _this.rowTotal = res.body.data.rowTotal
        }
      }, function (res) {
        _this.$message.error(_this.msg(res.body))
      })
    },
    // 日历自定义范围查询
    screenDateEvent () {
      let _this = this
      _this.startEndDate = {
        startDate: _this.$m_unifiedTime(_this.screenDate[0]), // 本地时间转换成正8区时间提交到后台
        endDate: _this.$m_unifiedTime(_this.screenDate[1])
      }
      _this.getList()
    },
    // 操作
    operation (index) {
      let _this = this
      this.selectType = index
      let startEndDate = {}
      const start = new Date()
      if (index == 1) { // 昨天
        start.setTime(start.getTime() + 3600 * 1000 * 24 * -1)
        startEndDate = {
          startDate: _this.$moment(start).format('YYYY-MM-DD') + ' 00:00:00',
          endDate: _this.$moment(start).format('YYYY-MM-DD') + ' 23:59:59'
        }
      } else if (index == 2) { // 前天
        start.setTime(start.getTime() + 3600 * 1000 * 24 * -2)
        startEndDate = {
          startDate: _this.$moment(start).format('YYYY-MM-DD') + ' 00:00:00',
          endDate: _this.$moment(start).format('YYYY-MM-DD') + ' 23:59:59'
        }
      } else if (index == 3) { // 本月
        let day = new Date(start.getFullYear(), start.getMonth() + 1, 0)
        let daycount = day.getDate() // 获取本月天数
        let s = new Date(start.getFullYear(), start.getMonth(), 1)
        let e = new Date(start.getFullYear(), start.getMonth(), daycount)
        startEndDate = {
          startDate: _this.$moment(s).format('YYYY-MM-DD') + ' 00:00:00',
          endDate: _this.$moment(e).format('YYYY-MM-DD') + ' 23:59:59'
        }
      } else if (index == 4) {
        startEndDate = {}
      }
      this.startEndDate = startEndDate
      this.getList()
    },
    // 删除列表
    deleteHistoryList (item, index) {
      let _this = this
      _this.list.splice(index, 1)
      if (_this.list.length == 0) {
        _this.getList()
      }
      let {
        msgId
      } = item
      let data = {
        msgId: msgId,
        type: 'delete',
        // deliveryTime:"",
        sourceId: 'pc'
      }
      _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.scheduleremind.messagePut, data).then(function (res) {
        if (res.body.code.toString() === _this.Global.RES_OK) { }
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
