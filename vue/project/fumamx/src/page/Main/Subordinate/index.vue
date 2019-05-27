<template>
  <div class="Subordinate">
      <tree-menu @action="action" @departaction="departaction"></tree-menu>

      <div class="rightWindow MXscroll" v-loading="isLoading">

          <template v-for="(item,index) in oddComponent">
                  <el-row :key="index" class="marginTop15"  v-if="item!='dept-monthTrend'">
                       <el-col :span="12" >
                           <component  :data="getPannelData(item)"  v-bind:is="item" ></component>
                       </el-col>
                      <template v-for="(evenitem,evenindex) in evenComponent">
                        <el-col :key="evenindex" :span="12" v-if="evenindex==index && evenitem!=''">
                          <component   :data="getPannelData(evenitem)"  v-bind:is="evenitem" ></component>
                       </el-col>
                     </template>
                </el-row>
                <el-row :key="index" class="marginTop15"  v-else>
                     <el-col :span="24" >
                      <component  :data="getPannelData(item)"  v-bind:is="item" ></component>
                     </el-col>
                </el-row>
        </template>
        <dept-briefreport v-if="isdeptbriefReportShow" :data="getPannelData('dept-briefreport')" class="marginTop15"></dept-briefreport>
        <dept-actcustDist v-if="isdeptactCustdistShow" :data="getPannelData('dept-actcustDist')" class="marginTop15"></dept-actcustDist>
        <breif-report v-if="isbriefReportShow" :data="getPannelData('breif-report')" class="marginTop15"></breif-report>

      </div>

  </div>
</template>
<script>
import { isArray } from '@/libs/utils.js'
import TreeMenu from './TreeMenu/index.vue'

import BreifReport from '@/page/Main/WorkBench/SubBriefReport/index'
import Itinerary from '@/page/Main/WorkBench/SubItinerary/index'
import Remind from '@/page/Main/WorkBench/Remind/index'
import CustomerDistribution from '@/page/Main/WorkBench/CustomerDistribution/index'
import MonthTrend from '@/page/Main/WorkBench/MonthTrend/index'
import Activity from '@/page/Main/WorkBench/Activity/index'
import DepartRank from '@/page/Main/WorkBench/DepartRank/index'

import DeptBriefReport from '@/page/Main/WorkBench/DeptBriefReport/index'
import DeptDepartRank from '@/page/Main/WorkBench/DeptDepartRank/index'
import DeptCustomerOverview from '@/page/Main/WorkBench/DeptCustomerOverview/index'
import DeptCustDist from '@/page/Main/WorkBench/DeptCustDist/index'
import DeptMonthTrend from '@/page/Main/WorkBench/DeptMonthTrend/index'
import DeptActivity from '@/page/Main/WorkBench/DeptActivity/index'
import DeptActCustDist from '@/page/Main/WorkBench/DeptActCustDist/index'

