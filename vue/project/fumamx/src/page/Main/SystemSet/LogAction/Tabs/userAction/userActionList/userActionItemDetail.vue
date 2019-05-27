<template>
    <div class="userActionDetail">
        <div v-html="titleFormat"></div>
        <div class="formatItem" v-if="itemFormat">
            <ul>
                <!-- 将name 由 old 改为new -->
                <li v-for="(item,index) in itemFormat" :key="index" v-html="$t('mxpcweb.systemset.logaction.1530347146446',{name:item.name,old:item.old,new:item.new})">               </li>
            </ul>
            <!-- 2条以上出来【更多】-->
            <span class="more text-hover" v-if="itemFormat.length > 1" data-active="no" @click="showMore">
                <!-- 更多 -->
                {{$t('mxpcweb.systemset.logaction.1530347232382')}}
                <i class="iconfont icon-page-right"></i>
            </span>
            <div style="color:#909399;font-size:12px;">
                <!-- 没有更多了 -->
                {{$t('mxpcweb.systemset.logaction.1530346965727')}}
            </div>
        </div>
        <!--<br>
        <hr>
        {{itemFormat}}
            <hr>
            <div>{{logFormat}}</div>
            <hr><br>
            <div>{{detail}}</div>-->
    </div>
</template>

<script>
/**
 * 描述：系统设置=>日志与行为
 * 作者：向士健
 * 时间：2017/10/31
 */
// import $ from 'jquery'
export default {
  name: 'userActionDetail',
  props: {
    logFormat: {
      type: String
    },
    detail: {
      type: Object
    }
  },
  computed: {
    'itemFormat': function () {
      let fieldList = this.detail.fieldList
      let subDetails = this.detail.subDetails

      if (fieldList && subDetails) {
        let arrItem = []
        fieldList.split('@@').forEach(function (item, index) {
          subDetails.old.split('@@').forEach(function (item2, index2) {
            if (index === index2) {
              arrItem.push({
                name: item,
                old: item2
              })
            }
          })
        })
        arrItem.forEach(function (item, index) {
          subDetails.new.split('@@').forEach(function (item2, index2) {
            if (index === index2) {
              arrItem[index].new = item2
            }
          })
        })
        return arrItem
      }
    },

    'titleFormat': function () {
      let txt = this.logFormat
      let objectName = this.detail.objectName
      let fieldList = this.detail.fieldList
      if (fieldList) {
        fieldList = fieldList.replace(/@@/g, '、')
      }
      let newString = txt.replace(/%objectname%/, "<span style='color:#222'> " + objectName + ' </span>')
        .replace(/%fieldlist%/, "<span style='color:#222'> " + fieldList + ' </span>')
      return newString
    }
  },
  methods: {
    showMore () {
      let $this = $(event.target)
      let active = $this.attr('data-active')
      if (active == 'no') {
        $this.attr('data-active', 'yes')
        $this.parent().css('height', 'auto')
        $this.find('i').removeClass('icon-page-right').addClass('icon-page-down')
      } else {
        $this.attr('data-active', 'no')
        $this.parent().css('height', '25px')
        $this.find('i').removeClass('icon-page-down').addClass('icon-page-right')
      }
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.userActionDetail {
  // border:1px solid red;
  color: #909399;
  .formatItem {
    // border:1px solid red;
    padding-right: 45px;
    position: relative;
    height: 25px;
    overflow: hidden;
    .more {
      font-size: 12px;
      position: absolute;
      right: 0;
      top: 0;
      > i {
        font-size: 12px;
      }
    }
  }
}
</style>
