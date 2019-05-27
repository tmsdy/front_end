<template>
    <div class="addWork MXscroll">
        <!-- 邮件营销 -->
        <!-- 编辑任务 -->
        <page-detail :title="$t('mxpcweb.am.1531897436358')" iconfont="icon-mail" :detailTitle="$t('mxpcweb.am.1541989338465')" @toList="$emit('tabDataCheck','1')"></page-detail>
        <div class="addWorkBox" v-loading="loading">
            <div class="listBox" v-if="!loading">
                <el-form :model="ruleForm" ref="ruleForm" onsubmit="return false" label-position="top">
                    <div class="list">
                        <div class="listItem">
                            <!-- 基本数据 -->
                            <span class="listTitle">{{$t('mxpcweb.am.1531897456157')}}</span>
                            <span class="listRight">
                                <!-- 仅供个人使用，任务名称并不会显示在寄出的邮件内 -->
                                {{$t('mxpcweb.am.1531897456373')}}
                            </span>
                        </div>
                        <div class="listItem1">
                            <div>
                                <!-- 任务名称 -->
                                <span class="listTitle">{{$t('mxpcweb.am.1531897456597')}}</span>
                                <span class="listRight">
                                    <el-form-item class="formItem">
                                        <el-input :maxlength="20" v-model="ruleForm.workName" style="width: 240px;"></el-input>
                                    </el-form-item>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="list">
                        <div class="listItem">
                            <!-- 选择发件人 -->
                            <span class="listTitle">{{$t('mxpcweb.am.1531897472661')}}</span>
                        </div>
                        <div class="listItem1">
                            <div>
                                <!-- 发件人 -->
                                <span class="listTitle">{{$t('mxpcweb.am.1531897635637')}}</span>
                                <span class="listRight">
                                    <el-form-item class="formItem">
                                        <el-select v-model="ruleForm.sendPeople" style="width: 240px;" @change="changeSendPeopleName()">
                                            <el-option v-for="(item,index) in sendList" :key="index" :label="item.name+'<'+item.address+'>'" :value="item.address"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </span>
                            </div>
                            <div>
                                <!-- 回复地址 -->
                                <span class="listTitle">{{$t('mxpcweb.am.1531897636341')}}</span>
                                <span class="listRight">
                                    <el-form-item class="formItem">
                                        <el-select size="small" v-model="ruleForm.replyPeople" style="width: 240px;" @change="changeReplyPeopleName()">
                                            <el-option v-for="(item,index) in replyList" :key="index" :label="item.name+'<'+item.address+'>'" :value="item.address"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="list">
                        <div class="listItem">
                            <!-- 选择接收人 -->
                            <span class="listTitle">{{$t('mxpcweb.am.1531897670095')}}</span>
                        </div>
                        <div class="listItem1">
                            <div>
                                <!-- 接收人 -->
                                <span class="listTitle">{{$t('mxpcweb.am.1531897676549')}}</span>
                                <span class="listRight">
                                    <el-form-item class="formItem">
                                        <people-select :sendeePeople.sync="ruleForm.sendeePeople" :sendeePeopleName.sync="ruleForm.sendeePeopleName" width="240px" :peopleCount.sync="peopleCount"></people-select>
                                    </el-form-item>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="list">
                        <div class="listItem">
                            <!-- 内容选项 -->
                            <span class="listTitle">{{$t('mxpcweb.am.1531897676765')}}</span>
                        </div>
                        <div class="listItem1">
                            <!-- <el-form-item  label="发送资料" class="formItem">
                                <el-select  v-model="ruleForm.sendData"  style="width: 240px;" placeholder="开发信">
                                    <el-option label="开发信" value="1"></el-option>
                                    <el-option label="按商品筛选器过滤" value="2"></el-option>
                                    <el-option label="商品标签" value="3"></el-option>
                                </el-select>
                            </el-form-item> -->
                            <div>
                                <!-- 开发信模板 -->
                                <span class="listTitle">{{$t('mxpcweb.am.1531897676973')}}</span>
                                <span class="listRight">
                                    <el-form-item class="formItem">
                                        <!-- 请选择开发信模板 -->
                                        <el-select size="small" v-model="ruleForm.developmentLetter" style="width: 240px;" :placeholder="$t('mxpcweb.am.1531897682965')" @change="developmentLetterChange()">
                                            <el-option v-for="(item,index) in developmentLetterList" :key="index" :label="item.name" :value="item.invokeName"></el-option>
                                        </el-select>
                                        <!-- 预览 -->
                                        <span v-if="ruleForm.developmentLetter!=''" class="text-hover" style="margin-left:15px;font-size:12px;color:RGBA(208, 2, 27, 1)" @click="$refs.preview.isShowTemplate(ruleForm.developmentLetter)">{{$t('mxpcweb.am.1531893065005')}}</span>
                                        <span v-else style="margin-left:15px;font-size:12px;color:RGBA(208, 2, 27, 1)">{{$t('mxpcweb.am.1531893065005')}}</span>
                                    </el-form-item>
                                </span>
                            </div>
                            <div>
                                <!-- 附件 -->
                                <span class="listTitle">{{$t('mxpcweb.am.1531897705558')}}</span>
                                <span class="listRight">
                                    <el-form-item class="formItem">
                                        <label v-if="files.length>1" style="color:RGBA(223, 226, 228, 1)">
                                            <i class="iconfont icon-attachment"></i>
                                            <!-- 上传附件 -->
                                            {{$t('mxpcweb.am.1531897712935')}}
                                        </label>
                                        <label v-else for="addMailWork_excels1" class="text-hover" style="color:#6CA2FF">
                                            <i class="iconfont icon-attachment"></i>
                                            <!-- 上传附件 -->
                                            {{$t('mxpcweb.am.1531897712935')}}
                                        </label>
                                        <file-upload ref="fileUpload" :file-list="files" :limitSize="5" :multiple="false">
                                            <!-- 选择文件 -->
                                            <el-button id="addMailWork_excels1" slot="trigger" size="small" type="primary" v-show="false">{{$t('mxpcweb.am.1531897718879')}}</el-button>
                                        </file-upload>
                                    </el-form-item>
                                </span>
                            </div>
                        </div>
                        <div v-if="cost>0&&peopleCount>0" style="color: #6B6B6B;font-size: 12px;margin-left: 95px;">邮件0.02元/封，超过200KB，每200KB算一封；当前任务总大小{{costSize}}，预计消费{{(cost*peopleCount).toFixed(2)}}元（实际消费以使用情况为准）</div>
                    </div>

                    <div class="list" style="border:0;">
                        <div class="listItem">
                            <!-- 发送时间详情 -->
                            <span class="listTitle">{{$t('mxpcweb.am.1531897725350')}}</span>
                        </div>
                        <div class="listItem1">
                            <div>
                                <!-- 发送时间选项 -->
                                <span class="listTitle">{{$t('mxpcweb.am.1531897725878')}}</span>
                                <span class="listRight">
                                    <el-form-item class="formItem">
                                        <!-- 开发信 -->
                                        <el-select size="small" v-model="taskType" style="width: 240px;" :placeholder="$t('mxpcweb.am.1531893092789')">
                                            <!-- 立即发送 -->
                                            <el-option :label="$t('mxpcweb.am.1531897739630')" value="N"></el-option>
                                            <!-- 设定发送时间 -->
                                            <el-option :label="$t('mxpcweb.am.1531897739853')" value="D"></el-option>
                                            <!-- 周期性多次发送 -->
                                            <el-option :label="$t('mxpcweb.am.1531897740597')" value="C"></el-option>
                                        </el-select>
                                        <span class="formItemTit" v-if="taskType=='N'">
                                            <!-- （任务将会在创建成功后5分钟内执行） -->
                                            {{$t('mxpcweb.am.1531897740822')}}
                                        </span>
                                    </el-form-item>
                                </span>
                            </div>
                            <div v-if="taskType=='D'">
                                <!-- 传送时间 -->
                                <span class="listTitle">{{$t('mxpcweb.am.1531897758405')}}</span>
                                <span class="listRight">
                                    <el-form-item class="formItem">
                                        <!-- 选择日期时间 -->
                                        <el-date-picker size="small" v-model="sendTime1" clearable style="width: 240px;" type="datetime" :placeholder="$t('mxpcweb.am.1531897759021')" format="yyyy-MM-dd HH:mm"> </el-date-picker>
                                    </el-form-item>
                                </span>
                            </div>
                            <div v-if="taskType=='C'">
                                <span class="listTitle"></span>
                                <span class="listRight">
                                    {{ruleForm.cycleTitle}}
                                    <!-- 设置 -->
                                    <span class="cycleSeting text-hover" @click="$refs.cycleTime.showDialog()">{{$t('mxpcweb.am.1531897759246')}}</span>
                                    <div v-if="ruleForm.cycleEndTime!=''" style="height:30px;line-height:30px">
                                        <!-- (周期结束时间) -->
                                        {{ruleForm.cycleEndTime}}{{$t('mxpcweb.am.1531897775157')}}
                                    </div>
                                </span>
                            </div>
                            <!-- <el-form-item  label="时区" class="formItem">
                                <div style="font-size:12px;color:#333333">目前 GMT 时间 -   Apr 25, 2018; 12:25:14 <span style="text-decoration:underline;margin-left:15px;">编辑</span></div>
                                <div style="font-size:12px;color:#6b6b6b">若你的联系人和你在不同的时区，通过设置时区，发送邮件给不同时区的联系人。</div>
                            </el-form-item> -->
                        </div>
                    </div>
                    <div style="padding-left:100px;margin-top:5px">
                        <!-- 保存为草稿 -->
                        <el-button type="primary" :loading="subLoading" @click="submit('DR')">{{$t('mxpcweb.am.1531897782118')}}</el-button>
                        <!-- 发送 -->
                        <el-button type="success" :loading="subLoading" style="background:RGBA(145, 210, 121, 1);border:1px solid RGBA(145, 210, 121, 1);" @click="submit()">{{$t('mxpcweb.am.1531900969998')}}</el-button>
                        <!-- 取消 -->
                        <el-button :plain="true" type="success" @click="$emit('tabDataCheck','1')">{{$t('mxpcweb.am.1531893140621')}}</el-button>
                    </div>
                </el-form>
                <cycle-time ref="cycleTime" :sendTimeBase.sync="ruleForm.sendTimeBase" :sendTime.sync="ruleForm.sendTimes" :cycleTitle.sync="ruleForm.cycleTitle" :cycleEndTime.sync="ruleForm.cycleEndTime" :cycleType.sync="ruleForm.cycleType" :cycleTypeBase.sync="ruleForm.cycleTypeBase"></cycle-time>
                <!-- 预览 -->
                <editor-preview ref="preview"></editor-preview>
            </div>
        </div>
    </div>

