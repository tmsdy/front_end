<template>
  <div class="list-item">
    <dt v-if="item2.dates">{{item2.dates}}</dt>
    <dd v-else :class="{'new':(item2.status==-1),'old':(item2.status!=-1),'active':(item2.index==checkgroupIndex&&index2==checkedIndex&&custId==''&&mailAddress=='')}" :key="index2" @click="ListCenterShowDetail(item2,item2.index,index2)" @dblclick="fullScreen(item2.mId,item2.subject,item2.source,item2.folder)">
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
  </div>

</template>

<script>
import { isArray, commentsColor } from '@/libs/utils.js'
import ShowName from './Vue/ShowName/index'
import SingleOperation from './Vue/SingleOperation/index'
import { mapGetters } from 'vuex'
export default {
  name: 'ListItem',
  props: {
    index2: {
      type: Number,
      default: 0
    },
    item2: {
      type: Object,
      default: () => { }
    },
    checkedListAll: {
      type: Object,
      default: () => []
    },
    custId: {
      type: String,
      default: ''
    },
    mailAddress: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      gridData: [] // 千里眼
    }
  },
  mounted() {
    console.log(this.item2)
  },
  computed: {
    ...mapGetters('mail', [
      'selectedBoxId'
    ])
  },
  methods: {
    isSendMail(item2) {
      if (item2.source == 'FMDRAFT' || item2.source == 'FMD' || (item2.mailAddress && item2.fromEx[0] && item2.fromEx[0].address && item2.mailAddress.toLowerCase() == item2.fromEx[0].address.toLowerCase()) || (item2.source == 'FMI' && item2.mailAddress.toLowerCase() == item2.fromEx[0].address.toLowerCase())) {
        return true
      }
      return false
    },
    ListCenterShowDetail(item, index1, index2) {
      console.log('ListCenterShowDetail1', index1, index2)
      if (item.dates) return
      this.$MXEventBus.emit('ListCenterShowDetail', item, index1, index2)
    },
    // 日期显示
    DateDisplay(item) {
      let times = (item.longSentDate == 0 || item.longSentDate == undefined) ? parseInt(item.createTime) : parseInt(item.longSentDate)
      var timeFormat = this.$moment(new Date(times)).format('HH:mm')
      return timeFormat// this.$m_formulateTime(timeFormat)
    },
    // 操作
    OperationTrigger(key, key2, key3, key4) {
      this.$emit('OperationTrigger', key, key2, key3, key4)
    },
    // 打开邮件详情
    fullScreen(mId, title, source, folder) {
      console.log('fullScreen')
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
    }
  },
  components: {
    'show-name': ShowName,
    'single-operation': SingleOperation
  }
}
</script>
<style lang="less" rel="stylesheet/less">
@import "./zh-cn.less";
@import "./en.less";
</style>
