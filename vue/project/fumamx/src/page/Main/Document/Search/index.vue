<template>
    <div class="Search" id="doc_search">

        <div class="SearchBox">
            <div class="SearchInput">
                <input type="text" :placeholder="$t('mxpcweb.document.search.1528970289293')" class="Input" v-model="wildCardWords" @keyup.enter="searchFn">
                <el-button class="SearchButton" type="primary" icon="search" @click="searchFn">{{$t('mxpcweb.document.search.1528975003884')}}</el-button>
            </div>
            <div class="searchCondition">
                <span v-for="(item,key) in  typeList" :class="{action:(key===nowType)}" @click="changeType(key)" :key="key">
                    {{item}}
                </span>
            </div>
        </div>

        <div v-loading="isLoading" class="selectRes">
            <!-- 搜索结果 -->
            <transition name="el-fade-in-linear">
                <div v-show="!isLoading&&docData.length>0">
                    <!-- 标题 -->
                    <!-- 共 x 个结果 -->
                    <p class="title" v-html="$t('mxpcweb.document.search.1529031844624',[page.total])">

                    </p>
                    <!-- 列表 -->
                    <ul class="selectList MXscroll">
                        <li class="myTableHeader clearfix">
                            <!-- 名称 -->
                            <div class="itemName">{{$t('mxpcweb.document.search.1528974915070')}}</div>
                            <!-- 更新时间 -->
                            <div class="itemDate">{{$t('mxpcweb.document.search.1528974638239')}}</div>
                            <!-- 大小 -->
                            <div class="itemSize">{{$t('mxpcweb.document.search.1528974640196')}}</div>
                            <!-- 上传者 -->
                            <div class="itemPeople">{{$t('mxpcweb.document.search.1528974657916')}}</div>
                        </li>

                        <li v-for="(value,index) in docData" :key="index" class="myTableBody">
                            <div class="itemName">
                                <div class="iconBox">
                                    <img v-if="hasImage(value)" class="imgIcon" v-imgsrc="value.preViewImageUrl" />
                                    <svg v-else class="iconSVG" aria-hidden="true">
                                        <use :xlink:href="setFileIcon(value.fileExtName)"></use>
                                    </svg>
                                </div>

                                <div class="contentBox ">
                                    <p class="docTitle ellipsis">
                                        <span @click="filePreview(index)" class="text-hover" v-html="`${value.fileName}.${value.fileExtName}`"></span>
                                    </p>

                                    <div class="docDes" v-html="value.content"></div>
                                    <span>{{fileFrom(value.fileSource)}}</span>

                                    <span v-if="value.fileSource==3">
                                        <!-- 来自客户 -->
                                        {{$t('mxpcweb.document.search.1528975085766')}}：
                                        <span class="canCkickTo" @click="toClientOrMail(value)">{{value.billName}}</span>
                                    </span>
                                    <span v-if="value.fileSource==4">
                                        <!-- 来自邮件  -->
                                        {{$t('mxpcweb.document.search.1528975085550')}}：
                                        <span class="canCkickTo" @click="toClientOrMail(value)">{{value.subject}}</span>
                                    </span>
                                    <div v-if="isVideo(value)">
                                        <!-- 封面  ：设置封面 -->
                                        {{$t('mxpcweb.document.search.1528975085325')}}：
                                        <el-button type="primary" size="mini" @click="uploadVideoImg(value)">{{$t('mxpcweb.document.search.1528975083425')}}</el-button>

                                    </div>

                                </div>

                            </div>

                            <div class="itemDate">
                                <div class="contentBox ">
                                    {{value.modifyDate}}
                                </div>
                            </div>
                            <div class="itemSize ">
                                <div class="contentBox ">
                                    {{ byteCalc(value.fileSize)}}
                                </div>
                            </div>
                            <div class="itemPeople">
                                <div class="contentBox" v-html="value.createRealName">
                                </div>
                                <div class="funBox">
                                    <!-- 版本管理 -->
                                    <el-tooltip :content="$t('mxpcweb.document.global.1535960310606')" placement="top" effect="light">
                                        <i v-if="value.moduleCode!='EM001'" @click="lookDetail(value)" class="iconfont icon-sheet"></i>
                                    </el-tooltip>
                                    <!-- 下载 -->
                                    <el-tooltip :content="$t('mxpcweb.document.search.1528975314800')" placement="top" effect="light">
                                        <i @click="fileDownload(value.fileId,value.fileVersion,value.moduleCode) " class="iconfont icon-download "></i>
                                    </el-tooltip>
                                    <!-- 预览 -->
                                    <!--  <el-tooltip :content="$t('mxpcweb.document.search.1528975316917')" placement="top" effect="light">
                                        <i class="iconfont icon-eye" @click="filePreview(index)"></i>
                                    </el-tooltip> -->
                                </div>

                            </div>
                        </li>

                    </ul>
                    <!-- 分页 -->
                    <div class="paging" v-show="page.total>page.size">
                        <el-pagination @current-change="changePage" background layout="total, prev, pager, next" :page-size="page.size" :total="page.total">
                        </el-pagination>
                    </div>
                </div>
            </transition>
            <!-- 没有记录 -->
            <transition name="el-fade-in-linear">
                <no-data v-show="docData.length<=0&&!isLoading" :title="tishi" class="noDataBox"></no-data>
            </transition>
        </div>

        <!--文档弹框 -->
        <doc-detail ref="docDialog"></doc-detail>
        <doc-preview ref="filePreview"></doc-preview>
    </div>
