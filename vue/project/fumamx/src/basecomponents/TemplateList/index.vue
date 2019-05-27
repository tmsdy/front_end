<template>
  <div class="TemplateList MXscroll">
    <div class="pickTags">
      <el-button :type="labelSearch === '' ? 'primary' : ''" @click="labelSearch = ''; getListData()">全部</el-button>
      <el-button v-for="(item,index) in tagsAll" :key="index" @click="pickItem(item,index)" :type="item.primary ? 'primary' : ''">{{item.labelName}}</el-button>
    </div>

    <div class="listWrap MXscroll" :style="{position: height == 'auto' ? 'relative' : 'absolute', top: height == 'auto' ? 'auto' : ''}">
        <ul class="list" v-loading="isLoading">
          <li v-for="(item, index) in tableData3" :key="index">
            <img :src="getPic(item.exampleId)"/>
            <div class="text">
              <span>{{item.templateName}}</span>
              <template v-if="item.ifUse == 1">
                <em class="money">已购</em>
              </template>
              <template v-else>
                <em v-if="item.cost == 0" class="money">免费</em>
                <em v-else>￥{{item.cost}}</em>
              </template>
            </div>
            <div class="flyBtn"><el-button type="primary" @click="pickThisTemplate(item)">选择</el-button></div>
          </li>
        </ul>
    </div>
    <!-- <div class="paging">
      <el-pagination :current-page="page.now" @current-change="changePage" layout="total,prev, pager, next" :page-size="page.size" :total="page.total"></el-pagination>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'TemplateList',
  props: ['height'],
  data() {
    return {
      isLoading: false,
      Mcode: 'MO004',
      page: {
        now: 1,
        size: 900,
        total: 0
      },
      tableData3: [],

      tagsAll: [], // 所有标签
      labelSearch: ''
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    // 查余额，减余额
    checkMoney(item) {
        let data = {
            templateId: item.templateId,
            type: 'cost'
        }
        this.$http.put(this.Global.baseURL + this.Global.api.v2.templateMarket, data).then(
            res => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    // console.log(res.body)
                    if (res.body.data == '0') {
                      this.$emit('change', item) // 扣费成功
                      return
                    }
                    if (res.body.data == '-1') {
                      let title = '余额不足'
                      let msg = '当前余额不足，赶快去充值吧！'
                      let sure = '立即充值' // 立即充值
                      let cancel = this.$t('fumamx-web-templateeditor.1531901134034') // 取消
                      this.$confirm(msg, title, {
                          confirmButtonText: sure,
                          cancelButtonText: cancel,
                          type: 'warning'
                      }).then(() => {
                          this.$router.push('/main/systemset/costCenter') // 跳转
                      }).catch(() => { })
                      return
                    }
                    this.$message.error('扣费出错了')
                } else {
                    this.$message.error(res.body.msg)
                }
            }, res => {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
    },
    pickThisTemplate(item) {
      // console.log(item)
      // 非免费，也没购买
      if (item.cost > 0 && item.ifUse == 0) {
          let title = '确认购买'
          let msg = '使用此模板将消耗￥' + item.cost + '，是否确认购买？'
          let sure = this.$t('fumamx-web-templateeditor.1531901211609') // 确定
          let cancel = this.$t('fumamx-web-templateeditor.1531901134034') // 取消
          this.$confirm(msg, title, {
              confirmButtonText: sure,
              cancelButtonText: cancel,
              type: 'warning'
          }).then(() => {
              this.checkMoney(item) // 查余额，减余额
          }).catch(() => { })
      } else {
        this.$emit('change', item)
      }
    },
    pickItem(item, index) {
      let [...newTags] = this.tagsAll // 拷贝数组
      newTags.forEach(item => {
        item.primary = false // 其他项清掉
      })
      newTags[index].primary = !item.primary
      this.tagsAll = newTags
      // 过滤查询
      let labelArr = []
      this.tagsAll.forEach(item => {
        if (item.primary) {
          labelArr.push(item.labelId)
        }
      })
      this.labelSearch = labelArr.toString()
      this.getListData()
    },
    getPic(id) {
      return this.getGlobalImgSrc(id, '360x510')
    },
    changePage(val) {
      this.page.now = val
      this.getListData()
    },
    getListData() {
      if (this.labelSearch == '') {
        this.maillabelsGet() // 标签库
      }
      let data = {
        pageN: this.page.now,
        pageSize: this.page.size,
        // sort: 'createDate',
        labelIds: this.labelSearch,
        status: 1, // 前台列表，只显示上架的
        order: 'desc',
        type: 'list'
      }
        // console.log(data)
      this.isLoading = true
      this.$http.get(this.Global.baseURL + this.Global.api.v2.templateMarket, {
          params: data
        }).then(res => {
          this.isLoading = false
            if (res.body.code.toString() == this.Global.RES_OK) {
              this.tableData3 = res.body.data.data
              this.page.total = res.body.data.totalNums
            } else {
              this.$message.error(res.body.msg)
            }
          },
          res => {
            this.$message.error(this.$t(this.Global.errorTitle))
          }
        )
    },
    // 获取用户标签列表
    maillabelsGet() {
      let _this = this
      _this.$http
        .get(_this.Global.baseURL + _this.Global.api.v2.label_get, {
          params: { searchType: 'list', moduleCode: _this.Mcode }
        })
        .then(
          function(res) {
            if (res.body.code.toString() == _this.Global.RES_OK) {
              let datas = res.body.data
              // console.log(datas)
              _this.tagsAll = datas
            }
          },
          function(res) {
            _this.$message.error(_this.$t(_this.Global.errorTitle))
          }
        )
    }
  }
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
