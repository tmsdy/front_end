<template>
    <div class="conditionItem">
        <div class="itemMain clearfix">
            <template>
                <div class="indexFlag">{{index+1}}</div>
                <!--  :loading="isLoading"  -->
                <el-select v-model="condition.conditionFirst" class="module pull-left" placeholder="请选择" @change="moduleChange" value-key="fieldId">
                    <el-option-group v-for="group in modules" :key="group.moduleName" :label="group.moduleName">
                        <el-option v-for="item in group.field" :key="item.fieldId" :label="item.fieldName" :value="item">
                        </el-option>
                    </el-option-group>
                </el-select>
                <!-- @change="fieldChange"  -->
                <el-select v-model="condition.conditionSecond" class="field pull-left" placeholder="请选择" @change="fieldChange" value-key="value">
                    <el-option v-for="(item2,index) in fieldOptions" :label="item2.name" :value="item2" :key="index">
                    </el-option>
                </el-select>
                <!-- @change="typeChange"  -->
                <el-select v-model="condition.conditionThird" class="type pull-left" placeholder="请选择" v-show="condition.conditionFirst&&!condition.conditionFirst.time&&condition.conditionSecond&&condition.conditionFirst.controlTypeId!=32" :disabled="isdisabled">
                    <el-option v-for="(item2,index) in typeOptions" :label="item2.value" :value="item2.key+''" :key="index">
                    </el-option>
                </el-select>
                <div v-show="condition.conditionFirst.time && condition.conditionSecond && condition.conditionSecond.formula == undefined" class="pull-left">
                    <el-date-picker v-model="value1" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" placeholder="选择时间范围" align="right" v-if="condition.conditionSecond.value==7||condition.conditionSecond.value==8" style="width:180px;" @change="changeDate">
                    </el-date-picker>
                    <el-date-picker style="width:180px;" v-model="value1" type="date" placeholder="选择日期时间" v-if="condition.conditionSecond.value!=7&&condition.conditionSecond.value!=8" :disabled="isdisabled" @change="changeDate">
                    </el-date-picker>
                </div>
                <region labelPosition="left" labelWidth="0px" rightWidth="200px" rightWidth1="120px" ref="control" :itemData="item" @change="areaChange" v-if="condition.conditionFirst.controlTypeId==32&&condition.conditionSecond&&!isdisabled" class="pull-left"></region>
            </template>

            <div class="operateBox pull-left">
                <div class="addBox" v-if="conLength == 1">
                    <i @click="clearCondition()" class="itemBtn deItemBtn iconfont icon-close-bold ">
                    </i>
                </div>
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
        <div class="itemCalc" v-if="!isLast">
            <div class="Btn" @click="changeLogic()">
                {{logic==0?'或':'与'}}
            </div>
        </div>
    </div>
</template>

