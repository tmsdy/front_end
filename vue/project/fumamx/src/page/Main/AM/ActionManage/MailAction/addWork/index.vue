<template>
    <div class="addWork ">
        <!-- 触发邮件 -->
        <!-- 新建触发邮件 -->
        <page-detail :title="$t('mxpcweb.am.1543297977190')" iconfont="icon-toolbox" :detailTitle="detailTitle" @toList="$emit('pageBack')"></page-detail>
        <div class="listBox MXscroll">
            <el-form :model="ruleForm" class="formBox" ref="ruleForm" onsubmit="return false">
                <div class="list">
                    <div class="listItem1">
                        <div>
                            <!-- 方案名称 -->
                            <span class="listTitle">{{$t('mxpcweb.am.1543298028534')}}</span>
                            <span class="listRight">
                                <el-form-item class="formItem">
                                    <!-- 请输入方案名称 -->
                                    <el-input :maxlength="20" v-model="ruleForm.detailActionName" :placeholder="$t('mxpcweb.am.1543299580494')" style="width: 450px;"></el-input>
                                </el-form-item>
                            </span>
                        </div>
                    </div>
                    <div class="listItem1">
                        <div>
                            <!-- 所属模块 -->
                            <span class="listTitle">{{$t('mxpcweb.am.1541590431848')}}</span>
                            <span class="listRight">
                                <el-form-item class="formItem">
                                    <!-- 请选择所属模块 -->
                                    <el-select v-model="ruleForm.moduleCode" @change="moduleCodeChange()" filterable clearable :placeholder="$t('mxpcweb.am.1541592215343')" style="width: 450px;">
                                        <div v-for="item in moduleCodeList" :key="item.moduleCode">
                                            <el-option :label="item.showName" :value="item.moduleCode+''">
                                            </el-option>
                                        </div>
                                    </el-select>
                                </el-form-item>
                            </span>
                        </div>
                    </div>
                    <div class="listItem1">
                        <div>
                            <!-- 发送方式 -->
                            <span class="listTitle">{{$t('mxpcweb.am.1545025633788')}}</span>
                            <span class="listRight">
                                <el-radio-group v-model="radio" @change="radioChange()">
                                    <!-- 平台推广发送（推荐） -->
                                    <el-radio :label="1">{{$t('mxpcweb.am.1545098722948')}}</el-radio>
                                    <!-- 普通邮箱发送 -->
                                    <el-radio :label="2">{{$t('mxpcweb.am.1545098731958')}} (<span style="color:red;">{{$t('mxpcweb.am.1553828727220')}}</span>)</el-radio>
                                </el-radio-group>
                            </span>
                        </div>
                    </div>

                    <div class="listItem1">
                        <div>
                            <!-- 发件人 -->
                            <span class="listTitle">{{$t('mxpcweb.am.1531897635637')}}</span>
                            <span class="listRight">
                                <el-form-item class="formItem" v-if="radio==1">
                                    <!-- 请选择发件人 -->
                                    <el-select v-model="ruleForm.sendAddress" filterable clearable :placeholder="$t('mxpcweb.am.1543299656749')" style="width: 450px;">
                                        <div v-for="item in sendAddressList" :key="item.value">
                                            <el-option :label="item.name + ' (' + item.address + ')'" :value="item.address+''">
                                            </el-option>
                                        </div>
                                    </el-select>
                                </el-form-item>

                                <el-form-item class="formItem" v-if="radio==2">
                                    <!-- 请选择发件人 -->
                                    <el-select v-model="ruleForm.sendAddress" style="width: 450px;" filterable clearable :placeholder="$t('mxpcweb.am.1543299656749')">
                                        <el-option v-for="(item,index) in sendList" :key="index" :label="item.name+'<'+item.address+'>'" :value="item.address"></el-option>
                                    </el-select>
                                </el-form-item>
                            </span>
                        </div>
                    </div>
                    <div class="listItem1">
                        <div>
                            <!-- 回复地址 -->
                            <span class="listTitle">{{$t('mxpcweb.am.1531897636341')}}</span>
                            <span class="listRight">
                                <el-form-item class="formItem">
                                    <el-radio-group v-model="replyAddressObj.replyType" @change="replyTypeChange">
                                        <!-- 拥有人邮箱 -->
                                        <el-radio class="replyAddress" label="1" v-show="allowPlaceHolder == '1'">{{$t('mxpcweb.am.1543299686983')}}</el-radio>
                                        <!-- 指定邮箱 -->
                                        <el-radio class="replyAddress" label="2">{{$t('mxpcweb.am.1543299702879')}}</el-radio>
                                        <!-- 无需回复 -->
                                        <el-radio class="replyAddress" label="3">{{$t('mxpcweb.am.1543299717029')}}</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item class="formItem" v-if="replyAddressObj.replyType == '2'">
                                    <!-- 请输入回复人地址 -->
                                    <el-input v-show="replyAddressTab" v-model="replyAddressObj.replyAddress" clearable :placeholder="$t('mxpcweb.am.1543299735184')" style="width: 450px;">
                                    </el-input>
                                    <!-- 请选择回复人地址 -->
                                    <el-select v-show="!replyAddressTab" v-model="selectReplyAddress" :placeholder="$t('mxpcweb.am.1543300002338')" @change="replyAddressChange" style="width: 450px;">
                                        <div v-for="item in replyAddressList" :key="item.value">
                                            <el-option :label="item.name + ' (' + item.address + ')'" :value="item.address+''">
                                            </el-option>
                                        </div>
                                    </el-select>
                                    <!-- 选择 -->
                                    <span style="margin-left:15px;" v-show="replyAddressTab" class="text-hover" @click="replyAddressTab=!replyAddressTab">{{$t('mxpcweb.am.1531896677609')}}</span>
                                    <!-- 输入 -->
                                    <span style="margin-left:15px;" v-show="!replyAddressTab" class="text-hover" @click="replyAddressTab=!replyAddressTab">{{$t('mxpcweb.am.1543299754900')}}</span>
                                    <!-- <el-select v-model="replyAddressObj.replyAddress" filterable clearable placeholder="请选择发件人" style="width: 450px;">
                                        <div  v-for="item in replyAddressList" :key="item.value">
                                            <el-option :label="item.name + ' (' + item.address + ')'" :value="item.address+''">
                                            </el-option>
                                        </div>
                                    </el-select> -->
                                </el-form-item>
                            </span>
                        </div>
                    </div>
                    <div class="listItem1" v-show="allowPlaceHolder == '1'">
                        <div>
                            <!-- 收件人 -->
                            <span class="listTitle">{{$t('mxpcweb.am.1543299755132')}}</span>
                            <span class="listRight">
                                <el-form-item class="formItem">
                                    <receAddr-placeHolders ref="receAddrPlaceHolders" :receAddrPlaceHolders.sync="ruleForm.receAddrPlaceHolders"></receAddr-placeHolders>
                                </el-form-item>
                            </span>
                        </div>
                    </div>
                    <div class="listItem1">
                        <div>
                            <!-- 其他收件人 -->
                            <span class="listTitle">{{$t('mxpcweb.am.1543299768333')}}</span>
                            <span class="listRight">
                                <el-form-item class="formItem" v-for="(item, index) in otherReceiveAddrsList" :key="index">
                                    <el-input :maxlength="20" v-model="item.value" style="width: 450px;"></el-input>
                                    <span v-if="index == 0" class="text-hover" @click="otherReceiveAddrsListAdd()" style="margin-left:10px;font-size:16px;"><i class="iconfont icon-plus-file"></i></span>
                                    <span v-if="otherReceiveAddrsList.length > 1" class="text-hover" @click="otherReceiveAddrsListCut(index)" style="margin-left:10px;font-size:16px;"><i class="iconfont icon-minus-thin"></i></span>
                                </el-form-item>
                            </span>
                        </div>
                    </div>
                    <div class="listItem1">
                        <div>
                            <!-- 正文内容 -->
                            <span class="listTitle">{{$t('mxpcweb.am.1543299775869')}}</span>
                            <span class="listRight">
                                <el-form-item class="formItem">
                                    <!-- 从开发信模板生成 -->
                                    <el-radio class="radio" v-model="template.templateType" label="1">{{$t('mxpcweb.am.1543299776189')}}</el-radio>
                                    <br>
                                    <development-letter inputWidth="450px" ref="developmentLetter" :actionMail.sync="template.invokeName"></development-letter>
                                </el-form-item>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="footer">
                    <!-- 保存 -->
                    <el-button type="primary" :loading="subLoading" @click="submit()">{{$t('mxpcweb.am.1531903711523')}}</el-button>
                    <!-- 取消 -->
                    <el-button :plain="true" type="success" @click="$emit('pageBack')">{{$t('mxpcweb.am.1531893140621')}}</el-button>
                </div>
            </el-form>
        </div>
    </div>

