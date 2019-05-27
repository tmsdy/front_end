<template>
    <div class="AdvancedSearch">
        <!-- 高级搜索 -->
        <el-dialog v-dialogDrag :title="$t('mxpcweb.mail.1528955423785')" custom-class="width890" :visible.sync="isOpen" :close-on-click-modal="false" >
            <div v-loading="loading2">
                <el-row :gutter="20" v-for="(item,index) in LabelUseShow" :key="index">
                    <div v-for="(item2,index2) in item" :key="index2">
                        <el-col :span="12">
                            <div class="searchBox">
                                <div class="searchItemLabel">
                                    <span class="textLabel">{{item2.realFieldName}}</span>
                                    <el-dropdown trigger="click" @command="handleCommand">
                                        <span class="el-dropdown-link">
                                            <i class="iconfont icon-arrow-down"></i>
                                        </span>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item :command="{action:'operation',ShowIndex:index,Colindex:index2,ReplaceItem:item3,currentIndex:index3}" v-for="(item3,index3) in LabelUnuseHideen" :key="index3">{{item3.realFieldName}} </el-dropdown-item>
                                            <!-- 删除本字段 -->
                                            <el-dropdown-item :command="{action:'delete',ShowIndex:index,Colindex:index2,ReplaceItem:item2}" divided>{{$t('mxpcweb.mail.1528955430706')}}</el-dropdown-item>

                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                                <div class="searchContent">
                                    <!-- 请选择时间早于 -->
                                    <el-date-picker v-model="longSentDate_lt" v-if="item2.fieldId==7" align="center" type="date" :placeholder="$t('mxpcweb.mail.1528955431017')" class="widthFull" :picker-options="pickerOptionsZ"> </el-date-picker>
                                    <!-- 请选择时间晚于 -->
                                    <el-date-picker v-model="longSentDate_gt" v-if="item2.fieldId==8" align="center" type="date" :placeholder="$t('mxpcweb.mail.1528955431340')" class="widthFull" :picker-options="pickerOptionsZ"> </el-date-picker>

                                    <!-- 标签 -->
                                    <el-select v-if="item2.fieldId==15" v-model="labelId " class="widthFull">
                                        <!-- 请选择 -->
                                        <el-option :label="$t('mxpcweb.mail.1528884704820')" value="-100"> </el-option>
                                        <el-option v-for="(item5,index5) in dynamicTags" :key="index5" :label="item5.labelName" :value="item5.labelId"></el-option>
                                    </el-select>
                                    <!-- 阅读 -->
                                    <el-select v-if="item2.fieldId==12" v-model="status " class="widthFull">
                                        <!-- 请选择 -->
                                        <el-option :label="$t('mxpcweb.mail.1528884704820')" value="-100"> </el-option>
                                        <!-- 未读 -->
                                        <el-option :label="$t('mxpcweb.mail.1528721627451')" value="-1"></el-option>
                                        <!-- 已读 -->
                                        <el-option :label="$t('mxpcweb.mail.1528721626678')" value="1"></el-option>
                                    </el-select>
                                    <!-- 邮件类型 -->
                                    <el-select v-if="item2.fieldId==14" v-model="mailType" class="widthFull">
                                        <!-- 请选择 -->
                                        <el-option :label="$t('mxpcweb.mail.1528884704820')" value="-100"> </el-option>
                                        <!-- 收件 -->
                                        <el-option :label="$t('mxpcweb.mail.1528955770276')" value="FMR"></el-option>
                                        <!-- 发件 -->
                                        <el-option :label="$t('mxpcweb.mail.1528955772764')" value="FMD"></el-option>
                                        <!-- 导入 -->
                                        <el-option :label="$t('mxpcweb.mail.1528955773001')" value="FMI"></el-option>
                                        <!-- 草稿 -->
                                        <el-option :label="$t('mxpcweb.mail.1528955773232')" value="FMDRAFT"></el-option>
                                    </el-select>
                                    <!-- 附件 -->
                                    <el-select v-if="item2.fieldId==10" v-model="containAttachment" class="widthFull">
                                        <!-- 请选择 -->
                                        <el-option :label="$t('mxpcweb.mail.1528884704820')" value="-100"> </el-option>
                                        <!-- 有附件 -->
                                        <el-option :label="$t('mxpcweb.mail.1528721624048')" value="true"></el-option>
                                        <!-- 无附件 -->
                                        <el-option :label="$t('mxpcweb.mail.1528721626364')" value="false"></el-option>
                                    </el-select>
                                    <!-- 文件夹 -->
                                    <el-select v-if="item2.fieldId==9" v-model="folder " class="widthFull">
                                        <!-- 请选择 -->
                                        <el-option :label="$t('mxpcweb.mail.1528884704820')" value="-100"> </el-option>
                                        <el-option v-for="(item6,index6) in res_Resultlist.data" :key="index6" :label="item6.boxName" :value="item6.boxId"></el-option>
                                    </el-select>
                                    <!-- 客户 -->
                                    <div v-if="item2.fieldId==5" style="margin-top:8px">
                                        <customer v-if="item2.fieldId==5" labelPosition="left" labelWidth="0" rightWidth="305px" size="22px" ref="customer" :itemData="itemData1" :controlData.sync="itemData1.controlData"></customer>
                                    </div>
                                    <!-- 联系人  -->
                                    <div v-if="item2.fieldId==6" style="margin-top:8px">
                                        <contacts labelPosition="left" labelWidth="0" rightWidth="305px" size="22px" marginTop="8px" ref="contacts" :itemData="itemData2" :controlData.sync="itemData2.controlData"></contacts>
                                    </div>
                                    <!-- 帐号 -->
                                    <el-select v-if="item2.fieldId==11" v-model="mailAddressAccount" class="widthFull">
                                        <!-- 请选择 -->
                                        <el-option :label="$t('mxpcweb.mail.1528884704820')" value="-100"> </el-option>
                                        <el-option v-for="(item9,index9) in res_Resultaccounts.data.mailAccountsInfo" :key="index9" :label="item9.mailAddress" :value="item9.mailAddress"></el-option>
                                    </el-select>
                                    <!-- 请输入主题 -->
                                    <el-input v-model="subject" v-if="item2.fieldId==1" :placeholder="$t('mxpcweb.mail.1528954325325')" class="pull-right f-width"></el-input>
                                    <!-- 请输入发件人 -->
                                    <el-input v-model="fromEx" v-if="item2.fieldId==2" :placeholder="$t('mxpcweb.mail.1528955882112')" class="pull-right f-width"></el-input>
                                    <!-- 请输入收件人 -->
                                    <el-input v-model="to" v-if="item2.fieldId==3" :placeholder="$t('mxpcweb.mail.1528955884394')" class="pull-right f-width"></el-input>
                                    <!-- 请输入邮件内容 -->
                                    <el-input v-model="content" v-if="item2.fieldId==4" :placeholder="$t('mxpcweb.mail.1528955884682')" class="pull-right f-width"></el-input>
                                </div>
                            </div>
                        </el-col>

                    </div>

                </el-row>
                <el-row :gutter="20">
                    <div style="margin:10px 108px 20px 110px;">
                        <el-col :span="12">
                            <!-- 添加其他字段 -->
                            <el-button v-if="LabelUnuseHideen.length>0" class="pull-right f-width" @click="addOther()" style="width:100%;">+{{$t('mxpcweb.mail.1528955922716')}}</el-button>

                        </el-col>

                    </div>
                </el-row>
                <br>
                <br>

                <div class="text-center">
                    <!-- 立即搜索 -->
                    <el-button type="primary" :loading="submitLoading" style="width:190px;" @click="searchSubmit()">{{$t('mxpcweb.mail.1530004204446')}}</el-button>
                    <!-- 快速搜索 -->
                    <el-button type="text" @click="OpenQuickSearch()">{{$t('mxpcweb.mail.1530004215393')}}</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog v-dialogDrag :title="$t('mxpcweb.mail.1530004215393')" custom-class="width420" :visible.sync="kisOpen" :close-on-click-modal="false" >
            <table class="tableClass">
                <tr>
                    <td class="text-center">
                        <template>
                            <!-- 请输入主题/正文/收件人/发件人 -->
                            <el-input :placeholder="$t('mxpcweb.mail.1528963582691')" v-model="keywords" class="pull-right f-width">
                            </el-input>
                        </template>
                    </td>

                </tr>
                <tr>
                    <td class="text-center" style="higth:80px;"></td>
                </tr>
                <tr>
                    <td class="text-center">
                        <el-button type="primary" :loading="submitLoading" @click="searchSubmit()">{{$t('mxpcweb.mail.1530004204446')}}</el-button>
                        <!-- 高级搜索 -->
                        <el-button type="text" @click="OpenAdvancedSearch()">{{$t('mxpcweb.mail.1528955423785')}}</el-button>
                    </td>
                </tr>
            </table>
        </el-dialog>
    </div>
