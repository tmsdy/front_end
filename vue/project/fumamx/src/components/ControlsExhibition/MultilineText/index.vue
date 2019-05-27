<template>
    <div class="ControlsExhibition MultilineText" :style="{display:inline ? 'inline-block' : ''}">

        <span class="label" :style="{width:labelWidth}" :class="labelWidth=='0'?'margin0':''">{{itemData.cnFieldCaption}}</span>
        <div class="content" :style="{'margin-left':labelWidth}">
            <span class="editShow" v-if="showEdit">
                <el-input ref="editInput" v-if="showEdit" v-model="itemData.fieldValue" @blur="editBlur" size="mini" style="width:180px;"></el-input>
                <span class="editClose" @click="editCloseClick">
                    <i class="iconfont icon-close"></i>
                </span>
            </span>

            <span class="fieldShow MultilineText" v-show="!showEdit">
                <span v-if="itemData.fieldValue && itemData.fieldValue.toString() !== '0'" class="textContent">{{itemData.fieldValue}}</span>
                <span v-else>{{$t('mxpcweb.components.1530844935166')}}</span>

                <!-- 暂时注释 -->
                <span class="edit" style="padding: 15px; margin-top:-15px;" @click="editClick" v-if="itemData.editState == 1">
                    <i class="iconfont icon-edit-round" style="position:relative; top:-8px;"></i>
                </span>
            </span>
        </div>
    </div>
</template>

<script>
export default {
  name: 'MultilineText',
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
  },
  created () {
    this.copyVal()
  },
  methods: {
    copyVal () {
      this.backupData = this.itemData.fieldValue // 复制一份，后面比较用
    },
    editClick () {
      this.showEdit = true
      this.$nextTick(_ => {
        this.$refs.editInput.$refs.input.focus()
      })
    },
    editBlur () {
      // 值有变化，就告诉到父组件
      if (this.backupData != this.itemData.fieldValue) {
        this.$emit('modifyData', {
          contId: this.itemData.contId,
          [this.itemData.fieldName]: this.itemData.fieldValue
        })
        this.copyVal()
        this.showEdit = false
      }
    },
    editCloseClick () {
      this.showEdit = false
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../zh-cn.less";
@import "../en.less";
</style>
