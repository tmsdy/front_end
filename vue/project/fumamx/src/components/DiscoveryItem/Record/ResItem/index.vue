<template>
    <el-row class="resItem">
        <el-col :span="4" class="firstCol">{{item.regDate||'&nbsp;'}}</el-col>
        <el-col :span="5">
            <div ref="company" class="companyName clickLink" @click="$emit('openCompany')">{{(inout=='imp'?item.supplierName:item.buyerName)||'&nbsp;'}}</div>
        </el-col>
        <el-col :span="4">{{item.hsCode||'&nbsp;'}}</el-col>
        <el-col :span="7">
            <div ref="desc" class="desc">
                {{item.productDetail||'&nbsp;'}}
            </div>
        </el-col>
        <el-col :span="4">{{Money}}</el-col>
    </el-row>
</template>

<script>
export default {
    props: {
        inout: {
            type: String,
            default: 'imp'
        },
        item: {
            type: Object,
            default: () => ({})
        }
    },
    name: 'ResItem',
    data() {
        return {

        }
    },
    computed: {
        Money() {
            let { money: m } = this.item
            if (m) {
                return `$${(m / 1000000).toFixed(2)}M`
            } else {
                return '-'
            }
        }
    },
    mounted() {
        this.setClamp()
    },
    methods: {
        setClamp() {
            $clamp(this.$refs.company, {
                clamp: 2
            })
            $clamp(this.$refs.desc, {
                clamp: 2
            })
        }
    },
    components: {

    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./en.less";
@import "./zh-cn.less";
</style>