</template>

<script>
import PageDetail from '@/components/PageDetail/index' // 大标题
import peopleSelect from './select.vue'
import cycleTime from './cycleTime.vue'
import { isArray } from '@/libs/utils.js'
import FileUpload from '@/components/FileUpload/index' // 文件上传
import editorPreview from '@/components/editorPreview/index' // 预览
export default {
    name: 'addWork',
    props: {
        itemData: {
            type: Object,
            default: function () {
                return {

                }
            }
        },
        ctid: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            ruleForm: {
                workName: '',
                sendPeople: '',
                replyPeople: '',
                replyAddressId: '',
                sendeePeople: '',
                sendAddressId: '',
                sendeePeopleName: '',
                sendPeopleName: '',
                sendData: '1',
                domainId: '',
                developmentLetter: '',
                developmentLetterName: '',
                transmissionTime: '',
                sendTimeBase: '',
                sendTime: '',
                sendTimes: '',

                cycleTitle: '',
                cycleEndTime: '',
                cycleType: 'everyday',
                cycleTypeBase: ''
            },
            files: [],
            subLoading: false,
            // 星期日
            // 星期一
            // 星期二
            // 星期三
            // 星期四
            // 星期五
            // 星期六
            weekData: ['', this.$t('mxpcweb.am.1531899922192'), this.$t('mxpcweb.am.1531899914414'), this.$t('mxpcweb.am.1531899919352'), this.$t('mxpcweb.am.1531899919696'), this.$t('mxpcweb.am.1531899920064'), this.$t('mxpcweb.am.1531899920888'), this.$t('mxpcweb.am.1531899921696')],
            taskType: 'N',
            sendTime: '',
            sendTime1: '',
            sendList: [],
            replyList: [],
            sendeeList: [],
            developmentLetterList: [],
            pageSize: 50,
            loading: true,
            downloadBaseUrl: this.Global.downloadBaseUrl,
            contenSize: 0,
            attchSize: 0,
            cost: 0,
            costSize: '',
            peopleCount: 0,
            Letter: ''
        }
    },
    mounted() {

    },
    created() {
        let _this = this
        let itemDatas = this.itemData
        var p1 = new Promise((resolve, reject) => {
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.task_Get, {
                params: {
                    taskId: itemDatas.taskId
                }
            }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    resolve(res.body.data)
                } else if (res.body.code.toString() != '-3') {
                    _this.loading = false
                    _this.$message.error(_this.msg(res.body))
                } else {
                    _this.loading = false
                }
            }, function (res) {
                _this.loading = false
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        })
        var p2 = new Promise((resolve, reject) => {
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.sendAndReply_Get, {
                params: {
                    pageN: 1,
                    pageSize: this.pageSize,
                    type: 'send',
                    subCtId: this.ctid
                }
            }).then((res) => {
                if (res.body.code.toString() === _this.Global.RES_OK) {
                    if (isArray(res.body.data.addressList)) {
                        _this.sendList = res.body.data.addressList
                        resolve([])
                    } else {
                        _this.sendList = []
                        resolve([])
                    }
                } else if (res.body.code.toString() != '-3') {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(this.Global.errorTitle))
            })
        })
        var p3 = new Promise((resolve, reject) => {
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.sendAndReply_Get, {
                params: {
                    pageN: 1,
                    pageSize: this.pageSize,
                    type: 'replyTo',
                    subCtId: this.ctid
                }
            }).then((res) => {
                if (res.body.code.toString() === _this.Global.RES_OK) {
                    if (isArray(res.body.data.addressList)) {
                        _this.replyList = res.body.data.addressList
                        resolve([])
                    } else {
                        _this.replyList = []
                        resolve([])
                    }
                } else if (res.body.code.toString() != '-3') {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        })
        var p4 = new Promise((resolve, reject) => {
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.template_list, {
                params: {
                    pageN: 1,
                    pageSize: _this.pageSize,
                    emailType: 1,
                    subCtId: this.ctid
                }
            }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    if (res.body.data.tmplList && isArray(res.body.data.tmplList)) {
                        _this.developmentLetterList = res.body.data.tmplList
                        resolve([])
                    } else {
                        _this.developmentLetterList = []
                        resolve([])
                    }
                } else if (res.body.code.toString() != '-3') {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        })
        var p5 = new Promise((resolve, reject) => {
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.addrBook_Get, {
                params: {
                    pageN: 1,
                    pageSize: this.pageSize,
                    subCtId: this.ctid
                }
            }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    if (res.body.data.dataList && isArray(res.body.data.dataList)) {
                        _this.sendeeList = res.body.data.dataList
                        resolve([])
                    } else {
                        _this.sendeeList = []
                        resolve([])
                    }
                } else if (res.body.code.toString() != '-3') {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        })
        Promise.all([p1, p2, p3, p4, p5]).then(function (results) {
            let itemData = results[0]
            _this.ruleForm = {
                workName: itemDatas.taskName,
                sendPeople: itemData.sendAddress,
                sendAddressId: itemData.sendAddressId,
                replyPeople: itemData.replyAddress,
                replyAddressId: itemData.replyAddressId,
                sendeePeople: itemData.addrInvokeName,
                sendPeopleName: itemData.sendName,
                sendData: '1',
                developmentLetter: itemData.tmplInvokeName, // 模板ID
                developmentLetterName: itemData.templateName, // 模板名称
                transmissionTime: '',

                cycleEndTime: itemData.endDate && itemData.endDate != '' ? _this.$m_unifiedTime(itemData.endDate) : '',
                cycleType: itemData.taskType,
                cycleTypeBase: itemData.sendTimeType
            }
            _this.files = []
            _this.Letter = itemData.tmplInvokeName
            let sendeePeopleNameArry = ''// 接收人
            for (let index = 0; index < itemData.addressInfo.length; index++) {
                const element = itemData.addressInfo[index]
                sendeePeopleNameArry += element.name + ';'
            }
            _this.ruleForm.sendeePeopleName = sendeePeopleNameArry.substr(0, sendeePeopleNameArry.length - 1)

            let arr = []
            if (itemData.attachments != null) {
                let attachmentList = JSON.parse(itemData.attachments)
                attachmentList.forEach(function (item) {
                    if (item.url) {
                        let obj = {
                            name: item.fileName,
                            url: item.url.replace(_this.downloadBaseUrl, ''),
                            size: parseInt(item.size / 1024)
                        }
                        arr.push(obj)
                    }
                })
            }

            _this.files = arr
            if (itemData.sendTimeType == 'D') {
                _this.taskType = 'D'
                _this.ruleForm.sendTime = itemData.deliverDate
                _this.sendTime1 = itemData.deliverDate
            } else if (itemData.sendTimeType == 'N') {
                _this.taskType = 'N'
            } else {
                _this.taskType = 'C'
                let CCtime = _this.returnCTime(itemData.deliverDate)
                _this.ruleForm.sendTimes = itemData.deliveryDate
                _this.ruleForm.sendTimeBase = CCtime /// / 几点
                _this.ruleForm.cycleTitle = CCtime // 每天几点
            }
            _this.loading = false
        })
    },
    methods: {

        submit(type) {
            let _this = this
            if (_this.ruleForm.workName == '') {
                // 任务名称不能为空！
                _this.$message(this.$t('mxpcweb.am.1531897801694'))
                return false
            };
            if (_this.ruleForm.sendPeople == '') {
                // 发件人不能为空！
                _this.$message(_this.$t('mxpcweb.am.1531897801918'))
                return false
            };
            if (_this.ruleForm.sendPeopleName == '') {
                // 发件人姓名不能为空！
                _this.$message(_this.$t('mxpcweb.am.1531897802381'))
                return false
            };

            if (_this.ruleForm.sendeePeople == '') {
                // 接收人不能为空！
                _this.$message(_this.$t('mxpcweb.am.1531897802622'))
                return false
            };
            if (_this.ruleForm.sendData == '') {
                // 发送资料不能为空！
                _this.$message(_this.$t('mxpcweb.am.1531897820045'))
                return false
            };
            if (_this.ruleForm.developmentLetter == '') {
                // 开发信模板不能为空！
                _this.$message(_this.$t('mxpcweb.am.1531897820269'))
                return false
            };
            let data = {
                'addrInvokeName': _this.ruleForm.sendeePeople.split(';'),
                'senderAddrId': _this.ruleForm.sendAddressId, // _this.ruleForm.sendPeopleName, // 发件人
                'replyAddrId': _this.ruleForm.replyAddressId, // 回复地址
                'htmlObject': {
                    'html': ''
                },
                'tmplInvokeName': _this.ruleForm.developmentLetter, // 模板调用名称
                'taskType': type == 'DR' ? 'DR' : _this.taskType, // 任务类型 D定时 N 普通发送 DR草稿 C周期
                // 'attachmentList': arr,
                'taskName': _this.ruleForm.workName,
                'taskId': _this.itemData.taskId
            }

            let arr = []
            _this.files.forEach(function (item) {
                let obj = {
                    fileName: item.name,
                    url: _this.downloadBaseUrl + item.url,
                    size: parseInt(item.size * 1024)
                }
                arr.push(obj)
            })
            data.attachmentList = arr
            if (type == 'DR') {
                if (_this.taskType == 'D') {
                    data.sendTimeType = 'D'
                    if (_this.sendTime1 == '') {
                        // 定时发送时间不能为空！
                        _this.$message(_this.$t('mxpcweb.am.1531897820500'))
                        return false
                    }
                    data.deliverDate = _this.$m_unifiedTime(_this.sendTime1)
                } else if (_this.taskType == 'C') {
                    data.sendTimeType = 'C'// _this.ruleForm.cycleTypeBase
                    if (_this.ruleForm.sendTimes == '') {
                        // 周期性发送时间不能为空！
                        _this.$message(_this.$t('mxpcweb.am.1531897851949'))
                        return false
                    }
                    data.cornExpression = _this.ruleForm.sendTimeBase

                    if (_this.ruleForm.cycleEndTime == '') {
                        // 周期性结束时间不能为空！
                        _this.$message(_this.$t('mxpcweb.am.1531897852389'))
                        return false
                    }
                    data.endDate = _this.$m_unifiedTime(_this.ruleForm.cycleEndTime)
                }
                //  else {
                data.taskType = 'DR'
                // }
            } else {
                if (_this.taskType == 'D') {
                    data.taskType = 'D'
                    if (_this.sendTime1 == '') {
                        // 定时发送时间不能为空！
                        _this.$message(_this.$t('mxpcweb.am.1531897820500'))
                        return false
                    }
                    data.deliverDate = _this.$m_unifiedTime(_this.sendTime1)
                } else if (_this.taskType == 'C') {
                    if (_this.ruleForm.sendTimes == '') {
                        // 周期性发送时间不能为空！\
                        _this.$message(_this.$t('mxpcweb.am.1531897851949'))
                        return false
                    }
                    data.taskType = 'C'
                    data.cornExpression = _this.ruleForm.sendTimes
                    if (_this.ruleForm.cycleEndTime == '') {
                        // 周期性结束时间不能为空！
                        _this.$message(_this.$t('mxpcweb.am.1531897852389'))
                        return false
                    }
                    data.endDate = _this.$m_unifiedTime(_this.ruleForm.cycleEndTime)// _this.$moment(new Date(_this.ruleForm.cycleEndTime.toSlash())).utc().format('YYYY-MM-DD HH:mm')
                };
            }
            _this.subLoading = true
            _this.$http.post(this.Global.baseURL + this.Global.api.v2.task_Add, data).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message.success(_this.msg(res.body))
                    _this.subLoading = false
                    _this.$emit('tabDataCheck', '1')
                } else {
                    _this.subLoading = false
                    if (!isEmptyObject(res.body.data)) {
                        if (res.body.data.statusCode == 40904) {
                            _this.$message.error('当天请求额度不足')
                        } else {
                            _this.$message.error(res.body.data.message)
                        }
                    } else {
                        _this.$message.error(res.body.msg)
                    }
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        changeSendPeopleName() {
            this.sendList.forEach(element => {
                if (element.address == this.ruleForm.sendPeople) {
                    this.ruleForm.sendPeopleName = element.address
                    this.ruleForm.sendAddressId = element.addressId
                }
            })
        },
        changeReplyPeopleName() {
            this.replyList.forEach(element => {
                if (element.address == this.ruleForm.replyPeople) {
                    this.ruleForm.replyPeople = element.address
                    this.ruleForm.replyAddressId = element.addressId
                }
            })
        },
        changeSendeePeopleName() {
            this.sendeeList.forEach(element => {
                if (element.invokeName == this.ruleForm.sendeePeople) {
                    this.ruleForm.sendeePeopleName = element.name
                }
            })
        },
        developmentLetterChange() {
            this.developmentLetterList.forEach(element => {
                if (element.invokeName == this.ruleForm.developmentLetter) {
                    this.ruleForm.developmentLetterName = element.name
                    this.ruleForm.developmentLetter = element.invokeName
                    this.Letter = element.invokeName
                }
            })
        },
        returnCTime(Time) {
            let _this = this
            let name = ''
            let CCtime = ''
            let thisTime = Time.split(' ')
            if (thisTime[3] == '?' && thisTime[5] !== '*') {
                // 每周
                // let weekTime = _this.$moment(_this.$utcToLocal('2018-06-10 ' + (thisTime[2].length == 2 ? thisTime[2] : '0' + thisTime[2]) + ':' + (thisTime[1].length == 2 ? thisTime[1] : '0' + thisTime[1]) + ':00'))
                // let weekDate = (parseInt(thisTime[5]) + parseInt(weekTime.format('DD')) - 10) % 7
                // if (weekDate == 0) {
                //     weekDate = 7
                // }
                // name = _this.$t('mxpcweb.am.1531900125000') + _this.weekData[weekDate]
                // CCtime = weekTime.format('HH:mm')
                let dataName = new Date('2018/06/10 ' + (thisTime[2].length == 2 ? thisTime[2] : '0' + thisTime[2]) + ':' + (thisTime[1].length == 2 ? thisTime[1] : '0' + thisTime[1]) + ':00')
                let weekDate = parseInt(thisTime[5]) // (parseInt(thisTime[5]) + parseInt(weekTime.format('DD')) - 10) % 7
                if (weekDate == 0) {
                    weekDate = 7
                }
                name = _this.$t('mxpcweb.am.1531900125000') + _this.weekData[weekDate]
                CCtime = '  ' + dataName.getHours() + ':' + dataName.getMinutes()
            } else if (thisTime[3] !== '*' && thisTime[3] !== '?') {
                // 每月
                // name = _this.$t('mxpcweb.am.1531900145370')
                // CCtime = _this.$moment(_this.$utcToLocal('2018-07-' + (thisTime[3].length == 2 ? thisTime[3] : '0' + thisTime[3]) + ' ' + (thisTime[2].length == 2 ? thisTime[2] : '0' + thisTime[2]) + ':' + (thisTime[1].length == 2 ? thisTime[1] : '0' + thisTime[1]) + ':00')).format('DD HH:mm')
                name = _this.$t('mxpcweb.am.1531900145370')
                let dataName = new Date('2018/07/' + (thisTime[3].length == 2 ? thisTime[3] : '0' + thisTime[3]) + ' ' + (thisTime[2].length == 2 ? thisTime[2] : '0' + thisTime[2]) + ':' + (thisTime[1].length == 2 ? thisTime[1] : '0' + thisTime[1]) + ':00')
                CCtime = dataName.getDate() + '  ' + ('00' + dataName.getHours()).slice(-2) + ':' + ('00' + dataName.getMinutes()).slice(-2)
            } else {
                // 每天
                // utcToLocal
                // name = _this.$t('mxpcweb.am.1531900110152')
                // CCtime = _this.$moment(_this.$utcToLocal('2018-06-10 ' + (thisTime[2].length == 2 ? thisTime[2] : '0' + thisTime[2]) + ':' + (thisTime[1].length == 2 ? thisTime[1] : '0' + thisTime[1]) + ':00')).format('HH:mm')
                name = _this.$t('mxpcweb.am.1531900110152')
                let dataName = new Date('2018/06/10 ' + (thisTime[2].length == 2 ? thisTime[2] : '0' + thisTime[2]) + ':' + (thisTime[1].length == 2 ? thisTime[1] : '0' + thisTime[1]) + ':00')
                CCtime = ('00' + dataName.getHours()).slice(-2) + ':' + ('00' + dataName.getMinutes()).slice(-2)
            }
            return name + CCtime
        },
        showSize(size) {
            if (size > 1024) {
                this.costSize = (size / 1024).toFixed(2) + ' M'
            } else {
                this.costSize = size.toFixed(2) + ' KB'
            }
        },
        getsize(invokeName) {
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.template_list, { params: { invokeName: invokeName } })
                .then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        if (res.body.data.html != undefined) {
                            let htmlB = res.body.data.html.replace(/[^u4E00-u9FA5]/g, 'aa').length
                            this.contenSize = Number(htmlB) / 1024
                            let tSize = Number(this.attchSize) + Number(this.contenSize)
                            this.showSize(tSize)
                            this.cost = Math.ceil(tSize / 200) * 0.02
                        } else {
                            this.contenSize = 0
                        }
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
        }
    },
    components: {
        'page-detail': PageDetail,
        'people-select': peopleSelect,
        'file-upload': FileUpload,
        'cycle-time': cycleTime,
        'editor-preview': editorPreview
    },
    watch: {
        files: { // 附件
            handler(curVal, oldvalue) {
                let filesSize = 0
                for (let index = 0; index < curVal.length; index++) {
                    const element = curVal[index]
                    filesSize = filesSize + element.size
                }
                this.attchSize = filesSize
                let tSize = Number(filesSize) + Number(this.contenSize)
                this.showSize(tSize)
                this.cost = Math.ceil(tSize / 200) * 0.02
            }
        },
        Letter: {
            handler(curVal, oldvalue) {
                this.getsize(curVal)
            }

        }
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.addWork {
    overflow: auto;
    background: white;
    height: 100%;
    .addWorkBox {
        height: 100%;
    }
    .listBox {
        padding: 0 35px 49px 33px;
        .list {
            border-bottom: 1px solid RGBA(238, 238, 238, 1);
            position: relative;
            padding-top: 3px;
            padding-bottom: 17px;
            margin-bottom: 3px;
            .listItem {
                min-height: 50px;
                line-height: 50px;
                .listTitle {
                    font-size: 16px;
                    color: RGBA(48, 49, 51, 1);
                    display: inline-block;
                    width: 99px;
                }
                .listRight {
                    font-size: 12px;
                    color: rgba(144, 147, 153, 1);
                    position: relative;
                    top: 1px;
                    left: -4px;
                }
            }
            .listItem1 {
                padding-left: 4px;
                min-height: 32px;
                line-height: 32px;
                .listTitle {
                    font-size: 14px;
                    color: rgba(144, 147, 153, 1);
                    display: inline-block;
                    width: 95px;
                }
                .listRight {
                    display: inline-block;
                    font-size: 12px;
                    color: rgba(144, 147, 153, 1);
                    position: relative;
                    top: 1px;
                    left: -3px;
                    .formItemTit {
                        font-size: 12px;
                        color: rgba(144, 147, 153, 1);
                        position: absolute;
                        top: 32px;
                        left: -6px;
                    }
                    .cycleSeting {
                        padding: 1px 5px;
                        border-radius: 3px;
                        color: #fff;
                        background: #f0ad4e;
                        border: 1px solid #eea236;
                    }
                }
            }
        }
    }
}
</style>
