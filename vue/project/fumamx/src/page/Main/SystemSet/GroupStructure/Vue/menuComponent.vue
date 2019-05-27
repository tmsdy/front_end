<template>
    <div class="menuComponent">
        <span class="item dot-top"></span>
        <p class="operationList" v-if="showNode.add" @click="operation('add')">{{$t('mxpcweb.systemset.groupstructure.1529407688668')}}</p>
        <p class="operationList" v-if="showNode.edit" @click="operation('edit')">{{$t('mxpcweb.systemset.groupstructure.1529407708020')}}</p>
        <!--
        <p class="operationList" @click="operation('select')">选择成员</p>
        <p class="operationList" @click="operation('move')">移动部门到...</p>

        <p class="operationList" v-if="showNode.delete" @click="operation('delete')">//删除部门{{$t('mxpcweb.systemset.groupstructure.1530588638026')}}</p>
        -->
    </div>
</template>

<script>
export default {
    props: {
        showNode: {
            type: Object,
            default: function () {
                return {
                    add: true,
                    edit: true,
                    delete: true
                }
            }
        }
    },
    data() {
        return {

        }
    },
    mounted() {

    },
    methods: {
        operation(action) {
            this.$emit('operation', action)
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.menuComponent {
  width: 100px;
  height: auto;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;

  //display: none;
  box-shadow: 0 0 10px #ccc;
  padding: 5px 0;
  z-index: 10;
  .item {
    float: left;
    clear: both;
    margin-bottom: 23px;
  }
  /* 向上的箭头 */
  .dot-top {
    font-size: 0;
    line-height: 0;
    border-width: 10px;
    border-color: #fff;
    border-top-width: 0;
    border-style: dashed;
    border-bottom-style: solid;
    border-left-color: transparent;
    border-right-color: transparent;
    position: absolute;
    top: -8px;
    // left: 50%;
    margin-left: 68px;
  }
  .operationTitle {
    width: 100%;
    text-align: center;
    height: 20px;
    line-height: 20px;
    // color: #000;
    font-size: 16px;
  }
  .operationList {
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 13px;
    // color: #000;
    text-align: left;
    text-indent: 10px;
  }
  .operationList:hover {
    background-color: #f1f1f1;
    cursor: default;
    color: #008cee;
  }
}
</style>
