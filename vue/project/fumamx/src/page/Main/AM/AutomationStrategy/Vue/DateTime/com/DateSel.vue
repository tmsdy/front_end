<template>
    <span class="DateSel">
        <el-date-picker v-model="date" type="datetime" placeholder="选择日期时间">
        </el-date-picker>
    </span>
</template>

<script>
import mixin from './mixin.js'
export default {
    name: 'DateSel',
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
        this.date = new Date(this.getWholeDate(this.value))
    },
    data() {
        return {
            date: ''
        }
    },
    methods: {
        commitDate() {
            let date = this.dateFormat(this.date, 'yyyy-MM-dd HH:mm:ss')
            this.$emit('valChange', date)
        }
    },
    watch: {
        date() {
            this.commitDate()
        }
    },
    components: {

    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
</style>