<script>
import Region from '../../../../components/Region/index'
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
        },
        condition: {
            type: Object,
            default: () => ({
                conditionFirst: { time: false },
                conditionSecond: '',
                conditionThird: '',
                conditionArea: []
            })
        }
    },
    data() {
        return {
            isdisabled: false,
            value1: '',
            value4: [new Date(new Date().toLocaleDateString()).getTime(),
            new Date(new Date().toLocaleDateString()).getTime() + ((24 * 60 * 60 * 1000) - 1)],
            fieldOptions: [],
            typeOptions: [],
            nowType: {},
            controlItem: {},
            isFieldLoading: false,
            isTypeLoading: false,
            fieldType: '',
            dateTime: '',
            dateRange: '',
            areaMap: new Map(),
            areaArr: [],
            key: '',
            notimeType: [
                {
                    value: 1,
                    name: '是',
                    expression: '='
                },
                {
                    value: 2,
                    name: '不是',
                    expression: '<>'
                },
                {
                    value: 3,
                    name: '包含',
                    expression: 'in'
                },
                {
                    value: 4,
                    name: '不包含',
                    expression: 'not_in'
                },
                {
                    value: 5,
                    name: '为空',
                    expression: '='
                },
                {
                    value: 6,
                    name: '不为空',
                    expression: '<>'
                }
            ],
            timeType: [
                {
                    value: 1,
                    name: '是',
                    expression: '='
                },
                {
                    value: 2,
                    name: '不是',
                    expression: '<>'
                },
                {
                    value: 3,
                    name: '包含',
                    expression: 'in'
                },
                {
                    value: 4,
                    name: '不包含',
                    expression: 'not_in'
                },
                {
                    value: 5,
                    name: '为空',
                    expression: '='
                },
                {
                    value: 6,
                    name: '不为空',
                    expression: '<>'
                },
                {
                    value: 7,
                    name: '介于',
                    expression: 'between'
                },
                {
                    value: 8,
                    name: '不介于',
                    expression: 'not_between'
                }
            ],
            item: {
                cnFieldCaption: '',
                group: [{
                    fieldName: 'countryId',
                    controlData: '',
                    controlTypeId: 32,
                    cnFieldCaption: '国家',
                    inDefaultValue: '1'
                    // isNotNull: 1 // 必填非必填
                },
                {
                    fieldName: 'provinceId',
                    controlData: '',
                    controlTypeId: 33,
                    cnFieldCaption: '省'
                },
                {
                    fieldName: 'cityId',
                    controlData: '',
                    controlTypeId: 34,
                    cnFieldCaption: '市'
                },
                {
                    fieldName: 'townId',
                    controlData: '',
                    controlTypeId: 35,
                    cnFieldCaption: '区'
                }
                ]
            }
        }
    },
    created() {
    },
    methods: {
        clearCondition() {
            console.log(111)
            this.$emit('clearConditions')
            // this.condition = {
            //     conditionFirst: { time: false },
            //     conditionSecond: '',
            //     conditionThird: '',
            //     conditionArea: []
            // }
        },
        setEditDefault(index, y) { // y是筛选条件
            let itemFilter = y.filterInfo[index] // 每条筛选条件
            // 在modules中筛选出之前选的的fieldId赋值给第一个下拉
            let firstOption = this.modules[0].field.filter(item => item.fieldId == itemFilter.fieldId)
            this.condition.conditionFirst = firstOption[0]
            this.condition.conditionFirst.flag = true
            // 筛选第二个下拉的默认值
            if (firstOption[0].time) { // 如果一级下拉是时间字段
                if (itemFilter.formula) { // 二级是后台获取字段
                    let secondOption = this.condition.conditionFirst.result.filter(item => item.value == itemFilter.inputFilter)
                    this.condition.conditionSecond = secondOption[0]
                    this.condition.conditionSecond.flag = true
                } else { // 二级是timeType,一种是为空，不为空时inputFilter为5，6，一种是其他类型inputFilter为时间字符串
                    let secondOption2 = this.timeType.filter(item => item.expression == itemFilter.expression)
                    // 继续过滤出value == 6或 5的
                    let secondOptionFilter = secondOption2.filter(item => item.value == 5 || item.value == 6)
                    if (itemFilter.inputFilter == '' && secondOptionFilter.length > 0) {
                        this.condition.conditionSecond = secondOptionFilter[0]
                        this.condition.conditionSecond.flag = true
                    } else {
                        this.condition.conditionSecond = secondOption2[0]
                        this.condition.conditionSecond.flag = true
                        if (itemFilter.inputFilter.length > 10) { // 设置时间区间默认值
                            let timeDataFrom = itemFilter.inputFilter.slice(0, 10)
                            let timeDataTo = itemFilter.inputFilter.slice(11, itemFilter.inputFilter.length)
                            let timeArr = []
                            timeArr.push(new Date(timeDataFrom), new Date(timeDataTo))
                            this.value1 = timeArr
                            this.condition.conditionThird = itemFilter.inputFilter
                        } else {
                            this.value1 = itemFilter.inputFilter
                            this.condition.conditionThird = this.value1
                        }
                    }
                }
            } else {
                // 过滤出下拉值中expression属性和已选值expression属性相同的对象
                let secondOption = this.notimeType.filter(item => item.expression == itemFilter.expression)
                // 继续过滤出value == 6或 5的
                let secondOptionFilter = secondOption.filter(item => item.value == 5 || item.value == 6)
                if (itemFilter.inputFilter == '' && secondOptionFilter.length > 0) {
                    this.condition.conditionSecond = secondOptionFilter[0]
                    this.condition.conditionSecond.flag = true
                } else {
                    this.condition.conditionSecond = secondOption[0]
                    this.condition.conditionSecond.flag = true
                    // this.fieldChange(this.condition.conditionSecond) // 触发二级下拉
                    let thirdOptions = this.condition.conditionFirst.result
                    let thirdSelect = thirdOptions.filter(item => item.key == itemFilter.inputFilter)
                    this.condition.conditionThird = thirdSelect[0].key.toString()
                }
            }
        },
        areaChange(n) {
            this.areaArr = []
            this.areaMap.set(n.key, n)
            // this.condition.conditionThird = this.areaArr
            // return list
            for (var [key, value] of this.areaMap) {
                this.key = key
                this.areaArr.push(value)
            }
            this.condition.conditionArea = this.areaArr
        },
        initial() { // 初始化下拉框的值
            this.condition.conditionFirst = { time: false }
            this.condition.conditionSecond = ''
            this.condition.conditionThird = ''
            this.condition.conditionArea = []
            // this.fieldChange()
        },
        changeDate(value) {
            // this.condition.conditionThird = JSON.parse(JSON.stringify(this.value1))
            this.condition.conditionThird = value
        },
        isComplete() {
            // 第一级下拉选择非时间类型
            if (this.condition.conditionFirst.controlTypeId && this.condition.conditionFirst.time == false) {
                // 第二级下拉选择为空或不为空
                if (this.condition.conditionSecond.value == 5 || this.condition.conditionSecond.value == 6) {
                    return false
                } else if (this.condition.conditionSecond == '') { // 如果二级下拉没有选择
                    return true
                } else { // 如果二级下拉选择值除去不是空或不为空这2个以外的其他选项
                    if (this.condition.conditionThird || this.condition.conditionArea.length > 0) {
                        return false
                    }
                }
                return true
            } else if (this.condition.conditionFirst.controlTypeId && this.condition.conditionFirst.time) { // 第一级下拉选择时间类型
                if (this.condition.conditionSecond.value == 5 || this.condition.conditionSecond.value == 6) { // 第二级下拉选择为空或不为空
                    return false
                } else if (this.condition.conditionSecond == '') { // 如果二级下拉没有选择
                    return true
                } else if (this.condition.conditionSecond.formula) { // 第二级下拉选择系统时间字段
                    return false
                } else {
                    if (this.condition.conditionThird) {
                        return false
                    }
                }
                return true
            } else if (this.condition.conditionFirst.controlTypeId == undefined) { //  // 第一级下拉没有选择
                return false
            }
        },
        // setOrderNo(key) {
        //     let num = this.index + 1
        //     this.condition[key] = num
        //     return num
        // },
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
            if (!value.flag) {
                this.condition.conditionSecond = ''
                this.condition.conditionThird = ''
            }
            if (value.time && value.time == true) { // 时间类型
                this.fieldOptions = JSON.parse(JSON.stringify(this.timeType))
                this.fieldOptions.push(...value.result)
            } else { // 不是时间类型
                this.fieldOptions = this.notimeType
                // console.log(this.condition.conditionSecond)
                // 获取三级下拉值
                if (value.result) {
                    this.typeOptions = value.result
                }
            }
            // this.nowType = {}
            // this.controlOptions = []
            // this.getFieldOptions(value)
        },
        fieldChange(value) {
            if (!value.flag) {
                this.condition.conditionThird = ''
                this.value1 = ''
                this.value4 = ''
            }
            let valueSecond = value.value
            if (valueSecond == '5' || valueSecond == '6') {
                this.isdisabled = true
            } else {
                this.isdisabled = false
            }
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
        ...Controls,
        'region': Region
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
