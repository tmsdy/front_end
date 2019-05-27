<template>
  <el-form :model="ruleForm" onsubmit="return false" :rules="rules" ref="ruleForm" :label-width="labelWidth" :label-position="labelPosition">
    <el-form-item :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()" :style="{'margin-bottom':isProp?0:''}">
      <el-radio-group v-model="ruleForm.radio" :size="size" @change="change" :disabled="itemData.disabled">
          <el-radio  v-for="item in getData()" :key="item.value" v-show="item.inUse=='1'" :label="item.dictItemCode+''">{{item.itemName}}</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Controls-Radio',
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
        radio: !this.isProp && this.itemData.inDefaultValue ? this.itemData.inDefaultValue + '' : ''
      },
      rules: {
        radio: [
          // 请输入
          { required: true, message: this.$t('mxpcweb.basecomponents.1530696912786') + this.itemData.cnFieldCaption, trigger: 'blur' }
        ]
      }
    }
  },
  created () {

  },
  mounted () {
    this.change()
  },
  computed: {
    ...mapGetters([
      'sysBoxValue'
    ])
  },
  methods: {
    getData () {
      let _this = this
      let options = []
      if (this.sysBoxValue instanceof Array) {
        this.sysBoxValue.forEach(element => {
          if (element.dictCode == _this.itemData.dictCode) {
            options = element.dictItems
          }
        })
      }
      return options
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
    change (newValue) {
      this.$emit('update:controlData', this.ruleForm.radio)
      this.$emit('changeRadio', this.ruleForm.radio)
    },
    submitForm () {
      let _this = this
      this.$emit('update:controlData', _this.ruleForm.radio)
      let isPass = true
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          isPass = false
          return false
        }
      })
      return isPass
    },
    updatas (value) {
      if (value) {
        this.ruleForm.radio = value
      }
    },
    updata (value) {
      if (value) {
        this.ruleForm.radio = value
      } else {
        this.ruleForm.radio = (this.itemData.fieldValue != []) ? this.itemData.fieldValue : ''
      }
    }
  },
  beforeDestroy: function () {
    this.getData = null
    this.change = null
    this.updatas = null
    this.updata = null
  }
}
</script>
