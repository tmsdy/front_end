<template>
<div class="NewAndEditVueBox" :class="assistantShow ? 'NewAndEditVueBox1' : ''" :loading="loading">
    <div class="NewAndEditVue">
        <template v-if="!loading">
            <base-msg @themeChange="themeChange" @custChange="custChange" @CurrencyChange="CurrencyChange" :itemData="itemData" :editSet="baseEditSet" @scrollTop="scrollTop" ref="BaseMsg" :moduleCode="moduleCode"></base-msg>
            <goods-msg :Currency="Currency" :goodsLeftFields="goodsLeftFields" :goodsFields="goodsFields" :itemData="itemData" ref="GoodsMsg" @scrollTop="scrollTop" @showAssistant="showAssistant" @goodsItemChange="goodsItemChange" :goodsEditSet="goodsEditSet" :totProdAmt.sync="totProdAmt" :qtyAmt.sync="qtyAmt" :classTypeInUseList="classTypeInUseList"></goods-msg>
            <other-msg :Currency="Currency" :itemData="itemData" ref="OtherMsg" @scrollTop="scrollTop" :totAddFee.sync="totAddFee" :totDeductFee.sync="totDeductFee" :moneyEditSet="moneyEditSet" :totProdAmt="totProdAmt"></other-msg>
            <files-msg :itemData="itemData" ref="FilesMsg" @scrollTop="scrollTop" :filesEditSet="filesEditSet"></files-msg>
            <total-price :Currency="Currency" :itemData="itemData" ref="TotalPrice" :moneyEditSet="moneyEditSet" :qtyAmt="qtyAmt" :totDeductFee="totDeductFee" :totAddFee="totAddFee" :totProdAmt="totProdAmt"></total-price>
        </template>
    </div>
    <div class="LittleAssistant" v-if="assistantShow">
        <little-assistant :moduleCode="moduleCode" :custId="custId" @showAssistant="showAssistant" :goodsItem="goodsItem"></little-assistant>
    </div>
