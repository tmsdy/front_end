<template>
  <div class="contactsBox">
    <!-- 暂无联系人 -->
    <!-- 立即创建 -->
    <no-data class="marginTop15" @getListData="getListData" v-if="!firstData&&customerListsData.length==0" :title="$t('mxpcweb.client.1529055791035')" img="noAddress" :fastOpt="fastOpt" :btnText="$t('mxpcweb.client.1529028045434')"></no-data>
    <template v-else>
      <div class="boxList">
        <el-row :gutter="20">
          <el-col :span="6">
            <!-- 客户 -->
            <span style="margin-left:-50px;">{{$t('mxpcweb.client.1529049476377')}}</span>
          </el-col>
          <el-col :span="18">
            <div>
              <div style="display:inline-block;width:100%">
                <span class="ellipsis" :title="$t('mxpcweb.client.list.1563945581424')" style="display:inline-block;text-align:left" :style="{'width':(75/5.3)+'%'}">
                  <!-- 决策角色 -->
                  {{$t('mxpcweb.client.list.1563945581424')}}
                </span>
                <span class="ellipsis" :title="$t('mxpcweb.client.list.1563945656194')" style="display:inline-block;text-align:left" :style="{'width':(75/5.3)+'%'}">
                  <!-- 亲密度 -->
                  {{$t('mxpcweb.client.list.1563945656194')}}
                </span>
                <span class="ellipsis" :title="$t('mxpcweb.client.1529056115984')" style="display:inline-block;text-align:left" :style="{'width':(75/5.3)+'%'}">
                  <!-- 联系方式 -->
                  {{$t('mxpcweb.client.1529056115984')}}
                </span>
                <span class="ellipsis" :title="$t('mxpcweb.client.1529056101685')" style="display:inline-block;text-align:left" :style="{'width':25+'%'}">
                  <!-- 邮箱 -->
                  {{$t('mxpcweb.client.1529056101685')}}
                </span>
                <span class="ellipsis" :title="$t('mxpcweb.client.1529056083516')" style="display:inline-block;text-align:left" :style="{'width':(75/5.3)+'%'}">
                  <!-- 部门 -->
                  {{$t('mxpcweb.client.1529056083516')}}
                </span>
                <span class="ellipsis" :title="$t('mxpcweb.client.1529056067677')" style="display:inline-block;text-align:left" :style="{'width':(75/5.3)+'%'}">
                  <!-- 社交 -->
                  {{$t('mxpcweb.client.1529056067677')}}
                </span>
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="posRight">
          <!-- 拥有人 -->
          {{$t('mxpcweb.client.1529043616422')}}
        </div>
      </div>
      <div class="customerTables MXscroll" ref="customerTables" :style="{'padding-right': hasScrollbarValue ? '10px' : '15px' }">
        <virtual-list :size="68" :remain="remain" :start="0" :item="contactItem" :itemcount="customerListsData.length" :itemprops="getItemProps" />
      </div>
    </template>

  </div>
</template>
<script>
/**
 * 描述：客户管理-客户列表
 * 作者：何俊峰
 * 时间：2017/11/10
 */
