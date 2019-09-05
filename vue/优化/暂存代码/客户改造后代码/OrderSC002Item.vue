<template>
  <div class="customerItem">
    <div v-if="isShowCheck" :class="[controlData.checkedCities.length==0 ? 'listCheckNone' : 'listChecks']">
      <el-checkbox :label="OrderItem[moduleStruct.identField]" size="small">&nbsp;</el-checkbox>
    </div>
    <el-row :gutter="24" class="customerInfo">
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <template v-if="listSet.listSetAllow">
            <span v-if="listSet.listSetAllow.length==0">
              &nbsp;
            </span>
            <div v-else class="grid-content bg-purple" style="display:inline-block;width:100%">
              <span class="ellipsis" v-for="(fieldItem,fieldIndex) in listSet.listSetAllow" :key="fieldIndex" :class="classItem(fieldItem)" @click="listClick(fieldItem, OrderItem)" style="display:inline-block;width:16%;text-align:left" :style="{'width':(parseInt(fieldItem.columnWidth)/listSet.allColumnWidth)*99+'%'}">
                <component :list="OrderItem" :class="detailOpt.length > 0 && fieldIndex > 1 && fieldIndex > listSet.listSetAllow.length - 2 ? 'listTimes1' : ''" :OrderItem="OrderItem" v-bind:is="'control'+fieldItem.controlTypeId" ref="control" :itemData="fieldItem" :moduleCode="moduleCode" :accountInfo="OrderItem.accountInfo" :value="{value:fieldItem.fieldName?OrderItem[fieldItem.fieldName]:''}"></component>
              </span>
            </div>
          </template>
          <span v-else>
            &nbsp;
          </span>
        </div>
      </el-col>
    </el-row>
    <div class="listTimes3">
      <detail-opt useType="customer" :moduleStructName="moduleStruct.titleField" :moduleStructId="moduleStruct.identField" :moduleCode="moduleCode" @getListData="getListData" :detailOptData="detailOpt" :itemData="OrderItem"></detail-opt>
    </div>
    <span v-if="isFocusBill(OrderItem.focusTargets)&&viewType!='seas'" class="starBox">
      <i class="iconfont icon-star-card" style="font-size:16px;"></i>
    </span>
    <div class="Documentary" v-if="isShowCheck">
      <div class="DocumentaryListBox">
        <div class="DocumentaryList">
          <span v-if="OrderItem.dynamics" :title="JSON.parse(OrderItem.dynamics).content">
            <div class="ListVueBox ellipsis" v-if="!isNaN(parseInt(JSON.parse(OrderItem.dynamics).type))">
              <span class="iconBox">
                <i class="iconfont" :class="dynamicsType[JSON.parse(OrderItem.dynamics).type].icon"></i>
              </span>
              [{{dynamicsType[JSON.parse(OrderItem.dynamics).type].title}}]
              [<component v-bind:is="'control24'" ref="control" :value="{value:JSON.parse(OrderItem.dynamics).operateCtId}"></component>]
              {{JSON.parse(OrderItem.dynamics).content}}
              <span class="trackName">
                (
                {{returnTimeShow(JSON.parse(OrderItem.dynamics).date, 'MM-DD HH:mm')}}
                )
              </span>
            </div>
            <!-- <template v-if="OrderItem.SC003_4 && JSON.stringify(OrderItem.SC003_4) != '{}'">
                                                    <span class="iconBox">
                                                        <i class="iconfont icon-dynamic"></i>
                                                    </span>
                                                    <OrderItem-vue useType="1" :SC003_3="OrderItem.SC003_4"></OrderItem-vue>
                                                </template> -->
          </span>
          <span v-else>
            <span class="iconBox">
              <i class="iconfont icon-disabled"></i>
            </span>
            <span class="content">暂无动态</span>
          </span>
        </div>
        <div class="DocumentaryList" v-if="!isHS() && moduleCode == 'SC002'">
          <template v-if="OrderItem.SC003_2 && JSON.stringify(OrderItem.SC003_2) != '{}'">
            <span class="iconBox1">
              <i class="iconfont icon-orderProcess"></i>
            </span>
            <OrderItem-vue useType="2" :SC003_3="OrderItem.SC003_2"></OrderItem-vue>
          </template>
          <span v-else>
            <span class="iconBox1">
              <i class="iconfont icon-disabled"></i>
            </span>
            <span class="content">暂无跟单动态</span>
            <span v-if="!OrderItem._has_SC003 || OrderItem._has_SC003 != '1'" class="addDocumentaryBox text-hover">
              <i class="iconfont icon-plus-file-mini addDocumentary" style="font-size: 12px;" @click="addDocumentary(OrderItem)"></i>
            </span>
          </span>
        </div>
      </div>
      <div class="labelBox" style="overflow: hidden;height: 24px;">
        <show-label :title="$t('mxpcweb.client.1529057053276')" :moduleCode="moduleCode" ref="label" :dynamicTags="dynamicTags" :tags="OrderItem.tags"></show-label>
      </div>
    </div>

  </div>
