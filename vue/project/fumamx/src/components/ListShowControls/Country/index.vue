<template>
    <span :title="content">
      {{content}}
    </span>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { getCountryList } from '@/page/Main/Client/mixins/index.js'
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
  data () {
    return {
      content: ''
    }
  },
  computed: {
    ...mapGetters('client', [
        'countryList'
    ])
  },
  created () {
    if (this.countryList.length > 0) {
      this.returnShow()
    } else {
      this.getCountryList(this.getCountryData)
    }
  },
  methods: {
    getCountryData (list) {
      this.returnShow()
    },
    getCountryList,
    // 同步设置
    ...mapMutations('client', {
        set_countryList: 'SET_COUNTRYLIST'
    }),
    returnShow () {
      let content = ''
      if (this.value.value != '' && this.countryList instanceof Array) {
        this.countryList.forEach(element => {
          if (this.value.value == element.countryId) {
            content = element.cnName
          }
        })
      }
      this.content = content
    }
  },
  watch: {
    value(val) {
      this.returnShow()
    }
  },
  beforeDestroy: function () {
    this.returnShow = null
  }
}
</script>
