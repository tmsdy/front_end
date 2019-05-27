<template>
    <span :title="returnShow()">
        {{returnShow()}}
    </span>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'Controls-Radio',
    props: {
        itemData: {
            type: Object,
            default: function () {
                return {
                    cnFieldCaption: '',
                    cnFieldHint: '',
                    controlTypeId: 41,
                    dictCode: 0,
                    fieldCategory: 2,
                    fieldGroup: 2,
                    fieldName: 'twitter',
                    inDefaultValue: '',
                    isNotNull: 0,
                    strucId: 1
                }
            }
        },
        value: {
            type: Object,
            default: function () {
                return {
                    value: ''
                }
            }
        }
    },
    data() {
        return {
            radio2: 3
        }
    },
    created() {

    },
    computed: {
        ...mapGetters([
            'sysBoxValueShow'
        ])
    },
    methods: {
        returnShow() {
            let content = ''
            if (!this.value.value || this.value.value == '' || this.itemData.dictCode == '') {
                return content
            }
            if (this.sysBoxValueShow instanceof Object) {
                let data = this.sysBoxValueShow[this.itemData.dictCode].dictItem[this.value.value]
                if (data) {
                    content = data.itemName
                }
            }
            return content
        }
    }
}
</script>
