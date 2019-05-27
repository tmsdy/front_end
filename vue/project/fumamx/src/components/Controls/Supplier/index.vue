<template>
  <el-form :model="ruleForm" onsubmit="return false" :rules="rules" ref="ruleForm" :label-width="labelWidth" :label-position="labelPosition">
    <el-form-item :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()" :style="{'margin-bottom':isProp?0:''}">
      <el-input :disabled="itemData.disabled" v-model="ruleForm.input" :placeholder="itemData.cnFieldHint" :maxlength="itemData.fieldLength" @change="change" :size="size" :style="{width: rightWidth}">
        <!-- <template slot="prepend">Http://</template> -->
      </el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'Controls-Supplier',
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
    rightWidth: {
      type: String,
      default: '160px'
    },
    size: {
      type: String,
      default: 'small'
    },
    labelPosition: {
      type: String,
      default: 'right'
    },
    showLabel: {
      type: Boolean,
      default: true
    }
  },
  data () {
    let _this = this
    let checkWeb = (rule, value, callback) => {
      if (value === '') {
        if (this.itemData.isNotNull == 1) {
          // 请输入
          callback(new Error(this.$t('mxpcweb.basecomponents.1530696912786') + _this.itemData.cnFieldCaption))
        } else {
          callback()
        }
      } else {
        let myreg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/
        if (!myreg.test(value)) {
          // 请输入正确的
          callback(new Error(this.$t('mxpcweb.client.1529044037487') + _this.itemData.cnFieldCaption))
        } else {
          callback()
        }
      }
    }
    return {
      ruleForm: {
        input: _this.itemData.inDefaultValue
      },
      rules: {
        input: [
          { validator: checkWeb, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
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
    clearData () {
      this.$refs['ruleForm'].resetFields()
      this.ruleForm.input = this.itemData.inDefaultValue ? this.itemData.inDefaultValue : ''
      this.checkMsg = -1
    },
    updata () {
      let _this = this
      this.ruleForm.input = (_this.itemData.fieldValue != []) ? _this.itemData.fieldValue : ''
    },
    submitForm () {
      let _this = this
      this.$emit('update:controlData', _this.ruleForm.input)
      let isPass = true
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          isPass = false
          return false
        } else {
          _this.change()
        }
      })
      return isPass
    },
    change () {
      let _this = this
      this.$emit('update:controlData', _this.ruleForm.input)
    }
  }
}
</script>
