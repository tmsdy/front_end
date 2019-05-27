<template>
    <el-form :model="ruleForm" onsubmit="return false" :rules="rules" ref="ruleForm" :label-width="labelWidth" :label-position="labelPosition">
        <el-form-item :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()" :style="{'margin-bottom':isProp?0:''}">
            <el-input disabled v-model="ruleForm.input"  :placeholder="itemData.cnFieldHint"  :style="{width: rightWidth}" @change="change" :size="size"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
  name: 'Controls-AutoNumber',
  data () {
    let _this = this
    return {
      options: [],
      ruleForm: {
        input: _this.isProp && _this.itemData.inDefaultValue ? _this.itemData.inDefaultValue + '' : ''
      },
      rules: {
        input: [
          {
            type: 'string',
            required: true,
            // 请选择
            message: this.$t('mxpcweb.basecomponents.1530697172321') + _this.itemData.cnFieldCaption,
            trigger: 'change'
          }
        ]
      }
    }
  },
  props: {
    size: {
      type: String,
      default: 'small'
    },
    rightWidth: {
      type: String,
      default: '160px'
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    itemData: {
      type: Object,
      default: function () {
        return {}
      }
    },
    labelPosition: {
      type: String,
      default: 'right'
    },
    isProp: {
      type: Boolean,
      default: false
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    isRow: {
      type: Boolean,
      default: false
    }
  },
  created () {

  },
  methods: {
    change () {
      let value = ''
      if (this.ruleForm.input != 0) {
        value = this.ruleForm.input
      } else {
        value = ''
      }
      this.$emit('update:controlData', value + '')
      this.$emit('change', value + '')
    },
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
    updata () {
      let _this = this
      this.ruleForm.input = (_this.itemData.fieldValue != []) ? _this.itemData.fieldValue : ''
    },
    updatas (value) {
      if (value) {
        this.ruleForm.input = value
      }
    },
    submitForm () {
      let _this = this
      let isPass = true
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          isPass = false
        } else {
          _this.change()
        }
      })
      return isPass
    },
    clearData () {
      this.$refs['ruleForm'].resetFields()
      this.ruleForm.input = this.itemData.inDefaultValue ? this.itemData.inDefaultValue : ''
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  beforeDestroy: function () {
    this.resetForm = null
    this.updatas = null
  }
}
</script>
