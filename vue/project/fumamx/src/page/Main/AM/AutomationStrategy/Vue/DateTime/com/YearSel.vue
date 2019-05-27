<template>
    <span class="YearSel">
        <el-select class="monthSel" v-model="month" placeholder="请选择">
            <el-option v-for="m in 12" :key="m" :label="`${m}月`" :value="completion(m)">
            </el-option>
        </el-select>
        <el-select class="daySel" v-model="day" placeholder="请选择">
            <el-option v-for="d in canSelDay" :key="d" :label="d" :value="completion(d)">
            </el-option>
        </el-select>
        <el-time-picker class="timeSel" v-model="time" placeholder="任意时间点">
        </el-time-picker>
    </span>
</template>

<script>
import mixin from './mixin.js'
export default {
    name: 'YearSel',
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
            month: this.dateFormat(this.getWholeDate(this.value), 'MM'),
            day: this.dateFormat(this.getWholeDate(this.value), 'dd'),
            time: new Date(this.getWholeDate(this.value))
        }
    },
    computed: {

        canSelDay() {
            if (['01', '03', '05', '07', '08', '10', '12'].includes(this.month)) {
                return 31
            }
            if (['04', '06', '09', '11'].includes(this.month)) {
                return 30
            }
            return 29
        }
    },
    methods: {

        commitDate() {
            this.$emit('valChange', `${this.dateFormat(this.time, 'yyyy')}-${this.month}-${this.day} ${this.dateFormat(this.time, 'HH:mm:ss')}`)
        }

    },
    watch: {
        month() {
            this.commitDate()
        },
        day() {
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
.YearSel {
  .monthSel,
  .daySel,
  .timeSel {
    width: 120px;
    margin-right: 10px;
  }
}
</style>
