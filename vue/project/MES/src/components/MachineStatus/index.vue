<template>
  <span :class="fontClassName">
    <i slot="suffix"
      class="iconfont"
      :class="iconClassName"></i>
    {{label}}
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: ['status'],
  data() {
    return {
      label: '',
      iconClassName: '',
      fontClassName: '',
    }
  },
  beforeMount() {
    switch (this.status) {
      case 'Offline':
        this.label = '掉线中'
        this.iconClassName = 'icon-pause'
        this.fontClassName = 'fc-warning'
        break
      case 'IsRunning':
        this.label = '工作中'
        this.iconClassName = 'icon-play'
        this.fontClassName = 'fc-success'
        break
      case 'NotRunning':
        this.label = '已停机'
        this.iconClassName = 'icon-stop'
        this.fontClassName = 'fc-error'
        break
      default:
        this.label = '未知状态'
        this.iconClassName = ''
        this.fontClassName = 'fc-error'
    }
  },
})
</script>
