<template>
    <span :title="returnShow()">
        {{returnShow()}}
    </span>
</template>

<script>
// import { getPortListShow } from '@/page/Main/Goods/mixins/index.js'
import { mapGetters } from 'vuex'
export default {
    name: 'Controls-TradeType',
    props: {
        list: {
            type: Object,
            default: function () {
                return {}
            }
        },
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
            name: ''
        }
    },
    computed: {
        ...mapGetters('goods', [
            'portListShow'
        ])
    },
    created() {
    },
    mounted() {
        this.returnShow()
    },
    methods: {
        returnShow() {
            let content = ''
            if (!this.value.value || this.value.value == '') {
                return content
            }
            if (this.portListShow instanceof Object) {
                if (!this.portListShow[this.value.value]) {
                    content = ''
                } else {
                    let data = this.portListShow[this.value.value]
                    content = data.name
                }
                return content
            }
        }
    },
    watch: {
        list(val) {
            this.returnShow()
        }
    },
    beforeDestroy: function () {
        this.returnShow = null
    }
}
</script>
