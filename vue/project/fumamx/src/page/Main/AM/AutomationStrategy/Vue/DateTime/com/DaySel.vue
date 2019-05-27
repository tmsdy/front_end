<template>
    <span class="DaySel">
        <el-time-picker v-model="time" placeholder="任意时间点">
        </el-time-picker>
    </span>
</template>

<script>
import mixin from './mixin.js'
export default {
    name: 'DaySel',
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
    mounted() {
        this.time = new Date(this.getWholeDate(this.value))
    },
    data() {
        return {
            time: ''
        }
    },
    methods: {
        commitDate() {
            let time = this.dateFormat(this.time, 'yyyy-MM-dd HH:mm:ss')
            this.$emit('valChange', time)
        }
    },
    watch: {
        time() {
            this.commitDate()
        }
    },
    components: {

    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
</style>
