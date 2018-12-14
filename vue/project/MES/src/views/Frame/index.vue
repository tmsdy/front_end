<template>
  <div class="app-main">
    <Sidebar class="app-sidebar"
      :menus="menus"></Sidebar>
    <Header class="app-header"></Header>
    <Content class="app-content">
      <router-view />
    </Content>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Header from '@/components/Header/index.vue'
import Sidebar from '@/components/Sidebar/index.vue'
import Content from '@/components/Content/index.vue'

export default Vue.extend({
  data() {
    return {
      menus: [
        { label: '生产效率', to: { name: '生产效率' } },
        { label: '后台管理', to: { name: '后台管理' }, permission: 'mes/.*' },
      ],
    }
  },
  components: {
    Sidebar,
    Header,
    Content,
    // Navbar,
  },
  mounted() {
    document.title = `${document.title} - ${this.$store.state.factory.name}`
  },
})
</script>

<style lang="stylus">
+b('app') {
  +e('main') {
    width: 100%;
    height: 100%;
    background: #FCFCFC;
    display: grid;
    grid-template: 'sidebar header' 60px 'sidebar content' calc(100% - 60px) / 120px 1fr;
  }

  +e('sidebar') {
    grid-area: sidebar;
  }

  +e('header') {
    grid-area: header;
  }

  +e('content') {
    grid-area: content;
    overflow: hidden;
  }
}
</style>
