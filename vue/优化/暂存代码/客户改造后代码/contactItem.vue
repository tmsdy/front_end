<template>
  <div class="customerTable">
    <template v-if="contactItem!==undefined">
      <ul class="customerList">
        <template v-if="contactItem.title">
          <p class="titleTime" v-if="isShowCheck">
            <i class="iconfont" :class="contactItem.focus ? 'icon-star' : 'icon-kehu-liebiaoriqi'"></i>
            <span>{{returnTitleTime(contactItem.titleTime)}}</span>
          </p>
        </template>
        <li v-else>
          <!-- <img class="avatar"  v-imgsrc="contactItem.imagesId&&contactItem.imagesId.length!=0?avatarSrc(contactItem.imagesId):'img/contacts.png'"> -->
          <img class="avatar" v-if="updata" v-lazy="avatarSrc(contactItem)">
          <div v-if="isShowCheck" :class="[controlData.checkedCities.length==0 ? 'listCheckNone' : 'listChecks']">
            <el-checkbox :label="contactItem[moduleStruct.identField]" size="small">&nbsp;</el-checkbox>
          </div>
          <el-row :gutter="20" class="customerInfo">
            <el-col :span="6">
              <div style="height:20px;">
                <!-- 姓名 -->
                <span class="custNameBox ellipsis">
                  <span class="text-hover custName ellipsis" v-if="contactItem[moduleStruct.titleField]&&contactItem[moduleStruct.titleField]!=''" :title="$t('mxpcweb.client.1529056034251')+':'+contactItem[moduleStruct.titleField]" @click="showDetail(contactItem)">
                    {{contactItem[moduleStruct.titleField]}}
                  </span>
                  <span v-else>&nbsp;</span>
                  <span style="color:rgba(144,147,153,1);">
                    <template v-if="contactItem.nickName !== '' && contactItem.nickName !== undefined">
                      <!-- 昵称 -->
                      (<span :title="$t('mxpcweb.client.1529056014003')+':'+contactItem.nickName">{{contactItem.nickName}}</span>)
                    </template>
                    <template v-if="contactItem.jobs !== '' && contactItem.jobs !== undefined&&checkIsShow('jobs')">
                      <!-- 职位 -->
                      <span :title="$t('mxpcweb.client.1529055995566')+':'+contactItem.jobs">{{contactItem.jobs}}</span>
                    </template>
                    <span v-if="checkIsShow('sex')" class="sex">
                      <component v-bind:is="'control39'" ref="control" :value="{value:contactItem.sex}"></component>
                    </span>
                  </span>
                </span>
              </div>
            </el-col>
            <el-col :span="18">
              <div>
                <div style="display:inline-block;width:100%">
                  <span class="ellipsis" style="display:inline-block;text-align:left" :style="{'width':(75/5.3)+'%'}">
                    <template v-if="contactItem.decisionMaker != '' && contactItem.decisionMaker !== undefined&&checkIsShow('decisionMaker')" :title="contactItem.decisionMaker">
                      <component v-bind:is="'control2'" ref="control" :value="{value:contactItem.decisionMaker}" :itemData="{
                                                            dictCode: 200,
                                                            fieldName: 'decisionMaker'
                                                        }"></component>
                    </template>
                    <span v-else>&nbsp;</span>
                  </span>
                  <span class="ellipsis" style="display:inline-block;text-align:left" :style="{'width':(75/5.3)+'%'}">
                    <template v-if="contactItem.intimacy != '' && contactItem.intimacy !== undefined&&checkIsShow('intimacy')" :title="contactItem.intimacy">
                      <component v-bind:is="'control71'" ref="control" :value="{value:contactItem.intimacy}"></component>
                    </template>
                    <span v-else>&nbsp;</span>
                  </span>
                  <span class="ellipsis" style="display:inline-block;text-align:left" :style="{'width':(75/5.3)+'%'}">
                    <template v-if="contactItem.mobile != '' && contactItem.mobile !== undefined&&checkIsShow('mobile')" :title="contactItem.mobile">
                      <component v-bind:is="'control12'" ref="control" :value="{value:contactItem.mobile}"></component>
                    </template>
                    <span v-else>&nbsp;</span>
                  </span>
                  <span class="ellipsis" style="display:inline-block;text-align:left;position:relative;" :style="{'width':25+'%'}">
                    <template v-if="contactItem.mailAddress != ''&&checkIsShow('mailAddress')">
                      <component class="mailBox" v-bind:is="'control13'" ref="control" :value="{value:contactItem.mailAddress}"></component>
                    </template>
                    <span v-else>&nbsp;</span>
                  </span>
                  <span class="ellipsis" style="display:inline-block;text-align:left" :style="{'width':(75/5.3)+'%'}">
                    <template v-if="contactItem.deptName !== undefined&&checkIsShow('deptName')">
                      <component v-bind:is="'control1'" ref="control" :value="{value:contactItem.deptName}"></component>
                    </template>
                    <span v-else>&nbsp;</span>
                  </span>
                  <span style="display:inline-block;text-align:left;position:relative;height: 20px;z-index: 3;" :style="{'width':(75/5.3)+'%'}">
                    <div v-if="contactItem.social !== undefined&&checkIsShow('social')" style="position:absolute;">
                      <component v-bind:is="'control41'" ref="control" :value="{value:contactItem.social}"></component>
                    </div>
                    <span v-else>&nbsp;</span>
                  </span>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="customerInfo1">
            <el-col :span="6" style="margin-top: -3px;">
              <div class="grid-content bg-purple ellipsis">
                <!-- 客户名称 -->
                <span class="text-hover" style="color:RGBA(144, 147, 153, 1)" :title="$t('mxpcweb.client.1529055956170')+':'+contactItem.custName" @click="listaddTab(contactItem)">
                  {{contactItem.custName}}
                </span>
              </div>
            </el-col>
            <el-col :span="18" style="margin-top: -3px;">
              <div>
                <div style="display:inline-block;width:100%;">
                  <span class="ellipsis" style="display:inline-block;text-align:left" :style="{'width':(75/5.3)+'%'}">
                  </span>
                  <span class="ellipsis" style="display:inline-block;text-align:left" :style="{'width':(75/5.3)+'%'}">
                  </span>
                  <span class="ellipsis" style="display:inline-block;text-align:left" :style="{'width':(75/5.3)+'%'}">
                    <template v-if="contactItem.tel != '' && contactItem.tel !== undefined&&checkIsShow('tel')" :title="contactItem.tel">
                      <component v-bind:is="'control42'" ref="control" :value="{value:contactItem.tel}"></component>
                    </template>
                    <span v-else></span>
                  </span>
                  <!-- 标签 -->
                  <show-label :title="$t('mxpcweb.client.1529057053276')" style="overflow:hidden;height:20px;text-align:right" :style="{'width':(41+75/5.3)+'%'}" :moduleCode="moduleCode" ref="label" :dynamicTags="dynamicTags" :tags="contactItem.tags"></show-label>
                </div>
              </div>
            </el-col>
          </el-row>
          <div class="listTimes3 listControl1">
            <detail-opt useType="customer" :moduleStructName="moduleStruct.titleField" :moduleStructId="moduleStruct.identField" :moduleCode="moduleCode" @getListData="getListData" :detailOptData="detailOpt" :itemData="contactItem"></detail-opt>
          </div>
          <div class="grid-content bg-purple listTimes">
            <span dataOn="true">
              <component v-bind:is="'controlListTime'" ref="control" :value="{value:contactItem[nowSort.fieldName]}"></component>
            </span>
          </div>
          <div class="listTimes1 ellipsi">
            <component v-bind:is="'control24'" ref="control" :value="{value:contactItem.ownerCtId}"></component>
          </div>
          <span v-if="isFocusBill(contactItem.focusTargets)&&viewType!='seas'" class="starBox">
            <i class="iconfont icon-star-card" style="font-size:16px;"></i>
          </span>
        </li>
      </ul>
    </template>
    <!-- 联系人详情，弹窗 -->
    <contacts-detail ref="contactsDetail" @tellFather="getListData"></contacts-detail>
  </div>
