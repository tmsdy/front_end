<template>
  <div class="ImgManage">
    <page-title title="图片管理" iconfont="iconfont icon-picture"> </page-title>

    <!-- 列表部分 -->
    <div class="actionManageBox MXscroll" v-if="isShowList">
      <div class="toolBar clearfix">
        <el-button class="pull-right" type="primary" @click="isShowList = false;">添加图片</el-button>
      </div>

      <el-table class="detailTable widthFull" :data="tableData3" :height="tableHeight" v-if="tableData3.length > 0" v-loading="isLoading">
        <el-table-column prop="pictureId" label="编号" align="center"> </el-table-column>
        <el-table-column prop="caption" label="标题" align="center"> </el-table-column>
        <el-table-column prop="id" label="图片" align="center">
          <template slot-scope="{ row }">
            <a :href="getGlobalImgSrc(row.pictureCode, '')" data-lightbox="FumaMX" data-title="FumaMX" style="margin-top:10px;display:block;">
              <img :src="getGlobalImgSrc(row.pictureCode, '99x99')" />
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="showPosition" label="展示页面" align="center"> </el-table-column>
        <el-table-column prop="url" label="链接" align="center">
          <template slot-scope="{ row }">
            <div class="linkJump text-hover" v-if="row.url && row.url !== ''" @click="openNewWindowTab(row.url)">{{row.url}}</div>
            <template v-else>无</template>
          </template>
        </el-table-column>
        <el-table-column prop="" label="" width="200">
          <template slot-scope="{ row }">
            <div class="operation">
              <span @click="doDetail(row)"><i class="iconfont icon-edit"></i></span>
              <span @click="delItem(row)"><i class="iconfont icon-del"></i></span>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <no-data v-if="tableData3.length === 0" style="background:rgba(255,255,255,0)"></no-data>

      <div class="paging">
        <el-pagination :current-page="page.now" @current-change="changePage" layout="total,prev, pager, next" :page-size="page.size" :total="page.total"></el-pagination>
      </div>

    </div>

    <!-- 图片编辑 -->
    <img-edit ref="ImgEdit" v-else @toShowList="isShowList = true; getListData()"></img-edit>

  </div>
</template>
<script>
import { isArray } from '@/libs/utils.js'
import NoData from '@/basecomponents/NoData/index'
import PageTitle from '@/components/PageTitle/index'
import ImgEdit from './ImgEdit'

export default {
  name: 'ImgManage',
  data() {
    return {
      isLoading: false,
      page: {
        now: 1,
        size: 20,
        total: 0
      },
      tableData3: [],

      tableHeight: '333',
      isShowList: true
    }
  },
  created() {
    this.getListData()
  },
  mounted() {
    setTimeout(() => {
      this.getWinHeight()
    }, 200)
    $(window).resize(() => {
      this.getWinHeight()
    })
  },
  computed: {},
  methods: {
    // 设置固定高
    getWinHeight() {
      let winHeight = document.body.clientHeight
      this.tableHeight = winHeight - 230
    },
    changePage(val) {
      this.page.now = val
      this.getListData()
    },
    doDetail(item) {
      this.isShowList = false
      this.$nextTick(_ => {
        this.$refs.ImgEdit.editItem(item)
      })
    },
    // 操作
    doListData(item, operation) {
      let data = {
        type: operation,
        pictureIds: item.pictureId
      }
      this.$http
        .put(this.Global.baseURL + this.Global.api.v2.imgManage, data)
        .then(
          res => {
            this.submiting = false
            if (res.body.code.toString() == this.Global.RES_OK) {
              this.$message.success(res.body.msg)
              this.getListData()
            } else {
              this.$message.error(res.body.msg)
            }
          },
          res => {
            this.$message.error(this.$t(this.Global.errorTitle))
          }
        )
    },
    delItem(item) {
      let title = this.$t('fumamx-web-templateeditor.1531904183099') // 提示
      let msg = '确定删除这个图片吗？' // 确定删除这个模板吗？
      let sure = this.$t('fumamx-web-templateeditor.1531901211609') // 确定
      let cancel = this.$t('fumamx-web-templateeditor.1531901134034') // 取消
      this.$confirm(msg, title, {
        confirmButtonText: sure,
        cancelButtonText: cancel,
        type: 'warning'
      })
        .then(() => {
          this.doListData(item, 'delete')
        })
        .catch(() => {})
    },
    // 查列表数据
    getListData() {
      this.$http
        .get(this.Global.baseURL + this.Global.api.v2.imgManage, {})
        .then(
          res => {
            // this.isLoading = false
            if (res.body.code.toString() == this.Global.RES_OK && isArray(res.body.data)) {
              this.tableData3 = res.body.data
              this.page.total = res.body.data.length
            } else {
              this.$message.error(res.body.msg)
            }
          },
          res => {
            this.$message.error(this.$t(this.Global.errorTitle))
          }
        )
    }
  },
  components: {
    'img-edit': ImgEdit,
    'page-title': PageTitle,
    'no-data': NoData
  },
  watch: {
    '$route': function() {
      this.isShowList = true // 切走，恢复显示列表
    }
  }
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
