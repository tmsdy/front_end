<template>
    <div class="stepItem stepStart  clearfix" :class="{'hasNextStep':hasNext}">
        <div class="stepFlag">
            <div class="text">开 始</div>
        </div>
        <div v-loading.body="isLoading" class="stepBox">
            <div class="stepContent" v-if="isEdit">
                <p class="title">
                    何时开始此策略
                </p>
                <div class="typeTabBox" :class=" {'checked':conditionType}">
                    <el-radio-group class="clearfix" v-model="conditionType">
                        <template v-for="(item,index) in beginData">
                            <div v-if="item.useFlag==1" class="tabItem pull-left" :class="{'active':conditionType==item.conditionType}" :key='index'>
                                <el-radio :label="item.conditionType" :disabled="isModify">{{item.showName}}</el-radio>
                            </div>
                        </template>
                    </el-radio-group>
                </div>
                <div v-if="conditionType" class="typePanelBox">
                    <template v-for="(item,index) in beginData">
                        <template v-if="item.useFlag==1&&conditionType==item.conditionType">
                            <field v-if="item.conditionType==1" :details="item.details" v-model="strategyWhen" :moduleCode="strategyDesForm.moduleCode" :isModify="isModify" @itemChange="itemChange" :key="index"></field>
                            <date-time v-if="item.conditionType==2" v-model="strategyWhen" :dateTimes="dateTimes" :key="index"></date-time>
                        </template>
                    </template>
                </div>
                <el-button v-if="conditionType" type="primary" :loading="isSaving" @click="commit">确定</el-button>
            </div>
            <div v-else class="stepShow">
                <p class="title" v-if="conditionType==1">当 {{strategyDesForm.moduleName}} {{showName}}时，将执行此规则。</p>
                <p class="title" v-if="conditionType==2">此规则将在{{getExeTimeStr()}}执行</p>
                <i class="iconfont icon-edit edit" @click="toEdit()"></i>
            </div>
        </div>
    </div>
</template>

<script>
import DateTime from '../DateTime'
import Field from '../Field'
import { isObject } from '@/libs/utils'
export default {
    name: 'StepStart',
    props: {
        beginData: {
            type: Array,
            default: () => []
        },
        strategyDesForm: {
            type: Object,
            default: () => ({})
        },
        hasNext: {
            type: Boolean,
            default: false
        },
        isLoading: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            conditionType: '',
            strategyWhen: {},
            isSaving: false,
            isEdit: true,
            isModify: false,
            showName: '',
            tempMap: {},
            dateTimes: {
                1: { value: 1, name: '单次', format: 'yyyy-MM-dd HH:mm' },
                2: { value: 2, name: '每天', format: 'HH:mm' },
                3: { value: 3, name: '每周', format: 'dd HH:mm' },
                4: { value: 4, name: '每月', format: 'dd HH:mm' },
                5: { value: 5, name: '每年', format: 'MM-dd HH:mm' }
            },
            weekOption: {
                '01': '周一',
                '02': '周二',
                '03': '周三',
                '04': '周四',
                '05': '周五',
                '06': '周六',
                '07': '周日'
            }
        }
    },

    methods: {
        toEdit() {
            this.isEdit = true
            this.isModify = true
        },
        getExeTimeStr() {
            let type = this.strategyWhen.execTypeId
            if (type == 1) {
                return this.strategyWhen.execTime
            }
            if (type == 3) {
                let timeArr = this.strategyWhen.execTime.split(' ')
                return `${this.dateTimes[type].name} ${this.weekOption[timeArr[0]]} ${timeArr[1]}`
            }
            return this.dateTimes[type].name + this.strategyWhen.execTime
        },

        async commit() {
            this.isSaving = true
            let flag = await this.saveData()
            this.isSaving = false
            if (flag) {
                this.isEdit = false
                this.$emit('commited', { conditionType: this.conditionType, ...this.tempMap }, this.isModify)
            }
        },
        async saveData() {
            try {
                let url = this.Global.baseURL + this.Global.api.v2.autoStrategy_strategy
                let data = {
                    strategyWhen: Object.assign({
                        strategyId: this.strategyDesForm.strategyId,
                        conditionType: this.conditionType
                    }, this.strategyWhen)
                }
                let res = this.isModify
                    ? await this.$http.put(url, data)
                    : await this.$http.post(url, data)
                if (res.body.code.toString() == this.Global.RES_OK) {
                    if (isObject(res.body.data)) {
                        let { identKey, identValue } = res.body.data
                        Object.assign(this.strategyWhen, { [identKey]: identValue })
                    }
                    return true
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            return false
        },
        itemChange(obj, showName) {
            this.showName = showName
            this.tempMap = obj
        }

    },
    watch: {
        conditionType() {
            let { straWhenId } = this.strategyWhen
            if (this.isModify && straWhenId) {
                this.strategyWhen = { straWhenId }
            } else {
                this.strategyWhen = {}
            }

            this.tempMap = {}
        },
        strategyWhen: {
            handler() {
                //  console.log(this.strategyWhen)
            },
            deep: true
        }
    },
    components: {
        'date-time': DateTime,
        'field': Field
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
