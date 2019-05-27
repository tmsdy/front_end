<template>
  <span>
    <span class="iconSex">
        <i v-if="value.value === '2'" class="iconfont icon-woman" title="woman"></i>
        <i v-if="value.value === '1'" class="iconfont icon-man" title="man"></i>
        <i v-if="value.value === '0'" class="iconfont icon-avatar" title="unknow sex"></i>
    </span>
  </span>
</template>

<script>
export default {
  name: 'Controls-Text',
  props: {
    value: {
      type: Object,
      default: function () {
        return {
          value: ''
        }
      }
    }
  },
  data () {
    return {

    }
  }
}
</script>
<style  lang="less" rel="stylesheet/less" scoped>
.iconSex {
    margin: -3px 0 0;
    .iconfont {
        display: inline-block;
        color: #fff;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        border-radius: 50%;
        font-size: 10px;
        margin: 0 2px;
        &.icon-woman {
            background-color: #f65e8d;
        }
        &.icon-man {
            background-color: #38adff;
        }
        &.icon-avatar {
            background-color: #ddd;
        }
        &.icon-personnel {
            background-color: #008cee;
        }
    }
}
</style>
