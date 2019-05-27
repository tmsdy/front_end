<template>
    <span :title="returnShow()">
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
  data () {
    return {
      options: []
    }
  },
  computed: {
    ...mapGetters([
      'sysBoxValue'
    ])
  },
  created () {
  },
  methods: {
    returnShow () {
      let _this = this
      let content = ''
      if (_this.value.value == '' || _this.itemData.dictCode == '') {
        return content
      };
      if (this.sysBoxValue instanceof Array) {
        this.sysBoxValue.forEach(element => {
          if (element.dictCode == _this.itemData.dictCode) {
            element.dictItems.forEach(elements => {
              if (_this.value.value == elements.dictItemCode) {
                content = elements.itemName
              }
            })
          }
        })
      }
      return content
    },
    returnStyle () {
      let style = ''
      if (this.itemData.fieldName == 'custState') {
        let colorData = ['', '', '#009900', 'red', '#008cee']
        style = 'color:' + colorData[this.value]
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
