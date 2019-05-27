<template>
    <div class="stepItem stepCondition clearfix" :class="{'hasNextStep':logicLength==2&&logicIndex==0}">
        <div class="stepFlag">
            <div class="text">条 件</div>
        </div>
        <div v-loading.body="isLoading" class="stepBox">
            <!-- 修改的 -->
            <div v-show="isEdit||isModify" class="stepContent">
                <p class="title">什么条件下执行</p>
                <div class="typeTabBox" v-for="(item,index) in conditionData" :key="index">
                    <template v-if="!item.paramsKey">
                        <div class="typeItemBox">
                            <template v-for="(item2,index2) in item.childParams">
                                <el-radio v-if="item2.preVirtualControlType==3" v-model="logicCond[item2.paramsKey]" :label="item2[item2.paramsKey]" :key="index2">{{item2.showName}}</el-radio>
                            </template>
                        </div>
                        <template v-for="(item2,index2) in item.childParams" class="conditionEditBox">
                            <condition-edit v-if="logicCond[item2.paramsKey]==item2[item2.paramsKey]&&item2.childParams&&item2.preVirtualControlType==3" ref="conditionEdit" :key="index2" :modules="modules" :showData="item2.childParams" @editStatusChange="editExpressStatusChange"></condition-edit>
                        </template>
                    </template>
                    <template v-else>
                        <div class="tishiBox" v-if="item.preVirtualControlType==4">
                            <el-checkbox @change="setItem(item)" :checked="isChecked(item)">{{item.showName}}</el-checkbox>
                            <p class="input" v-for="(item2,index2) in item.childParams" :key="index2">
                                <template v-if="item2.virtualControlType">
                                    <el-input v-model="logicCond[item2.paramsKey]" :disabled="item2.virtualControlType==21" :placeholder="item2.showName"></el-input>
                                </template>
                            </p>
                        </div>
                    </template>
                </div>
                <el-button :loading="isSaving" type="primary" @click="commitData()">确定</el-button>
                <!--  <el-button v-if="isModify" :disabled="isSaving" @click="cancelModify()">取消</el-button> -->
            </div>
            <!-- 展示的 -->
            <div v-if="!isEdit&&!isModify" class="stepContentShow">
                <div class="typeTabBox" v-for="(item,index) in conditionData" :key="index">
                    <template v-if="!item.paramsKey">
                        <div v-if="logicCond['matchingType']==2" class="typeItemBox">
                            该规则将对所有 {{strategyDesForm.moduleName}} 执行
                        </div>
                        <template v-else>
                            <condition-show :conditions="conditions" :logicExpression="logicCond.logicExpression" :modules="modules"></condition-show>
                            <div class="expressShow">
                                <span class="label">条件匹配:</span>
                                <span class="content">{{logicCond.logicExpression.replace(/\|/g,'或').replace(/\&/g,'与')}}</span>
                            </div>
                        </template>
                    </template>
                    <template v-else>
                        <div class="tishiBox" v-if="item.preVirtualControlType==4">
                            <el-checkbox :disabled="true" :checked="isChecked(item)" class="title">{{item.showName}}</el-checkbox>
                            <template v-for="(item2,index2) in item.childParams">
                                <p class="content" v-if="item2.virtualControlType" :key="index2">
                                    提示内容:{{logicCond[item2.paramsKey]}}
                                </p>
                            </template>
                        </div>
                    </template>
                </div>
                <i class="iconfont icon-edit edit" @click="toModify()"></i>
            </div>
            <!-- 执行内容  -->
            <div v-if="logicCond.logicCondId" class="executeBox clearfix">
                <execute-now @actionChange="nowActionChange" :strategyDesForm="strategyDesForm" :actionTypes="actionTypes" :modules="modules" :logicCondId="logicCond.logicCondId" :execType="1" class="executeTime pull-left"></execute-now>
                <execute-delay @actionChange="delayActionChange" :strategyDesForm="strategyDesForm" :modules="modules" :actionTypes="actionTypes" :logicCondId="logicCond.logicCondId" :execType="2" class="executeTime pull-right"></execute-delay>
            </div>
        </div>
        <div v-if="logicLength==1&&logicIndex==0&&false" class="addStep">
            <div class="diamond" @click="addCondition()">
                <div class="content">
                    <i class="iconfont icon-plus-file"></i>
                    <p class="text">条件</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import ConditionEdit from '../ConditionEdit'
import ConditionShow from '../ConditionShow'
import ExecuteDelay from '../ExecuteDelay'
import ExecuteNow from '../ExecuteNow'

