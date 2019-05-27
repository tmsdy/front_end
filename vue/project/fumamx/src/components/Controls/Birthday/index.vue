
<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-width="labelWidth" :label-position="labelPosition">
        <el-form-item :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()" :style="{'margin-bottom':isProp?0:''}">
            <div v-if="isProp">
              <!-- 起始时间 -->
                <el-date-picker :disabled="itemData.disabled" v-model="ruleForm.value1" :style="{width: rightWidth }" type="date" :placeholder="$t('mxpcweb.client.1529061178759')" format="yyyy-MM-dd" :size="size" @change="change1"></el-date-picker>
                <!-- 结束时间 -->
                <el-date-picker :disabled="itemData.disabled" v-model="ruleForm.value2" type="date" :style="{width: rightWidth }" :placeholder="$t('mxpcweb.client.1529061199330')" format="yyyy-MM-dd" :size="size" @change="change2"></el-date-picker>
            </div>
            <el-date-picker v-else :disabled="itemData.disabled" v-model="ruleForm.value3" type="date" :style="{width: rightWidth }" :placeholder="itemData.cnFieldHint" format="yyyy-MM-dd" :size="size" @change="change3"></el-date-picker>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
  name: 'Controls-Birthday',
  props: {
    size: {
      type: String,
      default: 'small'
    },
    rightWidth: {
      type: String,
      default: '160px'
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
    labelPosition: {
      type: String,
      default: 'right'
    },
    isProp: {
      type: Boolean,
      default: false
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    isRow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    let _this = this
    return {
      ruleForm: {
        value1: _this.itemData.inDefaultValue,
        value2: _this.itemData.inDefaultValue,
        value3: _this.itemData.inDefaultValue
      },
      rules: {
        value1: [
          // 请选择时间
          { type: 'date', required: true, message: this.$t('mxpcweb.client.1529993635269'), trigger: 'change' }
        ],
        value2: [
          // 请选择时间
          { type: 'date', required: true, message: this.$t('mxpcweb.client.1529993635269'), trigger: 'change' }
        ],
        value3: [
          // 请选择时间
          { type: 'date', required: true, message: this.$t('mxpcweb.client.1529993635269'), trigger: 'change' }
        ]
      }
    }
  },
  created () {

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
          return 'value3'
        } else {
          return ''
        }
      }
    },
    updata (isControlData) {
      let _this = this
      if (isControlData) {
        this.ruleForm.value1 = _this.itemData.controlData.value1
        this.ruleForm.value2 = _this.itemData.controlData.value2
      } else {
        this.ruleForm.value3 = (_this.itemData.fieldValue != []) ? (new Date(_this.itemData.fieldValue) || '') : ''
      }
    },
    submitForm () {
      let _this = this
      let isPass = true
      let formatTime = ''
      if (_this.ruleForm.value3 !== '') {
        formatTime = _this.$m_unifiedTime(_this.ruleForm.value3, {format: 'YYYY-MM-DD hh:mm:ss'})
      }
      this.$emit('update:controlData', formatTime)
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          isPass = false
        }
      })
      return isPass
    },
    change1 (newValue) {
      newValue = newValue == undefined ? '' : newValue + ' 00:00:00'
      let _this = this
      let data = {
        key: _this.itemData.fieldName + '_gt',
        value: newValue,
        data: {
          key: _this.itemData.fieldName + '_lt',
          value: _this.$m_unifiedTime(_this.ruleForm.value2)
        }
      }
      this.$emit('update:controlData', data)
      this.$emit('change', data)
    },
    change2 (newValue) {
      let _this = this
      newValue = newValue == undefined ? '' : newValue + ' 23:59:59'
      let data = {
        key: _this.itemData.fieldName + '_lt',
        value: newValue,
        data: {
          key: _this.itemData.fieldName + '_gt',
          value: _this.$m_unifiedTime(_this.ruleForm.value1)
        }
      }
      this.$emit('update:controlData', data)
      this.$emit('change', data)
    },
    change3 (newValue) {
      this.$emit('update:controlData', newValue)
    },
    clearData () {
      this.$refs['ruleForm'].resetFields()
      this.ruleForm.value1 = ''
      this.ruleForm.value2 = ''
      this.ruleForm.value3 = ''
    }
  },
  beforeDestroy: function () {
    this.change1 = null
    this.change2 = null
    this.change3 = null
    this.updata = null
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.Controls-Time{
    .line{
        color: #97a8be;
    }
}
</style>
