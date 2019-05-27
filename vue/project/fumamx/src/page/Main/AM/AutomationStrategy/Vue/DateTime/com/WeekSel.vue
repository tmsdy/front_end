<template>
    <div class="WeekSel">
        <el-select class="weekSel" v-model="week" placeholder="请选择">
            <el-option v-for="day in weekOption" :key="day.value" :label="day.name" :value="day.value">
            </el-option>
        </el-select>
        <el-time-picker class="timeSel" v-model="time" placeholder="任意时间点">
        </el-time-picker>
    </div>
</template>
<script>
import mixin from './mixin.js'
export default {
    name: 'WeekSel',
    mixins: [mixin],
    props: {
        value: {
            type: String,
            default: ''
        }
    },
    model: {
        prop: 'value',
        event: 'valChange'
    },
    data() {
        return {
            weekOption: [
                { value: '01', name: '周一' },
                { value: '02', name: '周二' },
                { value: '03', name: '周三' },
                { value: '04', name: '周四' },
                { value: '05', name: '周五' },
                { value: '06', name: '周六' },
                { value: '07', name: '周日' }
            ],
            week: this.getWeek(),
            time: new Date(this.getWholeDate(this.value))
        }
    },
    computed: {

    },
    mounted() {
        this.commitDate()
    },
    methods: {
        getWeek() {
            let w = this.dateFormat(this.getWholeDate(this.value), 'dd')
            if (['01', '02', '03', '04', '05', '06', '07'].includes(w)) {
                return w
            } else {
                return '01'
            }
        },
        commitDate() {
            this.$emit('valChange', `${this.dateFormat(this.time, 'yyyy-MM')}-${this.week} ${this.dateFormat(this.time, 'HH:mm:ss')}`)
        }
    },
    watch: {

        week() {
            this.commitDate()
        },
        time() {
            this.commitDate()
        }
    },
    components: {

    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
.WeekSel {
  .weekSel,
  .timeSel {
    width: 120px;
    margin-right: 10px;
  }
}
</style>
