<template>
    <div class="FileUpload">
        <!-- 拖拽区 -->
        <drag-dialog v-if="isDrag" @change="dragDialogChange" :spatial="spatial" :limitSize="limitSize"></drag-dialog>

        <fileupload-dialog ref="fileuploadDialog" :url="uploadUrl" method="put" :closeMethod="close" :fileUploadSuccess="fileUploadSuccess"></fileupload-dialog>
        <input type="file" ref="inputFile" class="hidden" name="firstname" value="" @change="fileChange" :multiple="multiple" :accept="accept" />

        <span @click="$refs.inputFile.click()">
            <slot name="trigger">
                <!--选择文件-->
            </slot>
        </span>
        <span v-if="!autoUpload" v-on:click="fileUpload">
            <slot>上传</slot>
        </span>

        <ul v-if="fileList.length>0 && showList">
            <li v-for="(item,index) in fileList" :key="index">
                <!-- <span class="icon"> -->
                <!--<i class="iconfile" :class="getSuffix(item.name)"></i>-->
                <!-- <img v-if="isPicture(item.name.toLowerCase())" :src="getUrl(this,getGlobalImgSrc(item.url, '34x34'))">
                    <svg v-else class="iconSVG" aria-hidden="true">
                        <use :xlink:href="getSuffixSVG(item.name)"></use>
                    </svg> -->
                <!-- </span> -->
                <file-show :item="item"></file-show>
                <div class="descr">
                    <div class="name" :title="item.name">{{item.name}}</div>
                    {{getSize(item.size)}}
                </div>
                <div class="viewburs hidden" v-if="!disable">
                    <i class="iconfont icon-search-dot" @click="$refs.filePreview.show(fileList,index,0)"></i>
                </div>
                <span class="buts hidden" v-if="!disable">

                    <i class="iconfont icon-del" @click="delThis(index)"></i>
                </span>
            </li>
        </ul>
        <!-- 文件预览 -->
        <doc-preview ref="filePreview"></doc-preview>
    </div>
</template>

<script>
/**
 * 描述：文件上传UI封装
 * 作者：向士健
 * 时间：2018/3/5
 */
import { getSuffix, isHasSuffix } from '@/libs/utils.js'
import FileuploadDialog from '@/basecomponents/FileuploadDialog/index' // 图片上传及进度条插件
import FileShow from './FileShow/index'
import DocPreview from '../DocPreview/index'
import DragDialog from './DragDialog/index'
export default {
    name: 'Fileupload',
    props: {
        // 是否显示列表
        showList: {
            type: Boolean,
            default: true
        },
        // 所选类型限制
        accept: {
            type: String,
            default: '*'
        },
        // 是否多选
        multiple: {
            type: Boolean,
            default: true
        },
        // 是否选择后自动上传，配合插槽按钮
        autoUpload: {
            type: Boolean,
            default: true
        },
        // 限制所选文件大小
        limitSize: {
            type: Number,
            default: 10
        },
        fileList: {
            type: Array,
            default: function () {
                return []
            }
        },
        disable: {
            type: Boolean,
            default: false
        },
        spatial: {
            type: Number,
            default: 0
        },
        isDrag: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            uploadUrl: this.Global.uploadUrl, // 图片服务器上传URL
            fileUrl: this.Global.downloadBaseUrl, // 文件下载url前缀
            filesBak: [],
            flag: 0
        }
    },
    methods: {
        // 有拖拽时
        dragDialogChange(newFiles) {
            this.filesBak = newFiles
            this.$refs.fileuploadDialog.upload(null, newFiles)
        },
        getSize(size) {
            if (size > 1024) {
                return parseFloat(size / 1024).toFixed(2) + ' M'
            } else {
                return parseFloat(size).toFixed(2) + ' KB'
            }
        },
        // 供外部自由按钮用
        click() {
            // console.log('jj')
            this.$refs.inputFile.click()
        },
        // 判断是不是图片
        isPicture(name) {
            let picFormat = ['png', 'jpg', 'jpeg', 'gif', 'bmp']
            return picFormat.indexOf(getSuffix(name)) !== -1
        },
        selectFile() {
            this.$refs.inputFile.click()
        },
        getSuffix(filename) {
            let suffix = getSuffix(filename)
            return 'file-' + isHasSuffix(suffix)
        },
        getSuffixSVG(filename) {
            let suffix = getSuffix(filename)
            return '#file-' + isHasSuffix(suffix)
        },
        // 删除当前条
        delThis(index) {
            this.fileList.splice(index, 1)
        },
        // 选了文件，有变动时
        fileChange(event) {
            let files = event.currentTarget.files
            if (files.length === 0) { return }

            // 检测文件大小限制，并复制一份待用
            let newFiles = []
            let countM = 0
            for (var i = 0; i < files.length; i++) {
                let fileSize_M = (files[i].size / 1048576).toFixed(2) // 转成M，并保存2位小数

                if (fileSize_M > this.limitSize) {
                    this.$message.warning('包含超过 ' + this.limitSize + ' M的文件不能上传')
                    return
                }
                countM = countM + fileSize_M
                newFiles.push(files[i])
            }
            if (this.spatial > 0) {
                let Surplus = this.SpatialQuery()
                if (countM > Surplus) {
                    this.$message.warning('空间不足，无法导入')
                    return
                }
            }

            this.filesBak = newFiles
            if (this.autoUpload) {
                this.fileUpload() // 即上传
            }
        },
        SpatialQuery() {
            let _this = this
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.toAuthEmployee, {
                params: { cid: _this.spatial }

            }).then(function (res) {
                if (res.body && res.body.code.toString() == _this.Global.RES_OK) {
                    let data = res.body.data
                    return data.spacecount * 1024 - data.totalamount
                }
            })
        },
        // 关闭上传对话框
        close() {
            this.flag = 0
        },
        // 上传成功
        fileUploadSuccess(res) {
            // console.log(res);
            if (res.code != '0') { return }
            // console.log(this.filesBak[this.flag]);
            // 因图片URL不同文件URL，判断图片
            let name = this.filesBak[this.flag].name
            let size = this.filesBak[this.flag].size
            let url = res.data // 统一为ID
            // let picFormat = ['png', 'jpg', 'jpeg', 'gif', 'bmp']
            // if (picFormat.indexOf(getSuffix(name)) !== -1) {
            //     url = ...;
            // } else {
            //     url = this.fileUrl + res.data;
            // }
            // 统一为ID

            this.fileList.push({
                name: name,
                url: url,
                size: (size / 1024).toFixed(2),
                status: 1
            })
            this.flag++
        },
        // 上传中...
        fileUpload() {
            this.$refs.fileuploadDialog.upload(this.$refs.inputFile)
        }
    },
    watch: {
        fileList: function () {
            this.$emit('change', this.fileList)
        }
    },
    components: {
        'fileupload-dialog': FileuploadDialog,
        'drag-dialog': DragDialog,
        'doc-preview': DocPreview,
        'file-show': FileShow
    }
}
</script>

<style lang="less" ref="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
