<template>
  <div class="BlackList MXscroll" ref="BlackList">
    <el-form :inline="true" ref="dialogForm" label-width="100px">
      <!-- 邮箱帐号 -->
      <el-form-item :label="$t('mxpcweb.systemset.mailset.setindex.1528979068925')">
        <el-select v-model="svalue">
          <el-option v-for="(item,index) in optionList" :key="index" :label="item.mailAddress" :value="item.mailAddress"> </el-option>
        </el-select>
      </el-form-item>
      <!-- 快速查找 -->
      <el-form-item :label="$t('mxpcweb.systemset.mailset.setindex.1528979084946')" label-width="100px">
        <el-input v-model="keyword" size="small" style="width:215px;"></el-input>
      </el-form-item>

      <el-form-item>
        <!-- 搜索 -->
        <el-button type="primary" @click="searchBlackList()">{{$t('mxpcweb.systemset.mailset.setindex.1528978960400')}}</el-button>
      </el-form-item>

      <el-form-item>
        <!-- 删除 -->
        <el-button type="primary" @click="BlackListDelete()">{{$t('mxpcweb.systemset.mailset.setindex.1528979259350')}}</el-button>
      </el-form-item>
      <el-form-item>
        <!-- 新增黑名单 -->
        <el-button type="primary" @click="DialogBlackList()">{{$t('mxpcweb.systemset.mailset.setindex.1528978883199')}}</el-button>
      </el-form-item>
    </el-form>

    <el-table class="columnClass" :data="tableData" :height="listHeight" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <!-- 邮件地址 -->
      <el-table-column prop="mailAddress" :label="$t('mxpcweb.systemset.mailset.setindex.1528978882987')" align="center">
      </el-table-column>
      <!-- 邮箱账号 -->
      <el-table-column prop="mailAccount" :label="$t('mxpcweb.systemset.mailset.setindex.1528979295510')" align="center">
      </el-table-column>
      <!-- 操作 :label="$t('mxpcweb.systemset.mailset.setindex.1528978880285')" -->
      <el-table-column>
        <template slot-scope="scope">
          <!-- 删除 -->
          <!-- <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">

                        {{$t('mxpcweb.systemset.mailset.setindex.1528979259350')}}
                    </el-button> -->
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
    <!--黑名单-->
    <dialog-black-list ref="DialogBlackList" :optionList="optionList" @searchBlackList="searchBlackList"></dialog-black-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isObject, isArray } from '@/libs/utils.js'
import DialogBlackList from './DialogBlackList/index.vue'
export default {
  name: 'BlackList',
  props: {},
  data() {
    return {
      currentPageIndex: 1,
      isOpen: false, // 弹窗开关
      tableData: [],
      svalue: '',
      optionList: [],
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
    this.BlackListGet({})
    this.getPersonalData()
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
      const _this = this
      let winHeight = document.body.clientHeight
      _this.$refs.BlackList.style.height = winHeight - 150 + 'px'
      this.listHeight = winHeight - 276
    },
    /**
    * 每页数量改变
    */
    handleSizeChange(val) {
      this.paging.eachNum = val
      this.BlackListGet({})
    },
    /** @augments
 * 页数变更
 */
    handleCurrentChange(val) {
      this.paging.currentPage = val
      this.BlackListGet({})
    },
    // 黑名单
    DialogBlackList() {
      this.$refs.DialogBlackList.isDialog('open', 1)
    },
    // 单个删除
    deleteRow(index, rows) {
      let data = { type: 'single' }
      data.mailAddress = rows[index].mailAddress
      data.mailAccount = rows[index].mailAccount
      this.$http.post(this.Global.baseURL + this.Global.api.Mail.BlackListDelete, data).then(function (res) {
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
    // 移除黑名单
    BlackListDelete() {
      let data = { type: 'bulk' }
      let mailAddress = ''
      let mailAccount = ''
      let arryList = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (arryList.indexOf(this.multipleSelection[i].mailAccount) == -1) {
          arryList.push(this.multipleSelection[i].mailAccount)
        }
      }
      for (let i = 0; i < arryList.length; i++) {
        mailAccount = mailAccount + arryList[i] + ';'
        for (let j = 0; j < this.multipleSelection.length; j++) {
          if (arryList[i] == this.multipleSelection[j].mailAccount) {
            mailAddress = mailAddress + this.multipleSelection[j].mailAddress + ','
          }
        }
        mailAddress = mailAddress.substring(0, mailAddress.length - 1) + ';'
      }
      data.mailAddress = mailAddress.substring(0, mailAddress.length - 1)
      data.mailAccount = mailAccount.substring(0, mailAccount.length - 1)
      this.$http.post(this.Global.baseURL + this.Global.api.Mail.BlackListDelete, data).then(function (res) {
        if (res.body.code.toString() == this.Global.RES_OK) {
          this.addOpen = false
          this.isOpen = true
          this.$message.success(this.$t('mxpcweb.systemset.mailset.setindex.1528978804169'))// 删除成功！
          this.searchBlackList()// 快速搜索
        } else {
          this.$message.error(this.msg(res.body))
        }
      },
        function (res) {
          this.$message.error(this.$t(this.Global.errorTitle))
        })
    },
    // 快速搜索
    searchBlackList() {
      let data = {}
      if (this.svalue != '') {
        data.mailAccount = this.svalue
      }
      if (this.keyword != '') {
        data.keyword = this.keyword
      }
      this.BlackListGet(data)
    },
    // 获取黑名单列表
    BlackListGet(data) {
      data.pageN = this.paging.currentPage
      data.pageSize = this.paging.eachNum
      this.$http.get(this.Global.baseURL + this.Global.api.Mail.BlackListGet, {
        params: data
      }).then(function (res) {
        if (res.body.code.toString() == this.Global.RES_OK && isObject(res.body.data)) {
          let datas = res.body.data
          this.paging.total = datas.rowTotal
          let blackLists = datas.blackLists
          let arry = []
          for (let i = 0; i < blackLists.length; i++) {
            arry.push({ mailAccount: blackLists[i].mailAccount, mailAddress: blackLists[i].mailAddress })
          }
          this.tableData = arry
        } else {
          this.$message.error(this.msg(res.body))
        }
      }, function (res) {
        this.$message.error(this.$t(this.Global.errorTitle))
      })
    },
    // 获取页面数据
    getPersonalData() {
      let data = { type: 'my' }
      let url = this.Global.baseURL + this.Global.api.SystemSet.mailset.mailaccount.accounts // 当前企业所有账户
      this.$http.get(url, { params: data }).then(function (res) {
        if (res.body.code.toString() == this.Global.RES_OK &&
          isObject(res.body.data) &&
          isArray(res.body.data.mailAccountsInfo)) {
          let dataR = res.body.data.mailAccountsInfo
          let list = []
          list.push({
            mailAddress: ''

          })
          for (let i = 0; i < dataR.length; i++) {
            list.push({
              mailAddress: dataR[i].mailAddress

            })
          }
          this.optionList = list
        } else {
          // this.$message.error(_this.msg(res.body));
        }
      },
        function (res) {
          this.$message.error(this.$t(this.Global.errorTitle))
        }
      )
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
    'dialog-black-list': DialogBlackList
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.BlackList {
  // border: 1px red solid;
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
    margin-right: 10px;
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
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    padding: 5px 0;
  }
}

@import "./publicLess/formCheckbox.less";
</style>
