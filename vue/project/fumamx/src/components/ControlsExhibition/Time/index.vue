<template>
    <div class="ControlsExhibition" :style="{display:inline ? 'inline-block' : ''}">

        <span class="label" :style="{width:labelWidth}" v-if="labelWidth!=0">{{itemData.cnFieldCaption}}</span>

        <div class="content" :style="{'margin-left':labelWidth}">

            <span class="editShow" v-if="showEdit">
                <el-date-picker v-model="itemData.fieldValue" type="datetime" @change="editBlur" size="mini" style="width:180px;" placeholder="" format="yyyy-MM-dd HH:mm"></el-date-picker>

                <span class="editClose" @click="showEdit = false">
                    <i class="iconfont icon-close"></i>
                </span>
            </span>

            <span class="fieldShow" v-else>
                <span v-if="itemData.fieldValue">{{timeShow_custom(itemData.fieldValue, 'YYYY-MM-DD HH:mm')}}</span>
                <span v-else>{{$t('mxpcweb.components.1530844935166')}}</span>
                <span class="edit" @click="showEdit = true" v-if="itemData.editState == 1">
                    <i class="iconfont icon-edit-round"></i>
                </span>
            </span>

        </div>

    </div>
</template>

<script>
export default {
  name: 'ControlsExhibition',
  props: {
    labelWidth: {
      type: String,
      default: '100px'
    },
    itemData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    inline: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showEdit: false,
      backupData: '' // 备份用
    }
  },
  created() {
    if (this.itemData.fieldValue) {
      this.backupData = Object.assign(this.itemData.fieldValue) + '' // 复制一份，后面比较用
    }
  },
  methods: {
    formatDate(val) {
      // return this.$m_formulateTime(val)
      return this.timeShow_custom(val, 'MM-DD HH:mm')
    },
    editBlur() {
      // console.log(this.itemData);
      // 值有变化，就告诉到父组件
      if (this.backupData != this.itemData.fieldValue) {
        this.$emit('modifyData', {
          contId: this.itemData.contId,
          [this.itemData.fieldName]: this.itemData.fieldValue
        })
        this.showEdit = false
      } else {
        this.showEdit = false
      }
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../zh-cn.less";
@import "../en.less";
</style>
