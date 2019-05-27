<template>
    <div class="ConditionEdit">
        <template v-for="(item,index) in showData">
            <div v-if="item.preVirtualControlType==8" :key="index">
                <con-item ref="conItem" v-for="(cItem,cIndex) in conditions" :key="cItem.uuid" :showFormat="item.paramsKey_childs" :condition="cItem" :conLength="conditions.length" :index="cIndex" :modules="modules" :isLast="cIndex==conditions.length-1" @add="addCondition()" @remove="removeCondition(cIndex)" @changeLogic="changeLogic(cIndex)" :logic="logicFlags[cIndex]">
                </con-item>
            </div>
            <div v-if="item.preVirtualControlType==9" :key="index" class="clearfix line">
                <div class="pull-left">{{item.showName}}</div>
                <div class="editBox">
                    <el-input class="input" :disabled="!isEdit" v-model="logicExpressionShow"></el-input>
                    <el-button v-if="!isEdit" type="text" @click="toEditExpress()">编辑模式</el-button>
                    <template v-else>
                        <el-button type="primary" @click="changeExpress()">确定</el-button>
                        <el-button @click="cacelChange()">取消</el-button>
                    </template>
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
        showData: {
            type: Array,
            default: () => []
        },
        modules: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            conditions: [{ uuid: this.getId() }],
            logicFlags: [],
            logicExpression: '1',
            logicExpressionShow: '1',
            isLoading: false,
            logicError: false,
            isEdit: false
        }
    },
    methods: {
        getId() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                let r = Math.random() * 16 | 0
                let v = c == 'x' ? r : (r & 0x3 | 0x8)
                return v.toString(16)
            })
        },
        collectData() {
            let indexArr = []
            this.$refs.conItem.forEach((item, index) => {
                if (!item.isComplete()) {
                    indexArr.push(index + 1)
                }
            })
            let conditions = this.conditions.map(item => {
                let temp = { ...item }
                delete temp.uuid
                return temp
            })

            return { noCompletes: indexArr, conditions, logicExpression: this.logicExpression }
        },
        addCondition() {
            if (this.isEdit) {
                this.$alert('在编辑模式无法操作', '注意', {
                    confirmButtonText: '明白了',
                    callback: action => {

                    }
                })
                return
            }
            this.logicFlags.push(0)
            this.conditions.push({ uuid: this.getId() })
            this.clacExpression()
        },
        removeCondition(index) {
            if (this.isEdit) {
                this.$alert('在编辑模式无法操作', '注意', {
                    confirmButtonText: '明白了',
                    callback: action => {

                    }
                })
                return
            }
            this.conditions.splice(index, 1)
            this.logicFlags.splice(index - 1, 1)
            this.clacExpression()
        },
        changeLogic(index) {
            if (this.isEdit) {
                this.$alert('在编辑模式无法操作', '注意', {
                    confirmButtonText: '明白了',
                    callback: action => {

                    }
                })
                return
            }
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
        toEditExpress() {
            this.isEdit = true
            this.logicExpressionShow_backup = this.logicExpressionShow
            this.$emit('editStatusChange', this.isEdit)
        },
        cacelChange() {
            this.isEdit = false
            this.logicExpressionShow = this.logicExpressionShow_backup
            this.$emit('editStatusChange', this.isEdit)
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
