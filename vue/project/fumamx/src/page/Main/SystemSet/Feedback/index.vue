<template>
    <div class="Feedback mainWrap MXscroll" v-loading="loading">
        <!--大标题-->
        <!-- 我的反馈 -->
        <page-title :title="$t('mxpcweb.systemset.feedback.1529065183719')" iconfont="icon-feedback"></page-title>
        <div class="FeedbackBox">
            <div class="FeedbackBoxSearch">
                <!-- 问题编号 -->
                {{$t('mxpcweb.systemset.feedback.1529065210353')}}
                <el-input v-model="keywordsCode" style="width:152px;margin:0 20px 0 10px" size="small"></el-input>
                <!-- 时间 -->
                {{$t('mxpcweb.systemset.feedback.1529065229422')}}
                <!-- 起始时间 -->
                <!-- 结束时间 -->
                <el-date-picker v-model="startDate" style="width:128px;margin-left:10px" type="date" :placeholder="$t('mxpcweb.client.1529061178759')" format="yyyy-MM-dd"  size="small"></el-date-picker>
                <el-date-picker v-model="endDate"  type="date"  style="width:128px;margin-right:20px" :placeholder="$t('mxpcweb.client.1529061199330')" format="yyyy-MM-dd"  size="small"></el-date-picker>

                <!-- 关键字 -->
                {{$t('mxpcweb.systemset.feedback.1529065271870')}}
                <el-input  v-model="keywords" style="width:128px;margin:0 20px 0 10px" size="small"></el-input>
                <!-- 查询 -->
                <el-button size="small" type="primary" @click="getListData(true);">{{$t('mxpcweb.systemset.feedback.1529065290063')}}</el-button>
                <div style="float:right">
                    <!-- 提交反馈 -->
                    <el-button type="primary" @click="AddFeedback" size="small">{{$t('mxpcweb.systemset.feedback.1529065305866')}}</el-button>
                </div>
            </div>
            <div class="listBox MXscroll">
                <div class="FeedbackBoxList">
                    <el-row class="list" :gutter="20" style="background: RGBA(239, 242, 244, 1);">
                        <!-- 问题编号 -->
                        <el-col :span="4">{{$t('mxpcweb.systemset.feedback.1529065210353')}}</el-col>
                        <!-- 标题 -->
                        <el-col :span="6">{{$t('mxpcweb.systemset.feedback.1529065354158')}}</el-col>
                        <!-- 问题分类 -->
                        <el-col :span="4">{{$t('mxpcweb.systemset.feedback.1529065367148')}}</el-col>
                        <!-- 提交时间 -->
                        <el-col :span="4">{{$t('mxpcweb.systemset.feedback.1529065381426')}}</el-col>
                        <!-- 优先级 -->
                        <el-col :span="4">{{$t('mxpcweb.systemset.feedback.1529065441662')}}</el-col>
                        <!-- 状态 -->
                        <el-col class="text-center" style="padding-right:15px;" :span="2">{{$t('mxpcweb.systemset.feedback.1529065457990')}}</el-col>
                    </el-row>
                </div>
                <div class="FeedbackBoxList FeedbackBoxTit MXscroll" :style="blockData.total>blockData.pageSize?'bottom: 44px;':'bottom: 0;'">
                    <no-data v-if="feedbackList.length==0&&!loading"></no-data>
                    <el-row v-else class="list1" :gutter="20" v-for="(item,index) in feedbackList" :key="index">
                        <el-col :span="4" class="ellipsis" :title="item.workCode">{{item.workCode}}&nbsp;</el-col>
                        <el-col :span="6" class="ellipsis" :title="item.caption">{{item.caption}}&nbsp;</el-col>
                        <el-col :span="4" class="ellipsis" :title="getDataOptions('25',item.category)">{{getDataOptions('25',item.category)}}&nbsp;</el-col>
                        <el-col :span="4" class="ellipsis" :title="item.createDate">{{item.createDate}}&nbsp;</el-col>
                        <el-col :span="4" class="ellipsis" :title="getDataOptions('22',item.priority)" :style="{color:item.priority=='1'?'RGBA(208, 2, 27, 1)':''}">{{getDataOptions('22',item.priority)}}&nbsp;</el-col>
                        <el-col :span="2" class="ellipsis text-center"  :title="getDataOptions('21',item.workState)">
                            <span class="workState">{{getDataOptions('21',item.workState)}}&nbsp;</span>
                            <div class="iconBox">
                                <!-- 查看 -->
                                <span class="iBox" @click="toDetail(item)" :title="$t('mxpcweb.systemset.feedback.1529065492190')">
                                    <i class="iconfont icon-eye"></i>
                                </span>
                                <!-- 删除 -->
                                <!-- <span class="iBox" v-if="item.workState=='4'" @click="deleteItem(item)" :title="$t('mxpcweb.mail.1528702683911')">
                                    <i class="iconfont icon-del"></i>
                                </span> -->
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <!--分页-->
            <list-page style="text-align:center;background:#f7f8f9;" :blockData="blockData" moduleCode="WO002" @getListData="getListData"></list-page>
        </div>
    </div>