</template>

<script>
import PageDetail from '@/components/PageDetail/index' // 大标题
import { isArray } from '@/libs/utils.js'
import receAddrPlaceHolders from '../receAddrPlaceHolders/index' // 预览
import DevelopmentLetter from '@/components/DevelopmentLetter/index'
import { mapGetters } from 'vuex'
export default {
    name: 'addWork',
    props: {
        editItem: {
            type: Object,
            default: function () {
                return {}
            }
        },
        type: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            subLoading: false,
            moduleCodeList: [],
            sendAddressList: [],
            replyAddressTab: true,
            allowPlaceHolder: '0',
            selectReplyAddress: '',
            replyAddressList: [],
            receList: [],
            detailData: {},
            otherReceiveAddrsList: [{ value: '' }],
            ruleForm: {
                moduleCode: '',
                detailActionName: '',
                sendAddress: '',
                receAddrPlaceHolders: [],
                actionId: '1'
            },
            replyAddressObj: {
                replyType: '3',
                replyAddress: '${noNeedToReply}'
            },
            template: {
                templateType: '1',
                invokeName: ''
            },
            detailTitle: this.$t('mxpcweb.am.1543297998877'),
            radio: 1,
            sendPeople: '',
            sendList: [],
            counts: 0
        }
    },
    mounted() {
    },
    created() {
        this.getListData()
        if (this.type == 'edit') {
            this.detailTitle = this.$t('mxpcweb.am.1543910401645')
            this.getDetailData()
        } else {
            this.detailTitle = this.$t('mxpcweb.am.1543297998877')
        }
    },
    computed: {
        ...mapGetters([
            'company'
        ])
    },
    methods: {
        radioChange() {
            if (this.counts == 0 && this.type == 'edit') {
                this.counts = 1
                return
            }
            this.ruleForm.sendAddress = ''
        },
        replyAddressChange(val) {
            this.replyAddressObj.replyAddress = val
        },
        moduleCodeChange() {
            let items = {}
            this.moduleCodeList.forEach(item => {
                if (this.ruleForm.moduleCode == item.moduleCode) {
                    items = item
                    this.allowPlaceHolder = item.allowPlaceHolder
                }
            })
            if (this.allowPlaceHolder == '0' && this.replyAddressObj.replyType == '1') {
                this.replyAddressObj = {
                    replyType: '3',
                    replyAddress: '${noNeedToReply}'
                }
            }
            this.$refs.receAddrPlaceHolders.moduleCodeChange(items)
            this.$refs.developmentLetter.moduleCodeChange(this.ruleForm.moduleCode)
        },
        returnReceAddrName(val, list) {
            let name = ''
            list.forEach(item => {
                if (item.value == val) {
                    name = item.label
                    return false
                } else if (item.children) {
                    let names = this.returnReceAddrName(val, item.children)
                    if (names != '') {
                        name = names
                        return false
                    }
                }
            })
            return name
        },
        otherReceiveAddrsListAdd() {
            this.otherReceiveAddrsList.push({ value: '' })
        },
        otherReceiveAddrsListCut(index) {
            this.otherReceiveAddrsList.splice(index, 1)
        },
        replyTypeChange(value) {
            if (value == '1') {
                this.replyAddressObj.replyAddress = '${ownerMailAddress}'
            } else if (value == '2') {
                if (this.detailData.replyType == value && this.detailData.replyAddress) {
                    this.replyAddressObj.replyAddress = this.detailData.replyAddress
                } else {
                    this.replyAddressObj.replyAddress = ''
                }
            } else if (value == '3') {
                this.replyAddressObj.replyAddress = '${noNeedToReply})'
            }
        },
        updata(data) {
            let otherReceiveAddrs = data.otherReceiveAddrs ? data.otherReceiveAddrs : []
            if (otherReceiveAddrs.length > 0) {
                let list = []
                otherReceiveAddrs.forEach(item => {
                    list.push({
                        value: item
                    })
                })
                this.otherReceiveAddrsList = list
            }
            this.ruleForm = {
                moduleCode: data.moduleCode ? data.moduleCode : '',
                detailActionName: data.detailActionName ? data.detailActionName : '',
                sendAddress: data.sendAddress ? data.sendAddress : '',
                replyAddress: data.replyAddress ? data.replyAddress == '${ownerMailAddress}' ? '1' : data.replyAddress == '${noNeedToReply}' ? '3' : '2' : '',
                actionId: data.actionId ? data.actionId : '1',
                receAddrPlaceHolders: data.receAddrPlaceHolders ? data.receAddrPlaceHolders : []
            }
            if (data.replyType) {
                this.replyAddressObj.replyType = data.replyType + ''
            }
            this.template = {
                templateType: data.templateType ? data.templateType + '' : '1',
                invokeName: data.invokeName ? data.invokeName : ''
            }
            if (this.$refs.developmentLetter && data.invokeName) {
                this.$refs.developmentLetter.updatas(data.invokeName)
            }

            setTimeout(() => {
                this.$refs.receAddrPlaceHolders.moduleCodeChange(data.moduleCode)
                this.$refs.receAddrPlaceHolders.updata(data.receAddrPlaceHolders, data.receiverShowNames)
            }, 100)
        },
        getDetailData() {
            let params = {
                detailActionId: this.editItem.detailActionId,
                type: 'edit_detail',
                actionId: '1'
            }
            let url = this.Global.baseURL + this.Global.api.v2.autoStrategy_actions
            this.$http.get(url, { params })
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.detailData = res.data.data
                        this.radio = this.detailData.sendType
                        this.updata(this.detailData)
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                })
                .catch(res => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        getListData() {
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.autoStrategy_controlTypeV2, {
                params: {
                    valueFlag: 0,
                    dataType: 'modules',
                    actionId: '1',
                    placeHolderFlag: 1
                }
            }).then((res) => {
                if (res.body.code.toString() === _this.Global.RES_OK) {
                    if (isArray(res.body.data.list)) {
                        _this.moduleCodeList = res.body.data.list
                    } else {
                        _this.moduleCodeList = []
                    }
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(this.$t(this.Global.errorTitle))
            })
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.sendAndReply_Get, {
                params: {
                    pageN: 0,
                    pageSize: 50,
                    type: 'send'
                }
            }).then((res) => {
                if (res.body.code.toString() === _this.Global.RES_OK) {
                    if (isArray(res.body.data.addressList)) {
                        _this.sendAddressList = res.body.data.addressList
                    } else {
                        _this.sendAddressList = []
                    }
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(this.$t(this.Global.errorTitle))
            })
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.sendAndReply_Get, {
                params: {
                    pageN: 0,
                    pageSize: 50,
                    type: 'replyTo'
                }
            }).then((res) => {
                if (res.body.code.toString() === _this.Global.RES_OK) {
                    if (isArray(res.body.data.addressList)) {
                        _this.replyAddressList = res.body.data.addressList
                    } else {
                        _this.replyAddressList = []
                    }
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, function (res) {
                this.$message.error(this.$t(this.Global.errorTitle))
            })

            let data = {
                type: 'list',
                pageN: 1,
                pageSize: 100,
                ctid: this.company.ctId
            }
            this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.mailset.mailaccount.accounts, {
                params: data
            })
                .then(function (res) {
                    if (res.body.code.toString() == this.Global.RES_OK && isArray(res.body.data)) {
                        let dataR = res.body.data
                        let list = []
                        for (let i = 0; i < dataR.length; i++) {
                            list.push({
                                name: dataR[i].sendDisplayName,
                                address: dataR[i].mailAccount,
                                replyAddress: dataR[i].replyAddress
                            })
                        }
                        this.sendList = list
                    }
                },
                    function (res) {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        isEmptyObject(obj) {
            for (var key in obj) {
                return false
            }
            return true
        },
        submit(type) {
            let _this = this
            if (_this.ruleForm.detailActionName == '') {
                // 邮件名称不能为空！
                _this.$message(_this.$t('mxpcweb.am.1543299803637'))
                return false
            }
            if (_this.type == 'edit') {
                let data = {
                    template: {},
                    replyAddressObj: {}
                }
                if (_this.detailData.moduleCode != _this.ruleForm.moduleCode) {
                    data.moduleCode = _this.ruleForm.moduleCode
                }
                if (data.moduleCode != 'allModule') {
                    data.receAddrPlaceHolders = _this.ruleForm.receAddrPlaceHolders
                }
                if (_this.detailData.detailActionName != _this.ruleForm.detailActionName) {
                    data.detailActionName = _this.ruleForm.detailActionName
                }
                if (_this.detailData.sendAddress != _this.ruleForm.sendAddress) {
                    data.sendAddress = _this.ruleForm.sendAddress
                }
                if (_this.detailData.replyAddressObj) {
                    if (_this.detailData.replyType != _this.replyAddressObj.replyType) {
                        data.replyAddressObj.replyType = _this.replyAddressObj.replyType
                    }
                    if (_this.detailData.replyAddress != _this.replyAddressObj.replyAddress) {
                        data.replyAddressObj.replyAddress = _this.replyAddressObj.replyAddress
                    }
                } else {
                    data.replyAddressObj = _this.replyAddressObj
                }
                let otherReceiveAddrs = []
                _this.otherReceiveAddrsList.forEach(item => {
                    if (item.value != '') {
                        otherReceiveAddrs.push(item.value)
                    }
                })
                let otherReceiveAddrs1 = otherReceiveAddrs
                if (_this.detailData.otherReceiveAddrs != otherReceiveAddrs1) {
                    data.otherReceiveAddrs = otherReceiveAddrs1
                }
                if (_this.detailData.actionId != _this.ruleForm.actionId) {
                    data.actionId = _this.ruleForm.actionId
                }
                if (_this.detailData.templateType != _this.template.templateType) {
                    data.template.templateType = _this.template.templateType
                }
                if (_this.detailData.invokeName != _this.template.invokeName) {
                    data.template.invokeName = _this.template.invokeName
                }
                if (_this.isEmptyObject(data.template)) {
                    delete data.template
                }
                if (_this.isEmptyObject(data.replyAddressObj)) {
                    delete data.replyAddressObj
                }
                if (_this.isEmptyObject(data)) {
                    // 您未作任何修改，不能保存！
                    _this.$message(_this.$t('mxpcweb.client.1529054287744'))
                    return false
                }
                data.actionId = this.detailData.actionId
                data.detailActionId = this.detailData.detailActionId
                _this.subLoading = true
                data.sendType = this.radio
                _this.$http.put(this.Global.baseURL + this.Global.api.v2.autoStrategy_actions, data).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.$message.success(_this.msg(res.body))
                        _this.subLoading = false
                        _this.$emit('pageBack')
                    } else {
                        _this.subLoading = false
                        _this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    _this.subLoading = false
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            } else {
                let otherReceiveAddrs = []
                _this.otherReceiveAddrsList.forEach(item => {
                    if (item.value != '') {
                        otherReceiveAddrs.push(item.value)
                    }
                })
                let data = {
                    moduleCode: _this.ruleForm.moduleCode,
                    detailActionName: _this.ruleForm.detailActionName,
                    sendAddress: _this.ruleForm.sendAddress,
                    otherReceiveAddrs: otherReceiveAddrs,
                    actionId: _this.ruleForm.actionId
                }
                if (data.moduleCode != 'allModule') {
                    data.receAddrPlaceHolders = _this.ruleForm.receAddrPlaceHolders
                }
                data.replyAddressObj = _this.replyAddressObj
                data.template = this.template
                data.sendType = this.radio
                _this.subLoading = true
                _this.$http.post(this.Global.baseURL + this.Global.api.v2.autoStrategy_actions, data).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.$message.success(_this.msg(res.body))
                        _this.subLoading = false
                        _this.$emit('pageBack')
                    } else {
                        _this.subLoading = false
                        _this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    _this.subLoading = false
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            }
        }
    },
    components: {
        'page-detail': PageDetail,
        'receAddr-placeHolders': receAddrPlaceHolders,
        'development-letter': DevelopmentLetter
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
