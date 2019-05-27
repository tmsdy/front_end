
<template>
    <div class="recharge">
          <div class="overView" >
               <!-- 日期 -->
                {{$t('mxpcweb.workbench.1530692925389')}}
                <div class="selectBox" style="margin-left:0px;width:250px;background-color:white;padding:0px;">
                    <span class="selectItem text-hover">
                        <!-- 自定义时间 -->
                        <el-date-picker
                        v-model="selectTimeAuto"
                        type="daterange"
                        align="right"
                        :placeholder="$t('mxpcweb.am.1531906032143')"
                        :picker-options="pickerOptions2"   @change="queryRechargeList">
                        </el-date-picker>
                    </span>
                </div>
                <!-- 支付信息： -->
                {{$t('mxpcweb.am.1533023784016')}}
                <div class="selectBox" style="margin-left:10px;width:300px;">
                    <!-- 全部 -->
                    <span class="selectItem text-hover" :class="selectItem==='ALL'?'selectItem1':''" @click="selectItemTab('ALL')">
                        {{$t('mxpcweb.am.1531905784605')}}</span>
                    <!-- 支付宝 -->
                    <span class="selectItem text-hover" :class="selectItem==='alipay'?'selectItem1':''" @click="selectItemTab('alipay')">
                        {{$t('mxpcweb.am.1532511399899')}}</span>
                    <!-- 线下付款 -->
                    <span class="selectItem text-hover" :class="selectItem==='offline'?'selectItem1':''" @click="selectItemTab('offline')">
                        {{$t('mxpcweb.companyregister.1528882498798')}}</span>
                </div>
                <!-- 申请开票 -->
                <el-button class="addButton" type="primary" size="small" @click="showInvoiceForm()">{{$t('mxpcweb.am.1533023985178')}}</el-button>
            </div>
                 <div class="rechargeBoxList rechargeBoxTit MXscroll"  v-loading="loading" :style="blockData.total>blockData.pageSize?'padding-bottom: 44px;':'padding-bottom: 0;'">
                    <el-row class="list" :gutter="20">
                         <el-col :span="1" >&nbsp;</el-col>
                        <!-- 流水号 -->
                        <el-col :span="4">{{$t('mxpcweb.am.1533024150076')}}</el-col>
                        <!-- 日期 -->
                        <el-col :span="4">{{$t('mxpcweb.workbench.1530692925389')}}</el-col>
                          <!-- 会计科目 -->
                        <el-col :span="4">{{$t('mxpcweb.am.1533024174360')}}</el-col>
                        <!-- 金额（元） -->
                        <el-col :span="4">{{$t('mxpcweb.am.1533021610065')}}</el-col>
                        <!-- 支付方式 -->
                        <el-col :span="2">{{$t('mxpcweb.am.1533024217029')}}</el-col>
                        <!-- 发票状态 -->
                        <el-col :span="3">{{$t('mxpcweb.am.1533024244461')}}</el-col>
                    </el-row>
                    <no-data v-if="rechargeList.length==0 && !loading" style="background:rgba(255,255,255,0)"></no-data>
                    <el-row v-else class="list1" :gutter="20" v-for="(item,index) in rechargeList" :key="index">
                        <el-col :span="1"  class="ellipsis" >
                          <el-checkbox v-model="item.ischeck" v-if="(item.caninvoice=='N' || item.isrefund=='Y' || item.invoiced=='Y'
                                 ||  item.rechargetype=='offline' || item.isvalid != 'Y')" disabled></el-checkbox>
                           <el-checkbox  v-else  @change='calculateCheck(item.ischeck,item.id,item.rechargemoney)' v-model="item.ischeck"></el-checkbox>
                        </el-col>
                        <el-col :span="4" class="ellipsis" :title="item.serialnumber">{{item.serialnumber}}&nbsp;</el-col>
                        <el-col :span="4" class="ellipsis" :title="item.createdate">{{item.createdate}}&nbsp;</el-col>
                         <el-col :span="4" class="ellipsis" :title="item.captionofaccountname">{{item.captionofaccountname}}&nbsp;</el-col>
                        <el-col :span="4" class="ellipsis" :title="item.rechargemoneystring">{{item.rechargemoneystring}}&nbsp;</el-col>
                         <el-col :span="2" class="ellipsis" :title="item.rechargetypeName">{{item.rechargetypeName}}&nbsp;</el-col>
                         <el-col :span="4" class="ellipsis" :title="item.invoicestatusName">{{item.invoicestatusName}}&nbsp;</el-col>
                    </el-row>
                </div>
             <!--分页-->
            <list-page  style="background:#f7f8f9;text-align:center" :blockData="blockData"  @getListData="queryRechargeList"></list-page>

            <!-- 索要发票 -->
            <el-dialog :title="$t('mxpcweb.am.1533366357896')"  :visible.sync="isOpen" custom-class="width520" >
                <div style="font-size:12px;">{{$t('mxpcweb.am.1533366663854')}} {{checkInfo.count}} {{$t('mxpcweb.am.1533366712449')}}</div>
                <el-form :model="invoiceForm"  ref="invoiceForm" label-width="100px">
                    <!-- 开票金额合计 -->
                    <el-form-item :label="$t('mxpcweb.am.1533366463616')" prop="type">
                        ￥ {{checkInfo.money.toFixed(2)}}
                    </el-form-item>
                    <!-- 发票抬头 -->
                    <el-form-item :label="$t('mxpcweb.am.1533030904081')" prop="type">
                        <el-select v-model="invoiceForm.invoiceSettingId"  @change="changeInvoice()" placeholder="">
                        <el-option  v-for="(item, index) in invoiceForm.invoiceList"  :key="index" :value="item.id"
                                         :label="item.invoicetitle" ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 发票类型 -->
                    <el-form-item :label="$t('mxpcweb.am.1533203251765')" prop="type">
                        {{invoiceForm.invoinceTypeName}}
                    </el-form-item>
                    <div class="text-center">
                        <!-- 确定 -->
                        <el-button type="primary" :disabled="disabledStatus" @click="confirmInvoince()">{{$t('mxpcweb.am.1531893129621')}}</el-button>
                        <!-- 取消 -->
                        <el-button  @click="closeForm" :disabled="disabledStatus">{{$t('mxpcweb.am.1531893140621')}}</el-button>
                    </div>
                </el-form>
            </el-dialog>
    </div>