import NoData from './NoData/index'
import contactItem from './contactItem'
import ListShow from '@/components/ListShowControls/index.js'
export default {
  name: 'contacts',
  props: {
    listSet: {
      type: Object,
      default: () => {
        return {}
      }
    },
    detailOpt: {
      type: Array,
      default: () => {
        return []
      }
    },
    fastOpt: {// 获取空间操作按钮列表
      type: Array,
      default: () => {
        return []
      }
    },
    moduleStruct: {
      type: Object,
      default: () => {
        return {}
      }
    },
    nowSort: {
      type: Object,
      default: () => {
        return {
          fieldName: 'creatDate'
        }
      }
    },
    controlData: {
      type: Object,
      default: () => {
        return {
          checkedCities: []
        }
      }
    },
    dynamicTags: {
      type: Array,
      default: () => []
    },
    moduleCode: {
      type: String,
      default: ''
    },
    isShowCheck: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      customerListsData: [],
      contactItem,
      remain: 8,
      titleTime: true, // 升序降序显示
      firstData: true,
      hasScrollbarValue: true,
      viewType: '',
      updata: false
    }
  },
  created() {
    this.viewType = this.getRoute().viewType
  },
  mounted() {
  },
  beforeDestroy() {

  },
  methods: {
    getItemProps(itemIndex) {
      return {
        key: itemIndex,
        props: {
          index: itemIndex,
          contactItem: this.customerListsData[itemIndex] || {},
          controlData: this.controlData,
          detailOpt: this.detailOpt,
          moduleStruct: this.moduleStruct,
          listSet: this.listSet,
          nowSort: this.nowSort,
          dynamicTags: this.dynamicTags,
          moduleCode: this.moduleCode,
          isShowCheck: this.isShowCheck,
          viewType: this.viewType,
          updata: this.updata
        }
      }
    },
    returnTitleTime(titleTime) {
      if (titleTime) {
        if (titleTime != this.$t('mxpcweb.client.1529056745088') && titleTime != this.$t('mxpcweb.client.1529055928867')) {
          let time = this.timeShow_custom(titleTime + ' 00:00:00', 'YYYY-MM-DD')
          return time
        } else {
          return titleTime
        }
      } else {
        return this.$t('mxpcweb.client.1529056745088')
      }
    },
    listaddTab(list) {
      list.billId = list.custId
      list.billName = list.custName
      list.moduleCode = 'BF001'
      this.$MXEventBus.emit('addTab', list)
    },
    getListData(upData) {
      this.$emit('getListData', false, upData)
    },
    switchList(customerLists, sortName, load, focusList) {
      this.updata = false
      if (customerLists.length == 0 && focusList.length == 0) {
        this.noData = true
      }
      if (!sortName) {
        sortName = 'createDate'
      }
      let titleTime = this.$t('mxpcweb.client.1529056745088')
      if (load) {
        this.$nextTick(() => {
          if (this.$refs.customerTables) {
            this.$refs.customerTables.scrollTo(0, '0')
          }
        })
        this.$emit('closeListLoad')
        this.customerListsData = []
        this.customerListsData = this.focus(focusList)
        this.renderingList(customerLists.slice(0, 10), titleTime, sortName)
        if (customerLists.length > 10) {
          setTimeout(() => {
            this.renderingList(customerLists.slice(10, customerLists.length), titleTime, sortName)
          }, 10)
        }
      } else {
        this.customerListsData = []
        this.customerListsData = this.focus(focusList).concat(this.renderingList1(customerLists, titleTime, sortName))
      }
      this.hasScrollbar()
      this.$nextTick(() => {
        this.updata = true
      })
      if (this.firstData) {
        this.firstData = false
      }
    },
    renderingList(customerLists, titleTime, sortName) {
      customerLists.forEach((element) => { // 按天把列表归类
        if (element.custTracks) {
          element.custTracks.sort((a, b) => {
            return b['trackDate'] - a['trackDate']
          })

          element.custTracksData = []
          element.custTracks.forEach((items) => {
            if (items.delState != 1) {
              element.custTracksData.push(items)
            }
          })
        }
        if (element[sortName]) {
          if (titleTime != element[sortName].substring(0, 10)) {
            titleTime = element[sortName].substring(0, 10)
            this.customerListsData.push({
              title: true,
              titleTime: titleTime
            })
          }
        } else {
          if (titleTime != this.$t('mxpcweb.client.1529056745088')) {
            titleTime = this.$t('mxpcweb.client.1529056745088')
            this.customerListsData.push({
              title: true,
              titleTime: titleTime
            })
          }
        }
        this.customerListsData.push(element)
      })
    },
    renderingList1(customerLists, titleTime, sortName) {
      let customerListsData = []
      customerLists.forEach((element) => { // 按天把列表归类
        if (element.custTracks) {
          element.custTracks.sort((a, b) => {
            return b['trackDate'] - a['trackDate']
          })

          element.custTracksData = []
          element.custTracks.forEach((items) => {
            if (items.delState != 1) {
              element.custTracksData.push(items)
            }
          })
        }
        if (element[sortName]) {
          if (titleTime != element[sortName].substring(0, 10)) {
            titleTime = element[sortName].substring(0, 10)
            customerListsData.push({
              title: true,
              titleTime: titleTime
            })
          }
        } else {
          if (titleTime != this.$t('mxpcweb.client.1529056745088')) {
            titleTime = this.$t('mxpcweb.client.1529056745088')
            customerListsData.push({
              title: true,
              titleTime: titleTime
            })
          }
        }
        customerListsData.push(element)
      })
      return customerListsData
    },
    // 数组转换
    focus(rootArrList) {
      if (rootArrList.length == 0) {
        return []
      }
      let arrNewData = rootArrList
      arrNewData.unshift({
        title: true,
        titleTime: this.$t('mxpcweb.client.1529055928867'),
        focus: true
      })
      return arrNewData
    },
    // 点击，升降序
    descOrAsc() {
      this.order = this.order == 'desc' ? 'asc' : 'desc'
      this.getListData()
    },
    hasScrollbar() {
      let time = setTimeout(() => {
        let thisDom = this.$refs.customerTables
        if (thisDom) {
          this.hasScrollbarValue = thisDom.scrollHeight > thisDom.clientHeight
        } else {
          this.hasScrollbarValue = false
        }
        window.clearTimeout(time)
      }, 5)
    }
  },
  computed: {
  },
  components: Object.assign({
    'no-data': NoData
  }, ListShow)
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../zh-cn.less";
@import "../en.less";
//颜色
@blue: #008cee !important;
@blue-light: #3bc2b5 !important;
@red: #f00 !important;
@yellow: #ff943e !important;
@gray: #ccc !important;
@black: #000 !important;
.contactsBox {
  min-height: 300px;
  .boxList {
    height: 32px;
    line-height: 32px;
    background: #f7f8f9;
    border-radius: 4px 4px 0px 0px;
    color: #606266;
    font-size: 12px;
    padding-left: 84px;
    padding-right: 200px;
    position: relative;
    margin-top: 16px;
    .posRight {
      position: absolute;
      top: 0;
      height: 100%;
      right: 95px;
      width: 90px;
    }
  }

  .customerTable {
    .titleTime {
      padding-left: 34px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      color: #222222;
      .iconfont {
        position: absolute;
        left: 12px;
        font-size: 12px;
        color: #222222;
      }
    }
    .customerList {
      // margin-bottom: 6px;
      // >:last-child{
      //     border-bottom:0;
      // }
      li {
        background: white;
        padding: 14px 200px 13px 84px;
        border-bottom: 1px solid #f7f8f9;
        font-size: 12px;
        position: relative;
        .avatar {
          position: absolute;
          left: 34px;
          top: 14px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        .starBox {
          position: absolute;
          left: 9px;
          top: -1px;
          width: 16px;
          height: 16px;
          text-align: center;
          line-height: 16px;
          color: rgba(208, 2, 27, 1);
          font-size: 12px;
        }
        .listCheckNone1,
        .listCheckNone,
        .listChecks {
          position: absolute;
          top: 24px;
          left: 10px;
        }
        .listCheckNone1,
        .listChecks {
          display: inline-block;
        }
        .listCheckNone {
          display: none;
        }
        .listCheck {
          display: none;
        }
        .customerInfo1 {
          height: 20px;
          line-height: 14px;
        }
        .customerInfo {
          height: 20px;
          line-height: 20px;
          .custNameBox {
            position: relative;
            display: inline-block;
            padding-right: 30px;
            max-width: 100%;
            .custName {
              font-size: 14px;

              color: rgba(34, 34, 34, 1);
              font-weight: 600;
            }
            .sex {
              position: absolute;
              top: 0;
              right: 0;
            }
          }
          .el-dropdown-menu__item {
            line-height: 30px;
            height: 30px;
          }
          .listMenu {
            display: none;
          }
          .toCustomerDetai {
            display: none;
          }
        }
        .listTimes1 {
          position: absolute;
          top: 14px;
          right: 95px;
          width: 90px;
        }
        .listTimes2 {
          position: absolute;
          bottom: 12px;
          right: 95px;
          width: 90px;
        }
        .listTimes3 {
          position: absolute;
          top: 12px;
          right: 18px;
          width: 177px;
        }
        .listTimes {
          position: absolute;
          top: 14px;
          right: 20px;
          width: 70px;
        }
        .listControl {
          width: 130px;
          display: none;
          color: #cdcdcd;
          .text-blue-hover {
            color: @blue;
            cursor: pointer;
          }
          .hover {
            cursor: pointer;
          }
        }
        .listControl1 {
          display: none;
        }
        .rank-box {
          width: 100px;
          display: inline-block;
          color: rgb(153, 153, 153);
          .score {
            display: inline-block;
            text-align: center;
            width: 38px;
            height: 20px;
            line-height: 20px;
            background: rgba(192, 196, 204, 1);
            border-radius: 10px;
            font-size: 12px;
            .iconfont {
              font-size: 12px;
              margin-right: 4px;
            }
          }
        }
      }
      > li:hover {
        background: #fafafa;
        .listTime,
        .listTimes,
        .listTimes1,
        .listTimes2 {
          display: none;
        }
        .listControl,
        .listTimes3 {
          display: inline-block;
        }
        .toCustomerDetai {
          display: inline-block;
        }
        .listCheck {
          display: inline-block;
        }
        .listMenu {
          display: inline-block;
        }
        .listCheckNone {
          display: inline-block;
        }
        .listCheckNone1 {
          display: none;
        }
      }
    }
  }
}
</style>
