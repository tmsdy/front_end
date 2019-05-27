<template>
    <div class="DialogJunkMail">
        <!-- 举报垃圾邮件 -->
        <el-dialog v-dialogDrag :title="$t('mxpcweb.mail.1528953816947')" :visible.sync="isOpen" custom-class="width420" @close="resetForm('dialog')" :modal-append-to-body="false" :close-on-click-modal="false" >

            <el-form :model="dialog" :rules="dialogRules" ref="dialog" label-position="top">
                <el-form-item label="" prop="" class="marginTop-10">
                    <!-- 该邮件为垃圾邮件 -->
                    <el-radio class="radio" v-model="radioValue" label="1">{{$t('mxpcweb.mail.1528953824967')}}</el-radio>
                    <!-- 该邮件无法正常显示 -->
                    <el-radio class="radio" v-model="radioValue" label="2">{{$t('mxpcweb.mail.1528953825278')}}</el-radio>
                </el-form-item>
                <div v-if="radioValue==1">
                    <el-form-item prop="mail" class="marginTop-10">
                        <!-- 请输入要举报的邮件地址 -->
                        <el-input v-model.trim="dialog.junkMailText" :placeholder="$t('mxpcweb.mail.1530003014086')" class="widthFull"></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="" class="marginTop-10">
                        <!-- 该地址所有邮件移入垃圾箱 -->
                        <el-checkbox v-model="dialog.moveAll">{{$t('mxpcweb.mail.1531104373046')}}</el-checkbox>
                    </el-form-item>
                    <el-form-item label="" prop="" class="marginTop-10">
                        <!-- 将以上地址加入黑名单 -->
                        <el-checkbox v-model="dialog.isBlack">{{$t('mxpcweb.mail.1531104384704')}}</el-checkbox>
                        <!-- （再次收到以上发件人的邮件将会放到垃圾邮件中） -->
                        <div class="notice">{{$t('mxpcweb.mail.1531104394796')}}</div>
                    </el-form-item>
                    <br>
                    <br>
                </div>
                <div v-else>
                    <el-form-item prop="mail" class="marginTop-10">
                        <!-- 请描述该封邮件的问题，孚盟MX工程师将尽快处理您的问题同时保护您的数据隐私！ -->
                        <el-input type="textarea" :rows="7" :placeholder="$t('mxpcweb.mail.1528953839164')" v-model="textarea">
                        </el-input>
                    </el-form-item>
                </div>

                <div class="text-center">
                    <el-button class="footerButton" @click="isOpen = false">{{$t('mxpcweb.mail.1528942364802')}}</el-button>
                    <!-- 保存 -->
                    <el-button type="primary" :loading="submitLoading" @click="submit('dialog')">{{$t('mxpcweb.mail.1528786401856')}}</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { isArray } from '@/libs/utils.js'
import { mapGetters } from 'vuex'
/**
 * 描述：邮件部分
 * 作者：向士健(CSS) / ***(API)
 * 时间：2017/12/11
 */
