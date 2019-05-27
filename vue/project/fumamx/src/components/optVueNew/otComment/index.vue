<template>
    <DialogMailComment ref="DialogMailComment" @getListData="getListData()"></DialogMailComment>
</template>
<script>
import DialogMailComment from '@/components/DialogMailComment/index'
export default {
    name: 'addShare',
    props: {
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
            let { itemData, billId, billName, moduleCode, next } = obj
            if (next) {
                this.callback = next
            } else {
                this.callback = function() {}
            }
            this.$refs.DialogMailComment.isDialog('open', this.$t('mxpcweb.client.1529049476377'), moduleCode, billId, billName, itemData)
        }
    },
    watch: {
    },
    components: {
        'DialogMailComment': DialogMailComment
    }
}
</script>
