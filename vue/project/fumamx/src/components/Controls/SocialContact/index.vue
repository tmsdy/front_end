<template>
    <el-form class="SocialContact" onsubmit="return false" :model="dynamicValidateForm" ref="dynamicValidateForm" :label-width="labelWidth" :label-position="labelPosition">

        <el-form-item :class="[itemData.isNotNull == 1 ? 'is-required' : '']" v-for="(item, index) in dynamicValidateForm.numVals" :label="index==0 && showLabel ? itemData.cnFieldCaption : ''" :key="item.key" :prop="'numVals.' + index + '.value'" :rules="rulesMailVal">

            <el-select clearable  filterable :disabled="itemData.disabled" v-model="item.select" :placeholder="itemData.cnFieldHint" :size="size" style="width:90px;">
                <el-option v-for="(item2,index2) in SocialContactData" :key="index2" :label="item2.socialName" :value="item2.socialId+''" :disabled="isDisabled(item2)"></el-option>
            </el-select>
            <el-input :disabled="itemData.disabled" v-model="item.value" :size="size" :placeholder="itemData.cnFieldHint" :style="{width: setRightWidth}"></el-input>

            <el-button :disabled="itemData.disabled" @click.prevent="addDomain" :size="size" v-show="index === 0">
                <span style="color:RGBA(96, 98, 102, 1)">{{$t('mxpcweb.client.1529043854407')}}</span>
            </el-button>
            <i></i>
            <el-button :disabled="itemData.disabled" @click.prevent="removeDomain(item)" :size="size" v-show="index !== 0" :plain="true">
                <span style="color:RGBA(96, 98, 102, 1)">{{$t('mxpcweb.client.1529043913614')}}</span>
            </el-button>

        </el-form-item>

        <!--<el-form-item>
                    <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
                            <el-button @click="addDomain">新增域名</el-button>
                            <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
                </el-form-item>-->
        <!--<el-button @click="test">test</el-button>-->

    </el-form>
</template>

<script>
import { isObject } from '@/libs/utils.js'
import { mapGetters } from 'vuex'
export default {
  name: 'SocialContact',
  props: {
    isProp: {
      type: Boolean,
      default: false
    },
    labelPosition: {
      type: String,
      default: 'right'
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    rightWidth: {
      type: String,
      default: '220px'
    },
    size: {
      type: String,
      default: 'small'
    },
    itemData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showLabel: {
      type: Boolean,
      default: true
    }
  },
  data () {
    var checkVal = (rule, value, callback) => {
      if (value === '') {
        if (this.itemData.isNotNull == 1) {
          // 请输入
          // 账号
          callback(new Error(this.$t('mxpcweb.basecomponents.1530696912786') + this.itemData.cnFieldCaption + this.$t('mxpcweb.basecomponents.1530697590682')))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    return {
      SocialContactData: [], // 社交下拉
      dynamicValidateForm: {
        numVals: [{
          select: '',
          value: ''
        }]
      },
      rulesMailVal: [
        { validator: checkVal, trigger: 'blur,change' }
      ]
    }
  },
  created () {
    this.getData()
    // console.log(this.itemData)
  },
  mounted () {

  },
  computed: {
    ...mapGetters([
      'socialTypeList'
    ]),
    // 计算右边 input 的宽
    setRightWidth () {
      let str = this.rightWidth
      return str.substring(0, str.length - 2) - 93 + 'px'
    }
  },
  methods: {
    test () {
      // console.log(this.dynamicValidateForm.numVals)
      // console.log(this.SocialContactData)
    },
    // 判断下拉选中的，是否给禁选
    isDisabled (item2) {
      let back = false
      this.dynamicValidateForm.numVals.forEach(item => {
        if (item.select == item2.socialId) {
          back = true
        }
      })
      return back
    },
    // 社交账号校验
    checkRules () {
      let res = true
      this.dynamicValidateForm.numVals.forEach(item => {
        // 为QQ且输入有值时：
        if (item.select == '4' && item.value !== '') {
          let myreg = /^[1-9][0-9]{4,14}$/
          if (!myreg.test(item.value)) {
            this.$message.error('请输入正确的 QQ 号')
            res = false
          }
        }
      })
      return res
    },
    // 社交下拉
    getData () {
      // let this = this
      // this.$http.get(this.Global.baseURL + this.Global.api.v2.socialType_get, { params: {} }).then((res) => {
      //   if (res.body.code.toString() == this.Global.RES_OK && isArray(res.body.data)) {
      //     this.SocialContactData = res.body.data
      //   } else {
      //     this.$message.error(this.msg(res.body))
      //   }
      // }, (res) => {
      //   this.$message.error(this.$t(this.Global.errorTitle))
      // })
      this.SocialContactData = this.socialTypeList
    },
    updatas (value) {
      // 先清空，再重新追加
      this.dynamicValidateForm.numVals = [{
        select: '',
        value: ''
      }]
      let fieldValueObj = value
      // 不能为空对象发，如{1:'',2:''}：
      if (isObject(fieldValueObj) && Object.values(fieldValueObj).join('') !== '') {
        this.dynamicValidateForm.numVals = []// 有数据时，前面的留空去了
        // 对象里空值的，不放进去
        Object.keys(fieldValueObj).forEach((item) => {
          if (fieldValueObj[item] !== '') {
            this.dynamicValidateForm.numVals.push({
              select: item,
              value: fieldValueObj[item]
            })
          }
        })
      } else {
        this.clearData()
      }
    },
    // 修改数据时调用，用于更新传入的数据
    updata () {
      this.updatas(this.itemData.fieldValue)
      this.$nextTick(() => {
        this.submitForm()// 先对原有值验证一下
      })
    },
    prop (index) {
      if (this.isProp == true) {
        return ''
      } else {
        if (this.itemData.isNotNull == 1) {
          return 'numVals.' + index + '.value'
        } else {
          return ''
        }
      }
    },
    submitForm () {
      let isPass = true
      this.$refs['dynamicValidateForm'].validate((valid) => {
        if (valid && this.checkRules()) {
          this.change()
        } else {
          isPass = false
          return false
        }
      })
      return isPass
    },
    change () {
      let sendObj = {}
      this.SocialContactData.forEach((item) => {
        sendObj[item.socialId] = ''// 先放上，后面有值，会覆盖上，保证唯一
        this.dynamicValidateForm.numVals.forEach((item2) => {
          if (item.socialId == item2.select) {
            sendObj[item.socialId] = item2.value
          }
        })
      })
      this.$emit('update:controlData', sendObj)
    },
    clearData () {
      this.$refs['dynamicValidateForm'].resetFields()
      this.dynamicValidateForm.numVals = [{
        select: '',
        value: ''
      }]
    },
    // resetForm(formName) {
    //     this.$refs[formName].resetFields();
    // },
    // 移除一条
    removeDomain (item) {
      var index = this.dynamicValidateForm.numVals.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.numVals.splice(index, 1)
      }
    },
    // 新增一条，下拉就给减少一条，设计不能重复
    addDomain () {
      this.dynamicValidateForm.numVals.push({
        select: '',
        value: '',
        key: Date.now()
      })
      // this.SocialContactData.splice(2,1)
    }
  },
  beforeDestroy: () => {
    this.getData = null
    this.isDisabled = null
    this.prop = null
    this.removeDomain = null
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.SocialContact {
    padding-bottom: 5px; // border:1px solid red;
    .el-form-item {
        margin-bottom: 12px;
    }
}
</style>
