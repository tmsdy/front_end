<template>
    <el-form :model="ruleForm" onsubmit="return false" :rules="rules" ref="ruleForm" :label-width="labelWidth" :label-position="labelPosition">
        <el-form-item :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()" :style="{'margin-bottom':isProp?0:''}">
          <el-select clearable :disabled="itemData.disabled" v-if="isIndependent" v-model="ruleForm.input" :placeholder="itemData.cnFieldHint" :maxlength="itemData.fieldLength" @change="change" :size="size" :style="{width: rightWidth}">
              <div class="searchBox">
                <el-input v-model="keyWords" @change="getDatas(keyWords)" icon="search" :size="size"></el-input>
              </div>
              <div class="Contacts MXscroll">
                <el-option v-show="false" label="" value=""></el-option>
                <div class="nodata" v-show="loading">
                  <loading></loading>
                </div>
                <div v-show="!loading">
                  <div v-if="options.length > 0">
                    <el-option v-for="(item,index) in options" :key="index" :label="item.contName" :value="item.contId+''"> </el-option>
                  </div>
                  <div class="nodata" v-else>
                    未找到结果
                  </div>
                </div>
              </div>
          </el-select>
          <el-select clearable :disabled="itemData.disabled" v-else v-model="ruleForm.input" :placeholder="itemData.cnFieldHint" :maxlength="itemData.fieldLength" @change="change" :size="size" :style="{width: rightWidth}">
              <el-option v-for="(item,index) in options" :key="index" :label="item.contName" :value="item.contId+''">
              </el-option>
          </el-select>
          <!-- <el-button  v-if="!isProp&&moduleCode=='WO001'" style="position:relative;top:-2px;" size="small" :plain="true" @click="$emit('otNew', {moduleCode:'BF003',custId: custId})"><span style="color:RGBA(96, 98, 102, 1)">新增</span></el-button> -->
        </el-form-item>
    </el-form>
</template>

