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
            let { optData, moduleCode, billId } = obj
            // 提示
            // 将所选单据进行   操作
            this.$confirm(this.$t('mxpcweb.client.list.1544687338458', {ok: optData.optName}), this.$t('mxpcweb.client.1529047715824'), {
                confirmButtonText: this.$t('mxpcweb.client.1529047741736'),
                cancelButtonText: this.$t('mxpcweb.client.1529047588840'),
                type: 'warning'
            }).then(() => {
                if (moduleCode == 'SC001') {
                    ep.emit('setGlobalLoading', {
                        val: true,
                        text: '数据转化中，请稍等...'
                    })
                    this.$http.get(this.Global.baseURL + this.Global.api.v2.document_quotation_get, {
                        params: {
                            moduleCode: moduleCode,
                            searchType: 'detail',
                            strucId: '1',
                            identFieldValue: billId
                        }
                    }).then((res) => {
                        ep.emit('setGlobalLoading', {
                            val: false,
                            text: ''
                        })
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            let newData = res.body.data
                            let strucId_2 = newData.strucId_2 ? JSON.parse(JSON.stringify(newData.strucId_2)) : []
                            strucId_2.forEach(element => {
                                element.salePrice = element.quotedPrice
                            })
                            let strucId_3 = newData.strucId_3 ? JSON.parse(JSON.stringify(newData.strucId_3)) : []
                            let data = {
                                category: newData.category || '',
                                contId: newData.contId || '',
                                contName: newData.contName || '',
                                custId: newData.custId || '',
                                mailAddress: newData.mailAddress || '',
                                ownerCtId: newData.ownerCtId || '',
                                ownerDeptKey: newData.ownerDeptKey || '',
                                orderTheme: newData.quotaTheme || '',
                                tel: newData.tel || '',
                                tradeMode: newData.tradeMode || '',
                                transMode: newData.transMode || '',
                                payMode: newData.payMode || '',
                                startPort: newData.startPort || '',
                                arrivePort: newData.arrivePort || '',
                                cur: newData.cur || '',
                                remarks: newData.remarks || '',
                                showPicFlag: newData.showPicFlag || '',
                                strucId_2: strucId_2,
                                strucId_3: strucId_3
                            }
                            this.set_paramersData(data)
                            let newTabName = new Date() * 1 + ''
                            this.$router.push('/main/sale/tabs/new/' + 'SC002' + '/' + newTabName)
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
                }
            }).catch(() => {
            })
        }
    }
}
</script>
