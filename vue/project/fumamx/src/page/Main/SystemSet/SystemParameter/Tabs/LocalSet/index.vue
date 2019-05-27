<template>
  <div class="LocalSet">
    <el-form :model="systemParameter" :rules="rulesSystemParameterLocalSet" label-position="left" label-width="100px" ref="systemParameterLocalSet" :inline="true">

      <div class="input_title">
        <!-- 参数设置 -->{{$t('mxpcweb.systemset.systemparameter.1530350649305')}}
      </div>
      <div class="">
        <!-- 本地语言 -->
        <el-form-item :label="$t('mxpcweb.systemset.systemparameter.1530601152762')" prop="localLanguage">
          <!-- 请选择本地语言 -->
          <el-select v-model="systemParameter.localLanguage" :placeholder="$t('mxpcweb.systemset.systemparameter.1530601182291')">
            <el-option v-for="item in languageList" :key="item.dictItemCode" :label="item.itemName" :value="item.itemValue"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <!-- 系统时区 -->
      <!--<div class="input_title">{{$t('mxpcweb.systemset.systemparameter.1530601213851')}}</div>-->
      <div class="">
        <!-- 系统时区 -->
        <el-form-item :label="$t('mxpcweb.systemset.systemparameter.1530601213851')" prop="timezone">
          <!-- 请选择系统时区 -->
          <el-select v-model="systemParameter.timezone" :placeholder="$t('mxpcweb.systemset.systemparameter.1530601242907')">
            <el-option v-for="item in timezoneList" :key="item.dictItemCode" :label="item.itemName" :value="item.itemValue"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <!-- 日期格式 -->
      <!--<div class="input_title">{{$t('mxpcweb.systemset.systemparameter.1530601288805')}}</div>-->
      <div class="">
        <!-- 日期格式 -->
        <el-form-item :label="$t('mxpcweb.systemset.systemparameter.1530601288805')" prop="dateFormat">
          <!-- 请选择日期格式 -->
          <el-select v-model="systemParameter.dateFormat" :placeholder="$t('mxpcweb.systemset.systemparameter.1530601314778')">
            <el-option v-for="item in dateFormatList" :key="item.dictItemCode" :label="item.itemName" :value="item.itemName"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <!-- 时间格式 -->
      <!--<div class="input_title">{{$t('mxpcweb.systemset.systemparameter.1530601343178')}}</div>-->
      <div class="">
        <!-- 时间格式 -->
        <el-form-item :label="$t('mxpcweb.systemset.systemparameter.1530601343178')" prop="timeFormat">
          <!-- 请选择时间格式 -->
          <el-select v-model="systemParameter.timeFormat" :placeholder="$t('mxpcweb.systemset.systemparameter.1530601374444')">
            <el-option v-for="item in timeFormatList" :key="item.dictItemCode" :label="item.itemName" :value="item.itemName"></el-option>
          </el-select>
        </el-form-item>
      </div>

      <div class="">
        <el-button style="margin-left:100px;" size="large" type="primary" @click="submit('systemParameterLocalSet')">
          <!-- 保存设置 -->{{$t('mxpcweb.systemset.systemparameter.1530351198177')}}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { isObject, isArray } from '@/libs/utils.js'
export default {
  name: 'LocalSet',
  props: {
  },
  data() {
    return {
      languageList: [],
      timezoneList: [],
      dateFormatList: [],
      timeFormatList: [],
      systemParameter: {
        localLanguage: '', // 本地语言
        timezone: '', // 时区
        dateFormat: '', // 日期格式
        timeFormat: '' // 改时间格式了，注意一下
      },
      rulesSystemParameterLocalSet: {
      },
      labelPosition: 'top' // 每条表单标签位置
    }
  },
  created() {
  },
  mounted() {
    this.getLocalSet() // 取本地化设置API数据
    this.languageChange()
    this.timezoneChange()
    this.dataFormatChange()
    this.timeFormatChange()
  },
  methods: {
    // 语言下拉
    languageChange() {
      let _this = this
      let url = this.Global.baseURL + this.Global.api.UniversalInterface.dictionaryInf
      this.$http.get(url, { params: { id: 'locallanguage' } }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
          _this.languageList = res.body.data
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    // 时区下拉
    timezoneChange() {
      let _this = this
      let url = this.Global.baseURL + this.Global.api.UniversalInterface.dictionaryInf
      this.$http.get(url, { params: { id: 'timezone' } }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK && res.body.data != '' && res.body.data instanceof Array) {
          _this.timezoneList = res.body.data
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    // 日期格式下拉
    dataFormatChange() {
      let _this = this
      let url = this.Global.baseURL + this.Global.api.UniversalInterface.dictionaryInf
      this.$http.get(url, { params: { id: 'dateformat' } }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK && res.body.data != '' && res.body.data instanceof Array) {
          _this.dateFormatList = res.body.data
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    // 时间格式下拉
    timeFormatChange() {
      let _this = this
      let url = this.Global.baseURL + this.Global.api.UniversalInterface.dictionaryInf
      this.$http.get(url, { params: { id: 'timeformat' } }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK && res.body.data != '' && res.body.data instanceof Array) {
          _this.timeFormatList = res.body.data
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    // 取本地化设置API数据

    getLocalSet(fn) {
      let _this = this
      let url = this.Global.baseURL + this.Global.api.SystemSet.enterpriseset.enterpriseInf
      this.$http.get(url, { params: {} }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data.companyInfo)) {
          let companyInfo = res.body.data.companyInfo
          // console.log(companyInfo);
          _this.systemParameter.localLanguage = companyInfo.localLanguage
          _this.systemParameter.timezone = companyInfo.timezone
          _this.systemParameter.dateFormat = companyInfo.dateFormat
          _this.systemParameter.timeFormat = companyInfo.timeFormat
        } else {
          // _this.systemParameter = [];
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    // 表单提交，本地设置
    submit(formName) {
      let _this = this
      // console.log(_this.systemParameter);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = _this.Global.baseURL + _this.Global.api.SystemSet.enterpriseset.saveEnterpriseInf
          _this.$http.post(url, _this.systemParameter).then(function (res) {
            /* 保存成功  */
            _this.$message({ message: this.$t('mxpcweb.systemset.systemparameter.1530350543354'), type: 'success' })
          }, function (res) {
            var backMsg = res.body.data.companysettingUpdateRes.msg
            _this.$message.error(backMsg)
          })
        } else {
          /* '请检查你的表单！' */
          this.$message({ message: this.$t('mxpcweb.systemset.systemparameter.1530350704663'), type: 'warning' })
          return false
        }
      })
    }
  },
  components: {
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
