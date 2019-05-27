<template>
    <div class="GoodsMsg">
        <p class="contactTitle">
            <!-- 商品明细 -->
            {{$t('mxpcweb.sale.components.1557565300106')}}
            <el-select v-model="goodsTypeData" value-key="catgId" @change="goodsTypeChange" class="goodsTypeGoodsMsg" filterable placeholder="商品大类" v-if="goodsEditSet.category" size="mini" style="margin:0 10px;width:150px;">
                <div v-for="item in classTypeInUseList" :key="item.catgId+''">
                    <el-option :label="item.catgName" :value="item">
                    </el-option>
                </div>
            </el-select>
            <span style="color:#606266;font-weight: normal;" v-if="goodsEditSet.showPicFlag">
                <!-- 是否显示图片 -->
                {{$t('mxpcweb.sale.components.1557565300293')}}
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
                <!-- 选择商品 -->
                <el-button class="miniButton" type="primary" size="mini" style="color:white" @click="goodsViewOpen()">{{$t('mxpcweb.sale.components.1557565300496')}}</el-button>
                <!-- 批量修改 -->
                <el-button class="miniButton" size="mini" @click="otEditOpen()">{{$t('mxpcweb.sale.components.1557565183674')}}</el-button>
                <!-- 销售助手 -->
                <el-button class="miniButton" size="mini" @click="showAssistant()">{{$t('mxpcweb.sale.components.1557565300665')}}</el-button>
                <!-- 从报价导入 -->
                <el-button class="miniButton" size="mini" @click="fromQuoted()">{{$t('mxpcweb.sale.components.1557565351075')}}</el-button>
                <!-- <el-button class="miniButton" size="mini">更多</el-button> -->
            </div>
            <div class="tableBox">
                <div class="floatLeft">
                    <table style="width:400px;border-color:rgba(192,196,204,1)" align="center">
                        <tr class="title">
                            <!-- 序号 -->
                            <th>{{$t('mxpcweb.sale.components.1557564596833')}}</th>
                            <!-- 图片 -->
                            <th v-if="showImg">{{$t('mxpcweb.sale.components.1557565034286')}}</th>
                            <!-- 商品货号 -->
                            <th>{{$t('mxpcweb.sale.components.1557565320581')}}</th>
                            <!-- 商品名称 -->
                            <th>{{$t('mxpcweb.sale.components.1557565034761')}}</th>
                        </tr>
                        <tr class="list" v-for="(item, index) in list" :key="index" :class="(chekckItem == index + 1) || (hoverItem == index + 1) ? 'list1' : ''" @mouseenter="hoverItem = index + 1" @mouseleave="hoverItem = ''">
                            <td @click="chekckItem = (chekckItem == index + 1) ? '' : index + 1;showOpt = true">{{index + 1}}
                                <div @click.stop class="listOpt" v-show="chekckItem == index + 1 && showOpt">
                                    <!-- <div class="top"></div> -->
                                    <!-- 添加行 -->
                                    <el-button class="miniButton" type="primary" size="mini" style="color:white;margin-left: 2px;" @click="optRow('add', index)">{{$t('mxpcweb.sale.components.1557565320793')}}</el-button>
                                    <!-- 插入行 -->
                                    <el-button class="miniButton" size="mini" style="margin-left: 2px;" @click="optRow('insert', index)">{{$t('mxpcweb.sale.components.1557565321373')}}</el-button>
                                    <!-- 复制行 -->
                                    <el-button class="miniButton" size="mini" style="margin-left: 2px;" @click="optRow('copy', index)">{{$t('mxpcweb.sale.components.1557565321555')}}</el-button>
                                    <!-- 删除行 -->
                                    <el-button class="miniButton" size="mini" style="margin-left: 2px;" @click="optRow('delete', index)">{{$t('mxpcweb.sale.components.1557565334586')}}</el-button>
                                    <!-- 上移 -->
                                    <el-button class="miniButton" size="mini" style="margin-left: 2px;" @click="optRow('top', index)">{{$t('mxpcweb.sale.components.1557565334791')}}</el-button>
                                    <!-- 下移 -->
                                    <el-button class="miniButton" size="mini" style="margin: 0 2px;" @click="optRow('bottom', index)">{{$t('mxpcweb.sale.components.1557565335013')}}</el-button>
                                    <span class="optLine"></span>
                                    <!-- 关闭 -->
                                    <el-button class="closeButton" size="mini" style="margin-left: 2px;" @click="showOpt = false">{{$t('mxpcweb.sale.components.1557565335225')}}</el-button>
                                </div>
                            </td>
                            <td @click.stop v-if="showImg">
                                <template v-if="item.spuCode">
                                    <template v-if="item.imagesId && item.imagesId[0]">
                                        <div class="imgBox">
                                            <img :src="checkPic(item.imagesId[0], '32x32')" alt="">
                                            <div class="setImg">
                                                <!-- 设置 -->
                                                <div class="setBut text-hover" @click="showImgset(item, index)">{{$t('mxpcweb.sale.components.1557565034971')}}</div>
                                            </div>
                                            <span class="imgNum" v-if="item.imagesId">{{item.imagesId.length}}</span>
                                        </div>
                                        <div class="largeImgBox">
                                            <img :src="checkPic(item.imagesId[0], '400x400')" alt="">
                                        </div>
                                    </template>
                                    <div class="imgBoxNo text-hover" @click="showImgset(item, index)" v-else>
                                        <div>+</div>
                                        <!-- 上传 -->
                                        <div>{{$t('mxpcweb.sale.components.1557565349667')}}</div>
                                    </div>
                                </template>
                            </td>
                            <td>
                                <span v-if="item.spuCode" style="color:#008CEE">
                                    {{item.spuCode}}
                                </span>
                                <el-popover
                                    v-else
                                    placement="bottom"
                                    width="200"
                                    trigger="click">
                                    <!-- 请输入商品货号 -->
                                    <input @click.stop slot="reference" v-model="input" style="width:128px;border-width:1px;" :placeholder="$t('mxpcweb.sale.components.1557565349873')" @input="handleClick(item, input)">
                                    <goods-list :list="item.list" @specCheck="specCheck" :indexId="index + 1"></goods-list>
                                </el-popover>
                            </td>
                            <td style="min-width:100px;">
                                <!-- 请输入 -->
                                <template v-if="item.spuCode">
                                    <input @click.stop
                                    style="width:140px"
                                    :placeholder="$t('mxpcweb.sale.components.1557565182681')"
                                    v-model="item.spuName"/>
                                </template>
                            </td>
                        </tr>
                        <tr class="bottom">
                            <!-- 总条数 -->
                            <th :colspan="showImg?'4':'3'" style="padding-left:10px;text-align: left;">{{$t('mxpcweb.sale.components.1557565035381')}}<span style="margin-left:15px;">{{listLength}}</span></th>
                        </tr>
                    </table>
                </div>
                <div class="floatRight MXscroll">
                    <table style="min-width:1110px;border-color:rgba(192,196,204,1)" align="center">
                        <tr class="title">
                            <th>
                                <!-- 数量 -->
                                <div>{{$t('mxpcweb.sale.components.1557565035577')}}</div>
                            </th>
                            <th>
                                <!-- 计量单位 -->
                                <div>{{$t('mxpcweb.sale.components.1557565035776')}}</div>
                            </th>
                            <th>
                                <!-- 销售单价 -->
                                <div>{{$t('mxpcweb.sale.components.1557565185489')}}</div>
                            </th>
                            <th>
                                <!-- 扣减金额 -->
                                <div>{{$t('mxpcweb.sale.components.1557712951275')}}</div>
                            </th>
                            <th>
                                <!-- 金额 -->
                                <div>{{$t('mxpcweb.sale.components.1557565036789')}}</div>
                            </th>
                            <th>
                                <!-- 规格 -->
                                <div>{{$t('mxpcweb.sale.components.1557565036995')}}</div>
                            </th>
                            <th v-for="(items, indexs) in specFields" :key="indexs">
                                <div>{{items.cnFieldCaption}}</div>
                            </th>
                            <!-- <th>
                                <div>描述属性</div>
                            </th> -->
                            <th>
                                <!-- 单箱净重(kg) -->
                                <div>{{$t('mxpcweb.sale.components.1557565037217')}}</div>
                            </th>
                            <th>
                                <!-- 单箱毛重(kg) -->
                                <div>{{$t('mxpcweb.sale.components.1557565037425')}}</div>
                            </th>
                            <th>
                                <!-- 单箱体积(m³) -->
                                <div>{{$t('mxpcweb.sale.components.1557565037611')}}</div>
                            </th>
                            <th>
                                <!-- 单箱数量 -->
                                <div>{{$t('mxpcweb.sale.components.1557565037833')}}</div>
                            </th>
                            <th>
                                <!-- 箱数 -->
                                <div>{{$t('mxpcweb.sale.components.1557565099068')}}</div>
                            </th>
                            <th>
                                <!-- 总净重(kg) -->
                                <div>{{$t('mxpcweb.sale.components.1557565105831')}}(kg)</div>
                            </th>
                            <th>
                                <!-- 总毛重(kg) -->
                                <div>{{$t('mxpcweb.sale.components.1557565106099')}}</div>
                            </th>
                            <th>
                                <!-- 总体积(m³) -->
                                <div>{{$t('mxpcweb.sale.components.1557565106315')}}</div>
                            </th>
                            <th>
                                <!-- 40尺柜数量 -->
                                <div>{{$t('mxpcweb.sale.components.1557565106513')}}</div>
                            </th>
                            <th>
                                <!-- 报价编号 -->
                                <div>{{$t('mxpcweb.sale.components.1557565375001')}}</div>
                            </th>
                        </tr>
                        <tr class="list" v-for="(item, index) in list" :key="index" :class="(chekckItem == index + 1) || (hoverItem == index + 1) ? 'list1' : ''" @mouseenter="hoverItem = index + 1" @mouseleave="hoverItem = ''">
                            <td>
                                <template v-if="item.spuCode">
                                    <!-- 请输入 -->
                                    <input @click.stop type="number"
                                    min="0"
                                    :placeholder="$t('mxpcweb.sale.components.1557565182681')"
                                    onkeyup="this.value=this.value.replace(/\D/g,'')"
                                    onafterpaste="this.value=this.value.replace(/\D/g,'')"
                                    v-model="item.saleQty" @input="change(index, 'saleQty')"/>
                                </template>
                            </td>
                            <td>
                                <template v-if="item.spuCode">
                                    <component v-bind:is="'control55'" ref="control" :value="{value:item.unit}"></component>
                                </template>
                            </td>
                            <td>
                                <span v-if="item.spuCode">
                                    <!-- 请输入 -->
                                    <input @click.stop :placeholder="$t('mxpcweb.sale.components.1557565182681')" type="number" v-model="item.salePrice"
                                    min="0"
                                    onkeypress="if( ! /^-?\d+\.?\d{0,1}$/.test(this.value)){ var s = this.value;this.value=s.substring(0,s.indexOf('.')+2)}"
                                    @change="change(index)"/>
                                </span>
                            </td>
                            <td style="min-width: 120px;white-space:nowrap;">
                                <template v-if="item.spuCode">
                                    <span v-if="chekckItem == index + 1" @click.stop>
                                        <!-- 无折扣 -->
                                        {{item.offAmt == '0' ? $t('mxpcweb.sale.components.1557565106759') : item.offAmt + '(' + item.offRt + '%)'}}
                                        <el-popover
                                            placement="bottom"
                                            trigger="click">
                                            <i slot="reference" :ref="'reference' + index" class="iconfont icon-arrow-down text-hover"></i>
                                            <discount :index="index" @change="change" @hide="hide" :item="item"></discount>
                                        </el-popover>
                                    </span>
                                    <!-- 无折扣 -->
                                    <span v-else>{{item.offAmt == '0' ? $t('mxpcweb.sale.components.1557565106759') : item.offAmt + '(' + item.offRt + '%)'}}</span>
                                </template>
                            </td>
                            <td><span v-if="item.spuCode">{{item.totAmt}}</span></td>
                            <td>{{item.spuSpec || ' '}}</td>
                            <td v-for="(items, indexs) in specFields" :key="indexs">
                                <!-- <el-popover
                                    v-if="chekckItem == index + 1"
                                    placement="bottom"
                                    width="100"
                                    trigger="click">
                                    <div slot="reference"
                                    @click.stop style="min-width: 48px;height: 38px;padding-top: 12px;">
                                        {{item[items.fieldName]&&item[items.fieldName].itemName ? item[items.fieldName].itemName : ''}}
                                    </div>
                                    <spec-list :list="item[items.fieldName + 'List'] || []" :itemData="item" :fieldData="items" :specFields="specFields"></spec-list>
                                </el-popover> -->
                                <div style="min-width: 48px;height: 38px;padding-top: 12px;">
                                    {{item[items.fieldName]&&item[items.fieldName].itemName ? item[items.fieldName].itemName : ''}}
                                </div>
                            </td>
                            <!-- <td>
                                <template v-if="item.spuCode">
                                    {{item.attrdesc}}
                                </template>
                            </td> -->
                            <td>
                                <template v-if="item.spuCode">
                                    {{item.unitNW}}
                                </template>
                            </td>
                            <td>
                                <template v-if="item.spuCode">
                                    {{item.unitGW}}
                                </template>
                            </td>
                            <td>
                                <template v-if="item.spuCode">
                                    {{item.unitVol}}
                                </template>
                            </td>
                            <td>
                                <template v-if="item.spuCode">
                                    {{item.unitQty}}
                                </template>
                            </td>
                            <td>
                                <template v-if="item.spuCode">
                                    <!-- 请输入 -->
                                    <input @click.stop type="number"
                                    :placeholder="$t('mxpcweb.sale.components.1557565182681')"
                                    min="0"
                                    onkeyup="this.value=this.value.replace(/\D/g,'')"
                                    onafterpaste="this.value=this.value.replace(/\D/g,'')"
                                    v-model="item.boxQty" @change="change(index, 'boxQty')"/>
                                </template>
                            </td>
                            <td>
                                <template v-if="item.spuCode">
                                    {{item.NW}}
                                </template>
                            </td>
                            <td>
                                <template v-if="item.spuCode">
                                    {{item.GW}}
                                </template>
                            </td>
                            <td>
                                <template v-if="item.spuCode">
                                    {{item.volume}}
                                </template>
                            </td>
                            <td>
                                <template v-if="item.spuCode">
                                    {{item.cont40R || '0'}}
                                </template>
                            </td>
                            <td>
                                <template v-if="item.spuCode">
                                    {{item.quotaCode}}
                                </template>
                            </td>
                        </tr>
                        <tr class="bottom">
                            <th><div class="bottomAll">{{saleQty || 0}}</div></th>
                            <th></th>
                            <th></th>
                            <!-- <th><div class="bottomAll">{{offAmt || 0}}</div></th> -->
                            <th></th>
                            <th><div class="bottomAll">{{totAmt || 0}}</div></th>
                            <th></th>
                            <th v-for="(items, indexs) in specFields" :key="indexs"></th>
                            <th colspan="4"></th>
                            <th><div class="bottomAll">{{boxQty || 0}}</div></th>
                            <th>
                                <div class="bottomAll">{{NW || 0}}</div>
                            </th>
                            <th>
                                <div class="bottomAll">{{GW || 0}}</div>
                            </th>
                            <th>
                                <div class="bottomAll">{{volume || 0}}</div>
                            </th>
                            <th>
                            </th>
                            <th>
                            </th>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <goods-view ref="goodsView" :categoryList="categoryList" :goodsType="goodsType" @checkGoodsList="checkGoodsList"></goods-view>
        <quoted-goods :custData="custData" ref="quotedGoods" :goodsTypeData="goodsTypeData" @checkGoodsList="checkGoodsList" :specFields="specFields" :showImg="showImg" :moduleCode="moduleCode"></quoted-goods>
        <img-set ref="imgSet" @updateImg="updateImg"></img-set>
        <ot-edit ref="otEdit" @otEditList="otEditList" :moduleCode="moduleCode"></ot-edit>
        <sale-qty-box ref="saleQtyBox" @updateItem="updateItem"></sale-qty-box>
    </div>
