<template>
<div class="Discount">
    <div class="list">
        <div class="title">
            <!-- 整单比例 -->
            <el-radio @change="typeChange" class="radio" v-model="item.offType" label="2">{{$t('mxpcweb.sale.components.1557565445659')}}</el-radio>
        </div>
        <template v-if="item.offType == '2'">
            <input type="number"
            @change="change()"
            @keyup.enter="hide()"
            min="0"
            onkeypress="if( ! /^-?\d+\.?\d{0,1}$/.test(this.value)){ var s = this.value;this.value=s.substring(0,s.indexOf('.')+2)}"
            style="margin-right:10px;" v-model="item.ratio"/>%
        </template>
    </div>
    <div class="list">
        <div class="title">
            <!-- 固定金额 -->
            <el-radio @change="typeChange" class="radio" v-model="item.offType" label="1">{{$t('mxpcweb.sale.components.1557565445965')}}</el-radio>
        </div>
        <input type="number"
        v-if="item.offType == '1'"
        @change="change()"
        @keyup.enter="hide()"
        min="0"
        onkeypress="if( ! /^-?\d+\.?\d{0,1}$/.test(this.value)){ var s = this.value;this.value=s.substring(0,s.indexOf('.')+2)}"
        v-model="item.feeAmt"/>
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
            this.$emit('hide', this.index)
        },
        typeChange() {
            this.item.feeAmt = 0
            this.item.ratio = 0
        },
        change() {
            this.$emit('change')
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
