<template>
    <div class="conditionItem">
        <div class="itemMain clearfix">
            <template v-for="(item,index) in showFormat">
                <div v-if="item.preVirtualControlType==10" class="indexFlag" :key="index">{{setOrderNo(item.paramsKey)}}</div>
                <el-select v-if="item.preVirtualControlType==5" :loading="isLoading" @change="moduleChange" v-model="condition[item.paramsKey]" class="module pull-left" placeholder="请选择" :key="index">
                    <el-option v-for="(item2,index) in modules" :label="item2.showName" :value="item2.moduleCode" :key="index">
                    </el-option>
                </el-select>
                <el-select v-if="item.preVirtualControlType==11" :loading="isFieldLoading" @change="fieldChange" v-model="condition[item.paramsKey]" class="field pull-left" placeholder="请选择" :key="index">
                    <el-option v-for="(item2,index) in fieldOptions" :label="item2.showName" :value="item2.fieldId" :key="index">
                    </el-option>
                </el-select>
                <el-select v-if="item.preVirtualControlType==12" :loading="isFieldLoading" @change="typeChange" v-model="condition[item.paramsKey]" class="type pull-left" placeholder="请选择" :key="index">
                    <el-option v-for="(item2,index) in typeOptions" :label="item2.showName" :value="item2.typeId" :key="index">
                    </el-option>
                </el-select>
            </template>
            <div class="pull-left paramBox clearfix">
                <template v-if="fieldType==4">
                    <component class="controlItem" dataId="control1" :nameId="controlItem.fieldName" :showLabel="false" :moduleCode="condition.moduleCode" labelPosition="left" labelWidth="0px" rightWidth="200px" ref="control" v-bind:is="'control'+controlItem.controlTypeId" :itemData="controlItem" :isIndependent="true" optCode="otView" :controlData.sync="condition['eqParam']" style=""></component>
                </template>
                <template v-else-if="fieldType==3">
                    <!-- 标签下拉框 -->
                </template>
                <template v-else>
                    <!-- 文本 -->
                    <template v-if="nowType.showType==0">
                        <el-input class="controlItem" :disabled="nowType.editFlag==0" v-model="condition['eqParam']" placeholder="请输入内容"></el-input>
                    </template>
                    <!-- 数值区间 -->
                    <template v-if="nowType.showType==1">
                        <el-input v-model.number="condition['gtParam']" placeholder="从" style="width:50%" class="pull-left"></el-input>
                        <el-input v-model.number="condition['ltParam']" placeholder="到" style="width:50%" class="pull-left"></el-input>
                    </template>
                    <!-- 日期-->
                    <template v-if="nowType.showType==2">
                        <el-date-picker class="controlItem" v-model="dateTime" format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间">
                        </el-date-picker>
                    </template>
                    <!-- 日期区间 -->
                    <template v-if="nowType.showType==3">
                        <el-date-picker class="controlItem" v-model="dateRange" format="yyyy-MM-dd HH:mm:ss" type="datetimerange" placeholder="选择时间范围">
                        </el-date-picker>
                    </template>

                </template>
            </div>
            <div class="operateBox pull-left">
                <i v-if="conLength>1" @click="removeCondition()" class="itemBtn deItemBtn iconfont icon-minus">
                </i>
                <i v-if="isLast" @click="addCondition()" class="itemBtn inItemBtn iconfont icon-plus-file">
                </i>
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
import Controls from '@/components/Controls/index.js'
export default {
    name: 'ConItem',
    props: {
        index: {
            type: Number,
            default: 0
        },
        conLength: {
            type: Number,
            default: 1
        },
        isLast: {
            type: Boolean,
            default: false
        },
        showFormat: {
            type: Array,
            default: () => []
        },
        condition: {
            type: Object,
            default: () => ({})
        },
        logic: {
            type: Number,
            default: 0
        },
        isLoading: {
            type: Boolean,
            default: false
        },
        modules: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            fieldOptions: [],
            typeOptions: [],
            nowType: {},
            controlItem: {},
            isFieldLoading: false,
            isTypeLoading: false,
            fieldType: '',
            dateTime: '',
            dateRange: ''
        }
    },
    methods: {
        isComplete() {
            if (this.fieldType == 4 && !this.$refs.control.submitForm()) {
                return false
            }
            for (let index = 0; index < this.showFormat.length; index++) {
                const item = this.showFormat[index]
                if (!this.condition[item.paramsKey]) {
                    return false
                }
            }

            if (this.fieldType == 4) {
                if (!this.condition['eqParam']) {
                    return false
                }
            } else {
                if ((this.nowType.showType == 0 || this.nowType.showType == 2) && !this.condition['eqParam']) {
                    return false
                }
                if ((this.nowType.showType == 1 || this.nowType.showType == 3) && (!this.condition['gtParam'] || !this.condition['ltParam'])) {
                    return false
                }
            }
            return true
        },
        setOrderNo(key) {
            let num = this.index + 1
            this.condition[key] = num
            return num
        },
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
            this.showFormat.forEach(item => {
                if (item.preVirtualControlType != 10 && item.preVirtualControlType != 5) {
                    delete this.condition[item.paramsKey]
                }
            })

            this.nowType = {}
            this.controlOptions = []
            this.getFieldOptions(value)
        },
        fieldChange(value) {
            this.showFormat.forEach(item => {
                if (item.preVirtualControlType == 12) {
                    delete this.condition[item.paramsKey]
                }
            })
            this.nowType = {}
            this.typeOptions = []
            this.controlOptions = []
            delete this.condition['eqParam']
            delete this.condition['gtParam']
            delete this.condition['ltParam']

            this.fieldType = ''

            if (value == undefined) {
                return
            }

            let fieldType = ''
            for (let index = 0; index < this.fieldOptions.length; index++) {
                const item = this.fieldOptions[index]
                if (item.fieldId == value) {
                    this.controlItem = item.fieldList
                    fieldType = item.fieldType
                    break
                }
            }

            this.$nextTick(() => {
                this.fieldType = fieldType
                this.getTypeOptions()
                if (this.fieldType == 4) {
                    this.condition['eqParam'] = ''
                    // this.getControlType(value)
                }
            })
        },
        typeChange(value) {
            for (let i = 0; i < this.typeOptions.length; i++) {
                const item = this.typeOptions[i]
                if (item.typeId === value) {
                    this.nowType = item
                    break
                }
            }

            if (this.fieldType != 4) {
                if (this.nowType.editFlag == 0) {
                    this.condition['eqParam'] = this.nowType.comparator
                } else {
                    delete this.condition['eqParam']
                }
            }
        },

        getTypeOptions() {
            this.isTypeLoading = true
            let url = this.Global.baseURL + this.Global.api.v2.autoStrategy_controlTypeV2
            let data = {
                params: {
                    actionId: 0,
                    dataType: 'module_fields_cond',
                    fieldType: this.fieldType
                }
            }
            this.$http.get(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.typeOptions = res.body.data.list
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                    this.isTypeLoading = false
                })
                .catch(err => {
                    this.isTypeLoading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        getFieldOptions(moduleCode) {
            this.isFieldLoading = true
            let url = this.Global.baseURL + this.Global.api.v2.autoStrategy_controlTypeV2
            let data = {
                params: {
                    actionId: 0,
                    dataType: 'modules_rely_fields',
                    moduleCode: moduleCode
                }
            }
            this.$http.get(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.fieldOptions = res.body.data.list
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                    this.isFieldLoading = false
                })
                .catch(err => {
                    this.isFieldLoading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
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
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
