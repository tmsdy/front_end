<template>
    <div :visible.sync="docDialogShow">
        <div v-if="docDialogShow" class="docDialog">
            <div class="box">
                <span @click="docDialogClose" class="closeBtn iconfont icon-close"></span>
                <p class="title ellipsis">{{fileName}}</p>
                <div v-if="!isLoading" class="contentBox">
                    <ul class="tabBtn clearfix">
                        <!-- 文档明细 -->
                        <li @click="tabIndex=1" :class="{active:(tabIndex==1)}">{{$t('mxpcweb.document.global.1529989345031')}}</li>
                        <!-- 修订 -->
                        <li @click="tabIndex=2" :class="{active:(tabIndex==2)}">{{$t('mxpcweb.document.global.1529989390894')}}</li>
                    </ul>
                    <div class="tishi">
                        <!-- 签出此文档并修订 -->
                        {{$t('mxpcweb.document.global.1529989424316')}}

                        <p @click="setFileState()">
                            <span class="iconfont icon-file-move"></span>
                            <span v-if="isSetFileStateing" class="el-icon-loading"></span>
                            <!-- "签出":"签入" -->
                            <span v-if="!isSetFileStateing"> {{fileState==0?$t('mxpcweb.document.global.1529989534823'):$t('mxpcweb.document.global.1529989571863')}}</span>
                        </p>

                    </div>
                    <ul class="tabBox">
                        <li v-show="tabIndex==1" class="docDetail">
                            <table>
                                <tr>
                                    <!-- 文件名 -->
                                    <td>{{$t('mxpcweb.document.global.1529989616150')}}:</td>
                                    <td>
                                        <p v-show="!fileNameEdit">{{nowFileData.fileName}}
                                            <span class="iconfont icon-edit" @click="fileNameEditShow"></span>
                                        </p>
                                        <p v-show="fileNameEdit">
                                            <input type="text" v-model="tempFileName" @keyup.enter="rename">
                                            <span v-if="isfileNameEditing" class="el-icon-loading"></span>
                                            <span v-if="!isfileNameEditing" class="iconfont icon-hook" @click="rename"></span>
                                            <span v-if="!isfileNameEditing" class="iconfont icon-close" @click="fileNameEditShow"></span>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <!-- 版本 -->
                                    <td>{{$t('mxpcweb.document.global.1529989652167')}}:</td>
                                    <td>{{nowFileData.fileVersion}}</td>

                                </tr>
                                <tr>
                                    <!-- 上传时间 -->
                                    <td>{{$t('mxpcweb.document.global.1529989671120')}}:</td>
                                    <td>{{nowFileData.createDate}}</td>
                                </tr>
                                <tr>
                                    <!-- 大小 -->
                                    <td>{{$t('mxpcweb.document.global.1529989700351')}}:</td>
                                    <td>{{byteCalc(nowFileData.fileSize)}}</td>
                                </tr>
                                <tr>
                                    <!-- 修改者 -->
                                    <td>{{$t('mxpcweb.document.global.1529989809672')}}:</td>
                                    <td>{{nowFileData.modifyRealName}}</td>

                                </tr>
                                <tr>
                                    <td>
                                        <!-- 下载 -->
                                        <span @click="fileDownload(nowFileData.fileId,nowFileData.fileVersion)" class="tableBtn">{{$t('mxpcweb.document.global.1529990058593')}}</span>
                                    </td>
                                    <!--  <td>
                                        <a href="" class="tableBtn">编辑</a>
                                    </td> -->
                                </tr>
                            </table>
                        </li>
                        <li v-show="tabIndex==2" class="docModify">
                            <div class="versionBox">
                                <table>
                                    <tr>
                                        <!-- 上传文件最新版本 -->
                                        <td>
                                            {{$t('mxpcweb.document.global.1529990115282')}}:
                                        </td>
                                        <td>
                                            <!-- 上传文档 -->
                                            <el-button @click="openWindow">{{$t('mxpcweb.document.global.1529397458687')}}
                                            </el-button>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <el-table height="200" ref="singleTable" :data="versionData" style="width: 100%">
                                <!-- 版本 -->
                                <el-table-column :label="$t('mxpcweb.document.global.1529989652167')">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.fileVersion }}</span>
                                        <!-- 下载 -->
                                        <el-tooltip :content="$t('mxpcweb.document.global.1529990058593')" placement="top" effect="light">
                                            <span style="margin:0 20px;" class="iconfont icon-download" @click="fileDownload(scope.row.fileId,scope.row.fileVersion)"></span>
                                        </el-tooltip>
                                        <!-- 预览 -->
                                        <el-tooltip :content="$t('mxpcweb.document.global.1529990347217')" placement="top" effect="light">
                                            <span class="iconfont icon-eye" @click="filePreview(scope.$index)"></span>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                                <!-- 大小 -->
                                <el-table-column :label="$t('mxpcweb.document.global.1529989700351')">
                                    <template slot-scope="scope">
                                        {{ byteCalc(scope.row.fileSize)}}
                                    </template>
                                </el-table-column>
                                <!-- 日期 -->
                                <el-table-column property="modifyDate" :label="$t('mxpcweb.document.global.1529990419120')">
                                </el-table-column>
                                <!-- 备注 -->
                                <el-table-column property="remarks" :label="$t('mxpcweb.document.global.1529990459448')">
                                </el-table-column>
                            </el-table>
                        </li>
                    </ul>
                </div>

                <loading v-if="isLoading" class="loadingBox"></loading>
            </div>
        </div>
        <doc-preview ref="filePreview"></doc-preview>
    </div>
