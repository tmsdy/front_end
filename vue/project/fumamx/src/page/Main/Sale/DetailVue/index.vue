<template>
<div class="Detail MXscroll" v-loading="loading">
    <template v-if="!loading">
        <p class="contactTitle">
            <!-- 报价单 -->
            {{$t('mxpcweb.sale.components.1557565540790')}}
            <span class="ownerCtId">
                <i class="iconfont icon-personnel"></i>
                {{contactList[itemData.ownerCtId]}}
            </span>
            <span class="ownerDeptKey">
                <i class="iconfont icon-home"></i>
                {{departmentList[itemData.ownerDeptKey]}}
            </span>
            <detail-opt class="rightOpt" fontSize="24px" :detailOptData="detailOptData" :itemData="itemData" @getListData="getData()" :moduleStructName="moduleStruct.titleField" :moduleStructId="moduleStruct.identField" :moduleCode='moduleCode'></detail-opt>
        </p>
        <div class="DetailBox">
            <base-msg :editSet="baseEditSet" :tagsList="tagsList" :itemId="itemId" :moduleCode="moduleCode" :items="itemData" :moduleStruct="moduleStruct" @getData="getItemDataUp"></base-msg>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <!-- 商品清单 -->
                <el-tab-pane :label="$t('mxpcweb.sale.components.1557565108383')" name="1">
                </el-tab-pane>
                <!-- 附件 -->
                <el-tab-pane :label="$t('mxpcweb.sale.components.1557565108595')" name="2">
                </el-tab-pane>
                <!-- 提醒 -->
                <el-tab-pane :label="$t('mxpcweb.sale.components.1557565147337')" name="3">
                </el-tab-pane>
                <!-- <el-tab-pane label="相关订单" name="4">
                    相关订单
                </el-tab-pane> -->
                <!-- <el-tab-pane label="相关邮件" name="5">
                    <mail-contact :moduleCode="moduleCode" itemActive="5" :itemId="itemId" :itemData="itemData" @tellFather="getData()"></mail-contact>
                </el-tab-pane> -->
                <!-- 操作记录 -->
                <el-tab-pane :label="$t('mxpcweb.sale.components.1557565147533')" name="6">
                </el-tab-pane>
            </el-tabs>
            <div class="tabsBox">
                <goods-msg v-show="activeName == '1'" :itemData="itemData" itemActive="1" ref="GoodsMsg" @showAssistant="showAssistant" @goodsItemChange="goodsItemChange" :goodsEditSet="goodsEditSet" :totProdAmt.sync="totProdAmt" :qtyAmt.sync="qtyAmt" :classTypeInUseList="classTypeInUseList"></goods-msg>
                <attachment v-show="activeName == '2'" ref="activeName2"  itemActive="2" :activeName="activeName" :moduleCode="moduleCode" :itemId="itemId" :itemData="itemData" @tellFather="getItemDataUp()"></attachment>
                <remind v-show="activeName == '3'" ref="activeName3" itemActive="3" :activeName="activeName" :moduleCode="moduleCode" :itemId="itemId" :itemData="itemData" @tellFather="getItemDataUp()"></remind>
                <mail-contact v-show="activeName == '5'" :moduleCode="moduleCode" itemActive="5" :itemId="itemId" :itemData="itemData" @tellFather="getData()"></mail-contact>
                <operation-record v-show="activeName == '6'" :activeName="activeName" itemActive="6" :moduleCode="moduleCode" :itemId="itemId" :itemData="itemData" @tellFather="getItemDataUp()"></operation-record>
            </div>
            <total-price class="totalPrice" :Currency="Currency" :itemData="itemData" ref="TotalPrice" :moneyEditSet="moneyEditSet" :qtyAmt="qtyAmt" :totDeductFee="totDeductFee" :totAddFee="totAddFee" :totProdAmt="totProdAmt"></total-price>
        </div>
    </template>
