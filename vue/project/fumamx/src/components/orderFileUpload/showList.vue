<template>
    <div class="FileUpload">
        <ul v-if="fileList.length>0">
            <li v-for="(item,index) in fileList" :key="index">
                <span class="icon">
                    <!--<i class="iconfile" :class="getSuffix(item.name)"></i>-->
                    <svg  class="iconSVG" aria-hidden="true">
                        <use :xlink:href="getSuffixSVG(item.name)"></use>
                    </svg>
                </span>
                <div class="descr">
                    <div class="name" :title="item.name">{{item.name}}</div>
                    {{conver(item.size)}}
                </div>
                <span class="buts hidden">
                    <i class="iconfont icon-search-dot"  @click="tansDocPreview(fileList, index)"></i>
                    <i class="iconfont icon-download-file" @click="download(item)"></i>
                </span>
            </li>
        </ul>
        <DocPreview ref="DocPreview"></DocPreview>
    </div>
</template>

<script>
/**
 * 描述：工单文件上传UI封装
 * 作者：何俊峰
 * 时间：2018/3/5
 */
import { getFile } from '@/page/Main/Document/Vue/docUtils.js'
import { getSuffix, isHasSuffix } from '@/libs/utils.js'
import DocPreview from '@/components/DocPreview/index'
export default {
  name: 'Fileupload',
  props: {
    fileList: {
      type: Array,
      default: function () {
        return []
      }
    },
    billId: {
      type: String,
      default: ''
    },
    isOverCid: {
      type: String,
      default: '0'
    }
  },
  data () {
    return {
      uploadUrl: this.Global.uploadUrl, // 图片服务器上传URL
      fileUrl: this.Global.downloadBaseUrl// 文件下载url前缀
    }
  },
  created () {
  },
  methods: {
    getFile,
    download(item) {
        let list
        if (this.isOverCid == '1') {
            list = [{
                fileId: item.attachmentId,
                fileVersion: '1',
                isOverCid: '1',
                billId: this.billId
            }]
        } else {
            list = [{
                fileId: item.attachmentId,
                fileVersion: '1'
            }]
        }
        this.getFile(list, [], '')
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
    getSuffix (filename) {
      let suffix = getSuffix(filename)
      return 'file-' + isHasSuffix(suffix)
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

    tansDocPreview(list, index) {
        let newList = []
        if (this.isOverCid == '1') {
            list.forEach(element => {
                newList.push({
                    fileExtName: element.name.replace(/^.+\./, ''),
                    fileSize: element.size,
                    fileId: element.attachmentId,
                    fileVersion: '1',
                    isOverCid: '1',
                    billId: this.billId
                })
            })
        } else {
            list.forEach(element => {
                newList.push({
                    fileExtName: element.name.replace(/^.+\./, ''),
                    fileSize: element.size,
                    fileId: element.attachmentId,
                    fileVersion: '1'
                })
            })
        }
            console.log(newList)
        this.$refs.DocPreview.open(newList, index)
    }
  },
  watch: {
  },
  components: {
      'DocPreview': DocPreview
  }
}
</script>

<style lang="less" rel="stylesheet/less">
.FileUpload {
    // border: 1px solid red;
    // max-width: 500px;
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
            background-color: #F7F8F9;
            // background-color: #fff;
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
                color: #008cee;
            }
            &:hover {
                background: rgba(255, 255, 255, 1);
                box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.1);
                .buts {
                    display: inline-block;
                    .iconfont:hover {
                        color: red;
                        cursor: pointer;
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
}
</style>
