
<template>
    <el-form :model="ruleForm" onsubmit="return false" :rules="rules" ref="ruleForm" :label-width="labelWidth" :label-position="labelPosition">
        <el-form-item :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()" :style="{'margin-bottom':isProp?0:''}">
            <el-select  :disabled="itemData.disabled" v-if="isProp" v-model="ruleForm.input"  :placeholder="itemData.cnFieldHint" :maxlength="itemData.fieldLength" @change="change" :size="size" :style="{width: rightWidth}">
                <el-option :label="$t('mxpcweb.client.1529060999660')" value="">
                </el-option>
                <el-option v-for="item in getData()" :key="item.value" :label="item.itemName" :value="item.dictItemCode+''">
                </el-option>
            </el-select>
            <el-select clearable :disabled="itemData.disabled" v-else v-model="ruleForm.input" filterable multiple :placeholder="itemData.cnFieldHint" :maxlength="itemData.fieldLength" @change="change" :size="size" :style="{width: rightWidth}">
                <el-option v-for="item in getData()" :key="item.value" :label="item.itemName" :value="item.dictItemCode+''" v-show="item.inUse=='1'">
                </el-option>
            </el-select>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Controls-SystemDownBox',
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
        input: _this.isProp && _this.itemData.inDefaultValue.split(',') ? _this.itemData.inDefaultValue.split(',') : []
      },
      rules: {
        input: [
          {
            type: 'array',
            required: true,
            // '请选择'
            message: _this.$t('mxpcweb.basecomponents.1530697172321') + _this.itemData.cnFieldCaption,
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'cusBoxValue'
    ])
  },
  created () {
  },
  methods: {
    getData () {
      let _this = this
      let options = []
      if (this.cusBoxValue instanceof Array) {
        this.cusBoxValue.forEach(element => {
          if (element.dictCode == _this.itemData.dictCode) {
            options = element.customDictitems
          }
        })
      }
      return options
    },
    change () {
      let newValue = this.ruleForm.input.join(',')
      newValue = (newValue == -1) ? 0 : newValue
      this.$emit('update:controlData', newValue)
      this.$emit('change', newValue)
    },
    updata (isControlData) {
      let _this = this
      if (isControlData) {
        _this.ruleForm.input = _this.itemData.controlData.split(',')
      } else {
        _this.ruleForm.input = (_this.itemData.fieldValue != []) ? _this.itemData.fieldValue.split(',') : []
      }
    },
    updatas (value) {
      let _this = this
      _this.ruleForm.input = value.split(',')
    },
    clearData () {
      this.$refs['ruleForm'].resetFields()
      if (this.isProp) {
        this.ruleForm.input = []
      } else {
        this.ruleForm.input = this.itemData.inDefaultValue ? this.itemData.inDefaultValue.split(',') : []
      }
    },
    submitForm () {
      let newValue = this.ruleForm.input.join(',')
      newValue = (newValue == -1) ? 0 : newValue
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
    // cusBoxValue(){
    //   this.getData();
    // }
  },
  beforeDestroy: function () {
    this.getData = null
    this.updata = null
    this.updatas = null
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>

</style>
