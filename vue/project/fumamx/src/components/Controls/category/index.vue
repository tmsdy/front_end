<template>
  <el-form :model="ruleForm" onsubmit="return false" ref="ruleForm" :rules="rules" :label-width="labelWidth" :label-position="labelPosition">
    <el-form-item :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()" :style="{'margin-bottom':isProp?0:''}">
      <div :class="showButton ? 'inputBox' : ''" :style="{width: rightWidth}">
          <drop-down ref="dropDown" labelKey="label" valueKey="value" :itemData="itemData" @change="change" :ruleForm="ruleForm" :list="newOptions" :rightWidth="showButton ? '100%' : rightWidth" :size="size"></drop-down>
        <!-- 选择分类 -->
        <el-button v-if="showButton" class="selectType" type="primary" :size="size" :disabled="itemData.disabled"  @click="$emit('selectType')">{{$t('mxpcweb.PP001.PP001List.1543304945491')}}</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import Dropdown from '../AControlsVue/Dropdown'
export default {
  name: 'Controls-category',
  props: {
    classTypeList: {
      type: Array,
      default: () => {
        return []
      }
    },
    itemData: {
      type: Object,
      default: () => {
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
    },
    showButton: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      ruleForm: {
        input: ''
      },
      rules: {
        input: [// 请输入
          { required: true, message: this.$t('mxpcweb.basecomponents.1530696912786') + this.itemData.cnFieldCaption, trigger: 'change' }
        ]
      },
      baseOptions: [],
      allOptions: [],
      newOptions: [],
      classTypeListInUse: []
    }
  },
  created() {
  },
  mounted() {
    this.allOptions = this.transData(this.classTypeList)
    this.$nextTick(() => {
      this.getData()
    })
  },
  methods: {
    getData() {
      if (this.$refs.dropDown) {
        this.$refs.dropDown.loading = true
      }
      this.$http.get(this.Global.baseURL + this.Global.api.v2.document_product_category,
        { params: { type: 'inUse' } }
      ).then((res) => {
        if (this.$refs.dropDown) {
          this.$refs.dropDown.loading = false
        }
        if (res.body.code.toString() == this.Global.RES_OK) {
            this.classTypeListInUse = res.body.data.list
            this.newOptions = this.returnOptions()
        } else {
            this.$message.error(this.msg(res.body))
        }
      }, (res) => {
          if (this.$refs.dropDown) {
            this.$refs.dropDown.loading = false
          }
          this.$message.error(this.$t(this.Global.errorTitle))
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
          return 'input'
        } else {
          return ''
        }
      }
    },
    transData(dataList) {
      let list = []
      dataList.forEach(item1 => {
          if (item1.categoryList && item1.categoryList.length > 0) {
              item1.categoryList.forEach(item2 => {
                  if (item2.categoryList && item2.categoryList.length > 0) {
                    item2.categoryList.forEach(item3 => {
                        let obj = {
                            label: [],
                            value: ''
                        }
                        obj.label.push(item1.display)
                        obj.label.push(item2.display)
                        obj.label.push(item3.display)
                        obj.value = item3.catgId + ''
                        obj.label = obj.label.join('/')
                        list.push(obj)
                    })
                  } else {
                      let obj = {
                          label: [],
                          value: ''
                      }
                      obj.label.push(item1.display)
                      obj.label.push(item2.display)
                      obj.value = item2.catgId + ''
                      obj.label = obj.label.join('/')
                      list.push(obj)
                  }
              })
          } else {
              let obj = {
                  label: [],
                  value: ''
              }
              obj.label.push(item1.display)
              obj.value = item1.catgId + ''
              obj.label = obj.label.join('/')
              list.push(obj)
          }
      })
      return list
    },
    returnOptions() {
      let options = []
      options = this.transData(this.classTypeListInUse)
      this.baseOptions = options
      return options
    },
    clearData () {
      this.$refs['ruleForm'].resetFields()
      this.ruleForm.input = ''
      this.checkMsg = -1
      this.$refs.dropDown.clearData()
      this.getData()
    },
    updata (value) {
      if (value) {
        this.searchData(value)
         this.ruleForm.input = value + ''
      } else {
        if (this.itemData.fieldValue != '') {
          this.searchData(this.itemData.fieldValue)
          this.ruleForm.input = this.itemData.fieldValue + ''
        }
      }
    },
    returnValue(value) {
      let list = {}
      this.baseOptions.forEach(item1 => {
        if (item1.value == value) {
          list = item1
        }
      })
      return list
    },
    searchData(value) {
      if (value) {
        let isHave = false
        this.newOptions.forEach(element => {
          if (value == element.value) {
            isHave = true
          }
        })
        if (!isHave) {
          this.allOptions.forEach(element => {
            if (value == element.value) {
              this.newOptions.push(element)
            }
          })
        }
      }
    },
    updatas (value) {
      this.searchData(value)
      this.ruleForm.input = value + ''
    },
    submitForm () {
      if (this.ruleForm.input != '') {
        this.$emit('update:controlData', this.ruleForm.input)
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
      this.$emit('update:controlData', this.ruleForm.input)
      this.$emit('selectType', this.ruleForm.input, 'classType')
      this.$emit('change', this.ruleForm.input)
    }
  },
  watch: {
    classTypeList(val, old) {
      this.allOptions = this.transData(val)
    }
  },
  components: {
    'drop-down': Dropdown
  },
  beforeDestroy: () => {
    this.transData = null
    this.updatas = null
    this.updata = null
    this.returnValue = null
    this.searchData = null
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
