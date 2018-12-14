<template>
  <div class="navbar-main">
    <Breadcrumb />
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { RouteRecord } from 'vue-router'
import Breadcrumb from '@/components/Breadcrumb/index.vue'

export default Vue.extend({
  mounted() {},
  computed: {
    breadcrumbList(): RouteRecord[] {
      const route: RouteRecord[] = this.$route.matched
      return route.splice(1)
    },
  },
  methods: {},
  components: {
    Breadcrumb,
  },
})
</script>

<style lang="stylus">
+b('navbar') {
  +e('main') {
    flex-shrink: 0;
    height: 40px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  +e('item') {
    font-size: 18px;
    color: #9f9f9f;
  }
}
</style>
