<template>
    <el-form :model="ruleForm" onsubmit="return false" :rules="rules" ref="ruleForm" :label-width="labelWidth" :label-position="labelPosition">
        <el-form-item :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()" :style="{'margin-bottom':isProp?0:''}">
            <drop-down ref="dropDown" labelKey="name" valueKey="currencyCode" :itemData="itemData" @change="change" :ruleForm="ruleForm" :list="currency" :rightWidth="rightWidth" :size="size"></drop-down>
        </el-form-item>
    </el-form>
</template>

<script>
import Dropdown from '../AControlsVue/Dropdown'
import { mapGetters } from 'vuex'
export default {
  name: 'Controls-SystemDownBox',
  props: {
    itemData: {
      type: Object,
      default: () => {
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
    moduleCode: {
        type: String,
        default: ''
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data () {
    return {
      inputBase: !this.isProp && this.itemData.inDefaultValue ? this.itemData.inDefaultValue + '' : '',
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
      }
    }
  },
  computed: {
      ...mapGetters('goods', [
          'currency'
      ])
  },
  created () {
  },
  mounted() {
    this.getCurrencyData()
  },
  methods: {
    getCurrencyData () {
      if (this.inputBase != '' && this.itemData.fieldName == 'saleCur') {
        this.currency.forEach(item => {
          if (item.currencyCode == this.inputBase) {
            this.$emit('selectStruId4', {saleCur: item.name})
          }
        })
      }
    },
    change () {
      let newValue = this.ruleForm.input
      newValue = (newValue == -1) ? '' : newValue
      this.$emit('update:controlData', newValue)
      this.$emit('change', newValue)
      if (this.moduleCode == 'SC001' || this.moduleCode == 'SC002') {
        if (newValue == '') {
          this.$emit('CurrencyChange', '')
        } else {
          this.currency.forEach(item => {
            if (item.currencyCode == newValue) {
                this.$emit('CurrencyChange', item)
            }
          })
        }
      }
      if (this.itemData.fieldName == 'saleCur') {
        // console.log(newValue)
        if (newValue == '') {
          this.$emit('selectStruId4', newValue)
        } else {
          if (this.currency.length == '0') {
            this.inputBase = newValue
          } else {
            this.currency.forEach(item => {
              if (item.currencyCode == newValue) {
                this.$emit('selectStruId4', {saleCur: item.name})
              }
            })
          }
        }
      }
    },
    updata (isControlData, value) {
      if (value) {
         this.ruleForm.input = value + ''
      } else if (isControlData) {
        this.ruleForm.input = this.itemData.controlData + ''
      } else {
        this.ruleForm.input = (this.itemData.fieldValue != []) ? this.itemData.fieldValue + '' : ''
      }
      this.change()
    },
    updatas (value) {
      this.ruleForm.input = value + ''
      this.change()
    },
    clearData () {
      this.$refs['ruleForm'].resetFields()
      if (this.isProp) {
        this.ruleForm.input = ''
      } else {
        this.ruleForm.input = this.itemData.inDefaultValue ? this.itemData.inDefaultValue + '' : ''
      }
      this.$refs.dropDown.clearData()
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
  watch: {
  },
  components: {
    'drop-down': Dropdown
  },
  beforeDestroy: () => {
    this.updata = null
    this.updatas = null
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>

</style>
