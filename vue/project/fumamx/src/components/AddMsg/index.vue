<template>
    <div class="AddMsg">
        <!-- 设置提醒 -->
        <el-dialog :title="$t('mxpcweb.workbench.1530703337439')" v-dialogDrag :visible.sync="addRemindDialogVisible" custom-class="width420" :before-close="closeAddRemindDialog" class="addRemindDialog" :modal-append-to-body="false">
            <el-form :model="addRemindForm" :rules="addRemindFormRules" ref="addRemindForm" label-width="80px" label-position="left">
                <!-- 提醒内容 -->
                <el-form-item :label="$t('mxpcweb.workbench.1530703360840')" prop="msgBody">
                    <div>
                        <!-- 请填写提醒内容 -->
                        <el-input type="textarea" :rows="4" v-model="addRemindForm.msgBody" :placeholder="$t('mxpcweb.workbench.1530703383376')" style="width: 90%;"></el-input>
                        <floating-list :list="remindList" @clickList="clickFloatingList" ref="floatingList"></floating-list>
                        <span class="arrow-down">
                            <i class="iconfont icon-arrow-down-empty" @click="showFloatingList()"></i>
                        </span>
                    </div>
                </el-form-item>
                <!-- 提醒时间 -->
                <el-form-item :label="$t('mxpcweb.workbench.1530703406718')" prop="deliveryTime">
                    <div>
                        <!-- 请填写提醒时间 -->
                        <el-date-picker v-model="addRemindForm.deliveryTime" type="datetime" size="small" format="yyyy-MM-dd HH:mm" :placeholder="$t('mxpcweb.workbench.1530703429126')" align="right" :picker-options="remindTimeOptions" style="width: 90%;"></el-date-picker>
                    </div>
                </el-form-item>
                <!-- 相关对象 -->
                <el-form-item :label="$t('mxpcweb.workbench.1530703446351')" prop="moduleCode">
                    <div>
                        <!-- 请选择相关对象 -->
                        <el-select v-model="addRemindForm.moduleCode" @change="change" :placeholder="$t('mxpcweb.workbench.1530703474345')" style="width: 90%;" size="small">
                            <!-- 无 -->
                            <el-option :label="$t('mxpcweb.workbench.1530703499819')" value="0">
                            </el-option>
                            <template v-if="showCust == '1'">
                                <!-- 客户 -->
                                <el-option :label="$t('mxpcweb.workbench.1530703521879')" value="BF001"></el-option>
                                <!-- 联系人 -->
                                <el-option :label="$t('mxpcweb.workbench.1530703534191')" value="BF003"></el-option>
                            </template>
                            <template v-if="showCust == '2'">
                                <!-- 报价 -->
                                <el-option label="报价" value="SC001"></el-option>
                                <!-- 订单 -->
                                <el-option label="订单" value="SC002"></el-option>
                            </template>
                        </el-select>
                    </div>
                </el-form-item>
                <template v-if="showSelect">
                    <document-dropdown v-if="addRemindForm.moduleCode=='BF001'" keyName="custId" labelName="custName" moduleCode="BF001" labelPosition="left" labelWidth="80px" rightWidth="270px" ref="customer" :itemData="itemData1" :controlData.sync="itemData1.controlData"></document-dropdown>
                    <contacts v-else-if="addRemindForm.moduleCode=='BF003'" labelPosition="left" labelWidth="80px" rightWidth="270px" ref="contacts" :itemData="itemData2" :controlData.sync="itemData2.controlData" isIndependent></contacts>
                    <document-dropdown v-else-if="addRemindForm.moduleCode=='SC001'" moduleCode="SC001" keyName="quotaId" labelName="quotaTheme" labelPosition="left" labelWidth="80px" rightWidth="270px" ref="quota" :itemData="itemData3" :controlData.sync="itemData3.controlData"></document-dropdown>
                    <document-dropdown v-else-if="addRemindForm.moduleCode=='SC002'" moduleCode="SC002" keyName="orderId" labelName="orderTheme" labelPosition="left" labelWidth="80px" rightWidth="270px" ref="order" :itemData="itemData4" :controlData.sync="itemData4.controlData" isIndependent></document-dropdown>
                </template>
            </el-form>
            <div class="text-center">
                <el-button type="primary" @click="submitForm('addRemindForm')" :loading="subLoading">
                    <!-- 保 存 -->{{$t('mxpcweb.workbench.1530703569155')}}
                </el-button>
                <el-button @click="addRemindDialogVisible = false">
                    <!-- 取 消 -->{{$t('mxpcweb.workbench.1530703557306')}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import FloatingList from '@/basecomponents/FloatingList/index'
import DocumentDropdown from '@/components/Controls/DocumentDropdown/index'
import Contacts from '@/components/Controls/Contacts/index'
import { mapGetters } from 'vuex'
export default {
    name: 'AddMsg',
    props: {

    },
    data() {
        return {
            showCust: '1',
            addRemindDialogVisible: false,
            showSelect: true,
            addRemindForm: {
                msgBody: '',
                deliveryTime: '',
                moduleCode: '',
                billId: ''
            },
            addRemindFormRules: {
                msgBody: [
                    /* 请输入消息提醒内容 */
                    { required: true, message: this.$t('mxpcweb.workbench.1530703743858'), trigger: 'blur' },
                    /* 长度在 1 到 100 个字符 */
                    { min: 1, max: 100, message: this.$t('mxpcweb.workbench.1530703756621'), trigger: 'blur' }
                ],
                deliveryTime: [
                    /* 请选择日期 */
                    { type: 'date', required: true, message: this.$t('mxpcweb.workbench.1530703769535'), trigger: 'change' }
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
                    /* '明天' */
                    text: this.$t('mxpcweb.workbench.1530673462060'),
                    onClick(picker) {
                        const date = new Date()
                        date.setTime(date.getTime() + 3600 * 1000 * 24 * 1)
                        picker.$emit('pick', date)
                    }
                }, {
                    /* '后天' */
                    text: this.$t('mxpcweb.workbench.1530673476541'),
                    onClick(picker) {
                        const date = new Date()
                        date.setTime(date.getTime() + 3600 * 1000 * 24 * 2)
                        picker.$emit('pick', date)
                    }
                }, {
                    /* '一周后' */
                    text: this.$t('mxpcweb.workbench.1530673488255'),
                    onClick(picker) {
                        const date = new Date()
                        date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', date)
                    }
                }]
            },
            remindList: [
                /* '打电话给客户' */
                { text: this.$t('mxpcweb.workbench.1530704067591') },
                /* '发邮件给客户' */
                { text: this.$t('mxpcweb.workbench.1530704079174') },
                /* '拜访客户' */
                { text: this.$t('mxpcweb.workbench.1530704090208') },
                /* '开会' */
                { text: this.$t('mxpcweb.workbench.1530704101551') }
            ],
            userType: false,
            itemData: {},
            itemData1: {
                /* '客户' */
                cnFieldCaption: this.$t('mxpcweb.workbench.1530703521879'),
                controlData: '',
                isNotNull: 0
            },
            itemData2: {
                /* '联系人' */
                cnFieldCaption: this.$t('mxpcweb.workbench.1530703534191'),
                controlData: '',
                isNotNull: 0
            },
            itemData3: {
                /* 报价 */
                cnFieldCaption: '报价',
                controlData: '',
                isNotNull: 0
            },
            itemData4: {
                /* 报价 */
                cnFieldCaption: '订单',
                controlData: '',
                isNotNull: 0
            },
            firstInto: false,
            subLoading: false
        }
    },
    created() {
    },
    mounted() {
    },
    computed: {
        ...mapGetters([
            'company'
        ])
    },
    methods: {
        change() {
            this.showSelect = false
            this.itemData1.controlData = ''
            this.itemData2.controlData = ''
            this.itemData3.controlData = ''
            this.itemData4.controlData = ''
            this.addRemindForm.billId = ''
            this.$nextTick(() => {
                this.showSelect = true
            })
        },
        showDialog(userType, billId, moduleCode, items) {
            this.itemData1.controlData = ''
            this.itemData2.controlData = ''
            this.itemData3.controlData = ''
            this.itemData4.controlData = ''
            this.addRemindForm.billId = ''
            this.firstInto = true
            if (items) {
                this.itemData = items
            } else {
                this.itemData = {}
            }
            if (billId) {
                this.addRemindForm.billId = billId
            }
            this.addRemindDialogVisible = true
            if (userType) {
                this.userType = userType
                this.addRemindForm.moduleCode = moduleCode + ''
                if (moduleCode == 'BF001' || moduleCode == 'BF003') {
                    this.showCust = '1'
                } else if (moduleCode == 'SC001' || moduleCode == 'SC002') {
                    this.showCust = '2'
                }
                setTimeout(() => {
                    if (moduleCode == 'BF001') {
                        this.$refs.customer.updatas(items)
                    } else if (moduleCode == 'BF003') {
                        this.$refs.contacts.updatas(items)
                    } else if (moduleCode == 'SC001') {
                        this.$refs.quota.updatas(items)
                    } else if (moduleCode == 'SC002') {
                        this.$refs.order.updatas(items)
                    }
                }, 50)
            } else {
                this.showCust = '1'
            }
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
        showFloatingList() {
            this.$refs.floatingList.showFloatingListBox()
        },
        // 提交表单
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let { ctId } = this.company// 全局状态中获取公司信息
                    let { msgBody, moduleCode, billId, deliveryTime } = this.addRemindForm// 表单数据
                    if (moduleCode == 'BF001') {
                        billId = this.itemData1.controlData
                    } else if (moduleCode == 'BF003') {
                        billId = this.itemData2.controlData
                    } else if (moduleCode == 'SC001') {
                        billId = this.itemData3.controlData
                    } else if (moduleCode == 'SC002') {
                        billId = this.itemData4.controlData
                    }
                    let data = {
                        body: {
                            msgBody: msgBody,
                            eventId: ''
                        },
                        msgSubType: '1',
                        moduleCode: moduleCode == '' ? '0' : moduleCode,
                        billId: billId,
                        targets: ctId + '',
                        iType: '2',
                        deliveryTime: this.$m_unifiedTime(deliveryTime),
                        sourceId: 'pc',
                        fromAppCode: '',
                        formModuleCode: ''
                    }
                    if (data.moduleCode == '0') {
                        data.msgSubType = '0'
                    }
                    this.subLoading = true
                    this.$http.post(this.Global.baseURL + this.Global.api.SystemSet.scheduleremind.messengerPost, data).then((res) => {
                        if (res.body.code.toString() === this.Global.RES_OK) {
                            this.$message.success(this.msg(res.body))
                            this.subLoading = false
                            // 关闭对话框
                            this.closeAddRemindDialog()
                            this.$emit('addMsgSuccess')
                            this.$emit('getListData')
                        } else {
                            this.subLoading = false
                            this.$message.error(this.msg(res.body))
                        }
                    }, (res) => {
                        this.$message.error(this.msg(res.body))
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
        }
    },
    components: {
        'floating-list': FloatingList,
        'document-dropdown': DocumentDropdown,
        'contacts': Contacts
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
.more {
  text-align: center;
  color: grey;
  margin-bottom: 10px;
}
</style>
