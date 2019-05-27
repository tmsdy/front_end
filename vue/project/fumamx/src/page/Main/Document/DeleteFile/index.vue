<template>
    <div class="DeleteFile">
        <div class="searchBox">
            <div class="searchStrip clearfix">
                <!-- 已删除文件 -->
                <p v-if="!isSearch" class="pull-left  pageName">
                    {{$t('mxpcweb.document.deletefile.1529393838407')}}
                </p>
                <template v-if="isSearch">
                    <p class="pull-left  pageName canClick" @click="removeSearch">
                        <!--  已删除文件 -->
                        {{$t('mxpcweb.document.deletefile.1529393838407')}}
                    </p>
                    <span class="pull-left pageName iconfont icon-page-right">
                    </span>
                    <p class="pull-left  pageName">
                        <!--  搜索 -->
                        {{$t('mxpcweb.document.deletefile.1529393877894')}}
                    </p>
                </template>
                <p class="pull-right searchInput">
                    <!-- 在 已删除的文件 中搜索 -->
                    <input width :placeholder="$t('mxpcweb.document.deletefile.1529393933253')" v-model="wildCardWords" @keyup.enter="handleSearch" />
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
                            <div class="itemName">{{$t('mxpcweb.document.deletefile.1529393992221')}}</div>
                            <!-- 删除时间 -->
                            <div class="itemDate">{{$t('mxpcweb.document.deletefile.1529394016484')}}</div>
                            <!-- 大小 -->
                            <div class="itemSize">{{$t('mxpcweb.document.deletefile.1529394051502')}}</div>
                            <!-- 删除人 -->
                            <div class="itemPeople">{{$t('mxpcweb.document.deletefile.1529394084303')}}</div>
                        </li>
                        <el-checkbox-group v-model="checkedDocs" @change="handleCheck">

                            <li v-for="(value, index) in docData" :key="index" class="myTableBody clearfix">

                                <div class="itemName">

                                    <el-checkbox v-if="!value.isFolder" class="liSelect" :label="value.fileId"></el-checkbox>

                                    <div class="iconBox">
                                        <img v-if="hasImage(value)" class="imgIcon" v-imgsrc="value.preViewImageUrl" />
                                        <svg v-else class="iconSVG" aria-hidden="true">
                                            <use :xlink:href="setFileIcon(value.fileExtName)"></use>
                                        </svg>

                                    </div>

                                    <div class="contentBox">
                                        <p class="docTitle ellipsis" v-html="value.isFolder? value.folderName : `${value.fileName}.${value.fileExtName}`">
                                        </p>
                                        <div class="docDes" v-html="value.showPath"></div>
                                    </div>
                                </div>
                                <div class="itemDate">
                                    <div class="contentBox ">
                                        {{value.modifyDate}}
                                    </div>

                                </div>
                                <div class="itemSize ">
                                    <div class="contentBox ">
                                        {{value.isFolder?'-': byteCalc(value.fileSize)}}
                                    </div>
                                </div>
                                <div class="itemPeople ">
                                    <div class="contentBox " v-html="value.modifyRealName">

                                    </div>
                                    <div class="funBox">
                                        <!-- 还原 -->
                                        <el-tooltip :content="$t('mxpcweb.document.deletefile.1529394295877')" placement="top" effect="light">
                                            <span class="iconfont icon-reply" @click="value.isFolder?restoreFolder(value.folderId):restoreFile(value.fileId)"></span>
                                        </el-tooltip>
                                        <!-- 彻底删除 -->
                                        <el-tooltip :content="$t('mxpcweb.document.deletefile.1529394326637')" placement="top" effect="light">
                                            <span class="iconfont icon-del" @click="value.isFolder?realDelFolder(value.folderId):realDelFile(value.fileId)"></span>
                                        </el-tooltip>

                                    </div>
                                </div>
                            </li>
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
                        <span class="toolItem clearfix pull-left" @click="restoreFiles()">
                            <i class="toolIcon iconfont icon-reply"></i>
                            {{$t('mxpcweb.document.deletefile.1529394295877')}}
                            <!-- 还原 -->
                        </span>
                        <span class="toolItem clearfix pull-left" @click="realDelFiles()">
                            <i class="toolIcon iconfont icon-del"></i>
                            <!--  删除 -->
                            {{$t('mxpcweb.document.deletefile.1529394394741')}}
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
                <no-data v-show="docData.length<=0&&!isLoading" :title="$t('mxpcweb.document.deletefile.1529394431234')" class="noDataBox"></no-data>
            </transition>
        </div>

    </div>
</template>

<script>
import { trim } from '@/libs/utils.js'
import NoData from '@/basecomponents/NoData/index'
import Loading from '@/basecomponents/Loading/index.vue'
import { byteCalc, setFileIcon, hasImage } from './../Vue/docUtils.js'

