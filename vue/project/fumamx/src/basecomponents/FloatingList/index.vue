<template>
    <div class="FloatingListBox MXscroll" v-show="isFloatingListBox">
        <div v-if="list.length===0" class="FloatingList">暂无可选值</div>
        <div class="FloatingList" v-for="(item,index) in list" :key="index" @click="_selectList(item,index)">{{item.text}}</div>
    </div>
</template>

<script>
export default {
  name: 'FloatingList',
  props: {
    list: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      isFloatingListBox: false
    }
  },
  methods: {
    _selectList (item, index) {
      this.$emit('clickList', item, index)
    },
    showFloatingListBox () {
      this.isFloatingListBox = true
    }
  },
  mounted () {
    let _this = this
    document.addEventListener('click', function (e) {
      if (e.target.className.indexOf('arrow-down-empty') === -1) {
        _this.isFloatingListBox = false
      }
    }, false)
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.FloatingListBox {
    width: 100%;
    max-height: 94px;
    overflow-y: auto;
    position: absolute;
    background-color: #ffffff;
    z-index: 3000;
    border: 1px #BFCBD9 solid;
    border-top: none;
    box-shadow: 0px 5px 20px 5px #BFCBD9;
    border-radius: 0px 0px 10px 10px;
    .FloatingList {
        padding: 0px 5px;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        border-bottom: 1px #BFCBD9 solid;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .FloatingList:hover {
        border-bottom: 1px #8391A5 solid;
    }
}
</style>
