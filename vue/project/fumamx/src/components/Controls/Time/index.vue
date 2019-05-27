<template>
    <el-form :model="ruleForm" onsubmit="return false" :rules="rules" ref="ruleForm" :label-width="labelWidth" :label-position="labelPosition">
        <el-form-item :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()" :style="{'margin-bottom':isProp?0:'','margin-right':'5px'}">
            <div v-if="isProp">
                <!-- 起始时间 -->
                <el-date-picker :disabled="itemData.disabled" v-model="ruleForm.value1" :style="{width: rightWidth,'margin-bottom':isProp?0:'' }" type="date" :placeholder="$t('mxpcweb.client.1529061178759')" format="yyyy-MM-dd" :size="size" @change="change1"></el-date-picker>
                <!-- 结束时间 -->
                <el-date-picker :disabled="itemData.disabled" v-model="ruleForm.value2"  type="date" :style="{width: rightWidth,'margin-bottom':isProp?0:'' }" :placeholder="$t('mxpcweb.client.1529061199330')" format="yyyy-MM-dd" :size="size" @change="change2"></el-date-picker>
            </div>
            <!-- 选择日期时间 -->
            <el-date-picker v-else :disabled="itemData.disabled" v-model="ruleForm.value3" type="datetime" :style="{width: rightWidth }" :placeholder="$t('mxpcweb.client.1529061217515')" :format="itemData.inDefaultValue == '%currentdate%'?'yyyy-MM-dd':'yyyy-MM-dd HH:mm'" :size="size" @change="change3"></el-date-picker>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
  name: 'Controls-Time',
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
    }
  },
  data () {
    return {
      ruleForm: {
        value1: '',
        value2: '',
        value3: ''
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
    if (this.itemData.inDefaultValue == '%currenttime%') {
      this.getTimes()
    }
  },
  methods: {
    getTimes () {
      let _this = this
      _this.$http.get(this.Global.baseURL + this.Global.api.v2.dictionary + 'timestamp', { params: {}}).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK) {
          _this.ruleForm.value3 = new Date(parseInt(res.body.data.timeStamp))
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
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
    updatas (value) {
      if (value) {
        this.ruleForm.value3 = value
        this.change3()
      }
    },
    updata (isControlData) {
      let _this = this
      if (isControlData) {
        this.ruleForm.value1 = _this.itemData.controlData.value1
        this.ruleForm.value2 = _this.itemData.controlData.value2
      } else {
        if (_this.itemData.fieldValue != [] && _this.itemData.fieldValue != '') {
          _this.ruleForm.value3 = new Date(_this.itemData.fieldValue)
        } else {
          // setTimeout(function () {
          //   _this.getTimes()
          // }, 20)
        }
      }
    },
    submitForm () {
      let _this = this
      let isPass = true
      let formatTime = _this.$m_unifiedTime(_this.ruleForm.value3)
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
      let date = this.$m_unifiedTime(newValue)
      this.$emit('update:controlData', date)
    },
    clearData () {
      this.$refs['ruleForm'].resetFields()
      this.ruleForm.value1 = ''
      this.ruleForm.value2 = ''
      this.getTimes()
    }
  },
  beforeDestroy: function () {
    this.ruleForm.value1 = null
    this.ruleForm.value2 = null
    this.ruleForm.value3 = null
    this.updatas = null
    this.updata = null
    this.change1 = null
    this.change2 = null
    this.change3 = null
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
