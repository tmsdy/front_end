<template>
    <div class="ControlsExhibition PersonnelSelection" :style="{display:inline ? 'inline-block' : ''}">
        <span class="label" :style="{width:labelWidth}" v-if="labelWidth!=0">{{itemData.cnFieldCaption}}</span>
        <div class="content" :style="{'margin-left':labelWidth}">
            <el-input ref="editInput" v-if="showEdit" v-model="itemData.fieldValue" @blur="editBlur" size="mini" style="width:180px;"></el-input>

            <span class="fieldShow" v-else>
                <!--{{itemData.fieldValue}}-->
                {{valToText(itemData.fieldValue)}}
                <span class="edit" @click="editClick" v-if="itemData.editState == 1">
                    <i class="iconfont icon-edit-round"></i>
                </span>
            </span>
        </div>
    </div>
</template>

<script>
import { isArray } from '@/libs/utils.js'
export default {
  name: 'PersonnelSelection',
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
    this.backupData = Object.assign(this.itemData.fieldValue) + '' // 复制一份，后面比较用
  },
  methods: {
    valToText (id) {
      // console.log(this.itemData)
      let _this = this
      let toText = this.itemData.Owners.filter(function (item) {
        return item.ctId == _this.itemData.fieldValue
      })
      if (!isArray(toText) || toText.length === 0) { return }
      if (toText[0].realName) {
        return toText[0].realName
      }
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
