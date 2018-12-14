<template>
  <div ref="chart"
    style="width:100%;height:400px;" />
</template>

<script lang="ts">
import Vue from 'vue'
import Moment from 'moment'
import ECharts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/markLine'

const options = {
  title: {
    left: 'center',
    text: '30 天效率对比',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
    },
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    textStyle: {
      color: '#111',
    },
    extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
  },
  grid: {
    left: 50,
    right: 50,
    top: 60,
    bottom: 40,
  },
  xAxis: [
    {
      type: 'time',
      name: '日期',
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        onZero: false,
        lineStyle: {
          color: '#bebebe',
        },
      },
      splitLine: {
        show: false,
      },
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#979797',
          type: 'solid',
          width: 2,
        },
      },
      // force split by 5 days
      minInterval: 1000 * 3600 * 24 * 5,
      maxInterval: 1000 * 3600 * 24 * 5,
    },
  ],
  yAxis: [
    {
      type: 'value',
      name: '效率评分',
      axisLabel: {
        color: '#bebebe',
      },
      nameTextStyle: {
        color: '#bebebe',
        fontSize: 14,
        height: 30,
      },
      axisLine: {
        show: false,
      },
      splitLine: {
        color: '#bebebe',
      },
      min: 0,
      max: 100,
      minInterval: 20,
      maxInterval: 20,
    },
  ],
  series: [
    {
      name: '效率评分',
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: {
        width: 4,
        color: {
          type: 'linear',
          x: 0,
          y: 1,
          x2: 1,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: '#664998', // 0% 处的颜色
            },
            {
              offset: 1,
              color: '#0ba7b8', // 100% 处的颜色
            },
          ],
        },
      },
      markLine: {
        data: [
          [
            {
              name: '',
              yAxis: 0,
              xAxis: '2018/08/19',
              symbol: 'none',
              lineStyle: {
                color: '#979797',
                type: 'solid',
                width: 2,
              },
            },
            {
              yAxis: 100,
              xAxis: '2018/08/19',
              symbol: 'none',
            },
          ],
        ],
      },
      data: [] as Array<[string, number | null]>,
    },
  ],
}

let chart: ECharts.ECharts

export default Vue.extend({
  data() {
    return {
      options,
    }
  },
  mounted() {
    chart = ECharts.init(this.$refs['chart'] as HTMLDivElement)
  },
  methods: {
    mkOptions(
      currentDate: Date,
      data: Array<[string, number | null]>,
    ): typeof options {
      options.series[0].data = data
      options.series[0].markLine.data[0][0].xAxis = Moment(currentDate).format(
        'YYYY/MM/DD',
      )
      options.series[0].markLine.data[0][1].xAxis = Moment(currentDate).format(
        'YYYY/MM/DD',
      )
      return options
    },
  },
  watch: {
    '$store.state.productivity.date'(val) {
      this.$store
        .dispatch('productivity/score/fetchMachineRunningStatus')
        .then(() => {
          const getter = 'productivity/score/machineRunningStatusData'
          const newOptions = this.mkOptions(val, this.$store.getters[getter])
          chart.setOption(options)
        })
    },
  },
})
</script>
