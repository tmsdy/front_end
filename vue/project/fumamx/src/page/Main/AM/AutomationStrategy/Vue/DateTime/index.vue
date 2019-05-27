<template>
    <div class="DateTime">
        <el-radio-group class="typePanelBox" v-model="dateTime.execTypeId">
            <div v-for="(item,key) in dateTimes" class="itemline" :key="key">
                <el-radio class="radioBox" :label="item.value">
                    {{item.name}}
                </el-radio>
                <component v-if="dateTime.execTypeId==item.value" :is="'timeSel0'+key" v-model="dateTime.execTime"></component>
            </div>
        </el-radio-group>
    </div>
</template>
<script>
import YearSel from './com/YearSel'
import MonthSel from './com/MonthSel'
import WeekSel from './com/WeekSel'
import DaySel from './com/DaySel'
import DateSel from './com/DateSel'
import mixin from './com/mixin.js'
export default {
    name: 'DateTime',
    mixins: [mixin],
    model: {
        prop: 'value',
        event: 'change'
    },
    props: {
        value: {
            type: Object,
            default: () => ({})
        },
        dateTimes: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            dateTime: Object.assign({
                execTypeId: '',
                execTime: ''
            }, this.value)

        }
    },
    mounted() {
        this.dateTime = Object.assign({
            execTypeId: '',
            execTime: ''
        }, this.value)
    },
    methods: {

    },
    watch: {
        dateTime: {
            handler() {
                let format = 'yyyy-MM-dd HH:mm'
                for (const key in this.dateTimes) {
                    if (key == this.dateTime.execTypeId) {
                        format = this.dateTimes[key].format
                    }
                }
                let temp = Object.assign({}, this.dateTime)
                temp.execTime = this.dateFormat(temp.execTime.replace(/-/g, '/'), format)

                this.$emit('change', temp)
            },
            deep: true
        }
    },
    components: {
        'timeSel01': DateSel,
        'timeSel02': DaySel,
        'timeSel03': WeekSel,
        'timeSel04': MonthSel,
        'timeSel05': YearSel
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