import { isObject } from '@/libs/utils'
export default {
    name: 'StepCondition',
    props: {
        logicIndex: {
            type: Number,
            default: 0
        },
        logicLength: {
            type: Number,
            default: 0
        },
        conditionData: {
            type: Array,
            default: () => []
        },
        strategyDesForm: {
            type: Object,
            default: () => ({})
        },
        isLoading: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            logicCond: {
                orderNo: this.logicIndex + 1,
                logicExpression: ''
            },
            modules: [],
            actionTypes: {
                mail: 1,
                remind: 2,
                webhook: 3,
                msg: 4,
                fun: 5,
                field: 6,
                tag: 7
            },
            existAction: {
                now: false,
                delay: false
            },
            conditions: [],
            isSaving: false,
            isEdit: true,
            isModify: false,
            editExpressStatus: false
        }
    },
    created() {
        this.getModules()
    },
    methods: {
        toModify() {
            this.isModify = true
        },
        cancelModify() {
            this.isModify = false
        },
        setItem(item) {
            if (this.logicCond[item.paramsKey]) {
                delete this.logicCond[item.paramsKey]
            } else {
                this.logicCond[item.paramsKey] = item[item.paramsKey]
            }
        },
        isChecked(item) {
            return this.logicCond[item.paramsKey] && this.logicCond[item.paramsKey] == item[item.paramsKey]
        },
        editExpressStatusChange(flag) {
            this.editExpressStatus = flag
        },
        nowActionChange(flag) {
            this.existAction.now = flag
        },
        delayActionChange(flag) {
            this.existAction.delay = flag
        },
        async commitData() {
            if (this.editExpressStatus) {
                // 编辑状态 不能保存
                this.$message({
                    message: '你先保存 条件匹配 编辑内容',
                    type: 'warning'
                })
                return
            }
            let { matchingType } = this.logicCond
            if (!matchingType) {
                return
            }
            let conditionArr = []
            if (matchingType == 1) {
                let { noCompletes, conditions, logicExpression } = this.$refs.conditionEdit[0].collectData()
                if (noCompletes.length > 0) {
                    // 提示不完整
                    this.$message.error(`第${noCompletes.join(',')}条 条件信息填写不完整`)
                    return
                }
                Object.assign(this.logicCond, { logicExpression })
                conditionArr = conditions
            }
            this.isSaving = true
            let flag = await this.saveData(conditionArr)
            this.isSaving = false

            if (flag) {
                if (this.isModify) {
                    this.isModify = false
                } else {
                    this.isEdit = false
                }
                console.log('-----------保存成功---------------')
                console.log(this.logicCond)
                console.log('-----------保存成功---------------')
            }
        },
        async saveData(conditions) {
            try {
                let url = this.Global.baseURL + this.Global.api.v2.autoStrategy_strategy
                let data = {
                    conditions,
                    logicCond: Object.assign({
                        strategyId: this.strategyDesForm.strategyId
                    }, this.logicCond)
                }
                let res = this.isModify
                    ? await this.$http.put(url, data)
                    : await this.$http.post(url, data)

                if (res.body.code.toString() == this.Global.RES_OK) {
                    if (isObject(res.body.data)) {
                        let { identKey, identValue } = res.body.data
                        Object.assign(this.logicCond, { [identKey]: identValue })
                    }
                    this.conditions = conditions
                    return true
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            return false
        },
        getModules() {
            let url = this.Global.baseURL + this.Global.api.v2.autoStrategy_controlTypeV2
            let data = {
                params: {
                    actionId: 0,
                    dataType: 'modules_rely',
                    moduleCode: this.strategyDesForm.moduleCode
                }
            }
            this.$http.get(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.modules = res.body.data.list
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                })
                .catch(err => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        addCondition() {
            this.$emit('add')
        }
    },
    watch: {
        existAction: {
            handler() {
                this.$emit('actionChange', this.existAction.now || this.existAction.delay, this.logicIndex)
            },
            deep: true
        },
        conditionData() {
            this.conditionData.forEach(item => {
                if (item.preVirtualControlType == 4) {
                    //  delete this.logicCond[item.paramsKey]
                    if (item.childParams) {
                        item.childParams.forEach(item2 => {
                            if (item2.virtualControlType == 21 && !this.logicCond[item2.paramsKey]) {
                                this.logicCond[item2.paramsKey] = item2.showName
                            }
                        })
                    }
                }
            })
        }
    },
    components: {
        'condition-show': ConditionShow,
        'condition-edit': ConditionEdit,
        'execute-delay': ExecuteDelay,
        'execute-now': ExecuteNow
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
