<template>
  <div class="StaffWhitelist mainBodyTab MXscroll" ref="WhiteList">
    <el-form :inline="true" ref="dialogForm" label-width="100px">
      <!-- 域名/邮箱: -->
      <el-form-item :label="$t('mxpcweb.systemset.systemparameter.1535522100090')" label-width="100px">
        <el-input v-model="domain" size="small" style="width:215px;"></el-input>
      </el-form-item>
      <!-- 快速查找: -->
      <el-form-item :label="$t('mxpcweb.systemset.mailset.setindex.1528979084946')" label-width="100px">
        <el-input v-model="keyword" size="small" style="width:215px;"></el-input>
      </el-form-item>

      <el-form-item>
        <!-- 搜索 -->
        <el-button type="primary" @click="searchWhiteList()">{{$t('mxpcweb.systemset.mailset.setindex.1528978960400')}}</el-button>
      </el-form-item>

      <!-- <el-form-item>
        <el-button type="primary" @click="WhiteListDelete()">删除</el-button>
      </el-form-item> -->
      <el-form-item>
        <!-- 新增白名单 -->
        <el-button type="primary" @click="DialogWhiteList()">{{$t('mxpcweb.systemset.mailset.setindex.1528980300509')}}</el-button>
      </el-form-item>
    </el-form>
    <el-table class="columnClass" :data="tableData" :height="listHeight" style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>

      <!-- 域名 -->
      <el-table-column prop="addrRegex" :label="$t('mxpcweb.systemset.systemparameter.1535513510532')">
      </el-table-column>
      <!-- 描述 -->
      <el-table-column prop="description" :label="$t('mxpcweb.systemset.systemparameter.1535513528343')">
      </el-table-column>
      <!-- 操作 -->
      <el-table-column>
        <template slot-scope="scope">
          <!-- 删除 -->
          <div class="pull-right">
            <i class="iconfont icon-del" @click.prevent="deleteRow(scope.$index, tableData)"></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPageIndex" :page-size="paging.eachNum" :page-sizes="paging.arrEachNum" :total="paging.total" layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>

    <!--白名单-->
    <dialog-white ref="DialogWhite" @searchWhiteList="searchWhiteList"></dialog-white>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isObject } from '@/libs/utils.js'
import DialogWhite from './DialogWhite/index.vue'
export default {
  name: 'WhiteList',
  props: {},
  data() {
    return {
      currentPageIndex: 1,
      isOpen: false, // 弹窗开关
      tableData: [],
      svalue: '',
      // optionList: [],
      domain: '',
      keyword: '',
      addOpen: false,
      multipleSelection: [],
      paging: {
        total: 0, // 总条数
        currentPage: 1, // 默认当前第几页
        eachNum: 10, // 每页条数
        arrEachNum: [10, 20, 30] // 可选的每页条数
      },
      listHeight: '0'

    }
  },
  created() {
    this.WhiteListGet({})
    // this.getPersonalData();
  },
  mounted() {
    setTimeout(() => {
      this.getWinHeight()
    }, 200)
    $(window).resize(() => {
      this.getWinHeight()
    })
  },
  methods: {
    // 设置固定高
    getWinHeight() {
      let winHeight = document.body.clientHeight
      this.$refs.WhiteList.style.height = winHeight - 150 + 'px'
      this.listHeight = winHeight - 276
    },
    /**
  * 每页数量改变
  */
    handleSizeChange(val) {
      this.paging.eachNum = val
      this.WhiteListGet({})
    },
    /** @augments
 * 页数变更
 */
    handleCurrentChange(val) {
      this.paging.currentPage = val
      this.WhiteListGet({})
    },
    // 白名单
    DialogWhiteList() {
      this.$refs.DialogWhite.isDialog('open', 2)
    },
    // 单个删除
    deleteRow(index, rows) {
      let data = {
        domainId: rows[index].domainId
      }
      this.$http.delete(this.Global.baseURL + this.Global.api.v2.internalMailDomain, { params: data }).then(function (res) {
        if (res.body.code.toString() == this.Global.RES_OK) {
          this.addOpen = false
          this.isOpen = true
          this.$message.success(this.$t('mxpcweb.systemset.mailset.setindex.1528978804169'))// 删除成功！
          rows.splice(index, 1)
        } else {
          this.$message.error(this.msg(res.body))
        }
      },
        function (res) {
          this.$message.error(this.$t(this.Global.errorTitle))
        })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 移除白名单
    WhiteListDelete() {
      let data = { domainId: '' }
      let str = ''
      for (let index = 0; index < this.multipleSelection.length; index++) {
        const element = this.multipleSelection[index]
        str = str + element.domainId + ','
      }
      data.domainId = str.substring(0, str.length - 1)
      this.$http.delete(this.Global.baseURL + this.Global.api.v2.internalMailDomain, { params: data }).then(function (res) {
        if (res.body.code.toString() == this.Global.RES_OK) {
          this.addOpen = false
          this.isOpen = true
          this.$message.success(this.$t('mxpcweb.systemset.mailset.setindex.1528978804169'))// 删除成功！
          this.searchWhiteList()// 快速搜索
        } else {
          this.$message.error(this.msg(res.body))
        }
      },
        function (res) {
          this.$message.error(this.$t(this.Global.errorTitle))
        })
    },
    // 快速搜索
    searchWhiteList() {
      let data = {}
      if (this.keyword != '') {
        data.keyword = this.keyword
      }
      if (this.domain != '') {
        data.domain = this.domain
      }
      this.WhiteListGet(data)
    },
    // 获取白名单列表
    WhiteListGet(data) {
      data.pageN = this.paging.currentPage
      data.pageSize = this.paging.eachNum
      this.$http.get(this.Global.baseURL + this.Global.api.v2.internalMailDomain, {
        params: data
      }).then(function (res) {
        if (res.body.code.toString() == this.Global.RES_OK && isObject(res.body.data)) {
          let datas = res.body.data
          let whiteList = datas.regexList
          this.paging.total = datas.rowTotal
          let arry = []
          for (let i = 0; i < whiteList.length; i++) {
            arry.push({ addrRegex: whiteList[i].addrRegex, description: whiteList[i].description, domainId: whiteList[i].domainId })
          }
          this.tableData = arry
        } else {
          this.$message.error(this.msg(res.body))
        }
      }, function (res) {
        this.$message.error(this.$t(this.Global.errorTitle))
      })
    }

  },
  computed: {
    ...mapGetters([
      'company'
    ]),
    ...mapGetters('mail', [
      'treeMenu',
      'subordinateCtid'
    ])
  },
  components: {
    'dialog-white': DialogWhite
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.StaffWhitelist {
  padding-top: 16px;
  .pull-right {
    display: none;
    background: linear-gradient(
      135deg,
      rgba(255, 105, 124, 1),
      rgba(208, 2, 27, 1)
    );
    border-radius: 50%;
    text-align: center;
    width: 24px;
    height: 24px;
    color: #fff;
    font-size: 12px;
    margin-right: 15px;
  }
  .columnClass tr {
    &:hover {
      .pull-right {
        display: block;
      }
    }
  }
  .pagination {
    //分页
    // border: 1px solid red;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    padding: 5px 0;
  }
}
// @import "./publicLess/formCheckbox.less";
</style>
