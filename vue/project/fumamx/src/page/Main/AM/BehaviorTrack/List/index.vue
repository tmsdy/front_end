<template>
    <div class="BehaviorTrackList">
        <!-- 客户抽屉 -->
        <customer-slider @tellFather="getListData()"></customer-slider>

        <page-title :showTitle="false"> </page-title>

        <div class="pageTab">
            <el-tabs class="subTabs-pullRight" v-model="tabData" @tab-click="tabClick">
                <!-- 全部 -->
                <el-tab-pane v-if="contactCheck.isAdmin" :label="$t('mxpcweb.mail.1533353380357')" name="0"> </el-tab-pane>
                <!-- 访客 -->
                <el-tab-pane v-if="contactCheck.isAdmin" :label="$t('api-am.1542271754326')" name="2"> </el-tab-pane>
                <!-- 未建档客户 -->
                <el-tab-pane :label="$t('api-am.1542273325085')" name="1"> </el-tab-pane>
                <!-- 建档客户 -->
                <el-tab-pane :label="$t('api-am.1542273426706')" name="3"> </el-tab-pane>
            </el-tabs>
        </div>
        <div class="actionManageBox MXscroll">
            <div class="toolBar clearfix">
                <div class="pull-right">
                    <el-form :model="formData" :inline="true">
                        <!-- 时间 -->
                        <el-form-item :label="$t('mxpcweb.am.1531900668705')" style="margin-bottom:0;">
                            <!-- 请选择时间范围 -->
                            <el-date-picker v-model="formData.time" format="yyyy-MM-dd HH:mm" :picker-options="formData.pickerOptions" @change="getListData" type="datetimerange" :placeholder="$t('mxpcweb.systemset.logaction.1530342578081')" style="width:280px;"></el-date-picker>
                        </el-form-item>
                    </el-form>
                </div>
            </div>

            <el-table class="detailTable widthFull" :data="tableData3" :height="tableHeight" v-if="tableData3.length > 0" v-loading="isLoading">
                <!-- 访客 -->
                <el-table-column :label="$t('api-am.1542271754326')" width="300">
                    <template slot-scope="{ row }">
                        <!-- mxpcweb.am.1550714321029 -->
                        <div style="height: 30px">
                            <span class="text-hover" @click="goLink(row)" style="line-height:18px;padding:6px 0;float:left;">
                                <!-- <template v-if="row.email && row.email != ''">王小刚 {{row.email}}</template> -->
                                <!-- 访客X -->
                                <template v-if="row.VisitorNum">{{$t('mxpcweb.am.1550714321029',{a:row.VisitorNum})}}</template>
                                <span class="custname" v-if="row.contName" :title="row.contName ">{{row.contName}}&nbsp;&nbsp;</span>
                                <template v-if="!row.VisitorNum&&row.email && row.email != ''">{{row.email}}</template>
                                <template v-else-if="!row.VisitorNum">{{row.sId}}</template>
                            </span>
                            <span class="isCust" @click="custClick(row)" v-if="!row.VisitorNum&&row.custId && row.custId != 0">客

                            </span>

                            <span class="isCust isCustOff" @click="custClick(row)" v-if="!row.VisitorNum&&row.email && row.email !='' && !row.custId">陌</span>
                        </div>

                        <div v-if="row.custName&&row.custId && row.custId != 0" style="display: inline-block;">{{row.custName}}</div>

                    </template>
                </el-table-column>
                <!-- 所在地 -->
                <el-table-column prop="address" :label="$t('mxpcweb.systemset.logaction.1530345156721')" width="100"> </el-table-column>
                <!-- 访问页面数 -->
                <el-table-column prop="" :label="$t('api-am.1542273611314')" width="110">
                    <template slot-scope="{ row }">
                        <div style="padding-left:26px;">{{row.count || '-'}}&nbsp;</div>
                    </template>
                </el-table-column>
                <!-- 最近行为 -->
                <el-table-column prop="" :label="$t('api-am.1542273546832')" width="100">
                    <template slot-scope="{ row }">
                        <div>{{getModule(row.moduleId)}}&nbsp;</div>
                    </template>
                </el-table-column>
                <!-- 最近访问页面 -->
                <el-table-column prop="" :label="$t('mxpcweb.am.1543396558786')" width="250">
                    <template slot-scope="{ row }">
                        <!-- <el-tooltip placement="top">
                            <div slot="content">
                                <div style="max-width:300px;word-break:break-all">{{row.title}}</div>
                            </div>
                            <div class="linkJump text-hover" @click="linkJump(row)">{{row.title}}&nbsp;</div>
                        </el-tooltip> -->
                        <div class="linkJump text-hover" @click="linkJump(row)">{{row.title}}&nbsp;</div>
                    </template>
                </el-table-column>

                <!-- 最近访问时间 -->
                <el-table-column prop="createDate" :label="$t('api-am.1542273639838')"> </el-table-column>
                <el-table-column prop="" label="" width="100">
                    <template slot-scope="{ row }">
                        <!-- 查看详情 -->
                        <el-button size="mini" :plain="true" type="info" @click="goLink(row)">{{$t('mxpcweb.mail.1528709376530')}}</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <no-data v-if="tableData3.length === 0" style="background:rgba(255,255,255,0)"></no-data>

            <div class="paging " v-show="page.total>page.size">
                <el-pagination :current-page="page.now" @current-change="changePage" layout="total,prev, pager, next" :page-size="page.size" :total="page.total"></el-pagination>
            </div>

        </div>
    </div>
