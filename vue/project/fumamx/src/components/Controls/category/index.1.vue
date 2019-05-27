<template>
  <el-form :model="ruleForm" onsubmit="return false" :rules="rules" ref="ruleForm" :label-width="labelWidth" :label-position="labelPosition">
    <el-form-item :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()" :style="{'margin-bottom':isProp?0:''}">
      <div :style="{width: rightWidth}" class="inputBox">
        <el-cascader style="width:100%;line-height: 24px;" filterable :disabled="itemData.disabled" clearable expand-trigger="click" :placeholder="itemData.cnFieldHint" :options="returnOptions()" v-model="ruleForm.input" @change="change" :size="size">
        </el-cascader>
        <el-button class="selectType" type="primary" :size="size" :disabled="itemData.disabled"  @click="$emit('selectType')">选择分类</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>
<script>
// 此控件暂时不用
export default {
  name: 'Controls-category',
  props: {
    classTypeList: {
      type: Array,
      default: function () {
        return []
      }
    },
    itemData: {
      type: Object,
      default: function () {
        return {}
      }
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
    size: {
      type: String,
      default: 'small'
    },
    labelPosition: {
      type: String,
      default: 'right'
    },
    showLabel: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      ruleForm: {
        input: []
      },
      rules: {
        input: [// 请输入
          { type: 'array', required: true, message: this.$t('mxpcweb.basecomponents.1530696912786') + this.itemData.cnFieldCaption, trigger: 'change' }
        ]
      },
      baseOptions: []
    }
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
          return 'input'
        } else {
          return ''
        }
      }
    },
    transData(list) {
        let options = []
        list.forEach(element => {
          let options1 = {
            value: element.catgId + '',
            label: element.display
          }
          if (element.categoryList && element.categoryList.length > 0) {
            options1.children = this.transData(element.categoryList)
          }
          options.push(options1)
        })
        return options
    },
    returnOptions() {
      let options = []
      if (this.classTypeList.length > 0) {
        options = this.transData(this.classTypeList)
      }
      this.baseOptions = options
      return options
    },
    clearData () {
      this.$refs['ruleForm'].resetFields()
      this.ruleForm.input = []
      this.checkMsg = -1
    },
    updata (value) {
      let _this = this
      if (value) {
         _this.ruleForm.input = _this.returnValue(value)
      } else {
        if (_this.itemData.fieldValue != '') {
          _this.ruleForm.input = _this.returnValue(_this.itemData.fieldValue)
        }
      }
    },
    returnValue(value) {
      if (value) {
        if (value == '') {
          return []
        } else {
          let list = []
          this.baseOptions.forEach(item1 => {
            if (item1.value == value) {
              list.push(item1.value)
            } else if (item1.children) {
              item1.children.forEach(item2 => {
                if (item2.value == value) {
                  list.push(item1.value)
                  list.push(item2.value)
                } else if (item2.children) {
                  item2.children.forEach(item3 => {
                    if (item3.value == value) {
                      list.push(item1.value)
                      list.push(item2.value)
                      list.push(item3.value)
                    }
                  })
                }
              })
            }
          })
          return list
        }
      } else {
        return []
      }
    },
    updatas (value) {
      let _this = this
      _this.ruleForm.input = _this.returnValue(value)
    },
    submitForm () {
      let _this = this
      if (_this.ruleForm.input.length > 0) {
        _this.$emit('update:controlData', _this.ruleForm.input[_this.ruleForm.input.length - 1])
      }
      let isPass = true
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          isPass = false
          return false
        }
      })
      return isPass
    },
    change () {
      let _this = this
      if (_this.ruleForm.input.length > 0) {
        _this.$emit('update:controlData', _this.ruleForm.input[_this.ruleForm.input.length - 1])
        _this.$emit('selectType', _this.ruleForm.input[_this.ruleForm.input.length - 1], 'classType')
      } else {
        _this.$emit('update:controlData', [])
        _this.$emit('selectType', [])
      }
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.inputBox{
  padding-right: 68px;
  position: relative;
  .selectType{
    position: absolute;
    top: 1px;
    right: 0;
  }
}
</style>
