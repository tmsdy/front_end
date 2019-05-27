<template>
    <div class="billCount">
        <!--Charts-->
        <ul class="charts">
            <li>
                <div class="chartBox" id="useDaychart"></div>
                <!-- 到期时间 -->
                <i style="background:#FF7165;"></i>{{$t('mxpcweb.systemset.applicationcenter.1530252220214')}} {{item.endday?item.endday:'0'}}
                <!-- 已用 --><!-- 天 -->
                <span class="toUsed">{{$t('mxpcweb.systemset.applicationcenter.1530258053640')}}<div style="color:#FF7165">{{item.usedays?item.usedays:'0'}}{{$t('mxpcweb.systemset.applicationcenter.1530258156720')}}</div>
                </span>
            </li>
            <li>
                <div class="chartBox" id="usePersonChart"></div>
                <i style="background:#5EA3F6;"></i>
                <!-- 用户许可人数 (共{0}个) -->{{$t('mxpcweb.systemset.applicationcenter.1530258378081',[item.authcount?item.authcount:'0'])}}
                <!-- 已用 --><!-- 个 -->
                <span class="toUsed">{{$t('mxpcweb.systemset.applicationcenter.1530258053640')}}<div style="color:#5EA3F6">{{item.usercount?item.usercount:'0'}}{{$t('mxpcweb.systemset.applicationcenter.1530258317598')}}</div>
                </span>
            </li>
            <li>
                <div class="chartBox" id="useSpaceChart"></div>
                <i style="background:#FFB735;"></i>
                {{$t('mxpcweb.systemset.applicationcenter.1530258497296',[item.spacecount?item.spacecount:'0'])}}
                <span class="toUsed">
                    <!-- 已用 -->{{$t('mxpcweb.systemset.applicationcenter.1530258053640')}}
                    <div style="color:#FFB735">{{item.usespace?item.usespace.toFixed(3):'0'}}G</div>
                </span>
            </li>
        </ul>
    </div>
</template>

<script>
/**
 * 运维管理
 * 何俊峰
 * 2018-11-18
 */
import { mapGetters } from 'vuex'
let echarts = require('echarts/lib/echarts') // 引入基本模板
require('echarts/lib/chart/pie') // 扇形图
export default {
    name: 'billCount',
    props: {
        item: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data() {
        return {
            usedSpace: 0,
            useauthCount: 0,
            useDays: 532,
            totalDays: 1000,
            spacecount: 0,
            authcount: 0,
            expirationtime: '2020-9-30',
            useDaysObj: '',
            usePersonObj: '',
            useSpaceObj: ''
        }
    },
    created() {
    },
    mounted () {
        this.useDaysObj = echarts.init(document.getElementById('useDaychart'))
        this.usePersonObj = echarts.init(document.getElementById('usePersonChart'))
        // 使用空间
        this.useSpaceObj = echarts.init(document.getElementById('useSpaceChart'))
        this.setChart()
    },
    beforeDestroy: function () {
        this.useDaysObj.clear()
        this.usePersonObj.clear()
        this.useSpaceObj.clear()
    },
    methods: {
        setChart() {
            let date1 = new Date()
            let date2 = new Date(this.item.endday)
            let date3 = date2.getTime() - date1.getTime()
            let days = Math.floor(date3 / (24 * 3600 * 1000))
            // 使用天数
            let optionuseDay = {
                tooltip: {
                trigger: 'item',
                formatter: '{b} : {c}天({d}%)'
                },
                color: ['#efe2e4', '#FF7165'], // 手动设置每个图例的颜色
                series: [
                {
                    name: '',
                    type: 'pie',
                    radius: ['54%', '60%'],
                    avoidLabelOverlap: false,
                    label: {
                    normal: {
                        show: false,
                        position: ['50%', '50%']
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                        fontSize: '10',
                        fontWeight: 'bold'
                        }
                    }
                    },
                    labelLine: {
                    normal: {
                        show: false
                    }
                    },
                    data: [
                    /*  未使用 */
                    { value: days || 0, name: this.$t('mxpcweb.systemset.applicationcenter.1530259638967') },
                    /* 已使用 */
                    { value: this.item.usedays || 0, name: this.$t('mxpcweb.systemset.applicationcenter.1530259605654') }
                    ]
                }
                ]
            }
            this.useDaysObj.setOption(optionuseDay)
            let usePersonoption = {
                tooltip: {
                trigger: 'item',
                formatter: '{b} : {c}个({d}%)'
                },
                color: ['#efe2e4', '#5EA3F6'], // 手动设置每个图例的颜色
                series: [
                {
                    name: '',
                    type: 'pie',
                    radius: ['54%', '60%'],
                    avoidLabelOverlap: false,
                    label: {
                    normal: {
                        show: false,
                        position: ['50%', '50%']
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                        fontSize: '10',
                        fontWeight: 'bold'
                        }
                    }
                    },
                    labelLine: {
                    normal: {
                        show: false
                    }
                    },
                    data: [
                    /* 未使用 */
                    { value: this.item.authcount ? this.item.authcount - this.item.usercount : 0 ? this.item.usercount : 0, name: this.$t('mxpcweb.systemset.applicationcenter.1530259638967') },
                    /* 已使用 */
                    { value: this.item.usercount ? this.item.usercount : 0, name: this.$t('mxpcweb.systemset.applicationcenter.1530259605654') }
                    ]
                }
                ]
            }
            this.usePersonObj.setOption(usePersonoption)
            let useSpaceoption = {
                tooltip: {
                trigger: 'item',
                formatter: '{b} : {c}G({d}%)'
                },
                color: ['#efe2e4', '#FFB735'], // 手动设置每个图例的颜色
                series: [
                {
                    name: '',
                    type: 'pie',
                    radius: ['54%', '60%'],
                    avoidLabelOverlap: false,
                    label: {
                    normal: {
                        show: false,
                        position: ['50%', '50%']
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                        fontSize: '10',
                        fontWeight: 'bold'
                        }
                    }
                    },
                    labelLine: {
                    normal: {
                        show: false
                    }
                    },
                    data: [
                    /*  未使用 */
                    { value: this.item.spacecount ? this.item.usespace ? this.item.spacecount - this.item.usespace : this.item.spacecount : 0, name: this.$t('mxpcweb.systemset.applicationcenter.1530259638967') },
                    /* 已使用 */
                    { value: this.item.usespace ? this.item.usespace.toFixed(3) : 0, name: this.$t('mxpcweb.systemset.applicationcenter.1530259605654') }
                    ]
                }
                ]
            }
            this.useSpaceObj.setOption(useSpaceoption)
        }
    },
    computed: {
        ...mapGetters([
            'screenWidth'
        ])
    },
    components: {
    },
    watch: {
        item(val, old) {
            this.setChart()
        },
        screenWidth(val) { // 监听屏幕宽度变化
            this.useDaysObj.resize()
            this.usePersonObj.resize()
            this.useSpaceObj.resize()
        }
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
