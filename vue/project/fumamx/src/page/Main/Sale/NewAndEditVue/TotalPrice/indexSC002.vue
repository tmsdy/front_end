<template>
<div class="TotalPriceBox">
    <div class="TotalPrice" style="height:300px;">
        <div class="totalPriceTit"></div>
        <div class="totalPriceContent" style="height:300px;">
            <div class="priceListBox">
                <div class="priceList">
                    <!-- 商品金额 -->
                    <span class="listTit">{{$t('mxpcweb.sale.components.1557565106971')}}</span>
                    {{Currency}} {{totProdAmt}}
                </div>
                <div class="priceList">
                    <!-- 总数 -->
                    <span class="listTit">{{$t('mxpcweb.sale.components.1557565107184')}}</span>
                    {{qtyAmt}}
                </div>
                <div class="priceList">
                    <!-- 收款费用合计 -->
                    <span class="listTit">{{$t('mxpcweb.sale.components.1557565107401')}}</span>
                    {{Currency}} {{totAddFee}}
                </div>
                <div class="priceList">
                    <!-- 扣款费用合计 -->
                    <span class="listTit">{{$t('mxpcweb.sale.components.1557565107601')}}</span>
                    <span style="color:#D0021B">- {{Currency}} {{totDeductFee}}</span>
                </div>
                <div class="priceList">
                    <!-- 调整金额 -->
                    <span class="listTit">{{$t('mxpcweb.sale.components.1557565107803')}}</span>
                    {{Currency}} <input type="number" v-model="adjustAmt"
                    min="0"
                    onkeypress="if( ! /^-?\d+\.?\d{0,1}$/.test(this.value)){ var s = this.value;this.value=s.substring(0,s.indexOf('.')+2)}"
                    />
                </div>
            </div>
            <div class="qtyAmt" style="border-bottom:1px solid #EAEAEA;">{{Currency}} {{totOrderAmt}}</div>
            <div class="priceListBox" style="border-bottom:0;border-top:1px solid #EAEAEA;margin-top: 2px;">
                <div class="priceList ellipsis">
                    <!-- 已收金额: -->
                    <span>{{$t('mxpcweb.sale.components.1557564963336')}}</span>
                    {{Currency}} {{actualAmt}}
                </div>
                <div class="priceList ellipsis" v-if="unpayAmt && unpayAmt != 0">
                    <!-- 未收金额: -->
                    <span>{{$t('mxpcweb.sale.components.1557564963537')}}</span>
                    {{Currency}} {{unpayAmt}}
                </div>
            </div>
        </div>
        <div class="shadow"></div>
    </div>
</div>
</template>
<script>
export default {
    name: 'TotalPrice',
    props: {
        totProdAmt: {
            type: Number,
            default: 0
        },
        qtyAmt: {
            type: Number,
            default: 0
        },
        totAddFee: {
            type: Number,
            default: 0
        },
        totDeductFee: {
            type: Number,
            default: 0
        },
        Currency: {
            type: String,
            default: ''
        },
        actualAmt: {
            type: Number,
            default: 0
        },
        unpayAmt: {
            type: Number,
            default: 0
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
            totOrderAmt: 0,
            adjustAmt: 0
        }
    },
    created() {
    },
    computed: {
    },
    methods: {
        updata() {
            this.adjustAmt = this.itemData.adjustAmt || 0
            this.totOrderAmt = this.itemData.totOrderAmt || 0
        },
        clearData() {
            this.adjustAmt = 0
            this.totOrderAmt = 0
        },
        submit() {
            let data = {}
            if (this.totProdAmt != this.itemData.totProdAmt) {
                data.totProdAmt = this.totProdAmt
            }
            if (this.totAddFee != this.itemData.totAddFee) {
                data.totAddFee = this.totAddFee
            }
            if (this.totDeductFee != this.itemData.totDeductFee) {
                data.totDeductFee = this.totDeductFee
            }
            if (this.adjustAmt != this.itemData.adjustAmt) {
                data.adjustAmt = this.adjustAmt
            }
            if (this.totOrderAmt != this.itemData.totOrderAmt) {
                data.totOrderAmt = this.totOrderAmt
            }
            if (this.qtyAmt != this.itemData.qtyAmt) {
                data.qtyAmt = this.qtyAmt
            }
            if (this.actualAmt != this.itemData.actualAmt) {
                data.actualAmt = this.actualAmt
            }
            if (this.unpayAmt != this.itemData.unpayAmt) {
                data.unpayAmt = this.unpayAmt
            }
            return data
        },
        totOrderAmtComputed() {
            let totOrderAmt = (
                (parseFloat(this.totProdAmt) || 0) +
                (parseFloat(this.totAddFee) || 0) -
                (parseFloat(this.totDeductFee) || 0) +
                (parseFloat(this.adjustAmt) || 0)
            )
            this.totOrderAmt = parseFloat(totOrderAmt.toFixed(2)) || 0
        }
    },
    watch: {
        adjustAmt() {
            this.totOrderAmtComputed()
        },
        totAddFee () {
            this.totOrderAmtComputed()
        },
        totDeductFee () {
            this.totOrderAmtComputed()
        },
        totProdAmt () {
            this.totOrderAmtComputed()
        }
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
