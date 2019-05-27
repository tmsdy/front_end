<template>
    <el-form :model="ruleForm" :rules="rules" onsubmit="return false" ref="ruleForm" :label-width="labelWidth" :label-position="labelPosition">
        <el-form-item :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()" :style="{'margin-bottom':isProp?0:''}">
          <drop-down ref="dropDown" labelKey="realName" valueKey="ctId" inUse :itemData="itemData" @change="change" :ruleForm="ruleForm" :list="options1" :rightWidth="rightWidth" :size="size"></drop-down>
        </el-form-item>
    </el-form>
</template>

<script>
import Dropdown from '../AControlsVue/Dropdown'
export default {
  name: 'Controls-Owner',
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
    showLabel: {
      type: Boolean,
      default: true
    },
    isProp: {
      type: Boolean,
      default: false
    },
    labelPosition: {
      type: String,
      default: 'right'
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
    options: {
      type: Array,
      default: function () {
        return []
      }
    },
    moduleCode: {
      type: String,
      default: ''
    },
    optCode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      options1: [],
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
  created () {
  },
  mounted () {
    this.getTable()
    if (this.ruleForm.input != '') {
      this.change(true)
    }
  },
  methods: {
    getTable () {
      let contactData = {
        dataType: 'contact',
        funType: 'withRight',
        moduleCode: this.moduleCode,
        optCode: this.optCode
      }
      this.$http
        .get(this.Global.baseURL + this.Global.api.v2.accountDropList_get, {
          params: contactData
        })
        .then((res) => {
            if (res.body.code.toString() == this.Global.RES_OK) {
              let list = JSON.parse(JSON.stringify(res.body.data || []))
              list.forEach(element => {
                if (!element.realName) {
                  element.realName = ''
                }
              })
              this.options1 = list
            } else {
              this.$message.error(this.msg(res.body))
            }
          }, (res) => {
            this.$message.error(this.$t(this.Global.errorTitle))
          }
        )
    },
    change (updata) {
      let newValue = this.ruleForm.input
      newValue = newValue == -1 ? '' : newValue
      this.$emit('ownerChange', newValue, updata)
      this.$emit('update:controlData', newValue)
      let value = {
        key: this.itemData.fieldName,
        value: newValue
      }
      this.$emit('change', value)
    },
    ownerChange (newValue) {
      this.$emit('ownerChange', newValue)
    },
    updata (isControlData) {
      if (isControlData) {
        this.ruleForm.input = this.itemData.controlData + ''
      } else {
        this.ruleForm.input = (this.itemData.fieldValue != [] && this.itemData.fieldValue != undefined) ? this.itemData.fieldValue + '' : ''
      }
      this.change()
    },
    updatas (items) {
      this.ruleForm.input = items
      this.change()
    },
    clearData () {
      this.$refs['ruleForm'].resetFields()
      this.ruleForm.input = this.itemData.inDefaultValue ? this.itemData.inDefaultValue + '' : ''
      this.change()
      this.$refs.dropDown.clearData()
    },
    clearDatas () {
      this.$refs['ruleForm'].resetFields()
      this.ruleForm.input = ''
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
      let list = JSON.parse(JSON.stringify(val || []))
      list.forEach(element => {
        if (!element.realName) {
          element.realName = ''
        }
      })
      this.options1 = list
    }
  },
  components: {
    'drop-down': Dropdown
  },
  beforeDestroy: function () {
      this.options1 = []
      this.change = null
      this.ownerChange = null
      this.updata = null
      this.updatas = null
  }
}
</script>
<style lang="less" scoped>
</style>
