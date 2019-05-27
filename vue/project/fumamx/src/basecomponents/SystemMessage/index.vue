<template>
    <div class="SystemMessage" :style="SystemMessageStyle">
        <div class="title">
            <i class="iconfont icon-notice notice"></i>{{index}}分钟以前
            <i class="iconfont icon-close close" @click="closeSystemMessage()"></i>
        </div>
        <div class="content" ref="SystemMessageContent">
            审批人 万辉邦 审批通过了你的客户“上海军军信息”，客户审批完成审批人 万辉邦 审批通过了你的客户“上海军军信息”，客户审批完成
        </div>
        <div class="operation">
            <el-dropdown :split-button="true" type="primary" size="small" @click="handle()" @command="handleCommand" trigger="click">
                立刻处理
                <el-dropdown-menu slot="dropdown" command>
                    <el-dropdown-item command="a">黄金糕</el-dropdown-item>
                    <el-dropdown-item command="b">狮子头</el-dropdown-item>
                    <el-dropdown-item command="b">螺蛳粉</el-dropdown-item>
                    <el-dropdown-item command="d">双皮奶</el-dropdown-item>
                    <el-dropdown-item command="e">蚵仔煎</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
export default {
  name: 'SystemMessage',
  data () {
    return {
      SystemMessageStyle: {}
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
  methods: {
    closeSystemMessage () {
      this.$emit('close', this.index)
    },
    know () {
      console.log(this.index)
    },
    closeTitle () {
      console.log(this.index)
    },
    // 点击立刻处理
    handle () {
      console.log('立刻处理')
    },
    // 点击下拉选择
    handleCommand (command) {
      this.$message('click on item ' + command)
    }
  },
  mounted () {
    setTimeout(() => {
      // 设置文本超过3行溢出点点点
      $clamp(this.$refs.SystemMessageContent, { clamp: 3 })
      this.SystemMessageStyle = {
        'bottom': (170 * this.index + 10) + 'px'
      }
    }, 20)
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.SystemMessage {
    width: 280px;
    height: 160px;
    padding: 0px 10px 0px 10px;
    background-color: #ffffff;
    opacity: 1;
    position: absolute;
    z-index: 1;
    right: 10px;
    bottom: -160px;
    border-radius: 3px;
    border: 1px #cccccc solid;
    overflow: hidden;

    transition: all .5s;
    -webkit-transition: all .5s;
    -moz-transform: all .5s;
    -o-transition: all .5s;
    -ms-transform: all .5s;
    .title {
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        border-bottom: 1px #cccccc solid;
        position: relative;
        .notice {
            font-size: 14px;
            margin-right: 5px;
        }
        .close {
            font-size: 12px;
            float: right;
            padding: 0 10px 0 10px;
            cursor: pointer;
            color: #A7A7A7;
        }
    }
    .content {
        padding: 20px 20px 0px 20px;
        overflow: hidden;
        position: relative;
        line-height: 20px;
        overflow: hidden;
    }
    .operation {
        width: 110px;
        padding-top: 10px;
        position: relative;
        margin: 0 auto;
        select {
            border: none;
            outline: none;
            background-color: #ffffff;
            cursor: pointer;
        }
    }
}
</style>
