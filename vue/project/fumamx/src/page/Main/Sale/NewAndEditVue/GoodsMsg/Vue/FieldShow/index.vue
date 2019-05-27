<template>
<span class="fieldShow">
    <component v-bind:is="'control'+fieldData.controlTypeId" ref="control" :itemData="itemData" :value="{value:itemData[fieldData.fieldName]}"></component>
</span>
</template>

<script>
import ListShow from '@/components/ListShowControls/index'
export default {
    name: 'fieldShow',
    props: {
        fieldData: {
            type: Object,
            default: () => {
                return {}
            }
        },
        itemData: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
        }
    },
    methods: {
    },
    components: Object.assign({
    }, ListShow)
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
</style>
