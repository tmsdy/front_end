<template>
    <div class="ConditionEdit">
        <template>
            <div>
                <con-item ref="conItem" :modules="modules" @add="addCondition()" v-for="(cItem,cIndex) in conditions" :condition="cItem" :key="cIndex" :isLast="cIndex==conditions.length-1" :index="cIndex" :conLength="conditions.length" @remove="removeCondition(cIndex)" :logic="logicFlags[cIndex]" @changeLogic="changeLogic(cIndex)" @clearConditions="clearConditions"></con-item>
            </div>
            <div class="clearfix line">
                <div class="pull-left">条件匹配</div>
                <div class="editBox">
                    <el-input class="input" :disabled="true" v-model="logicExpressionShow"></el-input>
                    <!-- <el-button v-if="!isEdit" type="text" @click="toEditExpress()">编辑模式</el-button> -->
                    <!-- <template v-else>
                        <el-button type="primary" @click="changeExpress()">确定</el-button>
                        <el-button @click="cacelChange()">取消</el-button>
                    </template> -->
                </div>
            </div>
        </template>
    </div>
</template>
<script>
import ConItem from './ConItem'
export default {
    name: 'ConditionEdit',
    props: {
        modules: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            conditions: [{
                conditionFirst: { time: false },
                conditionSecond: '',
                conditionThird: '',
                conditionArea: []
            }],
            logicFlags: [],
            logicExpression: '1',
            logicExpressionShow: '1',
            isLoading: false,
            logicError: false,
            isFinish: false
        }
    },
    methods: {
        clearConditions() {
            this.conditions = [{
                conditionFirst: { time: false },
                conditionSecond: '',
                conditionThird: '',
                conditionArea: []
            }]
        },
        getId() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                let r = Math.random() * 16 | 0
                let v = c == 'x' ? r : (r & 0x3 | 0x8)
                return v.toString(16)
            })
        },
        // initialSub() { // 初始化子组件中下拉框的值
        // if (this.conditions.length > 1) {
        //    this.conditions.splice(0, 1)
        //     this.logicExpressionShow = '1'
        // }
        // this.$refs.conItem.forEach((item, index) => {
        //         item.initial()
        //     })
        // },
        finishSelect() {
            let indexArr = []
            this.$refs.conItem.forEach((item, index) => {
                if (!item.isComplete()) {
                    indexArr.push(index + 1)
                    this.isFinish = true
                } else {
                    this.isFinish = false
                    this.$message({
                        message: '请完成条件' + (index + 1) + '选择项',
                        type: 'warning'
                    })
                    return false
                }
            })
            this.$emit('isFinish', this.isFinish) // 是否完成下拉选项
        },
        collectData() {
            this.finishSelect()
            let filterSb = {
                fieldId: 0,
                expression: '',
                inputFilter: '',
                relationType: '',
                sortOrder: 0,
                formula: ''
            }
            let filters = []
            let conditions = this.conditions.map(item => {
                let temp = { ...item }
                return temp
            })
            if (conditions.length > 0 && this.isFinish) {
                conditions.forEach((item, index) => {
                    let clonefilterSb = JSON.parse(JSON.stringify(filterSb))
                    if (item.conditionArea.length > 0) { // 选择国家地区
                        item.conditionArea = item.conditionArea.filter(item => item.value != '')
                        item.conditionArea.forEach((ele) => {
                            let area = ele.key
                            switch (area) {
                                case 'provinceId': clonefilterSb.fieldId = 25
                                    break
                                case 'cityId': clonefilterSb.fieldId = 26
                                    break
                                case 'townId': clonefilterSb.fieldId = 27
                                    break
                                case 'countryId': clonefilterSb.fieldId = 24
                                    break
                            }
                            clonefilterSb.inputFilter = ele.value
                            clonefilterSb.expression = item.conditionSecond.expression
                        })
                        if (item.conditionFirst.fieldId == -1) {
                            filters.push(clonefilterSb)
                        }
                    } else {
                        clonefilterSb.fieldId = item.conditionFirst.fieldId
                        clonefilterSb.expression = item.conditionSecond.expression
                        if (item.conditionThird) {
                            if (item.conditionThird.indexOf('至') > 0) {
                                let replaceSt = item.conditionThird.replace('至', ',')
                                clonefilterSb.inputFilter = replaceSt
                            } else {
                                clonefilterSb.inputFilter = item.conditionThird
                            }
                        } else if (item.conditionSecond.formula) {
                            clonefilterSb.inputFilter = item.conditionSecond.value // 如果是第一级是时间 第二集选系统字段
                        } else {
                            clonefilterSb.inputFilter = ''
                        }
                        if (this.logicFlags[index] == 1) {
                            clonefilterSb.relationType = '与'
                        } else if (this.logicFlags[index] == 0) {
                            clonefilterSb.relationType = '或'
                        } else {
                            clonefilterSb.relationType = ''
                        }
                        clonefilterSb.sortOrder = index + 1
                        if (item.conditionFirst.time && item.conditionSecond.formula) {
                            clonefilterSb.formula = item.conditionSecond.formula
                        } else {
                            clonefilterSb.formula = ''
                        }
                        if (item.conditionFirst.fieldId != undefined) {
                            filters.push(clonefilterSb)
                        } else {
                            let clearObj = ''
                            this.$emit('getFilters', clearObj)
                        }
                    }
                })
                let defaultFilters = {}
                if (filters.length > 0) {
                    defaultFilters = {
                        filters: filters,
                        relation: this.logicExpressionShow
                    }
                    this.$emit('getFilters', defaultFilters)
                    return defaultFilters
                }
                return true
            } else {
                return false
            }
            // return { noCompletes: indexArr, conditions, logicExpression: this.logicExpression }
        },
        // processData() {

        // },
        addCondition() {
            // if (this.isEdit) {
            //     this.$alert('在编辑模式无法操作', '注意', {
            //         confirmButtonText: '明白了',
            //         callback: action => {

            //         }
            //     })
            //     return
            // }
            this.logicFlags.push(0)
            this.conditions.push({
                conditionFirst: { time: false },
                conditionSecond: '',
                conditionThird: '',
                conditionArea: []
            })
            this.clacExpression()
        },
        removeCondition(index) {
            // if (this.isEdit) {
            //     this.$alert('在编辑模式无法操作', '注意', {
            //         confirmButtonText: '明白了',
            //         callback: action => {

            //         }
            //     })
            //     return
            // }
            let cloneConditions = JSON.parse(JSON.stringify(this.conditions))
            console.log(cloneConditions)
            this.conditions.splice(index, 1)
            this.conditions.forEach(item => {
                item.conditionFirst['flag'] = true
                if (item.conditionSecond != '') {
                    item.conditionSecond['flag'] = true
                }
            })
            this.logicFlags.splice(index - 1, 1)
            this.clacExpression()
        },
        changeLogic(index) {
            // if (this.isEdit) {
            //     this.$alert('在编辑模式无法操作', '注意', {
            //         confirmButtonText: '明白了',
            //         callback: action => {

            //         }
            //     })
            //     return
            // }
            let flag = this.logicFlags[index] ? 0 : 1
            this.logicFlags.splice(index, 1, flag)
            this.clacExpression()
        },
        checkBrackets() {
            let regError = new RegExp(/\(\)|\)\(/g)
            if (regError.test(this.logicExpression)) {
                return false
            }
            let regBrackets = new RegExp(/\(|\)/g)
            let matchBrackets = this.logicExpression.match(regBrackets) || []
            let matchStack = []
            for (let index = 0; index < matchBrackets.length; index++) {
                const item = matchBrackets[index]
                if (item == '(') {
                    matchStack.push(item)
                }
                if (item == ')') {
                    let b = matchStack.pop()
                    if (b !== '(') {
                        return false
                    }
                }
            }
            if (matchStack.length > 0) {
                return false
            }

            return true
        },
        checkOrder() {
            let regIndex = new RegExp(/\d/, 'g')
            let matchIndex = this.logicExpression.match(regIndex) || []
            for (let index = 0; index < matchIndex.length; index++) {
                const item = matchIndex[index]
                if (item != (index + 1)) {
                    return false
                }
            }
            return true
        },
        changeExpress() {
            let regAll = new RegExp(/[^\&\|\(\)\d]/ig)
            this.logicExpression = this.logicExpressionShow.replace(/或/g, '|').replace(/与/g, '&')
            let regLogic = new RegExp(/\||\&/, 'g')
            let regIndex = new RegExp(/\d/, 'g')
            let matchLogic = this.logicExpression.match(regLogic) || []
            let matchIndex = this.logicExpression.match(regIndex) || []
            if (matchIndex.length != matchLogic.length + 1 || regAll.test(this.logicExpression)) {
                // 表达式有错误
                this.logicError = true
                return
            }
            let isMatchBrackets = this.checkBrackets()
            if (!isMatchBrackets) {
                // 括号不匹配
                this.logicError = true
                return
            }
            let isOrder = this.checkOrder()
            if (!isOrder) {
                // 顺序不对
                this.logicError = true
                return
            }
            if (matchIndex.length !== this.conditions.length) {
                // index不匹配
                this.logicError = true
                return
            }
            if (matchLogic.length !== this.logicFlags.length) {
                // 逻辑数量不同
                this.logicError = true
                return
            }

            let matchFlags = matchLogic.map(item => {
                if (item == '|') {
                    return 0
                }
                if (item == '&') {
                    return 1
                }
            })
            this.logicFlags = matchFlags
            this.isEdit = false
            this.$emit('editStatusChange', this.isEdit)
            /*  this.clacExpression() */
        },
        clacExpression() {
            let reg = new RegExp(/\||\&/, 'g')
            let matchArr = this.logicExpression.match(reg) || []
            let matchFlags = matchArr.map(item => {
                if (item == '|') {
                    return 0
                }
                if (item == '&') {
                    return 1
                }
            })
            let logicFlags = this.logicFlags
            if (matchArr.length < logicFlags.length) {
                this.logicExpression = `(${this.logicExpression}${logicFlags[logicFlags.length - 1] ? '&' : '|'}${this.conditions.length})`
            }
            if (matchArr.length == logicFlags.length) {
                let andCount = 0
                let orCount = 0
                matchFlags.forEach((item, index) => {
                    if (item) {
                        andCount = andCount + 1
                    } else {
                        orCount = orCount + 1
                    }
                    if (logicFlags[index] !== item) {
                        let flag = item ? '|' : '&'
                        let r = item ? '&' : '|'
                        let i = item ? andCount : orCount
                        let strArr = this.logicExpression.split('')
                        let ii = 0
                        strArr.forEach((item, index) => {
                            if (item == r) {
                                ii += 1
                                if (ii == i) {
                                    strArr[index] = flag
                                }
                            }
                        })
                        this.logicExpression = strArr.join('')
                    }
                })
            }

            if (matchArr.length > logicFlags.length) {
                let str = ''
                this.conditions.forEach((item, index) => {
                    if (index == 0) {
                        str += 1
                    } else {
                        str = `(${str}${logicFlags[index - 1] ? '&' : '|'}${index + 1})`
                    }
                })
                this.logicExpression = str
            }
            this.logicExpressionShow = this.logicExpression.replace(/&/g, '与').replace(/\|/g, '或')
        },
        triggerSetEdit(n) {
            for (let i = 1; i < n.filterInfo.length; i++) {
                this.addCondition()
            }
            this.$nextTick(() => {
                n.filterInfo.forEach((item, index) => {
                    this.$refs.conItem[index].setEditDefault(index, n)
                })
            })
            if (n.relation) {
                this.logicExpressionShow = n.relation
            }
        }
    },
    watch: {},
    components: {
        'con-item': ConItem
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
