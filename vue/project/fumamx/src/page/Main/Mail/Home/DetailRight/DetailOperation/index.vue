<template>
    <!-- 当前邮件操作 -->
    <div class="mailOperation">
        <div v-if="fullShow" class="pull-right" @click="fullScreen(DetailData.mId,DetailData.subject,DetailData.source,DetailData.folder )">
            <i class="iconfont icon-full-screen"></i>
        </div>
        <ul>
            <!-- 回复 -->
            <li :title="$t('mxpcweb.mail.1528702792869')" class="downBtn" @click="openReplyAndForwardMail({type:'R'})">
                <i class="iconfont icon-reply"></i>
                <span @click.stop="">
                    <el-dropdown trigger="click" @command="openReplyAndForwardMail">
                        <span class="el-dropdown-link">
                            <i class="iconfont icon-arrow-down"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown" v-if="replyTemplateList.length > 0">
                            <el-dropdown-item v-for="(replyItem,index) in replyTemplateList" :key="index" :command='{templateId:replyItem.templateId,type:"R"}'>
                                {{replyItem.templateName}}</el-dropdown-item>
                        </el-dropdown-menu>

                    </el-dropdown>
                </span>
            </li>
            <!-- 回复全部 -->
            <li :title="$t('mxpcweb.mail.1528702798478')" class="downBtn" @click="openReplyAndForwardMail({type:'Rl'})">
                <i class="iconfont icon-reply-all"></i>
                <span @click.stop="">
                    <el-dropdown trigger="click" @command="openReplyAndForwardMail">
                        <span class="el-dropdown-link">
                            <i class="iconfont icon-arrow-down"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown" v-if="replyTemplateList.length > 0">
                            <el-dropdown-item v-for="(replyItem,index) in replyTemplateList" :key="index" v-if="replyItem.templateType == 3" :command='{templateId:replyItem.templateId,type:"Rl"}'>
                                {{replyItem.templateName}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </span>
            </li>
            <!-- 转发 -->
            <li :title="$t('mxpcweb.mail.1528702798958')" class="downBtn lineRight" @click="openReplyAndForwardMail({type:'F'})">
                <i class="iconfont icon-forward"></i>
                <span @click.stop="">
                    <el-dropdown trigger="click" @command="openReplyAndForwardMail">
                        <span class="el-dropdown-link">
                            <i class="iconfont icon-arrow-down"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown" v-if="forwardTemplateList.length > 0">
                            <el-dropdown-item v-for="(replyItem,index) in forwardTemplateList" :key="index" :command='{templateId:replyItem.templateId,type:"F"}'>
                                {{replyItem.templateName}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </span>
            </li>
            <!-- 归并 -->
            <li v-if="selectedBoxId.target!='undistributed'&&selectedBoxId.SelectType!='c'" class="nodown" :title="$t('mxpcweb.mail.1528702678326')" @click="
            $emit('OperationTrigger', 'MaileMerge', {mId:DetailData.mId},[DetailData.mId])">
                <i class="iconfont icon-filed"></i>
            </li>
            <!-- 内分发 -->
            <li v-if="selectedBoxId.SelectType!='c'" class="nodown" :title="$t('mxpcweb.mail.1528702683332')" @click="
            $emit('OperationTrigger','DialogInDistribute',[DetailData.mId],DetailData.fromEx[0].address)">
                <i class="iconfont icon-inside"></i>
            </li>
            <!-- 移动 -->
            <li v-if="selectedBoxId.target!='undistributed'&&selectedBoxId.SelectType!='c'" class="nodown" :title="$t('mxpcweb.mail.1528702683623')" @click="
            $emit('OperationTrigger','openMovingFolders',[DetailData.mId],1)">
                <i class="iconfont icon-file-move"></i>
            </li>
            <!-- 删除   -->
            <li v-if="selectedBoxId.SelectType!='c'" :title="$t('mxpcweb.mail.1528702683911')" class="downBtn lineRight" @click="
            $emit('OperationTrigger', 'MoveRecyclingStation', [DetailData.mId],4 )">
                <i class="iconfont icon-del"></i>
                <span @click.stop="">
                    <el-dropdown trigger="click" @command="handleCommandDelate">
                        <span class="el-dropdown-link">
                            <i class="iconfont icon-arrow-down"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <!-- 删除 -->
                            <el-dropdown-item v-if="selectedBoxId.id!=4" :command='{mId:DetailData.mId,BoxId:4}'>{{$t('mxpcweb.mail.1528702683911')}}</el-dropdown-item>
                            <!-- 彻底删除 -->
                            <el-dropdown-item :command='{mId:DetailData.mId,BoxId:0}'>{{$t('mxpcweb.mail.1528702684265')}}</el-dropdown-item>
                            <!-- 移入垃圾邮件箱 -->
                            <el-dropdown-item v-if="selectedBoxId.id!=5" :command='{mId:DetailData.mId,BoxId:5}'>{{$t('mxpcweb.mail.1530069582766')}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </span>
            </li>
            <!-- 标签 -->
            <li :title="$t('mxpcweb.mail.1528702726743')" class="nodown">
                <i class="iconfont icon-tag" @click="$emit('OperationTrigger','DialogSetTagShow',DetailData,'EEM001')"></i>

            </li>
            <!-- 垃圾邮件 -->
            <li v-if="selectedBoxId.SelectType!='c'" class="nodown" :title="$t('mxpcweb.mail.1528702727257')" @click="DialogJunkMail(DetailData.mailAddress,DetailData.fromEx,DetailData.mId,DetailData.rawData,DetailData.size,DetailData.subject)">
                <i class="iconfont icon-sign"></i>
            </li>
            <!-- 取消星标置顶':'星标置顶 -->
            <li class="nodown" v-if="DetailData.stickyFlag!=0&&selectedBoxId.SelectType!='c'" :title="$t('mxpcweb.mail.1528702539959')" @click="
            $emit('OperationTrigger', 'handleCommand',{actionName:'UnTopOperation',mId:DetailData.mId},[DetailData.mId])">
                <i class="iconfont  icon-star"></i>
            </li>
            <li class="nodown" v-else-if="DetailData.stickyFlag==0&&selectedBoxId.SelectType!='c'" :title="$t('mxpcweb.mail.1528702540217')" @click="$emit('OperationTrigger', 'handleCommand',{actionName:'TopOperation',mId:DetailData.mId},[DetailData.mId])">
                <i class="iconfont  icon-star"></i>
            </li>
            <!-- 更多 -->
            <li :title="$t('mxpcweb.mail.1528708499750')" class="nodown">
                <el-dropdown trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        <i class="iconfont icon-more"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <div v-if="selectedBoxId.SelectType!='c'">
                            <el-dropdown-item v-if="DetailData.status!=-1" :command='{actionName:"UnReadState",mId:DetailData.mId}'> {{$t('mxpcweb.mail.1528702486579')}}</el-dropdown-item>
                            <el-dropdown-item v-if="DetailData.status==-1" :command='{actionName:"ReadState",mId:DetailData.mId}'> {{$t('mxpcweb.mail.1528702491693')}}</el-dropdown-item>
                            <el-dropdown-item v-if="DetailData.replyFlag" :command='{actionName:"UnRecoverystate",mId:DetailData.mId}'>{{$t('mxpcweb.mail.1528702492152')}}</el-dropdown-item>
                            <el-dropdown-item v-if="!DetailData.replyFlag" :command='{actionName:"Recoverystate",mId:DetailData.mId}'>{{$t('mxpcweb.mail.1528702492646')}}</el-dropdown-item>
                            <el-dropdown-item v-if="DetailData.repostSign" :command='{actionName:"UnForwardingState",mId:DetailData.mId}'>{{$t('mxpcweb.mail.1528702493166')}}</el-dropdown-item>
                            <el-dropdown-item v-if="!DetailData.repostSign" :command='{actionName:"ForwardingState",mId:DetailData.mId}'>{{$t('mxpcweb.mail.1528702539318')}}</el-dropdown-item>
                            <el-dropdown-item :command='{actionName:"Comment",mId:DetailData.mId,subject:DetailData.subject}'>{{$t('mxpcweb.mail.1528702539712')}}</el-dropdown-item>
                            <el-dropdown-item v-if="DetailData.stickyFlag ==1" :command='{actionName:"UnTopOperation",mId:DetailData.mId}'>{{$t('mxpcweb.mail.1528702539959')}}</el-dropdown-item>
                            <el-dropdown-item v-if="DetailData.stickyFlag ==0" :command='{actionName:"TopOperation",mId:DetailData.mId}'>{{$t('mxpcweb.mail.1528702540217')}}</el-dropdown-item>
                        </div>
                        <el-dropdown-item :command='{actionName:"AttachmentsSend",mId:DetailData.mId,subject:DetailData.subject,size:DetailData.size,rawData:DetailData.rawData}'>{{$t('mxpcweb.mail.1528702540482')}}</el-dropdown-item>
                        <el-dropdown-item v-if="DetailData.source!='FMDRAFT'&&DetailData.folder!=3" :command='{actionName:"ExportEML",mId:DetailData.mId,rawData:DetailData.rawData}'>{{$t('mxpcweb.mail.1528702573274')}}</el-dropdown-item>
                        <div v-if="selectedBoxId.SelectType!='c'">
                            <el-dropdown-item :command='{actionName:"updataSubject",subject:DetailData.subject,mId:DetailData.mId}'>{{$t('mxpcweb.mail.1528702573934')}}</el-dropdown-item>
                            <el-dropdown-item :command='{actionName:"addMsg",mId:DetailData.mId }'>{{$t('mxpcweb.mail.1528702574238')}}</el-dropdown-item>
                        </div>
                        <!-- <el-dropdown-item :command='{actionName:"reportMessyCode",mId:DetailData.mId}'>报告乱码邮件</el-dropdown-item> -->
                        <el-dropdown-item :command='{actionName:"printMail",mId:DetailData.mId}'>{{$t('mxpcweb.mail.1528702592294')}}</el-dropdown-item>
                        <el-dropdown-item v-if="DetailData.source=='FMD'" :command='{actionName:"EditAgain",mId:DetailData.mId,subject:DetailData.subject}'>{{$t('mxpcweb.mail.1528702592843')}}</el-dropdown-item>

                    </el-dropdown-menu>
                </el-dropdown>
            </li>

        </ul>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: '',
    props: {
        DetailData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        replyTemplateList: {
            type: Array,
            default: function () {
                return []
            }
        },
        forwardTemplateList: {
            type: Array,
            default: function () {
                return []
            }
        },
        AtypismAddress: {
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
        }

    },
    data() {
        return {
        }
    },
    computed: {
        ...mapGetters('mail', [
            'selectedBoxId',
            'subordinateCtid'
            // ,            'mailTemplateListG'
        ])
    },
    created() {

    },
    methods: {
        // 删除下拉框
        async  handleCommandDelate(command) {
            let mIds = [command.mId]
            if (command.BoxId == 4 || command.BoxId == 5) {
                this.$emit('OperationTrigger', 'MoveRecyclingStation', mIds, command.BoxId)
            } else {
                this.$emit('OperationTrigger', 'PhysicalDelete', mIds)
            }
        }, // 标记下拉框事件触发
        handleCommand(command) {
            this.$emit('OperationTrigger', 'handleCommand', command, [this.DetailData.mId])
        },
        async  openReplyAndForwardMail(command) {
            if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                let blg = await this.GetRightsCheck({ 'optCode': 'otReplies', 'moduleCode': 'EM001' })
                if (!blg) {
                    this.$message.error('无权限！')
                    return
                }
            }
            var templateId = ''
            var type = ''
            if (command.templateId != undefined && command.templateId != null) {
                templateId = command.templateId
            } else {
                templateId = 0
            }
            type = command.type
            this.$router.push('/main/mail/home/index')
            setTimeout(() => {
                ep.emit('openNewMail', {
                    title: this.DetailData.subject,
                    mId: this.DetailData.mId,
                    type: type,
                    templateid: templateId
                })
            }, 50)
        }, // 全屏
        fullScreen(mId, title, source, folder) {
            if (source == 'FMDRAFT' || (folder == 3 && source == 'FMD')) { // 草稿     发件箱的都可以重新发送
                // 草稿
                ep.emit('openNewMail', {
                    title: title,
                    mId: mId,
                    type: 'D'
                })
            } else {
                ep.emit('openMailDetail', {
                    mId: mId,
                    boxId: this.selectedBoxId.id
                })
            }
        },
        // 权限获取
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
        // 垃圾邮件
        DialogJunkMail(mailAddress, fromEx, mId, rawData, size, subject) {
            let str = ''
            for (let i = 0; i < fromEx.length; i++) {
                // 发件地址
                str = str + fromEx[i].address + ','
            }
            if (this.AtypismAddress != '') {
                // 回复地址不一致
                str = str + this.AtypismAddress + ','
            }
            let data = [{
                ownerMailAddress: mailAddress,
                junkMailAddress: str.substring(0, str.length - 1),
                mid: mId

            }]
            let paramsData = [{
                mid: mId,
                rawData: rawData,
                size: size,
                subject: subject
            }]
            this.$emit('OperationTrigger', 'DialogJunkMail', 'single', data, paramsData)
        },
        LastListCenter(mIds, actionName) {
            this.$emit('LastListCenterDetailRight', mIds, actionName)
        }

    }

}
</script>
<style lang="less" rel="stylesheet/less" >
@import "./zh-cn.less";
@import "./en.less";
</style>
