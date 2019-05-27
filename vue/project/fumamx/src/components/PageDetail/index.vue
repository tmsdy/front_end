<template>
    <!-- 问题详情 -->
    <div class="PageDetail">
        <i class="iconfont" :class="icon"></i>
        <span style="color:RGBA(144, 147, 153, 1);">
            <span v-if="towTitle != ''" class="text-hover" @click="$emit('toListOne')">{{display}}</span>
            <span v-else class="text-hover" @click="$emit('toList')">{{display}}</span>
            <span class="arrow iconfont icon-page-right"></span>
        </span>
        <span v-if="towTitle != ''" style="color:RGBA(144, 147, 153, 1);">
            <span class="text-hover" @click="$emit('toList')">{{towTitle}}</span>
            <span class="arrow iconfont icon-page-right"></span>
        </span>
        {{detailTitle}}
        <!-- 返回-->
        <el-button class="backList" size="mini" @click="$emit('toList')">{{$t('mxpcweb.systemset.feedback.1529408396574')}}</el-button>
    </div>
</template>

<script>
export default {
    name: 'PageDetail',
    props: {
        title: {
            type: String,
            default: ''
        },
        iconfont: {
            type: String,
            default: ''
        },
        towTitle: {
            type: String,
            default: ''
        },
        detailTitle: {
            type: String,
            default: '标题'
        }
    },
    data() {
        return {
            icon: '',
            display: ''
        }
    },
    created() {
        let { display, iconURI } = this.getRoute()
        this.icon = this.iconfont || iconURI
        this.display = this.title || display
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.PageDetail {
  // border:1px solid yellow;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  font-size: 14px;
  padding-left: 19px;
  color: RGBA(48, 49, 51, 1);
  height: 44px;
  line-height: 44px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 0px 0px rgba(244, 244, 244, 1);
  border-radius: 0px 4px 0px 0px;
  padding-left: 40px;
  > .iconfont {
    // border:1px solid red;
    font-size: 16px;
    color: #909399;
    width: 20px;
    height: 20px;
    line-height: 20px;
    position: absolute;
    left: 15px;
    top: 50%;
    margin-top: -10px;
  }
  .arrow {
    color: #303133;
  }
  .backList {
    position: absolute;
    top: 8px;
    right: 13px;
    width: 50px;
    height: 28px;
    background: rgba(255, 255, 255, 1);
    border-radius: 20px;
    border: 1px solid rgba(223, 226, 228, 1);
    color: RGBA(96, 98, 102, 1);
  }
  .backList:hover {
    background: #fdf2f3;
  }
}
</style>
