<template>
    <div class="recharge MXscroll" ref="mailList" v-loading="loading">
        <!-- 发送设置 -->
        <!-- 充值 -->
        <page-detail style="z-index: 2;" :title="$t('mxpcweb.am.1533366752666')" iconfont="icon-setting" :detailTitle="$t('mxpcweb.am.1531904952432')" @toList="$emit('backPage', '0')"></page-detail>
        <div class="list2">
            <!-- 账户余额: -->
            {{$t('mxpcweb.am.1532511326836')}} ¥ {{parseFloat(avaliableBalance).toFixed(2)}}
        </div>
        <div class="list1">
            <!-- 充值 -->
            {{$t('mxpcweb.am.1531904952432')}}
        </div>
        <div class="list2">
            <!-- 请选择充值产品: -->
            {{$t('mxpcweb.am.1534312526130')}}
        </div>
        <div class="list5" style="height:100px">
            <div class="list5Box">
                <div @click="product='all'" :class="product !== 'all' ? 'year' : 'year-selected'">
                    <!-- 通用 -->
                    <div style="margin-top:5px;">{{$t('mxpcweb.am.1534312861443')}}</div>
                    <span class="hook" v-if="product == 'all'"><i class="iconfont icon-hook"></i></span>
                </div>
                <div @click="product='am'" :class="product !== 'am' ? 'year' : 'year-selected'">
                    <!-- 营销AM -->
                    <div style="margin-top:5px;">{{$t('mxpcweb.am.1534312928406')}}</div>
                    <span class="hook" v-if="product == 'am'"><i class="iconfont icon-hook"></i></span>
                </div>
            </div>
        </div>
        <div class="list3">
            <div>
                <!-- 在线充值 -->
                <el-radio class="radio" v-model="radio" label="1">{{$t('mxpcweb.am.1532511371226')}}</el-radio>
                <!-- 线下汇款 -->
                <el-radio class="radio" v-model="radio" label="2">{{$t('mxpcweb.am.1532512124104')}}</el-radio>
            </div>
            <div class="list3Box" v-if="radio=='1'">
                <div :class="paymentType !== '1' ? 'year' : 'year-selected'" style="line-height:70px;">
                    <!-- 支付宝 -->
                    <!-- {{$t('mxpcweb.am.1532511399899')}} -->
                    <img src="../img/T1HHFgXXVeXXXXXXXX.png">
                    <span class="hook" v-if="paymentType == '1'"><i class="iconfont icon-hook"></i></span>
                </div>
            </div>
            <template v-if="radio=='2'">
                <el-row class="title">
                    <el-col :span="8">
                        <!-- 开户名称 -->
                        {{$t('mxpcweb.am.1533089824448')}}
                    </el-col>
                    <el-col :span="9">
                        <!-- 开户银行 -->
                        {{$t('mxpcweb.am.1533089851078')}}
                    </el-col>
                    <el-col :span="7">
                        <!-- 银行账户 -->
                        {{$t('mxpcweb.am.1533089885822')}}
                    </el-col>
                </el-row>
                <el-row class="list">
                    <el-col :span="8">
                        <!-- 上海孚盟软件有限公司 -->
                        {{$t('mxpcweb.am.1533089906574')}}
                    </el-col>
                    <el-col :span="9">
                        <!-- 平安银行上海西南支行 -->
                        {{$t('mxpcweb.am.1533089927702')}}
                    </el-col>
                    <el-col :span="7">
                        <span>11006935635401</span>
                        <!-- 复制 -->
                        <el-button size="mini" class="numCount" ref="copyButton" data-clipboard-text="11006935635401" @click="Copy">{{$t('mxpcweb.am.1531893077381')}}</el-button>
                    </el-col>
                </el-row>
                <div class="Tip">
                    <!-- 线下汇款处理说明 -->
                    <div class="tipTitle">{{$t('mxpcweb.am.1532586583115')}}</div>
                    <!-- 1.如果您选择线下汇款，请按照以上账户信息进行汇款 -->
                    <div class="tipTitleList" style="margin-top:15px;">{{$t('mxpcweb.am.1532586569884')}}</div>
                    <!-- 2.线下公司转账方式的到账时间是 1 - 3 个工作日 -->
                    <div class="tipTitleList">{{$t('mxpcweb.am.1532586553967')}}</div>
                    <!-- 3.汇款后请在 2 个工作日内将汇款回单传真至 021-60904622 -->
                    <div class="tipTitleList">{{$t('mxpcweb.am.1532586539185')}}</div>
                </div>
            </template>
        </div>
        <template v-if="radio=='1'">
            <div class="list4">
                <!-- 请选择充值金额 -->
                {{$t('mxpcweb.am.1532511426790')}}
            </div>
            <div class="list5">
                <div class="list5Box">
                    <div @click="money='1';moneyData=1000" :class="money !== '1' ? 'year' : 'year-selected'">
                        <!-- 元 -->
                        {{$t('mxpcweb.am.1532511488132', {num:'1000.00'})}}
                        <div class="tip">
                            <!-- 赠送50.00元 -->
                            {{$t('mxpcweb.am.1532511605207')}}{{$t('mxpcweb.am.1532511488132', {num:'50.00'})}}
                        </div>
                        <span class="hook" v-if="money == '1'"><i class="iconfont icon-hook"></i></span>
                    </div>
                    <div @click="money='2';moneyData=2000" :class="money !== '2' ? 'year' : 'year-selected'">
                        {{$t('mxpcweb.am.1532511488132', {num:'2000.00'})}}
                        <div class="tip">
                            <!-- 赠送200.00元 -->
                            {{$t('mxpcweb.am.1532511605207')}}{{$t('mxpcweb.am.1532511488132', {num:'200.00'})}}
                        </div>
                        <span class="hook" v-if="money == '2'"><i class="iconfont icon-hook"></i></span>
                    </div>
                </div>
                <div class="list5Box">
                    <div @click="money='3';moneyData=3000" :class="money !== '3' ? 'year' : 'year-selected'">
                        {{$t('mxpcweb.am.1532511488132', {num:'3000.00'})}}
                        <div class="tip">
                            <!-- 赠送1000.00元                        -->
                            {{$t('mxpcweb.am.1532511605207')}}{{$t('mxpcweb.am.1532511488132', {num:'1000.00'})}}
                        </div>
                        <span class="hook" v-if="money == '3'"><i class="iconfont icon-hook"></i></span>
                    </div>
                    <div @click="money='4';moneyData=inputValue" :class="money !== '4' ? 'year' : 'year-selected'" style="padding-top:17px;">
                        <!-- 其他金额 -->
                        {{$t('mxpcweb.am.1532586471969')}}
                        <span class="hook" v-if="money == '4'"><i class="iconfont icon-hook"></i></span>
                    </div>
                </div>
            </div>
            <div class="list6">
                <!-- 需支付 -->
                <div v-if="money!='4'">
                    {{$t('mxpcweb.am.1532586453180')}} ¥ {{moneyData.toFixed(2)}}
                </div>
                <div v-if="money=='4'">
                    <el-input-number style="width:130px" v-model="inputValue" @change="change" :min="0" :step="100" :controls="false"></el-input-number>
                    <span style="margin-left:26px">{{$t('mxpcweb.am.1532586453180')}} ¥ {{moneyData.toFixed(2)}}</span>
                </div>
            </div>
            <div class="list6" style="margin-top:20px; margin-bottom: 30px;">
                <!-- 确定 -->
                <el-button type="primary" @click="lipayCall()" :loading="submitLoading">{{$t('mxpcweb.am.1531893129621')}}</el-button>
                <!-- 返回 -->
                <el-button @click="$emit('backPage', '0')">{{$t('mxpcweb.am.1532586428420')}}</el-button>
            </div>
        </template>
        <!-- 支付确认 -->
        <el-dialog v-dialogDrag :title="$t('mxpcweb.am.1532586521149')" :visible.sync="payDialog" custom-class="width520" :closeOnClickModal="false" class="payDialog" :modal-append-to-body="false">
            <div class="payBox">
                <!-- 请在新建页面内完成支付，若你已成功支付且页面没有自动刷新，请点击支付成功 -->
                <div class="payBoxList">{{$t('mxpcweb.am.1532594678354')}}</div>
                <div class="optBut">
                    <!-- 取消 -->
                    <el-button @click="payDialog = false">{{$t('mxpcweb.am.1531893140621')}}</el-button>
                    <!-- 支付成功 -->
                    <el-button type="primary" @click="$emit('backPage', '0')">{{$t('mxpcweb.am.1532584154867')}}</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import PageDetail from '@/components/PageDetail/index' // 大标题
