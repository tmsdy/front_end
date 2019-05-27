<template>
  <div class="UpgradeProduct">
    <!-- 升级 -->
    <el-dialog :title="$t('mxpcweb.systemset.applicationcenter.1530252061380')" :visible.sync="showPageFlag" :close-on-click-modal="false">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 套餐续费 -->
        <el-tab-pane :label="$t('mxpcweb.systemset.applicationcenter.1530252103676')" name="productUpgrade">
          <table class="currentConfig">
            <tr>
              <!-- 当前配置 -->
              <td align="right" style="padding-right:23px;font-size:15px;">{{$t('mxpcweb.systemset.applicationcenter.1530252142814')}}</td>
              <td colspan="3"></td>
            </tr>
            <tr>
              <!-- 产品名称 -->
              <td align="right">{{$t('mxpcweb.systemset.applicationcenter.1530252179700')}}：</td>
              <td>{{oldProductForm.productName}}</td>
              <!-- 到期时间 -->
              <td align="right" style="width:150px;">{{$t('mxpcweb.systemset.applicationcenter.1530252220214')}}：</td>
              <td>{{oldProductForm.endDate}}</td>
            </tr>
            <tr>
              <!-- 用户许可人数： -->
              <td align="right">{{$t('mxpcweb.systemset.applicationcenter.1530252271308')}}：</td>
              <td>
                <!-- 用户 -->
                <span style="color:#008cee">{{oldProductForm.authNum}}</span>{{$t('mxpcweb.systemset.applicationcenter.1530252357590')}}</td>
              <!-- 云空间 -->
              <td align="right">{{$t('mxpcweb.systemset.applicationcenter.1530252390189')}}：</td>
              <td>
                <span style="color:#008cee">{{oldProductForm.authNum * baseSpaceNum}}</span>G</td>
            </tr>

          </table>

          <div style="border-top:1px solid #eee;margin:10px 0 6px;"></div>

          <el-form ref="productForm" :model="productForm" label-width="80px">
            <!-- 产品名称 -->
            <el-form-item :label="$t('mxpcweb.systemset.applicationcenter.1530252179700')">
              <el-radio-group size="small" v-model="productForm.productCode">
                <!--FumaMX基础版  -->
                <el-radio-button label="PK0001">{{$t('mxpcweb.systemset.applicationcenter.1530252444688')}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <!-- 增加套餐年限 -->
            <el-form-item :label="$t('mxpcweb.systemset.applicationcenter.1530252531566')">
              <el-radio-group size="small" v-model="productForm.yearNum">
                <!-- 1年 -->
                <el-radio-button label="1">{{$t('mxpcweb.systemset.applicationcenter.1530252566198')}}</el-radio-button>
                <!-- 2 年 -->
                <el-radio-button label="2">{{$t('mxpcweb.systemset.applicationcenter.1530252597460')}}
                  <!-- 送6个月 -->
                  <span style="font-size:1pt;">({{$t('mxpcweb.systemset.applicationcenter.1530252634789')}})</span>
                </el-radio-button>
                <!--三年 -->
                <el-radio-button label="3">{{$t('mxpcweb.systemset.applicationcenter.1530252661085')}}
                  <!-- 送12个月 -->
                  <span style="font-size:1pt;">({{$t('mxpcweb.systemset.applicationcenter.1530252704350')}})</span>
                </el-radio-button>
              </el-radio-group>
              <div style="margin-top:5px;line-height:16px;">
                <!-- 购买后到期时间 -->
                {{$t('mxpcweb.systemset.applicationcenter.1530252759589')}}：
                <span style="color:#008cee">{{productForm.endDate}}</span>
              </div>
            </el-form-item>

          </el-form>

          <table class="currentConfig widthFull">
            <tr>
              <!--费用小计  -->
              <td align="right" style="width:119px;">{{$t('mxpcweb.systemset.applicationcenter.1530252828527')}}：</td>
              <!-- {{perYearPrice}}元*{{productForm.yearNum}}年={{totalPrice}}元 -->
              <td style="color:orange">{{$t('mxpcweb.systemset.applicationcenter.1530253071037',{price:perYearPrice,year:productForm.yearNum,total:totalPrice})}}</td>

              <td align="right" rowspan="2">
                <!-- 立即续费 -->
                <el-button type="primary" style="margin-top:12px; width:130px;">{{$t('mxpcweb.systemset.applicationcenter.1530253173574')}}</el-button>
              </td>
            </tr>
            <tr>
              <!-- 合计金额 -->
              <td align="right">{{$t('mxpcweb.systemset.applicationcenter.1530253228854')}}：</td>
              <td style="color:orange">¥ {{totalPrice}}</td>
            </tr>
          </table>
        </el-tab-pane>
        <!-- 配置升级 -->
        <el-tab-pane :label="$t('mxpcweb.systemset.applicationcenter.1530253271619')" name="loanOriginationFee">
          <table class="currentConfig">
            <tr>
              <!-- 当前配置 -->
              <td align="right" style="padding-right:23px;font-size:15px;">{{$t('mxpcweb.systemset.applicationcenter.1530252142814')}}</td>
              <td colspan="3"></td>
            </tr>
            <tr>
              <!-- 产品名称 -->
              <td align="right">{{$t('mxpcweb.systemset.applicationcenter.1530252179700')}}：</td>
              <td>{{oldProductForm.productName}}</td>
              <!-- 到期时间 -->
              <td align="right" style="width:150px;">{{$t('mxpcweb.systemset.applicationcenter.1530252220214')}}：</td>
              <td>{{oldProductForm.endDate}}</td>
            </tr>
            <tr>
              <!--用户许可人数：  -->
              <td align="right">{{$t('mxpcweb.systemset.applicationcenter.1530252271308')}}：</td>
              <td>
                <!-- 用户 -->
                <span style="color:#008cee">{{oldProductForm.authNum}}</span>{{$t('mxpcweb.systemset.applicationcenter.1530252357590')}}</td>
              <!-- 云空间 -->
              <td align="right">{{$t('mxpcweb.systemset.applicationcenter.1530252390189')}}：</td>
              <td>
                <span style="color:#008cee">{{oldProductForm.authNum * baseSpaceNum}}</span>G</td>
            </tr>
          </table>
          <div style="border-top:1px solid #eee;margin:10px 0 6px;"></div>
          <el-form ref="productForm" :model="productForm" label-width="80px">
            <!-- 增加用户许可人数 -->
            <el-form-item :label="$t('mxpcweb.systemset.applicationcenter.1530255428447')">
              <el-input-number size="small" v-model="productForm.addAuthNum" @change="authHandleChange" :min="0" :max="300" style="width:110px;margin-left:10px;"></el-input-number>
              <div style="margin-top:5px;line-height:16px;">
                <!-- 当前总许可数 -->
                {{$t('mxpcweb.systemset.applicationcenter.1530255525575')}}：
                <span style="color:#008cee">{{oldProductForm.authNum}}</span>
                <!-- 用户 -->{{$t('mxpcweb.systemset.applicationcenter.1530252357590')}}
                <!-- 续费后总许可数 -->{{$t('mxpcweb.systemset.applicationcenter.1530255609894')}}：
                <span style="color:#008cee">{{productForm.addAuthNum}}</span>
                <!-- 用户 -->{{$t('mxpcweb.systemset.applicationcenter.1530252357590')}}
              </div>
            </el-form-item>
            <!-- 增加云空间 -->
            <el-form-item :label="$t('mxpcweb.systemset.applicationcenter.1530255636094')">
              <el-radio-group size="small" v-model="productForm.addSpaceNum">
                <el-radio-button label="0">0GB</el-radio-button>
                <el-radio-button label="20">20GB</el-radio-button>
                <el-radio-button label="40">40GB</el-radio-button>
                <el-radio-button label="100">100GB</el-radio-button>
                <el-radio-button label="200">200GB</el-radio-button>
                <el-radio-button label="500">500GB</el-radio-button>
              </el-radio-group>
              <div style="margin-top:5px;line-height:16px;">
                <!-- 当前云空间  -->{{$t('mxpcweb.systemset.applicationcenter.1530255677590')}}：
                <span style="color:#008cee">{{oldProductForm.spaceNum}}</span>GB
                <!-- 续费后云空间 -->{{$t('mxpcweb.systemset.applicationcenter.1530255697888')}}：
                <span style="color:#008cee">{{productForm.allSpaceNum}}</span>GB
              </div>
            </el-form-item>
          </el-form>
          <div style="border-top:1px solid #eee;margin:10px 0 6px;"></div>
          <table class="currentConfig widthFull">
            <tr>
              <!-- 费用小计 -->
              <td align="right" style="width:119px;">{{$t('mxpcweb.systemset.applicationcenter.1530252828527')}}：</td>
              <td style="color:orange">
                <!-- x元 1530256955811-->
                <!-- x用户 1530256784142-->
                <!-- X天 1530256690896-->
                {{$t('mxpcweb.systemset.applicationcenter.1530256955811',[unitPrice])}}*{{$t('mxpcweb.systemset.applicationcenter.1530256784142',[productForm.addAuthNum])}}*{{$t('mxpcweb.systemset.applicationcenter.1530256690896',[productForm.spanDays])}}/{{$t('mxpcweb.systemset.applicationcenter.1530256690896',[365])}}+{{$t('mxpcweb.systemset.applicationcenter.1530256955811',[500])}}*{{productForm.addSpaceNum / 20}}={{$t('mxpcweb.systemset.applicationcenter.1530256955811',[numAndSpaceTotalPrice])}}</td>
              <td align="right" rowspan="2">
                <!--立即升级 -->
                <el-button type="primary" style="margin-top:12px; width:130px;">{{$t('mxpcweb.systemset.applicationcenter.1530257369490')}}</el-button>
              </td>
            </tr>
            <tr>
              <!-- 合计金额 -->
              <td align="right">{{$t('mxpcweb.systemset.applicationcenter.1530253228854')}}：</td>
              <td style="color:orange">¥ {{numAndSpaceTotalPrice}}</td>
            </tr>
          </table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 描述：系统设置=>应用中心=>升级配置
 * 作者：向士健
 * 时间：2017/7/8
 */
import { isObject } from '@/libs/utils.js'
import PageTitle from '@/components/PageTitle/index' // 大标题
import { mapGetters } from 'vuex'
export default {
  name: 'UpgradeProduct',
  props: {},
  data () {
    return {
      showPageFlag: false,
      activeName: 'productUpgrade',
      baseSpaceNum: 10,
      perYearPrice: 0,
      totalPrice: 0,
      numAndSpaceTotalPrice: 0,
      unitPrice: 1500,
      payType: '',
      oldProductForm: {
        productCode: 'PK0001',
        productName: this.$t('mxpcweb.systemset.applicationcenter.1530252444688'),
        yearNum: 1,
        endDate: this.$moment(new Date().setMonth(new Date().getMonth() + 12)).format(
          'YYYY-MM-DD'
        ),
        authMonth: 12,
        authNum: 5, // 授权数量
        spaceNum: 0
      },
      productForm: {
        productCode: 'PK0001',
        productName: this.$t('mxpcweb.systemset.applicationcenter.1530252444688'),
        yearNum: 1,
        endDate: '',
        authMonth: 12,
        authNum: 5, // 授权数量
        addAuthNum: 0,
        addSpaceNum: 20,
        allSpaceNum: 20,
        spanDays: 0
      },
      cId: ''
    }
  },
  created () {
    let { cId } = this.company
    this.cId = cId
    this.getAuthInfo()
  },
  computed: {
    ...mapGetters(['company'])
  },
  methods: {
    /**
     * 初始化数据计算
     */
    initData () {
      var endDate = new Date(this.oldProductForm.endDate)
      this.productForm.endDate = this.$moment(
        endDate.setMonth(endDate.getMonth() + 12)
      ).format('YYYY-MM-DD')
    },
    /**
     * 获取许可信息
     */
    getAuthInfo () {
      let _this = this
      this.$http
        .get(this.Global.baseURL + this.Global.api.v2.getAuthInfo, {
          params: { cid: _this.cId }
        })
        .then(
          function (res) {
            if (
              res.body.code.toString() == _this.Global.RES_OK &&
              isObject(res.body.data)
            ) {
              var authObj = res.body.data
              _this.oldProductForm.productName = authObj.pkname // 产品名称
              _this.oldProductForm.productCode = authObj.pkcode // 产品code
              _this.oldProductForm.endDate = this.$moment(
                authObj.expirationtime
              ).format('YYYY-MM-DD') // 到期时间
              _this.oldProductForm.authNum = authObj.authcount // 授权数量
              _this.oldProductForm.spaceNum = authObj.spacecount
              // 空间大小spacecount
              _this.oldProductForm.authMonth = authObj.monthcount // 授权月数
              _this.productForm.authNum = authObj.authcount // 授权数量
              _this.productForm.productCode = authObj.pkcode // 授权数量
              // _this.totalPrice = authObj.totalamount; //总价
              // _this.unitPrice = authObj.unitprice; //单价
              // _this.countPerYear();
              _this.initData()
            } else {
              _this.$message.error(_this.msg(res.body))
            }
          },
          function (res) {
            _this.$message.error(_this.$t(_this.Global.errorTitle))
          }
        )
    },
    /**
     * 展示界面
     */
    showPage () {
      this.showPageFlag = true
    },
    handleClick (tab, event) {
      // console.log(tab, event);
    },
    formatDate (date, fmt) {
      date = new Date(date)
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
      }
      let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
      }
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + ''
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1 ? str : this.padLeftZero(str)
          )
        }
      }
      return fmt
    },
    padLeftZero (str) {
      return ('00' + str).substr(str.length)
    },
    authHandleChange (val) { }
  },
  components: {
    'page-title': PageTitle
  },
  watch: {
    productForm: {
      handler (newValue, oldValue) {
        var endDate = new Date(this.oldProductForm.endDate)
        var dateSpan = endDate - new Date()
        /**
         *  监听套餐年限
         */
        if (newValue.yearNum == 1) {
          this.productForm.authMonth = newValue.yearNum * 12
          this.productForm.endDate = this.$moment(
            endDate.setMonth(endDate.getMonth() + 12)
          ).format('YYYY-MM-DD')
        } else if (newValue.yearNum == 2) {
          this.productForm.authMonth = newValue.yearNum * 12 + 6
          this.productForm.endDate = this.$moment(
            endDate.setMonth(endDate.getMonth() + 30)
          ).format('YYYY-MM-DD')
        } else if (newValue.yearNum == 3) {
          this.productForm.authMonth = newValue.yearNum * 12 + 12
          this.productForm.endDate = this.$moment(
            endDate.setMonth(endDate.getMonth() + 48)
          ).format('YYYY-MM-DD')
        }
        /**
         * 监听产品名称
         */
        if (newValue.productCode == 'PK0001') {
          this.productForm.productName = this.$t('mxpcweb.systemset.applicationcenter.1530252444688')
        }
        /**
         * 监听授权数量
         */
        if (newValue.authNum < 10) {
          this.unitPrice = 1500
        } else if (newValue.authNum < 20) {
          this.unitPrice = 1300
        } else if (newValue.authNum < 30) {
          this.unitPrice = 1200
        } else if (newValue.authNum < 50) {
          this.unitPrice = 1100
        } else if (newValue.authNum >= 50) {
          this.unitPrice = 1000
        }
        // 总价
        this.perYearPrice = this.unitPrice * this.oldProductForm.authNum
        if (newValue.authNum >= 10) {
          this.perYearPrice = this.perYearPrice - 200
        }
        console.log()
        this.totalPrice = this.perYearPrice * this.productForm.yearNum
        // 空间
        this.productForm.allSpaceNum =
          this.oldProductForm.spaceNum +
          this.productForm.addAuthNum * 10 +
          parseInt(this.productForm.addSpaceNum)
        // 空间和加站点，钱增加 numAndSpaceTotalPrice
        this.productForm.spanDays = Math.floor(dateSpan / (24 * 3600 * 1000))
        this.numAndSpaceTotalPrice =
          (this.unitPrice * this.productForm.addAuthNum * (this.productForm.spanDays / 365)) +
          500 * (this.productForm.addSpaceNum / 20)
        this.numAndSpaceTotalPrice = this.numAndSpaceTotalPrice.toFixed(2)
      },
      deep: true
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
