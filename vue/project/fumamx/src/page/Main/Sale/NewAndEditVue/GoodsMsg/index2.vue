<template>
    <div class="GoodsMsg">
        <p class="contactTitle">
            商品明细
            <el-select v-model="goodsType" class="goodsTypeGoodsMsg" filterable placeholder="商品大类" v-if="goodsEditSet.category" @change="goodsTypeChange" size="mini" style="margin:0 10px;width:150px;">
                <div v-for="item in classTypeInUseList" :key="item.catgId+''">
                    <el-option :label="item.catgName" :value="item.catgId+''">
                    </el-option>
                </div>
            </el-select>
            <span style="color:#606266;font-weight: normal;" v-if="goodsEditSet.showPicFlag">
                是否显示图片
                <el-switch
                    style="margin-left:10px;"
                    on-text=""
                    off-text=""
                    size="mini"
                    v-model="showImg">
                </el-switch>
            </span>
        </p>
        <div class="goodsBox">
            <div class="goodsOpt">
                <el-button class="miniButton" type="primary" size="mini" style="color:white" @click="goodsViewOpen()">选择商品</el-button>
                <el-button class="miniButton" size="mini" @click="otEditOpen()">批量修改</el-button>
                <el-button class="miniButton" size="mini" @click="showAssistant()">报价助手</el-button>
                <!-- <el-button class="miniButton" size="mini">更多</el-button> -->
            </div>
            <div class="tableBox">
                <div class="floatLeft">
                    <table style="width:400px;border-color:rgba(192,196,204,1)" align="center">
                        <tr class="title">
                            <th>序号</th>
                            <template v-for="(items, indexs) in goodsLeftFields">
                                <th v-if="items.fieldName == 'imagesId' && showImg" :key='indexs'>{{items.cnFieldCaption}}</th>
                                <th v-else-if="items.fieldName == 'spuCode'" :key="indexs">商品编号</th>
                                <th v-else-if="items.fieldName == 'spuName'" :key="indexs">商品名称</th>
                            </template>
                        </tr>
                        <tr class="list" v-for="(item, index) in list" :key="index" :class="(chekckItem == index + 1) || (hoverItem == index + 1) ? 'list1' : ''" @mouseenter="hoverItem = index + 1" @mouseleave="hoverItem = ''">
                            <td @click="chekckItem = (chekckItem == index + 1) ? '' : index + 1;showOpt = true">{{index + 1}}</td>
                            <template v-for="(items, indexs) in goodsLeftFields">
                                <td @click.stop v-if="items.fieldName == 'imagesId' && showImg" :key="indexs">
                                    <template v-if="item.spuCode">
                                        <el-popover
                                            v-if="item.imagesId && item.imagesId[0]"
                                            placement="right"
                                            width="424"
                                            trigger="hover">
                                            <div class="imgBox" slot="reference">
                                                <img :src="checkPic(item.imagesId[0], '32x32')" alt="">
                                                <div class="setImg">
                                                    <div class="setBut text-hover" @click="showImgset(item, index)">设置</div>
                                                </div>
                                                <span class="imgNum" v-if="item.imagesId">{{item.imagesId.length}}</span>
                                            </div>
                                            <div class="largeImgBox" >
                                                <img :src="checkPic(item.imagesId[0], '400x400')" alt="">
                                            </div>
                                        </el-popover>
                                        <div class="imgBoxNo text-hover" @click="showImgset(item, index)" v-else>
                                            <div>+</div>
                                            <div>上传</div>
                                        </div>
                                    </template>
                                </td>
                                <td v-else-if="items.fieldName == 'spuCode'" :key="indexs">
                                    <span v-if="item.spuCode" style="color:#008CEE">
                                        {{item.spuCode}}
                                    </span>
                                    <el-popover
                                        v-else
                                        placement="bottom"
                                        width="200"
                                        trigger="focus">
                                        <input @click.stop slot="reference" v-model="input" style="width:128px;border-width:1px;" placeholder="请输入商品编号" @change="handleClick(item, input)">
                                        <goods-list :list="item.list" @checkGoods="checkGoods" :indexId="index + 1"></goods-list>
                                    </el-popover>
                                    <div @click.stop class="listOpt" v-show="chekckItem == index + 1 && showOpt">
                                        <!-- <div class="top"></div> -->
                                        <el-button class="miniButton" type="primary" size="mini" style="color:white;margin-left: 2px;" @click="optRow('add', index)">添加行</el-button>
                                        <el-button class="miniButton" size="mini" style="margin-left: 2px;" @click="optRow('insert', index)">插入行</el-button>
                                        <el-button class="miniButton" size="mini" style="margin-left: 2px;" @click="optRow('copy', index)">复制行</el-button>
                                        <el-button class="miniButton" size="mini" style="margin-left: 2px;" @click="optRow('delete', index)">删除行</el-button>
                                        <el-button class="miniButton" size="mini" style="margin-left: 2px;" @click="optRow('top', index)">上移</el-button>
                                        <el-button class="miniButton" size="mini" style="margin: 0 2px;" @click="optRow('bottom', index)">下移</el-button>
                                        <span class="optLine"></span>
                                        <el-button class="closeButton" size="mini" style="margin-left: 2px;" @click="showOpt = false">关闭</el-button>
                                    </div>
                                </td>
                                <td v-else-if="items.fieldName == 'spuName'" style="min-width:100px;" :key="indexs">{{item.spuName}}</td>
                            </template>
                        </tr>
                        <tr class="bottom">
                            <th :colspan="showImg?'4':'3'" style="padding-left:10px;text-align: left;">总条数<span style="margin-left:15px;">{{listLength}}</span></th>
                        </tr>
                    </table>
                </div>
                <div class="floatRight MXscroll">
                    <table style="min-width:1110px;border-color:rgba(192,196,204,1)" align="center">
                        <tr class="title">
                            <th v-for="(items, indexs) in goodsFields" :key="indexs + 'goodsFields'">
                                <div>{{items.cnFieldCaption}}</div>
                            </th>
                            <th v-for="(items, indexs) in specFields" :key="indexs + 'specFields'">
                                <div>{{items.cnFieldCaption}}</div>
                            </th>
                        </tr>
                        <tr class="list" v-for="(item, index) in list" :key="index" :class="(chekckItem == index + 1) || (hoverItem == index + 1) ? 'list1' : ''" @mouseenter="hoverItem = index + 1" @mouseleave="hoverItem = ''">
                            <td v-for="(items, indexs) in goodsFields" :key="indexs + 'goodsFields'">
                                <template v-if="item.spuCode">
                                    <list-show v-if="chekckItem != index + 1" :itemData="item" :fieldData="items"></list-show>
                                    <field-edit @change="change" :indexId="index" v-else :itemData="item" :fieldData="items"></field-edit>
                                </template>
                            </td>
                            <td v-for="(items, indexs) in specFields" :key="indexs + 'specFields'">
                                <el-popover
                                    v-if="chekckItem == index + 1"
                                    placement="bottom"
                                    width="100"
                                    trigger="click">
                                    <div slot="reference"
                                    @click.stop style="min-width: 48px;height: 38px;padding-top: 12px;">
                                        {{item[items.fieldName]&&item[items.fieldName].itemName ? item[items.fieldName].itemName : ''}}
                                    </div>
                                    <spec-list :list="item[items.fieldName + 'List'] || []" :itemData="item" :fieldData="items" :specFields="specFields"></spec-list>
                                </el-popover>
                                <div v-else style="min-width: 48px;height: 38px;padding-top: 12px;">
                                    {{item[items.fieldName]&&item[items.fieldName].itemName ? item[items.fieldName].itemName : ''}}
                                </div>
                            </td>
                        </tr>
                        <tr class="bottom">
                            <th v-for="(items, indexs) in goodsFields" :key="indexs + 'goodsFields'"></th>
                            <th v-for="(items, indexs) in specFields" :key="indexs + 'specFields'"></th>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <goods-view ref="goodsView" :categoryList="categoryList" :goodsType="goodsType" @checkGoodsList="checkGoodsList"></goods-view>
        <img-set ref="imgSet" @updateImg="updateImg"></img-set>
        <ot-edit ref="otEdit" @otEditList="otEditList"></ot-edit>
    </div>
