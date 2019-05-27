<template>
    <div class="logStatistics">
        <button class="emptyingLog" @click="cleanLog()">清空日志</button>
        <div v-for="(item,index) in logs" :key="index">
            <p class="pageName">页面地址：{{ item.pageName }} &nbsp;&nbsp; 请求次数:{{ item.log.length }}次 &nbsp;&nbsp; 页面用时: {{ pageTime(item.pageName) }}s</p>
            <table class="table">
                <thead>
                    <tr>
                        <th colspan="5" style="width:50%;">request</th>
                        <th colspan="6" style="width:50%;">response</th>
                    </tr>
                    <tr>
                        <th>number</th>
                        <th>url</th>
                        <th>method</th>
                        <th>params</th>
                        <th>body</th>
                        <th>code</th>
                        <th>data</th>
                        <th>msg</th>
                        <th>javaApiTime(s) > 0.2</th>
                        <th>nodeApiTime(s) > 0.2</th>
                        <th>FEApiTime(s) > 0.5</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in item.log" :key="index">
                        <td style="text-align: center;">{{ index + 1 }}</td>
                        <td>{{ item.request.url }}</td>
                        <td>{{ item.request.method }}</td>
                        <td>{{ item.request.params }}</td>
                        <td>{{ item.request.body }}</td>
                        <td>{{ item.response.body.code }}</td>
                        <td></td>
                        <td>{{ item.response.body.msg }}</td>
                        <td :class="item.response.body.javaApiTime > 0.2 ? 'red' : ''">{{ item.response.body.javaApiTime }}</td>
                        <td :class="(item.FEApiTime - item.response.body.javaApiTime).toFixed(2) > 0.2 ? 'red' : ''">{{ (item.FEApiTime - item.response.body.javaApiTime).toFixed(2) }}</td>
                        <td :class="item.FEApiTime > 0.5 ? 'red' : ''">{{ item.FEApiTime }}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <td>合计用时</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{{ (item.javaApiTimeAll).toFixed(2) }}</td>
                    <td>{{ (item.nodeApiTimeAll).toFixed(2) }}</td>
                    <td>{{ (item.FEApiTimeAll).toFixed(2) }}</td>
                </tfoot>
            </table>
        </div>
    </div>
</template>

<script>
// {{ item.response.body.data }}
export default {
  name: 'logStatistics',
  data () {
    return {
      logs: []
    }
  },
  created () {
    let requestLogObj = window.requestLog
    Object.keys(requestLogObj).forEach(key => {
      let log = requestLogObj[key]
      let obj = {
        pageName: key,
        log: log,
        javaApiTimeAll: 0,
        nodeApiTimeAll: 0,
        FEApiTimeAll: 0
      }
      // 统计时间
      log.forEach((item) => {
        if (!isNaN(item.response.body.javaApiTime)) {
          obj.javaApiTimeAll += item.response.body.javaApiTime
        }

        if (!isNaN(item.FEApiTime)) {
          obj.FEApiTimeAll += item.FEApiTime
        }

        obj.nodeApiTimeAll = (obj.FEApiTimeAll - obj.javaApiTimeAll)
      })
      this.logs.push(obj)
    })
  },
  methods: {
    cleanLog () {
      window.requestLog = {}
      this.logs = []
    },
    pageTime (pageName) {
      return pageTime[pageName].useTime || 0
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.logStatistics {
    .emptyingLog{
        width: 100px;
        height: 30px;
        position: fixed;
        top: 0px;
        right: 100px;
    }
    width: 100%;
    height: 100%;
    overflow-y: auto;
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    z-index: 10;
    //background-color: rgba(255, 255, 255, 0.5);
    background-color: #ffffff;
    opacity: 0.92;
    .pageName {
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        text-indent: 15px;
    }
    .table{
        width:100%;
        border-collapse: collapse;
        border: 1px #000 solid;
        th,td{
            text-align: left;
            text-align:justify;
            border: 1px #cccccc solid;
            text-align: left;
        }
    }
    .red{
        color: red;
    }
}
</style>
