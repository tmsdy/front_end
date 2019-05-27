<template>
    <div class="FileuploadDialog" v-if="isShow">
    <!-- <div class="FileuploadDialog"> -->
        <div class="close" v-on:click="close"><i class="iconfont icon-close"></i></div>
        <ul class="FileItemBox">
            <li class="item" v-for="(item,index) in files" :key="index">
                <div class="title">{{item.name}}</div>
                <div class="percent">
                    <div class="percentBox">
                        <div class="progressBar" ref="progressBar"></div>
                    </div>
                </div>
                <div class="scheduleValue" ref="scheduleValue">0%</div>
            </li>
        </ul>
    </div>
</template>

<script>
import fileUpload from '@/libs/fileUpload'
// 二进制文件转Blob
function dataURLtoBlob (dataurl) {
  var arr = dataurl.split(',')
  var mime = arr[0].match(/:(.*?);/)[1]
  var bstr = atob(arr[1])
  var n = bstr.length
  var u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}
export default {
  name: 'FileuploadDialog',
  props: {
    url: {
      type: String,
      required: true
    },
    formName: {
      type: String,
      default: 'fileToUpload'
    },
    format: {
      type: String,
      default: ''
    },
    method: {
      type: String,
      default: 'PUT'
    },
    isShowDialog: {
      type: Boolean,
      default: false
    },
    closeMethod: {
      type: Function,
      default: function () {
        console.log('"closeMethod"')
      }
    },
    fileUploadSuccess: {
      type: Function,
      default: function (res) {
        // console.log(res);
      }
    },
    fileUploadError: {
      type: Function,
      default: function (res) {
        // console.log(res);
      }
    },
    startUpload: {
      type: Function,
      default: function (event) {
        // console.log(event);
      }
    },
    maxNum: {
      type: Number,
      default: 20
    }
  },
  data () {
    return {
      isShow: this.isShowDialog,
      files: [],
      fileIndex: 0
    }
  },
  mounted() {
    document.body.appendChild(this.$el)
  },
  methods: {
    upload (inputElement, autoFiles) {
      let files = []
      if (autoFiles) {
        files = autoFiles
      } else {
        console.log(' --- ')
        console.log(inputElement)
        console.log(inputElement.files)
        if (Array.isArray(inputElement)) { // [file] 直接是文件数组
          inputElement.forEach(function (element) {
            // 解决图片name丢失问题
            console.log(element)
            files.push(dataURLtoBlob(element))
          }, this)
        } else { // 是input type="file"
          files = inputElement.files
        }
      }

      // 允许上传文件后缀
      var format = []
      if (this.format !== '') {
        format = this.format.split(',')
      }

      // 说明需要过滤,过滤出允许上传的文件
      if (format.length > 0) {
        var newfiles = []
        for (var i = 0; i < files.length; i++) {
          var suffix = '.' + files[i].name.split('.').pop().toLowerCase()
          if (format.indexOf(suffix)) {
            newfiles.push(files[i])
          }
        }
        files = newfiles
      }

      if (files && files.length > 0) {
        if (files.length > this.maxNum) {
          this.$message('选择数量超过最大限制数量,目前还可上传' + this.maxNum + '张，请重新选择！')
          this.fileUploadError()
          return false
        } else {
          this.isShow = true
          this.files = files
        }
      } else {
        this.fileUploadError()
        return
      }

      var _this = this
      this.Upload = fileUpload({
        method: _this.method,
        url: _this.url,
        FileList: files,
        formName: _this.formName,
        onprogress: function (event) { // 上传进度
          _this.$refs.progressBar[_this.fileIndex].style.width = event.percent + '%'
          _this.$refs.scheduleValue[_this.fileIndex].innerHTML = event.percent + '%'
        },
        onloadstart: function (event) { // 开始上传
          _this.startUpload(event)
        },
        onload: function (res) { // 上传成功
          _this.fileUploadSuccess(res)
          _this.fileIndex++
          // console.log(_this.fileIndex)
          if (_this.fileIndex === files.length) {
            // console.log("ok")
            _this.close()
            if (!Array.isArray(inputElement) && !autoFiles) {
              inputElement.value = ''
            }
          }
        },
        onerror: function (event) { // 出错
          _this.fileUploadError()
          console.log('onerror', event)
        },
        onabort: function (event) { // 取消上传
          // console.log("取消上传",event);
        },
        onloadend: function (event) { // 不管成功还是失败都执行
          // console.log("不管成功还是失败都执行",event);
        }
      })
      // Upload.abort();
    },
    close () {
      this.isShow = false
      this.fileIndex = 0
      this.Upload.abort()
      this.closeMethod()
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.FileuploadDialog {
    width: 600px;
    height: auto;
    background-color: #fff;
    position: fixed;
    z-index: 9999999;
    left: 50%;
    top: 5%;
    margin-left: -300px;
    box-shadow: 0px 0px 50px #888888;
    border-radius: 3px;
    .close {
        width: 20px;
        height: 20px;
        background-color: #d0021b;
        position: absolute;
        right: -10px;
        top: -10px;
        border-radius: 50%;
        font-size: 16px;
        line-height: 20px;
        text-align: center;
        color: #fff;
        cursor: pointer;
        i{
            font-size: 12px;
        }
    }
    .FileItemBox {
        height: 100%;
        padding: 10px;
        .item {
            font-size: 12px;
            height: 30px;
            line-height: 30px;
            .title {
                width: 20%;
                height: 100%;
                float: left;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                text-align: center;
            }
            .percent {
                width: 70%;
                height: 100%;
                float: left;
                overflow: hidden;
                .percentBox {
                    width: 95%;
                    height: 10px;
                    border-radius: 50px;
                    margin: 10px auto;
                    border: 1px burlywood solid;
                    overflow: hidden;
                    .progressBar {
                        background-color: burlywood;
                        width: 0%;
                        height: 100%;
                        transition: width 0.5s;
                        -moz-transition: width 0.5s;
                        -webkit-transition: width 0.5s;
                        -o-transition: width 0.5s;
                    }
                }
            }
            .scheduleValue {
                width: 10%;
                height: 100%;
                float: left;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                text-align: center;
            }
        }
    }
}
</style>
