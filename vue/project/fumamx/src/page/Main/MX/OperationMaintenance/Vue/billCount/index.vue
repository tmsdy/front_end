<template>
    <div class="allCount">
        <table v-for="(item, index) in dataList" :class="'inline' + index" :key="index">
            <tr>
                <td v-for="(items, indexs) in item.value" :key="indexs">
                    <list-vue :itemData="items"></list-vue>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
import listVue from './listVue/index' // top展示数据
/**
 * 运维管理
 * 何俊峰
 * 2018-11-18
 */
export default {
    name: 'billCount',
    props: {
    },
    data() {
        return {
            dataList: [
                {
                    label: '1',
                    value: [{
                        label: '客户',
                        iconfont: 'icon-people_list_light',
                        value: [
                            {
                                label: '新增客户数',
                                key: 'BF001create',
                                value: '0'
                            },
                            {
                                label: '新增跟进数',
                                key: 'BF004follow',
                                value: '0'
                            }
                        ]
                    }, {
                        label: '孚盟邮',
                        iconfont: 'icon-mail',
                        value: [
                            {
                                label: '收件数',
                                key: 'EM001receive',
                                value: '0'
                            },
                            {
                                label: '发件数',
                                key: 'EM001deliver',
                                value: '0'
                            }
                        ]
                    }, {
                        label: '发现',
                        iconfont: 'icon-discover',
                        value: [
                            {
                                label: '搜索次数',
                                key: 'DS001search',
                                value: '0'
                            },
                            {
                                label: '深挖次数',
                                key: 'DS002dig',
                                value: '0'
                            },
                            {
                                label: '社媒运营',
                                key: 'DS003publish',
                                value: '0'
                            }, {
                                label: '获取邮箱次数',
                                key: 'DS002digMail',
                                value: '0'
                            }
                        ]
                    }]
                }, {
                    label: '2',
                    value: [{
                        label: '营销AM',
                        iconfont: 'icon-am-solid',
                        value: [
                            {
                                label: '新建任务数',
                                key: 'AM001taskCreate',
                                value: '0'
                            },
                            {
                                label: '发送数',
                                key: 'AM001mailDelivery',
                                value: '0'
                            },
                            {
                                label: '开发信数',
                                key: 'AM001mailTemplate',
                                value: '0'
                            }
                        ]
                    }, {
                        label: '商品',
                        iconfont: 'icon-goods-list',
                        value: [
                            {
                                label: '上架商品数',
                                key: 'PP001onStock',
                                value: '0'
                            },
                            {
                                label: '分享次数',
                                key: 'PP001share',
                                value: '0'
                            },
                            {
                                label: '曝光次数',
                                key: 'PP001read',
                                value: '0'
                            }
                        ]
                    }, {
                        label: '知识管理',
                        iconfont: 'icon-file-manager',
                        value: [
                            {
                                label: '搜索次数',
                                key: 'DC001search',
                                value: '0'
                            },
                            {
                                label: '存档次数',
                                key: 'DC001create',
                                value: '0'
                            }
                        ]
                    }]
                }
            ]
        }
    },
    created() {
        this.getData()
    },
    methods: {
        getData() {
            let _this = this
            _this.$http.get(this.Global.baseURL + this.Global.api.mx.operation_count).then(function(res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    if (res.body.data.operation) {
                        _this.updata(res.body.data.operation)
                    }
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function(res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        updata(obj) {
            this.dataList.forEach(element => {
                element.value.forEach(items => {
                    items.value.forEach(item => {
                        if (obj[item.key]) {
                            item.value = obj[item.key]
                        }
                    })
                })
            })
        }
    },
    components: {
        'list-vue': listVue
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
