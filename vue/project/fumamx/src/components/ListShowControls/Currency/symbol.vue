<template>
    <span :title="valueText">
        {{valueText}}
    </span>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'Controls-TradeType',
    props: {
        value: {
            type: Object,
            default: function () {
                return {
                    value: ''
                }
            }
        }
    },
    data() {
        return {
            valueText: ''
        }
    },
    computed: {
        ...mapGetters('goods', [
            'currencyShow'
        ])
    },
    created() {
    },
    mounted() {
        this.getCurrencyData()
    },
    methods: {
        getCurrencyData () {
            if (this.value.value && this.value.value != '') {
                this.valueText = this.currencyShow[this.value.value] ? this.currencyShow[this.value.value].symbol : ''
            }
        }
    },
    watch: {
        value(val) {
            this.getCurrencyData()
        }
    }
}
</script>
