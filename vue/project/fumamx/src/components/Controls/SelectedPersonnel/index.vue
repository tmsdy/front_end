<template>
    <el-select clearable :disabled="itemData.disabled" v-model="value5" multiple :placeholder="cnFieldHint" style="width:100%;" :size="size">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
</template>
<script>
export default {
  name: 'Controls-SelectedPersonnel',
  props: {
    dictCode: {
      type: Number,
      default: 0
    },
    cnFieldHint: {
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
      options: [],
      value5: []
    }
  },
  methods: {
    change (newValue) {
      this.$emit('update:controlData', newValue)
    }
  },
  beforeDestroy: function () {
    this.change = null
  }
}
</script>
