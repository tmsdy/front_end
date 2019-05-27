<template>
    <div class="companySelect" v-if="isSelectCompanyShow">
        <div>
            <el-radio-group v-model="switchCompany.company" class="companyList MXscroll">
                <el-radio :label="item" v-for="(item,index) in companySelectList" :key="index" :class="item.status == -1 ? 'hidden' : ''">
                    <span :title="item.corpName">{{companyTitle(item.corpName)}}</span>
                    <span class="text-gray">{{statusRemark(item.status)}}</span>
                </el-radio>
            </el-radio-group>
            <el-button size="large" type="primary" @click="clickEnter()" :loading="isLoading" class="transition_all widthFull">{{$t('mxpcweb.login.1528186160942')}}</el-button>
        </div>

        <!-- 重置密码，弹窗 -->
        <cover-password ref="coverPassword" :companySelected="switchCompany.company" v-on:updateSuccess="$emit('toSelectCompany', switchCompany.company)"></cover-password>
        <!-- IP禁用，需手机、邮箱校验 -->
        <check-code ref="checkCode" :companySelected="switchCompany.company"></check-code>
   </div>
</template>

<script>
import coverPassword from './coverPassword.vue'
import checkCode from './checkCode.vue'
export default {
  name: 'companySelect',
  props: {
    companySelectList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      isLoading: false,
      isSelectCompanyShow: true,
      switchCompany: {
        company: {},
        companys: []
      }
    }
  },
  created () {
    this.isLoading = false
  },
  mounted () {

  },
  methods: {
    // 企业状态判断，文字备注
    statusRemark (num) {
      switch (num) {
        case -7:
          return '【' + this.$t('mxpcweb.login.1528784070375') + '】'
          break
        case -6:
          return '【' + this.$t('mxpcweb.login.1528784249000') + '】'
          break
        case -5:
          return '【' + this.$t('mxpcweb.login.1528784292142') + '】'
          break
        case -4:
          return ''// 【需要有角色】
          break
        case -3:
          return ''// 【需要验证】
          break
        case -2:
          return '【' + this.$t('mxpcweb.login.1528784343034') + '】'
          break
        case -1:
          return '【' + this.$t('mxpcweb.login.1528784406038') + '】'// 禁用的企业，隐藏了
          break
        case 0:
          return ''// 【请改密码】
          break
        case 1:
          return ''// 正常登录状态，无需显示
          break
        default:
          return ''// num;
      }
    },
    // 企业名称显示长度控制
    companyTitle (data) {
      let byte = 18
      return data.length > byte ? data.substring(0, byte) + '...' : data
    },
    // 点击进企业
    clickEnter () {
      let _this = this
      let company = this.switchCompany.company// 所选企业
      if (!company.corpName) {
        _this.$message(_this.$t('mxpcweb.login.1528784469407'))
        return
      }
      // 判断所选公司状态status
      switch (company.status) {
        case -7:
          _this.$message(_this.$t('mxpcweb.login.1528696098195'))
          break
        case -6:
          _this.showPaymentPage(company) // 显示开通支付页面
          break
        case -5:
          _this.showPaymentPage(company) // 显示开通支付页面
          break
        case -4:
          _this.$message(_this.$t('mxpcweb.login.1528696175939'))
          break
        case -3:
          _this.$refs.checkCode.isShowPhone()// 弹出组件里手机号验证框
          break
        case -2:
          _this.$message(_this.$t('mxpcweb.login.1528696219483'))
          break
        case -1:
          _this.$message(_this.$t('mxpcweb.login.1528696245165'))
          break
        case 0:
          _this.$refs.coverPassword.isShow()// 弹出修改密码框
          break
        case 1:
          _this.isLoading = true
          _this.$emit('toSelectCompany', company) // 进所选企业系统，并传company
          break
      }
    },

    /**
         * 显示开通支付页面
         */
    showPaymentPage (currentCompany) {
      if (currentCompany != undefined && currentCompany != null && currentCompany.cId != undefined &&
                    currentCompany.cId != null && currentCompany.cId > 0) {
        this.$emit('showPayment', currentCompany)
      }
    }
  },
  components: {
    'cover-password': coverPassword,
    'check-code': checkCode
  }
}
</script>

<style lang="less" rel="stylesheet/less">
.companySelect {
    // border:1px solid red;
    // margin-bottom:8px;
    width: 100%;
    position: relative;
    .companyList {
        // border:1px solid red;
        width: 100%;
        height: 200px;
        overflow-y: scroll;
        overflow-x:hidden;
        display: block;
        padding: 20px 0 0;
        margin-bottom: 40px;
        .el-radio {
            display: block;
            margin-bottom: 20px;
            color: #606266;
            // border: 1px solid red;
        }
        .el-radio+.el-radio {
            margin-left: 0;
        }
        .el-radio__label {
            padding-left: 10px;
            // border: 1px solid red;
        }
    }
}
</style>
