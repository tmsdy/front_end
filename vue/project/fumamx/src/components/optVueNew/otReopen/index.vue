<template>
        <!-- 重启工单 -->
        <!-- 重启问题 -->
        <el-dialog v-dialogDrag :title="name=='WO002'?$t('mxpcweb.systemset.feedback.1534233932048'):$t('mxpcweb.client.detail.1533712705608')" :visible.sync="closeOrder" :closeOnClickModal="false" custom-class="width520" :modal-append-to-body="false">

            <div class="closeProblemBox" v-if="name=='WO002'">
                <!-- 是否重新开启此问题？ -->
                {{$t('mxpcweb.systemset.feedback.1534234036238')}}
            </div>
            <div class="closeProblemBox" v-else>
                <!-- 是否重新开启此工单？ -->
                {{$t('mxpcweb.client.detail.1533712793979')}}
            </div>
            <div slot="footer" class="dialogFooter">
                <!-- 确定 -->
                <el-button type="primary" size="small" style="width:66px;" @click="submit()" :loading="subLoading">{{$t('mxpcweb.client.1529047741736')}}</el-button>
                <!-- 取消 -->
                <el-button @click="closeOrder = false" size="small" style="width:66px;">{{$t('mxpcweb.client.1529047588840')}}</el-button>
            </div>
        </el-dialog>
</template>
<script>
/**
 * 描述：重启工单
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
            name: '',
            moduleCode: '',
            callback: function() {}
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
            let {billId, type, billName, optData, next} = obj
            this.moduleCode = optData.optModuleCode
            if (next) {
                this.callback = next
            } else {
                this.callback = function() {}
            }
            this.id = billId
            this.type = type
            this.name = billName
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
                    targets: this.id,
                    optCode: 'otReopen'
                }
                url = this.Global.api.v2.document_operate_listOpt_put
            } else {
                data = {
                    optModuleCode: _this.moduleCode,
                    identFieldValue: _this.id,
                    optCode: 'otReopen'
                }
                url = this.Global.api.v2.document_operate_detailOpt_put
            }
            _this.subLoading = true
            _this.$http.put(this.Global.baseURL + url, data).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
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
