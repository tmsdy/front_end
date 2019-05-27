<template>
    <div class="NewMail MXscroll" v-loading="loading2" :element-loading-text="loadingtext">
        <!-- 邮件发送中... -->
        <div class="btnItem">
            <ordinary-send ref="OrdinarySend" :ParameterData="ParameterData" :sendType="sendType" :sendingShow="sendingShow" :sourceMid="sourceMid" :originMid="originMid" @senndAction="senndAction" @SendMailAction="SendMailAction"></ordinary-send>
            <one-to-one-transmission ref="OneToOneTransmission" @senndAction="senndAction"></one-to-one-transmission>
            <!-- 主动请审 -->
            <span @click="SaveDraft()" class="spanclass">
                <i class="iconfont icon-save"></i>{{$t('mxpcweb.mail.1528786401856')}}
                <!-- 保存 -->
            </span>

            <div class="addSendAddress">
                <el-button type="text" @click="removeCCMail()">{{isCCMail==true ?$t('mxpcweb.mail.1528786402079'):$t('mxpcweb.mail.1528786402291')}}</el-button>
                <!-- 移除抄送 : 添加抄送 -->
                <el-button type="text" @click="removeDDMail()">{{isDrakMail==true ?$t('mxpcweb.mail.1528786402502'):$t('mxpcweb.mail.1528786402956') }}</el-button>
                <!-- '移除暗送' : '添加暗送' -->
            </div>

        </div>
        <section class="mailBody">
            <div ref="writeWrapHeader" class="bodydiv">
                <ul class="sendItem ">
                    <li :class="[!isUpDown?'':'Line']">
                        <div class="pull-right btnSender">
                            <span @click="ThousandMiles()">
                                <i class="iconfont icon-eye" :class="{'text-red':sender.isClairvoyant}"></i>{{$t('mxpcweb.mail.1528786429220')}}
                                <!-- 千里眼 -->
                            </span>
                            <span @click="RequestReceipt()">
                                <i class="iconfont icon-correct" :class="{'text-red':sender.isReceipt}"></i>{{$t('mxpcweb.mail.1528786429539')}}
                                <!-- 请求回执 -->
                            </span>
                            <span>{{$t('mxpcweb.mail.1528786430027')}}
                                <!-- 优先级 -->
                                <el-switch v-model="sender.grade" :width="70" style="font-size:12px; margin-left:5px;" :on-text="$t('mxpcweb.mail.1528714855256')" :off-text="$t('mxpcweb.mail.1528786447428')" @change="gradeChange">
                                </el-switch>
                            </span>
                        </div>
                        <span class="name">
                            <!-- 发件人 -->
                            {{$t('mxpcweb.mail.1528702110362')}}：</span>
                        <div class="item">
                            <!-- 请选择发件人 -->
                            <el-select v-model="sender.selectValue" size="small" :placeholder="$t('mxpcweb.mail.1528795153294')" style="width:270px;" @change='checkSelectValue(sender.selectValue)'>
                                <el-option v-for="(item,index) in sender.options" :key="index" :label="item.sendDisplayName+'<'+item.mailAccount+'>'" :value="item.sendDisplayName+'<'+item.mailAccount+'>' ">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li :class="[!isUpDown?'':'Line']" v-show="isUpDown">
                        <span class="name text-blues blue-hover" @click="$refs.dialogGetContacts.isShow(1,$refs.recipientsPicking_value.getData())">
                            <!-- 收件人 -->
                            {{$t('mxpcweb.mail.1528702113259')}}：</span>
                        <div :class="[classShow.recipients?'inputClass':'hiddenOver']" class="item  MXscroll" ref="recipientsPickingId">
                            <input-auto ref="recipientsPicking_value" :disabled="prohibitIput" :inputMailData.sync="recipientsPicking.value" :inputMailDownData="restaurants" v-on:inputChange="inputChange" @mailChange="ueSetHeight()" @Picking_valueChange="Picking_valueChange" @test="test" :inputType="'recipientsPicking_value'"></input-auto>
                        </div>
                        <span class="More" v-if="classShow.recipientsMroe" @click="test('recipientsPicking_value')">更多</span>
                        <!-- <span class="manypeople">等{{$refs.recipientsPicking_value.getData().length}}人</span> -->
                    </li>
                    <li :class="[!isUpDown?'':'Line']" v-show="isUpDown" v-if="isCCMail">
                        <span class="name text-blues blue-hover" @click="$refs.dialogGetContacts.isShow(2,$refs.ccPicking_value.getData())">
                            <!-- 抄送 -->
                            {{$t('mxpcweb.mail.1528702123800')}}：</span>
                        <div :class="[classShow.cc?'inputClass':'hiddenOver']" class="item  MXscroll" ref="ccPickingId">
                            <input-auto ref="ccPicking_value" :disabled="prohibitIput" :inputMailData.sync="ccPicking.value" :inputMailDownData="restaurants" v-on:inputChange="inputChange" @mailChange="ueSetHeight()" @Picking_valueChange="Picking_valueChange" @test="test" :inputType="'ccPicking_value'"></input-auto>
                        </div>
                        <span class="More" v-if="classShow.ccMroe" @click="test('ccPicking_value')">更多</span>
                    </li>
                    <li :class="[!isUpDown?'':'Line']" v-show="isUpDown" v-if="isDrakMail">
                        <span class="name text-blues blue-hover" @click="$refs.dialogGetContacts.isShow(3,$refs.DrakPicking_value.getData())">
                            <!-- 暗送 -->
                            {{$t('mxpcweb.mail.1528786925400')}}：</span>
                        <div :class="[classShow.dr?'inputClass':'hiddenOver']" class="item   MXscroll" ref="DrakPickingId">
                            <input-auto ref="DrakPicking_value" :disabled="prohibitIput" :inputMailData.sync="DrakPicking.value" :inputMailDownData="restaurants" v-on:inputChange="inputChange" @mailChange="ueSetHeight()" @Picking_valueChange="Picking_valueChange" @test="test" :inputType="'DrakPicking_value'"></input-auto>
                        </div>
                        <span class="More" v-if="classShow.drMroe" @click="test('DrakPicking_value')">更多</span>
                    </li>
                    <li v-show="isUpDown">
                        <div class="pull-right btnTag">
                            <span v-for="(item,index) in selectedTagsItem" :key="index">
                                <el-tag type="gray" v-if="index<3"> {{item.labelName}}</el-tag>
                                <el-tag type="gray" v-if="index==3">...</el-tag>
                            </span>
                            <span>
                                <el-dropdown @command="handleCommand">
                                    <span class="el-dropdown-link text-blues blue-hover">
                                        <!-- 打标签 -->
                                        {{$t('mxpcweb.mail.1528788465439')}}
                                        <i class="iconfont icon-tag"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown" class="MXscroll" style="overflow:auto;min-height:100px;max-height:300px;margin-top:-2px;">
                                        <el-dropdown-item v-for="(item,index) in dynamicTags" :key="index" :command='{type:"Choice",item:item}'>
                                            <span v-if="item.color!=11">{{item.labelName}}</span>
                                            <template v-for="(item2,index2) in selectTags">
                                                <i :key="index2" v-if="item.labelId==item2&&item.color!=11" class="iconfont icon-tag text-blue" style="font-size:14px"></i>
                                            </template>
                                        </el-dropdown-item>

                                        <el-dropdown-item divided :command='{type:"eliminate"}'>
                                            <!-- 清除已设标签 -->
                                            {{$t('mxpcweb.mail.1528788497871')}}
                                        </el-dropdown-item>
                                        <el-dropdown-item :command='{type:"setTag"}'>
                                            <!-- 邮件标签管理  -->
                                            {{$t('mxpcweb.mail.1528788498217')}}
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </span>
                        </div>
                        <span class="name">
                            <!-- 主题  -->
                            {{$t('mxpcweb.mail.1528788517560')}}：
                        </span>
                        <div class="item">
                            <!-- 请输入主题 -->
                            <input type="text" v-model="subject" class="theme" :placeholder="$t('mxpcweb.mail.1528954325325')" @input="subjectUpdata($event)" @mouseout="subjectUpdata2()">
                        </div>
                    </li>
                    <span class="upclass" @click="isUpDownChange()">
                        <span><i :class="[isUpDown?'iconfont icon-page-up':'iconfont icon-page-down']" style=" transform: scale(0.8);"></i>{{isUpDown?'精简模式':'详细模式'}}</span>
                    </span>

                </ul>

                <div class="btnItem2">
                    <span @click="$refs.DialogMailComment.isDialog( 'open','邮件','EM001', 0, subject,{})">
                        <i class="iconfont icon-comment"></i>
                        <!-- 批注 -->
                        {{$t('mxpcweb.mail.1528702539712')}}
                    </span>
                    <span class="lineRight" @click="$refs.MailAddMsg.showDialogR(0)">
                        <i class="iconfont icon-notice-solid"></i>
                        <!-- 跟踪提醒 -->
                        {{$t('mxpcweb.mail.1528788518416')}}
                    </span>
                    <span>

                        <el-dropdown @command="CommandAttach">
                            <span class="el-dropdown-link text-blues blue-hover">
                                <i class="iconfont icon-attachment"></i>
                                <!-- 添加附件 -->
                                {{$t('mxpcweb.mail.1528788528013')}}
                                <i class="iconfont icon-page-down"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <!-- 添加本地附件 -->
                                <el-dropdown-item :command="{actionName:'AddLocal'}">{{$t('mxpcweb.mail.1544860049516')}}
                                </el-dropdown-item>
                                <!-- 添加在线文档 -->
                                <el-dropdown-item :command="{actionName:'AddOnline'}">{{$t('mxpcweb.mail.1544860057294')}}
                                </el-dropdown-item>

                            </el-dropdown-menu>
                        </el-dropdown>

                    </span>
                </div>
                <div class="Upload" v-show="fileList.length>0">
                    <file-upload ref="fileUpload" :limitSize="30" :file-list="fileList" @change="ueSetHeight()" :isDrag="!editorIsFullScreen"></file-upload>
                </div>
                <div class="msg" v-for="(itemnot,indexnot) in notices" :key="indexnot">
                    <div class="pull-right" @click="noticesDel(indexnot)">
                        <i class="iconfont icon-del"></i>
                    </div>
                    <i class="iconfont icon-notice"></i>
                    <span v-if="itemnot.msgSubType==1"> {{itemnot.deliveryTime}}
                        <!-- 【{{itemnot.name}}】 在 {{itemnot.deliveryTime}}提醒我” -->
                        {{$t('mxpcweb.mail.1530101737559',{a:itemnot.name,b:itemnot.deliveryTime,c:itemnot.body.msgBody})}}
                    </span>
                    <span v-else> {{itemnot.createDate}}
                        <!-- 【{{itemnot.name}}】 若在 {{itemnot.deliveryTime}} 之前未回复提醒我 “再跟客人发送确认邮件”  -->
                        {{$t('mxpcweb.mail.1530102145871',{a:itemnot.name,b:itemnot.deliveryTime,c:itemnot.body.msgBody})}}
                    </span>
                </div>
                <div class="msg" v-for="(itemc,indexc) in comments" :key="indexc">
                    <div class="pull-right" @click="commentsDel(indexc)">
                        <i class="iconfont icon-del"></i>
                    </div>
                    <i :style="setCommentsColor(itemc.commentFlag)" class="iconfont icon-dot"></i>
                    <span> {{itemc.createDate}} 【
                        <span v-for="(itemsq,indexsq) in itemc.targetsName" :key="indexsq">{{itemsq}}
                            <span v-if="indexsq!=itemc.targetsName.length-1">,</span>
                        </span>】 {{itemc.content}} </span>
                </div>
            </div>
            <div class="ueditorWrap">
                <ueditor :config="config" ref="ueditor" @ready="editorReady"></ueditor>
            </div>

            <div class="sourceMail" v-if="!showAll">
                <!-- 原邮件已引用 -->
                {{$t('mxpcweb.mail.1528789074017')}}
                <el-button type="text" @click="originShowClick()">
                    <!-- 点击展开  -->
                    {{$t('mxpcweb.mail.1528789073716')}}
                </el-button>
                <el-checkbox v-model="checked">
                    <!-- 回复/转发邮件时在编辑器内显示原邮件内容 -->
                    {{$t('mxpcweb.mail.1528789062729')}}
                </el-checkbox>
            </div>

        </section>

        <!-- 邮件提醒，弹窗 -->
        <dialog-mail-addmsg ref="MailAddMsg" @getMsg="SaveMsg"></dialog-mail-addmsg>
        <!-- 邮件批注，弹窗 -->
        <dialog-mail-comment ref="DialogMailComment" @getListData="SaveComment"></dialog-mail-comment>
        <!-- 邮件标签，弹窗 -->
        <dialog-set-tags ref="DialogSetTags" @UpdataTagsData="UpdataTagsData"></dialog-set-tags>
        <!--一对一发送-->
        <dialog-oneToOne ref="DialogOneToOne" @setingMsgAndcomment="setingMsgAndcomment"></dialog-oneToOne>
        <!--获取联系人-->
        <dialog-get-contacts @updateContact="updateContact" ref="dialogGetContacts"></dialog-get-contacts>
        <!--定时发送-->
        <date-selection ref="DateSelection" @timingChange="timingChange" @delayedChange="delayedChange" @openOneToOneDialog="openOneToOneDialog"></date-selection>

        <dialog-doc ref="DialogDoc" @checkedDoc="checkedOnlineDoc"></dialog-doc>

    </div>
