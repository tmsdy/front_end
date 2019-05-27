<template>
    <div class="DialogAddFolder">
        <el-dialog v-dialogDrag :title="TiltleName" :visible.sync="isOpen" custom-class="width620" @close="resetForm('dialogForm')" :close-on-click-modal="false">
            <el-form v-if="!isAddRule&&!CisOpen" :model="dialog" :rules="dialogRules" ref="dialogForm" label-width="100px" v-loading="loading2">
                <!-- 文件夹名 -->
                <el-form-item :label="$t('mxpcweb.mail.1528883108265')" prop="name">
                    <!-- 请填写文件夹名 -->
                    <el-input v-model="dialog.name" :placeholder="$t('mxpcweb.mail.1528883147792')" style="width:220px;" :disabled="dialog.EditText"></el-input>
                </el-form-item>
                <!-- 类型 -->
                <el-form-item v-if="dialogType==1" :label="$t('mxpcweb.mail.1528883148048')" prop="" class="marginTop-10">
                    <!-- 普通文件夹 -->
                    {{$t('mxpcweb.mail.1528883148285')}}

                </el-form-item>
                <!-- 上级文件夹 -->
                <el-form-item :label="$t('mxpcweb.mail.1528883148520')" prop="" class="marginTop-10">
                    {{SuperiorName}}
                </el-form-item>
                <!-- 背景颜色 -->
                <el-form-item :label="$t('mxpcweb.mail.1528883148778')" prop="" class="marginTop-10">
                    <!-- 请选择背景颜色 -->
                    <el-select v-model="dialog.color" :placeholder="$t('mxpcweb.mail.1528883149166')" style="width:220px;">
                        <el-option v-for="(item,index) in arrColors" :key="index" :label="item.text" :value="item.id">{{item.text}}
                            <i class="bg_color" :style="{backgroundColor:item.color}"></i>
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 绑定客户 -->
                <el-form-item v-if="!dialog.EditText" :label="$t('mxpcweb.mail.1528883204605')" prop="" class="marginTop-10">
                    <div v-if="custFid==0">
                        <!-- 暂未绑定客户 -->
                        {{$t('mxpcweb.mail.1528883204844')}}
                        <el-button size="small" style="margin-left:10px;" @click="CustomerOpen(0,'')">
                            <!-- 立即绑定 -->
                            {{$t('mxpcweb.mail.1528883206180')}}
                        </el-button>
                    </div>
                    <div v-else>
                        <el-tag :closable="true" @close="closeCustomer()">{{custName}}</el-tag>
                        <el-button size="small" style="margin-left:10px;" @click="CustomerOpen(custFid,custName)">
                            <!-- 重新绑定 -->
                            {{$t('mxpcweb.mail.1528883229364')}}
                        </el-button>
                    </div>
                </el-form-item>
                <!-- 归并规则 -->
                <el-form-item :label="$t('mxpcweb.mail.1528884202425')" prop="rule" class="marginTop-10" v-if="RuleButton==true">
                    <el-checkbox v-model="dialog.rule">
                        <!-- 本文件夹的新邮件接收时直接归并不放入待处理（不推荐） -->
                        {{$t('mxpcweb.mail.1528883229620')}}
                    </el-checkbox>
                    <br>
                    <span v-if="!Haverule">
                        <!-- 未设置归并规则 -->
                        {{$t('mxpcweb.mail.1528883229884')}}
                    </span>
                    <table v-if="Haverule">
                        <tr v-for="(items,indexs) in boxRules" :key="indexs">
                            <td>
                                <!-- 发件人邮件地址为 -->
                                <span v-if="items.fromAddress">{{$t('mxpcweb.mail.1528883231850')}}: {{items.fromAddress}} </span>
                                <span v-if="items.toAddress">
                                    <!--"或者":"和"   收件人邮件地址为 -->
                                    <span v-if="items.fromAddress">{{items.termsGroup==1?$t('mxpcweb.mail.1528884974705'):$t('mxpcweb.mail.1528884978904')}}</span>
                                    {{$t('mxpcweb.mail.1528884328950')}}:{{items.toAddress}}
                                </span>

                                <span v-if="items.ccAddress">
                                    <!--"或者":"和"   抄送人邮件地址为 -->
                                    <span v-if="items.fromAddress||items.toAddress">
                                        {{items.termsGroup==1||items.toAddress==items.ccAddress?$t('mxpcweb.mail.1528884974705'):$t('mxpcweb.mail.1528884978904')}}</span>
                                    {{$t('mxpcweb.mail.1555749739695')}}:{{items.ccAddress}}
                                </span>

                                <span v-if="items.subject">
                                    <!-- 邮件主题包含 -->
                                    <span v-if="items.fromAddress||items.toAddress||items.ccAddress">
                                        {{items.termsGroup==1?$t('mxpcweb.mail.1528884974705'):$t('mxpcweb.mail.1528884978904')}}</span>
                                    {{$t('mxpcweb.mail.1528883319371')}}:{{items.subject}}
                                </span>
                                &nbsp; &nbsp; &nbsp; &nbsp;
                                <span @click="MergeEliminate(indexs,items.rId)">
                                    <i class="el-icon-delete2"></i>
                                </span>
                            </td>
                        </tr>

                    </table>
                    <!-- 添加规则 -->
                    <el-button size="small" style="margin-left:10px;" @click="AddRuleclick()">{{$t('mxpcweb.mail.1528883319872')}}</el-button>
                </el-form-item>
                <!-- 文件夹说明 -->
                <el-form-item :label="$t('mxpcweb.mail.1528884642158')" prop="content" class="marginTop-10">
                    <!-- 请输入文件夹说明 -->
                    <el-input v-model="dialog.content" type="textarea" :rows="4" :placeholder="$t('mxpcweb.mail.1528883358249')"></el-input>
                </el-form-item>

                <div class="text-center">
                    <el-button class="footerButton" @click="isOpen = false">{{$t('mxpcweb.mail.1528942364802')}}</el-button>
                    <!-- 保存 -->
                    <el-button type="primary" :loading="submitLoading" @click="submit('dialogForm')">{{$t('mxpcweb.mail.1528786401856')}}</el-button>
                </div>
            </el-form>

            <el-form v-show="isAddRule&&!CisOpen" :model="dialogMerge" :rules="dialogMergeRules" ref="dialogMergeForm" label-width="150px">
                <!-- 发件人邮件地址为 -->
                <el-form-item :label="$t('mxpcweb.mail.1528883231850')" prop="fromAddress" v-if="isSendAdd">
                    <!-- 输入需匹配的发件人邮箱 -->
                    <el-input v-model="dialogMerge.fromAddress" :placeholder="$t('mxpcweb.mail.1528884700760')" size="small" style="width:280px;"></el-input>
                    <!-- 删除 -->
                    <span class="pull-right text-hover" @click="isSendAdd=!isSendAdd">{{$t('mxpcweb.mail.1528702683911')}}</span>
                </el-form-item>
                <!-- 收件人邮件地址为 -->
                <!-- 输入需匹配的收件人或抄送人邮箱 -->
                <!-- 删除 -->
                <!-- <el-form-item :label="$t('mxpcweb.mail.1528884328950')" prop="toAddress" v-if="isReceiveAdd">

                    <el-input v-model="dialogMerge.toAddress" :placeholder="$t('mxpcweb.mail.1528884703832')" size="small" style="width:280px;"></el-input>

                    <span class="pull-right text-hover" @click="isReceiveAdd=!isReceiveAdd">{{$t('mxpcweb.mail.1528702683911')}}</span>
                </el-form-item> -->

                <!-- 收件人或者抄送人为 -->
                <el-form-item :label="$t('mxpcweb.mail.1555749035139')" prop="toAddress" v-if="isReceiveAdd">
                    <!-- 输入需匹配的收件人或抄送人邮箱 -->
                    <el-input v-model="dialogMerge.toAddress" :placeholder="$t('mxpcweb.mail.1528884703832')" size="small" style="width:280px;"></el-input>
                    <!-- 删除 -->
                    <span class="pull-right text-hover" @click="isReceiveAdd=!isReceiveAdd">{{$t('mxpcweb.mail.1528702683911')}}</span>
                </el-form-item>

                <!-- 邮件主题包含 -->
                <el-form-item :label="$t('mxpcweb.mail.1528884704316')" prop="subject" v-if="isTheme">
                    <!-- 输入主题关键字 -->
                    <el-input v-model="dialogMerge.subject" :placeholder="$t('mxpcweb.mail.1528884704552')" size="small" style="width:280px;"></el-input>
                    <!-- 删除 -->
                    <span class="pull-right text-hover" @click="isTheme=!isTheme">{{$t('mxpcweb.mail.1528702683911')}}</span>
                </el-form-item>

                <!-- 收件人地址为 -->
                <el-form-item :label="$t('mxpcweb.mail.1555749735883')" prop="toAddress" v-if="isrecipient">
                    <!-- 输入收件人邮箱 -->
                    <el-input v-model="dialogMerge.recipient" :placeholder="$t('mxpcweb.mail.1555749770053')" size="small" style="width:280px;"></el-input>
                    <!-- 删除 -->
                    <span class="pull-right text-hover" @click="isrecipient=!isrecipient">{{$t('mxpcweb.mail.1528702683911')}}</span>
                </el-form-item>
                <!-- 抄送人地址为 -->
                <el-form-item :label="$t('mxpcweb.mail.1555749739695')" prop="toAddress" v-if="iscc">
                    <!-- 输入抄送人邮箱 -->
                    <el-input v-model="dialogMerge.ccAddress" :placeholder="$t('mxpcweb.mail.1555749770592')" size="small" style="width:280px;"></el-input>
                    <!-- 删除 -->
                    <span class="pull-right text-hover" @click="iscc=!iscc">{{$t('mxpcweb.mail.1528702683911')}}</span>
                </el-form-item>

                <el-form-item>
                    <span v-if="!iscc&&!isrecipient" @click="showMore()">+更多条件</span>
                </el-form-item>
                <el-form-item label="" prop="">
                    <!-- 请选择 -->
                    <el-select v-model="dialogMerge.termsGroup" size="small" :placeholder="$t('mxpcweb.mail.1528884704820')" style="width:280px;">
                        <!-- 满足以上任一条件 -->
                        <el-option :label="$t('mxpcweb.mail.1528884735392')" value="1"></el-option>
                        <!-- 满足以上所有条件 -->
                        <el-option :label="$t('mxpcweb.mail.1528884735799')" value="0"></el-option>
                    </el-select>
                    <!-- 注：邮箱地址支持通配符如: *@fumasoft.com -->
                    <div style="color:#999">{{$t('mxpcweb.mail.1528884753170')}}</div>
                </el-form-item>

                <div class="text-center">
                    <!-- 取消 -->
                    <el-button @click="cancelClick()">{{$t('mxpcweb.login.1528703242867')}}</el-button>
                    <!-- 确定 -->
                    <el-button @click="submitMerge('dialogMergeForm')" :loading="submitLoading" type="primary">{{$t('mxpcweb.login.1528696139283')}}</el-button>
                </div>
            </el-form>

        </el-dialog>
        <dialog-customer ref="DialogCustomer" @cancelCustomerDialog="cancelCustomerDialog" @submitCustomerDialog="submitCustomerDialog"></dialog-customer>
    </div>
