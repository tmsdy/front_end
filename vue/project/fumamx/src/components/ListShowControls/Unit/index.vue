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
            'unitListShow'
        ])
    },
    created() {
    },
    mounted() {
        this.getUnitListData()
    },
    methods: {
        getUnitListData () {
            if (this.value.value && this.value.value != '') {
                this.valueText = this.unitListShow[this.value.value] ? this.unitListShow[this.value.value].name : ''
            }
        }
    },
    watch: {
    }
}
</script>
