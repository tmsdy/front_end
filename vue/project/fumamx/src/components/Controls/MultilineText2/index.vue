<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" onsubmit="return false" :label-width="labelWidth" :label-position="labelPosition">
        <el-form-item :class="[itemData.isNotNull == 1 ? 'is-required' : '']" :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()" :style="{'margin-bottom':isProp?0:''}">
            <el-input :disabled="itemData.disabled" :autosize="{maxRows: 1}" type="textarea" size="small" :rows="1" :maxlength="itemData.fieldLength" :placeholder="itemData.cnFieldHint" v-model="ruleForm.input" @change="change"  :style="{width: rightWidth}"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
  name: 'Controls-MultilineText',
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
    labelPosition: {
      type: String,
      default: 'right'
    },
    size: {
      type: String,
      default: 'small'
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    height: {
      type: Number,
      default: 1
    }
  },
  data () {
    let _this = this
    return {
      pickerOptions: {},

      ruleForm: {
        input: _this.itemData.inDefaultValue ? _this.itemData.inDefaultValue : ''
      },
      rules: {
        input: [
          // 请输入
          { required: true, message: this.$t('mxpcweb.basecomponents.1530696912786') + _this.itemData.cnFieldCaption, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    change () {
      // console.log(" jjj ")
      this.$emit('update:controlData', this.ruleForm.input)
      this.$emit('change', this.ruleForm.input)
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
    updata (value) {
      if (value) {
         this.ruleForm.input = value + ''
      } else {
        this.ruleForm.input = this.itemData.fieldValue + ''
      }
    },
    updatas (value) {
      if (value) {
         this.ruleForm.input = value + ''
         this.change()
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
      this.updata = null
      this.updatas = null
  }
}
</script>
