<template>
<div class="goodsLists">
    <template v-if="list.length > 0">
        <div class="list text-hover" :class="index == 0 ? 'list1' : ''" v-for="(item,index) in list" :key="index" @click="$emit('specCheck', item, indexId)">
            {{item.spuName}}
        </div>
    </template>
    <div class="nodata" v-else>
        <!-- 暂无数据 -->
        {{$t('mxpcweb.sale.components.1557565299899')}}
    </div>
</div>
</template>

<script>
export default {
    name: 'GoodsMsg',
    props: {
        list: {
            type: Array,
            default: () => {
                return []
            }
        },
        indexId: {
            type: [String, Number],
            default: ''
        }
    },
    data() {
        return {
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .goodsLists{
        .list{
            padding: 5px 10px;
            border-bottom: 1px solid #eaedef;
            &:hover{
                background:#F6ECED;
            }
        }
        .list1{
            border-top: 1px solid #eaedef;
        }
        .nodata{
            text-align: center;
        }
    }
</style>
