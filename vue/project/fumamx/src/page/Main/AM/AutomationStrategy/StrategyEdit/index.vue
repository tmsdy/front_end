<template>
    <div class="StrategyEdit">
        <!-- 头部描述 -->
        <div class="StrategyEditBox MXscroll">
            <div>
                <div class="strategyDes clearfix">
                    <div class="tishi pull-left">新策略</div>
                    <div class="desBox ">
                        <div class="content">
                            <p class="title">{{strategyDesForm.strategyName}}</p>
                            <p class="des">{{strategyDesForm.description}}</p>
                            <p class="model">
                                <span>模块:</span>{{strategyDesForm.moduleName}}
                            </p>
                        </div>
                        <span class="editDesBtn" @click="modifyDes()">修改</span>
                    </div>
                </div>
                <div class="strategyContent">
                    <step-start ref="stepStart" :beginData='beginData' :strategyDesForm="strategyDesForm" @commited="stepStartCommit" :hasNext="logicCond.length>0" :isLoading="beginDataLoading"></step-start>
                    <step-condition v-for="(obj,index) in logicCond" :conditionData="conditionData" :strategyDesForm="strategyDesForm" :logicIndex="index" :logicLength="logicCond.length" :isLoading="conditionDataLoading" @actionChange="actionChange" @add="addCondition()" :key="index">
                    </step-condition>
                </div>
            </div>
        </div>

        <div class="strategyEditFooter">
            <el-button :disabled="!canSave" :loading="isSaving" type="primary" @click="handleSave()">保 存</el-button>
            <el-button @click="$emit('cancel')">取 消</el-button>
        </div>

    </div>
</template>

<script>
import StepStart from '../Vue/StepStart/index'
import StepCondition from '../Vue/StepCondition/index'
export default {
    name: 'StrategyEdit',
    props: {
        strategyDesForm: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            isSaving: false,
            startTypeItem: '',
            beginData: [],
            beginDataLoading: false,
            logicCond: [],
            conHasAction: [],
            conditionData: [],
            conditionDataLoading: false
        }
    },
    computed: {
        canSave() {
            if (this.conHasAction.length == 0) {
                return false
            }
            let flag = true
            this.conHasAction.forEach(item => {
                if (!item) {
                    flag = false
                }
            })
            return flag
        }
    },
    created() {

    },
    methods: {
        modifyDes() {
            this.$emit('modifyDes')
        },
        handleSave() {
            this.isSaving = true
            let url = this.Global.baseURL + this.Global.api.v2.autoStrategy_validityCheck
            let params = {
                id: this.strategyDesForm.strategyId,
                useFlag: 1,
                newPageId: 1
            }
            this.$http.get(url, { params })
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.$emit('saved')
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                    this.isSaving = false
                })
                .catch(err => {
                    this.isSaving = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },

        addCondition() {
            this.logicCond.push({})
        },
        stepStartCommit(obj, isModify) {
            this.getConditionDate(obj)
            if (!isModify) {
                this.logicCond.push({})
            }
        },
        actionChange(flag, index) {
            this.conHasAction.splice(index, 1, flag)
            console.log(this.conHasAction)
        },
        async getBeginData() {
            this.beginDataLoading = true
            this.beginData = await this.getBaseData({ type: 'begin' })
            this.beginDataLoading = false
        },
        async getConditionDate(obj = {}) {
            let params = Object.assign({ type: 'condition' }, obj)
            this.conditionDataLoading = true
            this.conditionData = await this.getBaseData(params)
            this.conditionDataLoading = false
        },
        async getBaseData(params) {
            let returnData = []
            try {
                let url = this.Global.baseURL + this.Global.api.v2.autoStrategy_strategyLib

                let res = await this.$http.get(url, { params })

                if (res.body.code.toString() == this.Global.RES_OK) {
                    returnData = res.body.data
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            return returnData
        }
    },
    components: {
        'step-start': StepStart,
        'step-condition': StepCondition
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
