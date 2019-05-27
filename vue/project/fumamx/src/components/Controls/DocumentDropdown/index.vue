<template>
    <el-form :model="ruleForm" onsubmit="return false" :rules="rules" ref="ruleForm" :label-width="labelWidth" :label-position="labelPosition">
        <el-form-item :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()" :style="{'margin-bottom':isProp?0:''}">
            <el-select clearable :disabled="itemData.disabled" v-model="ruleForm.input" @visible-change="click" :placeholder="itemData.cnFieldHint" :maxlength="itemData.fieldLength" @change="change" :size="size" :style="{width: rightWidth}">
              <div class="allBox" :style="{width: rightWidth}">
                <div class="searchBox">
                  <el-input v-model="keywords" ref="searchInput" @change="getData(keywords)" @blur="getData(keywords)" :size="size"></el-input>
                  <i v-if="keywords != ''" class="clearItem iconfont icon-close text-hover" style="font-size: 12px;" @click.stop="clearSearchData()"></i>
                </div>
                <div class="customer MXscroll">
                  <el-option v-for="(item, index) in hideList" :key="index" v-show="false" :label="item[labelName]" :value="item[keyName]+''"></el-option>
                  <div class="nodata" v-show="loading">
                    <loading></loading>
                  </div>
                  <div v-show="!loading">
                    <div v-if="options.length > 0">
                      <el-option v-for="(item,index) in options" :key="index" :label="item[labelName]" :value="item[keyName]+''"> </el-option>
                    </div>
                    <div class="nodata" v-else>
                      未找到结果
                    </div>
                  </div>
                </div>
              </div>
            </el-select>
        </el-form-item>
    </el-form>
</template>

