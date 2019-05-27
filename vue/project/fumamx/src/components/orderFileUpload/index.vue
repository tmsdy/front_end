<template>
    <div class="FileUpload">
        <input type="file" ref="inputFile" class="hidden" name="firstname" value="" @change="fileChange" multiple />

        <span @click="$refs.inputFile.click()">
            <slot name="trigger">
                <!--选择文件-->
            </slot>
        </span>
        <span v-if="!autoUpload" v-on:click="fileUpload">
            <!-- 上传 -->
            <slot>{{$t('mxpcweb.basecomponents.1530756745993')}}</slot>
        </span>

        <ul v-if="fileLists.length>0">
            <li v-for="(item,index) in fileLists" :key="index">
                <span class="icon">
                    <!--<i class="iconfile" :class="getSuffix(item.name)"></i>-->
                    <svg class="iconSVG" aria-hidden="true">
                        <use :xlink:href="getSuffixSVG(item.name)"></use>
                    </svg>
                </span>
                <div class="descr">
                    <div class="name" :title="item.name">{{item.name}}</div>
                    {{conver(item.size)}}
                </div>
                <span class="buts hidden">
                    <!--<i class="iconfont icon-hook"></i>-->
                    <i class="iconfont icon-del" @click="delThis(index)"></i>
                </span>
            </li>
        </ul>
        <div class="FileuploadDialog" v-show="isShow">
            <div class="close" v-on:click="close"><i class="iconfont icon-close"></i></div>
            <ul class="FileItemBox">
                <li class="item">
                    <!-- 附件 -->
                    <div class="title">{{$t('mxpcweb.client.detail.1530003645283')}}</div>
                    <div class="percent">
                        <div class="percentBox">
                            <div class="progressBar" ref="progressBar"></div>
                        </div>
                    </div>
                    <div class="scheduleValue" ref="scheduleValue">0%</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
/**
 * 描述：工单文件上传UI封装
 * 作者：何俊峰
 * 时间：2018/3/5
 */
