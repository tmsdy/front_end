<template>
    <el-form onsubmit="return false" :model="ruleForm" :rules="rules" :label-width="labelWidth" :label-position="labelPosition">
        <el-form-item :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()" :style="{'margin-bottom':isProp?0:''}">

            <div :style="{width:rightWidth}">
              <template v-for="(item,index) in itemData.group">
                <div style="display:inline-block;" :key="index" v-if="item.fieldName == 'ownerCtId'">
                    <component  class="control" :dataId="item.fieldName" :isRow="isRow" :labelPosition="labelPosition" :isProp="isProp" :rightWidth="rightWidth1" ref="control" :labelWidth="labelWidth1" :options="owners" :size='size' v-bind:is="'control'+item.controlTypeId" :itemData="item" :controlData.sync="item.controlData" @ownerChange="ownerChange" @change="change" :showLabel="showLabel1"></component>
                </div>
                <div style="display:inline-block;" :key="index"  v-if="item.fieldName == 'ownerDeptKey'">
                    <component :dataId="item.fieldName" :isRow="isRow" class="control" :labelPosition="labelPosition" :isProp="isProp" :rightWidth="rightWidth1" ref="control" :labelWidth="labelWidth1" :options="departments" :size='size' v-bind:is="'control'+item.controlTypeId" :itemData="item" :controlData.sync="item.controlData"  @change="change" :showLabel="showLabel1"></component>
                </div>
              </template>
            </div>
        </el-form-item>
    </el-form>
</template>
<script>
import Controls from '@/components/Controls/index.js'
import { isArray } from '@/libs/utils.js'
export default {
  name: 'BelongTo',
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
      default: '204px'
    },
    rightWidth1: {// 控件输入框宽度
      type: String,
      default: '100px'
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
    isRow: { // 组控件是否横向排列，默认为false
      type: Boolean,
      default: false
    },
    moduleCode: {
      type: String,
      default: ''
    },
    optCode: {
      type: String,
      default: ''
    }
  },
  data () {
    let _this = this
    return {
      owners: [],
      departments: [],
      baseDepartments: [],
      ruleForm: {
        input: ''
      },
      rules: {
        input: [
          // 请输入
          { required: true, message: this.$t('mxpcweb.basecomponents.1530697172321') + _this.itemData.cnFieldCaption, trigger: 'blur' }
        ]
      },
      isUpdata: false
    }
  },
  created () {
    this.getData()
  },
  mounted () {
  },
  methods: {
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
    // 初始第一个下拉先 <-_->
    getData () {
      let _this = this
      let contactData = {
        dataType: 'contact',
        funType: 'withRight',
        moduleCode: this.moduleCode,
        optCode: this.optCode
      }
      _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.accountDropList_get, { params: contactData }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK) {
          _this.owners = []
          _this.owners = res.body.data
        } else {
          _this.$message(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    ownerChange (newValue, updata) {
      let _this = this
      if (newValue !== undefined) {
        this.getTreeList(newValue)
        this.$refs['control'].forEach((item, index) => {
          if (item.$attrs.dataId == 'ownerDeptKey') {
            item.clearDatas(updata)
            if (_this.isUpdata) {
              item.updata()
            }
          }
        })
      }
    },
    getTreeList (ctId) {
      let _this = this
      if (ctId == '') {
        _this.departments = []
        _this.departments = _this.baseDepartments
        return false
      };
      let departmentData
      departmentData = {
        dataType: 'department',
        funType: 'withRight',
        moduleCode: this.moduleCode,
        optCode: this.optCode,
        deptCascade: true,
        ctId: ctId
      }
      _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.accountDropList_get, { params: departmentData }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
          _this.departments = []
          _this.departments = res.body.data
        } else {
          _this.departments = []
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    submitForm () {
      let isPass = true
      if (this.$refs['control']) {
        this.$refs['control'].forEach((item) => {
          if (!item.submitForm()) {
            isPass = item.submitForm()
          }
        })
      }
      return isPass
    },
    updata (isControlData, key) {
      if (!isControlData) {
        this.isUpdata = true
        setTimeout(() => {
          this.isUpdata = false
        }, 2000)
      }
      this.$refs['control'].forEach((item, index) => {
        if (key) {
          if (item.$attrs.dataId == key) {
            item.updata(isControlData)
          }
        } else {
          item.updata(isControlData)
        }
      })
    },
    updatas (obj) {
      this.$refs['control'].forEach((item, index) => {
        if (obj[item.$attrs.dataId]) {
          item.updatas(obj[item.$attrs.dataId])
        }
      })
    },
    change (value) {
      this.$emit('change', value)
    },
    clearData () {
      this.$refs['control'].forEach((item) => {
        item.clearData()
      })
    }
  },
  components: Object.assign({
  }, Controls),
  beforeDestroy: function () {
    this.owners = []
    this.departments = []
    this.baseDepartments = []
    this.prop = null
    this.getData = null
    this.ownerChange = null
    this.getTreeList = null
    this.submitForm = null
    this.updata = null
    this.updatas = null
    this.change = null
    this.clearData = null
    this.departments = null
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
   .control{
        margin-bottom:0;
    }
</style>
