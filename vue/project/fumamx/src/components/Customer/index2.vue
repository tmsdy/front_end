<template>
    <el-form :model="ruleForm" onsubmit="return false" :rules="rules" ref="ruleForm" :label-width="labelWidth" :label-position="labelPosition">
        <el-form-item :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()" :style="{'margin-bottom':isProp?0:''}">
            <div class="customer">
                <el-select :disabled="itemData.disabled" v-if="isProp" v-model="ruleForm.input" filterable remote :remote-method="getData" :placeholder="itemData.cnFieldHint" :maxlength="itemData.fieldLength" @change="change" :size="size" :style="{width: rightWidth}">
                    <el-option :label="$t('mxpcweb.client.1529060999660')" value=""> </el-option>
                    <el-option v-for="(item,index) in options" :key="index" :label="item.custName" :value="item.custId+''"> </el-option>
                </el-select>
                <el-select clearable :disabled="itemData.disabled" v-else v-model="ruleForm.input" filterable remote :remote-method="getData"  :placeholder="itemData.cnFieldHint" :maxlength="itemData.fieldLength" @change="change" :size="size" :style="{width: rightWidth}">
                    <el-option v-for="(item,index) in options" :key="index" :label="item.custName" :value="item.custId+''"> </el-option>
                </el-select>
            </div>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
  name: 'Controls-Customer',
  props: {
    itemData: {
      type: Object,
      default: function () {
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
    searchType: {
      type: String,
      default: ''
    }
  },
  data () {
    let _this = this
    return {
      options: [], // 下拉框选项列表
      ruleForm: {// 输入框数据
        input: ''
      },
      rules: {
        input: [
          { type: 'string', required: true, message: this.$t('mxpcweb.basecomponents.1530697172321') + _this.itemData.cnFieldCaption, trigger: 'change' }
        ]
      },
      contId: false, // 客户ID
      firstData: false, // 首次进入
      blockData: { // 分页
        fromNum: 0,
        pageSize: 50
      }
    }
  },
  created () {
    this.getData()// 获取下拉框选项列表
  },
  mounted () {
    let _this = this
    // 滚动区域
    $(this.$el).find('.customer .el-select-dropdown__wrap').scroll(function () {
      let h = $(this).height() // div可视区域的高度
      let sh = $(this)[0].scrollHeight // 滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点
      let st = $(this)[0].scrollTop // 滚动条的高度，即滚动条的当前位置到div顶部的距离
      if (h + st >= sh - 4) {
        _this.more()
      }
    })
  },
  methods: {
    // 修改时调用，用于更新传入的数据
    updata () {
      let _this = this
      let value = _this.itemData.fieldValue != undefined ? _this.itemData.fieldValue + '' : _this.options[0] ? _this.options[0].custId + '' : ''
      if (value == '') {
        this.ruleForm.input = ''
      } else {
        this.updatas(value, true, {})
      }
    },
    updatas (value, contId, items) { // 判断是否列表已存在此客户数据，如果没有去请求客户详情push进列表选项中
      let _this = this
      let thisHave = false
      this.firstData = true
      if (contId) {
        this.contId = true
      }
      setTimeout(function () {
        _this.options.forEach(function (item) {
          if (item.custId == value) {
            thisHave = true
          }
        })
        if (!thisHave) { // 如果客户不存在
          if (items.custName) { // 判断传入的数据是否存在客户名称，存在则push进列表
            items.custName = items.custName.toString()
            _this.options.push(items)
            _this.ruleForm.input = value + ''
            _this.change()
          } else { // 如果不存在则执行最终方案--请求客户详情数据，push进列表，已解决客户名称不能显示问题
            let itemData = {}
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.document_generalOperate_get, {
              params: {
                moduleCode: 'BF001',
                identFieldValue: value,
                searchType: 'detail'
              }
            }).then(function (res) {
              if (res.body.code.toString() == _this.Global.RES_OK) {
                itemData = res.body.data
                _this.options.push(itemData)
                _this.ruleForm.input = value + ''
                _this.change()
              } else {
                _this.ruleForm.input = ''
                _this.change()
              }
            }, function (res) {
              _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
          }
        } else { // 如果客户存在列表中给选择框赋值并提交数据
          _this.ruleForm.input = value + ''
          _this.change()
        }
      }, 20)
    },
    more () { // 下拉刷新触发事件，每次新增50条数据
      this.blockData.pageSize += 50
      this.getData(this.argument)
    },
    getData (val) { // 获取客户下拉框列表数据
      let _this = this
      this.argument = val || ''
      let argument = {
        moduleCode: 'BF001',
        searchType: this.searchType !== '' ? this.searchType : 'list',
        from: _this.blockData.fromNum,
        size: _this.blockData.pageSize
      }
      if (this.argument && this.argument != '') {
        argument.keywords = this.argument.trim()
      };
      _this.$http.get(this.Global.baseURL + this.Global.api.v2.document_generalOperate_get, { params: argument }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK) {
          _this.options = res.body.data.list
        } else {
          _this.listLoading = false
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.listLoading = false
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
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
    },
    change () { // 数据改变重置分页条数，提交数据
      let _this = this
      this.blockData.pageSize = 50
      let newValue = _this.ruleForm.input
      newValue = newValue == -1 ? '' : newValue
      if (newValue == '') {
        this.$emit('update:controlData', {})
      } else {
        let custData = {}
        this.options.forEach(function (item) {
          if (item.custId == newValue) {
            custData = item
          }
        })
        this.$emit('update:controlData', custData)
      }
      if (this.isLowerCusts) { // 判断父组件是否下级客户需求
        let lowerCust = {}
        this.options.forEach(function (item) { // 遍历客户列表判断当前选中的客户是哪条数据
          if (_this.ruleForm.input && _this.ruleForm.input == item.custId + '') {
            lowerCust = item
            return false
          }
        })
        if (lowerCust.parCustId) { // 拿到此客户信息后判断这个客户是否有下级客户数据
          this.$emit('isLowerCust', true)// 有就告诉父组件此客户可设置为下级客户
        } else {
          this.$emit('isLowerCust', false)
        };
      }
      // if(this.firstData){//如果第一次进入调用就返回
      //     this.firstData = false;
      //     return false;
      // };
      // 非第一次调用处理逻辑
      if (this.contId) { // 如果参数中有联系人Id,则不需要进行连带处理
        this.contId = false
      } else { // 如果不存在则从下拉列表中获取当前客户
        this.$emit('relyOn', newValue, _this.itemData.fieldName)
      }
      if (_this.itemData.returnFieldList && _this.itemData.returnFieldList != '') {
        let items = {}
        let isHave = false
        _this.options.forEach(element => {
          if (newValue == element.contId) {
            items = element
            isHave = true
          }
        })
        if (isHave) {
          _this.$emit('returnFieldList', items, _this.itemData.returnFieldList)
        }
      }
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.more{
    text-align:center;
    color:grey;
    margin-bottom:10px;
}
</style>