export default {
  name: 'Subordinate',
  props: {},
  data() {
    return {
      isLoading: true,
      arrComponent: [], // 所有的组件
      evenComponent: [], // 奇数分组数组
      oddComponent: [], // 偶数分组数组
      briefReportIndex: -1,
      panelData: [], // 接口面板数据
      pannelobj: [], // 面板数据对象
      ctId: 0,
      isdeptbriefReportShow: false,
      isbriefReportShow: false,
      isdeptactCustdistShow: false
    }
  },
  methods: {
    getPannelData(item) {
      if (item != undefined && item != '') {
        var resultObj = _.filter(this.pannelobj, function(obj) {
          return obj.componentName == item
        })
        return resultObj
      }
    },

    // 点击下属人员回调
    action(item) {
      if (item != undefined) {
        this.isbriefReportShow = false
        this.isdeptbriefReportShow = false
        this.isdeptactCustdistShow = false
        this.arrComponent = []
        this.evenComponent = []
        this.oddComponent = []
        this.briefReportIndex = -1
        this.panelData = []
        this.pannelobj = []
        if (item.companies.length > 0) {
          this.ctId = item.companies[0].ctId
          this.getPersonPannelData()
        }
      }
    },

    // 获取部门的面板信息
    departaction(item) {
      this.isbriefReportShow = false
      this.isdeptbriefReportShow = false
      this.isdeptactCustdistShow = false
      this.arrComponent = []
      this.evenComponent = []
      this.oddComponent = []
      this.briefReportIndex = -1
      this.panelData = []
      this.pannelobj = []
      var dept = [{ deptName: item.deptName, dkey: item.dkey }]
      let _this = this
      var url = _this.Global.baseURL + _this.Global.api.v2.stat_dept_panel_get
      this.isLoading = true
      _this.$http.get(url, { params: { dkey: item.dkey } }).then((res) => {
          this.isLoading = false
          if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
            let data = res.body.data
            this.panelData = data
            var jsonData = data
            for (var i = 0; i < jsonData.length; i++) {
              var statname = jsonData[i].statName
              var statid = jsonData[i].statId
              var statmode = jsonData[i].statMode
              var statinterval = jsonData[i].statInterval
              var enstatname = jsonData[i].statName
              var selectinterval = jsonData[i].selectInterval
              var dicts = jsonData[i].dicts
              var depts = dept
              var componentName = ''
              if (statid == '8') {
                componentName = 'dept-briefreport'
              } else if (statid == '9') {
                componentName = 'dept-actcustDist'
              } else if (statid == '10') {
                componentName = 'dept-departrank'
              } else if (statid == '11') {
                componentName = 'deptcustomer-overview'
              } else if (statid == '12') {
                componentName = 'dept-custdist'
              } else if (statid == '13') {
                componentName = 'dept-activity'
              } else if (statid == '14') {
                componentName = 'dept-monthTrend'
              }
              var person = {
                componentName: componentName,
                statname: statname,
                statid: statid,
                statmode: statmode,
                statinterval: statinterval,
                enstatname: enstatname,
                selectinterval: selectinterval,
                dicts: dicts,
                depts: depts,
                index: 1,
                ctId: this.ctId
              }
              this.pannelobj.push(person)
              this.arrComponent.push(componentName)
            }
            var briefdepartIndex = _.indexOf(
              this.arrComponent,
              'dept-briefreport'
            )
            if (briefdepartIndex > -1) {
              this.isdeptbriefReportShow = true
            }
            this.arrComponent = _.without(
              this.arrComponent,
              'dept-briefreport'
            )

            var deptactcustdistIndex = _.indexOf(
              this.arrComponent,
              'dept-actcustDist'
            )
            if (deptactcustdistIndex > -1) {
              this.isdeptactCustdistShow = true
            }
            this.arrComponent = _.without(
              this.arrComponent,
              'dept-actcustDist'
            )

            for (var j = 0; j < this.arrComponent.length; j++) {
              if (j % 2 == 0) {
                this.pannelobj[j + 2].index = 1
                this.oddComponent.push(this.arrComponent[j])
              } else {
                this.pannelobj[j + 2].index = 2
                this.evenComponent.push(this.arrComponent[j])
              }
            }
          } else if (res.body.code.toString() == _this.Global.RES_OK) {
            _this.$message.error(res.data.msg)
          } else {
            _this.$message.error(res.data.msg)
          }
        }, (res) => {
          _this.$message.error(_this.$t(_this.Global.errorTitle))
        }
      )
    },
    // 获取下属人员的面板信息
    getPersonPannelData() {
      let _this = this
      var url = _this.Global.baseURL + _this.Global.api.v2.stat_panel_get
      this.isLoading = true
      _this.$http.get(url, { params: { staffId: this.ctId } }).then((res) => {
        this.isLoading = false
          if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
            let data = res.body.data
            this.panelData = data
            var jsonData = data
            for (var i = 0; i < jsonData.length; i++) {
              var statname = jsonData[i].statName
              var statid = jsonData[i].statId
              var statmode = jsonData[i].statMode
              var statinterval = jsonData[i].statInterval
              var enstatname = jsonData[i].statName
              var selectinterval = jsonData[i].selectInterval
              var dicts = jsonData[i].dicts
              var depts = jsonData[i].depts
              var componentName = ''
              if (statid == '1') {
                componentName = 'breif-report'
              } else if (statid == '2') {
                componentName = 'itinerary'
              } else if (statid == '3') {
                componentName = 'remind'
              } else if (statid == '4') {
                componentName = 'customer-distribution'
              } else if (statid == '5') {
                componentName = 'activity'
              } else if (statid == '6') {
                componentName = 'depart-rank'
              } else if (statid == '7') {
                componentName = 'month-thrend'
              }

              var person = {
                componentName: componentName,
                statname: statname,
                statid: statid,
                statmode: statmode,
                statinterval: statinterval,
                enstatname: enstatname,
                selectinterval: selectinterval,
                dicts: dicts,
                depts: depts,
                index: 1,
                ctId: this.ctId
              }
              this.pannelobj.push(person)
              this.arrComponent.push(componentName)
            }

            var briefIndex = _.indexOf(this.arrComponent, 'breif-report')
            if (briefIndex > -1) {
              this.isbriefReportShow = true
              this.briefReportIndex = _.indexOf(
                this.arrComponent,
                'breif-report'
              )
            }
            this.arrComponent = _.without(this.arrComponent, 'breif-report')

            for (var j = 0; j < this.arrComponent.length; j++) {
              if (j % 2 == 0) {
                this.pannelobj[j + 1].index = 1
                this.oddComponent.push(this.arrComponent[j])
              } else {
                this.pannelobj[j + 1].index = 2
                this.evenComponent.push(this.arrComponent[j])
              }
            }
          } else if (res.body.code.toString() == _this.Global.RES_OK) {
            _this.$message.error(res.data.msg)
          } else {
            _this.$message.error(res.data.msg)
          }
        }, (res) => {
          _this.$message.error(_this.$t(_this.Global.errorTitle))
        }
      )
    }
  },
  components: {
    'tree-menu': TreeMenu,

    'breif-report': BreifReport,
    'itinerary': Itinerary,
    'remind': Remind,
    'customer-distribution': CustomerDistribution,
    'activity': Activity,
    'depart-rank': DepartRank,
    'month-thrend': MonthTrend,

    'dept-briefreport': DeptBriefReport,
    'dept-actcustDist': DeptActCustDist,
    'dept-departrank': DeptDepartRank,
    'deptcustomer-overview': DeptCustomerOverview,
    'dept-custdist': DeptCustDist,
    'dept-monthTrend': DeptMonthTrend,
    'dept-activity': DeptActivity
  }
}
</script>
<style lang="less" rel="stylesheet/less">
@import "./zh-cn.less";
@import "./en.less";
</style>
