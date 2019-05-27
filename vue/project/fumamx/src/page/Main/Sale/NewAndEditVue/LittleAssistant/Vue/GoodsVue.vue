<template>
<div class="GoodsVue">
    <div class="goodsName ellipsis">{{goodsItem.spuName || '-'}}</div>
    <div class="displayDesc ellipsis">
        <span>{{tradeModeShow}}</span>
        <span v-if="goodsItem.port && goodsItem.port != ''">
            <port-show :list="goodsItem" :value="{value: goodsItem.port}"></port-show>
        </span>
    </div>
    <div class="tradeMode ellipsis">
        <span v-if="checkSaleCur == ''">
            <span v-if="minSaleCur == maxSaleCur">
                {{saleCurSymbol}}{{minSaleCur}}
            </span>
            <span v-else>
                {{saleCurSymbol}}{{minSaleCur}}~{{saleCurSymbol}}{{maxSaleCur}}
            </span>
        </span>
        <span v-else>
            {{saleCurSymbol}}{{checkSaleCur}}
        </span>
        <span class="unit" v-if="unitShow != ''">/{{unitShow}}</span>
        <span class="describe" v-if="goodsItem.strucId_4 && goodsItem.strucId_4.length > 0">
            {{goodsItem.strucId_4[0].quantity}}
            <!-- 起订 -->
            {{unitShow}}{{$t('mxpcweb.sale.components.1557565375208')}}
        </span>
    </div>
    <div class="payMode ellipsis" v-if="goodsItem.payMode && goodsItem.payMode != ''">
        <span class="payItem">
            <img v-for="(item, index) in goodsItem.payMode.split(',')" :key="index" :src="'/static/images/goods/PayType/' + (sysBoxValueShow['29'].dictItem[item] ? sysBoxValueShow['29'].dictItem[item].itemValue || '' : '')" alt="">
        </span>
    </div>
    <div class="priceBox" v-if="goodsItem.quotationMethod == '1' && goodsItem.strucId_4 && goodsItem.strucId_4.length > 0">
        <table border="0" width="328">
            <tr class="price">
                <!-- 价格 -->
                <td class="title"><p>{{$t('mxpcweb.sale.components.1557565182480')}}</p></td>
                <td v-for="(item, index) in goodsItem.strucId_4" :key="index"><p>{{saleCurSymbol}}{{item.salePrice}}</p></td>
            </tr>
            <tr class="number">
                <!-- 起订量 -->
                <td class="title"><p>{{$t('mxpcweb.sale.components.1557565375430')}}</p></td>
                <td v-for="(item, index) in goodsItem.strucId_4" :key="index"><p>{{item.quantity}}{{unitShow}}</p></td>
            </tr>
        </table>
    </div>
    <div class="priceBox1" v-if="goodsItem.quotationMethod == '2' && ((goodsItem.spec1List && goodsItem.spec1List.length) || (goodsItem.spec2 && goodsItem.spec2List.length))">
        <div class="colorBox" v-if="goodsItem.spec1List && goodsItem.spec1List.length > 0">
            <!-- 颜色 -->
            <span class="title">{{$t('mxpcweb.sale.components.1557565375632')}}</span>
            <div class="imgBox text-hover"
            :class="spec1Check == item.dictItemCode ? 'colorCheck' : ''"
            v-for="(item, index) in goodsItem.spec1List"
            :key="index" :title="item.remarks"
            :style="'background:#' + item.dictItemCode"
            @click="spec1Check = (spec1Check == item.dictItemCode ? '' : item.dictItemCode)">
                <img v-if="item.imagesId && item.imagesId != ''" :src="checkPic(item.imagesId)" alt="">
            </div>
        </div>
        <div class="sizeBox" v-if="goodsItem.spec2List && goodsItem.spec2List.length > 0">
            <!-- 尺码 -->
            <span class="title">{{$t('mxpcweb.sale.components.1557565149127')}}</span>
            <div class="size text-hover"
            :class="spec2Check == item.dictItemCode ? 'sizeCheck' : ''"
            v-for="(item, index) in goodsItem.spec2List" :key="index"
            :title="item.remarks"
            @click="spec2Check = (spec2Check == item.dictItemCode ? '' : item.dictItemCode)">
                {{item.itemName}}
            </div>
        </div>
    </div>
    <div class="unitPrice">
        <!-- 采购单价： -->
        <span class="floatLeft">{{$t('mxpcweb.sale.components.1557565391877')}}</span>
        <span class="floatRight">{{purCurSymbol}}{{goodsItem.purPrice}}{{ unitShow != '' ? '/' + unitShow : ''}}</span>
    </div>
    <div class="recent">
        <div class="quotationBox">
            <!-- 最近报价 -->
            <div class="title">{{$t('mxpcweb.sale.components.1557565392060')}}</div>
            <div class="price">{{returnCurrency(lastQuotation.strucId_1)}}{{lastQuotation.quotedPrice || '-.-'}}</div>
            <div class="date">({{lastQuotation.strucId_1 && lastQuotation.strucId_1.quotaDate ? lastQuotation.strucId_1.quotaDate.slice(0, 10) : '----/--/--'}})</div>
        </div>
        <div class="dealBox">
            <!-- 最近成交价 -->
            <div class="title">{{$t('mxpcweb.sale.components.1557565392272')}}</div>
            <div class="price">{{returnCurrency(lastOrder.strucId_1)}}{{lastOrder.salePrice || '-.-'}}</div>
            <div class="date">({{lastOrder.strucId_1 && lastOrder.strucId_1.orderDate ? lastOrder.strucId_1.orderDate.slice(0, 10) : '----/--/--'}})</div>
        </div>
    </div>
    <div class="calculator">
        <!-- 价格计算器 -->
        {{$t('mxpcweb.sale.components.1557565392481')}}
    </div>