</div>
</template>
<script>
import BaseMsg from './BaseMsg/index.vue'
import GoodsMsg from './GoodsMsg/index.vue'
import Attachment from './Attachment/index.vue'
import Remind from './Remind/index.vue'
import MailContact from './MailContact/index.vue'
import OperationRecord from './OperationRecord/index.vue'

import TotalPrice from './TotalPrice/index.vue'
import { mapGetters, mapMutations } from 'vuex'
import { getDetailConfig } from '@/page/Main/Client/mixins/index.js'
// 以下右上角操作项
import detailOpt from '@/page/Main/Client/Layout/standard/ClientManagIndex/detailOpt/index'
export default {
    name: 'Detail',
    props: {
    },
    data() {
        return {
            activeName: '1',
            totAddFee: 0,
            totDeductFee: 0,
            totProdAmt: 0,
            qtyAmt: 0,
            Currency: '',
            loading: true,
            moduleCode: '',
            baseEditSet: [],
            moneyEditSet: [],
            goodsEditSet: {},
            filesEditSet: {},
            goodsItem: {},
            classTypeInUseList: [],
            assistantShow: false,

            moduleStruct: {},
            itemId: '',
            itemData: {},
            tagsList: []
        }
    },
    created() {
        let { moduleCode, id } = this.$route.params
        this.path = this.$route.path
        this.moduleCode = moduleCode
        this.itemId = id
        this.getData()
    },
    computed: {
        ...mapGetters([
            'contactList',
            'departmentList'
        ]),
        ...mapGetters('goods', [
            'currencyShow'
        ]),
        ...mapGetters('client', [
            'detailConfig'
        ])
    },
    methods: {
        // 同步设置
        ...mapMutations('client', {
            set_detailConfig: 'SET_DETAILCONFIG'
        }),
        getDetailConfig,
        handleClick() {},
        getData() {
            let p0 = new Promise((resolve) => {
                this.getItemData(resolve)
            })
            let p1 = new Promise((resolve) => {
                this.getConfig(resolve)
            })
            let p2 = new Promise((resolve) => {
                this.getClassType(resolve)
            })
            let p3 = new Promise((resolve) => {
                this.labelList(resolve)
            })
            Promise.all([p0, p1, p2, p3]).then((results) => {
                this.itemData = results[0]
                if (JSON.stringify(this.itemData) == '{}') {
                    this.$emit('removeTab')
                    return
                }
                this.detailOptData = results[1].moduleOptSet ? results[1].moduleOptSet.detailOpt : []
                this.moduleStruct = results[1].moduleStruct
                this.swidchEditSet(results[1].viewSet || [])
                this.loading = false
                this.classTypeInUseList = results[2]
                this.tagsList = results[3]
                this.$nextTick(() => {
                    this.updata()
                })
            })
        },
        updata() {
            this.totAddFee = parseFloat(this.itemData.totAddFee) || 0
            this.totDeductFee = parseFloat(this.itemData.totDeductFee) || 0
            this.totProdAmt = parseFloat(this.itemData.totProdAmt) || 0
            this.Currency = this.returnCurrency(this.itemData.cur)

            this.$refs.GoodsMsg.updata()
            // this.$refs.OtherMsg.updata()
            this.$refs.TotalPrice.updata()
        },
        returnCurrency(cur) {
            if (cur && cur != '') {
                return this.currencyShow[cur] ? this.currencyShow[cur].symbol : ''
            }
            return ''
        },
        getClassType(resolve) {
            this.$http.get(this.Global.baseURL + this.Global.api.v2.document_product_category, { params: {type: 'inUse'} }).then((res) => {
                this.loadingMenu = false
                if (res.body.code.toString() == this.Global.RES_OK) {
                    resolve(res.body.data.list)
                } else {
                    resolve([])
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                resolve([])
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        labelList(resolve) {
            this.$http.get(this.Global.baseURL + this.Global.api.v2.label_get, { params: {
                moduleCode: this.moduleCode,
                searchType: 'list'
            } }).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    resolve(res.body.data || [])
                } else {
                    resolve([])
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                resolve([])
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        getItemData(resolve) {
            this.$http.get(this.Global.baseURL + this.Global.api.v2.document_quotation_get, { params: {
                moduleCode: this.moduleCode,
                searchType: 'detail',
                strucId: '1',
                identFieldValue: this.itemId
            } }).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    resolve(res.body.data || {})
                } else {
                    resolve({})
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                resolve({})
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        getItemDataUp() {
            this.$http.get(this.Global.baseURL + this.Global.api.v2.document_quotation_get, { params: {
                moduleCode: this.moduleCode,
                searchType: 'detail',
                strucId: '1',
                identFieldValue: this.itemId
            } }).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.itemData = res.body.data
                    this.$nextTick(() => {
                        this.updata()
                    })
                } else {
                    this.itemData = {}
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                this.itemData = {}
                this.$message.error(this.$t(this.Global.errorTitle))
            })
            if (this.activeName == '2') {
                this.$refs.activeName2.getTabData()
            }
            if (this.activeName == '3') {
                this.$refs.activeName3.getTabData()
            }
        },
        showAssistant(type, data) {
            this.assistantShow = type
            this.goodsItem = data
        },
        goodsItemChange(data) {
            this.goodsItem = data
        },
        swidchEditSet(list) {
            let newLList = []
            list.forEach((element) => {
                newLList.push(element)
            })
            let filedIndex = ''
            newLList.forEach((items, index) => {
                if (items.fieldId && items.fieldId == 1223) {
                    filedIndex = index
                }
            })
            let baseEditSet = []
            this.moneyEditSet = []
            if (filedIndex == '') {
                baseEditSet = newLList
            } else {
                baseEditSet = newLList.slice(0, filedIndex)
                this.moneyEditSet = newLList.slice(filedIndex, newLList.length - 1)
            }
            this.baseEditSet = []
            this.goodsEditSet = {}
            this.filesEditSet = {}
            baseEditSet.forEach(items => {
                if (items.fieldName == 'category') {
                    this.goodsEditSet.category = items
                } else if (items.fieldName == 'showPicFlag') {
                    this.goodsEditSet.showPicFlag = items
                } else if (items.fieldName == 'attachmentFile') {
                    this.filesEditSet.attachmentFile = items
                } else {
                    this.baseEditSet.push(items)
                }
            })
        },
        getConfig(resolve) { // 获取数据
            let { viewLayout, moduleCode } = this.getRoute()
            this.viewLayout = viewLayout
            this.viewType = 'detail'
            this.moduleCode = moduleCode
            this.getDetailConfig({
                moduleCode: this.moduleCode,
                viewType: this.viewType,
                viewLayout: this.viewLayout
            }, (data) => {
                resolve(data)
            }, () => {
                this.$emit('removeTab')
            })
        }
    },
    components: {
        'detail-opt': detailOpt,
        'base-msg': BaseMsg,
        'goods-msg': GoodsMsg,
        'total-price': TotalPrice,
        'attachment': Attachment,
        'remind': Remind,
        'mail-contact': MailContact,
        'operation-record': OperationRecord
    },
    watch: {
        $route(val, old) {
            if (val.path == this.path) {
                this.getItemDataUp()
            }
        }
    }
}
</script>
<style lang="less" scoped>
.Detail{
    width: 100%;
    height: 100%;
    position: relative;
    background:white;
    overflow: auto;
    .contactTitle{
        height: 40px;
        line-height: 40px;
        padding-left:16px;
        margin-bottom: 10px;
        color: black;
        font-weight: bold;
        background: #FAFAFA;
        position: relative;
        .ownerCtId, .ownerDeptKey{
            font-size:14px;
            font-weight:400;
            color:rgba(96,98,102,1);
            margin-left: 15px;
        }
        .rightOpt{
            width: 300px;
            position: absolute;
            right: 10px;
            top: 0;
            font-weight: normal;
        }
    }
    .DetailBox{
        // position: absolute;
        // top: 40px;
        // left: 0;
        // right: 0;
        // bottom: 0;
        // overflow: auto;
    }
    .totalPrice{
        position: absolute;
        top: 40px;
        right: 0px;
    }
}
</style>
