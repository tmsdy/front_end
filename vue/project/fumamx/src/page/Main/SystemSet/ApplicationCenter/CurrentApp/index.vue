<template>
    <div class="CurrentApp">
        <ul class="clearfix">
            <li v-for="(item,index) in apps" :key="index" class="transition_all" :class="[item.statusOpen === true ? 'active' : '']">
                <div class="appName">
                    <i class="iconfont" :class="item.appIconUri || 'icon-apps'"></i><br>{{item.appName}}
                </div>
                <span class="pull-right">
                    <el-switch v-model="item.statusOpen" on-text="" off-text="" on-color="#000" @change="appChange(item.statusOpen,item.appCode)"> </el-switch>
                    <!-- 已启用 -->
                    <div v-if="item.statusOpen === true">{{$t('mxpcweb.systemset.applicationcenter.1530251941166')}}</div>
                    <!-- 已停用 -->
                    <div v-else>{{$t('mxpcweb.systemset.applicationcenter.1530251994909')}}</div>
                </span>
                <div class="clearfix"></div>
                <div class="appDescr" :title="item.reMark">{{item.reMark}}</div>
            </li>
        </ul>
    </div>
</template>

<script>
/**
 * 描述：系统设置=>应用中心，当前应用
 * 作者：向士健
 * 时间：2018/6/26 修改 UI
 */
import { isArray } from '@/libs/utils.js'

export default {
  name: 'CurrentApp',
  props: {

  },
  data () {
    return {
      apps: []
    }
  },
  created () {

  },
  mounted () {
    this.getData()
  },
  methods: {
    // 获取页面数据
    getData () {
      let _this = this
      _this.$http.get(this.Global.baseURL + this.Global.api.v2.app_get, { params: {} }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
          let appList = res.body.data
          // 给开关做个布尔属性
          appList.forEach(function (item) {
            item['statusOpen'] = !!(item.companyAppSet && item.companyAppSet.status == 1)
          })
          // console.log(appList)
          // console.log(appList)
          _this.apps = appList
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      }
      )
    },
    // 开关
    appChange (status, appCode) {
      let _this = this
      let data = {
        status: status === true ? 1 : 0,
        appCode: appCode
      }
      _this.$http.put(this.Global.baseURL + this.Global.api.v2.appSet_doPut, data).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK) {
          _this.$message.success(_this.msg(res.body))
        } else {
          _this.$message.error(_this.msg(res.body))
        }
        _this.getData() // 再刷新下数据
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      }
      )
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
