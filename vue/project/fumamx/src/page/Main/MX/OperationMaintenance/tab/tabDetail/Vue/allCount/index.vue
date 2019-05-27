<template>
    <div class="allCount">
        <table class="inline">
            <tr>
                <td>
                    <div style="font-size: 12px;">
                    30天新增客户数
                    </div>
                    <strong class="text-hover">{{item.BF001?item.BF001:0}}</strong>
                </td>
                <td>
                    <div style="font-size: 12px;">
                    30天发送邮件数
                    </div>
                    <strong class="text-hover">{{item.EM001?item.EM001:0}}</strong>
                </td>
                <td>
                    <div style="font-size: 12px;">
                    30天发现搜索次数
                    </div>
                    <strong class="text-hover">{{item.DS001?item.DS001:0}}</strong>
                </td>
                <td>
                    <div style="font-size: 12px;">
                    30天邮件推送量
                    </div>
                    <strong class="text-hover">{{item.AM001?item.AM001:0}}</strong>
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
    name: 'billCount',
    props: {
        itemData: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data() {
        return {
            item: {}
        }
    },
    created() {
        this.getData()
    },
    methods: {
        getData() {
            let _this = this
            _this.$http.get(this.Global.baseURL + this.Global.api.mx.enterprise_operation, {
                params: {
                  cid: _this.itemData.cid
                }
            }).then(function(res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    if (res.body.data.operation) {
                        _this.item = res.body.data.operation
                    }
                } else {
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
