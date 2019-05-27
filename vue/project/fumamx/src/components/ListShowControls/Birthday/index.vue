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
      let value = this.value.value || ''
      if (value != '') {
        value = value.slice(0, 10)
      }
      return value
    }
  }
}
</script>