import { getSuffix, isHasSuffix, sendDataFile } from '@/libs/utils.js'
export default {
  name: 'Fileupload',
  props: {
    autoUpload: {
      type: Boolean,
      default: true
    },
    limitSize: {
      type: Number,
      default: 10
    },
    fileList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      uploadUrl: this.Global.uploadUrl, // 图片服务器上传URL
      fileUrl: this.Global.downloadBaseUrl, // 文件下载url前缀
      filesBak: [],
      fileLists: [],
      option: {

      },
      isShow: false
    }
  },
  created () {
  },
  methods: {
    updata() {
        this.fileLists = []
        this.fileList.forEach(item => {
            this.fileLists.push(item)
        })
    },
    // 判断是不是图片
    isPicture (name) {
      let picFormat = ['png', 'jpg', 'jpeg', 'gif', 'bmp']
      return picFormat.indexOf(getSuffix(name)) !== -1
    },
    getSuffixSVG (filename) {
      let suffix = getSuffix(filename)
      return '#file-' + isHasSuffix(suffix)
    },
    selectFile () {
      this.$refs.inputFile.click()
    },
    getSuffix (filename) {
      let suffix = getSuffix(filename)
      return 'file-' + isHasSuffix(suffix)
    },
    close () {
      this.isShow = false
      // this.Upload.abort();
    },
    // 删除当前条
    delThis (index) {
      this.fileLists.splice(index, 1)
      this.$emit('update:fileList', this.fileLists)
    },
    // 选了文件，有变动时
    fileChange (event) {
      let files = event.currentTarget.files
      // 检测文件大小限制，并复制一份待用
      let newFiles = []
      for (var i = 0; i < files.length; i++) {
        let fileSize_M = (files[i].size / 1048576).toFixed(2) // 转成M，并保存2位小数
        if (fileSize_M > this.limitSize) {
            // 包含超过M的文件不能上传
        //   this.$message.warning(this.$t('mxpcweb.basecomponents.1530756826710',[this.limitSize]))
          this.$message.warning(this.$t('mxpcweb.basecomponents.1530758929475') + this.limitSize + this.$t('mxpcweb.basecomponents.1530758976630') + this.$t('mxpcweb.basecomponents.1530759085862'))
          return
        }
        newFiles.push(files[i])
      }

        this.filesBak = newFiles
        this.submit()
    },
    // 上传成功
    fileUploadSuccess (item, id) {
      this.fileLists.push({
        name: item.name,
        size: item.size,
        attachmentId: id
      })
      this.$emit('update:fileList', this.fileLists)
      // console.log(this.fileLists)
    },
    clear () {
      this.filesBak = []
      this.fileLists = []
      this.$refs.inputFile.value = ''
    },
    conver(limit) {
        var size = ''
        if (limit < 0.1 * 1024) { // 如果小于0.1KB转化成B
            size = limit.toFixed(2) + 'B'
        } else if (limit < 0.1 * 1024 * 1024) { // 如果小于0.1MB转化成KB
            size = (limit / 1024).toFixed(2) + 'KB'
        } else if (limit < 0.1 * 1024 * 1024 * 1024) { // 如果小于0.1GB转化成MB
            size = (limit / (1024 * 1024)).toFixed(2) + 'MB'
        } else { // 其他转化成GB
            size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
        }

        var sizestr = size + ''
        var len = sizestr.indexOf('\.')
        var dec = sizestr.substr(len + 1, 2)
        if (dec == '00') { // 当小数点后为00时 去掉小数部分
            return sizestr.substring(0, len) + sizestr.substr(len + 3, 2)
        }
        return sizestr
    },
    async submit () {
      if (this.filesBak.length != 0) {
        // this.option = datas
        let _this = this
        let data = Object.assign(_this.option, this.getToken())
        let filesData = this.filesBak
        this.Upload = await sendDataFile({
          data: data,
          files: filesData,
          fileKey: 'uploadFile',
          method: 'post',
          url: _this.Global.baseURL + _this.Global.api.v2.folders_inFileSys,
        // url: _this.Global.baseURL + _this.Global.api.v2.folders_files,
          // 传输开始事件
          onloadstart (event) {
            _this.isShow = true
          },
          // 监听上传进度事件
          onprogress (event) {
            _this.$refs.progressBar.style.width = event.percent + '%'
            _this.$refs.scheduleValue.innerHTML = event.percent + '%'
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
            if (res.code.toString() === '0') {
                if (_this.autoUpload) {
                    _this.filesBak.forEach(function (item, index) {
                        if (res.data[index]) {
                            _this.fileUploadSuccess(item, res.data[index].attachmentId)
                        }
                    })
                }
                _this.close()
                // _this.$message.success(res.msg)
            //   _this.$emit('submitData', res.data, type)
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
      } else {
        return []
      }
    }
  },
  watch: {
    fileLists: function () {
      this.$emit('change')
    }
  },
  components: {
  }
}
</script>

<style lang="less" rel="stylesheet/less">
.FileUpload {
    // border: 1px solid red;
    // max-width: 500px;
    >ul {
        margin-top: 5px;
        >li {
            padding: 3px 6px;
            margin-bottom: 5px;
            background-color: #fff;
            border-radius: 5px;
            border:1px solid rgba(234,234,234,1);
            .icon {
                color: #008cee;
            }
            .icon-hook {
                color: #008cee;
            }
            &:hover {
                background-color: #FAFAFA;
                .icon-hook {
                    display: none;
                }
                .icon-del {
                    display: inline-block;
                    &:hover {
                        color: red;
                        cursor: pointer;
                    }
                }
            }
        }
    }
    >ul {
        // border: 1px solid blue;
        margin-top: 5px;
        // background: #fff;
        >li {
            // border: 1px solid red;
            display: inline-block;
            width: 160px;
            height: 44px;
            margin: 0 10px 10px 0;
            // background-color: #F7F8F9;
            background-color: #fff;
            position: relative;
            .icon {
                width: 34px;
                height: 34px;
                line-height: 34px;
                text-align: center;
                position: absolute;
                left: 5px;
                top: 5px;
                // background: #ddd;
                // color: #fff;
                .iconfile {
                    font-size: 22px;
                }
                .iconSVG{
                    width: 100%;
                    height: 100%;
                }
            }
            .descr {
                // border: 1px solid blue;
                height: 100%;
                line-height: 18px;
                padding-left: 44px;
                font-size: 12px;
                color: #606266;
                .name {
                    color: #909399;
                    padding-top: 3px;
                    width: 95%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
            .buts {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                padding: 0 5px;
                line-height: 44px;
                background: #fff;
                color: RGBA(0, 140, 238, 1);
            }
            &:hover {
                background: rgba(255, 255, 255, 1);
                box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.1);
                .buts {
                    display: inline-block;
                    .iconfont:hover {
                        color: RGBA(69, 178, 255, 1);
                        cursor: pointer;
                    }
                    .iconfont:active{
                        color: RGBA(0, 140, 238, 1);
                    }
                }
            }
            &::after {
                content: "";
                display: table;
                height: 0;
                clear: both;
            }
        }
    }
    .FileuploadDialog {
        width: 600px;
        height: auto;
        background-color: #fff;
        position: fixed;
        z-index: 1000000000;
        left: 50%;
        top: 15%;
        margin-left: -300px;
        box-shadow: 0px 0px 50px #888888;
        .close {
            width: 20px;
            height: 20px;
            background-color: red;
            position: absolute;
            right: -10px;
            top: -10px;
            border-radius: 50%;
            font-size: 16px;
            line-height: 17px;
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
}
</style>