</template>

<script>
import detailOpt from '../../detailOpt/index'
import showLabel from './showLabel/index.vue'
import ContactsDetail from './ContactsDetail/index'// 联系人详情，弹窗
import ListShow from '@/components/ListShowControls/index.js'
export default {
  name: 'customerItem',
  data() {
    return {

    }
  },
  props: {
    contactItem: {
      type: Object
    },
    controlData: {
      type: Object,
      default: () => ({
        checkedCities: []
      })
    },
    detailOpt: {
      type: Array,
      default: () => []
    },
    moduleStruct: {
      type: Object,
      default: () => ({
        fieldName: 'createDate'
      })
    },
    listSet: {
      type: Object,
      default: () => ({})
    },
    nowSort: {
      type: Object,
      default: () => ({
        fieldName: 'createDate'
      })
    },
    dynamicTags: {
      type: Array,
      default: () => []
    },
    moduleCode: {
      type: String,
      default: ''
    },
    isShowCheck: {
      type: Boolean,
      default: true
    },
    viewType: {
      type: String,
      default: ''
    },
    updata: {
      type: Boolean,
      default: false
    }
  },
  created() {
  },
  methods: {
    returnTitleTime(titleTime) {
      if (titleTime) {
        if (titleTime != this.$t('mxpcweb.client.1529056745088')) {
          let time = this.timeShow_custom(titleTime + ' 00:00:00', 'YYYY-MM-DD')
          return time
        } else {
          return titleTime
        }
      } else {
        return this.$t('mxpcweb.client.1529056745088')
      }
    },
    returnTimeShow(titleTime, type) {
      let time = this.timeShow_custom(titleTime, type)
      return time
    },
    listaddTab(contactItem) {
      if (this.$refs.elPopover) {
        this.$refs.elPopover.forEach(item => {
          if (item.$refs.popper) {
            item.$refs.popper.style.display = 'none'
          }
        })
      }
      contactItem.billId = contactItem.custId
      contactItem.billName = contactItem.custName
      contactItem.moduleCode = this.moduleCode
      this.$MXEventBus.emit('addTab', contactItem)
    },
    getListData(upData) {
      this.$MXEventBus.emit('getListDatas', false, upData)
    },
    checkIsShow(itemName) {
      let isShow = false
      if (this.listSet.listSetAllow) {
        this.listSet.listSetAllow.forEach((item) => {
          if (itemName == item.fieldName) {
            isShow = true
          }
        })
      }
      return isShow
    },
    // 打开弹窗，联系人详情
    showDetail(item) {
      this.$refs.contactsDetail.showDialog(item)
    },
    // 图像
    avatarSrc(contactItem) {
      if (!contactItem.imagesId || contactItem.imagesId.length === 0) {
        if (contactItem.sex && contactItem.sex == '2') {
          return require('@static/images/noAvatarWoman.png')
        } else {
          return require('@static/images/noAvatar.png')
        }
      } else {
        let imgId = contactItem.imagesId[0] // 取第一个数组项为默认头像
        return this.getGlobalImgSrc(imgId, '55x55')
      }
    }
  },
  components: Object.assign({
    'contacts-detail': ContactsDetail,
    'detail-opt': detailOpt,
    'show-label': showLabel
  }, ListShow)
}
</script>

