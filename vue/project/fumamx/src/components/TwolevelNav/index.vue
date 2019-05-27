<template>
    <div class="TwolevelNav MXscroll">
        <loading v-if="!list.length"></loading>
        <menu-nav :list="list"></menu-nav>
    </div>
</template>

<script>
import Loading from '@/basecomponents/Loading/index'
import MenuNav from '@/basecomponents/MenuNav/index'
export default {
  name: 'TwolevelNav',
  props: {
    list: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  components: {
    'loading': Loading,
    'menu-nav': MenuNav
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
