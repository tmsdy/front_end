<template>
    <div class="ControlsExhibition">
        <span class="label" :style="{width:labelWidth}">{{itemData.cnFieldCaption}}</span>
        <div class="content" :style="{'margin-left':labelWidth}">
            <span class="editShow" v-if="showEdit">
              <el-date-picker v-model="abc" type="date" format="yyyy-MM-dd"
              :picker-options="pickerOptions" @change="editOnchange" @blur="editBlur" :clearable="false" size="mini" style="width:180px;"></el-date-picker>
                <span class="editClose" @click="showEdit=!showEdit">
                    <i class="iconfont icon-close"></i>
                </span>
            </span>

            <span class="fieldShow" v-show="!showEdit">
                <span v-if="backupData">{{formatDate(backupData)}}</span>
                <span v-else>{{$t('mxpcweb.components.1530844935166')}}</span>

                <span class="edit" @click="editClick" v-if="itemData.editState == 1">
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
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      pickerOptions: {},
      showEdit: false,
      abc: '',
      backupData: '' // 备份用
    }
  },
  created () {
    // this.backupData = Object.assign(this.itemData.fieldValue) + ''; //复制一份，后面比较用
    this.backupData = this.itemData.fieldValue // 复制一份，后面比较用
    // console.log(this.itemData)
    // console.log(this.timeShow_custom(this.itemData.fieldValue, 'MM-DD'))
  },
  mounted () {
    // console.log(this.itemData)
  },
  methods: {
    formatDate (val) {
      // console.log(val + '+++')
      return this.timeShow_custom(val, 'MM-DD')
      // return this.$m_unifiedTime(val, 'MM-DD')
    },
    editClick () {
      this.showEdit = true
      this.$nextTick(_ => {
        // this.$refs.editInput.$refs.input.focus();
      })
    },
    editOnchange (val) {
      // this.showEdit = false;
      // console.log(this.itemData)
      // console.log(val)
      // console.log(this.$m_unifiedTime(val, {format: "YYYY-MM-DD HH:mm:ss"}))
      // console.log(val)
      let data = val + ' 00:00:00'
      // console.log(data)
      this.backupData = data
      this.$emit('modifyData', {
        contId: this.itemData.contId,
        [this.itemData.fieldName]: data
      })
      this.showEdit = false
    },
    editBlur () {
      // let _this = this
      // setTimeout(function () {
      //   _this.showEdit = false
      // }, 600)
    }

  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../zh-cn.less";
@import "../en.less";
</style>
