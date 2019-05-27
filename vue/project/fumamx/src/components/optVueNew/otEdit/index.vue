<template>
    <listEdit ref="listEdit"></listEdit>
</template>
<script>
import listEdit from './listEdit/index'
export default {
    name: 'otEdit',
    props: {
    },
    data() {
        return {
        }
    },
    created () {
    },
    methods: {
        openWindow(obj) {
            if (obj.optData.optModuleCode == 'SC001' || obj.optData.optModuleCode == 'SC002') {
                if (obj.billId && obj.billId != '') {
                    this.$router.push('/main/sale/tabs/edit/' + obj.optData.optModuleCode + '/' + obj.billId)
                } else {
                    this.$message('未检测到id，请重试！')
                }
            } else {
                this.$refs.listEdit.openEidt(obj)
            }
        }
    },
    watch: {
    },
    components: {
        'listEdit': listEdit
    }
}
</script>
