<template>
    <div class="MsgClock">

        <div class="icon transition_all" @click="setActive()" :class="isActive ? 'iconActive' : ''">
            <i class="iconfont icon-notice"></i>
            <span class="msgNum" v-show="messageNumber.unReadNum > 0">{{ messageNumber.unReadNum }}</span>
        </div>

        <transition name="fade">
            <div class="sliderBg" v-if="isActive" @click="isActive=false"></div>
        </transition>

        <transition name="slider-customer">
            <div class="sliderBody" v-show="isActive">
                <!-- 标题 -->
                <div class="title">
                    <!--通知-->
                    {{$t('mxpcweb.components.1530795678790')}}
                    <span class="pull-right text-hover">
                        <i class="iconfont icon-close" @click="isActive=false"></i>
                    </span>
                </div>

                <ul class="msglistContent MXscroll">
                    <li v-for="(item,index) in msglist" :key="index" :class="item.readFlag == 0 ? 'noAction' : ''" @:mouseenter="msglistMouseover(item,index)" @:mouseleave="msglistMouseout(item,index)">
                        <div class="rightContent">
                            <span @click.stop.prevent="showDelayOperation(index)" :title="$t('mxpcweb.components.1530839967303')"><i class="iconfont icon-time-bold"></i></span>
                            <span @click.stop.prevent="closeItem(item,index)"  :title="$t('mxpcweb.systemset.bizfield.1530335441748')"><i class="iconfont icon-remove-round"></i></span>
                        </div>

                        <div class="msgTime">{{ judgeTime(item.deliveryTime) }}</div>

                        <div class="msgContentOperation">
                            <div class="msgStatus" @click.stop.prevent="clickMsgStatus(item,index)"></div>
                            <div class="leftContent" :class="[item.msgSubType != 0 ? 'text-hover' : '']" @click.stop.prevent="listaddTab(item)">
                              {{item.msgBody}}
                            </div>
                        </div>

                        <div class="delayOperation" ref="showDelayOperations">
                            <div class="delayTitle">
                              <!--推迟到-->
                              {{$t('mxpcweb.components.1530839967303')}}
                            </div>
                            <div class="delayTime">
                              <!--选择日期时间-->
                                <el-date-picker v-model="delayTime[index]" type="datetime" :placeholder="$t('mxpcweb.workbench.1530673610787')" align="right" :picker-options="pickerOptions" size="mini"></el-date-picker>
                                <div class="pull-right">
                                  <el-button type="primary" size="mini" @click.stop.prevent="confirmDelayOperation(item,index)">
                                    <!--确定-->
                                    {{$t('mxpcweb.systemset.rolemanag.1530595915980')}}
                                  </el-button>
                                  <el-button type="primary" :plain="true" size="mini" @click.stop.prevent="hideDelayOperation(index)">
                                    <!--取消-->
                                    {{$t('mxpcweb.systemset.rolemanag.1530595955452')}}
                                  </el-button>
                                </div>
                            </div>
                        </div>

                    </li>
                    <loading v-show="loadingisShow"></loading>
                    <nodata v-show="msglist.length == 0" :title="$t('mxpcweb.components.1530795814366')"></nodata>
                </ul>

                <div class="msgFooter">
                  <!--总共-->
                  {{$t('mxpcweb.components.1530795856012')}}
                    <span class="text-red">{{ messageNumber.unHandleNum }}</span>
                    <!--条-->
                    {{$t('mxpcweb.client.1529050859097')}}
                    <router-link to="/main/systemset/scheduleremind">
                        <el-button class="pull-right" type="text" @click.stop="isActive = !isActive">
                          <!--全部历史记录-->
                          {{$t('mxpcweb.components.1530795907856')}}
                        </el-button>
                    </router-link>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
/**
 * 描述：通用=>顶部消息小闹钟
 * 作者：高俊峰
 * 时间：2017/7/25
 */
