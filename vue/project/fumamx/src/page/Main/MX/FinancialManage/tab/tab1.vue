
<template>
    <div class="consume">
          <div class="overView" >
              <!-- 日期 -->
             日期
                <div class="selectBox" style="margin-left:0px;width:250px;background-color:white;padding:0px;">
                     <span class="selectItem text-hover" style="padding:0px;">
                        <!-- 自定义时间 -->
                        <el-date-picker
                        v-model="selectTimeAuto"
                        type="daterange"
                        align="right"
                        :placeholder="$t('mxpcweb.am.1531906032143')"
                        :picker-options="pickerOptions2"   @change="queryConsumeList">
                        </el-date-picker>
                    </span>
                </div>
                <!-- 项目： -->
                {{$t('api-am.1533016228700')}}
                <div class="selectBox" style="margin-left:0px;width:300px;padding:0px;">
                    <!-- 全部 -->
                    <span class="selectItem text-hover" :class="selectItem==='ALL'?'selectItem1':''" @click="selectItemTab('ALL')">
                        {{$t('mxpcweb.am.1531905784605')}}</span>
                    <!-- 扣费 -->
                    <span class="selectItem text-hover" :class="selectItem==='consume'?'selectItem1':''" @click="selectItemTab('consume')">
                        {{$t('api-am.1533016414061')}}</span>
                    <!-- 返账 -->
                    <span class="selectItem text-hover" :class="selectItem==='cashback'?'selectItem1':''" @click="selectItemTab('cashback')">
                        {{$t('api-am.1533016432286')}}</span>
                    <!-- 快递 -->
                    <span class="selectItem text-hover" :class="selectItem==='express'?'selectItem1':''" @click="selectItemTab('express')">
                        {{$t('api-am.1533016448554')}}</span>
                </div>
                <!-- 客户名称-->
                 {{$t('mxpcweb.client.1529055956170')}}
                 <div class="selectBox" style="margin-left:0px;width:250px;background-color:white;">
                         <customer class="addCust" labelPosition="left" labelWidth="0px" size="medium"  rightWidth="200px" ref="customer"  :itemData="itemData"
                             :controlData.sync="itemData.controlData"></customer>
                </div>
            </div>
                 <div class="consumeBoxList consumeBoxTit MXscroll"  v-loading="loading" :style="blockData.total>blockData.pageSize?'padding-bottom: 44px;':'padding-bottom: 0;'">
                    <el-row class="list" :gutter="20">
                        <el-col :span="4">{{$t('mxpcweb.client.1529055956170')}}</el-col>
                        <!-- 日期 -->
                        <el-col :span="4">{{$t('mxpcweb.workbench.1530692925389')}}</el-col>
                        <!-- 金额（元） -->
                        <el-col :span="4">{{$t('mxpcweb.am.1533021610065')}}</el-col>
                        <!-- 项目 -->
                        <el-col :span="4">{{$t('mxpcweb.am.1533021628297')}}</el-col>
                        <!-- 备注 -->
                        <el-col :span="5">{{$t('mxpcweb.am.1531900669055')}}</el-col>
                        <!-- 操作人 -->
                        <!-- <el-col :span="3">{{$t('mxpcweb.systemset.logaction.1530345368161')}}</el-col> -->
                        <!-- <el-col :span="4"></el-col> -->
                    </el-row>
                    <no-data v-if="consumeList.length==0 && !loading" style="background:rgba(255,255,255,0)"></no-data>
                        <el-row v-else class="list1" :gutter="20" v-for="(item,index) in consumeList" :key="index">
                        <el-col :span="4" class="ellipsis" :title="item.companyname">{{item.companyname}}&nbsp;</el-col>
                        <el-col :span="4" class="ellipsis" :title="item.createdate">{{item.createdate}}&nbsp;</el-col>
                        <el-col :span="4" class="ellipsis" :title="item.consumemoneystring">{{item.consumemoneystring}}&nbsp;</el-col>
                         <el-col :span="4" class="ellipsis" :title="item.captionofaccountname">{{item.captionofaccountname}}&nbsp;</el-col>
                        <el-col :span="5">{{item.remark}}&nbsp;</el-col>
                        <!-- <el-col :span="3">{{returnPeople(item.ctid)}}&nbsp;</el-col> -->
                    </el-row>
                </div>
             <!--分页-->
            <list-page  style="background:#f7f8f9;text-align:center" :blockData="blockData"  @getListData="queryConsumeList"></list-page>
    </div>
</template>

<script>
import {isArray} from '@/libs/utils.js'
import listPage from '@/components/listPage/index' // 分页
import NoData from '@/basecomponents/NoData/index'
import Customer from '@/components/Customer/index.vue'
export default {
    name: 'consume',
    props: {

    },
    data() {
        return {
            itemData: {
                cnFieldCaption: '',
                controlData: '',
                isNotNull: 0
            },
            cid: 0,
            loading: false,
            selectItem: 'ALL',
            selectTimeAuto: ['', ''],
            consumeList: [],
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
            }
        }
    },
    created() {
        this.getEmployeeList()
        this.queryConsumeList()
    },
     methods: {
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
            this.queryConsumeList()
        },
        // 获取消费明细列表
        queryConsumeList() {
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
                item: _this.selectItem,
                pageIndex: parseInt(_this.blockData.fromNum / _this.blockData.pageSize),
                pageSize: _this.blockData.pageSize,
                cid: _this.cid
            }
             _this.$http.get(this.Global.baseURL + this.Global.api.v2.consume_list_all, {params: data}).then(function(res) {
                    if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data.dataList)) {
                        _this.consumeList = res.body.data.dataList
                        _this.blockData.total = res.body.data.resultCount
                    } else {
                        _this.blockData.total = 0
                    }
                }, function(res) {
                    _this.$message.error((_this.$t(_this.Global.errorTitle)))
                })
        }
     },
       watch: {
            itemData: {
                handler(newValue, oldValue) {
                    if (newValue != null && newValue.controlData != null &&
                                newValue.controlData.affCompanyId != null && newValue.controlData.affCompanyId != '') {
                         this.cid = newValue.controlData.affCompanyId
                    } else {
                        this.cid = 0
                    }
                    this.queryConsumeList()
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
   .consume{
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
        .consumeBoxList{
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
            .consumeBoxTit{
                overflow-y: auto;
                overflow-x: hidden;
                position: absolute;
                top: 107px;
                right: 14px;
                left: 14px;
                bottom: 67px;
            }
</style>
