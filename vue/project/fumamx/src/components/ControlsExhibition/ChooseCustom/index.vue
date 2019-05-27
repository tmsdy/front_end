<template>
    <div class="ControlsExhibition">
        <span class="label" :style="{width:labelWidth,'text-align':labelPosition}">{{itemData.cnFieldCaption}}</span>
        <div class="content" :style="{'margin-left':labelWidth}">
            <!-- 这里不加  class="editShow" 因为多选 要撑开 -->
            <span v-if="showEdit">
                <el-select ref="editInput" v-model="selectedVal" multiple @change="onChange" @visible-change="isDown" size="mini" placeholder="" style="width:180px;">
                    <el-option v-for="(item,index) in downBoxValues" :key="index" :label="item.itemName" :value="item.dictItemCode+''" :disabled="(item.dictItemCode == '0' && itemData.isNotNull == '1') || item.inUse == 0"> </el-option>
                </el-select>
                <span class="editClose" @click="showEdit=!showEdit">
                    <i class="iconfont icon-close"></i>
                </span>
            </span>

            <span class="fieldShow" v-show="!showEdit">
                <span v-if="itemData.fieldValue && itemData.fieldValue != ''">{{getDownItemLabel(itemData.fieldValue)}}</span>
                <span v-else>{{$t('mxpcweb.components.1530844935166')}}</span>
                <span class="edit" @click="showEdit=!showEdit;getDownData();" v-if="itemData.editState == 1">
                    <i class="iconfont icon-edit-round"></i>
                </span>
            </span>

        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

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
      selectedVal: [],
      showEdit: false,
      downBoxValues: []// 下拉值
    }
  },
  created () {
    this.itemData.fieldValue = this.itemData.fieldValue || ''
    this.getDownData()
    if (this.itemData.fieldValue) {
      this.selectedVal = this.itemData.fieldValue.split(',')
    }
  },
  computed: {
    ...mapGetters(['cusBoxValue'])
  },
  methods: {
    // 拿 id 数组 匹配到label
    getDownItemLabel (val) {
      if (!val) { return }
      let arr = val.split(',')
      let values = ''
      arr.forEach(item => {
        this.downBoxValues.forEach(function (item2) {
          if (item2.dictItemCode == item) {
            values += item2.itemName + ','
          }
        })
      })
      values = values.substring(0, values.length - 1) // 删掉最后一个逗号
      return values
    },
    // 获取自定义 【多选】 下拉值
    getDownData () {
      let _this = this
      if (!_this.itemData.dictCode || !_this.cusBoxValue) { return }
      let currentObj = _this.cusBoxValue.filter(function (item) {
        return item.dictCode == _this.itemData.dictCode
      })
      if (currentObj.length === 0 || !currentObj[0].customDictitems) { return }
      _this.downBoxValues = currentObj[0].customDictitems.concat()
    },
    onChange (valArr) {
      this.$emit('modifyData', {
        [this.itemData.fieldName]: valArr + ''
      })
    },
    isDown (is) {
      if (!is) {
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
