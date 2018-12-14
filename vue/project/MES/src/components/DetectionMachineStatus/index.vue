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
      iconClassName: 'icon-cam-up',
      fontClassName: '',
    }
  },
  beforeMount() {
    switch (this.status) {
      case 'Offline':
        this.label = '已掉线'
        this.fontClassName = 'fc-warning'
        break
      case 'S0':
        this.label = '已停机'
        this.fontClassName = 'fc-error'
        break
      case 'S1':
        this.label = '检测中'
        this.fontClassName = 'fc-success'
        break
      case 'S2':
        this.label = '未检测'
        this.fontClassName = 'fc-success'
        break
      case 'S3':
        this.label = '断线停机'
        this.fontClassName = 'fc-error'
        break
      case 'S4':
        this.label = '断线停机'
        this.fontClassName = 'fc-error'
        break
      case 'S9':
        this.label = '检测中'
        this.fontClassName = 'fc-success'
        break
      default:
        this.label = '未知状态'
        this.fontClassName = ''
    }
  },
})
</script>
