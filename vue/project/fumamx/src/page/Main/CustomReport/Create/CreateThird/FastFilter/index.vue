<template>
    <div class="condition">
        <p style="color:#909399FF;height:32px;line-height:32px;">（运行时可筛选）</p>
        <div class="filterBox">
            <div class="filterleft">
                <p>快捷筛选项<span>（勾选代表初始载入条件，非必选项） </span></p>
                <div class="filterterm" @click="addConditions"><i class="iconfont icon-plus-file"></i>添加快捷筛选条件</div>
                <el-radio-group v-model="radio2" style="width:100%" @change="changeDefault">
                    <ul class="listRadio">
                        <li v-for="(item,index) in filterConditions" :key="index" style="position:relative">
                            <el-radio class="radio" :label="index">{{item.cnFilterName}}</el-radio>
                            <div class="listBtn">
                                <el-button class="radioBtn" @click="editConditions(item,index)">编辑</el-button>
                                <el-button class="radioBtn" @click="deleteConditions(item,index)">移除</el-button>
                            </div>
                        </li>
                    </ul>
                </el-radio-group>
            </div>
            <div class="filterright">
                <p style="color:#606266">设置后效果：</p>
                <img v-bind:src="reportdemo1" />
            </div>
        </div>
        <div class="filterBox" style="border-top: 1px solid #EAEDEF;margin-top:20px;padding-top:20px;">
            <div class="filterleft">
                <p>字段筛选项<span>（勾选代表初始载入条件，非必选项） </span></p>
                <el-select v-model="value5" multiple placeholder="请选择" style="width: 350px;margin-top:15px;" value-key="fieldName" @change="filterChange">
                    <el-option v-for="(item,index) in simpleFilterArr" :key="index" :label="item.fieldName" :value="item">
                    </el-option>
                </el-select>
            </div>
            <div class="filterright">
                <p style="color:#606266">设置后效果：</p>
                <img v-bind:src="reportdemo2" />
            </div>
        </div>
        <!-- 筛选弹窗 -->
        <el-dialog title="添加快速筛选项" :visible.sync="dialogVisible" size="small" :close-on-click-modal="false" v-if="dialogVisible">
            <div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="活动名称" prop="cnFilterName">
                        <el-input v-model="ruleForm.cnFilterName" style="width:300px;"></el-input>
                    </el-form-item>
                    <div class="MXscroll conditionBox">
                        <div style="width:85%;">
                            <span>设置匹配条件</span>
                            <condition-edit ref="conditionEdit" :modules="modules" @isFinish="isFinish" @getFilters='getFilters'></condition-edit>
                        </div>
                    </div>
                    <el-form-item style="text-align:center;margin-left:-100px;">
                        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
                        <el-button @click="cancel">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import ConditionEdit from '../ConditionEdit'
