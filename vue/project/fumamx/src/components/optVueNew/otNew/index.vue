<template>
    <!--跟进-->
    <div>
        <component v-for="(item, index, i) in allOpt" v-bind:is="index" :key="i" :ref="index"></component>
    </div>
</template>
<script>
import add from './add/index.js'
export default {
    name: 'addBill',
    props: {
    },
    data() {
        return {
            thisModuleCode: '',
            allOpt: []
        }
    },
    created () {
    },
    methods: {
        returnCode(code) {
            if (code == 'BF001' || code == 'BF003' || code == 'BF004' || code == 'WO002') {
                return code
            } else {
                return 'other'
            }
        },
        openWindow(obj) {
            if (obj.optData.optModuleCode == 'SC001' || obj.optData.optModuleCode == 'SC002') {
                let newTabName = new Date() * 1 + ''
                this.$router.push('/main/sale/tabs/new/' + obj.optData.optModuleCode + '/' + newTabName)
            } else {
                let _this = this
                let optModuleCode = this.returnCode(obj.optData.optModuleCode)
                if (_this.allOpt[optModuleCode]) {
                    _this.$refs[optModuleCode][0].openWindow(obj)
                } else {
                    let data = {}
                    data[optModuleCode] = '1'
                    _this.allOpt = Object.assign({}, _this.allOpt, data)
                    _this.$nextTick(function() {
                        _this.$refs[optModuleCode][0].openWindow(obj)
                    })
                }
            }
        }
    },
    watch: {
    },
    components: Object.assign({}, add)
}
</script>