</template>

<script>
import {isArray} from '@/libs/utils.js'
import listPage from '@/components/listPage/index' // 分页
import NoData from '@/basecomponents/NoData/index'
export default {
    name: 'recharge',
    props: {

    },
    data() {
        return {
            disabledStatus: false,
            isOpen: false,
            loading: false,
            selectItem: 'ALL',
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
            }
        }
    },
    created() {
        this.getEmployeeList()
        this.queryRechargeList()
    },
     methods: {
         closeForm() {
             this.invoiceForm.invoiceSettingId = ''
             this.invoiceForm.invoinceType = ''
             this.invoiceForm.invoinceTypeName = ''
             this.isOpen = false
         },
         /**
          * 切换发票设置
          */
        changeInvoice() {
            var id = this.invoiceForm.invoiceSettingId
            let _this = this
            if (isArray(this.invoiceForm.invoiceList)) {
                this.invoiceForm.invoiceList.forEach(element => {
                    if (element.id == id) {
                        _this.invoiceForm.invoinceType = element.invoinceType
                        if (element.invoicetype == 'vat-ti') {
                            // 增值税普通发票
                            _this.invoiceForm.invoinceTypeName = this.$t('mxpcweb.am.1533202447660')
                        } else {
                            // 增值税专用发票
                            _this.invoiceForm.invoinceTypeName = this.$t('mxpcweb.am.1533202486424')
                        }
                }
                })
            }
        },
         /**
          * 确定开票
          */
         confirmInvoince() {
             let _this = this
             this.disabledStatus = true
             if (_this.invoiceForm.invoiceSettingId <= 0) {
                //  请选择发票抬头
                  _this.$message.warning(_this.$t('mxpcweb.am.1533363340532'))
                  return
             }
             if (_this.checkInfo.money <= 0) {
                //  发票金额必须大于0
                  _this.$message.warning(_this.$t('mxpcweb.am.1533363391208'))
                  return
             }
             if (!isArray(_this.checkInfo.ids) || _this.checkInfo.ids.length <= 0) {
                //  请选择要开票的充值记录
                  _this.$message.warning(_this.$t('mxpcweb.am.1533363480539'))
                  return
             }
             console.log(_this.checkInfo.ids)
             var rechargeIdListString = ''
             _this.checkInfo.ids.forEach(element => {
                 console.log(element)
                 rechargeIdListString = rechargeIdListString + element + ','
             })
             console.log(rechargeIdListString)
             _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.invoice_add,
                {
                    invoiceSettingId: _this.invoiceForm.invoiceSettingId,
                    invoiceAmount: _this.checkInfo.money,
                    rechargeIdList: rechargeIdListString
                }
                ).then(function(res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message.success(_this.msg(res.body))
                    _this.isOpen = false
                    _this.queryRechargeList()
                    _this.disabledStatus = false
                } else {
                    _this.$message.error(_this.msg(res.body))
                    _this.disabledStatus = false
                }
            }, function(res) {
                _this.$message.error((_this.$t(_this.Global.errorTitle)))
                _this.disabledStatus = false
            })
         },
         calculateCheck(val, id, money) {
             if (val) {
                 this.checkInfo.count++
                 this.checkInfo.money += money
                 this.checkInfo.ids.push(id)
             } else {
                 this.checkInfo.count--
                 this.checkInfo.money -= money
                 this.checkInfo.ids.pop(id)
             }
         },
         /**
          * 显示开票界面
          */
         showInvoiceForm() {
             let _this = this
             if (this.checkInfo.count <= 0) {
                //  请选择要开票的数据
                _this.$message.warning(_this.$t('mxpcweb.am.1534311545429'))
             } else {
                this.isOpen = true
                _this.$http.get(this.Global.baseURL + this.Global.api.v2.invoice_setting_list, {}).then(function(res) {
                        if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data.dataList)) {
                            _this.invoiceForm.invoiceList = res.body.data.dataList
                            if (_this.invoiceForm.invoiceList != undefined && _this.invoiceForm.invoiceList != null && _this.invoiceForm.invoiceList.length > 0) {
                                    _this.invoiceForm.invoiceList.forEach(element => {
                                        if (element.isdefault == 'Y') {
                                            _this.invoiceForm.invoiceSettingId = element.id
                                        }
                                    })
                            }
                        } else {
                            _this.invoiceForm.invoiceList = []
                        }
                    }, function(res) {
                        _this.$message.error((_this.$t(_this.Global.errorTitle)))
                })
             }
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
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.accountDropList_get, { params: contactData }).then(function(res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.owners = res.body.data
                    } else {
                        _this.$message(_this.msg(res.body))
                    }
                }, function(res) {
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
        // 获取充值明细列表
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
                beginTime: beginDate,
                endTime: endDate,
                rechargeType: _this.selectItem,
                pageIndex: parseInt(_this.blockData.fromNum / _this.blockData.pageSize),
                pageSize: _this.blockData.pageSize
            }
            this.loading = true
             _this.$http.get(this.Global.baseURL + this.Global.api.v2.recharge_list, {params: data}).then(function(res) {
                this.loading = false
                    if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data.dataList)) {
                        _this.rechargeList = res.body.data.dataList
                        _this.blockData.total = res.body.data.resultCount
                    } else {
                        _this.blockData.total = 0
                    }
                }, function(res) {
                    _this.$message.error((_this.$t(_this.Global.errorTitle)))
                })
        }
     },
     components: {
        'list-page': listPage,
        'no-data': NoData
        }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
   .recharge{
        height: 100%;
        overflow: auto;
        border-radius:4px;
        .pageTab{
            position: absolute;
            top: 0;
            left: 0;
            right: 27px;
            padding-top: 5px;
        }
        .overView{
            height: 52px;
            line-height: 52px;
            background: white;
            margin-right:10px;
            padding: 0 10px;
            .selectBox{
                display: inline-block;
                width: 640px;
                height: 40px;
                line-height: 40px;
                padding: 0 10px 0 18px;
                background: #f7f8f9;
                .selectItem{
                    padding:5px 10px;
                    margin: 0 5px 0 10px;
                }
                .selectItem1{
                    background: white;
                }
            }
            .addButton{
                float: right;
                position: relative;
                top: 10px;
            }
        }
    }
        .rechargeBoxList{
                font-size: 12px;
                overflow-x: hidden;
                .list{
                    height:40px;
                    line-height:40px;
                    padding: 0 20px;
                    background:rgba(239,242,244,1);
                    color: RGBA(144, 147, 153, 1);
                }
                .list1{
                    height: 54px;
                    line-height: 54px;
                    color: RGBA(34, 34, 34, 1);
                    border-bottom:1px solid  #f7f8f9;
                    padding: 0 20px;
                    background: white;
                    .left10{
                        margin-left: 10px;
                    }
                    .listCol4{
                        .listCol4Item{
                            display: none;
                            width: 187px;
                            float: right;
                            .optButton{
                                display: inline-block;
                                width:24px;
                                height:24px;
                                background:linear-gradient(135deg,rgba(255,105,124,1),rgba(208,2,27,1));
                                border-radius:12px;
                                color: white;
                                text-align: center;
                                line-height: 24px;
                                font-size: 12px;
                                &:hover{
                                    cursor: pointer;
                                    background:linear-gradient(135deg,rgba(255,148,161,1),rgba(247,36,62,1));
                                }
                                &:link{
                                    cursor: pointer;
                                    background:linear-gradient(135deg,rgba(255,105,124,1),rgba(208,2,27,1));
                                }
                            }
                        }
                    }
                    &:hover{
                        background:#fcf2f3;
                        .listCol4{
                            .listCol4Item{
                                display: inline;
                            }
                        }
                    }
                }
            }
            .rechargeBoxTit{
                overflow-y: auto;
                overflow-x: hidden;
                position: absolute;
                top: 107px;
                right: 14px;
                left: 14px;
                bottom: 67px;
            }
</style>
