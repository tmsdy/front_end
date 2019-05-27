<template>
    <ul class="moduleAdd">
        <li v-for="(item,index) in moduleAddArr" :key="index">{{item.text}}<span @click="$emit('click', item)"><i class="iconfont icon-plus-file"></i></span></li>
    </ul>
</template>

<script>
export default {
  name: 'moduleToAdd',
  props: {},
  data () {
    return {
      moduleAddArr: [
          {
              id: 1,
              text: this.$t('fumamx-web-templateeditor.1533283301404') // 文本
          },
          {
              id: 2,
              text: this.$t('fumamx-web-templateeditor.1533283459213') // '分隔线'
          },
          {
              id: 3,
              text: this.$t('fumamx-web-templateeditor.1533283477002') // '单图片'
          },
          {
              id: 4,
              text: this.$t('fumamx-web-templateeditor.1533283491482') // '一组图片'
          },
          {
              id: 5,
              text: this.$t('fumamx-web-templateeditor.1533283532540') // '上图片+文字'
          },
          {
              id: 6,
              text: this.$t('fumamx-web-templateeditor.1533284052348') // '左图片+文字'
          },
          {
              id: 7,
              text: this.$t('fumamx-web-templateeditor.1533284106244') // '右图片+文字'
          },
          {
              id: 8,
              text: this.$t('fumamx-web-templateeditor.1533284140850') // '底部信息'
          },
          {
              id: 9,
              text: this.$t('mxpcweb.PP001.PP001List.1540347621354') // '商品' // '底部信息'
          }
      ] // 添加邮件模块
    }
  },
  created () {},
  methods: {
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
ul.moduleAdd{
    // border:1px solid red;
    margin:5px 8px;
    >li{
        display: inline-block;
        width: 25%;
        padding-top: 70px;
        height: 100px;
        overflow: hidden;
        margin-bottom: 15px;
        text-align: center;
        position: relative;
        color: #999;
        >span{
            display: none;
            position: absolute;
            width: 19px;
            height: 19px;
            line-height: 19px;
            text-align: center;
            color: #fff;
            background:linear-gradient(135deg,rgba(255,105,124,1),rgba(208,2,27,1));
            border-radius: 50%;
            left: 50%;
            margin-left: -10px;
            top: 50%;
            margin-top: -10px;
            z-index: 1;
            >i{
                font-size: 12px;
            }
            &:hover{
                background: #E6001F;
                cursor: pointer;
            }
            &:active{
                background: #d0021b;
            }
        }
        &:before{
            content: '';
            position: absolute;
            border:1px solid #DFE2E4;
            border-radius: 4px;
            left: 7px;
            right: 7px;
            top:0;
            bottom: 0;
        }
        &:after{
            // border:1px solid #f00;
            content: '';
            position: absolute;
            left: 25px;
            right: 25px;
            top: 5px;
            bottom: 30px;
            // background: url('/static/images/amTemplateImg/2.png');
            background: url('/static/mail/dragEdit/block-icons.svg') 20px 20px no-repeat;
            // background-size: 100% 100%;
        }
        &:nth-child(1)::after{
            background-position: -176px 20px;
        }
        &:nth-child(2)::after{
            background-position: -364px 20px;
        }
        &:nth-child(3)::after{
            background-position: 10px 20px;
        }
        &:nth-child(4)::after{
            background-position: -51px 20px;
        }
        &:nth-child(5)::after{
            background-position: -550px 20px;
        }
        &:nth-child(6)::after{
            background-position: -426px 20px;
        }
        &:nth-child(7)::after{
            background-position: -487px 20px;
        }
        &:nth-child(8)::after{
            background-position: -797px 20px;
        }
        &:nth-child(9)::after{
            background-position: -979px 20px;
        }
        &:hover{
            >span{
                display: block;
            }
            &:before{
                border-color: #C0C4CC;
            }
        }
    }
}
// @import "./zh-cn.less";
// @import "./en.less";
</style>
