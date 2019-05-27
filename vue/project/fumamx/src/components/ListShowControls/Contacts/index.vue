<template>
    <span :title="name">
      {{name}}
    </span>
</template>

<script>
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
    list: {
      type: Object,
      default: function () {
        return {}
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
      name: ''
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
    this.returnShow ()
  },
  methods: {
    returnShow () {
      if (this.list && this.list.contName && this.list.contName != '') {
        this.name = this.list.contName
        return false
      }
      if (this.value.value && this.value.value != '') {
        let _this = this
        _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.document_generalOperate_get, { params: {
          moduleCode: 'BF003',
          searchType: 'detail',
          identFieldValue: _this.value.value
        } }).then((res) => {
          if (res.body.code.toString() == _this.Global.RES_OK) {
            _this.name = res.body.data.contName
          } else {
            _this.name = ''
          }
        }, (res) => {
          _this.name = ''
        })
      }
    }
  },
  beforeDestroy: function () {
    this.returnShow = null
  },
  watch: {
    list (val) {
        this.returnShow()
    }
  }
}
</script>
