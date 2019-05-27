<template>
    <list></list>
</template>

<script>
import List from '@/page/Main/Client/Layout/standard/ClientManagIndex/index.vue'
export default {
  name: '',
  props: {},
  data() {
    return {
      viewType: ''
    }
  },
  async created() {
  },
  methods: {
  },
  components: {
      'list': List
  },
  watch: {
    $route() {
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less">
@import "./zh-cn.less";
@import "./en.less";
</style>
