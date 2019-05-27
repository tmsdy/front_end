<template>
  <el-form :model="ruleForm" onsubmit="return false" :rules="rules" ref="ruleForm" :label-width="labelWidth" :label-position="labelPosition" class="Controls-Text">
    <el-form-item :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()" :style="{'margin-bottom':isProp?0:''}">
      <el-input v-model="ruleForm.input"  :disabled="itemData.disabled" :placeholder="itemData.cnFieldHint" :maxlength="itemData.fieldLength" @keyup.enter.native="checkRepeats()" @blur="checkRepeats()" :size="size" :style="{width: rightWidth}">
        <el-button slot="append" v-if="checkRepeat&&itemData.fieldName == 'custName'">
            <!-- 查重 -->
            <el-button class="checkBut" :disabled="itemData.disabled"  @click="toCheckRepeats(ruleForm.input)"  size="mini">{{$t('mxpcweb.client.1529043090630')}}</el-button>
        </el-button>
      </el-input>
      <div class="checkButton" v-if="checkRepeat&&itemData.fieldName == 'custName'">
        <loading-vue v-if="checkLoading" title="" style="padding: 0 10px;height:10px;"></loading-vue>
        <div v-if="checkMsg == 1" class="text-hover" style="line-height:12px;" @click="$emit('openCheck',ruleForm.input,0);">
          <i class="el-icon-information" style="color:#f90"></i>
          <!-- 重复 -->
          <span style="color:red;font-size:12px;">{{$t('mxpcweb.client.1529043112413')}}</span>
        </div>
        <div v-else-if="checkMsg == 0" style="line-height:12px;font-size:12px;">
          <i class="el-icon-check" style="color:green"></i>
          <!-- 可使用 -->
          <span style="color:green;">{{$t('mxpcweb.client.1529043130966')}}</span>
        </div>
        <!--<router-link tag="div" to="/main/client/queryrepeat" data-href="/main/client/queryrepeat">
          <el-button type="info" @click="toCheckRepeats()"  size="mini">查重</el-button>
        </router-link>-->
      </div>
      <div class="checkButton" v-else-if="checkRepeat&&itemData.uniqueCheck !== 0" >
        <loading-vue v-if="checkLoading" title="" style="padding: 0 10px;height:10px;"></loading-vue>
        <div v-if="checkMsg == 1" class="text-hover" style="line-height:12px;">
          <i class="el-icon-information" style="color:#f90"></i>
          <!-- 重复 -->
          <span style="color:red;font-size:12px;">{{$t('mxpcweb.client.1529043112413')}}</span>
        </div>
        <div v-else-if="checkMsg == 0" style="line-height:12px;font-size:12px;">
          <i class="el-icon-check" style="color:green"></i>
          <!-- 可使用 -->
          <span style="color:green;">{{$t('mxpcweb.client.1529043130966')}}</span>
        </div>
      </div>
      <div class="Doubtful" v-if="checkRepeat&&itemData.uniqueCheck !== 0&&DoubtfulData.totalNum!=0"  :style="{width: rightWidth}">
        <!-- 找到{{DoubtfulData.totalNum}}条疑似客户信息 -->
        {{$t('mxpcweb.client.1529043213591',{totalNum:DoubtfulData.totalNum})}}
        <!-- 疑似客户(仅展示前十条) -->
        <el-popover
          placement="bottom"
          :title="$t('mxpcweb.client.1529043292772')"
          width="200"
          trigger="hover">
          <div v-for="(item,index) in DoubtfulData.list" @click="toCheckRepeats(item.custName)" :key="index" class="ellipsis text-hover" :title="item.custName" style="color: rgb(153, 153, 153);height:30px;line-height:30px">
              {{item.custName}}
          </div>
          <i class="el-icon-information text-hover" slot="reference" title=""></i>
        </el-popover>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import loadingVue from '@/basecomponents/Loading/index'
