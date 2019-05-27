<template>
    <div class="EditArticle">
        <!-- 文章管理 -->
        <page-detail title="文章管理" :detailTitle="detailTitle" iconfont="icon-article-admin" @toList="pageBack"></page-detail>
        <div class="mainBody MXscroll">
            <transition name="el-fade-in-linear">
                <el-form v-if="!isLoading" class="formBox" ref="articleForm" :model="ArticleForm" :rules="ArticleFormRules" label-position="top" label-width="80px">
                    <el-form-item label="标题" prop="noticeCaption">
                        <el-input :maxlength="64" v-model='ArticleForm.noticeCaption'></el-input>
                        <p class="numTip">{{ArticleForm.noticeCaption.length}}/64</p>
                    </el-form-item>
                    <el-form-item label="摘要" prop="noticeAbstract">
                        <ueditor ref="abstractUeditor" @ready="abstractEditorReady" class="ueditor" :config="abstractConfig" :converContent="ArticleForm.noticeAbstract"></ueditor>
                    </el-form-item>
                    <el-form-item label="作者" prop="author">
                        <el-input :maxlength="8" v-model='ArticleForm.author'></el-input>
                        <p class="numTip">{{ArticleForm.author.length}}/8</p>
                    </el-form-item>
                    <el-form-item label="类型" prop="noticeType">
                        <el-select v-model="ArticleForm.noticeType" placeholder="请选择">
                            <el-option class="selectItem" v-for="item in articleTypes" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="正文" prop="text">
                        <ueditor ref="ueditor" @ready="editorReady" class="ueditor" :config="contentConfig" :converContent="ArticleForm.text"></ueditor>
                    </el-form-item>
                    <el-form-item label="发布时间选项" prop="">
                        <el-select v-model="ArticleForm.noticeState" placeholder="请选择">
                            <el-option class="selectItem" label="立即发送" :value="1">
                            </el-option>
                            <el-option class="selectItem" label="定时发送" :value="2">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="ArticleForm.noticeState==2" label="请选择时间" prop="releaseDate">
                        <el-date-picker type="datetime" :editable="false" v-model="ArticleForm.releaseDate" class="selectItem" placeholder="选择日期" format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                    <div class='my-form-item'>
                        <el-checkbox v-model="popupFlag">弹框提醒</el-checkbox>
                        <el-checkbox v-model="mailFlag">推送邮件</el-checkbox>
                    </div>
                    <div class='my-form-item'>
                        <el-button :loading="isRelease" type="primary" @click="handleCommit()">立即发布</el-button>
                        <el-button :loading="isSave" @click="handleCommit(true)">保存为草稿</el-button>
                        <el-button @click="handlePreview">预览</el-button>
                    </div>
                </el-form>
            </transition>
            <transition name="el-fade-in-linear">
                <loading v-if="isLoading"></loading>
            </transition>
        </div>
        <preview-article ref="previewArticle"></preview-article>
    </div>
</template>

<script>
/**
 * 文章管理
 * 郭兵
 * 2018-07-28
 */
