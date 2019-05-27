<template>
  <el-select class="goodsSelect" ref="input" v-model="value" @change="doThis" filterable  :disabled="itemData.disabled" clearable :placeholder="itemData.cnFieldHint" :size="size" :style="styleData">
      <template v-for="item in unitList">
        <el-option :label="item.name" :value="item.unitId+''" :key="item.unitId">
        </el-option>
      </template>
  </el-select>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Controls-SystemDownBox',
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
      default: 'mini'
    }
  },
  data () {
    return {
      value: ''
    }
  },
  computed: {
      ...mapGetters('goods', [
          'unitList'
      ])
  },
  created () {
  },
  mounted() {
  },
  methods: {
    doThis() {
      this.$emit('input', this.$refs.input.value)
    }
  },
  watch: {
  }
}
</script>
<style>
    .goodsSelect>.el-input--mini>input{
        -moz-appearance:textfield;
        border: 1px solid white;
        color:#222;
        height: 24px;
        padding-right: 24px;
        font-size: 12px;
    }
    .goodsSelect>.el-input--mini>i.el-input__icon, .el-select .el-input .el-input__icon.is-show-close{
        color:#c0c4cc;
        width: 12px;
        height: 12px;
        line-height: 12px;
        font-size: 12px;
        right: 5px;
        top: 13px;
    }
    .goodsSelect>.el-input--mini>input:focus{
        border: 1px solid rgb(0, 140, 238);
    }
    .goodsSelect>.el-input--mini:hover>input{
        border: 1px solid rgb(0, 140, 238);
    }
    .goodsSelect>.el-input--mini>input::-webkit-input-placeholder{
        color:#c0c4cc;
    }
    /* .goodsSelect>.el-input--mini>input::-moz-placeholder{
        color:#D0021B;
    }
    .goodsSelect>.el-input--mini>input:-moz-placeholder{
        color:#D0021B;
    }
    .goodsSelect>.el-input--mini>input:-ms-input-placeholder{
        color:#D0021B;
    } */
</style>
