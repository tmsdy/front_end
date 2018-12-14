<template>
  <div class="page-header">
    <Navbar>
      <div style="width:220px;">
        <el-input placeholder="搜索机器"
          prefix-icon="el-icon-search"
          v-model="value">
        </el-input>
      </div>
    </Navbar>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Navbar from '@/components/Navbar/index.vue'

export default Vue.extend({
  data() {
    return {
      value: '',
    }
  },
  components: {
    Navbar,
  },
})
</script>
