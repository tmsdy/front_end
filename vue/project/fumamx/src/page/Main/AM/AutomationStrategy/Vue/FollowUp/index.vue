<template>
    <div class="FollowUp">
        <el-dialog :close-on-click-modal="false" v-dialogDrag title="添加后续动作" custom-class="width520" :visible.sync="dialogVisible" size="tiny">
            <el-form ref="followUpForm" :model="followUpForm" :rules="rules" label-position="left" label-width="100px" class="demo-ruleForm">
                <el-form-item label="等待时间" class="delayTimeBox" prop="timeValue">
                    <el-checkbox class="checkBox " v-model="isDelay"></el-checkbox>
                    <span class="text ">延迟</span>
                    <el-input type="number" class="time " v-model.number="followUpForm.timeValue" placeholder="0"> </el-input>
                    <el-select class="type " v-model="timeType" placeholder="请选择">
                        <el-option v-for="(val,key) in timeTypes" :label="val" :value="key" :key="key">
                        </el-option>
                    </el-select>
                    <span class="text ">执行</span>
                </el-form-item>
                <el-form-item label="条件设置" prop="mailState">
                    <el-radio-group v-model="followUpForm.mailState">
                        <p class="radioLine" v-for="(show,key) in mailStates" :key="key">
                            <el-radio :label="key">{{show}}</el-radio>
                        </p>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="执行操作" prop="action">
                    <el-dropdown trigger="click" @command="handleCommand">
                        <span class="el-dropdown-link text-red optBtn">
                            添加操作+
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(show,key) in typeList" :command="key" :key="key">{{show}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <div>
                        <p class="actionItem" v-for="(item,index) in mailAction" :key="index">
                            <span class="actionType">发送邮件</span><span class="text-red">{{item.detailActionName}}</span>
                        </p>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAction()">保 存</el-button>
            </span>
        </el-dialog>
        <mail-notify ref="mailNotify" @sure="selectedMail" :moduleCode="strategyDesForm.moduleCode"></mail-notify>
    </div>
</template>

<script>
import MailNotify from '../MailNotify'
export default {
    name: 'FollowUp',
    props: {
        strategyDesForm: {
            type: Object,
            default: () => ({})
        },
        logicCondId: {
            type: [String, Number],
            default: ''
        },
        stepOrderNo: {
            type: Number,
            default: 0
        }
    },
    data() {
        var checkNumber = (rule, value, callback) => {
            if (!this.isDelay) {
                callback()
            }
            if (value === '') {
                return callback(new Error('时间值不能为空'))
            }
            setTimeout(() => {
                if (!Number.isInteger(value)) {
                    callback(new Error('请输入数字值'))
                } else {
                    if (value < 1) {
                        callback(new Error('不能小于1'))
                    } else {
                        callback()
                    }
                }
            }, 200)
        }
        var checkAction = (rule, value, callback) => {
            if (this.mailAction.length == 0) {
                callback(new Error('请添加动作'))
            } else {
                callback()
            }
        }
        return {
            dialogVisible: false,
            isDelay: false,
            executorItem: {},
            timeType: 'm',
            timeTypes: {
                m: '分钟',
                h: '小时',
                d: '天',
                wd: '工作日'
            },
            typeList: {
                1: '邮件通知',
                2: '提醒',
                3: '短信',
                4: '字段更新',
                5: '标签',
                6: 'webhook',
                7: '函数'
            },
            mailStates: {
                request: '发件请求成功',
                deliver: '邮件送达',
                open: '邮件打开',
                click: '邮件点击',
                invalid: '发件失败',
                not_open: '未打开',
                not_click: '未点击'
            },
            followUpForm: {
                timeValue: 0,
                mailState: 'request'
            },
            rules: {
                timeValue: [
                    { validator: checkNumber, trigger: 'change' }
                ],
                mailState: [
                    { required: true, message: '请选择条件设置', trigger: 'change' }
                ],
                action: [
                    { required: true, validator: checkAction }
                ]
            },
            mailAction: []
        }
    },
    methods: {
        open(executorItem) {
            this.executorItem = executorItem
            this.dialogVisible = true
        },
        selectedMail(arr = []) {
            arr.forEach(item => {
                let { detailActionId, detailActionName } = item
                this.mailAction.push({ detailActionId, detailActionName })
            })
        },
        selMail() {
            this.$refs.mailNotify.open()
        },
        handleCommand(key) {
            switch (key) {
                case '1':
                    this.selMail()
                    break
                default:
                    break
            }
        },
        inputKeyup() {
            console.log(456)
        },
        _validate() {
            return new Promise((resolve, reject) => {
                this.$refs.followUpForm.validate((valid) => {
                    if (valid) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                })
            })
        },
        async saveAction() {
            // 验证
            let flag = await this._validate()
            if (!flag) {
                return
            }
            // 组装数据
            let data = {
                strategyId: this.strategyDesForm.strategyId,
                logicCondId: this.logicCondId,
                executorId: this.executorItem.executorId,
                stepOrderNo: this.stepOrderNo,
                mailStates: this.followUpForm.mailStates
            }
            if (this.isDelay) {
                Object.assign(data, { deliveryTime: `${this.followUpForm.timeValue}_${this.timeType}` })
            }
            let res = await this._saveAction(data)
            console.log(res)

            // 保存
        },
        async _saveAction(data) {
            try {
                let url = this.Global.baseURL + this.Global.api.v2.autoStrategy_strategy
                let res = await this.$http.post(url, data)
                if (res.body.code.toString() === this.Global.RES_OK) {
                    let resArr = []
                    res.body.data.forEach(item => {
                        let { identValue, identKey, detailActionId } = item
                        resArr.push({ [identKey]: identValue, detailActionId })
                    })
                    return resArr
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            return false
        }
    },
    components: {
        'mail-notify': MailNotify
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
