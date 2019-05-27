<template>
  <div class="SystemMessage" :style="SystemMessageStyle">
    <div class="title">
      <i class="iconfont icon-notice notice"></i>{{ item.deliveryTime ? $m_formulateTime(item.deliveryTime) : $m_formulateTime(new Date()) }}
      <i class="iconfont icon-close close" @click="closeMsg()"></i>
    </div>
    <div class="content text-center" ref="SystemMessageContent" :title="item.msgBody">
      <template v-if="item.msgSubType=='12'">
        <div class="text-center"><span style="color:#33a3f1;">{{item.body.fileName.slice(0,18)}}</span>{{ $t('mxpcweb.components.1530840558054') }}</div>
      </template>
      <span v-else>{{item.msgBody}}</span>
    </div>
    <div class="operation" v-if="item.msgSubType != 16">
      <el-dropdown :split-button="true" type="primary" size="small" @click="handle()" @command="handleCommand" trigger="click">
        {{ $t('mxpcweb.components.1531216227524') }}
        <el-dropdown-menu slot="dropdown" command>
          <el-dropdown-item command="delay">{{ $t(('mxpcweb.components.1531216261909')) }}</el-dropdown-item>
          <el-dropdown-item command="close">{{ $t('mxpcweb.components.1531216309486') }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!--设置延迟-->
    <div class="setDelayBox" :class="issetDelayBoxShow ? 'setDelayBoxShow':''">
      <div class="setDelayTitle">{{ $t('mxpcweb.components.1531216341631') }}</div>
      <div class="setDelayTimeBox">
        <el-date-picker v-model="delayTime" align="right" type="datetime" :placeholder="$t('mxpcweb.components.1531216378335')" :picker-options="delayTimeOptions"></el-date-picker>
      </div>
      <div class="setDelayButtonBox">
        <el-button type="primary" size="small" @click="confirmSetDelay(item)">{{ $t('mxpcweb.components.1531216430381') }}</el-button>
        <el-button type="primary" size="small" @click="issetDelayBoxShow = false">{{ $t('mxpcweb.components.1531216457769') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SystemMessage',
  data () {
    let _this = this
    return {
      SystemMessageStyle: {},
      issetDelayBoxShow: false,
      delayTimeOptions: {
        shortcuts: [
          {
            text: _this.$t('mxpcweb.components.1531217858118'),
            onClick (picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: _this.$t('mxpcweb.components.1531217927408'),
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: _this.$t('mxpcweb.components.1530797776572'),
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      delayTime: ''
    }
  },
  props: {
    index: {
      type: Number
    },
    item: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  created () { },
  mounted () {
    console.log(this.item)
    console.log(this.item)
    console.log(this.item)
    let _this = this
    // 设置文本超过3行溢出点点点
    setTimeout(() => {
      if (window.navigator.userAgent.indexOf('MSIE') == -1) {
        $clamp(_this.$refs.SystemMessageContent, {
          clamp: 3
        })
      }
      _this.SystemMessageStyle = {
        bottom: 170 * _this.index + 10 + 'px'
      }
    }, 20)
  },
  methods: {
    // 创建组件独立空间
    initState () {
      this.issetDelayBoxShow = false
      this.delayTime = ''
    },
    know () {
      console.log(this.index)
    },
    closeTitle () {
      console.log(this.index)
    },
    // 点击立刻处理
    handle () {
      let _this = this
      this.$emit('close', _this.index)
      // let { msgId, msgSubType } = this.item
      let data = {
        msgId: this.item.msgId,
        type: 'read',
        sourceId: 'pc'
      }
      _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.scheduleremind.messagePut, data).then(function (res) {
        if (res.body.code.toString() === _this.Global.RES_OK) {} else {
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.msg(res.body))
      })

      let item = this.item
      // 处理跳转
      this.msgJump(item) // 全局处理跳转
    },
    // 点击下拉选择
    handleCommand (command) {
      // 延迟
      if (command == 'delay') {
        this.issetDelayBoxShow = true
      } else if (command == 'close') {
        this.closeMsg()
      }
    },
    // 设置延迟
    confirmSetDelay (item) {
      let _this = this
      if (_this.delayTime) {
        _this.$emit('close', _this.index)
        let deliveryTime = _this.$m_unifiedTime(_this.delayTime)
        let data = {
          msgId: item.msgId,
          type: 'delay',
          deliveryTime: deliveryTime,
          sourceId: 'pc'
        }
        _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.scheduleremind.messagePut, data).then(function (res) {
          if (res.body.code.toString() === _this.Global.RES_OK) {
            // _this.$message(_this.msg(res.body));
          } else {
            _this.$message.error(_this.msg(res.body))
          }
        }, function (res) {
          _this.$message.error(_this.msg(res.body))
        })
      } else {
        this.$message.error(_this.$t('mxpcweb.components.1531218046839'))
      }
    },
    // 点击关闭,设置成关闭
    closeMsg () {
      let _this = this
      _this.$emit('close', _this.index)
      let { msgId } = _this.item
      let data = {
        msgId: msgId,
        type: 'read',
        sourceId: 'pc'
      }
      _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.scheduleremind.messagePut, data).then(function (res) {
        if (res.body.code.toString() === _this.Global.RES_OK) { } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.msg(res.body))
      })
    }
  },
  watch: {}
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