</template>

<script>
import PageTitle from '@/components/PageTitle/index' // 大标题
import listPage from '@/components/listPage/index' // 分页
import { isArray, getStore } from '@/libs/utils.js'
import NoData from '@/basecomponents/NoData/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Feedback',
  props: {

  },
  data () {
    return {
      loading: true,
      keywordsCode: '',
      startDate: '',
      endDate: '',
      keywords: '',
      feedbackList: [],
      // 分页操作
      blockData: {
        pageSize: 20,
        total: 0,
        fromNum: 0
      },
      argument: {}
    }
  },
  mounted () {

  },
  created () {
    this.routeUrl = this.$route.path
    if (getStore(this.$route.path + 'listPagesize')) {
        this.blockData.pageSize = getStore(this.$route.path + 'listPagesize')
    }
    this.getListData()
  },
  computed: {
    ...mapGetters([
      'company',
      'sysBoxValue'
    ])
  },
  methods: {
    getDataOptions (dictCode, dictItemCode) {
      let content = ''
      if (this.sysBoxValue instanceof Array) {
        this.sysBoxValue.forEach(element => {
          if (element.dictCode == dictCode) {
            element.dictItems.forEach(item => {
              if (dictItemCode == item.dictItemCode) {
                content = item.itemName
              }
            })
          }
        })
      }
      return content
    },
    toDetail (item) {
      this.$router.push('/main/systemset/feedback/detail/' + item.workId)
    },
    deleteItem (item) {
      let _this = this
      // 是否删除反馈
      // 提示
      // 确定
      // 取消
      this.$confirm(this.$t('mxpcweb.systemset.feedback.1529065533387') + item.workCode + '?', this.$t('mxpcweb.client.1529047715824'), {
        confirmButtonText: this.$t('mxpcweb.client.1529047741736'),
        cancelButtonText: this.$t('mxpcweb.client.1529047588840'),
        type: 'warning'
      }).then(() => {
        _this.$http.put(this.Global.baseURL + this.Global.api.v2.workOrder_put, { workId: item.workId }).then(function (res) {
          _this.getListData()
          _this.$message.success(_this.msg(res.body))
        }, function (res) {
          _this.$message.error(_this.$t(_this.Global.errorTitle))
        })
      }).catch(() => {
      })
    },
    getListData (obj) {
      let _this = this
      let data = {
        moduleCode: 'WO001',
        searchType: 'list',
        from: _this.blockData.fromNum,
        size: _this.blockData.pageSize,
        sort: 'createDate',
        order: 'desc'
      }

      let obj2 = {}
      if (obj) {
        if (this.keywords != '') {
          obj2.keyWords = this.keywords.replace(/(^\s*)|(\s*$)/g, '')
        };
        if (this.keywordsCode != '') {
          obj2.workCode = this.keywordsCode.replace(/(^\s*)|(\s*$)/g, '')
        };
        if (this.startDate != '') {
          obj2.createDate_gl = this.$m_unifiedTime(this.startDate)
        };
        if (this.endDate != '') {
          obj2.createDate_lt = this.$m_unifiedTime(this.endDate).slice(0, 11) + '23:59:59'
        };
        _this.argument = obj2
      };
      data = Object.assign(data, _this.argument)
      _this.$http.get(this.Global.baseURL + this.Global.api.v2.document_feedback, { params: data }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK) {
          if (res.body.data.list && isArray(res.body.data.list)) {
            _this.feedbackList = res.body.data.list
            _this.blockData.total = res.body.data.totalNum
          } else {
            _this.feedbackList = []
            _this.blockData.total = 0
          }
          _this.loading = false
        } else {
          _this.loading = false
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.loading = false
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    AddFeedback () {
      let _this = this
      ep.emit('optClick', {
        optData: {
          optCode: 'otNew',
          optModuleCode: 'WO002',
          optName: _this.$t('mxpcweb.systemset.feedback.1529065305866')
        },
        next: function() {
          _this.getListData()
        }
      })
    }
  },
  watch: {
    '$route': function (val, old) {
      if (val.path == this.routeUrl) {
        this.getListData()
      }
    }
  },
  components: {
    'page-title': PageTitle,
    'list-page': listPage,
    'no-data': NoData
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
