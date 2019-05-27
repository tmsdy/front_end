<template>
  <el-dialog title="" :visible.sync="isOpen" custom-class="width1020" :modal-append-to-body="false" v-dialogDrag @close="onClose()">
    <div class="DialogMap" v-loading="isLoading" v-if="isOpen">
      <div class="container" ref="container"></div>

      <div class="constMap MXscroll">
        <no-data v-if="constList.length === 0"></no-data>
        <ul ref="constMap"></ul>

        <div class="other" v-if="!loadingList && constList.length > 0">
          <span v-if="hasPage" @click="pageNext" class="text-hover">换一批</span>
          <span v-else>没有更多了</span>
        </div>
        <loading v-if="loadingList" title="" style="margin-top: 3px;" />

      </div>

    </div>
  </el-dialog>
</template>

<script>
import NoData from '@/basecomponents/NoData/index'
import Loading from '@/basecomponents/Loading/index'

export default {
  name: 'DialogMap',
  props: {
    pageId: {
      type: String,
      default: ''
    },
    constDistance: {
      type: String,
      default: '5km'
    }
  },
  data () {
    return {
      // isOpen: true,
      isOpen: false,
      isLoading: true,
      loadingList: false,
      dataPush: [],
      constList: [],
      totalNum: 0,
      map: null,
      paging: {
        pageN: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    hasPage: function() {
      return Math.ceil(this.totalNum / this.paging.pageSize) !== this.paging.pageN
    }
  },
  methods: {
    initMap() {
      this.isOpen = true
      this.getNearbyConst()
    },
    getNearbyConst() {
      let data = {
        pageN: this.paging.pageN,
        pageSize: this.paging.pageSize,
        custId: this.pageId, // 客户ID
        distance: this.constDistance // 距离
      }
      if (this.constList.length === 0) {
        this.isLoading = true
      } else {
        this.loadingList = true
      }
      this.$http.get(this.Global.baseURL + this.Global.api.v2.customerNearby_do, { params: data }).then((res) => {
        this.isLoading = false
        this.loadingList = false
        if (res.body.code.toString() === this.Global.RES_OK && res.body.data) {
          let list = res.body.data.list
          this.totalNum = res.body.data.totalNum
          list.forEach(item => { // 删除不要的字段
            delete item.custContacts
            delete item.custTracks
            delete item.dynamics
          })
          this.constList = list
          if (this.dataPush.length === 0) {
            this.setMap()
          } else {
            this.mapDataPush()
          }
        }
      }, function (res) {
          this.$message.error(this.msg(res.body))
      })
    },
    setMap() {
      let _this = this
      // 创建地图
      this.map = new AMap.Map(_this.$refs.container, {
        resizeEnable: true,
        zoom: 9
      })

      AMapUI.loadUI(['misc/MarkerList', 'overlay/SvgMarker'],
          function(MarkerList, SvgMarker) {
          var markerList = new MarkerList({
              // 关联的map对象
              map: _this.map,

              // 列表的dom容器的id
              listContainer: _this.$refs.constMap,

              // 置空默认的选中行为，后续监听selectedChanged中处理
              onSelected: null,

              // 返回数据项的Id
              getDataId: function(dataItem, index) {
                  // index表示该数据项在数组中的索引位置，从0开始，如果确实没有id，可以返回index代替
                  return dataItem.id
              },
              // 返回数据项的位置信息，需要是AMap.LngLat实例，或者是经纬度数组，比如[116.789806, 39.904989]
              getPosition: function(dataItem) {
                  return dataItem.position
              },
              // 返回数据项对应的Marker
              getMarker: function(dataItem, context, recycledMarker) {
                  // marker的标注内容
                  var label = {
                      offset: new AMap.Pixel(6, 8), // 修改label相对于marker的位置
                      content: '<i class="markMap">' + (context.index + 1) + '</i>'
                  }

                  // 存在可回收利用的marker
                  if (recycledMarker) {
                      // 直接更新内容返回
                      recycledMarker.setLabel(label)
                      return recycledMarker
                  }

                  // 返回一个新的Marker
                  return new AMap.Marker({
                      label: label
                  })
              },
              // 返回数据项对应的列表节点
              getListElement: function(dataItem, context, recycledListElement) {
                  var arr = [dataItem.custLevel, dataItem.custSource, dataItem.tradeType, dataItem.custStage]
                  let descr = arr.filter(item => {
                    return item != ''
                  }).join('、')
                  descr = descr === '' ? _this.$t('mxpcweb.client.detail.1530004065342') : descr // 暂无

                  var distance = Number(dataItem.c_distance).toFixed(0)
                  let about = _this.$t('mxpcweb.client.detail.1544770350466')
                  var distanceStr = distance > 1000 ? about + (distance / 1000).toFixed(1) + 'km' : about + distance + 'm'
                  var tpl = '<p><%- dataItem.id %>. <%- dataItem.desc %><div title=' + descr + '>' + descr + '<div class="distance">' + distanceStr
                  var content = ''
                  content = MarkerList.utils.template(tpl, {
                      dataItem: dataItem,
                      dataIndex: context.index
                  })

                  if (recycledListElement) {
                      // 存在可回收利用的listElement, 直接更新内容返回
                      recycledListElement.innerHTML = content
                      return recycledListElement
                  }

                  // 返回一段html，MarkerList将利用此html构建一个新的dom节点
                  return '<li class="custMapItem">' + content + '</li>'
              },
              // 列表节点上监听的事件
                listElementEvents: ['click', 'mouseenter', 'mouseleave'],
                // marker上监听的事件
                markerEvents: ['click', 'mouseover', 'mouseout'],
                // makeSelectedEvents:false,
                selectedClassNames: 'selected',
                autoSetFitView: true
          })

           // 创建一个水滴状的shape，显示在选中的Marker位置
          var svgMarker = new SvgMarker(
            new SvgMarker.Shape.WaterDrop({
                height: 40,
                strokeWidth: 1,
                strokeColor: '#ffffff',
                fillColor: '#d0021b'
            }), {
                containerClassNames: 'my-svg-marker',
                showPositionPoint: true
            })

          // 监听选中改变
          markerList.on('selectedChanged', function(event, changedInfo) {
            if (!changedInfo.selected.id) { return }
            let item = _this.constList[changedInfo.selected.id - 1]
            item.billId = item.custId
            item.moduleCode = 'BF001'
            // console.log(item)

            _this.clientDetailPage(item)
            _this.isOpen = false
          })

          markerList.on('listElementMouseenter markerMouseover', function(event, changedInfo) {
            //   console.log(changedInfo)
            //   this.clearSelected()

              var marker
               marker = changedInfo.marker
                marker.hide()

                svgMarker.setMap(marker.getMap())
                svgMarker.setPosition(marker.getPosition())
                svgMarker.setIconLabel(changedInfo.id)
                svgMarker.show()
            })

            markerList.on('listElementMouseleave markerMouseout', function(event, changedInfo) {
            //   console.log('333')
                var marker
                marker = changedInfo.marker
                svgMarker.hide()
                marker.show()
            })

            // 构建一个数据项数组，数据项本身没有格式要求，但需要支持getDataId和getPosition
            window.markerList = markerList
            _this.mapDataPush()
      })
    },
    mapDataPush() {
      let _this = this
      _this.dataPush = []
      _this.constList.forEach((item, index) => {
        let a1 = item.location.split(',')
        _this.dataPush.push({
          id: index + 1,
          position: [a1[1], a1[0]],
          desc: item.custName,
          custLevel: item.custLevel || '',
          custSource: item.custSource || '',
          tradeType: item.tradeType || '',
          custStage: item.custStage || '',
          c_distance: item.c_distance || ''
        })
      })
      // 展示该数据
      markerList.render(_this.dataPush)
    },
    pageNext() {
      this.paging.pageN++
      this.getNearbyConst()
    },
    closeMap() {
      this.map && this.map.destroy()
      this.map = null
    },
    onClose() {
      this.dataPush = []
      this.constList = []
      this.totalNum = 0
      this.closeMap()
      this.paging = {
        pageN: 1,
        pageSize: 2
      }
    }
  },
  components: {
    'no-data': NoData,
    'loading': Loading

  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
