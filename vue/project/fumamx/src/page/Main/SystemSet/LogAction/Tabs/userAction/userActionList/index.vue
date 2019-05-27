<template>
    <div class="userActionList">
        <!-- 没有查到记录 -->
        <no-data v-if='isNoData' :title="$t('mxpcweb.systemset.logaction.1530345799658')"></no-data>
        <loading v-if="isLoading" style="margin-top:33px;"></loading>
        <template v-if='timeAxisList.length > 0'>
            <dl v-for="(item,index) in timeAxisList" :key='index'>
                <dt>{{item.date}}</dt>
                <dd v-for="(item2,index2) in item.logsList" :key='index2'>
                    <user-action-item-ico :moduleCode='item2.moduleCode'></user-action-item-ico>
                    <div class="moduleItem">
                        <div class="itemTop">
                            <span class="itemName">{{item2.realName}}</span>
                            <span class="pull-right">{{axisTimeFormat(item2.optDate)}}</span>
                        </div>

                        <div v-for="(item3,index3) in item2.multiList" :key="index3">
                            <user-action-item-detail :logFormat='item2.logFormat' :detail="item3.detail"></user-action-item-detail>
                        </div>
                        <!--<div style="border:1px solid blue">{{item2.multiList}}</div>
                        <div style="border:1px solid blue">{{item2.logFormat}}</div>-->
                    </div>
                </dd>
            </dl>
            <div class="showMore">
                <span v-if="isShowMore" class="text-hover" @click="showMoreClick">
                    <!-- 查看更多 -->{{$t('mxpcweb.systemset.logaction.1530346888430')}}
                    <i class="iconfont icon-page-down"></i>
                </span>
                <span v-else>
                    <!-- 没有更多了 -->{{$t('mxpcweb.systemset.logaction.1530346965727')}}
                </span>
            </div>
        </template>
    </div>
</template>

<script>
/**
 * 描述：系统设置=>日志与行为，列表组件，（客户详情tab页也用到）
 * 作者：向士健
 * 时间：2018/01/23
 */
import { isObject, delEmptyStrObj } from '@/libs/utils.js'
import NoData from '@/basecomponents/NoData/index'
import Loading from '@/basecomponents/Loading/index'
import userActionItemIco from './userActionItemIco'
import userActionItemDetail from './userActionItemDetail'

export default {
  name: 'userActionList',
  props: {},
  data () {
    return {
      isNoData: false,
      isLoading: false,
      timeAxisList: [],

      isShowMore: true, // 更多按钮是否显示

      otherReq: {},

      // 条件参数
      pageNum: 1, // 数据页
      pageSize: 5, // 数据条数
      sort: 'optDate', // 以此排序
      order: 'desc' // 降序
    }
  },
  created () {

  },
  methods: {
    // 获取默认数据
    getListData (req) {
      // console.log(' >>< ')
      const _this = this
      // 记一下传来的参数，给查更多用
      if (req) {
        _this.otherReq = req
      }
      // 过滤参数追加，后面覆盖前面
      let data = Object.assign({
        pageN: this.pageNum, // 当前第几页
        pageSize: this.pageSize, // 数据条数
        sort: this.sort,
        order: this.order // 降序
      }, _this.otherReq)
      delEmptyStrObj(data, true)
      if (this.timeAxisList.length === 0) {
        this.isLoading = true
      }
      this.$http.get(this.Global.baseURL + this.Global.api.v2.behaviorLog_get, { params: data }).then(function (res) {
        this.isLoading = false
        if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data)) {
          let backData = res.body.data
          _this.isNoData = backData.behaviorLogs.length == 0
          _this.isShowMore = backData.rowTotal > backData.behaviorLogs.length

          let arrNum = []
          backData.behaviorLogs.forEach(function (item) {
            if (arrNum.indexOf(_this.timeShow_custom(item.optDate, 'YYYY-MM-DD')) == -1) {
              arrNum.push(_this.timeShow_custom(item.optDate, 'YYYY-MM-DD'))
            }
          })
          // console.log(arrNum);
          let arrNewData = []
          arrNum.forEach(function (item) {
            let arrList = []
            backData.behaviorLogs.forEach(function (item2) {
              if (item == _this.timeShow_custom(item2.optDate, 'YYYY-MM-DD')) {
                arrList.push(item2)
              }
            })
            arrNewData.push({
              date: item,
              logsList: arrList
            })
          })
          _this.timeAxisList = arrNewData
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    // 格式化成短时间
    axisTimeFormat (val) {
      return this.timeShow_custom(val, 'HH:mm')
    },
    // 点击加载更多
    showMoreClick () {
      this.pageSize = this.pageSize + 10
      this.getListData()
    }
  },
  components: {
    'no-data': NoData,
    loading: Loading,
    'user-action-item-ico': userActionItemIco,
    'user-action-item-detail': userActionItemDetail
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
