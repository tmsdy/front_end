<template>
    <div class="FieldName">
        <span :style="textstyle" class="showstyle">
            <slot></slot>
        </span>
    </div>
</template>
<script>
export default {
  name: 'FieldName',
  props: {
    textstyle: {
      type: Object,
      default: function () {
        return {}
      }
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.FieldName {
    float: left;
    padding-right: 5px;
    .showstyle {
        min-width: 55px;
        display: block;
        float: left;
        font-weight: 400;
        font-style: normal;
        font-size: 13px;
        color: #333333;
        // text-align: justify;
        // text-justify: distribute-all-lines;
        // /*ie6-8*/
        // text-align-last: justify;
        // /* ie9*/
        // -moz-text-align-last: justify;
        // /*ff*/
        // -webkit-text-align-last: justify;
        // /*chrome 20+*/
    }
}
</style>
