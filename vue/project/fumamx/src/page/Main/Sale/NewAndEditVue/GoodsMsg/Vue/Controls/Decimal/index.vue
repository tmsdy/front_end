<template>
  <input ref="input" type="number" :disabled="itemData.disabled" v-model="value" @input="doThis" :min="0" :step="showFormat()" :size="size" :style="styleData"/>
</template>

<script>
export default {
  name: 'Controls-Decimal',
  props: {
    itemData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    styleData: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data () {
    return {
      value: ''
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    showFormat() {
      if (this.itemData.showFormat && this.itemData.showFormat != '') {
        let showFormat = this.itemData.showFormat.slice(2)
        return parseFloat(Math.pow((0.1), showFormat.length).toFixed(showFormat.length))
      }
      return 1
    },
    doThis() {
      this.$emit('input', this.$refs.input.value)
    }
  },
  watch: {
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "../zh-cn.less";
@import "../en.less";
</style>