export default {
    name: 'DialogJunkMail',
    props: {},
    data() {
        let _this = this
        return {
            isOpen: false, // 弹窗开关
            dialog: {
                junkMailList: [],
                isBlack: true,
                junkMailText: '',
                junkOwnerMailAccount: '',
                junkMid: '',
                type: '',
                moveAll: true,
                paramsData: []

            },
            dialogRules: {
                junkMailText: [
                    {
                        required: true,
                        message: _this.$t('mxpcweb.mail.1530003014086'), // "请输入要举报的邮件地址",
                        trigger: 'blur'
                    },
                    { type: 'email', message: _this.$t('mxpcweb.mail.1528975214854'), trigger: 'blur' }, // "请输入正确的邮箱地址"
                    { min: 1, max: 50, message: _this.$t('mxpcweb.mail.1528975214139'), trigger: 'blur' }// 长度在 1 到 50 个字符
                ]
            },
            radioValue: '1',
            textarea: '', // 乱码问题描述
            submitLoading: false
        }
    },
    computed: {
        ...mapGetters([
            'company'
        ]),
        ...mapGetters('mail', [
            'subordinateCtid'
        ])
    },
    watch: {
        'dialog.isBlack': {
            handler: (val, oldVal) => { }
        },
        'dialog.junkMailList': 'changeJunkText'
    },
    methods: {
        /**
         * 改变举报地址
         */
        changeJunkText(newVal, oldVal) {
            if (isArray(newVal)) {
                newVal.forEach(element => {
                    this.dialog.junkMailText = this.dialog.junkMailText + element.junkMailAddress + ';'
                    this.dialog.junkOwnerMailAccount = this.dialog.junkOwnerMailAccount + element.ownerMailAddress + ';'
                    this.dialog.junkMid = this.dialog.junkMid + element.mid + ','
                })
                this.dialog.junkMailText = this.dialog.junkMailText.substr(0, this.dialog.junkMailText.length - 1)
                this.dialog.junkOwnerMailAccount = this.dialog.junkOwnerMailAccount.substr(0, this.dialog.junkOwnerMailAccount.length - 1)
                this.dialog.junkMid = this.dialog.junkMid.substr(0, this.dialog.junkMid.length - 1)
            }
        },
        // 父组件来调用
        isDialog(to, type, data, paramsData) {
            if (to == 'open') {
                this.isOpen = true
                this.dialog.type = type
                this.dialog.junkMailList = data
                this.paramsData = paramsData
            } else {
                this.isOpen = false
                this.dialog.type = ''
                this.dialog.junkMailList = []
                this.textarea = ''
                this.paramsData = []
            }
        },
        /** @augments
         * 清空数据
         */
        clearData() {
            this.isOpen = false
            this.dialog.junkMailText = ''
            this.dialog.junkMailList = []
            this.dialog.isBlack = true
            this.dialog.junkOwnerMailAccount = ''
            this.dialog.junkMid = ''
            this.dialog.type = ''
            this.textarea = ''
            this.paramsData = []
        },
        // 提交
        submit(formName) {
            this.submitLoading = true
            let _this = this
            if (this.radioValue == '1') {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        // 为下属操作才有ctid
                        let data = {
                            blackListFlag: _this.dialog.isBlack,
                            mId: this.dialog.junkMid,
                            type: _this.dialog.type,
                            fromAddress: this.dialog.junkMailText,
                            mailAccount: this.dialog.junkOwnerMailAccount,
                            moveAll: this.dialog.moveAll
                        }
                        if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                            data.ctid = this.subordinateCtid
                        } else {
                            delete data.ctid
                        }
                        _this.$http.post(_this.Global.baseURL + _this.Global.api.Mail.mailsSpamSetPost, data)
                            .then(
                                function (res) {
                                    // console.log(res);
                                    if (res.body.code.toString() == _this.Global.RES_OK) {
                                        _this.$message.success(this.$t('mxpcweb.mail.1530003051672'))// "举报成功!"
                                        _this.submitLoading = false
                                        _this.clearData()
                                        _this.$emit('LastListCenter', [1, 2, 3, 4], 'JunkMail')
                                    } else {
                                        _this.submitLoading = false
                                        _this.$message.error(_this.msg(res.body))
                                    }
                                },
                                function (res) {
                                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                                }
                            )
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            } else {
                if (this.textarea == '') {
                    _this.$message.error(_this.$t('mxpcweb.mail.1534992915484'))
                    _this.submitLoading = false
                    return
                }
                let mIds = []
                let fileIds = []
                for (let index = 0; index < this.paramsData.length; index++) {
                    const element = this.paramsData[index]
                    mIds.push(element.mid)
                    fileIds.push({
                        'mailId': element.mid,
                        'ctId': this.company.ctId,
                        'cId': this.company.cId,
                        'billId': element.mid,
                        'custId': '',
                        'fileName': element.subject + '.eml',
                        'size': element.size == undefined ? 0 : element.size
                        // "rawData": element.rawData == undefined ? "" : element.rawData
                    })
                }
                /*
               let Parmars = {
                   'moduleCode': 'EM001',
                   'content': this.textarea,
                   'caption': this.$t('mxpcweb.mail.1530003870079'), // "举报乱码邮件",
                   'category': '1',
                   'custId': '',
                   'priority': '1',
                   'sourceId': 'pc',
                   'mobile': '',
                   'eMail': '',
                   'fileIds': fileIds
               }
               this.$http.post(this.Global.baseURL + this.Global.api.v2.workOrder_add, Parmars).then(function (res) {
                   if (res.body.code.toString() == this.Global.RES_OK) {
                   } else {
                       this.$message.error(this.msg(res.body))
                   }
               }, function (res) {
                   this.$message.error(this.$t(this.Global.errorTitle))
                   this.loading = false
               })
               */
                // 报告乱码邮件
                let data = {
                    mIds: mIds,
                    type: 'messy'
                }
                if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                    data.ctid = this.subordinateCtid
                } else {
                    delete data.ctid
                }
                this.$http.post(this.Global.baseURL + this.Global.api.Mail.ManyMaillistPut, data).then(function (res) {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.$message.success(this.$t('mxpcweb.mail.1530003051672'))// "举报成功!"
                        this.clearData()
                        _this.submitLoading = false
                    }
                })
            }
        },
        // 清空表单
        resetForm(formName) {
            this.clearData()
            this.$refs[formName].resetFields()
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
