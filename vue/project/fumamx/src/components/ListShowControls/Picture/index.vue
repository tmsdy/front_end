<template>
  <div class="openImgBox" :class="size + 'Box'">
    <div class="openImg" :class="size" v-for="(item,index) in value.value" :key="index">
      <a :href="picUrl(item,'orig')" :data-lightbox="value.value[0] + getId()" data-title="FumaMX">
        <img :src="picUrl(item,'80x80')">
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Controls-Picture',
  props: {
    itemData: {
      type: Object,
      default: function () {
        return {}
      }
    },
    value: {
      type: Object,
      default: function () {
        return {
          value: ''
        }
      }
    },
    size: {
      type: String,
      default: 'mini'
    }
  },
  data () {
    return {
    }
  },
  created () {

  },
  methods: {
    getId() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
          let r = Math.random() * 16 | 0
          let v = c == 'x' ? r : (r & 0x3 | 0x8)
          return v.toString(16)
      })
    },
    // 图片展示的URL
    picUrl(picId, picSize) {
      return this.getGlobalImgSrc(picId, picSize)
    }
  },
  components: {
  },
  beforeDestroy: function () {
    this.getId = null
    this.picUrl = null
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .openImgBox {
    display: inline-block;
    vertical-align: top;
    .openImg {
      width: 40px;
      height: 40px;
      border-radius: 3px;
      display: inline-block;
      border: 1px #cccccc solid;
      margin-right: 5px;
      img {
        width: 100%;
        height: 100%;
        display: block;
        border-radius: 3px;
      }
    }
    .mini{
      width: 25px;
      height: 25px;
    }
    .small{
      width: 40px;
      height: 40px;
    }
    .large{
      width: 80px;
      height: 80px;
    }
    .middle{
      width: 60px;
      height: 60px;
    }
  }
  .miniBox{
    max-width: 110px;
  }
  .smallBox{
    max-width: 140px;
  }
  .largeBox{
    max-width: 250px;
  }
  .middleBox{
    max-width: 200px;
  }
</style>
