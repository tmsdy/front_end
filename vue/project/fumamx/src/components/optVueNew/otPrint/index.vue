<template>
    <div>
        <!-- 报表模板 -->
        <el-dialog v-dialogDrag :title="$t('mxpcweb.client.detail.1534235046003')" :visible.sync="dialogSetList" :closeOnClickModal="false" custom-class="width420" :modal-append-to-body="false">
            <div class="addShare MXscroll" v-loading="loading">
                <div class="customer">
                    <no-data v-if="departments.length == 0" ref="noData"></no-data>
                    <li v-else v-for="(item,index) in departments" :key="index"><span @click="PrintTemplateManagementShow(item,false)" class="text-hover">{{item.reportName}}</span></li>
                </div>
            </div>
        </el-dialog>

        <print-template-management :isView="false" ref="PrintTemplateManagement"></print-template-management>
    </div>
</template>
<script>
/**
 * 描述：客户管理-客户列表-设置列表字段
 * 作者：何俊峰
 * 时间：2017/11/10
 */
import { mapGetters } from 'vuex'
import { isArray } from '@/libs/utils.js'
import NoData from '@/basecomponents/NoData/index'
import PrintTemplateManagement from '@/page/Main/SystemSet/PrintTemplateManagement/index'
export default {
    name: 'otPrint',
    props: {
    },
    data() {
        return {
            dialogSetList: false, // 设置列表弹框
            id: '',
            departments: [],
            reportName: '',
            loading: true,
            moduleCode: ''
        }
    },
    created() {
    },
    mounted() {
    },
    computed: {
        ...mapGetters([
            'company'
        ])
    },
    methods: {
        PrintTemplateManagementShow(item, blg) {
            this.dialogSetList = false
            this.$refs.PrintTemplateManagement.getParmars('preview', { reportName: item.reportName, moduleCode: item.moduleCode, fileIdent: this.id }, blg)
        },
        // 打开窗口
        openWindow(obj) {
            let { billId, optData } = obj
            this.moduleCode = optData.optModuleCode
            this.id = billId
            // this.dialogSetList = true
            this.getTreeList()
        },
        // 提交表单
        submit(item) {
            // let _this = this
            let { accessToken } = this.getToken()
            let { fileIdent, reportName } = item
            let accessTokenNew = window.btoa(accessToken)
            let fileIdentnew = window.btoa(fileIdent)
            let idNew = window.btoa(this.id)
            let moduleCodeNew = window.btoa(this.moduleCode)
            let previewTypeNew = window.btoa('1')
            let reportNameNew = encodeURI(encodeURI(reportName))
            window.open(
                'http://115.29.251.56:6262/MXPreview.aspx?accessToken=' + accessTokenNew + '&fileIdent=' + fileIdentnew + '&identField=' + idNew + '&moduleId=' + moduleCodeNew + '&reportName=' + reportNameNew + '&previewType=' + previewTypeNew,
                'newwindow',
                'toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no'
            )
        },
        // 关闭窗口
        cancel() {
            this.dialogSetList = false
        },
        getTreeList() {
            let _this = this
            let data = {
                moduleCode: this.moduleCode,
                disableFlag: '0',
                delState: '0',
                type: 'list'
            }
            this.loading = true
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.reportManage, { params: data }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data.reportManageList)) {
                    _this.departments = res.body.data.reportManageList
                    let isdefault = false
                    for (let index = 0; index < _this.departments.length; index++) {
                        const element = _this.departments[index]
                        if (element.defaultFlag == 1) {
                            isdefault = true
                            this.PrintTemplateManagementShow(element, true)
                        }
                    }
                    if (!isdefault) {
                        this.dialogSetList = true
                    }
                } else {
                    _this.departments = []
                    _this.$message.error(_this.msg(res.body))
                }
                _this.loading = false
            }, (res) => {
                _this.loading = false
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        }
    },
    components: {
        'no-data': NoData,
        'print-template-management': PrintTemplateManagement
    },
    watch: {

    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.addShare {
    padding: 0 40px 20px;
    height: 286px;
    overflow: auto;
    .customerTitles {
        font-weight: 900;
        font-size: 15px;
    }
    .customer {
        position: relative;
        line-height: 35px;
        .customerTitle {
            font-weight: 900;
            font-size: 15px;
            position: absolute;
            top: 0;
            left: 0;
        }
    }
    .tip {
        font-size: 12px;
        margin-top: 20px;
    }
    .dialogFooter {
        height: 80px;
        text-align: center;
    }
}
</style>
