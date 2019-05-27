<template>
    <div class="Test">
        1111111111111111111111111
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'Test',
    props: {
    },
    data() {
        return {
        }
    },
    created() {
    },
    mounted() {
        this.getData()
    },
    computed: {
      ...mapGetters('goods', [
          'currency'
      ])
    },
    methods: {
        getData() {
            let str = ''
            this.currency.forEach(element => {
                str += element.currencyCode + '/CNY,'
            })
            console.log(str)
        }
    },
    watch: {
    },
    components: {
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
</style>
