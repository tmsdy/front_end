<template>
    <div class="TemplateEditor" v-if="visible">
        <div class="zoneHeader">
            <el-form>
                <el-form-item class="pull-right">
                    <!-- 取消 -->
                    <el-button @click="calcelEdit()">{{$t('fumamx-web-templateeditor.1531901134034')}}</el-button>
                    <!-- 预览 -->
                    <el-button @click="$refs.preview.isShowEditor(cmContent)">{{$t('fumamx-web-templateeditor.1531901186688')}}</el-button>
                    <!-- 确定(新增时) -->
                    <el-button type="primary" v-if="isAdding" @click="submitAdd()">{{$t('fumamx-web-templateeditor.1531901211609')}}</el-button>
                    <!-- 确定(编辑时) -->
                    <el-button type="primary" v-else @click="submitEdit()">{{$t('fumamx-web-templateeditor.1531901211609')}}</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="zoneBody">

            <div class="zoneLeft">
                <iframe ref="iframePC" src="/static/mail/view.html" @load="loadedContent" class="MXscroll" scrolling="auto" frameborder="0" marginheight="0" marginwidth="0" width="100%" height="100%"></iframe>
            </div>

            <div class="zoneRight">
                <el-form>
                    <!-- 邮件主题 -->
                    <el-form-item>
                        <div class="labelSubject" slot='label'>{{$t('fumamx-web-templateeditor.1531894805040')}}</div>
                        <!-- 请输入邮件主题 -->
                        <el-input v-model="addTempSubject" ref="addTempSubject" :maxlength="100" :placeholder="'('+$t('mxpcweb.systemset.bizfield.1530328470247')+') '+$t('mxpcweb.companyregister.1528875730696',{a:100})"></el-input>
                    </el-form-item>
                    <!-- 邮件摘要 -->
                    <el-form-item>
                        <div class="labelSubject" slot='label'>{{$t('fumamx-web-templateeditor.1531895008420')}}</div>
                        <!-- 请输入邮件摘要 -->
                        <el-input v-model="addTempSummary" ref="addTempSummary" :maxlength="20" :placeholder="'('+$t('fumamx-web-templateeditor.1533090068719')+') '+$t('mxpcweb.companyregister.1528875730696',{a:20})"></el-input>
                    </el-form-item>
                </el-form>
                <codemirror v-if="visible" :value="cmContent" :options="cmOptions" @changes="changes"></codemirror>
            </div>
        </div>
        <!-- 预览 -->
        <editor-preview ref="preview"></editor-preview>
    </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import editorPreview from '@/components/editorPreview/index' // 预览