</template>

<script>
/**
 * 描述：邮件部分
 * 作者：向士健(CSS) / ***(API)
 * 时间：2017/12/11
 */
import { mapGetters } from 'vuex'
import { isArray } from '@/libs/utils.js'
import DialogCustomer from '../DialogCustomer/index.vue'
export default {
    name: 'DialogAddFolder',
    props: {

    },
    data() {
        let _this = this
        return {
            isOpen: false, // 弹窗开关
            custFid: 0, // 客户ID
            custName: '',
            arrColors: [
                {
                    id: '1',
                    text: _this.$t('mxpcweb.mail.1528974879021'), // '无背景色',
                    color: ''
                },
                {
                    id: '2',
                    text: _this.$t('mxpcweb.mail.1528974880854'), // '浅绿色',
                    color: '#8BD867'
                },
                {
                    id: '3',
                    text: _this.$t('mxpcweb.mail.1528974881096'), // '灰色',
                    color: '#909399'
                },
                {
                    id: '4',
                    text: _this.$t('mxpcweb.mail.1529565097629'), // '粉红色',000
                    color: '#FD8EC4'
                },
                {
                    id: '5',
                    text: _this.$t('mxpcweb.mail.1528974881521'), // '红色',
                    color: '#FF7165'
                },
                {
                    id: '6',
                    text: _this.$t('mxpcweb.mail.1529565111250'), // '紫色'
                    color: '#9B80F2'
                },
                {
                    id: '7',
                    text: _this.$t('mxpcweb.mail.1529565156816'), // '天蓝色'
                    color: '#37CBE3'
                },
                {
                    id: '8',
                    text: _this.$t('mxpcweb.mail.1528974882267'), // '深蓝色',
                    color: '#5EA3F6'
                },
                {
                    id: '9',
                    text: _this.$t('mxpcweb.mail.1528974921273'), // '橄榄色',
                    color: '#BFBF17'
                },
                {
                    id: '10',
                    text: _this.$t('mxpcweb.mail.1529564974857'), // '黄色',
                    color: '#FFB735'
                }
            ],
            dialog: {
                name: '',
                color: '1',
                content: '',
                rule: false,
                EditText: false
            },
            dialogRules: {
                name: [
                    { required: true, message: _this.$t('mxpcweb.mail.1528975311872'), trigger: 'blur' }// 请输入文件夹名
                ],
                content: [
                    { required: false, message: _this.$t('mxpcweb.mail.1528883358249'), trigger: 'blur' }// 请输入文件夹说明
                ]
            },
            SuperiorName: _this.$t('mxpcweb.mail.1528975158622'), // "无",//上级文件夹名称
            SuperiorId: -2, // 上级文件ID
            TiltleName: _this.$t('mxpcweb.mail.1528975215072'), // 添加文件夹
            dialogType: 0, // 0-添加 1-修改

            Haverule: false, // 是否有规则
            RuleButton: true, // 添加规则按钮显示
            CisOpen: false, // 客户窗体是否打开

            isAddRule: false, // 打开添加规则窗口
            isSendAdd: true, // 发件人邮件地址是否有
            isReceiveAdd: true,
            isTheme: true,
            iscc: false,
            isrecipient: false,

            // cancleOrOk: true,//取消按钮
            boxRules: [],
            dialogMerge: {
                fromAddress: '',
                toAddress: '',
                subject: '',
                recipient: '',
                ccAddress: '',
                termsGroup: '1'
            },
            dialogMergeRules: {
                fromAddress: [
                    { required: false, message: _this.$t('mxpcweb.mail.1528975214658'), trigger: 'blur' }, // 请输入收件人邮件地址
                    { min: 1, max: 50, message: _this.$t('mxpcweb.mail.1528975214139'), trigger: 'blur' }, // 长度在 1 到 50 个字符
                    { type: 'email', message: _this.$t('mxpcweb.mail.1528975214854'), trigger: 'blur' }// 请输入正确的邮箱地址
                ],
                toAddress: [
                    { required: false, message: _this.$t('mxpcweb.mail.1528975214658'), trigger: 'blur' }, // 请输入收件人邮件地址
                    { min: 1, max: 50, message: _this.$t('mxpcweb.mail.1528975214139'), trigger: 'blur' }, // 长度在 1 到 50 个字符
                    { type: 'email', message: _this.$t('mxpcweb.mail.1528975214854'), trigger: 'blur' }// 请输入正确的邮箱地址
                ],
                subject: [
                    { required: false, message: _this.$t('mxpcweb.mail.1528975214390'), trigger: 'blur' }, // 请输入邮件主题
                    { min: 1, max: 50, message: _this.$t('mxpcweb.mail.1528975214139'), trigger: 'blur' }// 长度在 1 到 50 个字符
                ]
            },
            rIds: [],
            loading2: false,
            submitLoading: false

        }
    },
    components: {
        'dialog-customer': DialogCustomer
    },
    computed: {
        ...mapGetters([
            'company'
        ]),
        ...mapGetters('mail', [
            'treeMenu',
            'subordinateCtid'
        ])
    },
    methods: {
        // 显示更多
        showMore() {
            this.iscc = true
            this.isrecipient = true
        },
        AddRuleclick() {
            this.isAddRule = true
            this.dialogMerge = {
                fromAddress: '',
                toAddress: '',
                subject: '',
                recipient: '',
                ccAddress: '',
                termsGroup: '1'
            }
        },
        // 删除
        MergeEliminate(indexs, rId) {
            let _this = this
            this.boxRules.splice(indexs, 1)
            this.rIds.push(rId)
            if (this.dialogType == 1) { // 修改
                let data = { rIds: [rId] }
                _this.$http.post(_this.Global.baseURL + _this.Global.api.Mail.mailBoxRuleDelete, data).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {

                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                },
                    function (res) {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    })
            }
        },

        // 去除绑定客户
        closeCustomer() {
            this.custFid = 0// 客户ID
            this.custName = ''
        },
        // 绑定客户
        CustomerOpen(cuid, name) {
            this.CisOpen = true
            this.$refs.DialogCustomer.isDialogs('open', cuid, name)
        },
        // 确定客户
        submitCustomer(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {

                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 父组件来调用
        isDialog(to) {
            if (to == 'open') {
                this.isOpen = true
                this.isSendAdd = true
                this.isReceiveAdd = true
                this.isTheme = true
                this.rIds = []
            } else {
                this.isOpen = false
            }
        },
        // 取消
        cancelClick() {
            let _this = this
            _this.isAddRule = false
            _this.dialogMerge.fromAddress = ''
            _this.dialogMerge.toAddress = ''
            _this.dialogMerge.subject = ''
            _this.dialogMerge.recipient = ''
            _this.dialogMerge.ccAddress = ''
            _this.dialogMerge.termsGroup = 1
            _this.isSendAdd = true
            _this.isReceiveAdd = true
            _this.isTheme = true
            _this.CisOpen = false
        },
        // 保存提交
        submit(formName) {
            let _this = this
            _this.loading2 = true
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (_this.dialogType == 0) { // 添加
                        let data = {
                            ctid: _this.company.ctId,
                            boxName: _this.dialog.name,
                            bgColor: _this.dialog.color,
                            targetBoxId: _this.SuperiorId,
                            description: _this.dialog.content,
                            custId: _this.custFid,
                            directMerge: _this.dialog.rule == true ? 1 : 0,
                            boxRules: _this.boxRules
                        }
                        if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                            data.ctid = this.subordinateCtid
                        } else {
                            delete data.ctid
                        }
                        _this.$http.post(_this.Global.baseURL + _this.Global.api.Mail.mailsMailboxPost, data).then(function (res) {
                            _this.loading2 = false
                            if (res.body.code.toString() == _this.Global.RES_OK) {
                                _this.$emit('mailsMailboxesGet')
                                _this.$message.success(_this.$t('mxpcweb.mail.1528975184777'))// 添加成功
                                _this.isDialog('c')
                                _this.Haverule = false// 规则清空
                                _this.CrlearData()// 清空数据
                            } else {
                                // _this.isDialog("c");
                                _this.$message.error(_this.msg(res.body))
                            }
                        },
                            function (res) {
                                _this.loading2 = false
                                _this.$message.error(_this.$t(_this.Global.errorTitle))
                            })
                    } else { // 修改
                        let data = {
                            ctid: _this.company.ctId,
                            action: 'alter',
                            boxId: _this.SuperiorId,
                            boxName: _this.dialog.name,
                            bgColor: _this.dialog.color,
                            custId: _this.custFid,
                            description: _this.dialog.content,
                            directMerge: _this.dialog.rule == true ? 1 : 0
                            // , boxRules: _this.boxRules
                        }
                        if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                            data.ctid = this.subordinateCtid
                        } else {
                            delete data.ctid
                        }
                        _this.$http.post(_this.Global.baseURL + _this.Global.api.Mail.mailsMailboxPut, data).then(function (res) {
                            _this.loading2 = false
                            if (res.body.code.toString() == _this.Global.RES_OK) {
                                // if (_this.rIds.length > 0) { // 删除规则大于0
                                //     let data = { rIds: _this.rIds }
                                //     _this.$http.post(_this.Global.baseURL + _this.Global.api.Mail.mailBoxRuleDelete, data).then(function (res) {
                                //         if (res.body.code.toString() == _this.Global.RES_OK) {

                                //         } else {
                                //             _this.$message.error(_this.msg(res.body))
                                //         }
                                //     },
                                //         function (res) {
                                //             _this.$message.error(_this.$t(_this.Global.errorTitle))
                                //         })
                                // }
                                _this.$emit('mailsMailboxesGet')
                                _this.$message.success(_this.$t('mxpcweb.mail.1528975184365'))// '修改成功!'
                                _this.isDialog('c')
                                _this.Haverule = false// 规则清空
                                _this.CrlearData()// 清空数据
                            } else {
                                _this.$message.error(_this.msg(res.body))
                            }
                        },
                            function (res) {
                                _this.loading2 = false
                                _this.$message.error(_this.$t(_this.Global.errorTitle))
                            })
                    }
                } else {
                    _this.loading2 = false
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 规则提交
        submitMerge(formName) {
            this.submitLoading = true
            let _this = this
            let isMary = false
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.isSendAdd == false) {
                        _this.dialogMerge.fromAddress = ''
                    }
                    if (this.isReceiveAdd == false) {
                        _this.dialogMerge.toAddress = ''
                    }
                    if (this.isTheme == false) {
                        _this.dialogMerge.subject = ''
                    }

                    if (this.isrecipient == false) {
                        _this.dialogMerge.recipient = ''
                    }
                    if (this.iscc == false) {
                        _this.dialogMerge.ccAddress = ''
                    }

                    if (this.dialogMerge.fromAddress != '' || this.dialogMerge.toAddress != '' || this.dialogMerge.subject != '' || this.dialogMerge.recipient != '' || this.dialogMerge.ccAddress != '') {
                        _this.Haverule = true// 有规则
                    } else {
                        _this.submitLoading = false
                        _this.isAddRule = false// 关闭规则窗体
                        return
                    }
                    let data = { 'termsGroup': _this.dialogMerge.termsGroup, 'fromAddress': _this.dialogMerge.fromAddress, 'subject': _this.dialogMerge.subject }
                    if (_this.dialogMerge.termsGroup == '1') { // 满足一项
                        if (this.dialogMerge.recipient != '' && this.dialogMerge.ccAddress != '') {
                            data.toAddress = this.dialogMerge.recipient
                            data.ccAddress = this.dialogMerge.ccAddress
                        } else if (this.dialogMerge.recipient == '' && this.dialogMerge.ccAddress == '' && this.dialogMerge.toAddress != '') {
                            data.toAddress = this.dialogMerge.toAddress
                            data.ccAddress = this.dialogMerge.toAddress
                        } else if (this.dialogMerge.recipient != '' || this.dialogMerge.ccAddress != '') {
                            if (this.dialogMerge.toAddress != '') {
                                data.toAddress = _this.dialogMerge.recipient == '' ? _this.dialogMerge.toAddress : _this.dialogMerge.recipient
                                data.ccAddress = _this.dialogMerge.ccAddress == '' ? _this.dialogMerge.toAddress : _this.dialogMerge.ccAddress
                            } else {
                                if (this.dialogMerge.recipient) {
                                    data.toAddress = this.dialogMerge.recipient
                                }
                                if (this.dialogMerge.ccAddress) {
                                    data.ccAddress = this.dialogMerge.ccAddress
                                }
                            }
                        } else {
                            data.toAddress = ''
                            data.ccAddress = ''
                        }
                    } else { // 满足所有
                        if (this.dialogMerge.recipient != '' && this.dialogMerge.ccAddress != '') {
                            data.toAddress = this.dialogMerge.recipient
                            data.ccAddress = this.dialogMerge.ccAddress
                        } else if (this.dialogMerge.toAddress != '') {
                            isMary = true
                            data = { 'ruleList': [
                                    {
                                        'termsGroup': _this.dialogMerge.termsGroup,
                                        'fromAddress': _this.dialogMerge.fromAddress,
                                        'subject': _this.dialogMerge.subject,
                                        'ccAddress': '',
                                        'toAddress': _this.dialogMerge.recipient == '' ? _this.dialogMerge.toAddress : _this.dialogMerge.recipient
                                    }, {
                                        'termsGroup': _this.dialogMerge.termsGroup,
                                        'fromAddress': _this.dialogMerge.fromAddress,
                                        'subject': _this.dialogMerge.subject,
                                        'toAddress': '',
                                        'ccAddress': _this.dialogMerge.ccAddress == '' ? _this.dialogMerge.toAddress : _this.dialogMerge.ccAddress
                                    }
                                ]
                            }
                        } else if ((this.dialogMerge.recipient != '' || this.dialogMerge.ccAddress != '') && this.dialogMerge.toAddress == '') {
                            if (this.dialogMerge.recipient) {
                                data.toAddress = this.dialogMerge.recipient
                            }
                            if (this.dialogMerge.ccAddress) {
                                data.ccAddress = this.dialogMerge.ccAddress
                            }
                        } else {
                            data.toAddress = ''
                            data.ccAddress = ''
                        }
                    }
                    if (_this.dialogType == 0) { // 添加
                        if (isMary) {
                            this.boxRules.push(data.ruleList[0])
                            this.boxRules.push(data.ruleList[1])
                            isMary = false
                        } else {
                            this.boxRules.push(data)
                        }

                        this.iscc = false
                        this.isrecipient = false
                    } else {
                        data.boxId = _this.SuperiorId

                        if (isMary) {
                            this.add(data)
                            isMary = false
                        } else {
                            this.edit(data)
                        }
                    }
                    _this.submitLoading = false
                    _this.isAddRule = false// 关闭规则窗体
                } else {
                    console.log('error submit!!')
                    _this.submitLoading = false
                    return false
                }
            })
        },
        add(data) {
            let _this = this
            _this.$http.post(_this.Global.baseURL + _this.Global.api.Mail.mailBoxRuleAdd, data).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    this.boxRules = res.body.data
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            },
                function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
        },
        edit(data) {
            let _this = this
            _this.$http.post(_this.Global.baseURL + _this.Global.api.Mail.mailBoxRulePut, data).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    this.boxRules = res.body.data
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            },
                function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
        }, // 清空数据
        CrlearData() {
            this.dialogMerge = {
                fromAddress: '',
                toAddress: '',
                subject: '',
                termsGroup: '1'
            }
            this.dialog = {
                name: '',
                color: '1',
                content: '',
                rule: false
            }
            this.isAddRule = false
        }, // 清空表单
        resetForm(formName) {
            if (this.isOpen) {
                this.$refs[formName].resetFields()
            }
            this.CrlearData()
        },
        isDialogPeer(myMailTree, treeData, type) {
            let _this = this
            if (type == 'AddPeerFolder') { // 添加同级文件夹
                _this.custFid = 0// 客户ID
                _this.custName = ''
                _this.dialogType = 0
                _this.AddPeerFolder(myMailTree, treeData)
            } else if (type == 'AddSublevelFolder') { // 添加子级文件夹
                _this.custFid = 0// 客户ID
                _this.custName = ''
                _this.dialogType = 0
                _this.AddSublevelFolder(treeData)
            } else if (type == 'UpdateFolder') { // 修改文件夹
                _this.dialogType = 1
                _this.GetMailboxDetail(myMailTree, treeData)
            }
        },
        AddPeerFolder(myMailTree, treeData) { // 同级
            let _this = this
            _this.RuleButton = true
            _this.TiltleName = _this.$t('mxpcweb.mail.1528975215072')// "添加文件夹";
            if (treeData.id == treeData.boxPath) { // 第一级别
                _this.SuperiorName = _this.$t('mxpcweb.mail.1528975158622')// "无";
            } else {
                _this.SuperiorName = ''
                _this.SuperiorId = ''
                let TitleNameArry = treeData.TitleName.split('/')
                for (let i = 0; i < TitleNameArry.length - 1; i++) {
                    _this.SuperiorName += TitleNameArry[i] + '/'
                }
            }

            _this.SuperiorId = treeData.FID
            _this.isDialog('open')
        },
        AddSublevelFolder(item) { // 子级
            let _this = this
            _this.RuleButton = true
            _this.TiltleName = _this.$t('mxpcweb.mail.1528975215072')// "添加文件夹";
            if (item.FID == -2) {
                _this.SuperiorName = item.label + '/'
                _this.SuperiorId = item.boxPath
            } else {
                _this.SuperiorName = item.TitleName
                let TitleNameArry = item.boxPath.split('/')
                _this.SuperiorId = TitleNameArry[TitleNameArry.length - 1]
            }
            _this.isDialog('open')
        },
        GetMailboxDetail(myMailTree, treeData) { // 获取邮件文件夹信息
            let _this = this
            this.TiltleName = _this.$t('mxpcweb.mail.1528942067470')// "修改文件夹";
            _this.SuperiorName = treeData.TitleName
            _this.SuperiorId = treeData.id
            let data = { ctid: _this.company.ctId, boxId: _this.SuperiorId }
            if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                data.ctid = this.subordinateCtid
            } else {
                delete data.ctid
            }
            _this.$http.get(_this.Global.baseURL + _this.Global.api.Mail.mailsMailboxGet, { params: data }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    let ResultData = res.body.data
                    if (ResultData.mailBox.boxType == 0) { // 系统自带文件夹名称不能修改
                        _this.dialog.EditText = true
                        _this.RuleButton = false
                    } else {
                        _this.RuleButton = true
                    }
                    // if (ResultData.mailBox.boxId == 1 || ResultData.mailBox.boxId == 2 || ResultData.mailBox.boxType != 0) { // 收件箱或者已发件箱可以修改规则

                    // }
                    _this.custFid = ResultData.mailBox.custId
                    if (ResultData.mailBox.custId > 0) {
                        _this.getCustomerName(ResultData.mailBox.custId)
                    } else {
                        _this.custName = ''
                    }
                    _this.dialog.name = ResultData.mailBox.boxName
                    _this.dialog.color = ResultData.mailBox.bgColor.toString() == '' ? '1' : ResultData.mailBox.bgColor.toString()
                    _this.dialog.content = ResultData.mailBox.description
                    _this.dialog.rule = ResultData.mailBox.directMerge == 1
                    if (isArray(ResultData.mailBoxRule)) {
                        _this.boxRules = ResultData.mailBoxRule
                        _this.Haverule = true
                    } else {
                        _this.boxRules = []
                        _this.Haverule = false
                    }
                    _this.isDialog('open')
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        cancelCustomerDialog() {
            this.CisOpen = false
        },
        submitCustomerDialog(cuid, cname) {
            this.CisOpen = false
            this.custFid = cuid
            this.custName = cname
        },
        // 获取客户名称
        getCustomerName(identFieldValue) {
            let _this = this
            let argument = {
                moduleCode: 'BF001',
                searchType: 'detail',
                identFieldValue: identFieldValue

            }
            //  if(this.subordinateCtid!=this.company.ctId&&this.subordinateCtid !=0){
            //     data.ctid=this.subordinateCtid;
            //   }  else{
            //       delete data.ctid;
            //   }
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.document_generalOperate_get, { params: argument }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    this.custName = res.body.data.custName
                } else {
                    _this.listLoading = false
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.listLoading = false
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        }
    },
    watch: {
        treeMenu: function (newValue, oldValue) {
            if (newValue.type != 'HandOverTo' && newValue.type != 'ImportMail') {
                this.boxRules = []
                this.isDialogPeer(newValue.data.myMailTree, newValue.data.treeData, newValue.type)
            }
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
