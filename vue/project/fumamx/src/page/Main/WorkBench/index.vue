<template>
    <div class="WorkBench">
        <div class="wrap">

            <breif-report v-if="isbriefReportShow" :data="getPannelData('breif-report')"></breif-report>
            <template v-for="(item,index) in oddComponent">
                <el-row :key="index" class="marginTop15">
                    <el-col :span="12">
                        <component :data="getPannelData(item)" v-bind:is="item"></component>
                    </el-col>

                    <template v-for="(evenitem,evenindex) in evenComponent">
                        <el-col :key="evenindex" :span="12" v-if="evenindex==index && evenitem!=''">
                            <component :data="getPannelData(evenitem)" v-bind:is="evenitem"></component>
                        </el-col>
                    </template>
                </el-row>
            </template>
            <!-- 来不及改江帅代码了，这里暂时写死 -->
            <itinerary :data="panelData" style="width:50%" v-if="panelData.length === 1 && panelData[0].statId == 2" />
        </div>
    </div>
</template>
<script>
import { isArray } from '@/libs/utils.js'
import { mapGetters } from 'vuex'
import BreifReport from './BriefReport/index'
import Itinerary from './Itinerary/index'
import Remind from './Remind/index'
import CustomerDistribution from './CustomerDistribution/index'
import MonthTrend from './MonthTrend/index'
import Activity from './Activity/index'
import DepartRank from './DepartRank/index'
export default {
    name: 'WorkBench',
    props: {},
    data() {
        return {
            isbriefReportShow: false,
            arrComponent: [], // 所有的组件
            evenComponent: [], // 奇数分组数组
            oddComponent: [], // 偶数分组数组
            briefReportIndex: -1,
            panelData: [], // 接口面板数据
            pannelobj: [], // 面板数据对象
            ctId: 0
        }
    },
    created() {
        let { ctId } = this.company
        this.ctId = ctId
        this.getStatPanel()
    },
    mounted() { },
    computed: {
        ...mapGetters(['navigator', 'company'])
    },
    methods: {
        // 接口获取工作台个人面板信息
        getStatPanel() {
            let _this = this
            var url = _this.Global.baseURL + _this.Global.api.v2.stat_panel_get
            _this.$http.get(url, {}).then(
                (res) => {
                    if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                        let data = res.body.data
                        _this.panelData = data
                        // console.log(data)
                        // console.log(data)
                        // console.log(data)
                        if (data.length === 1) {
                            // 来不及改江帅代码了，这里暂时写死
                            return
                        }
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
                                ctId: _this.ctId
                            }
                            _this.pannelobj.push(person)
                            _this.arrComponent.push(componentName)
                        }
                        var briefIndex = _.indexOf(_this.arrComponent, 'breif-report')
                        if (briefIndex > -1) {
                            _this.isbriefReportShow = true
                            _this.briefReportIndex = _.indexOf(_this.arrComponent, 'breif-report')
                        }
                        _this.arrComponent = _.without(_this.arrComponent, 'breif-report')
                        // console.log(_this.arrComponent);
                        for (var j = 0; j < _this.arrComponent.length; j++) {
                            if (j % 2 == 0) {
                                _this.pannelobj[j + 1].index = 1
                                _this.oddComponent.push(_this.arrComponent[j])
                            } else {
                                _this.pannelobj[j + 1].index = 2
                                _this.evenComponent.push(_this.arrComponent[j])
                            }
                        }
                    } else {
                        _this.$message.error(res.data.msg)
                    }
                    // console.log(_this.oddComponent);
                    // console.log(_this.evenComponent);
                },
                (res) => {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                }
            )
        },
        // 获取面板对象
        getPannelData(item) {
            if (item != undefined && item != '') {
                var resultObj = _.filter(this.pannelobj, (obj) => {
                    return obj.componentName == item
                })
                return resultObj
            }
        }
    },
    components: {
        'breif-report': BreifReport,
        'itinerary': Itinerary,
        'remind': Remind,
        'customer-distribution': CustomerDistribution,
        'activity': Activity,
        'depart-rank': DepartRank,
        'month-thrend': MonthTrend
    }
}
</script>
<style lang="less" rel="stylesheet/less">
@import "./zh-cn.less";
@import "./en.less";
</style>