</template>

<script>
import detailOpt from '../../detailOpt/index'
import ListVue from './Vue/SC002/index'
import showLabel from './showLabel/index.vue'
import ListShow from '@/components/ListShowControls/index.js'

export default {
  name: 'workOrderItem',
  props: {
    OrderItem: {
      type: Object
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
    viewType: {
      type: String,
      default: ''
    },
    isShowCheck: {
      type: Boolean,
      default: true
    }
  },
  created() {
  },
  data() {
    return {
      // "跟进",
      // "发邮件",
      // "邮件AM",
      // "提醒",
      // "订单",
      // "报价",
      // "批注",
      // "上传附件",
      dynamicsType: [
        {
          title: '',
          icon: ''
        },
        {
          title: this.$t('mxpcweb.client.1529045936384'),
          icon: 'icon-kehuzhuangtai-genjin'
        },
        {
          title: this.$t('mxpcweb.client.1529056976908'),
          icon: 'icon-kehuzhuangtai-fayoujian'
        },
        {
          title: this.$t('mxpcweb.client.1529056959076'),
          icon: 'icon-kehuzhuangtai-youjianam'
        },
        {
          title: this.$t('mxpcweb.client.1529056941188'),
          icon: 'icon-kehuzhuangtai-tixing'
        },
        {
          title: this.$t('mxpcweb.client.1529056921708'),
          icon: 'icon-kehuzhuangtai-hetong'
        },
        {
          title: this.$t('mxpcweb.client.1529056897952'),
          icon: 'icon-kehuzhuangtai-baojia'
        },
        {
          title: this.$t('mxpcweb.client.1529056877668'),
          icon: 'icon-dot'
        },
        {
          title: this.$t('mxpcweb.client.1529056859354'),
          icon: 'icon-kehuzhuangtai-shangchuanfujian'
        },
        {
          title: '收款提醒',
          icon: 'icon-kehuzhuangtai-tixing'
        }
      ]
    }
  },
  methods: {
    classItem(item) {
      if (this.moduleStruct.titleField == item.fieldName || item.fieldName == 'orderTheme') {
        return 'text-hover'
      }
      return ''
    },
    addDocumentary(OrderItem) {
      this.$MXEventBus.emit('addDocumentary', OrderItem)
    },
    returnTimeShow(titleTime, type) {
      let time = this.timeShow_custom(titleTime, type)
      return time
    },
    listClick(item, list) {
      if (this.moduleStruct.titleField == item.fieldName || item.fieldName == 'orderTheme') {
        this.listaddTab(list)
      }
    },
    listaddTab(list) {
      list.billId = list[this.moduleStruct.identField]
      list.moduleCode = this.moduleCode
      list.billName = list[this.moduleStruct.titleField]
      if (list.moduleCode == 'PS001') {
      } else if (this.getRoute().parentNaviCode == 'NV011') {
        this.$MXEventBus.emit('saleAddTab', list)
      } else {
        this.$MXEventBus.emit('addTab', list)
      }
    }
  },
  components: Object.assign({
    'detail-opt': detailOpt,
    'OrderItem-vue': ListVue,
    'show-label': showLabel
  }, ListShow)
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "../zh-cn.less";
@import "../en.less";
@import "./less/OrderSC002/zh-cn.less";
@import "./less/OrderSC002/en.less";
.ListVueBox {
  padding-left: 30px;
}
.addDocumentaryBox {
  display: inline-block;
  height: 14px;
  width: 14px;
  border-radius: 50%;
  border: 1px solid #303133;
  line-height: 14px;
  text-align: center;
  &:hover {
    border: 1px solid #e6001f;
    color: #e6001f !important;
    cursor: pointer;
  }
  .addDocumentary {
    font-size: 14px;
    font-weight: 600;
  }
}
</style>