<script>
import Loading from '@/basecomponents/Loading/index'
import { isObject } from '@/libs/utils.js'
export default {
  name: 'Controls-Contacts',
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
    isIndependent: {
      type: Boolean,
      default: false
    },
    moduleCode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      keyWords: '',
      pickerOptions: {},
      options: [],
      custId: '',
      ruleForm: {
        input: ''
      },
      rules: {
        input: [
          // 请选择
          { type: 'string', required: true, message: this.$t('mxpcweb.basecomponents.1530697172321') + this.itemData.cnFieldCaption, trigger: 'change' }
        ]
      },
      blockData: {
        fromNum: 0,
        pageSize: 30,
        pageSize1: 10000,
        totalNum: 30
      },
      loading: false,
      argument: '',
      isMore: false
    }
  },
  computed: {
  },
  created () {

    // this.getData();
  },
  mounted () {
    if (this.isIndependent) {
      this.getDatas()
    }
    // 滚动区域
    $(this.$el).find('.Contacts').on('scroll', this.bindScroll)
  },
  beforeDestroy: function () {
    $(this.$el).find('.Contacts').off('scroll', this.bindScroll)
  },
  methods: {
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
    more () { // 加载更多事件，暂时不用
      if (this.isIndependent) {
        this.blockData.pageSize += 50
        this.getDatas(this.argument, true)
      } else {
        this.blockData.pageSize1 += 50
        this.getData(this.custId)
      }
    },
    // 修改时调用，用于更新传入的数据
    updata () {
      let value = this.itemData.fieldValue != undefined ? this.itemData.fieldValue + '' : ''
      if (value == '') {
        this.ruleForm.input = value + ''
      } else {
        this.options = []
        this.$http.get(this.Global.baseURL + this.Global.api.v2.document_generalOperate_get, { params: {
          moduleCode: 'BF003',
          identFieldValue: value,
          searchType: 'detail'
        } }).then((res) => {
          if (res.body.code.toString() == this.Global.RES_OK) {
            this.options.push(res.body.data)
            this.ruleForm.input = value + ''
          } else {
            this.$message.error(this.msg(res.body))
          }
        }, (res) => {
          this.$message.error(this.$t(this.Global.errorTitle))
        })
      }
    },
    updatas (items) {
      this.options = []
      if (isObject(items)) {
        this.options.push(items)
        this.ruleForm.input = items.contId + ''
      } else {
        this.updatas1({contId: items + ''})
      }
    },

    updatas1 (items) { // 判断是否列表已存在此客户数据，如果没有去请求客户详情push进列表选项中
      this.options = []
      this.$http.get(this.Global.baseURL + this.Global.api.v2.document_generalOperate_get, { params: {
        moduleCode: 'BF003',
        identFieldValue: items.contId,
        searchType: 'detail'
      } }).then((res) => {
        if (res.body.code.toString() == this.Global.RES_OK) {
          this.options.push(res.body.data)
          this.ruleForm.input = items.contId + ''
        } else {
          this.$message.error(this.msg(res.body))
        }
      }, (res) => {
        this.$message.error(this.$t(this.Global.errorTitle))
      })
    },
    getData (custId, relyOn) {
      if (!custId || custId == '') {
        this.ruleForm.input = ''
        this.options = []
        return false
      }
      this.$http.get(this.Global.baseURL + this.Global.api.v2.document_generalOperate_get, {
        params: {
          custId: custId,
          searchType: 'allList',
          moduleCode: 'BF003',
          order: 'asc',
          sort: 'createDate',
          from: this.blockData.fromNum,
          size: custId && custId != '' ? this.blockData.pageSize1 : this.blockData.pageSize
        }
      }).then((res) => {
        if (res.body.code.toString() == this.Global.RES_OK) {
          this.options = res.body.data.list
          this.blockData.totalNum = res.body.data.totalNum
          if (this.options.length > 0) {
            let have = false
            this.options.forEach((item) => {
              if (this.ruleForm.input == item.contId + '') {
                have = true
              }
            })
            if (!have) {
              if (custId != this.custId) {
                this.ruleForm.input = this.options[0].contId + ''
              }
            }
          }
          if (custId) {
            this.custId = custId
          }
        } else {
          this.$message.error(this.msg(res.body))
        }
      }, (res) => {
        this.$message.error(this.$t(this.Global.errorTitle))
      })
    },
    getDatas (val, type) { // 获取客户下拉框列表数据
      if (this.isSetTime) {
        clearTimeout(this.isSetTime)
      }
      this.isSetTime = setTimeout(() => {
        this.getDataTime(val, type)
      }, 1000)
    },
    getDataTime(val, type) {
      this.argument = val || ''
      let argument = {
        moduleCode: 'BF003',
        searchType: 'allList',
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
          this.options = res.body.data.list
          this.blockData.totalNum = res.body.data.totalNum
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
    },
    upList() {
      if (this.custId == '') {
        return false
      }
      this.$http.get(this.Global.baseURL + this.Global.api.v2.document_generalOperate_get, {
        params: {
          custId: this.custId,
          searchType: 'allList',
          moduleCode: 'BF003',
          order: 'asc',
          sort: 'createDate',
          from: this.blockData.fromNum,
          size: this.blockData.pageSize
        }
      }).then((res) => {
        if (res.body.code.toString() == this.Global.RES_OK) {
          this.options = res.body.data.list
          this.blockData.totalNum = res.body.data.totalNum
        } else {
          this.$message.error(this.msg(res.body))
        }
      }, (res) => {
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
    submitForm () {
      let isPass = true
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          isPass = false
        }
      })
      return isPass
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    },
    clearData () {
      this.ruleForm.input = ''
      this.$refs['ruleForm'].resetFields()
    },
    change () {
      this.blockData.pageSize = 50
      let newValue = this.ruleForm.input
      newValue = newValue == -1 ? '' : newValue
      this.$emit('update:controlData', newValue)
      if (this.itemData.returnFieldList && this.itemData.returnFieldList != '') {
        let item = {}
        let isHave = false
        this.options.forEach(element => {
          if (newValue == element.contId) {
            item = element
            isHave = true
          }
        })
        if (isHave) {
          this.$emit('returnFieldList', item, this.itemData.returnFieldList)
        } else {
          this.$emit('returnFieldList', {}, this.itemData.returnFieldList)
        }
      }
    }
  },
  components: {
    'loading': Loading
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.more{
    text-align:center;
    color:grey;
    margin-bottom:10px;
}
.searchBox{
  position: absolute;
  top: 2px;
  left: 0;
  right: 0;
  padding: 6px 10px 4px;
  background: white;
  z-index: 10;
}
.Contacts{
  margin-top: 40px;
  max-height: 200px;
  overflow: auto;
  margin-bottom:2px;
  .nodata{
    padding: 8px 16px;
    text-align: center;
  }
}
</style>
