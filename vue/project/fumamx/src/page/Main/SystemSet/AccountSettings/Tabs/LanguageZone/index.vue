<template>
  <div class="LanguageZone">
    <el-form :model="accountSet" :rules="rulesAccountSetLanguage" label-position="left" label-width="100px" ref="accountSetLanguage" :inline="true">
      <!-- 个性化语言 -->
      <!--<div class="input_title">{{$t('mxpcweb.systemset.accountsettings.1530585764374')}}</div>-->
      <!-- 参数配置 -->
      <div class="input_title">{{$t('mxpcweb.systemset.accountsettings.1530251863772')}}</div>
      <!--
      <div class="">
        <el-form-item :label="$t('mxpcweb.systemset.accountsettings.1530585764374')" prop="localLanguage">
          <el-select v-model="accountSet.localLanguage" :placeholder="$t('mxpcweb.systemset.accountsettings.1530585912407')">
            <el-option v-for="item in languageList" :key="item.dictItemCode" :label="item.itemName" :value="item.itemEnName"></el-option>
          </el-select>
        </el-form-item>
      </div>
      -->

      <!-- 所在时区 -->
      <!--<div class="input_title">{{$t('mxpcweb.systemset.accountsettings.1530585966071')}}</div>-->
      <div class="">
        <!-- 所在时区 -->
        <el-form-item :label="$t('mxpcweb.systemset.accountsettings.1530585966071')" prop="timeZone">
          <!-- 请选择时区 -->
          <el-select v-model="accountSet.timeZone" :placeholder="$t('mxpcweb.systemset.accountsettings.1530586095693')">
            <el-option v-for="item in timezoneList" :key="item.dictItemCode" :label="item.itemName" :value="item.itemValue"></el-option>
          </el-select>
        </el-form-item>
      </div>

      <!-- 日期格式 -->
      <!--<div class="input_title">{{$t('mxpcweb.systemset.accountsettings.1530586163109')}}</div>-->
      <div class="">
        <!-- 日期格式 -->
        <el-form-item :label="$t('mxpcweb.systemset.accountsettings.1530586163109')" prop="dateFormat">
          <!-- 请选择日期格式 -->
          <el-select v-model="accountSet.dateFormat" :placeholder="$t('mxpcweb.systemset.accountsettings.1530586196356')">
            <el-option v-for="(item,index) in dateformatList" :key="index" :label="item.itemName" :value="item.itemName"></el-option>
          </el-select>
        </el-form-item>
      </div>

      <!-- 时间格式 -->
      <!--<div class="input_title">{{$t('mxpcweb.systemset.accountsettings.1530586217741')}}</div>-->
      <div class="">
        <!-- 时间格式 -->
        <el-form-item :label="$t('mxpcweb.systemset.accountsettings.1530586217741')" prop="timeFormat">
          <!-- 请选择时间格式 -->
          <el-select v-model="accountSet.timeFormat" :placeholder="$t('mxpcweb.systemset.accountsettings.1530586258414')">
            <el-option v-for="(item,index) in timeFormatList" :key="index" :label="item.itemName" :value="item.itemName"></el-option>
          </el-select>
        </el-form-item>
      </div>

      <div class="">
        <el-button style="margin-left:100px;" size="large" type="primary" @click="accountSetLanguage('accountSetLanguage')">
          <!-- 保存设置 -->{{$t('mxpcweb.systemset.accountsettings.1530586289318')}}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { isObject, isArray, setStore } from '@/libs/utils.js'
import { mapActions } from 'vuex'
export default {
  name: 'LanguageZone',
  props: {
  },
  data() {
    return {
      languageList: [],
      timezoneList: [],
      dateformatList: [],
      timeFormatList: [],
      accountSet: { // 语言&时区
        localLanguage: '', // 本地语言
        timeZone: '', // 时区
        dateFormat: '', // 日期格式
        timeFormat: '' // 时间格式
      },
      // 表单验证，语言时区
      rulesAccountSetLanguage: {
      }
    }
  },
  created() {
  },
  mounted() {
    this.getLanguageZoneData() // 初始
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
          this.languageList = res.body.data
        } else {
          /* 出错了： */
          _this.$message.error(this.$t('mxpcweb.systemset.accountsettings.1530586317676') + _this.msg(res.body))
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
        if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
          this.timezoneList = res.body.data
          // console.log(res.body.data)
        } else {
          /* 出错了： */
          _this.$message.error(this.$t('mxpcweb.systemset.accountsettings.1530586317676') + _this.msg(res.body))
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
        if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
          this.dateformatList = res.body.data
          // console.log(res.body.data)
        } else {
          /* 出错了： */
          _this.$message.error(this.$t('mxpcweb.systemset.accountsettings.1530586317676') + _this.msg(res.body))
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
        if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
          this.timeFormatList = res.body.data
          // console.log(res.body.data)
        } else {
          /* 出错了： */
          _this.$message.error(this.$t('mxpcweb.systemset.accountsettings.1530586317676') + _this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },

    // 获取页面加载数据，语言时区
    getLanguageZoneData() {
      let _this = this
      let url = this.Global.baseURL + this.Global.api.SystemSet.accountsettings.personalsettingGet
      this.$http.get(url, { params: {} }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data)) {
          let data = res.body.data
          // console.log(data);
          if (data.localLanguage != '') {
            this.accountSet.localLanguage = data.localLanguage
          }
          if (data.timeZone != '') {
            this.accountSet.timeZone = data.timeZone
          }
          if (data.dateFormat != '') {
            this.accountSet.dateFormat = data.dateFormat
          }
          if (data.timeFormat != '') {
            this.accountSet.timeFormat = data.timeFormat
          }
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },

    // 提交，语言和时区
    accountSetLanguage(formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = this.Global.baseURL + this.Global.api.SystemSet.accountsettings.personalsettingPut
          _this.$http.post(url, _this.accountSet).then(function (res) {
            if (res.body.code.toString() == _this.Global.RES_OK) {
              setStore('language', _this.accountSet.localLanguage)
              /* 保存成功 */
              _this.$message.success(_this.$t('mxpcweb.systemset.accountsettings.1530586352479'))
              setTimeout(() => {
                window.location.reload()
              }, 500)
            } else {
              _this.$message.error(_this.msg(res.body))
            }
          }, function (res) {
            _this.$message.error(_this.$t(_this.Global.errorTitle))
          })
        } else {
          console.log('error submit!!')
          /* 请检查你的表单！ */
          _this.$message({ message: this.$t('mxpcweb.systemset.accountsettings.1530586352479'), type: 'warning' })
          return false
        }
      })
    },
    // 异步实在
    ...mapActions([
      'setIndividualConfigInfo'// 设置个人配置信息
    ])
  },
  components: {
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
