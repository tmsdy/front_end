<template>
    <div class="ControlsExhibition" :class="[isError?'isError':'']">
        <span class="label" :style="{width:labelWidth}">{{itemData.cnFieldCaption}}</span>
        <div :style="{'margin-left':labelWidth}">

          <template v-if="mailList.length>0">
            <div class="content" v-for="(item,index) in mailList" :key="index">

                <span v-if="flag === index">
                    <el-input ref="editInput" v-model="mailList[index]" @blur="editBlur" size="mini" style="width:180px;"></el-input>
                    <span class="editClose" @click="closeEdit">
                        <i class="iconfont icon-close"></i>
                    </span>
                </span>

                <span class="fieldShow" v-show="flag !== index">
                    <span class="showVal">{{item}}</span>
                    <span class="edit" @click="editClick(index)" v-if="itemData.editState == 1">
                        <i class="iconfont icon-edit-round"></i>
                    </span>
                </span>

            </div>
            </template>
            <span v-else style="color:#222;padding-left:9px;">{{$t('mxpcweb.components.1530844935166')}}</span>

        </div>
    </div>
</template>

<script>
import { isArray, checkEmail } from '@/libs/utils.js'

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
      flag: null,
      isError: false,
      mailList: []
    }
  },
  created () {
    this.backupVal()
    // console.log(this.itemData)
    // console.log(this.mailList)
  },
  methods: {
    backupVal () {
      if (isArray(this.itemData.fieldValue)) {
        this.mailList = this.itemData.fieldValue.concat() // 复制一份，后面比较用
      }
    },
    closeEdit () {
      this.mailList[this.flag] = this.itemData.fieldValue[this.flag]// 值复原
      this.flag = null
    },
    editClick (index) {
      this.flag = index
      this.$nextTick(_ => {
        this.$refs.editInput[0].$refs.input.focus()
      })
    },
    checkValue () {
      if (!checkEmail(this.mailList[this.flag])) {
        this.isError = true
        this.$refs.editInput[0].$refs.input.focus()
        // 请输入正确的
        this.$message.error(this.$t('mxpcweb.client.1529044037487') + this.itemData.cnFieldCaption)
        return false
      } else {
        this.isError = false
        return true
      }
    },
    editBlur () {
      // console.log(this.mailList[this.flag])
      // console.log(this.itemData.fieldValue[this.flag])
      // 值有变化，就告诉到父组件
      if (this.mailList[this.flag] !== this.itemData.fieldValue[this.flag]) {
        if (!this.checkValue()) { return }
        this.$emit('modifyData', {
          contId: this.itemData.contId,
          [this.itemData.fieldName]: this.mailList
        })
        // console.log(this.mailList)
      }
      this.flag = null
    }
  },
  watch: {
    itemData: function (newVal) {
      // console.log(newVal)
      this.backupVal()
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../zh-cn.less";
@import "../en.less";
</style>