</div>
</template>
<script>
import { mapGetters } from 'vuex'
import portShow from '@/components/ListShowControls/Port/index'
export default {
    name: 'GoodsVue',
    props: {
        goodsItem: {
            type: Object,
            default: () => {
                return {}
            }
        },
        lastOrder: {
            type: Object,
            default: () => {
                return {}
            }
        },
        lastQuotation: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            tradeModeShow: '',
            purCurSymbol: '',
            saleCurSymbol: '',
            unitShow: '',

            minSaleCur: 0.00,
            maxSaleCur: 0.00,
            checkSaleCur: '',
            spec1Check: '',
            spec2Check: ''
        }
    },
    created() {
    },
    computed: {
        ...mapGetters([
            'sysBoxValueShow'
        ]),
        ...mapGetters('goods', [
            'unitListShow',
            'currencyShow'
        ])
    },
    methods: {
        returnCurrency(val) {
            if (val && val.cur) {
                return this.currencyShow[val.cur] ? this.currencyShow[val.cur].symbol || '' : ''
            }
            return ''
        },
        checkPic(imgId) {
            return this.getGlobalImgSrc(imgId, '40x40')
        },
        computSale() {
            this.checkSaleCur = ''
            if (this.spec1Check != '' && this.spec2Check != '') {
                this.goodsItem.strucId_2.forEach(item => {
                    if (item.spec1 == this.spec1Check && item.spec2 == this.spec2Check) {
                        this.checkSaleCur = item.salePrice
                    }
                })
            } else {
                this.checkSaleCur = this.goodsItem.salePrice
            }
        }
    },
    components: {
        'port-show': portShow
    },
    watch: {
        goodsItem(val) {
            this.tradeModeShow = this.sysBoxValueShow['28'].dictItem[val.tradeMode] ? this.sysBoxValueShow['28'].dictItem[val.tradeMode].itemName || '' : ''
            this.purCurSymbol = this.currencyShow[val.purCur] ? this.currencyShow[val.purCur].symbol || '' : ''
            this.saleCurSymbol = this.currencyShow[val.saleCur] ? this.currencyShow[val.saleCur].symbol || '' : ''
            this.unitShow = this.unitListShow[val.unit] ? this.unitListShow[val.unit].name || '' : ''
            this.minSaleCur = 0.00
            this.maxSaleCur = 0.00
            this.checkSaleCur = ''
            this.spec1Check = ''
            this.spec2Check = ''

            if (val.quotationMethod == '1') {
                if (val.strucId_4 && val.strucId_4.length > 0) {
                    val.strucId_4.forEach(element => {
                        if (element.salePrice) {
                            let num = parseFloat(element.salePrice) || 0
                            if (num < this.minSaleCur) {
                                this.minSaleCur = num
                            }
                            if (num > this.maxSaleCur) {
                                this.maxSaleCur = num
                            }
                        }
                    })
                }
            } else if (val.quotationMethod == '2') {
                if (val.strucId_2 && val.strucId_2.length > 0) {
                    val.strucId_2.forEach(element => {
                        if (element.salePrice) {
                            let num = parseFloat(element.salePrice) || 0
                            if (num < this.minSaleCur) {
                                this.minSaleCur = num
                            }
                            if (num > this.maxSaleCur) {
                                this.maxSaleCur = num
                            }
                        }
                    })
                }
            } else {
                this.checkSaleCur = val.salePrice
            }
        },
        spec1Check() {
            this.computSale()
        },
        spec2Check() {
            this.computSale()
        }
    }
}
</script>
<style lang="less" scoped>
.GoodsVue{
    font-size: 14px;
    .goodsName{
        color: #222222;
        height:20px;
        font-weight:600;
    }
    .displayDesc{
        margin-top: 5px;
        height:20px;
        font-weight:400;
        color: #303133;
    }
    .tradeMode{
        margin-top: 5px;
        height:33px;
        font-size:24px;
        color: #D0021B;
        position: relative;
        font-weight: 500;
        .unit{
            font-size: 14px;
            font-weight: 400;
        }
        .describe{
            font-weight: 400;
            font-size: 14px;
            color: #303133;
            position: absolute;
            right: 0;
            top: 6px;
        }
    }
    .payMode{
        .payItem{
            display: inline-block;
            margin-right: 6px;
            img{
                height: 16px;
            }
        }
    }
    .priceBox{
        min-height: 72px;
        background: #FCF2F3;
        padding: 4px 10px;
        margin-top: 12px;
        .price{
            color: #D0021B;
            font-weight: 500;
            font-size: 16px;
        }
        .number{
            color: #909399;
        }
        tr{
            td{
                min-height: 32px;
                min-width: 84px;
                word-break: break-all;
                p{
                    min-height: 32px;
                    padding-top: 10px;
                    line-height: 18px;
                }
            }
            .title{
                color: #222222;
                font-weight: 500;
                min-width: 66px;
            }
        }
    }
    .priceBox1{
        margin-top: 16px;
        border-top: 1px solid #EAEAEA;
        padding-top: 16px;
        >div{
            position: relative;
            padding-left: 76px;
            .title{
                position: absolute;
                left: 0;
            }
        }
        .colorBox{
            min-height: 40px;
            line-height: 40px;
            .imgBox{
                display: inline-block;
                height: 40px;
                width: 40px;
                margin-bottom: 5px;
                margin-right: 5px;
                border:1px solid white;
                img{
                    width:40px;
                    height:40px;
                }
            }
            .colorCheck{
                border-color: #D0021B;
            }
        }
        .sizeBox{
            margin-top: 10px;
            min-height: 32px;
            line-height: 32px;
            .size{
                display: inline-block;
                padding: 0 14px;
                background:rgba(255,255,255,1);
                border:1px solid rgba(234,237,239,1);
                margin-bottom: 5px;
                margin-right: 5px;
            }
            .sizeCheck{
                border-color: #D0021B;
                color: #D0021B;
            }
        }
    }
    .unitPrice{
        height: 52px;
        line-height: 52px;
        border-top: 1px solid #EAEAEA;
        border-bottom: 1px solid #EAEAEA;
        color: #222222;
        margin-top: 16px;
        .floatLeft{
            float: left;
        }
        .floatRight{
            float: right;
        }
    }
    .recent{
        height: 110px;
        padding: 20px 44px;
        >div{
            width: 120px;
            text-align: center;
            display: inline-block;
            .title{
                height: 30px;
            }
            .price{
                font-size:16px;
                color: #303133;
                font-weight: 600;
                height: 22px;
            }
            .date{
                color: #606266;
                font-size: 12px;
            }
        }
        .quotationBox{
            float: left;
        }
        .dealBox{
            float: right;
        }
    }
    .calculator{
        height:40px;
        line-height: 40px;
        background:rgba(192,196,204,1);
        border-radius:2px;
        color: white;
        text-align: center;
    }
}
</style>