export default {
  name: 'Controls-Text',
  props: {
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
    checkRepeat: {
      type: Boolean,
      default: false
    },
    optCode: {
      type: String,
      default: ''
    },
    identFieldValue: {
      type: [Number, String],
      default: ''
    }
  },
  data () {
    return {
      ruleForm: {
        input: !this.isProp && this.itemData.inDefaultValue ? this.itemData.inDefaultValue : ''
      },
      rules: {
        input: [
          // 请输入
          { required: true, message: this.$t('mxpcweb.basecomponents.1530696912786') + this.itemData.cnFieldCaption, trigger: 'blur' }
        ]
      },
      checkMsg: -1,
      list: [],
      editType: false,
      DoubtfulData: {
        totalNum: 0,
        list: []
      },
      checkLoading: false
    }
  },
  methods: {
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
    toCheckRepeats (value) {
      if (value == '') {
        // 空的名称不可查重
        this.$message(this.$t('mxpcweb.client.1529043319848'))
        return false
      }
      this.$emit('openCheck', value.replace(/(^\s*)|(\s*$)/g, ''), 1)
      $('.el-popover').hide()
    },
    checkRepeats () {
      this.change()
      if (this.checkRepeat && this.itemData.uniqueCheck !== 0) {
        this.checkMsg = 2
        this.DoubtfulData = {
          totalNum: 0,
          list: []
        }
        if (this.ruleForm.input == '') {
          return false
        }
        let argument = {
          fieldName: this.itemData.fieldName,
          fieldValue: this.ruleForm.input.replace(/(^\s*)|(\s*$)/g, ''),
          moduleCode: 'BF001',
          searchType: 'checkUnique'
        }
        if (this.identFieldValue != '') {
          argument.identFieldValue = this.identFieldValue
        }
        this.checkLoading = true
        this.$http.get(this.Global.baseURL + this.Global.api.v2.document_config_get, { params: argument }).then((res) => {
          if (res.body.code.toString() == this.Global.RES_OK) {
            if (res.body.data.isRepeat == 0) {
              this.checkMsg = 0
            } else {
              this.checkMsg = 1
            }
          } else {
            this.checkMsg = 2
            this.$message.error(this.msg(res.body))
          }
          this.checkLoading = false
        }, (res) => {
          this.checkMsg = 2
          this.checkLoading = false
          this.$message.error(this.$t(this.Global.errorTitle))
        })
        let data = {
          type: 3,
          keywords: this.ruleForm.input
        }
        if (this.identFieldValue != '') {
          data.notCustomer = this.identFieldValue
        }
        this.$http.get(this.Global.baseURL + this.Global.api.v2.customerCheck_get, { params: data }).then((res) => {
          if (res.body.code.toString() == this.Global.RES_OK) {
            this.DoubtfulData = res.body.data
          } else {
            this.DoubtfulData = {
              totalNum: 0,
              list: []
            }
            this.$message.error(this.msg(res.body))
          }
        }, (res) => {
          this.DoubtfulData = {
            totalNum: 0,
            list: []
          }
          this.$message.error(this.$t(this.Global.errorTitle))
        })
      }
    },
    clearData () {
      this.$refs['ruleForm'].resetFields()
      this.ruleForm.input = this.itemData.inDefaultValue ? this.itemData.inDefaultValue : ''
      this.change()
      this.checkRepeats()
      this.checkMsg = -1
    },
    updata (isControlData) {
      this.editType = true
      if (isControlData) {
        this.ruleForm.input = this.itemData.controlData
      } else {
        this.ruleForm.input = (this.itemData.fieldValue != []) ? this.itemData.fieldValue : ''
      }
      this.checkRepeats()
    },
    updatas (value) {
      this.ruleForm.input = value
      if (this.checkRepeat && this.itemData.uniqueCheck !== 0) {
        this.checkRepeats()
      }
    },
    submitForm () {
      let isPass = true
      this.change()
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          isPass = false
          return false
        }
      })
      return isPass
    },
    change () {
      this.$emit('update:controlData', this.ruleForm.input.replace(/(^\s*)|(\s*$)/g, ''))
      this.$emit('change', this.ruleForm.input.replace(/(^\s*)|(\s*$)/g, ''))
      if (this.itemData.fieldName == 'enSpuName') {
        this.$emit('changeUpdata', [{fieldName: 'displayTitle', value: this.ruleForm.input}])
      }
      if (this.optCode == 'otNew' && (this.itemData.fieldName == 'quotaTheme' || this.itemData.fieldName == 'orderTheme')) {
        this.$emit('themeChange', this.ruleForm.input)
      }
    }
  },
  components: {
    'loading-vue': loadingVue
  },
  beforeDestroy: () => {
    this.toCheckRepeats = null
    this.updata = null
    this.updatas = null
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.Controls-Text{
  .checkBut{
    button{
      background:#FCF2F3;
      border-radius:3px;
      border:1px solid rgba(223,226,228,1);
    }
  }
  .checkButton{
    width: 60px;
    min-height: 30px;
    position: absolute;
    right: -3px;
    bottom:3px;
    >div{
      display:inline-block;
    }
  }
  .Doubtful{
    position: absolute;
    bottom: -13px;
    left: 0;
    height: 16px;
    line-height: 16px;
    font-size: 12px;
    color:#f7ba2a;
    text-align: right;
    .Doubtful1{
      height: 16px;
      line-height: 16px;
      font-size: 12px;
      color:#f7ba2a;
    }
  }
}
</style>
