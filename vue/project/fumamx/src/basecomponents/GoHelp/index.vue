<template>
    <div class="GoHelp">
        <div class="icoFlower transition_all" @click="goLink">
            <i class="iconfont icon-ask-mark"></i>
        </div>
    </div>
</template>

<script>
/**
 * 描述：通用=>
 * 作者：向士健
 * 时间：2018/1/1
 */
export default {
  name: 'GoHelp',
  props: {

  },
  data () {
    return {

    }
  },
  created () {

  },
  methods: {
    goLink() {
      let helpUrl = (window.runtime === 'prod') ? 'https://help.fumamx.com' : 'https://h3.laifuyun.com'
      if (navigator.userAgent.indexOf('Electron') !== -1) {
          this.openNewWindowTab('https://fumamx.com/pc/toHelpCenter?id=' + this.getToken()[this.Global.accessToken]) // 跳转到帮助
      } else {
          this.openNewWindowTab(helpUrl) // 跳转到帮助
      }
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.GoHelp {
    width: 54px;
    height: 100%;
    float: right;
    position: relative;
    margin-right: 1px;
    .icoFlower {
        text-align: center;
        line-height: 56px;
        color: #c0c4cc;
        >.iconfont {
            font-size: 25px;
        }
        &:hover,
        &.iconActive {
            cursor: pointer;
            color: #d0021b;
        }
    }
}
</style>
