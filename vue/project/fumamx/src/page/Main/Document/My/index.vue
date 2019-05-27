<template>
    <div class="My">
        <div class="searchBox">
            <div class="searchStrip clearfix">
                <template v-for="(v,i) in navList.id">
                    <p :key="'s'+i" v-if="i!=navList.id.length-1" class="pull-left  pageName canClick" @click="folderChange(v,navList.name[i])">
                        {{navList.name[i]}}
                    </p>
                    <span :key="'d'+i" v-if="i!=navList.id.length-1" class="pull-left pageName iconfont icon-page-right">
                    </span>
                    <p :key="'f'+i" v-if="i==navList.id.length-1" class="pull-left  pageName">
                        {{navList.name[i]}}
                    </p>
                </template>
                <div class="pull-right searchInput">
                    <!-- 在 我的文档 中搜索 -->
                    <input :placeholder="$t('mxpcweb.document.my.1529377254191')" v-model="wildCardWords" @keyup.enter="handleSearch" />
                    <i class="iconfont icon-search"></i>
                </div>
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
                    <el-button class="uploadBtn" @click="openWindow" :disabled="isSearch">{{$t('mxpcweb.document.my.1529377352001')}}
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
                            <div class="itemName">{{$t('mxpcweb.document.my.1529377851808')}}</div>
                            <!-- 更新时间 -->
                            <div class="itemDate">{{$t('mxpcweb.document.my.1529377900154')}}</div>
                            <!-- 大小 -->
                            <div class="itemSize">{{$t('mxpcweb.document.my.1529377901742')}}</div>
                            <!-- 上传者 -->
                            <div class="itemPeople">{{$t('mxpcweb.document.my.1529377902221')}}</div>
                        </li>
                        <el-checkbox-group v-model="checkedDocs" @change="handleCheck">
                            <template v-for="(value, index) in docData">
                                <li v-if="value.isFolder" @click="folderChange(value.folderId,value.folderName)" class="clearfix myTableBody" :key="'a'+index">
                                    <div class="itemName">

                                        <div class="iconBox">
                                            <span class="iconfont icon-folder-solid"></span>
                                        </div>
                                        <div class="contentBox">
                                            <p class="docTitle">{{value.folderName}}</p>
                                            <!--  <div class="docDes"></div> -->
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
                                            <!-- 重命名 -->
                                            <el-tooltip v-if="!isStaff" :content="$t('mxpcweb.document.my.1529378061913')" placement="top" effect="light">
                                                <span class="iconfont icon-edit" @click.stop="folderReanme(value.folderId,value.folderType)"></span>
                                            </el-tooltip>
                                            <!-- 删除文件夹 -->
                                            <el-tooltip v-if="!isStaff" :content="$t('mxpcweb.document.my.1529378063605')" placement="top" effect="light">
                                                <span class="iconfont icon-del" @click.stop="folderDelete(value.folderId,value.folderName,value.folderType)"></span>
                                            </el-tooltip>
                                        </div>
                                    </div>
                                </li>

                                <li v-if="!value.isFolder " :key="'b'+ index " class="clearfix myTableBody">
                                    <div class="itemName ">
                                        <el-checkbox class="liSelect " :label="value.fileId"></el-checkbox>
                                        <div class="iconBox">
                                            <img v-if="hasImage(value)" class="imgIcon" v-imgsrc="value.preViewImageUrl" />
                                            <svg v-else class="iconSVG" aria-hidden="true">
                                                <use :xlink:href="setFileIcon(value.fileExtName)"></use>
                                            </svg>
                                        </div>

                                        <div class="contentBox ">
                                            <p class="docTitle ellipsis ">
                                                <span @click="filePreview(index)" class="text-hover" v-html="`${value.fileName}.${value.fileExtName}`"></span>
                                            </p>

                                            <div class="docDes" v-html="value.content"></div>
                                        </div>
                                    </div>
                                    <div class="itemDate ">
                                        <div class="contentBox ">
                                            {{value.modifyDate}}
                                        </div>

                                    </div>
                                    <div class="itemSize ">
                                        <div class="contentBox ">
                                            {{ byteCalc(value.fileSize)}}
                                        </div>
                                    </div>
                                    <div class="itemPeople ">
                                        <div class="contentBox " v-html="value.createRealName">
                                        </div>
                                        <div class="funBox ">
                                            <!--  版本管理 -->
                                            <el-tooltip :content="$t('mxpcweb.document.global.1535960310606')" placement="top" effect="light">
                                                <span class="iconfont icon-sheet" @click="lookDetail(value) "></span>
                                            </el-tooltip>
                                            <!-- 下载 -->
                                            <!--  <el-tooltip :content="$t('mxpcweb.document.my.1529378291446')" placement="top" effect="light">
                                                <span class="iconfont icon-download-u" @click="fileDownload(value.fileId,value.fileVersion)"></span>
                                            </el-tooltip> -->
                                            <!--  预览 -->
                                            <!--   <el-tooltip :content="$t('mxpcweb.document.my.1529378291653')" placement="top" effect="light">
                                                <span class=" iconfont icon-eye " @click="filePreview(index)"></span>
                                            </el-tooltip> -->
                                            <!--   删除 -->
                                            <!--   <el-tooltip :content="$t('mxpcweb.document.my.1529378292325')" placement="top" effect="light">
                                                <span class="iconfont icon-del " @click="fileDelete(value.fileId)"></span>
                                            </el-tooltip> -->
                                            <el-dropdown trigger="hover" @command="handleCommand">
                                                <span class="el-dropdown-link">
                                                    <i class="iconfont icon-more"></i>
                                                </span>
                                                <el-dropdown-menu slot="dropdown">
                                                    <el-dropdown-item :command="{action:'move',fileId:value.fileId}">移动</el-dropdown-item>
                                                    <el-dropdown-item :command="{action:'copy',fileId:value.fileId}">复制</el-dropdown-item>
                                                    <el-dropdown-item :command="{action:'download',fileId:value.fileId,fileVersion:value.fileVersion}" divided>下载</el-dropdown-item>
                                                    <el-dropdown-item :command="{action:'delete',fileId:value.fileId}" divided>删除</el-dropdown-item>
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
                            <!-- '处理中':'下载' -->
                            <i class="toolIcon" :class="[fileIsPack?'el-icon-loading':'icon-download-u iconfont']"></i>
                            {{fileIsPack?$t('mxpcweb.document.my.1529378576894'):$t('mxpcweb.document.my.1529378291446')}}
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
                            <i class="toolIcon iconfont icon-del"></i>
                            {{$t('mxpcweb.document.my.1529378292325')}}
                        </span>
                        <span class="toolItem clearfix pull-right" @click="closeToolStrip()">
                            <i class="toolIcon iconfont icon-close"></i>
                        </span>
                    </div>
                </div>
            </transition>

            <!-- 没有记录 -->
            <transition name="el-fade-in">
                <no-data v-show="docData.length<=0&&!isLoading" :title="$t('mxpcweb.document.my.1529378655595')" class="noDataBox"></no-data>

            </transition>
        </div>
        <!--文档弹框 -->
        <doc-detail ref="docDialog"></doc-detail>
        <!-- 文件夹修改 -->
        <folder-tools ref="renameDialogref"></folder-tools>
        <doc-preview ref="filePreview"></doc-preview>
        <doc-move ref="docMove" @success="docMoveSuccess"></doc-move>
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
export default {
    name: 'My',
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
            staff: {},
            nowFolder: {
                folderId: 2,
                folderPath: '/2',
                /* 我的文档 */
                showPath: this.$t('mxpcweb.document.my.1529378750219')
            },
            navList: {
                id: ['2'],
                /* 我的文档 */
                name: [this.$t('mxpcweb.document.my.1529378750219')]
            },
            moduleCode: 'DC002',
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
            isIndeterminate: false

        }
    },
    created() {
        this.pageInit()
    },
    computed: {
        isStaff() {
            return Object.keys(this.staff).length > 0
        }
    },
    mounted() {
        this.clampInit()
        let _this = this
        ep.tail('getMyDoc', function (data) {
            _this.reloadMyDoc()
        })
        ep.tail('changeMyFolder', function (nowFolder) {
            nowFolder = nowFolder || {
                folderId: 2,
                folderPath: '/2',
                /* 我的文档 */
                showPath: _this.$t('mxpcweb.document.my.1529378750219')
            }
            _this.isSearch = false
            _this.staff = {}
            _this.nowFolder = Object.assign({}, nowFolder)
            _this.pageInit()
        })
        /* 目录回退 */
        ep.tail('delBackMyFolder', function (delFolder) {
            let index = _this.navList.id.indexOf(delFolder.folderId.toString())
            if (index >= 0) {
                let id = _this.navList.id[index - 1]
                let name = _this.navList.name[index - 1]
                _this.folderChange(id, name)
            }
        })
        ep.tail('reNameMyFolder', function (newFolder) {
            let index = _this.navList.id.indexOf(newFolder.folderId.toString())
            if (index >= 0) {
                _this.navList.name.splice(index, 1, newFolder.folderName)
            } else {
                _this.reloadMyDoc()
            }
        })
        ep.tail('toMyStaffFolder', function (staff) {
            _this.isSearch = false
            _this.staff = staff
            _this.nowFolder = Object.assign({}, {
                folderId: 2,
                folderPath: '/2',
                /* XX的文档 */
                showPath: _this.$t('mxpcweb.document.my.1529378849631', [staff.realName])
            })

            _this.pageInit()
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
            let _this = this
            let data = {
                url: _this.Global.api.v2.folders_files,
                fileSource: 2,
                folderId: this.nowFolder.folderId,
                moduleCode: this.moduleCode,
                folderPath: this.nowFolder.folderPath,
                remarks: '',
                fn(res) {
                    if (res.code.toString() == _this.Global.RES_OK) {
                        _this.reloadMyDoc()
                    } else {
                        _this.$message.error(res.msg)
                    }
                }
            }
            this._dataAddStaffId(data)
            ep.emit('selectFile', data)
        },

        _dataAddStaffId(data) {
            if (this.isStaff) {
                data['staffId'] = this.staff.ctId
            }
        },
        filePreview(index) {
            this.$refs.filePreview.open(this.docData, index)
        },
        /* 移动或复制成功 */
        docMoveSuccess() {
            this.reloadMyDoc()
        },
        /* 文件修订完成触发 */
        reloadMyDoc() {
            if (this.isSearch) {
                this.handleSearch()
            } else {
                this.pageInit()
            }
        },
        folderReanme(folderId, folderType) {
            let _this = this
            this.$refs.renameDialogref.put({
                targetFolderId: folderId,
                folderType: folderType,
                moduleCode: this.moduleCode
            }, function () {
                _this.reloadMyDoc()
                ep.emit('getMyFolders')
            })
        },
        folderDelete(folderId, folderName, folderType) {
            let _this = this
            let cbfn = function () {
                _this.reloadMyDoc()
                ep.emit('getMyFolders')
            }
            this.deleteFolder(folderId, folderName, folderType, this.moduleCode, cbfn)
        },

        fileDelete(fileId) {
            let _this = this
            let arr = []
            arr.push(fileId)
            this.deleteFile(arr, this.moduleCode, function () {
                _this.reloadMyDoc()
            })
        },
        /* 多文件删除 */
        filesDelete() {
            let _this = this
            this.deleteFile(this.checkedDocs, this.moduleCode, function () {
                _this.reloadMyDoc()
            })
        },
        /* 多文件复制 */
        filesCopy() {
            this.$refs.docMove.open(this.checkedDocs, 'copy')
        },
        /* 多文件移动 */
        filesMove() {
            this.$refs.docMove.open(this.checkedDocs, 'move')
        },
        /* 右上下载按钮会下载选中的文件 */
        filesDownload() {
            if (this.checkedDocs.length <= 0) {
                /* '没有选择文件' */
                let c = this.$t('mxpcweb.document.my.1529379033175')
                /* '提示'  */
                let t = this.$t('mxpcweb.document.my.1529379046903')
                /* '确定' */
                let b = this.$t('mxpcweb.document.my.1529379061343')
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

        fileDownload(fileId, fileVersion) {
            this.getFile([{ fileId, fileVersion }], this.docData, this.moduleCode)
        },

        lookDetail(data) {
            let { ctId } = this.staff
            this.$refs.docDialog.open(data, ctId)
        },
        handleCheckAll(event) {
            this.checkedDocs = event.target.checked ? this.canCheck : []
            this.isIndeterminate = false
        },
        handleCheck(value) {
            let len = value.length
            this.checkAll = len === this.canCheck.length
            this.isIndeterminate = len > 0 && len < this.canCheck.length
        },
        closeToolStrip() {
            this.checkedDocs = []
            this.checkAll = false
        },

        clampInit() {
            $('.My .docDes').each((index, ele) => {
                $clamp(ele, {
                    clamp: 2
                })
            })
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

        /* 点击分页 */
        changePage(i) {
            this.page.now = i
            if (this.isSearch) {
                this.handleSearch()
            } else {
                this.pageInit()
            }
        },
        handleSearch() {
            let keyWords = trim(this.wildCardWords, '')
            if (keyWords === '') {
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
                    this.navList.name.push(this.$t('mxpcweb.document.my.1529390537853'))
                }

                this.getData(data)
            }
        },

        /* 页面进入时展示我的文档数据 */
        pageInit() {
            this.getData()
        },
        getData(initData = {}) {
            var url = this.Global.baseURL + this.Global.api.v2.folders_files
            this.isLoading = true
            this._dataAddStaffId(initData)
            let params = Object.assign({
                folderSource: 2,
                folderId: this.nowFolder.folderId,
                docType: this.nowType,
                pageN: this.page.now,
                pageSize: this.page.size,
                moduleCode: this.moduleCode,
                params: 'w_40,h_40,m_fill'
            }, initData)

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
        routerChange() {
            if (this.$route.path == '/main/document/my' || this.$route.path == '/main/document/my/') {
                this.reloadMyDoc()
            }
        }
    },
    watch: {
        $route() {
            this.routerChange()
        },
        nowType() {
            this.page.now = 1
            this.reloadMyDoc()
        },
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
        'doc-move': DocMove
    }
}

</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
