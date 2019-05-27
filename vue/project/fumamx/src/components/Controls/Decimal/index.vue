<template>
    <el-form :model="ruleForm" :rules="rules" onsubmit="return false" ref="ruleForm" :label-width="labelWidth" :label-position="labelPosition">
        <el-form-item :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()" :style="{'margin-bottom':isProp?0:''}">
            <input type="number" :disabled="itemData.disabled" v-model="ruleForm.input" @keyup.enter="change()" @blur="change()" :min="0" :step="showFormat()" :style="{width: rightWidth, height: sizeGet(size)}"/>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
  name: 'Controls-Decimal',
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
    }
  },
  data () {
    let _this = this
    return {
      pickerOptions: {},

      ruleForm: {
        input: _this.itemData.inDefaultValue ? _this.itemData.inDefaultValue : 0
      },
      rules: {
        input: [
          // 请输入
          { required: true, message: this.$t('mxpcweb.basecomponents.1530696912786') + _this.itemData.cnFieldCaption, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
  },
  mounted () {
    this.change()
  },
  methods: {
    showFormat() {
      if (this.itemData.showFormat && this.itemData.showFormat != '') {
        let showFormat = this.itemData.showFormat.slice(2)
        return parseFloat(Math.pow((0.1), showFormat.length).toFixed(showFormat.length))
      }
      return 1
    },
    sizeGet (size) {
      if (size == 'mini') {
        return '28px'
      }
      if (size == 'small') {
        return '32px'
      }
      if (size == 'large') {
        return '40px'
      }
    },
    change () {
      let value = this.ruleForm.input != '' ? parseFloat(this.ruleForm.input) : 0
      if (this.itemData.showFormat && this.itemData.showFormat != '') {
        let showFormat = this.itemData.showFormat.slice(2)
        this.ruleForm.input = value.toFixed(showFormat.length)
      }
      this.$emit('update:controlData', value + '')
      this.$emit('change', value + '')
    },
    checkValue() {
      if (this.itemData.showFormat && this.itemData.showFormat != '') {
        let value = this.ruleForm.input
        let valueList = (value + '').split('.')
        let length = 0
        if (valueList.length == 2) {
          length = (value + '').split('.')[1].length
        }
        let showFormat = this.itemData.showFormat.slice(2)
        if (length > showFormat.length) {
          this.ruleForm.input = (value + '').substring(0, (value + '').indexOf('.') + showFormat.length + 1)
        }
      }
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
    updatas (value) {
      if (value) {
        this.ruleForm.input = value
        this.change()
      }
    },
    updata () {
      let _this = this
      this.ruleForm.input = (_this.itemData.fieldValue != []) ? _this.itemData.fieldValue : 0
      this.change()
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
      this.ruleForm.input = this.itemData.inDefaultValue ? this.itemData.inDefaultValue : 0
      this.change()
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  watch: {
    'ruleForm.input': function (val) {
      this.checkValue()
    }
  },
  beforeDestroy: function () {
    this.updatas = null
    this.resetForm = null
    this.sizeGet = null
  }
}
</script>
<style lang="less" scoped>
input{
  height: 32px;
  line-height: 32px;
  border: 1px solid #DFE2E4;
  padding-left: 10px;
  outline:none;
  border-radius: 3px;
}
/* 谷歌 */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
}
/* 火狐 */
input{
    -moz-appearance:textfield;
}
input:focus{
  border: 1px solid #D0021B;
}
</style>
