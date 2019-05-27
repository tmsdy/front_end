<template>
    <div class="templateMarket">
        <!-- 模板市场 -->
        <!-- <page-title title="" iconfont="" /> -->
        <div class="templateBox">
            <template-list @change="pickItem" :height="listHeight"></template-list>
        </div>
    </div>
</template>

<script>
import PageTitle from '@/components/PageTitle/index' // 大标题
import TemplateList from '@/basecomponents/TemplateList'
export default {
    name: 'templateMarket',
    data() {
        return {
            listHeight: 555
        }
    },
    mounted() {

    },
    methods: {
        pickItem(item) {
            this.$emit('change', item)
        }
    },
    components: {
        'page-title': PageTitle,
        'template-list': TemplateList
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
