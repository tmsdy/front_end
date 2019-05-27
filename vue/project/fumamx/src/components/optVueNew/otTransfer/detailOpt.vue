<template>
<!-- 客户负责人转移 -->
    <el-dialog v-dialogDrag :title="$t('mxpcweb.client.1529054059107')" :visible.sync="dialogSetList" :closeOnClickModal="false" custom-class="width620" :modal-append-to-body="false">
        <div class="addShare">
            <div style="font-size:16px;" v-if="itemData.custName">
                <!-- 客户 -->
                <span class="customerTitles">{{$t('mxpcweb.client.1529049476377')}}：</span>
                <span class="customerBox">{{itemData.custName}}</span>
            </div>
            <div class="customer">
                <!-- 新负责人 -->
                <span class="customerTitle">{{$t('mxpcweb.client.1529054088016')}}：</span>
                <el-select v-model="select" filterable placeholder="" @change="getTreeList"  style="width:380px;margin-left:100px;">
                    <!-- 暂无人员可选 -->
                    <el-option v-if="personnelTable.length==0" :label="$t('mxpcweb.client.1529050598359')" value="-1">
                    </el-option>
                    <div v-for="(item,index) in personnelTable" :key="index"  v-show="item.inUse===1">
                        <el-option :label="item.realName" :value="item.ctId+''">
                        </el-option>
                    </div>
                </el-select>
            </div>
            <div class="customer" v-if="departments.length>1&&select!==''">
                <!-- 部门： -->
                <span class="customerTitle">{{$t('mxpcweb.client.detail.1530587244553')}}</span>
                <el-select v-model="select2" filterable  clearable  style="width:380px;margin-left:100px;">
                    <div v-for="(item,index) in departments" :key="index">
                        <el-option :label="item.deptName" :value="item.dkey+''">
                        </el-option>
                    </div>
                </el-select>
            </div>
            <div class="customer">
                <!-- 同时移交联系人和跟进 -->
                <el-checkbox  style="width:380px;margin:9px 0 0 100px;" v-model="transferList">{{$t('mxpcweb.client.detail.1530587025659')}}</el-checkbox>
                <div v-if="itemData&&itemData.cooperate&&itemData.cooperate.length!==0">
                    <!-- 是否保留共享协作人 -->
                    <el-checkbox style="width:380px;margin:9px 0 0 100px;" v-model="transferList1">{{$t('mxpcweb.client.detail.1530587103901')}}</el-checkbox>
                    <el-select v-if="transferList1" v-model="cooperateSelect" filterable multiple placeholder=""  style="width:380px;margin-left:100px;">
                        <div v-for="(item,index) in itemData.cooperateData" :key="index">
                            <el-option :label="item.realName" :value="item.ctId">
                            </el-option>
                        </div>
                    </el-select>
                </div>
            </div>
        </div>
        <div slot="footer" class="dialogFooter" style="text-align:center">
            <!-- 取消 -->
            <el-button @click="cancel">{{$t('mxpcweb.client.1529047588840')}}</el-button>
            <!-- 确定 -->
            <el-button type="primary" @click="submit"  :loading="submitLoading">{{$t('mxpcweb.client.1529047741736')}}</el-button>
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
import { isArray } from '@/libs/utils.js'
export default {
    name: 'addShare',
    props: {
        personnelTable: {
            type: Array,
            default: function() {
                return []
            }
        }
    },
    data() {
        return {
            select: '',
            select2: '',
            cooperateSelect: [], // 共享人员
            dialogSetList: false, // 设置列表弹框
            rights: '',
            departments: [],
            myCtId: [],
            id: '',
            itemData: {},
            transferList: true, // 是否同时分配客户和联系人
            transferList1: true, // 是否同时共享人
            submitLoading: false,
            moduleCode: ''
        }
    },
    created() {
    },
    mounted() {
        this.myCtId = this.company.ctId
    },
    computed: {
        ...mapGetters([
            'company',
            'contactList'
        ])
    },
    methods: {
        // 打开窗口
        openWindow(obj) {
            let { billId, moduleCode, itemData } = obj
            this.select = ''
            this.select2 = ''
            this.transferList = true
            this.transferList1 = true
            this.departments = []
            this.id = billId
            this.moduleCode = moduleCode
            this.itemData = itemData
            if (this.itemData.cooperate && this.itemData.cooperate.length !== 0) {
                let cooperateData = []
                this.itemData.cooperate.forEach(element => {
                    cooperateData.push({
                        ctId: element,
                        realName: this.contactList[element] || ''
                    })
                })
                this.itemData.cooperateData = cooperateData
                this.cooperateSelect = this.itemData.cooperate
            } else {
                this.cooperateSelect = []
            }
            this.dialogSetList = true
        },
        // 提交表单
        submit() {
            let _this = this
            if (this.select == '') {
                // 目标人员不能为空
                _this.$message.error(_this.$t('mxpcweb.client.detail.1535438481594'))
                return false
            } else if (this.select2 == '') {
                // 目标部门不能为空
                _this.$message.error(_this.$t('mxpcweb.client.detail.1535438553276'))
                return false
            }
            let data = {
                optModuleCode: _this.moduleCode,
                identFieldValue: _this.id,
                optCode: 'otTransfer',
                toCtId: this.select,
                toDept: this.select2
            }
            if (this.transferList) {
                if (this.itemData.cooperate && this.itemData.cooperate.length !== 0) {
                    data.transferList = '1,2'
                    if (this.transferList1) {
                        data.cooperateCtIds = this.cooperateSelect.join(',')
                    } else {
                        data.cooperateCtIds = ''
                    }
                } else {
                    data.transferList = '1'
                }
            } else {
                if (this.itemData.cooperate && this.itemData.cooperate.length !== 0) {
                    data.transferList = '2'
                    if (this.transferList1) {
                        data.cooperateCtIds = this.cooperateSelect.join(',')
                    } else {
                        data.cooperateCtIds = ''
                    }
                } else {
                    data.transferList = ''
                }
            }
            this.submitLoading = true
             _this.$http.put(this.Global.baseURL + this.Global.api.v2.document_operate_detailOpt_put, data).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$emit('getListData', true)
                    _this.dialogSetList = false
                    _this.submitLoading = false
                     _this.$message.success(_this.msg(res.body))
                } else {
                    _this.submitLoading = false
                    _this.$message.error(_this.msg(res.body))
                }
            }, (res) => {
                _this.submitLoading = false
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
                moduleCode: 'BF001',
                optCode: 'otTransfer',
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
    .customerBox{
        color:#ff943e;
        margin-left:49px;
    }
    .customer{
        position:relative;
        line-height:35px;
        margin-top:15px;
        .customerTitle{
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
    }
}
</style>
