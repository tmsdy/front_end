<template>
    <el-form :model="ruleForm" onsubmit="return false" :rules="rules" ref="ruleForm" :label-width="labelWidth" :label-position="labelPosition">
        <el-form-item :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()" :style="{'margin-bottom':isProp?0:''}">
            <el-select clearable :disabled="itemData.disabled" v-model="ruleForm.input"  :placeholder="itemData.cnFieldHint" :maxlength="itemData.fieldLength" @change="change" :size="size" :style="{width: rightWidth}">
                <el-option v-for="item in options" :key="item.value" :label="item.itemName" :value="item.dictItemCode+''">
                </el-option>
            </el-select>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Controls-TradeType',
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
    labelPosition: {
      type: String,
      default: 'right'
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
    showLabel: {
      type: Boolean,
      default: true
    },
    dictCode: {
      type: Number,
      default: 0
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data () {
    let _this = this
    return {
      options: [],
      ruleForm: {
        input: parseInt(_this.itemData.inDefaultValue) ? parseInt(_this.itemData.inDefaultValue) : ''
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
  computed: {
    ...mapGetters([
      'sysBoxValue'
    ])
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      let _this = this
      if (this.sysBoxValue instanceof Array) {
        this.sysBoxValue.forEach(element => {
          if (element.dictCode == _this.itemData.dictCode) {
            _this.options = element.dictItems
          }
        })
      }
    },
    change () {
      let newValue = this.ruleForm.input
      newValue = (newValue == -1) ? '' : newValue
      this.$emit('update:controlData', newValue)
      this.$emit('change', newValue)
    },
    updata (isControlData) {
      let _this = this
      if (isControlData) {
        _this.ruleForm.input = _this.itemData.controlData
      } else {
        _this.ruleForm.input = (_this.itemData.fieldValue != []) ? _this.itemData.fieldValue : ''
      }
    },
    clearData () {
      this.$refs['ruleForm'].resetFields()
      if (this.isProp) {
        this.ruleForm.input = ''
      } else {
        this.ruleForm.input = parseInt(this.itemData.inDefaultValue) ? parseInt(this.itemData.inDefaultValue) : ''
      }
    },
    submitForm () {
      let newValue = this.ruleForm.input
      newValue = (newValue == -1) ? '' : newValue
      this.$emit('update:controlData', newValue)
      let isPass = true
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          isPass = false
          return false
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
  beforeDestroy: function () {
    this.getData = null
    this.updata = null
  }
}
</script>
