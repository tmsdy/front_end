<template>
  <div class="runninghours-main">
    <el-select v-model="value"
      placeholder="请选择"
      class="runninghours-factory__selection">
      <el-option v-for="item in selectList"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <gantt-chart :height="height"
      :chart-config="chartConfig"></gantt-chart>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Moment from 'moment'
import { toMoment, getReadableTime } from '@/utils/datetime'

import GanttChart from '@/components/GanttChart/index.vue'

export default Vue.extend({
  props: ['date'],
  data() {
    return {
      height: 375,
      value: -1,
      selectList: [],
      chartConfig: null,
      machineStatus: null,
    }
  },
  mounted() {
    this.refreshChart()
  },
  methods: {
    refreshChart() {
      const factoryId = this.$store.state.factory.id
      this.$http
        .get(`/mes/factory/${factoryId}/machine-statuses`, {
          params: {
            date: getReadableTime(this.date),
          },
        })
        .then(({ data }) => {
          if (data.machineStatusList !== null) {
            this.machineStatus = Object.freeze(data.machineStatusList)
            this.chartConfig = this.mkChartConfig(this.machineStatus)
            this.selectList = this.mkSelectList(this.machineStatus) as never[]
          } else {
            this.chartConfig = null
          }
        })
    },
    mkSelectList(raw: any): any[] {
      raw = JSON.parse(JSON.stringify(raw))
      const machineStatusSlice = raw.sort(
        (prev: any, next: any) => next.machineId - prev.machineId,
      )
      const list: any[] = machineStatusSlice.map((item: any) => {
        return {
          value: item.machineId,
          label: `${item.machineId}号机器`,
        }
      })
      list.unshift({
        label: '所有机器',
        value: -1,
      })
      return list
    },
    mkChartConfig(raw: any): any {
      raw = JSON.parse(JSON.stringify(raw))

      let data: any[] = []

      const machineStatusSlice = raw.sort(
        (prev: any, next: any) => next.machineId - prev.machineId,
      )

      const categories: string[] = machineStatusSlice.map(
        (MachineStatus: any) => '机器 ' + MachineStatus.machineId,
      )

      var startTime = Moment(this.date)
        .startOf('day')
        .valueOf()

      var types = {
        RUNNING: {
          color: '#E5E7E2',
          label: '开机',
        },
        NOT_RUNNING: {
          color: '#C76250',
          label: '关机',
        },
        LOST: {
          color: '#fff',
          label: '掉线',
        },
      }

      function mkItem(
        idx: number,
        start: number,
        end: number,
        label: string,
        color: string,
      ) {
        return {
          name: label,
          value: [idx, start, end, end - start],
          itemStyle: {
            normal: {
              color: color,
              borderWidth: 2,
              borderRadius: 2,
              shadowBlur: 4,
              shadowColor: '#DEDEDE',
              shadowOffsetX: 0,
              shadowOffsetY: 2,
              textShadowOffsetX: 0,
              textShadowOffsetY: 0,
            },
          },
        }
      }

      raw.forEach((machineStatus: any, idx: number) => {
        const formatedData = []
        const machineStatuses = machineStatus.machineStatuses
        for (let i = 0, j = machineStatuses.length; i < j; i++) {
          const cur = machineStatuses[i]
          const next = machineStatuses[i + 1]
          const start = toMoment(cur.startAt).valueOf()
          const end = toMoment(cur.endAt).valueOf()
          let type = types[cur.status as 'RUNNING' | 'NOT_RUNNING']

          formatedData.push(mkItem(idx, start, end, type.label, type.color))

          // 如果不连续，需要补充掉线的数据
          if (next !== undefined && cur.endAt !== next.startAt) {
            type = types['LOST']
            const nextStart = toMoment(next.startAt).valueOf()
            formatedData.push(
              mkItem(idx, end, nextStart, type.label, type.color),
            )
          }
        }
        data = data.concat(formatedData)
      })

      return {
        data,
        startTime,
        categories,
      }
    },
  },
  components: {
    GanttChart,
  },
  watch: {
    date(val) {
      this.refreshChart()
    },
    value(val) {
      if (val === -1) {
        this.chartConfig = this.mkChartConfig(this.machineStatus)
      } else {
        if (this.machineStatus !== null) {
          // @ts-ignore
          const idx = this.machineStatus.findIndex(
            (status: any) => status.machineId === val,
          )
          // @ts-ignore
          this.chartConfig = this.mkChartConfig([this.machineStatus[idx]])
        }
      }
    },
  },
})
</script>

<style lang="stylus">
+b('runninghours') {
  +e('main') {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  +e('factory') {
    +m('selection') {
      // margin-right: 50px;
    }
  }
}
</style>