</template>
<script>
import goodsView from './goodsView/index'
import QuotedGoods from './QuotedGoods/index'
import ImgSet from './ImgSet/index'
import OtEdit from './OtEdit/index'
import GoodsList from './Vue/GoodsList/index'
import SpecList from './Vue/SpecList/index'
import Discount from './Vue/Discount/index'
import ListShow from '@/components/ListShowControls/index'
import saleQtyBox from './goodsView/saleQtyBox/index'

export default {
    name: 'GoodsMsg',
    props: {
        goodsEditSet: {
            type: Object,
            default: () => {
                return {}
            }
        },
        moduleCode: {
            type: String,
            default: ''
        },
        optCode: {
            type: String,
            default: ''
        },
        classTypeInUseList: {
            type: Array,
            default: () => {
                return []
            }
        },
        qtyAmt: {
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
        currencyCode: {
            type: String,
            default: ''
        },
        custData: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            goodsType: '',
            goodsTypeData: {},
            categoryList: [],
            list: [{
                list: [],
                saleQty: '0',
                boxQty: '0',
                NW: '0',
                GW: '0',
                volume: '0',
                salePrice: '0',
                offAmt: '0',
                offType: '1',
                offRt: '0',
                totAmt: '0',
                skuCode: ''
            }],
            listLength: 0,
            totAmt: '0',
            offAmt: '0',
            saleQty: '0',
            boxQty: '0',
            NW: '0',
            GW: '0',
            volume: '0',
            input: '',
            hoverItem: '',
            chekckItem: '',
            showImg: true,
            specFields: [],
            showOpt: true,
            searchLoading: null
        }
    },
    created() {
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        hide(index) {
            this.$refs['reference' + index][0].click()
        },
        updata() {
            if (this.itemData.category) {
                this.goodsType = this.itemData.category + ''
                this.classTypeInUseList.forEach(item => {
                    if (item.catgId == this.goodsType) {
                        this.goodsTypeData = item
                    }
                })
                this.goodsTypeChange()
            }
            if (this.itemData.showPicFlag && this.itemData.showPicFlag == '1') {
                this.showImg = true
            } else {
                this.showImg = false
            }
            this.$nextTick(() => {
                this.list = []
                let list = this.itemData.strucId_2 || []
                list.forEach(item => {
                    let obj = JSON.stringify(item)
                    this.list.push(JSON.parse(obj))
                })
                this.qtyAmtChange()
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
                        // 请选择商品大类！
                        this.$message(this.$t('mxpcweb.sale.components.1557565350069'))
                        return false
                    }
                }
                if (this.optCode == 'otEdit') {
                    if (this.goodsType != this.itemData.category) {
                        data.category = this.goodsType
                    }
                } else {
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
            if (this.optCode == 'otEdit' && this.itemData.strucId_2 && list.length == this.itemData.strucId_2.length) {
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
        fromQuoted() {
            if (this.goodsType == '') {
                // 请选择商品大类！
                this.$message(this.$t('mxpcweb.sale.components.1557565350069'))
                return false
            }
            this.$refs.quotedGoods.showDialog()
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
                // 请先选择商品大类
                this.$message(this.$t('mxpcweb.sale.components.1557565350273'))
                return
            }
            this.$refs.goodsView.open()
        },
        otEditOpen() {
            if (this.listLength == 0) {
                // 暂无可修改行
                this.$message(this.$t('mxpcweb.sale.components.1557565350473'))
                return
            }
            this.$refs.otEdit.open()
        },
        goodsTypeChange(val) {
            this.goodsType = val ? (val.catgId + '' || '') : ''
            this.list = [{
                list: [],
                saleQty: '0',
                salePrice: '0',
                offAmt: '0',
                offType: '1',
                offRt: '0',
                totAmt: '0',
                boxQty: '0',
                NW: '0',
                GW: '0',
                volume: '0',
                skuCode: ''
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
        itemChange(index, type) {
            let { saleQty, salePrice, offType, offAmt, offRt, unitQty, unitNW, unitGW, unitVol, boxQty } = this.list[index]
            saleQty = parseFloat(saleQty || 0)
            boxQty = parseFloat(boxQty || 0)
            unitQty = parseFloat(unitQty || 0)
            unitNW = parseFloat(unitNW || 0)
            unitGW = parseFloat(unitGW || 0)
            unitVol = parseFloat(unitVol || 0)
            salePrice = parseFloat(salePrice || 0)
            offRt = parseFloat(offRt || 0)
            offAmt = parseFloat(offAmt || 0)
            if (type == 'boxQty') {
                this.list[index].saleQty = Math.floor(boxQty * unitQty)
                saleQty = this.list[index].saleQty
            } else {
                this.list[index].boxQty = unitQty ? Math.ceil(saleQty / unitQty) : 0
                boxQty = this.list[index].boxQty
            }
            this.list[index].NW = parseFloat((unitNW * boxQty).toFixed(4))
            this.list[index].GW = parseFloat((unitGW * boxQty).toFixed(4))
            this.list[index].volume = parseFloat((unitVol * boxQty).toFixed(4))
            if (offType == '2') {
                this.list[index].offAmt = parseFloat((saleQty * salePrice * offRt / 100).toFixed(2))
            } else if (offType == '1') {
                this.list[index].offRt = (saleQty * salePrice) ? parseFloat(((offAmt / (saleQty * salePrice)) * 100).toFixed(2)) : 0
            }
            this.list[index].totAmt = parseFloat((saleQty * salePrice - this.list[index].offAmt).toFixed(2)) || ''
        },
        change(index, type) {
            this.itemChange(index, type)
            this.qtyAmtChange()
        },
        allChangeItem() {
            this.list.forEach((item, index) => {
                this.itemChange(index)
            })
            this.qtyAmtChange()
        },
        qtyAmtChange() {
            let totAmtItem = 0
            let offAmtItem = 0
            let saleQtyItem = 0
            let boxQtyItem = 0
            let NWItem = 0
            let GWItem = 0
            let volumeItem = 0
            this.list.forEach(item => {
                let { totAmt, offAmt, saleQty, boxQty, NW, GW, volume } = item
                totAmtItem += parseFloat(totAmt || 0)
                offAmtItem += parseFloat(offAmt || 0)
                saleQtyItem += parseFloat(saleQty || 0)
                boxQtyItem += parseFloat(boxQty || 0)
                NWItem += parseFloat(NW || 0)
                GWItem += parseFloat(GW || 0)
                volumeItem += parseFloat(volume || 0)
            })
            this.totAmt = parseFloat(totAmtItem.toFixed(2))
            this.offAmt = parseFloat(offAmtItem.toFixed(2))
            this.saleQty = parseFloat(saleQtyItem.toFixed(2))
            this.boxQty = parseFloat(boxQtyItem.toFixed(2))
            this.NW = parseFloat(NWItem.toFixed(4))
            this.GW = parseFloat(GWItem.toFixed(4))
            this.volume = parseFloat(volumeItem.toFixed(4))
            this.$emit('update:qtyAmt', this.saleQty || 0)
            this.$emit('update:totProdAmt', this.totAmt || 0)
        },
        optRow(type, index) {
            if (type == 'insert') {
                this.list.splice(index, 0, {
                    list: [],
                    saleQty: '0',
                    salePrice: '0',
                    offAmt: '0',
                    offType: '1',
                    offRt: '0',
                    boxQty: '0',
                    totAmt: '0',
                    NW: '0',
                    GW: '0',
                    volume: '0',
                    skuCode: ''
                })
                this.chekckItem = ''
            }
            if (type == 'add') {
                this.list.splice(index + 1, 0, {
                    list: [],
                    saleQty: '0',
                    salePrice: '0',
                    offAmt: '0',
                    offType: '1',
                    offRt: '0',
                    boxQty: '0',
                    totAmt: '0',
                    NW: '0',
                    GW: '0',
                    volume: '0',
                    skuCode: ''
                })
                this.chekckItem = ''
            }
            if (type == 'copy') {
                let newObj = JSON.parse(JSON.stringify(this.list[index]))
                if (!this.list[this.list.length - 1].spuCode) {
                    this.list.splice(this.list.length - 1, 1)
                }
                this.list.push(newObj)
            }
            if (type == 'top') {
                if (index - 1 < 0) {
                    // 已经置顶
                    this.$message(this.$t('mxpcweb.sale.components.1557565350677'))
                    return
                }
                this.list = swapArr(this.list, index, index - 1)
                if (this.chekckItem != '') {
                    this.chekckItem += -1
                }
            }
            if (type == 'bottom') {
                if (index + 1 > this.list.length - 1) {
                    // 已经到底部了
                    this.$message(this.$t('mxpcweb.sale.components.1557565350887'))
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
                    list: [],
                    saleQty: '0',
                    salePrice: '0',
                    offAmt: '0',
                    offType: '1',
                    offRt: '0',
                    boxQty: '0',
                    totAmt: '0',
                    NW: '0',
                    GW: '0',
                    volume: '0',
                    skuCode: ''
                })
            }
            function swapArr(arr, index1, index2) {
                arr[index1] = arr.splice(index2, 1, arr[index1])[0]
                return arr
            }
        },
        updateItem(item, index) {
            let checkLists = []
            if (item.qtyList && item.qtyList.length > 0) {
                item.saleQty = '0'
                if (item.spec1 && item.spec2) {
                    let spec1List = JSON.parse(JSON.stringify(item.spec1))
                    let spec2List = JSON.parse(JSON.stringify(item.spec2))
                    item.spec1 = {}
                    item.spec2 = {}
                    item.qtyList.forEach(items => {
                        let itemObj = JSON.parse(JSON.stringify(item))
                        spec1List.forEach(element => {
                            if (element.dictItemCode == items.spec1) {
                                itemObj.spec1 = element
                            }
                        })
                        spec2List.forEach(element => {
                            if (element.dictItemCode == items.spec2) {
                                itemObj.spec2 = element
                            }
                        })
                        itemObj.saleQty = items.saleQty
                        checkLists.push(itemObj)
                    })
                } else if (item.spec1) {
                    let spec1List = JSON.parse(JSON.stringify(item.spec1))
                    item.spec1 = {}
                    item.qtyList.forEach(items => {
                    let itemObj = JSON.parse(JSON.stringify(item))
                    spec1List.forEach(element => {
                        if (element.dictItemCode == items.spec1) {
                        itemObj.spec1 = element
                        }
                    })
                    itemObj.saleQty = items.saleQty
                        checkLists.push(itemObj)
                    })
                } else if (item.spec2) {
                    let spec2List = JSON.parse(JSON.stringify(item.spec2))
                    item.spec2 = {}
                    item.qtyList.forEach(items => {
                        let itemObj = JSON.parse(JSON.stringify(item))
                        spec2List.forEach(element => {
                            if (element.dictItemCode == items.spec2) {
                                itemObj.spec2 = element
                            }
                        })
                        itemObj.saleQty = items.saleQty
                        checkLists.push(itemObj)
                    })
                }
            } else {
                let itemObj = JSON.parse(JSON.stringify(item))
                if (itemObj.spec1) {
                    itemObj.spec1 = {}
                }
                if (itemObj.spec2) {
                    itemObj.spec2 = {}
                }
                checkLists.push(itemObj)
            }
            this.checkGoodsList(checkLists, index)
        },
        specCheck(item, index) {
            if (item.quotationMethod == '1' && item.strucId_2 && item.strucId_2.length > 0) {
                this.$refs.saleQtyBox.open(item, index)
            } else {
                this.checkGoods(item, index)
            }
        },
        checkGoodsList(list, index) {
            list.forEach((item, indexs) => {
                if (index && index != '') {
                    this.checkGoods(item, index + indexs)
                } else {
                    this.checkGoods(item)
                }
            })
        },
        checkGoods(item, index) {
            if (this.input = '') {
                this.input = ''
            }
            let data = {}
            data.salePrice = '0'
            data.quotaCode = ''
            data.boxQty = '0'
            data.offAmt = '0'
            data.offType = '1'
            data.offRt = '0'
            data.totAmt = '0'
            data.skuCode = '0'
            data.NW = '0'
            data.GW = '0'
            data.volume = '0'
            data.saleQty = '0'
            Object.keys(item).forEach((key) => {
                if (key == 'salePrice') {
                    if (item.saleCur && item.saleCur != '') {
                        data.salePrice = this.transExRate(item.saleCur, this.currencyCode, item.salePrice)
                    } else {
                        data.salePrice = item.salePrice
                    }
                } else {
                    data[key] = item[key]
                }
            })
            data.list = []
            if (item.strucId_1 && item.strucId_1.quotaCode) {
                data.quotaCode = item.strucId_1.quotaCode
            }
            // if (this.specFields.length != 0) {
            //     this.specFields.forEach(items => {
            //         data[items.fieldName + 'List'] = item[items.fieldName] || []
            //         data[items.fieldName] = {}
            //     })
            // }
            if (!item.imagesId) {
                data.imagesId = []
            }
            if (index && index != '') {
                let list = []
                this.list.forEach((items, indexs) => {
                    if (indexs == index - 1) {
                        list.push(data)
                        if (items.spuCode) {
                            list.push(items)
                        }
                    } else {
                        list.push(items)
                    }
                })
                this.list = list
            } else {
                if (!this.list[this.list.length - 1].spuCode) {
                    this.list.splice(this.list.length - 1, 1)
                }
                this.list.push(data)
            }
            this.chekckItem = ''
        },
        handleClick(item, input) {
            if (this.searchLoading) {
                clearTimeout(this.searchLoading)
            }
            this.searchLoading = setTimeout(() => {
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
                    // 请先选择商品大类
                    this.$message(this.$t('mxpcweb.sale.components.1557565350273'))
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
            }, 500)
        },
        clearData() {
            this.goodsType = ''
            this.list = [{
                list: [],
                saleQty: '0',
                salePrice: '0',
                offAmt: '0',
                offType: '1',
                boxQty: '0',
                NW: '0',
                GW: '0',
                volume: '0',
                offRt: '0',
                boxQty: '0',
                totAmt: '0',
                totAmt: '0'
            }]
            this.listLength = 0
            this.totAmt = '0'
            this.offAmt = '0'
            this.saleQty = '0'
            this.totAmt = '0'
            this.NW = '0'
            this.GW = '0'
            this.volume = 0
            this.input = ''
            this.chekckItem = ''
            this.showImg = false
            this.specFields = []
        }
    },
    components: Object.assign({
        'goods-view': goodsView,
        'quoted-goods': QuotedGoods,
        'img-set': ImgSet,
        'ot-edit': OtEdit,
        'goods-list': GoodsList,
        'spec-list': SpecList,
        'discount': Discount,
        'sale-qty-box': saleQtyBox
    }, ListShow),
    watch: {
        list(val) {
            this.checkList()
            this.allChangeItem()
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
