<template>
    <div class="LittleAssistant">
        <div class="title">
            <!-- 销售助手 -->
            {{$t('mxpcweb.sale.components.1557565300665')}}
            <i class="iconfont icon-close-bold text-hover" @click="$emit('showAssistant', false)"></i>
        </div>
        <div v-if="goodsItem.spuId">
            <div class="tabsBox">
                <!-- 商品价格 -->
                <div class="tabsItem text-hover" :class="activeName == '1' ? 'tabsItemActive' : ''" @click="activeName = '1'">{{$t('mxpcweb.sale.components.1557565415928')}}</div>
                <!-- 历史报价 -->
                <div class="tabsItem text-hover" :class="activeName == '2' ? 'tabsItemActive' : ''" @click="activeName = '2'">{{$t('mxpcweb.sale.components.1557565417999')}}</div>
                <!-- 历史订单 -->
                <div class="tabsItem text-hover" :class="activeName == '3' ? 'tabsItemActive' : ''" @click="activeName = '3'">{{$t('mxpcweb.sale.components.1557565418182')}}</div>
            </div>
            <div class="contentBox">
                <goods-vue :lastQuotation="lastQuotation" :lastOrder="lastOrder" v-show="activeName == '1'" :goodsItem="goodsItem"></goods-vue>
                <historical-quotation :custId="custId" :lastQuotation="lastQuotation" :maxQuotation="maxQuotation" :minQuotation="minQuotation" v-show="activeName == '2'" :goodsItem="goodsItem"></historical-quotation>
                <historical-contract :lastQuotation="lastOrder" :maxQuotation="maxOrder" :minQuotation="minOrder" v-show="activeName == '3'" :goodsItem="goodsItem"></historical-contract>
            </div>
        </div>
        <div v-else>
            <no-data></no-data>
        </div>
    </div>
</template>
<script>
import NoData from '@/basecomponents/NoData/index'
import GoodsVue from './Vue/GoodsVue.vue'
import HistoricalContract from './Vue/HistoricalContract.vue'
import HistoricalQuotation from './Vue/HistoricalQuotation.vue'
export default {
    name: 'LittleAssistant',
    props: {
        goodsItem: {
            type: Object,
            default: () => {
                return {}
            }
        },
        moduleCode: {
            type: String,
            default: ''
        },
        custId: {
            type: [String, Number],
            default: ''
        }
    },
    data() {
        return {
            maxQuotation: {},
            minQuotation: {},
            lastQuotation: {},
            maxOrder: {},
            minOrder: {},
            lastOrder: {},
            activeName: '1'
        }
    },
    created() {
    },
    mounted() {
        this.getHelper()
    },
    computed: {
    },
    methods: {
        getHelper() {
            if (!this.goodsItem.spuId) {
                return
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v2.document_quotation_get, { params: {
                moduleCode: 'SC001',
                searchType: 'helper',
                strucId: '2',
                spuId: this.goodsItem.spuId
            } }).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.maxQuotation = res.body.data.maxQuotation[0] || {}
                    this.minQuotation = res.body.data.minQuotation[0] || {}
                    this.lastQuotation = res.body.data.lastQuotation[0] || {}
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
            this.$http.get(this.Global.baseURL + this.Global.api.v2.document_quotation_get, { params: {
                moduleCode: 'SC002',
                searchType: 'helper',
                strucId: '2',
                spuId: this.goodsItem.spuId
            } }).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.maxOrder = res.body.data.maxQuotation[0] || {}
                    this.minOrder = res.body.data.minQuotation[0] || {}
                    this.lastOrder = res.body.data.lastQuotation[0] || {}
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        }
    },
    watch: {
        goodsItem(val) {
            this.maxQuotation = {}
            this.minQuotation = {}
            this.lastQuotation = {}
            this.maxOrder = {}
            this.minOrder = {}
            this.lastOrder = {}
            this.getHelper()
        }
    },
    components: {
        'goods-vue': GoodsVue,
        'historical-quotation': HistoricalQuotation,
        'historical-contract': HistoricalContract,
        'no-data': NoData
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
