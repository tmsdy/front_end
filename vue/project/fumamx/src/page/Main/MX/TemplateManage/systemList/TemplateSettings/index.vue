<template>
    <div>
        <el-dialog v-dialogDrag :title="titleName" custom-class="width620" :visible.sync="Visible">
            <el-form ref="form" :model="form" label-width="120px" style="margin: 5px 10px; ">
                <el-form-item label="模板中文名称">
                    <el-input v-model="form.reportName"></el-input>
                </el-form-item>
                <el-form-item label="模版中文描述">
                    <el-input v-model="form.remarks"></el-input>
                </el-form-item>
                <el-form-item label="模板英文名称">
                    <el-input v-model="form.enReportName"></el-input>
                </el-form-item>
                <el-form-item label="模板英文描述">
                    <el-input v-model="form.enRemarks"></el-input>
                </el-form-item>

                <el-form-item label="所属模块">
                    <el-input v-model="form.moduleName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="模板类型">
                    <el-input v-model="form.reportTypeName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                    <el-button @click="resetForm('form')">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- <preview-selection ref="PreviewSelection"></preview-selection> -->
        <el-dialog v-dialogDrag title="请选择预览数据" custom-class="width620" :visible.sync="checkVisible">
            <el-form ref="form2" label-width="190px" style="margin: 5px 10px; ">
                <el-form-item label="客户名称" v-if="form.moduleCode=='BF001'">
                    <el-select v-model="form.value" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.custId" :label="item.custName + '('+  item.custCode +')'" :value="item.custId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="报价主题" v-if="form.moduleCode=='SC001'">
                    <el-select v-model="form.value" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.quotaId" :label="item.quotaTheme + '('+ item.quotaCode +')'" :value="item.quotaId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="预览订单单号" v-if="form.moduleCode=='SC002'">
                    <el-select v-model="form.value" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.orderId" :label="item.orderTheme + '('+  item.orderCode+ ')'" :value="item.orderId">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitchange()">确定</el-button>
                    <el-button @click="resetForm('form')">取消</el-button>
                </el-form-item>

            </el-form>

        </el-dialog>
    </div>

</template>

<script>
export default {
    name: 'TemplateSettings',
    data() {
        return {
            titleName: '模板设置',
            Visible: false,
            checkVisible: false,
            form: {
                reportId: '',
                oldreportName: '',
                reportName: '',
                enReportName: '',
                remarks: '',
                enRemarks: '',
                moduleCode: 'BF001',
                moduleName: '',
                reportTypeName: '系统模板',
                scopeType: '0',
                reportType: '0',
                fileIdent: [],
                value: ''

            },
            fileIdentTable: [],
            options: [],
            type: 'add',
            pardata: {},
            defaultFlag: false
        }
    },
    computed: {
    },
    created() {
    },
    methods: {
        editTemplte(objct) {
            this.form = {
                reportId: objct.reportId,
                oldreportName: objct.reportName,
                reportName: objct.reportName,
                enReportName: objct.enReportName,
                remarks: objct.remarks,
                enRemarks: objct.enRemarks,
                moduleCode: objct.moduleCode,
                reportType: 0,
                reportTypeName: '系统模版'
            }
            if (this.form.moduleCode == 'BF001') {
                this.form.moduleName = this.$t('mxpcweb.workbench.1530703521879')
            }
            this.pardata = this.from
            this.Visible = true
            this.type = 'SetUp'
        },
        showOpenVisible(activeName) {
            this.Visible = true
            this.type = 'add'
            this.form.moduleCode = activeName
            if (activeName == 'BF001') { // 客户
                this.form.moduleName = this.$t('mxpcweb.workbench.1530703521879')
            } else if (activeName == 'SC002') { // 订单
                this.form.moduleName = this.$t('mxpcweb.client.1529056921708')
            } else if (activeName == 'SC001') { // 报价
                this.form.moduleName = this.$t('mxpcweb.client.1529056897952')
            }
        },
        showOpenCheckVisible(type, pardata, defaultFlag) {
            this.checkVisible = true
            this.pardata = pardata
            this.form.value = ''
            this.type = type
            this.defaultFlag = defaultFlag == 1
        },
        resetForm(formName) {
            this.form.reportName = ''
            this.form.remarks = ''
            this.form.enReportName = ''
            this.form.enRemarks = ''
            this.form.fileIdent = []
            this.Visible = false
            this.checkVisible = false
        },
        submitchange() {
            if (this.form.value == '') {
                this.$message('请选择预览数据')
                return
            }
            if (this.type == 'add') {
                this.pardata =
                    {
                        'moduleCode': this.form.moduleCode,
                        'remarks': this.form.remarks,
                        'enRemarks': this.form.enRemarks,
                        'enReportName': this.form.enReportName,
                        'reportName': this.form.reportName,
                        'reportType': this.form.reportType,
                        'scopeType': 0,
                        'fileIdent': this.form.value
                    }
            } else {
                this.pardata.fileIdent = this.form.value
            }
            this.resetForm('form')
            this.$emit('getParmars', this.type, this.pardata, this.defaultFlag)
        },
        async   submitForm(formName) {
            if (this.form.reportName == '') {
                this.$message('请输入模板名称')
                return
            }
            let blg = true
            blg = await this.DuplicateValidation(this.form.moduleCode, this.form.reportName, this.form.reportId)
            if (!blg) {
                return
            }
            if (this.type != 'SetUp') {
                this.Visible = false
                this.checkVisible = true
            } else {
                this.pardata =
                    {
                        'reportId': this.form.reportId,
                        'oldreportName': this.form.oldreportName,
                        'moduleCode': this.form.moduleCode,
                        'remarks': this.form.remarks,
                        'enRemarks': this.form.enRemarks,
                        'enReportName': this.form.enReportName,
                        'reportName': this.form.reportName,
                        'reportType': this.form.reportType,
                        'scopeType': 0,
                        'fileIdent': this.form.value
                    }
                this.resetForm('form')
                this.$emit('getParmars', this.type, this.pardata, this.defaultFlag)
            }
        },
        getCheckData(moduleCode) {
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.document_generalOperate_get, {
                params: {
                    moduleCode: moduleCode,
                    searchType: 'list',
                    from: 0,
                    size: 50
                }
            }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    this.options = res.body.data.list
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 名称重复验证
        async   DuplicateValidation(moduleCode, reportName, reportId) {
            let blg = false
            try {
                let params = {
                    moduleCode: moduleCode,
                    reportName: reportName,
                    type: 'checkName'
                }
                if (reportId) {
                    params.reportId = reportId
                }
                let res = await this.$http.get(this.Global.baseURL + this.Global.api.v2.reportManage, { params: params })
                if (res.body.code.toString() == this.Global.RES_OK) {
                    blg = true
                } else {
                    this.$message.error(res.body.msg)
                    blg = false
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            return blg
        }

    },
    components: {

    }
    // ,
    // watch: {

    // }
}

</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
