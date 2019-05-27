<template>
    <span :title="returnShow()" :style="returnStyle()">
        {{returnShow()}}
    </span>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'Controls-TradeType',
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
        }
    },
    computed: {
        ...mapGetters([
            'sysBoxValueShow'
        ])
    },
    created() {
    },
    methods: {
        returnShow() {
            let content = ''
            if (!this.value.value || this.value.value == '' || this.itemData.dictCode == '') {
                return content
            }
            if (this.sysBoxValueShow instanceof Object) {
                if (!this.sysBoxValueShow[this.itemData.dictCode]) {
                    content = ''
                } else {
                    let data = this.sysBoxValueShow[this.itemData.dictCode].dictItem[this.value.value]
                    if (data) {
                        content = data.itemName
                    }
                }
            }
            return content
        },
        returnStyle() {
            let style = ''
            if (this.itemData.fieldName && this.itemData.fieldName == 'custState' && this.value.value) {
                let colorData = ['', '', '#FFCE3C', '#00C2B3', '#008cee']
                style = 'color:' + colorData[this.value.value] || ''
            }
            return style
        }
    },
    beforeDestroy: function () {
        this.returnShow = null
        this.returnStyle = null
    }
}
</script>
