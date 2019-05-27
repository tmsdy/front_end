<template>
    <div class="searchLabels">
       <component v-if="list.fieldGroup == 0&&list.controlTypeId==5"  ref="control"  :optCode="optCode"  :moduleCode="moduleCode" v-bind:is="'control'+list.controlTypeId"  @change="change" :isProp="true"  :controlData.sync="list.controlData" :itemData="list" size="mini" rightWidth='120px'></component>
       <component v-else-if="list.fieldGroup == 0&&list.controlTypeId!==5" ref="control"  :optCode="optCode"  :moduleCode="moduleCode"  v-bind:is="'control'+list.controlTypeId"  @change="change"  :isProp="true" :controlData.sync="list.controlData" :itemData="list" size="mini" labelWidth="80px" rightWidth='120px'></component>
       <component v-else v-bind:is="'group'+list.fieldGroup"  ref="control"   :optCode="optCode"  :moduleCode="moduleCode"  :itemData="list"  @change="change"  :isProp="true"  size="mini" labelWidth="80px" rightWidth1='120px' rightWidth='245px'></component>
    </div>
</template>

<script>

import Controls from '@/components/Controls/index.js'
import GroupControls from '@/components/GroupControls/index.js'
export default {
    name: 'searchLabels',
    props: {
        list: {
            type: Object,
            default: function() {
                return {}
            }
        },
        moduleCode: {
            type: String,
            default: ''
        },
        optCode: {
            type: String,
            default: 'otView'
        }
    },
    data() {
        return {
        }
    },
    created() {
    },
    methods: {
        change(value) {
            let newValue
            if (value.key) {
                newValue = {
                    key: value.key,
                    value: value.value == undefined ? '' : value.value
                }
            } else {
                newValue = {
                    key: this.list.fieldName,
                    value: value
                }
            }
            this.$emit('change', newValue, 'row')
        },
        updata(key) {
            if (this.$refs['control']) {
                if (this.list.fieldGroup != '0') {
                    this.$refs['control'].updata(true, key)
                } else if (this.list.fieldName == key) {
                    this.$refs['control'].updata(true)
                }
            }
        },
        clearData () {
            this.$refs['control'].clearData()
        }
    },
    components: Object.assign({

    }, Controls, GroupControls),
    beforeDestroy: function () {
        this.change = null
        this.updata = null
        this.clearData = null
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>

</style>
