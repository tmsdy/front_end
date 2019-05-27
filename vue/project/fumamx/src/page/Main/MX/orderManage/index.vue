 <template>
    <div class="MXOrder">
        <page-title title="订单管理" iconfont="icon-orders"></page-title>

        <div class="Box">
            <div ref="formHeader">
                <el-form :model="filterForm" :inline="true" label-width="45px">
                    <el-form-item>
                        <el-input v-model="filterForm.orderNumber" style="width:200px;" placeholder="订单号" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-select v-model="filterForm.orderType" style="width:110px;" placeholder="订单类型">
                            <el-option key="" label="" value=""> </el-option>
                            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="日期">
                        <el-date-picker v-model="filterForm.datePicker" @change="chageDate()" type="datetimerange" placeholder="选择时间范围" align="left" format="yyyy/MM/dd HH:mm" :picker-options="pickerOptions" style="width:280px"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="filterForm.statusType" style="width:110px;" placeholder="订单状态">
                            <el-option key="" label="" value=""> </el-option>
                            <el-option key="P" label="待支付" value="P"> </el-option>
                            <el-option key="F" label="已支付" value="F"> </el-option>
                            <el-option key="1" label="已开通" value="1"> </el-option>
                            <el-option key="0" label="待激活" value="0"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model.trim="filterForm.companyName" style="width:200px;" placeholder="企业名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="loadAllOrderList()">搜索</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="showOfflineOrderWindow" v-if="isAuthority">新增线下订单</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <el-table ref="table" :data="orderList" :height="tableHeight" v-loading="tableLoading" class="el-col el-col-24 orderTable" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-table-column prop="orderno" label="订单号" min-width="75">
                    <template slot-scope="{ row }">
                        <div style="line-height:18px;padding:5px 0;">{{row.orderno}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="companyname" label="客户名称" min-width="100">
                    <template slot-scope="{ row }">
                        <div style="line-height:18px;font-weight:bold;padding:5px 0;">{{row.companyname}}</div>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="productname" label="产品名称" width="70"></el-table-column> -->
                <el-table-column prop="desc" label="订单描述" min-width="115">
                    <template slot-scope="{ row }">
                        <div class="desc" v-for="(item,index) in row.desc" :key="index"><span>{{item}}</span></div>
                    </template>
                </el-table-column>
                <el-table-column prop="payamount" label="应付金额" min-width="70"> </el-table-column>
                <el-table-column prop="actualreceiveamount" label="实付金额" min-width="70"> </el-table-column>
                <el-table-column prop="isusedName" label="使用状态" min-width="70">
                    <template slot-scope="{ row }">
                        <div :class="row.isused == -2 ? 'result': row.isused == -1 ? 'audit' : ''">{{row.isusedName}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="createdate" label="下单日期" min-width="80">
                    <template slot-scope="{ row }">
                        <div style="line-height:18px;padding:5px 0;">{{row.createdate.slice(0,16)}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="saleMansCompany" label="所属机构" width="85"></el-table-column>
                <el-table-column prop="saleName" label="业务员" width="65"></el-table-column>
                <el-table-column prop="createName" label="提交人" width="65"></el-table-column>
                <el-table-column prop="modifyName" label="审核人" width="65"></el-table-column>
                <el-table-column label="" min-width="100">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="showOrderDetail(scope.row.id,scope.row.orderno,scope.row.detailDesc,isAuthority)">详情</el-button>
                        <!-- 限新购 未激活的 可修改 -->
                        <el-button size="mini" @click="$refs.orderModify.open(scope.row)" v-if="scope.row.isused == 0 && isAuthority">修改</el-button>
                        <!-- <el-button size="mini" @click="sureOrder(scope.row, 'F')" v-if="scope.row.isused == -1 && isAuthority">审核</el-button> -->
                        <!-- <el-button size="mini" @click="rejectOrder(scope.row, 'P')" v-if="scope.row.isused == -1 && isAuthority">驳回</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <!--线下订单创建-->
        <mx-offlineOrder @refreshList="loadAllOrderList" ref="mxOfflineOrder"></mx-offlineOrder>
        <!--订单明细-->
        <mx-orderDetail ref="mxOrderDetail" @success="loadAllOrderList"></mx-orderDetail>
        <!-- 订单修改 -->
        <order-modify ref="orderModify" @success="loadAllOrderList" />
    </div>
</template>

 <script>
import PageTitle from '@/components/PageTitle/index' // 大标题
import Offlineorder from './offlineOrder/index.vue'
import OrderDetail from './orderDetail/index.vue'
import orderModify from './orderModify/index.vue' // 订单修改，限新购订单
export default {
    name: 'OrderManage',
    data() {
        return {
            routeUrl: '',
            isAuthority: false, // 新增线下订单权限
            tableLoading: true,
            tableHeight: '333',
            filterForm: {
                orderNumber: '',
                orderType: '',
                statusType: '',
                datePicker: '',
                companyName: ''
            },
            typeOptions: [
                { value: 'N', label: '新购' },
                { value: 'R', label: '续费' },
                { value: 'U', label: '升级' }
            ],
            orderList: [],
            total: 0,
            currentPage: 1,
            pageSize: 20,
            pickerOptions: {
                shortcuts: [
                    {
                        text: '今天',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            // start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                            var startZ =
                                start.getFullYear() +
                                '-' +
                                (start.getMonth() + 1) +
                                '-' +
                                start.getDate() +
                                ' 00:00:00'
                            picker.$emit('pick', [startZ, end])
                        }
                    },
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                            picker.$emit('pick', [start, end])
                        }
                    },
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                            picker.$emit('pick', [start, end])
                        }
                    },
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                            picker.$emit('pick', [start, end])
                        }
                    }
                ]
            }
        }
    },
    created() {
        this.routeUrl = this.$route.path
        this.loadAllOrderList()
        this.getPower()
    },
    mounted() {
        setTimeout(() => {
            this.getWinHeight()
        }, 200)
        $(window).resize(() => {
            this.getWinHeight()
        })
    },
    methods: {
        returnFloat(x) {
            var value = Math.round(parseFloat(x) * 100) / 100
            var xsd = value.toString().split('.')
            if (xsd.length == 1) {
                value = value.toString() + '.00'
                return value
            }
            if (xsd.length > 1) {
                if (xsd[1].length < 2) {
                    value = value.toString() + '0'
                }
                return value
            }
        },
        labelHead(h, { column, index }) {
            let l = column.label.length
            let f = 16 // 每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点，
            column.minWidth = f * l + 36 // 字大小乘个数即长度 ,注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度

            // 然后将列标题放在一个div块中，注意块的宽度一定要100%，否则表格显示不完全
            return h('div', { class: 'table-head', style: { width: '100%' } }, [column.label])
        },
        // 权限校验
        getPower() {
            this.$http.get(this.Global.baseURL + this.Global.api.v2.manageFlag, { params: {} })
                .then(
                    res => {
                        // console.log(res)
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            if (res.body.data.manageFlag && res.body.data.isBoss) {
                                this.isAuthority = true
                            } else {
                                this.isAuthority = false
                            }
                        }
                    },
                    res => {
                        /* 网络异常 */
                        this.$message.error(this.$t('mxpcweb.mai.sys.gro.networkAnomaly'))
                    }
                )
        },
        toSure(item, param) {
            let data = {
                orderNo: item.orderno,
                orderStatus: param
            }
            this.submiting = true
            this.$http
                .put(this.Global.baseURL + this.Global.api.v2.saleOrder, data).then(res => {
                    this.submiting = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.loadAllOrderList()
                        // this.$message.success('提交成功！')
                    } else {
                        this.$message.error(res.body.msg)
                    }
                },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        rejectOrder(item, param) {
            this.$confirm('确定该订单已支付完成?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.toSure(item, param)
            }).catch(() => { })
        },
        sureOrder(item, param) {
            this.$confirm('确定该订单已支付完成?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.toSure(item, param)
            }).catch(() => { })
        },
        // 设置固定高
        getWinHeight() {
            // console.log(this.$refs.formHeader.offsetHeight)
            let winHeight = document.body.clientHeight
            this.tableHeight = winHeight - this.$refs.formHeader.offsetHeight - 180
        },
        // 每页数量改变
        handleSizeChange(size) {
            this.pageSize = size
            this.loadAllOrderList()
        },
        // 页面index改变
        handleCurrentChange(index) {
            this.$refs.table.bodyWrapper.scrollTop = 0
            this.currentPage = index
            this.loadAllOrderList()
        },
        showOrderDetail(id, orderNo, detailDesc, authority) {
            this.$refs.mxOrderDetail.showDialog(id, orderNo, authority)
            this.$refs.mxOrderDetail.getDesc(detailDesc)
        },
        addDate(oldDate, days) {
            if (days == undefined || days == '') {
                days = 1
            }
            var date = new Date(oldDate)
            date.setDate(date.getDate() + days)
            var month = date.getMonth() + 1
            var day = date.getDate()
            return (
                date.getFullYear() +
                '-' +
                this.getFormatDate(month) +
                '-' +
                this.getFormatDate(day)
            )
        },
        // 日期月份/天的显示，如果是1位数，则在前面加上'0'
        getFormatDate(arg) {
            if (arg == undefined || arg == '') {
                return ''
            }
            var re = arg + ''
            if (re.length < 2) {
                re = '0' + re
            }
            return re
        },
        getnowDate() {
            var nowDate = new Date()
            var year = nowDate.getFullYear()
            var month =
                nowDate.getMonth() + 1 < 10
                    ? '0' + (nowDate.getMonth() + 1)
                    : nowDate.getMonth() + 1
            var day =
                nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate.getDate()
            var dateStr = year + '-' + month + '-' + day
            return dateStr
        },
        showtime(time, format) {
            var t = new Date(time)
            var tf = i => {
                return (i < 10 ? '0' : '') + i
            }
            return format.replace(/yyyy|MM|dd|HH|mm|ss/g, a => {
                switch (a) {
                    case 'yyyy':
                        return tf(t.getFullYear())
                        break
                    case 'MM':
                        return tf(t.getMonth() + 1)
                        break
                    case 'mm':
                        return tf(t.getMinutes())
                        break
                    case 'dd':
                        return tf(t.getDate())
                        break
                    case 'HH':
                        return tf(t.getHours())
                        break
                    case 'ss':
                        return tf(t.getSeconds())
                        break
                }
            })
        },
        /**
         * 显示线下付款页面
         */
        showOfflineOrderWindow() {
            this.$refs.mxOfflineOrder.showDialog()
        },
        /**
         * 加载所有订单数据
         */
        loadAllOrderList() {
            var d = this.filterForm.datePicker
            var startDate = ''
            var endDate = ''
            if (d != null && d.length >= 1) {
                if (d[0] != null) {
                    startDate = this.showtime(d[0], 'yyyy-MM-dd HH:mm:ss')
                } else {
                    var date = this.getnowDate()
                    var addmonth = this.addDate(date, -30)
                    startDate = this.showtime(addmonth, 'yyyy-MM-dd')
                }
                if (d[1] != null) {
                    endDate = this.showtime(d[1], 'yyyy-MM-dd HH:mm:ss')
                } else {
                    //  var date = this.getnowDate()
                    //  var addmonth = this.addDate(date, 1)
                    endDate = this.showtime(this.addDate(date, 1), 'yyyy-MM-dd')
                }
            } else {
                //  var date = this.getnowDate()
                //  var addmonth = this.addDate(date, -30)
                startDate = this.showtime(addmonth, 'yyyy-MM-dd')
                endDate = this.showtime(this.addDate(date, 1), 'yyyy-MM-dd')
            }
            this.tableLoading = true
            this.$http
                .get(this.Global.baseURL + this.Global.api.v2.getOrderList, {
                    params: {
                        orderno: this.filterForm.orderNumber,
                        ordertype: this.filterForm.orderType,
                        status: this.filterForm.statusType,
                        beginTime: startDate,
                        endTime: endDate,
                        pageIndex: this.currentPage,
                        pageSize: this.pageSize,
                        companyName: this.filterForm.companyName
                    }
                })
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.orderList = res.body.data.dataList
                        this.orderList.map(item => {
                            item.payamount = this.returnFloat(item.payamount)
                            item.actualreceiveamount = this.returnFloat(item.actualreceiveamount)
                            item.desc = item.desc.split(',')
                            item.desc.unshift(item.productname)
                        })
                        this.total = res.body.data.resultCount
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                    this.tableLoading = false
                })
                .catch(err => {
                    this.tableLoading = false
                    this.$message.error(err)
                })
        }
    },
    components: {
        'page-title': PageTitle,
        'mx-offlineOrder': Offlineorder,
        'mx-orderDetail': OrderDetail,
        'order-modify': orderModify
    },
    // destroyed: {
    //     this.isAuthority = false
    // },
    watch: {
        '$route'(val, old) {
            if (val.path == this.routeUrl) {
                this.getPower()
                this.loadAllOrderList()
            }
        }
    }
}
</script>
<style lang="less" rel="stylesheet/less">
.MXOrder .Box .el-table .cell {
    padding-left: 5px !important;
    padding-right: 5px !important;
}
.MXOrder .SystemMessage {
    z-index: 2001;
}
</style>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
