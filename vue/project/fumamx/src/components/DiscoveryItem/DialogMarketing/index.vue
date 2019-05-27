<template>
    <div class="DialogMarketing">
        <el-dialog v-dialogDrag title="选择触发邮件" :close-on-click-modal="false" custom-class="width420" :visible.sync="dialogVisible" size="tiny">
            <action-mail v-if="dialogVisible" ref="actionMail" :showPreview="false" :moduleCode="moduleCode" :actionMails.sync="actionMails" inputWidth="380px"></action-mail>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" :loading="isLoading" @click="commitData()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import ActionMail from '@/components/ActionMail/index'
export default {
    name: 'DialogMarketing',
    data() {
        return {
            moduleCode: 'allModule',
            dialogVisible: false,
            actionMails: {},
            isLoading: false,
            mailAddress: []
        }
    },
    methods: {
        open(mailAddress = []) {
            this.mailAddress = mailAddress
            this.dialogVisible = true
        },
        commitData() {
            switch (this.actionMails.sendType.toString()) {
                case '1':
                    this.marketing(this.Global.baseURL + this.Global.api.v2.autoStrategy_manualExecAct, {
                        actionId: 1,
                        moduleCode: this.moduleCode,
                        detailActionId: this.actionMails.detailActionId,
                        paramsArray: this.mailAddress
                    })
                    break
                case '2':
                    this.marketing(this.Global.baseURL + this.Global.api.v2.bulkDeliver_Post, {
                        sendUser: this.actionMails.sendAddress || '',
                        invokeName: this.actionMails.invokeName,
                        detailActionId: this.actionMails.detailActionId,
                        receiptInfos: this.mailAddress.map(item => ({ addressStr: item.mailAddress }))
                    })
                    break
                default:
                    break
            }
        },
        marketing(url, data) {
            this.isLoading = true

            this.$http.post(url, data)
                .then(res => {
                    if (res.body.code.toString() === this.Global.RES_OK) {
                        this.$message.success(this.msg(res.body))
                        this.dialogVisible = false
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                    this.isLoading = false
                })
                .catch(err => {
                    this.isLoading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        }
    },
    components: {
        'action-mail': ActionMail
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