</template>
<script>
import NoData from '@/basecomponents/NoData/index'
import PageTitle from '@/components/PageTitle/index'
import CustomerSlider from '@/components/CustomerSlider/index.vue'
import { mapGetters } from 'vuex'
import { isObject } from '@/libs/utils.js'
export default {
    name: 'BehaviorTrackList',
    data() {
        return {
            isLoading: false,
            tabData: '1',
            page: {
                fromNum: 0,
                now: 1,
                size: 20,
                total: 0
            },
            tableData3: [],
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
            tableHeight: '333',
            isAdmin: false // contactCheck.isAdmin
        }
    },
    created() {
        if (this.contactCheck.isAdmin) {
            this.tabData = '0'
        }
        this.getListData()
    },
    mounted() {
        let _this = this
        setTimeout(function () {
            _this.getWinHeight()
        }, 200)
        // window.onresize = function temp() {
        //     _this.getWinHeight()
        // }
    },
    computed: {
        ...mapGetters([
            'screenHeight',
            'contactCheck'
        ])
    },
    methods: {
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
        // 设置固定高
        getWinHeight() {
            let winHeight = document.body.clientHeight
            this.tableHeight = winHeight - 230
        },
        goLink(row) {
            let dateStr = this.$m_unifiedTime(this.formData.time[0]).split(' ')[0] + ',' + this.$m_unifiedTime(this.formData.time[1]).split(' ')[0]
            if (this.formData.time.length === 0) {
                this.$router.push('/main/am/behaviorTrack/detail/' + row.sId + '&' + dateStr + '&' + row.VisitorNum)
            } else {
                this.$router.push('/main/am/behaviorTrack/detail/' + row.sId + '&' + dateStr + '&' + row.VisitorNum) // 时间参数带上
            }
        },
        custClick(item) {
            ep.emit('custSliderOpen', {
                mail: item.email,
                constId: item.custId || '',
                fn() {
                    // this.$emit('UpdataListCenterData', this.DetailData, 1) // 更新列表中的某一条数据
                }
            })
        },
        changePage(val) {
            // console.log(val)
            if (val > 1) {
                this.page.fromNum = (val - 1) * this.page.size
            } else {
                this.page.fromNum = 0
            }
            this.getListData()
        },
        tabClick() {
            this.page.fromNum = 0 // 改成第一页显示
            this.page.now = 1 // 改成第一页显示
            this.getListData()
        },
        // 查列表数据
        getListData() {
            this.isLoading = true
            let data = {
                type: 'list',
                from: this.page.fromNum,
                size: this.page.size
            }
            switch (this.tabData) {
                case '3':
                    data.isPlaced = '1'
                    break
                case '2':
                    data.isUnknown = '1'
                    break
                case '1':
                    data.isPlaced = '0'
                    break
                default:
            }
            if (this.formData.time.length > 0) {
                data.createDate_gt = this.$m_unifiedTime(this.formData.time[0]).split(' ')[0]
                data.createDate_lt = this.$m_unifiedTime(this.formData.time[1]).split(' ')[0]
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v2.tk_trackLogs, { params: data }).then(
                res => {
                    this.isLoading = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        // console.log(' jjj ')
                        if (isObject(res.body.data)) {
                            this.tableData3 = res.body.data.list
                            this.page.total = res.body.data.totalNum
                        } else {
                            this.tableData3 = []
                            this.page.total = 0
                        }
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                }, res => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                }
            )
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
        }
    },
    components: {
        'customer-slider': CustomerSlider,
        'page-title': PageTitle,
        'no-data': NoData
    },
    watch: {
        screenHeight(val) { // 监听屏幕宽度变化
            this.getWinHeight()
        }
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
