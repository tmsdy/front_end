<template>
  <span :title="returnShow()">
    {{'ownerCtId' == itemData.fieldName && 'WO001' == moduleCode ? accountInfo.realName : returnShow()}}
  </span>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Controls-Text',
  props: {
    value: {
      type: Object,
      default: function () {
        return {value: ''}
      }
    },
    itemData: {
      type: Object,
      default: function () {
        return {}
      }
    },
    moduleCode: {
      type: String,
      default: ''
    },
    accountInfo: {
      type: Object,
      default: function () {
        return {}
      }
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
  computed: {
    ...mapGetters([
      'contactList'
    ])
  },
  methods: {
    returnShow () {
      let content = ''
      if (!this.value.value || this.value.value == '') {
        return content
      }
      if (this.contactList instanceof Object) {
        content = this.contactList[this.value.value] || ''
      }
      return content
    }
  },
  beforeDestroy: function () {
    this.returnShow = null
  }
}
</script>
