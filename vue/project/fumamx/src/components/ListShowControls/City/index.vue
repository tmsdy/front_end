<template>
    <span :title="content">
      {{content}}
    </span>
</template>

<script>
export default {
  name: 'Controls-TradeType',
  props: {
    items: {
      type: Object,
      default: () => {
        return {}
      }
    },
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
    value: {
      type: Object,
      default: () => {
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
  },
  created () {
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.content = ''
      if (this.value.value != '' && this.items.provinceId && this.items.provinceId != '') {
        this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.enterpriseset.areaInf, { params: { id: this.items.provinceId, type: 'city' } }).then((res) => {
          if (res.body.code.toString() === this.Global.RES_OK) {
            res.body.data.forEach(element => {
              if (element.cityId == this.value.value) {
                this.content = element.cnName
              }
            })
          }
        })
      }
    }
  },
  watch: {
    value(val) {
      this.getData()
    }
  }
}
</script>
