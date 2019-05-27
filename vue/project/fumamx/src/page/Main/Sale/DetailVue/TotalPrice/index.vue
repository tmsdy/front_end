<template>
<div class="TotalPriceBox">
    <div class="TotalPrice">
        <div class="totalPriceTit"></div>
        <div class="totalPriceContent">
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
                    {{Currency}} {{adjustAmt}}
                </div>
            </div>
            <div class="qtyAmt">{{Currency}} {{totQuotaAmt}}</div>
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
        itemData: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            totQuotaAmt: 0,
            adjustAmt: 0
        }
    },
    created() {
    },
    computed: {
    },
    methods: {
        updata() {
            this.adjustAmt = this.itemData.adjustAmt
            this.totQuotaAmt = this.itemData.totQuotaAmt
        },
        totQuotaAmtComputed() {
            let totQuotaAmt = (
                (parseFloat(this.totProdAmt) || 0) +
                (parseFloat(this.totAddFee) || 0) -
                (parseFloat(this.totDeductFee) || 0) +
                (parseFloat(this.adjustAmt) || 0)
            )
            this.totQuotaAmt = parseFloat(totQuotaAmt.toFixed(2)) || 0
        }
    },
    watch: {
        adjustAmt() {
            this.totQuotaAmtComputed()
        },
        totAddFee () {
            this.totQuotaAmtComputed()
        },
        totDeductFee () {
            this.totQuotaAmtComputed()
        },
        totProdAmt () {
            this.totQuotaAmtComputed()
        }
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
