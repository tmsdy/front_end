<template>
    <!-- 新增下级客户 -->
    <el-dialog v-dialogDrag :title="$t('mxpcweb.client.1529050304104')" :visible.sync="dialog" :closeOnClickModal="false" custom-class="width620" :modal-append-to-body="false">
        <div class="addLowerCust">
            <div style="font-size:16px;" v-if="itemData.custName">
                <!-- 客户 -->
                <span class="customerTitles">{{$t('mxpcweb.client.1529049476377')}}：</span>
                <span style="color:#ff943e;margin-left:70px;">{{itemData.custName}}</span>
            </div>
            <div class="customer" v-if="dialog">
                <!-- 选择下级客户 -->
                <span class="customerTitle">{{$t('mxpcweb.client.1529050327108')}}：</span>
                <el-form :model="ruleForm" label-position="left"  style="width:380px;margin-left:120px;">
                    <el-form-item>
                        <Customer @isLowerCust="isLowerCust" :showLabel="false" :isLowerCusts="true" labelPosition="left" labelWidth="0" rightWidth="330px" ref="control"  :itemData="ruleForm.list" :controlData.sync="ruleForm.list.controlData"></Customer>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div slot="footer" class="dialogFooter" style="text-align:center">
            <!-- 取消 -->
            <el-button @click="dialog=false">{{$t('mxpcweb.client.1529047588840')}}</el-button>
            <!-- 保存 -->
            <el-button type="primary" @click="prop()" :loading="submitLoading">{{$t('mxpcweb.client.1529042806774')}}</el-button>
        </div>
    </el-dialog>
</template>
<script>
/**
 * 描述：客户管理-客户列表-编辑客户
 * 作者：何俊峰
 * 时间：2017/11/22
 */
import Customer from '@/components/Controls/Customer/index.vue'
export default {
    name: 'batchEidt',
    props: {
    },
    data() {
        return {
            dialog: false,
            ruleForm: {
                list: {
                    controlData: '',
                    isNotNull: 0
                },
                value: ''
            },
            moduleCode: '',
            id: [], // 当前客户
            itemData: '',
            lowerCust: false, // 判断所选客户是否有上级客户
            submitLoading: false,
            callback: () => {}
        }
    },
    methods: {
        save() {
            if (this.ruleForm.list.controlData == 0) {
                // 请选择客户后再进行提交操作
                this.$message.success(this.$t('mxpcweb.client.1529050367475'))
                return false
            }
            this.submitLoading = true
            let targets = [this.ruleForm.list.controlData]
            let data = {
                'optCode': 'otBatchModify',
                'optModuleCode': this.moduleCode,
                'targets': targets.toString(),
                'parCustId': this.id
            }
            this.$http.put(this.Global.baseURL + this.Global.api.v2.document_operate_listOpt_put, data).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.dialog = false
                    this.submitLoading = false
                    this.callback()
                    this.$message.success(this.msg(res.body))
                } else {
                    this.submitLoading = false
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                this.submitLoading = false
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        prop() {
            if (this.lowerCust) {
                // 所选客户已有上级客户,确定修改?
                // 提示
                // 确定
                // 取消
                this.$confirm(this.$t('mxpcweb.client.1529050388141'), this.$t('mxpcweb.client.1529047715824'), {
                    confirmButtonText: this.$t('mxpcweb.client.1529047741736'),
                    cancelButtonText: this.$t('mxpcweb.client.1529047588840'),
                    type: 'warning'
                }).then(() => {
                    this.save()
                }).catch(() => {
                })
            } else {
                this.save()
            }
        },
        isLowerCust(value) {
            this.lowerCust = value
        },
        openWindow(obj) {
            let { billId, moduleCode, itemData, next } = obj
            if (next) {
                this.callback = next
            } else {
                this.callback = () => {}
            }
            this.id = billId
            this.itemData = itemData
            this.moduleCode = moduleCode
            this.ruleForm.index = ''
            this.lowerCust = false
            this.dialog = true
        },
        // 关闭窗口
        cancel() {
            this.dialogSetList = false
        }
    },
    watch: {

    },
    components: {
        'Customer': Customer
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.addLowerCust{
    padding:20px 40px;
    .customerTitles{
        font-size:15px;
    }
    .customer{
        position:relative;
        line-height:35px;
        margin-top:15px;
        .customerTitle{
            font-size:15px;
            position:absolute;
            top:0;
            left:0;
        }
    }
    .tip{
        font-size:12px;
        margin-top:20px;
    }
    .dialogFooter{
        height: 80px;
        text-align: center;
    }
}
</style>
