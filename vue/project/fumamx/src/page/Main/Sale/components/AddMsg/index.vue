<template>
    <div class="AddMsg">
        <!-- 设置提醒 -->
        <el-dialog :title="$t('mxpcweb.workbench.1530703337439')" v-dialogDrag :closeOnClickModal="false" :visible.sync="addRemindDialogVisible" custom-class="width520" :before-close="closeAddRemindDialog" class="addRemindDialog" :modal-append-to-body="false">
            <div class="formBox">
                <el-form :model="addRemindForm" :rules="addRemindFormRules" ref="addRemindForm" label-width="90px" label-position="left">
                    <!-- 提醒内容 -->
                    <el-form-item :label="$t('mxpcweb.workbench.1530703360840') + ':'" prop="msgBody">
                        <div>
                            <!-- 请填写提醒内容 -->
                            <el-input type="textarea" :rows="4" style="width:300px;" v-model="addRemindForm.msgBody" :placeholder="$t('mxpcweb.workbench.1530703383376')"></el-input>
                        </div>
                    </el-form-item>
                    <!-- 收款金额: -->
                    <el-form-item :label="$t('mxpcweb.sale.components.1557564649801')" prop="proceeds">
                        <div>
                            <!-- 请输入金额 -->
                            <el-input type="number" min="0" style="width:300px;" v-model="addRemindForm.proceeds" :placeholder="$t('mxpcweb.sale.components.1557564650019')"></el-input>
                        </div>
                    </el-form-item>
                    <!-- 提醒时间 -->
                    <el-form-item :label="$t('mxpcweb.workbench.1530703406718') + ':'" prop="deliveryTime">
                        <div>
                            <!-- 请填写提醒时间 -->
                            <el-date-picker  style="width:300px;" v-model="addRemindForm.deliveryTime" type="datetime" size="small" format="yyyy-MM-dd HH:mm" :placeholder="$t('mxpcweb.workbench.1530703429126')" align="right"></el-date-picker>
                        </div>
                    </el-form-item>
                    <!-- 提醒人: -->
                    <el-form-item :label="$t('mxpcweb.sale.components.1557564650255')" prop="proceeds">
                        <div>
                            <el-select v-model="addRemindForm.targets" filterable placeholder="" style="width:300px;">
                                <div v-for="(item,index) in personnelTable" :key="index"  v-show="item.inUse===1">
                                    <el-option :label="item.realName" :value="item.ctId+''">
                                    </el-option>
                                </div>
                            </el-select>
                        </div>
                    </el-form-item>

                </el-form>
            </div>
            <div class="text-center">
                <el-button type="primary" @click="submitForm()" :loading="subLoading">
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
export default {
    name: 'AddMsg',
    props: {

    },
    data() {
        return {
            addRemindDialogVisible: false,
            addRemindForm: {
                msgBody: '',
                proceeds: '',
                deliveryTime: '',
                targets: ''
            },
            addRemindFormRules: {
                proceeds: [
                    // 请输入金额
                    { required: true, message: this.$t('mxpcweb.sale.components.1557564650019'), trigger: 'blur' }
                ],
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
                targets: [
                    // 请输入金额
                    { required: true, message: this.$t('mxpcweb.sale.components.1557564650019'), trigger: 'blur' }
                ]
            },
            personnelTable: [],
            subLoading: false
        }
    },
    created() {
    },
    mounted() {
        this.getTable()
    },
    computed: {
    },
    methods: {
        getData() {
            this.$emit('getData')
        },
        // 获取企业下所有人
        getTable(moduleCode) {
            let contactData = {
                dataType: 'contact',
                funType: 'withRight',
                moduleCode: 'SC002',
                optCode: 'otNew'
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v2.accountDropList_get, { params: contactData }).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.personnelTable = res.body.data || []
                } else {
                    this.personnelTable = []
                    this.$message.error(this.$msg(res.body))
                }
            }, (res) => {
                this.personnelTable = []
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        showDialog(item) {
            console.log(item)
            this.addRemindForm = {
                msgBody: '',
                proceeds: '',
                deliveryTime: '',
                targets: '',
                doctryId: '',
                doctryNodeId: ''
            }
            if (this.$refs.addRemindForm) {
                this.$refs.addRemindForm.resetFields()
            }
            this.addRemindForm.doctryId = item.doctryId
            this.addRemindForm.doctryNodeId = item.doctryNodeId
            this.addRemindDialogVisible = true
        },
        // 关闭添加消对话框
        closeAddRemindDialog() {
            this.addRemindDialogVisible = false
        },
        // 提交表单
        submitForm() {
            this.$refs.addRemindForm.validate((valid) => {
                if (valid) {
                    let data = {
                        moduleCode: 'SC003',
                        strucId: '3',
                        doctryId: this.addRemindForm.doctryId,
                        doctryNodeId: this.addRemindForm.doctryNodeId,
                        msgBody: this.addRemindForm.msgBody,
                        proceeds: this.addRemindForm.proceeds,
                        deliveryTime: this.$m_unifiedTime(this.addRemindForm.deliveryTime),
                        targets: this.addRemindForm.targets
                    }
                    this.subLoading = true
                    this.$http.post(this.Global.baseURL + this.Global.api.v2.document_documentaryTiming_receiptTiming, data).then((res) => {
                        this.subLoading = false
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            this.$message.success(this.msg(res.body))
                            this.$emit('getData')
                            this.addRemindDialogVisible = false
                        } else {
                            this.$message.error(this.msg(res.body))
                        }
                    }, (res) => {
                        this.subLoading = false
                        this.$message.error(this.$t(this.Global.errorTitle))
                    })
                }
            })
        },
        // 重置表单
        resetForm() {
        }
    },
    components: {
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
