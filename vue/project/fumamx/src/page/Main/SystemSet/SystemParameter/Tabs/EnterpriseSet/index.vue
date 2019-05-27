<template>
  <div class="mainWrap EnterpriseSet" style="margin-right:0;">
    <fileupload-dialog :url="updateUrl" ref="fileuploadDialog" method="put" :closeMethod="close" :fileUploadSuccess="fileUploadSuccess"></fileupload-dialog>

    <!--  企业设置-->
    <div class="mainBody2 MXscroll" v-loading="isLoading">
      <div class="companyName">{{enterpriseForm.name}}</div>
      <ul class="set_pic clearfix">
        <li v-for="(item, index) in fileUploads" :key="index">
          <div class="set_pic_upload">
            <div class="set_select_file transition_all">
              <div>
                <i class="iconfont icon-plus-file transition_all"></i>
                <img v-if="item.picUrl" :src="item.picUrl">
                <input type="file" :accept="item.accept" :data-index="index" @change="fileChange" ref="inputFile">
              </div>
            </div>
            <div class="picDescr">
              <div class="nameUse">{{item.title}}</div>
              <!-- 推荐 -->
              <div>{{item.remindSize}}
                <em class="recomm">{{$t('mxpcweb.systemset.enterpriseset.1530340083664')}}</em>
              </div>
              <div>{{item.remindType}}</div>
              <el-button type="primary" :data-index="index" v-on:click="fileUpload(index)" v-bind:class="{disabled: item.disabled}">
                <!-- '确定上传 -->{{$t('mxpcweb.systemset.enterpriseset.1528941891351')}}</el-button>
            </div>
          </div>
        </li>
      </ul>
      <el-form :rules="rulesCompanyInfo" :model="enterpriseForm" ref="companyForm" label-width="100px" label-position="left" :inline="true" class="demo-form-inline">

        <div class="input_title">
          <!-- 地址、行业、规模 -->{{$t('mxpcweb.systemset.enterpriseset.1528941920120')}}</div>
        <div class="input_body">
          <!-- 所在国家 -->
          <el-form-item prop="countryId">
            <span class="itemLabel" slot="label">{{$t('mxpcweb.systemset.enterpriseset.1530587159795')}}</span>
            <!-- 选择国家 -->
            <el-select v-model="enterpriseForm.countryId" filterable :filter-method="filterCountryList" :placeholder="$t('mxpcweb.systemset.enterpriseset.1530587204086')" style="width:260px;" @change="countryChange">
              <el-option v-for="item in countryList" :key="item.countryId" :label="item.cnName" :value="item.countryId"></el-option>
            </el-select>
          </el-form-item>
          <div class="clearfix"></div>
          <!-- 所在地 -->
          <el-form-item prop="provinceId">
            <span class="itemLabel" slot="label">{{$t('mxpcweb.systemset.enterpriseset.1530587236698')}}</span>
            <el-col class="line" :span="8" style="width:122px;">
              <!-- 请选择省 -->
              <el-select v-model="enterpriseForm.provinceId" filterable :placeholder="$t('mxpcweb.systemset.enterpriseset.1530587262147')" @change="provinceChange">
                <el-option v-for="item in provinceList" :key="item.provinceId" :label="item.cnName" :value="item.provinceId"> </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="" prop="cityId">
            <el-col class="line" :span="8" style="width:123px;">
              <!-- 请选择市 -->
              <el-select v-model="enterpriseForm.cityId" filterable :placeholder="$t('mxpcweb.systemset.enterpriseset.1530587287836')" @change="cityChange">
                <el-option v-for="item in cityList" :key="item.cityId" :label="item.cnName" :value="item.cityId"> </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="" prop="townId">
            <el-col class="line" :span="8" style="width:125px;">
              <!-- 请选择区县 -->
              <el-select v-model="enterpriseForm.townId" filterable :placeholder="$t('mxpcweb.systemset.enterpriseset.1530587329536')">
                <el-option v-for="item in townList" :key="item.townId" :label="item.cnName" :value="item.townId"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <!-- 街道地址 -->
          <el-form-item prop="address">
            <span class="itemLabel" slot="label">{{$t('mxpcweb.systemset.enterpriseset.1530587357627')}}</span>
            <!-- 街道地址内容 -->
            <el-input v-model="enterpriseForm.address" :placeholder="$t('mxpcweb.systemset.enterpriseset.1530587382780')"></el-input>
          </el-form-item>
          <!-- 所属行业 -->
          <el-form-item prop="industrydictcode">
            <span class="itemLabel" slot="label">{{$t('mxpcweb.systemset.enterpriseset.1530587408976')}}</span>
            <!-- 请选择行业 -->
            <el-select v-model="enterpriseForm.industrydictcode" filterable :placeholder="$t('mxpcweb.systemset.enterpriseset.1530587437199')">
              <el-option v-for="item in industryList" :key="item.dictItemCode" :label="item.itemName" :value="item.dictItemCode"></el-option>
            </el-select>
          </el-form-item>
          <!-- 规模 -->
          <el-form-item prop="scale">
            <span class="itemLabel" slot="label">{{$t('mxpcweb.systemset.enterpriseset.1530587464990')}}</span>
            <!-- '请选择规模 -->
            <el-select v-model="enterpriseForm.scale" filterable :placeholder="$t('mxpcweb.systemset.enterpriseset.1530587490726')">
              <el-option v-for="item in scaleList" :key="item.dictItemCode" :label="item.itemName" :value="item.dictItemCode"></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="input_title">
          <!-- 企业负责人 -->{{$t('mxpcweb.systemset.enterpriseset.1530587531631')}}</div>
        <div class="input_body">
          <!-- 姓名 -->
          <el-form-item prop="sysAdminName">
            <span class="itemLabel" slot="label">{{$t('mxpcweb.systemset.enterpriseset.1530587554861')}}</span>
            <!-- 请填写姓名 -->
            <el-input v-model="enterpriseForm.sysAdminName" :placeholder="$t('mxpcweb.systemset.enterpriseset.1530587582502')"></el-input>
          </el-form-item>
          <!-- 称谓 -->
          <el-form-item prop="sysAdminTitle">
            <span class="itemLabel" slot="label">{{$t('mxpcweb.systemset.enterpriseset.1530587613843')}}</span>
            <!-- 填写称谓 -->
            <el-input v-model="enterpriseForm.sysAdminTitle" :placeholder="$t('mxpcweb.systemset.enterpriseset.1530587641747')"></el-input>
          </el-form-item>
          <!-- 邮箱 -->
          <el-form-item prop="sysAdminEmail">
            <span class="itemLabel" slot="label">{{$t('mxpcweb.systemset.enterpriseset.1530587674139')}}</span>
            <!-- 填写邮箱 -->
            <el-input v-model="enterpriseForm.sysAdminEmail" :placeholder="$t('mxpcweb.systemset.enterpriseset.1530587699259')"></el-input>
          </el-form-item>
          <!-- 手机 -->
          <el-form-item prop="sysAdminTel">
            <span class="itemLabel" slot="label">{{$t('mxpcweb.systemset.enterpriseset.1530587727555')}}</span>
            <!-- 填写手机 -->
            <el-input v-model="enterpriseForm.sysAdminTel" :placeholder="$t('mxpcweb.systemset.enterpriseset.1530587760267')"></el-input>
          </el-form-item>
        </div>
        <!-- 系统管理员 -->
        <div class="input_title">{{$t('mxpcweb.systemset.enterpriseset.1530587818235')}}
          <div class="line_btn">
            <!--   同企业负责人 -->
            {{$t('mxpcweb.systemset.enterpriseset.1530340164992')}}
            <el-switch on-text="" off-text="" v-model="sameCompany" @change="sameCompanyFn"></el-switch>
          </div>
        </div>
        <!-- 同企业负责人 -->
        <!--<el-form-item :label="$t('mxpcweb.systemset.enterpriseset.1530340164992')" prop="sameCompany">
                <el-switch on-text="" off-text="" v-model="sameCompany" @change="sameCompanyFn"></el-switch>
            </el-form-item>-->
        <div class="input_body">
          <!-- 姓名 -->
          <el-form-item prop="adminName">
            <span class="itemLabel" slot="label">{{$t('mxpcweb.systemset.enterpriseset.1530587554861')}}</span>
            <!--  管理员姓名-->
            <el-input v-model="enterpriseForm.adminName" :placeholder="$t('mxpcweb.systemset.enterpriseset.1530587907381')" :disabled="sameCompany"></el-input>
          </el-form-item>
          <!-- 称谓 -->
          <el-form-item prop="adminTitle">
            <span class="itemLabel" slot="label">{{$t('mxpcweb.systemset.enterpriseset.1530587613843')}}</span>
            <!-- 管理员称谓 -->
            <el-input v-model="enterpriseForm.adminTitle" :placeholder="$t('mxpcweb.systemset.enterpriseset.1530587978810')" :disabled="sameCompany"></el-input>
          </el-form-item>
          <!-- 邮箱 -->
          <el-form-item prop="adminEmail">
            <span class="itemLabel" slot="label">{{$t('mxpcweb.systemset.enterpriseset.1530587674139')}}</span>
            <!-- 管理员邮箱 -->
            <el-input v-model="enterpriseForm.adminEmail" :placeholder="$t('mxpcweb.systemset.enterpriseset.1530588050396')" :disabled="sameCompany"></el-input>
          </el-form-item>
          <!-- 手机 -->
          <el-form-item prop="adminTel">
            <span class="itemLabel" slot="label">{{$t('mxpcweb.systemset.enterpriseset.1530587727555')}}</span>
            <!-- 管理员手机 -->
            <el-input v-model="enterpriseForm.adminTel" :placeholder="$t('mxpcweb.systemset.enterpriseset.1530588113714')" :disabled="sameCompany"></el-input>
          </el-form-item>
        </div>
        <!--<el-form-item label="bb" prop="">
                <el-input v-model="enterpriseForm.adminTel" :placeholder="$t('mxpcweb.systemset.enterpriseset.1530588113714')" :disabled="sameCompany"></el-input>
            </el-form-item>-->

        <div class="input_line" style="margin-bottom:35px;">
          <el-button size="large" type="primary" @click="setCompany('companyForm')">
            <!-- 保存设置` -->{{$t('mxpcweb.systemset.enterpriseset.1530588154739')}}</el-button>
        </div>

      </el-form>
    </div>

  </div>
</template>

<script>
/**
 * 描述：系统设置=>企业设置
 * 作者：向士健
 * 时间：2017/7/5
 */
import { isObject, isArray, toPinyin } from '@/libs/utils.js'
import FileuploadDialog from '@/basecomponents/FileuploadDialog/index'
import { mapActions } from 'vuex'
export default {
  name: 'EnterpriseSet',
  props: {
  },
  data() {
    return {
      isLoading: true,
      picLimitSize: 5, // 图片大小限制
      index: '', // change 次数处理
      index2: '',
      index3: '',
      sameCompany: false,
      countryList: [],
      provinceList: [
        {
          /*  "请选择" */
          cnName: this.$t('mxpcweb.systemset.enterpriseset.1530340199224'),
          enName: '0',
          provinceId: 0
        }
      ],
      cityList: [
        {
          /*  "请选择" */
          cnName: this.$t('mxpcweb.systemset.enterpriseset.1530340199224'),
          enName: '0',
          cityId: 0
        }
      ],
      townList: [
        { /*  "请选择" */
          cnName: this.$t('mxpcweb.systemset.enterpriseset.1530340199224'),
          enName: '0',
          townId: 0
        }
      ],
      industryList: [],
      scaleList: [],
      enterpriseForm: {
        name: '',
        countryId: '',
        provinceId: '',
        cityId: '',
        townId: '',
        address: '',
        industrydictcode: '',
        scale: '',
        sysAdminName: '',
        sysAdminTitle: '',
        sysAdminEmail: '',
        sysAdminTel: '',
        adminName: '',
        adminTitle: '',
        adminEmail: '',
        adminTel: '',
        _adminName: '', // 同企业联系人，备份用
        _adminTitle: '',
        _adminEmail: '',
        _adminTel: ''
      },

      updateUrl: this.Global.uploadUrl,
      updateIndex: -1,
      fileUploads: [
        {
          /* '企业Logo图片' */
          title: this.$t('mxpcweb.systemset.enterpriseset.1530340267991'),
          picUrl: '', // 图片初始URL
          disabled: true, // 按钮状态
          imgKey: '', // 上传图片后缓存一下
          accept: 'image/png', // 上传限制
          /* 大小：260 x 100px */
          remindSize: this.$t('mxpcweb.systemset.enterpriseset.1530340306143'),
          /* '仅支持PNG背景透明格式' */
          remindType: this.$t('mxpcweb.systemset.enterpriseset.1530340332439')
        }
        // {
        //     title: '登录页背景图片',
        //     picUrl: '',
        //     disabled: true,
        //     imgKey: '',
        //     accept: 'image/png,image/jpeg,image/gif',   //上传限制
        //     remindSize: '大小(px)：1000X550 (推荐)',
        //     remindType: '仅支持PNG、JPG、GIF格式'
        // }
      ],
      // 表单验证
      rulesCompanyInfo: {
        address: [
          /* 长度不可超过50个字符 */
          { min: 0, max: 50, message: this.$t('mxpcweb.systemset.enterpriseset.1530340392630'), trigger: 'blur' }
        ],
        sysAdminName: [
          /* 请输入负责人姓名  */
          { required: true, message: this.$t('mxpcweb.systemset.enterpriseset.1530340433807'), trigger: 'blur' },
          /* 长度不可超过50个字符 */
          { min: 0, max: 50, message: this.$t('mxpcweb.systemset.enterpriseset.1530340392630'), trigger: 'blur' }
        ],
        sysAdminTitle: [
          /* 请输入负责人称谓 */
          { required: true, message: this.$t('mxpcweb.systemset.enterpriseset.1530340464398'), trigger: 'blur' },
          /* 长度不可超过50个字符 */
          { min: 0, max: 50, message: this.$t('mxpcweb.systemset.enterpriseset.1530340392630'), trigger: 'blur' }
        ],
        sysAdminEmail: [
          /*  请输入负责人邮箱 */
          { required: true, message: this.$t('mxpcweb.systemset.enterpriseset.1530340481702'), trigger: 'blur' },
          /* 请输入正确的邮箱格式 */
          { type: 'email', message: this.$t('mxpcweb.systemset.enterpriseset.1530340516018'), trigger: 'blur,change' }
        ],
        sysAdminTel: [
          /* 请输入负责人手机号 */
          { required: true, message: this.$t('mxpcweb.systemset.enterpriseset.1530340534614'), trigger: 'blur' },
          /* 长度在 11 到 12 个字符 */
          { min: 11, max: 12, message: this.$t('mxpcweb.systemset.enterpriseset.1530340557031'), trigger: 'blur' }
        ],
        adminName: [
          /* 长度不可超过50个字符 */
          { min: 0, max: 50, message: this.$t('mxpcweb.systemset.enterpriseset.1530340392630'), trigger: 'blur' }
        ],
        adminTitle: [
          /* 长度不可超过50个字符 */

          { min: 0, max: 50, message: this.$t('mxpcweb.systemset.enterpriseset.1530340392630'), trigger: 'blur' }
        ],
        adminEmail: [
          /* 请输入正确的邮箱格式 */
          { type: 'email', message: this.$t('mxpcweb.systemset.enterpriseset.1530340516018'), trigger: 'blur,change' }
        ],
        adminTel: [
          /*  长度在 11 到 12 个字符 */
          { min: 11, max: 12, message: this.$t('mxpcweb.systemset.enterpriseset.1530340557031'), trigger: 'blur' }
        ]
      },
      activeName: 'first'// 当前活动的右tab
    }
  },
  created() {
    var _this = this
    this.getEnterpriseSet() // 初始获取全部企业数据
    // 获取国家城市...
    this.getAreaInf('0', 'country', function (data) {
      if (data) {
        // data.splice(0, 0, {
        //     cnName: "请选择",
        //     enName: "0",
        //     countryId: 0
        // });
        _this.countryList = _this.countryList2 = toPinyin(data, { usekey: 'cnName' })
      }
    })
  },
  methods: {
    // 初始获取全部企业数据
    getEnterpriseSet() {
      let _this = this
      let url = this.Global.baseURL + this.Global.api.SystemSet.enterpriseset.enterpriseInf
      this.$http.get(url, { params: {} }).then(function (res) {
        // console.log(res);
        if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data) && isObject(res.body.data.companyInfo)) {
          this.isLoading = false
          var companyInfo = res.body.data.companyInfo
          // console.log(companyInfo);
          // 赋值给已有字段
          _this.enterpriseForm.name = companyInfo.name
          _this.enterpriseForm.countryId = parseInt(companyInfo.countryId) == 0 ? '' : parseInt(companyInfo.countryId)
          _this.enterpriseForm.provinceId = companyInfo.provinceId
          _this.enterpriseForm.cityId = companyInfo.cityId
          _this.enterpriseForm.townId = companyInfo.townId
          _this.enterpriseForm.address = companyInfo.address
          if (companyInfo.industrydictcode != '') {
            _this.enterpriseForm.industrydictcode = parseInt(companyInfo.industrydictcode)
          }
          if (companyInfo.scale != '') {
            _this.enterpriseForm.scale = parseInt(companyInfo.scale)
          }
          _this.enterpriseForm.sysAdminName = companyInfo.sysAdminName
          _this.enterpriseForm.sysAdminTitle = companyInfo.sysAdminTitle
          _this.enterpriseForm.sysAdminEmail = companyInfo.sysAdminEmail
          _this.enterpriseForm.sysAdminTel = companyInfo.sysAdminTel

          _this.enterpriseForm.adminName = companyInfo.adminName
          _this.enterpriseForm.adminTitle = companyInfo.adminTitle
          _this.enterpriseForm.adminEmail = companyInfo.adminEmail
          _this.enterpriseForm.adminTel = companyInfo.adminTel
          // 负责人与管理员一致时，高亮开关
          if (companyInfo.adminName == companyInfo.sysAdminName && companyInfo.sysAdminTitle == companyInfo.adminTitle && companyInfo.sysAdminEmail == companyInfo.adminEmail && companyInfo.sysAdminTel == companyInfo.adminTel) {
            _this.sameCompany = true
          }
          // 同企业负责人，备份，用于开关切换
          _this.enterpriseForm._adminName = companyInfo.adminName
          _this.enterpriseForm._adminTitle = companyInfo.adminTitle
          _this.enterpriseForm._adminEmail = companyInfo.adminEmail
          _this.enterpriseForm._adminTel = companyInfo.adminTel

          _this.industryList = res.body.data.industryRes // 所有行业
          _this.scaleList = res.body.data.scaleRes // 所有规模

          // 图片url
          let logoUrl = companyInfo.logoUrl
          let loginPicUrl = companyInfo.loginFormImage
          if (logoUrl != '') {
            _this.fileUploads[0].picUrl = this.getGlobalImgSrc(logoUrl, '360x200')
          }
          if (loginPicUrl != '') {
            // _this.fileUploads[1].picUrl = ... + loginPicUrl + "/360.200";
          }

          _this.picLimitSize = companyInfo.photoSize // 图片限制大小
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    // 选了国家
    countryChange() {
      var _this = this
      var countryId = this.enterpriseForm.countryId
      // 得到省
      if (countryId !== '' && countryId !== 0) {
        this.getAreaInf(countryId, 'province', function (data) {
          data.splice(0, 0, {
            /* 请选择 */
            cnName: _this.$t('mxpcweb.systemset.enterpriseset.1530340199224'),
            enName: '0',
            provinceId: 0
          })
          _this.provinceList = data
        })
      }
      // 国家后面值，连动处理
      this.index++
      if (this.index > 1) {
        this.enterpriseForm.provinceId = 0
        this.enterpriseForm.cityId = 0
        this.enterpriseForm.townId = 0
        this.provinceList = ''
        this.cityList = ''
        this.townList = ''
      }
    },
    // 选了省
    provinceChange() {
      var _this = this
      var provinceId = this.enterpriseForm.provinceId
      // 得到市
      if (provinceId !== '' && provinceId !== 0) {
        this.getAreaInf(provinceId, 'city', function (data) {
          data.splice(0, 0, {
            /* 请选择 */
            cnName: _this.$t('mxpcweb.systemset.enterpriseset.1530340199224'),
            enName: '0',
            provinceId: 0
          })
          _this.cityList = data
        })
      }
      // 省后面值，连动处理
      this.index2++
      if (this.index2 > 1) {
        this.enterpriseForm.cityId = 0
        this.enterpriseForm.townId = 0
        this.cityList = ''
        this.townList = ''
      }
    },
    // 选了市
    cityChange() {
      var _this = this
      var cityId = this.enterpriseForm.cityId
      // 得到镇
      if (cityId !== '' && cityId !== 0) {
        this.getAreaInf(cityId, 'town', function (data) {
          data.splice(0, 0, {
            /* 请选择 */
            cnName: _this.$t('mxpcweb.systemset.enterpriseset.1530340199224'),
            enName: '0',
            townId: 0
          })
          _this.townList = data
        })
      }
      // 市后面值，连动处理
      this.index3++
      if (this.index3 > 1) {
        this.enterpriseForm.townId = 0
        this.townList = ''
      }
    },
    // 获取国家城市...，回调用
    getAreaInf(id, type, fn) {
      let _this = this
      let url = this.Global.baseURL + this.Global.api.SystemSet.enterpriseset.areaInf
      this.$http.get(url, { params: { id: id, type: type } }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK && Object.prototype.toString.call(res.body.data) == '[object Array]') {
          fn(res.body.data)
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    // 表单提交，企业设置
    setCompany(formNameRef) {
      let _this = this
      this.$refs[formNameRef].validate((valid) => { // 验证表单
        if (valid) {
          // 企业名字禁止空：
          if (_this.enterpriseForm.name == '') {
            /*  "企业名称不能为空，请联系系统管理员！" */
            _this.$message.error(this.$t('mxpcweb.systemset.enterpriseset.1530340724026')); return
          }
          let url = this.Global.baseURL + this.Global.api.SystemSet.enterpriseset.saveEnterpriseInf
          this.$http.post(url, _this.enterpriseForm).then(function (res) {
            if (res.body.code.toString() == _this.Global.RES_OK) {
              var backCode = res.body.data.companyPutRes.code
              var backMsg = res.body.data.companyPutRes.msg
              if (backCode.toString() == _this.Global.RES_OK) {
                /*  提交成功 */
                _this.$message.success(this.$t('mxpcweb.systemset.enterpriseset.1530340757655'))
              } else {
                _this.$message.error(backMsg)
              }
            } else {
              _this.$message.error(_this.msg(res.body))
            }
          }, function (res) {
            _this.$message.error(_this.$t(_this.Global.errorTitle))
          })
        } else {
          /*  请检查输入是否有误！ */
          this.$message(this.$t('mxpcweb.systemset.enterpriseset.1530340782735')); return false
        }
      })
    },
    // 文件上传部分
    fileChange(event) {
      // console.log("有文件添加或更新");
      let _this = this
      let index = parseInt(event.target.getAttribute('data-index'))

      let files = event.currentTarget.files
      let fileSize = files[0].size
      let fileSize_M = (fileSize / 1048576).toFixed(2) // 转成M，并保存2位小数

      let picLimitSize = this.picLimitSize
      // console.log(files)
      // 限制上传大小
      if (fileSize_M < picLimitSize) {
        let reader = new FileReader()// 文件预览对象
        reader.readAsDataURL(files[0])// 设置要预览的文件
        reader.onload = function (event) { // 监听文件加载完成事件
          // 图片尺寸检测
          let imgObj = document.createElement('img')
          imgObj.src = event.target.result
          imgObj.onload = function (e) {
            let width = this.width
            let height = this.height

            // _this.fileUploads[index].picUrl = event.target.result;
            // _this.fileUploads[index].disabled = false;//上传按钮处理

            if (width < 260) {
              /* 图片宽度不能低于260PX */
              _this.$message.warning(this.$t('mxpcweb.systemset.enterpriseset.1530340966304', [260]))
              return
            } else {
              _this.fileUploads[index].picUrl = event.target.result
              _this.fileUploads[index].disabled = false// 上传按钮处理
            }
            if (height < 100) {
              /*  图片高度不能低于100PX */
              _this.$message.warning(this.$t('mxpcweb.systemset.enterpriseset.1530341021991', [100]))
            } else {
              _this.fileUploads[index].picUrl = event.target.result
              _this.fileUploads[index].disabled = false// 上传按钮处理
            }
          }
        }
      } else {
        /* "超过" + picLimitSize + "M的不能上传" */
        this.$message.warning(this.$t('mxpcweb.systemset.enterpriseset.1530341068880', [picLimitSize]))
        event.currentTarget.value = '' // 清空
      }
    },
    close() {
      // console.log("关闭上传进度对话框");
    },
    fileUploadSuccess(res) {
      // console.log(res)
      if (res.code == 0) {
        let _this = this
        let urlApi = this.Global.baseURL + this.Global.api.SystemSet.enterpriseset.saveEnterpriseInf
        var arrPic = ''
        switch (this.updateIndex) {
          case 0:
            arrPic = {
              'logoUrl': res.data
            }
            break
          case 1:
            arrPic = {
              'loginformimage': res.data
            }
            break
        }
        this.$http.post(urlApi, arrPic).then(function (res) {
          // console.log(res.body.data.companysettingUpdateRes)
          let data = res.body.data.companysettingUpdateRes
          var backCode = data.code
          var backMsg = data.msg
          if (backCode == '-1') {
            _this.$message.error(backMsg)
          } else {
            _this.setCompanyConfigInfo({ _this: _this })// 设置企业配置信息
            /* 上传成功 */
            _this.$message.success(this.$t('mxpcweb.systemset.enterpriseset.1530341140943'))
            if (_this.updateIndex == 0) { // 头像
              _this.fileUploads['0'].picUrl = this.getGlobalImgSrc(data.data.logoUrl, '360x200')
            } else { // 背景
              // _this.fileUploads['1'].picUrl = ... + data.data.loginFormImage + "/360.200";
            }
          }
        }, function (res) {
          _this.$message.error(_this.$t(_this.Global.errorTitle))
        })
      } else {
        this.$message.error(res.msg)
      }
    },
    fileUpload(index) {
      this.updateIndex = index
      let files = this.$refs.inputFile[index].files
      let fileuploadDialog = this.$refs.fileuploadDialog
      if (files.length > 0) {
        fileuploadDialog.upload(this.$refs.inputFile[index])
        this.fileUploads[index].disabled = true// 上传按钮处理
      } else {
        /* 未选择任何文件  */
        this.$message(this.$t('mxpcweb.systemset.enterpriseset.1530341190837'))
      }
    },
    // 同企业负责人
    sameCompanyFn(back) {
      if (back == true) {
        this.enterpriseForm.adminName = this.enterpriseForm.sysAdminName
        this.enterpriseForm.adminTitle = this.enterpriseForm.sysAdminTitle
        this.enterpriseForm.adminEmail = this.enterpriseForm.sysAdminEmail
        this.enterpriseForm.adminTel = this.enterpriseForm.sysAdminTel
      } else {
        this.enterpriseForm.adminName = this.enterpriseForm._adminName
        this.enterpriseForm.adminTitle = this.enterpriseForm._adminTitle
        this.enterpriseForm.adminEmail = this.enterpriseForm._adminEmail
        this.enterpriseForm.adminTel = this.enterpriseForm._adminTel
      }
    },
    filterCountryList(val) {
      if (!isArray(this.countryList2)) { return }
      this.countryList = this.countryList2.filter(element => {
        return element.alias.indexOf(val) > -1
      })
    },
    ...mapActions([
      'setCompanyConfigInfo' // 映射 this.increment() 为 this.$store.dispatch('increment')
    ])
  },
  components: {
    'fileupload-dialog': FileuploadDialog
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
