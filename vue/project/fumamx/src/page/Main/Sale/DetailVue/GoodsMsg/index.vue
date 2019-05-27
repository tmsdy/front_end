<template>
    <div class="GoodsMsg">
        <div class="goodsBox">
            <div class="tableBox" v-if="list.length > 0">
                <div class="floatLeft">
                    <table style="width:360px;border-color:rgba(192,196,204,1)" align="center">
                        <tr class="title">
                            <!-- 序号 -->
                            <th>{{$t('mxpcweb.sale.components.1557564596833')}}</th>
                            <!-- 图片 -->
                            <th v-if="showImg">{{$t('mxpcweb.sale.components.1557565034286')}}</th>
                            <!-- 商品编号 -->
                            <th>{{$t('mxpcweb.sale.components.1557565034529')}}</th>
                            <!-- 商品名称 -->
                            <th>{{$t('mxpcweb.sale.components.1557565034761')}}</th>
                        </tr>
                        <tr class="list" v-for="(item, index) in list" :key="index" :class="(chekckItem == index + 1) || (hoverItem == index + 1) ? 'list1' : ''" @mouseenter="hoverItem = index + 1" @mouseleave="hoverItem = ''" @click="chekckItem = (chekckItem == index + 1) ? '' : index + 1">
                            <td>{{index + 1}}</td>
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
                                    <div class="imgBoxNo text-hover" v-else>
                                        <!-- 暂无 -->
                                        <div>{{$t('mxpcweb.sale.components.1557565035173')}}</div>
                                    </div>
                                </template>
                            </td>
                            <td @click.stop>
                                <span style="color:#008CEE">
                                    {{item.spuCode}}
                                </span>
                            </td>
                            <td style="min-width:100px;">{{item.spuName}}</td>
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
                                <!-- 标准价格 -->
                                <div>{{$t('mxpcweb.sale.components.1557565036001')}}</div>
                            </th>
                            <th>
                                <!-- 报价 -->
                                <div>{{$t('mxpcweb.sale.components.1557565036189')}}</div>
                            </th>
                            <th>
                                <!-- 折扣 -->
                                <div>{{$t('mxpcweb.sale.components.1557565036391')}}</div>
                            </th>
                            <th>
                                <!-- 折扣率 -->
                                <div>{{$t('mxpcweb.sale.components.1557565036581')}}</div>
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
                                <div>{{$t('mxpcweb.sale.components.1557565105831')}}</div>
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
                        </tr>
                        <tr class="list" v-for="(item, index) in list" :key="index" :class="(chekckItem == index + 1) || (hoverItem == index + 1) ? 'list1' : ''" @mouseenter="hoverItem = index + 1" @mouseleave="hoverItem = ''" @click="chekckItem = (chekckItem == index + 1) ? '' : index + 1">
                            <td>
                                {{item.saleQty}}
                            </td>
                            <td>
                                <component v-bind:is="'control55'" ref="control" :value="{value:item.unit}"></component>
                            </td>
                            <td>{{item.salePrice}}</td>
                            <td>
                                {{item.quotedPrice}}
                            </td>
                            <td>
                                <!-- 无折扣 -->
                                {{item.offAmt == '0' ? $t('mxpcweb.sale.components.1557565106759') : item.offAmt}}
                            </td>
                            <td>{{item.offRT || 0}}%</td>
                            <td>{{item.totAmt || 0}}</td>
                            <td>{{item.spuSpec}}</td>
                            <td v-for="(items, indexs) in specFields" :key="indexs"  @click.stop>
                                {{item[items.fieldName]&&item[items.fieldName].itemName ? item[items.fieldName].itemName : ''}}
                            </td>
                            <td>{{item.unitNW}}</td>
                            <td>{{item.unitGW}}</td>
                            <td>{{item.unitVol}}</td>
                            <td>{{item.unitQty}}</td>
                            <td>
                                {{item.boxQty}}
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
                        </tr>
                        <tr class="bottom">
                            <th><div class="bottomAll">{{saleQty || 0}}</div></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <!-- <th><div class="bottomAll">{{offAmt || 0}}</div></th> -->
                            <th></th>
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
                        </tr>
                    </table>
                </div>
            </div>
            <div v-else>
                <nodata></nodata>
            </div>
        </div>
        <img-set ref="imgSet" @updateImg="updateImg"></img-set>
    </div>
</template>
<script>
import NoData from '@/basecomponents/NoData/index'
import ImgSet from './ImgSet/index'
import ListShow from '@/components/ListShowControls/index'

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
        }
    },
    data() {
        return {
            goodsType: '',
            categoryList: [],
            list: [],
            listLength: 0,
            totAmt: '0',
            offAmt: '0',
            saleQty: '0',
            input: '',
            hoverItem: '',
            chekckItem: '',
            showImg: false,
            specFields: [],
            boxQty: '0',
            NW: '0',
            GW: '0',
            volume: '0'
        }
    },
    created() {
    },
    computed: {
    },
    methods: {
        updata() {
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
                    this.list.push(item)
                })
                this.qtyAmtChange()
            })
        },
        goodsItemChange() {
            let data = this.chekckItem == '' ? {} : this.list[this.chekckItem - 1]
            this.$emit('goodsItemChange', data)
        },
        showAssistant() {
            let data = {}
            this.list.forEach(item => {
                if (item.spuCode == this.chekckItem) {
                    data = item
                }
            })
            this.$emit('showAssistant', true, data)
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
        goodsTypeChange() {
            this.list = []
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
        }
    },
    components: Object.assign({
        'nodata': NoData,
        'img-set': ImgSet
    }, ListShow),
    watch: {
        list(val) {
            this.checkList()
        },
        chekckItem () {
            this.goodsItemChange()
        }
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
