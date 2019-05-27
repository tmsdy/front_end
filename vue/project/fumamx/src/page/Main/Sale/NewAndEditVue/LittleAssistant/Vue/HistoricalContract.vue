<template>
<div class="HistoricalQuotation">
    <div class="recent">
        <div class="newBox">
            <!-- 最新价格 -->
            <div class="title">{{$t('mxpcweb.sale.components.1557565392669')}}</div>
            <div class="price">{{returnCurrency(lastQuotation.strucId_1)}}{{lastQuotation.salePrice || '-.-'}}</div>
            <div class="date">({{lastQuotation.strucId_1 && lastQuotation.strucId_1.orderDate ? lastQuotation.strucId_1.orderDate.slice(0, 10) : '----/--/--'}})</div>
        </div>
        <div class="maxBox">
            <!-- 最高报价 -->
            <div class="title">{{$t('mxpcweb.sale.components.1557565407706')}}</div>
            <div class="price">{{returnCurrency(maxQuotation.strucId_1)}}{{maxQuotation.salePrice || '-.-'}}</div>
            <div class="date">({{maxQuotation.strucId_1 && maxQuotation.strucId_1.orderDate ? maxQuotation.strucId_1.orderDate.slice(0, 10) : '----/--/--'}})</div>
        </div>
        <div class="minBox">
            <!-- 最低报价 -->
            <div class="title">{{$t('mxpcweb.sale.components.1557565407892')}}</div>
            <div class="price">{{returnCurrency(minQuotation.strucId_1)}}{{minQuotation.salePrice || '-.-'}}</div>
            <div class="date">({{minQuotation.strucId_1 && minQuotation.strucId_1.orderDate ? minQuotation.strucId_1.orderDate.slice(0, 10) : '----/--/--'}})</div>
        </div>
    </div>
    <div class="searchBox">
        <div class="time">
            <!-- 近30天 -->
            <div class="leftLabel" :class="checkLabelTime == '1' ? 'checkLabel' : 'text-hover'" @click="checkLabelTime = '1';getHistory()">{{$t('mxpcweb.sale.components.1557565186864')}}</div>
            <!-- 近60天 -->
            <div class="label" :class="checkLabelTime == '2' ? 'checkLabel' : 'text-hover'" @click="checkLabelTime = '2';getHistory()">{{$t('mxpcweb.sale.components.1557565187106')}}</div>
            <!-- 近90天 -->
            <div class="rightLabel" :class="checkLabelTime == '3' ? 'checkLabel' : 'text-hover'" @click="checkLabelTime = '3';getHistory()">{{$t('mxpcweb.sale.components.1557565264420')}}</div>
        </div>
        <div class="cust">
            <!-- 当前客户 -->
            <div class="leftLabel" :class="checkLabelCust == '1' ? 'checkLabel' : 'text-hover'" @click="checkLabelCust = '1';getHistory()">{{$t('mxpcweb.sale.components.1557565408118')}}</div>
            <!-- 全部客户 -->
            <div class="rightLabel" :class="checkLabelCust == '2' ? 'checkLabel' : 'text-hover'" @click="checkLabelCust = '2';getHistory()">{{$t('mxpcweb.sale.components.1557565408306')}}</div>
        </div>
    </div>
    <div class="listBox">
        <div class="title">
            <el-row>
                <el-col :span="9">
                    <!-- 订单编号 -->
                    <div>{{$t('mxpcweb.sale.components.1557565408504')}}</div>
                </el-col>
                <el-col :span="9">
                    <!-- 下单日期 -->
                    <div>{{$t('mxpcweb.sale.components.1557565408745')}}</div>
                </el-col>
                <el-col :span="6">
                    <!-- 单价/数量 -->
                    <div>{{$t('mxpcweb.sale.components.1557565415549')}}</div>
                </el-col>
            </el-row>
        </div>
        <template v-if="list.length > 0">
            <template v-for="(item, index) in list">
                <div class="list" :key="index" v-if="item.strucId_1">
                    <el-row>
                        <el-col :span="9">
                            <div v-if="item.strucId_1.orderCode" class="code text-hover" @click="toDetail(item)">{{item.strucId_1.orderCode}}</div>
                            <div v-else class="code">-</div>
                        </el-col>
                        <el-col :span="9">
                            <div>{{item.strucId_1.orderDate ? item.strucId_1.orderDate.slice(0, 10) : '&nbsp;'}}</div>
                            <div>{{contactList[item.strucId_1.ownerCtId] || '&nbsp;'}}</div>
                        </el-col>
                        <el-col :span="6">
                            <div>{{returnCurrency(item.strucId_1) || ''}}{{item.salePrice || '&nbsp;'}}</div>
                            <div>{{item.saleQty || ''}}{{returnUnit(item.unit) || '&nbsp;'}}</div>
                        </el-col>
                    </el-row>
                </div>
            </template>
            <div class="pageSizeBox">
                <el-pagination
                :current-page.sync="currentPage"
                :page-size="10"
                @current-change="getHistory"
                layout="total, prev, pager, next"
                :total="total">
                </el-pagination>
            </div>
        </template>
        <div v-else>
            <no-data></no-data>
        </div>
    </div>
