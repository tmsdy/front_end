<template>
    <div class="DetailRight" :style="{'margin-left': isSlider ? '0' : '380px'}">
        <!-- 当前邮件操作 -->
        <detail-operation ref="DetailOperation" v-if="DetailData.mId!=undefined" :DetailData="DetailData" :forwardTemplateList="forwardTemplateList" :replyTemplateList="replyTemplateList" @LastListCenterDetailRight="LastListCenter" :AtypismAddress="AtypismAddress" :fullShow="fullShow" @OperationTrigger="OperationTrigger"></detail-operation>
        <div v-else style="  background-color: #fff;"></div>

        <!-- 邮件明细 -->
        <div v-if='noData' class="mailDetail" ref="mailDetail">
            <!-- <no-data title="没有查到数据" class="marginTop15"></no-data> -->
            <no-data :title="$t('mxpcweb.mail.1528708835930')" img="noMail"></no-data>
        </div>
        <div v-if='!noData' class="mailDetail MXscroll" ref="mailDetail">
            <div class="title">
                <span style=" color: #FFBF00;">
                    <!-- 置顶 -->
                    <i v-if="DetailData.stickyFlag!=0" class="iconfont  icon-star"></i>
                </span>
                <!-- 主题 -->
                <span class="text"> {{DetailData.subject}}</span>
                <!-- 标签 -->
                <el-tag class="tag" v-for="(item3,index3) in DetailData.tagObjects" :key="index3" :style="setBgColor(item3.commentFlag)">{{item3.labelName}}</el-tag>
            </div>
            <div class="itemTitle">
                <el-row>
                    <el-col :span="19">
                        <span class="name"> {{$t('mxpcweb.mail.1528701889317')}}</span>
                        <span v-for="(item2,index2) in DetailData.recipients" :key="index2+'recipients'">
                            <span>{{getName(item2,item2.category)}},</span>
                        </span>
                        <template v-if="DetailData.cc&&DetailData.recipients&&DetailData.recipients.length<10">
                            <span v-for="(item22,index22) in DetailData.cc" :key="index22+'cc'">
                                <span>{{getName(item22,item22.category)}},</span>
                            </span>
                        </template>
                        <span v-if="DetailData.cc&&DetailData.recipients&&(DetailData.recipients.length+DetailData.cc.length)>6">{{$t('mxpcweb.mail.1533111966156',{a:(DetailData.recipients.length+DetailData.cc.length)})}}</span>
                        <span v-if="!DetailData.cc&&DetailData.recipients&&DetailData.recipients.length>6">{{$t('mxpcweb.mail.1533111966156',{a:DetailData.recipients.length})}}</span>
                    </el-col>
                    <el-col :span="3">
                        <div class="dateClass">{{DateDisplay(DetailData.longSentDate)}}</div>
                    </el-col>
                    <el-col :span="2">
                        <div class="btnMore text-hover" @click="showDetailItem">{{isMailHead==true?$t('mxpcweb.mail.1528710212147'):$t('mxpcweb.mail.1528710223317')}} </div>
                    </el-col>
                </el-row>
            </div>

            <div class="divInfo" v-if="isMailHead">
                <div class="item">
                    <!-- 发件人： -->
                    <div class="name">{{$t('mxpcweb.mail.1528702110362')}}：</div>
                    <ul class="mailAddress">
                        <!--收件箱：显示发件人-->
                        <template v-if="DetailData.fromEx&&DetailData.fromEx.length>0">
                            <li v-for="(items,index) in DetailData.fromEx" :key="index">
                                <show-name ref="ShowName" :showDetail="items" :isShow="DetailData.source=='FMR'||DetailData.source=='FMI'||!DetailData.source"></show-name>
                            </li>
                            <template v-if="DetailData.replyTo&&DetailData.replyTo.length>0&&DetailData.replyTo[0].address&&DetailData.replyTo[0].address!=DetailData.fromEx[0].address">
                                <li v-for="(itemss,indexs) in DetailData.replyTo" :key="indexs+'Reply'">
                                    <show-reply-name :showDetail="itemss" ref="showReplyName" :isShow="DetailData.source=='FMR'||DetailData.source=='FMI'||!DetailData.source"></show-reply-name>
                                </li>
                            </template>
                        </template>
                    </ul>
                </div>
                <div class="item">
                    <!-- 收件人： -->
                    <div class="name">{{$t('mxpcweb.mail.1528702113259')}}：</div>
                    <ul class="mailAddress">
                        <template v-if="DetailData.recipients&&DetailData.recipients.length>0">
                            <li v-for="(item2,index2) in DetailData.recipients" :key="index2">
                                <show-name ref="ShowName" :showDetail="item2"></show-name>
                            </li>
                        </template>
                    </ul>
                </div>
                <div class="item" v-if=" DetailData.cc&& DetailData.cc.length>0">
                    <!-- 抄送： -->
                    <div class="name">{{$t('mxpcweb.mail.1528702123800')}}：</div>
                    <ul class="mailAddress">
                        <li v-for="(item22,index22) in DetailData.cc" :key="index22">
                            <show-name ref="ShowName" :showDetail="item22"></show-name>
                        </li>

                    </ul>
                </div>
                <seend-status ref="SeendStatus" :DetailData="DetailData" @LastListCenter="LastListCenter" @stateShowChange="stateShowChange" :stateShow="stateShow" @getDeliveryStatus="getDeliveryStatus"></seend-status>
                <div class="item">
                    <div class="name">{{$t('mxpcweb.mail.1528702124306')}}：</div>
                    <span v-if="DetailData.longSentDate">{{DateDisplay(DetailData.longSentDate)}}</span>
                </div>
                <div class="item" v-show="FolderLocation!=''">
                    <div class="name">{{$t('mxpcweb.mail.1535525563251')}}：</div>
                    <div class="stateName2" style="margin-left:0">
                        <span class="statet2"> {{FolderLocation2}}</span>
                        <span class="statet3"> {{FolderLocation}}</span>
                    </div>
                </div>

            </div>
            <el-table :data="DetailData.singleMailDeliveryStatuses" stripe style="width: 100%; margin-top: 20px;" v-if="stateShow&&DetailData.deliveryStatus !=-2&&DetailData.type==1&&DetailData.singleMailDeliveryStatuses">
                <el-table-column prop="mailAccount" :label="$t('mxpcweb.mail.1528702113259')" width="180">
                </el-table-column>
                <!-- 发送状态 -->
                <el-table-column prop="state" :label="$t('mxpcweb.mail.1528709377866')">
                </el-table-column>
                <el-table-column prop="createTime" :label="$t('mxpcweb.mail.1528702124306')" width="180 ">
                </el-table-column>
            </el-table>
            <div class="receiptBox2" v-if="DetailData.spamCode&&getByte(1)==1">
                <i class="iconfont icon-warning"></i>
                <span>此邮件为垃圾邮件</span>
                <div class="pull-right">
                    <button class="emptyingLog" @click="NotJunkMail()">取消</button>
                    <button class="emptyingLog" @click="submitSurte()">确定</button>

                </div>
            </div>
            <div class="receiptBox2" v-if="DetailData.spamCode&&getByte(2)==1 ">
                <i class="iconfont icon-warning "></i>
                <span>此邮件为欺诈邮件</span>
            </div>

            <div v-if="DetailData.containAttachment " class="divAttch ">
                <div class="item ">
                    <div class="btnMore text-hover " @click="isMailFile=! isMailFile ">{{isMailFile==true?$t('mxpcweb.mail.1528710225537'):$t('mxpcweb.mail.1528715979174')}}
                        <!-- <i :class="[isMailFile ? 'el-icon-arrow-up' : 'el-icon-arrow-down'] "></i> -->
                    </div>
                    <div v-if="DetailData.containAttachment " class="name ">
                        <i class="iconfont icon-attachment "></i> {{$t('mxpcweb.mail.1528709296344')}}：</div>
                    <span v-if="DetailData.containAttachment ">{{attachmentCount}} 个</span>&nbsp;
                    <!-- 打包下载全部附件 -->
                    <!-- $refs.puablicAction.getDownload(DetailData.mId, 'all') -->
                    <span class="text-blue text-hover " @click="OperationTrigger('handleCommand',{'actionName':'getDownload','mId':DetailData.mId,'rawData':''},[DetailData.mId])" v-if="DetailData.attachmentList">{{$t('mxpcweb.mail.1528701859716')}}</span>
                    <!-- 转存全部附件到知识管理 -->
                    <span class="text-blue text-hover " @click="transferToDoc(DetailData.attachmentList) " v-if="DetailData.attachmentList">
                        <!-- 转存全部附件到知识管理 -->{{$t('mxpcweb.mail.1531966647168')}}</span>
                    <template v-if="isMailFile">
                        <ul class="file">
                            <li v-for="(item10,index10) in DetailData.attachmentList" :key="index10">
                                <div class="ico">
                                    <a v-if="isImage(substringSuffix(item10.name))"> <img :src="item10.url"></a>
                                    <!-- <i v-else :class="'iconfile file-'+converSuffix(item10.name)"></i> -->
                                    <svg v-else class="iconSVG" aria-hidden="true">
                                        <use :xlink:href="'#file-'+converSuffix(item10.name)"></use>
                                    </svg>
                                </div>
                                <div class="title" :title="item10.name">
                                    <div>{{item10.name}}</div>
                                    <span>{{item10.size>1024?(item10.size/1024).toFixed(2)+'M':item10.size+'KB'}}</span>
                                </div>
                                <div class="view">
                                    <!-- 预览 -->
                                    <span @click.stop="$refs.filePreview.show(DetailData.attachmentList,index10,DetailData.mId)">
                                        <i class="iconfont icon-search-dot"></i>
                                    </span>
                                    <!-- 下载 -->
                                    <span @click="LocalDownload(item10,index10)">
                                        <i class="iconfont icon-download-file"></i>
                                    </span>
                                    <!-- 转存 -->
                                    <span @click="transferToDoc([item10])">
                                        <i class="iconfont icon-transfer"></i>
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </template>
                </div>
            </div>

            <div class="msg" v-if='AtypismAddress!=""'>
                <!-- <div class="pull-right"> -->
                <!-- <i class="iconfont icon-del"></i> -->
                <!-- 已关闭 -->
                <!-- </div> -->
                <i class="iconfont icon-warning" style="color:#D0021B"></i>
                <!-- 邮件回复地址 {{AtypismAddress}} 与发件人不一致，注意安全风险，谨防诈骗邮件！ -->
                <span>{{$t('mxpcweb.mail.1530154400771',{a:AtypismAddress})}} </span>
            </div>
            <template v-for="(item0,index0) in DetailData.timingTaskList">
                <div class="msg" :key="index0" v-if="item0.msgSubType!=3">
                    <div class="pull-right">

                        <span v-if="item0.status">{{messgStatus(item0.status)}}</span>
                        <!-- <i class="iconfont icon-del"></i> -->
                    </div>
                    <i class="iconfont  icon-notice-solid" style="color:#FFB64C"></i>
                    <span v-if="item0.msgSubType==1">{{item0.deliveryTime}} 【{{personalInfo.realName}}】 {{item0.body.msgBody}} </span>
                    <span v-if="item0.msgSubType==6">{{item0.deliveryTime}} {{$t('mxpcweb.mail.1530102145871',{a:personalInfo.realName,b:item0.deliveryTime,c:item0.body.msgBody})}} </span>
                    <span v-if="item0.msgSubType==7">{{item0.deliveryTime}} {{$t('mxpcweb.mail.1530101737559',{a:personalInfo.realName,b:item0.deliveryTime,c:item0.body.msgBody})}} </span>
                    <!-- (-2：关闭、-1：任务未执行、0：任务已执行) -->
                </div>
                <div class="msg" v-else :key="index0">
                    <div class="pull-right">
                        <span v-if="item0.status">{{messgStatus(item0.status)}}</span>
                    </div>
                    <i :style="setCommentsColor(0)" class="iconfont icon-dot"></i>
                    <span>{{item0.deliveryTime}} &nbsp;{{item0.body.msgBody}}</span>
                </div>

            </template>
            <!-- 发送回执 -->
            <div class="receiptBox" v-if="DetailData.replySign&&DetailData.replySign!=undefined">
                {{$t('mxpcweb.mail.1528709166013')}}
                <div class="pull-right">
                    <el-button type="primary" size="mini" @click="replySignClick(true,DetailData.mId,DetailData.subject,DetailData.replyTo,DetailData.mailAddress)">{{$t('mxpcweb.mail.1528701612107')}}</el-button>
                    <el-button type="text" size="mini" @click="replySignClick(false,DetailData.mId,DetailData.subject,DetailData.replyTo,DetailData.mailAddress)">{{$t('mxpcweb.mail.1528701814778')}}</el-button>
                </div>
            </div>

            <div style="border-bottom: 1px solid #ddd;margin-top: 20px; margin-bottom:20px"> </div>
            <iframe v-if="DetailData.previewUrl" :src="DetailData.previewUrl" frameborder="0" marginheight="0" marginwidth="0" spellcheck="false"></iframe>
            <!-- scrolling="no" -->
            <iframe v-else-if="switchFlag" ref="iframe" src="/static/mail/content.html" @load="loadedContent" frameborder="0" marginheight="0" marginwidth="0" width="100%" height="100%"></iframe>
            <!-- <iframe src="https://testmail01.oss-cn-hangzhou.aliyuncs.com/tmp%2F86400%2F16085_261803"></iframe> -->
        </div>

        <!-- 文件预览 -->
        <doc-preview ref="filePreview"></doc-preview>
        <!-- 附件转存 -->
        <dialog-doc-transfer ref="docTransfer"></dialog-doc-transfer>
        <!-- <puablic-action ref="puablicAction" @LastListCenter="LastListCenter"></puablic-action> -->

    </div>
