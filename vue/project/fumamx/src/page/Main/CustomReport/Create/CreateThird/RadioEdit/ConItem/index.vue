<template>
    <div class="conditionItem">
        <div class="itemMain clearfix radioedit">
            <template>
                <el-radio :label="index+1">
                    <!--  :loading="isLoading"  -->
                    <div style="float:left">
                        <el-select v-model="conditionFirst" class="module pull-left" placeholder="请选择" @change="moduleChange" value-key="fieldId">
                            <el-option-group v-for="group in modules" :key="group.moduleName" :label="group.moduleName">
                                <el-option v-for="item in group.field" :key="item.fieldId" :label="item.fieldName" :value="item">
                                </el-option>
                            </el-option-group>
                        </el-select>
                        <!-- @change="fieldChange"  -->
                        <el-select v-model="conditionSecond" class="field pull-left" placeholder="请选择" @change="fieldChange" value-key="value">
                            <el-option v-for="(item2,index) in fieldOptions" :label="item2.name" :value="item2" :key="index">
                            </el-option>
                        </el-select>
                        <!-- @change="typeChange"  -->
                        <el-select v-model="conditionThird" class="type pull-left" placeholder="请选择" v-show="!conditionFirst.time&&conditionSecond">
                            <el-option v-for="(item2,index) in typeOptions" :label="item2.value" :value="item2.key" :key="index">
                            </el-option>
                        </el-select>
                        <div v-show="conditionFirst.time && conditionSecond.formula == undefined" class="pull-left">
                            <el-date-picker v-model="value4" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" placeholder="选择时间范围" align="right" v-if="conditionSecond.value==5||conditionSecond.value==6" style="width:180px;">
                            </el-date-picker>
                            <el-date-picker style="width:180px;" v-model="value1" type="date" placeholder="选择日期时间" v-if="conditionSecond.value!=5&&conditionSecond.value!=6">
                            </el-date-picker>
                        </div>
                    </div>
                </el-radio>
            </template>
            <div class="operateBox pull-left">
                <div class="addBox" v-if="conLength>1">
                    <i @click="removeCondition()" class="itemBtn deItemBtn iconfont icon-minus">
                    </i>
                </div>
                <div class="removeBox" v-if="isLast">
                    <i @click="addCondition()" class="itemBtn inItemBtn iconfont icon-plus-file">
                    </i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Controls from '@/components/Controls/index.js'
export default {
    name: 'ConItem',
    props: {
        modules: {
            type: Array,
            default: () => []
        },
        index: {
            type: Number,
            default: 0
        },
        isLast: {
            type: Boolean,
            default: false
        },
        conLength: {
            type: Number,
            default: 1
        },
        logic: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            radio2: '',
            value1: '',
            value4: '',
            fieldOptions: [],
            typeOptions: [],
            nowType: {},
            controlItem: {},
            isFieldLoading: false,
            isTypeLoading: false,
            fieldType: '',
            dateTime: '',
            dateRange: '',
            conditionFirst: '',
            conditionSecond: '',
            conditionThird: '',
            notimeType: [
                {
                    value: 1,
                    name: '是'
                },
                {
                    value: 2,
                    name: '不是'
                },
                {
                    value: 3,
                    name: '包含'
                },
                {
                    value: 4,
                    name: '不包含'
                },
                {
                    value: 5,
                    name: '为空'
                },
                {
                    value: 6,
                    name: '不为空'
                }
            ],
            timeType: [
                {
                    value: 1,
                    name: '是'
                },
                {
                    value: 2,
                    name: '不是'
                },
                {
                    value: 3,
                    name: '之前'
                },
                {
                    value: 4,
                    name: '之后'
                },
                {
                    value: 5,
                    name: '介于'
                },
                {
                    value: 6,
                    name: '不介于'
                },
                {
                    value: 7,
                    name: '为空'
                },
                {
                    value: 8,
                    name: '不为空'
                }
            ]
        }
    },
    methods: {
        addCondition() {
            this.$emit('add')
        },
        removeCondition() {
            this.$emit('remove')
        },
        changeLogic() {
            this.$emit('changeLogic')
        },
        moduleChange(value) {
            this.fieldOptions = []
            this.conditionSecond = ''
            this.conditionThird = ''
            if (this.conditionFirst.time && this.conditionFirst.time == true) { // 时间类型
                this.timeType.push(...this.conditionFirst.result)
                this.fieldOptions = this.timeType
            } else { // 不是时间类型
                this.fieldOptions = this.notimeType
                // 获取三级下拉值
                if (this.conditionFirst.result) {
                    this.typeOptions = this.conditionFirst.result
                }
            }

            // this.nowType = {}
            // this.controlOptions = []
            // this.getFieldOptions(value)
        },
        fieldChange(value) {
            // console.log(this.conditionSecond)
        }
    },
    watch: {
        dateRange() {
            this.dateRange.forEach((item, index) => {
                if (item) {
                    if (index == 0) {
                        this.condition['gtParam'] = this.$m_unifiedTime(item)
                    } else {
                        this.condition['ltParam'] = this.$m_unifiedTime(item)
                    }
                }
            })
        },
        dateTime() {
            if (!this.dateTime) return
            this.condition['eqParam'] = this.$m_unifiedTime(this.dateTime)
        }
    },
    components: {
        ...Controls
    }
}
</script>
<style lang='less'>
.radioedit .el-radio__input {
    position: absolute !important;
    left: -30px;
    top: 8px;
}
</style>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
