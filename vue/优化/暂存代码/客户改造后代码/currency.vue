<template>
  <div class="tableRowClassName">
    <!-- 暂无跟进 -->
    <!-- 立即创建 -->
    <no-data class="marginTop15" v-show="!firstData" v-if="tableData.length==0" :fastOpt="fastOpt" :title="$t('mxpcweb.client.1529056221948')" img="noFollow" :btnText="$t('mxpcweb.client.1529028045434')" @getListData="getListData"></no-data>
    <template v-else>
      <div class="boxList">
        <el-row :gutter="20">
          <el-col :span="6">
            <!-- 客户名称 -->
            {{$t('mxpcweb.client.1529055956170')}}
          </el-col>
          <el-col :span="18">
            <div class="grid-content bg-purple" style="display:inline-block;width:100%">
              <span v-for="(fieldItem,fieldIndex) in listSet.listSetAllow" :key="fieldIndex" class="ellipsis" :title="fieldItem.cnFieldCaption" style="display:inline-block;text-align:left" :style="{'width':(parseInt(fieldItem.columnWidth)/listSet.allColumnWidth)*99+'%'}">
                {{fieldItem.cnFieldCaption}}
              </span>
            </div>
          </el-col>
        </el-row>
        <div class="posRight">
          <!-- 跟进拥有人 -->
          {{$t('mxpcweb.client.1529056296487')}}
        </div>
      </div>
      <div class="customerTables MXscroll" :style="{'padding-right': hasScrollbarValue ? '10px' : '15px' }">
        <div class="customerTable">
          <div class="customerList">
            <virtual-list class="MXscroll" ref="customerTables" :size="55" :remain="remain" :start="0" :item="currencyItem" :itemcount="tableData.length" :itemprops="getItemProps" />
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
import currencyItem from './currencyItem'
import { mapGetters } from 'vuex'

export default {
  name: 'currency',
  props: {
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
    }
  },
  data() {
    return {
      tableData: [],
      currencyItem,
      remain: 9,
      baseData: [],
      firstData: true,
      hasScrollbarValue: true,
      viewType: ''
    }
  },
  created() {
    this.remain = parseInt((this.screenHeight - 400) / 50)
    this.viewType = this.getRoute().viewType
  },
  methods: {
    getItemProps(itemIndex) {
      return {
        key: itemIndex,
        props: {
          index: itemIndex,
          currencyItem: this.tableData[itemIndex] || {},
          controlData: this.controlData,
          detailOpt: this.detailOpt,
          moduleStruct: this.moduleStruct,
          listSet: this.listSet,
          moduleCode: this.moduleCode,
          viewType: this.viewType,
          updata: this.updata
        }
      }
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
  computed: {
    ...mapGetters(['screenHeight'])
  },
  watch: {
    screenHeight(height) {
      this.remain = parseInt((height - 400) / 48)
    }
  },
  components: {
    'no-data': NoData
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../zh-cn.less";
@import "../en.less";
@import "./less/currency/zh-cn.less";
@import "./less/currency/en.less";
</style>
