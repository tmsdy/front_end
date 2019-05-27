<template>
        <!-- 评价 -->
        <el-dialog :title="$t('mxpcweb.systemset.feedback.1529066447183')" v-dialogDrag :visible.sync="closeOrder" :closeOnClickModal="false" custom-class="width620" :modal-append-to-body="false">
            <div style="padding:15px 86px;font-size: 12px;">
                <div style="line-height:20px;">
                    <span style="float:left">
                        <span style="color:#f00">*</span>
                        <!-- 推荐指数 : -->
                        {{$t('mxpcweb.systemset.feedback.1529066372363')}} :
                    </span>
                    <div class="line"></div>
                    <el-rate style="float:left;padding:0 10px;" v-model="evaluate.value" :texts="evaluateText" text-color="rgb(247, 186, 42)" show-text></el-rate>
                </div>
                <!-- 提出您的建议，我们会努力改进～ -->
                <el-input resize="none" type="textarea" :rows="3" v-model="evaluate.content" :placeholder="$t('mxpcweb.systemset.feedback.1529066755917')" size="small" style="width:400px;margin-top:15px;"></el-input>
            </div>
            <div slot="footer" class="dialogFooter">
                <!-- 确定 -->
                <el-button type="primary" size="small" :loading="subLoading" @click="submit()">{{$t('mxpcweb.client.1529047741736')}}</el-button>
                <!-- 取消 -->
                <el-button @click="closeOrder = false" size="small">{{$t('mxpcweb.client.1529047588840')}}</el-button>
            </div>
        </el-dialog>
</template>
<script>
/**
 * 描述：操作评价
 * 作者：何俊峰
 * 时间：2017/11/10
 */
export default {
    name: 'addShare',
    props: {
    },
    data() {
        return {
            subLoading: false,
            id: '',
            closeOrder: false,
            type: '',
            moduleCode: '',
            callback: function() {},
            evaluate: {
                value: 0,
                content: ''
            }, // ['1.0  产品功能差', '2.0  产品功能一般', '3.0  产品功能还行', '4.0  产品很稳定，愿意推荐', '5.0  产品很好用，非常愿意推荐']
            evaluateText: [this.$t('mxpcweb.systemset.feedback.1529066792860'), this.$t('mxpcweb.systemset.feedback.1529066807345'), this.$t('mxpcweb.systemset.feedback.1529066810103'), this.$t('mxpcweb.systemset.feedback.1529066818838'), this.$t('mxpcweb.systemset.feedback.1529066839511')]
        }
    },
    created() {
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        // 打开窗口
        openWindow(obj) {
            let {billId, type, optData, next} = obj
            this.moduleCode = optData.optModuleCode
            if (next) {
                this.callback = next
            } else {
                this.callback = function() {}
            }
            this.id = billId
            this.type = type
            this.closeOrder = true
        },
        // 提交表单
        submit() {
            let _this = this
            let data = {}
            let url = ''
            if (this.type === '1') {
                data = {
                    optModuleCode: _this.moduleCode,
                    targets: _this.id,
                    optCode: 'otEvaluate',
                    score: _this.evaluate.value,
                    evaluate: _this.evaluate.content
                }
                url = this.Global.api.v2.document_operate_listOpt_put
            } else {
                data = {
                    optModuleCode: _this.moduleCode,
                    identFieldValue: _this.id,
                    optCode: 'otEvaluate',
                    score: _this.evaluate.value,
                    evaluate: _this.evaluate.content
                }
                url = this.Global.api.v2.document_operate_detailOpt_put
            }
            _this.subLoading = true
            _this.$http.put(this.Global.baseURL + url, data).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.evaluate = {
                        value: -1,
                        content: ''
                    }
                    _this.callback()
                    _this.closeOrder = false
                    _this.subLoading = false
                    if (_this.type === '1') {
                        ep.emit('batchMsg', res.body)
                    } else {
                        _this.$message.success(_this.msg(res.body))
                    }
                } else {
                    _this.subLoading = false
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.subLoading = false
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 关闭窗口
        cancel() {
            this.dialogSetList = false
        }
    },
    watch: {
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.closeProblemBox{
    padding: 20px 128px 23px 114px;
    text-align: center;
}
</style>
