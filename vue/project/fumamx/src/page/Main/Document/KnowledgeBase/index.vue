<template>
    <div class="knowledgeBase">
        <div class="searchBox">
            <div class="searchStrip clearfix">

                <template v-for="(v,i) in navList.id">
                    <p :key="'a'+i" v-if="i!=(navList.id.length-1)" class="pull-left  pageName canClick" @click="folderChange(v,navList.name[i])">
                        {{navList.name[i]}}
                    </p>
                    <span :key="'b'+i" v-if="i!=navList.id.length-1" class="pull-left pageName iconfont icon-page-right">
                    </span>
                    <p :key="'c'+i" v-if="i==(navList.id.length-1)" class="pull-left  pageName">
                        {{navList.name[i]}}
                    </p>
                </template>
                <p class="pull-right searchInput">
                    <!-- 在 知识库 中搜索 -->
                    <input :placeholder="$t('mxpcweb.document.knowledgebase.1529392610345')" icon="search" v-model="wildCardWords" @keyup.enter="handleSearch" />
                    <i class="iconfont icon-search"></i>
                </p>
            </div>
            <div class="typeStrip clearfix">
                <el-checkbox :disabled="canCheck.length<=0" class="pull-left" v-model="checkAll" @change="handleCheckAll"></el-checkbox>

                <div class="searchCondition pull-left">
                    <span v-for="(value,key) in  typeList" :class="{active:(key===nowType)}" @click="nowType=key" :key="key">
                        {{value}}
                    </span>
                </div>
                <div class="pull-right">
                    <!-- 上传 -->
                    <el-button v-if="navList.id.length!=1" class="uploadBtn" @click="openWindow" :disabled="isSearch">{{$t('mxpcweb.document.knowledgebase.1529392648188')}}
                    </el-button>
                    <!--  <el-button @click="filesDownload" :loading="fileIsPack">{{fileIsPack?"处理中...":"下载文档"}}</el-button> -->
                </div>
            </div>
        </div>
        <div class="searchRes" v-loading="isLoading">
            <transition name="el-fade-in-linear">
                <div v-show="!isLoading&&(docData.length>0)" class="resBox">
                    <!-- 标题 -->
                    <!-- 共 x 个结果 -->
                    <p class="title" v-html="$t('mxpcweb.document.search.1529031844624',[page.total])"></p>
                    <!-- 结果列表 -->

                    <ul class="resList MXscroll">
                        <li class="myTableHeader clearfix">
                            <!-- 名称 -->
                            <div class="itemName">{{$t('mxpcweb.document.knowledgebase.1529392725293')}}</div>
                            <!-- 更新时间 -->
                            <div class="itemDate">{{$t('mxpcweb.document.knowledgebase.1529392748200')}}</div>
                            <!-- 大小 -->
                            <div class="itemSize">{{$t('mxpcweb.document.knowledgebase.1529392784040')}}</div>
                            <!-- 上传者 -->
                            <div class="itemPeople">{{$t('mxpcweb.document.knowledgebase.1529392821492')}}</div>
                        </li>
                        <el-checkbox-group v-model="checkedDocs" @change="handleCheck">
                            <template v-for="(value, index) in docData">
                                <li v-if="value.isFolder" @click="folderChange(value.folderId,value.folderName)" class="clearfix myTableBody" :key="index">
                                    <div class="itemName">
                                        <div class="iconBox">
                                            <span class="iconfont" :class="[value.folderType == 2?'icon-space-close':'icon-folder-solid'] "></span>
                                        </div>
                                        <div class="contentBox">
                                            <p class="docTitle">{{value.folderName}}</p>
                                            <!--  <div class="docPuDes"></div> -->
                                        </div>
                                    </div>
                                    <div class="itemDate">
                                        <div class="contentBox ">
                                            {{value.modifyDate}}
                                        </div>
                                    </div>
                                    <div class="itemSize ">
                                        <div class="contentBox ">
                                            -
                                        </div>
                                    </div>
                                    <div class="itemPeople ">
                                        <div class="contentBox " v-html="value.createRealName">
                                        </div>
                                        <div class="funBox">
                                            <!-- 上传文件到该空间 -->
                                            <el-tooltip v-if="value.folderType==2" :content="$t('mxpcweb.document.knowledgebase.1529392648188')" placement="top" effect="light">
                                                <span class="iconfont icon-upload" @click.stop="uploadFileToSpace(value.folderId)"></span>
                                            </el-tooltip>

                                            <!-- '重命名空间': '重命名文件夹' -->
                                            <el-tooltip :content="value.folderType==2? $t('mxpcweb.document.knowledgebase.1529392932038'): $t('mxpcweb.document.knowledgebase.1529392948276') " placement="top" effect="light">
                                                <span class="iconfont icon-edit " @click.stop="folderReanme(value.folderId,value.folderType) "></span>
                                            </el-tooltip>
                                            <!-- '删除本空间': '删除本文件夹' -->
                                            <el-tooltip :content="value.folderType==2? $t('mxpcweb.document.knowledgebase.1529393016125'): $t('mxpcweb.document.knowledgebase.1529393029659') " placement="top" effect="light">
                                                <span class="iconfont icon-del" @click.stop="folderDelete(value.folderId,value.folderName,value.folderType) "></span>
                                            </el-tooltip>

                                        </div>
                                    </div>
                                </li>

                                <li v-if="!value.isFolder " :key="index " class="clearfix myTableBody">

                                    <div class="itemName ">

                                        <el-checkbox class="liSelect " :label="value.fileId"></el-checkbox>
                                        <div class="iconBox">
                                            <img v-if="hasImage(value)" class="imgIcon" v-imgsrc="value.preViewImageUrl" />
                                            <svg v-else class="iconSVG" aria-hidden="true">
                                                <use :xlink:href="setFileIcon(value.fileExtName)"></use>
                                            </svg>
                                        </div>

                                        <div class="contentBox ">
                                            <p class="docTitle  ellipsis">
                                                <span class="text-hover" @click="filePreview(index)" v-html="`${value.fileName}.${value.fileExtName}`"></span>
                                            </p>
                                            <div class="docDes" v-html="value.content"></div>
                                            <div class="docInteract">
                                                <span :class="{'active':value.isLike}">
                                                    <i class="iconfont icon-praise" @click="fileLike(value)"></i>
                                                    {{value.likeNum}}
                                                </span>
                                                <span>
                                                    <i class="iconfont icon-message" @click="fileComment(value)"></i>
                                                    {{value.evaluateNum }}
                                                </span>
                                                <span :class="{'active':value.isSubscribe}">
                                                    <i class="iconfont icon-subscribe" @click="fileSubscription(value)"></i>
                                                    {{value.subscribeNum}}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="itemDate ">
                                        <div class="contentBox ">
                                            {{value.modifyDate}}
                                        </div>
                                    </div>
                                    <div class="itemSize">
                                        <div class="contentBox">
                                            {{ byteCalc(value.fileSize)}}
                                        </div>
                                    </div>
                                    <div class="itemPeople">
                                        <div class="contentBox" v-html="value.createRealName">
                                        </div>
                                        <div class="funBox">
                                            <!-- 版本管理 -->
                                            <el-tooltip :content="$t('mxpcweb.document.global.1535960310606')" placement="top" effect="light">
                                                <span class="iconfont icon-sheet" @click="lookDetail(value) "></span>
                                            </el-tooltip>

                                            <el-dropdown trigger="hover" @command="handleCommand">
                                                <span class="el-dropdown-link">
                                                    <i class="iconfont icon-more"></i>
                                                </span>
                                                <el-dropdown-menu slot="dropdown">
                                                    <el-dropdown-item :command="{action:'move',fileId:value.fileId}">移动</el-dropdown-item>
                                                    <el-dropdown-item :command="{action:'copy',fileId:value.fileId}">复制</el-dropdown-item>
                                                    <el-dropdown-item :command="{action:'download',fileId:value.fileId,fileVersion:value.fileVersion}" divided>
                                                        <!-- 下载 -->{{$t('mxpcweb.document.knowledgebase.1529393197964')}}</el-dropdown-item>
                                                    <el-dropdown-item :command="{action:'delete',fileId:value.fileId}" divided>
                                                        <!-- 删除 -->{{$t('mxpcweb.document.knowledgebase.1529393228140')}}</el-dropdown-item>
                                                </el-dropdown-menu>
                                            </el-dropdown>

                                        </div>
                                    </div>
                                </li>
                            </template>
                        </el-checkbox-group>

                    </ul>

                    <!--分页 -->
                    <div class="paging " v-show="page.total>page.size">
                        <el-pagination @current-change="changePage" background layout="total,prev, pager, next" :page-size="page.size" :current-page="page.now" :total="page.total">
                        </el-pagination>
                    </div>
                    <!-- 工具条 -->
                    <div class="toolStrip" v-show="checkedDocs.length>0">
                        <el-checkbox :indeterminate="isIndeterminate" :disabled="canCheck.length<=0" class="pull-left" v-model="checkAll" @change="handleCheckAll"></el-checkbox>
                        <span class="toolItem clearfix pull-left" @click="filesDownload()">
                            <!-- '处理中..':'下载' -->
                            <i class="toolIcon" :class="[fileIsPack?'el-icon-loading':'icon-download-u iconfont']"></i>
                            {{fileIsPack?$t('mxpcweb.document.knowledgebase.1529393296269'):$t('mxpcweb.document.knowledgebase.1529393197964')}}
                        </span>
                        <span class="toolItem clearfix pull-left" @click="filesMove()">
                            <i class="toolIcon iconfont icon-file-move"></i>
                            <!-- 移动 -->
                            {{$t('mxpcweb.document.global.1535099098630')}}
                        </span>
                        <span class="toolItem clearfix pull-left" @click="filesCopy()">
                            <i class="toolIcon iconfont icon-copy"></i>
                            <!-- 复制 -->
                            {{$t('mxpcweb.document.global.1535099144465')}}
                        </span>
                        <span class="toolItem clearfix pull-left" @click="filesDelete()">
                            <!-- 删除 -->
                            <i class="toolIcon iconfont icon-del"></i>
                            {{$t('mxpcweb.document.knowledgebase.1529393228140')}}
                        </span>
                        <span class="toolItem clearfix pull-right" @click="closeToolStrip()">
                            <i class="toolIcon iconfont icon-close"></i>
                        </span>
                    </div>
                </div>
            </transition>
            <!-- 没有记录 -->
            <transition name="el-fade-in-linear">
                <!-- 没有任何结果～ -->
                <no-data v-show="docData.length<=0&&!isLoading" :title="$t('mxpcweb.document.knowledgebase.1529393456061')" class="noDataBox"></no-data>
            </transition>
        </div>
        <!--文档弹框 -->
        <doc-detail ref="docDialog"></doc-detail>
        <folder-tools ref="renameDialogref"></folder-tools>

        <doc-preview ref="filePreview"></doc-preview>
        <doc-move ref="docMove" @success="docMoveSuccess"></doc-move>
        <doc-comment ref="docComment"></doc-comment>
    </div>
