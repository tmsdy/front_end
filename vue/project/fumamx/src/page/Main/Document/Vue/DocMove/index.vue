<template>
    <div class="DocMove">
        <!-- 选择目录 -->
        <el-dialog :title="$t('mxpcweb.document.global.1532682773083')" :visible.sync="isOpen" v-dialogDrag>
            <div class="tabBox">
                <ul class="clearfix">
                    <li @click="changeType(0)" :class="{active:tabIndex==0}">{{$t('mxpcweb.document.my.1529378750219')}}</li>
                    <li @click="changeType(1)" :class="{active:tabIndex==1}">{{$t('mxpcweb.document.knowledgebase.1529393553678')}}</li>
                </ul>
            </div>
            <div class="docNav">
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
            </div>
            <div class="listBox">
                <transition name="el-fade-in-linear">
                    <ul v-show="!isLoading&&(docData.length>0)" class='resList MXscroll'>

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

                                <div class="itemSize ">
                                    <div class="contentBox ">

                                    </div>
                                </div>
                                <div class="itemFun">
                                    <div class="contentBox  iconfont icon-page-right">

                                    </div>
                                </div>

                            </li>

                            <li v-if="!value.isFolder " :key="index " class="clearfix myTableBody">

                                <div class="itemName ">

                                    <div class="iconBox">
                                        <img v-if="hasImage(value)" class="imgIcon" v-imgsrc="value.preViewImageUrl" />
                                        <svg v-else class="iconSVG" aria-hidden="true">
                                            <use :xlink:href="setFileIcon(value.fileExtName)"></use>
                                        </svg>
                                    </div>

                                    <div class="contentBox ">
                                        <p class="docTitle ellipsis " v-html="`${value.fileName}.${value.fileExtName}` "></p>

                                        <div class="docDes " v-html="value.content"></div>
                                    </div>
                                </div>

                                <div class="itemSize">
                                    <div class="contentBox">
                                        {{ byteCalc(value.fileSize)}}
                                    </div>
                                </div>
                                <div class="itemFun">
                                    <div class="contentBox">
                                        <!--    <el-checkbox class="liSelect " :label="value.fileId+'&&&&'+value.fileVersion"></el-checkbox> -->
                                    </div>
                                </div>
                            </li>
                        </template>

                    </ul>
                </transition>
                <transition name="el-fade-in-linear">
                    <loading v-show="isLoading" class="loadingBox"></loading>
                </transition>
                <!-- 没有记录 -->
                <transition name="el-fade-in">
                    <no-data v-show="docData.length<=0&&!isLoading" :title="$t('mxpcweb.document.my.1529378655595')" class="noDataBox"></no-data>
                </transition>
            </div>
            <div slot="footer" class="dialog-footer clearfix">
                <el-button class="pull-left" v-if="navList.name.length != 1" @click="cancel()">{{cancelShow}}</el-button>
                <!--分页 -->
                <transition name="el-fade-in-linear">
                    <div class="paging pull-left" v-show="page.total>page.size&&!isLoading">
                        <el-pagination @current-change="changePage" background layout="total,prev, pager, next" :page-size="page.size" :current-page="page.now" :total="page.total">
                        </el-pagination>
                    </div>
                </transition>
                <!-- 保存到 {0} -->
                <el-button :disabled="isKRoot||noPower" :loading="isSaving" type="primary" @click="commit()">
                    {{commitShow}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
/**
 * 描述：移动复制功能
 * 作者：郭兵 / ***(API)
 * 时间：2018/08/24
 */
import Loading from '@/basecomponents/Loading/index.vue'
import NoData from '@/basecomponents/NoData/index'
import { byteCalc, setFileIcon, hasImage } from '../docUtils.js'
export default {
    name: 'DocMove',
    props: {},
    data() {
        return {
            isSaving: false,
            isLoading: false,
            noPower: false,
            isOpen: false, // 弹窗开关
            tabIndex: 0,
            moduleCode: ['DC002', 'DC001'],
            folderSource: [2, 1],
            page: {
                size: 10,
                now: 1,
                total: 0
            },

            nowFolder: {},

            navList: {},
            docData: [],

            previousRequest: '',
            type: '',
            fileIds: []

        }
    },

    computed: {
        cancelShow() {
            /* 取消   返回上一级 */
            return this.navList.name.length <= 1 ? this.$t('mxpcweb.document.global.1529397347341') : this.$t('mxpcweb.document.global.1532682356780')
        },
        commitShow() {
            if (this.type == 'move') {
                /* 移动到 xxx */
                return this.$t('mxpcweb.document.global.1535092189072', [this.navList.name[this.navList.name.length - 1]])
            }
            if (this.type == 'copy') {
                /* 复制到 xxx */
                return this.$t('mxpcweb.document.global.1535092237591', [this.navList.name[this.navList.name.length - 1]])
            }
        },
        isKRoot() {
            return this.navList.name.length == 1 && this.tabIndex == 1
        }
    },
    created() {
        this.initialize()
    },
    methods: {
        byteCalc,
        setFileIcon,
        hasImage,
        open(fileIds = [], type) {
            this.isOpen = true
            this.tabIndex = 0
            this.fileIds = fileIds
            this.type = type
            this.initialize()
            this.getData()
        },
        cancel() {
            if (this.navList.name.length == 1) {
                this.isOpen = false
            } else {
                let id = this.navList.id[this.navList.id.length - 2]
                let name = this.navList.name[this.navList.name.length - 2]
                this.folderChange(id, name)
            }
        },
        async commit() {
            let url, successTitle
            if (this.type == 'move') {
                url = this.Global.baseURL + this.Global.api.v2.folders_changeFolder
                successTitle = this.$t('mxpcweb.document.global.1529399221079')
            } else {
                url = this.Global.baseURL + this.Global.api.v2.folders_copyFile
                successTitle = this.$t('mxpcweb.document.global.1535096215386')
            }

            this.isSaving = true
            let flag = await this.moveOrCopy(url)
            this.isSaving = false
            if (flag) {
                this.$message.success(successTitle)
                this.isOpen = false
                if (this.type == 'move') {
                    this.$emit('success')
                }
            }
        },

        async moveOrCopy(url) {
            let flag = false

            let data = {
                targetFolderId: this.nowFolder.folderId,
                fileIds: this.fileIds
            }
            try {
                let res = await this.$http.put(url, data)
                if (res.body.code.toString() === this.Global.RES_OK) {
                    /* 移动成功 */
                    flag = true
                } else {
                    flag = false
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                flag = false
                this.$message.error(this.$t(this.Global.errorTitle))
            }

            return flag
        },

        initialize() {
            let nowFolderArr = [
                {
                    folderId: 2,
                    folderPath: '/2',
                    /* 我的文档 */
                    showPath: this.$t('mxpcweb.document.my.1529378750219')
                },
                {
                    folderId: 1,
                    folderPath: '/1',
                    /* 知识库 */
                    showPath: this.$t('mxpcweb.document.knowledgebase.1529393553678')
                }
            ]
            let navListArr = [
                {
                    id: ['2'],
                    /* 我的文档 */
                    name: [this.$t('mxpcweb.document.my.1529378750219')]
                },
                {
                    id: ['1'],
                    /* 知识库 */
                    name: [this.$t('mxpcweb.document.knowledgebase.1529393553678')]
                }
            ]

            this.nowFolder = Object.assign({}, nowFolderArr[this.tabIndex])
            this.navList = Object.assign({}, navListArr[this.tabIndex])

            this.page = {
                size: 10,
                now: 1,
                total: 0
            }
        },
        changeType(index) {
            this.tabIndex = index
            this.initialize()
            this.getData()
        },

        /* 点击分页 */
        changePage(i) {
            this.page.now = i
            this.getData()
        },
        /* 进入不同的目录 */
        folderChange(id, name) {
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

            this.getData()
        },
        /* 获取搜索或者初始化数据 */
        getData() {
            var url = this.Global.baseURL + this.Global.api.v2.folders_files
            this.isLoading = true
            this.noPower = false
            let params = {
                folderSource: this.folderSource[this.tabIndex],
                folderId: this.nowFolder.folderId,
                docType: 'ALL',
                pageN: this.page.now,
                pageSize: this.page.size,
                moduleCode: this.moduleCode[this.tabIndex],
                params: 'w_70,h_70,m_fill',
                optCode: 'otUpload'
            }

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
                        this.docData = res.body.data.list
                        this.page.total = res.body.data.totalNum
                    } else {
                        this.noPower = true
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
        }
    },
    watch: {

    },
    components: {
        'loading': Loading,
        'no-data': NoData
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
