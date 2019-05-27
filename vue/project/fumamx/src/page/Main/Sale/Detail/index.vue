<template>
<div class="Detail">
    <detail-vue v-if="moduleCode == 'SC001'" ref="detail" @removeTab="removeTab"></detail-vue>
    <detail-vue2 v-if="moduleCode == 'SC002'" ref="detail" @removeTab="removeTab"></detail-vue2>
</div>
</template>
<script>
import DetailVue from '../DetailVue/index.vue'
import DetailVue2 from '../DetailVue/indexSC002.vue'
/**
 * 描述：客户管理-客户列表-新增单据
 * 作者：何俊峰
 * 时间：2019/3/8
 */
export default {
    name: 'Detail',
    props: {
    },
    data() {
        return {
            moduleCode: ''
        }
    },
    created() {
        let { moduleCode } = this.$route.params
        this.moduleCode = moduleCode
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        removeTab() {
            this.$emit('removeTab')
            this.$router.push('/main/sale/tabs/list/' + this.moduleCode)
        }
    },
    watch: {
    },
    beforeDestroy: function () {
    },
    components: {
        'detail-vue': DetailVue,
        'detail-vue2': DetailVue2
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
