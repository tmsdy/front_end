<template>
    <span class="MonthSel">
        <el-select class="daySel" v-model="day" placeholder="请选择">
            <el-option v-for="d in 31" :key="d" :label="d" :value="completion(d)">
            </el-option>
        </el-select>
        <el-time-picker class="timeSel" v-model="time" placeholder="任意时间点">
        </el-time-picker>
    </span>
</template>

<script>
import mixin from './mixin.js'
export default {
    name: 'MonthSel',
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
            day: this.dateFormat(this.getWholeDate(this.value), 'dd'),
            time: new Date(this.getWholeDate(this.value))
        }
    },
    computed: {
    },
    methods: {
        commitDate() {
            this.$emit('valChange', `${this.dateFormat(this.time, 'yyyy-MM')}-${this.day} ${this.dateFormat(this.time, 'HH:mm:ss')}`)
        }
    },
    watch: {
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
.MonthSel {
  .daySel,
  .timeSel {
    width: 120px;
    margin-right: 10px;
  }
}
</style>
