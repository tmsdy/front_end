<template>
    <div class="ExecuteNow">
        <div :class="{'active':isOpen}">
            <div class="show" @click="toggleOpen()">
                <i class="iconfont icon-lightning"></i>
                立即执行
                <i v-if="isLoading" class="el-icon-loading loading"></i>
            </div>
            <template v-if="isOpen">
                <div class="exeContent">
                    <div v-if="mailAction.length>0" class="mailAction">
                        <p class="title">邮件通知</p>
                        <div class="actionItem" v-for="(item,index) in mailAction" :key="index">
                            <p class="item">
                                <span class="name">{{item.detailActionName}}</span>
                                <el-tooltip effect="dark" content="添加后续动作" placement="top">
                                    <i v-if="false" @click="toAddFollowUp(item)" class="btn addBtn iconfont icon-plus-file"></i>
                                </el-tooltip>
                                <el-tooltip effect="dark" content="删除" placement="top">
                                    <i @click="delAction(item,1,index)" class="btn delBtn iconfont icon-del"></i>
                                </el-tooltip>
                            </p>
                        </div>
                    </div>
                    <div v-if="remindAction.length>0" class="remindAction">
                        <p class="title">提醒通知</p>
                        <div class="actionItem" v-for="(item,index) in remindAction" :key="index">
                            <p class="item">
                                <span class="name">{{item.detailActionName}}</span>
                                <el-tooltip effect="dark" content="删除" placement="top">
                                    <i @click="delAction(item,2,index)" class="btn delBtn iconfont icon-del"></i>
                                </el-tooltip>
                            </p>
                        </div>
                    </div>
                    <div v-if="fieldAction.length>0" class="fieldAction">
                        <p class="title">字段更新</p>
                        <div class="actionItem" v-for="(item,index) in fieldAction" :key="index">
                            <p class="item">
                                <span class="name ellpisis">
                                    {{modules[item.moduleCode]}}&nbsp;&nbsp;{{item.fieldName}}=
                                    <component :is="'control'+item.controlTypeId" ref="control" :itemData="item" :value="{value:item.fieldValue}"></component>
                                </span>
                                <el-tooltip effect="dark" content="删除" placement="top">
                                    <i @click="delAction(item,6,index)" class="btn delBtn iconfont icon-del"></i>
                                </el-tooltip>
                            </p>
                        </div>
                    </div>
                    <div v-if="tagAction.length>0" class="fieldAction">
                        <p class="title">标签</p>
                        <template v-for="(actionItem,index1) in tagAction">
                            <div class="actionItem" v-for="(item,index) in actionItem.tags" :key="'a'+index1+index">
                                <p class="item">
                                    <span class="name">{{item.labelName}}</span>
                                    <el-tooltip effect="dark" content="删除" placement="top">
                                        <i @click="delTag(actionItem,item,index)" class="btn delBtn iconfont icon-del"></i>
                                    </el-tooltip>
                                </p>
                            </div>
                        </template>
                    </div>
                </div>
                <div @click="addOption()" class="addOpt">
                    添加操作
                </div>
            </template>
        </div>
        <dropdown-list ref="dropdownList" @select="selAction"></dropdown-list>
        <mail-notify ref="mailNotify" @sure="selectedMail" :moduleCode="strategyDesForm.moduleCode"></mail-notify>
        <msg-notify ref="msgNotify"></msg-notify>
        <remind-notify ref="remindNotify" @sure="selectedRemind" :moduleCode="strategyDesForm.moduleCode"></remind-notify>
        <follow-up ref="followUp" :strategyDesForm="strategyDesForm" :logicCondId="logicCondId" :stepOrderNo="1"></follow-up>
        <field-update ref="fieldUpdate" @sure="selectedField" :modules="modules" :moduleCode="strategyDesForm.moduleCode"></field-update>
        <dialog-settags ref="dialogSetTags" @UpdataTagsData="selectedTag"></dialog-settags>
    </div>
</template>

<script>
import Loading from '@/basecomponents/Loading'
import DialogSetTags from '@/components/DialogSetTags'
import MailNotify from '../MailNotify'
import RemindNotify from '../RemindNotify'
import MsgNotify from '../MsgNotify'
import DropdownList from '../DropdownList'
import FollowUp from '../FollowUp'
import FieldUpdate from '../FieldUpdate'
import Controls from '@/components/ListShowControls'

