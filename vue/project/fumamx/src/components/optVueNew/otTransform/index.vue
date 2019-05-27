<template>
    <component v-if="thisModuleCode!=''" @otNew="otNew" v-bind:is="thisModuleCode" ref="add" moduleCode="BF001" @getListData="getListData"></component>
</template>
<script>
import add from '../otNew/add/index.js'
export default {
    name: 'addShare',
    props: {
    },
    data() {
        return {
            thisModuleCode: 'BF001'
        }
    },
    created () {
    },
    methods: {
        otNew(type) {
            this.$emit('otNew', type)
        },
        getListData() {
            this.$emit('getListData')
        },
        openWindow(obj) {
            let otherObjs = []
            if (obj.itemData.custName) {
                otherObjs.push({
                    value: obj.itemData.custName,
                    fieldName: 'custName',
                    model: 'BF001',
                    disable: false
                })
            }
            if (obj.itemData.mailAddress) {
                otherObjs.push({
                    value: obj.itemData.mailAddress,
                    fieldName: 'mailAddress',
                    model: 'BF003',
                    disable: false
                })
            }
            if (obj.itemData.contName) {
                otherObjs.push({
                    value: obj.itemData.contName,
                    fieldName: 'contName',
                    model: 'BF003',
                    disable: false
                })
            }
            if (obj.itemData.mobile) {
                otherObjs.push({
                    value: obj.itemData.mobile,
                    fieldName: 'mobile',
                    model: 'BF003',
                    disable: false
                })
            }
            if (obj.itemData.ownerCtId) {
                otherObjs.push({
                    value: obj.itemData.ownerCtId,
                    fieldName: 'ownerCtId',
                    model: 'BF003',
                    disable: false
                })
            }
            if (obj.itemData.ownerDeptKey) {
                otherObjs.push({
                    value: obj.itemData.ownerDeptKey,
                    fieldName: 'ownerDeptKey',
                    model: 'BF003',
                    disable: false
                })
            }
            if (obj.itemData.ownerCtId) {
                otherObjs.push({
                    value: obj.itemData.ownerCtId,
                    fieldName: 'ownerCtId',
                    model: 'BF001',
                    disable: false
                })
            }
            if (obj.itemData.ownerDeptKey) {
                otherObjs.push({
                    value: obj.itemData.ownerDeptKey,
                    fieldName: 'ownerDeptKey',
                    model: 'BF001',
                    disable: false
                })
            }
            obj.otherObjs = otherObjs
            this.$refs.add.openWindow(obj)
        },
        upList(obj) {
            this.$refs.add.upList(obj)
        }
    },
    watch: {
    },
    components: Object.assign({}, add)
}
</script>
