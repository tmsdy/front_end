<template>
    <el-form  onsubmit="return false" :model="ruleForm" :rules="rules" :label-width="labelWidth" :label-position="labelPosition">
        <el-form-item :class="[itemData.group[0].isNotNull == 1 ? 'is-required' : '']" :label="showLabel?itemData.cnFieldCaption:''" :prop="prop()" :style="{'margin-bottom':isProp?0:'15px'}">
            <div>
                <div v-for="(item,index) in itemData.group" style="display:inline-block;margin-right:4px;" :key="index">
                  <template v-if="item.fieldName && item.fieldName == 'countryId'">
                    <component  class="control" dataId="countryId" :key="index" :labelPosition="labelPosition" :isProp="isProp" :rightWidth="rightWidth1" ref="control" :labelWidth="labelWidth1" :options="countryLists" :size='size' v-bind:is="'control'+item.controlTypeId" :itemData="item" :controlData.sync="item.controlData" @change="change"  :showLabel="showLabel1"></component>
                  </template>
                  <template v-if="item.fieldName && item.fieldName == 'provinceId'">
                    <component  class="control" dataId="provinceId" :key="index" :labelPosition="labelPosition" :isProp="isProp" :rightWidth="rightWidth1" ref="control" :labelWidth="labelWidth1" :options="provinceList" :size='size' v-bind:is="'control'+item.controlTypeId" :itemData="item" :controlData.sync="item.controlData" @change="change" :showLabel="showLabel1"></component>
                  </template>
                  <template v-if="item.fieldName && item.fieldName == 'cityId'">
                    <component  class="control" dataId="cityId" :key="index" :labelPosition="labelPosition" :isProp="isProp" :rightWidth="rightWidth1" ref="control" :labelWidth="labelWidth1" :options="cityList" :size='size' v-bind:is="'control'+item.controlTypeId" :itemData="item" :controlData.sync="item.controlData" @change="change" :showLabel="showLabel1"></component>
                  </template>
                  <template v-if="item.fieldName && item.fieldName == 'townId'">
                    <component  class="control" dataId="townId" :key="index" :labelPosition="labelPosition" :isProp="isProp" :rightWidth="rightWidth1" ref="control" :labelWidth="labelWidth1" :options="townList" :size='size' v-bind:is="'control'+item.controlTypeId" :itemData="item" :controlData.sync="item.controlData" @change="change" :showLabel="showLabel1"></component>
                  </template>
                </div>
            </div>
            <div :style="{width:rightWidth,'margin-top':isProp?'':'10px'}" >
              <template v-for="(item,index) in itemData.group">
                <template v-if="item.fieldName && item.fieldName == 'custAddr'">
                  <component  class="control" :dataId="item.fieldName" :key="index" :labelPosition="labelPosition" :isProp="isProp" :rightWidth="rightWidth" ref="control" :labelWidth="labelWidth1" size='size' v-bind:is="'control'+item.controlTypeId" :itemData="item" :controlData.sync="item.controlData" @change="change" :showLabel="showLabel1"></component>
                </template>
              </template>
            </div>
        </el-form-item>
    </el-form>
</template>