export default {
    name: 'ExecuteNow',
    props: {
        modules: {
            type: Array,
            default: () => []
        },
        strategyDesForm: {
            type: Object,
            default: () => ({})
        },
        logicCondId: {
            type: [String, Number],
            default: ''
        },
        execType: {
            type: Number,
            default: 1
        },
        actionTypes: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            isOpen: false,
            isLoading: false,
            executors: []
        }
    },
    computed: {

        mailAction() {
            return this.executors.filter(item => item.actionId == this.actionTypes.mail)
        },
        remindAction() {
            return this.executors.filter(item => item.actionId == this.actionTypes.remind)
        },
        fieldAction() {
            return this.executors.filter(item => item.actionId == this.actionTypes.field)
        },
        tagAction() {
            return this.executors.filter(item => item.actionId == this.actionTypes.tag)
        },
        sysBoxValue() {
            let { sysBoxValue } = this.$store.state
            let map = {}
            sysBoxValue.forEach(item => {
                let tempObj = {}
                item.dictItems.forEach(item2 => {
                    tempObj[item2.dictItemCode] = item2.itemName
                })
                map[item.dictCode] = tempObj
            })
            return map
        }
    },
    methods: {
        toggleOpen() {
            if (this.isOpen && this.executors.length > 0) {
                return
            }
            this.isOpen = !this.isOpen
            if (!this.isOpen) {
                this.$refs.dropdownList.close()
            }
        },
        toAddFollowUp(item) {
            this.$refs.followUp.open(item)
        },
        addOption() {
            this.$refs.dropdownList.toggle()
        },
        async _selectedAction(actionId, arr = []) {
            this.isLoading = true
            let executors = []
            let idNameMap = {}
            arr.forEach(item => {
                executors.push({
                    execType: this.execType,
                    actionId: actionId,
                    logicCondId: this.logicCondId,
                    strategyId: this.strategyDesForm.strategyId,
                    detailActionId: item.detailActionId
                })
                idNameMap[item.detailActionId] = actionId == this.actionTypes.mail ? item.detailActionName : item.subject
            })

            let res = await this._saveAction({ executors })
            if (res) {
                res.forEach(item => {
                    Object.assign(item, { detailActionName: idNameMap[item.detailActionId], actionId })
                    this.executors.push(item)
                })
            }
            this.isLoading = false
        },
        selectedMail(arr = []) {
            this._selectedAction(this.actionTypes.mail, arr)
        },
        selectedRemind(arr = []) {
            this._selectedAction(this.actionTypes.remind, arr)
        },

        async selectedField(arr = []) {
            this.isLoading = true
            let fieldMap = { ...arr[0], actionId: this.actionTypes.field }
            let executors = [{
                execType: this.execType,
                actionId: this.actionTypes.field,
                logicCondId: this.logicCondId,
                strategyId: this.strategyDesForm.strategyId,
                fieldId: fieldMap.fieldId,
                fieldValue: fieldMap.fieldValue,
                moduleCode: fieldMap.moduleCode
            }]

            let res = await this._saveAction({ executors }, false)
            if (res) {
                Object.assign(fieldMap, res[0])
                this.executors.push(fieldMap)
            }
            this.isLoading = false
        },
        async selectedTag(allTags, selTags, selTagsObj, moduleCode) {
            if (selTagsObj.length <= 0) {
                return
            }
            this.isLoading = true
            let executor = {
                execType: this.execType,
                actionId: this.actionTypes.tag,
                logicCondId: this.logicCondId,
                strategyId: this.strategyDesForm.strategyId,
                newTags: selTags,
                moduleCode
            }
            let TempTags = Object.assign([], selTagsObj)
            let tagAction
            for (let index = 0; index < this.tagAction.length; index++) {
                let item = this.tagAction[index]
                if (item.moduleCode == moduleCode) {
                    tagAction = item
                    break
                }
            }

            if (tagAction) {
                Object.assign(executor, { executorId: tagAction.executorId })
                let res = await this._putAction({ executors: [executor] })
                if (res) {
                    tagAction.tags = TempTags
                }
            } else {
                let res = await this._saveAction({ executors: [executor] }, false)
                if (res) {
                    let action = Object.assign({ tags: TempTags, moduleCode, actionId: this.actionTypes.tag }, res[0])
                    this.executors.push(action)
                }
            }

            this.isLoading = false
        },
        selectedMsg(arr = []) {
            console.log(arr)
        },
        selAction(key) {
            /**
             * 1 邮件通知
             * 2 提醒
             * 3 短信
             * 4 字段更新
             * 5 标签
             * 6 webhook
             * 7 函数
             */
            switch (key) {
                case '1':
                    this.$refs.mailNotify.open(this.mailAction.map(item => item.detailActionId))
                    break
                case '2':
                    this.$refs.remindNotify.open(this.remindAction.map(item => item.detailActionId))
                    break
                case '3':
                    //  this.$refs.msgNotify.open()
                    break
                case '4':
                    this.$refs.fieldUpdate.open()
                    break
                case '5':
                    let tagMap = {}
                    this.tagAction.forEach(item => { tagMap[item.moduleCode] = item.tags })
                    this.$refs.dialogSetTags.DialogSetTagOpen(this.strategyDesForm.moduleCode, this.modules, tagMap)
                    break
                default:
                    break
            }
        },
        async _saveAction(data = {}, isAction = true) {
            try {
                let url = this.Global.baseURL + this.Global.api.v2.autoStrategy_strategy
                let res = await this.$http.post(url, data)
                if (res.body.code.toString() === this.Global.RES_OK) {
                    let resArr = []
                    res.body.data.forEach(item => {
                        let { identValue, identKey, detailActionId } = item
                        let obj = { [identKey]: identValue }
                        if (isAction) {
                            Object.assign(obj, { detailActionId })
                        }
                        resArr.push(obj)
                    })
                    return resArr
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            return false
        },

        async delTag(actionItem, item, index) {
            if (actionItem.tags && actionItem.tags.length == 1) {
                let flag = await this._delAction(actionItem)
                if (flag) {
                    for (let i = 0; i < this.executors.length; i++) {
                        if (this.executors[i].executorId == actionItem.executorId) {
                            this.executors.splice(i, 1)
                            break
                        }
                    }
                }
            } else {
                let tempTags = Object.assign([], actionItem.tags)
                tempTags.splice(index, 1)
                let executors = [{
                    executorId: actionItem.executorId,
                    execType: this.execType,
                    actionId: this.actionTypes.tag,
                    logicCondId: this.logicCondId,
                    strategyId: this.strategyDesForm.strategyId,
                    newTags: tempTags.map(item => item.labelId)
                }]
                let res = await this._putAction({ executors })
                if (res) {
                    actionItem.tags = tempTags
                }
            }
        },
        async _putAction(data = {}) {
            try {
                let url = this.Global.baseURL + this.Global.api.v2.autoStrategy_strategy
                let res = await this.$http.put(url, data)
                if (res.body.code.toString() === this.Global.RES_OK) {
                    return true
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            return false
        },
        async delAction(item, type, index) {
            let flag = await this._delAction(item)
            if (!flag) {
                return
            }
            for (let i = 0; i < this.executors.length; i++) {
                if (this.executors[i].executorId == item.executorId) {
                    this.executors.splice(i, 1)
                    break
                }
            }
        },
        /* 动作删除请求 */
        async _delAction(item) {
            try {
                let url = this.Global.baseURL + this.Global.api.v2.autoStrategy_strategy
                let data = {
                    body: {
                        type: 'executors',
                        id: item.executorId
                    }
                }
                let res = await this.$http.delete(url, data)
                if (res.body.code.toString() === this.Global.RES_OK) {
                    return true
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            return false
        }
    },
    watch: {
        executors() {
            if (this.executors.length == 0) {
                this.$emit('actionChange', false)
            } else {
                this.$emit('actionChange', true)
            }
        }
    },
    components: {
        'dialog-settags': DialogSetTags,
        'mail-notify': MailNotify,
        'remind-notify': RemindNotify,
        'msg-notify': MsgNotify,
        'dropdown-list': DropdownList,
        'loading': Loading,
        'follow-up': FollowUp,
        'field-update': FieldUpdate,
        ...Controls
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
