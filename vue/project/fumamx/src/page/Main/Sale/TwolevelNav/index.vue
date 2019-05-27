<template>
    <div class="TwolevelNav MXscroll">
        <loading v-if="!list.length"></loading>
        <menu-nav :list="list"></menu-nav>
        <div class="bottomNavBox" v-if="recycle.moduleCode" style="z-index: 2;">
          <router-link tag="div" :to="recycle.uRI" :data-href="recycle.uRI" class="bottomNav">
            <i class="iconfont" :class="recycle.iconURI"></i>
          {{recycle.display}}
          </router-link>
        </div>
    </div>
</template>

<script>
import Loading from '@/basecomponents/Loading/index'
import MenuNav from './MenuNav/index'
export default {
  name: 'TwolevelNav',
  props: {
    list: {
      type: Array,
      default: function () {
        return []
      }
    },
    recycle: {
      type: Object,
      default: () => {
        return {}
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
