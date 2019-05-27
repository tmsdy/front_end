<template>
  <div class="dashboardBox DeptDepartRank" v-bind:class='bindClass'>
    <div class="workTitle">
      <span class="name">{{pannelName}}</span>
      <span class="pull-right">
        <ul class="tabWrap">

          <li @click="changeType(1,$event)" :class="activeIndex == 1 ? 'active':''">
            <span>
              <!-- 新增 -->{{$t('mxpcweb.workbench.1530671409518')}}
            </span>
          </li>
          <li @click="changeType(2,$event)" :class="activeIndex == 2 ? 'active':''">
            <span>
              <!-- 跟进客户 -->{{$t('mxpcweb.workbench.1530684144110')}}
            </span>
          </li>
          <li @click="changeType(3,$event)" :class="activeIndex == 3 ? 'active':''">
            <span>
              <!-- 跟进数 -->{{$t('mxpcweb.workbench.1530672455895')}}
            </span>
          </li>
          <li @click="changeType(4,$event)" :class="activeIndex == 4 ? 'active':''">
            <span>
              <!-- 成交 -->{{$t('mxpcweb.workbench.1530680869247')}}
            </span>
          </li>
          <li @click="changeType(5,$event)" :class="activeIndex == 5 ? 'active':''">
            <span>
              <!-- 客户总数 -->{{$t('mxpcweb.workbench.1530684194288')}}
            </span>
          </li>
        </ul>
      </span>

    </div>
    <div class="workBody" v-loading="isload">
      <div class="departmentInner">

        <ol class="rightList MXscroll">
          <li v-for="item in rankInfoList" :key="item.ctId" :value="item.ctId">
            <span>{{item.nickName}}</span>
            <span>{{item.count}}</span>
            <span>
              <i v-if="item.upOrDown==1" class="iconfont icon-arrow-up-solid"></i>
              <i v-if="item.upOrDown==0" class="iconfont icon-minus"></i>
              <i v-if="item.upOrDown==-1" class="iconfont icon-arrow-down-solid"></i>
              <i v-if="item.upOrDown==-2" class="iconfont icon-minus"></i>
            </span>
            <div class="avatar"><img :src="getUserPicUrl(item.avatar)"></div>
          </li>

        </ol>
        <div v-show="!isNoData" class="clearfix"></div>
        <!-- 暂无排名 -->
        <nodata v-show="isNoData" :title="$t('mxpcweb.workbench.1530686530814')" img="noRank"></nodata>

      </div>

    </div>
  </div>
</template>

<script>
import NoData from '@/basecomponents/NoData/index'
import { isObject } from '@/libs/utils.js'
export default {
  name: 'DepartRank',
  props: ['isshow', 'data'],
  data() {
    return {
      userPicUrl: '/static/images/noAvatar.png', // 此头像限制大小 28px * 28px
      region: '',
      isload: false,
      isNoData: false,
      pannelName: '',
      selectOption: [],
      startId: 1,
      fieldId: 1,
      interval: 3,
      dkey: '',
      size: 10,
      depts: [],
      deptCount: 0,
      departName: '',
      count: 0,
      rank: 0,
      rankInfoList: [],
      bindClass: '',
      activeIndex: 1,
      statinterval: []
    }
  },
  created() {
    if (this.data.length > 0) {
      this.pannelName = this.data[0].statname
      if (this.data[0].index == '1') {
        this.bindClass = 'rightmargin'
      } else {
        this.bindClass = 'leftmargin'
      }
      this.startId = this.data[0].statid
      var selectinterval = this.data[0].selectinterval
      if (this.statinterval.length > 0) {
        selectinterval = this.statinterval[0].intervalCode
        this.interval = selectinterval
      }
      this.depts = this.data[0].depts
      this.deptCount = this.depts.length

      if (this.depts.length > 0) {
        this.dkey = this.depts[0].dkey
        this.departName = this.depts[0].deptName
        this.getDepartRankData()
      }
    }
  },
  mounted() { },
  methods: {
    getName(itemCode) {
      var itemName = ''
      for (var i = 0; i < this.statinterval.length; i++) {
        if (this.statinterval[i].intervalCode == itemCode) {
          itemName = this.statinterval[i].intervalName
          return itemName
        }
      }
      return itemCode
    },

    getUserPicUrl(avatar) {
      if (avatar != '') {
        var userImage = this.getGlobalImgSrc(avatar, '28x28')
        return userImage
      } else {
        return this.userPicUrl
      }
    },
    changeType(type, event) {
      this.activeIndex = type
      this.fieldId = type

      this.isload = true
      this.isNoData = false
      this.getDepartRankData()
    },
    getDepartRankData() {
      let _this = this
      var url = _this.Global.baseURL + _this.Global.api.v2.stat_dept_rank_get
      _this.$http.get(url, {
        params: {
          interval: this.interval,
          fieldId: this.fieldId,
          size: this.size,
          dkey: this.dkey
        }
      }).then(
        (res) => {
          if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data)) {
            // console.log(res.body);
            if (res.body.data.rankInfoList != undefined) {
              _this.rankInfoList = res.body.data.rankInfoList
            }
            if (_this.rankInfoList.length == 0) {
              _this.isNoData = true
            }
            _this.isload = false
          } else {
            _this.isNoData = true
            _this.isload = false
            if (_this.dkey != '') {
              _this.$message.error(res.data.msg)
            }
          }
        },
        (res) => {
          _this.isload = false
          if (_this.dkey != '') {
            _this.$message.error(_this.$t(_this.Global.errorTitle))
          }
        }
      )
    }
  },
  components: {
    'nodata': NoData
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