export default {
    name: 'DeleteFile',
    data() {
        return {
            wildCardWords: '',
            isLoading: false,
            isSearch: false,
            nowType: 'ALL',
            typeList: Object.freeze({
                // 全部
                'ALL': this.$t('mxpcweb.document.search.1528978756232'),
                // 图片
                'PIC': this.$t('mxpcweb.document.search.1528978794960'),
                // 视频
                'VIDEO': this.$t('mxpcweb.document.search.1528978822479'),
                'DOC': 'DOC',
                'XLS': 'XLS',
                'PPT': 'PPT',
                'PDF': 'PDF'
            }),
            page: {
                size: 10,
                now: 1,
                total: 0
            },
            docData: [],
            checkedDocs: [],
            canCheck: [],
            checkAll: false,
            previousRequest: null,
            isIndeterminate: false
        }
    },
    created() {
        this.pageInit()
    },
    computed: {},
    mounted() {
        this.clampInit()
    },
    updated() {
        this.clampInit()
    },
    methods: {
        byteCalc,
        setFileIcon,
        hasImage,
        reloadDelDoc() {
            if (this.isSearch) {
                this.handleSearch()
            } else {
                this.pageInit()
            }
        },
        /* 回收站的文件还原   单个文件和多个文件 */
        restoreFile(fileId) {
            let data = { fileIds: [fileId] }
            this.restoreTools(data)
        },
        restoreFolder(folderId) {
            let data = { folderIds: [folderId] }
            this.restoreTools(data)
        },
        restoreFiles() {
            let fileIds = this.checkedDocs
            if (fileIds.length <= 0) {
                // 没有选择文件
                let c = this.$t('mxpcweb.document.deletefile.1529394507255')
                // 提示
                let t = this.$t('mxpcweb.document.deletefile.1529394523081')
                // 确定
                let b = this.$t('mxpcweb.document.deletefile.1529394541358')
                this.$alert(c, t, {
                    confirmButtonText: b
                })
            } else {
                let data = {
                    fileIds
                }
                this.restoreTools(data)
            }
        },
        restoreTools(data) {
            /* 还原文件 */
            let url = this.Global.baseURL + this.Global.api.v2.folders_recycleBinFile

            this.$http.put(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        /* 还原成功 */
                        this.$message.success(this.$t('mxpcweb.document.deletefile.1529394624684'))
                        this.reloadDelDoc()/* 刷新删除页面 */
                        ep.emit('getPuFolders') /* 刷新知识库列表 */
                        ep.emit('getMyFolders') /* 刷新我的文档列表 */
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                })
                .catch(err => {
                    this.$message.error(this.Global.erroTitle)
                })
        },
        /* 回收站的文件的彻底删除 */
        realDelFile(fileId) {
            let obj = { fileIds: [fileId] }
            this.realDelTools(obj)
        },
        realDelFolder(folderId) {
            let obj = { folderIds: [folderId] }
            this.realDelTools(obj)
        },
        realDelFiles() {
            let fileIds = this.checkedDocs
            if (fileIds.length <= 0) {
                /* 没有选择文件 */
                let c = this.$t('mxpcweb.document.deletefile.1529394507255')
                /* 提示 */
                let t = this.$t('mxpcweb.document.deletefile.1529394523081')
                /* 确定 */
                let b = this.$t('mxpcweb.document.deletefile.1529394541358')
                this.$alert(c, t, {
                    confirmButtonText: b
                })
            } else {
                let obj = {
                    fileIds
                }
                this.realDelTools(obj)
            }
        },
        async realDelTools(obj) {
            try {
                /* 此操作将永久删除该文件/文件夹, 是否继续? */
                let c = this.$t('mxpcweb.document.deletefile.1529394702854')
                /* 注意 */
                let t = this.$t('mxpcweb.document.deletefile.1529394729053')
                /* 确定 */
                let b = this.$t('mxpcweb.document.deletefile.1529394541358')
                /* 取消 */
                let n = this.$t('mxpcweb.document.deletefile.1529394770640')
                await this.$confirm(c, t, {
                    confirmButtonText: b,
                    cancelButtonText: n,
                    type: 'warning'
                })
                let url = this.Global.baseURL + this.Global.api.v2.folders_recycleBinFile
                let data = {
                    body: obj
                }
                this.$http.delete(url, data)
                    .then(res => {
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            /* 已删除 */
                            this.$message.success(this.$t('mxpcweb.document.deletefile.1529394796389'))
                            this.reloadDelDoc()
                        } else {
                            this.$message.error(this.msg(res.body))
                        }
                    })
                    .catch(err => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    })
            } catch (error) {
                /*  已取消删除 */
                this.$message.info(this.$t('mxpcweb.document.deletefile.1529394838229'))
            }
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
            $('.DeleteFile .docDes').each((index, ele) => {
                $clamp(ele, {
                    clamp: 2
                })
            })
        },

        /* 点击分页 */
        changePage(i) {
            this.page.now = i
            this.reloadDelDoc()
        },
        handleSearch() {
            let wildCardWords = trim(this.wildCardWords, '')
            if (wildCardWords === '') {
                /* 输入内容无效 */
                let c = this.$t('mxpcweb.document.deletefile.1529394876735')
                /* 提示 */
                let t = this.$t('mxpcweb.document.deletefile.1529394523081')
                /* 确定 */
                let b = this.$t('mxpcweb.document.deletefile.1529394541358')
                this.$alert(c, t, {
                    confirmButtonText: b,
                    callback: action => {
                        this.wildCardWords = ''
                    }
                })
            } else {
                this.isSearch = true
                this.pageInit({
                    wildCardWords: wildCardWords
                })
            }
        },
        /* 搜索返回 */
        removeSearch() {
            this.isSearch = false
            this.pageInit()
        },
        pageInit(searchdata = {}) {
            this.isLoading = true
            var url = this.Global.baseURL + this.Global.api.v2.folders_recycleBinFile
            let params = Object.assign({
                docType: this.nowType,
                pageN: this.page.now,
                pageSize: this.page.size,
                params: 'w_70,h_70,m_fill'
            },
                searchdata
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
            if (this.$route.path == '/main/document/deletefile' || this.$route.path == '/main/document/deletefile/') {
                this.reloadDelDoc()
            }
        }
    },
    watch: {
        $route() {
            this.routerChange()
        },
        nowType() {
            this.page.now = 1
            this.reloadDelDoc()
        },
        docData() {
            this.checkAll = false
            this.checkedDocs = []
            this.canCheck = this.docData
                .filter(value => !value.isFolder)
                .map(value => value.fileId)
        }

    },
    components: {
        loading: Loading,
        'no-data': NoData
    }
}

</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
