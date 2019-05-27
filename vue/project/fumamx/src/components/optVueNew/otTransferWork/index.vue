<template>
        <!-- 转交工单 -->
        <el-dialog :title="$t('mxpcweb.client.1529133321383')" v-dialogDrag :visible.sync="TransferOrder" :closeOnClickModal="false" custom-class="width520" :modal-append-to-body="false">
            <div class="TransferOrderBox">
                <!-- 工单受理人 -->
                {{$t('mxpcweb.client.1529133549272')}}<br>
                <!-- 超级管理员 -->
                <el-select v-model="Superadministrator" :placeholder="$t('mxpcweb.client.1529133640054')" filterable size="small" style="margin:10px 0;width:350px;">
                    <el-option v-for="item in owners" :key="item.ctId" :label="item.realName" :value="item.ctId+''">
                    </el-option>
                </el-select><br>
                <!-- 请填写备注 -->
                <el-input v-model="transferContent" type="textarea" size="small" :placeholder="$t('mxpcweb.client.1529133660446')" style="width:350px;"></el-input>
            </div>
            <div slot="footer" class="dialogFooter">
                <!-- 转交工单 -->
                <el-button type="primary" size="small" style="width:80px;" @click="submits()" :loading="subLoading">{{$t('mxpcweb.client.1529133321383')}}</el-button>
            </div>
        </el-dialog>
</template>

<script>
export default {
    name: 'Transfer',
    props: {
    },
    data() {
        return {
            TransferOrder: false,
            Superadministrator: '',
            transferContent: '',
            owners: [],
            subLoading: false,
            id: [],
            type: '',
            moduleCode: '',
            callBack: function() {}
        }
    },
    mounted() {

    },
    created() {
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        openWindow(obj) {
            let {type, billId, optData, next} = obj
            this.moduleCode = optData.optModuleCode
            if (next) {
                this.callBack = next
            } else {
                this.callBack = function() {}
            }
            this.id = billId
            this.type = type
            this.TransferOrder = true
            this.Superadministrator = ''
            this.transferContent = ''
            this.getTable()
        },
        submits() {
            let _this = this
            if (this.Superadministrator == '') {
                // 请选择移交人员
                this.$message.error(this.$t('mxpcweb.client.1529133772330'))
            } else {
                let data = {}
                let url = ''
                if (this.type === '1') {
                    data = {
                        optModuleCode: _this.moduleCode,
                        targets: this.id,
                        optCode: 'otTransferWork',
                        toCtId: this.Superadministrator,
                        remark: this.transferContent
                    }
                    url = this.Global.api.v2.document_operate_listOpt_put
                } else {
                    data = {
                        optModuleCode: _this.moduleCode,
                        identFieldValue: _this.id,
                        optCode: 'otTransferWork',
                        toCtId: this.Superadministrator,
                        remark: this.transferContent
                    }
                    url = this.Global.api.v2.document_operate_detailOpt_put
                }
                _this.subLoading = true
                _this.$http.put(this.Global.baseURL + url, data).then((res) => {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.callBack()
                        _this.TransferOrder = false
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
            }
        },
        // 获取企业下所有人
        getTable() {
            let _this = this
            let contactData = {
                dataType: 'contact',
                funType: 'withRight',
                moduleCode: 'WO001',
                optCode: 'otTransferWork'
            }
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.accountDropList_get, { params: contactData }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.owners = res.body.data
                } else {
                    _this.$message.error(_this.msg(res.body))
                    _this.loading = false
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        }
    },
    components: {
    },
    watch: {
    },
    components: {
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
