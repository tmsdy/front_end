<template>
  <div class="details-main">
    <h2>已出现疵点 5 个</h2>
    工作中
    设备检测中

    拍照设备开关

    <div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Moment from 'moment'
import MachineStatus from '@/components/MachineStatus/index.vue'
import Snapshot from '@/components/Snapshot/index.vue'

export default Vue.extend({
  mounted() {
    // this.$store.dispatch('machine/overview/fetchMachineStatus')
  },
  methods: {
    timeDuration(timeInSeconds: number) {
      return Moment(
        timeInSeconds + new Date().getTimezoneOffset() * 60 * 1e3,
      ).format('H小时m分s秒')
    },
  },
  data() {
    return {}
  },
  components: {
    MachineStatus,
    Snapshot,
  },
})
</script>

<style lang="stylus" scoped>
+b('details') {
  +e('main') {
    padding: 0 20px;
  }
}
</style>