</template>
<script>
/**
 * 作者： 郭兵
 * 描述：文档详情
 */
import Loading from '@/basecomponents/Loading/index'
import { trim } from '@/libs/utils.js'
import DocPreview from '@/components/DocPreview/index.vue'
import { getFile, byteCalc } from '@/page/Main/Document/Vue/docUtils.js'
export default {
    name: 'DocDetail',
    props: [],
    components: {
        DocPreview,
        'loading': Loading
    },
    data() {
        return {
            tabIndex: 1,
            isLoading: false,
            isSetFileStateing: false,
            isfileNameEditing: false,
            docDialogShow: false,
            fileNameEdit: false,
            tempFileName: '',
            versionData: [],
            fileState: 0, /* 0当前是签出，1当前是签入 */
            parFileData: {},
            nowFileData: {},
            staffId: '',
            previousRequest: ''
        }
    },
    computed: {
        fileName() {
            return this.nowFileData.fileName ? `${this.nowFileData.fileName}.${this.nowFileData.fileExtName}` : ''
        }
    },
    methods: {
        getFile,
        byteCalc,
        /* 文件长传的选择框 */
        openWindow() {
            if (this.fileState == 0) {
                /* '需签出文件后才能上传'  */
                let c = this.$t('mxpcweb.document.global.1529990702343')
                /* '提示' */
                let t = this.$t('mxpcweb.document.global.1529990680329')
                /* '确定' */
                let s = this.$t('mxpcweb.document.global.1529397179241')
                this.$alert(c, t, {
                    confirmButtonText: s
                })
            } else {
                let _this = this
                let data = {
                    url: _this.Global.api.v2.folders_fileVersion,
                    fileId: this.parFileData.fileId,
                    moduleCode: this.parFileData.moduleCode,
                    remarks: '',
                    fn(res) {
                        _this.fileVersion()
                        _this.getFileDetail((res1) => {
                            if (res1.body.code.toString() == _this.Global.RES_OK) {
                                Object.assign(_this.parFileData, res1.body.data)
                            }
                        })
                    }
                }
                if (this.staffId) {
                    data['staffId'] = this.staffId
                }
                ep.emit('selectFile', data)
            }
        },

        /* 弹框关闭 */
        docDialogClose() {
            this.docDialogShow = false
        },
        /* 弹框出现 */
        open(data, staffId) {
            this.fileState = data.fileState

            this.tabIndex = 1
            this.parFileData = data
            //  this.nowFileData = Object.assign({}, data);
            this.nowFileData = {}
            this.staffId = staffId

            this.versionData = []

            this.fileNameEdit = false
            this.docDialogShow = true
            this.isLoading = true

            this.getFileDetail((res) => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.isLoading = false
                } else {
                    this.docDialogShow = false
                }
            })

            this.fileVersion()
        },
        /* 文件重命名输入的显示 */
        fileNameEditShow() {
            this.tempFileName = this.nowFileData.fileName
            this.fileNameEdit = !this.fileNameEdit
        },

        /* 文件预览 */
        filePreview(index) {
            this.$refs.filePreview.open(this.versionData, index)
        },
        /* 重命名 */
        rename() {
            let keyWords = trim(this.tempFileName, '')
            if (keyWords === '') {
                /* '需签出文件后才能上传'  */
                let c = this.$t('mxpcweb.document.global.1529990744951')
                /* '提示' */
                let t = this.$t('mxpcweb.document.global.1529990680329')
                /* '确定' */
                // let s = this.$t('mxpcweb.document.global.1529397179241')
                this.$alert(c, t, {
                    confirmButtonText: d,
                    callback: action => {
                        this.tempFileName = ''
                    }
                })
                return false
            }
            if (keyWords === this.nowFileData.fileName) {
                this.fileNameEditShow()
                return false
            }
            let url = this.Global.baseURL + this.Global.api.v2.folders_files
            let data = {
                fileId: this.parFileData.fileId,
                fileName: this.tempFileName
            }
            this.isfileNameEditing = true
            this.$http.put(url, data)
                .then(res => {
                    if (res.body.code.toString() === this.Global.RES_OK) {
                        /* 修改成功 */
                        this.$message.success(this.$t('mxpcweb.document.global.1529398081837'))
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                    this.getFileDetail((res1) => {
                        if (res1.body.code.toString() == this.Global.RES_OK) {
                            Object.assign(this.parFileData, res1.body.data)
                            this.isfileNameEditing = false
                        }
                    })

                    this.fileNameEditShow()
                })
                .catch(err => {
                    this.tempFileName = this.nowFileData.fileName
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },

        /* 迁出迁入 */
        setFileState() {
            let url = this.Global.baseURL + this.Global.api.v2.folders_fileLock
            let state = this.fileState == 0 ? 1 : 0
            let data = {
                fileState: state,
                fileId: this.parFileData.fileId
            }
            this.isSetFileStateing = true
            this.$http.put(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        /* "签出成功" : "签入成功"  */
                        let msg = state == 1 ? this.$t('mxpcweb.document.global.1529990841031') : this.$t('mxpcweb.document.global.1529990875544')
                        this.$message.success(msg)
                        this.fileState = state
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                    this.isSetFileStateing = false
                })
                .catch(err => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        /* 历史版本获取 */
        fileVersion() {
            let url = this.Global.baseURL + this.Global.api.v2.folders_fileVersion
            let data = {
                params: {
                    fileId: this.parFileData.fileId,
                    moduleCode: this.parFileData.moduleCode
                }
            }
            this.$http.get(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.versionData = res.body.data.list
                    } else {
                        this.versionData = []
                    }
                })
                .catch(err => {
                    this.versionData = []
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        /* 文件修订后文件信息回显 */
        getFileDetail(fn, errfn) {
            let url = this.Global.baseURL + this.Global.api.v2.folders_newFile
            let data = {
                params: {
                    fileId: this.parFileData.fileId
                },
                before(request) {
                    if (this.previousRequest) {
                        this.previousRequest.abort()
                    }
                    this.previousRequest = request
                }
            }
            this.$http.get(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.nowFileData = res.body.data
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                    fn && fn(res)
                })
                .catch(err => {
                    if (err.status == 0) return
                    this.$message.error(this.$t(this.Global.errorTitle))
                    errfn && errfn()
                })
        },
        /* 文件的历史版本下载 */

        fileDownload(fileId, fileVersion) {
            this.getFile([{ fileId, fileVersion }], '', this.parFileData.moduleCode)
        }
    }
}

</script>
<style lang="less" ref="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
