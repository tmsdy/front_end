<template>
    <el-form :model="ruleForm" onsubmit="return false" :rules="rules" ref="ruleForm" :label-width="labelWidth" :label-position="labelPosition">
        <el-form-item :class="[itemData.isNotNull == 1 ? 'is-required' : '']" :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()" :style="{'margin-bottom':isProp?0:'',width: parseInt(rightWidth)+parseInt(labelWidth)+30+'px'}">
            <el-input :disabled="itemData.disabled" type="textarea" size="small" :rows="height" :maxlength="itemData.fieldLength" :placeholder="itemData.cnFieldHint" v-model="ruleForm.input" @change="change"  :style="{width: rightWidth}"></el-input>
            <span class="arrow-down" v-show="!itemData.disabled">
                <i class="iconfont icon-arrow-down-empty" @click="showFloatingList()"></i>
            </span>
            <div style="position: relative;" :style="{width: rightWidth}">
                <floating-list  :disabled="itemData.disabled" :list="remindList" @clickList="clickFloatingList" ref="floatingList"></floating-list>
            </div>
        </el-form-item>
    </el-form>
</template>

<script>
import FloatingList from '@/basecomponents/FloatingList/index'
import { isArray } from '@/libs/utils.js'
export default {
  name: 'Controls-CustomStr2',
  props: {
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
    labelPosition: {
      type: String,
      default: 'right'
    },
    size: {
      type: String,
      default: 'small'
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    height: {
      type: Number,
      default: 8
    }
  },
  data () {
    let _this = this
    return {
      pickerOptions: {},

      ruleForm: {
        input: _this.itemData.inDefaultValue ? _this.itemData.inDefaultValue : ''
      },
      rules: {
        input: [
          // 请输入
          { required: true, message: this.$t('mxpcweb.basecomponents.1530696912786') + _this.itemData.cnFieldCaption, trigger: 'blur' }
        ]
      },
      remindList: [
      ]
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      let _this = this
      _this.$http.get(this.Global.baseURL + this.Global.api.v2.textDict_get, { params: {
        dictCode: this.itemData.dictCode
      } }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
          let remindList = res.body.data
          remindList.forEach(function (item) {
            item.text = item.itemName
          })
          _this.remindList = remindList
        } else {
          // _this.$message.error(_this.msg(res.body));
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    change () {
      this.$emit('update:controlData', this.ruleForm.input)
      this.$emit('change', this.ruleForm.input)
    },
    // 点击下箭头显示下拉列表
    showFloatingList () {
      this.$refs['floatingList'].showFloatingListBox()
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
    updata () {
      let _this = this
      this.ruleForm.input = (_this.itemData.fieldValue != []) ? _this.itemData.fieldValue : ''
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
    clearData () {
      this.$refs['ruleForm'].resetFields()
      this.ruleForm.input = this.itemData.inDefaultValue ? this.itemData.inDefaultValue : ''
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 选择消息列表
    clickFloatingList (item) {
      this.ruleForm.input = item.text
    }
  },
  components: {
    'floating-list': FloatingList
  },
  beforeDestroy: function () {
    this.clickFloatingList = null
    this.resetForm = null
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.arrow-down{
    float: right;
    padding: 0;
    line-height: 20px;
    .iconfont{
        font-size: 20px;
    }
    &:hover {
        cursor: pointer;
        color:#008cee;
    }
}
</style>
