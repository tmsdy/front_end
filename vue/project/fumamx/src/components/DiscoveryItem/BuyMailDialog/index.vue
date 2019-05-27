<template>
    <div class="BuyMailDialog">
        <el-dialog v-dialogDrag title="确认购买" :visible.sync="getMailDialogVisible" size="tiny">
            <span>获取当前客户联系信息将消耗5元，是否确认购买？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleCancelBuy()">取 消</el-button>
                <el-button type="primary" :loading="isPlaying" @click="handleBuyMail()">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog v-dialogDrag title="余额不足" :visible.sync="rechargeDialogVisible" size="tiny">
            <span>当前余额不足，赶快去充值吧！</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="rechargeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleToRecharge()">立即充值</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'BuyMailDialog',
    data() {
        return {
            getMailDialogVisible: false,
            rechargeDialogVisible: false,
            isPlaying: false,
            id: '',
            callBack: null
        }
    },
    methods: {
        /**
         * @param  {String,Number} id
         * @param {function} fn 购买成功回调
         */
        open(id, fn) {
            this.id = id
            this.callBack = fn
            this.getMailDialogVisible = true
        },
        handleCancelBuy() {
            this.getMailDialogVisible = false
        },
        async handleBuyMail() {
            let callBack = this.callBack
            try {
                this.isPlaying = true
                let url = this.Global.baseURL + this.Global.api.v2.consume_list
                let data = {
                    product: 'find',
                    cost: 5,
                    id: this.id
                }
                let res = await this.$http.put(url, data)
                if (res.body.code.toString() === this.Global.RES_OK) {
                    let returnFlag = res.body.data.toString()
                    if (returnFlag === '0') {
                        callBack && callBack()
                    } else if (returnFlag === '-1') {
                        this.rechargeDialogVisible = true
                    }
                    this.getMailDialogVisible = false
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.isPlaying = false
        },
        handleToRecharge() {
            this.rechargeDialogVisible = false
            this.$router.push({ name: 'CostCenter' })
        }
    },
    components: {

    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
</style>