</template>
<script>
/**
 * 描述：邮件部分
 * 作者：向士健(CSS) / ***(API)
 * 时间：2017/12/11
 */

import { mapGetters } from 'vuex'
import { isObject } from '@/libs/utils.js'
import Customer from '@/components/Controls/Customer/index'
import Contacts from '@/components/Controls/Contacts/index'
import Vue from 'vue'
export default {
    name: 'AdvancedSearch',
    props: ['dynamicTags'],
    data() {
        let _this = this
        return {
            isOpen: false,
            kisOpen: false,
            LabelUseShow: [], // 显示标签
            LabelUnuseHideen: [], // 显示标签ideen
            longSentDate_lt: NaN, // 早于
            longSentDate_gt: NaN, // 晚于
            labelId: '-100',
            containAttachment: '-100',
            mailType: '-100',
            status: '-100',
            folder: '-100',
            mailAddressAccount: '-100', // 账号
            to: '', // 收件人
            content: '', // 正文
            custId: '', // 客户
            contact: '', // 联系人
            subject: '', // 主题
            fromEx: '', // 发件人
            pickerOptions: {
                shortcuts: [{
                    text: _this.$t('mxpcweb.mail.1528975810590'), // '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date())
                    }
                }, {
                    text: _this.$t('mxpcweb.mail.1528955004333'), // '明天',
                    onClick(picker) {
                        const date = new Date()
                        date.setTime(date.getTime() + 3600 * 1000 * 24)
                        picker.$emit('pick', date)
                    }
                }, {
                    text: _this.$t('mxpcweb.mail.1528955067857'), // '一周后',
                    onClick(picker) {
                        const date = new Date()
                        date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', date)
                    }
                }]
            },
            pickerOptionsZ: {
                disabledDate: (time) => {
                    // if (this.longSentDate_gt != '' && this.longSentDate_gt != NaN) {
                    if (this.longSentDate_gt != '' && !isNaN(this.longSentDate_gt)) {
                        return time.getTime() < this.longSentDate_gt
                    }
                    // if (this.longSentDate_lt != '' && this.longSentDate_lt != NaN) {
                    if (this.longSentDate_lt != '' && !isNaN(this.longSentDate_lt)) {
                        return time.getTime() > this.longSentDate_lt
                    }
                }
            },
            keywords: '',
            res_Resultlist: {}, // 文件夹
            res_Resultaccounts: {}, // 帐号
            loading2: false,
            itemData1: {
                controlData: '',
                isNotNull: 0
            },
            itemData2: {
                controlData: '',
                isNotNull: 0
            },
            submitLoading: false
        }
    },
    computed: {
        ...mapGetters([
            'company'
        ])
    },
    methods: {
        OpenAdvancedSearch() {
            this.getAdvancedSearch()
            this.kisOpen = false
            this.isOpen = true
            this.loading2 = true
        },
        OpenQuickSearch() {
            this.kisOpen = true
            this.isOpen = false
            this.loading2 = false
        },
        // 父组件来调用
        isDialog(to) {
            if (to == 'open') {
                // this.kisOpen = true;
                // this.isOpen = false;
                this.OpenAdvancedSearch()
            } else {
                this.isOpen = false
                this.kisOpen = false
            }
        },
        // 获取邮件搜索字段
        getAdvancedSearch() {
            let { ctId } = this.company
            this.$http.get(this.Global.baseURL + this.Global.api.Mail.getAdvancedSearch, { params: { ctId: ctId } }).then(function (res) {
                if (res.body.code.toString() == this.Global.RES_OK && isObject(res.body.data)) {
                    this.loading2 = false
                    this.LabelUseShow = []
                    this.res_Resultlist = res.body.data.Resultlist // 文件夹
                    this.res_Resultaccounts = res.body.data.Resultaccounts// 帐号
                    let dataResult = res.body.data.retrunList.data.use
                    let dataList = []
                    for (let i = 1; i <= dataResult.length; i++) {
                        if (i % 2 != 0) {
                            dataList = []
                            dataList.push(dataResult[i - 1])
                        } else {
                            dataList.push(dataResult[i - 1])
                            this.LabelUseShow.push(dataList)
                        }
                    }
                    this.LabelUnuseHideen = res.body.data.retrunList.data.unUse
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, function (res) {
                this.$message.error(res)
            })
        },
        // 添加其他字段
        addOther() {
            let len = this.LabelUseShow.length - 1
            if (this.LabelUseShow[len].length == 2) {
                this.LabelUseShow.push([this.LabelUnuseHideen[0]])
            } else {
                this.LabelUseShow[len].push(this.LabelUnuseHideen[0])
            }
            this.searchFieldOption(this.LabelUnuseHideen[0].fieldId, '1')// 添加
            this.LabelUnuseHideen.splice(0, 1)
        },
        // 操作
        handleCommand(command) {
            let fieldId = this.LabelUseShow[command.ShowIndex][command.Colindex].fieldId
            if (command.action == 'operation') { // 修改
                let targetFieldId = command.ReplaceItem.fieldId
                this.searchFieldUpdate(fieldId, targetFieldId)
                this.LabelUnuseHideen[command.currentIndex] = Object.assign({}, this.LabelUseShow[command.ShowIndex][command.Colindex])
                this.LabelUseShow[command.ShowIndex][command.Colindex] = command.ReplaceItem
                Vue.set(this.LabelUnuseHideen, command.currentIndex, this.LabelUnuseHideen[command.currentIndex])
            } else {
                this.searchFieldOption(fieldId, '0')// 删除
                this.LabelUseShow[command.ShowIndex].splice(command.Colindex, 1)// 显示数组删除
                this.LabelUnuseHideen.push(command.ReplaceItem)// 隐藏数组添加
            }
        },
        // 添加(删除)搜索字段
        searchFieldOption(fieldId, isShow) {
            this.$http.post(this.Global.baseURL + this.Global.api.Mail.searchFieldPost, { fieldId: fieldId, isShow: isShow }).then(function (res) {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    //  this.$message("成功");
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, function (res) {
                this.$message.error(res)
            })
        },
        // 修改搜索字段
        searchFieldUpdate(fieldId, targetFieldId) {
            this.$http.post(this.Global.baseURL + this.Global.api.Mail.searchFieldPut, { fieldId: fieldId, targetFieldId: targetFieldId }).then(function (res) {
                if (res.body.code.toString() == this.Global.RES_OK) {
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, function (res) {
                this.$message.error(res)
            })
        },
        formatTime(time) {
            if (time === '' || time === null || time === undefined || time === 'undefined') {
                return ''
            } else {
                return Vue.moment(time).utc().utcOffset(+8).format('YYYY-MM-DD')
            }
        },
        // 保存
        searchSubmit() {
            this.submitLoading = true
            if (this.isOpen) {
                let data = {}
                // if (this.longSentDate_lt != '' && this.longSentDate_lt != undefined && this.longSentDate_lt != NaN) {
                if (this.longSentDate_lt != '' && this.longSentDate_lt != undefined && !isNaN(this.longSentDate_lt)) {
                    data.longSentDate_lt = this.formatTime(this.longSentDate_lt, { format: 'YYYY-MM-DD' })
                }// 早于
                // if (this.longSentDate_gt != '' && this.longSentDate_gt != undefined && this.longSentDate_gt != NaN) {
                if (this.longSentDate_gt != '' && this.longSentDate_gt != undefined && !isNaN(this.longSentDate_gt)) {
                    data.longSentDate_gt = this.formatTime(this.longSentDate_gt, { format: 'YYYY-MM-DD' })
                } // 晚于
                if (this.labelId != '-100') {
                    data.labelId = this.labelId
                }
                if (this.containAttachment != '-100') {
                    data.containAttachment = this.containAttachment
                }
                if (this.mailType != '-100') {
                    data.mailType = this.mailType
                }
                if (this.status != '-100') {
                    data.status = this.status
                }
                // 文件夹
                if (this.folder != '-100') {
                    data.folder = this.folder
                }
                // 账号
                if (this.mailAddressAccount != '-100') {
                    data.mailAddress = this.mailAddressAccount
                }
                // 收件人
                if (this.to != '') {
                    data.to = this.to
                }
                // 正文
                if (this.content != '') {
                    data.content = this.content
                }
                // 客户
                if (this.itemData1.controlData != '' && this.itemData1.controlData != '无') {
                    data.custId = this.itemData1.controlData
                }
                // 联系人
                if (this.itemData2.controlData != '' && this.itemData2.controlData != '无') {
                    data.contId = this.itemData2.controlData
                }
                // 主题
                if (this.subject != '') {
                    data.subject = this.subject.trim()
                }
                // 发件人
                if (this.fromEx != '') {
                    data.fromEx = this.fromEx
                }
                this.isOpen = false
                this.submitLoading = false
                if (!_.isEmpty(data)) {
                    this.$emit('AdvancedSearchClick', data, 'F', true)
                }
            } else {
                this.kisOpen = false
                this.submitLoading = false
                if (this.keywords != '') {
                    this.$emit('SearchClick', this.keywords, 'F')
                }
            }
        }
    },
    components: {
        'customer': Customer,
        'Contacts': Contacts
    },
    watch: {
        itemData1: {
            handler(curVal, oldvalue) {
                if (curVal.controlData != '') {
                    this.$refs['contacts'][0].getData(curVal.controlData, true)
                    // this.$refs['contacts'][0].clearData();
                }
            },
            deep: true
        }
    }

}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