import Loading from '@/basecomponents/Loading/index'
import NoData from '@/basecomponents/NoData/index'
export default {
  name: 'MsgClock',
  props: {
    messageNumber: {
      type: Object,
      default: function () {
        return {
          unReadNum: 0,
          unHandleNum: 0
        }
      }
    }
  },
  data () {
    return {
      isActive: false,
      msglist: [],
      loadingisShow: true,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        },
        shortcuts: [
          {
            text: this.$t('mxpcweb.workbench.1530673462060'), // 明天
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 1)
              picker.$emit('pick', date)
            }
          },
          {
            text: this.$t('mxpcweb.workbench.1530673476541'), // 后天
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 2)
              picker.$emit('pick', date)
            }
          },
          {
            text: this.$t('mxpcweb.workbench.1530673488255'), // 一周后
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      isGeting: false, // 是否加载中
      delayTime: [] // 延迟时间
    }
  },
  created () {
    this.getMsgList()
  },
  mounted () {
    let _this = this
    // 点击其他隐藏
    document.addEventListener('click', e => {
      if (!this.$el.contains(e.target)) {
        this.isActive = false
        setTimeout(() => {
          this.msglist = [] // 清空消息列表
          // this.getMsgList(); //获取消息列表
        }, 100)
      }
    })
    // 滚动区域
    $(this.$el)
      .find('.msglistContent')
      .eq(0)
      .scroll(function () {
        var h = $(this).height() // div可视区域的高度
        var sh = $(this)[0].scrollHeight // 滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点
        var st = $(this)[0].scrollTop // 滚动条的高度，即滚动条的当前位置到div顶部的距离
        if (h + st >= sh) {
          _this.getMsgList()
        }
      })
  },
  updated () {
    let _this = this
    let msgContents = $(_this.$el).find('.leftContent')
    for (var i = msgContents.length; i < _this.msglist.length; i++) {
      $clamp(msgContents.eq(i).get(0), {
        clamp: 2
      })
    }
  },
  methods: {
    setActive () {
      this.isActive = !this.isActive
      this.msglist = []
      if (this.isActive) {
        this.getMsgList()
      }
      // 点击其他隐藏
      document.addEventListener('click', (e) => {
        if (!this.$el.contains(e.target)) this.isActive = false
      })
    },
    // 获取分页列表
    getMsgList () {
      let _this = this
      _this.loadingisShow = true
      if (!_this.isGeting) {
        _this.isGeting = true
        _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.scheduleremind.messageGet, {
          params: {
            type: 'unHandleList',
            rowOffset: _this.msglist.length,
            pageSize: 20,
            sort: 'deliveryTime',
            order: 'desc'
          }
        }).then(function (res) {
          // 关闭loadingdui对话框
          _this.loadingisShow = false
          _this.isGeting = false
          if (res.body.code.toString() === _this.Global.RES_OK && res.body.data && res.body.data.messageRecordList && res.body.data.messageRecordList instanceof Array) {
            // 设置列表总条数
            _this.pageTotal = res.body.data.rowTotal
            if (res.body.data.messageRecordList && res.body.data.messageRecordList.length > 0) {
              res.body.data.messageRecordList.forEach(
                (element, index) => {
                  // if(element.msgSubType != 5){
                  _this.msglist.push(element)
                  // }
                }
              )
            }
          }
        },
        function (res) {
          _this.$message.error(_this.msg(res.body))
        })
      }
    },
    // 点击推迟到
    showDelayOperation (i) {
      this.$refs.showDelayOperations.forEach((element, index) => {
        if (index == i) {
          element.style.left = '0px'
        }
      }, this)
    },
    // 点击取消按钮
    hideDelayOperation (index) {
      this.$refs.showDelayOperations.forEach((element, i) => {
        if (index == i) {
          element.style.left = '100%'
        }
      }, this)
    },
    // 点击确定,设置延迟
    confirmDelayOperation (item, index) {
      let _this = this
      if (_this.delayTime[index]) {
        let deliveryTime = _this.$m_unifiedTime(_this.delayTime[index])
        let data = {
          msgId: item.msgId,
          type: 'delay',
          deliveryTime: deliveryTime,
          sourceId: 'pc'
        }
        _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.scheduleremind.messagePut, data).then((res) => {
          if (res.body.code.toString() === _this.Global.RES_OK) {}
        }, (res) => {
          _this.$message.error(_this.msg(res.body))
        })
        _this.$refs.showDelayOperations.forEach((element, i) => {
          if (index == i) {
            element.style.left = '100%'
            _this.msglist.splice(index, 1)
            _this.delayTime[index] = ''
          }
        }, this)
      }
    },
    // 鼠标移入
    msglistMouseover (item, index) {
      let _this = this
      if (item.readFlag == 0) {
        let data = {
          msgId: item.msgId,
          type: 'read',
          sourceId: 'pc'
        }
        _this['t' + index] = setTimeout(() => {
          _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.scheduleremind.messagePut, data).then((res) => {
            if (res.body.code.toString() === _this.Global.RES_OK) {
                  item.readFlag = 1 // 设置成已读
                }
            }, (res) => {
                _this.$message.error(_this.msg(res.body))
            })
        }, 5000)
      }
    },
    // 鼠标移出
    msglistMouseout (item, index) {
      clearTimeout(this['t' + index])
    },
    // 关闭消息
    closeItem (item, index) {
      let _this = this
      // 删除数组指定位置元素
      _this.msglist.splice(index, 1)
      let data = {
        msgId: item.msgId,
        type: 'close',
        sourceId: 'pc'
      }
      _this.$http
        .post(
          _this.Global.baseURL +
                _this.Global.api.SystemSet.scheduleremind.messagePut,
          data
        )
        .then(
          function (res) {
            if (res.body.code.toString() === _this.Global.RES_OK) {
              if (_this.msglist.length == 0) {
                _this.getMsgList() // 获取消息列表
              }
            }
          },
          function (res) {
            _this.$message.error(_this.msg(res.body))
          }
        )
    },
    clickMsgStatus (item, index) {
      let _this = this
      let data = {}
      if (item.readFlag == 1) {
        item.readFlag = 0 // 设置成未读
        data = {
          msgId: item.msgId,
          type: 'unread',
          sourceId: 'pc'
        }
      } else if (item.readFlag == 0) {
        item.readFlag = 1 // 设置成已读
        data = {
          msgId: item.msgId,
          type: 'read',
          sourceId: 'pc'
        }
      }
      _this.$http
        .post(
          _this.Global.baseURL +
                _this.Global.api.SystemSet.scheduleremind.messagePut,
          data
        )
        .then(
          function (res) {
            if (res.body.code.toString() === _this.Global.RES_OK) {
              ep.emit('refreshScheduleRemindListWorkbench') // 刷新工作台中的日程模块
            }
          },
          function (res) {
            _this.$message.error(_this.msg(res.body))
          }
        )
    },
    judgeTime (time) {
      return this.timeShow_customized(time)
    },
    listaddTab (item) {
      this.isActive = false
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
    }
  },
  components: {
    loading: Loading,
    nodata: NoData
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
