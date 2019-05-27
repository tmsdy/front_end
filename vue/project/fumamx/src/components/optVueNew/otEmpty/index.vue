<template>
<span></span>
</template>
<script>
// 空的操作项
export default {
    name: 'Transfer',
    props: {
    },
    data() {
        return {
            next: ''
        }
    },
    methods: {
        openWindow(obj) {
            let _this = this
            let { optData, next } = obj
            if (next) {
                _this.next = next
            } else {
                _this.next = ''
            }
            // 提示
            // 将所选单据进行   操作
            if (optData.optCode == 'otFocus') {
                _this.optEvent(obj)
            } else {
                _this.$confirm(_this.$t('mxpcweb.client.list.1544687338458', {ok: optData.optName}), _this.$t('mxpcweb.client.1529047715824'), {
                    confirmButtonText: _this.$t('mxpcweb.client.1529047741736'),
                    cancelButtonText: _this.$t('mxpcweb.client.1529047588840'),
                    type: 'warning'
                }).then(() => {
                    if (optData.optCode == 'otSaleDelete') {
                        _this.otSaleDelete(obj)
                    } else {
                        _this.optEvent(obj)
                    }
                }).catch(() => {
                })
            }
        },
        otSaleDelete(obj) {
            ep.emit('setGlobalLoading', {
                val: true,
                // 操作进行中
                text: this.$t('mxpcweb.client.list.1550126273298') + '...'
            })
            this.$http.delete(this.Global.baseURL + this.Global.api.v2.document_quotation_bulkDelete, {
                params: {
                    moduleCode: obj.optData.optModuleCode,
                    identFieldValue: obj.billId
                }
            }).then((res) => {
                ep.emit('setGlobalLoading', {
                    val: false,
                    text: ''
                })
                if (res.body.code.toString() == this.Global.RES_OK) {
                    if (obj.type === '1') {
                        ep.emit('batchMsg', res.body)
                    } else {
                        this.$message.success(this.msg(res.body))
                    }
                    if (this.next != '') {
                        this.next()
                    }
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                ep.emit('setGlobalLoading', {
                    val: false,
                    text: ''
                })
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        optEvent (obj) {
            let _this = this
            let { optData, billId, itemData } = obj
            let { optCode, optModuleCode } = optData
            let data, url
            if (obj.type === '1') {
                data = {
                    optModuleCode: optModuleCode,
                    targets: billId.join(','),
                    optCode: optCode
                }
                url = this.Global.api.v2.document_operate_listOpt_put
            } else if (obj.type === '2') {
                data = {
                    optModuleCode: optModuleCode,
                    targets: billId.join(','),
                    optCode: 'unFocus'
                }
                url = this.Global.api.v2.document_operate_listOpt_put
            } else {
                let optCodes
                if (optCode == 'otFocus') {
                    if (_this.isFocusBill(itemData.focusTargets)) {
                        optCodes = 'unFocus'
                    } else {
                        optCodes = 'focus'
                    }
                } else {
                    optCodes = optCode
                }
                data = {
                    optModuleCode: optModuleCode,
                    identFieldValue: billId,
                    optCode: optCodes
                }
                url = this.Global.api.v2.document_operate_detailOpt_put
            }
            ep.emit('setGlobalLoading', {
                val: true,
                // 操作进行中
                text: this.$t('mxpcweb.client.list.1550126273298') + '...'
            })
            _this.$http.put(this.Global.baseURL + url, data).then((res) => {
                ep.emit('setGlobalLoading', {
                    val: false,
                    text: ''
                })
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    if (obj.type === '1') {
                        ep.emit('batchMsg', res.body)
                    } else {
                        _this.$message.success(_this.msg(res.body))
                    }
                    if (_this.next != '') {
                        _this.next()
                    }
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                ep.emit('setGlobalLoading', {
                    val: false,
                    text: ''
                })
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        }
    }
}
</script>
