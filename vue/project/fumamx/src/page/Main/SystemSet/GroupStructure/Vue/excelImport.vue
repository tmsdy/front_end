<template>
    <div class="excelImport">
        <fileupload-dialog :url="url" format=".csv" method="post" ref="fileuploadDialog" :fileUploadSuccess="fileUploadSuccess"></fileupload-dialog>
        <br/>
        <input id="file" ref="file" type="file" style="visibility:hidden;position: absolute;">
        <el-row class="row">
            <el-col :span="1">
                <span class="switchFile">{{$t('mxpcweb.systemset.groupstructure.1529406706983')}}</span>
            </el-col>
            <el-col :span="21">
                <label for="file" class="el-button el-button--default">
                    <span>{{$t('mxpcweb.systemset.groupstructure.1529406740388')}}</span>
                </label>
                {{fileName}}
            </el-col>
        </el-row>
        <el-row class="row">
            <el-col :span="1">
                <span class="switchFile">&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </el-col>
            <el-col :span="21">
                <el-button type="primary" @click="startImport()">{{$t('mxpcweb.systemset.groupstructure.1529406813552')}}</el-button>
            </el-col>
        </el-row>
        <el-row class="row">
            <el-col :span="24">{{$t('mxpcweb.systemset.groupstructure.1529406842806')}}</el-col>
            <el-col :span="24">{{$t('mxpcweb.systemset.groupstructure.1529406869153')}}</el-col>
            <el-col :span="24">{{$t('mxpcweb.systemset.groupstructure.1529406920977')}}
                <a href="/file/员工资料导入格式.csv">{{$t('mxpcweb.systemset.groupstructure.1529406961624')}}</a>》</el-col>
            <el-col :span="24">{{$t('mxpcweb.systemset.groupstructure.1529406985089')}}</el-col>
        </el-row>
        <el-table :data="logData" border style="width: 100%">
            <el-table-column prop="taskName" :label="$t('mxpcweb.systemset.groupstructure.1529407009590')">
            </el-table-column>
            <el-table-column prop="completeTime" :label="$t('mxpcweb.systemset.groupstructure.1529407024358')">
            </el-table-column>
            <el-table-column prop="inTime" :label="$t('mxpcweb.systemset.groupstructure.1529407051139')">
            </el-table-column>
            <el-table-column prop="results" :label="$t('mxpcweb.systemset.groupstructure.1529407065050')">
            </el-table-column>
            <el-table-column prop="static" :label="$t('mxpcweb.systemset.groupstructure.1529407089923')">
            </el-table-column>
            <el-table-column :label="$t('mxpcweb.systemset.groupstructure.1529407108274')">
                <template slot-scope="scope">
                    <el-button @click="deleteRow(scope.$index, scope.row)" type="text" size="small">{{$t('mxpcweb.systemset.groupstructure.1529407128241')}}</el-button>
                    <a class="download" :href="createFileUrl+'?'+queryString(scope.row.resultsDetail)">{{$t('mxpcweb.systemset.groupstructure.1529407145690')}}</a>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { getSuffix, isObject, isArray } from '@/libs/utils.js'
import FileuploadDialog from '@/basecomponents/FileuploadDialog/index.vue'
export default {
  name: 'excelImport',
  props: {

  },
  data () {
    return {
      fileName: '', // 文件名称
      logData: []
    }
  },
  created () {
    // 解析csv文件地址
    this.url = this.Global.baseURL + this.Global.api.UniversalInterface.csvjson
    this.createFileUrl = this.Global.baseURL + this.Global.api.SystemSet.groupstructure.downloadResults
    this.getTableList()
  },
  mounted () {

  },
  methods: {
    startImport () {
      let _this = this
      let file = this.$refs.file
      if (getSuffix(file.files[0].name) != 'csv') {
        _this.$message(this.$t('mxpcweb.systemset.groupstructure.1529407178940'))
        return
      }
      // 上传文件
      this.$refs.fileuploadDialog.upload(file)
    },
    // 文件上传成功后的回调
    fileUploadSuccess (res) {
      let _this = this
      if (res.code.toString() == _this.Global.RES_OK) {
        // api
        let data = {
          sourceFileName: res.data.fileInfo.name,
          csvArrayData: res.data.csvArrayData
        }
        _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.groupstructure.accountlist, data).then(function (res) {
          if (res.body.code.toString() == _this.Global.RES_OK) {
            _this.$message.success(_this.msg(res.body))
            // 调用获取日志方法
            _this.getTableList()
          } else {
            _this.$message.error(_this.msg(res.body))
          }
        }, function (res) {
          _this.$message.error(_this.$t(_this.Global.errorTitle))
        })
      } else {
        _this.$message.error(_this.$t('mxpcweb.systemset.groupstructure.1529407530681'))
      }
    },
    handleClick () {},
    // 获取表格数据
    getTableList () {
      let _this = this
      _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.groupstructure.operateLogQuery, { params: { type: 'accountsImport' } }).then(function (res) {
        if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data) && isArray(res.body.data.operateList)) {
          let operateList = res.body.data.operateList
          operateList.forEach(function (element) {
            if (element.code == '0') {
              element.static = this.$t('mxpcweb.systemset.groupstructure.1529407633537')
            } else {
              element.static = this.$t('mxpcweb.systemset.groupstructure.1529407647572')
            }
          }, this)
          _this.logData = operateList
        }
      }, function (res) {
        _this.$message.error(_this.$t(_this.Global.errorTitle))
      })
    },
    deleteRow (index, row) {},
    downloadRes (index, row) {},
    queryString (object) {
      return 'data=' + encodeURIComponent(JSON.stringify(object))
    }
  },
  components: {
    'fileupload-dialog': FileuploadDialog
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.excelImport{
    .row{
        padding: 5px 0px;
    }
}
</style>
