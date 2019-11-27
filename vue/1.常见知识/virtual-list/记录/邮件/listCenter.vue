<template>
  <div class="ListCenter" v-loading="loading" :style="{width:( custId==''&&mailAddress==''?'380px':'100%')}">
    <batch-operation ref="BatchOperation" :checkedListAll="checkedListAll" :SearchSelect="SearchSelect" @listCheck="listCheck" :listCenterData="listCenterData" @OperationTrigger="OperationTrigger"></batch-operation>
    <template v-if="custId==''&&mailAddress==''">
      <!-- 邮件筛选，组件 -->
      <mail-filter ref="mail-filter" v-on:mailListHeight="mailListHeight" @filterGetMail="filterGetMail" :dynamicTags="dynamicTags" @OpenAdvancedSearch="openAdvancedSearch()" @SearchClick="SearchClick"></mail-filter>
    </template>
    <no-data v-if='noData' :title="$t('mxpcweb.mail.1528714965125')" class="marginTop15" style="background: transparent;"></no-data>
    <!-- 邮件列表 -->
    <el-checkbox-group v-model="checkedListAll" @change="handleCheckedCitiesChange">
      <div class="mailList MXscroll" ref="mailList" :style="{'padding-bottom':(custId==''&&mailAddress==''?'25px':'47px')}">
        <dl v-for="(item,index) in listCenterData" :key="index">
          <dt>{{item.dates}}</dt>
          <dd :class="{'new':(item2.status==-1),'old':(item2.status!=-1),'active':(index==checkgroupIndex&&index2==checkedIndex&&custId==''&&mailAddress=='')}" v-for="(item2,index2) in item.list" :key="index2" @click="ListCenterShowDetail(item2,index,index2)" @dblclick="fullScreen(item2.mId,item2.subject,item2.source,item2.folder)">
            <span class="letBox"></span>

            <single-operation class="Operation" v-if="SearchSelect!='c'" ref="SingleOperation" :DetailData="item2" :ListDetail="item" @OperationTrigger="OperationTrigger"></single-operation>

            <div class="leftBtns">
              <div class="checkIt" :class="checkedListAll.length==0?'hide':'show'">
                <el-checkbox class="CheckBox" :label="item2.mId">{{''}}</el-checkbox>
              </div>
              <!-- -1未读 1已读 -->
              <i class="dotClass iconfont icon-dot" :class="item2.status==1?'read':'Unread'" @click.stop="OperationTrigger('handleCommand',{'actionName':item2.status==1?'UnReadState':'ReadState'},[item2.mId])"></i>
              <i v-if="item2.stickyFlag==1" class="tagStar el-icon-star-on"></i>
            </div>
            <div class="mailName">
              <!--发件箱/文件夹：显示收件人 【发】-->
              <span v-if="isSendMail(item2)">
                <show-name ref="ShowName" v-if="item2.recipients" :showDetail="item2.recipients[0]" @filterGetMail="filterGetMail" :containAttachment="item2.containAttachment" :longSentDate="DateDisplay(item2)" :tagObjects="item2.tags" :myMap="myMap" :custId="custId"></show-name>
              </span>

              <!--收件箱：显示发件人 【收】-->
              <span v-else>
                <show-name ref="ShowName" v-if="item2.replyTo&&item2.fromEx&&item2.replyTo[0].address&&item2.fromEx[0].address&&item2.replyTo[0].address!=item2.fromEx[0].address" :showDetail="item2.replyTo[0]" @filterGetMail="filterGetMail" :containAttachment="item2.containAttachment" :longSentDate="DateDisplay(item2)" :tagObjects="item2.tags" :myMap="myMap" :custId="custId"></show-name>
                <show-name ref="ShowName" v-else-if="item2.fromEx" :showDetail="item2.fromEx[0]" @filterGetMail="filterGetMail" :containAttachment="item2.containAttachment" :longSentDate="DateDisplay(item2)" :tagObjects="item2.tags" :myMap="myMap" :custId="custId"></show-name>

              </span>
            </div>
            <div class="mailTitle">
              <div class="lamp">
                <template v-if="item2.enableTrack">
                  <!-- 阅读记录 -->
                  <el-popover placement="right" :title="$t('mxpcweb.mail.1531361014017')" width="600" trigger="hover" @show="Gettracklogs(item2.mId)">
                    <el-table :data="gridData">
                      <!-- 阅读账号 -->
                      <el-table-column v-if="item2.type!=0" width="200" property="toUser" :label="$t('mxpcweb.mail.1531361034033')"></el-table-column>
                      <!-- IP地址 -->
                      <el-table-column width="150" property="ip" :label="$t('mxpcweb.mail.1531361044178')"></el-table-column>
                      <!-- 城市 -->
                      <el-table-column width="300" property="city" :label="$t('mxpcweb.mail.1531361044433')"></el-table-column>
                      <!-- 阅读时间 -->
                      <el-table-column width="200" property="readTime" :label="$t('mxpcweb.mail.1531361061906')"></el-table-column>

                    </el-table>
                    <i v-if="item2.enableTrack" slot="reference" class="iconfont icon-eye" style="color:#D0021B;font-size:16px;"></i>
                  </el-popover>

                </template>

              </div>
              <i v-if="item2.priority ==$t('mxpcweb.mail.1528714855256')||item2.priority==1" class="iconfont icon-sign text-red"></i>
              <i class="iconfont icon-reply" v-if="item2.replyFlag" :title="$t('mxpcweb.mail.1528714821184')"></i>
              <i class="iconfont icon-forward" v-if="item2.repostSign" :title="$t('mxpcweb.mail.1528714829112')"></i>
              <span v-html="item2.subject"> </span>
            </div>
            <div class="mailBrief">
              <span :style="setCommentsColor(item2.comments)" v-if="item2.comments&&item2.comments.length>0">
                {{item2.comments[item2.comments.length-1].content}}
              </span>
              <span v-else> {{item2.abstractText}}</span>
              <span v-if="custId!=''||mailAddress!=''||selectedBoxId.SelectType=='c'" class="el-tag" :class="isSendMail(item2)?'seend':'Receive'">{{isSendMail(item2)?$t('mxpcweb.am.1531900969998'):$t('mxpcweb.mail.1561368610211')}}</span>
            </div>
          </dd>
        </dl>
      </div>
    </el-checkbox-group>
    <!-- 邮件列表翻页 -->
    <div class="mailPagination" ref="mailPagination" v-if="!noData && custId==''&&mailAddress==''">
      <el-pagination small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40,50,100]" :page-size="pagesize" layout="total,sizes, prev,pager,next" :total="total">
      </el-pagination>
    </div>
    <div class="mailPagination2" ref="mailPagination" v-if="!noData && custId==''&&mailAddress!=''">
      <el-pagination small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40,50,100]" :page-size="pagesize" layout="total,sizes, prev,pager,next" :total="total">
      </el-pagination>
    </div>
    <div :class="[iscustTable?'pagination':'mailPagination2']" ref="mailPagination" v-if="!noData && custId!=''&&mailAddress==''">
      <el-pagination small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40,50,100]" :page-size="pagesize" layout="total,sizes, prev,pager,next" :total="total">
      </el-pagination>
    </div>
    <!-- 高级搜索，组件 -->
    <advanced-Search v-if="showAdvanceSearch" ref="AdvancedSearch" :dynamicTags="dynamicTags" @AdvancedSearchClick="AdvancedSearchClick" @close="showAdvanceSearch=false"></advanced-Search>
    <slider-mail-detail ref="sliderMailDetail" :windowMode="windowMode"></slider-mail-detail>
  </div>
