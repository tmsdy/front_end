<template>
    <AddMsg ref="setMsg" @getListData="getListData()"></AddMsg>
</template>
<script>
import AddMsg from '@/components/AddMsg/index'
export default {
    name: 'addShare',
    props: {
        pageId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            callback: function() {}
        }
    },
    created () {
    },
    methods: {
        getListData() {
            this.callback()
        },
        openWindow(obj) {
            let { itemData, billId, moduleCode, next } = obj
            if (next) {
                this.callback = next
            } else {
                this.callback = function() {}
            }
            if (itemData && billId && moduleCode) {
                this.$refs.setMsg.showDialog(true, billId, moduleCode, itemData)
            } else {
                this.$refs.setMsg.showDialog(false, billId, moduleCode, itemData)
            }
        }
    },
    watch: {
    },
    components: {
        'AddMsg': AddMsg
    }
}
</script>
