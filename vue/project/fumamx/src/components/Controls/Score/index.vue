<template>
  <el-form :model="ruleForm" onsubmit="return false" :rules="rules" ref="ruleForm" :label-width="labelWidth" :label-position="labelPosition">
    <el-form-item :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()" :style="{'margin-bottom':isProp?0:''}">
      <el-rate style="float:left;padding-top:8px;" v-model="ruleForm.input" :texts="evaluateText" text-color="rgb(247, 186, 42)" show-text></el-rate>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'Controls-Score',
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
    var checkScore = (rule, value, callback) => {
      if (value === '' || value === 0) {
        if (this.itemData.isNotNull == 1) {
          // 请输入
          callback(new Error(this.$t('mxpcweb.basecomponents.1530696912786') + _this.itemData.cnFieldCaption))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        input: _this.itemData.inDefaultValue == '' ? 0 : _this.itemData.inDefaultValue
      },
      rules: {
        input: [
          // 请选择
          { validator: checkScore, message: this.$t('mxpcweb.basecomponents.1530697172321') + _this.itemData.cnFieldCaption, trigger: 'change' }
        ]
      },
      // 1.0  产品功能差, '2.0  产品功能一般', '3.0  产品功能还行', '4.0  产品很稳定，愿意推荐', '5.0  产品很好用，非常愿意推荐'
      evaluateText: [this.$t('mxpcweb.systemset.feedback.1529066792860'), this.$t('mxpcweb.systemset.feedback.1529066807345'), this.$t('mxpcweb.systemset.feedback.1529066810103'), this.$t('mxpcweb.systemset.feedback.1529066818838'), this.$t('mxpcweb.systemset.feedback.1529066839511')]
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
      this.ruleForm.input = this.itemData.inDefaultValue ? this.itemData.inDefaultValue : 0
      this.checkMsg = -1
    },
    updata () {
      let _this = this
      this.ruleForm.input = (_this.itemData.fieldValue != []) ? _this.itemData.fieldValue : 0
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
