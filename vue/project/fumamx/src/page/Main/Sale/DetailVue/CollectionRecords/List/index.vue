<template>
    <div class="Receivables">
        <template>
            <p class="contactTitle">
                <!-- 收款记录 -->
                {{$t('mxpcweb.sale.components.1557564962746')}}
                <el-button class="miniButton" size="mini" @click="addReceipt">
                    <!-- 添加记录 -->
                    {{$t('mxpcweb.sale.components.1557564962954')}}
                </el-button>
                <!-- 订单总金额： -->
                <span style="margin-left:15px;">{{$t('mxpcweb.sale.components.1557564963133')}}{{Currency}} {{totProdAmt}}</span>
                <!-- 实收金额： -->
                <span style="margin-left:15px;display:inline-block">{{$t('mxpcweb.sale.components.1557564963336')}}{{Currency}} {{actualAmt}}</span>
                <!-- 未收金额： -->
                <span style="margin-left:15px;display:inline-block">{{$t('mxpcweb.sale.components.1557564963537')}}{{Currency}} {{unpayAmt}}</span>
            </p>
            <div class="ReceivablesBox" v-if="list && list.length > 0">
                <div class="lstTit">
                    <el-row>
                        <el-col :span="4">
                            <div>
                                <!-- 备注 -->
                                {{$t('mxpcweb.sale.components.1557564963745')}}
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div>
                                <!-- 登记人 -->
                                {{$t('mxpcweb.sale.components.1557564963945')}}
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div>
                                <!-- 收款日期 -->
                                {{$t('mxpcweb.sale.components.1557564822633')}}
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div>
                                <!-- 银行流水号 -->
                                {{$t('mxpcweb.sale.components.1557564780184')}}
                            </div>
                        </el-col>
                        <el-col :span="3">
                            <div>
                                <!-- 收款金额 -->
                                {{$t('mxpcweb.sale.components.1557564788061')}}
                            </div>
                        </el-col>
                        <el-col :span="3">
                            <div>
                                <!-- 收款方式 -->
                                {{$t('mxpcweb.sale.components.1557564797106')}}
                            </div>
                        </el-col>
                        <el-col :span="2">
                            <!-- 操作 -->
                            {{$t('mxpcweb.sale.components.1557564964147')}}
                        </el-col>
                    </el-row>
                </div>
                <div class="list" v-for="(item, index) in list" :key="index">
                    <el-row>
                        <el-col :span="4">
                            <div>
                                {{item.receiptDesc}}&nbsp;
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div>
                                <span>{{contactList[item.register] || '&nbsp;'}}</span>&nbsp;
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div>
                                <span>{{item.receiptDate ? item.receiptDate.substring(0, 10) : ''}}</span>&nbsp;
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div>
                                {{item.accountStat ? item.accountStat : ''}}&nbsp;
                            </div>
                        </el-col>
                        <el-col :span="3">
                            <div>
                                {{item.proceeds ? item.proceeds : ''}}&nbsp;
                            </div>
                        </el-col>
                        <el-col :span="3">
                            <div>
                                {{getType(item.payment)}}&nbsp;
                            </div>
                        </el-col>
                        <el-col :span="2">
                            <div class="optBox">
                                <span class="iBox" @click="editItem(item)">
                                    <i class="iconfont icon-edit"></i>
                                </span>
                                <span class="iBox" @click="deleteItem(item)">
                                    <i class="iconfont icon-del"></i>
                                </span>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="ReceivablesBox" v-else>
                <nodata></nodata>
            </div>
            <add-receipts ref="addReceipts" @getData="getDatas"></add-receipts>
        </template>
    </div>
</template>
<script>
import NoData from '@/basecomponents/NoData/index'
import AddReceipts from '@/page/Main/Sale/components/AddReceipts/index'
import { mapGetters } from 'vuex'
export default {
    name: 'Receivables',
    props: {
        actualAmt: {
            type: Number,
            default: 0
        },
        unpayAmt: {
            type: Number,
            default: 0
        },
        totProdAmt: {
            type: Number,
            default: 0
        },
        Currency: {
            type: String,
            default: ''
        },
        itemData: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            list: []
        }
    },
    created() {
        this.getData()
    },
    computed: {
        ...mapGetters([
            'contactList'
        ])
    },
    methods: {
        addReceipt() {
            if (this.itemData.orderId) {
                this.$refs.addReceipts.showDialog({orderId: this.itemData.orderId})
            } else {
                this.$refs.addReceipts.showDialog()
            }
        },
        getType(payment) {
            if ((typeof payment) == 'string' || (typeof payment) == 'number') {
                if (payment == '0') {
                    // 其他
                    return this.$t('mxpcweb.sale.components.1557564799092')
                } else if (payment == '1') {
                    // 转账
                    return this.$t('mxpcweb.sale.components.1557564799601')
                } else if (payment == '2') {
                    // 网银
                    return this.$t('mxpcweb.sale.components.1557564799813')
                } else if (payment == '3') {
                    // 现金
                    return this.$t('mxpcweb.sale.components.1557564800010')
                } else {
                    return ''
                }
            } else {
                return ''
            }
        },
        getData() {
            if (this.itemData.orderId) {
                this.$http.get(this.Global.baseURL + this.Global.api.v2.document_order_receipt_list, {
                    params: {
                        orderId: this.itemData.orderId
                    }
                }).then((res) => {
                    if (res.body.code.toString() === this.Global.RES_OK && res.body.data) {
                        this.list = res.body.data.list || []
                    } else {
                        this.$message.error(this.msg(res.body))
                        this.list = []
                    }
                }, (res) => {
                    this.list = []
                    this.$message.error(this.msg(res.body))
                })
            }
        },
        getDatas() {
            this.$emit('tellFather')
            this.getData()
        },
        editItem(item) {
            this.$refs.addReceipts.showDialog(item)
        },
        deleteItem(item) {
            this.$confirm('是否删除此收款记录？', this.$t('mxpcweb.client.1529047715824'), {
                confirmButtonText: this.$t('mxpcweb.client.1529047741736'),
                cancelButtonText: this.$t('mxpcweb.client.1529047588840'),
                type: 'warning'
            }).then(() => {
                this.$http.delete(this.Global.baseURL + this.Global.api.v2.document_order_receipt_delete, {
                    params: {
                        moduleCode: 'SC002',
                        strucId: '5',
                        identFieldValue: item.receiptId
                    }
                }).then((res) => {
                    if (res.body.code.toString() === this.Global.RES_OK) {
                        this.$emit('tellFather')
                        this.getData()
                        this.$message.success(this.msg(res.body))
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                }, (res) => {
                    this.$message.error(this.msg(res.body))
                })
            }).catch(() => {
            })
        },
        updata() {
        },
        submit() {
        },
        clearData() {
        }
    },
    components: {
        'nodata': NoData,
        'add-receipts': AddReceipts
    },
    watch: {
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