</template>

<script>
/**
 * 描述：邮件部分
 * 作者：向士健(CSS) / ***(API)
 * 时间：2017/11/11
 */
import { mapGetters, mapMutations } from 'vuex'
import { getSuffix, isHasSuffix, isArray, tagsBgColor, commentsColor, getByte, AddressCharacterJudgment } from '@/libs/utils.js'
import NoData from '@/basecomponents/NoData/index'
import DocPreview from '@/components/DocPreview/index'
import DialogDocTransfer from '../../Vue/DialogDocTransfer/index'
import ShowName from './ShowName/index'
import showReplyName from './showReplyName/index'
import DetailOperation from './DetailOperation/index'
// import puablicAction from '../vue/puablicAction'
import SeendStatus from './SeendStatus/index'
export default {
    name: 'DetailRight',
    props: {
        DetailDataList: {
            type: Object,
            default: function () {
                return {}
            }
        },
        content: {
            type: String,
            default: function () {
                return ''
            }
        },
        fullShow: {
            type: Boolean,
            default: function () {
                return true
            }
        },
        isSlider: {
            type: Boolean,
            default: function () {
                return false
            }
        }
        // ,
        // attachmentList: {
        //     type: Array,
        //     default: function () {
        //         return []
        //     }
        // }
    },
    data() {
        return {
            noData: true,
            DetailData: {},
            isMailHead: false, // 邮件头item是否展开
            isMailFile: false, // 邮件附件
            attachmentCount: 0, // 附件个数
            rawData: '', // 链接
            types: '1000',
            stickyState: '', // 置顶状态
            AtypismAddress: '', // 回复地址
            editableTabs: [],
            replyTemplateList: [],
            forwardTemplateList: [],
            SearchSelect: '',
            stateShow: false,
            FolderLocation: '',
            FolderLocation2: '',
            laodown: true,
            taskId: '',
            switchFlag: true
        }
    },
    created() {
        // ep.tail('mailsDeliveryStatusGet', (dataObj) => { // 发送邮件后调用
        //     if (dataObj.body.rawData.taskId == this.taskId) {
        //         if (dataObj.body.rawData.singleMailDeliveryStatuses[0].code == '250') {
        //             this.DetailData.replySign = false
        //         } else {
        //             let msgArr = dataObj.body.rawData.singleMailDeliveryStatuses[0].msg.split(':')
        //             this.$message.error(this.$t('mxpcweb.mail.1528976480298', { a: msgArr[2] }))
        //         }
        //     }
        // })
    },
    mounted() {
        $(window).resize(() => {
            this.loadedContent()
        })
    },
    computed: {
        ...mapGetters(['company', 'personalInfo']),
        ...mapGetters('mail', [
            'selectedBoxId',
            'subordinateCtid',
            'mailTemplateListG'
        ])
    },
    methods: {
        // 操作
        OperationTrigger(key, key2, key3, key4) {
            this.$emit('OperationTrigger', key, key2, key3, key4)
        },
        stateShowChange(blg) {
            this.stateShow = blg
        },
        DialogSetTagShow() {
            // this.$refs.puablicAction.DialogSetTagShow(this.DetailData, 'EM001')
        },
        // 背景色
        setBgColor(id) {
            return tagsBgColor(id)
        },
        // 批注色彩
        setCommentsColor(flag) {
            return commentsColor(flag)
        },
        LastListCenter(mIds, actionName) {
            this.$emit('LastListCenter', mIds, actionName)
        },
        NotJunkMail() {
            let data = {
                'mIds': [this.DetailData.mId],
                'spamCode': 0, // 按位运算 从低位到高位 0位表示垃圾邮件 1位表示欺诈邮件
                'type': 'spamCode'
            }
            this.MailSettingsUpdate(data, 'NotJunkMail', this.$t('mxpcweb.mail.1528942364802'))
        },
        getByte(index) {
            return getByte(this.DetailData.spamCode, index)
        },
        // 提交
        submitSurte() {
            let _this = this
            let data = {
                'type': 'single',
                'blackListFlag': false,
                'mId': _this.DetailData.mId,
                'fromAddress': _this.DetailData.fromEx[0].address,
                'mailAccount': _this.DetailData.from,
                'moveAll': false

            }
            if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                data.ctid = this.subordinateCtid
            } else {
                delete data.ctid
            }
            _this.$http.post(_this.Global.baseURL + _this.Global.api.Mail.mailsSpamSetPost, data)
                .then(function (res) { // console.log(res);
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.$message.success(this.$t('mxpcweb.mail.1530003051672'))// "举报成功!"
                        _this.$emit('LastListCenter', [this.DetailData.mId], 'JunkMail')
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                },
                    function (res) {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    }
                )
        },
        getFolder(folderId) {
            ep.emit('getFolder', {
                boxId: folderId,
                fn: (aa) => {
                    if (aa != undefined) {
                        let arry = aa.split('/')
                        this.FolderLocation2 = ''
                        for (let index = 0; index < arry.length - 2; index++) {
                            const element = arry[index]
                            this.FolderLocation2 = this.FolderLocation2 + element + '/'
                        }
                        this.FolderLocation = arry.length > 1 ? arry[arry.length - 2] : arry[arry.length - 1]
                    } else {
                        this.FolderLocation = ''
                    }
                }
            })
        },

        // 日期显示
        DateDisplay(times) {
            return this.$moment(new Date(times)).format('YYYY/MM/DD HH:mm')
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
                this.$message.error(res.body.msg)
                blg = false
            }
            return blg
        },
        messgStatus(state) {
            // status          消息状态(-2：关闭、-1：任务未执行、0：任务已执行)
            if (state == -2) {
                return this.$t('mxpcweb.mail.1530621851728')
            } else if (state == -1) {
                return this.$t('mxpcweb.mail.1530621832652')
            } else if (state == 0) {
                return this.$t('mxpcweb.mail.1530621848840')
            }
        },
        // 邮件发送状态详情
        getDeliveryStatus(taskId, mailAccount) {
            this.$http.get(this.Global.baseURL + this.Global.api.Mail.mailsDeliveryStatusGet, {
                params: {
                    mId: taskId,
                    mailAccount: mailAccount
                }
            }).then(
                function (res) {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.$message.success(this.$t('mxpcweb.mail.1530618707353'))
                        let datas = res.body.data
                        if (datas.singleMailDeliveryStatuses) {
                            this.DetailData.singleMailDeliveryStatuses = []
                            if (isArray(datas.singleMailDeliveryStatuses)) {
                                datas.singleMailDeliveryStatuses.forEach((item) => {
                                    let Consignee = ''
                                    if (item.targetAddresses != undefined) {
                                        if (item.targetAddresses.indexOf('<') != -1) {
                                            let temArry = item.targetAddresses.split('<')
                                            Consignee = temArry.length > 1 ? temArry[1].split('>')[0] : ''
                                        } else {
                                            Consignee = item.targetAddresses
                                        }
                                    }
                                    let state = ''
                                    if (item.code == '250') {
                                        if (this.DetailData.type == 0) {
                                            this.DetailData.deliveryStatus = 1
                                        }
                                        state = this.$t('mxpcweb.mail.1528782772184')// 发送成功
                                    } else {
                                        if (this.DetailData.type == 0) {
                                            this.DetailData.deliveryStatus = -2
                                        }
                                        state = item.msg
                                    }
                                    this.DetailData.singleMailDeliveryStatuses.push({
                                        createTime: item.createTime,
                                        mailAccount: Consignee,
                                        state: state
                                    })
                                })
                            }
                        }
                        this.DetailData.deliveryStatus = datas.deliveryStatus
                        this.DetailData.deliveryTime = datas.deliveryTime
                    }
                },
                function (res) {
                    this.$message.error(this.$t(this.Global.errorTitle))
                }
            )
        },
        custSliderOpen(address, custId) {
            ep.emit('custSliderOpen', {
                mail: address,
                constId: custId,
                fn() {
                    this.$emit('LastListCenter', [this.DetailData.mId], '')// 更新列表中的某一条数据
                }
            })
        },
        // 文件后缀识别
        converSuffix(name) {
            let suffix = getSuffix(name)
            return isHasSuffix(suffix)
        },
        loadedContent() {
            let contentStr = ''
            if (this.content == '' || this.content == undefined) {
                // return;
                contentStr = "<div style='text-align: center;  margin-top: 20px;'>" + this.$t('mxpcweb.mail.1530005652639') + '</div>'// 无数据
            }
            try {
                const vm = this.$refs.iframe.contentWindow.vm
                vm.showContent(contentStr == '' ? this.content : contentStr, (h) => {
                    this.$refs.iframe.style.height = h + 'px' // 文档高设置到iframe
                }, (w) => {
                    this.$refs.iframe.style.width = w + 'px'
                })
            } catch (err) {
                console.log(' vm.showContent(_this.content) ')
            }
        },
        ...mapMutations('mail', {
            set_refurbishBool: 'SET_REFURBISHBOOL'
        }),

        // 点击展开邮件头信息
        showDetailItem() {
            this.isMailHead = !this.isMailHead
            let obj = $('.item').find('ul.mailAddress')
            if (this.isMailHead == true) {
                obj.css('height', 'auto')
            } else {
                obj.css('height', '22px')
            }
        },
        // 是否发送回执
        async replySignClick(blg, mId, subject, replyTo, mailAddress) {
            if (blg) {
                let SendMailAccount = await this.$http.get(this.Global.baseURL + this.Global.api.Mail.getSendMailAccount, {
                    params: {
                        mailAccount: mailAddress
                    }
                })
                let data = {
                    originMid: mId,
                    previousSubject: subject
                }

                if (SendMailAccount.body.data.sendUser == '' || SendMailAccount.body.data.sendUser == undefined) {
                    // 邮箱账号已删除，已取消发送!  "提示"
                    this.$alert(mailAddress + this.$t('mxpcweb.mail.1530006630323'), this.$t('mxpcweb.mail.1528969862511'), {
                        confirmButtonText: this.$t('mxpcweb.mail.1528942374762'), // "确定",
                        callback: action => {

                        }
                    })
                    return
                }
                if (replyTo) {
                    data.receiption = replyTo[0].address
                    data.sendUser = SendMailAccount.body.data.sendUser
                    data.sendDisplayName = SendMailAccount.body.data.sendDisplayName
                }
                this.$http.post(this.Global.baseURL + this.Global.api.Mail.mailsSendReceiptPost, data).then(
                    function (res) {
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            this.taskId = res.body.data.taskId
                            this.$message.success(this.$t('mxpcweb.mail.1530007020176'))// 已发送！
                        } else {
                            this.$message.error(res.body.msg)
                        }
                    },
                    function (res) {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
            } else {
                let data = {
                    mIds: [mId],
                    replySign: 'false',
                    type: 'replySign'
                }
                // this.DetailData.replySign = false
                this.MailSettingsUpdate(data, '', this.$t('mxpcweb.mail.1530007036409'))// 设置
            }
        },
        LocalDownload(item10, index10) {
            if (this.isImage(this.substringSuffix(item10.name)) || this.substringSuffix(item10.name).toLowerCase() == 'txt' || this.substringSuffix(item10.name).toLowerCase() == 'mp4' || this.substringSuffix(item10.name).toLowerCase() == 'pdf') { // 图片或者txt
                let data = { mId: this.DetailData.mId, type: 'single', index: index10 }
                this.downloadFile(this.Global.baseURL + this.Global.api.v2.mails_download, data)
            } else {
                this.downloadFile(AddressCharacterJudgment(item10.url))
            }
        },
        // 标识设置
        MailSettingsUpdate(data, actionName, titleName) {
            if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                data.ctid = this.subordinateCtid
            } else {
                delete data.ctid
            }
            this.$http.post(this.Global.baseURL + this.Global.api.Mail.ManyMaillistPut, data).then(function (res) {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.$emit('LastListCenter', data.mIds, actionName)
                    this.$message.success(titleName + this.$t('mxpcweb.mail.1530005760922')) // "成功"
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, function (res) {
                this.$message.error(res)
            })
        },
        // 文件下载
        // getDownload(mId, type, index) {
        //     let data = {
        //         mId: mId,
        //         type: type
        //     }
        //     if (this.laodown) {
        //         this.laodown = false
        //         this.downloadFile(this.Global.baseURL + this.Global.api.v2.mails_download, data)
        //         let _this = this
        //         setTimeout(function () {
        //             _this.laodown = true
        //         }, 10000)// 120000
        //     }
        // },
        /* 文件转存 */
        transferToDoc(attachmentList = []) {
            this.$refs.docTransfer.open(attachmentList)
        },
        getName(item, type) {
            let name = ''
            switch (type) {
                case 1:// undefined 和 1
                    name = item.contName == undefined ? this.substringName(item.address) : item.contName
                    break
                case 2:
                    name = item.personal == undefined ? substringName(item.address) : item.personal
                    break
                case 3:
                    name = item.ownerName == undefined ? this.substringName(item.address) : item.ownerName
                    break
                case 4:
                    name = item.personal == undefined ? this.substringName(item.address) : item.personal
                    break
                default:
                    name = item.personal == undefined ? this.substringName(item.address) : item.personal
                    break
            }
            return name
        },
        // 名称截取
        substringName(adderss) {
            let str = adderss.split('@')
            return str[0]
        },
        substringSuffix(name) {
            let str = name.substr(name.lastIndexOf('.') + 1)
            return str
        },

        // 回复地址不一致
        adderssComparison() {
            let count = 0
            this.AtypismAddress = ''
            for (let j = 0; j < this.DetailData.replyTo.length; j++) {
                count = 0
                if (
                    this.DetailData.replyTo[0] == null ||
                    this.DetailData.replyTo[0] == undefined
                ) {
                    break
                }
                if (this.DetailData.fromEx) {
                    for (let i = 0; i < this.DetailData.fromEx.length; i++) {
                        if (
                            this.DetailData.replyTo[j].address ==
                            this.DetailData.fromEx[i].address
                        ) {
                            break
                        } else {
                            count++
                        }
                    }
                    if (count == this.DetailData.fromEx.length) {
                        this.AtypismAddress =
                            this.AtypismAddress + this.DetailData.replyTo[j].address + ','
                    }
                }
            }
        },
        // 判断是不是图片
        isImage(exe) {
            const imgArr = ['png', 'jpg', 'jpeg', 'gif', 'bmp']
            if (exe) {
                return imgArr.includes(exe.toLowerCase())
            }
        }
    },
    components: {
        'no-data': NoData,
        'doc-preview': DocPreview,
        'dialog-doc-transfer': DialogDocTransfer,
        'show-name': ShowName,
        'show-reply-name': showReplyName,
        'detail-operation': DetailOperation,
        // 'puablic-action': puablicAction,
        'seend-status': SeendStatus
    },
    watch: {
        DetailDataList: {
            handler(curVal, oldvalue) {
                this.SearchSelect = this.selectedBoxId.SelectType
                if (_.isEmpty(curVal)) {
                    // 放大框不能看，是因为没有mId
                    this.noData = true
                } else {
                    this.noData = false
                }
                this.DetailData = curVal
                if (curVal.replyTo != undefined) {
                    this.adderssComparison()
                }
                this.attachmentCount =
                    curVal.attachmentList == undefined ? 0 : curVal.attachmentList.length
                this.rawData = curVal.rawData
                this.stickyState = curVal.stickyFlag // 置顶状态
                if (curVal.folder != undefined) {
                    this.getFolder(curVal.folder)
                }
            },
            deep: true
        },
        content: function (curVal, oldvalue) {
            this.switchFlag = false
            this.$nextTick(() => {
                this.switchFlag = true
                this.$nextTick(() => {
                    this.loadedContent()
                    this.$refs.mailDetail.scrollTop = 0
                })
            })
        },
        mailTemplateListG: function (curVal, oldvalue) {
            this.replyTemplateList = []
            this.forwardTemplateList = []
            if (isArray(curVal) && curVal.length > 0) {
                curVal.forEach(element => {
                    if (element.templateType == 3) {
                        this.replyTemplateList.push(element)
                    } else if (element.templateType == 4) {
                        this.forwardTemplateList.push(element)
                    }
                })
            }
        }
    }
}

</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
