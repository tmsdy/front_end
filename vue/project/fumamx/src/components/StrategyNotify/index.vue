<template>
    <div class="StrategyNotify"></div>
</template>

<script>
export default {
    name: 'StrategyNotify',
    data() {
        return {

        }
    },
    methods: {
        open(data) {
            /* 自动化策略的通知 */
            this.$confirm(data.msgBody, '自动化策略提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.sendData(data.body.execRecordId)
            }).catch(() => {

            })
        },
        sendData(execRecordId) {
            let url = this.Global.baseURL + this.Global.api.v2.autoStrategy_executeRecord
            let params = { execRecordId }
            this.$http.get(url, { params })
                .then(res => {

                })
                .catch(err => {

                })
        }
    },
    components: {

    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
