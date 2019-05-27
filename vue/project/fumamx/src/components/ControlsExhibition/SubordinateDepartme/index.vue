<template>
  <div class="ControlsExhibition">
    <span class="label" :style="{width:labelWidth,'text-align':labelPosition}" v-if="itemData.cnFieldCaption">{{itemData.cnFieldCaption}}</span>
    <div class="content" :style="contentStyle">
      <span class="editShow" v-if="showEdit">
        <el-select ref="editInput" v-model="backupData" @change="onChange" size="mini" placeholder="" style="width:180px;">
          <el-option v-for="(item,index) in options" :key="index" :label="item.deptName"  :disabled="item.inUse==0" :value="item.dkey+''"></el-option>
        </el-select>
        <span class="editClose" @click="showEdit=!showEdit">
          <i class="iconfont icon-close"></i>
        </span>
      </span>

      <span class="fieldShow" v-show="!showEdit">
        <span class="fieldVal">{{valToText(itemData.fieldValue)}}</span>
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
    },
    options: {
      type: Array,
      default: function () {
        return []
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
  },
  mounted () {
    let _this = this
    setTimeout(function () {
      _this.backupData = _this.itemData.fieldValue + ''.repeat(1)
    }, 2000)
  },
  computed: {
    contentStyle: function() {
      if (this.itemData.cnFieldCaption != '') {
        return {'margin-left': this.labelWidth}
      }
    }
  },
  methods: {
    valToText (id) {
      let data = this.options.filter(function (item) {
        return item.dkey == id
      })
      if (data.length > 0 && data[0].deptName) { return data[0].deptName } else { return this.$t('mxpcweb.components.1530845719538') }
    },
    onChange (val) {
      this.itemData.fieldValue = val
      this.$emit('modifyData', {
        [this.itemData.fieldName]: val
      })
      this.showEdit = false
    }
  },
  watch: {
    'options': function (val, oldVal) {
      // console.log(" _______________________ ");
      // console.log(val);
      // console.log(oldVal);
      // 正面判断出有变化
      if (oldVal.length != 0) {
        this.itemData.fieldValue = val[0].dkey
      }
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../zh-cn.less";
@import "../en.less";
</style>