<script>
import Controls from '@/components/Controls/index.js'
import { getCountryList } from '@/page/Main/Client/mixins/index.js'
import { mapGetters, mapMutations } from 'vuex'
import { isArray } from '@/libs/utils.js'
export default {
  name: 'Group-Region',
  data () {
    return {
      countryLists: [],
      provinceList: [],
      cityList: [],
      townList: [],
      ruleForm: {
        input: ''
      },
      rules: {
        input: [
          { required: true, message: this.$t('mxpcweb.basecomponents.1530696912786') + this.itemData.cnFieldCaption, trigger: 'blur' }
        ]
      },
      isUpdata: false
    }
  },
  props: {
    labelPosition: {// 控件label的位置
      type: String,
      default: 'right'
    },
    labelWidth: {// 控件label的宽度
      type: String,
      default: '100px'
    },
    labelWidth1: {// 控件label的宽度
      type: String,
      default: '0'
    },
    itemData: {// 赋值给控件的数据
      type: Object,
      default: function () {
        return {}
      }
    },
    size: {// 控件输入框尺寸
      type: String,
      default: 'small'
    },
    rightWidth: {// 控件输入框宽度
      type: String,
      default: '160px'
    },
    rightWidth1: {// 控件输入框宽度
      type: String,
      default: '70px'
    },
    showLabel1: {// 是否展示label
      type: Boolean,
      default: false
    },
    showLabel: {// 是否展示label
      type: Boolean,
      default: true
    },
    isProp: { // 组控件是否关闭验证，默认为false
      type: Boolean,
      default: false
    },
    isRow: { // 组控件是否横向排列，默认为false
      type: Boolean,
      default: false
    }
  },
  created () {
    this.getCountryList(this.getCountryData)
  },
  methods: {
    getCountryList,
    // 同步设置
    ...mapMutations('client', {
        set_countryList: 'SET_COUNTRYLIST'
    }),
    prop () {
      if (this.isProp == true) {
        return ''
      } else {
        if (this.itemData.group[0].isNotNull == 1) {
          return 'input'
        } else {
          return ''
        }
      }
    },
    getCountryData (list) {
      this.countryLists = []
      this.countryLists = list
    },
    countryChange (value) {
      setTimeout(() => {
        this.$refs['control'].forEach((item, index) => {
          if (item.$attrs.dataId == 'provinceId') {
            item.clearDatas()
            if (this.isUpdata) {
              item.updata()
            }
          }
        })
        if (!value || value === '') {
            this.provinceList = []
            return false
        }
        this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.enterpriseset.areaInf, { params: { id: value, type: 'province' } }).then((res) => {
          if (res.body.code.toString() === this.Global.RES_OK && isArray(res.body.data)) {
            this.provinceList = []
            this.provinceList = res.body.data
          } else {
            this.provinceList = []
          }
        })
      }, 20)
    },
    provinceChange (value) {
      this.$refs['control'].forEach((item, index) => {
        if (item.$attrs.dataId == 'cityId') {
          item.clearDatas()
          if (this.isUpdata) {
            item.updata()
          }
        }
      })
      if (!value || value === '') {
          this.cityList = []
          return false
      }
      this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.enterpriseset.areaInf, { params: { id: value, type: 'city' } }).then((res) => {
        if (res.body.code.toString() === this.Global.RES_OK && isArray(res.body.data)) {
          this.cityList = []
          this.cityList = res.body.data
        } else {
          this.cityList = []
          console.warn('setCompanyConfigInfo error!')
        }
      })
    },
    cityChange (value) {
      this.$refs['control'].forEach((item, index) => {
        if (item.$attrs.dataId == 'townId') {
          item.clearDatas()
          if (this.isUpdata) {
            item.updata()
          }
        }
      })
      if (!value || value === '') {
          this.townList = []
          return false
      }
      this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.enterpriseset.areaInf, { params: { id: value, type: 'town' } }).then((res) => {
        if (res.body.code.toString() === this.Global.RES_OK && isArray(res.body.data)) {
          this.townList = []
          this.townList = res.body.data
        } else {
          this.townList = []
          console.warn('setCompanyConfigInfo error!')
        }
      })
    },
    townChange (value) {
      // console.log(this.countryValue + "," + this.provinceListValue + "," + this.cityValue + "," + this.townValue);
    },
    submitForm () {
      let isPass = true
      if (this.$refs['control']) {
        this.$refs['control'].forEach((item) => {
          if (!item.submitForm()) {
            isPass = item.submitForm()
          }
        })
      }
      return isPass
    },
    // 暂时没做
    // getAddress (value) {
    //   if (value.length < 8) { return }
    //   let data = {
    //     key: '18629938026b416e1a95925deba8f82f',
    //     // keywords: '中国上海上海闵行区地址新镇路1399号七宝宝龙城T6',
    //     // keywords: '中国河南省郑州市经三路22号',
    //     keywords: value
    //   }
    //   // console.log(data)
    //   this.$http.get('https://restapi.amap.com/v3/place/text', { params: data }).then(function (res) {
    //     if (res.body.pois && res.body.pois.length > 0) {
    //       console.log(res.body.pois[0])
    //       console.log(this.itemData)
    //       // this.itemData = {}
    //     }
    //   }, function (res) {
    //     this.$message.error(this.$t(this.Global.errorTitle))
    //   })

    //   console.log('value---')
    //   // console.log(value)
    // },
    change (type, value) {
      if (type == 'country') {
        this.countryChange(value.value)
      } else if (type == 'province') {
        this.provinceChange(value.value)
      } else if (type == 'city') {
        this.cityChange(value.value)
      }
      if (value) {
        this.$emit('change', value)
      }
    },
    updata (isControlData, key) {
      // console.log(key)
      if (!isControlData) {
        this.isUpdata = true
        setTimeout(() => {
          this.isUpdata = false
        }, 2000)
      }
      this.$refs['control'].forEach((item, index) => {
        if (key) {
          if (item.$attrs.dataId == key) {
            item.updata(isControlData)
          }
        } else {
          item.updata(isControlData)
        }
      })
    },
    updatas (obj) {
      this.$refs['control'].forEach((item, index) => {
        if (obj[item.$attrs.dataId]) {
          item.updatas(obj[item.$attrs.dataId])
        }
      })
    },
    clearData () {
      this.$refs['control'].forEach((item) => {
        item.clearData()
      })
    }
  },
  computed: {
      ...mapGetters('client', [
          'countryList'
      ])
  },
  components: Object.assign({
  }, Controls),
  beforeDestroy: function () {
    this.getCountryData = null
    this.countryLists = []
    this.provinceList = []
    this.cityList = []
    this.townList = []
    this.clearData = null
    this.updatas = null
    this.updata = null
    this.submitForm = null
    this.prop = null
    this.countryChange = null
    this.provinceChange = null
    this.cityChange = null
    this.townChange = null
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
</style>
