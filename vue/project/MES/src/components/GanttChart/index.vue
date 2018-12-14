<template>
  <div style="width:100%;">
    <div ref="chart"
      :style="{width:'100%','height':height+'px'}" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Moment from 'moment'
import ECharts from 'echarts/lib/echarts'
import 'echarts/lib/chart/custom'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/dataZoom'
import { toMoment } from '@/utils/datetime'

let chart: ECharts.ECharts

export default Vue.extend({
  props: ['height', 'chartConfig'],
  mounted() {
    chart = ECharts.init(this.$refs['chart'] as HTMLDivElement)
    if (this.chartConfig) {
      this.refreshChart(this.chartConfig)
    }
  },
  methods: {
    refreshChart(config: any) {
      const options = this.getOptions(config)
      chart.setOption(options)
    },
    getOptions({ data, categories, startTime }: any) {
      let height = this.height
      let maxNum = height / 50
      let startPoint = Math.floor(100 - (maxNum / categories.length) * 100)

      function renderItem(params: any, api: any) {
        var categoryIndex = api.value(0)
        var start = api.coord([api.value(1), categoryIndex])
        var end = api.coord([api.value(2), categoryIndex])
        var height = api.size([0, 1])[1] * 0.6

        var rectShape = ECharts.graphic.clipRectByRect(
          {
            x: start[0],
            y: start[1] - height / 2,
            width: end[0] - start[0],
            height: height,
          },
          {
            x: params.coordSys.x,
            y: params.coordSys.y,
            width: params.coordSys.width,
            height: params.coordSys.height,
          },
        )

        return (
          rectShape && {
            type: 'rect',
            shape: rectShape,
            style: api.style(),
          }
        )
      }

      const options = {
        animation: false,
        tooltip: {
          axisPointer: {
            type: 'cross',
          },
          formatter(params: any) {
            const values = params.data.value
            const startTime = Moment(values[1]).format('HH:mm:ss')
            const endTime = Moment(values[2]).format('HH:mm:ss')
            const duration = Moment(
              values[3] + new Date().getTimezoneOffset() * 60 * 1e3,
            ).format('H小时m分s秒')

            return (
              `${categories[values[0]]}：<b>${params.data.name}</b> <br/>` +
              `时间：<b>${startTime} ~ ${endTime}</b><br/>` +
              `共计 <span style="color:#BD764C;"><b>${duration}</b></span>`
            )
          },
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#f0f0f0',
          textStyle: {
            color: '#111',
          },
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
        },
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'weakFilter',
            height: 20,
            bottom: 0,
            start: -26,
            end: 126,
            handleIcon:
              'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '100%',
            showDetail: false,
          },
          {
            type: 'slider',
            yAxisIndex: 0,
            zoomLock: true,
            width: 5,
            right: 10,
            top: 20,
            bottom: 50,
            start: startPoint,
            end: 100,
            handleSize: 0,
            showDetail: false,
            fillerColor: '#9B9B9B',
            borderColor: '#f8f8f8',
          },
          {
            type: 'inside',
            yAxisIndex: 0,
            start: 95,
            end: 100,
            zoomOnMouseWheel: false,
            moveOnMouseMove: true,
            moveOnMouseWheel: true,
          },
        ],
        grid: {
          top: 10,
          left: 100,
          right: 50,
          bottom: 50,
        },
        xAxis: {
          scale: true,
          axisLabel: {
            formatter(val: any) {
              return (
                Math.ceil(Math.max(0, val - startTime) / 1000 / 3600) + ':00'
              )
            },
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            alignWithLabel: true,
          },
          axisPointer: {
            type: 'line',
            label: {
              show: false,
            },
            lineStyle: {
              color: '#979797',
              type: 'solid',
              width: 2,
            },
          },
          min: startTime,
          max: startTime + 1000 * 3600 * 24,
          minInterval: 1000 * 3600 * 2,
          maxInterval: 1000 * 3600 * 2,
        },
        yAxis: {
          data: categories,
          axisLine: {
            show: false,
          },
          axisLabel: {
            show: true,
            formatter: '{value}',
            backgroundColor: '#fff',
            borderWidth: 2,
            borderRadius: 2,
            padding: 10,
            color: '#000',
            fontSize: 14,
            shadowBlur: 4,
            shadowColor: '#DEDEDE',
            shadowOffsetX: 0,
            shadowOffsetY: 2,
            lineHeight: 20,
            textShadowOffsetX: 0,
            textShadowOffsetY: 0,
          },
          axisPointer: {
            show: false,
          },
        },
        series: [
          {
            type: 'custom',
            renderItem: renderItem,
            encode: {
              x: [1, 2],
              y: 0,
            },
            data: data,
          },
        ],
      }
      return options
    },
  },
  watch: {
    chartConfig(val) {
      this.refreshChart(val)
    },
  },
})
</script>
