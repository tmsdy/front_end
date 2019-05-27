<template>
    <div class="mapLocation" v-if="isShowMap">
        <div ref="mapSpace"></div>
        <span @click="isShowMap = false">
            <i class="iconfont icon-close"></i>
        </span>
        <!-- 谷歌地图 -->
        <!-- <remote-js v-if="showGoogleJS" src="//maps.googleapis.com/maps/api/js?key=AIzaSyAcpXO8hM3LsNB8NIazkbBz14mjj0NhGvA&sensor=false&callback=initGoogleMap"></remote-js> -->
        <remote-js v-if="showGoogleJS" src="https://ditu.google.cn/maps/api/js?key=AIzaSyDJW4jsPlNKgv6jFm3B5Edp5ywgdqLWdmc&callback=initGoogleMap"></remote-js>
    </div>
</template>
<script>
export default {
  name: 'mapLocation',
  props: {
    zoneData: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      isShowMap: false,
      showGoogleJS: false,
      language: this.$i18n.locale,
      mapCenterArr: []
    }
  },
  created() {
    window.initGoogleMap = () => {
      this.showGoogleMap()
    }
  },
  mounted () {
    // console.log('this.zoneData')
    // console.log(this.zoneData[5])
    this.getMap()
  },
  methods: {
    getMap () {
      // 按顺序拼出地址，不可乱
      let countryArr = this.zoneData.filter(item => {
        return item.fieldName === 'countryId'
      })
      let addrArr = this.zoneData.filter(item => {
        return item.fieldName === 'custAddr'
      })
      let location = this.zoneData.filter(item => {
        return item.fieldName === 'location'
      })
      console.log('map.center => ' + location[0].fieldValue)
      let addrStr = ''
      if (addrArr.length > 0 && addrArr[0].fieldValue) {
        addrStr = addrArr[0].fieldValue// fieldValue
      }

      if (location[0].fieldValue && location[0].fieldValue != '') {
          this.mapCenterArr = location[0].fieldValue.split(',').map(item => {
            return Number(item)
          })
          // console.log('api - ' + this.mapCenterArr)
      }
      // 国家为空时，统一为国内，判断国内 和 国外
      if (addrStr !== '' && this.mapCenterArr.length > 0) {
        this.isShowMap = true
        if (countryArr.length > 0 && countryArr[0].fieldValue != '1') {
          // 打开谷歌地图，没有就加载JS后再展示，有就直接展示
          if (!window.google) {
            // console.log(' first google ')
            this.showGoogleJS = true
          } else {
            // console.log(' already google ')
            this.showGoogleJS = false
            setTimeout(() => {
              this.showGoogleMap()
            }, 300)
          }
        } else {
            setTimeout(() => {
              this.showChinaMap() // 打开中国地图
            }, 300)
        }
      }
    },
    showGoogleMap() {
      let myCenter = new google.maps.LatLng(this.mapCenterArr[0], this.mapCenterArr[1])
      let map = new google.maps.Map(this.$refs.mapSpace, {
        center: new google.maps.LatLng(this.mapCenterArr[0], this.mapCenterArr[1]), // 这个为兼容cn版本
        zoom: 15,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          position: google.maps.ControlPosition.TOP_LEFT
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP
      })
      // console.log(map)
      let marker = new google.maps.Marker({
        position: myCenter
      })
      marker.setMap(map)
      this.showGoogleJS = false
    },
    showChinaMap() {
      let mapCenter = [this.mapCenterArr[1], this.mapCenterArr[0]]

        var map = new AMap.Map(this.$refs.mapSpace, {
          resizeEnable: true,
          zoom: 10,
          center: mapCenter
        })
        var marker = new AMap.Marker({
          position: mapCenter
        })
        marker.setMap(map)
        var circle = new AMap.Circle({
          center: mapCenter,
          redius: 100,
          fillOpacity: 0.1,
          fillColor: '#09f',
          strokeColor: '#09f',
          strokeWeight: 1
        })
        circle.setMap(map)
        map.setFitView()
        // 语言，限中英2个版本
        if (this.language == 'en') {
          map.setLang('en')
        } else {
          map.setLang('zh_cn')
        }
    }
  },
  watch: {
    zoneData: function (newVal) {
      this.getMap()
    }
  },
  components: {
    'remote-js': {
      render(createElement) {
        return createElement('script', {attrs: {type: 'text/javascript', src: this.src}})
      },
      props: {
        src: {type: String, required: true}
      }
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
