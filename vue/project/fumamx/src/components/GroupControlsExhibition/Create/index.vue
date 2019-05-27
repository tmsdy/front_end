<template>
    <div class="GroupControlsExhibition">
        <span class="labelGroup" :style="{width:labelWidth}">{{itemData.cnFieldCaption}}</span>
        <div class="contentGroup">
            <span v-for="(item,index) in itemData.group" :key="index">
                <component class="component" v-bind:is="'control'+item.controlTypeId" :itemData="item" labelWidth="0" :inline="true" style="margin-right:5px;"></component>
            </span>
        </div>
    </div>
</template>

<script>
import Controls from '@/components/ControlsExhibition/index.js'
export default {
  name: 'GroupControlsExhibition',
  props: {
    labelWidth: {
      type: String,
      default: '100px'
    },
    itemData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {

    }
  },
  mounted () {
    // console.log(this.itemData)
  },
  components: Object.assign({
  }, Controls)
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../zh-cn.less";
@import "../en.less";
</style>