</template>

<script>
import { trim } from '@/libs/utils.js'
import NoData from '@/basecomponents/NoData/index'
import DocDetail from '@/components/DocDetail/index'
import DocPreview from '@/components/DocPreview/index'
import DocMove from '../Vue/DocMove/index'
import Loading from '@/basecomponents/Loading/index.vue'
import { byteCalc, deleteFolder, deleteFile, getFile, setFileIcon, hasImage } from './../Vue/docUtils.js'
import FolderTools from './../Vue/FolderTools/index.vue'
import DocComment from './../Vue/DocComment/index'
export default {
    name: 'KnowledgeBase',

    data() {
        return {
            wildCardWords: '',
            isLoading: false,
            isSearch: false,
            nowType: 'ALL',
            typeList: Object.freeze({
                'ALL': this.$t('mxpcweb.document.search.1528978756232'),
                'PIC': this.$t('mxpcweb.document.search.1528978794960'),
                'VIDEO': this.$t('mxpcweb.document.search.1528978822479'),
                'DOC': 'DOC',
                'XLS': 'XLS',
                'PPT': 'PPT',
                'PDF': 'PDF'
            }),
            nowFolder: {
                folderId: 1,
                folderPath: '/1',
                /* 知识库 */
                showPath: this.$t('mxpcweb.document.knowledgebase.1529393553678')
            },
            navList: {
                id: ['1'],
                /* 知识库 */
                name: [this.$t('mxpcweb.document.knowledgebase.1529393553678')]
            },
            moduleCode: 'DC001',
            page: {
                size: 10,
                now: 1,
                total: 0
            },
            docData: [],
            checkedDocs: [],
            canCheck: [],
            checkAll: false,
            fileIsPack: false,
            previousRequest: null,
            isIndeterminate: false,
            isLikeSaving: false,
            isSubscriptionSaving: false
        }
    },
    created() {
        this.pageInit()
    },
    computed: {},
    mounted() {
        this.clampInit()
        let _this = this
        ep.tail('getPuDoc', function (data) {
            _this.reloadPuDoc()
        })
        ep.tail('changePuFolder', function (nowFolder) {
            nowFolder = nowFolder || {
                folderId: 1,
                folderPath: '/1',
                /* 知识库 */
                showPath: _this.$t('mxpcweb.document.knowledgebase.1529393553678')
            }
            _this.isSearch = false
            _this.nowFolder = Object.assign({}, nowFolder)
            _this.pageInit()
        })
        ep.tail('delBackPuFolder', function (delFolder) {
            let index = _this.navList.id.indexOf(delFolder.folderId.toString())
            if (index >= 0) {
                let id = _this.navList.id[index - 1]
                let name = _this.navList.name[index - 1]
                _this.folderChange(id, name)
            }
        })
        ep.tail('reNamePuFolder', function (newFolder) {
            let index = _this.navList.id.indexOf(newFolder.folderId.toString())
            if (index >= 0) {
                _this.navList.name.splice(index, 1, newFolder.folderName)
            } else {
                _this.reloadPuDoc()
            }
        })
    },
    updated() {
        this.clampInit()
    },
    methods: {
        byteCalc,
        deleteFolder,
        deleteFile,
        getFile,
        setFileIcon,
        hasImage,
        openWindow() {
            this._uploadFile(this.nowFolder.folderId, this.nowFolder.folderPath, this.reloadPuDoc)
        },
        uploadFileToSpace(folderId) {
            let folderPath = `${this.nowFolder.folderPath}/${folderId}`
            this._uploadFile(folderId, folderPath)
        },
        _uploadFile(folderId, folderPath, cbfn) {
            let data = {
                url: this.Global.api.v2.folders_files,
                fileSource: 1,
                folderId: folderId,
                moduleCode: this.moduleCode,
                folderPath: folderPath,
                remarks: '',
                fn: res => {
                    if (res.code.toString() == this.Global.RES_OK) {
                        cbfn && cbfn()
                    } else {
                        this.$message.error(res.msg)
                    }
                }
            }
            ep.emit('selectFile', data)
        },
        /* 移动或复制成功 */
        docMoveSuccess() {
            this.reloadPuDoc()
        },
        filePreview(index) {
            this.$refs.filePreview.open(this.docData, index)
        },
        /* 重新获取数据 */
        reloadPuDoc() {
            if (this.isSearch) {
                this.handleSearch()
            } else {
                this.pageInit()
            }
        },
        folderReanme(folderId, folderType) {
            this.$refs.renameDialogref.put({
                targetFolderId: folderId,
                folderType: folderType,
                moduleCode: this.moduleCode
            }, () => {
                this.reloadPuDoc()
                ep.emit('getPuFolders')
            })
        },
        /* 文件夹删除 */
        folderDelete(folderId, folderName, folderType) {
            this.deleteFolder(folderId, folderName, folderType, this.moduleCode, () => {
                this.reloadPuDoc()
                ep.emit('getPuFolders')
            })
        },
        /* 文件删除 */
        fileDelete(fileId) {
            this.deleteFile([fileId], this.moduleCode, this.reloadPuDoc.bind(this))
        },
        /* 多文件删除 */
        filesDelete() {
            this.deleteFile(this.checkedDocs, this.moduleCode, this.reloadPuDoc.bind(this))
        },
        /* 文件下载 */
        fileDownload(fileId, fileVersion) {
            this.getFile([{ fileId, fileVersion }], this.docData, this.moduleCode)
        },
        /* 多文件下载 */
        filesDownload() {
            if (this.checkedDocs.length <= 0) {
                let c = this.$t('mxpcweb.document.knowledgebase.1529393658965')
                let t = this.$t('mxpcweb.document.knowledgebase.1529393689743')
                let b = this.$t('mxpcweb.document.knowledgebase.1529393704388')
                this.$alert(c, t, {
                    confirmButtonText: b
                })
            } else {
                let fileList = this.docData.reduce((arr, item) => {
                    if (this.checkedDocs.includes(item.fileId)) {
                        arr.push({
                            fileId: item.fileId,
                            fileVersion: item.fileVersion
                        })
                    }
                    return arr
                }, [])

                this.getFile(fileList, this.docData, this.moduleCode)
            }
        },
        /* 多文件复制 */
        filesCopy() {
            this.$refs.docMove.open(this.checkedDocs, 'copy')
        },
        /* 多文件移动 */
        filesMove() {
            this.$refs.docMove.open(this.checkedDocs, 'move')
        },
        /* 打开详情弹框 */
        lookDetail(data) {
            this.$refs.docDialog.open(data)
        },
        /* 全选 */
        handleCheckAll(event) {
            this.checkedDocs = event.target.checked ? this.canCheck : []
            this.isIndeterminate = false
        },
        /* 多选 */
        handleCheck(value) {
            let len = value.length
            this.checkAll = len === this.canCheck.length
            this.isIndeterminate = len > 0 && len < this.canCheck.length
        },
        closeToolStrip() {
            this.checkedDocs = []
            this.checkAll = false
        },
        /* 省略号 */
        clampInit() {
            $('.knowledgeBase .docDes').each((index, ele) => {
                $clamp(ele, {
                    clamp: 2
                })
            })
        },
        /* 操作下拉框 */
        handleCommand(command, event) {
            let { action, fileId } = command
            switch (action) {
                case 'move':
                    this.$refs.docMove.open([fileId], 'move')
                    break
                case 'copy':
                    this.$refs.docMove.open([fileId], 'copy')
                    break
                case 'download':
                    let { fileVersion } = command
                    this.fileDownload(fileId, fileVersion)
                    break
                case 'delete':
                    this.fileDelete(fileId)
                    break
                default:
                    break
            }
        },
        /* 进入不同的目录 */
        folderChange(id, name) {
            this.isSearch = false
            this.nowFolder.folderId = id
            id = id.toString()
            let index = this.navList.id.indexOf(id)
            let len = this.navList.id.length
            if (index >= 0) {
                this.navList.id.splice(index, len - index)
                this.navList.name.splice(index, len - index)
            }
            this.navList.id.push(id)
            this.navList.name.push(name)
            this.nowFolder.folderPath = `/${this.navList.id.join('/')}`
            this.nowFolder.showPath = this.navList.name.join('/')

            this.pageInit()
        },
        /* 点击分页 */
        changePage(i) {
            this.page.now = i
            this.reloadPuDoc()
        },
        /* 搜索 */
        handleSearch() {
            let keyWords = trim(this.wildCardWords, '')
            if (keyWords == '') {
                this.docData = []
                this.page.total = 0
            } else {
                this.isSearch = true
                let data = {
                    wildCardWords: keyWords
                }

                let index = this.navList.id.indexOf('MY_SEARCH_FLAG')

                if (index < 0) {
                    this.navList.id.push('MY_SEARCH_FLAG')
                    /* 搜索 */
                    this.navList.name.push(this.$t('mxpcweb.document.knowledgebase.1529393737693'))
                }

                this.getData(data)
            }
        },

        /* 页面进入时展示我的文档数据 */
        pageInit() {
            this.getData()
        },
        /* 获取搜索或者初始化数据 */
        getData(initData = {}) {
            var url = this.Global.baseURL + this.Global.api.v2.folders_files
            this.isLoading = true
            let params = Object.assign({
                folderSource: 1,
                folderId: this.nowFolder.folderId,
                docType: this.nowType,
                pageN: this.page.now,
                pageSize: this.page.size,
                moduleCode: this.moduleCode,
                params: 'w_40,h_40,m_fill'
            },
                initData
            )

            this.docData = []
            let data = {
                params,
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
                        this.docData = res.body.data.list || []
                        this.page.total = res.body.data.totalNum || 0
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                    this.isLoading = false
                })
                .catch(err => {
                    if (err.status == 0) {
                        return false
                    }

                    this.isLoading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        async fileLike(item) {
            if (this.isLikeSaving) {
                return false
            }
            this.isLikeSaving = true
            let { fileId, fileVersion } = item
            if (item.isLike) {
                let flag = await this.deleteInteract({ fileId, dataType: 'likes' })
                if (flag) {
                    item.isLike = false
                    item.likeNum = item.likeNum - 1
                }
            } else {
                let flag = await this.addInteract({ fileId, fileVersion, dataType: 'likes' })
                if (flag) {
                    item.isLike = true
                    item.likeNum = item.likeNum + 1
                }
            }
            this.isLikeSaving = false
        },
        async fileSubscription(item) {
            if (this.isSubscriptionSaving) {
                return false
            }
            this.isSubscriptionSaving = true
            let { fileId, fileVersion } = item
            if (item.isSubscribe) {
                let flag = await this.deleteInteract({ fileId, dataType: 'subscriptions' })
                if (flag) {
                    item.isSubscribe = false
                    item.subscribeNum = item.subscribeNum - 1
                }
            } else {
                let flag = await this.addInteract({ fileId, fileVersion, dataType: 'subscriptions' })
                if (flag) {
                    item.isSubscribe = true
                    item.subscribeNum = item.subscribeNum + 1
                }
            }
            this.isSubscriptionSaving = false
        },
        async addInteract(data) {
            let flag = false
            try {
                let url = this.Global.baseURL + this.Global.api.v2.folders_fileInteraction
                let res = await this.$http.post(url, data)
                if (res.body.code.toString() == this.Global.RES_OK) {
                    flag = true
                } else {
                    this.$message.error(this.msg(res.body))
                    flag = false
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
                flag = false
            }
            return flag
        },
        async deleteInteract(body) {
            let flag = false
            try {
                let url = this.Global.baseURL + this.Global.api.v2.folders_fileInteraction
                let res = await this.$http.delete(url, { body })
                if (res.body.code.toString() == this.Global.RES_OK) {
                    flag = true
                } else {
                    this.$message.error(this.msg(res.body))
                    flag = false
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
                flag = false
            }
            return flag
        },
        fileComment(item) {
            this.$refs.docComment.open(item)
        },
        routerChange() {
            if (this.$route.path == '/main/document/knowledgebase' || this.$route.path == '/main/document/knowledgebase/') {
                this.reloadPuDoc()
            }
        }
    },
    watch: {
        $route() {
            this.routerChange()
        },
        /* 切换类型 */
        nowType() {
            this.page.now = 1
            this.reloadPuDoc()
        },
        /*  */
        docData() {
            this.checkAll = false
            this.checkedDocs = []
            this.canCheck = this.docData
                .filter(value => !value.isFolder)
                .map(value => value.fileId)
        },
        nowFolder() {
            this.navList.name = this.nowFolder.showPath.split('/')
            this.navList.id = this.nowFolder.folderPath.replace(/\//, '', '$1').split('/')
        }
    },
    components: {
        'no-data': NoData,
        'loading': Loading,
        'doc-detail': DocDetail,
        'folder-tools': FolderTools,
        'doc-preview': DocPreview,
        'doc-move': DocMove,
        'doc-comment': DocComment
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
