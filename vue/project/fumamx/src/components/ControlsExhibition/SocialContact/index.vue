<template>
    <div class="ControlsExhibition ">
        <span class="label" :style="{width:labelWidth}">{{itemData.cnFieldCaption}}</span>
        <div class="content" :style="{'margin-left':labelWidth}">
            <div class="socialIcons" v-if="accountValues.length>0">
                <span v-for="(item,index) in accountValues" :key="index" @click="socialUrl(item)" :title="item.accountVal">
                    <i class="iconfont" :class="item.iconUri"></i>
                </span>
            </div>
            <div v-else>{{$t('mxpcweb.components.1530844935166')}}</div>
        </div>
    </div>
</template>

<script>
import { isObject } from '@/libs/utils.js'
export default {
  name: 'Controls',
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
      accountValues: []
    }
  },
  created () {
    this.setView()
    // console.log(this.itemData)
  },
  methods: {
    setView () {
      let _this = this
      let fieldValue = this.itemData.fieldValue
      let social = this.itemData.social
      if (isObject(fieldValue)) {
        let keys = Object.keys(fieldValue)
        let values = Object.values(fieldValue)
        // console.log(values);
        let newArray = []
        keys.forEach(function (item, index) {
          social.forEach(function (item2) {
            // 且有值时，才push放上
            if (item == item2.socialId && values[index] != '') {
              item2.accountVal = values[index]
              newArray.push(item2)
            }
          })
        })
        // console.log(newArray);
        _this.accountValues = newArray
      }
    },
    // 社交账号点击跳转
    socialUrl (obj) {
      this.openNewWindowTab(obj.uri)
    }
  },
  watch: {
    // 监听改变时，刷新数据
    itemData: function () {
      this.setView()
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../zh-cn.less";
@import "../en.less";
.socialIcons {
    // border:1px solid red;
    padding-top: 1px;
    >span {
        background-color: #555;
        color: #fff;
        display: inline-block;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        border-radius: 3px;
        margin-right: 5px;
        &:hover {
            cursor: pointer;
            background-color: #222;
        }
    }
}
</style>
