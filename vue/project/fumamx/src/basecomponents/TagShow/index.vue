<template>
    <div class="TagShow">
        <!-- 标签 -->
        <span class="tagLabel" :style="{'width': labelWidth}" v-if="labelWidth != '0'">{{$t('mxpcweb.client.detail.1529996301986')}}</span>
        <div class="tagContent" :style="{'margin-left':labelWidth}">
            <el-tag v-for="(item,index) in dataList" :key="index" :style="setBgColor(item.color)">{{item.labelName}}</el-tag>
            <span class="tagBtn" @click="$emit('tagEditShow')" v-if="showAdd">
                <i class="iconfont icon-tag"></i>
            </span>
        </div>
    </div>
</template>

<script>
// 用于标签的展示
import { tagsBgColor } from '@/libs/utils.js'
export default {
  name: 'TagShow',
  props: {
    labelWidth: {
      type: String,
      default: '100px'
    },
    dataList: {
      type: Array,
      default: function() {
        return []
      }
    },
    showAdd: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  methods: {
    // 背景色
    setBgColor(id) {
      return tagsBgColor(id)
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.TagShow {
  // border: 1px solid red;
  margin: 5px 0;
  .tagLabel {
    color: #606266;
    float: left;
    padding-top: 1px;
  }
  .tagContent {
    // border:1px solid blue;
    padding-left: 6px;
    .el-tag {
      margin-right: 5px;
    }
    .tagBtn {
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      border-radius: 50%;
      position: relative;
      top: 3px;
      color: #222;
      box-sizing: border-box;
      // border:1px solid red;
      > i {
        font-size: 18px;
      }
      &:hover {
        color: #d0021b;
        cursor: pointer;
      }
    }
  }
}
</style>