</div>
</template>
<script>
import BaseMsg from './BaseMsg/index.vue'
import OtherMsg from './OtherMsg/index.vue'
import GoodsMsg from './GoodsMsg/index.vue'
import FilesMsg from './FilesMsg/index.vue'
import TotalPrice from './TotalPrice/index.vue'
import LittleAssistant from './LittleAssistant/index.vue'
import { mapGetters, mapMutations } from 'vuex'
import { getAddEditSetList, getModifyEditSetList } from '@/page/Main/Client/mixins/index.js'
export default {
    name: 'NewAndEditVue',
    props: {
        optCode: {
            type: String,
            default: 'otNew'
        }
    },
    data() {
        return {
            totAddFee: 0,
            totDeductFee: 0,
            totProdAmt: 0,
            qtyAmt: 0,
            Currency: '',
            custId: '',
            loading: true,
            moduleCode: '',
            baseEditSet: [],
            moneyEditSet: [],
            goodsEditSet: {},
            filesEditSet: {},
            goodsItem: {},
            goodsFields: [],
            goodsLeftFields: [],
            classTypeInUseList: [],
            assistantShow: false,

            itemId: '',
            itemData: {}
        }
    },
    created() {
        let { moduleCode, id } = this.$route.params
        this.moduleCode = moduleCode
        this.itemId = id || ''
        if (this.optCode == 'otNew') {
            this.getAddData()
        } else if (this.optCode == 'otEdit') {
            this.getEditData()
        }
    },
    computed: {
        ...mapGetters('client', [
            'addEditSetList',
            'modifyEditSetList'
        ])
    },
    methods: {
        themeChange(val) {
            this.$emit('themeChange', val)
        },
        custChange(val) {
            if (val) {
                this.custId = val.custId || ''
            } else {
                this.custId = ''
            }
        },
        CurrencyChange(val) {
            if (val) {
                this.Currency = val.symbol || ''
            }
        },
        getAddData() {
            let p0 = new Promise((resolve) => {
                this.getClassType(resolve)
            })
            let p1 = new Promise((resolve) => {
                this.getAddEditSet(resolve)
            })
            let p2 = new Promise((resolve) => {
                this.getGoodsFields(resolve)
            })
            Promise.all([p0, p1, p2]).then((results) => {
                this.loading = false
                this.classTypeInUseList = results[0]
                this.swidchEditSet(results[1].list)
                this.swidchGoodsEdit(results[2])
            })
        },
        getEditData() {
            this.goodsFields = []
            let p0 = new Promise((resolve) => {
                this.getClassType(resolve)
            })
            let p1 = new Promise((resolve) => {
                this.getModifyEditSet(resolve)
            })
            let p2 = new Promise((resolve) => {
                this.getItemData(resolve)
            })
            let p3 = new Promise((resolve) => {
                this.getGoodsFields(resolve)
            })
            Promise.all([p0, p1, p2, p3]).then((results) => {
                this.classTypeInUseList = results[0]
                this.itemData = results[2]
                if (JSON.stringify(this.itemData) == '{}') {
                    this.$emit('removeTab')
                    return
                }
                this.swidchEditSet(results[1].list)
                this.swidchEdit(this.itemData)
                this.swidchGoodsEdit(results[3])
                this.loading = false
                this.$nextTick(() => {
                    this.updata()
                })
            })
        },
        swidchGoodsEdit(list) {
            let goodsFields = []
            let goodsLeftFields = []
            list.forEach(item => {
                if (item.fieldName == 'imagesId' || item.fieldName == 'spuCode' || item.fieldName == 'spuName') {
                    goodsLeftFields.push(item)
                } else if (item.fieldName != 'offType') {
                    goodsFields.push(item)
                }
            })
            this.goodsLeftFields = goodsLeftFields
            this.goodsFields = goodsFields
        },
        getGoodsFields(resolve) {
            this.$http.get(this.Global.baseURL + this.Global.api.v2.fieldShow_get, {
                params: {
                    moduleCode: this.moduleCode,
                    strucId: '2',
                    type: this.optCode == 'otNew' ? 'addEditSet' : 'modifyEditSet'
                }
            }).then((res) => {
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
        swidchEdit(list) {
            this.baseEditSet.forEach((item) => {
                item.inDefaultValue = ''
                if (item.editState == '0' || item.editState == '3') {
                    item.disabled = true
                }
                if (item.fieldGroup == 0) {
                    if (list[item.fieldName]) {
                        item.fieldValue = list[item.fieldName] ? list[item.fieldName].toString() : list[item.fieldName]
                    } else {
                        item.fieldValue = ''
                    }
                } else {
                    item.group.forEach(function(element) {
                        if (list[element.fieldName]) {
                            element.fieldValue = list[element.fieldName] ? list[element.fieldName].toString() : list[element.fieldName]
                        } else {
                            element.fieldValue = ''
                        }
                    })
                }
            })
        },
        updata() {
            this.totAddFee = parseFloat(this.itemData.totAddFee) || 0
            this.totDeductFee = parseFloat(this.itemData.totDeductFee) || 0
            this.totProdAmt = parseFloat(this.itemData.totProdAmt) || 0
            this.custId = this.itemData.custId || ''

            this.$refs.BaseMsg.updata()
            this.$refs.FilesMsg.updata()
            this.$refs.GoodsMsg.updata()
            this.$refs.OtherMsg.updata()
            this.$refs.TotalPrice.updata()
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
        scrollTop(top) {
            this.$emit('scrollTop', top)
        },
        submit() {
            let baseMsgData = this.optCode == 'otNew' ? this.$refs.BaseMsg.submit() : this.$refs.BaseMsg.submitEdit()
            let filesMsgData = this.$refs.FilesMsg.submit()
            let GoodsMsgData = this.$refs.GoodsMsg.submit()
            if (!baseMsgData) {
                return false
            }
            if (!filesMsgData) {
                return false
            }
            if (!GoodsMsgData) {
                return false
            }
            let otherMsgData = this.$refs.OtherMsg.submit()
            let TotalPriceData = this.$refs.TotalPrice.submit()
            let data = Object.assign({}, baseMsgData, otherMsgData, GoodsMsgData, filesMsgData, TotalPriceData)
            if (JSON.stringify(data) == '{}') {
                // 您未作出修改，请修改后再来！
                this.$message(this.$t('mxpcweb.sale.components.1557565501215'))
                return false
            }
            data.moduleCode = this.moduleCode
            if (this.optCode == 'otEdit') {
                data.quotaId = this.itemData.quotaId
            }
            return data
        },
        showAssistant(type, data) {
            this.assistantShow = type
            this.goodsItem = data
        },
        goodsItemChange(data) {
            this.goodsItem = data
        },
        getAddEditSetList,
        getModifyEditSetList,
        // 同步设置
        ...mapMutations('client', {
            set_addEditSetList: 'SET_ADDEDITSETLIST',
            set_modifyEditSetList: 'SET_MODIFYEDITSETLIST'
        }),
        swidchEditSet(list) {
            let newLList = []
            let groupFirst = []
            list.forEach((element) => {
                element.controlData = ''
                if (element.editState == '0' || element.editState == '2') {
                    element.disabled = true
                }
                element.fieldValue = element.inDefaultValue
                if (element.fieldGroup !== 0) { // 判断是否是一个组
                    let isHave = false
                    let thisGroup = ''
                    groupFirst.forEach((item) => { // 判断这个组是否出现过，出现则在groupFirst里做个标记
                        if (item == element.fieldGroup) {
                            isHave = true
                            thisGroup = item // 记住这个组id
                        }
                    })
                    if (!isHave) { // 如果没有出现过新建一个对象放入newList里面
                        let newObj = {
                            fieldGroup: element.fieldGroup,
                            cnFieldCaption: this.returnGroupName(element.fieldGroup),
                            group: []
                        }
                        newObj.group.push(element)
                        newLList.push(newObj)
                        groupFirst.push(element.fieldGroup)
                    } else { // 如果出现过就找之前创建的对象将自己放入到group数组中
                        newLList.forEach((them) => {
                            if (them.fieldGroup == thisGroup) {
                                them.group.push(element)
                            }
                        })
                    }
                } else {
                    newLList.push(element)
                }
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
                this.moneyEditSet = newLList.slice(filedIndex, newLList.length)
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
        getAddEditSet(resolve) { // 获取数据
            this.getAddEditSetList(this.moduleCode, (editSets) => {
                let obj = JSON.stringify(editSets)
                let editSet = JSON.parse(obj)
                resolve(editSet)
            })
        },
        getModifyEditSet(resolve) { // 获取数据
            this.getModifyEditSetList(this.moduleCode, (editSets) => {
                let obj = JSON.stringify(editSets)
                let editSet = JSON.parse(obj)
                resolve(editSet)
            })
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
        clearData() {
            this.assistantShow = false
            this.totAddFee = 0
            this.totDeductFee = 0
            this.totProdAmt = 0
            this.qtyAmt = 0
            this.Currency = ''
            this.itemId = ''
            this.itemData = {}

            this.$refs.BaseMsg.clearData()
            this.$refs.FilesMsg.clearData()
            this.$refs.GoodsMsg.clearData()
            this.$refs.OtherMsg.clearData()
        }
    },
    components: {
        'base-msg': BaseMsg,
        'other-msg': OtherMsg,
        'goods-msg': GoodsMsg,
        'total-price': TotalPrice,
        'files-msg': FilesMsg,
        'little-assistant': LittleAssistant
    }
}
</script>
<style lang="less" scoped>
.NewAndEditVueBox{
    height: 100%;
    .LittleAssistant{
        width:380px;
        background:rgba(255,255,255,1);
        box-shadow:-2px 5px 10px 0px rgba(0,0,0,0.1);
        position: fixed;
        // right: 200px;
        right: 0px;
        top: 70px;
        bottom: 0;
        background: white;
        z-index: 3;
    }
}
.NewAndEditVueBox1{
    padding-right: 364px;
}
</style>
