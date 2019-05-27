
<template>
    <div class="invoice">
          <div class="overView" >
                <!-- 发票状态： -->
                {{$t('mxpcweb.am.1533024244461')}}
                <div class="selectBox" style="margin-left:10px;">
                    <!-- 全部 -->
                    <span class="selectItem text-hover" :class="selectItemStatus==='ALL'?'selectItem1':''" @click="selectItemStatusTab('ALL')">
                        {{$t('mxpcweb.am.1531905784605')}}</span>
                    <!-- 申请开票 -->
                    <span class="selectItem text-hover" :class="selectItemStatus==='applyinvoice'?'selectItem1':''" @click="selectItemStatusTab('applyinvoice')">
                        {{$t('mxpcweb.am.1533023985178')}}</span>
                    <!-- 已寄送 -->
                    <span class="selectItem text-hover" :class="selectItemStatus==='send'?'selectItem1':''" @click="selectItemStatusTab('send')">
                        {{$t('mxpcweb.am.1533027685626')}}
                    </span>
                 </div>
                 <!-- 邮寄信息 -->
                 <span style="padding-left:50px;"> {{$t('mxpcweb.am.1533027792334')}}</span>
                 <div class="selectBox" style="margin-left:10px;">
                    <!-- 全部 -->
                    <span class="selectItem text-hover" :class="selectItemType==='ALL'?'selectItem1':''" @click="selectItemTypeTab('ALL')">
                        {{$t('mxpcweb.am.1531905784605')}}</span>
                    <!-- 顺丰寄送 -->
                    <span class="selectItem text-hover" :class="selectItemType==='sf'?'selectItem1':''" @click="selectItemTypeTab('sf')">
                        {{$t('mxpcweb.am.1533027810301')}}</span>
                    <!-- 顺丰到付 -->
                    <span class="selectItem text-hover" :class="selectItemType==='sf-fc'?'selectItem1':''" @click="selectItemTypeTab('sf-fc')">
                        {{$t('mxpcweb.am.1533027833220')}}
                    </span>
                    <!-- 申请开票 -->
                     <!-- <el-button class="addButton" type="primary" size="small" @click="exportReport()">{{$t('mxpcweb.am.1533023985178')}}</el-button> -->
                </div>
                 <!-- 申请开票 -->
                <el-button class="addButton" type="primary" size="small"  @click="$emit('backPage','2')">{{$t('mxpcweb.am.1533023985178')}}</el-button>
            </div>
                 <div class="invoiceBoxList invoiceBoxTit MXscroll"  v-loading="loading" :style="blockData.total>blockData.pageSize?'padding-bottom: 44px;':'padding-bottom: 0;'">
                    <el-row class="list" :gutter="20">
                        <!-- 发票单号 -->
                        <el-col :span="3">{{$t('mxpcweb.am.1533030842311')}}</el-col>
                        <!-- 发票金额 -->
                        <el-col :span="2">{{$t('mxpcweb.am.1533030884870')}}</el-col>
                          <!-- 发票抬头 -->
                        <el-col :span="4">{{$t('mxpcweb.am.1533030904081')}}</el-col>
                        <!-- 申请时间 -->
                        <el-col :span="3">{{$t('mxpcweb.am.1533030920937')}}</el-col>
                        <!-- 快递公司 -->
                        <el-col :span="2">{{$t('mxpcweb.am.1533030939510')}}</el-col>
                        <!-- 快递单号 -->
                        <el-col :span="3">{{$t('mxpcweb.am.1533030959746')}}</el-col>
                        <!-- 发票状态 -->
                        <el-col :span="2">{{$t('mxpcweb.am.1533024244461')}}</el-col>
                        <!-- 操作 -->
                        <el-col :span="2">{{$t('mxpcweb.am.1531902668646')}}</el-col>
                    </el-row>
                    <no-data v-if="invoiceList.length==0 && !loading" style="background:rgba(255,255,255,0)"></no-data>
                    <el-row v-else class="list1" :gutter="20" v-for="(item,index) in invoiceList" :key="index">
                        <el-col :span="3" class="ellipsis" :title="item.invoiceno">{{item.invoiceno}}&nbsp;</el-col>
                        <el-col :span="2" class="ellipsis" :title="item.invoicemoneystring">{{item.invoicemoneystring}}&nbsp;</el-col>
                        <el-col :span="4" class="ellipsis" :title="item.invoicetitle">{{item.invoicetitle}}&nbsp;</el-col>
                        <el-col :span="3" class="ellipsis" :title="item.invoicedate">{{item.invoicedate}}&nbsp;</el-col>
                        <el-col :span="2" class="ellipsis" :title="item.expresstypename">{{item.expresstypename}}&nbsp;</el-col>
                        <el-col :span="3" class="ellipsis" :title="item.expressno">{{item.expressno}}&nbsp;</el-col>
                         <el-col :span="2" class="ellipsis" :title="item.invoicestatusname">{{item.invoicestatusname}}&nbsp;</el-col>
                         <el-col :span="2" class="ellipsis"  >
                              <!-- 详情 -->
                              <span @click="showDetail(item.id)"  style="cursor:pointer;color:#d0021b">{{$t('mxpcweb.client.detail.1529993364826')}}</span>
                         </el-col>
                    </el-row>
                </div>
             <!--分页-->
            <list-page  style="background:#f7f8f9;text-align:center" :blockData="blockData"  @getListData="queryInvoiceList"></list-page>
            <!-- 明细页面 -->
             <el-dialog :title="$t('mxpcweb.am.1534387449031')"  :visible.sync="isOpen"  custom-class="width520" >
                    <table class="widthFull" >
                        <tr style="line-height:35px;">
                            <td>发票性质</td>
                            <td>{{invoiceDetail.invoiceattributename}}</td>
                            <td>发票状态</td>
                            <td>{{invoiceDetail.invoicestatusname}}</td>
                        </tr>
                         <tr style="line-height:35px;">
                            <td>发票类型</td>
                            <td>{{invoiceDetail.invoicetypename}}</td>
                            <td>发票抬头</td>
                            <td>{{invoiceDetail.invoicetitle}}</td>
                        </tr>
                        <tr style="line-height:35px;">
                            <td>申请时间</td>
                            <td>{{invoiceDetail.invoicedate}}</td>
                            <td>发票金额</td>
                            <td>{{invoiceDetail.invoicemoneystring}}</td>
                        </tr>
                        <tr style="line-height:35px;">
                            <td>收件人</td>
                            <td>{{invoiceDetail.receipt}}</td>
                            <td>邮寄地址</td>
                            <td>{{invoiceDetail.postaddress}}</td>
                        </tr>
                        <tr style="line-height:35px;">
                            <td>邮编</td>
                            <td>{{invoiceDetail.zipcode}}</td>
                            <td>联系电话</td>
                            <td>{{invoiceDetail.phone}}</td>
                        </tr>
                        <tr style="line-height:35px;">
                            <td>快递公司</td>
                            <td>{{invoiceDetail.expresstypename}}</td>
                            <td>快递单号</td>
                            <td>{{invoiceDetail.expressno}}</td>
                        </tr>
                    </table>
             </el-dialog>
    </div>
