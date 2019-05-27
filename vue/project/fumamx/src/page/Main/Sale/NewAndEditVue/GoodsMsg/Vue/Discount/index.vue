<template>
<div class="Discount">
    <div class="list">
        <div class="title">
            <!-- 百分比 -->
            <el-radio class="radio" v-model="item.offType" label="2">{{$t('mxpcweb.sale.components.1557565266313')}}</el-radio>
        </div>
        <template v-if="item.offType == '2'">
            <input type="number"
            @keyup.enter="hide()"
            onkeypress="if( ! /^-?\d+\.?\d{0,1}$/.test(this.value)){ var s = this.value;this.value=s.substring(0,s.indexOf('.')+2)}"
            style="margin-right:10px;" v-model="item.offRt" @change="change()"/>%
        </template>
    </div>
    <div class="list">
        <div class="title">
            <!-- 直接减价 -->
            <el-radio class="radio" v-model="item.offType" label="1">{{$t('mxpcweb.sale.components.1557565299710')}}</el-radio>
        </div>
        <input type="number"
        v-if="item.offType == '1'"
        @keyup.enter="hide()"
        onkeypress="if( ! /^-?\d+\.?\d{0,1}$/.test(this.value)){ var s = this.value;this.value=s.substring(0,s.indexOf('.')+2)}"
        v-model="item.offAmt" @change="change()"/>
    </div>
</div>
</template>

<script>
export default {
    name: 'Discount',
    props: {
        item: {
            type: Object,
            default: () => {
                return {}
            }
        },
        index: {
            type: Number
        }
    },
    data() {
        return {
        }
    },
    methods: {
        hide() {
            // parseFloat((saleQty * quotedPrice * offRt / 100).toFixed(2))
            this.$emit('hide', this.index)
        },
        change() {
            let offRt = parseFloat(this.item.offRt) || 0
            let offAmt = parseFloat(this.item.offAmt) || 0
            if (offRt != 0) {
                this.item.offRt = parseFloat(offRt.toFixed(2))
            }
            if (offAmt != 0) {
                this.item.offAmt = parseFloat(offAmt.toFixed(2))
            }
            this.$emit('change', this.index)
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