import Loading from '@/basecomponents/Loading/index'
import UEditor from '@/components/UEditor/component.vue' // 编辑器
import PageDetail from '@/components/PageDetail/index' // 大标题
import PreviewArticle from '../PreviewArticle/index'
export default {
    name: 'EditArticle',
    props: {
        moduleCode: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isSave: false,
            isRelease: false,
            isLoading: false,

            type: 'new',
            articleTypes: [{ id: 1, name: '升级日志' }, { id: 2, name: '官方活动' }, { id: 3, name: '企业动态' }],
            ArticleForm: {
                noticeCaption: '',
                noticeAbstract: '',
                author: '',
                text: '',
                noticeState: 1,
                noticeType: 1,
                popupFlag: 0,
                mailFlag: 0,
                releaseDate: ''
            },
            noticeId: '',
            releaseDate: '',
            ArticleFormRules: {
                noticeCaption: [
                    { required: true, message: '请输入标题', trigger: 'blur' },
                    { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
                ],
                noticeAbstract: [
                    { required: true, message: '请输入摘要', trigger: 'blur' }
                ],
                author: [
                    { required: true, message: '请输入作者', trigger: 'blur' },
                    { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
                ],
                noticeType: [
                    { type: 'number', required: true, message: '请选择', trigger: 'blur' }
                ],
                text: [
                    { required: true, message: '请输入内容', trigger: 'blur' }
                ]
            },
            popupFlag: false,
            mailFlag: false,
            contentConfig: {
                // 请输入快速文本内容
                initialContent: '', // 初始化编辑器的内容
                initialFrameHeight: 422, // 内容初始高度
                toolbars: [
                    [
                        'source',
                        '|',
                        'fontfamily',
                        'fontsize',
                        'forecolor',
                        'backcolor',
                        '|',
                        'bold',
                        'italic',
                        'underline',
                        'strikethrough',
                        '|',
                        'rowspacingtop',
                        'rowspacingbottom',
                        'lineheight',
                        '|',
                        'justifyleft',
                        'justifycenter',
                        'justifyright',
                        'justifyjustify',
                        '|',
                        'link',
                        'unlink',
                        'simpleupload',
                        'horizontal',
                        'emotion',
                        'removeformat',
                        'formatmatch',
                        'autotypeset',
                        '|',
                        'inserttable'
                    ]
                ]
            },
            abstractConfig: {
                // 请输入快速文本内容
                initialContent: '', // 初始化编辑器的内容
                initialFrameHeight: 200, // 内容初始高度
                toolbars: [
                    [
                        'source',
                        '|',
                        'fontfamily',
                        'fontsize',
                        'forecolor',
                        'backcolor',
                        '|',
                        'bold',
                        'italic',
                        'underline',
                        'strikethrough',
                        '|',
                        'justifyleft',
                        'justifycenter',
                        'justifyright',
                        'justifyjustify',
                        '|',
                        'horizontal',
                        'emotion',
                        'removeformat',
                        'formatmatch'
                    ]
                ]
            }
        }
    },
    computed: {
        detailTitle() {
            return this.type == 'new' ? '发布文章' : '编辑文章'
        }
    },
    methods: {
        dataInitialize() {
            this.noticeId = ''
            Object.assign(this.ArticleForm, {
                noticeCaption: '',
                noticeAbstract: '&nbsp;',
                author: '',
                text: '&nbsp;',
                noticeState: 1,
                noticeType: 1,
                popupFlag: 0,
                mailFlag: 0,
                releaseDate: ''
            })
        },
        pageBack() {
            this.dataInitialize()
            this.$emit('pageBack')
        },
        editSuccessBack() {
            this.dataInitialize()
            this.$emit('editSuccess')
        },
        // 编辑器加载完成时
        editorReady(instance) {
            instance.setContent(this.ArticleForm.text) // 设置初始值放进来，不设置则为 config 里的 initialContent 值
        },
        abstractEditorReady(instance) {
            instance.setContent(this.ArticleForm.noticeAbstract)
        },
        open(type, noticeId) {
            this.type = type
            if (type == 'edit') {
                this.noticeId = noticeId
                this.getDetail()
            }
        },
        /*  releaseDataChange(val) {
             this.ArticleForm.releaseDate = val
         }, */
        validateContent() {
            return new Promise((resolve, reject) => {
                this.$refs['articleForm'].validate(valid => {
                    if (valid) {
                        resolve({ flag: true })
                    } else {
                        resolve({ flag: false })
                    }
                })
            })
        },
        async  handleCommit(isDraft = false) {
            this.ArticleForm.text = this.$refs.ueditor.getContent()
            this.ArticleForm.noticeAbstract = this.$refs.abstractUeditor.getContent()
            let valid = await this.validateContent()
            if (!valid.flag) {
                this.$message.error('缺少必填字段')
                return false
            }

            let data = Object.assign({}, this.ArticleForm)
            if (isDraft) {
                this.isSave = true
                Object.assign(data, { noticeState: 0 })
            } else {
                this.isRelease = true
            }
            if (this.releaseDate) {
                Object.assign(data, { releaseDate: this.releaseDate })
            }
            let Http
            if (this.type == 'new') {
                let url = this.Global.baseURL + this.Global.api.v2.sysNotice_add
                Http = this.$http.post(url, { detail: data })
            } else {
                let p = Object.assign({}, { detail: data, type: 'edit', noticeId: this.noticeId })
                let url = this.Global.baseURL + this.Global.api.v2.sysNotice_put
                Http = this.$http.put(url, p)
            }
            Http.then(res => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.editSuccessBack()
                } else {
                    this.$message.error(this.msg(res.body))
                }
                this.isSave = false
                this.isRelease = false
            }).catch(err => {
                this.isSave = false
                this.isRelease = false
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        handlePreview() {
            this.ArticleForm.text = this.$refs.ueditor.getContent()
            this.$refs.previewArticle.show(this.ArticleForm)
        },
        getDetail() {
            this.isLoading = true
            let url = this.Global.baseURL + this.Global.api.v2.sysNotice_get
            let params = {
                type: 'detail',
                noticeId: this.noticeId,
                moduleCode: this.moduleCode
            }
            this.$http.get(url, { params })
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        let { author, mailFlag, noticeAbstract, noticeCaption, noticeState, noticeType, popupFlag, releaseDate, text } = res.body.data.detail
                        if (noticeState == 0) {
                            noticeState = 1
                        }
                        if (releaseDate) {
                            releaseDate = releaseDate.replace(/\-/g, '/')
                        }

                        this.ArticleForm = { author, mailFlag, noticeAbstract, noticeCaption, noticeState, noticeType, popupFlag, releaseDate, text }
                        // this.releaseDate = releaseDate
                        this.popupFlag = popupFlag == 1
                        this.mailFlag = mailFlag == 1
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                    this.isLoading = false
                })
                .catch(err => {
                    this.isLoading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        dateFormat(time, format) {
            var t = new Date(time)
            var tf = function (i) {
                return (i < 10 ? '0' : '') + i
            }
            return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
                switch (a) {
                    case 'yyyy':
                        return tf(t.getFullYear())
                        break
                    case 'MM':
                        return tf(t.getMonth() + 1)
                        break
                    case 'mm':
                        return tf(t.getMinutes())
                        break
                    case 'dd':
                        return tf(t.getDate())
                        break
                    case 'HH':
                        return tf(t.getHours())
                        break
                    case 'ss':
                        return tf(t.getSeconds())
                        break
                }
            })
        }
    },
    watch: {
        popupFlag() {
            this.ArticleForm.popupFlag = this.popupFlag ? 1 : 0
        },
        mailFlag() {
            this.ArticleForm.mailFlag = this.mailFlag ? 1 : 0
        },
        'ArticleForm.noticeState': function () {
            if (this.ArticleForm.noticeState == 2) {
                this.ArticleFormRules['releaseDate'] = [{ required: true, message: '请选择日期' }]
            } else {
                delete this.ArticleFormRules.releaseDate
            }
        },
        'ArticleForm.releaseDate': function () {
            if (this.ArticleForm.releaseDate) {
                this.releaseDate = this.dateFormat(this.ArticleForm.releaseDate, 'yyyy-MM-dd HH:mm:ss')
                console.log(this.releaseDate)
            } else {
                this.releaseDate = ''
            }
        }
    },
    components: {
        'page-detail': PageDetail,
        'ueditor': UEditor,
        'loading': Loading,
        'preview-article': PreviewArticle
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../../../public-zh-cn.less";
@import "../../../public-en.less";
@import "./zh-cn.less";
@import "./en.less";
</style>
