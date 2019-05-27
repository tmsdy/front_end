<template>
    <div class="TrackDetailBody">
        <!-- 触发邮件 -->
        <!-- 新建触发邮件 -->
        <page-detail :title="$t('mxpcweb.am.1543297977190')" iconfont="icon-toolbox" :detailTitle="$t('mxpcweb.am.1544695727161')" @toList="$emit('pageBack')"></page-detail>
        <el-row class="detailHeader">
            <el-col class="item" :span="8">
                <dl>
                    <!-- <span class="icon"><i class="iconfont icon-account-set"></i></span> -->
                    <!-- 方案名称： -->
                    <dt>{{$t('mxpcweb.am.1545204589065')}}
                        <span>{{viewItem.detailActionName}}</span>
                    </dt>

                    <!-- 无 -->

                </dl>
            </el-col>
            <el-col class="item text-center" :span="8">
                <dl>
                    <!-- <span class="icon" style="background:#FFB735;"><i class="iconfont icon-footmark"></i></span> -->
                    <!-- 数量 -->
                    <dt>{{$t('mxpcweb.am.1545204609631')}}<span>{{linkNum}}</span></dt>
                    <!-- <dd>{{linkNum}}</dd> -->
                </dl>
            </el-col>
            <el-col class="item text-right" :span="8">
                <dl style="margin-right:20px;">
                    <!-- <span class="icon" style="background:#5EA3F6;"><i class="iconfont icon-calendar"></i></span> -->
                    <!-- 时间范围  {{$t('api-am.1542271877597')}}-->
                    <dt>{{timeStr}}</dt>
                    <el-date-picker v-model="formData.time" format="yyyy-MM-dd HH:mm" :picker-options="formData.pickerOptions" @change="getData" type="datetimerange" :placeholder="$t('mxpcweb.systemset.logaction.1530342578081')" style="width:280px;"></el-date-picker>
                    <!-- <dd>{{timeStr}}</dd> -->
                </dl>
            </el-col>
        </el-row>

        <el-table class="detailTable widthFull" :data="tableData3" v-loading="isLoading">
            <!-- 邮箱 -->
            <el-table-column :label="$t('mxpcweb.am.1531900664136')">
                <template slot-scope="{ row }">
                    <span style="line-height:18px;padding:5px 0;float:left;">
                        <template>{{row.recipient}}</template>
                    </span>
                    <span class="isCust" @click="custClick(row)" v-if="row.custId && row.custId != 0">客</span>
                    <span class="isCust isCustOff" @click="custClick(row)" v-if="!row.custId">陌</span>
                </template>
            </el-table-column>
            <!-- 姓名 -->
            <el-table-column prop="recipientName" :label="$t('const.1528785188010')"></el-table-column>
            <!-- 备注 -->
            <el-table-column :label="$t('mxpcweb.am.1531900669055')">
                <template slot-scope="{ row }">
                    <span>{{getStatus(row.status)}}</span>
                </template>
            </el-table-column>
            <!-- 创建人 -->
            <el-table-column :label="$t('mxpcweb.am.1543298040653')">
                <template slot-scope="{ row }">
                    <span>{{returnPeople(row.createCtId)}}</span>
                </template>
            </el-table-column>
            <!-- 创建时间 -->
            <el-table-column prop="createDate" :label="$t('mxpcweb.am.1543298040294')">
                <template slot-scope="{ row }">
                    <span>{{row.createDate}}</span>
                </template>
            </el-table-column>
        </el-table>
        <div style="text-align: center;margin-top: 10px;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pagesize" layout="total,sizes, prev,pager,next" :total="linkNum">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import PageDetail from '@/components/PageDetail/index' // 大标题
export default {
    name: 'TrackDetailBody',
    props: {
        viewItem: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data() {
        return {
            isLoading: false,
            tableData3: [],
            linkNum: 0,
            timeStr: '',
            pagesize: 10,
            currentPage: 1,
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
            owners: []
        }
    },
    mounted() {

    },
    created() {
        this.getData()
    },
    methods: {
        returnPeople(ctid) {
            let name = ''
            this.owners.forEach(element => {
                if (element.ctId === ctid) {
                    name = element.realName
                }
            })
            return name
        },
        getStatus(status) {
            let str = ''
            switch (status) {
                case 0:
                    str = this.$t('mxpcweb.systemset.enterpriseset.1530340757655')// 提交成功
                    break
                case 1:
                    str = this.$t('mxpcweb.am.1531900669464') // 送达
                    break
                case -1:
                    str = this.$t('mxpcweb.am.1541575515357')// 失败
                    break
            }
            return str
        },
        custClick(item) {
            ep.emit('custSliderOpen', {
                mail: item.recipient,
                constId: item.custId || '',
                fn() {
                }
            })
        },
        // 一页多少条
        handleSizeChange(val) {
            this.pagesize = val
            this.getData()
        },
        // 当前页
        handleCurrentChange(val, old) {
            this.currentPage = val
            this.getData()
        },
        getData() {
            let _this = this
            let params = {
                pageN: _this.currentPage, // parseInt(_this.blockData.fromNum / _this.blockData.pageSize) + 1,
                pageSize: _this.pagesize,
                detailActionId: _this.viewItem.detailActionId
            }
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.marketingRecord_Get, { params: params }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.tableData3 = res.body.data.dataList
                    _this.linkNum = res.body.data.rowTotal
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })

            let contactData = {
                dataType: 'contact',
                funType: 'withRight',
                moduleCode: 'AM001',
                optCode: 'otView'
            }
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.accountDropList_get, { params: contactData }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.owners = res.body.data
                } else {
                    _this.$message(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        }

    },
    components: {
        'page-detail': PageDetail
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
