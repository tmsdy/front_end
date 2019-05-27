<template>
    <div class="ControlsExhibition">
        <span class="label" :style="{width:labelWidth}">{{itemData.cnFieldCaption}}</span>
        <div class="content" :style="{'margin-left':labelWidth}">
            <el-input ref="editInput" v-if="showEdit" v-model="itemData.fieldValue" @blur="editBlur" size="mini" style="width:180px;"></el-input>

            <span class="fieldShow" v-else>
                <span v-if="itemData.fieldValue">{{itemData.fieldValue}}</span>
                <span v-else>{{$t('mxpcweb.components.1530844935166')}}</span>

                <!--<span class="edit" @click="editClick" v-if="itemData.editState == 1">
                    <i class="iconfont icon-edit-round"></i>
                </span>-->
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
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      showEdit: false,
      backupData: '' // 备份用
    }
  },
  created () {
    if (this.itemData.fieldValue) {
      this.backupData = Object.assign(this.itemData.fieldValue) + '' // 复制一份，后面比较用
    }
  },
  methods: {
    editClick () {
      this.showEdit = true
      this.$nextTick(_ => {
        this.$refs.editInput.$refs.input.focus()
      })
    },
    editBlur () {
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
