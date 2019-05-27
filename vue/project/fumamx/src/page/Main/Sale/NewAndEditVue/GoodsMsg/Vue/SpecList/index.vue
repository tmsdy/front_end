<template>
<div class="SpecList">
    <div class="title">
        <el-input v-model="input" style="width:88px;" size="mini" :placeholder="$t('')"></el-input>
    </div>
    <template v-if="list.length > 0">
        <div class="list text-hover" :class="index == 0 ? 'list1' : ''" v-for="(item,index) in returnList()" :key="index" @click="checkItem(item)">
            {{item.itemName}}
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
    name: 'SpecList',
    props: {
        fieldData: {
            type: Object,
            default: () => {
                return {}
            }
        },
        list: {
            type: Array,
            default: () => {
                return []
            }
        },
        itemData: {
            type: Object,
            default: () => {
                return {}
            }
        },
        specFields: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            input: ''
        }
    },
    methods: {
        returnList() {
            let list = []
            this.list.forEach(item => {
                if (item.itemName.indexOf(this.input) != -1) {
                    list.push(item)
                }
            })
            return list
        },
        checkItem(item) {
            this.itemData[this.fieldData.fieldName] = item
            let list = this.itemData.strucId_2 || []
            let skuCode = ''
            let skuId = ''
            list.forEach(element => {
                let isTrue = true
                this.specFields.forEach(items => {
                    if (element[items.fieldName] != this.itemData[items.fieldName].dictItemCode) {
                        isTrue = false
                    }
                })
                if (isTrue) {
                    skuId = element.skuId
                    skuCode = element.skuCode
                }
            })
            this.itemData.skuId = skuId
            this.itemData.skuCode = skuCode
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .SpecList{
        text-align: center;
        .title{
            text-align:center;
            height: 40px;
        }
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
