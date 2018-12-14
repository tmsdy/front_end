<template>
  <div class="content-main">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {}
  },
  methods: {},
})
</script>

<style lang="stylus">
+b('content') {
  +e('main') {
    padding: 20px 30px 0 30px;
  }
}
</style>
