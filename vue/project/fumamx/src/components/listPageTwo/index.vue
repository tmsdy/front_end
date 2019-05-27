<template>
  <div class="listPage" v-show="blockData.total>0">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="blockData.fromNum" :page-size="blockData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="blockData.total">
    </el-pagination>
  </div>
</template>
<script>
/**
 * 描述：客户管理-客户列表-编辑客户
 * 作者：何俊峰
 * 时间：2017/11/22
 */
import { setStore } from '@/libs/utils.js'
export default {
  name: 'listPage',
  props: {
    blockData: {
      type: Object,
      default: function () {
        return {
          pageSize: 20,
          fromNum: 1,
          total: 0
        }
      }
    },

    moduleCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 分页操作
      currentPage: 1, // 第一页
      pageSizes: [20, 30, 40, 50, 100, 200],
      routeUrl: '',
      params: {}
    }
  },
  methods: {
    // 分页
    // 分页条数改变触发事件
    handleSizeChange(val) {
      let _this = this
      _this.blockData.pageSize = val
      if (_this.moduleCode !== '') {
        setStore(_this.$route.path + 'listPagesize', val)
      }
      _this.handleCurrentChange(_this.currentPage)
    },
    currentPageclear() {
      this.currentPage = 1
    },
    // 页数改变触发
    handleCurrentChange(val) {
      // console.log('页数改变触发' + val)
      let _this = this
      _this.blockData.fromNum = val// _this.blockData.pageSize * (val - 1)
      _this.$emit('getListData', false, true)
    }
  },
  components: {

  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
