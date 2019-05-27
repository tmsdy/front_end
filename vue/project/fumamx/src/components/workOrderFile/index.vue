<template>
    <div class="workOrderFile" style="font-size:12px">
        <input type="file" id="importScollBox_excels"  @change="sendDataFile($event)"  v-show="false">
        <!-- 上传附件 -->
        <label for="importScollBox_excels" class="text-hover" style="color:#6CA2FF"><i class="iconfont icon-attachment"></i>{{$t('mxpcweb.client.1529056859354')}}</label>
        <!-- （最多上传5个附件，单个文件最大20M） -->
        <span style="color:#BCBCBC;">{{$t('mxpcweb.basecomponents.1530696799737')}}</span>
        <div>
            <div class="iconfileBox" v-for="(item,index) in files" :key="index"  :title="item.name">
                <i class="iconfile" style="font-size:40px" :class="setFileIcon(item.name)"></i>
                <el-row>
                    <el-col :span="14" class="ellipsis" style="text-align:right">{{item.name.substring(0,item.name.indexOf("."))}}</el-col>
                    <el-col :span="10" style="text-align:left">({{item.name.substring(item.name.indexOf("."))}})</el-col>
                </el-row>
                <el-progress v-show="index==files.length-1&&showProgress" :percentage="percent" :show-text="false"></el-progress>
                <span class="cancel">
                    <i class="text-hover el-icon el-icon-close" @click="files.splice(index,1);fileLists.splice(index,1)"></i>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { isHasSuffix, sendDataFile } from '@/libs/utils.js'
import { mapGetters } from 'vuex'
export default {
  name: 'workOrderFile',
  props: {
  },
  data () {
    return {
      files: [],
      fileLists: [],
      percent: 0,
      showProgress: false
    }
  },
  computed: {
    ...mapGetters([
      'domain', 'personalInfo'
    ])
  },
  methods: {
    setFileIcon (ext) { return `file-${isHasSuffix(ext.substring(ext.indexOf('.') + 1))}` },

    async sendDataFile (e) {
      let _this = this
      let filesData = e.target.files
      if (filesData[0] == '' || filesData[0] == {}) {
        return false
      };
      if (_this.queryRepeat(filesData[0])) {
        // 请不要上传重复文件！
        _this.$message(this.$t('mxpcweb.basecomponents.1530696827447'))
        return false
      };
      if (this.files.length >= 5) {
        // 文件上传个数已达上限！
        _this.$message(this.$t('mxpcweb.basecomponents.1530696854662'))
        return false
      };
      if (filesData[0].size > 20 * 1024 * 1024) {
        // 请上传20M以内的文件！
        _this.$message(this.$t('mxpcweb.basecomponents.1530696869456'))
        return false
      };
      _this.files.push(filesData[0])
      _this.percent = 0
      _this.showProgress = true
      let datas = {
        url: '/folders/files', // api（必传）
        fileSource: 3,
        billId: '',
        custId: '',
        remarks: '',
        moduleCode: 'BF001',
        fn (res) {
        }
      }
      let data = Object.assign(datas, this.getToken())
      // let data = Object.assign({
      //   "fileSource":"2",
      //   "folderId":"2",
      //   "folderPath":"/2",
      //   "billId":"",
      //   "custId":"",
      //   "remarks":"",
      //   "moduleCode":"BF001",
      //   "accessToken":""
      // },this.getToken());
      sendDataFile({
        data: data,
        files: filesData,
        fileKey: 'uploadFile',
        method: 'post',
        url: _this.domain.v2 + datas.url,
        // 传输开始事件
        onloadstart (event) {
          // _this.$message('上传中...');
        },
        // 监听上传进度事件
        onprogress (event) {
          // console.log(" 上传进度 ");
          _this.percent = event.percent
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
          if (res.code.toString() === '0') {
            _this.fileLists.push(res.data[0].fileId)
            _this.showProgress = false
          } else {
            _this.$message.error(res.msg)
          }
        },
        // loadend传输结束，不管成功失败都会被触发
        onloadend (event) {
          // console.log(' 传输结束 ');
          // console.log(event);
        }
      })
      // 取消上传
      // xhr.abort();
    },

    queryRepeat (obj) {
      if (obj == '' || obj == {}) {
        return false
      };
      let isRepeat = false
      this.files.forEach(element => {
        let repeat = true
        if (obj.name != element.name) {
          repeat = false
        };
        if (obj.lastModified != element.lastModified) {
          repeat = false
        };
        if (obj.size != element.size) {
          repeat = false
        };
        if (obj.type != element.type) {
          repeat = false
        };
        if (obj.webkitRelativePath != element.webkitRelativePath) {
          repeat = false
        };
        if (repeat) {
          isRepeat = true
        }
      })
      return isRepeat
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.workOrderFile{
    .iconfileBox{
        float: left;
        width: 80px;
        text-align: center;
        position: relative;
        padding-top: 10px;
        cursor: pointer;
        .name{
            display: inline-block;
            width: 50px;
        }
        .name1{
            display: inline-block;
            width: 30px;
        }
        .cancel{
            border: 1px solid #ccc;
            display: none;
            width: 14px;
            height: 13px;
            line-height: 12px;
            text-align: center;
            background-color: #fff;
            border-radius: 50%;
            position: absolute;
            top: -6px;
            right: 3px;
            overflow: hidden;
        }
    }
    .iconfileBox:hover .cancel{
        display: inline-block;
    }
}
</style>
