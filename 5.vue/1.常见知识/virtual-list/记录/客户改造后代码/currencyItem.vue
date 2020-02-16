<template>
  <div class="customerItem">
    <div :class="[controlData.checkedCities && controlData.checkedCities.length==0 ? 'listCheckNone' : 'listChecks']">
      <el-checkbox :label="currencyItem[moduleStruct.identField]" size="small">&nbsp;</el-checkbox>
    </div>
    <el-row :gutter="20" class="customerInfo">
      <el-col :span="6">
        <div class="grid-content bg-purple ellipsis custName" :title="currencyItem.custName">
          <span class="text-hover" @click="listaddTab(currencyItem)" v-if="currencyItem.custName&&currencyItem.custName!=''">
            {{currencyItem.custName}}
          </span>
          <span @click="listaddTab(currencyItem)" v-else>&nbsp;</span>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="grid-content bg-purple" v-if="listSet.listSetAllow">
          <span v-if="listSet.listSetAllow.length==0">
            &nbsp;
          </span>
          <div v-else class="grid-content bg-purple" style="display:inline-block;width:100%">
            <span class="ellipsis" v-for="(fieldItem,fieldIndex) in listSet.listSetAllow" :key="fieldIndex" style="display:inline-block;width:16%;text-align:left" :style="{'width':(parseInt(fieldItem.columnWidth)/listSet.allColumnWidth)*99+'%'}">
              <component :currencyItem="currencyItem" v-bind:is="'control'+fieldItem.controlTypeId" ref="control" :itemData="fieldItem" :value="{value:fieldItem.fieldName?currencyItem[fieldItem.fieldName]:''}"></component>
            </span>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="listTimes3">
      <detail-opt useType="customer" :moduleCode="moduleCode" :moduleStructName="moduleStruct.titleField" :moduleStructId="moduleStruct.identField" @getListData="getListData" :detailOptData="detailOpt" :itemData="currencyItem"></detail-opt>
    </div>
    <div class="listTimes1 ellipsis">
      <component v-bind:is="'control24'" ref="control" :value="{value:currencyItem.ownerCtId}"></component>
    </div>
    <span v-if="isFocusBill(currencyItem.focusTargets)&&viewType!='seas'" class="starBox">
      <i class="iconfont icon-star-card" style="font-size:16px;"></i>
    </span>
  </div>
</template>

<script>
import detailOpt from '../../detailOpt/index'
import ListShow from '@/components/ListShowControls/index.js'

export default {
  name: 'currencyItem',
  props: {
    currencyItem: {
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
    }
  },
  created() {
  },
  data() {
    return {

    }
  },
  methods: {
    listaddTab(currencyItem) { // 跳转客户详情
      currencyItem.billId = currencyItem.custId
      currencyItem.billName = currencyItem.custName
      currencyItem.moduleCode = 'BF001'
      this.$MXEventBus.emit('addTab', currencyItem)
    },
    getListData(upData) {
      this.$MXEventBus.emit('getListDatas', false, upData)
    }
  },
  components: Object.assign({
    'detail-opt': detailOpt
  }, ListShow)
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "../zh-cn.less";
@import "../en.less";
@import "./less/currency/zh-cn.less";
@import "./less/currency/en.less";
</style>
