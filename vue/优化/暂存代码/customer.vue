<template>
  <div class="customerLists">
    <!-- 暂无客户 -->
    <!-- 立即创建 -->
    <no-data v-if="customerListsData.length==0" class="marginTop15" @getListData="getListData" v-show="!firstData" :fastOpt="fastOpt" :title="$t('mxpcweb.client.1529057210799')" :btnText="$t('mxpcweb.client.1529028045434')" img='noCustomer'></no-data>
    <template v-else>
      <div class="boxList" :style="{'padding-right': showCustoms ? '370px' : '200px'}">
        <el-row :gutter="20">
          <el-col :span="6">
            <!-- 客户名称 -->
            {{$t('mxpcweb.client.1529055956170')}}
          </el-col>
          <el-col :span="18">
            <div class="grid-content bg-purple" style="display:inline-block;width:100%">
              <span v-for="(fieldItem,fieldIndex) in listSet.listSetAllow" :key="fieldIndex" class="ellipsis" :title="fieldItem.cnFieldCaption" style="display:inline-block;text-align:left" :style="{'width':parseInt(fieldItem.columnWidth)/listSet.allColumnWidth*99+'%'}">
                {{fieldItem.cnFieldCaption}}
              </span>
            </div>
          </el-col>
        </el-row>
        <div class="customsBox" v-if="showCustoms">
          <!-- 贸易大数据 -->
          {{$t('mxpcweb.client.list.1555055650674')}}
        </div>
        <div class="posRight" v-if="isShowCheck">
          <!-- 拥有人 -->
          {{$t('mxpcweb.client.1529043616422')}}
        </div>
      </div>
      <div :class="isShowCheck?'customerTables MXscroll' : 'customerTablesDetailUse'" ref="customerTables" :style="{'padding-right': hasScrollbarValue ? '10px' : '15px' }">

        <virtual-list :size="60" :remain="remain" :start="0" :item="customerItem" :variable="getVariableHeight" :itemcount="customerListsData.length" :itemprops="getItemProps" />
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
import customerItem from './customerItem'
import { mapGetters } from 'vuex'
import virtualList from 'vue-virtual-scroll-list'
export default {
  name: 'customerLists',
  props: {
    listSet: {
      type: Object,
      default: () => ({})
    },
    fastOpt: {// 获取空间操作按钮列表
      type: Array,
      default: () => ({})
    },
    detailOpt: {
      type: Array,
      default: () => []
    },
    moduleStruct: {
      type: Object,
      default: () => ({
        fieldName: 'createDate'
      })
    },
    nowSort: {
      type: Object,
      default: () => ({
        fieldName: 'createDate'
      })
    },
    controlData: {
      type: Object,
      default: () => ({
        checkedCities: []
      })
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
      customerItem,
      firstData: true,
      language: Object.freeze({
        today: this.$t('mxpcweb.client.1529056807699'), // 今天
        yesterday: this.$t('mxpcweb.client.1529056766253'), // 昨天
        tomorrow: this.$t('mxpcweb.client.1529056827883'), // 明天
        noday: this.$t('mxpcweb.client.1529056745088') // 无具体时间
      }),
      remain: 9,
      hasScrollbarValue: true,
      viewType: '',
      showCustoms: false
    }
  },
  created() {
    this.viewType = this.getRoute().viewType
    this.remain = parseInt(this.screenHeight / 100)
  },
  mounted() {
    this.showCustoms = this.navigator.uRIs.indexOf('/main/discovery') != '-1'
  },
  beforeDestroy() { },
  methods: {
    getItemProps(itemIndex) {
      return {
        key: itemIndex,
        props: {
          //   height: itemSize,
          index: itemIndex,
          customerItem: this.customerListsData[itemIndex] || {},
          controlData: this.controlData,
          detailOpt: this.detailOpt,
          moduleStruct: this.moduleStruct,
          listSet: this.listSet,
          nowSort: this.nowSort,
          dynamicTags: this.dynamicTags,
          moduleCode: this.moduleCode,
          isShowCheck: this.isShowCheck,
          viewType: this.viewType,
          showCustoms: this.showCustoms
        }
      }
    },
    getVariableHeight(itemIndex) {
      if (this.customerListsData[itemIndex].title) {
        return 80
      }
      return 60
    },
    switchList(customerLists, sortName, load) {
      if (this.firstData) {
        this.firstData = false
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
        this.customerListsData = []
        this.renderingList(customerLists.slice(0, 10), titleTime, sortName)
        this.$emit('closeListLoad')
        if (customerLists.length > 10) {
          setTimeout(() => {
            // this.renderingList(customerLists.slice(10, customerLists.length), titleTime, sortName)
            this.customerListsData = this.renderingList1(customerLists, titleTime, sortName)
          }, 10)
        }
      } else {
        this.customerListsData = []
        this.customerListsData = this.renderingList1(customerLists, titleTime, sortName)
      }
      this.hasScrollbar()
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
      this.hasScrollbar()
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
    getListData(upData) {
      this.$emit('getListData', false, upData)
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
    ...mapGetters(['navigator', 'screenHeight'])
  },
  watch: {
    screenHeight(height) {
      this.remain = parseInt(height / 100)
    }
  },
  components: {
    'no-data': NoData,
    'virtual-list': virtualList
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "../zh-cn.less";
@import "../en.less";
.trackName {
  line-height: 16px;
}
</style>
