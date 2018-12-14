<template>
  <el-table :data="tableData"
    stripe
    :height="'100%'"
    :default-sort="{prop: 'flawCount', order: 'descending'}"
    style="width: 100%">
    <el-table-column prop="machineName"
      label="机器名称">
    </el-table-column>
    <el-table-column prop="flawCount"
      label="瑕疵数量"
      sortable>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import Vue from 'vue'
import Moment from 'moment'

export default Vue.extend({
  props: ['date'],
  mounted() {
    this.$store.dispatch('productivity/flaw/fetchFlawData')
  },
  data() {
    return {}
  },
  computed: {
    tableData(): any {
      const flawState = this.$store.state.productivity.flaw
      if (flawState.totalCount > 0) {
        const formatedData = flawState.flawRawData.map((item: any) => {
          item.machineName = '机器' + item.machineId
          return item
        })
        return formatedData
      }
      return []
    },
  },
  methods: {},
  watch: {
    date() {},
  },
})
</script>
