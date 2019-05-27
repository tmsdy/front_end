
<template>
    <div class="recharge">
        <div class="overView">
            <!-- 日期 -->
            {{$t('mxpcweb.workbench.1530692925389')}}
            <div class="selectBox" style="margin-left:0px;width:250px;background-color:white;padding:0px;">
                <!-- 全部 -->
                <!-- <span class="selectItem text-hover" :class="selectItem==='ALL'?'selectItem1':''" @click="selectItemTab('ALL')">
                        {{$t('mxpcweb.am.1531905784605')}}</span> -->
                <!-- 支付宝 -->
                <!-- <span class="selectItem text-hover" :class="selectItem==='alipay'?'selectItem1':''" @click="selectItemTab('alipay')">
                        {{$t('mxpcweb.am.1532511399899')}}</span> -->
                <!-- 线下付款 -->
                <!-- <span class="selectItem text-hover" :class="selectItem==='offline'?'selectItem1':''" @click="selectItemTab('offline')">
                        {{$t('mxpcweb.companyregister.1528882498798')}}
                    </span> -->
                <span class="selectItem text-hover" style="padding:0px">
                    <!-- 自定义时间 -->
                    <el-date-picker v-model="selectTimeAuto" type="daterange" align="right" :placeholder="$t('mxpcweb.am.1531906032143')" :picker-options="pickerOptions2" @change="queryRechargeList">
                    </el-date-picker>
                </span>
            </div>
            <!-- 流水号 -->
            {{$t('mxpcweb.am.1533024150076')}}
            <div class="selectBox" style="margin-left:0px;width:240px;background-color:white;padding:0px;">
                <el-input :maxlength='200' v-model='serialNo' @keyup.enter.native="queryRechargeList" style="width:220px" placeholder=''></el-input>
            </div>
            <!-- 客户名称 -->
            {{$t('mxpcweb.client.1529055956170')}}
            <div class="selectBox" style="margin-left:10px;width:200px;background-color:white;padding:0px;">
                <customer class="addCust" labelPosition="left" labelWidth="0px" size="medium" rightWidth="200px" ref="customer" :itemData="queryItemData" :controlData.sync="queryItemData.controlData"></customer>
            </div>
            <!-- 线下充值 -->
            <el-button class="addButton" type="primary" size="small" @click="showOfflineRecharge">{{$t('mxpcweb.am.1533369008770')}}</el-button>
        </div>
        <div class="rechargeBoxList rechargeBoxTit MXscroll" v-loading="loading" :style="blockData.total>blockData.pageSize?'padding-bottom: 44px;':'padding-bottom: 0;'">
            <el-row class="list" :gutter="20">
                <el-col :span="4">{{$t('mxpcweb.client.1529055956170')}}</el-col>
                <!-- 流水号 -->
                <el-col :span="6">{{$t('mxpcweb.am.1533024150076')}}</el-col>
                <!-- 日期 -->
                <el-col :span="4">{{$t('mxpcweb.workbench.1530692925389')}}</el-col>
                <!-- 会计科目 -->
                <el-col :span="4">{{$t('mxpcweb.am.1533024174360')}}</el-col>
                <!-- 金额（元） -->
                <el-col :span="2">{{$t('mxpcweb.am.1533021610065')}}</el-col>
                <!-- 余额（元） -->
                <el-col :span="2">{{$t('mxpcweb.am.1533628052135')}}</el-col>
                <!-- 支付方式 -->
                <!-- <el-col :span="2">{{$t('mxpcweb.am.1533024217029')}}</el-col> -->
                <!-- 发票状态 -->
                <!-- <el-col :span="2">{{$t('mxpcweb.am.1533024244461')}}</el-col> -->
                <el-col :span="1">操作</el-col>
            </el-row>
            <no-data v-if="rechargeList.length==0 && !loading" style="background:rgba(255,255,255,0)"></no-data>
            <el-row v-else class="list1" :gutter="20" v-for="(item,index) in rechargeList" :key="index">
                <el-col :span="4" class="ellipsis" :title="item.companyname">{{item.companyname}}&nbsp;</el-col>
                <el-col :span="6" class="ellipsis" :title="item.serialnumber">{{item.serialnumber}}&nbsp;</el-col>
                <el-col :span="4" class="ellipsis" :title="item.createdate">{{item.createdate}}&nbsp;</el-col>
                <el-col :span="4" class="ellipsis" :title="item.captionofaccountname">{{item.captionofaccountname}}&nbsp;</el-col>
                <el-col :span="2" class="ellipsis" :title="item.rechargemoneystring">{{item.rechargemoneystring}}&nbsp;</el-col>
                <el-col :span="2" class="ellipsis" :title="item.remainderstring">{{item.remainderstring}}&nbsp;</el-col>
                <!-- <el-col :span="2" class="ellipsis" :title="item.rechargetypeName">{{item.rechargetypeName}}&nbsp;</el-col>
                         <el-col :span="2" class="ellipsis" :title="item.invoicestatusName">{{item.invoicestatusName}}&nbsp;</el-col> -->
                <el-col :span="1" class="ellipsis">
                    <span @click="showRefundPage(item.id,item.cid,item.ctid,item.serialnumber,item.remainder,item.product)" v-if="item.isrefund == 'N'
                              && item.isvalid == 'Y' && item.caninvoice == 'Y'  && item.remainder > 0" style="cursor:pointer;color:#d0021b">退款</span>
                </el-col>
            </el-row>
        </div>
        <!--分页-->
        <list-page style="background:#f7f8f9;text-align:center" :blockData="blockData" @getListData="queryRechargeList"></list-page>

        <!-- 线下充值 -->
        <el-dialog :title="$t('mxpcweb.am.1533369008770')" :visible.sync="isOpen" custom-class="width520" :beforeClose="closeForm" :closeOnClickModal="false">
            <el-form :model="form" v-loading="sureLoading" label-width='125px'>
                <el-form-item label="客户名称" :label-width="formLabelWidth" prop="companyName">
                    <customer class="addCust" labelPosition="left" labelWidth="0px" size="medium" rightWidth="300px" ref="customer" :itemData="itemData" :controlData.sync="itemData.controlData"></customer>
                </el-form-item>
                <el-form-item label="充值金额" :label-width="formLabelWidth" prop="rechargeMoney">
                    <el-input-number v-model="form.rechargeMoney" :step="100" style="width:300px;" :min="0" :max="100000"></el-input-number>
                </el-form-item>
                <el-form-item label="赠送抵用券" :label-width="formLabelWidth" prop="giveMoney">
                    <el-input-number v-model="form.giveMoney" :step="100" style="width:300px;" :change="giveMoneyChange()" :min="0" :max="100000"></el-input-number>
                </el-form-item>
                <el-form-item label="券有效期" :label-width="formLabelWidth" v-if="selectVisible">
                    <el-date-picker v-model="ValidTimeAuto" :picker-options="pickerOptions2" type="daterange" placeholder="选择日期范围">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="使用范围" :label-width="formLabelWidth" prop="product">
                    <el-select v-model="form.product" placeholder="请选择券使用范围">
                        <el-option v-for="item in productOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <div class='text-center'>
                    <!-- 确定 -->
                    <el-button type='primary' @click='Summit()' :disabled="disabledStatus">{{$t('mxpcweb.am.1531893129621')}}</el-button>
                    <!-- 取消 -->
                    <el-button @click="closeForm" :disabled="disabledStatus">{{$t('mxpcweb.am.1531893140621')}}</el-button>
                </div>
            </el-form>
        </el-dialog>
        <!-- 退款 -->
        <el-dialog title="退款" :visible.sync="refundIsOpen" custom-class="width520" :beforeClose="closeRefundForm" :closeOnClickModal="false">
            <el-form :model="refundForm" ref='postForm' label-width='125px'>
                <!-- 流水号 -->
                <el-form-item label="流水号">
                    {{refundForm.serialnumber}}
                </el-form-item>
                <el-form-item label="退款金额">
                    {{refundForm.remainder}}
                </el-form-item>
                <el-form-item label="备注">
                    <el-input :maxlength='80' type="textarea" :rows="2" v-model='refundForm.remark' style="width:200px" placeholder=''></el-input>
                </el-form-item>
                <div class='text-center'>
                    <!-- 确定 -->
                    <el-button type='primary' @click='SummitRefund()' :disabled="disabledStatus">{{$t('mxpcweb.am.1531893129621')}}</el-button>
                    <!-- 取消 -->
                    <el-button @click="closeRefundForm" :disabled="disabledStatus">{{$t('mxpcweb.am.1531893140621')}}</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { isArray } from '@/libs/utils.js'
