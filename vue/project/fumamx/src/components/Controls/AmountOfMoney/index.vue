<template>
  <el-form :model="ruleForm" onsubmit="return false" :rules="rules" ref="ruleForm" :label-width="labelWidth">
      <el-form-item :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()">
          <el-input :disabled="itemData.disabled" v-model="ruleForm.input"  :placeholder="itemData.cnFieldHint" :style="{width: rightWidth }"  @change="change" :size="size"></el-input>
      </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'Controls-AmountOfMoney',
  data () {
    var validatePass = (rule, value, callback) => {
      if (isNaN(value)) {
        // 请输入数值
        callback(new Error(this.$t('mxpcweb.basecomponents.1530696059102')))
      } else {
        if (value < 0) {
          // 金额不能小于0
          callback(new Error(this.$t('mxpcweb.basecomponents.1530697114374')))
        } else {
          callback()
        }
      }
    }
    return {
      ruleForm: {
        input: ''
      },
      rules: {
        input: [
          // 请输入金额
          { type: 'number', required: true, message: this.$t('mxpcweb.basecomponents.1530697132606'), trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    itemData: {
      type: Object,
      default: function () {
        return {}
      }
    },
    isProp: {
      type: Boolean,
      default: false

    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    dictCode: {
      type: Number,
      default: 0
    },
    size: {
      type: String,
      default: 'small'
    },
    rightWidth: {
      type: String,
      default: '160px'
    },
    showLabel: {
      type: Boolean,
      default: true
    }
  },
  created () {},
  methods: {
    updata() {},
    prop () {
      if (this.itemData.disabled) {
        return ''
      };
      if (this.isProp == true) {
        return ''
      } else {
        if (this.itemData.isNotNull == 1) {
          return 'input'
        } else {
          return ''
        }
      }
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
