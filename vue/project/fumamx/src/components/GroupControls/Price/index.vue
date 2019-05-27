<template>
    <el-form :model="ruleForm" onsubmit="return false" :rules="rules" :label-width="labelWidth" :label-position="labelPosition">
        <el-form-item :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()" :style="{'margin-bottom':isProp?0:''}">
            <div v-for="(item,index) in itemData.group" class="listBox" :key="index" style="display:inline-block;">
                <component :dataId="item.fieldName" v-bind:is="'control'+item.controlTypeId" @selectStruId4="selectStruId4" @change="change" :optCode="optCode" :moduleCode="moduleCode" ref="control" :ver='ver'  useType="search" :labelWidth="labelWidth1" :showLabel="false" :isProp="isProp" :rightWidth="rightWidth1" :controlData.sync="item.controlData" :itemData="item" :size="size"></component>
            </div>
        </el-form-item>
    </el-form>
</template>

<script>
import Controls from '@/components/Controls/index.js'
export default {
  name: '',
  props: {
    labelPosition: {// 控件label的位置
      type: String,
      default: 'right'
    },
    labelWidth: {// 控件label的宽度
      type: String,
      default: '100px'
    },
    labelWidth1: {// 控件label的宽度
      type: String,
      default: '0'
    },
    itemData: {// 赋值给控件的数据
      type: Object,
      default: function () {
        return {}
      }
    },
    size: {// 控件输入框尺寸
      type: String,
      default: 'small'
    },
    rightWidth: {// 控件输入框宽度
      type: String,
      default: '160px'
    },
    rightWidth1: {// 控件输入框宽度
      type: String,
      default: '100px'
    },
    moduleCode: {
      type: String,
      default: ''
    },
    optCode: {
      type: String,
      default: ''
    },
    showLabel1: {// 是否展示label
      type: Boolean,
      default: false
    },
    showLabel: {// 是否展示label
      type: Boolean,
      default: true
    },
    isProp: { // 组控件是否关闭验证，默认为false
      type: Boolean,
      default: false
    },
    ver: { // 组控件是否横向排列，默认为false
      type: Boolean,
      default: false
    }
  },
  data () {
    let _this = this
    return {
      ruleForm: {
        input: ''
      },
      rules: {
        input: [
          { required: true, message: this.$t('mxpcweb.basecomponents.1530697172321') + _this.itemData.cnFieldCaption, trigger: 'blur' }
        ]
      },
      isUpdata: false
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    selectStruId4(data) {
      this.$emit('selectStruId4', data)
    },
    prop () {
      if (this.isProp == true) {
        return ''
      } else {
        if (this.itemData.group[0].isNotNull == 1) {
          return 'input'
        } else {
          return ''
        }
      }
    },
    submitForm () {
      let isPass = true
      this.$refs['control'].forEach((item) => {
        if (!item.submitForm()) {
          isPass = item.submitForm()
        }
      })
      return isPass
    },
    updatas (obj) {
      this.$refs['control'].forEach((item, index) => {
        if (obj[item.$attrs.dataId]) {
          item.updatas(obj[item.$attrs.dataId])
        }
      })
    },
    updata (isControlData) {
      let _this = this
      _this.isUpdata = true
      this.$refs['control'].forEach((item, index) => {
        item.updata(isControlData)
      })
    },
    change (value) {
      let _this = this
      _this.$emit('change', value)
    },
    clearData () {
      this.$refs['control'].forEach((item) => {
        item.clearData()
      })
    }
  },
  components: Object.assign({
  }, Controls)
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.listBox{
  margin-left: 5px;
}
.listBox:first-child{
  margin-left: 0;
}
</style>
