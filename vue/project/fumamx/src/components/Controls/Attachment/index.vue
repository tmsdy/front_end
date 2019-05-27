<template>
    <!-- <div class="Controls-Attachment">
        <el-input v-model="input" placeholder="请输入附件" style="width:100%;" @change="change" :size="size"></el-input>
    </div> -->
    <el-form :model="ruleForm" onsubmit="return false" :rules="rules" ref="ruleForm" :label-width="labelWidth" :label-position="labelPosition">
        <el-form-item label="" :prop="prop()" :style="{'margin-bottom':isProp?0:''}">
          <!-- 上传附件 -->
            <label :for="domId" class="text-hover" style="color:#6CA2FF"><i class="iconfont icon-attachment"></i>{{$t('mxpcweb.client.1529056859354')}}</label>
            <file-upload ref="fileUpload" :file-list.sync="ruleForm.input" :limitSize="10" @change="change">
              <!-- 选择文件 -->
                <el-button :id="domId" slot="trigger" size="small" type="primary"   v-show="false">{{$t('mxpcweb.client.1529048918632')}}</el-button>
            </file-upload>
        </el-form-item>
    </el-form>
</template>

<script>

import FileUpload from '@/components/orderFileUpload/index' // 文件上传
export default {
  name: 'Controls-Attachment',
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
      options: [],
      ruleForm: {
        input: _this.isProp && _this.itemData.inDefaultValue ? _this.itemData.inDefaultValue + '' : []
      },
      rules: {
        input: [
          {
            type: 'array',
            required: true,
            // 请选择
            message: this.$t('mxpcweb.basecomponents.1530697172321') + _this.itemData.cnFieldCaption,
            trigger: 'change'
          }
        ]
      },
      domId: this.genID(10)
    }
  },
  created () {
  },
  methods: {
    genID (length) {
      return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36)
    },
    change () {
      this.$emit('update:controlData', this.ruleForm.input)
      this.$emit('change', this.ruleForm.input)
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
      this.ruleForm.input = (_this.itemData.fieldValue != []) ? _this.itemData.fieldValue : []
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
      this.ruleForm.input = this.itemData.inDefaultValue ? this.itemData.inDefaultValue : []
      this.$refs.fileUpload.clear()
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  watch: {
  },
  beforeDestroy: function () {
    this.resetForm = null
    this.genID = null
  },
  components: {
    'file-upload': FileUpload
  }
}
</script>
