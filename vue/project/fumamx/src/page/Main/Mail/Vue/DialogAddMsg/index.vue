<template>
    <div class="MailAddMsg">
        <!-- 设置提醒 -->
        <el-dialog v-dialogDrag :title="$t('mxpcweb.mail.1528702574238')" :visible.sync="addRemindDialogVisible" custom-class="width420" :modal-append-to-body="false" :before-close="closeAddRemindDialog" class="addRemindDialog" :close-on-click-modal="false" >
            <el-form :model="addRemindForm" :rules="addRemindFormRules" ref="addRemindForm" label-width="80px">
                <!-- 提醒内容 -->
                <el-form-item :label="$t('mxpcweb.mail.1528954536135')" prop="msgBody">
                    <div>
                        <!-- 请填写提醒内容 -->
                        <el-input type="textarea" :rows="4" v-model="addRemindForm.msgBody" :placeholder="$t('mxpcweb.mail.1528954577829')" style="width: 90%;"></el-input>
                    </div>
                </el-form-item>
                <!-- 提醒时间 -->
                <el-form-item :label="$t('mxpcweb.mail.1528954663946')" prop="deliveryTime">
                    <div>
                        <!-- 请填写提醒时间 -->
                        <el-date-picker v-model="addRemindForm.deliveryTime" type="datetime" format="yyyy-MM-dd HH:mm" :placeholder="$t('mxpcweb.mail.1528954686256')" align="right" :picker-options="remindTimeOptions" style="width: 90%;"></el-date-picker>
                    </div>
                </el-form-item>
                <!-- 触发事件 -->
                <el-form-item :label="$t('mxpcweb.mail.1528954731873')" prop="moduleCode">
                    <div>
                        <!-- 始终提醒（无前置触发条件） -->
                        <el-radio class="radio" v-model="addRemindForm.radio" label="0">{{$t('mxpcweb.mail.1528954770939')}}</el-radio>
                    </div>
                    <div v-if="SendOrReply==0">
                        <!-- 若在提醒时间到达以前我未回复该邮件 -->
                        <el-radio class="radio" v-model="addRemindForm.radio" label="1">{{$t('mxpcweb.mail.1528954803980')}}</el-radio>
                    </div>
                    <div v-if="SendOrReply==1">
                        <!-- 若在提醒时间到达以前收件人仍然未回复 -->
                        <el-radio class="radio" v-model="addRemindForm.radio" label="1">{{$t('mxpcweb.mail.1528954828195')}}</el-radio>
                    </div>
                </el-form-item>

                <!--<el-form-item v-if="addRemindForm.custid&&!userType" label="操作" prop="eventId">
                    <el-col :span="22">
                        <el-select v-model="addRemindForm.eventId" placeholder="请选择操作" style="width: 100%;">
                            <el-option label="跟进" value="follow-up"></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>-->
            </el-form>
            <div class="text-center">
                <!-- 取 消 -->
                <el-button @click="addRemindDialogVisible = false" style="width:101px;">{{$t('mxpcweb.mail.1528954850955')}}</el-button>
                <!-- 保 存 -->
                <el-button type="primary" @click="submitForm('addRemindForm')" :loading="submitLoading" style="width:101px;">{{$t('mxpcweb.mail.1528954900200')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import FloatingList from '@/basecomponents/FloatingList/index'
import { mapGetters } from 'vuex'
export default {
    name: 'MailAddMsg',
    props: {

    },
    data() {
        var _this = this
        return {
            mId: '',
            addRemindDialogVisible: false,
            addRemindForm: {
                msgBody: '',
                deliveryTime: '',
                moduleCode: 'EM001',
                billId: '',
                radio: '0'
            },
            addRemindFormRules: {
                msgBody: [
                    // 请输入消息提醒内容
                    { required: true, message: _this.$t('mxpcweb.mail.1528954912891'), trigger: 'blur' },
                    // 长度在 1 到 100 个字符
                    { min: 1, max: 100, message: _this.$t('mxpcweb.mail.1528954951556'), trigger: 'blur' }
                ],
                deliveryTime: [
                    // 请选择日期
                    { type: 'date', required: true, message: _this.$t('mxpcweb.mail.1528954973431'), trigger: 'change' }
                ],
                moduleCode: [
                ],
                billId: [

                ]
            },
            remindTimeOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7
                },
                shortcuts: [{
                    // 明天
                    text: _this.$t('mxpcweb.mail.1528955004333'),
                    onClick(picker) {
                        const date = new Date()
                        date.setTime(date.getTime() + 3600 * 1000 * 24 * 1)
                        picker.$emit('pick', date)
                    }
                }, {
                    // 后天
                    text: _this.$t('mxpcweb.mail.1528955045808'),
                    onClick(picker) {
                        const date = new Date()
                        date.setTime(date.getTime() + 3600 * 1000 * 24 * 2)
                        picker.$emit('pick', date)
                    }
                }, {
                    // 一周后
                    text: _this.$t('mxpcweb.mail.1528955067857'),
                    onClick(picker) {
                        const date = new Date()
                        date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', date)
                    }
                }]
            },

            userType: false,
            customer: [],
            contact: [],
            SubmitIs: true,
            SendOrReply: 0,
            submitLoading: false

        }
    },
    computed: {
        ...mapGetters([
            'company'
        ])
    },
    methods: {
        getData(moduleCode, value, items) {
            let _this = this
            let argument = {
                moduleCode: moduleCode,
                searchType: 'list'
            }
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.document_generalOperate_get, { params: argument }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    if (moduleCode == 'BF001') {
                        _this.customer = res.body.data.list
                        if (!value) {
                            return false
                        }
                        let thisHave = false
                        _this.customer.forEach(function (item) {
                            if (item.custId == value) {
                                thisHave = true
                            }
                        })
                        if (!thisHave) {
                            if (items.custName) {
                                _this.customer.push(items)
                                _this.addRemindForm.billId = value + ''
                            } else {
                                let itemData = {}
                                _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.document_generalOperate_get, {
                                    params: {
                                        moduleCode: 'BF001',
                                        identFieldValue: value,
                                        searchType: 'detail'
                                    }
                                }).then(function (res) {
                                    if (res.body.code.toString() == _this.Global.RES_OK) {
                                        itemData = res.body.data
                                        _this.options.push(itemData)
                                        _this.addRemindForm.billId = value + ''
                                    } else {
                                        // 此客户不存在，或已删除
                                        _this.$message.error(_this.$t('mxpcweb.mail.1528955115032'))
                                    }
                                }, function (res) {
                                    _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
                                })
                            }
                        } else {
                            _this.addRemindForm.billId = value + ''
                        }
                    } else {
                        _this.contact = res.body.data.list
                    }
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
            })
        },
        change(val) {
            this.addRemindForm.billId = ''
        },
        showDialog(mailId) {
            let _this = this
            this.addRemindDialogVisible = true
            _this.mId = mailId
            if (mailId == 0) {
                this.SubmitIs = false
            }
            /* if(userType){
                this.userType = userType;
                this.addRemindForm.moduleCode = moduleCode+'';
                this.getData('BF001',billId,items);
                this.getData('BF003',billId,items);
            }else{
                this.getData('BF001');
                this.getData('BF003');
            }
            if(items){
                setTimeout(function(){
                    _this.customer.push(items);
                });
            } */
        },
        showDialogR(mailId) {
            let _this = this
            this.addRemindDialogVisible = true
            _this.mId = mailId
            if (mailId == 0) {
                this.SubmitIs = false
            }
            this.SendOrReply = 1
        },

        // 选择消息列表
        clickFloatingList(item) {
            this.addRemindForm.msgBody = item.text
        },
        // 关闭添加消对话框
        closeAddRemindDialog() {
            this.resetForm('addRemindForm')
            this.addRemindDialogVisible = false
        },
        // 提交表单
        submitForm(formName) {
            this.submitLoading = true
            let _this = this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let { ctId } = _this.company// 全局状态中获取公司信息
                    let { msgBody, moduleCode, deliveryTime } = _this.addRemindForm// 表单数据
                    let data = {
                        body: {
                            msgBody: msgBody,
                            eventId: ''
                        },
                        msgSubType: '1',
                        moduleCode: moduleCode,
                        billId: _this.mId,
                        targets: ctId + '',
                        iType: '2',
                        deliveryTime: _this.$m_unifiedTime(deliveryTime),
                        sourceId: 'pc',
                        fromAppCode: '',
                        formModuleCode: ''
                    }
                    if (_this.addRemindForm.radio == '0') { // 始终提醒
                        data.msgSubType = '1'
                    } else if (_this.addRemindForm.radio == '1' && this.SendOrReply == 0) { // 收到未回复提醒
                        data.msgSubType = '6'
                    } else {
                        data.msgSubType = '7'// 发出未回复提醒
                    }
                    if (!this.SubmitIs) { // 不提交（发送邮件处使用）
                        let msg = this.TimeJudgment(data.deliveryTime)
                        if (msg == '') {
                            // 关闭对话框
                            _this.closeAddRemindDialog()
                            _this.$emit('getMsg', data) // 成功后，告诉父组件
                        } else {
                            _this.$message.error(msg)
                        }
                        _this.submitLoading = false
                        return
                    }
                    _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.scheduleremind.messengerPost, data).then(function (res) {
                        if (res.body.code.toString() === _this.Global.RES_OK) {
                            _this.$message.success(_this.msg(res.body))
                            _this.$emit('LastListCenter', [1], 'addmsg')
                            _this.submitLoading = false
                            // 关闭对话框
                            _this.closeAddRemindDialog()
                        } else {
                            _this.submitLoading = false
                            _this.$message.error(_this.msg(res.body))
                        }
                    }, function (res) {
                        _this.submitLoading = false
                        _this.$message.error(_this.msg(res.body))
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        // 时间判断（不能小于2小时）
        TimeJudgment(timeData) {
            var startDate = new Date(timeData).getTime()// 提醒时间
            var DateNow = new Date()
            var endDate = DateNow.getTime() // 当前时间
            if (startDate < endDate) {
                // 提醒时间必须大于当前时间2小时以上
                return this.$t('mxpcweb.mail.1528955159919')
            }
            var date3 = startDate - endDate // 时间差的毫秒数
            var leave1 = date3 / (3600 * 1000) // 计算小时
            // var hours = Math.floor(leave1 / (3600 * 1000))
            if (leave1 < 2) {
                // 提醒时间必须大于当前时间2小时以上！
                return this.$t('mxpcweb.mail.1528955159919')
            } else {
                return ''
            }
        }
    },
    components: {
        'floating-list': FloatingList
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
