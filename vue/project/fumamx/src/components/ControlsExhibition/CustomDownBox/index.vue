<template>
    <div class="ControlsExhibition">
        <span class="label" :style="{width:labelWidth,'text-align':labelPosition}">{{itemData.cnFieldCaption}}</span>
        <div class="content" :style="{'margin-left':labelWidth}">

            <span class="editShow" v-if="showEdit">
                <el-select ref="editInput" v-model="itemData.fieldValue" @visible-change="visibleChange" size="mini" placeholder="" style="width:180px;">
                    <el-option v-for="(item,index) in downBoxValues" :key="index" :label="item.itemName" :value="item.dictItemCode+''" :disabled="(item.dictItemCode == '0' && itemData.isNotNull == '1') || item.inUse == 0"> </el-option>
                </el-select>
                <span class="editClose" @click="showEdit=!showEdit;">
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
      showEdit: false,
      downBoxValues: [], // 下拉值
      backupData: '' // 备份用
    }
  },
  created () {
    this.itemData.fieldValue = this.itemData.fieldValue || '0'
    this.backupData = this.itemData.fieldValue.concat()// 备份
    this.getDownData()
  },
  computed: {
    ...mapGetters(['cusBoxValue'])
  },
  methods: {
    // 拿 id 匹配到label
    getDownItemLabel (id) {
      let label = this.$t('mxpcweb.components.1530845719538') // 无匹配
      this.downBoxValues.forEach(function (item) {
        if (id && item.dictItemCode == id) {
          label = item.itemName
        }
      })
      return label
    },
    // 获取自定义下拉值
    getDownData () {
      let _this = this
      if (!_this.itemData.dictCode && !_this.cusBoxValue) { return }
      let currentObj = _this.cusBoxValue.filter(function (item) {
        return item.dictCode == _this.itemData.dictCode
      })
      if (currentObj.length === 0 || !currentObj[0].customDictitems) { return }
      _this.downBoxValues = currentObj[0].customDictitems.concat()
      _this.downBoxValues.unshift({
        dictItemCode: 0,
        itemName: _this.$t('mxpcweb.components.1530844935166') // 无
      })
    },
    visibleChange (is) {
      // console.log(this.itemData.fieldValue)
      // console.log(this.backupData)
      if (is || this.itemData.fieldValue === this.backupData) { return }// 展开下拉时，不提交。值没变也不提交
      this.$emit('modifyData', {
        [this.itemData.fieldName]: this.itemData.fieldValue
      })
      this.showEdit = false
      this.backupData = this.itemData.fieldValue.concat()// 备份
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../zh-cn.less";
@import "../en.less";
</style>