// import Dialog from './Dialog'
import RadioEdit from '../RadioEdit'
export default {
    name: 'currency',
    props: {
        modules: {
            type: Array,
            default: () => []
        },
        simpleFilterArr: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            reportdemo1: '/static/customReport/add02.jpg',
            reportdemo2: '/static/customReport/add01.jpg',
            dialogVisible: false,
            ruleForm: {
                cnFilterName: ''
            },
            rules: {
                cnFilterName: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
                ]
            },
            filterConditions: [],
            radio2: '',
            radio: '',
            finish: false,
            filtersOb: {},
            value5: [],
            modulesOption: [],
            fieldFilters: [],
            runFilters: [], // 运行时筛选条件(快速筛选条件中打√的)
            editFlag: false,
            editIndex: 0
        }
    },
    methods: {
        deleteConditions(item, index) {
            this.filterConditions.splice(index, 1)
            if (item.isDefault == 0) {
                this.runFilters = {}
                this.radio2 = ''
                this.$emit('runFilters', this.runFilters)
            }
        },
        setConditions(n) {
            this.filterConditions = n
            this.filterConditions.forEach((item, index) => {
                if (item.isDefault == 0) {
                    this.radio2 = index
                }
            })
            this.$emit('quickFilters', this.filterConditions)
        },
        clearFilterConditions() {
            this.filterConditions = []
            this.value5 = []
            this.fieldFilters = []
        },
        setFilter(y) {
            this.value5 = y.field
        },
        filterChange(value) {
            this.fieldFilters = value
            this.$emit('fieldFilters', this.fieldFilters)
        },
        addConditions() {
            this.ruleForm.cnFilterName = ''
            this.dialogVisible = true
            // this.$nextTick(() => {
            //     this.$refs.conditionEdit.initialSub() // 初始化下拉框的
            // })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => { // 校验筛选项名称
                if (valid) {
                    this.$refs.conditionEdit.finishSelect()
                    if (this.$refs.conditionEdit.collectData() && this.filtersOb.filters) { // this.filtersOb.filters是第一个条件有值时
                        if (this.finish) { // 如果下拉选项都完成则关闭弹框
                            let quickOption = {
                                cnFilterName: '',
                                isDefault: 1,
                                filterInfo: [],
                                relation: ''
                            }
                            quickOption.cnFilterName = this.ruleForm.cnFilterName
                            quickOption.filterInfo = this.filtersOb.filters
                            quickOption.relation = this.filtersOb.relation
                            let isReportName = false
                            this.filterConditions.forEach(item => {
                                if (item.cnFilterName == quickOption.cnFilterName) {
                                    isReportName = true // 检查筛选项名称 是否重复
                                }
                            })
                            if (this.editFlag) { // 如果是编辑时
                                this.filterConditions.splice(this.editIndex, 1, quickOption)
                                this.dialogVisible = false
                                this.editFlag = false
                            } else { // 新建条件时
                                if (!isReportName) {
                                    this.filterConditions.push(quickOption)
                                    this.dialogVisible = false
                                } else {
                                    this.$message({
                                        message: '筛选项名称重复！',
                                        type: 'warning'
                                    })
                                }
                            }
                            if (this.filterConditions.length > 0) {
                                console.log('+++', this.filterConditions)
                                this.$emit('quickFilters', this.filterConditions)
                            }
                        }
                    } else { // 如果第一个条件没有选择，则不关闭弹窗
                        this.$message({
                            message: '请完成条件选择项',
                            type: 'warning'
                        })
                    }
                } else {
                    return false
                }
            })
        },
        cancel() {
            this.ruleForm.name = '' // 恢复初始化
            // this.$refs.conditionEdit.initialSub() // 初始化下拉框的值
            this.dialogVisible = false
            this.editFlag = false
        },
        isFinish(n) {
            this.finish = n
            // return n
        },
        getFilters(n) {
            this.filtersOb = n
        },
        changeDefault(value) {
            this.runFilters = {} // 运行时筛选条件(快速筛选条件中打√的) 恢复初始化
            this.filterConditions.forEach((item, index) => {
                if (value == index) {
                    item.isDefault = 0
                    let cloneItem = JSON.parse(JSON.stringify(item))
                    delete cloneItem.cnFilterName
                    delete cloneItem.isDefault
                    cloneItem.filters = cloneItem.filterInfo
                    delete cloneItem.filterInfo // 把filterInfo属性改名成filterInfo
                    this.runFilters = cloneItem
                } else {
                    item.isDefault = 1
                }
            })
            this.$emit('runFilters', this.runFilters)
        },
        editConditions(n, i) {
            this.ruleForm.cnFilterName = n.cnFilterName
            this.dialogVisible = true
            this.editFlag = true // 标识编辑状态
            this.editIndex = i
            this.$nextTick(() => {
                this.$refs.conditionEdit.triggerSetEdit(n)
            })
        }
    },
    components: {
        'condition-edit': ConditionEdit,
        'radio-edit': RadioEdit
        // 'dialog': Dialog
    },
    watch: {
        modules(val) {
            if (val[0].field) {
                this.modulesOption = val[0].field
            }
        }
    }
}
</script>
<style lang="less">
.listRadio li label .el-radio__label {
    position: absolute;
    // top: -30px;
    left: 30px;
}
</style>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
