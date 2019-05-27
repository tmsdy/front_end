<template>
  <el-form :model="ruleForm" ref="ruleForm" onsubmit="return false" :label-width="labelWidth" :label-position="labelPosition">
    <el-form-item :style="{'margin-bottom':isProp?0:''}" :class="[itemData.isNotNull == 1 ? 'is-required' : '']" v-for="(item, index) in ruleForm.mobileVal" :label="index==0 && showLabel ? itemData.cnFieldCaption : ''" :key="index" :prop="prop(index)" :rules="itemData.isNotNull == 1 ? mobileVal : []">
      <el-input :disabled="itemData.disabled" v-model="item.value" @change="change" :placeholder="itemData.cnFieldHint" :size="size" :style="{width: rightWidth}"></el-input>
      <el-button :disabled="itemData.disabled" @click.prevent="addMail" :size="size" v-show="index === 0"><span style="color:RGBA(96, 98, 102, 1)">{{$t('mxpcweb.client.1529043854407')}}</span></el-button>
      <i></i>
      <el-button :disabled="itemData.disabled" @click.prevent="removeMail(item)" :size="size" v-show="index !== 0" :plain="true" type="danger"><span style="color:RGBA(96, 98, 102, 1)">{{$t('mxpcweb.client.1529043913614')}}</span></el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { checkTel} from '@/libs/utils'
export default {
  name: 'Controls-MobilePhone',
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
    size: {
      type: String,
      default: 'small'
    },
    showLabel: {
      type: Boolean,
      default: true
    }
  },
  data () {
    let _this = this
    let checkPhone = (rule, value, callback) => {
      if (value === '') {
        if (this.itemData.isNotNull == 1) {
          // 请输入
          callback(new Error(this.$t('mxpcweb.basecomponents.1530696912786') + _this.itemData.cnFieldCaption))
        } else {
          callback()
        }
      } else {
        if (!checkTel(value)) {
          // 请输入正确的
          callback(new Error(this.$t('mxpcweb.client.1529044037487') + _this.itemData.cnFieldCaption))
        } else {
          callback()
        }
      }
    }
    return {
      ruleForm: {
        mobileVal: [{value: ''}]
      },
      mobileVal: [
        { required: true, validator: checkPhone, trigger: 'blur' }
      ]
    }
  },
  methods: {
    prop(index) {
      if (this.itemData.disabled) {
        return ''
      };
      if (this.isProp == true) {
        return ''
      } else {
        if (this.itemData.isNotNull == 1) {
          return 'mobileVal.' + index + '.value'
        } else {
          return ''
        }
      }
    },
    updatas (value) {
      this.ruleForm.mobileVal = value != undefined ? this.returnArr(value) : [{value: ''}]
    },
    updata () {
      this.ruleForm.mobileVal = this.itemData.fieldValue != undefined ? this.returnArr(this.itemData.fieldValue) : [{value: ''}]
    },
    returnArr (str) {
      let list = []
      str.split(',').forEach(element => {
        list.push({value: element})
      })
      if (list.length == 0) {
        list = [{value: ''}]
      }
      return list
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
      this.ruleForm.mobileVal = [{value: ''}]
    },
    clearData () {
      this.$refs['ruleForm'].resetFields()
      this.ruleForm.mobileVal = [{value: ''}]
    },
    change () {
      let _this = this
      let mobileVal = ''
      _this.ruleForm.mobileVal.forEach(function (item) {
        if (mobileVal != '') {
          if (item.value != '') {
            mobileVal += ','
            mobileVal += item.value
          }
        } else {
          if (item.value != '') {
            mobileVal += item.value
          }
        }
      })
      this.$emit('update:controlData', mobileVal)
    },
    removeMail (item) {
      var index = this.ruleForm.mobileVal.indexOf(item)
      if (index !== -1) {
        this.ruleForm.mobileVal.splice(index, 1)
      }
    },
    addMail () {
      if (this.ruleForm.mobileVal.length > 5) {
        // 数量已达上限
        this.$message(this.itemData.cnFieldCaption + this.$t('mxpcweb.basecomponents.1530697488267'))
        return false
      }
      this.ruleForm.mobileVal.push({
        value: ''
      })
    }
  },
  beforeDestroy: function () {
    this.returnArr = null
    this.updata = null
    this.updatas = null
    this.removeMail = null
  }
}
</script>
