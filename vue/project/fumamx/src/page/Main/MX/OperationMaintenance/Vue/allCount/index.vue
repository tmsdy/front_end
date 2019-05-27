<template>
    <div class="allCount">
        <table class="inline">
            <tr>
                <td>
                    <div>
                        开通企业数
                    </div>
                    <strong>{{allData.enterprise ? allData.enterprise : '0'}}</strong>
                </td>
                <td>
                    <div>
                        平台用户数
                    </div>
                    <strong>{{allData.user ? allData.user : '0'}}</strong>
                </td>
                <td>
                    <div>
                        本月活跃企业数
                    </div>
                    <strong>{{allData.activeEnterprise ? allData.activeEnterprise : '0'}}</strong>
                </td>
                <td>
                    <div>
                        本月活跃用户数
                    </div>
                    <strong>{{allData.activeUser ? allData.activeUser : '0'}}</strong>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
/**
 * 运维管理
 * 何俊峰
 * 2018-11-18
 */
export default {
    name: 'allCount',
    data() {
        return {
            allData: {}
        }
    },
    created() {
        this.getData()
    },
    methods: {
        getData() {
            let _this = this
            _this.$http.get(this.Global.baseURL + this.Global.api.mx.count).then(function(res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.allData = res.body.data
                } else {
                    _this.allData = {}
                    _this.$message.error(_this.msg(res.body))
                }
            }, function(res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        }
    },
    components: {
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
