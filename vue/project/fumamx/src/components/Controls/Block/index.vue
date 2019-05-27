<template>
    <div></div>
    <!-- <el-input placeholder="请输入内容" v-model="input1" :disabled="true" style="width: 100%;" @change="change" :size="size"></el-input> -->
</template>

<script>
export default {
  name: 'Controls-Block',
  props: {
    dictCode: {
      type: Number,
      default: 0
    },
    type: {
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
      input1: ''
    }
  },
  created () {
    if (this.dictCode != 0) {
      this.getData()
    }
  },
  methods: {
    getData () {

    },
    change (newValue) {
      this.$emit('update:controlData', newValue)
    }
  },
  beforeDestroy: function () {
    this.change = null
  }
}
</script>
