<template>
  <el-form :model="ruleForm" ref="ruleForm" onsubmit="return false" :rules="rules" :label-width="labelWidth" :label-position="labelPosition">
    <el-form-item :style="{'margin-bottom':isProp?0:''}" :label="showLabel ? itemData.cnFieldCaption : ''" :prop="prop()">
      <el-input :disabled="itemData.disabled" v-model="ruleForm.input" @change="change" :placeholder="itemData.cnFieldHint" :size="size" :style="{width: rightWidth}"></el-input>
      <floating-list v-show="show" :list="ruleForm.mobileVal" @clickList="clickFloatingList" ref="floatingList"></floating-list>
      <span class="arrow-down text-hover" v-if="!isIndependent && ruleForm.mobileVal.length > 1">
        <i class="iconfont icon-arrow-down-empty" @click="show = !show"></i>
      </span>
    </el-form-item>
  </el-form>
</template>

<script>
import FloatingList from '@/basecomponents/FloatingList/index'
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
    isIndependent: {
      type: Boolean,
      default: false
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
        mobileVal: [{text: ''}],
        input: ''
      },
      rules: {
        input: [
          { required: true, validator: checkPhone, trigger: 'blur' }
        ]
      },
      show: false
    }
  },
  methods: {
    clickFloatingList(val) {
      this.ruleForm.input = val.text || ''
      this.change ()
      this.show = false
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
    },
    updatas (value) {
      this.ruleForm.mobileVal = value != undefined ? this.returnArr(value) : [{text: ''}]
      this.ruleForm.input = this.ruleForm.mobileVal[0] ? this.ruleForm.mobileVal[0].text : ''
      this.change ()
    },
    updata (items) {
      if (items || items == '') {
        let arr = items.split(',')
        this.ruleForm.mobileVal = []
        arr.forEach((item) => {
          this.ruleForm.mobileVal.push({
            text: item
          })
        })
      } else {
        this.ruleForm.mobileVal = this.itemData.fieldValue != undefined ? this.returnArr(this.itemData.fieldValue) : [{text: ''}]
      }
      this.ruleForm.input = this.ruleForm.mobileVal[0] ? this.ruleForm.mobileVal[0].text : ''
      this.change ()
    },
    returnArr (str) {
      let list = []
      str.split(',').forEach(element => {
        list.push({text: element})
      })
      if (list.length == 0) {
        list = [{text: ''}]
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
      this.ruleForm.mobileVal = [{text: ''}]
      this.ruleForm.input = ''
      this.change ()
    },
    clearData () {
      this.$refs['ruleForm'].resetFields()
      this.ruleForm.mobileVal = [{text: ''}]
      this.ruleForm.input = ''
      this.change ()
    },
    change () {
      this.$emit('update:controlData', this.ruleForm.input)
    }
  },
  beforeDestroy: function () {
    this.returnArr = null
    this.updata = null
    this.updatas = null
  },
  components: {
    'floating-list': FloatingList
  }
}
</script>
