<template>
    <!-- 商品预览 -->
    <el-dialog v-dialogDrag :title="$t('mxpcweb.mail.1543560100205')" :visible.sync="dialogLook" :closeOnClickModal="false" custom-class="width920" :modal-append-to-body="false">
        <div class="divbox">
            <div class="rightdiv">
                <div class="div1">
                    <!-- 卡片样式 -->
                    <el-radio class="radio" v-model="radio" label="1">卡片样式</el-radio>
                    <!-- 极简样式 -->
                    <!-- <el-radio class="radio" v-model="radio" label="2">极简样式</el-radio> -->
                    <!-- 列表样式 -->
                    <el-radio class="radio" v-model="radio" label="3">列表样式</el-radio>
                </div>
                <div class="div2">
                    <!-- 显示商品名 -->
                    <el-checkbox v-model="showName">显示商品名</el-checkbox>
                    <!-- 显示价格 -->
                    <el-checkbox v-model="showprice">显示价格</el-checkbox>
                </div>
                <div class="div3">
                    <!-- 完成 -->
                    <el-button type="primary" @click="submitchange()">完成</el-button>
                </div>
            </div>
            <div class="leftdiv">
                <div v-html="viewConten"></div>
            </div>

        </div>
    </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
// import { isArray } from '@/libs/utils.js'
export default {
    name: 'DialogTemplate',
    props: {
    },
    data() {
        return {
            dialogLook: false,
            radio: '1',
            showName: true,
            showprice: true,
            viewConten: '',
            htmlObj: [],
            currencyList: [],
            goodsListCard: ` 
        .goodsListCard {
             max-width:600px;
        }
        .goodsListCard .goodsItem{
            display: inline-block;
            width: 230px;
            margin-bottom: 15px;
            font-size: 14px;
            vertical-align: top;
            /* border:1px solid red; */
        }
        .goodsListCard .goodsItem:nth-child(2n-1) {
            /* border:1px solid blue; */
              margin-right: 9px;
    margin-left: 9px;
        }
        .goodsListCard .goodsItem .goodsPic {
            width: 230px;
            height: 230px;
            background-color: #eee;
            overflow: hidden;
        }
        .goodsListCard .goodsItem .goodsName {
            /* border:1px solid red; */
            margin: 8px 0 2px;
            color: #303133;
        }
        .goodsListCard .goodsItem .goodsDescr {
            color: #909399;
        }
        .goodsListCard .goodsItem .goodsPrice {
            color: red;
        }
         a{
            text-decoration:none;
        }
        `,
            goodsListLine: ` 
        .goodsListLine {

        }
        .goodsListLine .goodsItem{
            /* border:1px solid red; */
            clear: both;
            margin-bottom: 15px;
            font-size: 15px;
        }
        
        .goodsListLine .goodsItem .goodsPic {
            width: 200px;
            height: 200px;
            margin-right: 15px;
            float: left;
        }
        .goodsListLine .goodsItem .goodsName {
            /* border:1px solid red; */
            margin: 8px 0 2px;
            color: #303133;
        }
        .goodsListLine .goodsItem .goodsDescr {
            color: #909399;
        }
        .goodsListLine .goodsItem .goodsPrice {
            color: red;
        }
        a{
            text-decoration:none;
        }`
        }
    },
    computed: {
        ...mapGetters(['company'])
    },
    methods: {
        submitchange() {
            this.dialogLook = false
            this.$emit('Insertgoods', this.viewConten)
        },
        showdialog(data, currencyList) {
            this.currencyList = currencyList
            this.dialogLook = true
            this.htmlObj = data
            this.goodsEdit(data)
        },
        returnCurrency(currencyCode) {
            let symbol = ''
            this.currencyList.forEach(item => {
                if (currencyCode == item.currencyCode) {
                    symbol = item.symbol
                }
            })
            return symbol
        },
        goodsEdit(data) {
            // 加上链接
            data.forEach(item => {
                item.spuLink = this.getGoodsLink(item.spuId)
                // console.log(this.getGoodsLink(item.spuId))
            })
            var stylehtml = this.radio == 1 ? this.goodsListCard : this.goodsListLine
            var goodsShowStyle = this.radio == 1 ? 'goodsListCard' : 'goodsListLine'
            var goodsNameStyle = this.showName ? '' : 'style="display:none"'
            var goodsPriceStyle = this.showprice ? '' : 'style="display:none"'

            var goodsDom = '<div data="aaa123" class="' + goodsShowStyle + '">'

            data.forEach((item) => {
                var price = item.salePrice ? this.returnCurrency(item.saleCur) + item.salePrice : ''
                var goodsPicUrl = (item.imagesId && item.imagesId.length !== 0) ? (this.getGlobalImgSrc(item.imagesId[0], '200x200')) : 'https://sf.fumamx.com/img/orig/1,08deb6d949a8'
                goodsDom += '<div class="goodsItem"><a href="' + item.spuLink + '" target="_blank">'
                goodsDom += '<div class="goodsPic"><img width="100%" src="' + goodsPicUrl + '"></div>'
                goodsDom += '<div class="goodsName" ' + goodsNameStyle + '>' + item.spuName + '</div>'
                // goodsDom += '<div class="goodsDescr" ' + goodsDescrStyle + '>' + item.displayDesc + '</div>'
                goodsDom += '<div class="goodsPrice" ' + goodsPriceStyle + '>' + price + '</div>'
                goodsDom += '<div style="clear:both;"></div>'
                goodsDom += '</a></div>'
            })
            goodsDom += '</div>'
            this.viewConten = '<style>' + stylehtml + '</style>' + goodsDom
        }

    },
    watch: {
        radio: {
            handler(curVal, oldvalue) {
                this.goodsEdit(this.htmlObj)
            }
        },
        showName: {
            handler(curVal, oldvalue) {
                this.goodsEdit(this.htmlObj)
            }
        },
        showprice: {
            handler(curVal, oldvalue) {
                this.goodsEdit(this.htmlObj)
            }
        }

    },
    components: {
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.divbox {
    border: 1px rgba(228, 228, 228, 1) solid;
    height: 550px;
    margin-bottom: 20px;
    border: none;
    .leftdiv {
        border: 1px rgba(228, 228, 228, 1) solid;
        width: 60%;
        height: 550px;
        border-right: none;
        padding: 5px;
        overflow: auto;
    }
    .rightdiv {
        border: 1px rgba(228, 228, 228, 1) solid;
        width: 40%;
        height: 100%;
        float: right;
        .div1 {
            height: 10%;
            border-bottom: 1px rgba(228, 228, 228, 1) solid;
            padding: 5%;
        }
        .div2 {
            padding: 5%;
            height: 80%;
            border-bottom: 1px rgba(228, 228, 228, 1) solid;
        }
        .div3 {
            height: 10%;
            padding: 5%;
        }
    }
}
</style>
