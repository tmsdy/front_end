<template>
  <div class="overview-main">
    <router-link class="overview-row"
      v-for="(record,idx) in $store.state.machine.overview.machineStatus"
      :key="idx"
      :to="'./'+idx">
      <div class="overview-column"
        style="width:100px">{{idx}} 号机器</div>
      <div class="overview-column"
        style="width:100px">
        <machine-status :status="record.mesMachine.status"></machine-status>
      </div>
      <div class="overview-column fc-gray">停机时间：{{timeDuration(record.todayNotRunningInSeconds)}}</div>
      <div class="overview-column">
        <detection-machine-status :status="record.detectionMachine.status"></detection-machine-status>
      </div>
    </router-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Moment from 'moment'
import MachineStatus from '@/components/MachineStatus/index.vue'
import DetectionMachineStatus from '@/components/DetectionMachineStatus/index.vue'

export default Vue.extend({
  mounted() {
    this.$store.dispatch('machine/overview/fetchMachineStatus')
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
    DetectionMachineStatus,
  },
})
</script>

<style lang="stylus">
+b('overview') {
  +e('main') {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    overflow-y: auto;
  }

  +e('row') {
    height: 80px;
    box-shadow: 0 2px 4px 0 rgba(222, 222, 222, 0.5);
    background-color: #ffffff;
    border: solid 1px #f0f0f0;
    padding: 0 20px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    flex-shrink: 0;

    &:hover {
      border: 1px solid #6EA6E8;
      box-shadow: 0 2px 4px 1px rgba(166, 164, 164, 0.5);
    }
  }

  +e('column') {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    align-items: center;
  }
}
</style>
