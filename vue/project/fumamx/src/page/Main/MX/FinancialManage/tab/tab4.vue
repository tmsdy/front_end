
<template>
    <div class="invoice">
          <div class="overView" >
               <!-- 日期 -->
                 <span style="padding-left:0px;"> {{$t('mxpcweb.workbench.1530692925389')}}</span>
                 <div class="selectBox" style="margin-left:0px;background-color:white;padding:0px;">
                    <el-date-picker
                        v-model="selectTimeAuto"
                        type="daterange"
                             :placeholder="$t('mxpcweb.am.1531906032143')"
                        :picker-options="pickerOptions2"   @change="queryInvoiceList" >
                        </el-date-picker>
                 </div>
                <!-- 发票状态： -->
                {{$t('mxpcweb.am.1533024244461')}}
                <div class="selectBox" style="margin-left:0px;">
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
            </div>
                 <div class="invoiceBoxList invoiceBoxTit MXscroll"  v-loading="loading" :style="blockData.total>blockData.pageSize?'padding-bottom: 44px;':'padding-bottom: 0;'">
                    <el-table  :data="invoiceList" stripe style="width: 100%">
                        <el-table-column   label="发票单号" >
                            <template slot-scope="scope">
                                <span style="margin-left: 10px" @click="showRechageList(scope.row.rechargeids,scope.row.cid)" >{{ scope.row.invoiceno }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="invoicemoneystring"  label="发票金额"  >  </el-table-column>
                        <el-table-column prop="invoicetitle"   label="发票抬头">  </el-table-column>
                         <el-table-column prop="invoicetypename"   label="发票类型"  > </el-table-column>
                         <el-table-column  prop="receipt"   label="收件人" >  </el-table-column>
                         <el-table-column  prop="postaddress" label="邮寄地址" > </el-table-column>
                         <el-table-column prop="zipcode" label="邮编"  > </el-table-column>
                         <el-table-column prop="invoicestatusname" label="开票状态" > </el-table-column>
                         <el-table-column prop="invoicedate" label="申请时间" > </el-table-column>
                         <el-table-column prop="expressno" label="快递单号"> </el-table-column>
                          <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button   size="small" @click="showPost(scope.row)" v-if="scope.row.expressno == '' || scope.row.expressno == null" >
                                    <span style="cursor:pointer;color:#d0021b">邮寄</span></el-button>
                            </template>
                            </el-table-column>
                    </el-table>
                </div>
             <!--分页-->
            <list-page  style="background:#f7f8f9;text-align:center" :blockData="blockData"  @getListData="queryInvoiceList"></list-page>
            <!-- 邮寄 -->
                <el-dialog :title="$t('mxpcweb.am.1533619435540')"  :visible.sync="isOpen" custom-class="width520"  :beforeClose="closeForm" :closeOnClickModal="false" >
                <el-form   :model="postForm"  ref='postForm'  label-width='125px' :rules="formRules">
                    <!-- 快递公司 -->
                     <el-form-item :label="$t('mxpcweb.am.1533030939510')"   class='is-required'   prop="expressType">
                        <el-select v-model="postForm.expressType" placeholder=""   >
                            <el-option v-for="item in expressOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                     <!-- 快递单号 -->
                    <el-form-item  :label="$t('mxpcweb.am.1533030959746')" prop='expressNo' class='is-required'>
                         <el-input :maxlength='200' v-model='postForm.expressNo' style="width:200px" placeholder=''></el-input>
                    </el-form-item>
                     <!-- 快递费用 -->
                     <el-form-item  :label="$t('mxpcweb.am.1534323137114')" prop='expressCost' class='is-required'>
                          <el-input-number v-model="postForm.expressCost" :step="1"  style="width:200px;" :min="0" :max="1000"  ></el-input-number>
                    </el-form-item>
                     <div class='text-center'>
                        <!-- 确定 -->
                        <el-button type='primary' @click='Summit()' :disabled="disabledStatus" >{{$t('mxpcweb.am.1531893129621')}}</el-button>
                        <!-- 取消 -->
                        <el-button @click="closeForm"  :disabled="disabledStatus" >{{$t('mxpcweb.am.1531893140621')}}</el-button>
                    </div>
                </el-form>
            </el-dialog>
          <!-- 开票金额详情 -->
            <!-- <div class="invoiceBoxList invoiceBoxTit MXscroll"> -->
                <el-dialog :title="$t('mxpcweb.am.1534397661100')"   :visible.sync="isRechargeListOpen" custom-class="rechargeListClass">
                        <el-row class="list" :gutter="20">
                            <!-- 流水号 -->
                            <el-col :span="12">{{$t('mxpcweb.am.1533024150076')}}</el-col>
                            <!-- 会计科目 -->
                            <el-col :span="3">{{$t('mxpcweb.am.1533024174360')}}</el-col>
                            <!-- 金额（元） -->
                            <el-col :span="3">{{$t('mxpcweb.am.1533628034617')}}</el-col>
                        </el-row>
                        <el-row   class="list1" :gutter="20" v-for="(item,index) in rechargeList" :key="index">
                            <el-col :span="12"   :title="item.serialnumber">{{item.serialnumber}}&nbsp;</el-col>
                            <el-col :span="3"   :title="item.captionofaccountname">{{item.captionofaccountname}}&nbsp;</el-col>
                            <el-col :span="3"   :title="item.rechargemoneystring">{{item.rechargemoneystring}}&nbsp;</el-col>
                        </el-row>
                </el-dialog>
            <!-- </div> -->
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
         /**
              * 不能为空
              * @param rule
              * @param value
              * @param callback
              */
             var checkIsNull = (rule, value, callback) => {
                 if (value === '') {
                     callback(new Error('值不能为空'))
                 } else {
                     callback()
                 }
             }
        return {
            disabledStatus: false,
            isOpen: false,
            isRechargeListOpen: false,
            ValidTimeAuto: ['', ''],
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
            postForm: {
                expressType: 'sf-fc',
                expressNo: '',
                expressCost: '',
                id: -1,
                rechargeIds: '',
                cid: -1,
                ctid: -1
            },
            expressOptions: [{ value: 'sf', label: this.$t('mxpcweb.am.1533027810301') },
            { value: 'sf-fc', label: this.$t('mxpcweb.am.1533027833220') }],
             // 检查空值
            formRules: {
                expressNo: [
                    {required: true, validator: checkIsNull, trigger: 'blur'}
                ]
            },
            rechargeList: []
        }
    },
    created() {
        this.getEmployeeList()
        this.queryInvoiceList()
    },
     methods: {
         /**
          * 显示充值记录
          */
         showRechageList(rechargeids, cid) {
               var _this = this
              let para = {
                    rechargeIds: rechargeids,
                    cid: cid
                }
                if (rechargeids != undefined && rechargeids != null && rechargeids != '') {
                    _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.invoice_rechargeList, { params: para }).then(function(res) {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            console.log(res.body.data)
                            _this.rechargeList = res.body.data.dataList
                            if (_this.rechargeList != null && _this.rechargeList.length > 0) {
                                _this.isRechargeListOpen = true
                            }
                        } else {
                            _this.$message(_this.msg(res.body))
                        }
                    }, function(res) {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    })
                }
         },
         /**
          * 提交
          */
         Summit() {
               let _this = this
                      this.disabledStatus = true
              _this.$refs['postForm'].validate((valid) => {
                if (valid) {
                     _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.saveExpress, {
                             id: _this.postForm.id,
                            expressno: _this.postForm.expressNo,
                            expresstype: _this.postForm.expressType,
                            expresscost: _this.postForm.expressCost,
                            rechargeids: _this.postForm.rechargeIds,
                            cid: _this.postForm.cid,
                            ctid: _this.postForm.ctid
                         }).then(function(res) {
                                if (res.body.code.toString() == _this.Global.RES_OK) {
                                   _this.closeForm()
                                    _this.queryInvoiceList()
                                    _this.$message.success(_this.msg(res.body))
                                } else {
                                    _this.$message.error(_this.msg(res.body))
                                }
                                this.disabledStatus = false
                            }, function(res) {
                               this.disabledStatus = false
                                _this.$message.error(_this.$t(_this.Global.errorTitle))
                            })
                } else {
                    this.disabledStatus = false
                }
              })
         },
         closeForm() {
             this.postForm.expressType = 'sf-fc'
             this.postForm.expressNo = ''
             this.postForm.expressCost = 0
             this.isOpen = false
         },
         /**
          * 显示邮寄画面
          */
         showPost(row) {
             if (row != undefined && row != null) {
                 var id = row.id
                 var rechargeIds = row.rechargeids
                 var cid = row.cid
                 var ctid = row.ctid
                let _this = this
                if (id > 0 && rechargeIds != null && rechargeIds != '') {
                    this.postForm.id = id
                    this.postForm.rechargeIds = rechargeIds
                    this.postForm.cid = cid
                    this.postForm.ctid = ctid
                    this.isOpen = true
                } else {
                _this.$message.warning(_this.$t('mxpcweb.am.1533624548325'))
                }
             }
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
        // 获取消费明细列表
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
                cid: 0,
                beginTime: beginDate,
                endTime: endDate,
                expressType: _this.selectItemType,
                invoicestatus: _this.selectItemStatus,
                pageIndex: parseInt(_this.blockData.fromNum / _this.blockData.pageSize),
                pageSize: _this.blockData.pageSize
            }
            console.log(data)
             _this.$http.get(this.Global.baseURL + this.Global.api.v2.invoice_list_all, {params: data}).then(function(res) {
                    if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data.dataList)) {
                        _this.invoiceList = res.body.data.dataList
                        _this.blockData.total = res.body.data.resultCount
                    } else {
                        _this.blockData.total = 0
                    }
                }, function(res) {
                    _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
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
             .rechargeListClass{
                font-size: 12px;
                overflow-x: hidden;
                width: 30%;
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
</style>
