<template>
  <div class="ControlsExhibition Country" :style="{display:inline ? 'inline-block' : ''}">
    <span class="label" :style="{width:labelWidth}" v-if="labelWidth!=0">{{itemData.cnFieldCaption}}</span>
    <div class="content" :style="{'margin-left':labelWidth}">
        <span class="fieldShow">
            {{itemData.value}}
        </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Country',
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
    },
    inline: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showEdit: false,
      backupData: '' // 备份用
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../zh-cn.less";
@import "../en.less";
</style>
