<template>
    <div class="DialogMail">
        <el-dialog v-dialogDrag :title="title" :visible.sync="isOpen" custom-class="width620" @close="resetForm('dialogUserForm')" :close-on-click-modal="false" >
            <el-form ref="dialogUserForm" label-width="150px">
                <!-- 邮箱帐号 -->
                <el-form-item :label="$t('mxpcweb.mail.1528942508483')" v-if="options.length>1">
                    <el-select filterable v-model="svalue">
                        <el-option v-for="(item,index) in options" :key="index" :label="item.mailAddress" :value="item.mailAddress"> </el-option>
                    </el-select>
                </el-form-item>
                <div v-else class="text-center" style="padding:35px 0 25px; font-size:16px;">
                    <!-- 导入邮箱帐号为 -->
                    {{$t('mxpcweb.mail.1528942511076')}}:{{svalue}}
                </div>
                <div class="text-center" style="padding:0 0 25px;color:#999">{{$t('mxpcweb.mail.1528942511399')}}
                    <!-- 注：多个导入，请选择压缩包（zip） -->
                </div>
                <div>
                    <!-- 取消 -->
                    <el-button style="float: left; margin-left: 200px;margin-right: 20px;" @click="cancelClick()">{{$t('mxpcweb.mail.1528942364802')}}</el-button>
                    <!-- 确定 -->
                    <!-- <label v-show="svalue!=''" class="el-button el-button--primary" type="primary" for="fileidcyy">{{$t('mxpcweb.mail.1528942374762')}}</label> -->
                    <!-- 最大500M -->
                    <file-upload :showList="false" :limitSize="500" @change="pickPicChange" :multiple="false" :spatial="company.cId">
                        <div slot="trigger" class="pickBtn">
                            <label class="el-button el-button--primary" type="primary">{{$t('mxpcweb.mail.1528942374762')}}</label>
                        </div>
                    </file-upload>
                </div>
            </el-form>
        </el-dialog>
        <!-- <input type="file" id="fileidcyy" style="opacity:0;background:red;position:absolute;left:0;top:0;width:100%;height:100%;display:none" accept=".eml,.zip" @change="handleChange($event)"> -->

    </div>
</template>

<script>
/**
 * 描述：邮件部分
 * 作者：向士健(CSS) / ***(API)
 * 时间：2017/12/11
 */

import { isObject, isArray } from '@/libs/utils.js'
import { mapGetters, mapMutations } from 'vuex'
import FileUpload from '@/components/FileUpload/index' // 文件上传
export default {
    name: 'DialogMail',
    props: {},
    data() {
        return {
            isOpen: false, // 弹窗开关
            dialog: false,
            options: [],
            svalue: '',
            boxid: '',
            title: this.$t('mxpcweb.mail.1528971122198'), // "请选择导入邮箱",
            disabledBtn: true
        }
    },
    computed: {
        ...mapGetters('mail', ['treeMenu', 'selectedBoxId', 'subordinateCtid']),
        ...mapGetters(['company']),
        ...mapGetters(['domain'])
    },
    methods: {
        pickPicChange(arry) {
            if (arry.length <= 0) {
                return
            }
            let ParameterData = {
                targetFolder: this.boxid,
                fileInfos: [{
                    fileName: arry[arry.length - 1].name,
                    fid: arry[arry.length - 1].url
                }],
                emailAddress: this.svalue
            }
            this.$http.post(this.Global.baseURL + this.Global.api.v2.internalImport, ParameterData).then(function (res) {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    let _this = this
                    _this.isOpen = false
                    _this.$message.success(res.body.msg)
                    setTimeout(() => {
                        _this.set_refurbishListBool(2) // 刷新列表
                    }, 1000)
                } else {
                    this.$message.error(res.body.msg)
                }
            })
        },
        // 上传eml
        async handleChange(e) {
            var fileName = e.target.files[0].name
            var lastname = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length)
            if (lastname != 'eml' && lastname != 'zip') {
                this.$message.error(this.$t('mxpcweb.mail.1528971123785'))// 目前只支持.eml和zip类型！
                return
            }
            this.isOpen = false
            // let url = this.domain.v2 + "/mails/import";
            let url = this.Global.baseURL + this.Global.api.Mail.mailsImport
            if (url != '') {
                let file = e.target.files[0]
                let fd = new FormData()
                let accessToken = this.getToken()[this.Global.accessToken]
                fd.append('accessToken', accessToken)
                fd.append('a', 'aValue')
                fd.append('targetFolder', this.boxid)
                fd.append('emailAddress', this.svalue)
                fd.append('fileToUpload', file, file.name)
                let mailsImport = await this.$http.post(url, fd)
                if (mailsImport.body.code == this.Global.RES_OK) {
                    this.$message.success(mailsImport.body.msg)
                    if (this.boxid == this.selectedBoxId.id) {
                        // 导入文件夹与选中文件夹一致时。
                        this.set_refurbishListBool(2) // 刷新列表
                    }
                } else {
                    this.$message.success(mailsImport.body.msg)
                }
                e.target.value = ''
            } else {
                this.$message.error(this.$t('mxpcweb.mail.1528971124036'))// 导入异常
            }
        },
        // 清空表单
        resetForm(formName) {
            if (this.isOpen) {
                this.$refs[formName].resetFields()
            }
        },
        // 父组件来调用
        isDialogs(to) {
            if (to == 'open') {
                this.svalue = ''
                this.isOpen = true
                //  $("#fileidcyy").trigger("click");
                this.getPersonalData()
            } else {
                this.isOpen = false
            }
        },

        // 确定
        submitMail() {
            this.isOpen = false
        },
        // 取消
        cancelClick() {
            this.isOpen = false
        },
        selectFile() { },
        // 获取页面数据
        getPersonalData() {
            let data = { type: 'my' }
            if (
                this.subordinateCtid != this.company.ctId &&
                this.subordinateCtid != 0
            ) {
                data.ctid = this.subordinateCtid
            } else {
                delete data.ctid
            }
            let url =
                this.Global.baseURL +
                this.Global.api.SystemSet.mailset.mailaccount.accounts // 当前企业所有账户
            this.$http.get(url, { params: data }).then(
                function (res) {
                    if (
                        res.body.code.toString() == this.Global.RES_OK &&
                        isObject(res.body.data) &&
                        isArray(res.body.data.mailAccountsInfo)
                    ) {
                        let dataR = res.body.data.mailAccountsInfo
                        if (dataR.length > 1) {
                            this.title = this.$t('mxpcweb.mail.1528971122198')// 请选择导入邮箱
                            let list = []
                            for (let i = 0; i < dataR.length; i++) {
                                list.push({
                                    mailAddress: dataR[i].mailAddress,
                                    id: dataR[i].accountId
                                })
                            }
                            this.options = list
                        } else {
                            this.title = this.$t('mxpcweb.mail.1528969862511')// 提示
                            this.svalue = dataR[0].mailAddress
                        }
                    }
                },
                function (res) {
                    this.$message.error(this.$t(this.Global.errorTitle))
                }
            )
        },
        ...mapMutations('mail', {
            set_refurbishListBool: 'SET_REFURBISHLISTBOOL'
        })
    },
    watch: {
        treeMenu: function (newValue, oldValue) {
            if (newValue.type == 'ImportMail') {
                this.isDialogs('open')
                this.boxid = newValue.data.treeData.id
            }
        }
    },
    components: {
        'file-upload': FileUpload
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
