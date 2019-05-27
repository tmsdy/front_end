<template>
    <el-form :model="ruleForm" onsubmit="return false" :rules="rules" ref="ruleForm" :label-width="labelWidth">
        <el-form-item :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()" :style="{'margin-bottom':isProp?0:''}">
          <drop-down ref="dropDown" labelKey="cnName" valueKey="provinceId" :itemData="itemData" @change="change" :ruleForm="ruleForm" :list="options" :rightWidth="rightWidth" :size="size"></drop-down>
        </el-form-item>
    </el-form>
</template>

<script>
import Dropdown from '../AControlsVue/Dropdown'
export default {
  name: 'Controls-Province',
  props: {
    itemData: {
      type: Object,
      default: function () {
        return {
          cnFieldCaption: '',
          cnFieldHint: '',
          controlTypeId: 41,
          dictCode: 0,
          fieldCategory: 2,
          fieldGroup: 2,
          fieldName: 'twitter',
          inDefaultValue: '',
          isNotNull: 0,
          strucId: 1
        }
      }
    },
    isProp: {
      type: Boolean,
      default: false
    },
    ver: {
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
    dictCode: {
      type: Number,
      default: 0
    },
    size: {
      type: String,
      default: 'small'
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    options: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      ruleForm: {
        input: this.isProp && this.itemData.inDefaultValue ? this.itemData.inDefaultValue + '' : ''
      },
      rules: {
        input: [
          {
            type: 'string',
            required: true,
            // 请选择
            message: this.$t('mxpcweb.basecomponents.1530697172321') + this.itemData.cnFieldCaption,
            trigger: 'change'
          }
        ]
      }
    }
  },
  created () {
  },
  methods: {
    change () {
      let newValue = this.ruleForm.input
      this.$emit('update:controlData', newValue)
      let value = {
        key: this.itemData.fieldName,
        value: newValue == -1 ? '' : newValue
      }
      this.$emit('change', 'province', value)
    },
    clearData () {
      this.$refs['ruleForm'].resetFields()
      if (this.isProp) {
        this.ruleForm.input = ''
      } else {
        this.ruleForm.input = this.itemData.inDefaultValue ? this.itemData.inDefaultValue + '' : ''
      }
      this.$refs.dropDown.clearData()
      this.change()
    },
    clearDatas () {
      this.$refs['ruleForm'].resetFields()
      this.ruleForm.input = ''
      this.change()
    },
    updata (isControlData) {
      if (isControlData) {
        this.ruleForm.input = this.itemData.controlData + ''
      } else {
        if (this.itemData.fieldValue) {
          this.ruleForm.input = (this.itemData.fieldValue != []) ? this.itemData.fieldValue + '' : ''
        }
      }
      this.change()
    },
    submitForm () {
      this.$emit('update:controlData', this.ruleForm.input)
      let isPass = true
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          isPass = false
        }
      })
      return isPass
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
    }
  },
  components: {
    'drop-down': Dropdown
  },
  beforeDestroy: function () {
      this.change = null
      this.updata = null
  }
}
</script>
