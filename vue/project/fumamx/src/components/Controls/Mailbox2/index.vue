<template>
    <el-form class="Controls-Mailbox" onsubmit="return false" ref="dynamicValidateForm" :rules="rules" :label-width="labelWidth" :label-position="labelPosition">
        <el-form-item :label="showLabel ? itemData.cnFieldCaption : ''" :prop="prop()" :style="{'margin-bottom':isProp?0:''}">
            <el-input :disabled="itemData.disabled" v-model="dynamicValidateForm.input" :size="size" :placeholder="itemData.cnFieldHint" @change="change" :style="{width: rightWidth}" ></el-input>
            <floating-list v-show="show" :list="dynamicValidateForm.mailVals" @clickList="clickFloatingList" ref="floatingList"></floating-list>
            <span class="arrow-down text-hover" v-if="!isIndependent && dynamicValidateForm.mailVals.length > 1">
                <i class="iconfont icon-arrow-down-empty" @click="show = !show"></i>
            </span>
        </el-form-item>
    </el-form>
</template>
<script>
import {isArray} from '@/libs/utils.js'
import FloatingList from '@/basecomponents/FloatingList/index'
export default {
  name: 'Controls-Mailbox',
  props: {
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
      default: '220px'
    },
    size: {
      type: String,
      default: 'small'
    },
    itemData: {
      type: Object,
      default: () => {
        return {}
      }
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
    var checkMail = (rule, value, callback) => {
      if (value === '') {
        if (this.itemData.isNotNull == 1) {
          // 请输入
          callback(new Error(this.$t('mxpcweb.client.1529044011191') + _this.itemData.cnFieldCaption))
        } else {
          callback()
        }
      } else {
        // callback(new Error('表单验证中...'));
        callback()
      }
    }
    return {
      dynamicValidateForm: {
        mailVals: [{
          text: ''
        }],
        input: ''
      },
      show: false,
      rules: {
        input: [
          { required: true, validator: checkMail, trigger: 'blur' }
        ]
      },
      disable: true
    }
  },
  mounted () {

  },
  methods: {
    clickFloatingList(val) {
      this.dynamicValidateForm.input = val.text || ''
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
    // 个别控件需要赋值时调用
    updatas (value, disable) {
      if (isArray(value)) {
        this.updata(value)
      } else {
        this.dynamicValidateForm.mailVals = [{
          text: value
        }]
        this.dynamicValidateForm.input = value
        this.change ()
      }
    },
    // 修改数据时调用，用于更新传入的数据
    updata (items) {
      if (items && isArray(items) && items.length > 0) {
        this.dynamicValidateForm.mailVals = []
        items.forEach((item) => {
          this.dynamicValidateForm.mailVals.push({
            text: item
          })
        })
      } else if (items || items == '') {
        // 先清空，再重新追加
        this.dynamicValidateForm.mailVals = []
        this.dynamicValidateForm.mailVals.push({
          text: items
        })
      } else if (this.itemData.fieldValue && isArray(this.itemData.fieldValue) && this.itemData.fieldValue.length > 0) {
        // 先清空，再重新追加
        this.dynamicValidateForm.mailVals = []
        this.itemData.fieldValue.forEach((item) => {
          this.dynamicValidateForm.mailVals.push({
            text: item
          })
        })
      } else if (this.itemData.fieldValue) {
        // 先清空，再重新追加
        this.dynamicValidateForm.mailVals = []
        this.dynamicValidateForm.mailVals.push({
          text: this.itemData.fieldValue
        })
      } else {
        this.clearData()
      }
      this.dynamicValidateForm.input = this.dynamicValidateForm.mailVals[0] ? this.dynamicValidateForm.mailVals[0].text : ''
      this.change ()
      // this.submitForm();//先对原有值验证一下
    },
    clearData () {
      this.dynamicValidateForm.mailVals = [{
        text: ''
      }]
      this.dynamicValidateForm.input = ''
      this.change ()
    },
    submitForm () {
      let _this = this
      let isPass = true
      this.$refs['dynamicValidateForm'].validate((valid) => {
        if (valid) {
          // console.log(" 邮件控件： ");
          // console.log(_this.dynamicValidateForm.mailVals);
          _this.change()
        } else {
          isPass = false
          return false
        }
      })
      return isPass
    },
    change () {
      this.$emit('update:controlData', this.dynamicValidateForm.input)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  beforeDestroy: () => {
      this.resetForm = null
      this.updata = null
      this.updatas = null
  },
  components: {
    'floating-list': FloatingList
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
</style>