</template>

<script>
/**
 * 描述：邮件部分
 * 作者：向士健(CSS) /
 * 时间：2017/11/11
 */
import mailFilter from './Vue/MailFilter/index.vue'
import { isObject, isArray, delEmptyStrObj, commentsColor } from '@/libs/utils.js'
import { mapGetters, mapMutations } from 'vuex'
import AdvancedSearch from './AdvancedSearch/index.vue'
import NoData from '@/basecomponents/NoData/index'
import ShowName from './Vue/ShowName/index'
import BatchOperation from './Vue/BatchOperation/index'
import SingleOperation from './Vue/SingleOperation/index'
import sliderMailDetail from '@/page/Main/Client/Layout/standard/ClientDetail/Tabs/MailContact/sliderMailDetail/index'
export default {
  name: 'ListCenter',
  props: {
    custId: {
      type: String,
      default: ''
    },
    mailAddress: {
      type: String,
      default: ''
    },
    iscustTable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      SearchType: '',
      noData: false,
      isFilterBox: false, // 邮件筛选下拉，是否展开
      isOperation: false, // 邮件操作漂浮栏，是否显示
      checkedListAll: [], // 选中的id
      firstTime: true,
      listALL: [], // 当前页面id
      currentPage: 1,
      total: 0, // 总共多少条
      pagesize: 10, // 每页多少条
      listCenterData: [], // 列表
      target: 'folder', // 类型   folder/toplist/cust
      attach: '', // 附件
      color: '', // 批注
      readFlag: '', // 是否以阅读
      labelName: '', // 标签
      checkgroupIndex: 0,
      checkedIndex: 0,
      dynamicTags: Object.freeze([]), // 标签数组
      RefreshOrFlip: 'R', // 刷新  R刷新   F翻页
      Rsta: '0', // 刷新完成  0
      AdvancedSearchData: {}, // 高级搜索参数
      SearchSelect: 'b', // 文件夹搜索
      keywords: '', // 快速搜索
      // position: 0,
      // positionList: 0,
      // Obj: {},
      AccountNmber: '',
      gridData: [], // 千里眼
      curmId: '',
      timeOut: '',
      loading: false,
      loaded: false,
      filterType: 'all',
      myMap: {},
      isShow: true,
      windowMode: false,
      checkedList: [], // 选中的值
      searchConditions: {},
      stickyFlag: '',
      PrevData: {
        checkgroupIndex: -1,
        checkedIndex: -1,
        status: -1
      },
      NextData: {
        checkgroupIndex: -1,
        checkedIndex: -1,
        status: -1
      },
      showAdvanceSearch: false

    }
  },
  computed: {
    ...mapGetters([
      'company'
    ]),
    ...mapGetters('mail', [
      'selectedBoxId',
      'refurbishListBool',
      'refurbishlabelList',
      'subordinateCtid',
      'mailOptionList'
    ])
  },
  mounted() {
    this.$nextTick(() => {
      this.mailListHeight()
    })
    if (this.selectedBoxId.id) {
      this.filterGetMail('ListCenter_mounted')
    }
  },
  created() {
    // this.pageGet()
    this.$MXEventBus.on('reloadList', this._reloadList)
    this.$MXEventBus.on('MailDelayStateGet', this._MailDelayStateGet)
  },
  beforeDestroy() {
    this.$MXEventBus.off('reloadList', this._reloadList)
    this.$MXEventBus.off('MailDelayStateGet', this._MailDelayStateGet)
  },
  methods: {
    async openAdvancedSearch() {
      this.showAdvanceSearch = true
      await this.$nextTick()
      this.$refs.AdvancedSearch.isDialog('open')
    },
    ListSwitching(type) {
      if (type == 'next') {
        this.ListCenterShowDetail(this.listCenterData[this.NextData.checkgroupIndex].list[this.NextData.checkedIndex], this.NextData.checkgroupIndex, this.NextData.checkedIndex)
      } else {
        this.ListCenterShowDetail(this.listCenterData[this.PrevData.checkgroupIndex].list[this.PrevData.checkedIndex], this.PrevData.checkgroupIndex, this.PrevData.checkedIndex)
      }
    },
    isSendMail(item2) {
      if (item2.source == 'FMDRAFT' || item2.source == 'FMD' || (item2.mailAddress && item2.fromEx[0] && item2.fromEx[0].address && item2.mailAddress.toLowerCase() == item2.fromEx[0].address.toLowerCase()) || (item2.source == 'FMI' && item2.mailAddress.toLowerCase() == item2.fromEx[0].address.toLowerCase())) {
        return true
      }
      return false
    },
    _MailDelayStateGet() {
      this.filterGetMail('ListCenter_created_MailDelayStateGet')
    },
    _reloadList(data) {
      this.filterGetMail('ListCenter_created', '', '', '', '', 'filterType')
    },
    // 页面设置
    pagesizeSting() {
      let data = {
        'mailOptionsList': [
          {
            'type': 3,
            'variable': 'MailCount',
            'value': this.pagesize
          }
        ]
      }
      const url = this.Global.baseURL + this.Global.api.SystemSet.mailset.setindex.updateOptions
      this.$http.post(url, data)
        .then((res) => {
          if (res.body.code.toString() == this.Global.RES_OK) {
            let mailOptionList = this.mailOptionList
            mailOptionList.MailCount = this.pagesize
            this.set_mailOptionList(mailOptionList)
          }
        })
    },
    pageGet() {
      if (this.mailOptionList.MailCount) {
        this.pagesize = Number(this.mailOptionList.MailCount)
      } else {
        const url = this.Global.baseURL + this.Global.api.SystemSet.mailset.setindex.GetOptions
        this.$http.get(url, {
          params: {
            itemCode: 'MailCount'
          }
        }).then((res) => {
          if (res.body.code.toString() == this.Global.RES_OK) {
            let datas = res.body.data
            if (datas.mailOptionList.length > 0) {
              this.pagesize = Number(datas.mailOptionList[0].value)
            } else {
              this.pagesizeSting()// 设置页码
            }
          }
        }, (res) => {
          this.$message.error(res)
        })
      }
    },
    // 操作
    OperationTrigger(key, key2, key3, key4) {
      this.$emit('OperationTrigger', key, key2, key3, key4)
    },
    // 勾选操作
    listCheck(key, checkedAll) {
      switch (key) {
        case 'close': // 关闭批量操作
          this.CloseDialog()
          break
        case 'CheckAll':// 是否全选
          this.checkAllChange(checkedAll)
          break

        default:
          break
      }
    },
    CloseDialog() {
      this.isOperation = false
      this.checkedListAll = []
    },
    // 全选
    checkAllChange(checkedAll) {
      if (checkedAll) {
        this.checkedListAll = this.listALL
      } else {
        this.checkedListAll = []
      }
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length
      this.$refs.BatchOperation.checkedAllChange(checkedCount == this.listALL.length)
    },
    LastListCenter(mIds, actionName) {
      // 置顶、删除、彻底删除、归并、
      // 内分发(定位不改变)、移动邮件刷新 （树刷新了） （列表数量） （定位改变）
      if (actionName == 'TopOperation' || actionName == 'UnTopOperation' || actionName == 'MoveRecyclingStation' || actionName == 'PhysicalDelete' || actionName == 'MaileMerge' || actionName == 'JunkMail' || actionName == 'DialogInDistribute') {
        // 区分是列表操作（勾选、非勾选）还是详情操作
        if (mIds.length == 1) { // 单条
          this.set_boxCount(1)
          let curId = this.listCenterData[this.checkgroupIndex].list[this.checkedIndex].mId
          if (mIds[0] == curId) { // 是当前选中的
            let activeId = this.SeekActive(mIds[0], [mIds[0]])
            if (activeId == -2) { // 当前也全部被操作需要换页
              this.RefreshOrFlip = 'F'
            } else {
              this.Rsta = activeId // 寻找到可以选中的id
            }
          } else { // 当前选中没有被操作
            this.Rsta = curId
          }
          this.filterGetMail('LastListCenter_LastListCenter1') // 刷新
        } else if (mIds.length > 1) {
          let curId = this.listCenterData[this.checkgroupIndex].list[this.checkedIndex].mId
          this.set_boxCount(1)
          let activeId = this.getActiveMid(curId, 'many')
          this.RefreshOrFlip = 'R'
          if (activeId == -1) { // 当前选中没有被操作
            this.Rsta = curId
          } else if (activeId == -2) { // 当前也全部被操作需要换页
            this.RefreshOrFlip = 'F'
          } else {
            this.Rsta = activeId // 寻找到可以选中的id
          }
          this.filterGetMail('LastListCenter_LastListCenter2') // 刷新
        }
      } else {
        if (actionName == 'ReadState' || actionName == 'UnReadState') {
          this.set_boxCount(1)
        }
        this.RefreshOrFlip = 'R'
        this.filterGetMail('LastListCenter_LastListCenter3')// 刷新
      }
    },
    // 刷新后定位
    RefreshDingwei(idkey) {
      let fined = false
      for (let i = 0; i < this.listCenterData.length; i++) {
        if (fined) { break }
        for (let j = 0; j < this.listCenterData[i].list.length; j++) {
          if (this.listCenterData[i].list[j].mId == idkey) {
            fined = true
            this.checkgroupIndex = i
            this.checkedIndex = j
            break
          }
        }
      }
      if (!fined) {
        this.checkgroupIndex = 0
        this.checkedIndex = 0
      }
    },

    getActiveMid(curElement, type) {
      let keepOn = false
      for (let index = 0; index < this.checkedListAll.length; index++) { // 5
        const element = this.checkedListAll[index]
        if (element == curElement) { // 5 6
          keepOn = true
          break
        }
      }
      if (keepOn) { // 当前选中被删除
        if (type == 'many') { // 批量
          return this.SeekActive(curElement, this.checkedListAll)
        } else {
          return this.SeekActive(curElement, [curElement])
        }
      } else {
        return -1
      }
    },
    SeekActive(curElement, actionArry) {
      let flg = true
      let selectIndex = this.listALL.indexOf(curElement)
      for (let indexAll = selectIndex + 1; indexAll < this.listALL.length; indexAll++) { //
        const elementall = this.listALL[indexAll]
        for (let indexcheck = 0; indexcheck < actionArry.length; indexcheck++) {
          const elementck = actionArry[indexcheck]
          if (elementall == elementck) {
            flg = false
            break
          }
        }
        if (flg) { // 当前Id没有找到
          return elementall
        }
      }
      if (!flg) { // 后面的全部被操作
        for (let index = selectIndex - 1; index > 0; index--) { //
          const elementall = this.listALL[index]
          for (let indexcheck = 0; indexcheck < actionArry.length; indexcheck++) {
            const elementck = actionArry[indexcheck]
            if (elementall == elementck) {
              flg = false
              break
            }
          }
          if (flg) { // 当前Id没有找到
            return elementall
          }
        }
      }
      if (!flg) { // 全部未找到
        return -2
      }
    },
    PageRefresh(ResultData) {
      for (let i = 0; i < ResultData.length; i++) {
        this.listALL.push(ResultData[i].mId)
      }
      if (this.RefreshOrFlip == 'F') { // 翻页
        this.RefreshOrFlip = 'R'
        this.checkgroupIndex = 0
        this.checkedIndex = 0
        this.FastSwitching()
        if (this.listCenterData[0] == undefined || this.listCenterData[0].length <= 0) {
          this.Rsta = '0'
          return
        }
        let item = this.listCenterData[0].list[0]
        if (item && item.status != 1 && (this.subordinateCtid == this.company.ctId || this.subordinateCtid ==
          0)) { // 未阅读
          setTimeout(() => {
            // item.status = 1;
            this.SetingRead(this.listCenterData[0].list[0])
            this.listCenterData[0].list[0].status = 1
          }, 2000)
        }
      } else if (this.Rsta != '0' && this.Rsta != '-10000') {
        this.RefreshDingwei(this.Rsta)
        this.ListSelection()
      } else {
        this.ListSelection()
      }
      this.Rsta = '0'
    },
    ListSelection() {
      this.getCheckall() // 选中的项继续选中
      if (this.listCenterData.length > 0 && this.listCenterData[this.checkgroupIndex] && this.listCenterData[this.checkgroupIndex].list && this.listCenterData[this.checkgroupIndex].list.length > 0) {
        if (this.listCenterData.length < this.checkgroupIndex) {
          this.checkgroupIndex = this.listCenterData.length - 1
        }
        if (this.listCenterData[this.checkgroupIndex].list.length < this.checkedIndex) {
          this.checkedIndex = this.listCenterData[this.checkgroupIndex].list.length - 1
        }
        this.FastSwitching()
        let item = this.listCenterData[this.checkgroupIndex].list[this.checkedIndex]
        if (item) {
          if (item.status != 1 && (this.subordinateCtid == this.company.ctId || this.subordinateCtid != 0)) {
            item.status = 1
            this.listCenterData[this.checkgroupIndex].list[this.checkedIndex] = item
            this.SetingRead(item)
          }
          this.curmId = item.mId
          this.$emit('ShowDetail', item.mId, this.selectedBoxId.id)
        }
      }
    },
    FastSwitching() {
      if (this.checkgroupIndex == 0 && this.checkedIndex == 0) { // 无上一条
        this.PrevData = {
          checkgroupIndex: -1,
          checkedIndex: -1,
          status: -1
        }
      } else {
        if (this.checkedIndex == 0) {
          this.PrevData = {
            checkgroupIndex: this.checkgroupIndex - 1,
            checkedIndex: this.listCenterData[this.checkgroupIndex - 1].list.length - 1,
            status: 1
          }
        } else {
          this.PrevData = {
            checkgroupIndex: this.checkgroupIndex,
            checkedIndex: this.checkedIndex - 1,
            status: 1
          }
        }
      }

      if (this.checkgroupIndex == this.listCenterData.length - 1 && this.checkedIndex == this.listCenterData[this.checkgroupIndex].list.length - 1) { // 无下一条
        this.NextData = {
          checkgroupIndex: -1,
          checkedIndex: -1,
          status: -1
        }
      } else if (this.checkgroupIndex == this.listCenterData.length - 1) { // 最后一组
        this.NextData = {
          checkgroupIndex: this.checkgroupIndex,
          checkedIndex: this.checkedIndex + 1,
          status: 1
        }
      } else if (this.checkedIndex == this.listCenterData[this.checkgroupIndex].list.length - 1) { // 当前组最后一条
        this.NextData = {
          checkgroupIndex: this.checkgroupIndex + 1,
          checkedIndex: 0,
          status: 1
        }
      } else {
        this.NextData = {
          checkgroupIndex: this.checkgroupIndex,
          checkedIndex: this.checkedIndex + 1,
          status: 1
        }
      }
    },
    noDataSurce() {
      this.loaded = true
      this.loading = false
      this.total = 0
      this.noData = true
      this.listCenterData = []
      this.$emit('ShowDetail', undefined, this.selectedBoxId.id)
    },
    // 千里眼
    Gettracklogs(mId) {
      this.gridData = []
      this.$http.get(this.Global.baseURL + this.Global.api.Mail.tracklogsGet, {
        params: {
          mId: mId,
          pageN: 1,
          pageSize: 100
        }
      }).then((res) => {
        if (res.body.code.toString() == this.Global.RES_OK && isArray(res.body.data)) {
          this.gridData = res.body.data
        }
      })
    },
    // 日期显示
    DateDisplay(item) {
      let times = (item.longSentDate == 0 || item.longSentDate == undefined) ? parseInt(item.createTime) : parseInt(item.longSentDate)
      var timeFormat = this.$moment(new Date(times)).format('HH:mm')
      return timeFormat// this.$m_formulateTime(timeFormat)
    },
    // 实时计算邮件列表高
    mailListHeight(filterHeight) {
      let winHeight = document.body.clientHeight
      // 判断有木有翻页导航
      if (this.$refs.mailPagination) {
        let mailPaginationH = this.$refs.mailPagination.offsetHeight // 分页高
        this.$refs.mailList.style.height = winHeight - filterHeight - 78 - mailPaginationH + 'px'
      } else {
        this.$refs.mailList.style.height = winHeight - filterHeight - 78 + 'px'
      }
    },
    // 批注色彩
    setCommentsColor(commentsArry) {
      if (!isArray(commentsArry)) {
        return
      }
      if (commentsArry.length > 0) {
        return commentsColor(commentsArry[commentsArry.length - 1].commentFlag)
      } else {
        return commentsColor(1)
      }
    },
    getCommentsConten(commentsArry) {
      if (commentsArry.length > 0) {
        return commentsArry[commentsArry.length - 1].content
      } else {
        return ''
      }
    },
    // 打开邮件详情
    fullScreen(mId, title, source, folder) {
      if (source == 'FMDRAFT' || (folder == 3 && source == 'FMD')) { // 草稿        发件箱的都可以重新发送
        //   if (source == 'FMDRAFT' || deliveryStatus != 1 && deliveryStatus != undefined) { // 草稿        发件箱的都可以重新发送
        this.$MXEventBus.emit('openNewMail', {
          title: title,
          mId: mId,
          type: 'D'
        })
      } else {
        this.$MXEventBus.emit('openMailDetail', {
          mId: mId,
          boxId: this.selectedBoxId.id
        })
      }
    },

    // 数据分组
    dataGrouping(Data) {
      try {
        let list = []
        let count = 0
        let Arry = []
        this.checkedListAll = []
        this.listALL = []
        let times = 0
        let times2 = 0
        for (let i = 0; i < Data.length; i++) {
          if (Data[i].replyTo) {
            if (!isArray(Data[i].replyTo) || !isObject(Data[i].replyTo[0])) {
              Data[i].replyTo = []
              Data[i].replyTo.push({ 'address': '' })
            }
          }
          if (Data[i].fromEx) {
            if (!isArray(Data[i].fromEx) || !isObject(Data[i].fromEx[0])) {
              Data[i].fromEx = []
              Data[i].fromEx.push({ 'address': Data[i].mailAddress })
            }
          } else {
            Data[i].fromEx = []
            Data[i].fromEx.push({ 'address': Data[i].mailAddress })
          }
          if (Data[i].recipients) { // 存在不是Array
            if (!isArray(Data[i].recipients) || !isObject(Data[i].recipients[0])) {
              Data[i].recipients = []
              Data[i].recipients.push({ 'address': Data[i].mailAddress })
            }
          } else { // 不存在
            Data[i].recipients = []
            Data[i].recipients.push({ 'address': Data[i].mailAddress })
          }
          times = (Data[i].longSentDate == 0 || Data[i].longSentDate == undefined) ? parseInt(Data[i].createTime) : parseInt(Data[i].longSentDate)
          var timeFormat = this.$moment(new Date(times)).format('YYYY-MM-DD')
          if (!times) {
            continue
          }
          list.push(Data[i])
          if (i != Data.length - 1) { // 不是最后一条
            count = i + 1
            times2 = (Data[count].longSentDate == 0 || Data[count].longSentDate == undefined) ? parseInt(Data[count].createTime) : parseInt(Data[count].longSentDate)
            var timeFormat2 = this.$moment(new Date(times2)).format('YYYY-MM-DD')
            if (timeFormat != timeFormat2) {
              Arry.push({
                'dates': timeFormat,
                'list': list
              })
              list = []
            }
          } else {
            Arry.push({
              'dates': timeFormat,
              'list': list
            })
            list = []
          }
        }
        return Arry
      } catch (error) {
        console.log('dataGrouping error')
      }
    },
    getCheckall() {
      let checkedAll = []
      this.checkedList.forEach(element => {
        this.listALL.forEach(element2 => {
          if (element == element2) {
            checkedAll.push(element)
          }
        })
      })
      this.checkedList = []
      this.checkedListAll = checkedAll
    },
    // 获取用户标签列表
    maillabelsGet() {
      if (!this.firstTime) { // 已经加载过了返回
        return
      }
      this.firstTime = false
      this.$http.get(this.Global.baseURL + this.Global.api.v2.label_get, {
        params: {
          searchType: 'list',
          moduleCode: 'EM001'
        }
      }).then((res) => {
        if (res.body.code.toString() == this.Global.RES_OK && isArray(res.body.data)) {
          let datas = res.body.data
          let arry = []
          for (let i = 0; i < datas.length; i++) {
            arry.push(datas[i])
          }
          this.dynamicTags = Object.freeze([...arry])
          arry.forEach(item => {
            this.myMap[item.labelId] = item
          })
        }
      }, (res) => {
        this.$message.error(res)
      })
    },

    // 双击显示详情
    ListCenterShowDetail(item, index1, index2) {
      if (this.custId != '') {
        this.isShow = true
        this.windowMode = this.iscustTable != true
        this.$refs.sliderMailDetail.show(item.mId)
        return
      }
      if (this.mailAddress != '') {
        this.isShow = true
        this.windowMode = this.iscustTable != true
        this.$refs.sliderMailDetail.show(item.mId)
        return
      }

      if (this.curmId == item.mId) {
        if (item.status != 1) {
          this.listCenterData[index1].list[index2].status = 1
          this.SetingRead(item)
        }
        return
      }
      this.curmId = item.mId
      this.checkgroupIndex = index1
      this.checkedIndex = index2
      this.FastSwitching()
      if (item.status && item.status != 1 && (this.subordinateCtid == this.company.ctId || this.subordinateCtid == 0)) { // 未阅读
        item.status = 1
        this.listCenterData[index1].list[index2].status = 1
        this.SetingRead(item)
      }
      // this.isCover = 1

      this.$emit('ShowDetail', item.mId, this.selectedBoxId.id)
    },
    // 过滤获取列表|刷新标签
    filterGetMail(where = '', attach = '', color = '', readFlag = '', labelName = '', actionType = '', Flip = '') {
      console.log('过滤获取列表' + where)
      if (actionType == 'filterType') {
        this.attach = attach
        this.color = color
        this.readFlag = readFlag
        this.labelName = labelName
        this.currentPage = 1
        // console.log('过滤获取列表')
        this.filterType = 'filter'
      } else if (actionType == '' && this.attach == '' && this.color == '' && this.readFlag == '' && this.labelName == '') {
        this.filterType = 'all'
      } else {
        this.filterType = 'filter'
      }
      if (Flip != undefined) {
        this.RefreshOrFlip = Flip
      }
      let form = (this.currentPage - 1) * this.pagesize
      this.ParameterSplicing(form)
    },
    // 设置已读状态
    SetingRead(item) {
      let data = {
        mIds: [item.mId],
        status: '1',
        type: 'status'
      }
      if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
        data.ctid = this.subordinateCtid
      } else {
        delete data.ctid
      }
      this.$http.post(this.Global.baseURL + this.Global.api.Mail.ManyMaillistPut, data).then((res) => {
        if (res.body.code.toString() == this.Global.RES_OK) {
          this.set_boxCount(1)
        } else {
          this.$message.error(this.msg(res.body))
        }
      }, (res) => {
        this.$message.error(res)
      })
    },
    // 一页多少条
    handleSizeChange(val) {
      this.RefreshOrFlip = 'R'
      this.pagesize = val
      let form = (this.currentPage - 1) * this.pagesize
      this.ParameterSplicing(form)
      this.pagesizeSting()
    },
    // 当前页
    handleCurrentChange(val, old) {
      this.RefreshOrFlip = 'F'
      this.currentPage = val
      // console.log('当前页' + val)
      let form = (this.currentPage - 1) * this.pagesize
      this.checkgroupIndex = 0
      this.checkedIndex = 0
      this.ParameterSplicing(form)
    },
    // 第一页
    async onePage(data1, data2) {
      this.loaded = false
      if (this.RefreshOrFlip == 'F') {
        this.$refs.mailList.scrollTop = 0
        this.checkedListAll = []
      }
      this.listALL = []
      try {
        if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
          data1.ctid = this.subordinateCtid
          data2.ctid = this.subordinateCtid
        } else {
          delete data1.ctid
          delete data2.ctid
        }
        if (this.AccountNmber != '') {
          data1.mailAccount = this.AccountNmber
          data2.mailAccount = this.AccountNmber
        }
        let BoxList = []
        let arry = []
        let ResultData2 = {}
        let ResultData = {}
        this.target = 'folder'
        if (this.SearchSelect == 'c') {
          this.ParameterConversion(data1)
          this.ParameterConversion(data2)
        }
        delEmptyStrObj(data1, true)
        delEmptyStrObj(data2, true)
        var p0 = new Promise((resolve, reject) => {
          this.$http.get(this.Global.baseURL + this.Global.api.Mail.getMaillist, {
            params: data1,
            before(request) {
              if (this.previousRequest0) {
                this.previousRequest0.abort()
              }
              this.previousRequest0 = request
            }

          }).then((res) => {
            if (res.body.code.toString() === this.Global.RES_OK) {
              resolve(res.body.data)
            }
          }, (res) => {
          })
        })
        var p1 = new Promise((resolve, reject) => {
          this.$http.get(this.Global.baseURL + this.Global.api.Mail.getMaillist, {
            params: data2,
            before(request) {
              if (this.previousRequest1) {
                this.previousRequest1.abort()
              }
              this.previousRequest1 = request
            }
          }).then((res) => {
            if (res.body.code.toString() === this.Global.RES_OK) {
              resolve(res.body.data)
            } else {
              this.$message.error(this.msg(res.body))
            }
          }, (res) => {
            reject(res)
          })
        })
        this.maillabelsGet()
        this.timeOut = setTimeout(() => {
          if (!this.loaded) {
            this.loading = true
          }
        }, 600)
        Promise.all([p0, p1]).then((results) => {
          clearTimeout(this.timeOut)
          this.loaded = true
          this.loading = false
          if (results[0].totalNum > 0) {
            if (this.RefreshOrFlip == 'F') {
              this.$emit('ShowDetail', results[0].list[0].mId, this.selectedBoxId.id)//
              this.curmId = results[0].list[0].mId
            }
            ResultData2 = results[0].list // this.TagsOjectList(results[0].list)
            arry = [{
              'dates': this.$t('mxpcweb.mail.1528941835031'), // "置顶邮件",
              'list': ResultData2
            }]
          }
          if (results[1].totalNum > 0) {
            if (results[0].totalNum == 0 && this.RefreshOrFlip == 'F') {
              this.$emit('ShowDetail', results[1].list[0].mId, this.selectedBoxId.id)//
              this.curmId = results[1].list[0].mId
            }
            ResultData = results[1].list//  this.TagsOjectList(results[1].list)
            BoxList = this.dataGrouping(ResultData)
            for (let i = 0; i < BoxList.length; i++) {
              arry.push(BoxList[i])
            }
          }
          if (results[0].totalNum > 0) {
            for (let i = 0; i < ResultData2.length; i++) {
              this.listALL.push(ResultData2[i].mId)
            }
          }
          if (arry.length <= 0) {
            this.noDataSurce()
          } else {
            this.total = results[1].totalNum
            this.noData = false
            this.listCenterData = arry
            this.PageRefresh(ResultData)
          }
        }).catch((err) => {
          if (isArray(err) && err.length > 1 && err[0].status != 0 && err[1].status != 0) {
            this.$message.error(this.$t(this.Global.errorTitle))
            this.noDataSurce()
          }
        })
      } catch (error) {
        console.log('onePage')
      }
    },
    // 获取指定文件夹的邮件列表
    getMaillist(data, target) {
      this.target = target
      data = this.InitializationLoading(data)
      var p0 = new Promise((resolve, reject) => {
        this.$http.get(this.Global.baseURL + this.Global.api.Mail.getMaillist, {
          params: data
        }).then((res) => {
          if (res.body.code.toString() === this.Global.RES_OK && res.body.data) {
            resolve(res.body.data)
          } else {
            this.noDataSurce()
          }
        }, (res) => {
          // this.$message.error(this.msg(res.body))
          reject(res)
        })
      })
      this.maillabelsGet()
      Promise.all([p0]).then((results) => {
        clearTimeout(this.timeOut)
        this.loading = false
        this.loaded = true
        let ResultData = isObject(results[0]) ? results[0].list : [] // this.TagsOjectList(results[0].list)
        if (ResultData.length <= 0) {
          this.noDataSurce()
        } else {
          this.total = results[0].totalNum
          this.noData = false
          this.listCenterData = this.dataGrouping(ResultData)
          this.$emit('ShowDetail', this.listCenterData[0].list[0].mId, this.selectedBoxId.id)
          this.curmId = this.listCenterData[0].list[0].mId
          this.PageRefresh(ResultData)
        }
      }).catch((params) => {
        this.noDataSurce()
        this.$message.error(params)
      })
    },
    // 获取未分发邮件
    UndistributedMail(data) {
      data.ctId = 0
      data.boxId = -1
      this.target = 'undistributed'
      data = this.InitializationLoading(data)
      var p0 = new Promise((resolve, reject) => {
        this.$http.get(this.Global.baseURL + this.Global.api.Mail.getMaillist, {
          params: data
        }).then((res) => {
          if (res.body.code.toString() === this.Global.RES_OK && res.body.data) {
            resolve(res.body.data)
          } else {
            reject(res)
          }
        }, (res) => {
          reject(res)
        })
      })
      this.maillabelsGet()
      Promise.all([p0]).then((results) => {
        clearTimeout(this.timeOut)
        this.loading = false
        this.loaded = true
        if (results[0].totalNum > 0) {
          this.$emit('ShowDetail', results[0].list[0].mId, this.selectedBoxId.id)
          this.curmId = results[0].list[0].mId
        }
        let ResultData = results[0].list // this.TagsOjectList(results[0].list)
        if (ResultData.length <= 0) {
          this.noDataSurce()
        } else {
          this.total = results[0].totalNum
          this.noData = false
          this.listCenterData = this.dataGrouping(ResultData)
          this.PageRefresh(ResultData)
        }
      })
        .catch((params) => {
          this.noDataSurce()
          this.$message.error(this.msg(params.body))
        })
    },
    // 获取所有置顶邮件
    TopMail(data) {
      this.target = 'toplist'
      data = this.InitializationLoading(data)
      var p0 = new Promise((resolve, reject) => {
        this.$http.get(this.Global.baseURL + this.Global.api.Mail.getMaillist, {
          params: data
        }).then((res) => {
          if (res.body.code.toString() === this.Global.RES_OK && res.body.data) {
            resolve(res.body.data)
          }
        }, (res) => {
          // this.$message.error(this.msg(res.body))
          reject(res)
        })
      })
      this.maillabelsGet()
      Promise.all([p0]).then((results) => {
        clearTimeout(this.timeOut)
        this.loading = false
        this.loaded = true

        if (results[0].totalNum > 0) {
          this.$emit('ShowDetail', results[0].list[0].mId, this.selectedBoxId.id)
          this.curmId = results[0].list[0].mId
        }
        let ResultData = results[0].list // this.TagsOjectList(results[0].list)
        if (ResultData.length <= 0) {
          this.noDataSurce()
        } else {
          this.total = results[0].totalNum
          this.noData = false
          this.listCenterData = this.dataGrouping(ResultData)
          this.PageRefresh(ResultData)
        }
      }).catch((params) => {
        this.$message.error(params)
        this.noDataSurce()
      })
    },
    // 高级搜索
    AdvancedSearchClick(SearchData, RefreshOrFlipT, isFirst) {
      // console.log('高级搜索')
      this.target = 'advancedlist'
      this.RefreshOrFlip = RefreshOrFlipT
      this.set_selectedBoxName(this.$t('mxpcweb.mail.1528955423785'))// 高级搜索
      this.set_selectedBoxId({
        'id': '-2000',
        target: 'advancedlist',
        'SelectType': 'b'
      })
      if (isFirst) {
        this.currentPage = 1
        this.mailListHeight(0)
      }
      this.AdvancedSearchData = SearchData
      SearchData.from = (this.currentPage - 1) * this.pagesize
      SearchData.size = this.pagesize
      SearchData = this.InitializationLoading(SearchData)
      this.$http.get(this.Global.baseURL + this.Global.api.v2.mails_search, {
        params: SearchData
      }).then((res) => {
        clearTimeout(this.timeOut)
        this.loading = false
        this.loaded = true
        if (res.body.code.toString() == this.Global.RES_OK && isObject(res.body.data)) {
          if (res.body.data.totalNum > 0) {
            this.$emit('ShowDetail', res.body.data.list[0].mId, this.selectedBoxId.id)
            this.curmId = res.body.data.list[0].mId
          }
          let ResultData = res.body.data.list // this.TagsOjectList(res.body.data.list)
          this.total = res.body.data.totalNum
          if (ResultData.length <= 0) {
            this.noDataSurce()
          } else {
            this.noData = false
            this.listCenterData = this.dataGrouping(ResultData)
            this.PageRefresh(ResultData)
          }
        } else {
          this.noDataSurce()
          this.$message.error(this.msg(res.body))
        }
      }, (res) => {
        this.$message.error(res)
      })
    },
    // 快速搜索
    SearchClick(keywords, RefreshOrFlipT, isFirst, type, searchConditions, stickyFlag = '') {
      // console.log('快速搜索' + this.currentPage)
      this.SearchType = type
      this.target = 'Quicklist'
      this.keywords = keywords
      this.RefreshOrFlip = RefreshOrFlipT
      this.searchConditions = searchConditions
      this.set_selectedBoxName(this.$t('mxpcweb.mail.1530004215393'))// 快速搜索
      this.set_selectedBoxId({
        'id': '-3000',
        'target': 'Quicklist',
        'SelectType': 'b'
      })
      if (isFirst) {
        this.currentPage = 1
        this.mailListHeight(0)
      }
      let from = (this.currentPage - 1) * this.pagesize
      // let SearchData = {
      //     keywords: keywords,
      //     from: from,
      //     size: this.pagesize,
      //     sort: 'longSentDate',
      //     order: 'desc'
      // }
      let SearchData = {
        keywords: keywords,
        target: 'folder',
        type: this.filterType,
        from: from,
        size: this.pagesize,
        sort: 'longSentDate',
        order: 'desc'

      }
      if (Object.keys(searchConditions).length > 0) {
        SearchData.searchConditions = searchConditions
        delete SearchData.keywords
      }
      if (stickyFlag != '') { // 置顶
        this.stickyFlag = ''
        SearchData.target = 'toplist'
        SearchData.stickyFlag = stickyFlag
      }
      if (type != 'all') {
        SearchData.boxId = type
      }

      SearchData = this.InitializationLoading(SearchData)
      this.getMaillist(SearchData, 'Quicklist')
      // this.$http.get(this.Global.baseURL + this.Global.api.Mail.getMailsFastSearch, {
      //     params: SearchData
      // }).then((res)=> {
      //     clearTimeout(this.timeOut)
      //     this.loading = false
      //     this.loaded = true
      //     if (res.body.code.toString() == this.Global.RES_OK && isObject(res.body.data)) {
      //         if (res.body.data.totalNum > 0) {
      //             this.$emit('ShowDetail', res.body.data.list[0].mId, this.selectedBoxId.id)
      //             this.curmId = res.body.data.list[0].mId
      //         }
      //         let ResultData = res.body.data.list// this.TagsOjectList(res.body.data.list)
      //         this.total = res.body.data.totalNum
      //         if (ResultData.length <= 0) {
      //             this.noDataSurce()
      //         } else {
      //             this.noData = false
      //             this.listCenterData = this.dataGrouping(ResultData)
      //             this.PageRefresh(ResultData)
      //         }
      //     }
      // })
    },
    ParameterConversion(data) {
      data.target = 'cust'
      data.custId = this.selectedBoxId.id
      data.boxId = ''
    },
    ...mapMutations('mail', {
      set_refurbishListBool: 'SET_REFURBISHLISTBOOL',
      set_selectedBoxName: 'SET_SELECTEDBOXNAME',
      set_selectedBoxId: 'SET_SELECTEDBOXID',
      set_refurbishlabelList: 'SET_REFURBISHLABELLIST',
      set_refurbishBool: 'SET_REFURBISHBOOL',
      set_boxCount: 'SET_BOXCOUNT',
      set_mailOptionList: 'SET_MAILOPTIONLIST'

    }),
    InitializationLoading(data) {
      this.loaded = false
      if (this.RefreshOrFlip == 'F') {
        this.$refs.mailList.scrollTop = 0
      }
      if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
        data.ctid = this.subordinateCtid
      } else {
        delete data.ctid
      }
      if (this.AccountNmber != '') {
        data.mailAccount = this.AccountNmber
      }
      this.checkedListAll = []
      this.listALL = []
      if (this.SearchSelect == 'c') {
        this.ParameterConversion(data)
      }
      delEmptyStrObj(data, true)

      this.timeOut = setTimeout(() => {
        if (!this.loaded) {
          this.loading = true
        }
      }, 500)
      return data
    },
    // 参数拼接
    ParameterSplicing(form) {
      if (this.custId != '') { // 全部的
        let data = {
          target: 'cust',
          custId: this.custId,
          type: 'all',
          from: form,
          size: this.pagesize
        }
        this.getMaillist(data, 'cust')
        return
      }
      if (this.mailAddress != '') {
        let data = {
          target: 'cust',
          mailAddress: this.mailAddress,
          type: 'all',
          from: form,
          size: this.pagesize
        }
        this.getMaillist(data, 'cust')
        return
      }
      if (this.target == 'folder') {
        let data = {
          boxId: this.selectedBoxId.id,
          target: 'folder',
          type: this.filterType,
          from: form,
          size: this.pagesize,
          attach: this.attach,
          commentFlag: this.color,
          readFlag: this.readFlag,
          label: this.labelName,
          stickyFlag: 0
        }
        if (form == 0) {
          let data1 = {
            boxId: this.selectedBoxId.id,
            target: 'folder',
            type: this.filterType,
            from: 0,
            size: 100,
            attach: this.attach,
            commentFlag: this.color,
            readFlag: this.readFlag,
            label: this.labelName,
            stickyFlag: 1
          }
          this.onePage(data1, data)
        } else {
          this.getMaillist(data, this.target)
        }
      } else if (this.target == 'toplist') {
        let data = {
          target: 'toplist',
          type: this.filterType,
          from: form,
          size: this.pagesize,
          attach: this.attach,
          commentFlag: this.color,
          readFlag: this.readFlag,
          label: this.labelName
        }
        this.TopMail(data)
      } else if (this.target == 'advancedlist') { // 高级搜索
        this.AdvancedSearchClick(this.AdvancedSearchData, this.RefreshOrFlip, false)
      } else if (this.target == 'Quicklist') { // 快捷搜索
        this.SearchClick(this.keywords, this.RefreshOrFlip, false, this.SearchType, this.searchConditions, this.stickyFlag)
      } else if (this.target == 'undistributed') { // 未分发
        let data = {
          target: 'folder',
          type: 'all',
          from: form,
          size: this.pagesize,
          attach: this.attach,
          commentFlag: this.color,
          readFlag: this.readFlag,
          label: this.labelName
        }
        this.UndistributedMail(data)
      } else if (this.target == 'assignedList') { // 分发邮件
        let data = {
          boxId: this.selectedBoxId.id,
          target: 'assignedList',
          mailAddress: '',
          type: 'all',
          from: form,
          size: this.pagesize
        }
        this.getMaillist(data, this.target)
      }
    }
  },
  components: {
    'mail-filter': mailFilter,
    'advanced-Search': AdvancedSearch,
    'no-data': NoData,
    'show-name': ShowName,
    'batch-operation': BatchOperation,
    'single-operation': SingleOperation,
    'slider-mail-detail': sliderMailDetail

  },
  watch: {
    selectedBoxId: {
      handler(curVal, oldvalue) {
        if (this.pagesize != this.mailOptionList.MailCount) {
          this.pageGet()
        }
        curVal.SelectType == 'c' ? this.SearchSelect = 'c' : this.SearchSelect = 'b'
        this.target = curVal.target
        if (this.target && this.target != 'Quicklist' && this.target != 'advancedlist') {
          this.filterType = 'all'
          this.attach = ''
          this.color = ''
          this.readFlag = ''
          this.labelName = ''
          this.AccountNmber = curVal.AccountNmber
          this.RefreshOrFlip = 'F'
          this.isOperation = false
          this.currentPage = 1
          let form = (this.currentPage - 1) * this.pagesize
          this.ParameterSplicing(form)
        }
      },
      deep: true
    },
    // 全选
    checkedListAll: {
      handler(curVal, oldvalue) {
        if (curVal.length == this.listALL.length) {
          this.checkedAll = true
        } else {
          this.checkedAll = false
        }
      }
    },
    // 邮件列表
    refurbishListBool: {
      handler(curVal, oldvalue) {
        if (curVal == 2 && this.selectedBoxId.id != undefined) {
          this.RefreshOrFlip = 'F'
          this.filterGetMail('LastListCenter_refurbishListBool1') // 刷新
          this.set_refurbishListBool(0)
        } else if (curVal == 3 && this.selectedBoxId.id != undefined) {
          this.RefreshOrFlip = 'R'
          this.checkedList = this.checkedListAll
          this.filterGetMail('LastListCenter_refurbishListBool2') // 刷新
          this.set_refurbishListBool(0)
        }
      },
      deep: true
    },
    // 标签列表
    refurbishlabelList: {
      handler(curVal, oldvalue) {
        if (curVal == 1) {
          this.firstTime = true
          this.maillabelsGet()
          this.set_refurbishlabelList(0)
        }
      }
    }

  }
}

</script>

<style lang="less" rel="stylesheet/less">
@import "./zh-cn.less";
@import "./en.less";
</style>
