<template>
  <div class="tableRowClassName">
    <!-- 暂无工单 -->
    <!-- 立即创建 -->
    <no-data class="marginTop15" @getListData="getListData" v-show="!firstData" v-if="tableData.length==0" :fastOpt="fastOpt" :title="$t('mxpcweb.client.1529055628584')" img="noFollow" :btnText="$t('mxpcweb.client.1529028045434')"></no-data>
    <template v-else>
      <div class="boxList">
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="grid-content bg-purple" style="display:inline-block;width:100%">
              <span v-for="(fieldItem,fieldIndex) in listSet.listSetAllow" :key="fieldIndex" class="ellipsis" :title="fieldItem.cnFieldCaption" style="display:inline-block;text-align:left" :style="{'width':(parseInt(fieldItem.columnWidth)/listSet.allColumnWidth)*99+'%'}">
                {{fieldItem.cnFieldCaption}}
              </span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div :class="isShowCheck ? 'customerTables MXscroll' : ''" :style="{'padding-right': hasScrollbarValue ? '10px' : '15px' }">
        <div class="customerTable">
          <div class="customerList">
            <virtual-list class="MXscroll" ref="customerTables" :size="60" :remain="remain" :start="0" :item="workOrderItem" :itemcount="tableData.length" :itemprops="getItemProps" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
/**
 * 描述：客户管理-客户列表-编辑客户
 * 作者：何俊峰
 * 时间：2017/11/22
 */
import NoData from './NoData/index'
import workOrderItem from './workOrderItem'
import { mapGetters } from 'vuex'
export default {
  name: 'currency',
  props: {
    isChildBill: {
      type: Boolean,
      default: false
    },
    listSet: {
      type: Object,
      default: function () {
        return {}
      }
    },
    controlData: {
      type: Object,
      default: function () {
        return {
          checkedCities: []
        }
      }
    },
    detailOpt: {
      type: Array,
      default: function () {
        return []
      }
    },

    fastOpt: {// 获取空间操作按钮列表
      type: Array,
      default: function () {
        return []
      }
    },
    moduleStruct: {
      type: Object,
      default: function () {
        return {}
      }
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
      tableData: [],
      workOrderItem,
      remain: 9,
      baseData: [],
      firstData: true,
      hasScrollbarValue: true,
      viewType: ''
    }
  },
  created() {
    this.remain = parseInt((this.screenHeight - 380) / 50)
    this.viewType = this.getRoute().viewType
  },
  methods: {
    getItemProps(itemIndex) {
      return {
        key: itemIndex,
        props: {
          index: itemIndex,
          workOrderItem: this.tableData[itemIndex] || {},
          controlData: this.controlData,
          detailOpt: this.detailOpt,
          moduleStruct: this.moduleStruct,
          listSet: this.listSet,
          moduleCode: this.moduleCode,
          viewType: this.viewType,
          updata: this.updata,
          isShowCheck: this.isShowCheck,
          isChildBill: this.isChildBill
        }
      }
    },
    optClick(item, list) {
      let obj = {
        optData: item,
        itemData: list,
        billId: list[this.moduleStruct.identField],
        billName: list[this.moduleStruct.titleField],
        moduleCode: this.moduleCode,
        next: () => {
          this.getListData()
        }
      }
      this.$MXEventBus.emit('setGlobalLoading', {
        val: true,
        // 权限校验中...
        text: this.$t('mxpcweb.client.list.1550126019122') + '...'
      })
      this.$http.get(this.Global.baseURL + this.Global.api.v2.document_rightCheck_do, {
        params: {
          moduleCode: this.moduleCode,
          identFieldValue: list[this.moduleStruct.identField],
          optCode: item.optCode
        }
      }).then((res) => {
        this.$MXEventBus.emit('setGlobalLoading', {
          val: false,
          text: ''
        })
        this.$nextTick(() => {
          if (res.body.code.toString() == this.Global.RES_OK) {
            this.$MXEventBus.emit('optClick', obj)
          } else {
            this.$message.error(this.msg(res.body))
          }
        })
      }, (res) => {
        this.$MXEventBus.emit('setGlobalLoading', {
          val: false,
          text: ''
        })
        this.$message.error(this.$t(this.Global.errorTitle))
      })
    },
    showDialog(useType, id) {
      this.$emit('showDialog', useType, id)
    },
    switchList(customerLists, sortName, load) {
      if (load) {
        this.$nextTick(() => {
          if (this.$refs.customerTables) {
            this.$refs.customerTables.$el.scrollTo(0, '0')
          }
        })
        this.tableData = []
        this.tableData = customerLists.slice(0, 15)
        this.$emit('closeListLoad')
        if (customerLists.length > 15) {
          let time = setTimeout(() => {
            this.tableData = []
            this.tableData = customerLists
            this.hasScrollbar()
            window.clearTimeout(time)
          }, 10)
        }
      } else {
        this.tableData = []
        this.tableData = customerLists
      }
      this.firstData = false
      this.hasScrollbar()
    },
    getListData(upData) {
      this.$MXEventBus.emit('getListDatas', false, upData)
    },
    hasScrollbar() {
      let time = setTimeout(() => {
        let thisDom = this.$refs.customerTables
        if (thisDom) {
          this.hasScrollbarValue = thisDom.$el.scrollHeight > thisDom.$el.clientHeight
        } else {
          this.hasScrollbarValue = false
        }
        window.clearTimeout(time)
      }, 5)
    }
  },
  watch: {
    screenHeight(height) {
      this.remain = parseInt((height - 380) / 50)
    }
  },
  computed: {
    ...mapGetters(['screenHeight'])
  },
  components: {
    'no-data': NoData
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../zh-cn.less";
@import "../en.less";
@import "./less/workOrder/zh-cn.less";
@import "./less/workOrder/en.less";
</style>