</template>
<script>
import goodsView from './goodsView/index'
import ImgSet from './ImgSet/index'
import OtEdit from './OtEdit/index'
import GoodsList from './Vue/GoodsList/index'
import SpecList from './Vue/SpecList/index'
import Discount from './Vue/Discount/index'
import ListShow from './Vue/FieldShow/index'
import FieldEdit from './Vue/FieldEdit/index'

export default {
    name: 'GoodsMsg',
    props: {
        goodsEditSet: {
            type: Object,
            default: () => {
                return {}
            }
        },
        classTypeInUseList: {
            type: Array,
            default: () => {
                return []
            }
        },
        allNum: {
            type: Number,
            default: 0
        },
        totProdAmt: {
            type: Number,
            default: 0
        },
        itemData: {
            type: Object,
            default: () => {
                return {}
            }
        },
        goodsLeftFields: {
            type: Array,
            default: () => {
                return []
            }
        },
        goodsFields: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            goodsType: '',
            categoryList: [],
            list: [{
                list: []
            }],
            listLength: 0,
            totAmt: '0',
            offAmt: '0',
            saleQty: '0',
            boxQty: '0',
            input: '',
            hoverItem: '',
            chekckItem: '',
            showImg: false,
            specFields: [],
            showOpt: true
        }
    },
    created() {
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        updata() {
            this.list = []
            if (this.itemData.category) {
                this.goodsType = this.itemData.category
                this.goodsTypeChange()
            }
            if (this.itemData.showPicFlag && this.itemData.showPicFlag == '1') {
                this.showImg = true
            }
            this.$nextTick(() => {
                let list = this.itemData.strucId_2 || []
                list.forEach(item => {
                    let obj = JSON.stringify(item)
                    this.list.push(JSON.parse(obj))
                })
                this.allNumChange()
            })
        },
        submit() {
            let data = {}
            if (this.goodsEditSet.category) {
                if (this.goodsEditSet.category.disabled) {
                    return {}
                } else if (this.goodsEditSet.category.isNotNull == 1) {
                    if (this.goodsType == '') {
                        this.$emit('scrollTop', $('.goodsTypeGoodsMsg')[0].offsetTop)
                        this.$message('请选择商品大类！')
                        return false
                    }
                }
                if (this.goodsType != this.itemData.category) {
                    data.category = this.goodsType
                }
            }
            if (this.goodsEditSet.showPicFlag) {
                let showPicFlag = this.showImg ? '1' : '0'
                if (showPicFlag != this.itemData.showPicFlag) {
                    data.showPicFlag = showPicFlag
                }
            }
            let list = []
            this.list.forEach(item => {
                if (item.spuCode) {
                    list.push(item)
                }
            })
            if (this.itemData && this.itemData.strucId_2 && list.length == this.itemData.strucId_2.length) {
                let isSame = true
                list.forEach((item, index) => {
                    if (JSON.stringify(item) != JSON.stringify(this.itemData.strucId_2[index])) {
                        isSame = false
                    }
                })
                if (isSame) {
                    return data
                }
            }
            data.strucId_2 = list
            return data
        },
        goodsItemChange() {
            let data = this.chekckItem == '' ? {} : this.list[this.chekckItem - 1]
            this.$emit('goodsItemChange', data)
        },
        showAssistant() {
            // this.$message('敬请期待！')
            let data = this.chekckItem == '' ? {} : this.list[this.chekckItem - 1]
            this.$emit('showAssistant', true, data)
        },
        otEditList(data) {
            let {rule, field, input, fromNum, toNum} = data
            this.list.forEach((item, index) => {
                if (item.spuCode) {
                    if (rule == '1' && (item[field] == '' || item[field] == 0)) {
                        item[field] = input
                        this.change(index, field)
                    }
                    if (rule == '2') {
                        item[field] = input
                        this.change(index, field)
                    }
                    if (rule == '3' && this.chekckItem != '' && index >= this.chekckItem && index <= this.chekckItem + (parseFloat(toNum) || 0)) {
                        item[field] = input
                        this.change(index, field)
                    }
                    if (rule == '4') {
                        item[field] = ''
                        this.change(index, field)
                    }
                    if (rule == '5' && (index + 1 >= parseFloat(fromNum) || 0) && (index + 1 <= parseFloat(toNum) || 0)) {
                        item[field] = input
                        this.change(index, field)
                    }
                }
            })
        },
        checkList() {
            let listLength = 0
            this.list.forEach(item => {
                if (item.spuCode) {
                    listLength += 1
                }
            })
            this.listLength = listLength
        },
        goodsViewOpen() {
            if (this.goodsType == '') {
                this.$message('请先选择商品大类')
                return
            }
            this.$refs.goodsView.open()
        },
        otEditOpen() {
            if (this.listLength == 0) {
                this.$message('暂无可修改行')
                return
            }
            this.$refs.otEdit.open()
        },
        goodsTypeChange() {
            this.list = [{
                list: []
            }]
            if (this.goodsType == '') {
                this.specFields = []
            } else {
                this.$http.get(this.Global.baseURL + this.Global.api.v2.document_product_fieldShow,
                    {
                    params: {
                        moduleCode: 'PP001',
                        fieldType: 'special',
                        catgId: this.goodsType,
                        type: 'addEditSet'
                    }
                }).then((res) => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        let specFields = res.body.data || []
                        specFields.forEach(item => {
                            if (item.strucId == 2 && item.fieldList.length != 0) {
                                this.specFields = item.fieldList
                            }
                        })
                    }
                })
            }
            this.categoryListChange()
        },
        categoryListChange() {
            this.categoryList = []
            if (this.goodsType == '') {
                return
            }
            this.classTypeInUseList.forEach(item => {
                if (item.catgId == this.goodsType) {
                    item.categoryList.forEach(items => {
                        this.categoryList.push(items)
                    })
                }
            })
        },
        updateImg(imagesId, index) {
            this.list[index].imagesId = []
            imagesId.forEach(item => {
                this.list[index].imagesId.push(item)
            })
        },
        showImgset(item, index) {
            this.$refs.imgSet.open(item, index)
        },
        checkPic(imgId, size) {
            return this.getGlobalImgSrc(imgId, size)
        },
        change(index, type) {
            let { saleQty, quotedPrice, baseCalType, offAmt, ratio, unitQty, boxQty } = this.list[index]
            saleQty = parseFloat(saleQty || 0)
            boxQty = parseFloat(boxQty || 0)
            unitQty = parseFloat(unitQty || 0)
            quotedPrice = parseFloat(quotedPrice || 0)
            ratio = parseFloat(ratio || 0)
            offAmt = parseFloat(offAmt || 0)
            if (type == 'saleQty') {
                this.list[index].boxQty = unitQty ? Math.ceil(saleQty / unitQty) : 0
            } else if (type == 'boxQty') {
                this.list[index].saleQty = Math.floor(boxQty * unitQty)
                saleQty = this.list[index].saleQty
            }
            if (baseCalType == '1') {
                this.list[index].offAmt = parseFloat((saleQty * quotedPrice * ratio / 100).toFixed(2))
            } else if (baseCalType == '2') {
                this.list[index].ratio = (saleQty * quotedPrice) ? parseFloat(((offAmt / (saleQty * quotedPrice)) * 100).toFixed(2)) : 0
            }
            this.list[index].totAmt = parseFloat((saleQty * quotedPrice - this.list[index].offAmt).toFixed(2))
            console.log(this.list)
            this.allNumChange()
        },
        allNumChange() {
            let totAmtItem = 0
            let offAmtItem = 0
            let saleQtyItem = 0
            let boxQtyItem = 0
            this.list.forEach(item => {
                let { totAmt, offAmt, saleQty, boxQty } = item
                totAmtItem += parseFloat(totAmt || 0)
                offAmtItem += parseFloat(offAmt || 0)
                saleQtyItem += parseFloat(saleQty || 0)
                boxQtyItem += parseFloat(boxQty || 0)
            })
            this.totAmt = parseFloat(totAmtItem.toFixed(2))
            this.offAmt = parseFloat(offAmtItem.toFixed(2))
            this.saleQty = saleQtyItem
            this.boxQty = boxQtyItem
            this.$emit('update:allNum', this.saleQty || 0)
            this.$emit('update:totProdAmt', this.totAmt || 0)
        },
        optRow(type, index) {
            if (type == 'insert') {
                this.list.splice(index, 0, {
                    list: []
                })
                this.chekckItem = ''
            }
            if (type == 'add') {
                this.list.splice(index + 1, 0, {
                    list: []
                })
                this.chekckItem = ''
            }
            if (type == 'copy') {
                this.list.splice(this.list.length - 1, 0, this.list[index])
            }
            if (type == 'top') {
                if (index - 1 < 0) {
                    this.$message('已经置顶')
                    return
                }
                this.list = swapArr(this.list, index, index - 1)
                if (this.chekckItem != '') {
                    this.chekckItem += -1
                }
            }
            if (type == 'bottom') {
                if (index + 1 > this.list.length - 1) {
                    this.$message('已经到底部了')
                    return
                }
                this.list = swapArr(this.list, index, index + 1)
                if (this.chekckItem != '') {
                    this.chekckItem += 1
                }
            }
            if (type == 'delete') {
                this.list.splice(index, 1)
                this.chekckItem = ''
            }
            if (this.list.length == 0) {
                this.list.push({
                    list: []
                })
            }
            function swapArr(arr, index1, index2) {
                arr[index1] = arr.splice(index2, 1, arr[index1])[0]
                return arr
            }
        },
        checkGoodsList(list) {
            list.forEach(item => {
                this.checkGoods(item)
            })
        },
        checkGoods(item, index) {
            if (this.input = '') {
                this.input = ''
            }
            let data = {}
            Object.keys(item).forEach((key) => {
                data[key] = item[key]
            })
            this.goodsFields.forEach(items => {
                if (!data[items.fieldName]) {
                    data[items.fieldName] = ''
                }
            })
            data.list = []
            if (this.specFields.length != 0) {
                this.specFields.forEach(items => {
                    data[items.fieldName + 'List'] = item[items.fieldName] || []
                    data[items.fieldName] = {}
                })
            }
            if (!item.imagesId) {
                data.imagesId = []
            }
            if (index && index != '') {
                let list = []
                this.list.forEach((items, indexs) => {
                    if (indexs == index - 1) {
                        list.push(data)
                    } else {
                        list.push(items)
                    }
                })
                this.list = list
                let isHave = false
                this.list.forEach(items => {
                    if (!items.spuCode) {
                        isHave = true
                    }
                })
                if (!isHave) {
                    this.list.push({
                        list: []
                    })
                }
            } else {
                this.list.push(data)
            }
            this.chekckItem = ''
        },
        handleClick(item, input) {
            let data = {
                moduleCode: 'PP001',
                searchType: 'list',
                sort: 'createDate'
            }
            if (input == '') {
                item.list = []
                return
            }
            data.keywords = input
            if (this.goodsType != '') {
                data.catgId = this.goodsType
            } else {
                this.$message('请先选择商品大类')
                item.list = []
                return
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v2.document_product, { params: data }).then(res => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    item.list = res.body.data.list || []
                } else {
                    item.list = []
                    this.$message.error(this.msg(res.body))
                }
            }, res => {
                item.list = []
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        clearData() {
            this.goodsType = ''
            this.list = [{
                list: []
            }]
            this.listLength = 0
            this.totAmt = '0'
            this.offAmt = '0'
            this.saleQty = '0'
            this.boxQty = 0
            this.input = ''
            this.chekckItem = ''
            this.showImg = false
            this.specFields = []
        }
    },
    components: {
        'goods-view': goodsView,
        'img-set': ImgSet,
        'ot-edit': OtEdit,
        'goods-list': GoodsList,
        'spec-list': SpecList,
        'discount': Discount,
        'field-edit': FieldEdit,
        'list-show': ListShow
    },
    watch: {
        list(val) {
            this.checkList()
            this.allNumChange()
        },
        chekckItem () {
            this.goodsItemChange()
        }
    }
}
</script>
<style>
    .goodsTypeGoodsMsg>.el-input--mini>input{
        -moz-appearance:textfield;
        border: 1px solid #D0021B;
        color:#D0021B;
    }
    .goodsTypeGoodsMsg>.el-input--mini>i.el-input__icon{
        color:#D0021B;
    }
    .goodsTypeGoodsMsg>.el-input--mini>input:focus{
        border: 1px solid #D0021B;
    }
    .goodsTypeGoodsMsg>.el-input--mini:hover>input{
        border: 1px solid #D0021B;
    }
    .goodsTypeGoodsMsg>.el-input--mini>input::-webkit-input-placeholder{
        color:#D0021B;
    }
    .goodsTypeGoodsMsg>.el-input--mini>input::-moz-placeholder{
        color:#D0021B;
    }
    .goodsTypeGoodsMsg>.el-input--mini>input:-moz-placeholder{
        color:#D0021B;
    }
    .goodsTypeGoodsMsg>.el-input--mini>input:-ms-input-placeholder{
        color:#D0021B;
    }
</style>

<style lang="less" rel="stylesheet/less" scoped>
    @import "./zh-cn.less";
    @import "./en.less";
</style>
