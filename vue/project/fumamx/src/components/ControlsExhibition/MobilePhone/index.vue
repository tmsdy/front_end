<template>
    <div class="ControlsExhibition" :class="[isError?'isError':'']">
        <span class="label" :style="{width:labelWidth}">{{itemData.cnFieldCaption}}</span>
        <div :style="{'margin-left':labelWidth}">

            <div class="content" v-for="(item,index) in mailList" :key="index">
                <span v-if="flag === index">
                    <el-input ref="editInput" v-model="mailList[index]" @blur="editBlur" size="mini" style="width:180px;"></el-input>
                    <span class="editClose" @click="closeEdit">
                        <i class="iconfont icon-close"></i>
                    </span>
                </span>

                <span class="fieldShow" v-show="flag !== index">
                    <span v-if="item !== ''" class="showVal">{{item}}</span>
                    <span v-else>{{$t('mxpcweb.components.1530844935166')}}</span>
                    <span class="edit" @click="editClick(index)" v-if="itemData.editState == 1">
                        <i class="iconfont icon-edit-round"></i>
                    </span>
                </span>
            </div>

        </div>
    </div>
</template>

<script>
import { checkPhone, isString, trim } from '@/libs/utils.js'

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
      mailList: [''], // 默认给个空，为显示编辑用
      listBak: []
    }
  },
  created () {
    this.backupVal()
    // console.log(this.itemData)
    // console.log(this.mailList)
  },
  methods: {
    backupVal () {
      let str = this.itemData.fieldValue
      if (isString(str) && trim(str) !== '') {
        this.mailList = this.itemData.fieldValue.split(',')
        this.listBak = this.mailList.concat() // 复制一份，后面比较用
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
      if (!checkPhone(this.mailList[this.flag])) {
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
      // 值有变化，就告诉到父组件
      if (this.mailList[this.flag] !== this.listBak[this.flag]) {
        if (!this.checkValue()) { return }
        this.$emit('modifyData', {
          contId: this.itemData.contId,
          [this.itemData.fieldName]: this.mailList.join(',')
        })
      }
      this.flag = null
    }
  },
  watch: {
    itemData: function (newVal) {
      this.backupVal()
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../zh-cn.less";
@import "../en.less";
.content{
  height: 30px;
}
</style>
