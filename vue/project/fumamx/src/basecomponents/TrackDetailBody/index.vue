<template>
    <div class="TrackDetailBody">
        <el-row class="detailHeader" v-if="mailAddress==''">
            <el-col class="item" :span="6">
                <dl>
                    <!-- <span class="icon"><i class="iconfont icon-account-set"></i></span> -->
                    <!-- 访客 -->
                    <dt>{{$t('api-am.1542271754326')}}：
                        <span v-if="VisitorNum!=''">{{$t('mxpcweb.am.1550714321029',{a:VisitorNum})}}</span>
                        <span v-else-if="tableData3.length > 0">{{tableData3[0].email}}</span>
                        <span v-else>{{$t('mxpcweb.workbench.1530703499819')}}</span>
                    </dt>

                    <!-- 无 -->

                </dl>
            </el-col>

            <el-col class="item" :span="6">
                <dl>
                    <!-- <span class="icon"><i class="iconfont icon-account-set"></i></span> -->
                    <!-- 所在地 -->
                    <dt>{{$t('mxpcweb.systemset.logaction.1530345156721')}}：
                        <span v-if="tableData3.length > 0">{{tableData3[0].address}}</span>
                        <span v-else>{{$t('mxpcweb.workbench.1530703499819')}}</span>
                    </dt>

                    <!-- 无 -->

                </dl>
            </el-col>

            <el-col class="item text-center" :span="5">
                <dl>
                    <!-- <span class="icon" style="background:#FFB735;"><i class="iconfont icon-footmark"></i></span> -->
                    <!-- 访问次数 -->
                    <dt>{{$t('api-am.1542271792846')}}：<span> {{linkNum}}</span></dt>
                    <!-- <dd>{{linkNum}}</dd> -->
                </dl>
            </el-col>
            <el-col class="item text-right" :span="7">
                <dl style="position: absolute;right: 20px;top: 13px;">

                    <el-form :model="formData" :inline="true">
                        <!-- 时间 -->
                        <el-form-item style="margin-bottom:0;">
                            <!-- 请选择时间范围 -->
                            <el-date-picker v-model="formData.time" format="yyyy-MM-dd HH:mm" :picker-options="formData.pickerOptions" @change="getData" type="datetimerange" :placeholder="$t('mxpcweb.systemset.logaction.1530342578081')" style="width:280px;"></el-date-picker>
                        </el-form-item>
                    </el-form>
                </dl>
            </el-col>
        </el-row>
        <el-row class="detailHeader" v-else>
            <el-col class="item" :span="8">
                <dl>
                    <dt>{{$t('mxpcweb.systemset.logaction.1530345156721')}}：
                        <span v-if="tableData3.length > 0">{{tableData3[0].address}}</span>
                        <span v-else>{{$t('mxpcweb.workbench.1530703499819')}}</span>
                    </dt>
                </dl>
            </el-col>

            <el-col class="item " :span="8">
                <dl>
                    <!-- 访问次数 -->
                    <dt>{{$t('api-am.1542271792846')}}：<span>{{linkNum}}</span></dt>
                </dl>
            </el-col>
            <el-col class="item" :span="8">
                <dl style="position: absolute;top: 13px;">

                    <el-form :model="formData" :inline="true">
                        <!-- 时间 -->
                        <el-form-item>
                            <!-- 请选择时间范围 -->
                            <el-date-picker v-model="formData.time" format="yyyy-MM-dd HH:mm" :picker-options="formData.pickerOptions" @change="getData" type="datetimerange" :placeholder="$t('mxpcweb.systemset.logaction.1530342578081')" style="width:250px;"></el-date-picker>
                        </el-form-item>
                    </el-form>
                </dl>
            </el-col>

        </el-row>
        <el-table class="detailTable widthFull" :data="tableData3" v-loading="isLoading">
            <!-- 访问页面 -->
            <el-table-column :label="$t('mxpcweb.am.1543543677919')">
                <template slot-scope="{ row }">
                    <!-- <span style="display:inline-block; line-height:15px; padding-top:5px;">{{row.title}}</span> -->
                    <div class="linkJump text-hover" @click="linkJump(row)">{{row.title}}</div>
                    <!-- 无 -->
                    <!-- <span v-else>{{$t('mxpcweb.workbench.1530703499819')}}</span> -->
                </template>
            </el-table-column>
            <!-- 行为 -->
            <el-table-column prop="status" :label="$t('mxpcweb.am.1543482534812')">
                <template slot-scope="{ row }">
                    <div>{{getModule(row.moduleId)}}</div>
                </template>
            </el-table-column>
            <!-- 页面访问次数 -->
            <el-table-column prop="count" :label="$t('api-am.1542273611314')"></el-table-column>

            <!-- 最近访问时间 -->
            <el-table-column prop="createDate" :label="$t('api-am.1542273639838')"></el-table-column>
        </el-table>
        <div style="text-align: center;margin-top: 10px;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pagesize" layout="total,sizes, prev,pager,next" :total="linkNum">
            </el-pagination>
        </div>
        <div class="detailTimeAxis" v-if="Dataile.length > 0">
            <ul>
                <li v-for="(item, index) in Dataile" :key="index" v-if="index<99">
                    <dl>
                        <div>{{item.createDate}}</div>
                        <dt style="max-width: 200px;text-overflow: ellipsis; overflow: hidden; white-space: nowrap;color: #437ab2;" class="text-hover" @click="linkJump(item)">{{item.title}}</dt>
                        <dd>{{getModule(item.moduleId)}}</dd>
                    </dl>
                </li>
                <div class="clearfix"></div>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    name: 'TrackDetailBody',
    props: {
        moduleCode: {
            type: String,
            default: ''
        },
        pageId: {
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
            isLoading: false,
            Dataile: [],
            DatailCount: 0,
            DatailCounts: 0,
            tableData3: [],
            linkNum: 0,
            timeStr: '',
            pagesize: 10,
            // total: 0,
            currentPage: 1,
            sIdstr: '',
            formData: {
                time: [],
                pickerOptions: {
                    shortcuts: [
                        {
                            /* 最近一周 */
                            text: this.$t('mxpcweb.systemset.logaction.1530345277441'),
                            onClick(picker) {
                                const end = new Date()
                                const start = new Date()
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                                picker.$emit('pick', [start, end])
                            }
                        },
                        {
                            /* 最近一个月  */
                            text: this.$t('mxpcweb.systemset.logaction.1530345304623'),
                            onClick(picker) {
                                const end = new Date()
                                const start = new Date()
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                                picker.$emit('pick', [start, end])
                            }
                        },
                        {
                            /* 最近三个月 */
                            text: this.$t('mxpcweb.systemset.logaction.1530345327648'),
                            onClick(picker) {
                                const end = new Date()
                                const start = new Date()
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                                picker.$emit('pick', [start, end])
                            }
                        }
                    ]
                }
            },
            url: document.location,
            VisitorNum: ''
        }
    },
    mounted() {
        // console.log('this.$router.history.current.params.id')
        // console.log(this.$router.history.current.params.id)
        // 行为列表关联
        let id = this.$router.history.current.params.id
        // console.log(id.split('&'))
        if (id && id !== '') {
            let idArr = id.split('&')
            // 全部
            this.timeStr = idArr[1] || this.$t('mxpcweb.client.detail.1529994111184')
            this.sIdstr = idArr[0]
            if (idArr[2] != 'undefined') {
                this.VisitorNum = idArr[2]
            }
            this.getData()
        }
        if (this.mailAddress != '' && this.moduleCode !== '') {
            this.sIdstr = ''
            this.getData()
        }

        // 客户详情关联
        setTimeout(() => {
            if (this.moduleCode !== '' && this.pageId !== '') {
                this.getCustAboutData()
            }
        }, 2000)
    },
    methods: {
        getUrl(item) {
            if (item.moduleId == 'EM001') {
                // let url =
                return this.url.origin + '/#/main/mail/home/detail_' + item.pId + '_0_0'
            } else {
                return item.referer
            }
        },
        getModule(moduleId) {
            let module = ''
            switch (moduleId) {
                case 'PP001':
                    module = this.$t('mxpcweb.am.1543397631022')
                    break
                case 'EM001':
                    module = this.$t('mxpcweb.am.1543397635014')
                    break
                case 'AM001':
                    module = this.$t('mxpcweb.am.1531897436358')
                    break

                default:
                    module = this.$t('mxpcweb.am.1543397658932')
                    break
            }
            return module
        },
        // 一页多少条
        handleSizeChange(val) {
            this.pagesize = val
            this.getData()
        },
        // 当前页
        handleCurrentChange(val, old) {
            this.currentPage = val
            if (val == 1) {
                this.DatailCounts = 0
            }
            this.getData()
        },
        // 跳转
        linkJump(item) {
            if (item.moduleId == 'EM001') {
                this.$router.push('/main/mail/home/index')
                setTimeout(() => {
                    ep.emit('openMailDetail', {
                        mId: item.pId,
                        boxId: 0
                    })
                }, 100)
            } else {
                this.openNewWindowTab(item.referer)
            }
        },
        getData() {
            let PostUrl = this.Global.api.v2.tk_trackLogs
            this.isLoading = true
            let from = (this.currentPage - 1) * this.pagesize
            let params = { from: from, size: this.pagesize, isCollapsed: true }
            if (this.sIdstr != '') {
                params.sId = this.sIdstr
            }
            if (this.mailAddress != '' && this.moduleCode !== '') {
                params.moduleCode = this.moduleCode
                params.identValue = this.mailAddress
                PostUrl = this.Global.api.v2.tk_behaviorList
            }

            if (this.formData.time.length == 2) {
                params.createDate_gt = this.$m_unifiedTime(this.formData.time[0]).split(' ')[0]
                params.createDate_lt = this.$m_unifiedTime(this.formData.time[1]).split(' ')[0]
            }
            this.$http.get(this.Global.baseURL + PostUrl, {
                params: params
            })
                .then(res => {
                    this.isLoading = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.tableData3 = res.body.data.list
                        this.linkNum = res.body.data.totalNum
                        this.DatailCount = 0
                        for (let index = 0; index < this.tableData3.length; index++) {
                            const element = this.tableData3[index]
                            this.DatailCount = this.DatailCount + (element.count == undefined ? 1 : element.count)
                        }
                        let _this = this
                        setTimeout(() => {
                            _this.getDataile()
                        }, 200)

                        this.$emit('success', this.tableData3, this.VisitorNum)
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        getDataile() {
            let PostUrl = this.Global.api.v2.tk_trackLogs
            let cur = (this.currentPage - 1) * this.pagesize
            if (cur == 0) {
                this.DatailCounts = 0
            }
            let from = this.DatailCounts
            let params = { from: from, size: this.DatailCount }
            if (this.sIdstr != '') {
                params.sId = this.sIdstr
            }
            if (this.mailAddress != '' && this.moduleCode !== '') {
                params.moduleCode = this.moduleCode
                params.identValue = this.mailAddress
                PostUrl = this.Global.api.v2.tk_behaviorList
            }

            if (this.formData.time.length == 2) {
                params.createDate_gt = this.$m_unifiedTime(this.formData.time[0]).split(' ')[0]
                params.createDate_lt = this.$m_unifiedTime(this.formData.time[1]).split(' ')[0]
            }
            this.$http.get(this.Global.baseURL + PostUrl, {
                params: params
            })
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.DatailCounts = this.DatailCounts + this.DatailCount
                        this.Dataile = res.body.data.list
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        getCustAboutData(id) {
            this.isLoading = true
            let data = {
                moduleCode: this.moduleCode,
                identValue: this.pageId
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v2.tk_behaviorList, { params: data })
                .then(res => {
                    this.isLoading = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.tableData3 = res.body.data.list
                        this.linkNum = res.body.data.totalNum
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        }
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