</div>
</template>
<script>
import { mapGetters } from 'vuex'
import NoData from '@/basecomponents/NoData/index'
export default {
    name: 'HistoricalQuotation',
    props: {
        goodsItem: {
            type: Object,
            default: () => {
                return {}
            }
        },
        maxQuotation: {
            type: Object,
            default: () => {
                return {}
            }
        },
        minQuotation: {
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
        },
        custId: {
            type: [String, Number],
            default: ''
        }
    },
    data() {
        return {
            list: [],
            checkLabelTime: '1',
            checkLabelCust: '2',
            lastSaleCurSymbol: '',
            currentPage: 1,
            total: 0
        }
    },
    created() {
    },
    mounted() {
        this.getHistory()
    },
    computed: {
        ...mapGetters('goods', [
            'unitListShow',
            'currencyShow'
        ]),
        ...mapGetters([
            'contactList'
        ])
    },
    methods: {
        toDetail(item) {
            if (item.strucId_1.quotaId) {
                this.$router.push('/main/sale/tabs/list/SC001/' + item.strucId_1.quotaId)
            }
        },
        returnCurrency(val) {
            if (val && val.cur) {
                return this.currencyShow[val.cur] ? this.currencyShow[val.cur].symbol || '' : ''
            }
            return ''
        },
        returnUnit(val) {
            if (val) {
                return this.unitListShow[val] ? this.unitListShow[val].name || '' : ''
            }
            return ''
        },
        getHistory() {
            if (!this.goodsItem.spuId) {
                return
            }
            let data = {
                moduleCode: 'SC002',
                searchType: 'history',
                strucId: '2',
                sort: 'orderDate',
                order: 'DESC',
                spuId: this.goodsItem.spuId,
                from: (this.currentPage - 1) * 10,
                size: 10
            }
            if (this.checkLabelTime == '1') {
                data.orderDate_gt = this.$m_unifiedTime(funDate(30))
            } else if (this.checkLabelTime == '2') {
                data.orderDate_gt = this.$m_unifiedTime(funDate(60))
            } else if (this.checkLabelTime == '3') {
                data.orderDate_gt = this.$m_unifiedTime(funDate(90))
            }
            if (this.checkLabelCust == '1') {
                if (this.custId == '') {
                    this.list = []
                    this.total = 0
                    return
                }
                data.custId = this.custId
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v2.document_quotation_get, { params: data }).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.list = res.body.data.list || []
                    this.total = res.body.data.totalNum || 0
                } else {
                    this.list = []
                    this.total = 0
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                this.list = []
                this.total = 0
                this.$message.error(this.$t(this.Global.errorTitle))
            })
            function funDate(aa) { // 获取多少天前后的日期
                let date1 = new Date()
                let date2 = new Date(date1)
                date2.setDate(date1.getDate() - aa)
                return date2
            }
        }
    },
    components: {
        'no-data': NoData
    },
    watch: {
        goodsItem(val) {
            this.getHistory()
        },
        custId() {
            if (this.checkLabelCust == '1') {
                this.getHistory()
            }
        }
    }
}
</script>
<style lang="less" scoped>
.HistoricalQuotation{
    .recent{
        border-bottom: 1px solid #EAEAEA;
        padding-bottom: 20px;
        >div{
            width: 110px;
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
    }
    .searchBox{
        height: 64px;
        line-height: 64px;
        .time{
            width: 200px;
            float: left;
            >div{
                width:59px;
            }
        }
        .cust{
            width: 140px;
            float: right;
            margin-right: -4px;
            >div{
                width:68px;
            }
        }
        .leftLabel{
            border-radius:3px 0px 0px 3px;
            border-top:1px solid rgba(234,234,234,1);
            border-left:1px solid rgba(234,234,234,1);
            border-bottom:1px solid rgba(234,234,234,1);
        }
        .label{
            margin-left: -4px;
            border-top:1px solid rgba(234,234,234,1);
            border-left:1px solid rgba(234,234,234,1);
            border-bottom:1px solid rgba(234,234,234,1);
        }
        .rightLabel{
            margin-left: -4px;
            border-radius:3px 0px 0px 3px;
            border:1px solid rgba(234,234,234,1);
        }
        .time, .cust{
            display: inline-block;
            >div{
                display: inline-block;
                line-height: 32px;
                color: #606266;
                height:32px;
                text-align: center;
                background: white;
            }
            .checkLabel{
                color: white;
                border-color: rgba(208,2,27,1);
                background: rgba(208,2,27,1);
            }
        }
    }
    .listBox{
        font-size: 12px;
        .title{
            padding-top: 6px;
            height:32px;
            background:#F7F8F9;
            color: #606266;
            padding-left: 10px;
        }
        .list{
            color: #222222;
            padding-top: 10px;
            height:54px;
            border-bottom: 1px solid #EAEAEA;
            padding-left: 10px;
            .code{
                color: #008CEE;
            }
        }
        .pageSizeBox{
            height: 40px;
            text-align: center;
            padding-top: 20px;
        }
    }
}
</style>
