<template>
  <document-dropdown
    ref="documentDropdown"
    keyName="custId"
    labelName="custName"
    moduleCode="BF001"
    @change="change"
    @custChange="custChange"
    @isLowerCust="isLowerCust"
    @relyOn="relyOn"
    @returnFieldList="returnFieldList"
    :itemData="itemData"
    :controlData.sync="itemData.controlData"
    :labelPosition="labelPosition"
    :isProp="isProp"
    :labelWidth="labelWidth"
    :rightWidth="rightWidth"
    :dictCode="dictCode"
    :size="size"
    :isLowerCusts="isLowerCusts"
    :showLabel="showLabel">
  </document-dropdown>
</template>

<script>
import DocumentDropdown from '../Controls/DocumentDropdown/index'
export default {
  name: 'Controls-Customer',
  props: {
    itemData: {
      type: Object,
      default: () => {
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
    labelPosition: {
      type: String,
      default: 'right'
    },
    isProp: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    rightWidth: {
      type: String,
      default: '160px'
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    dictCode: {
      type: Number,
      default: 0
    },
    size: {
      type: String,
      default: 'small'
    },
    isLowerCusts: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    updata () {
      this.$refs.documentDropdown.updata()
    },
    updatas (items) {
      this.$refs.documentDropdown.updatas(items)
    },
    updatas1 (items) {
      this.$refs.documentDropdown.updatas1(items)
    },
    submitForm () {
      return this.$refs.documentDropdown.submitForm()
    },
    clearData () {
      console.log(11111111)
      this.$refs.documentDropdown.clearData()
    },
    change(value) {
      this.$emit('change', value)
    },
    custChange (items) {
      this.$emit('custChange', items)
    },
    isLowerCust (value) {
      this.$emit('isLowerCust', value)
    },
    relyOn (value, fieldName) {
      this.$emit('relyOn', value, fieldName)
    },
    returnFieldList (item, list) {
      this.$emit('returnFieldList', item, list)
    }
  },
  components: {
    'document-dropdown': DocumentDropdown
  },
  beforeDestroy: () => {
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
</style>
