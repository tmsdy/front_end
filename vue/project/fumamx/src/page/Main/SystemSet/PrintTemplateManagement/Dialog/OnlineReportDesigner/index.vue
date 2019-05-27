<template>
    <div v-show="Visible" class="FullScreen">
        <iframe ref="iframe" :src="srcUrl" style="width: 100%; height: 100%;">
        </iframe>
        <!-- 编辑器 -->
        <div v-show="SuspensionMode==1" class="suspensionDesigner" @click="Initialization">关闭</div>
        <!-- 预览 -->
        <div class="suspensionPreview" v-show="SuspensionMode==2||SuspensionMode==3">
            <div class="leftclass">
                <el-dropdown trigger="click" @command="printChange">
                    <el-button type="primary" style="background:#5B84AD;border-color:#5B84AD">
                        <i class="iconfont icon-default" v-if="defaultFlag"></i> {{printValue}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(item,index) in AvailableTemplate" :key="index" :command="{reportName:item.reportName,index:index,defaultFlag:item.defaultFlag}">
                            <div :style="{color:(item.defaultFlag==1?'#D0021B':''),width:220+'px','padding-left': 35+'px',position: 'relative'}">
                                <span :style="{color:(item.defaultFlag==1?'#D0021B':''),position: 'absolute',left: 10+'px'}">
                                    <i v-if="item.defaultFlag==1" class="iconfont icon-default"></i>
                                </span>
                                {{item.reportName}}</div>

                        </el-dropdown-item>

                    </el-dropdown-menu>
                </el-dropdown>

                <el-dropdown trigger="click" @command="actionChange">
                    <el-button type="primary" style="background:#5B84AD;border-color:#5B84AD">
                        <i class="iconfont icon-more"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(item,index) in actionOption" :key="index" :command="{actionValue:item.value,index:index}">
                            {{item.label}}

                        </el-dropdown-item>

                    </el-dropdown-menu>
                </el-dropdown>

            </div>
            <div class="titleclass">{{titleName}}</div>
            <div class="rightclass" v-if="SuspensionMode==2" @click="Visible = false">关闭</div>
            <div class="rightclass" v-if="SuspensionMode==3" @click="PreviewDesignerShow">返回</div>
        </div>
        <!-- 编辑器预览 -->
        <!-- <div class="suspensionPreview" v-show="SuspensionMode==3">
            <div class="leftclass">

            </div>
            <div class="titleclass">{{titleName}}</div>
            <div class="rightclass" @click="PreviewDesignerShow">返回</div>
        </div> -->

        <!-- <div v-show="SuspensionMode==3" class="suspensionDesigner" @click="PreviewDesignerShow">返回</div> -->
        <iframe ref="iframe2" :src="srcUrl2" style="width: 100%; height:0;">
        </iframe>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { isObject } from '@/libs/utils.js'
export default {
    name: 'OnlineReportDesigner',
    data() {
        return {
            urlId: '',
            Visible: false,
            checkVisible: false,
            actionOption: [
                {
                    label: '新建模板',
                    value: '1'
                },
                {
                    label: '编辑模板',
                    value: '2'
                },
                {
                    label: '转抄模板',
                    value: '3'
                },
                {
                    label: '删除模板',
                    value: '4'
                },
                {
                    label: '设为默认',
                    value: '5'
                },
                {
                    label: '模板设置',
                    value: '6'
                }
            ],
            SuspensionMode: 0,
            srcparameter: 'https://report.laifuyun.com/',
            // srcparameter: 'http://localhost:63499/',
            // viewUrl: 'http://192.168.8.152:22217/ViewerApp/index.html?',
            viewUrl: 'https://reportview.laifuyun.com/ViewerApp/index.html?',
            srcUrl: '',
            srcUrl2: '',
            parmarseData: {},
            copyparmarseData: {},
            titleName: '',
            printValue: '',
            printShow: '',
            actionValue: '',
            actionType: 'preview',
            action: '',
            reportIdName: '',
            copyShowName: '',
            actionfileIdent: '',
            changeIs: true,
            defaultFlag: false,
            SystemType: 1

        }
    },
    computed: {
        ...mapGetters([
            'personalInfo',
            'company'
        ])
    },
    props: {
        AvailableTemplate: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    created() {
        let _this = this
        window.addEventListener('message', function (e) {
            if (isObject(e.data) && e.data.str == 'cyy&str*$' && (e.data.action == 'open' || e.data.action == 'close')) {
                if (e.data.action == 'open') {
                    _this.SuspensionMode = 3
                } else {
                    _this.SuspensionMode = 1
                }
            } else if (isObject(e.data) && e.data.str == 'cyy&str*$') {
                if (_this.urlId == '' && e.data.urlId != '') {
                    _this.urlId = e.data.urlId
                    console.log('空 ' + _this.urlId)
                    if (e.data.urlId != 'delete') {
                        _this.CallbackChange(e.data)
                    }
                } else if (_this.urlId != e.data.urlId && _this.urlId != '') {
                    _this.urlId = e.data.urlId
                    console.log('飞快' + _this.urlId)
                    if (e.data.urlId != 'delete') {
                        _this.CallbackChange(e.data)
                    }
                }
            }
        }, false)
    },
    methods: {
        // 预览跳编辑器
        PreviewDesignerShow() {
            this.SuspensionMode = 1
            var iframe = this.$refs.iframe.contentWindow
            var msg = { data: 'backClick', action: 'operation' }
            iframe.postMessage(msg, this.srcparameter)
        },
        // 关闭自动保存
        Initialization() {
            var iframe = this.$refs.iframe.contentWindow
            var msg = { data: 'saveClick', action: 'operation' }
            iframe.postMessage(msg, this.srcparameter)
            this.Visible = false
            // this.changeIs = false
            this.actionValue = ''
            this.printValue = ''
        },
        // 更多操作
        actionChange(conmmand) {
            this.actionValue = conmmand.actionValue
            // if (!this.changeIs) {
            //     this.changeIs = true
            // } else {
            switch (this.actionValue) {
                case '1':// 新建
                    this.$emit('addTemplate')
                    break
                case '2':// 编辑  返回按钮点击
                    if (this.SuspensionMode == 2) { // 直接预览
                        this.edtiShow(this.parmarseData)
                    } else { // 编辑器预览
                        this.SuspensionMode = 1
                        var iframe = this.$refs.iframe.contentWindow
                        var msg = { data: 'backClick', action: 'operation' }
                        iframe.postMessage(msg, this.srcparameter)
                    }
                    break
                case '3':// 转抄
                    this.actionType = 'copy'
                    this.$emit('DuplicateValidation', this.parmarseData.moduleCode, this.parmarseData.reportName, this.parmarseData)
                    break
                case '4':// 删除
                    let _this = this
                    this.$confirm('请确认是否删除该打印模板', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        _this.Visible = false
                        _this.$emit('handleAction', _this.parmarseData.reportId, 'delete', _this.parmarseData)
                    }).catch(() => { })

                    break
                case '5':// 设置默认
                    // this.Visible = false
                    this.$emit('handleAction', this.parmarseData.reportId, 'default')
                    break
                case '6':// 模板设置
                    this.$emit('editTemplte', this.parmarseData)
                    break

                default:
                    break
            }
            // }
            // this.printValue = ''
            // this.actionValue = ''
        },
        // 打印操作
        printChange(command) {
            this.printValue = command.reportName
            this.defaultFlag = command.defaultFlag == 1
            if (this.AvailableTemplate.length > 0) {
                // if (!this.changeIs) {
                //     this.changeIs = true
                // } else {
                let obj = this.AvailableTemplate[command.index]
                this.showOpen('preview', obj)
                // }
            }
        },
        showOpen(mode, obj, blg = false) {
            this.parmarseData = obj
            this.actionType = mode
            this.titleName = obj.reportName.replace('.rdlx', '') + '.rdlx'
            switch (mode) {
                case 'add':
                    this.actionfileIdent = obj.fileIdent
                    this.newReport(obj)
                    break
                case 'edit':
                    this.actionfileIdent = obj.fileIdent
                    this.printValue = obj.reportName
                    this.defaultFlag = blg
                    this.editReport(obj.reportName, obj)
                    break
                case 'preview':
                    if (obj.fileIdent.toString().indexOf(',') == -1) {
                        this.actionfileIdent = obj.fileIdent
                    }
                    this.printValue = obj.reportName
                    this.defaultFlag = blg
                    this.previewReport(obj.reportName, obj)
                    break
                case 'SetUp':
                    this.SetUpReport(obj.oldreportName, obj, 'rename')
                    break
                case 'delete':
                    this.SetUpReport(obj.reportName, obj, 'delete')
                    break
                case 'copy':
                    this.copyReport(obj, blg)
                    break
            }
        },
        newReport(dataParmart) {
            this.Visible = true
            this.SuspensionMode = 1
            this.SystemType = dataParmart.reportType
            this.reportIdName = dataParmart.reportType == 0 ? dataParmart.reportName + '_0_' + dataParmart.moduleCode : dataParmart.reportName + '_1' + this.company.cId + '_' + dataParmart.moduleCode
            let paramStr = 'moduleCode=' + dataParmart.moduleCode + '&accessToken=' + this.company.accessToken.value + '&fileIdent=' + dataParmart.fileIdent + '&reportName=' + this.reportIdName
            this.srcUrl = this.srcparameter + 'create?' + paramStr
            console.log(this.srcUrl)
        },
        edtiShow(dataParmart) {
            this.reportIdName = dataParmart.reportType == 0 ? dataParmart.reportName + '_0_' + dataParmart.moduleCode : dataParmart.reportName + '_1' + this.company.cId + '_' + dataParmart.moduleCode
            this.Visible = true
            this.SuspensionMode = 1
            let paramStr = 'moduleCode=' + dataParmart.moduleCode + '&accessToken=' + this.company.accessToken.value + '&fileIdent=' + dataParmart.fileIdent + '&mode=' + this.actionType + '&reportName=' + this.reportIdName
            this.srcUrl = this.srcparameter + '/edit/' + this.reportIdName.replace('.rdlx', '') + '.rdlx?' + paramStr
        },
        editReport(reportName, dataParmart) {
            if (dataParmart.reportName == dataParmart.oldreportName) {
                this.updataReport()
                return
            }
            this.reportIdName = dataParmart.reportType == 0 ? dataParmart.reportName + '_0_' + dataParmart.moduleCode : dataParmart.reportName + '_1' + this.company.cId + '_' + dataParmart.moduleCode
            this.Visible = true
            this.SuspensionMode = 1
            let paramStr = 'moduleCode=' + dataParmart.moduleCode + '&accessToken=' + this.company.accessToken.value + '&fileIdent=' + dataParmart.fileIdent + '&mode=' + this.actionType + '&reportName=' + this.reportIdName
            this.srcUrl = this.srcparameter + '/edit/' + this.reportIdName.replace('.rdlx', '') + '.rdlx?' + paramStr
        },
        copyReport(dataParmart, isSystem) {
            this.reportIdName = dataParmart.reportType == 0 ? dataParmart.reportName + '_0_' + dataParmart.moduleCode : dataParmart.reportName + '_1' + this.company.cId + '_' + dataParmart.moduleCode
            // 系统  企业
            let copyreportIdName = isSystem ? dataParmart.reportName + '_复制_0_' + dataParmart.moduleCode : dataParmart.reportName + '_复制_1' + this.company.cId + '_' + dataParmart.moduleCode
            let paramStr = 'name=' + this.reportIdName + '&type=copy&newName=' + copyreportIdName
            this.srcUrl2 = this.srcparameter + '/uploadFile?' + paramStr
            this.copyparmarseData = Object.assign(dataParmart)
            this.copyparmarseData.reportType = isSystem ? 0 : 1
            this.copyShowName = dataParmart.reportName.replace('.rdlx', '') + '_复制'
        },
        previewReport(reportName, dataParmart) {
            this.Visible = true
            this.SuspensionMode = 2
            this.reportIdName = dataParmart.reportType == 0 ? dataParmart.reportName + '_0_' + dataParmart.moduleCode : dataParmart.reportName + '_1' + this.company.cId + '_' + dataParmart.moduleCode
            this.srcUrl = this.viewUrl + 'accessToken=' + this.company.accessToken.value + '&identField=' + this.actionfileIdent + '&Mould=' + dataParmart.moduleCode + '&reportName=' + this.reportIdName + '.rdlx'
            // this.changeIs = false
            this.actionValue = ''
            this.printValue = dataParmart.reportName
        },
        SetUpReport(reportName, dataParmart, type) {
            this.reportIdName = dataParmart.reportType == 0 ? reportName + '_0_' + dataParmart.moduleCode : reportName + '_1' + this.company.cId + '_' + dataParmart.moduleCode
            let copyreportIdName = dataParmart.reportType == 0 ? dataParmart.reportName + '_0_' + dataParmart.moduleCode : dataParmart.reportName + '_1' + this.company.cId + '_' + dataParmart.moduleCode

            let paramStr = 'name=' + this.reportIdName + '&type=' + type + '&newName=' + copyreportIdName
            this.srcUrl2 = this.srcparameter + '/uploadFile?' + paramStr
        },
        CallbackChange(fileIdentObject) {
            if (fileIdentObject == '' || fileIdentObject == null || fileIdentObject == undefined) {
                this.$message.error('文件不存在,请联系管理员！')
                return
            }
            this.parmarseData.fileIdent = fileIdentObject.urlId
            if (this.parmarseData.reportId && this.actionType != 'copy') {
                this.updataReport()
            } else {
                let data = {}
                if (this.actionType == 'copy') {
                    this.copyparmarseData.reportName = this.copyShowName
                    this.addReportManage(this.copyparmarseData)
                } else {
                    data = this.parmarseData
                    this.addReportManage(data)
                }
            }
        },
        // 添加报表
        addReportManage(data) {
            let _this = this
            _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.reportManage, data).then(function (res) {
                if (res.body.code.toString() === _this.Global.RES_OK) {
                    if (this.actionType != 'copy') {
                        this.parmarseData.reportId = res.body.data.reportId
                    }
                    this.printChange = data.reportName
                    this.$message.success(_this.msg(res.body))
                } else {
                    this.$message.error(_this.msg(res.body))
                }
                this.$emit('PrintListGet', {})
            }, function (res) {
                _this.$message.error(_this.msg(res.body))
            })
        },
        // 修改报表
        updataReport() {
            let _this = this
            _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.reportManage, this.parmarseData).then(function (res) {
                if (res.body.code.toString() === _this.Global.RES_OK) {
                    this.$message.success(_this.msg(res.body))
                } else {
                    this.$message.error(_this.msg(res.body))
                }
                this.$emit('PrintListGet', {})
            }, function (res) {
                _this.$message.error(_this.msg(res.body))
            })
        }

    },
    components: {

    }
}

</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