import Clipboard from 'clipboard'
export default {
    name: 'recharge',
    props: {
        avaliableBalance: {
            type: String,
            default: '0'
        },
        productType: {
            type: String,
            default: 'all'
        }
    },
    data() {
        return {
            domainList: [],
            loading: false,
            radio: '1',
            paymentType: '1',
            money: '1',
            moneyData: 1000.00,
            inputValue: 0,
            submitLoading: false,
            payDialog: false,
            product: this.productType
        }
    },
    created() {
    },
    mounted() {
        this.$nextTick(() => {
            this.mailListHeight()
        })
    },
    methods: {
        // 实时计算邮件列表高
        mailListHeight() {
            let winHeight = document.body.clientHeight

            this.$refs.mailList.style.height = winHeight - 88 + 'px'
        },
        change(item) {
            this.moneyData = item
        },
        Copy() {
            if (this.$refs.copyButton.$el) {
                let clipboard = new Clipboard(this.$refs.copyButton.$el)
                clipboard.on('success', (e) => {
                    this.$message.success(this.$t('mxpcweb.am.1531904029672')) // 复制成功
                })
            }
        },
        lipayCall() {
            let _this = this
            if (this.moneyData == 0) {
                // 请输入金额
                this.$message(this.$t('mxpcweb.am.1532597755490'))
                return false
            }
            this.submitLoading = true
            this.$http.get(this.Global.baseURL + this.Global.api.v2.payCenter_onlinepay, {
                params: {
                    totalAmount: this.moneyData,
                    giveAmount: this.giveNum(),
                    product: this.product
                }
            }).then((res) => {
                if (res.body.code.toString() === this.Global.RES_OK) {
                    let url = 'https://openapi.alipay.com/gateway.do?' + res.body.data.resultString // 后更改页面地址
                    this.openNewWindowTab(url)
                    this.payDialog = true
                } else if (res.body.code.toString() != '-3') {
                    this.$message.error(_this.msg(res.body))
                }
                this.submitLoading = false
            }, function (res) {
                this.submitLoading = false
                this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        giveNum() {
            if (this.moneyData < 1000) {
                return 0
            }
            if (this.moneyData >= 1000 && this.moneyData < 2000) {
                return 50
            }
            if (this.moneyData >= 2000 && this.moneyData < 3000) {
                return 200
            }
            if (this.moneyData >= 3000) {
                return 1000
            }
        }
    },
    components: {
        'page-detail': PageDetail
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.recharge {
    background: white;
    padding: 20px;
    overflow-y: scroll;
    .list1 {
        font-size: 16px;
        height: 44px;
    }
    .list2 {
        height: 44px;
        color: #6b6b6b;
    }
    .year-selected {
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(208, 2, 27, 1);
        text-align: center; /*水平居中*/
        float: left;
        font-size: 16px;

        position: relative;
        margin-right: 30px;
        margin-bottom: 10px;
        .hook {
            // background: red;
            position: absolute;
            top: 0;
            right: 0;
            height: 20px;
            line-height: 18px;
            width: 25px;
            color: #d0021b;
            text-align: right;
            padding-right: 1px;
            .iconfont {
                font-size: 10px;
                position: relative;
                z-index: 2;
                color: #fff;
            }
            &:before {
                content: "";
                position: absolute;
                right: 0;
                border-width: 13px;
                border-style: solid;
                border-color: #d0021b #d0021b transparent transparent;
            }
        }
    }
    .year {
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(224, 224, 224, 1);
        // padding-top:20px;
        // padding-left: 45px;
        text-align: center; /*水平居中*/
        float: left;
        cursor: pointer;
        font-size: 16px;

        margin-right: 30px;
        margin-bottom: 10px;
    }
    .list3 {
        min-height: 110px;
        .list3Box {
            margin: 20px 0;
            height: 60px;
            .year-selected,
            .year {
                width: 130px;
                height: 60px;
                img {
                    width: 90px;
                    margin-top: 14px;
                }
                .tip {
                    font-size: 12px;
                    color: #ff7f2c;
                }
            }
        }
        .title {
            height: 40px;
            line-height: 40px;
            padding-left: 20px;
            background: rgba(239, 242, 244, 1);
            color: RGBA(144, 147, 153, 1);
            margin-top: 20px;
        }
        .list {
            height: 54px;
            line-height: 54px;
            padding-left: 20px;
            color: RGBA(34, 34, 34, 1);
            border-bottom: 1px solid rgba(234, 237, 239, 1);
            background: white;
            &:hover {
                background: #fcf2f3;
            }
        }
        .Tip {
            margin-top: 30px;
            height: 165px;
            background: inherit;
            background-color: rgba(244, 251, 255, 1);
            box-sizing: border-box;
            border: 1px solid rgba(244, 251, 255, 1);
            border-left: 3px solid #93d3fb;
            padding: 20px 30px;
            .tipTitle {
                font-size: 16px;
            }
            .tipTitleList {
                height: 28px;
                line-height: 28px;
                font-size: 12px;
            }
        }
    }
    .list4 {
        height: 20px;
    }
    .list5 {
        height: 190px;
        .list5Box {
            margin: 10px 0;
            height: 90px;
            .year-selected,
            .year {
                width: 130px;
                height: 60px;
                padding: 14px 0 0;
                text-align: center;
                .tip {
                    font-size: 12px;
                    color: #ff7f2c;
                    position: relative;
                    top: -4px;
                }
            }
        }
    }
    .list6 {
        height: 40px;
        line-height: 40px;
    }
    .payDialog {
        .payBox {
            padding: 0 50px;
            border-radius: 5px;
            .payBoxTitle {
                font-size: 16px;
            }
            .payBoxList {
                color: #6b6b6b;
                font-size: 13px;
                margin-top: 10px;
                line-height: 40px;
            }
            .optBut {
                margin-top: 30px;
                text-align: right;
            }
        }
    }
}
</style>
