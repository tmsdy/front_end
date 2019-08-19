<template>
  <div class="customerItem">
    <div v-if="isShowCheck" :class="[controlData.checkedCities.length==0 ? 'listCheckNone' : 'listChecks']">
      <el-checkbox :label="workOrderItem[moduleStruct.identField]" size="small">&nbsp;</el-checkbox>
    </div>
    <el-row :gutter="24" class="customerInfo">
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <span v-if="listSet.listSetAllow.length==0">
            &nbsp;
          </span>
          <div v-else class="grid-content bg-purple" style="display:inline-block;width:100%">
            <span class="ellipsis" v-for="(fieldItem,fieldIndex) in listSet.listSetAllow" :key="fieldIndex" :class="classItem(fieldItem)" @click="listClick(fieldItem, workOrderItem)" style="display:inline-block;width:16%;text-align:left;height:17px;" :style="{'width':(parseInt(fieldItem.columnWidth)/listSet.allColumnWidth)*99+'%'}">
              <component :class="detailOpt.length > 0 && fieldIndex > 1 && fieldIndex > listSet.listSetAllow.length - 2 ? 'listTimes1' : ''" :workOrderItem="workOrderItem" v-bind:is="'control'+fieldItem.controlTypeId" ref="control" :itemData="fieldItem" :moduleCode="moduleCode" :accountInfo="workOrderItem.accountInfo" :value="{value:fieldItem.fieldName?workOrderItem[fieldItem.fieldName]:''}"></component>
            </span>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="listTimes3">
      <detail-opt :isChildBill="isChildBill" @optChildBill="optChildBill" useType="customer" :moduleStructName="moduleStruct.titleField" :moduleStructId="moduleStruct.identField" :moduleCode="moduleCode" @getListData="getListData" :detailOptData="detailOpt" :itemData="workOrderItem"></detail-opt>
    </div>
    <span v-if="isFocusBill(workOrderItem.focusTargets)&&viewType!='seas'" class="starBox">
      <i class="iconfont icon-star-card" style="font-size:16px;"></i>
    </span>
  </div>
</template>

<script>
import detailOpt from '../../detailOpt/index'
import ListShow from '@/components/ListShowControls/index.js'

export default {
  name: 'workOrderItem',
  props: {
    workOrderItem: {
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

    }
  },
  methods: {
    classItem(item) {
      if (this.moduleStruct.titleField == item.fieldName || item.fieldName == 'quotaTheme') {
        return 'text-hover'
      }
      return ''
    },
    listClick(item, workOrderItem) {
      if (this.moduleStruct.titleField == item.fieldName || item.fieldName == 'quotaTheme') {
        this.listaddTab(workOrderItem)
      }
    },
    optChildBill(item) {
      this.$emit('optChildBill', item)
    },
    listaddTab(workOrderItem) {
      workOrderItem.billId = workOrderItem[this.moduleStruct.identField]
      workOrderItem.moduleCode = this.moduleCode
      workOrderItem.billName = workOrderItem[this.moduleStruct.titleField]
      if (workOrderItem.moduleCode == 'PS001') {
        let data = {
          iconURI: 'icon-eye',
          optCode: 'otView',
          optModuleCode: workOrderItem.moduleCode,
          optName: '查看'
        }
        this.optClick(data, workOrderItem)
      } else if (this.getRoute().parentNaviCode == 'NV011') {
        this.$MXEventBus.emit('saleAddTab', workOrderItem)
      } else {
        this.$MXEventBus.emit('addTab', workOrderItem)
      }
    },
    getListData(upData) {
      this.$emit('getListData', upData)
    }
  },
  components: Object.assign({
    'detail-opt': detailOpt
  }, ListShow)
}
</script>
