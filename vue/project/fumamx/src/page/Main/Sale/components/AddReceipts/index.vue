<template>
    <div class="AddReceipts">
        <!-- 添加收款记录 -->
        <el-dialog :title="$t('mxpcweb.sale.components.1557564771660')" v-dialogDrag :visible.sync="dialogVisible" :closeOnClickModal="false" custom-class="width420" :modal-append-to-body="false">
            <div class="formBox">
                <div class="fieldList">
                    <!-- 收款描述 -->
                    <span class="labelBox">{{$t('mxpcweb.sale.components.1557564779825')}}</span>
                    <!-- 请输入收款描述 -->
                    <el-input style="width:280px;" type="textarea" size="small" :rows="4" :placeholder="$t('mxpcweb.sale.components.1557566157617')" v-model="itemData.receiptDesc"></el-input>
                </div>
                <div class="fieldList">
                    <!-- 负责人 -->
                    <span class="labelBox">{{$t('mxpcweb.sale.components.1557564615823')}}</span>
                    <drop-down labelKey="realName" valueKey="ctId" :ruleForm="ruleForm" inUse @change="change" :list="contactValue" rightWidth="280px"></drop-down>
                </div>
                <div class="fieldList">
                    <!-- 银行流水号 -->
                    <span class="labelBox">{{$t('mxpcweb.sale.components.1557564780184')}}</span>
                    <!-- 请填写银行流水号 -->
                    <el-input style="width:280px;" size="small" :placeholder="$t('mxpcweb.sale.components.1557564784150')" v-model="itemData.accountStat"></el-input>
                </div>
                <div class="fieldList">
                    <!-- 收款金额 -->
                    <span class="labelBox">{{$t('mxpcweb.sale.components.1557564788061')}}</span>
                    <!-- 请填写收款金额 -->
                    <el-input type="number" min="0" style="width:280px;" v-model="itemData.proceeds" :placeholder="$t('mxpcweb.sale.components.1557564792411')"></el-input>
                </div>
                <div class="fieldList">
                    <!-- 收款方式 -->
                    <span class="labelBox">{{$t('mxpcweb.sale.components.1557564797106')}}</span>
                    <!-- 请选择 -->
                    <el-select style="width:280px;" v-model="itemData.payment" :placeholder="$t('mxpcweb.sale.components.1557564798885')">
                        <!-- 其他 -->
                        <el-option :label="$t('mxpcweb.sale.components.1557564799092')" value="0"></el-option>
                        <!-- 转账 -->
                        <el-option :label="$t('mxpcweb.sale.components.1557564799601')" value="1"></el-option>
                        <!-- 网银 -->
                        <el-option :label="$t('mxpcweb.sale.components.1557564799813')" value="2"></el-option>
                        <!-- 现金 -->
                        <el-option :label="$t('mxpcweb.sale.components.1557564800010')" value="3"></el-option>
                    </el-select>
                </div>
                <div class="fieldList">
                    <!-- 收款日期 -->
                    <span class="labelBox">{{$t('mxpcweb.sale.components.1557564822633')}}</span>
                    <el-date-picker style="width:280px;" v-model="itemData.receiptDate" type="datetime" size="small" format="yyyy-MM-dd HH:mm" align="right"></el-date-picker>
                </div>
            </div>
            <div class="text-center">
                <el-button type="primary" @click="submitForm()" :loading="subLoading">
                    <!-- 保 存 -->
                    {{$t('mxpcweb.sale.components.1557564616847')}}
                </el-button>
                <el-button @click="dialogVisible = false">
                    <!-- 取 消 -->
                    {{$t('mxpcweb.sale.components.1557564617043')}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Dropdown from '@/components/Controls/AControlsVue/Dropdown'
export default {
    name: 'AddReceipts',
    props: {

    },
    data() {
        return {
            ruleForm: {
                input: '' // 登记人
            },
            itemData: {
                receiptDesc: '', // 收款描述
                accountStat: '', // 银行流水
                proceeds: '', // 收款金额
                payment: '', // 收款方式(0:其他 1:转账 2:网银 3:现金)',
                receiptDate: '' // 收款日期
            },
            dialogVisible: false,
            subLoading: false,
            receiptId: ''
        }
    },
    created() {
    },
    mounted() {
    },
    computed: {
        ...mapGetters([
            'contactValue'
        ])
    },
    methods: {
        change() {
        },
        getData() {
            this.$emit('getData')
        },
        showDialog(item) {
            this.itemData = {
                receiptDesc: '', // 收款描述
                accountStat: '', // 银行流水
                proceeds: '', // 收款金额
                payment: '', // 收款方式(0:其他 1:转账 2:网银 3:现金)',
                receiptDate: new Date(), // 收款日期
                orderId: ''
            }
            this.receiptId = ''
            this.ruleForm = {
                input: '' // 登记人
            }
            if (item) {
                console.log(item)
                this.itemData = {
                    receiptDesc: item.receiptDesc || '', // 收款描述
                    accountStat: item.accountStat || '', // 银行流水
                    proceeds: item.proceeds || '', // 收款金额
                    payment: item.payment ? item.payment + '' : '', // 收款方式(0:其他 1:转账 2:网银 3:现金)',
                    receiptDate: item.receiptDate || new Date(), // 收款日期
                    orderId: item.orderId || ''
                }
                this.ruleForm = {
                    input: item.register ? item.register + '' : ''
                }
                this.receiptId = item.receiptId || ''
            }
            this.dialogVisible = true
        },
        // 提交表单
        submitForm() {
            let obj = JSON.parse(JSON.stringify(this.itemData))
            obj.register = this.ruleForm.input
            obj.receiptDate = this.$m_unifiedTime(this.itemData.receiptDate, {format: 'YYYY-MM-DD HH:mm:ss'}) || ''
            obj.moduleCode = 'SC002'
            obj.strucId = '5'
            let url = this.Global.api.v2.document_order_receipt_post
            let type = 'post'
            if (this.receiptId != '') {
                obj.receiptId = this.receiptId
                url = this.Global.api.v2.document_order_receipt_put
                type = 'put'
            }
            this.subLoading = true
            this.$http[type](this.Global.baseURL + url, obj).then((res) => {
                this.subLoading = false
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.$emit('getData')
                    this.dialogVisible = false
                    this.$message.success(this.msg(res.body))
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                this.subLoading = false
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        // 重置表单
        resetForm() {
        }
    },
    components: {
        'drop-down': Dropdown
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
