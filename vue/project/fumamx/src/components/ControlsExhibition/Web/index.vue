<template>
  <div class="ControlsExhibition" :class="[isError?'isError':'']">
    <span class="label" :style="{width:labelWidth}">{{itemData.cnFieldCaption}}</span>
    <div class="content" :style="{'margin-left':labelWidth}">
      <span class="editShow" v-if="showEdit">
        <el-input ref="editInput" v-if="showEdit" v-model="itemData.fieldValue" @blur="editBlur" size="mini" style="width:180px;">
          <!-- <template slot="prepend">http://</template> -->
        </el-input>
        <span class="editClose" @click="editClose">
          <i class="iconfont icon-close"></i>
        </span>
      </span>

      <span class="fieldShow" v-show="!showEdit">
        <span class="showVal text-hover" v-if="itemData.fieldValue" :title="itemData.fieldValue" @click="goLink(itemData.fieldValue)">{{itemData.fieldValue}}</span>
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
      showEdit: false,
      isError: false,
      backupData: '' // 备份用
    }
  },
  created () {
    this.backupData = this.itemData.fieldValue // 复制一份，后面比较用
  },
  methods: {
    // 点击跳转
    goLink(val) {
      if (val.indexOf('http://') !== -1 || val.indexOf('https://') !== -1) {
        this.openNewWindowTab(val) // 直接跳转
      } else {
        this.openNewWindowTab('http://' + val)
      }
    },
    editClick () {
      this.showEdit = true
      this.$nextTick(_ => {
        this.$refs.editInput.$refs.input.focus()
      })
    },
    checkValue () {
      let myreg = /[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
      if (!myreg.test(this.itemData.fieldValue)) {
        this.isError = true
        this.$refs.editInput.$refs.input.focus()
        this.$message.error(this.$t('mxpcweb.client.1529044037487') + this.itemData.cnFieldCaption) //  请输入正确的
        return false
      } else {
        this.isError = false
        return true
      }
    },
    editBlur () {
      // 值有变化，就告诉到父组件，并校验一下
      let inputVal = this.itemData.fieldValue
      if (this.backupData != inputVal) {
        if (inputVal && !this.checkValue()) { return }

        let data = { [this.itemData.fieldName]: this.itemData.fieldValue }
        if (this.itemData.contId != '' && this.itemData.contId != undefined) {
          data.contId = this.itemData.contId
        }
        this.$emit('modifyData', data)
        this.backupData = inputVal
      }
      this.showEdit = false
    },
    editClose () {
      this.showEdit = false
      // this.itemData.fieldValue = this.backupData;
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../zh-cn.less";
@import "../en.less";
</style>
