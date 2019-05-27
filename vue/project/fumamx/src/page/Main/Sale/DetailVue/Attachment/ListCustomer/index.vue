<template>
    <div class="ListCustomer">

        <loading v-if="isLoading" style="margin-top: 55px;"></loading>
        <!--  没有查到数据-->
        <no-data v-if="!isLoading && dataList.length===0" :title="$t('mxpcweb.client.detail.1529993941794')"></no-data>
        <table v-if="!isLoading && dataList.length>0">
            <thead>
                <tr>
                    <!-- 名称 -->
                    <td>{{$t('mxpcweb.client.detail.1529993556711')}}</td>
                    <!-- 更新时间 -->
                    <td>{{$t('mxpcweb.client.detail.1529993601257')}}</td>
                    <td>
                        <!-- 大小 -->
                        <div class="fileSize">{{$t('mxpcweb.client.detail.1529993637938')}}</div>
                    </td>
                    <!-- 上传者 -->
                    <td width="100" align='right'>{{$t('mxpcweb.client.detail.1529993665481')}}</td>
                </tr>
            </thead>
            <tr v-for="(item,index) in dataList" :key="index">
                <td>
                    <span class="icon">
                        <img v-if="isImage(item.fileExtName)" :src="item.preViewImageUrl">
                        <!--<i v-else class="iconfile" :class="checkIco(item.fileExtName)"></i>-->
                        <svg v-else class="iconSVG" aria-hidden="true">
                            <use :xlink:href="checkIco(item.fileExtName)"></use>
                        </svg>
                    </span>
                    <dl>
                        <dt v-html="item.fileName+'.'+item.fileExtName"></dt>
                        <dd>{{item.remarks}}</dd>
                    </dl>
                </td>
                <td><div class="updateTime">{{dateConver(item.createDate)}}</div></td>
                <td><div class="fileSize">{{getSize(item.fileSize)}}</div>
                </td>
                <td align="right">
                    <div class="auther">{{item.createRealName}}</div>
                </td>
                <div class="optBtn">
                    <!-- 详情 -->
                    <span @click="$emit('showDetail',item)" :title="$t('mxpcweb.client.detail.1529993364826')">
                        <i class="iconfont icon-multilayer"></i>
                    </span>
                    <!-- 下载 -->
                    <span @click="downloadItem(item.fileId)" :title="$t('mxpcweb.client.detail.1529993858368')">
                        <i class="iconfont icon-download"></i>
                    </span>
                    <!-- 预览 -->
                    <span @click="$emit('previewItem',dataList,index)" :title="$t('mxpcweb.client.detail.1529993875360')">
                        <i class="iconfont icon-eye"></i>
                    </span>
                    <!-- 删除 -->
                    <span @click="delItem(item.fileId,index)" :title="$t('mxpcweb.client.detail.1529993888369')">
                        <i class="iconfont icon-del"></i>
                    </span>
                </div>
            </tr>
        </table>

        <div class="pagination" :style="setPagination">
            <el-pagination v-if="totalNum > pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum"> </el-pagination>
        </div>

    </div>
</template>
<script>
import { isArray, isObject, isString, isHasSuffix, byteCalc } from '@/libs/utils.js'
import Loading from '@/basecomponents/Loading/index'
import NoData from '@/basecomponents/NoData/index'
export default {
    name: 'ListCustomer',
    props: {
        windowMode: {
            type: Boolean,
            default: false
        },
        itemId: {
            type: String,
            default: ''
        },
        moduleCode: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isLoading: true,
            isNoData: false,
            dataList: [],

            // 分页
            type: 'list',
            totalNum: 0,
            pageSize: 5,
            currentPage: 1,
            from: 0
        }
    },
    created() {
    },
    mounted() {
    },
    computed: {
        setPagination() {
            return this.windowMode ? 'left:auto;width:800px;' : ''
        }
    },
    methods: {
        // 判断是不是图片
        isImage(exe) {
            const imgArr = ['png', 'jpg', 'jpeg', 'gif', 'bmp']
            return imgArr.includes(exe.toLowerCase())
        },
        getSize(size) {
            return byteCalc(size)
        },
        checkIco(ico) {
            return '#file-' + isHasSuffix(ico)
        },
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.pageSize = val
            this.getTabData()// 获取数据
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.currentPage = val
            this.from = (this.currentPage - 1) * this.pageSize
            this.getTabData()// 获取数据
        },
        // 日期格式转换
        dateConver(date) {
            return this.timeShow_custom(date, 'YYYY-MM-DD HH:mm')
        },
        // 下载单项
        downloadItem(fileId) {
            let url = this.Global.baseURL + this.Global.api.v2.folders_fileDownloadV2
            let data = {
                params: {
                    fileId,
                    billId: this.itemId,
                    getRight: 0
                }
            }
            this.$http.get(url, data)
                .then(res => {
                    if (res.body.code.toString() === this.Global.RES_OK) {
                        let durl = this.Global.baseURL + this.Global.api.Files.all_download + '?src=' + encodeURIComponent(res.body.data.url)
                        this.downloadFile(durl)
                    }
                })
                .catch(res => {
                    this.$message.error(this.msg(res.body))
                })
        },
        // 删除单项
        delItem(fileId, index) {
            /* '此操作将永久删除, 是否继续?' */
            let c = this.$t('mxpcweb.client.detail.1529994328458')
            /* 提示 */
            let t = this.$t('mxpcweb.client.detail.1529994349587')
            /* 确定 */
            let s = this.$t('mxpcweb.client.detail.1529994368552')
            /* 取消 */
            let n = this.$t('mxpcweb.client.detail.1529994393355')
            this.$confirm(c, t, {
                confirmButtonText: s,
                cancelButtonText: n,
                type: 'warning'
            }).then(() => {
                let data = {
                    moduleCode: this.moduleCode,
                    identFieldValue: this.itemId,
                    fileId: fileId
                }
                this.$http.put(this.Global.baseURL + this.Global.api.v2.docFile_put, data).then((res) => {
                    if (res.body.code.toString() === this.Global.RES_OK) {
                        this.$message.success(this.msg(res.body))
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                    setTimeout(() => {
                        this.getTabData()
                    }, 500)
                }, (res) => {
                    this.$message.error(this.msg(res.body))
                })
            }).catch(() => { })
        },
        // 支持传参
        getTabData(reqObj) {
            let data = {
                moduleCode: this.moduleCode,
                identFieldValue: this.itemId,
                strucId: '1'
            }
            if (isObject(reqObj)) {
                data = Object.assign(data, reqObj)
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v2.document_file_list, { params: data }).then((res) => {
                this.isLoading = false
                if (res.body.code.toString() === this.Global.RES_OK && res.body.data) {
                    let resData = res.body.data
                    this.totalNum = resData.totalNum
                    // 功能判断
                    if (isObject(resData)) {
                        let list = resData.list
                        if (isArray(list)) {
                            this.dataList = list
                        }
                    }
                    if (isString(resData)) {
                        this.downloadFile(resData)// 下载
                    }
                } else {
                    this.$message.error(res.body.msg)
                }
            }, (res) => {
                this.$message.error(this.msg(res.body))
            })
        }
    },
    components: {
        'no-data': NoData,
        loading: Loading
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
</style>
