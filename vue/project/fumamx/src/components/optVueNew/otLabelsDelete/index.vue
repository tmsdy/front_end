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
            let { next } = obj
            if (next) {
                this.next = next
            } else {
                this.next = ''
            }
            this.$confirm('删除后标签将不能恢复，是否删除？', this.$t('mxpcweb.client.1529047715824'), {
                confirmButtonText: this.$t('mxpcweb.client.1529047741736'),
                cancelButtonText: this.$t('mxpcweb.client.1529047588840'),
                type: 'warning'
            }).then(() => {
                this.optEvent(obj)
            }).catch(() => {
            })
        },
        optEvent (obj) {
            let _this = this
            let { optData, billId } = obj
            let { optModuleCode } = optData
            let data, url
            data = {
                moduleCode: optModuleCode,
                labelIds: billId
            }
            url = this.Global.api.v2.label_delete
            ep.emit('setGlobalLoading', {
                val: true,
                // 操作进行中
                text: this.$t('mxpcweb.client.list.1550126273298') + '...'
            })
            _this.$http.delete(this.Global.baseURL + url, { params: data}).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    ep.emit('setGlobalLoading', {
                        val: false,
                        text: ''
                    })
                    ep.emit('batchMsg', res.body)
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
