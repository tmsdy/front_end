<template>
    <div class="OtherMsg">
        <p class="contactTitle">
            <!-- 其他费用 -->
            {{$t('mxpcweb.sale.components.1557565446068')}}
            <!-- 添加费用 -->
            <el-button class="miniButton" size="mini" @click="add()">{{$t('mxpcweb.sale.components.1557565446273')}}</el-button>
            <!-- <span style="color:#606266;font-size:12px;font-weight:normal"><span style="color:#D0021B;margin-right:6px;">*</span>填写负数则为减少费用</span> -->
            <!-- 收款合计： -->
            <span style="margin-left:15px;">{{$t('mxpcweb.sale.components.1557565459205')}}{{Currency}} {{totAddFee}}</span>
            <!-- 扣款合计： -->
            <span style="margin-left:15px;display:inline-block">{{$t('mxpcweb.sale.components.1557565459464')}}-{{Currency}} {{totDeductFee}}</span>
        </p>
        <div class="contentBox">
            <div v-for="(item, index) in list" class="list" :key="index">
                <span class="number">{{index + 1}}</span>
                <el-select v-model="item.feeType" style="width:164px;" size="mini" @change="moneyChange">
                    <!-- 收款 -->
                    <el-option value="1" :label="$t('mxpcweb.sale.components.1557565459680')"></el-option>
                    <!-- 扣款 -->
                    <el-option value="2" :label="$t('mxpcweb.sale.components.1557565459881')"></el-option>
                </el-select>
                <!-- 费用描述 -->
                <el-input style="width:164px;" size="mini" v-model="item.feeDesc" :placeholder="$t('mxpcweb.sale.components.1557565475235')"></el-input>
                <el-popover
                    placement="bottom"
                    trigger="click">
                    <div slot="reference" :ref="'reference' + index" class="itemType text-hover">
                        {{returnTypeName(item)}}
                        <i class="iconfont icon-arrow-down"></i>
                    </div>
                    <discount :index="index" @hide="hide" @change="moneyChange" :item="item"></discount>
                </el-popover>
                <div class="money">
                    {{item.feeAmt}}
                </div>
                <i class="iconfont icon-del text-hover" @click="del(index)"></i>
            </div>
            <div></div>
        </div>
    </div>
</template>
<script>
import Discount from './Discount/index'
export default {
    name: 'OtherMsg',
    props: {
        optCode: {
            type: String,
            default: ''
        },
        Currency: {
            type: String,
            default: ''
        },
        totAddFee: {
            type: Number,
            default: 0
        },
        totDeductFee: {
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
            list: []
        }
    },
    created() {
    },
    computed: {
    },
    methods: {
        hide(index) {
            this.$refs['reference' + index][0].click()
        },
        clearData() {
            this.list = []
        },
        updata() {
            this.list = []
            let list = this.itemData.strucId_3 || []
            list.forEach(item => {
                let obj = JSON.stringify(item)
                this.list.push(JSON.parse(obj))
            })
        },
        submit() {
            let data = {}
            if (this.optCode == 'otEdit' && this.itemData.strucId_3 && this.list.length == this.itemData.strucId_3.length) {
                let isSame = true
                this.list.forEach((item, index) => {
                    if (JSON.stringify(item) != JSON.stringify(this.itemData.strucId_3[index])) {
                        isSame = false
                    }
                })
                if (isSame) {
                    return data
                }
            }
            data.strucId_3 = this.list
            return data
        },
        returnTypeName(item) {
            if (item.offType == '1') {
                // 固定金额
                return this.$t('mxpcweb.sale.components.1557565445965')
            } else if (item.offType == '2') {
                // 整单比例
                return this.$t('mxpcweb.sale.components.1557565445659') + (item.ratio ? '(' + item.ratio + '%)' : '')
            }
        },
        add() {
            this.list.push({
                feeType: '1',
                feeDesc: '',
                offType: '1',
                ratio: '',
                feeAmt: ''
            })
        },
        del(index) {
            this.list.splice(index, 1)
            this.moneyChange()
        },
        moneyChange() {
            let totAddFee = 0
            let totDeductFee = 0
            this.list.forEach(item => {
                let itemNum = 0
                if (item.offType == '1') {
                    itemNum = parseFloat(item.feeAmt) || 0
                    item.ratio = this.totProdAmt != 0 ? ((parseFloat(item.feeAmt) || 0) / this.totProdAmt) * 100 : 0
                } else if (item.offType == '2') {
                    let feeAmt = (this.totProdAmt || 0) * (parseFloat(item.ratio) || 0) / 100
                    item.feeAmt = parseFloat(feeAmt.toFixed(2))
                    itemNum = item.feeAmt
                }
                if (item.feeType == '2') {
                    totDeductFee += itemNum
                } else {
                    totAddFee += itemNum
                }
            })
            totAddFee = parseFloat(totAddFee.toFixed(2))
            totDeductFee = parseFloat(totDeductFee.toFixed(2))
            this.$emit('update:totAddFee', totAddFee || 0)
            this.$emit('update:totDeductFee', totDeductFee || 0)
        },
        itemChange(item) {
            if (item.offType == '1') {
                item.ratio = ''
                item.feeAmt = ''
            } else if (item.offType == '2') {
                item.feeAmt = ''
            } else {
                item.ratio = ''
                item.feeAmt = ''
            }
            this.moneyChange()
        }
    },
    watch: {
        totProdAmt () {
            this.moneyChange()
        }
    },
    components: {
        'discount': Discount
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
