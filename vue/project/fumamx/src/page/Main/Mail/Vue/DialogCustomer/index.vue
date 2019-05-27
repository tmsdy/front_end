<template>
    <div class="DialogCustomer">
        <!-- 请选择客户 -->
        <el-dialog v-dialogDrag :title="$t('mxpcweb.mail.1528953992970')" :visible.sync="isOpen" custom-class="width620" @close="cancelClick()" :close-on-click-modal="false" >
            <div style="padding-left: 67px;height: 60px;margin-top: 20px;">
                <customer labelPosition="left" labelWidth="80px" rightWidth="270px" ref="customer" :itemData="itemData1" :controlData.sync="itemData1.controlData"></customer>
            </div>
            <div class="text-center">
                <!-- 取消 -->
                <el-button @click="cancelClick()">{{$t('mxpcweb.mail.1528942364802')}}</el-button>
                <!-- 确定 -->
                <el-button @click="submitCustomer('dialogCustomerForm')" :loading="submitLoading" type="primary">{{$t('mxpcweb.mail.1528942374762')}}</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
/**
 * 描述：邮件部分
 * 作者：向士健(CSS) / ***(API)
 * 时间：2017/12/11
 */
import { mapGetters } from 'vuex'
import Customer from '@/components/Controls/Customer/index'

export default {
    name: 'DialogCustomer',
    props: {

    },
    data() {
        let _this = this
        return {
            isOpen: false, // 弹窗开关
            options: [],
            svalue: '',
            itemData1: {
                cnFieldCaption: _this.$t('mxpcweb.mail.1528971335580'), // '客户',
                controlData: '',
                isNotNull: 0
            },
            submitLoading: false
        }
    },
    computed: {
        ...mapGetters([
            'company'
        ]),
        ...mapGetters('mail', [
            'treeMenu',
            'subordinateCtid'
        ])
    },
    methods: {
        // 清空表单
        resetForm(formName) {
            if (this.isOpen) {
                //  this.$emit("cancelCustomerDialog");
                this.$refs[formName].resetFields()
            }
        },
        // 父组件来调用
        isDialogs(to, custId, custName) {
            if (to == 'open') {
                if (custId != -1) {
                    if (this.options.length < 1) {
                        this.options = [{ custName: custName, custId: custId }]
                    }
                    this.svalue = custId + ''
                }

                this.isOpen = true
            } else {
                this.isOpen = false
            }
        },
        // 确定客户
        submitCustomer() {
            this.submitLoading = true
            let _this = this
            if (_this.itemData1.controlData == '') {
                _this.isOpen = false
                _this.$emit('submitCustomerDialog', _this.itemData1.controlData, '')
                _this.submitLoading = false
                return false
            }
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.document_generalOperate_get, {
                params: {
                    searchType: 'detail',
                    identFieldValue: _this.itemData1.controlData,
                    moduleCode: 'BF001'
                } }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.isOpen = false
                    _this.submitLoading = false
                    _this.$emit('submitCustomerDialog', _this.itemData1.controlData, res.body.data.custName)
                } else {
                    _this.submitLoading = false
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 取消
        cancelClick() {
            this.isOpen = false
            this.$emit('cancelCustomerDialog')
        }
    },
    components: {
        'customer': Customer
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
