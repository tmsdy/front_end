<template>
    <div class="createthird" v-loading="isLoading" :class="{ areaH: isLoading}">
        <div class="selectWrap">
            <!-- <div class="leftTitle">取数权限</div> -->
            <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="130px" label-position="left">
                <el-form-item label="取数权限" prop="dataScope">
                    <el-select v-model="ruleForm.dataScope" placeholder="请选择" style="width:160px">
                        <el-option label="运行者" value="4"></el-option>
                        <el-option label="运行者所属部门" value="2"></el-option>
                        <el-option label="指定部门" value="1"></el-option>
                        <!-- 主数据选择客户档案时才有 -->
                        <el-option label="运行者权限内" value="3" v-show="moduleCodes.indexOf('BF001')>=0"></el-option>
                        <el-option label="全部" value="0"></el-option>
                    </el-select>
                    <el-select v-model="deptKey" placeholder="请选择" style="width:160px;margin-left:20px;" v-show="ruleForm.dataScope=='1'">
                        <el-option v-for="(val,key) in departmentList" :key="key" :label="val" :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div class="selectWrap" style="border-bottom:1px solid #EAEDEF">
            <div class="leftTitle">默认筛选条件</div>
            <div>
                <p style="color:#909399;height:32px;line-height:32px;">（运行时不显示）</p>
                <!-- <con-item @changeLogic="changeLogic(cIndex)"></con-item> -->
                <condition-edit ref="conditionEdit" :modules="modules" @getFilters='getFilters'></condition-edit>
            </div>
        </div>
        <div class="selectWrap">
            <div class="leftTitle">运行时筛选条件</div>
            <div style="width:85%;">
                <fast-filter ref="fastFilter" :modules="modules" @fieldFilters="getFieldFilters" @runFilters="getRunFilters" @quickFilters="getQuickFilters" :simpleFilterArr="simpleFilterArr"></fast-filter>
            </div>
        </div>
        <!-- 11 -->
        <div class="selectWrap">
            <div class="leftTitle"></div>
            <div>
                <el-button type="primary" v-if="false">运行</el-button>
                <el-button type="primary" @click="backPrev">上一步</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">下一步</el-button>
                <el-button type="primary" @click="save" v-show="this.$route.query.hasOwnProperty('reportId')">保存</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ConditionEdit from './ConditionEdit'
