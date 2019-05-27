<template>
    <el-form :model="ruleForm" onsubmit="return false" :rules="rules" ref="ruleForm" :label-width="labelWidth" :label-position="labelPosition">
        <el-form-item :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()"  :style="{'margin-bottom':isProp?0:''}">
          <drop-down ref="dropDown" labelKey="deptName" valueKey="dkey" inUse :itemData="itemData" @change="change" :ruleForm="ruleForm" :list="options1" :rightWidth="rightWidth" :size="size"></drop-down>
        </el-form-item>
    </el-form>
</template>

<script>
import Dropdown from '../AControlsVue/Dropdown'
export default {
  name: 'Controls-SubordinateDepartme',
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
    dictCode: {
      type: Number,
      default: 0
    },
    size: {
      type: String,
      default: 'small'
    },
    options: {
      type: Array,
      default: function () {
        return []
      }
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    moduleCode: {
      type: String,
      default: ''
    },
    isIndependent: {
      type: Boolean,
      default: false
    },
    optCode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      ruleForm: {
        input: !this.isProp && this.itemData.inDefaultValue ? this.itemData.inDefaultValue + '' : ''
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
      },
      options1: []
    }
  },
  created () {
    if (this.isIndependent) {
      this.getTable()
    }
  },
  methods: {
    getTable () {
      let contactData = {
        dataType: 'department',
        funType: 'withRight',
        deptCascade: false,
        moduleCode: this.moduleCode,
        optCode: this.optCode
      }
      this.$http
        .get(this.Global.baseURL + this.Global.api.v2.accountDropList_get, {
          params: contactData
        })
        .then((res) => {
            if (res.body.code.toString() == this.Global.RES_OK) {
              this.options1 = []
              this.options1 = res.body.data
            } else {
              this.$message.error(this.msg(res.body))
            }
          }, (res) => {
            this.$message.error(this.$t(this.Global.errorTitle))
          }
        )
    },
    change () {
      let newValue = this.ruleForm.input
      newValue = newValue == -1 ? '' : newValue
      this.$emit('update:controlData', newValue)
      let value = {
        key: this.itemData.fieldName,
        value: newValue == -1 ? '' : newValue
      }
      this.$emit('change', value)
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
    clearDatas (updata) {
      this.$refs['ruleForm'].resetFields()
      if (updata) {
        this.ruleForm.input = this.itemData.inDefaultValue ? this.itemData.inDefaultValue + '' : ''
      } else {
        this.ruleForm.input = ''
      }
      this.change()
    },
    updatas (items) {
      this.ruleForm.input = items
      this.change()
    },
    updata (isControlData) {
      if (isControlData) {
        this.ruleForm.input = this.itemData.controlData + ''
      } else {
        this.ruleForm.input = (this.itemData.fieldValue != [] && this.itemData.fieldValue != undefined) ? this.itemData.fieldValue + '' : ''
      }
      this.change()
    },
    submitForm () {
      let isPass = true
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          // return true;
          this.$emit('update:controlData', this.ruleForm.input)
        } else {
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
  watch: {
    options (val) {
      this.options1 = []
      this.options1 = val
    }
  },
  components: {
    'drop-down': Dropdown
  },
  beforeDestroy: function () {
    this.options1 = []
    this.change = null
    this.clearDatas = null
    this.updatas = null
    this.updata = null
  }
}
</script>
