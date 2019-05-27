<template>
    <div class="ControlsExhibition">
        <span class="label" :style="{width:labelWidth}">{{itemData.cnFieldCaption}}</span>
        <div class="content" :style="{'margin-left':labelWidth}">
            <span class="editShow" v-if="showEdit">
                <el-select ref="editInput" v-model="backupData" @change="onChange" size="mini" placeholder="" style="width:180px;">
                    <el-option v-for="(item,index) in downBoxValues" :key="index" :label="item.itemName" :value="item.dictItemCode+''">
                    </el-option>
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
import { mapGetters } from 'vuex'
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
      backupData: '', // 备份用
      downBoxValues: []// 下拉值
    }
  },
  created () {
    if (this.itemData.fieldValue) {
      this.backupData = Object.assign(this.itemData.fieldValue) + '' // 复制一份，后面比较用
    }
    this.getDownData()// 在store中找到对应词典
  },
  computed: {
    ...mapGetters([
      'sysBoxValue'
    ])
  },
  methods: {
    // id 匹配到label
    getDownItemLabel (id) {
      let label = ''
      this.downBoxValues.forEach(function (item) {
        if (item.dictItemCode == id) { label = item.itemName }
      })
      if (label) { return label } else { return this.$t('mxpcweb.components.1530846100847') } // 没有查到对应数据
    },
    // 在store中找到对应词典，供下拉使用
    getDownData () {
      let _this = this
      if (!_this.itemData.dictCode && !_this.sysBoxValue) { return }
      let currentObj = _this.sysBoxValue.filter(function (item) {
        return item.dictCode == _this.itemData.dictCode
      })
      if (currentObj.length > 0 && currentObj[0].dictItems != undefined) { _this.downBoxValues = currentObj[0].dictItems }
    },
    onChange (val) {
      this.itemData.fieldValue = val
      this.$emit('modifyData', {
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
