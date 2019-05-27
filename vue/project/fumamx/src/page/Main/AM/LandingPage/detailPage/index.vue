<template>
    <div class="addPage">
        <page-detail :detailTitle="subtitle" @toList="$emit('changeTabData','3')"></page-detail>
        <div class="list">
            <div class="wrapBox">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="chioceModule" labelPosition="left">
                    <el-form-item label="页面地址url" prop="formUrl">
                        <el-input type="text" v-model="ruleForm.formUrl" auto-complete="off"></el-input>
                        <el-tooltip class="item" effect="dark" content="请输入有效的网页表单所属站点的URL，以“http://或https://”开始。如果您希望多个站点公用该 表单或不确定表单所属网站，您可以输入符号*。" placement="right-start">
                            <span class="tips"><i class="iconfont icon-ask-mark"></i></span>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item label="目标网页url" prop="targetUrl">
                        <el-input type="text" v-model="ruleForm.targetUrl" auto-complete="off"></el-input>
                        <el-tooltip class="item" effect="dark" content="请输入表单提交后返回给访问者的页面URL，以http://或https://开始且长度不能超过255个字符" placement="right">
                            <span class="tips"><i class="iconfont icon-ask-mark"></i></span>
                        </el-tooltip>
                    </el-form-item>
                    <!-- <el-form-item label="添加标签" prop="labelIds">
                        <el-input type="text" v-model="ruleForm.labelIds" auto-complete="off"></el-input>
                    </el-form-item> -->
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')" :loading="loading">保存</el-button>
                        <el-button type="primary" @click="cancelSubmit">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <!-- 设置弹窗 -->
        <!-- <dialog-wrap ref="dialogWrap"></dialog-wrap> -->
    </div>
</template>

<script>
import PageDetail from '@/components/PageDetail/index' // 大标题
import draggable from 'vuedraggable'
import { mapGetters } from 'vuex'
import dialogInset from './DialogInset/index'
import { goodsEncrypt } from '@/libs/utils.js'

