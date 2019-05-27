<template>
    <div class="DialogOneToOne">
        <!-- 一对一发送 -->
        <el-dialog v-dialogDrag :title="$t('mxpcweb.mail.1528955923393')" :visible.sync="isOneToOneOpen" custom-class="width620" @close="cancelClick()" :close-on-click-modal="false" >
            <div v-loading="oneToOneSendLoading">
                <el-table :data="receiveMailList" height="250" border style="width: 100%;">
                    <!-- 收件人 -->
                    <el-table-column prop="mail" :label="$t('mxpcweb.mail.1528702113259')" align="center">
                    </el-table-column>
                    <!-- 状态 -->
                    <el-table-column prop="status" :label="$t('mxpcweb.mail.1528955979119')" align="center" width="100px">
                    </el-table-column>
                </el-table>
                <div class="text-center">
                    <!-- 取消 -->
                    <el-button @click="cancelClick()">{{$t('mxpcweb.mail.1528942364802')}}</el-button>
                    <!-- 发送 -->
                    <el-button @click="SendOneToOneMail()" :loading="submitLoading" type="primary">{{$t('mxpcweb.mail.1528701612107')}}</el-button>
                </div>
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
export default {
    name: 'DialogOneToOne',
    props: {},
    data() {
        return {
            actionName: '',
            sendDataPara: null,
            oneToOneSendLoading: false,
            urlstr: '',
            isOneToOneOpen: false, // 弹窗开关
            dialogOneToOneForm: {},
            receiveMailList: [

            ],
            replyTo: '',
            submitLoading: false
        }
    },
    methods: {
        // 发送一对一邮件
        SendOneToOneMail() {
            this.submitLoading = true
            let _this = this
            this.sendDataPara.action = 'send'
            this.sendDataPara.type = 1// 一对多
            // 判断类型
            if (this.actionName == 'showOneToOneDialogNow') { // 立即
                this.sendDataPara.realTime = true
                let data = new Date().getTime()
                this.sendDataPara.deliverDate = this.$m_unifiedTime(data)
            } else if (this.actionName == 'showOneToOneDialog') { // 默认
                this.sendDataPara.deliverDate = ''
                this.sendDataPara.realTime = true
            } else if (this.actionName == 'timingShowOneToOneDialog') { // 定时
                this.sendDataPara.realTime = false
            }
            this.sendDataPara.replyTo = this.replyTo
            if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                this.sendDataPara.ctid = this.subordinateCtid
            } else {
                delete this.sendDataPara.ctid
            }
            this.oneToOneSendLoading = true
            this.$http.post(this.Global.baseURL + this.Global.api.Mail.mailssavePost, this.sendDataPara).then(
                function (res) {
                    this.submitLoading = false
                    _this.oneToOneSendLoading = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        // 已提交服务器！
                        this.$message.success(_this.$t('mxpcweb.mail.1528975920501'))
                        this.$emit('setingMsgAndcomment', res.body.data.taskId, true)
                        ep.emit('closeMailTab', _this.urlstr)// 关闭
                    } else {
                        this.sendDataPara.sourceMid = res.body.data.taskId
                        _this.$message.error(_this.msg(res.body))
                    }
                },
                function (res) {
                    _this.oneToOneSendLoading = false
                    this.oneToOneSendLoading = false
                    _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
                }
            )
        },
        // 清空表单
        resetForm(formName) {
            if (this.isOneToOneOpen) {
                this.$refs[formName].resetFields()
            }
        },
        // 父组件来调用
        isDialogs(to, replyTo, mailList, sendDataPara, urlstr, actionName) {
            if (to == 'open') {
                this.isOneToOneOpen = true
                this.actionName = actionName
                this.sendDataPara = sendDataPara
                this.receiveMailList = mailList
                this.replyTo = replyTo
                this.receiveMailList.forEach(element => {
                    // 等待发送
                    element.status = this.$t('mxpcweb.mail.1528956116662')
                })
                this.urlstr = urlstr
            } else {
                this.isOneToOneOpen = false
            }
        },
        /**
         * 关闭页面
         */
        cancelClick() {
            this.isOneToOneOpen = false
            this.receiveMailList = []
        }
    },
    computed: {
        ...mapGetters('mail', ['subordinateCtid']),
        ...mapGetters(['company'])
    },
    watch: {}
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
