<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item v-for="(route,index) in breadcrumbList"
      :key="index">
      <router-link class="breadcrumb-item"
        :to="{name:route.name}">{{route.label}}</router-link>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts">
import Vue from 'vue'
import { RouteRecord } from 'vue-router'

type BreadcrumbItem = { name: string; label: string }

export default Vue.extend({
  mounted() {},
  computed: {
    breadcrumbList(): BreadcrumbItem[] {
      let breadcrumbItems: BreadcrumbItem[] = []
      this.$route.matched.forEach((route: RouteRecord) => {
        const breadcrumbItem: BreadcrumbItem = {
          name: route.name || '',
          label: route.name || '',
        }
        const breadcrumbConfig = route.meta.breadcrumb
        if (breadcrumbConfig !== undefined) {
          // 不在 breadcrumb 中显示该路由信息
          if (breadcrumbConfig.show === false) return
          // 根据配置显示文字
          switch (typeof breadcrumbConfig.label) {
            case 'function':
              breadcrumbItem.label = breadcrumbConfig.label(route, this.$route)
              break
            case 'string':
              breadcrumbItem.label = breadcrumbConfig.label
              break
            default:
          }
        }
        breadcrumbItems.push(breadcrumbItem)
      })
      return breadcrumbItems
    },
  },
  methods: {},
})
</script>

<style lang="stylus">
+b('breadcrumb') {
  +e('item') {
    font-size: 18px;
    color: #9f9f9f;
  }
}
</style>
