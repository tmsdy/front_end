<template>
<span class="FieldEdit" @click.stop>
    <component v-if="fieldData.controlTypeId" v-bind:is="'control'+fieldData.controlTypeId" ref="control" @input="change" @change="change" v-model="itemData[fieldData.fieldName]" :itemData="fieldData" :valueData="itemData"></component>
</span>
</template>

<script>
import ListShow from '../Controls/index'
export default {
    name: 'FieldEdit',
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
        },
        indexId: {
            type: [String, Number],
            default: ''
        }
    },
    data() {
        return {
        }
    },
    methods: {
        change(val) {
            this.$emit('change', this.indexId, this.fieldData.fieldName)
        }
    },
    components: Object.assign({
    }, ListShow),
    watch: {
    }
}
</script>
