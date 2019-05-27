<template>
  <div class="batchOperation" :style="{ bottom: isShow ? '0px' : '-50px' }">
    <div class="all">
      <div class="all_checkbox">
        <el-checkbox v-model="checked" @change="change"></el-checkbox>
      </div>
    </div>
    <div class="operationList" @click="adjustmentDepartment">
      <span class="iconBox">
        <i class="iconfont icon-remove"></i>
      </span>
      <!-- 调整部门 -->{{$t('mxpcweb.systemset.groupstructure.1529400302543')}}
    </div>
    <div class="close" @click="close">
      <i class="iconfont icon-close"></i>
    </div>
  </div>
</template>
<script>
const init = {
  isShow: false,
  checked: true
}
export default {
  name: 'batchOperation',
  data () {
    return {
      ...init
    }
  },
  methods: {
    init () {
      Object.keys(init).forEach(key => {
        this[key] = init[key]
      })
    },
    action (isShow, checked) {
      this.isShow = isShow
      this.checked = checked
    },
    change () {
      this.$emit('batchOperationChange', this.checked)
    },
    adjustmentDepartment () {
      this.$emit('adjustmentDepartment')
    },
    close () {
      this.$emit('batchOperationChange', false)
      this.init()
    }
  },
  components: {}
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.batchOperation {
  height: 50px;
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;
  transition: all 0.2s linear;
  background-color: #ffffff;
  .all {
    height: 50px;
    position: relative;
    overflow: hidden;
    float: left;
    padding-left: 30px;
    padding-right: 20px;
    .all_checkbox {
      width: 10px;
      height: 10px;
      margin: 10px auto;
    }
  }
  .operationList {
    width: 100px;
    height: 50px;
    float: left;
    cursor: pointer;
    .iconBox {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: linear-gradient(
        135deg,
        rgba(255, 105, 124, 1),
        rgba(208, 2, 27, 1)
      );
      border-radius: 50px;
      color: rgba(34, 34, 34, 1);
      line-height: 20px;
      text-align: center;
      margin-top: 8px;
      margin-right: 10px;
      font-size: 14px;
      font-weight: bold;
      i {
        color: #ffffff;
      }
    }
  }
  .close {
    width: 20px;
    height: 20px;
    float: right;
    background: #999999;
    border-radius: 50px;
    color: #ffffff;
    line-height: 20px;
    text-align: center;
    margin-top: 8px;
    margin-right: 17px;
    cursor: pointer;
    i {
      font-size: 10px;
    }
  }
}
</style>
