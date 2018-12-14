<template>
  <div class="manage-main">
    <h1>Hello</h1>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Moment from 'moment'
import Navbar from '@/components/Navbar/index.vue'
import { getDateString, getReadableTime, toMoment } from '@/utils/datetime'

export default Vue.extend({
  data() {
    return {}
  },
  mounted() {},
  computed: {},
  methods: {},
  components: {
    Navbar,
  },
  watch: {},
})
</script>

<style lang="stylus">
.manage-main {
}
</style>