<script>
import Loading from '@/basecomponents/Loading/index'
import { isObject } from '@/libs/utils.js'
export default {
  name: 'Controls-Customer',
  props: {
    itemData: {
      type: Object,
      default: () => {
        return {
          cnFieldCaption: '',
          cnFieldHint: '',
          controlTypeId: 41,
          dictCode: 0,
          fieldCategory: 2,
          fieldGroup: 2,
          fieldName: 'twitter',
          inDefaultValue: '',
          isNotNull: 0,
          strucId: 1
        }
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
    labelWidth: {
      type: String,
      default: '100px'
    },
    rightWidth: {
      type: String,
      default: '160px'
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    dictCode: {
      type: Number,
      default: 0
    },
    size: {
      type: String,
      default: 'small'
    },
    isLowerCusts: {
      type: Boolean,
      default: false
    },
    moduleCode: {
      type: String,
      default: ''
    },
    labelName: {
      type: String,
      default: ''
    },
    keyName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      keywords: '',
      hideList: [], // 用于匹配
      options: [], // 下拉框选项列表
      ruleForm: {// 输入框数据
        input: ''
      },
      rules: {
        input: [
          // 请选择
          { type: 'string', required: true, message: this.$t('mxpcweb.basecomponents.1530697172321') + this.itemData.cnFieldCaption, trigger: 'change' }
        ]
      },
      contId: false, // 客户ID
      firstData: false, // 首次进入
      blockData: { // 分页
        fromNum: 0,
        pageSize: 50
      },
      loading: false,
      isMore: false,
      isSetTime: null
    }
  },
  created () {
    this.unit()
  },
  mounted () {
    // 滚动区域
    $(this.$el).find('.customer').on('scroll', this.bindScroll)
  },
  methods: {
    clearSearchData() {
      this.keywords = ''
      this.getData(this.keywords)
    },
    unit() {
      this.hideList = []
      let obj = {}
      obj[this.keyName] = ''
      obj[this.labelName] = ''
      this.hideList.push(obj)
      this.getDataTime()// 获取下拉框选项列表
    },
    click(val) {
        if (val) {
            this.$nextTick(() => {
                this.$refs.searchInput.$el.children[0].focus()
            })
        }
    },
    bindScroll(e) {
      if (this.isMore) {
        return false
      }
      this.isMore = true
      let time = setTimeout(() => {
        let h = e.target.clientHeight // div可视区域的高度
        let sh = e.target.scrollHeight // 滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点
        let st = e.target.scrollTop // 滚动条的高度，即滚动条的当前位置到div顶部的距离
        if (h + st >= sh - 4) {
          this.more()
        }
        h = null
        sh = null
        st = null
        this.isMore = false
        window.clearTimeout(time)
      }, 300)
    },
    // 修改时调用，用于更新传入的数据
    updata () {
      let value = this.itemData.fieldValue != undefined ? this.itemData.fieldValue + '' : ''
      if (value == '') {
        this.ruleForm.input = ''
      } else {
        this.updatas(value)
      }
    },
    updatas (items) { // 判断是否列表已存在此客户数据，如果没有去请求客户详情push进列表选项中
      this.checkIsHave(items)
    },
    updatas1 (items) { // 判断是否列表已存在此客户数据，如果没有去请求客户详情push进列表选项中
      if (this.moduleCode != '' && this.keyName != '') {
        this.$http.get(this.Global.baseURL + this.Global.api.v2.document_generalOperate_get, { params: {
          moduleCode: this.moduleCode,
          identFieldValue: items[this.keyName],
          searchType: 'detail'
        } }).then((res) => {
          if (res.body.code.toString() == this.Global.RES_OK) {
            this.checkIsHave(res.body.data)
            this.upLastData(res.body.data)
          } else {
            this.$message.error(this.msg(res.body))
          }
        }, (res) => {
          this.$message.error(this.$t(this.Global.errorTitle))
        })
      }
    },
    more () { // 下拉刷新触发事件，每次新增50条数据
      this.blockData.pageSize += 50
      this.getData(this.argument, true)
    },
    getData (val, type) { // 获取客户下拉框列表数据
      if (this.isSetTime) {
        clearTimeout(this.isSetTime)
      }
      this.isSetTime = setTimeout(() => {
        this.getDataTime(val, type)
      }, 500)
    },
    checkIsHave(items) {
      if (items && items != '') {
        if (isObject(items)) {
          let isHave = false
          this.options.forEach(element => {
            if (element[this.keyName] == items[this.keyName]) {
              isHave = true
            }
          })
          this.hideList.forEach(element => {
            if (element[this.keyName] == items[this.keyName]) {
              isHave = true
            }
          })
          if (isHave) {
            this.ruleForm.input = items[this.keyName] + ''
          } else {
            this.hideList.push(items)
            this.ruleForm.input = items[this.keyName] + ''
          }
        } else {
          let isHave = false
          this.options.forEach(element => {
            if (items == element[this.keyName]) {
              isHave = true
            }
          })
          this.hideList.forEach(element => {
            if (element[this.keyName] == items) {
              isHave = true
            }
          })
          if (isHave) {
            this.ruleForm.input = items + ''
          } else {
            let obj = {}
            obj[this.keyName] = items + ''
            this.updatas1(obj)
          }
        }
      }
    },
    getDataTime(val, type) {
      this.argument = val || ''
      if (this.moduleCode != '') {
        let argument = {
          moduleCode: this.moduleCode,
          searchType: 'list',
          from: this.blockData.fromNum,
          size: this.blockData.pageSize
        }
        if (this.argument && this.argument != '') {
          argument.keywords = this.argument.trim()
        }
        if (!type) {
          this.loading = true
        }
        this.$http.get(this.Global.baseURL + this.Global.api.v2.document_generalOperate_get, { params: argument }).then((res) => {
          if (res.body.code.toString() == this.Global.RES_OK) {
            this.options = res.body.data.list || []
            this.checkIsHave(this.ruleForm.input)
            if (!type) {
              this.loading = false
            }
          } else {
            if (!type) {
              this.loading = false
            }
            this.$message.error(this.msg(res.body))
          }
        }, (res) => {
          this.$message.error(this.$t(this.Global.errorTitle))
        })
      }
    },
    prop () { // 校验输入框数据是否需要验证
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
    submitForm () { // 提交数据时父组件调用，判断是否通过验证
      let isPass = true
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          isPass = false
        }
      })
      return isPass
    },
    resetForm () { // 重置表单数据方法，暂不需要
      this.$refs.ruleForm.resetFields()
    },
    clearData () { // 清除表单方法，父组件使用v-if后暂时不用
      this.ruleForm.input = ''
      this.$refs['ruleForm'].resetFields()
      this.clearSearchData()
    },
    change () { // 数据改变重置分页条数，提交数据
      this.blockData.pageSize = 50
      let newValue = this.ruleForm.input
      newValue = newValue == -1 ? '' : newValue
      this.$emit('update:controlData', newValue)
      this.$emit('change', newValue)
      let items = {}
      let isHave = false
      this.options.forEach(element => {
        if (newValue == element[this.keyName]) {
          items = element
          isHave = true
        }
      })
      if (!isHave && newValue != '') {
        let obj = {}
        obj[this.keyName] = newValue
        this.updatas1(obj)
      }
      if (isHave) {
        this.upLastData(items)
      }
      this.$emit('custChange', items)
      if (this.isLowerCusts) { // 判断父组件是否下级客户需求
        let lowerCust = {}
        this.options.forEach((item) => { // 遍历客户列表判断当前选中的客户是哪条数据
          if (this.ruleForm.input && this.ruleForm.input == item[this.keyName] + '') {
            lowerCust = item
            return false
          }
        })
        if (lowerCust.parCustId) { // 拿到此客户信息后判断这个客户是否有下级客户数据
          this.$emit('isLowerCust', true)// 有就告诉父组件此客户可设置为下级客户
        } else {
          this.$emit('isLowerCust', false)
        }
      }
      this.$emit('relyOn', newValue, this.itemData.fieldName)
    },
    upLastData(items) {
      if (this.itemData.returnFieldList && this.itemData.returnFieldList != '') {
        this.$emit('returnFieldList', items, this.itemData.returnFieldList)
      }
    }
  },
  components: {
    'loading': Loading
  },
  watch: {
    moduleCode(val) {
      this.unit()
    }
  },
  beforeDestroy: () => {
    this.getData = null
    this.updatas1 = null
    this.updatas = null
    $(this.$el).find('.customer').off('scroll', this.bindScroll)
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.more{
    text-align:center;
    color:grey;
    margin-bottom:10px;
}
.allBox{
  height: 250px;
  position: relative;
  padding-top: 50px;
  // overflow: hidden;
  .searchBox{
    position: absolute;
    top: 2px;
    left: 0;
    right: 0;
    padding: 6px 10px 4px;
    background: white;
    z-index: 10;
    .clearItem{
        position: absolute;
        right: 15px;
        top: 50%;
        margin-top: -6px;
    }
  }
  .customer{
    height: 100%;
    max-height: 200px;
    overflow-y: scroll;
    overflow-x: hidden;
    margin-bottom:2px;
    .nodata{
      padding: 8px 16px;
      text-align: center;
    }
  }
}
</style>