</template>

<script>
import { trim } from '@/libs/utils.js'
import NoData from '@/basecomponents/NoData/index'
import Loading from '@/basecomponents/Loading/index'
import DocDetail from '@/components/DocDetail/index'
import DocPreview from '@/components/DocPreview/index'
import { byteCalc, setFileIcon, getFile, hasImage, isVideo } from './../Vue/docUtils.js'
export default {
    name: 'Search',

    props: {

    },
    data() {
        return {
            isLoading: false,

            noData: true,
            docData: [],
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

            wildCardWords: '',
            page: {
                size: 10,
                now: 1,
                total: 0
            },
            /* 请使用上方的“搜索”功能查找文档 */
            tishi: this.$t('mxpcweb.document.search.1528976654314'),
            previousRequest: null
        }
    },
    created() { },
    mounted() {
        this.clampInit()
    },
    updated() {
        this.clampInit()
    },
    computed: {},
    methods: {
        byteCalc,
        setFileIcon,
        getFile,
        hasImage,
        isVideo,
        /* 文件来源 */
        fileFrom(fileSource) {
            let from = ''
            switch (fileSource) {
                case 1:
                    /* 知识库 */
                    from = this.$t('mxpcweb.document.search.1528976755460')
                    break
                case 2:
                    /* 我的文档 */
                    from = this.$t('mxpcweb.document.search.1528976762222')
                    break
                case 3:
                    /* 客户附件 */
                    from = this.$t('mxpcweb.document.search.1528976763547')
                    break
                case 4:
                    /* 邮件附件 */
                    from = this.$t('mxpcweb.document.search.1528976765954')
                    break
            }
            return from
        },
        /* 跳转到客户||邮件 */
        toClientOrMail(item) {
            this.clientDetailPage(item)
        },
        /* 视频封面上传 */
        uploadVideoImg(item) {
            let _this = this
            let data = {
                url: _this.Global.api.v2.folders_preViewImage,
                fileId: item.fileId,
                moduleCode: item.moduleCode,
                fn(res) {
                    if (res.code.toString() == _this.Global.RES_OK) {
                        _this.pageInit()
                    } else {
                        _this.$message.error(res.msg)
                    }
                }
            }
            ep.emit('selectFile', data)
        },
        /*  */
        lookDetail(data) {
            this.$refs.docDialog.open(data)
        },
        /* 文件预览 */
        filePreview(index) {
            this.$refs.filePreview.open(this.docData, index)
        },

        /* 点击搜索框下面的类型切换类型 */
        changeType(key) {
            this.nowType = key
            this.page.now = 1
            this.pageInit()
        },
        /* 点击分页 */
        changePage(i) {
            this.page.now = i
            this.pageInit()
        },

        /* 输入框 */
        searchFn() {
            let keyWords = trim(this.wildCardWords, '')
            if (keyWords === '') {
                /* '输入内容无效' */
                let c = this.$t('mxpcweb.document.search.1528977116266')
                /* 提示 */
                let t = this.$t('mxpcweb.document.search.1528977118073')
                /* 确定 */
                let b = this.$t('mxpcweb.document.search.1528977118289')
                this.$alert(c, t, {
                    confirmButtonText: b,
                    callback: action => {
                        this.wildCardWords = ''
                    }
                })
                return
            }
            this.pageInit()
        },
        /* 搜索的方法 */
        pageInit() {
            if (trim(this.wildCardWords, '') == '') {
                this.docData = []
                this.page.total = 0
                return
            }
            this.isLoading = true
            let url = this.Global.baseURL + this.Global.api.v2.folders_files
            let imgParams = 'w_70,h_70,m_fill'
            /*  if (this.typeList[this.nowType] == 'ALL') {
                       imgParams = "w_70,h_70,m_fill";
                   }
                   if (this.typeList[this.nowType] == 'PIC') {
                       imgParams = "w_70,h_70,m_fill";
                   }
                   if (this.typeList[this.nowType] == 'VIDEO') {
                       imgParams = "w_70,h_70,m_fill";
                   } */

            this.docData = []

            let data = {
                params: {
                    docType: this.nowType,
                    pageN: this.page.now,
                    folderSource: 0,
                    pageSize: this.page.size,
                    wildCardWords: this.wildCardWords,
                    params: imgParams
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
        fileDownload(fileId, fileVersion, moduleCode) {
            this.getFile([{ fileId, fileVersion }], this.docData, moduleCode)
        },
        clampInit() {
            $('#doc_search .docDes').each((index, ele) => {
                $clamp(ele, {
                    clamp: 2
                })
            })
        },
        routerChange() {
            if (this.$route.path == '/main/document/search' || this.$route.path == '/main/document/search/') {
                if (trim(this.wildCardWords, '') != '') {
                    this.pageInit()
                }
            }
        }
    },

    watch: {
        $route() {
            this.routerChange()
        },
        docData() {
            if (this.docData.length == 0) {
                /* 换个关键字试试~ */
                this.tishi = this.$t('mxpcweb.document.search.1528976926628')
            }
        }
    },
    components: {
        'no-data': NoData,
        'loading': Loading,
        'doc-detail': DocDetail,
        'doc-preview': DocPreview
    }
}

</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
