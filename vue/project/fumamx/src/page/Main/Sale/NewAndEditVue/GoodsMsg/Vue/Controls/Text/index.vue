<template>
  <input ref="input" v-model="value" @input="doThis" :disabled="itemData.disabled" :placeholder="itemData.cnFieldHint" :maxlength="itemData.fieldLength" :size="size" :style="styleData">
</template>

<script>
export default {
  name: 'Controls-Text',
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
  methods: {
    doThis() {
      this.$emit('input', this.$refs.input.value)
    }
  },
  components: {
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../zh-cn.less";
@import "../en.less";
</style>
