<template>
  <div class="page-header"
    style="overflow:hidden;">
    <Navbar>
      <el-date-picker v-model="date"
        align="center"
        type="date"
        placeholder="选择日期"
        :picker-options="pickerOptions">
      </el-date-picker>
    </Navbar>
    <div class="bigtabs-tabs">
      <router-link class="bigtabs-tab"
        :to="{name:'效率评分',query:{date:getReadableDateString}}">
        {{getDate}}效率评分
        <div>
          <span class="bigtabs-tab__number">{{$store.state.productivity.productivityScore}}</span>分
        </div>
      </router-link>
      <router-link class="bigtabs-tab"
        :to="{name:'平均工作时间',query:{date:getReadableDateString}}">
        {{getDate}}平均工作时间
        <div>
          <span class="bigtabs-tab__number">{{$store.state.productivity.runningHours}}</span>小时/台
        </div>
      </router-link>
      <router-link class="bigtabs-tab"
        :to="{name:'瑕疵总个数',query:{date:getReadableDateString}}">
        {{getDate}}瑕疵总个数
        <div>
          <span class="bigtabs-tab__number">{{$store.getters['productivity/flaw/flawCount']}}</span>个
        </div>
      </router-link>
    </div>
    <div class="bigtabs-content">
      <keep-alive>
        <router-view :date="date"></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Moment from 'moment'
import Navbar from '@/components/Navbar/index.vue'
import { getDateString, getReadableTime, toMoment } from '@/utils/datetime'

export default Vue.extend({
  data() {
    return {
      pickerOptions: {
        disabledDate(time: any) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker: any) {
              picker.$emit('pick', new Date())
            },
          },
          {
            text: '昨天',
            onClick(picker: any) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            },
          },
          {
            text: '一周前',
            onClick(picker: any) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            },
          },
        ],
      },
      date: new Date(),
    }
  },
  mounted() {
    this.initDate()

    this.$store.dispatch('productivity/refreshStatus')
  },
  computed: {
    getDate(): any {
      return getDateString(this.date)
    },
    getReadableDateString(): string {
      return Moment(this.date).format('YYYYMMDD')
    },
  },
  methods: {
    initDate() {
      const qryDate = this.$route.query.date
      const date = qryDate ? new Date(toMoment(qryDate).valueOf()) : new Date()
      this.date = date
    },
  },
  components: {
    Navbar,
  },
  watch: {
    date(val, pre) {
      this.$router.replace({
        name: this.$route.name,
        query: {
          date: Moment(val).format('YYYYMMDD'),
        },
      })
      this.$store.commit('productivity/setDateTime', val)
      this.$store.dispatch('productivity/refreshStatus')
    },
  },
})
</script>

<style lang="stylus">
.page-header {
  height: 100%;
  display: flex;
  flex-direction: column;
  // height: 40px;
  // display: flex;
  // flex-direction: row;
  // justify-content: space-between;
  // align-items: center;
}
</style>
