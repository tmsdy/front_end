<template>
    <el-dialog class="orderDetail" :title="title" custom-class="width620" :visible.sync="dialogFormVisible" :before-close="cancelDialog">
        <div v-if="step">
            <el-form :model="orderEntity" ref="form" style="margin-top: -10px;margin-left:45px;" label-width="85px" label-position="left">

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="订单号：" style="margin-bottom: 0px">
                            {{orderEntity.orderno}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="下单日期：" style="margin-bottom: 0px">
                            {{orderEntity.createdate}}
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="企业名称：" style="margin-bottom: 0px">
                            {{orderEntity.companyname}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属机构：" style="margin-bottom: 0px">
                            {{company.corpName}}
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="手机：" style="margin-bottom: 0px">
                            {{orderEntity.phone}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="邮箱：" style="margin-bottom: 0px">
                            {{orderEntity.useremail}}
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="业务员：" style="margin-bottom: 0px">
                            {{orderEntity.saleName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="提交人：" style="margin-bottom: 0px">
                            {{orderEntity.createName}}
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="应付金额：" style="margin-bottom: 0px">
                            {{returnFloat(orderEntity.payamount)}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="优惠金额：" style="margin-bottom: 0px">
                            {{returnFloat(result.offCost)}}
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="实付金额：" style="margin-bottom: 0px">
                            {{returnFloat(orderEntity.actualreceiveamount)}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="支付方式：" style="margin-bottom: 0px">
                            {{orderEntity.paywayName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="流水号：" style="margin-bottom: 0px">
                            {{orderEntity.paytradeno}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="付款凭证：" style="margin-bottom: 0px">
                            <!-- {{orderEntity.paymentvoucher}}
                        <span v-if="orderEntity.paymentvoucher && orderEntity.paymentvoucher!=''">
                            <a :href=this.Global.imgBaseSrc+orderEntity.paymentvoucher data-lightbox="one" data-title="FumaMX">
                                <img :src=this.Global.imgBaseSrc+orderEntity.paymentvoucher style="width:100px;height:100px;"></a>
                        </span> -->
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="使用状态：" style="margin-bottom: 0px">
                            <span>{{orderEntity.isusedName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="orderEntity.hasOwnProperty('offlineauthno') && orderEntity.isused == 0">
                        <el-form-item label="许可号" style="margin-bottom: 0px">
                            <span ref="spf_value" id="foo">{{orderEntity.offlineauthno}}</span>
                            <el-button size="mini" @click="Copy('spf_value')" data-clipboard-target="#foo" id="spf_value" v-show="orderEntity.offlineauthno != ''" ref="spf_value">复制</el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="orderEntity.hasOwnProperty('authurl') && orderEntity.isused == 0">
                        <el-form-item label="开通链接" style="margin-bottom: 0px">
                            <span ref="spf_link" id="fad">{{orderEntity.authurl}}</span>
                            <el-button size="mini" @click="Copy('spf_link')" data-clipboard-target="#fad" id="spf_link" v-show="orderEntity.authurl != ''" ref="spf_link">复制</el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-show="orderEntity.isused != -1">
                        <el-form-item :label="orderEntity.isused == 0 || orderEntity.isused == 1?'审核意见':orderEntity.isused == -2?'驳回理由':''" style="margin-bottom: 0px">
                            {{orderEntity.suggesstion}}
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-table :data="tableData" border style="border-left: 1px solid #eaedef;width:88%;margin: 0 auto;border-right: 1px solid #eaedef;">
                <el-table-column prop="index" label="" width="60">
                </el-table-column>
                <el-table-column prop="desc" label="订单描述" width="200">
                </el-table-column>
                <el-table-column prop="amount" label="费用小计">
                </el-table-column>
            </el-table>
            <div class="text-center" style="margin-top: 20px;">
                <el-button type="info" @click="sure()" v-if="orderEntity.isused == -1 && isAuthority">审核通过</el-button>
                <el-button type="primary" @click="rejectOrder()" v-if="orderEntity.isused == -1 && isAuthority">驳回</el-button>
                <el-button @click="cancelDialog()">关 闭</el-button>
            </div>
        </div>
        <div v-if="!step" class="tips">
            <div class="msg" v-show="isSure == 1">确定该订单已支付完成？</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" label-position="top">
                <el-form-item :label="formLabel" prop="desc">
                    <el-input type="textarea" v-model="ruleForm.desc" style="height: 100px;"></el-input>
                </el-form-item>
                <el-form-item style="text-align: center">
                    <el-button @click="cancel">取 消</el-button>
                    <el-button type="primary" @click="sureAgain('ruleForm')" :loading="isLoading">确 定</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-dialog>
</template>

<script>
import Clipboard from 'clipboard'
import { mapGetters } from 'vuex'
export default {
    name: 'orderDetail',
    props: [],
    data() {
        return {
            ruleForm: {
                desc: '' // 备注
            },
            rules: {
                desc: [
                    { required: true, message: '请填写意见或理由', trigger: 'blur' }
                ]
            },
            step: true,
            dialogFormVisible: false,
            orderEntity: {},
            result: {
                offCost: 0
            },
            tableData: [],
            isAuthority: false,
            title: '订单详情',
            formLabel: '',
            isSure: 0, // 是否是审核
            isLoading: false
        }
    },
    computed: {
        ...mapGetters(['company'])
    },
    methods: {
        returnFloat(x) {
            var value = Math.round(parseFloat(x) * 100) / 100
            var xsd = value.toString().split('.')
            if (xsd.length == 1) {
                value = value.toString() + '.00'
                return value
            }
            if (xsd.length > 1) {
                if (xsd[1].length < 2) {
                    value = value.toString() + '0'
                }
                return value
            }
        },
        cancel() {
            this.dialogFormVisible = false
            this.step = true
            this.isSure = 0
            this.title = '订单详情'
            this.ruleForm.desc = ''
        },
        toSure(x) {
            this.isLoading = true
            let data = {
                orderNo: this.orderEntity.orderno,
                orderStatus: x,
                suggesstion: this.ruleForm.desc
            }
            this.$http
                .put(this.Global.baseURL + this.Global.api.v2.saleOrder, data).then(res => {
                    this.isLoading = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.$message.success('提交成功！')
                        this.dialogFormVisible = false
                        this.title = '订单详情'
                        this.step = true
                        this.ruleForm.desc = ''
                        this.$emit('success')
                    } else {
                        this.$message.error(res.body.msg)
                    }
                },
                    res => {
                        this.isLoading = false
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        sureAgain(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.isSure == 1) {
                        this.toSure('F')
                    } else if (this.isSure == 2) {
                        this.toSure('P')
                    }
                } else {
                    return false
                }
            })
        },
        rejectOrder() {
            this.title = '提示'
            this.isSure = 2 // 驳回
            this.step = false
            this.formLabel = '驳回理由'
        },
        sure() {
            this.title = '提示'
            this.isSure = 1 // 审核
            this.step = false
            this.formLabel = '审核意见'
        },
        Copy(value) {
            if (this.$refs[value].$el) {
                let clipboard = new Clipboard(this.$refs[value].$el)
                clipboard.on('success', (e) => {
                    this.$message.success('复制成功')
                    e.clearSelection() // 清空粘贴区1
                })
            }
        },
        showBigImg() {
            this.openNewWindowTab(this.orderEntity.paymentvoucher)
        },
        /**
          * 显示明细信息
          * @param id
          * @param orderNo
          */
        showOrderDetail(id, orderNo) {
            var _this = this
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.orderDetail, {
                params: {
                    id: id,
                    orderno: orderNo
                }
            }).then(res => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.orderEntity = res.body.data.entity
                    if (!_this.orderEntity.hasOwnProperty('result')) {
                        _this.result.offCost = 0
                    }
                    if (_this.orderEntity.paymentvoucher && _this.orderEntity.paymentvoucher != '') {
                        _this.orderEntity.paymentvoucher = _this.orderEntity.paymentvoucher + '/@100'
                    }
                } else {
                    _this.$message(_this.msg(res.body))
                }
                _this.tableLoading = false
            }).catch(err => {
                _this.tableLoading = false
                this.$message.error(err)
            })
        },
        getDesc(n) {
            if (JSON.stringify(n) != '{}') {
                this.tableData = []
                for (var key in n) {
                    let obj = {
                        desc: '',
                        amount: 0
                    }
                    obj.desc = key
                    obj.amount = this.returnFloat(n[key])
                    this.tableData.push(obj)
                }
                let sum = 0
                this.tableData.forEach((item, index) => {
                    sum = sum + parseFloat(item.amount)
                    item.index = index + 1
                    item.amount = '￥' + item.amount
                })
                let total = {
                    index: '合计',
                    desc: '--',
                    amount: '￥' + this.returnFloat(sum)
                }
                this.tableData.push(total)
            } else {
                this.tableData = []
            }
        },
        // 显示界面
        showDialog(id, orderNo, authority) {
            this.showOrderDetail(id, orderNo)
            this.dialogFormVisible = true
            this.isAuthority = authority
        },

        // 关闭页面
        cancelDialog() {
            this.dialogFormVisible = false
            this.orderEntity = {}
        }

    },
    components: {

    }
}
</script>
<style lang="less">
.orderDetail {
    .el-form-item__content {
        color: #303133;
    }
    .el-table th {
        height: 30px;
    }
    .el-table td {
        height: 30px;
    }
    .el-table {
        border-left: 1px solid #eaedef !important;
        border-right: 1px solid #eaedef !important;
    }
    .el-table--border tr td:last-child {
        border-right: none !important;
    }
    .tips {
        margin: 0 auto;
        .dialog-footer {
            margin-top: 10px;
            text-align: center;
        }
        .msg {
            font-size: 18px;
            margin-bottom: 20px;
        }
        textarea {
            min-height: 100px !important;
        }
    }
}
</style>
