<template>
    <el-dialog title="修改汇率" :visible.sync="dialogVisible" :modal-append-to-body="false" class="emailBox">
        <div class="dialogchange">
            <el-form label-position="right" label-width="120px" :model="form">
                <el-form-item label="货币代号">
                    <div>{{form.currencyCode}}</div>
                </el-form-item>
                <el-form-item label="货币中文名称">
                    <div>{{form.name}}</div>
                </el-form-item>
                <el-form-item label="国际符号">
                    <div>{{form.symbol}}</div>
                </el-form-item>
                <el-form-item label="汇率类型">
                    <el-radio-group v-model="form.showFlag" @change="changeRadio">
                        <el-radio :label=1>实时汇率</el-radio>
                        <el-radio :label=0>固定汇率</el-radio>
                    </el-radio-group>
                    <el-tooltip placement="top" style="margin-left: 15px;">
                        <div slot="content">固定汇率为企业自定义汇率，支持手动变更;<br />实时汇率为在线汇率，不支持手动更改</div>
                        <i class="iconfont icon-ask-mark" style="font-size: 19px;"></i>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="对人民币汇率" required>
                    <el-input v-model="rate" style="width: 250px;" :disabled="disabled" @change="changeRate"></el-input>
                </el-form-item>
            </el-form>
            <div style="text-align:center">
                <el-button type="primary" :loading="submitLoading" @click="submit">确定</el-button>
                <el-button @click="dialogVisible = false">取消</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'RateManage',
    props: {},
    data() {
        return {
            dialogVisible: false,
            submitLoading: false,
            form: {},
            disabled: false,
            rate: '',
            cloneForm: {}
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
        open(row) {
            this.dialogVisible = true
            this.form = Object.assign({}, row)
            this.cloneForm = Object.assign({}, this.form)
            if (row.showFlag == 1) { // 实时汇率
                this.rate = this.form.cnyExRate
                this.disabled = true
            } else if (row.showFlag == 0) {
                this.rate = this.form.fixedRate
                this.disabled = false
            }
        },
        submit() {
            if ((parseFloat(this.rate).toString() == 'NaN')) {
                this.$message('请输入数字')
            } else {
                let data = {}
                if (this.form.cnyExRate != this.cloneForm.cnyExRate || this.form.showFlag != this.cloneForm.showFlag) {
                    data.curCode = this.form.currencyCode
                    data.showFlag = this.form.showFlag
                    if (this.form.showFlag == 0) {
                        data.fixedRate = this.rate
                    }
                    this.putRate(data)
                }
                return true
            }
        },
        changeRadio() {
            if (this.form.showFlag == 0) { // 固定汇率
                this.rate = this.form.fixedRate
                this.disabled = false
            } else if (this.form.showFlag == 1) {
                this.rate = this.form.cnyExRate
                this.disabled = true
            }
        },
        changeRate() {
            if (this.form.showFlag == 0) {
                this.form.fixedRate = this.rate
            }
        },
        putRate(data) {
            this.submitLoading = true
            this.$http.put(this.Global.baseURL + this.Global.api.v2.putRateManage, data).then((res) => {
                this.submitLoading = false
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.dialogVisible = false
                    this.$emit('success')
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                this.submitLoading = false
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        }
    },
    components: {},
    watch: {}
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
.dialogchange {
    width: 85%;
    margin: 0 auto;
}
</style>