import FastFilter from './FastFilter'
export default {
    name: 'createthird',
    props: {
        moduleCodes: {
            type: Array,
            default: () => []
        },
        isChangeflagModule: {
            type: Boolean,
            default: false
        },
        tabData: {
            type: String,
            default: function () {
                return ''
            }
        }
    },
    data() {
        return {
            deptKey: '',
            reportdemo1: '/static/customReport/add02.jpg',
            deptList: [], // 指定部门
            isEdit: false, // 是否编辑快捷筛选项
            modules: [],
            ruleForm: {
                dataScope: ''
            },
            rules: {
                dataScope: [
                    { required: true, message: '请选择取数权限', trigger: 'change' }
                ]
            },
            defaultFilters: {},
            fieldFilters: [],
            runFilters: {},
            quickFilters: {
                filters: []
            },
            reportId: '',
            isLoading: false,
            returnData: {}, // 后端返回回显数据
            flagRender: false, // 标记回显是否渲染
            simpleFilterArr: []
        }
    },
    created() {
        for (var key in this.departmentList) { // 设置所选部门默认值
            this.deptKey = key
            return
        }
    },
    mounted() {
    },
    computed: {
        ...mapGetters(['departmentList'])
    },
    methods: {
        simpleFilter(x) {
            let data = {
                moduleCode: x
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v1.simpleFilter, { params: data })
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.simpleFilterArr = res.body.data.field
                        console.log(this.simpleFilterArr)
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        clear() {
            this.$refs.conditionEdit.clearConditions() // 清除默认筛选条件
            this.defaultFilters = {}
            this.$refs.fastFilter.clearFilterConditions() // 清除快捷筛选项
            this.quickFilters.filters = []
            this.fieldFilters = [] // 清除字段筛选项
        },
        getFieldFilters(n) {
            this.fieldFilters = n
        },
        selectvalue() {
            if (this.value5.length > 2) {
                for (let item of this.options) {
                    // 删选出已经选择的数据
                    if (this.value5.indexOf(item.value) < 0) {
                        item.disabled = true
                    }
                }
            } else {
                for (let item of this.options) {
                    item.disabled = false
                }
            }
        },
        handleClick(tab, event) {
            // console.log(tab, event)
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.$refs.conditionEdit.collectData()) {
                        this.SummaryParamesData()
                        this.$emit('changeTabData', '4')
                    }
                } else {
                    return false
                }
            })
        },
        backPrev() {
            this.$emit('changeTabData', '2')
            this.$emit('changeModuleFlag')
        },
        // 汇总参数
        SummaryParamesData() {
            let thirdParames = {}
            thirdParames.dataScope = parseInt(this.ruleForm.dataScope)
            if (this.ruleForm.dataScope == '1') {
                thirdParames.deptKey = parseInt(this.deptKey)
            } else {
                thirdParames.deptKey = 0
            }
            var arr = Object.keys(this.defaultFilters)
            if (arr.length > 0) { // 判断defaultFilters是不是空对象
                thirdParames.defaultFilters = this.defaultFilters
            }
            // 字段筛选项
            let standardFilters = {
                fieldId: 0,
                expression: '',
                inputFilter: '',
                sortOrder: 0,
                relationType: '',
                formula: '',
                filtertype: -1,
                isLoadOperation: 1
            }
            let filters = []
            this.fieldFilters.forEach(item => {
                let clonesStandardFilters = JSON.parse(JSON.stringify(standardFilters))
                if (item.fieldGroup == 1) { // 地区类型
                    let arr = [24, 25, 26, 27] // 地区属性fieldId
                    arr.forEach(ele => {
                        let clonesStandardFilters = JSON.parse(JSON.stringify(standardFilters))
                        clonesStandardFilters.fieldId = ele
                        filters.push(clonesStandardFilters)
                    })
                } else {
                    clonesStandardFilters.fieldId = item.fieldId
                    filters.push(clonesStandardFilters)
                }
            })
            if (filters.length > 0) {
                thirdParames.filters = filters
            }
            if (Object.keys(this.runFilters).length != 0) {
                thirdParames.runFilters = this.runFilters
            }
            if (this.quickFilters.filters.length > 0) {
                thirdParames.quickFilters = this.quickFilters
            } else {
                delete thirdParames.quickFilters
            }
            this.$emit('thirdParames', thirdParames)
            return thirdParames
        },
        //  获取筛选字段
        async getFilterFields(x) {
            let data = {
                moduleCodes: x
            }
            if (x.length > 0) {
                await this.$http.get(this.Global.baseURL + this.Global.api.v1.filterField, { params: data })
                    .then(res => {
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            this.modules = res.body.data.filterFields
                        } else {
                            this.$message.error(this.msg(res.body))
                        }
                    },
                        res => {
                            this.$message.error(this.$t(this.Global.errorTitle))
                        }
                    )
            }
        },
        getFilters(n) {
            this.defaultFilters = n
        },
        getRunFilters(n) {
            this.runFilters = n
        },
        getQuickFilters(n) {
            this.quickFilters.filters = n
        },
        async getReportPage3() {
            let { reportId } = this.$route.query
            this.reportId = reportId
            if (reportId) {
                this.isEdit = true
                await this.$http.get(this.Global.baseURL + this.Global.api.v1.reportPage3, { params: { reportId: reportId } })
                    .then(res => {
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            let mainModule = res.body.data.mainModule
                            this.ruleForm.dataScope = res.body.data.dataScope + ''
                            if (this.ruleForm.dataScope == 1) { // 如果是指定部门
                                this.deptKey = res.body.data.deptKey + ''
                            }
                            let defaultFilters = {}
                            if (res.body.data.hasOwnProperty('defaultFilters')) {
                                defaultFilters.filterInfo = res.body.data.defaultFilters
                                defaultFilters.filterInfo.forEach(item => {
                                    item['defaultFlag'] = true
                                })
                                defaultFilters.relation = res.body.data.defaultRelation
                            }
                            let filters = []
                            if (res.body.data.hasOwnProperty('filters')) {
                                filters = res.body.data.filters
                            }
                            let quickFilters = []
                            let quickFilterInfo = {}
                            if (res.body.data.hasOwnProperty('quickFilters')) {
                                quickFilters = res.body.data.quickFilters
                                quickFilterInfo = res.body.data.quickFilterInfo
                                quickFilters.forEach(item => {
                                    item.filterInfo = quickFilterInfo[item.qFilterId]
                                    item.relation = res.body.data.quickRelation[item.qFilterId]
                                    delete item.qFilterId
                                })
                            }
                            this.getFilterFields(mainModule).then(success => this.setFilter(defaultFilters, filters, quickFilters)).then(success => this.setRenturnData())
                                .catch(error => console.log('失败', error))
                        } else {
                            this.$message.error(this.msg(res.body))
                        }
                    },
                        res => {
                            this.$message.error(this.$t(this.Global.errorTitle))
                        }
                    )
            }
        },
        setFilter(x, y, z) { // x是默认筛选条件 y是字段筛选项 z是快速筛选项
            if (Object.keys(x).length > 0) {
                this.$refs.conditionEdit.triggerSetEdit(x)
                this.getFilters(x)
            }
            if (y.field.length > 0) {
                this.$refs.fastFilter.setFilter(y)
            }
            if (z.length > 0) {
                this.$refs.fastFilter.setConditions(z)
            }
        },
        save() {
            if (this.$refs.conditionEdit.collectData()) {
                let obj = this.SummaryParamesData()
                let saveData = JSON.parse(JSON.stringify(obj))
                this.objKeySort(saveData)
                // 比较当前数据和返回数据是否有修改
                // this.sortData(saveData)
                // this.sortData(this.returnData)
                // console.log(this.returnData)
                // console.log(saveData)
                if (!this.deepCompare(saveData, this.returnData)) {
                    let scope = {
                    }
                    if (saveData.dataScope != this.returnData.dataScope) {
                        scope.scope = {}
                        scope.scope.dataScope = saveData.dataScope
                    }
                    if (saveData.deptKey != this.returnData.deptKey) {
                        scope.scope = {}
                        scope.scope.dataScope = saveData.dataScope
                        scope.scope.deptKey = saveData.deptKey
                    }
                    // 默认筛选条件,如果返回的数据和当前的数据都有defaultFilters属性
                    if (this.returnData.hasOwnProperty('defaultFilters') && saveData.hasOwnProperty('defaultFilters')) {
                        if (!this.deepCompare(saveData.defaultFilters.filters, this.returnData.defaultFilters.filters)) {
                            scope.addDefaultFilter = saveData.defaultFilters
                        }
                    } else if (!this.returnData.hasOwnProperty('defaultFilters') && saveData.hasOwnProperty('defaultFilters')) { // 如果返回没有该属性，当前有该属性
                        scope.addDefaultFilter = saveData.defaultFilters
                    } else if (this.returnData.hasOwnProperty('defaultFilters') && !saveData.hasOwnProperty('defaultFilters')) { // 如果返回有该属性，当前没有
                        scope.delDefaultFilter = true
                    }
                    // 字段筛选项
                    if (this.returnData.hasOwnProperty('filters') && saveData.hasOwnProperty('filters')) {
                        if (!this.deepCompare(saveData.filters, this.returnData.filters)) {
                            let arr = []
                            saveData.filters.forEach(item => {
                                arr.push(item.fieldId)
                            })
                            scope.addFieldFilter = arr
                        }
                    } else if (!this.returnData.hasOwnProperty('filters') && saveData.hasOwnProperty('filters')) {
                        if (!this.deepCompare(saveData.filters, this.returnData.filters)) {
                            let arr = []
                            saveData.filters.forEach(item => {
                                arr.push(item.fieldId)
                            })
                            scope.addFieldFilter = arr
                        } else if (this.returnData.hasOwnProperty('filters') && !saveData.hasOwnProperty('filters')) {
                            scope.delFieldFilter = true
                        }
                    } else if (this.returnData.hasOwnProperty('filters') && !saveData.hasOwnProperty('filters')) {
                        scope.delFieldFilter = true
                    }
                    // 快捷筛选项
                    if (this.returnData.hasOwnProperty('quickFilters') && saveData.hasOwnProperty('quickFilters')) {
                        if (!this.deepCompare(saveData.quickFilters.filters, this.returnData.quickFilters.filters)) {
                            scope.addQuickFilter = saveData.quickFilters
                        }
                    } else if (!this.returnData.hasOwnProperty('quickFilters') && saveData.hasOwnProperty('quickFilters')) {
                        scope.addQuickFilter = saveData.quickFilters
                    } else if (this.returnData.hasOwnProperty('quickFilters') && !saveData.hasOwnProperty('quickFilters')) {
                        scope.delQuickFilter = true
                    }
                    // 运行时筛选条件
                    if (this.returnData.hasOwnProperty('runFilter') && saveData.hasOwnProperty('runFilter')) {
                        if (!this.deepCompare(saveData.runFilters.filters, this.returnData.runFilters.filters)) {
                            scope.runFilter = saveData.runFilters
                        }
                    } else if (!this.returnData.hasOwnProperty('quickFilters') && saveData.hasOwnProperty('quickFilters')) {
                        scope.runFilter = saveData.runFilters
                    } else if (this.returnData.hasOwnProperty('quickFilters') && !saveData.hasOwnProperty('quickFilters')) {
                        scope.delRunFilter = true
                    }
                    let data = {
                        reportId: this.reportId,
                        info: {}
                    }
                    data.info = scope
                    this.putReportPage(data)
                } else {
                    this.$message.error('您暂时没有需要保存的字段！')
                }
            }
        },
        setRenturnData() {
            let obj = this.SummaryParamesData()
            this.returnData = JSON.parse(JSON.stringify(obj))
            if (this.returnData.hasOwnProperty('defaultFilters')) {
                let key = this.returnData.defaultFilters.filterInfo
                this.returnData.defaultFilters.filters = key
                delete this.returnData.defaultFilters.filterInfo
            }
        },
        // 对象排序
        objKeySort(obj) {
            var newkey = Object.keys(obj).sort()
            var newObj = {} // 创建一个新的对象，用于存放排好序的键值对
            for (var i = 0; i < newkey.length; i++) { // 遍历newkey数组
                newObj[newkey[i]] = obj[newkey[i]] // 向新创建的对象中按照排好的顺序依次增加键值对
            }
            return newObj // 返回排好序的新对象
        },
        putReportPage(x) {
            this.isLoading = true
            this.$http.put(this.Global.baseURL + this.Global.api.v1.reportPage3, x)
                .then(res => {
                    this.isLoading = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.$message.success(this.msg(res.body))
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.isLoading = false
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        deepCompare() {
            var i, l, leftChain, rightChain

            function compare2Objects(x, y) {
                var p

                // remember that NaN === NaN returns false
                // and isNaN(undefined) returns true
                if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
                    return true
                }

                // Compare primitives and functions.
                // Check if both arguments link to the same object.
                // Especially useful on the step where we compare prototypes
                if (x === y) {
                    return true
                }

                // Works in case when functions are created in constructor.
                // Comparing dates is a common scenario. Another built-ins?
                // We can even handle functions passed across iframes
                if ((typeof x === 'function' && typeof y === 'function') ||
                    (x instanceof Date && y instanceof Date) ||
                    (x instanceof RegExp && y instanceof RegExp) ||
                    (x instanceof String && y instanceof String) ||
                    (x instanceof Number && y instanceof Number)) {
                    return x.toString() === y.toString()
                }

                // At last checking prototypes as good as we can
                if (!(x instanceof Object && y instanceof Object)) {
                    return false
                }

                if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
                    return false
                }

                if (x.constructor !== y.constructor) {
                    return false
                }

                if (x.prototype !== y.prototype) {
                    return false
                }

                // Check for infinitive linking loops
                if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
                    return false
                }

                // Quick checking of one object being a subset of another.
                // todo: cache the structure of arguments[0] for performance
                for (p in y) {
                    if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                        return false
                    } else if (typeof y[p] !== typeof x[p]) {
                        return false
                    }
                }

                for (p in x) {
                    if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                        return false
                    } else if (typeof y[p] !== typeof x[p]) {
                        return false
                    }

                    switch (typeof (x[p])) {
                        case 'object':
                        case 'function':

                            leftChain.push(x)
                            rightChain.push(y)

                            if (!compare2Objects(x[p], y[p])) {
                                return false
                            }

                            leftChain.pop()
                            rightChain.pop()
                            break

                        default:
                            if (x[p] !== y[p]) {
                                return false
                            }
                            break
                    }
                }

                return true
            }

            if (arguments.length < 1) {
                return true
            }

            for (i = 1, l = arguments.length; i < l; i++) {
                leftChain = [] // Todo: this can be cached
                rightChain = []

                if (!compare2Objects(arguments[0], arguments[i])) {
                    return false
                }
            }

            return true
        }
        //
    },
    watch: {
        moduleCodes(val, old) {
            if (val.length > 0) {
                this.getFilterFields(val[0])
                this.simpleFilter(val[0])
            }
        },
        async tabData(val) {
            if (val == 3 && !this.flagRender) {
                this.flagRender = true
                await this.getReportPage3()
            }
        }
    },
    components: {
        'condition-edit': ConditionEdit,
        'fast-filter': FastFilter
    }
}
</script>
<style lang="less">
</style>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
