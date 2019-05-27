<template>
  <div class="dashboardBox BriefReport">
    <div class="workTitle">
      <span class="pull-right">
        <!-- 请选择 -->
        <el-select v-model="region" :placeholder="$t('mxpcweb.workbench.1530671363646')" size="small" @change="chageOption()">
          <el-option v-for="item in statinterval" :key="item.intervalCode" :value="item.intervalCode" :label="item.intervalName"> </el-option>
        </el-select>
      </span>
      <span class="name">{{pannelName}}</span>
    </div>
    <div class="workBody">
      <table class="inline">
        <tr>
          <td colspan="4">
            <!-- 新增 -->{{$t('mxpcweb.workbench.1530671409518')}}
          </td>
          <td :colspan="objectResults.length">
            <!-- 跟进 -->{{$t('mxpcweb.workbench.1530671424637')}}
          </td>
        </tr>
        <tr>
          <td>
            <strong class="text-hover" @click="toClient('BF001')">{{newCount}}</strong>
            <div>
              <!-- 客户数 -->{{$t('mxpcweb.workbench.1530686701602')}}
            </div>
          </td>
          <td>
            <strong class="text-hover" @click="toClient('BF004')">{{trackCount}}</strong>
            <div>
              <!-- 跟进数 -->
              {{$t('mxpcweb.workbench.1530672455895')}}
            </div>
          </td>
          <td>
            <strong>{{trackCustCount}}</strong>
            <div>
              <!-- 跟进客户数 -->
              {{$t('mxpcweb.workbench.1530672470013')}}
            </div>
          </td>
          <td>
            <strong>{{mailCount}}</strong>
            <div>
              <!-- 邮件数 -->
              {{$t('mxpcweb.workbench.1530672486079')}}
            </div>
          </td>
          <td v-for="item in objectResults" :key="item.dictItemCode">
            <strong class="text-hover" @click="toClient('BF004',{trackMode:item.dictItemCode})">{{item.count}}</strong>
            <div>{{item.itemName}}</div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import { isObject, setStore, getStore } from '@/libs/utils.js'
export default {
  name: 'BriefReport',
  props: ['data'],
  data() {
    return {
      region: '',
      pannelName: '',
      interval: 1,
      newCount: 0, // 客户数
      trackCount: 0, // 跟进数
      trackCustCount: 0, // 客户跟进数
      mailCount: 0, // 邮件数
      startId: 1,
      objectResults: [], // 跟进统计数据
      addCount: [], // 客户统计数据
      ctId: 0,
      statinterval: []
    }
  },
  created() {
    if (this.data.length > 0) {
      this.pannelName = this.data[0].statname
      this.ctId = this.data[0].ctId
      this.startId = this.data[0].statid

      let selectedinterval = getStore('briefreportinterval')
      var selectinterval
      if (selectedinterval != undefined && selectedinterval != '') {
        selectinterval = selectedinterval
      } else {
        selectinterval = this.data[0].selectinterval
        setStore('briefreportinterval', selectinterval)
      }
      this.interval = selectinterval

      this.statinterval = this.data[0].statinterval
      var cname = this.getName(this.interval)
      this.region = cname
      this.getBriefReportData()
    }
  },
  mounted() { },
  methods: {
    // 获取面板对象
    getName(itemCode) {
      var itemName = ''
      for (var i = 0; i < this.statinterval.length; i++) {
        if (this.statinterval[i].intervalCode == itemCode) {
          itemName = this.statinterval[i].intervalName
          return itemName
        }
      }
    },

    getIntervalName(interval) {
      if (interval == '1') {
        /* '今日' */
        this.region = this.$t('mxpcweb.workbench.1530672603035')
      }
      if (interval == '2') {
        /* '本周' */
        this.region = this.$t('mxpcweb.workbench.1530672871996')
      }

      if (interval == '3') {
        /* '本月' */
        this.region = this.$t('mxpcweb.workbench.1530672883646')
      }
      if (interval == '4') {
        /* '本年' */
        this.region = this.$t('mxpcweb.workbench.1530672896949')
      }
      if (interval == '5') {
        /* '去年' */
        this.region = this.$t('mxpcweb.workbench.1530672907991')
      }
      if (interval == '6') {
        /* '最近6月' */
        this.region = this.$t('mxpcweb.workbench.1530672921916')
      }
      if (interval == '7') {
        /* '最近12个月' */
        this.region = this.$t('mxpcweb.workbench.1530672938092')
      }
      if (interval == '8') {
        /* '全部' */
        this.region = this.$t('mxpcweb.workbench.1530672950422')
      }
    },

    getIntervalByName(IntervalName) {
      var currentInterval = 1
      /* '今日' */
      if (IntervalName == this.$t('mxpcweb.workbench.1530672603035')) {
        currentInterval = 1
      }
      /* '本周' */
      if (IntervalName == this.$t('mxpcweb.workbench.1530672871996')) {
        currentInterval = 2
      }

      /* '本月' */
      if (IntervalName == this.$t('mxpcweb.workbench.1530672883646')) {
        currentInterval = 3
      }

      /* '本年' */
      if (IntervalName == this.$t('mxpcweb.workbench.1530672896949')) {
        currentInterval = 4
      }
      /* '去年' */
      if (IntervalName == this.$t('mxpcweb.workbench.1530672907991')) {
        currentInterval = 5
      }
      /* '最近6个月' */
      if (IntervalName == this.$t('mxpcweb.workbench.1530672921916')) {
        currentInterval = 6
      }
      /* '最近12个月' */
      if (IntervalName == this.$t('mxpcweb.workbench.1530672938092')) {
        currentInterval = 7
      }
      /* '全部' */
      if (IntervalName == this.$t('mxpcweb.workbench.1530672950422')) {
        currentInterval = 8
      }
      return currentInterval
    },

    // 接口获取工作简报数据
    getBriefReportData() {
      let _this = this
      var url = _this.Global.baseURL + _this.Global.api.v2.stat_pers_get
      _this.$http
        .get(url, {
          params: {
            statId: this.startId,
            interval: this.interval,
            staffId: this.ctId
          }
        })
        .then(
          (res) => {
            if (
              res.body.code.toString() == _this.Global.RES_OK &&
              isObject(res.body.data)
            ) {
              // console.log(res.body);
              this.objectResults = res.body.data.objectResults.trackCount
              this.addCount = res.body.data.objectResults.addCount
              this.newCount = this.addCount.newCount
              this.trackCount = this.addCount.trackCount
              this.trackCustCount = this.addCount.trackCustCount
              this.mailCount = this.addCount.mailCount
            } else {
              _this.$message.error(res.data.msg)
            }
          },
          (res) => {
            _this.$message.error(_this.$t(_this.Global.errorTitle))
          }
        )
    },

    chageOption() {
      var selectRegin = this.region
      this.interval = selectRegin
      setStore('briefreportinterval', this.interval)
      this.getBriefReportData()
    },
    toClient(modelCode, obj, timeType, is) { // 跳转客户
      let _this = this
      let data = {
        modelCode: modelCode,
        interval: _this.interval,
        argument: {}
      }
      if (obj) {
        data.argument = obj
      };
      data.argument.ownerCtId = _this.ctId
      if (timeType) {
        data.timeType = timeType
      };
      _this.toClient_g(data)
    }
  },
  components: {}
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