export default {
    name: 'List',
    data() {
        let validcodeName = (rule, value, callback) => {
            let reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
            if (!reg.test(value) && value !== '*') {
                callback(new Error('请输入有效的网页地址'))
            } else {
                callback()
            }
        }
        let validcodeName02 = (rule, value, callback) => {
            let reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
            if (!reg.test(value) && value !== '*' && value !== '') {
                callback(new Error('请输入有效的网页地址'))
            } else {
                callback()
            }
        }
        return {
            loading: false,
            subtitle: '页面详情',
            ruleForm: {
                formUrl: '',
                targetUrl: '',
                labelIds: ''
            },
            rules: {
                targetUrl: [
                    { required: false, message: '请输入有效目标网页', trigger: 'blur' },
                    { validator: validcodeName02, trigger: 'blur' }
                ],
                formUrl: [
                    { required: true, message: '请输入有效落地页', trigger: 'blur' },
                    { validator: validcodeName, trigger: 'blur' }
                ]
            },
            targetData: {},
            isEdit: false,
            embedCode: '',
            iFrameCode: '',
            jsWrapCode: '',
            setFormCopy: this.setFormData
        }
    },
    created() {
        this.editPage()
    },
    computed: {
        ...mapGetters(['company'])
    },
    mounted() { },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addLandingPage()
                    // this.$refs.dialogWrap.open()
                } else {
                    return false
                }
            })
        },
        editPage() { // 如果是编辑页面
            if (this.setFormCopy.targetUrl) {
                this.isEdit = true
                this.ruleForm.formUrl = this.setFormCopy.formUrl
                this.ruleForm.targetUrl = this.setFormCopy.targetUrl
                this.ruleForm.labelIds = this.setFormCopy.labelId
            }
        },
        cancelSubmit() {
            this.$emit('changeTabData', '1')
        },
        arrangeData() {
            let newArrange = []
            this.setFormCopy.landingPageField.map(function (item, i) {
                newArrange[i] = {}
                newArrange[i].fieldName = item.fieldName // 字段名
                newArrange[i].isNotNull = item.isNotNull
                newArrange[i].helpUrl = item.helpUrl
                newArrange[i].hideFlag = item.hideFlag
                newArrange[i].helpText = item.helpText
                newArrange[i].fieldId = item.fieldId.toString()
            })
            for (var value of newArrange) {
                if (!value.helpText) {
                    delete value.helpText
                }
                if (!value.helpUrl) {
                    delete value.helpUrl
                }
                if (value.hideFlag === true) {
                    value.hideFlag = 1
                } else {
                    value.hideFlag = 0
                }
                if (value.isNotNull === true) {
                    value.isNotNull = 1
                } else if (value.isNotNull === false) {
                    value.isNotNull = 0
                }
            }
            this.targetData = this.setFormCopy
            return newArrange
        },
        addLandingPage() {
            this.creatHtml()
            let arrangeField = this.arrangeData() // 处理数据
            let _this = this
            let required = {
                pageName: '表达标题',
                moduleCode: '所属模块号',
                isPublic: '是否公开',
                formUrl: '表单url',
                iFrameCode: 'iFrameCode代码'
            }
            let data = {
                pageName: this.targetData.pageName,
                moduleCode: this.targetData.moduleCode,
                isPublic: this.targetData.isPublic,
                targetUrl: this.ruleForm.targetUrl,
                labelIds: this.ruleForm.labelIds,
                formUrl: this.ruleForm.formUrl,
                landingPageField: arrangeField,
                originalCode: this.originalCode,
                embedCode: this.embedCode,
                jsWrapCode: this.jsWrapCode,
                iFrameCode: this.iFrameCode
            }
            let valid = Object.keys(required).filter(function (item) {
                if (!data[item] && data[item] !== 0) {
                    _this.$message.error(required[item] + '不能为空！')
                    return false
                }
                return true
            })
            data.isPublic = parseInt(this.targetData.isPublic)
            if (valid.length !== Object.keys(required).length) {
                return false
            }
            _this.loading = true
            if (this.isEdit) { // 编辑页面
                data.type = 'edit'
                data.pageId = this.setFormCopy.pageId
                _this.$http.put(this.Global.baseURL + this.Global.api.v2.landingPage, data).then(function (res) {
                    _this.loading = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        _this.$emit('changeTabData', '1')
                    } else {
                        _this.$message.error(this.msg(res.body))
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            } else { // 新增页面
                _this.$http.post(this.Global.baseURL + this.Global.api.v2.landingPage, data).then(function (res) {
                    _this.loading = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        _this.$emit('changeTabData', '1')
                    } else {
                        _this.$message.error(this.msg(res.body))
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            }
        },
        creatHtml() {
            let formId = this.company.ctId + '_' + parseInt(Math.random() * 1000)
            let color = this.setFormCopy.diyStyle.color
            let fontFamily = this.setFormCopy.diyStyle.fontFamily
            let fontSize = this.setFormCopy.diyStyle.fontsize
            let background = this.setFormCopy.diyStyle.background
            let url = 'https://' + window.location.hostname + '/pcapi/v2/landingPageDocument'
            let cId = this.company.cId
            let textalign = this.setFormCopy.diyStyle.textalign
            let htmlCode = '<div style="position: fixed;left: 0;right: 0;top: 0;bottom: 0;background-color: rgba(0,0,0,0.3)" id="boxLandingPage">'
            htmlCode += '<div id="fumamxForm" style="width:640px;margin:auto;position: absolute;left: 50%;transform: translateX(-50%);background: #fff;border-radius: 2px;box-shadow: 0 1px 3px rgba(0,0,0,.3);box-sizing: border-box;top: 20%;padding: 20px;background:' + background + '">'
            htmlCode += '<form action="' + url + '" name="' + formId + '" method="POST" accept-charset="UTF-8" enctype="multipart/form-data" style="overflow:hidden">'
            htmlCode += '<style>tr , td { padding:6px;border-spacing:0px;border-width:0px;}, input[type="reset"] {} input[type="text"], select, textarea {height: 30px;border :1px solid #DFE2E4;padding: 0 1%;border-radius: 5px;} .textarea {height:60px} @media screen and (max-width: 600px) {table {width: 100%!important;margin: 0 auto;} #fumamxForm {width: 96%!important;box-shadow: 0px 0px 20px rgba( 0, 0, 0, 0.6 );padding: 10px 10px 0px 10px!important;}}</style>'
            htmlCode += '<input type="hidden" name="pageId" value="fumumx_page_id"/>' + '<input type="hidden" name="cId" value="' + goodsEncrypt(cId) + '"/>'
            htmlCode += '<input type="hidden" name="url" value="" id="url" />'
            htmlCode += '<table style="width:600px;background-color:' + background + ';color:' + color + '">'
            htmlCode += '<tr><td colspan="3" style="text-align:' + 'center' + ';color:' + color + ';font-family:' + fontFamily + ';font-size:' + fontSize + ';"><strong>' + this.setFormCopy.pageName + '</strong></td></tr>'
            let required = []
            let requiredLabel = []
            let list = this.setFormCopy.landingPageField
            for (var item of list) {
                let isDisplay = ''
                if (item.hideFlag) {
                    isDisplay = 'display:none'
                }
                if (item.isNotNull === 1 || item.isNotNull == true) {
                    required.push(item.fieldName)
                    requiredLabel.push(item.cnFieldCaption)
                }
                if (!item.value) {
                    item.value = ''
                }
                htmlCode += '<tr style="' + isDisplay + '"><td  style="nowrap:nowrap;text-align:' + textalign + ';font-size:12px;font-family:' + fontFamily + ';width:28%;">' + item.cnFieldCaption
                if (item.isNotNull) {
                    htmlCode += '<span style="color:red;">*</span>'
                }
                let helpText = ''
                let helpUrl = ''
                if (item.helpText) {
                    helpText = item.helpText
                }
                if (item.helpUrl) {
                    helpUrl = 'href="' + item.helpUrl + '"'
                }
                htmlCode += '</td><td style="width:48%;">'
                if (item.controlTypeId === 4) {
                    htmlCode += '<textarea style="width:100%;height:60px" name="' + item.fieldName + '">' + item.value + '</textarea>'
                } else if (item.controlTypeId == 2) {
                    htmlCode += '<select style="width:100%;" name="' + item.fieldName + '" value="' + item.value + '">'
                    htmlCode += '<option value="">请选择</option>'
                    item.options.map(function (option) {
                        htmlCode += '<option value="' + option.dictItemCode + '">' + option.itemName + '</option>'
                    })
                    htmlCode += '</select>'
                } else {
                    htmlCode += '<input type="text" style="width:100%;"  maxlength="100" name="' + item.fieldName + '" value="' + item.value + '" />'
                }
                htmlCode += '</td>'
                htmlCode += '<td ><a ' + helpUrl + '>' + helpText + '</a></td></tr>'
            }
            htmlCode += '<tr><td colspan="3" style="text-align:center; padding-top:15px;font-size:12px;"><input style="font-size:12px;outline: none;padding: 10px 15px;border-radius: 4px;font-size: 14px;background: #20a0ff;color: #fff!important;margin-right: 20px;cursor: pointer;border:none"  type="button" onclick="check' + formId + '()" value="提交"/><input  type="reset" style="font-size:12px;outline: none;padding: 10px 15px;border-radius: 4px;font-size: 14px;background: #fff!important;color: #606266!important;border: 1px solid #DFE2E4;cursor: pointer;" value="重置" /></td></tr></table>'
            htmlCode += '<script>'
            htmlCode += 'var url = document.getElementById("url");var getUrl = window.location.href;url.value = getUrl;'
            htmlCode += 'var reqFields = new Array("' + required.join('","') + '");'
            htmlCode += 'var reqFieldsName = new Array("' + requiredLabel.join('","') + '");'
            htmlCode += 'function check' + formId + '() {'
            htmlCode += 'for(i=0;i<reqFields.length;i++) {'
            htmlCode += 'var fieldObj=document.forms["' + formId + '"][reqFields[i]];'
            htmlCode += 'if(fieldObj) {'
            htmlCode += 'if (((fieldObj.value).replace(/^\s+|\s+$/g, "")).length==0) {'
            htmlCode += 'alert(reqFieldsName[i] +" 不能为空");'
            htmlCode += 'fieldObj.focus();'
            htmlCode += 'return false;'
            htmlCode += '}'
            htmlCode += '}'
            htmlCode += '}'
            htmlCode += 'document.forms["' + formId + '"].submit()'
            htmlCode += '};'
            htmlCode += 'function showdiv(){document.getElementById("boxLandingPage").style.display = document.getElementById("boxLandingPage").style.display=="none"?"block":"none"};'
            htmlCode += '<' + '/script>'
            htmlCode += '</form>'
            htmlCode += '</div>'
            htmlCode += '</div>'
            this.originalCode = htmlCode
            this.iFrameCode = htmlCode
            let jsWCode = htmlCode + '<script>' + 'window.onload = function(){ document.getElementById("boxLandingPage").style.display="none"}' + '<' + '/script>'
            this.embedCode = "document.write('" + htmlCode + " ')"
            this.jsWrapCode = "document.write('" + jsWCode + " ')"
        }
    },
    props: {
        setFormData: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    components: {
        'page-detail': PageDetail,
        'draggable': draggable,
        'dialog-wrap': dialogInset
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
