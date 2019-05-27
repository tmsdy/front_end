<template>
  <div class="UploadDownload">

    <div class="icon transition_all" @click="showMenuBody()" :class="isActive ? 'iconActive' : ''">
      <i class="iconfont icon-record" :class="uploading ? 'el-icon-loading' : ''"></i>
    </div>

    <transition name="fade">
      <div class="sliderBg" v-if="isActive" @click="isActive=false"></div>
    </transition>

    <transition name="slider-customer">
      <div class="sliderBody" v-if="isActive">

        <!-- 标题 -->
        <div class="title">
          <!--任务-->
          {{$t('mxpcweb.systemset.groupstructure.1529407009590')}}
          <span class="pull-right text-hover">
            <i class="iconfont icon-close" @click="isActive=false"></i>
          </span>
        </div>

        <!-- 操作 -->
        <ul class="tabs">
          <li v-for="(item,index) in tabsData" :key="index" :class="tabIndex === index ? 'active' : ''" @click="tabIndex = index;getTableData()"><span>{{item}}</span></li>
        </ul>
        <!-- 表头 -->
        <div class="titleList">
          <span class="fileName">
            <!--文件-->
            {{$t('mxpcweb.components.1530840153629')}}
          </span>
          <span class="action">
            <!--操作-->
            {{$t('mxpcweb.systemset.logaction.1530345579674')}}
          </span>
          <span class="startTime">
          <!--开始时间-->
          {{$t('mxpcweb.components.1530840426897')}}
          </span>
          <span class="status">
            <!--状态-->
            {{$t('mxpcweb.systemset.applicationcenter.1530259404792')}}
          </span>
        </div>
        <!-- 表格 -->
        <ul class="tableList MXscroll" v-loading="firstInto">
          <!-- 队列中的文件 -->
          <template v-if="uploadingData.length>0">
            <!--<li class="list">
                  <div class="fileName ellipsis">aaaaa</div>
                  <div class="action">上传文件</div>
                  <div class="startTime">---</div>
                  <div class="status">
                    <loading class="loadingPic" title=""></loading>
                    正在上传...
                  </div>
                </li>-->
            <li class="list" v-for="(item,index) in uploadingData" :key="index">
              <div class="fileName ellipsis">{{item.name}}</div>
              <div class="action">
                <!--上传文件中-->
                {{$t('mxpcweb.components.1530840908949')}}
              </div>
              <div class="startTime">{{nowData}}</div>
              <div class="status">
                <loading :size="{width:'16px',height:'16px'}" class="loadingPic" title=""></loading>
                <!--正在上传-->
                {{$t('mxpcweb.client.1529049246657')}}
              </div>
            </li>
          </template>

          <template v-if="tableData.length>0">
            <li class="list" v-for="(item,index) in tableData" :key="index">
              <div class="fileName ellipsis" :title="item.taskName">{{ item.taskName }}</div>
              <div class="action" :title="item.moduleName">{{item.moduleName}} - {{item.optName}}</div>
              <div class="startTime">{{noSecond(item.startDate)}}</div>
              <div v-if="item.optCode=='otImport'" class="status">
                <span class="text-blue statusContent" v-if="item.taskState=='1'">
                  <loading class="loadingPic" :size="{width:'16px',height:'16px'}" title=""></loading>
                  {{$t('mxpcweb.components.1530840503931')}}...
                </span>
                <span style="color:#A0CD62" class="statusContent" v-if="item.taskState=='2'">
                  <!--导入完成-->
                  {{$t('mxpcweb.components.1530840558054')}}
                </span>
                <span style="color:#d0021b" class="statusContent" v-if="item.taskState=='3'">
                  <!--导入失败-->
                  {{$t('mxpcweb.components.1533618926342')}}
                </span>
                <span style="font-size:12px;color:#999;" v-if="item.details!=''">
                  <!-- errorMsg 没有就展示多少条，有就显示错误信息 -->
                  <template v-if="JSON.parse(item.details).errorMsg">{{JSON.parse(item.details).errorMsg}}</template>
                  <template v-else>
                    <!--共-->
                    {{$t('mxpcweb.components.1530795856012')}}
                    {{JSON.parse(item.details).totalNum}}
                    <!--条成功-->
                    {{$t('mxpcweb.components.1530840697167')}}
                    <span style="color:#A0CD62">{{JSON.parse(item.details).successNum}}</span>
                    <!--条失败-->
                    {{$t('mxpcweb.components.1530840731212')}}
                    <span class="text-red">{{JSON.parse(item.details).failNum}}</span>
                    <!--条-->
                    {{$t('mxpcweb.client.1529050859097')}}
                  </template>
                </span>
                <i class="iconfont icon-download text-hover" v-if="item.details!=''" @click="downloading(JSON.parse(item.details).resultFile)" style="position: absolute;right: 20px;color:#BABABA"></i>
              </div>
              <div v-else class="status">

                <!-- 模块不同，这里展示的功能也不同 -->
                <template v-if="item.moduleCode == 'AM004'">
                  <span class="statusContent" style="color:#A0CD62">{{$t('mxpcweb.basecomponents.1530756745993')}}{{item.taskStateName}}</span>
                  <span class="statusDescr">{{$t('mxpcweb.basecomponents.1530756745993')}}{{item.taskStateName}}{{$t('mxpcweb.components.1530840839238')}}{{item.moduleName}}</span>
                  <span class="text-hover" style="position: absolute;right: 20px;color:#BABABA" @click="downloadFile(item.details)">
                    <i class="iconfont icon-download-u"></i>
                  </span>
                </template>

                <template v-if="item.moduleCode == 'DC001' || item.moduleCode == 'DC002' || item.moduleCode == 'BF001'">
                  <span class="statusContent" style="color:#A0CD62">
                    {{JSON.parse(item.details).resultMsg}}
                  </span>
                  <span class="statusDescr">
                    {{JSON.parse(item.details).resultMsg}}{{$t(item.optCode === 'otDownload' ? 'mxpcweb.components.1544176671030' : 'mxpcweb.components.1530840839238')}}{{item.moduleName}}</span>
                  <span class="text-hover" v-if="item.optCode!='otDownload'" @click="openFiles(item.optCode,item.moduleCode,item.billId)" style="position: absolute;right: 20px;color:#BABABA">
                    <i class="iconfont icon-folder-close"></i>
                  </span>
                </template>

              </div>
            </li>
          </template>
          <no-data v-if="tableData.length===0 && uploadingData.length===0" :title="$t('mxpcweb.client.detail.1529993941794')"></no-data>
        </ul>

        <!-- 分页 -->
        <div class="recordPage">
          <el-pagination v-if="total > pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 15, 20, 25, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>

        <!--<div style="width:50px;height:50px;border:1px solid red;position:absolute;left:50%;bottom:50px;" @click="test">
              test button
            </div>-->
      </div>
    </transition>
    <input type="file" ref="openSelectFile" class="hidden" name="" @change="sendDataFile($event)" @click="inputFileClick" multiple />
  </div>
