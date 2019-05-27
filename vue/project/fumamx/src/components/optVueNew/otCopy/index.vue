<template>
<span></span>
</template>
<script>
import { mapMutations } from 'vuex'
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
        ...mapMutations('sale', {// 用于清空参数
            set_paramersData: 'SET_PARAMERSDATA'
        }),
        openWindow(obj) {
            let { optData, moduleCode, billId, next } = obj
            // 提示
            // 将所选单据进行   操作
            this.$confirm(this.$t('mxpcweb.client.list.1544687338458', {ok: optData.optName}), this.$t('mxpcweb.client.1529047715824'), {
                confirmButtonText: this.$t('mxpcweb.client.1529047741736'),
                cancelButtonText: this.$t('mxpcweb.client.1529047588840'),
                type: 'warning'
            }).then(() => {
                if (moduleCode == 'SC001' || moduleCode == 'SC002') {
                    let url = ''
                    url = this.Global.api.v2.document_quotation_get
                    ep.emit('setGlobalLoading', {
                        val: true,
                        text: '数据转化中，请稍等...'
                    })
                    this.$http.get(this.Global.baseURL + url, {
                        params: {
                            moduleCode: moduleCode,
                            searchType: 'detail',
                            strucId: '1',
                            identFieldValue: billId
                        }
                    }).then((res) => {
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            let newData = res.body.data
                            if (moduleCode == 'SC001') {
                                delete newData.quotaId
                                delete newData.quotaCode
                                if (newData.strucId_2) {
                                    newData.strucId_2.forEach(item => {
                                        delete item.quotaId
                                        delete item.quotaListId
                                    })
                                }
                                if (newData.strucId_3) {
                                    newData.strucId_3.forEach(item => {
                                        delete item.quotaId
                                        delete item.quotaFeeId
                                    })
                                }
                                newData.quotaDate = this.$m_unifiedTime(new Date())
                            }
                            if (moduleCode == 'SC002') {
                                delete newData.orderId
                                delete newData.orderCode
                                if (newData.strucId_2) {
                                    newData.strucId_2.forEach(item => {
                                        delete item.orderId
                                        delete item.orderListId
                                    })
                                }
                                if (newData.strucId_3) {
                                    newData.strucId_3.forEach(item => {
                                        delete item.orderId
                                        delete item.orderFeeId
                                    })
                                }
                                if (newData.SC003) {
                                    delete newData.SC003.orderId
                                    delete newData.SC003.finStatus
                                    if (newData.SC003.strucId_3) {
                                        newData.SC003.strucId_3.forEach(item => {
                                            if (item.taskStatus) {
                                                delete item.taskStatus
                                            }
                                            if (item.progress) {
                                                delete item.progress
                                            }
                                        })
                                    }
                                }
                                newData.orderDate = this.$m_unifiedTime(new Date())
                            }
                            newData.moduleCode = moduleCode
                            this.getFormKey((formKey, msg) => {
                                if (formKey && formKey != '') {
                                    this.$http.post(this.Global.baseURL + this.Global.api.v2.document_quotation_post, Object.assign(newData, {
                                        'formKey': formKey
                                    })).then((res) => {
                                        ep.emit('setGlobalLoading', {
                                            val: false,
                                            text: ''
                                        })
                                        if (res.body.code.toString() == this.Global.RES_OK) {
                                            if (next) {
                                                next()
                                            }
                                            this.$confirm('转抄成功，是否进行编辑', this.$t('mxpcweb.client.1529047715824'), {
                                                confirmButtonText: this.$t('mxpcweb.client.1529047741736'),
                                                cancelButtonText: this.$t('mxpcweb.client.1529047588840'),
                                                type: 'warning'
                                            }).then(() => {
                                                let billId = ''
                                                if (moduleCode == 'SC001') {
                                                    billId = res.body.data.quotaId
                                                } else if (moduleCode == 'SC002') {
                                                    billId = res.body.data.orderId
                                                }
                                                this.$router.push('/main/sale/tabs/edit/' + moduleCode + '/' + billId)
                                            }).catch(() => {
                                            })
                                        } else {
                                            this.$message.error(this.msg(res.body))
                                        }
                                        this.updateFormKey()
                                    }, (res) => {
                                        ep.emit('setGlobalLoading', {
                                            val: false,
                                            text: ''
                                        })
                                        this.$message.error(this.$t(this.Global.errorTitle))
                                    })
                                } else {
                                    ep.emit('setGlobalLoading', {
                                        val: false,
                                        text: ''
                                    })
                                    this.$message.error(msg)
                                }
                            })
                        } else {
                            ep.emit('setGlobalLoading', {
                                val: false,
                                text: ''
                            })
                            this.$message.error(this.msg(res.body))
                        }
                    }, (res) => {
                        ep.emit('setGlobalLoading', {
                            val: false,
                            text: ''
                        })
                        this.$message.error(this.$t(this.Global.errorTitle))
                    })
                }
            }).catch(() => {
            })
        }
    }
}
</script>