export default {
    name: 'TemplateEditor',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        TemplateID: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isAdding: null, // 用来判断 新增/编辑
            cmOptions: {
                lineNumbers: true,
                mode: 'text/html',
                indentUnit: 5,
                indentWithTabs: true,
                autofocus: true
            },
            cmContent: '',
            addTempName: '',
            addTempSubject: '',
            addTempSummary: '',
            addTempType: 0, // 0：触发，1：批量
            moduleCode: '',
            addTempIsPublic: '0'
        }
    },
    created() {

    },
    mounted() { },
    methods: {
        loadedContent() {
            try {
                this.$refs.iframePC.contentWindow.initHtml(this.cmContent)
            } catch (e) {
                console.log('this.$refs.iframePC.contentWindow.initHtml(this.cmContent)')
            }
        },
        changes(e) {
            this.cmContent = e.getValue()
            this.loadedContent()
        },
        // 关掉编辑时
        calcelEdit() {
            let title = this.$t('fumamx-web-templateeditor.1531904183099') // 提示
            let msg = this.$t('fumamx-web-templateeditor.1531903987620') // 将关闭当前编辑器？
            let sure = this.$t('fumamx-web-templateeditor.1531901211609') // 确定
            let cancel = this.$t('fumamx-web-templateeditor.1531901134034') // 取消
            this.$confirm(msg, title, {
                confirmButtonText: sure,
                cancelButtonText: cancel,
                type: 'warning'
            }).then(() => {
                this.closeEditor()
            }).catch(() => { })
        },
        // 取消，清零
        closeEditor() {
            this.$emit('update:visible', false)
            this.cmContent = this.addTempName = this.addTempSubject = this.addTempSummary = ''
            this.isAdding = null
        },
        addOneTemp(option) {
            this.isAdding = true // 改为新增状态
            this.addTempName = option.name
            this.addTempType = option.type
            this.moduleCode = option.moduleCode
            this.addTempIsPublic = option.IsPublic
        },
        // 提交检查
        submitCheck() {
            if (this.addTempSubject == '') {
                this.$refs.addTempSubject.$refs.input.focus()
                this.$message(this.$t('fumamx-web-templateeditor.1531896646036')) // 请输入邮件主题
                return false
            }
            // if (this.addTempSummary == '') {
            //     this.$refs.addTempSummary.$refs.input.focus()
            //     this.$message(this.$t('fumamx-web-templateeditor.1531896677900')) // 请输入邮件摘要
            //     return false
            // }
            if (this.cmContent == '') {
                this.$message(this.$t('mxpcweb.systemset.feedback.1529067191488')) // 请输入内容
                return false
            }
            return true
        },
        // 提交新增
        submitAdd() {
            if (!this.submitCheck()) { return }
            let _this = this
            _this.$http.post(this.Global.baseURL + this.Global.api.v2.template_add, {
                'name': this.addTempName,
                'subject': this.addTempSubject,
                'summary': this.addTempSummary,
                'templateType': this.addTempType,
                'editType': 1,
                'htmlObject': {
                    'html': this.cmContent
                },
                'isPublic': this.addTempIsPublic,
                'moduleCode': this.moduleCode
            }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message.success(res.body.msg)
                    _this.$emit('success')
                    _this.closeEditor() // 关窗
                } else {
                    _this.$message.error(res.body.msg)
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 提交编辑
        submitEdit() {
            if (!this.submitCheck()) { return }
            let _this = this
            _this.$http.put(this.Global.baseURL + this.Global.api.v2.template_update, {
                'name': this.addTempName,
                'subject': this.addTempSubject,
                'summary': this.addTempSummary,
                'templateType': this.addTempType,
                'editType': 1,
                'htmlObject': {
                    'html': this.cmContent
                },
                'invokeName': this.TemplateID,
                'isPublic': this.addTempIsPublic,
                'moduleCode': this.moduleCode
            }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message.success(res.body.msg)
                    _this.$emit('success')
                    _this.closeEditor() // 关窗
                } else {
                    _this.$message.error(res.body.msg)
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 用ID 查内容，进行编辑
        getData() {
            // console.log('eeeeeeeeeee dit')
            let _this = this
            _this.$http.get(this.Global.baseURL + this.Global.api.v2.template_one, { params: { invokeName: this.TemplateID } }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    // this.loading = false
                    let backData = res.body.data
                    // console.log(backData)
                    _this.addTempName = backData.name
                    _this.addTempSubject = backData.subject
                    _this.addTempSummary = backData.summary
                    _this.addTempType = backData.type
                    _this.cmContent = backData.html
                    _this.addTempIsPublic = backData.isPublic
                    _this.moduleCode = backData.moduleCode
                    _this.loadedContent() // 加载 iframe 内容加
                } else {
                    console.log('返回数据有误')
                    _this.$message.error(res.body.msg)
                    // _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        }
    },
    components: {
        codemirror,
        'editor-preview': editorPreview
    },
    watch: {
        visible: function (newval) {
            // if (newval) {
            //     this.loading = true
            // }
            // 当打开，且为编辑时，用ID 查内容
            if (newval && !this.isAdding) {
                this.getData()
            }
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
