<template>
    <div class="CollectionRecords">
        <Receivables ref="receivables" @tellFather="tellFather" :itemData="itemData"></Receivables>
        <list ref="list" :totProdAmt="totProdAmt"
                    :actualAmt="actualAmt"
                    :unpayAmt="unpayAmt" @tellFather="tellFather" :Currency="Currency" :itemData="itemData"></list>
    </div>
</template>
<script>
import Receivables from '../../NewAndEditVue/Receivables/index'
import List from './List/index'
export default {
    name: 'CollectionRecords',
    props: {
        actualAmt: {
            type: Number,
            default: 0
        },
        unpayAmt: {
            type: Number,
            default: 0
        },
        totProdAmt: {
            type: Number,
            default: 0
        },
        itemData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        itemId: {
            type: String,
            default: ''
        },
        moduleCode: {
            type: String,
            default: ''
        },
        Currency: {
            type: String,
            default: ''
        },
        activeName: {
            type: String,
            default: ''
        },
        itemActive: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
        tellFather() {
            this.$emit('tellFather')
        },
        getTabData () {
            if (this.$refs.receivables) {
                this.$refs.receivables.getData()
            }
            if (this.$refs.list) {
                this.$refs.list.getData()
            }
        }
    },
    components: {
        'Receivables': Receivables,
        'list': List
    },
    watch: {
        activeName(val) {
            if (val == this.itemActive) {
                this.getTabData()
            }
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less">
@import "./zh-cn.less";
@import "./en.less";
</style>
