<template>
<!-- 领取客户 -->
    <el-dialog v-dialogDrag :title="$t('mxpcweb.client.detail.1531101346234')" :visible.sync="dialogSetList" :closeOnClickModal="false" custom-class="width620" :modal-append-to-body="false">
        <div class="addShare">
            <div class="customer" v-if="departments.length>1">
                <!-- 部门： -->
                <span class="customerTitle">{{$t('mxpcweb.client.detail.1530587244553')}}</span>
                <el-select v-model="select2" filterable  clearable  style="width:380px;margin-left:100px;">
                    <div v-for="(item,index) in departments" :key="index">
                        <el-option :label="item.deptName" :value="item.dkey+''">
                        </el-option>
                    </div>
                </el-select>
            </div>
        </div>
        <div slot="footer" class="dialogFooter" style="text-align:center">
            <!-- 取消 -->
            <el-button @click="cancel">{{$t('mxpcweb.client.detail.1529994393355')}}</el-button>
            <!-- 确定 -->
            <el-button type="primary" @click="submit" :loading="submitLoading">{{$t('mxpcweb.client.detail.1529994368552')}}</el-button>
        </div>
    </el-dialog>
</template>
<script>
/**
 * 描述：客户管理-客户列表-设置列表字段
 * 作者：何俊峰
 * 时间：2017/11/10
 */
import { mapGetters } from 'vuex'
import { isArray} from '@/libs/utils.js'
export default {
    name: 'otReceive',
    props: {
    },
    data() {
        return {
            select2: '',
            dialogSetList: false, // 设置列表弹框
            myCtId: [],
            id: '',
            type: '',
            submitLoading: false,
            previousRequest: '',
            departments: [],
            moduleCode: '',
            callBack: function() {}
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
        // 打开窗口
        openWindow(obj) {
            let {billId, type, optData, next} = obj
            if (type) {
                this.type = type
                this.id = billId
            } else {
                this.id = [billId]
            }
            if (optData) {
                this.moduleCode = optData.optModuleCode
            }
            if (next) {
                this.callBack = next
            } else {
                this.callBack = function() {}
            }
            if (this.departments.length > 0) {
                this.otReceive()
            } else {
                this.myCtId = this.company.ctId
                this.getTreeList(this.myCtId)
            }
        },
        otReceive() {
            let _this = this
            if (!_this.departments || _this.departments.length == 0) {
                _this.$message('您当前暂无部门可进行领取操作！')
            } else if (_this.departments.length > 1) {
                _this.dialogSetList = true
            } else if (_this.departments.length === 1) {
                // 确定要领取客户?
                // 提示
                // 确定
                // 取消
                _this.$confirm(this.$t('mxpcweb.client.detail.1531101426823'), _this.$t('mxpcweb.client.detail.1529994349587'), {
                    confirmButtonText: _this.$t('mxpcweb.client.detail.1529994368552'),
                    cancelButtonText: _this.$t('mxpcweb.client.1529047588840'),
                    type: 'warning'
                }).then(() => {
                    _this.submit()
                }).catch(() => {
                })
            }
        },
        // 提交表单
        submit() {
            let _this = this
            this.submitLoading = true
            let data = {}
            let url = ''
            if (this.type === '1') {
                data = {
                    optModuleCode: _this.moduleCode,
                    targets: this.id.join(','),
                    optCode: 'otReceive',
                    toDept: this.select2
                }
                url = this.Global.api.v2.document_operate_listOpt_put
            } else {
                data = {
                    optModuleCode: _this.moduleCode,
                    identFieldValue: this.id.join(','),
                    optCode: 'otReceive',
                    toDept: this.select2
                }
                url = this.Global.api.v2.document_operate_detailOpt_put
            }
             _this.$http.put(this.Global.baseURL + url, data).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$emit('getListData', true)
                    _this.dialogSetList = false
                    _this.submitLoading = false
                    _this.callBack()
                    if (_this.type === '1') {
                        ep.emit('batchMsg', res.body)
                        _this.$emit('clearSelect')
                    } else {
                        _this.$message.success(_this.msg(res.body))
                    }
                } else {
                    _this.submitLoading = false
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                // _this.loading = false;
                _this.submitLoading = false
                 if (res.status == 0) return
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 关闭窗口
        cancel() {
            this.dialogSetList = false
        },
        getTreeList(ctId) {
            let _this = this
            if (ctId == '') {
                _this.departments = []
                return false
            };
            let departmentData
            departmentData = {
                dataType: 'department',
                funType: 'withRight',
                moduleCode: _this.moduleCode,
                optCode: 'otReceive',
                deptCascade: true,
                ctId: ctId
            }
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.accountDropList_get, { params: departmentData }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                     let departments = []
                    res.body.data.forEach(element => {
                        if (element.inUse === 1) {
                            departments.push(element)
                        }
                    })
                    _this.departments = departments
                    if (departments.length > 0) {
                        _this.select2 = departments[0].dkey + ''
                    }
                    _this.otReceive()
                } else {
                    _this.departments = []
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        }
    },
    watch: {

    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.addShare{
    padding:20px 40px;
    .customerTitles{
        font-weight: 900;
        font-size:15px;
    }
    .customer{
        position:relative;
        line-height:35px;
        margin-top:15px;
        .customerTitle{
            font-weight: 900;
            font-size:15px;
            position:absolute;
            top:0;
            left:0;
        }
    }
    .tip{
        font-size:12px;
        margin-top:20px;
    }
    .dialogFooter{
        height: 80px;
        text-align: center
    }
}
</style>
