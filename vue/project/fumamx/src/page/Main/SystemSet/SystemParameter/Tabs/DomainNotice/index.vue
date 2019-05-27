<template>
    <div class="DomainNotice">
        <el-form :model="systemParameter" :rules="rulesSystemParameterDomain" ref="systemParameterDomain" :inline="true">
            <div class="input_title">
              <!-- 二级域名 -->
              {{$t('mxpcweb.systemset.systemparameter.1530600222290')}}
            </div>
            <div class="">
                <el-form-item label="" prop="domain">
                    <el-input :placeholder="$t('mxpcweb.systemset.systemparameter.1530601041953')" v-model="systemParameter.domain" style="width:200px;">
                        <template slot="append">
                            <span style="color:#222;">{{ hostname }}</span>
                        </template>
                    </el-input>
                </el-form-item>
            </div>
            <span style="color:#909399">
              <!-- 如需要设置自己的专属域名,请在自己的域名 服务后台DNS设置CName转发 -->{{$t('mxpcweb.systemset.systemparameter.1530600292938')}}
            </span>
            <!-- 设置方法? -->
            <span class="text-blue text-hover" @click="helpClick()">{{$t('mxpcweb.systemset.systemparameter.1530600339634')}}</span>
            <div style="padding-top:10px; margin-bottom:25px;">
                <el-button size="large" type="primary" @click="SystemParameterDomain('systemParameterDomain')">{{$t('mxpcweb.systemset.rolemanag.1530596084320')}}</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import { checkInitial, isObject, isString } from '@/libs/utils.js'
export default {
  name: 'DomainNotice',
  data () {
    let _this = this
    var validatorDomain = (rule, value, callback) => {
      if (!checkInitial(value)) {
        callback(new Error('首位为字母,长度4位到20位'))
      } else {
        callback()
      }
    }
    return {
      hostname: window.location.hostname,
      systemParameter: {
        domain: '' // 二级域名
      },
      // 表单验证
      rulesSystemParameterDomain: {
        domain: [
          { required: true, message: _this.$t('mxpcweb.systemset.systemparameter.1530601041953'), trigger: 'blur' },
          { validator: validatorDomain, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getEnterpriseSet()
  },
  methods: {
    // 打开帮助文档
    helpClick () {
      let domain = this.Global.domain
      // console.log(domain)
      window.open(
        domain + '/pc/domainHelp',
        'newwindow',
        'height=700, width=800, top=100, left=300, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no'
      )
    },
    // 获取二级域名，企业配置信息
    getEnterpriseSet () {
      let _this = this
      let url = this.Global.baseURL + this.Global.api.SystemSet.enterpriseset.enterpriseInf
      this.$http.get(url, { params: {} }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data) && isObject(res.body.data.companyInfo) && isString(res.body.data.companyInfo.secondLevelDomain)) {
          _this.systemParameter.domain = res.body.data.companyInfo.secondLevelDomain
        }
      }, function (res) {
        _this.$message.error(_this.Global.errorTitle)
      })
    },
    // 提交，二级域名修改
    SystemParameterDomain (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _this = this
          let url = _this.Global.baseURL + _this.Global.api.SystemSet.enterpriseset.saveEnterpriseInf
          _this.$http.post(url, { secondleveldomain: _this.systemParameter.domain }).then(function (res) {
            if (res.body.data.companysettingUpdateRes.code == 0) {
              /* 保存成功 */
              _this.$message.success(this.$t('systemset.systemparameter.1530350543354'))
            } else {
              _this.$message.error(res.body.data.companysettingUpdateRes.msg)
            }
          }, function (res) {
            _this.$message.error(_this.Global.errorTitle)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
