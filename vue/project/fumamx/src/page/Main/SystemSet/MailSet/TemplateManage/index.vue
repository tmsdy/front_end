<template>
    <div class="mainWrap TemplateManage">
        <!--大标题-->
        <!-- 模板管理 -->
        <page-title :title="$t('mxpcweb.systemset.mailset.templatemanage.1528976806117')" iconfont="icon-mail"></page-title>

        <div class="mainBody MXscroll" style="padding:15px 0;">

            <el-form :inline="true" style="padding-bottom:0;">
                <el-form-item label="" prop="">
                    <!-- 请选择 -->
                    <el-select v-model="queryPara.type" size="small" :placeholder="$t('mxpcweb.systemset.mailset.templatemanage.1528976864694')" @change="loadAccountAndDefaultTemplate()" style="width:200px;">
                        <!-- 全公司 -->
                        <el-option :label="$t('mxpcweb.systemset.mailset.templatemanage.1528976893020')" value="all"></el-option>
                        <!-- 我的模板 -->
                        <el-option :label="$t('mxpcweb.systemset.mailset.templatemanage.1528976916829')" value="my"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" prop="">
                    <!-- 新增模板 -->
                    <el-button type="primary" @click="showDialog($t('mxpcweb.systemset.mailset.templatemanage.1528976836916'))" size="small">{{$t('mxpcweb.systemset.mailset.templatemanage.1528976836916')}}</el-button>
                </el-form-item>
            </el-form>
            <!--表格-->
            <el-table :data="templateAdminList" class="columnClass">
                <!-- 模板名称 -->
                <el-table-column prop="templateName" :label="$t('mxpcweb.systemset.mailset.templatemanage.1528976965369')"></el-table-column>
                <!-- 适用于 -->
                <el-table-column prop="suitName" :label="$t('mxpcweb.systemset.mailset.templatemanage.1528976988611')"> </el-table-column>
                <!-- 创建人 -->
                <el-table-column prop="createName" :label="$t('mxpcweb.systemset.mailset.templatemanage.1528977026206')"> </el-table-column>
                <!-- 操作 -->
                <el-table-column prop="" :label="$t('mxpcweb.systemset.mailset.templatemanage.1528977039972')">
                    <template slot-scope="scope">
                        <!-- 删除 -->
                        <div class="pull-right">
                            <i class="iconfont icon-del" @click="handleDelete(scope.$index, scope.row)">

                            </i>
                        </div>
                        <div class="pull-right">
                            <i class="iconfont icon-edit-square" @click="handleEdit(scope.$index, scope.row,'edit')">

                            </i>
                        </div>

                        <div class="pull-right">
                            <i class="iconfont icon-eye" @click="handleEdit(scope.$index, scope.row,'view')">

                            </i>
                        </div>
                        <!-- 查看/编辑 -->
                        <!-- <el-button size="mini" type="info" @click="handleEdit(scope.$index, scope.row)">{{$t('mxpcweb.systemset.mailset.templatemanage.1528977072130')}}</el-button> -->

                        <!-- 删除 -->
                        <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">{{$t('mxpcweb.systemset.mailset.templatemanage.1528977094499')}}</el-button> -->

                    </template>
                </el-table-column>
            </el-table>

            <table class="table marginTop15">
                <thead>
                    <tr>
                        <!-- 默认设定 -->
                        <th>{{$t('mxpcweb.systemset.mailset.templatemanage.1528977119147')}}</th>
                        <!-- 新建模板 -->
                        <th>{{$t('mxpcweb.systemset.mailset.templatemanage.1528977165522')}}</th>
                        <!-- 回复模板 -->
                        <th>{{$t('mxpcweb.systemset.mailset.templatemanage.1528977178866')}}</th>
                        <!-- 转发模板 -->
                        <th>{{$t('mxpcweb.systemset.mailset.templatemanage.1528977192537')}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in defaultMailList" :key="index">
                        <td>{{item.label}}</td>
                        <td>
                            <!-- 新建模板请选择 -->
                            <el-select v-model="item.typeN" size="small" :placeholder="$t('mxpcweb.systemset.mailset.templatemanage.1528976864694')" @visible-change="needDefault = true" @change="setDefaultTemplate(item,0)">
                                <el-option label="" value=""></el-option>
                                <template v-for="(template,index) in templateAdminList">
                                    <el-option v-if="isShow(template,item,2)" :key="index" :label="template.templateName" :value="template.templateId"></el-option>
                                </template>

                            </el-select>
                        </td>
                        <td>
                            <!-- 回复模板请选择 -->
                            <el-select v-model="item.typeR" size="small" :placeholder="$t('mxpcweb.systemset.mailset.templatemanage.1528976864694')" @visible-change="needDefault = true" @change="setDefaultTemplate(item,1)">
                                <el-option label="" value=""></el-option>
                                <template v-for="(template,index) in templateAdminList">
                                    <el-option v-if="isShow(template,item,3)" :key="index" :label="template.templateName" :value="template.templateId"></el-option>
                                </template>
                            </el-select>
                        </td>
                        <td>
                            <!-- 转发模板请选择 -->
                            <el-select v-model="item.typeF" size="small" :placeholder="$t('mxpcweb.systemset.mailset.templatemanage.1528976864694')" @visible-change="needDefault = true" @change="setDefaultTemplate(item,2)">
                                <el-option label="" value=""></el-option>
                                <template v-for="(template,index) in templateAdminList">
                                    <el-option v-if="isShow(template,item,4)" :key="index" :label="template.templateName" :value="template.templateId"></el-option>
                                </template>
                            </el-select>
                        </td>
                    </tr>

                </tbody>
            </table>
            <!-- 发送邮件默认使用模板的优先级为 1.邮箱账号指定模板 2.个人默认模板 3.公司默认模板 数字越小优先级越高 -->
            <div style="padding:3px 18px;text-align: center; color: #606266;">{{$t('mxpcweb.systemset.mailset.templatemanage.1528977635981')}}</div>

        </div>

        <!-- 弹窗 -->
        <el-dialog :title="templateAdminForm.title" :visible.sync="templateAdminForm.popup" @close="resetForm('templateAdminForm')" :close-on-click-modal='false' custom-class="width1020" top="5%">
            <div :class="blgs?'coverDiv':''"></div>
            <el-form class="tempScroll MXscroll" :model="templateAdminForm" :rules="templateAdminFormRules" ref="templateAdminForm" label-width="80px" label-position="left">
                <!-- 模板名称 -->
                <el-form-item :label="$t('mxpcweb.systemset.mailset.templatemanage.1528976965369')" prop="name">
                    <!-- 请输入模板名称 -->
                    <el-input v-model="templateAdminForm.name" size="small" :placeholder="$t('mxpcweb.systemset.mailset.templatemanage.1528977724788')" style="width:300px;"></el-input>
                </el-form-item>
                <!-- 模板类型 -->
                <el-form-item :label="$t('mxpcweb.systemset.mailset.templatemanage.1528977756085')" prop="type">
                    <!-- 请选择 -->
                    <el-select v-model="templateAdminForm.type" size="small" :placeholder="$t('mxpcweb.systemset.mailset.templatemanage.1528976864694')" style="width:300px;">
                        <el-option v-for="(item,index) in templateTypeList" :key="index" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <!-- 适用于 -->
                <el-form-item :label="$t('mxpcweb.systemset.mailset.templatemanage.1528976988611')" prop="suit">
                    <!-- 请选择 -->
                    <el-select v-model="templateAdminForm.suit" size="small" :placeholder="$t('mxpcweb.systemset.mailset.templatemanage.1528976864694')" style="width:300px;">
                        <!-- 本人的所有邮箱账号 -->
                        <el-option :label="$t('mxpcweb.systemset.mailset.templatemanage.1528977825188')" value="1"></el-option>
                        <!-- 全部人员的所有邮箱账号 -->
                        <el-option :label="$t('mxpcweb.systemset.mailset.templatemanage.1528977856028')" value="0"></el-option>
                        <el-option v-for="(item,index) in mailInfoList" :key="index" :label='item.mailAddress' :value='item.mailAddress'> </el-option>
                    </el-select>
                </el-form-item>
                <!-- 附件 -->
                <el-form-item :label="$t('mxpcweb.systemset.mailset.templatemanage.1528977882717')">
                    <file-upload :file-list="templateAdminForm.attachments" :limitSize="10">
                        <!-- 选择文件 -->
                        <el-button slot="trigger" size="small" type="primary">{{$t('mxpcweb.systemset.mailset.templatemanage.1528977896477')}}</el-button>
                    </file-upload>
                </el-form-item>
                <ueditor :config="config" @ready="editorReady" :converContent="templateAdminForm.content" ref="ueditor" height="200" :closeInsertField="true" @clickInsertField="$refs.dialogField.isOpen(instance)"></ueditor>
            </el-form>
            <div slot="footer" class="dialog-footer text-center">
                <!-- 取 消 -->
                <!-- <el-button @click="resetForm('templateAdminForm');templateAdminForm.popup = false;">{{$t('mxpcweb.systemset.mailset.templatemanage.1528977924082')}}</el-button> -->
                <!-- 确 定 -->
                <el-button type="primary" @click="templateSubmit('templateAdminForm')">{{$t('mxpcweb.systemset.mailset.templatemanage.1528977949876')}}</el-button>
            </div>
        </el-dialog>

        <!-- 选字段 -->
        <dialog-field ref="dialogField" />
    </div>
</template>

<script>
import PageTitle from '@/components/PageTitle/index' // 大标题
import UEditor from '@/components/UEditor/component.vue' // 编辑器
import { isArray, isObject } from '@/libs/utils.js'
import FileUpload from '@/components/FileUpload/index' // 文件上传
import dialogField from '@/components/editorTemplate/dialogField/index' // 选字段
import {
    mapGetters
} from 'vuex'
export default {
    name: 'TemplateManage',
    props: {},
    data() {
        var _this = this
        return {
            currentCtid: 0,
            needDefault: false,
            updateUrl: this.Global.uploadUrl,
            mailInfoList: [],
            queryPara: {
                ctid: '',
                keywords: '',
                type: 'all'
            },
            templateTypeList: [
                // 新建 回复 转发
                { label: _this.$t('mxpcweb.systemset.mailset.templatemanage.1528978021241'), value: '2' },
                { label: _this.$t('mxpcweb.systemset.mailset.templatemanage.1528978058723'), value: '3' },
                { label: _this.$t('mxpcweb.systemset.mailset.templatemanage.1528978065443'), value: '4' }
            ],
            // 列表
            templateAdminList: [],
            defaultMailList: [],
            defaultTemplateList: [],
            // 表单验证
            templateAdminFormRules: {
                // 请输入模板名称
                name: [{ required: true, message: _this.$t('mxpcweb.systemset.mailset.templatemanage.1528977724788'), trigger: 'blur' }]
            },
            // 弹窗
            templateAdminForm: {
                popup: false, // 弹窗开关
                name: '', // 规则名称
                suit: '1', // 适用于
                title: '',
                type: '2', // 类型：开发信，新建，回复，转发
                content: '',
                mailAddress: '',
                templateId: -99,
                attachments: []
            },
            // 编辑器配置
            config: {
                // 请输入模板内容
                initialContent: _this.$t('mxpcweb.systemset.mailset.templatemanage.1528978121696'), // 初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
                initialFrameHeight: 200, // 内容初始高度
                zIndex: 99999, // 编辑器层级的基数,默认是900（一般不要开启）
                toolbars: [[
                    'source', '|', 'fontfamily', 'fontsize', 'forecolor', 'backcolor', '|',
                    'bold', 'italic', 'underline', 'strikethrough', '|',
                    'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                    'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'link', 'unlink',
                    'simpleupload',
                    'horizontal', 'emotion', 'removeformat', 'formatmatch', 'autotypeset', '|',
                    'inserttable', '|', 'macros', 'insertfield'
                ]]
            },
            instance: null,
            blgs: false,
            htmlContentStr: ''
        }
    },
    created() {
        this.currentCtid = this.company.ctId
        this.loadAccountAndDefaultTemplate()
    },
    mounted() { },
    computed: {
        ...mapGetters(['company', 'personalInfo'])
    },
    methods: {
        isShow(template, item, type) {
            if (template.templatetype == type &&
                ((template.mailAddress != '' && template.mailAddress == item.label) || template.mailAddress == '') &&
                ((template.suitableRange != 0 && template.ctid == this.currentCtid && (item.ctid == this.currentCtid || item.ctid <= 0)) || template.suitableRange == 0) &&
                (item.mailAddress != '' || (item.suit == 1 && template.mailAddress == '') ||
                    (template.suitableRange == item.suit && (template.mailAddress == item.mailAddress || template.mailAddress == '')))) {
                return true
            }
            return false
        },
        async   GetRightsCheck(data) {
            let blg = false
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
        // 编辑器加载完成时
        editorReady(instance) {
            this.instance = instance
            instance.setContent(this.templateAdminForm.content)// 设置初始值放进来，不设置则为 config 里的 initialContent 值
            // 键盘操作...
            instance.addListener('keydown', (type, event) => {
                if (event.key == '$') {
                    this.$refs.dialogField.isOpen(instance)
                }
            })
        },
        loadAccountAndDefaultTemplate() {
            let _this = this
            _this.needDefault = false
            _this.loadTemplateList() // 加载模板列表
            // 加载账户列表
            var p0 = new Promise((resolve, reject) => {
                _this.loadMailAccountList(resolve) // 加载账户信息
            })
            // 加载默认设置列表
            var p1 = new Promise((resolve, reject) => {
                _this.getDefaultSetTemplate(resolve) // 加载默认设置列表
            })
            Promise.all([p0, p1]).then(function (results) {
                if (results != undefined && results != null && results.length > 1 && isArray(results[1]) && isArray(results[0]) && results[0].length > 0 && results[1].length > 0) {
                    results[1].forEach(element => {
                        results[0].forEach(mail => {
                            if (mail.suit == element.suitableRange && element.mailAddress == mail.mailAddress) {
                                if (element.type == 0) {
                                    mail.typeN = element.templateId
                                } else if (element.type == 1) {
                                    mail.typeR = element.templateId
                                } else if (element.type == 2) {
                                    mail.typeF = element.templateId
                                }
                            }
                        })
                    })
                    _this.defaultMailList = results[0]
                }
            })
        },
        /**
         * 重置默认列表
         */
        resetDefaultMailList() {
            let _this = this
            _this.needDefault = false
            // 加载默认设置列表
            var p0 = new Promise((resolve, reject) => {
                _this.getDefaultSetTemplate(resolve) // 加载默认设置列表
            })
            Promise.all([p0]).then(function (results) {
                if (
                    results != undefined &&
                    results != null &&
                    results.length > 0 &&
                    isArray(results[0]) &&
                    results[0].length > 0
                ) {
                    results[0].forEach(element => {
                        _this.defaultMailList.forEach(mail => {
                            if (
                                mail.suit == element.suitableRange &&
                                element.mailAddress == mail.mailAddress
                            ) {
                                if (element.type == 0) {
                                    mail.typeN = element.templateId
                                } else if (element.type == 1) {
                                    mail.typeR = element.templateId
                                } else if (element.type == 2) {
                                    mail.typeF = element.templateId
                                } else {
                                    mail.typeN = ''
                                    mail.typeR = ''
                                    mail.typeF = ''
                                }
                            }
                        })
                    })
                    // _this.defaultMailList = results[0];
                } else {
                    _this.defaultMailList.forEach(mail => {
                        mail.typeN = ''
                        mail.typeR = ''
                        mail.typeF = ''
                    })
                }
            })
        },
        /**
         * 获取默认的设置模板列表
         */
        getDefaultSetTemplate(resolve) {
            let _this = this
            _this.$http
                .get(
                    _this.Global.baseURL +
                    _this.Global.api.SystemSet.mailset.template.getMailsTmplSet,
                    {}
                )
                .then(
                    function (res) {
                        if (
                            res.body.code.toString() == _this.Global.RES_OK &&
                            isArray(res.body.data) &&
                            res.body.data.length > 0
                        ) {
                            _this.defaultTemplateList = res.body.data
                            resolve(_this.defaultTemplateList)
                        } else if (res.body.code.toString() == _this.Global.RES_OK) {
                            _this.defaultTemplateList = []
                            resolve(_this.defaultTemplateList)
                        }
                    },
                    function (res) {
                        _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
                    }
                )
        },
        /**
         * 设置默认的模板 type,templateId,suit,mailAddress
         */
        setDefaultTemplate(item, type) {
            // 数据开关
            if (this.needDefault) {
                let _this = this
                var templateId = ''
                if (type == 0) {
                    templateId = item.typeN
                } else if (type == 1) {
                    templateId = item.typeR
                } else if (type == 2) {
                    templateId = item.typeF
                }
                if (templateId == '') {
                    templateId = 0
                }
                let data = {
                    type: type,
                    templateId: templateId,
                    suitableRange: item.suit,
                    mailAddress: item.mailAddress,
                    ctid: item.ctid
                }
                _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.mailset.template.mailTmplSetPost, data)
                    .then(
                        function (res) {
                            if (res.body.code.toString() == _this.Global.RES_OK) {
                                // 设置默认模板成功
                                _this.$message.success(_this.$t('mxpcweb.systemset.mailset.templatemanage.1528978198538'))
                            } else {
                                _this.$message.error(_this.msg(res.body))
                            }
                        },
                        function (res) {
                            _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
                        }
                    )
            }
        },
        /**
         * 提交修改模板
         */
        saveModifyTemplate() {
            const _this = this
            var signaName = _this.$t('mxpcweb.systemset.mailset.templatemanage.1528979307240')
            let attachments = []
            for (let index = 0; index < this.templateAdminForm.attachments.length; index++) {
                const element = this.templateAdminForm.attachments[index]
                attachments.push({ name: element.name, url: element.url, size: parseInt(element.size * 1024) })
            }
            let data = {
                templateId: _this.templateAdminForm.templateId,
                templateType: _this.templateAdminForm.type,
                templateName: _this.templateAdminForm.name,
                suitableRange: _this.templateAdminForm.suit,
                mailAddress: _this.templateAdminForm.mailAddress,
                attachments: attachments
            }
            if (_this.$refs.ueditor.getContent() != _this.htmlContentStr) {
                _this.htmlContentStr = _this.$refs.ueditor.getContent().replace('<input type="button" id="Fumasoft_MailWrite_Default_Autograph" class="M_scrawl" value="' + signaName + '"/>', '${signature}')
                data.content = {}
                data.content.htmlContent = _this.htmlContentStr
            }
            _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.mailset.template.mailTemplatePut, data)
                .then(
                    function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            _this.resetForm('templateAdminForm')
                            _this.loadTemplateList() // 刷新模板列表
                            // 修改模板成功
                            _this.$message.success(_this.$t('mxpcweb.systemset.mailset.templatemanage.1528978250458'))
                            _this.templateAdminForm.popup = false
                            _this.resetDefaultMailList()
                        } else {
                            _this.$message.error(_this.msg(res.body))
                        }
                    },
                    function (res) {
                        _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
                    }
                )
        },
        /**
         * 保存新建模板
         */
        saveNewTemplate() {
            const _this = this
            var signaName = _this.$t('mxpcweb.systemset.mailset.templatemanage.1528979307240')
            let attachments = []
            for (let index = 0; index < this.templateAdminForm.attachments.length; index++) {
                const element = this.templateAdminForm.attachments[index]
                attachments.push({ name: element.name, url: element.url, size: parseInt(element.size * 1024) })
            }
            let data = {
                templateType: _this.templateAdminForm.type,
                templateName: _this.templateAdminForm.name,
                suitableRange: _this.templateAdminForm.suit,
                mailAddress: _this.templateAdminForm.mailAddress,
                content: { 'htmlContent': _this.$refs.ueditor.getContent().replace('<input type="button" id="Fumasoft_MailWrite_Default_Autograph" class="M_scrawl" value="' + signaName + '"/>', '${signature}')
                },
                attachments: attachments
            }
            _this.$http
                .post(
                    _this.Global.baseURL +
                    _this.Global.api.SystemSet.mailset.template.mailTemplatePost,
                    data
                )
                .then(
                    function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            _this.resetForm('templateAdminForm')
                            _this.loadTemplateList() // 刷新模板列表
                            // 新增模板成功
                            _this.$message.success(_this.$t('mxpcweb.systemset.mailset.templatemanage.1528978301497'))
                            _this.templateAdminForm.popup = false
                        } else {
                            _this.$message.error(_this.msg(res.body))
                        }
                    },
                    function (res) {
                        _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
                    }
                )
        },
        /**
         * 加载模板列表
         */
        loadTemplateList() {
            let _this = this
            let data = { type: _this.queryPara.type, keywords: '', pageN: 1, pageSize: 10000 }
            _this.templateAdminList = []
            _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.mailset.template.getMailsTemplate, { params: data }).then(
                function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data)) {
                        _this.templateAdminList = res.body.data.templateInfos
                        _this.templateAdminList.forEach(element => {
                            if (element.suitableRange == 0) {
                                // 全部人员的所有邮箱账号
                                element.suitName = _this.$t('mxpcweb.systemset.mailset.templatemanage.1528977856028')
                            } else if (element.suitableRange == 1 && element.mailAddress == '') {
                                // 本人的所有邮箱账号
                                element.suitName = _this.$t('mxpcweb.systemset.mailset.templatemanage.1528977825188')
                            } else {
                                element.suitName = element.mailAddress
                            }
                        })
                    } else if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.templateAdminList = []
                    }
                },
                function (res) {
                    _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
                }
            )
        },

        /**
         * 初始化默认设定列表
         */
        initDefaultList(resolve) {
            let _this = this
            // 写死数据
            let obj = {}
            obj.suit = 0
            // 公司所有人默认模板
            obj.label = _this.$t('mxpcweb.systemset.mailset.templatemanage.1528978394367')
            obj.mailAddress = ''
            obj.typeN = ''
            obj.typeR = ''
            obj.typeF = ''
            obj.ctid = 0
            _this.defaultMailList.push(obj)
            obj = {}
            obj.suit = 1
            // 本人所有默认模板
            obj.label = _this.$t('mxpcweb.systemset.mailset.templatemanage.1528978422607')
            obj.mailAddress = ''
            obj.typeN = ''
            obj.typeR = ''
            obj.typeF = ''
            obj.ctid = 0
            _this.defaultMailList.push(obj)
            if (isArray(_this.mailInfoList) && _this.mailInfoList.length > 0) {
                _this.mailInfoList.forEach(element => {
                    obj = {}
                    obj.suit = 1
                    obj.label = element.mailAddress
                    obj.mailAddress = element.mailAddress
                    obj.typeN = ''
                    obj.typeR = ''
                    obj.typeF = ''
                    obj.ctid = element.ctid
                    _this.defaultMailList.push(obj)
                })
            }
            resolve(_this.defaultMailList)
        },
        /**
         * 加载所有邮箱账户列表
         */
        loadMailAccountList(resolve) {
            let _this = this
            _this.mailInfoList = []
            _this.defaultMailList = []
            _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.mailset.mailaccount.accounts, { params: { type: this.queryPara.type } }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data) && isArray(res.body.data.mailAccountsInfo)) {
                    _this.mailInfoList = res.body.data.mailAccountsInfo
                    _this.initDefaultList(resolve)
                } else if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.mailInfoList = []
                    // _this.defaultMailList = []
                    _this.initDefaultList(resolve)
                    resolve([])
                }
            },
                function (res) {
                    _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
                }
            )
        },
        /**
         * 显示弹框
         */
        async  showDialog(title) {
            this.blgs = false
            this.templateAdminForm.title = title
            this.templateAdminForm.popup = true
        },
        // 添加提交
        templateSubmit(formName) {
            const _this = this
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (
                        _this.templateAdminForm.suit == 0 ||
                        _this.templateAdminForm.suit == 1
                    ) {
                        _this.templateAdminForm.mailAddress = ''
                    } else {
                        _this.templateAdminForm.mailAddress = _this.templateAdminForm.suit
                        _this.templateAdminForm.suit = '1'
                    }
                    if (_this.templateAdminForm.templateId > 0) {
                        _this.saveModifyTemplate()
                    } else {
                        _this.saveNewTemplate()
                    }
                } else {
                    return false
                }
            })
        },
        // 操作编辑
        async  handleEdit(index, row, type) {
            if (type == 'view') {
                this.blgs = true
            } else {
                let targetCtid = row.ctid == 0 ? row.createCtid : row.ctid
                this.blgs = await this.GetRightsCheck({ 'optCode': 'otEdit', 'moduleCode': 'SY016', 'targetCtid': targetCtid })
            }
            if (!this.blgs) {
                return
            }
            if (type == 'edit') {
                this.blgs = false
            }

            let _this = this

            // 编辑模板
            _this.templateAdminForm.title = _this.$t('mxpcweb.systemset.mailset.templatemanage.1528978467167')
            _this.templateAdminForm.popup = true

            this.templateAdminForm.name = row.templateName
            if (row.suitableRange == 1) {
                if (row.mailAddress != '') {
                    this.templateAdminForm.suit = row.mailAddress
                } else {
                    this.templateAdminForm.suit = row.suitableRange.toString()
                }
            } else {
                this.templateAdminForm.suit = row.suitableRange.toString()
            }
            this.templateAdminForm.type = row.templatetype.toString()
            this.templateAdminForm.templateId = row.templateId

            _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.mailset.template.getMailsTemplate, {
                params: {
                    type: 'single',
                    templateId: _this.templateAdminForm.templateId
                } }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    let data = res.body.data
                    _this.templateAdminForm.content = data.content
                    var signaName = _this.$t('mxpcweb.systemset.mailset.templatemanage.1528979307240')
                    _this.templateAdminForm.content = _this.templateAdminForm.content.replace('${signature}', '<input type="button" id="Fumasoft_MailWrite_Default_Autograph" class="M_scrawl" value="' + signaName + '"/>')
                    _this.htmlContentStr = _this.templateAdminForm.content // cyy添加加载后的内容
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            },
                function (res) {
                    _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
                }
            )
        },
        // 操作删除
        async handleDelete(index, row) {
            let targetCtid = row.ctid == 0 ? row.createCtid : row.ctid
            let blg = await this.GetRightsCheck({ 'optCode': 'otDelete', 'moduleCode': 'SY016', 'targetCtid': targetCtid })
            if (!blg) {
                return
            }
            let _this = this
            // "此操作将永久删除, 是否继续？", "提示"
            this.$confirm(_this.$t('mxpcweb.systemset.mailset.autographmanage.1528975570046'), _this.$t('mxpcweb.systemset.mailset.autographmanage.1528975603382'), {
                // 确定
                confirmButtonText: _this.$t('mxpcweb.systemset.mailset.autographmanage.1528975623030'),
                // 取消
                cancelButtonText: _this.$t('mxpcweb.systemset.mailset.autographmanage.1528975668486'),
                type: 'warning'
            }).then(() => {
                let data = {
                    templateId: row.templateId
                }
                _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.mailset.template.mailTmplSetDelete, data).then(
                    function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            _this.templateAdminList.splice(index, 1)
                            _this.resetDefaultMailList()
                            // 删除模板成功
                            _this.$message.success(_this.$t('mxpcweb.systemset.mailset.templatemanage.1528978624751'))
                        } else {
                            _this.$message.error(_this.msg(res.body))
                        }
                    },
                    function (res) {
                        _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
                    }
                )
            })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        // 已取消删除
                        message: _this.$t('mxpcweb.systemset.mailset.templatemanage.1528978662174')
                    })
                })
        },
        // 清空表单
        resetForm(formName) {
            this.templateAdminForm.templateId = -99
            this.$refs[formName].resetFields()
            // 手动清空
            this.templateAdminForm.name = ''
            this.templateAdminForm.suit = '1'
            this.templateAdminForm.type = '2'
            this.templateAdminForm.templateId = -99
            this.templateAdminForm.attachments = []
            this.templateAdminForm.content = ''
            this.$refs.ueditor.clearContent()
        }
    },
    components: {
        'page-title': PageTitle,
        ueditor: UEditor,
        'dialog-field': dialogField,
        'file-upload': FileUpload
    },
    watch: {
        $route(newValue, oldValue) {
            if (newValue.path == '/main/systemset/mailset/templatemanage') {
                this.currentCtid = this.company.ctId
                this.loadAccountAndDefaultTemplate()
            }
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
