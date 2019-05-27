<template>
    <el-form :model="ruleForm" :rules="rules" onsubmit="return false" ref="ruleForm" :label-width="labelWidth" :label-position="labelPosition">
        <el-form-item :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()">
            <el-select clearable :disabled="itemData.disabled" v-model="ruleForm.sexVal" :placeholder="itemData.cnFieldHint" size="small" @change="change" :style="{width: rightWidth}">
                <!-- 男 -->
                <el-option :label="$t('mxpcweb.client.1529062521545')" value="1"></el-option>
                <!-- 女 -->
                <el-option :label="$t('mxpcweb.client.1529062557803')" value="2"></el-option>
                <!-- 未知 -->
                <el-option :label="$t('mxpcweb.client.1529062571774')" value="0"></el-option>
            </el-select>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
  name: 'Controls-Sex',
  props: {
    isProp: {
      type: Boolean,
      default: false
    },
    rightWidth: {
      type: String,
      default: '160px'
    },
    labelPosition: {
      type: String,
      default: 'right'
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    itemData: {
      type: Object,
      default: function () {
        return {}
      }
    },
    showLabel: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      pickerOptions: {},

      ruleForm: {
        sexVal: !this.isProp && this.itemData.inDefaultValue ? this.itemData.inDefaultValue + '' : ''
      },
      rules: {
        sexVal: [
          // 请选择
          { required: true, message: this.$t('mxpcweb.basecomponents.1530697172321') + this.itemData.cnFieldCaption, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 修改数据时调用，用于更新传入的数据
    updata () {
      this.ruleForm.sexVal = this.itemData.fieldValue != undefined ? this.itemData.fieldValue + '' : ''
    },
    prop () {
      if (this.itemData.disabled) {
        return ''
      };
      if (this.isProp == true) {
        return ''
      } else {
        if (this.itemData.isNotNull == 1) {
          return 'sexVal'
        } else {
          return ''
        }
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
    resetForm () {
      this.$refs.ruleForm.resetFields()
    },
    clearData () {
      this.ruleForm.sexVal = ''
      this.$refs['ruleForm'].resetFields()
    },
    change () {
      this.$emit('update:controlData', this.ruleForm.sexVal)
    }
  }
}
</script>
