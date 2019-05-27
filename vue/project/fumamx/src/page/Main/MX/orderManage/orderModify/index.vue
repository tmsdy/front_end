<template>
    <el-dialog class="orderModify" title="订单修改" custom-class="width520" :visible.sync="isShow" v-dialogDrag>
        <el-form :model="form" label-width="80px" label-position="left">
            <!-- 套餐名称 -->
            <el-form-item label="套餐名称" style="min-height:111px; margin-left:33px;">
                <el-select v-model="form.productcode" placeholder="请选择套餐" style="width:300px;">
                    <el-option v-for="item in productOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="text-center">
            <el-button type="primary" @click="submit" :disabled="form.productcode == codeBak">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'orderModify',
    props: [],
    data() {
        return {
            isShow: false,
            productOptions: [
                { value: 'PK0001', label: 'CRM' },
                { value: 'PK0002', label: '发现' },
                { value: 'PK0004', label: '发现Light' },
                { value: 'PK0003', label: '营销云' }
            ],
            form: {
                offlineauthno: '',
                productcode: ''
            },
            codeBak: ''
        }
    },
    methods: {
        submit() {
            // console.log(this.form.productcode)
            // console.log(this.codeBak)
            // console.log(this.form.productcode == this.codeBak)
            this.$http
            .put(this.Global.baseURL + this.Global.api.v2.mxOrder_mxOrder, {
                offlineNo: this.form.offlineauthno,
                productCode: this.form.productcode
            }).then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        // console.log(res.body)
                        this.$message.success(res.body.msg)
                        this.isShow = false
                        this.$emit('success')
                    } else {
                        this.$message.error(res.body.msg)
                    }
                },
                res => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                }
            )
        },
        open(item) {
            this.isShow = true
            this.form.productcode = item.productcode
            this.form.offlineauthno = item.offlineauthno
            this.codeBak = item.productcode // 备份一下
            // console.log(item)
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>

</style>