import listPage from '@/components/listPage/index' // 分页
import NoData from '@/basecomponents/NoData/index'
import Customer from '@/components/Customer/index.vue'
export default {
    name: 'recharge',
    props: {

    },
    data() {
        return {
            disabledStatus: false, // 按钮不可用
            formLabelWidth: '105px',
            isOpen: false,
            cid: 0,
            refundIsOpen: false,
            loading: false,
            sureLoading: false,
            selectItem: 'ALL',
            serialNo: '',
            selectTimeAuto: ['', ''],
            rechargeList: [],
            owners: [],
            // 分页操作
            blockData: {
                pageSize: 20,
                total: 0,
                fromNum: 0
            },
            pickerOptions2: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7 - 3600 * 1000 * 24 * 30 || time.getTime() > Date.now()
                }
            },
            checkInfo: {
                count: 0,
                ids: [],
                money: 0
            },
            invoiceForm: {
                invoiceSettingId: '',
                invoinceType: '',
                invoinceTypeName: '',
                invoiceList: []
            },
            // 线下充值
            licVisible: false,
            selectVisible: false,
            form: {
                rechargeMoney: 0,
                giveMoney: 0,
                companyId: '',
                companyName: '',
                product: 'all',
                validbegindate: '',
                validenddate: '',
                validDate: '',
                licNo: '',
                cid: 0
            },
            ValidTimeAuto: ['', ''],
            itemData: {
                cnFieldCaption: '',
                controlData: '',
                isNotNull: 0
            },
            queryItemData: {
                cnFieldCaption: '',
                controlData: '',
                isNotNull: 0
            },
            // 全部 孚盟搜 孚盟AM
            productOptions: [
                { value: 'all', label: this.$t('mxpcweb.mail.1533353380357') }
                // { value: 'so', label: this.$t('mxpcweb.am.1533374221477') },
                // { value: 'am', label: this.$t('mxpcweb.am.1534312928406') }
            ],
            refundForm: {
                remark: '',
                id: 0,
                cid: 0,
                ctid: 0,
                serialnumber: '',
                remainder: 0,
                product: ''
            }
        }
    },
    created() {
        this.getEmployeeList()
        this.queryRechargeList()
    },
    methods: {
        /**
         * 确定退款
         */
        SummitRefund() {
            let _this = this
            _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.refund, {
                serialnumber: _this.refundForm.serialnumber,
                id: _this.refundForm.id,
                cid: _this.refundForm.cid,
                ctid: _this.refundForm.ctid,
                product: _this.refundForm.product,
                refundmoney: _this.refundForm.remainder,
                remark: _this.refundForm.remark
            }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.closeRefundForm()
                    _this.queryRechargeList()
                    _this.$message.success(_this.msg(res.body))
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
                this.disabledStatus = false
            }, function (res) {
                this.disabledStatus = false
                _this.$message.error((_this.$t(_this.Global.errorTitle)))
            })
        },
        /**
         * 显示退款界面
         */
        showRefundPage(id, cid, ctid, serialnumber, remainder, product) {
            let _this = this
            if (id > 0 && cid > 0 && serialnumber != '' && remainder > 0) {
                this.refundIsOpen = true
                this.refundForm.id = id
                this.refundForm.cid = cid
                this.refundForm.ctid = ctid
                console.log(ctid)
                this.refundForm.serialnumber = serialnumber
                this.refundForm.remainder = remainder
                this.refundForm.product = product
            } else {
                if (remainder <= 0) {
                    _this.$message.warning('已无可退的余额')
                } else {
                    _this.$message.warning('退款信息数据异常')
                }
            }
        },
        /**
         * 关闭退款页面
         */
        closeRefundForm() {
            this.refundIsOpen = false
            this.refundForm.remark = ''
        },
        // 赠送金额值改变时触发
        giveMoneyChange() {
            if (this.form.giveMoney > 0) {
                this.selectVisible = true
            } else {
                this.selectVisible = false
            }
        },
        closeForm() {
            this.form.rechargeMoney = 0
            this.form.giveMoney = 0
            this.form.product = 'all'
            this.itemData.controlData = null
            this.$refs['customer'].clearData()
            this.isOpen = false
            this.disabledStatus = false
        },
        // 确定提交
        Summit() {
            let _this = this
            _this.disabledStatus = true
            if (this.itemData.controlData != null && this.itemData.controlData.affCompanyId > 0) {
                if (this.form.rechargeMoney > 0 || this.form.giveMoney > 0) {
                    _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.recharge_offline, {
                        cid: _this.itemData.controlData.affCompanyId,
                        rechargeMoney: _this.form.rechargeMoney,
                        giveMoney: _this.form.giveMoney,
                        product: _this.form.product,
                        validbegindate: _this.ValidTimeAuto[0],
                        validenddate: _this.ValidTimeAuto[1]
                    }).then(function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            _this.closeForm()
                            _this.queryRechargeList()
                            _this.$message.success(_this.msg(res.body))
                        } else {
                            _this.$message.error(_this.msg(res.body))
                        }
                        this.disabledStatus = false
                    }, function (res) {
                        this.disabledStatus = false
                        _this.$message.error((_this.$t(_this.Global.errorTitle)))
                    })
                } else {
                    this.disabledStatus = false
                    // 至少要选择一种充值金额
                    this.$message.warning(_this.$t('mxpcweb.am.1533373838777'))
                }
            } else {
                this.disabledStatus = false
                // 请选择一家要充值的公司
                this.$message.warning(_this.$t('mxpcweb.am.1533373635622'))
            }
        },
        /**
         * 显示线下充值界面
         */
        showOfflineRecharge() {
            let _this = this
            _this.isOpen = true
        },
        /**
         * 获取员工列表
         */
        getEmployeeList() {
            var _this = this
            let contactData = {
                dataType: 'contact',
                funType: 'all'
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
        },
        returnPeople(ctid) {
            let name = ''
            this.owners.forEach(element => {
                if (element.ctId === ctid) {
                    name = element.realName
                }
            })
            return name
        },
        // 选择项目
        selectItemTab(item) {
            this.selectItem = item
            this.queryRechargeList()
        },
        // 获取充值列表
        queryRechargeList() {
            var _this = this
            var beginDate = ''
            var endDate = ''
            if (this.selectTimeAuto[0] && this.selectTimeAuto[1]) {
                let time = new Date()
                let sTime = _this.timeShow_custom(_this.$m_unifiedTime(time), 'HH:mm:ss')
                beginDate = _this.timeShow_custom(_this.$m_unifiedTime(this.selectTimeAuto[0]), 'YYYY-MM-DD') + ' ' + sTime
                endDate = _this.timeShow_custom(_this.$m_unifiedTime(this.selectTimeAuto[1]), 'YYYY-MM-DD') + ' ' + sTime
            }
            let data = {
                cid: _this.cid,
                beginTime: beginDate,
                endTime: endDate,
                serialnumber: _this.serialNo.trim(),
                pageIndex: parseInt(_this.blockData.fromNum / _this.blockData.pageSize),
                pageSize: _this.blockData.pageSize
            }
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.recharge_list_all, { params: data }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data.dataList)) {
                    _this.rechargeList = res.body.data.dataList
                    _this.blockData.total = res.body.data.resultCount
                } else {
                    _this.blockData.total = 0
                }
            }, function (res) {
                _this.$message.error((_this.$t(_this.Global.errorTitle)))
            })
        }
    },
    watch: {
        queryItemData: {
            handler(newValue, oldValue) {
                if (newValue != null && newValue.controlData != null &&
                    newValue.controlData.affCompanyId != null && newValue.controlData.affCompanyId != '') {
                    this.cid = newValue.controlData.affCompanyId
                } else {
                    this.cid = 0
                }
                this.queryRechargeList()
            },
            deep: true
        }
    },
    components: {
        'list-page': listPage,
        'no-data': NoData,
        'customer': Customer
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.recharge {
    height: 100%;
    overflow: auto;
    border-radius: 4px;
    .pageTab {
        position: absolute;
        top: 0;
        left: 0;
        right: 27px;
        padding-top: 5px;
    }
    .overView {
        height: 52px;
        line-height: 52px;
        background: white;
        margin-right: 10px;
        padding: 0 10px;
        .selectBox {
            display: inline-block;
            width: 640px;
            height: 40px;
            line-height: 40px;
            padding: 0 10px 0 18px;
            background: #f7f8f9;
            .selectItem {
                padding: 5px 10px;
                margin: 0 5px 0 10px;
            }
            .selectItem1 {
                background: white;
            }
        }
        .addButton {
            float: right;
            position: relative;
            top: 10px;
        }
    }
}
.rechargeBoxList {
    font-size: 12px;
    overflow-x: hidden;
    .list {
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        background: rgba(239, 242, 244, 1);
        color: RGBA(144, 147, 153, 1);
    }
    .list1 {
        height: 54px;
        line-height: 54px;
        color: RGBA(34, 34, 34, 1);
        border-bottom: 1px solid #f7f8f9;
        padding: 0 20px;
        background: white;
        .left10 {
            margin-left: 10px;
        }
        .listCol4 {
            .listCol4Item {
                display: none;
                width: 187px;
                float: right;
                .optButton {
                    display: inline-block;
                    width: 24px;
                    height: 24px;
                    background: linear-gradient(
                        135deg,
                        rgba(255, 105, 124, 1),
                        rgba(208, 2, 27, 1)
                    );
                    border-radius: 12px;
                    color: white;
                    text-align: center;
                    line-height: 24px;
                    font-size: 12px;
                    &:hover {
                        cursor: pointer;
                        background: linear-gradient(
                            135deg,
                            rgba(255, 148, 161, 1),
                            rgba(247, 36, 62, 1)
                        );
                    }
                    &:link {
                        cursor: pointer;
                        background: linear-gradient(
                            135deg,
                            rgba(255, 105, 124, 1),
                            rgba(208, 2, 27, 1)
                        );
                    }
                }
            }
        }
        &:hover {
            background: #fcf2f3;
            .listCol4 {
                .listCol4Item {
                    display: inline;
                }
            }
        }
    }
}
.rechargeBoxTit {
    overflow-y: auto;
    overflow-x: hidden;
    position: absolute;
    top: 107px;
    right: 14px;
    left: 14px;
    bottom: 67px;
}
</style>
