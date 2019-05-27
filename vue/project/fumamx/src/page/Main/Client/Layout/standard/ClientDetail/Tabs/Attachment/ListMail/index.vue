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
            <tbody v-for="(item,index) in dataList" :key="index">
                <tr v-for="(item2,index2) in item.attachmentList" :key="index2">
                    <td>
                        <span class="icon">
                            <!-- <a v-if="isImage(item2.name)" :href="item2.url" :data-lightbox="index2" data-title="FumaMX"><img :src="item2.url"></a> -->
                            <img :src="item2.url" v-if="isImage(item2.name)">
                            <svg v-else class="iconSVG" aria-hidden="true">
                                <use :xlink:href="checkIco(item2.name)"></use>
                            </svg>
                        </span>
                        <dl>
                            <dt v-html="item2.name"></dt>
                            <dd style="font-size:12px;color:#909399;">来自邮件：<span @click="goThisMailDetail(item)" class="text-hover" style="color:#5ea3f6">{{item.subject}}</span></dd>
                        </dl>
                    </td>
                    <!-- <td><div class="updateTime">{{dateConver(item.sentDate)}}</div></td> -->
                    <td><div class="updateTime">{{item.sentDate}}</div></td>
                    <td><div class="fileSize">{{getSize(item2.size)}}</div></td>
                    <td align="right">
                        <!-- <div class="auther">{{item.mailAddress}}</div> -->
                        <div class="auther">{{item.createRealName || '---'}}</div>
                        <div class="optBtn">
                            <!-- 详情 -->
                            <!-- <span @click="lookItem(item)" :title="$t('mxpcweb.client.detail.1529993364826')">
                                <i class="iconfont icon-multilayer"></i>
                            </span> -->
                            <!-- 下载 -->
                            <span v-if="!isImage(item2.name)" @click="downloadItem(item2)" :title="$t('mxpcweb.client.detail.1529993858368')">
                                <i class="iconfont icon-download"></i>
                            </span>
                            <!-- 预览 -->
                            <!-- <span @click="previewItem(index)" :title="$t('mxpcweb.client.detail.1529993875360')">
                                <i class="iconfont icon-eye"></i>
                            </span> -->
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="pagination" :style="setPagination" v-if="totalNum > pageSize">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum"> </el-pagination>
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
        pageId: {
            type: String,
            default: ''
        },
        moduleCode: {
            type: String,
            default: ''
        },
        mailAddress: {
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
        this.getTabData()
    },
    mounted() {
    },
    computed: {
        setPagination() {
            return this.windowMode ? 'left:auto;width:800px;' : ''
        }
    },
    methods: {
        goThisMailDetail(item) {
            // this.$router.push('/main/mail/home/detail_' + item.mId + '_0_0')
            this.$router.push('/main/mail/home/index')
            setTimeout(() => {
                ep.emit('openMailDetail', {
                    mId: item.mId,
                    boxId: 0
                })

                ep.emit('custSliderClose') // 关闭抽屉
            }, 100)
        },
        getExe(filename) {
            let index1 = filename.lastIndexOf('.')
            let index2 = filename.length
            return filename.substring(index1 + 1, index2) // 后缀名
        },
        // 判断是不是图片
        isImage(exe) {
            exe = this.getExe(exe)
            const imgArr = ['png', 'jpg', 'jpeg', 'gif', 'bmp']
            return imgArr.includes(exe.toLowerCase())
        },
        getSize(size) {
            size = size * 1024
            return byteCalc(size)
        },
        checkIco(ico) {
            ico = this.getExe(ico)
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
            // console.log(this.from)
            this.getTabData()// 获取数据
        },
        // 日期格式转换
        dateConver(date) {
            return this.timeShow_custom(date, 'YYYY-MM-DD HH:mm')
        },
        /* 详情 */
        lookItem(data) {
            this.$refs.docDialog.open(data)
        },
        /* 详情 */
        previewItem(index) {
            this.$refs.filePreview.open(this.dataList, index)
        },
        // 下载单项
        downloadItem(item) {
            // console.log(item)
            if (item.url && item.url != '') {
                this.downloadFile(encodeURI(item.url).replace(/\#/ig, '%23').replace(/\+/ig, '%2B'))
            }
        },
        // 支持传参
        getTabData(reqObj) {
            let data = {
                moduleCode: this.mailAddress != '' ? 'EM001' : this.moduleCode,
                identFieldValue: this.mailAddress != '' ? this.mailAddress : this.pageId,
                type: this.type,
                size: this.pageSize,
                // sort: 'modifyDate',
                // order: 'desc',
                from: this.from
                // params: 'w_40,h_40,m_fill'
            }
            console.log(data)
            if (isObject(reqObj)) {
                data = Object.assign(data, reqObj)
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v2.mails_contAttachments, { params: data }).then((res) => {
                    // console.log(res.body)
                this.isLoading = false
                if (res.body.code.toString() === this.Global.RES_OK) {
                    let resData = res.body.data
                    this.totalNum = parseInt(resData.totalNum)
                    console.log(resData)
                    // 功能判断
                    if (isObject(resData) && isArray(resData.list)) {
                        this.dataList = resData.list
                    }
                    console.log(this.dataList)
                    if (isString(resData)) {
                        // this.downloadFile(resData)// 下载
                    }
                } else {
                    // console.log(' uuuuuu iuui ')
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
