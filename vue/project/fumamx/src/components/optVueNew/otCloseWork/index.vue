<template>
        <!-- 关闭工单 -->
        <!-- 关闭问题 -->
        <el-dialog v-dialogDrag :title="moduleCode=='WO002'?$t('mxpcweb.systemset.feedback.1529066288158'):$t('mxpcweb.client.1529133337570')" :visible.sync="closeOrder" :closeOnClickModal="false" custom-class="width520" :modal-append-to-body="false">
            <div class="closeProblemBox">
                <!-- 关闭后，工单将不可再次修改与回复，但发起人可以再次开启 确定关闭该工单？ -->
                <!-- 关闭后，问题将不可再次修改与回复，但发起人可以再次开启 确定关闭该问题？ -->
                {{moduleCode=='WO002'?$t('mxpcweb.systemset.feedback.1534386445672'):$t('mxpcweb.systemset.feedback.1534386476519')}}
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
 * 描述：客户管理-客户列表-设置列表字段
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
            moduleCode: '',
            id: '',
            closeOrder: false,
            type: '',
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
                    targets: this.id,
                    optCode: 'otCloseWork'
                }
                url = this.Global.api.v2.document_operate_listOpt_put
            } else {
                data = {
                    optModuleCode: _this.moduleCode,
                    identFieldValue: _this.id,
                    optCode: 'otCloseWork'
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
    padding: 20px 100px 23px 100px;
    text-align: center;
}
</style>