</template>

<script>
/**
 * 描述：邮件部分
 * 作者：向士健(CSS) / ***(API)
 * 时间：2017/11/11
 */

import UEditor from '@/components/UEditor/component.vue' // 编辑器
import MailAddMsg from '@/page/Main/Mail/Vue/DialogAddMsg/index'
import DialogMailComment from '@/components/DialogMailComment'
import DialogSetTags from '@/components/DialogSetTags'
import { isObject, isArray, commentsColor, sleep, AddressCharacterJudgment } from '@/libs/utils.js'
import { mapGetters, mapMutations } from 'vuex'
import OneToOne from '@/page/Main/Mail/Vue/DialogOneToOne/index' // 一对一发送
import InputAuto from './InputAuto'
import DateSelection from './DateSelection'
import FileUpload from '@/components/FileUpload/index' // 文件上传
import DialogGetContacts from '@/components/DialogGetContacts/index' // 文件上传
import DialogDoc from './../Vue/DialogDoc/index' // 在线文档选择
import OrdinarySend from './Vue/OrdinarySend/index'
import OneToOneTransmission from './Vue/OneToOneTransmission/index'
import mixin from '../mixin.js'
export default {
    name: 'NewMail',
    props: [],
    mixins: [mixin],
    data() {
        let _this = this
        return {
            ueflag: 0,
            ueContentBak: '',
            fileList: [],
            ParameterData: {},
            dbVersion: 1,
            isDrakMail: false, // 暗送开关
            isCCMail: true, // 抄送开关
            dynamicTags: [], // 标签
            selectTags: [], // 选择标签
            selectedTagsItem: [], // 选中标签
            sender: {
                selectValue: '',
                options: [], // 发件人
                grade: false,
                isClairvoyant: false, // 千里眼开关
                isReceipt: false // 请求回执开关
            },
            // 输入下拉选收件人员
            recipientsPicking: {
                value: []
            },
            // 输入下拉选抄送人员
            ccPicking: {
                value: []
            },
            // 输入下拉选暗送人员
            DrakPicking: {
                value: []
            },
            restaurants: [],
            loadIndex: 0,
            // 编辑器配置
            config: {
                moduleCode: 'EM001',
                // 请输入邮件内容
                initialContent: _this.$t('mxpcweb.mail.1528955884682'), // 初始化编辑器的内容
                initialFrameHeight: 555, // 内容初始高度
                // autoHeightEnabled: true, // 高度是否自增长
                toolbars: [
                    [
                        'fullscreen', 'source', '|', 'fontfamily', 'fontsize', 'forecolor', 'backcolor', '|',
                        'bold', 'italic', 'underline', 'strikethrough', '|',
                        'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                        'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'link', 'unlink',
                        'simpleupload',
                        'horizontal', 'emotion', 'removeformat', 'formatmatch', 'autotypeset', '|',
                        'inserttable', 'goods', 'letter', 'insertfield', 'inserttext', 'insertautograph'
                        // , 'templet'
                    ]
                ]
            },
            subject: '',
            ParameterList: [],
            Timeoutblg: true,
            MailType: '',
            attachmentList: [],
            OriginalMailContent: '', // 原邮件内容
            templateHtmlContent: '', // 模板邮件内容
            routeObj: {},
            pageUnionId: '',
            loading2: false,
            loadingtext: this.$t('mxpcweb.mail.1528954286103'),
            flg: true,
            selectValueback: '',
            OriginalMailContentback: '',
            sourceMid: '',
            taskId: 0,
            urlstr: '',
            checked: false,
            showAll: true,
            commentdata: {}, // 批注对象
            msgObj: {}, // 提醒对象
            comments: [], // 批注数组
            notices: [], // 提醒数组
            SettingInformationData: {}, // 设置项
            first: false,
            sizeAttach: 0, // 附件大小
            attachShow: true, // 附件是否可以再上传
            sizeAttachMx: 0, // 最大附件大小
            prohibitIput: false, // 禁止输入
            otBeforeLable: false, // 发送前给邮件打标签
            timeOut: '',
            showPrompt: 0,
            previousRequest: '',
            ccArry: [],
            toArry: [],
            bccArry: [],
            sendingShow: false,
            sendType: 'W',
            originMid: '',
            replyTo: '',
            myUE: null,
            cachRead: false,
            cachParameter: {},
            subjectChange: false,
            fileListChange: false,
            originMsgId: '',
            isUpDown: true,
            classShow: {
                recipients: true,
                recipientsMroe: false,
                cc: false,
                ccMroe: false,
                dr: false,
                drMroe: false
            },
            Tips: true,
            editorIsFullScreen: false
        }
    },
    computed: {
        ...mapGetters('mail', ['subordinateCtid']),
        ...mapGetters(['company', 'personalInfo'])
    },
    created() {
        let _this = this
        this.getPersonalData()
        this.maillabelsGet()
        ep.tail('mailsDeliveryStatusGet', (dataObj) => { // 发送邮件后调用
            if (dataObj.body.rawData.taskId == this.taskId) {
                if (dataObj.body.rawData.singleMailDeliveryStatuses[0].code == '250') {
                    // clearTimeout(_this.timeOut)
                    // this.loading2 = false
                    // this.$message.success(this.$t('mxpcweb.mail.1528782772184'))// 发送成功！
                    // this.setingMsgAndcomment(this.taskId, true) // 添加批注和提醒
                    // ep.emit('closeMailTab', this.urlstr)
                    this.SucceAction()
                } else {
                    // clearTimeout(_this.timeOut)
                    // this.loading2 = false
                    let msgArr = dataObj.body.rawData.singleMailDeliveryStatuses[0].msg
                    // // '发送失败' + msgArr[2], '错误提示'
                    // this.$alert(this.$t('mxpcweb.mail.1528976480298', { a: msgArr }), this.$t('mxpcweb.mail.1528976561633'), {// '错误提示'
                    //     confirmButtonText: this.$t('mxpcweb.mail.1528942374762'), // '确定',
                    //     callback: action => {

                    //     }
                    // })
                    // this.sourceMid = this.taskId
                    this.failAction(msgArr)
                }
                this.set_refurbishListBool(2)
            }
        })

        let { id } = this.$route.params
        let ids = id.split('_')
        // if (ids[0] == 'index') {
        //     this.cachRead = true
        //     return
        // } else {
        //     this.cachRead = false
        // }
        let obj = JSON.parse(decodeURIComponent(atob(ids[1])))
        this.routeObj = obj

        // 关闭窗体
        ep.tail(id, tpl => {
            _this.loading2 = false
            _this.Timeoutblg = false
        })
        ep.tail('CustmerWriteMail' + ids[2], (ddObj) => { // 客户写邮件
            _this.recipientsPicking.value = ddObj.recipientsPicking
            console.log(_this.recipientsPicking.value)
        })
    },
    mounted() {
        $(window).resize(() => {
            this.ueSetHeight()
        })
    },
    methods: {
        SucceAction() {
            clearTimeout(this.timeOut)
            this.loading2 = false
            this.$message.success(this.$t('mxpcweb.mail.1528782772184'))// 发送成功！
            this.setingMsgAndcomment(this.taskId, true) // 添加批注和提醒
            ep.emit('closeMailTab', this.urlstr)
        },
        failAction(msg) {
            clearTimeout(this.timeOut)
            this.loading2 = false
            // '发送失败' + msgArr[2], '错误提示'
            this.$alert(this.$t('mxpcweb.mail.1528976480298', { a: msg }), this.$t('mxpcweb.mail.1528976561633'), {// '错误提示'
                confirmButtonText: this.$t('mxpcweb.mail.1528942374762'), // '确定',
                callback: action => {

                }
            })
            this.sourceMid = this.taskId
        },
        getdeliveryStatus(taskId, mailAccount) {
            return new Promise((resolve, reject) => {
                this.$http.get(this.Global.baseURL + this.Global.api.Mail.GetDeliveryStatus, {
                    params: {
                        taskId: taskId,
                        mailAccount: mailAccount
                    }
                }).then(
                    function (res) {
                        if (res.body.code.toString() == this.Global.RES_OK && isObject(res.body.data)) {
                            let resurltData = res.body.data.data
                            if (resurltData.singleMailDeliveryStatuses && resurltData.singleMailDeliveryStatuses.length > 0 && isObject(resurltData.singleMailDeliveryStatuses[0])) {
                                resolve({ code: resurltData.singleMailDeliveryStatuses[0].code, msg: resurltData.singleMailDeliveryStatuses[0].msg })
                            } else {
                                resolve({ code: '0' })
                            }
                        } else {
                            resolve({ code: '0' })
                        }
                    },
                    function (res) {
                        resolve({ code: '0' })
                    }
                )
            })
        },
        async getResult(taskId, sendUser, num, times) {
            num--
            let res = await this.getdeliveryStatus(taskId, sendUser)
            if (res.code != '0') {
                return res
            }
            if (num <= 0) {
                return { code: '0' }
            }
            await sleep(times)
            return this.getResult(taskId, sendUser, num, times)
        }, // 普通发送
        SendMailAction(ParameterData, type) {
            if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                ParameterData.ctid = this.subordinateCtid
            } else {
                delete ParameterData.ctid
            }
            ParameterData.replyTo = this.replyTo
            this.loadingtext = this.$t('mxpcweb.mail.1528954286103')
            this.loading2 = true
            this.$http.post(this.Global.baseURL + this.Global.api.Mail.mailssavePost, ParameterData).then(async (res) => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.Timeoutblg = false
                    if (type == 0) { // 定时
                        this.loading2 = false
                        this.setingMsgAndcomment(res.body.data.taskId, true) // 添加批注和提醒
                        ep.emit('closeMailTab', this.$route.params.id)
                    } else { // 立即
                        this.taskId = res.body.data.taskId
                        this.urlstr = this.$route.params.id
                        // let _this = this
                        // this.timeOut = setTimeout(() => {
                        //     this.exceptionHandling()
                        // }, 30000)
                        // if (S == 1) { // 连接状态
                        await sleep(5 * 1000) // 20秒
                        let res2 = await this.getResult(this.taskId, ParameterData.sendMailInfo.sendUser, 2, 3 * 1000)
                        if (res2.code == '250') {
                            this.SucceAction()
                        } else if (res2.code == '0') {
                            this.exceptionHandling()
                        } else {
                            this.failAction(res2.msg)
                        }
                        // } else { // 断开状态
                        //     this.timeOut = setTimeout(() => {
                        //         if (res.code == '250') {
                        //             this.SucceAction()
                        //         } else if (res.code == '0') {
                        //             this.exceptionHandling()
                        //         } else {
                        //             this.failAction(res.msg)
                        //         }
                        //     }, 3 * 1000)
                        // }
                    }
                } else {
                    this.Timeoutblg = true
                    this.loading2 = false
                    this.ParameterData.sourceMid = res.body.data.taskId
                    clearTimeout(this.timeOut)
                    this.$message.error(this.msg(res.body))
                }
            },
                function (res) {
                    this.loading2 = false
                    this.$message.error(this.msg(res.body))
                }
            )
        },
        test(type) {
            if (type == 'recipientsPicking_value') { // 收件人
                this.classShow = {
                    recipients: true,
                    cc: false,
                    dr: false
                }
                if (this.isCCMail) {
                    this.$refs.ccPickingId.scrollTop = 0
                    this.classShow.ccMroe = this.$refs.ccPicking_value.$el.clientHeight > 40
                }
                if (this.isDrakMail) {
                    this.$refs.DrakPickingId.scrollTop = 0
                    this.classShow.drMroe = this.$refs.DrakPicking_value.$el.clientHeight > 40
                }
            } else if (type == 'ccPicking_value') { // 抄送人
                this.classShow = {
                    recipients: false,
                    recipientsMroe: this.$refs.recipientsPicking_value.$el.clientHeight > 40,
                    cc: true,
                    dr: false
                }

                this.$refs.recipientsPickingId.scrollTop = 0
                if (this.isDrakMail) {
                    this.$refs.DrakPickingId.scrollTop = 0
                    this.classShow.drMroe = this.$refs.DrakPicking_value.$el.clientHeight > 40
                }
            } else { // 暗送人
                this.classShow = {
                    recipients: false,
                    recipientsMroe: this.$refs.recipientsPicking_value.$el.clientHeight > 40,
                    cc: false,
                    dr: true
                }
                this.$refs.recipientsPickingId.scrollTop = 0
                if (this.isCCMail) {
                    this.$refs.ccPickingId.scrollTop = 0
                    this.classShow.ccMroe = this.$refs.ccPicking_value.$el.clientHeight > 40
                }
            }
        },
        isUpDownChange() {
            this.isUpDown = this.isUpDown != true
            this.ueSetHeight(40)
        },
        openShow() {
            if (this.cachRead) { // 需要缓存中读取
                this.cachRead = false
                let { id } = this.$route.params
                let ids = id.split('_')
                let obj = JSON.parse(decodeURIComponent(atob(ids[1])))
                this.routeObj = obj
                // 关闭窗体
                let _this = this
                ep.tail(id, tpl => {
                    _this.loading2 = false
                    _this.Timeoutblg = false
                })
                this.autoGetMail('mxMailDB', 1, 'Mail', this.$route.params.id, 'detail')
                // }
            }
        },
        MailMode(obj) {
            let _this = this
            if (obj.type == 'R') {
                this.sendType = 'reply'
                _this.ReplyMail(obj.mId, obj.type, obj.templateid)
            } else if (obj.type == 'F') {
                this.sendType = 'repost'
                _this.ReplyMail(obj.mId, obj.type, obj.templateid)
            } else if (obj.type == 'D' || obj.type == 'Z') {
                this.sendType = 'new'
                _this.showAll = true
                _this.ManuscriptBackWriting(obj.mId, obj.type)
            } else if (obj.type == 'Rl') {
                this.sendType = 'reply'
                _this.ReplyMail(obj.mId, obj.type, obj.templateid)
            } else if (obj.type == 'W') {
                this.sendType = 'new'
                _this.showAll = true
                _this.MailWrite(obj.type, obj.templateId == undefined ? 0 : obj.templateId)
            } else if (obj.type == 'A') { // 作为附件发送
                this.sendType = 'new'
                this.showAll = true
                this.MailWrite('W', 0)
            }
        },
        getReplyAddress(mailAccount) {
            let replyAddress = []
            for (let i = 0; i < this.sender.options.length; i++) {
                if (this.sender.options[i].mailAccount == mailAccount) {
                    replyAddress.push({ name: this.substringName(this.sender.options[i].replyAddress), address: this.sender.options[i].replyAddress })
                }
            }
            return replyAddress
        },
        openOneToOneDialog(deliverDate) {
            let actionName = 'timingShowOneToOneDialog'
            this.ParameterData.deliverDate = deliverDate
            this.$refs.DialogOneToOne.isDialogs(
                'open',
                this.replyTo,
                this.ParameterList,
                this.ParameterData,
                this.$route.params.id,
                actionName
            )
        },
        // 获取一对一显示列表数据
        GetListData() {
            this.ParameterList = []
            for (let i = 0; i < this.recipientsPicking.value.length; i++) {
                this.ParameterList.push({
                    mail: this.recipientsPicking.value[i].mail,
                    name: this.recipientsPicking.value[i].name
                })
            }
            for (let i = 0; i < this.ccPicking.value.length; i++) {
                this.ParameterList.push({
                    mail: this.ccPicking.value[i].mail,
                    name: this.ccPicking.value[i].name
                })
            }
            for (let i = 0; i < this.DrakPicking.value.length; i++) {
                this.ParameterList.push({
                    mail: this.DrakPicking.value[i].mail,
                    name: this.DrakPicking.value[i].name
                })
            }
            if (!this.showAll) { // 原文件内容没有引用
                this.ParameterData.sendMailInfo.htmlContent =
                    this.ParameterData.sendMailInfo.htmlContent + this.OriginalMailContent
            }
            this.ParameterData.action = 'send'
            this.ParameterData.sendType = this.sendType
            if (this.sendType == 'reply') {
                this.ParameterData.originMid = this.routeObj.mId
            } else if (this.sendType == 'repost') {
                this.ParameterData.originMid = this.routeObj.mId
            }
            if (
                this.subordinateCtid != this.company.ctId &&
                this.subordinateCtid != 0
            ) {
                this.ParameterData.ctid = this.subordinateCtid
            } else {
                delete this.ParameterData.ctid
            }
            if (this.sourceMid != '') {
                this.ParameterData.sourceMid = this.sourceMid
            }
        },
        timingChange(type, deliverDate) { // 定时发送
            this.$refs.OrdinarySend.timingModeSeend()
        },
        delayedChange(type, deliverDate) {
            this.$refs.OrdinarySend.delayModeSeend()
        },
        async   senndAction(type) {
            this.ParameterAcquisition()
            let message = this.RequiredFieldValidator()
            if (message != '') {
                this.$message.error(message)
                return false
            }
            let blg = true
            // 智能检测并提示添加附件（如主题或正文提到附件）
            if (this.SettingInformationData.IntelligentDetectionAndPromptAdd == '1' || this.SettingInformationData.PopUpMailCheckItem == '1') {
                blg = await this.PromptShow()
            }
            if (!blg) { return }
            let tt = await this.recipientCheckPost()
            if (tt == 2) {
                return
            } else {
                this.showPrompt = tt
            }
            switch (type) {
                case 'ordinary': // 发送
                    this.ordinarySeendTips('')
                    break
                case 'immediately':// 立即发送
                    this.$refs.OrdinarySend.SendImmediately(this.ParameterData)
                    break
                case 'timing':// 定时发送
                    this.$refs.DateSelection.isDialog('open', 0, this.ParameterData, this.$route.params.id,
                        false)
                    break
                case 'delayed':// 延时发送
                    this.$refs.DateSelection.isDialog('open', 1, this.ParameterData, this.$route.params.id,
                        false)
                    break
                case 'ordinaryOneToOne':// 一对一发送
                    this.ordinarySeendTips('onetoone')
                    break
                case 'showOneToOneDialogNow':// 一对一立即发送
                    this.showOneToOneDialog('showOneToOneDialogNow', 'showOneToOneDialog')
                    break
                case 'timingShowOneToOneDialog':// 一对一定时发送
                    this.showOneToOneDialog('showOneToOneDialog', 'delayed')
                    break
            }
        },
        // 显示一对一发送页面
        async   showOneToOneDialog(actionName, type) {
            this.GetListData() // 获取一对一显示列表数据
            if (type == 'delayed') { // 定时发送
                this.$refs.DateSelection.isDialog('open', 0, this.ParameterData, this.$route.params.id,
                    true)
            } else {
                // 显示一对一发送页面
                this.$refs.DialogOneToOne.isDialogs(
                    'open',
                    this.replyTo,
                    this.ParameterList,
                    this.ParameterData,
                    this.$route.params.id,
                    actionName
                )
            }
        },
        // 保存草稿箱
        SaveDraft() {
            this.ParameterAcquisition()
            let message = this.RequiredFieldValidator()
            if (message != '') {
                this.$message.error(message)
                return
            }
            // this.ParameterData.sendMailInfo.htmlContent = this.ParameterData.sendMailInfo.htmlContent
            //  +                this.OriginalMailContent
            this.Timeoutblg = false
            this.ParameterData.action = 'save'
            this.ParameterData.type = 0 // 一对多
            this.ParameterData.realTime = true
            this.ParameterData.sendType = this.sendType
            if (this.sendType == 'reply') {
                this.ParameterData.originMid = this.routeObj.mId
            } else if (this.sendType == 'repost') {
                this.ParameterData.originMid = this.routeObj.mId
            }

            if (this.sourceMid != '') {
                this.ParameterData.sourceMid = this.sourceMid
            }
            if (
                this.subordinateCtid != this.company.ctId &&
                this.subordinateCtid != 0
            ) {
                this.ParameterData.ctid = this.subordinateCtid
            } else {
                delete this.ParameterData.ctid
            }
            this.$http.post(
                this.Global.baseURL + this.Global.api.Mail.mailssavePost,
                this.ParameterData
            ).then(
                function (res) {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.loading2 = false
                        this.$message.success(this.$t('mxpcweb.mail.1528977549078'))// 保存草稿箱成功！
                        this.setingMsgAndcomment(res.body.data.taskId, false) // 添加批注和提醒
                        ep.emit('closeMailTab', this.$route.params.id)
                    } else {
                        this.Timeoutblg = true
                        this.$message.error(this.msg(res.body))
                    }
                },
                function (res) {
                    this.$message.error(this.msg(res.body))
                }
            )
        },
        // 邮件编辑参数回写
        ParameterBackWrite(data) {
            if (isObject(data)) {
                if (data.sendMailInfo.messageId) {
                    this.originMsgId = data.sendMailInfo.messageId
                }
                this.SettingInformationData = data.SettingInformationData
                this.Tips = this.SettingInformationData.ChangeMailTemPChangSender == 1
                if (data.sendMailInfo.sendDisplayName && data.sendMailInfo.sendUser) {
                    this.sender.selectValue = data.sendMailInfo.sendDisplayName + '<' + data.sendMailInfo.sendUser +
                        '>'
                    this.selectValueback = this.sender.selectValue
                }
                // 收件人
                if (data.sendMailInfo.recipients != undefined) {
                    this.recipientsPicking.value = data.sendMailInfo.recipients
                }
                if (data.sendMailInfo.cc != undefined) {
                    this.ccPicking.value = data.sendMailInfo.cc
                    if (data.sendMailInfo.cc.length <= 0) {
                        this.isCCMail = false // 抄送开关
                    }
                } else {
                    this.isCCMail = false // 抄送开关
                }
                this.subject = data.sendMailInfo.subject /// /主题
                this.sender.grade = false // 等级
                this.OriginalMailContent = data.sendMailInfo.htmlContent == undefined ? '' : data.sendMailInfo.htmlContent
                this.templateHtmlContent = data.sendMailInfo.templateHtmlContent == undefined ? '' : data.sendMailInfo.templateHtmlContent
                this.OriginalMailContentback = this.OriginalMailContent

                this.selectTags =
                    data.sendMailInfo.tags == undefined ? [] : data.sendMailInfo.tags
                if (data.sendMailInfo.attachmentList == undefined) {
                    this.fileList = []
                } else if (!_.isEmpty(data.sendMailInfo.attachmentList[0])) { // 目前返回为kb
                    for (let index = 0; index < data.sendMailInfo.attachmentList.length; index++) {
                        const element = data.sendMailInfo.attachmentList[index]
                        if (element.url) {
                            element.url = AddressCharacterJudgment(element.url)
                        }
                    }
                    this.fileList = data.sendMailInfo.attachmentList
                }
                // 千里眼
                this.sender.isClairvoyant = this.SettingInformationData.enableTrack == 1
                // 请求回执开关
                this.sender.isReceipt = this.SettingInformationData.reqReceipt == 1

                if (this.selectTags.length > 0) {
                    this.GetTagsItem(this.selectTags)
                }
                if (data.JurisdictionData) {
                    if (data.JurisdictionData.otLimitMailSize == 0) {
                        this.sizeAttachMx = data.JurisdictionData.otLimitMailSizeValue
                    }
                    this.prohibitIput = data.JurisdictionData.otProhibitInputAddr == 0
                    this.otBeforeLable = data.JurisdictionData.otBeforeLable == 0
                } else {
                    this.sizeAttachMx = 0
                    this.prohibitIput = false
                    this.otBeforeLable = false
                }
                if (this.routeObj.type == 'A') {
                    let size = parseInt(this.routeObj.size / 1024)
                    this.fileList.push({ name: this.routeObj.subject, url: this.routeObj.rawData, size: size })
                }
                let htmlUE = this.templateHtmlContent // 模板写入编辑器
                if (this.showAll) {
                    htmlUE = this.templateHtmlContent + this.OriginalMailContent // 模板写入编辑器
                }
                htmlUE += '<div><br></div><div><br></div>'
                this.myUE.setContent(htmlUE, false)
            }
        },
        // 缓存回写
        cacheBackWrite(data) {
            if (isObject(data)) {
                this.cachParameter = data
                // 设置项
                this.SettingInformationData = data.SettingInformationData
                // 发件人
                if (data.sendMailInfo.sendDisplayName && data.sendMailInfo.sendUser) {
                    this.sender.selectValue = data.sendMailInfo.sendDisplayName + '<' + data.sendMailInfo.sendUser +
                        '>'
                    this.selectValueback = this.sender.selectValue
                }
                // 收件人
                if (data.sendMailInfo.recipients != undefined) {
                    this.recipientsPicking.value = data.sendMailInfo.recipients
                }
                // 抄送人
                if (data.sendMailInfo.cc != undefined) {
                    this.ccPicking.value = data.sendMailInfo.cc
                    if (data.sendMailInfo.cc.length <= 0) {
                        this.isCCMail = false // 抄送开关
                    }
                } else {
                    this.isCCMail = false // 抄送开关
                }
                // 暗送开关
                if (data.sendMailInfo.bcc != undefined) {
                    this.DrakPicking.value = data.sendMailInfo.bcc
                    if (data.sendMailInfo.bcc.length <= 0) {
                        this.isDrakMail = false // 暗送开关
                    }
                } else {
                    this.isDrakMail = false // 暗送开关
                }
                this.subject = data.sendMailInfo.subject == undefined ? '' : data.sendMailInfo.subject /// /主题
                ep.emit('editMailTabTitle', { title: this.subject == '' ? this.$t('mxpcweb.mail.1530150376380') : this.subject, name: '' })// "无标题")
                this.sender.grade = data.sendMailInfo.grade // 等级
                this.selectTags =
                    data.sendMailInfo.tags == undefined ? [] : data.sendMailInfo.tags
                if (data.sendMailInfo.attachmentList == undefined) {
                    this.fileList = []
                } else if (!_.isEmpty(data.sendMailInfo.attachmentList[0])) { // 目前返回为kb
                    this.fileList = data.sendMailInfo.attachmentList
                }
                // 千里眼
                this.sender.isClairvoyant = this.SettingInformationData.isClairvoyant == 1
                // 请求回执开关
                this.sender.isReceipt = this.SettingInformationData.isReceipt == 1

                if (this.selectTags.length > 0) {
                    this.GetTagsItem(this.selectTags)
                }
                if (data.JurisdictionData) {
                    if (data.JurisdictionData.otLimitMailSize == 0) {
                        this.sizeAttachMx = data.JurisdictionData.otLimitMailSizeValue
                    }
                    this.prohibitIput = data.JurisdictionData.otProhibitInputAddr == 0
                    this.otBeforeLable = data.JurisdictionData.otBeforeLable == 0
                } else {
                    this.sizeAttachMx = 0
                    this.prohibitIput = false
                    this.otBeforeLable = false
                }
                // 批注
                this.comments = data.comments == undefined ? [] : data.comments
                // 跟踪
                this.notices = data.notices == undefined ? [] : data.notices
                let htmlUE = data.sendMailInfo.innerHtml // templateHtmlContent + data.sendMailInfo.htmlContent
                this.myUE.setContent(htmlUE, false)

                this.originMid = this.routeObj.mId
            }
        },
        GetTagsItem(selectTags) {
            for (let i = 0; i < selectTags.length; i++) {
                for (let j = 0; j < this.dynamicTags.length; j++) {
                    if (selectTags[i] == this.dynamicTags[j].labelId) {
                        this.selectedTagsItem.push({ labelName: this.dynamicTags[j].labelName, labelId: this.dynamicTags[j].labelId })
                        break
                    }
                }
            }
        },
        // 写邮件写入模板
        MailWrite(type, templateid) {
            let data = {
                type: type,
                templateId: templateid
            }
            if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                data.ctid = this.subordinateCtid
                data.targetCtid = this.subordinateCtid
            } else {
                delete data.ctid
                data.targetCtid = this.company.ctId
            }
            this.loadingtext = '正在加载...'
            this.loading2 = true
            this.$http.get(this.Global.baseURL + this.Global.api.Mail.MailWrite, {
                params: data
            }).then(function (res) {
                this.loading2 = false
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.isCCMail = false
                    let data = res.body.data
                    this.ParameterBackWrite(data)
                    // this.cachParameterAppend(data)
                } else {
                    this.$message.error(this.msg(res.body))
                }
            },
                function (res) {
                    this.$message.error(this.msg(res.body))
                }
            )
        },
        cachParameterAppend(data) {
            this.cachParameter = data
            this.OriginalMailContent = data.sendMailInfo.htmlContent == undefined ? '' : data.sendMailInfo.htmlContent
            this.templateHtmlContent = data.sendMailInfo.templateHtmlContent == undefined ? '' : data.sendMailInfo.templateHtmlContent
            // let htmlUE = this.templateHtmlContent // 模板写入编辑器
            // if (data.showAll) {
            //     htmlUE = this.templateHtmlContent + this.OriginalMailContent // 模板写入编辑器
            // }
            // this.cachParameter.sendMailInfo.innerHtml = htmlUE
            // this.autoSaveMail('mxMailDB', 1, 'Mail', { unionId: this.$route.params.id, cachParameter: this.cachParameter })
        },
        // 草稿回写
        ManuscriptBackWriting(mId, difference) {
            let _this = this
            if (difference == 'D') {
                this.sourceMid = mId // 草稿mid
            } else {
                this.sourceMid = ''
            }
            let dataParams = {
                mId: mId,
                type: 'details'
            }
            if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                dataParams.ctid = this.subordinateCtid
            } else {
                delete dataParams.ctid
            }

            var p1 = new Promise((resolve, reject) => {
                this.$http.get(this.Global.baseURL + this.Global.api.Mail.getMailCurrent, {
                    params: dataParams
                }).then(function (res) {
                    if (res.body.code.toString() === this.Global.RES_OK && res.body.data) {
                        resolve(res.body)
                    }
                }, function (res) {
                    this.$message.error(this.msg(res.body))
                })
            })
            let Params = {}
            if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                Params.ctid = this.subordinateCtid
            } else {
                delete Params.ctid
            }

            var p2 = new Promise((resolve, reject) => {
                this.$http.get(this.Global.baseURL + this.Global.api.Mail.getSettingInformation, {
                    params: Params
                }).then(function (res) {
                    if (res.body.code.toString() === this.Global.RES_OK && res.body.data) {
                        resolve(res.body.data)
                    }
                }, function (res) {
                    this.$message.error(this.msg(res.body))
                })
            })
            this.loadingtext = '正在加载...'
            this.loading2 = true
            Promise.all([p1, p2]).then(function (results) {
                _this.loading2 = false
                let data = results[0].data
                if (data.deliveryStatus == 1 && data.folder == 3) { // 该邮件已经发送成功
                    ep.emit('closeMailTab', _this.$route.params.id)
                    _this.$message.success(_this.$t('mxpcweb.mail.1537498623545'))
                    ep.emit('openMailDetail', {
                        mId: mId,
                        boxId: 0
                    })
                    return
                } else if (data.deliveryStatus == 0) { // 部分成功
                    let singleMailDeliveryStatuses = results[0].deliveryList.singleMailDeliveryStatuses
                    let recipientsArry = data.recipients
                    for (let index = 0; index < singleMailDeliveryStatuses.length; index++) {
                        const element = singleMailDeliveryStatuses[index]
                        if (element.code == '250') {
                            for (let index2 = 0; index2 < recipientsArry.length; index2++) {
                                const element2 = recipientsArry[index2]
                                if (element.targetAddresses == element2.address) {
                                    recipientsArry.splice(index2, 1)
                                    break
                                }
                            }
                        }
                    }
                    data.recipients = recipientsArry
                }
                if (isObject(data)) {
                    if (data.fromEx.length > 0) {
                        let fromExPersonal = data.fromEx[0].personal == undefined ? _this.substringName(
                            data
                                .fromEx[0].address) : data.fromEx[0].personal
                        _this.sender.selectValue = fromExPersonal + '<' + data.fromEx[0].address +
                            '>'
                        _this.selectValueback = fromExPersonal + '<' + data.fromEx[0].address +
                            '>'
                    }

                    for (let i = 0; i < data.recipients.length; i++) {
                        _this.recipientsPicking.value.push({
                            mail: data.recipients[i].address,
                            name: data.recipients[i].personal == undefined ? _this.substringName(
                                data.recipients[i].address) : data.recipients[i]
                                    .personal
                        })
                    }
                    if (data.cc != undefined) {
                        for (let i = 0; i < data.cc.length; i++) {
                            _this.ccPicking.value.push({
                                mail: data.cc[i].address,
                                name: data.cc[i].personal == undefined ? _this.substringName(
                                    data.cc[i].address) : data.cc[i].personal
                            })
                        }
                    } else {
                        _this.isCCMail = false
                    }
                    // if (data.comments) {
                    //     _this.comments = data.comments == undefined ? [] : data.comments
                    // }
                    _this.subject = data.subject // 主题
                    _this.sender.grade = data.priority == 1 // 等级
                    _this.templateHtmlContent = data.htmlContent
                    if (data.inReplyTo) {
                        _this.originMsgId = data.inReplyTo
                    }
                    if (data.originMid) {
                        console.log('originMid' + data.originMid)
                        _this.sendType = 'reply'
                        _this.originMid = data.originMid
                    }
                    let htmlUE = _this.templateHtmlContent // 模板写入编辑器
                    htmlUE += '<div><br></div><div><br></div>'
                    _this.selectTags = data.tags
                    // 千里眼
                    _this.sender.isClairvoyant = data.enableTrack
                    // 请求回执开关
                    _this.sender.isReceipt = data.reqReceipt
                    if (data.attachmentList != undefined) {
                        if (!_.isEmpty(data.attachmentList[0])) {
                            _this.fileList = data.attachmentList
                        }
                    }
                    _this.myUE.setContent(htmlUE, false)
                    // this.myUE.focus()
                }
                _this.SettingInformationData = results[1]
                // _this.cachParameterAppend({ sendMailInfo: data, SettingInformationData: results[1] })
            })
        },
        Picking_valueChange() {
            /**
                                 * 更改缓存
                                 */
            // this.cachParameter.sendMailInfo.recipients = this.$refs.recipientsPicking_value.getData()
            // if (this.isCCMail) {
            //     this.cachParameter.sendMailInfo.cc = this.$refs.ccPicking_value.getData()
            // }
            // if (this.isDrakMail) {
            //     this.cachParameter.sendMailInfo.bcc = this.$refs.DrakPicking_value.getData()
            // }
            // this.autoSaveMail('mxMailDB', 1, 'Mail', { unionId: this.$route.params.id, cachParameter: this.cachParameter })
        },
        // 回复邮件
        ReplyMail(mId, type, templateid) {
            this.loadingtext = '正在加载...'
            this.loading2 = true
            this.originMid = mId
            this.getShowOrigin()
            let data = {
                mId: mId,
                type: type,
                templateId: templateid
            }
            if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                data.ctid = this.subordinateCtid
                data.targetCtid = this.subordinateCtid
            } else {
                delete data.ctid
                data.targetCtid = this.company.ctId
            }
            this.$http.get(this.Global.baseURL + this.Global.api.Mail.MailEditor, {
                params: data
            }).then(function (res) {
                this.loading2 = false
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.ParameterBackWrite(res.body.data)
                    // this.cachParameterAppend(res.body.data)
                } else {
                    this.$message.error(this.msg(res.body))
                }
            },
                function (res) {
                    this.$message.error(res)
                }
            )
        },
        // 添加附件
        CommandAttach(command) {
            this.fileListChange = true
            if (command.actionName == 'AddLocal') { // 添加本地附件
                this.$refs.fileUpload.selectFile()
            } else { // 添加在线文档
                this.$refs.DialogDoc.open()
            }
        },
        /* 选择在线文档 */
        async checkedOnlineDoc(fileArr) {
            let url = this.Global.baseURL + this.Global.api.v2.folders_moveFiles
            let data = { files: fileArr }
            let res = await this.$http.post(url, data)
            if (res.body.code.toString() == this.Global.RES_OK) {
                let fileArry = res.body.data
                if (isArray(fileArry)) {
                    // let BaseUrl = this.Global.downloadBaseUrl
                    for (let index = 0; index < fileArry.length; index++) {
                        const fileobj = {}
                        const element = fileArry[index]
                        fileobj.url = element.attachmnentId
                        fileobj.status = 1
                        fileobj.name = element.fileName
                        fileobj.size = (element.fileSize / 1024).toFixed(2)
                        this.fileList.push(fileobj)
                    }
                }
            } else {
                this.$message.error(this.msg(res.body))
            }
        },

        async   GetRightsCheck(data) {
            let blg = false
            if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                data.targetCtid = this.subordinateCtid
            } else {
                data.targetCtid = this.company.ctId
            }
            let res = await this.$http.get(this.Global.baseURL + this.Global.api.Mail.GetRightsCheck, {
                params: data
            })
            if (res.body.code.toString() == this.Global.RES_OK) {
                blg = true
            } else {
                this.$message.error(this.msg(res.body))
                blg = false
            }
            return blg
        },
        // 暗送
        async   removeDDMail() {
            let blg = await this.GetRightsCheck({ 'optCode': 'otMailDelivery', 'moduleCode': 'EM001' })
            if (!blg) {
                this.isDrakMail = false
                this.DrakPicking.value = []
                // this.$message.error("无权限！");
                return
            }
            this.isDrakMail = !this.isDrakMail
            if (this.isDrakMail == false) {
                this.DrakPicking.value = []
            }
            this.ueSetHeight()
        },
        // 抄送
        removeCCMail() {
            this.isCCMail = !this.isCCMail
            if (this.isCCMail == false) {
                this.ccPicking.value = []
            }
            this.ueSetHeight()
        },
        // 千里眼
        ThousandMiles() {
            this.sender.isClairvoyant = this.sender.isClairvoyant != true
            /**
                    * 更改缓存
                    */
            // this.cachParameter.sendMailInfo.isClairvoyant = this.sender.isClairvoyant
            // this.autoSaveMail('mxMailDB', 1, 'Mail', { unionId: this.$route.params.id, cachParameter: this.cachParameter })
        },
        // 请求回执
        RequestReceipt() {
            this.sender.isReceipt = this.sender.isReceipt != true

            /**
                   * 更改缓存
                   */
            // this.cachParameter.sendMailInfo.isReceipt = this.sender.isReceipt
            // this.autoSaveMail('mxMailDB', 1, 'Mail', { unionId: this.$route.params.id, cachParameter: this.cachParameter })
        },
        // 优先级
        gradeChange(e) {
            /**
                     * 更改缓存
                     */
            // this.cachParameter.sendMailInfo.grade = e
            // this.autoSaveMail('mxMailDB', 1, 'Mail', { unionId: this.$route.params.id, cachParameter: this.cachParameter })
        },

        // 获取陌生人
        getStranger(InitialData, LateData) {
            let arrys = []
            InitialData.forEach((element, index) => {
                if (element.custId == undefined || element.custId == '') {
                    arrys.push(element)
                }
            })
            LateData.forEach((element) => {
                arrys.push(element)
            })
            return arrys
        },
        updateContact(type, list) { // 更新收件人/抄送/暗送
            if (type == 1) {
                this.recipientsPicking.value = this.getStranger(this.$refs.recipientsPicking_value.getData(), list)
            } else if (type == 2) {
                this.ccPicking.value = this.getStranger(this.$refs.ccPicking_value.getData(), list)
            } else if (type == 3) {
                this.DrakPicking.value = this.getStranger(this.$refs.DrakPicking_value.getData(), list)
            }
        },
        setingMsgAndcomment(taskId, flag) {
            if (this.showPrompt == 1) {
                this.$message(this.$t('mxpcweb.mail.1528976644431'))// "你有给未建档客户发送邮件！"
            }
            // 批注
            if (this.comments.length > 0) {
                this.comments.forEach((element, index) => {
                    if (!_.isEmpty(element)) {
                        element.identFieldValue = taskId
                        if (element.targets == '') {
                            element.targets = this.company.ctId
                        }
                        this.$http.post(this.Global.baseURL + this.Global.api.v2.billComment_add, element)
                            .then(
                                function (res) {
                                    if (res.body.code.toString() === this.Global.RES_OK) {
                                    } else {
                                        console.log(this.msg(res.body))
                                    }
                                },
                                function (res) {
                                    console.log(this.msg(res.body))
                                })
                    }
                })
            }
            // 提醒
            if (this.notices.length > 0) {
                this.notices.forEach((element, index) => {
                    if (!_.isEmpty(element)) {
                        element.billId = taskId
                        // 未收到提醒，保存
                        if (element.msgSubType == '6' && !flag) {
                            return
                        }
                        this.$http.post(this.Global.baseURL + this.Global.api.SystemSet.scheduleremind.messengerPost,
                            element)
                            .then(function (res) {
                                if (res.body.code.toString() === this.Global.RES_OK) {
                                    console.log(this.$t('mxpcweb.mail.1528976776544'))// 添加提醒成功
                                } else {
                                    console.log(this.msg(res.body))
                                }
                            }, function (res) {
                                console.log(this.msg(res.body))
                            })
                    }
                })
            }
        },
        // 提醒删除
        noticesDel(index) {
            this.notices.splice(index, 1)
            /**
                     * 更改缓存
                     */
            // this.cachParameter.notices = this.notices
            // this.autoSaveMail('mxMailDB', 1, 'Mail', { unionId: this.$route.params.id, cachParameter: this.cachParameter })
        },
        // 批注删除
        commentsDel(index) {
            this.comments.splice(index, 1)
            /**
                     * 更改缓存
                     */
            // this.cachParameter.comments = this.comments
            // this.autoSaveMail('mxMailDB', 1, 'Mail', { unionId: this.$route.params.id, cachParameter: this.cachParameter })
        },
        // 保存跟踪提醒
        SaveMsg(msgObj) {
            this.msgObj = msgObj
            msgObj.name = this.personalInfo.realName
            var myDate = new Date().getTime()
            msgObj.createDate = this.$m_unifiedTime(myDate)
            this.notices.push(msgObj)
            /**
                        * 更改缓存
                        */
            // this.cachParameter.notices = this.notices
            // this.autoSaveMail('mxMailDB', 1, 'Mail', { unionId: this.$route.params.id, cachParameter: this.cachParameter })
        },
        // 保存批注值
        SaveComment(commentObj) {
            this.commentdata = commentObj
            let ttArry = commentObj.targets.split(',')
            for (let i = 0; i < ttArry.length; i++) {
                if (ttArry[i] == this.company.ctId) {
                    commentObj.targetsName.push(this.personalInfo.realName)
                }
            }
            var myDate = new Date().getTime()
            commentObj.createDate = this.$m_unifiedTime(myDate)
            this.comments.push(commentObj)

            /**
                    * 更改缓存
                    */
            // this.cachParameter.comments = this.comments
            // this.autoSaveMail('mxMailDB', 1, 'Mail', { unionId: this.$route.params.id, cachParameter: this.cachParameter })
        },
        // 编辑器加载完成时
        editorReady(instance) {
            this.myUE = instance
            this.ueflag++
            // 首次打开时：
            if (this.ueflag === 1) {
                // this.first = true;
                this.ueSetHeight() // 动态计算设置编辑器高
                // instance.setContent(' test set content ');//设置初始值放进来，不设置则为 config 里的 initialContent 值
                // this.myUE.setContent(' test set content ')
                // this.UEonloads(instance)
                // 内容变化时：
                instance.addListener('contentChange', () => {
                    if (!this.editorIsFullScreen) {
                        this.ueSetHeight() // 动态计算设置编辑器高
                    }
                    this.ueContentBak = instance.getContent() // 实时保存动作内容
                    /**
                     * 更改缓存
                     */
                    // if (this.cachParameter.sendMailInfo) {
                    //     this.cachParameter.sendMailInfo.innerHtml = instance.getContent()
                    //     // this.autoSaveMail('mxMailDB', 1, 'Mail', { unionId: this.$route.params.id, cachParameter: this.cachParameter })
                    // }
                })
                instance.addListener('fullscreenchanged', (e, isFullScreen) => {
                    this.editorIsFullScreen = isFullScreen
                })
                if (!this.cachRead) {
                    this.MailMode(this.routeObj)
                }
            } else {
                instance.setContent(this.ueContentBak) // 渲染进值
            }
        },
        // 动态计算设置编辑器高
        ueSetHeight(num) {
            if (!num) {
                num = 0
            }
            this.$nextTick(() => {
                try {
                    let ueToTop = this.$el.querySelector('.ueditorWrap').offsetTop + 130 - num // 加上头部
                    let ueHeight = document.body.clientHeight - ueToTop
                    // console.log(ueHeight)
                    if (ueHeight < 350) {
                        this.config.initialFrameHeight = 350
                    } else {
                        this.config.initialFrameHeight = ueHeight
                        //     this.myUE.destroy()
                    }
                } catch (e) {
                    console.log(' this.ueSetHeight() error ')
                }
            })
        },
        // 原邮件写入编辑器
        originShowClick() {
            this.showAll = true
            // this.cachParameter.showAll = true
            let htmlUE = this.$refs.ueditor.getContent() + this.OriginalMailContent // 模板写入编辑器
            htmlUE += '<div><br></div><div><br></div>'
            this.myUE.setContent(htmlUE, true)
            // this.myUE.focus()
        }, // 编辑器加载完成后
        // UEonloads(instance) {
        //     if (this.showAll) {
        //         instance.setContent(this.templateHtmlContent + this.OriginalMailContent) // 模板写入编辑器
        //     } else {
        //         instance.setContent(this.templateHtmlContent)
        //     }
        // },
        // 发送前提示
        PromptShow() {
            return new Promise((resolve, reject) => {
                let msg = ''
                let showArry = []
                const h = this.$createElement
                let num = 1
                // 附件没有添加提示
                if (this.SettingInformationData.IntelligentDetectionAndPromptAdd == '1' && this.attachmentList.length == 0) {
                    // 附件
                    if (this.subject.indexOf(this.$t('mxpcweb.mail.1528709296344')) != -1) { // 包含附件
                        msg = this.$t('mxpcweb.mail.1528977524157')// "1、主题";
                    }
                    if (this.$refs.ueditor.getContent().indexOf(this.$t('mxpcweb.mail.1528709296344')) != -1) { // 包含附件
                        msg = msg == '' ? this.$t('mxpcweb.mail.1528977480257') : this.$t('mxpcweb.mail.1528977487849')// "1、正文" : "1、主题/正文";
                    }
                }
                if (msg != '') {
                    msg = msg + this.$t('mxpcweb.mail.1528977430137')// "包含附件，目前没有添加附件。";
                    showArry.push(h('div', null, msg))
                    num++
                }
                // 发送前弹出提示
                if (this.SettingInformationData.PopUpMailCheckItem == '1') {
                    this.SettingInformationData.sendCheckList.forEach((element, index) => {
                        num = num + index
                        showArry.push(h('div', null, num + '、' + element.checkName))
                    })
                }
                if (showArry.length > 0) {
                    this.$msgbox({
                        title: this.$t('mxpcweb.mail.1528969862511'), // '提示',
                        message: h('p', null, showArry),
                        showCancelButton: true,
                        confirmButtonText: this.$t('mxpcweb.mail.1528942374762'), // "确定",
                        cancelButtonText: this.$t('mxpcweb.mail.1528942364802')// "取消",
                    }).then(action => {
                        resolve(true)
                    }).catch(() => {
                        resolve(false)
                    })
                } else {
                    resolve(true)
                }
            })
        },
        // 邮件接收者检查接口
        recipientCheckPost() {
            return new Promise((resolve, reject) => {
                let _this = this
                // let tt = 0
                let ParameterData = {
                    'to': _this.toArry,
                    'cc': _this.ccArry,
                    'bcc': _this.bccArry
                }

                if (_this.subordinateCtid != _this.company.ctId && _this.subordinateCtid != 0) {
                    ParameterData.ctid = _this.subordinateCtid
                }
                _this.$http.post(_this.Global.baseURL + _this.Global.api.Mail.recipientCheckPost, ParameterData).then(function (res) {
                    if (res.body.code.toString() === _this.Global.RES_OK) {
                        if (isObject(res.body.data)) {
                            if ((res.body.data.to && res.body.data.to.length > 0) || (res.body.data.cc && res.body.data.cc.length > 0) || (res.body.data.bcc && res.body.data.bcc.length > 0)) {
                                resolve(1)
                            } else {
                                resolve(0)
                            }
                        }
                    } else {
                        _this.$message.error(this.msg(res.body))
                        resolve(2)
                    }
                }, function (res) {
                    resolve(2)
                    _this.$message.error(this.msg(res.body))
                })
            })
        },
        async  ordinarySeendTips(type) {
            if (this.SettingInformationData.AutomaticallyDelay == '1') { // 发送
                // '邮件将在' + this.SettingInformationData.Timevalue + '分钟之后发送！'
                this.$confirm(this.$t('mxpcweb.mail.1528977429733', { a: this.SettingInformationData.Timevalue }), this.$t('mxpcweb.mail.1528969862511'), {
                    confirmButtonText: this.$t('mxpcweb.mail.1528942374762'), // "确定",
                    cancelButtonText: this.$t('mxpcweb.mail.1528942364802'), // "取消",
                    type: 'warning'
                }).then(() => {
                    if (type == 'onetoone') {
                        this.showOneToOneDialog('showOneToOneDialog', 'showOneToOneDialog')
                    } else {
                        this.$refs.OrdinarySend.OrdinarySend()
                    }
                }).catch(() => {

                })
            } else { // 立即
                if (type == 'onetoone') {
                    this.showOneToOneDialog('showOneToOneDialogNow', 'showOneToOneDialog')
                } else {
                    this.$refs.OrdinarySend.SendImmediately(this.ParameterData)
                }
            }
        },
        // 异常处理
        exceptionHandling() {
            this.loading2 = false
            // this.setingMsgAndcomment(this.taskId, true) // 添加批注和提醒
            // ep.emit('closeMailTab', this.urlstr)
            // 发送异常，请至发件箱查看发送状态！
            // 已发送，请至发件箱查看发送状态！
            this.$alert(this.$t('mxpcweb.mail.1534748083746'), this.$t('mxpcweb.mail.1528969862511'), {
                confirmButtonText: this.$t('mxpcweb.mail.1528942374762'), // "确定",
                callback: action => {
                    this.setingMsgAndcomment(this.taskId, true) // 添加批注和提醒
                    ep.emit('closeMailTab', this.urlstr)
                }
            })
        },

        ...mapMutations('mail', {
            set_refurbishListBool: 'SET_REFURBISHLISTBOOL'

        }),
        // 批注色彩
        setCommentsColor(flag) {
            return commentsColor(flag)
        },
        // 是否显示原邮件
        getShowOrigin() {
            let _this = this
            let params = {
                itemCode: 'text26'
            }
            if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                params.ctid = this.subordinateCtid
            } else {
                delete params.ctid
            }
            _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.mailset.setindex.GetOptions, {
                params: params
            })
                .then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                        let data = res.body.data
                        if (data.length <= 0) {
                            this.showAll = false
                            // this.cachParameter.showAll = false
                        } else if (data[0].value == '1') {
                            this.showAll = true
                            // this.cachParameter.showAll = true
                        } else {
                            this.showAll = false
                            // this.cachParameter.showAll = false
                        }
                    }
                },
                    function (res) {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    }
                )
        },
        subjectUpdata2() {
            if (this.subjectChange) {
                /**
                                     * 更改缓存
                                     */
                // this.cachParameter.sendMailInfo.subject = this.subject == '' ? this.$t('mxpcweb.mail.1530150376380') : this.subject// "无标题"
                // this.autoSaveMail('mxMailDB', 1, 'Mail', { unionId: this.$route.params.id, cachParameter: this.cachParameter })
            }
            this.subjectChange = false
        },
        // 主题更改
        subjectUpdata() {
            let str = this.subject == '' ? this.$t('mxpcweb.mail.1530150376380') : this.subject// "无标题"
            this.subjectChange = true
            ep.emit('editMailTabTitle', { title: str, name: '' })
        },
        // 获取页面数据
        getPersonalData() {
            let data = {
                type: 'list',
                pageN: 1,
                pageSize: 100
            }
            if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                data.ctid = this.subordinateCtid
            } else {
                delete data.ctid
            }
            this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.mailset.mailaccount.accounts, {
                params: data
            })
                .then(function (res) {
                    if (res.body.code.toString() == this.Global.RES_OK && isArray(res.body.data)) {
                        // let dataR = res.body.data
                        // let list = []
                        // for (let i = 0; i < dataR.length; i++) {
                        //     list.push({
                        //         sendname: dataR[i].sendDisplayName,
                        //         senduser: dataR[i].mailAccount,
                        //         replyAddress: dataR[i].replyAddress
                        //     })
                        // }
                        this.sender.options = isArray(res.body.data) ? res.body.data : []
                    }
                },
                    function (res) {
                        this.$message.error(this.msg(res.body))
                    }
                )
        },
        // 切换发件人
        checkSelectValue(selectValue) {
            if (this.flg) {
                this.flg = false
            } else {
                if (this.Tips) { // 不提示
                    this.checkSelect(selectValue)
                    return
                }
                this.$confirm(this.$t('mxpcweb.mail.1528977838969'), this.$t('mxpcweb.mail.1528969862511'), {// 邮件输入内容会被清空，你确定要切换发件人吗？
                    confirmButtonText: this.$t('mxpcweb.mail.1528942374762'), // "确定",
                    cancelButtonText: this.$t('mxpcweb.mail.1528942364802'), // "取消",
                    type: 'warning'
                }).then(() => {
                    this.checkSelect(selectValue)
                }).catch(() => {
                    this.sender.selectValue = this.selectValueback
                    this.flg = true
                    this.$message({
                        type: 'info',
                        message: this.$t('mxpcweb.mail.1528977805856')// "已取消切换"
                    })
                })
            }
        },
        checkSelect(selectValue) {
            let TempStr = selectValue.split('<')
            this.selectValueback = selectValue
            /**
             * 更改缓存
             */
            // this.cachParameter.sendMailInfo.sendDisplayName = TempStr[0]
            // this.cachParameter.sendMailInfo.sendUser = TempStr[1].substring(0, TempStr[1].length - 1)
            // this.autoSaveMail('mxMailDB', 1, 'Mail', { unionId: this.$route.params.id, cachParameter: this.cachParameter })

            this.OriginalMailContent = this.OriginalMailContentback
            let data = {
                AcquisitionType: this.sendType,
                mailAccount: TempStr[1].substring(0, TempStr[1].length - 1)
            }
            if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                data.ctid = this.subordinateCtid
            } else {
                delete data.ctid
            }
            // 判断写邮件或者回复邮件
            this.$http.get(this.Global.baseURL + this.Global.api.Mail.MailWSwitchAccountite, {
                params: data
            }).then(function (res) {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    let data = res.body.data
                    if (isObject(data)) {
                        // 写邮件添加模板
                        if (data.sendMailInfo.attachmentList == undefined) {
                            this.fileList = []
                        } else if (!_.isEmpty(data.sendMailInfo.attachmentList[0])) {
                            this.fileList = data.sendMailInfo.attachmentList
                        }
                        this.templateHtmlContent = data.sendMailInfo.templateHtmlContent == undefined ? '' : data.sendMailInfo.templateHtmlContent
                        let htmlUE = this.templateHtmlContent // 模板写入编辑器
                        if (this.showAll) {
                            htmlUE = this.templateHtmlContent + this.OriginalMailContent // 模板写入编辑器
                        }
                        htmlUE += '<div><br></div><div><br></div>'
                        this.myUE.setContent(htmlUE, false)
                        // this.myUE.focus()
                    }
                } else {
                    this.$message.error(this.msg(res.body))
                }
            })
        },
        // 参数获取
        ParameterAcquisition() {
            let _this = this
            let data = {}
            this.toArry = []
            this.ccArry = []
            this.bccArry = []
            // 收件人
            let Recipients = []
            _this.recipientsPicking.value = this.$refs.recipientsPicking_value.getData()
            for (let i = 0; i < _this.recipientsPicking.value.length; i++) {
                this.toArry.push(_this.recipientsPicking.value[i].mail)
                Recipients.push({ name: _this.recipientsPicking.value[i].name, address: _this.recipientsPicking.value[i].mail })
                // Recipients =
                //     Recipients +
                //     _this.recipientsPicking.value[i].name +
                //     '<' +
                //     _this.recipientsPicking.value[i].mail +
                //     '>;'
            }
            // 抄送
            let cc = []
            if (this.isCCMail) {
                _this.ccPicking.value = this.$refs.ccPicking_value.getData()
                for (let i = 0; i < _this.ccPicking.value.length; i++) {
                    this.ccArry.push(_this.ccPicking.value[i].mail)
                    cc.push({
                        name: _this.ccPicking.value[i].name,
                        address: _this.ccPicking.value[i].mail
                    })
                    // cc =
                    //     cc +
                    //     _this.ccPicking.value[i].name +
                    //     '<' +
                    //     _this.ccPicking.value[i].mail +
                    //     '>;'
                }
            }
            // 暗送
            let bcc = []
            if (this.isDrakMail) {
                _this.DrakPicking.value = this.$refs.DrakPicking_value.getData()
                for (let i = 0; i < _this.DrakPicking.value.length; i++) {
                    this.bccArry.push(_this.DrakPicking.value[i].mail)
                    bcc.push({ name: _this.DrakPicking.value[i].name, address: _this.DrakPicking.value[i].mail })
                    // bcc =
                    //     bcc +
                    //     _this.DrakPicking.value[i].name +
                    //     '<' +
                    //     _this.DrakPicking.value[i].mail +
                    //     '>;'
                }
            }
            let htmlContent2 = _this.$refs.ueditor.getContent()
            // return

            // let BaseUrl = this.Global.downloadBaseUrl
            this.sizeAttach = 0
            this.attachmentList = []

            for (let i = 0; i < this.fileList.length; i++) {
                if (this.fileList[i].url == undefined) {
                    this.$message.error('原邮件rawData不存在')
                    continue
                }
                this.attachmentList.push({
                    name: this.fileList[i].name,
                    size: parseInt(this.fileList[i].size * 1024), // 显示为kb  发送为b
                    status: this.fileList[i].status,
                    url: this.fileList[i].url
                })
            }
            // 发件人
            let sendArry = _this.sender.selectValue.split('<')
            let sendUser =
                sendArry.length >= 2
                    ? sendArry[1].substring(0, sendArry[1].length - 1)
                    : ''
            this.replyTo = this.getReplyAddress(sendUser) // 获取回复地址
            data.sendMailInfo = {
                sendDisplayName: sendArry[0],
                sendUser: sendUser,
                // recipients: Recipients.length > 0 ? Recipients.substring(0, Recipients.length - 1) : '',
                // cc: cc.length > 0 ? cc.substring(0, cc.length - 1) : '',
                // bcc: bcc.length > 0 ? bcc.substring(0, bcc.length - 1) : '',
                recipients: Recipients,
                cc: cc,
                bcc: bcc,
                htmlContent: htmlContent2, // 模板+编辑器
                subject: _this.subject, // 主题
                originIp: this.Global.IP,
                priority: _this.sender.grade == true ? 1 : 3, // 等级
                tags: _this.selectTags,
                // 千里眼
                enableTrack: _this.sender.isClairvoyant,
                // 请求回执开关
                reqReceipt: _this.sender.isReceipt,
                attachmentList: this.attachmentList,

                OriginalMailContent: this.OriginalMailContent, // 原邮件内容
                OriginalMailContentback: this.OriginalMailContentback
            }
            if (this.originMid) {
                data.sendMailInfo.originMid = this.originMid
            }
            if (this.originMsgId) {
                data.originMsgId = this.originMsgId
            }
            _this.ParameterData = data
        },
        // 必填验证
        RequiredFieldValidator() {
            let blgstr = ''
            if (this.sender.selectValue == '' || this.sender.selectValue == undefined) {
                blgstr = this.$t('mxpcweb.mail.1528977340951')// "发件人不能为空";
                return blgstr
            }
            if (this.recipientsPicking.value.length <= 0) {
                blgstr = this.$t('mxpcweb.mail.1528977330536')// "收件人不能为空";
                return blgstr
            }
            if (this.subject == '' || this.subject == undefined) {
                blgstr = this.$t('mxpcweb.mail.1528977330264')// "主题不能为空";
                return blgstr
            }

            if (this.$refs.ueditor.getContent() == '' || this.$refs.ueditor.getContent() == undefined) {
                blgstr = this.$t('mxpcweb.mail.1528977330005')// "邮件内容不能为空";
                return blgstr
            }
            if (this.otBeforeLable) { // 发送前必须加标签
                if (this.selectTags.length <= 0) {
                    blgstr = this.$t('mxpcweb.mail.1528977327415')//  "发送前必须打标签";
                    return blgstr
                }
            }
            if (this.sizeAttach != 0 && this.sizeAttachMx != 0) { // 上传附件不为0并且限制大小不等于0
                let mx = this.sizeAttachMx * 1048576
                if (this.sizeAttach > mx) {
                    blgstr = this.$t('mxpcweb.mail.1529737552495', { a: this.sizeAttachMx })// 附件不能超过20M
                    return blgstr
                }
            }
            return blgstr
        },
        // 名称截取2
        substringName(adderss) {
            let str = adderss.split('@')
            return str[0]
        },
        // 输入下拉框  (没有加下属的  需要注意)
        inputChange(val) {
            if (val == '') {
                return
            }
            this.$http.get(this.Global.baseURL + this.Global.api.Mail.mailsrecipientsGet, {
                params: {
                    keywords: val
                }
            }).then(function (res) {
                if (res.body.code.toString() == this.Global.RES_OK && isObject(res.body.data)) {
                    this.restaurants = res.body.data.list
                }
            }, function (res) {
                this.$message.error(this.msg(res.body))
            })
        },
        // 获取标签值
        UpdataTagsData(dynamicTags, selectTags, selectedTagsItem) {
            this.dynamicTags = dynamicTags
            this.selectTags = selectTags
            this.selectedTagsItem = selectedTagsItem
        },
        // 获取用户标签列表
        maillabelsGet() {
            this.$http
                .get(this.Global.baseURL + this.Global.api.v2.label_get, {
                    params: {
                        searchType: 'list',
                        moduleCode: 'EM001'
                    }
                })
                .then(
                    function (res) {
                        if (res.body.code.toString() == this.Global.RES_OK && isArray(res.body.data)) {
                            this.dynamicTags = isArray(res.body.data) ? res.body.data : []
                        }
                    },
                    function (res) {
                        this.$message.error(this.msg(res.body))
                    }
                )
        },
        // 标签下拉点击
        handleCommand(command) {
            switch (command.type) {
                case 'Choice': // 选择标签
                    let blg = true
                    for (let i = 0; i < this.selectTags.length; i++) {
                        if (this.selectTags[i] == command.item.labelId) {
                            this.selectTags.splice(i, 1)
                            this.selectedTagsItem.splice(i, 1)
                            blg = false
                            break
                        }
                    }
                    if (blg) {
                        this.selectTags.push(command.item.labelId)
                        this.selectedTagsItem.push(command.item)
                    }
                    break
                case 'eliminate': // 清除标签
                    this.selectTags = []
                    this.selectedTagsItem = []
                    break
                case 'setTag': // 设置标签
                    this.$refs.DialogSetTags.DialogSetTagShow(
                        '',
                        this.selectTags,
                        'EM001', {}
                    )
                    break
                // ...
            }
            /*
                    * 更改缓存
                    */
            // this.cachParameter.sendMailInfo.tags = this.selectTags
            // this.autoSaveMail('mxMailDB', 1, 'Mail', { unionId: this.$route.params.id, cachParameter: this.cachParameter })
        }

    },
    components: {
        ueditor: UEditor,
        'dialog-mail-comment': DialogMailComment,
        'dialog-set-tags': DialogSetTags,
        'dialog-oneToOne': OneToOne,
        'input-auto': InputAuto,
        'file-upload': FileUpload,
        'dialog-mail-addmsg': MailAddMsg,
        'dialog-get-contacts': DialogGetContacts,
        'date-selection': DateSelection,
        'dialog-doc': DialogDoc,
        'ordinary-send': OrdinarySend,
        'one-to-one-transmission': OneToOneTransmission
    },
    watch: {
        checked: {
            handler(curVal, oldvalue) {
                this.showAll = true
                // this.cachParameter.showAll = true
                this.originShowClick()
                if (curVal) {
                    let data = {
                        'mailOptionsList': [{
                            'type': 2,
                            'variable': 'text26',
                            'value': '1'
                        }],
                        'sendCheckList': [{
                            'checkName': ''
                        }]
                    }
                    this.$http.post(this.Global.baseURL + this.Global.api.SystemSet.mailset.setindex.updateOptions,
                        data).then(function (res) {
                            if (res.body.code.toString() == this.Global.RES_OK) {

                            }
                        },
                            function (res) {
                                this.$message.error(this.msg(res.body))
                            }
                        )
                }
            }
        }
        // ,
        // fileList: {
        //     handler(curVal, oldvalue) {
        //         /**
        //            * 更改缓存
        //            */
        //         if (this.fileListChange) {
        //             this.cachParameter.sendMailInfo.attachmentList = this.fileList
        //             // this.autoSaveMail('mxMailDB', 1, 'Mail', { unionId: this.$route.params.id, cachParameter: this.cachParameter })
        //         }
        //     }

        // }

    }
}

</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