</template>

<script>
import { isObject, sendDataFile } from '@/libs/utils.js'
import { mapGetters } from 'vuex'
import NoData from '@/basecomponents/NoData/index'
import Loading from '@/basecomponents/Loading/index'

export default {
  name: 'UploadDownload',
  data () {
    return {
      limitSize: 600, // 限制文件大小，单位：M
      isActive: false, // 打开抽屉
      uploading: false, // 上传中
      tabsData: [this.$t('mxpcweb.components.1531217858118'), this.$t('mxpcweb.components.1530841355665')], // 今天  历史记录
      tabIndex: 0,
      tableData: [],
      option: {},
      // 分页
      type: 'all',
      total: 0,
      pageSize: 10,
      currentPage: 1,
      from: 0,
      // 进度队列文件
      uploadingData: [],
      firstInto: true,
      nowData: ''
    }
  },
  created () {
    let _this = this
    // 执行监听
    ep.tail('selectFile', function (_option) {
      _this.option = _option
      try {
        _this.$refs.openSelectFile.click()
      } catch (err) {
        console.log('openSelectFile:' + err)
      }
    })
    // 执行监听
    ep.tail('openUpload', function (isActive) {
      _this.getTableData()
      _this.isActive = isActive
    })
  },
  computed: {
    ...mapGetters(['domain'])
  },
  methods: {
    showMenuBody () {
      this.isActive = !this.isActive
      this.currentPage = 1
      this.tabIndex = 0
      this.getTableData()
      // 点击其他隐藏
      document.addEventListener('click', (e) => {
        if (!this.$el.contains(e.target)) this.isActive = false
      })
    },
    // test() {
    //   let _this = this;
    //   let data = {
    //     url: '/folders/files',//api（必传）
    //     fileSource: 3,
    //     billId: '1801729',
    //     custId: '1801729',
    //     remarks: '',
    //     moduleCode: this.moduleCode,
    //     fn(res) {

    //     }
    //   }
    //   ep.emit('selectFile', data);//相当于触发标记
    // },
    downloading (url) {
      window.location.href = url
    },
    inputFileClick (e) {
      this.$refs.openSelectFile.value = ''// 清空
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getTableData()// 获取数据
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val
      this.from = (this.currentPage - 1) * this.pageSize
      this.getTableData()// 获取数据
    },
    openFiles (optCode, moduleCode, billId) {
      let _this = this
      if (optCode != 'otDownload') {
        this.isActive = false
        if (moduleCode == 'DC001') {
          this.$router.push('/main/document/knowledgebase')
        } else if (moduleCode == 'DC002') {
          this.$router.push('/main/document/my')
        } else if (moduleCode == 'BF001') {
          if (billId && billId != '') {
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.document_generalOperate_get, {
              params: {
                moduleCode: 'BF001',
                identFieldValue: billId,
                searchType: 'detail'
              }
            }).then(function (res) {
              if (res.body.code.toString() == _this.Global.RES_OK) {
                let item = res.body.data
                item.moduleCode = 'BF001'
                item.billId = item.custId
                this.clientDetailPage(item)
              } else {
                _this.$message.error(_this.msg(res.body))
              }
            }, function (res) {
              _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
          } else {
            this.$router.push('/main/client/tabs/list/BF001')
          }
        }
      }
    },
    noSecond (date) {
      return this.$m_formulateTime(date, { format: 'YYYY-MM-DD' })
    },
    async sendDataFile (e) {
      let _this = this
      let data = Object.assign(_this.option, this.getToken())

      let filesData = e.target.files
      // console.log('filesData')
      // console.log(filesData)
      // 检测文件大小及名称长度限制，并复制一份待用
      let newFiles = []
      for (var i = 0; i < filesData.length; i++) {
        let fileSize_M = (filesData[i].size / 1048576).toFixed(2) // 转成M，并保存2位小数
        if (fileSize_M > this.limitSize) {
          this.$message.warning(_this.$t('mxpcweb.basecomponents.1530758929475') + this.limitSize + _this.$t('mxpcweb.components.1530841118076'))
          return
        }
        // 文件名过长
        if (filesData[i].name.length > 90) {
          this.$message.warning('文件名过长，不可多于90字节，请重命名过长的文件名！')
          return
        }

        newFiles.push(filesData[i])
      }

      sendDataFile({
        data: data,
        files: newFiles,
        fileKey: 'uploadFile',
        method: 'post',
        url: _this.Global.baseURL + _this.option.url,
        // 传输开始事件
        onloadstart (event) {
          _this.$message(_this.$t('mxpcweb.client.1529048996939'))
          _this.uploadingData = newFiles
          _this.uploading = true
          _this.nowData = _this.getNowFormatDate()// 刷一下当前时间
        },
        // 监听上传进度事件
        onprogress (event) {
          // console.log(" 上传进度 ");
          // console.log(event);
        },
        // 过程发生错误事件
        onerror (event) {
          // console.log(event);
        },
        // 被取消
        onabort (event) {
          // console.log(' 被取消 ');
          // console.log(event);
        },
        // 文件上传成功
        onload (res) {
          // console.log(' 成功是否，结果返回如下 ');
          // console.log(res);
          _this.option.fn(res)
          _this.getTableData()
          if (res.code.toString() === '0') {
            _this.$message.success(res.msg)
          } else {
            _this.$message.error(res.msg)
          }
        },
        // loadend传输结束，不管成功失败都会被触发
        onloadend (event) {
          // console.log(' 传输结束 ');
          // console.log(event);
          _this.uploading = false
          _this.uploadingData = []
          _this.getTableData()// 刷新
        }
      })
      // 取消上传
      // xhr.abort();
    },
    getTableData () {
      let _this = this
      let newTime = _this.$m_unifiedTime(new Date())
      newTime = newTime.substring(0, 10) + ' 00:00:00'
      let data = {
        // rangeType: this.tabIndex + 1,//参数修改。暂时去掉
        pageN: this.currentPage,
        pageSize: this.pageSize,
        sort: 'createDate',
        order: 'DESC'
      }
      if (this.tabIndex.toString() == '1') {
        data.createDate_gt = newTime
      } else {
        data.createDate_lt = newTime
      }
      _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.folders_fileTask, { params: data }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data)) {
          // console.log(res.body.data)
          _this.tableData = res.body.data.list
          _this.total = res.body.data.totalNum
          if (this.firstInto) {
            this.firstInto = false
          }
        } else {
          _this.$message.error(_this.msg(res.body))
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    getNowFormatDate () {
      var date = new Date()
      var seperator2 = ':'
      var currentdate = this.$t('mxpcweb.components.1531217858118') + date.getHours() + seperator2 + date.getMinutes()
      return currentdate
    }
  },
  components: {
    'loading': Loading,
    'no-data': NoData
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
