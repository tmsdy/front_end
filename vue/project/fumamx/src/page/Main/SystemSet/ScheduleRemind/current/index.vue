<template>
    <div class="Current">
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
                    <span class="time">{{ judgeTime(item.deliveryTime)}}</span>
                    <!-- '已读' : '未读' -->
                    <span class="status" v-html="item.readFlag != 0 ? $t('mxpcweb.systemset.scheduleremind.1530348989708') : `<b>${$t('mxpcweb.systemset.scheduleremind.1530349022364')}</b>`"></span>
                    <span class="text-hover" @click="msgJump(item)">{{item.msgBody}}</span>
                </div>
                <div class="right">
                    <span class="icons">
                        <i class="iconfont icon-time" @click.stop="setDelayTime(item,index)"></i>
                    </span>
                    <span class="icons">
                        <i class="iconfont icon-minus" @click.stop="closeItem(item,index)"></i>
                    </span>
                    <span class="icons">
                        <i class="iconfont icon-del" @click.stop="deleteItem(item,index)"></i>
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
          <el-pagination class="pagination" v-show="!isNodata" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[50,100, 200, 300, 400]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="rowTotal"></el-pagination>
        </div>

        <!-- 选择延迟时间 -->
        <el-dialog :title="$t('mxpcweb.systemset.scheduleremind.1530349053051')" :visible.sync="delayTimeDialogVisible" size="tiny" :before-close="delayTimeDialogHandleClose" :modal-append-to-body="false">
            <!-- 选择日期时间 -->
            <el-date-picker v-model="delayTime" type="datetime" :placeholder="$t('mxpcweb.systemset.scheduleremind.1530349088468')" align="right" :picker-options="pickerOptions" :format="individualConfigInfo.dateFormat+' '+individualConfigInfo.timeFormat" style="width:100%;"></el-date-picker>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateDelayTime()">
                    <!-- 确 定 -->{{$t('mxpcweb.systemset.scheduleremind.1530349118956')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { isObject, isArray } from '@/libs/utils'
import Loading from '@/basecomponents/Loading/index'
import NoData from '@/basecomponents/NoData/index'
export default {
  name: 'Current',
  props: {},
  data () {
    return {
      checkAll: false,
      checkedItems: [],
      isIndeterminate: false,

      isloading: false,
      isNodata: false,
      list: [],
      selectList: null,
      delayTimeDialogVisible: false,
      delayTime: '',
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        },
        shortcuts: [{
          text: '明天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 1)
            picker.$emit('pick', date)
          }
        }, {
          text: '后天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 2)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周后',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      pageN: 1, // 当前第几期
      pageSize: 20, // 每页多少条
      rowTotal: 0,
      listHeight: 0
    }
  },
  created () {
    this.listHeight = window.innerHeight - 125 - 64
    $(window).resize(() => {
      this.listHeight = window.innerHeight - 125 - 64
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
      // console.log(this.list)
      // console.log(this.checkAll)
      // console.log(this.checkedItems)
      // console.log(this.isIndeterminate)
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
      // console.log(jobNameArr.toString())
      // return
      let data = {
        msgId: jobNameArr.toString(),
        type: 'delete',
        deliveryTime: '',
        sourceId: 'pc'
      }
      this.messagePut(data, () => {
        this.checkAll = false // 清空所选
        this.checkedItems = [] // 清空所选
        this.isIndeterminate = false // 清空所选
        this.refreshList()
      })
    },
    // 刷新列表，对外使用
    refreshList () {
      // 重置请求参数
      this.pageN = 1
      this.pageSize = 20
      this.getList()
    },
    // 获取列表
    getList () {
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
      }).then(function (res) {
        if (res.body.code.toString() === _this.Global.RES_OK && isObject(res.body.data)) {
          _this.isloading = false
          if (isArray(res.body.data.messageRecordList)) {
            _this.list = res.body.data.messageRecordList
            if (res.body.data.messageRecordList.length == 0) {
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
    // 点击延迟时间
    setDelayTime (item, index) {
      this.delayTimeDialogVisible = true
      this.selectList = item
      this.itemIndex = index
    },
    // 关闭对话框
    delayTimeDialogHandleClose () {
      this.delayTimeDialogVisible = false
      this.delayTime = ''
    },
    // 修改消息接口
    messagePut (data, fn = () => {}) {
      let _this = this
      _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.scheduleremind.messagePut, data).then(function (res) {
        if (res.body.code.toString() === _this.Global.RES_OK) {
          fn()
        }
      }, function (res) {
        _this.$message.error(_this.msg(res.body))
      })
    },
    // 更新延迟时间
    updateDelayTime () {
      let _this = this
      if (this.delayTime == '') {
        /* "请选择推迟的日期！" */
        _this.$message.error(this.$t('mxpcweb.systemset.scheduleremind.1530350311411'))
        return
      }
      let {
        msgId
      } = this.selectList
      let data = {
        msgId: msgId,
        type: 'delay',
        deliveryTime: this.$m_unifiedTime(this.delayTime),
        sourceId: 'pc'
      }
      _this.messagePut(data)
      _this.list.splice(_this.itemIndex, 1)
      if (_this.list.length == 0) {
        _this.getList()
      }
      _this.delayTimeDialogHandleClose()
    },
    // 关闭提醒
    closeItem (item, index) {
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
    deleteItem (item, index) {
      let _this = this
      let {
        msgId
      } = item
      let data = {
        msgId: msgId,
        type: 'delete',
        sourceId: 'pc'
      }
      _this.messagePut(data)
      _this.list.splice(index, 1)
      if (_this.list.length == 0) {
        _this.getList()
      }
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
