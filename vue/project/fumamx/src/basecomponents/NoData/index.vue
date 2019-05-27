<template>
    <div class="noDataProps" :class="size">
        <div class="ico">
            <img v-if="img != ''" :src="getSrc()">
            <i v-else class="iconfont" :class="icon"></i>
        </div>
        <div class="text">{{title==''?titleBase:title}}</div>
        <el-button v-if="btnText != ''" class="btnAdd" type="primary" @click="noDataClick">{{btnText}}</el-button>
    </div>
</template>
<script>
// 此组件使用方法如：<noDataProps v-if="noDataShow" v-on:noDataClick='roleMemberAddClick' :icon="noData.icon" :title="noData.title" :btnText="noData.btnText"></noDataProps>
export default {
  name: 'NoData',
  props: {
    size: {
      type: String,
      default: ''
    },
    img: {
      type: String,
      default: 'noData'
    },
    icon: {
      type: String,
      default: 'icon-nodata'
    },
    title: {
      type: String,
      default: ''
    },
    btnText: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      titleBase: this.$t('mxpcweb.client.1529055628584')
    }
  },
  methods: {
    getSrc () {
      return '/static/images/noData/' + this.img + '.png'
    },
    noDataClick () {
      this.$emit('noDataClick')
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
    .noDataProps {
        background-color: #fff;
        border-radius: 4px;
        padding: 30px 0 15px;
        color: #aaa;
        text-align: center;
        img{
            width:150px;
            height: 120px;
        }
        .iconfont {
            font-size: 45px;
        }
        .text {
            margin: 5px 0 10px;
        }
        .btnAdd {
            margin-bottom: 20px;
        }
        &.small {
          // border:1px solid red;
          padding: 10px 0;
          img {
            width: 77px;
            height: 60px;
          }
          .text {
              margin: 2px 0;
          }
          .iconfont {
            font-size: 22px;
          }
        }
    }
</style>
