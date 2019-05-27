<template>
    <DialogSetTags ref="dialogSetTags" @UpdataListCenterData="getListData()"></DialogSetTags>
</template>
<script>
import DialogSetTags from '@/components/DialogSetTags/index.vue'
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
        }
    },
    created () {
    },
    methods: {
        getListData() {
        },
        openWindow(obj) {
            let { itemData, billId, optData, next } = obj
            let tags = []
            if (itemData.tags) {
                tags = itemData.tags
            } else {
                tags = []
            }
            if (next) {
                this.getListData = next
            } else {
                this.getListData = function() {}
            }
            this.$refs.dialogSetTags.DialogSetTagShow(billId, tags, optData.optModuleCode, itemData, [])
        }
    },
    watch: {
    },
    components: {
        'DialogSetTags': DialogSetTags
    }
}
</script>
