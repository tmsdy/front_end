<template>
    <div class="ControlsExhibition">
        <span class="label" :style="{width:labelWidth,'text-align':labelPosition}">{{itemData.cnFieldCaption}}</span>
        <div class="content" :style="{'margin-left':labelWidth}">

            <span class="editShow" v-if="showEdit">
                <el-select ref="editInput" v-model="itemData.fieldValue" @change="onChange" size="mini" placeholder="" style="width:180px;">
                    <el-option v-for="(item,index) in downBoxValues" :key="index" :label="item.itemName" :value="item.dictItemCode+''"> </el-option>
                </el-select>
                <span class="editClose" @click="showEdit=!showEdit">
                    <i class="iconfont icon-close"></i>
                </span>
            </span>

            <span class="fieldShow" v-show="!showEdit">
                <span v-if="itemData.fieldValue">{{getDownItemLabel(itemData.fieldValue)}}</span>
                <span v-else>{{$t('mxpcweb.components.1530844935166')}}</span>
                <span class="edit" @click="showEdit=!showEdit" v-if="itemData.editState == 1">
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
    labelPosition: {
      type: String,
      default: 'left'
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
      downBoxValues: [
        {
          itemName: '男',
          dictItemCode: 1
        },
        {
          itemName: '女',
          dictItemCode: 2
        },
        {
          itemName: '未知',
          dictItemCode: 0
        }
      ]// 下拉值
    }
  },
  created () {

  },
  methods: {
    // id 匹配到label
    getDownItemLabel (id) {
      let label = ''
      this.downBoxValues.forEach(function (item) {
        if (item.dictItemCode == id) { label = item.itemName }
      })
      if (label) { return label } else { return this.$t('mxpcweb.components.1530844935166') }
    },
    onChange (val) {
      this.itemData.fieldValue = val
      this.$emit('modifyData', {
        contId: this.itemData.contId,
        [this.itemData.fieldName]: val
      })
      this.showEdit = false
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../zh-cn.less";
@import "../en.less";
</style>
