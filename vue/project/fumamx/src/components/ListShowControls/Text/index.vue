<template>
  <span :title="returnShow()">
    {{returnShow()}}
  </span>
</template>

<script>
export default {
  name: 'Controls-Text',
  props: {
    value: {
      type: Object,
      default: function () {
        return {
          value: ''
        }
      }
    },
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
    }
  },
  methods: {
    returnShow () {
      let value = this.value.value
      let value1 = ''
      value = value && value != '' && value != 'undefined' ? value : ''
      if (this.itemData.fieldName == 'dynamics' && value != '') {
        value = JSON.parse(value).content
      }
      value1 = value && value != '' && value != 'undefined' ? value : ''
      return value1
    }
  }
}
</script>
