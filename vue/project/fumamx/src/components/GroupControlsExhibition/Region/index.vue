<template>
    <div class="GroupControlsExhibition" v-if="zoneData.length>0">
        <span class="labelGroup" :style="{width:labelWidth}">{{itemData.cnFieldCaption}}</span>

        <div class="contentGroup">
            <template v-for="(item,index) in zoneData">
                <template v-if="item.controlTypeId !== undefined && item.controlTypeId != '0' && item.fieldValue && item.fieldValue != 0 && item.fieldValue !== ''">
                    <component :key="index" class="component" v-bind:is="'control'+item.controlTypeId" :itemData="item" labelWidth="0" :inline="true" style="margin-right:10px;float:left;"></component>
                </template>
            </template>
            <!-- 附近客户 -->
            <span class="text-blue text-hover" @click="$refs.DialogMap.initMap()">{{$t('mxpcweb.client.detail.1544519718717')}}({{constNum || 0}})</span>

            <!-- 由地址出地图 -->
            <map-location :zoneData="zoneData" v-if="isShowMap"></map-location>
            <!-- 附近客户地图 -->
            <dialog-map ref="DialogMap" :pageId="pageId" :constDistance="constDistance"></dialog-map>
        </div>

    </div>
</template>
<script>
import { isArray } from '@/libs/utils.js'
import Controls from '@/components/ControlsExhibition/index.js'
import mapLocation from './MapLocation/index'
import DialogMap from './DialogMap'
export default {
  name: 'GroupControlsExhibition',
  props: {
    pageId: {
        type: String,
        default: ''
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    itemData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      zoneData: [],
      isShowMap: false,

      constNum: null,
      constDistance: '5km'
    }
  },
  mounted () {
    // console.log('this.itemData')
    // console.log(this.itemData)
    this.getData()
    this.getNearbyConst()
  },
  methods: {
    getData () {
      let country
      let province
      let city
      this.itemData.group.forEach(function (item, index) {
        if (item.fieldName == 'countryId') {
          country = item.fieldValue
        }
        if (item.fieldName == 'provinceId') {
          province = item.fieldValue
        }
        if (item.fieldName == 'cityId') {
          city = item.fieldValue
        }
      })
      this.getAddress(country, province, city)
    },
    getAddress (country, province, city) {
      let _this = this
      var p0 = new Promise((resolve, reject) => {
        this.$http.get(this.Global.baseURL + this.Global.api.v2.area + '0', { params: { type: 'country' } }).then(function (res) {
          if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
            resolve(res.body.data)
          } else {
            _this.$message.error(_this.msg(res.body))
          }
        }, function (res) {
          _this.$message.error(_this.$t(_this.Global.errorTitle))
        })
      })
      var p1 = new Promise((resolve, reject) => {
        if (country != '0' && country !== undefined && country !== '') {
          this.$http.get(this.Global.baseURL + this.Global.api.v2.area + country, { params: { type: 'province' } }).then(function (res) {
            if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
              resolve(res.body.data)
            } else {
              _this.$message.error(_this.msg(res.body))
            }
          }, function (res) {
            _this.$message.error(_this.$t(_this.Global.errorTitle))
          })
        } else {
          resolve([])
        }
      })
      var p2 = new Promise((resolve, reject) => {
        if (province != '0' && province !== undefined && province !== '') {
          this.$http.get(this.Global.baseURL + this.Global.api.v2.area + province, { params: { type: 'city' } }).then(function (res) {
            if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
              resolve(res.body.data)
            } else {
              _this.$message.error(_this.msg(res.body))
            }
          }, function (res) {
            _this.$message.error(_this.$t(_this.Global.errorTitle))
          })
        } else {
          resolve([])
        }
      })
      var p3 = new Promise((resolve, reject) => {
        if (city != '0' && city !== undefined && city !== '') {
          this.$http.get(this.Global.baseURL + this.Global.api.v2.area + city, { params: { type: 'town' } }).then(function (res) {
            if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
              resolve(res.body.data)
            } else {
              _this.$message.error(_this.msg(res.body))
            }
          }, function (res) {
            _this.$message.error(_this.$t(_this.Global.errorTitle))
          })
        } else {
          resolve([])
        }
      })
      Promise.all([p0, p1, p2, p3]).then(function (results) {
        // console.log(_this.itemData)
        // console.log(results)
        let arr = []
        _this.itemData.group.forEach(function (item, index) {
          //
          if (item.fieldName == 'countryId') {
            results[0].forEach(function (item2) {
              if (item2.countryId == item.fieldValue) {
                item['value'] = item2.cnName
              }
            })
          }
          if (item.fieldName == 'provinceId') {
            results[1].forEach(function (item2) {
              if (item2.provinceId == item.fieldValue) {
                item['value'] = item2.cnName
              }
            })
          }
          if (item.fieldName == 'cityId') {
            results[2].forEach(function (item2) {
              if (item2.cityId == item.fieldValue) {
                item['value'] = item2.cnName
              }
            })
          }
          if (item.fieldName == 'townId') {
            results[3].forEach(function (item2) {
              if (item2.townId == item.fieldValue) {
                item['value'] = item2.cnName
              }
            })
          }
          item.editState = 0// 先不让可编辑
          arr.push(item)
        })
        _this.zoneData = arr

        // 有地址才调地图
        let address = arr.filter(item => {
          return item.fieldName === 'custAddr'
        })
        if (address.length > 0 && address[0].fieldValue && address[0].fieldValue !== '') {
          _this.isShowMap = true
        }
      })
    },
    // 附近客户
    getNearbyConst () {
      let data = {
          custId: this.pageId, // 客户ID
          distance: this.constDistance // 距离
      }
      this.$http.get(this.Global.baseURL + this.Global.api.v2.customerNearby_do, { params: data }).then((res) => {
          if (res.body.code.toString() === this.Global.RES_OK && res.body.data) {
            this.constNum = res.body.data.totalNum
          }
      }, (res) => {
          this.$message.error(this.msg(res.body))
      })
    }
  },
  watch: {
    // 重新刷新数据时，自动关掉编辑
    itemData: function (newVal, oldVal) {
      this.getData()
    }
  },
  components: Object.assign({
    'map-location': mapLocation,
    'dialog-map': DialogMap
  }, Controls)
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../zh-cn.less";
@import "../en.less";
</style>