<style lang="less" scoped>
@import "../zh-cn.less";
@import "../en.less";
//颜色
@blue: #008cee !important;
@blue-light: #3bc2b5 !important;
@red: #f00 !important;
@yellow: #ff943e !important;
@gray: #ccc !important;
@black: #000 !important;
.customerTable {
  .titleTime {
    padding-left: 34px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    color: #222222;
    .iconfont {
      position: absolute;
      left: 12px;
      font-size: 12px;
      color: #222222;
    }
  }
  .customerList {
    // margin-bottom: 6px;
    // >:last-child{
    //     border-bottom:0;
    // }
    li {
      background: white;
      padding: 14px 200px 13px 84px;
      border-bottom: 1px solid #f7f8f9;
      font-size: 12px;
      position: relative;
      .avatar {
        position: absolute;
        left: 34px;
        top: 14px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      .starBox {
        position: absolute;
        left: 9px;
        top: -1px;
        width: 16px;
        height: 16px;
        text-align: center;
        line-height: 16px;
        color: rgba(208, 2, 27, 1);
        font-size: 12px;
      }
      .listCheckNone1,
      .listCheckNone,
      .listChecks {
        position: absolute;
        top: 24px;
        left: 10px;
      }
      .listCheckNone1,
      .listChecks {
        display: inline-block;
      }
      .listCheckNone {
        display: none;
      }
      .listCheck {
        display: none;
      }
      .customerInfo1 {
        height: 20px;
        line-height: 14px;
      }
      .customerInfo {
        height: 20px;
        line-height: 20px;
        .custNameBox {
          position: relative;
          display: inline-block;
          padding-right: 30px;
          max-width: 100%;
          .custName {
            font-size: 14px;

            color: rgba(34, 34, 34, 1);
            font-weight: 600;
          }
          .sex {
            position: absolute;
            top: 0;
            right: 0;
          }
        }
        .el-dropdown-menu__item {
          line-height: 30px;
          height: 30px;
        }
        .listMenu {
          display: none;
        }
        .toCustomerDetai {
          display: none;
        }
      }
      .listTimes1 {
        position: absolute;
        top: 14px;
        right: 95px;
        width: 90px;
      }
      .listTimes2 {
        position: absolute;
        bottom: 12px;
        right: 95px;
        width: 90px;
      }
      .listTimes3 {
        position: absolute;
        top: 12px;
        right: 18px;
        width: 177px;
      }
      .listTimes {
        position: absolute;
        top: 14px;
        right: 20px;
        width: 70px;
      }
      .listControl {
        width: 130px;
        display: none;
        color: #cdcdcd;
        .text-blue-hover {
          color: @blue;
          cursor: pointer;
        }
        .hover {
          cursor: pointer;
        }
      }
      .listControl1 {
        display: none;
      }
      .rank-box {
        width: 100px;
        display: inline-block;
        color: rgb(153, 153, 153);
        .score {
          display: inline-block;
          text-align: center;
          width: 38px;
          height: 20px;
          line-height: 20px;
          background: rgba(192, 196, 204, 1);
          border-radius: 10px;
          font-size: 12px;
          .iconfont {
            font-size: 12px;
            margin-right: 4px;
          }
        }
      }
    }
    > li:hover {
      background: #fafafa;
      .listTime,
      .listTimes,
      .listTimes1,
      .listTimes2 {
        display: none;
      }
      .listControl,
      .listTimes3 {
        display: inline-block;
      }
      .toCustomerDetai {
        display: inline-block;
      }
      .listCheck {
        display: inline-block;
      }
      .listMenu {
        display: inline-block;
      }
      .listCheckNone {
        display: inline-block;
      }
      .listCheckNone1 {
        display: none;
      }
    }
  }
}
</style>
