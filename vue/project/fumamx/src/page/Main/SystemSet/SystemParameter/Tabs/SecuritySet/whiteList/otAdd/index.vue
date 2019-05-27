<template>
    <!-- 添加白名单 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="dialogSetList" :closeOnClickModal="false" custom-class="width620" :modal-append-to-body="false">
        <div class="otAdd">
            <el-form :model="formData" :rules="formDataCheck" ref="formData" :inline="true">
                <div class="customer">
                    <!-- 适用人员 -->
                    <span class="customerTitle">IP地址:
                        <span style="color:red">*</span>
                    </span>
                    <el-form-item label="" prop="whiteIP" style="margin-left:100px;">
                        <el-input v-model="formData.whiteIP" placeholder="" style="width:380px;"></el-input>
                    </el-form-item>
                </div>
                <div class="customer">
                    <!-- 适用人员 -->
                    <span class="customerTitle">适用人员:
                        <span style="color:red">*</span>
                    </span>
                    <el-form-item label="" prop="applyCtId" style="margin-left:100px;">
                        <el-select v-model="formData.applyCtId" filterable multiple placeholder="" style="width:380px;">
                            <div v-for="(item,index) in contactValue" :key="index">
                                <el-option :label="item.realName" :value="item.ctId+''">
                                </el-option>
                            </div>
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div slot="footer" class="dialogFooter" style="text-align:center">
             <!-- 取消 -->
            <el-button @click="cancel">{{$t('mxpcweb.client.1529047588840')}}</el-button>
            <!-- 确定 -->
            <el-button type="primary" @click="submit" :loading="submitLoading">{{$t('mxpcweb.client.1529047741736')}}</el-button>
        </div>
    </el-dialog>
</template>
<script>
/**
 * 描述：客户管理-客户列表-设置列表字段
 * 作者：何俊峰
 * 时间：2017/11/10
 */
import { checkIpList } from '@/libs/utils.js'
import { mapGetters } from 'vuex'
export default {
    name: 'otAdd',
    props: {
    },
    data() {
        var validatorIpList = (rule, value, callback) => {
            if (value == '*' || checkIpList(value)) {
                callback()
            } else {
                /* 请输入IP地址或加英文逗号分隔，每位可一个星号通配 */
                callback(new Error(this.$t('mxpcweb.systemset.systemparameter.1530351235392')))
            }
        }
        return {
            useType: '',
            formData: {
                applyCtId: [],
                whiteIP: ''
            },
            dialogSetList: false,
            itemData: {},
            submitLoading: false,
            title: '添加白名单',
            formDataCheck: {
                whiteIP: [
                    /* 请输入IP白名单 */
                    { required: true, message: this.$t('mxpcweb.systemset.systemparameter.1530351261950'), trigger: 'blur' },
                    { validator: validatorIpList, trigger: 'blur' }
                ],
                applyCtId: [
                    { type: 'array', required: true, message: '请至少选择一个适用人员', trigger: 'change'}
                ]
            }
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
        // 打开窗口
        openWindow(itemData) {
            if (itemData) {
                this.useType = 'put'
                this.title = '编辑白名单'
                this.itemData = itemData
                this.formData = {
                    applyCtId: itemData.applyCtId.split(','),
                    whiteIP: itemData.whiteIP
                }
            } else {
                this.useType = 'post'
                this.title = '添加白名单'
                this.itemData = {}
                this.formData = {
                    applyCtId: [],
                    whiteIP: ''
                }
                if (this.$refs.formData) {
                    this.$refs.formData.resetFields()
                }
            }
            this.dialogSetList = true
        },
        // 提交表单
        submit() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.submitLoading = true
                    let url = this.Global.baseURL + this.Global.api.v2.companyWhiteList2
                    let then = (res) => {
                        this.submitLoading = false
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            this.$emit('getInitDataIP')
                            this.dialogSetList = false
                            this.$message.success(this.msg(res.body))
                        } else {
                            this.$message.error(this.msg(res.body))
                        }
                    }
                    let thenError = (res) => {
                        this.submitLoading = false
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                    let data = {
                        applyCtId: this.formData.applyCtId.join(','),
                        whiteIP: this.formData.whiteIP
                    }
                    if (this.useType == 'put') {
                        data.whiteId = this.itemData.whiteId
                    }
                    this.$http[this.useType](url, data).then(then, thenError)
                }
            })
        },
        // 关闭窗口
        cancel() {
            this.dialogSetList = false
        }
    },
    watch: {
    },
    components: {
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.otAdd{
    padding:20px 40px;
    .customerTitles{
        font-weight: 900;
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
    }
}
</style>