</template>

<script>
import {isArray} from '@/libs/utils.js'
import listPage from '@/components/listPage/index' // 分页
import NoData from '@/basecomponents/NoData/index'
export default {
    name: 'invoice',
    props: {

    },
    data() {
        return {
            loading: false,
            selectItemType: 'ALL',
            selectItemStatus: 'ALL',
            selectTimeAuto: ['', ''],
            invoiceList: [],
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
            invoiceDetail: [],
            isOpen: false
        }
    },
    created() {
        this.getEmployeeList()
        this.queryInvoiceList()
    },
     methods: {
         /**
          * 显示发票明细
          */
         showDetail(id) {
               var _this = this
              let para = {
                    id: id
                }
                _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.invoice_detail, { params: para }).then(function(res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.invoiceDetail = res.body.data.entity
                        if (_this.invoiceDetail != null && _this.invoiceDetail.id != undefined && _this.invoiceDetail.id > 0) {
                            _this.isOpen = true
                        }
                    } else {
                        _this.$message(_this.msg(res.body))
                    }
                }, function(res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
         },
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
        selectItemStatusTab(item) {
            this.selectItemStatus = item
            this.queryInvoiceList()
        },
        selectItemTypeTab(item) {
            this.selectItemType = item
            this.queryInvoiceList()
        },
        // 获取发票明细列表
        queryInvoiceList() {
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
                expressType: _this.selectItemType,
                invoicestatus: _this.selectItemStatus,
                pageIndex: parseInt(_this.blockData.fromNum / _this.blockData.pageSize),
                pageSize: _this.blockData.pageSize
            }
            this.loading = true
             _this.$http.get(this.Global.baseURL + this.Global.api.v2.invoice_list, {params: data}).then(function(res) {
                this.loading = false
                    if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data.dataList)) {
                        _this.invoiceList = res.body.data.dataList
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
   .invoice{
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
                width: 340px;
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
        .invoiceBoxList{
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
            .invoiceBoxTit{
                overflow-y: auto;
                overflow-x: hidden;
                position: absolute;
                top: 107px;
                right: 14px;
                left: 14px;
                bottom: 67px;
            }
</style>
