<template>
    <div class="puablicAction">
        <!-- 举报垃圾邮件,弹窗 -->
        <dialog-junk-mail ref="DialogJunkMail" @LastListCenter="LastListCenter"></dialog-junk-mail>
        <!-- 内部分发,弹窗 -->
        <dialog-in-distribute ref="DialogInDistribute" @LastListCenter="LastListCenter"></dialog-in-distribute>
        <!-- 内部分发,弹窗 -->
        <dialog-undistributed ref="DialogUndistributed" @LastListCenter="LastListCenter"></dialog-undistributed>
        <!-- 邮件批注，弹窗  @getListData="updateMailData"-->
        <dialog-mail-comment ref="DialogMailComment" @getListData="updateMailData"></dialog-mail-comment>
        <dialog-Set-Tags ref="dialog-Set-Tags" @LastListCenter="LastListCenter"></dialog-Set-Tags>
        <!-- 设置提醒 -->
        <dialog-mail-addmsg ref="MailAddMsg" @LastListCenter="LastListCenter"></dialog-mail-addmsg>
        <!-- 移动 -->
        <dialog-moving-folders ref="dialog-moving-folders"></dialog-moving-folders>
    </div>
</template>
<script>

import DialogJunkMail from '../../Vue/DialogJunkMail'
import DialogInDistribute from '../../Vue/DialogInDistribute'
import DialogUndistributed from '../../Vue/DialogUndistributed'
import DialogMailComment from '@/components/DialogMailComment'
import DialogSetTags from '@/components/DialogSetTags/index.vue'
import MailAddMsg from '@/page/Main/Mail/Vue/DialogAddMsg/index'
import DialogMovingFolders from '../ListCenter/Vue/DialogMovingFolders'
import { mapGetters } from 'vuex'
export default {
    name: 'puablicAction',
    props: {

    },
    data() {
        return {
            laodown: true
        }
    },
    computed: {
        ...mapGetters(['company']),
        ...mapGetters('mail', [
            'selectedBoxId',
            'subordinateCtid'
        ])
    },
    created() {

    },
    methods: {
        // 操作
        OperationTrigger(key, key2, key3, key4) {
            switch (key) {
                case 'DialogInDistribute':// 内分发
                    // key2=checkedListAll
                    this.DialogInDistribute(key2, key3)
                    break
                case 'MaileMerge':// 归并
                    // key2=data
                    // key3=checkedListAll
                    this.MaileMerge(key2, key3)
                    break
                case 'openMovingFolders':// 移动
                    // key2=checkedListAll
                    // key3=个数
                    this.openMovingFolders(key2, key3)

                    break
                case 'DialogJunkMail':// 举报
                    // key2=type
                    // key3=data
                    // key4=paramsData
                    this.DialogJunkMail(key2, key3, key4)
                    break
                case 'MoveRecyclingStation':// 删除
                    // key2=checkedListAll
                    // key3=boxid
                    this.MoveRecyclingStation(key2, key3)
                    break
                case 'PhysicalDelete':// 彻底删除
                    // key2=checkedListAll
                    this.PhysicalDelete(key2)
                    break
                case 'handleCommand':// 更多操作
                    // key2=command
                    // key3=checkedListAll
                    // this.handleCommand(key2, key3)
                    this.Operation(key2, key3)
                    break
                case 'DialogSetTagShow': // 标签
                    // key2=DetailData
                    this.DialogSetTagShow(key2, 'EM001')
                    break

                default:
                    break
            }
        },
        // 操作
        async   Operation(command, mIds) {
            let titleName = ''
            let data = {}
            let sign = false
            if (command.actionName == 'ReadState') { // 已读(次数)
                titleName = this.$t('mxpcweb.mail.1528702491693') // "标记已读";
                data = {
                    mIds: mIds,
                    status: '1',
                    type: 'status'
                }
                sign = true
            } else if (command.actionName == 'UnReadState') { // 标记为未读(-1)
                titleName = this.$t('mxpcweb.mail.1528702486579') // "标记未读";
                data = {
                    mIds: mIds,
                    status: '-1',
                    type: 'status'
                }
                sign = true
            } else if (command.actionName == 'Recoverystate') { // 标记为已回复
                titleName = this.$t('mxpcweb.mail.1528702492646') // "标记已回复";
                data = {
                    mIds: mIds,
                    replyFlag: true,
                    type: 'replyFlag'
                }
                sign = true
            } else if (command.actionName == 'UnRecoverystate') { // 标记未回复
                titleName = this.$t('mxpcweb.mail.1528702492152') // "标记未回复";
                data = {
                    mIds: mIds,
                    replyFlag: false,
                    type: 'replyFlag'
                }
                sign = true
            } else if (command.actionName == 'ForwardingState') { // 标记为已转发
                titleName = this.$t('mxpcweb.mail.1528702539318') // "标记已转发";
                data = {
                    mIds: mIds,
                    repostSign: true,
                    type: 'repost'
                }
                sign = true
            } else if (command.actionName == 'UnForwardingState') { // 标记为未转发
                titleName = this.$t('mxpcweb.mail.1528702493166') // "标记未转发";
                data = {
                    mIds: mIds,
                    repostSign: false,
                    type: 'repost'
                }
                sign = true
            } else if (command.actionName == 'TopOperation') { // 星标置顶 1置顶
                titleName = this.$t('mxpcweb.mail.1528702540217') // "置顶";
                data = {
                    mIds: mIds,
                    stickyFlag: 1,
                    type: 'top'
                }
                sign = true
            } else if (command.actionName == 'UnTopOperation') { // 星标取消置顶  0未置顶
                titleName = this.$t('mxpcweb.mail.1528702539959') // "取消星标置顶";
                data = {
                    mIds: mIds,
                    stickyFlag: 0,
                    type: 'top'
                }
                sign = true
            } else if (command.actionName == 'Comment') { // 单个批注
                this.$refs.DialogMailComment.isDialog('open', this.$t('mxpcweb.mail.1530006948154'), 'EM001', command.mId, command.subject, command)
            } else if (command.actionName == 'AttachmentsSend') { // 作为附件发送
                this.$http.get(this.Global.baseURL + this.Global.api.v2.mails_download, { params: {
                        mId: command.mId,
                        type: 'eml'
                    } }).then(function (res) {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        if (res.body.data.rawData != '') {
                            ep.emit('openNewMail', {
                                title: this.$t('mxpcweb.mail.1528941747561'), // "写邮件",
                                type: 'A',
                                subject: command.subject + '.eml',
                                size: command.size == undefined ? 0 : command.size,
                                rawData: res.body.data.rawData
                            })
                        } else {
                            this.$message.error(this.$t('mxpcweb.mail.1543210474024'))
                        }
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                })
            } else if (command.actionName == 'ExportEML' || command.actionName == 'getDownload' || command.actionName == 'ExportEMLbatch') { // 导出eml文件
                if (command.actionName == 'ExportEML') {
                    this.getDownload(command.mId, 'eml', command.rawData)
                } else if (command.actionName == 'ExportEMLbatch') {
                    this.getDownload(mIds.join(','), 'eml', command.rawData)
                } else {
                    this.getDownload(command.mId, 'all', command.rawData)
                }
            } else if (command.actionName == 'updataSubject') { // 修改主题
                this.updataSubject(command.subject, command.mId)
            } else if (command.actionName == 'EditAgain') { // 再次编辑
                if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                    let blg = await this.GetRightsCheck({ 'optCode': 'otReplies', 'moduleCode': 'EM001' })
                    if (!blg) {
                        this.$message.error('无权限！')
                        return
                    }
                }
                ep.emit('openNewMail', {
                    title: command.subject,
                    mId: command.mId,
                    type: 'Z'
                })
            } else if (command.actionName == 'printMail') { // 打印邮件
                let blg = await this.GetRightsCheck({ 'optCode': 'otPrintMail', 'moduleCode': 'EM001' })
                if (!blg) {
                    this.$message.error('无权限！')
                    return
                }
                this.openNewWindowTab(window.location.origin + '/pc/mail/print?mId=' + command.mId + '&type=details&accessToken=' +
                    this.getToken().accessToken)
                //  window.location.href =  "/pc/mail/print?mId=" + mIds + "&type=details&accessToken=" + this.getToken().accessToken;
            } else if (command.actionName == 'addMsg') {
                // 设置提醒
                this.$refs.MailAddMsg.showDialog(command.mId)
            }
            if (sign) { // 标识操作
                this.IdentificationMailSettings(data, command.actionName, titleName)
            }
        },
        // 标识设置
        IdentificationMailSettings(data, actionName, titleName) {
            if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                data.ctid = this.subordinateCtid
            } else {
                delete data.ctid
            }
            if (this.selectedBoxId.id == '-9000' && data.type == 'move') {
                data.ctid = 0
            }
            this.$http.post(this.Global.baseURL + this.Global.api.Mail.ManyMaillistPut, data).then(function (res) {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.$emit('LastListCenter', data.mIds, actionName)
                    if (actionName == 'MoveRecyclingStation') { // 删除关闭窗口
                        ep.emit('removeTabAuto', data.mIds)
                    }
                    this.$message.success(titleName + this.$t('mxpcweb.mail.1530005760922')) // "成功"
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, function (res) {
                this.$message.error(res)
            })
        },
        // 彻底删除
        async PhysicalDelete(mIds) {
            let blg = await this.GetRightsCheck({ 'optCode': 'otThoroughDelete', 'moduleCode': 'EM001' })
            if (!blg) {
                this.$message.error('无权限！')
                return
            }
            // this.$confirm("此操作将永久删除, 是否继续？", "提示", {
            this.$confirm(this.$t('mxpcweb.mail.1530005829595'), this.$t('mxpcweb.mail.1528969862511'), {
                confirmButtonText: this.$t('mxpcweb.mail.1528942374762'), // "确定",
                cancelButtonText: this.$t('mxpcweb.mail.1528942364802'), // "取消",
                type: 'warning'
            })
                .then(() => {
                    let data = { mIds: mIds }
                    if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                        data.ctid = this.subordinateCtid
                    } else {
                        delete data.ctid
                    }
                    this.$http.post(this.Global.baseURL + this.Global.api.Mail.mailDelete, data).then(
                        function (res) {
                            if (res.body.code.toString() == this.Global.RES_OK) {
                                this.$message.success(this.$t('mxpcweb.mail.1528970342799'))//, //"删除成功"
                                // this.$emit('UpdataListCenterData', this.DetailData, '3') // 更新列表中的某一条数据  //
                                ep.emit('removeTabAuto', mIds)
                                this.$emit('LastListCenter', mIds, 'PhysicalDelete')
                            } else {
                                this.$message.error(res.body.msg)
                            }
                        },
                        function (res) {
                            this.$message.error(this.$t(this.Global.errorTitle))
                        }
                    )
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('mxpcweb.mail.1528970377709')// "已取消删除"
                    })
                })
        },
        // 移入回收站|垃圾邮箱
        async   MoveRecyclingStation(mIds, boxId) {
            if (this.selectedBoxId.id == 4 && boxId == 4) { // 回收站里面删除
                this.PhysicalDelete(mIds)
                return
            }
            let CheckData = {
                'optCode': 'otDelete',
                'moduleCode': 'EM001'
            }
            if (this.selectedBoxId.id == '-9000') {
                CheckData = {
                    'optCode': 'otDeleteUndistributed',
                    'moduleCode': 'EM001' }
            }
            let blg = await this.GetRightsCheck(CheckData)
            if (!blg) {
                this.$message.error('无权限！')
                return
            }
            // 你确定要删除吗？你确定要移入垃圾箱吗？ 提示
            let title = boxId == 4 ? this.$t('mxpcweb.client.detail.1529997833836') : this.$t('mxpcweb.mail.1543803486081')
            this.$confirm(title, this.$t('mxpcweb.mail.1528969862511'), {
                confirmButtonText: this.$t('mxpcweb.mail.1528942374762'), // "确定",
                cancelButtonText: this.$t('mxpcweb.mail.1528942364802'), // "取消",
                type: 'warning'
            })
                .then(() => {
                    let data = {
                        type: 'move',
                        mIds: mIds,
                        folder: boxId
                    }
                    let title = this.$t('mxpcweb.mail.1528702683911') // "删除";
                    if (boxId == 5) {
                        title = this.$t('mxpcweb.mail.1530078632049') // 移入垃圾邮箱";
                    }
                    this.IdentificationMailSettings(data, 'MoveRecyclingStation', title) //* ******************** */
                })
                .catch(() => { })
        },
        // 归并
        MaileMerge(data, mIds) {
            if (this.selectedBoxId.id == 6) {
                // 草稿箱不允许归并！
                this.$message(this.$t('mxpcweb.mail.1530005247341'))
                return
            } else if (this.selectedBoxId.id == 3) {
                // 发件箱不允许归并！
                this.$message(this.$t('mxpcweb.mail.1530005256564'))
                return
            }
            if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                data.ctid = this.subordinateCtid
            } else {
                delete data.ctid
            }
            this.$http.post(this.Global.baseURL + this.Global.api.Mail.mailMergePost, data).then(function (res) {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.$message.success(this.$t('mxpcweb.mail.1530068902175'))
                    this.$emit('LastListCenter', mIds, 'MaileMerge')
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, function (res) {
                this.$message.error(res)
            })
        },
        async   GetRightsCheck(data) {
            let blg = false
            if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                data.targetCtid = this.subordinateCtid
            } else {
                data.targetCtid = this.company.ctId
            }
            if (this.selectedBoxId.id == '-9000' && data.optCode == 'otDeleteUndistributed') {
                data.targetCtid = 0
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
        //   <!-- 内分发 -->
        DialogInDistribute(mIds, address) {
            if (this.selectedBoxId.id == '-9000') { // 未分发邮箱
                this.$refs.DialogUndistributed.isDialog('open', mIds, address)
            } else {
                this.$refs.DialogInDistribute.isDialog('open', mIds)
            }
        },
        // 标签框弹出
        DialogSetTagShow(item, moduleCode) {
            if (item.tags == undefined) {
                item.tags = []
            }
            this.$refs['dialog-Set-Tags'].DialogSetTagShow(
                item.mId,
                item.tags,
                moduleCode,
                item
            )
        },
        DialogJunkMail(type, data, paramsData) {
            this.$refs.DialogJunkMail.isDialog('open', type, data, paramsData)
        },
        LastListCenter(mIds, action) {
            this.$emit('LastListCenter', mIds, action)
        },
        updateMailData() {
            this.$emit('LastListCenter', [1, 2, 3, 4], 'Comment')
        },
        // 修改主题
        updataSubject(Subject, mId) {
            this.$prompt(this.$t('mxpcweb.mail.1528954325325'), this.$t('mxpcweb.mail.1528969862511'), {
                confirmButtonText: this.$t('mxpcweb.mail.1528942374762'), // "确定",
                cancelButtonText: this.$t('mxpcweb.mail.1528942364802'), // "取消",
                inputValue: Subject
            })
                .then(({
                    value
                }) => {
                    let data = {
                        'type': 'subject',
                        'mIds': [mId],
                        'subject': value
                    }
                    this.IdentificationMailSettings(data, 'updataSubject', this.$t('mxpcweb.mail.1530007073271'))
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('mxpcweb.mail.1530007084674')// 取消输入
                    })
                })
        },
        //   <!-- 移动 -->
        openMovingFolders(mIds, count) {
            this.$refs['dialog-moving-folders'].isDialog('open', mIds, count)
        },
        // 文件下载
        async   getDownload(mId, type, rawData) {
            let data = {
                mId: mId,
                type: type
            }
            if (this.laodown && type == 'all') { // 打包下载
                this.laodown = false
                this.downloadFile(this.Global.baseURL + this.Global.api.v2.mails_download, data)
                let _this = this
                setTimeout(function () {
                    _this.laodown = true
                }, 10000)// 120000
            } else { // eml下载
                this.$http.get(this.Global.baseURL + this.Global.api.v2.mails_download, { params: data }).then(function (res) {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        if (res.body.data.rawData != '') {
                            this.downloadFile(res.body.data.rawData)
                        } else {
                            this.$message.error(this.$t('mxpcweb.mail.1543210474024'))
                        }
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                })
            }
        }

    },
    components: {
        'dialog-junk-mail': DialogJunkMail,
        'dialog-undistributed': DialogUndistributed,
        'dialog-in-distribute': DialogInDistribute,
        'dialog-mail-comment': DialogMailComment,
        'dialog-Set-Tags': DialogSetTags,
        'dialog-mail-addmsg': MailAddMsg,
        'dialog-moving-folders': DialogMovingFolders

    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
</style>
