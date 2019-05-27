<template>
    <div class="ExecuteDelay">
        <div :class="{'active':isOpen}" class="ExecuteDelayBox">
            <div class="show" @click="toOpen()">
                <i class="iconfont icon-time-four"></i>
                延时操作
                <i v-if="isLoading" class="el-icon-loading loading"></i>
            </div>
            <transition name="el-zoom-in-top">
                <div v-if="isOpen">
                    <div v-if="!isShowDelayTime||isEditDelayTime" class="selDelayTime">
                        <div class="delayTimeBox clearfix">

                            <span class="text ">延迟</span>
                            <el-input v-if="timeType!=='m'" type="number" class="time " @keyup="inputKeyup()" v-model.number="tempTimeValue" placeholder="0"> </el-input>
                            <el-select v-if="timeType=='m'" class="time" v-model="tempTimeValue" placeholder="请选择">
                                <el-option v-for="(val,index) in [15,30,45]" :label="val" :value="val" :key="index">
                                </el-option>
                            </el-select>
                            <el-select class="type" v-model="timeType" placeholder="请选择">
                                <el-option v-for="(val,key) in timeTypes" :label="val" :value="key" :key="key">
                                </el-option>
                            </el-select>
                            <span class="text">执行</span>

                            <transition name="el-zoom-in-top">
                                <p v-if="isErrorValue" class="tishi">时间值不能小于1</p>
                            </transition>
                        </div>
                        <div class="optBox clearfix">
                            <div class="pull-right">
                                <el-button @click="undoSelDelayTime()">取消</el-button>
                                <el-button @click="nextStep()" type="primary">下一步</el-button>
                            </div>
                        </div>
                    </div>
                    <div v-if="isShowDelayTime&&!isEditDelayTime" class="showDelayTime clearfix">
                        <p @click="toEditDelayTime()" class="timeItem pull-left">延时{{timeValue}}{{timeTypes[timeType]}}后执行</p>
                        <i @click="delDelayTime()" class="delBtn iconfont icon-minus"></i>
                    </div>
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
                                    <span class="name ellipsis">
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
                    <template v-if="isShowDelayTime||isEditDelayTime">
                        <div class="addOpt" @click="addOption()">
                            添加操作
                        </div>
                    </template>
                </div>
            </transition>
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
    name: 'ExecuteDelay',
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
            type: [Number, String],
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
            delPromptShow: false,
            isEditDelayTime: false,
            isShowDelayTime: false,
            timeValue: 0,
            tempTimeValue: 0,
            isErrorValue: false,
            timeType: 'm',
            timeTypes: {
                m: '分钟',
                h: '小时',
                d: '天',
                wd: '工作日' },
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
        deliveryTime() {
            return this.timeValue + '_' + this.timeType
        },
        sysBoxValue() {
            let { sysBoxValue } = this.$store.state
            let map = {}
            console.log(sysBoxValue)
            sysBoxValue.forEach(item => {
                /*  map[item.dictCode] = {
                     dictName: item.dictName
                 } */
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
        toOpen() {
            if (this.isOpen) {
                return
            }
            this.isOpen = true
        },
        toEditDelayTime() {
            this.tempTimeValue = this.timeValue
            this.isEditDelayTime = true
        },
        delDelayTime() {
            if (this.isOpen && this.executors.length > 0) {
                // 提示
                this.$confirm('此操作会将所有相关的操作都删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {

                    })
                    .catch(() => {

                    })
                return
            }
            this.isOpen = this.isShowDelayTime = false
            this.$refs.dropdownList.close()
        },
        undoSelDelayTime() {
            if (this.isEditDelayTime) {
                this.isEditDelayTime = false
            } else {
                this.isOpen = false
            }
            this.isErrorValue = false
        },
        inputKeyup() {
            this.isErrorValue = false
        },
        nextStep() {
            // 验证输入内容
            if (this.tempTimeValue <= 0) {
                this.isErrorValue = true
                return false
            }
            this.timeValue = this.tempTimeValue
            this.isShowDelayTime = true
            /* 修改定时的时间 */
            if (this.isEditDelayTime) {
                this.isEditDelayTime = false
                // TODO: 修改所有动作的时间
            }
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
                    deliveryTime: this.deliveryTime,
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
                deliveryTime: this.deliveryTime,
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
                deliveryTime: this.deliveryTime,
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
        timeType() {
            if (this.timeType === 'm') {
                this.tempTimeValue = 15
            } else {
                this.tempTimeValue = 1
            }
        },
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
