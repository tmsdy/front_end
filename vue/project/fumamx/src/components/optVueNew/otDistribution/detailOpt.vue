<template>
    <!-- 分配客户 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="dialogSetList" :closeOnClickModal="false" custom-class="width620" :modal-append-to-body="false">
        <div class="addShare">
            <div style="font-size:16px;" v-if="itemData.billName">
                <!-- 将 -->
                <span class="customerTitles">{{$t('mxpcweb.client.1529051259904')}}：</span>
                <span style="color:#ff943e;margin-left:36px;">{{itemData.billName}}</span>
            </div>
            <div class="customer">
                <!-- 分配给 -->
                <span class="customerTitle">{{$t('mxpcweb.client.1529051310810')}}：</span>
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
            <div class="customer" v-if="moduleCode == 'BF001'">
                <!-- 同时分配联系人和跟进 -->
                <el-checkbox  style="width:380px;margin:9px 0 0 100px;" v-model="transferList">{{$t('mxpcweb.client.1529054110036')}}</el-checkbox>
            </div>
        </div>
        <div slot="footer" class="dialogFooter" style="text-align:center">
             <!-- 取消 -->
            <el-button @click="cancel">{{$t('mxpcweb.client.1529047588840')}}</el-button>
            <!-- 确定 -->
            <el-button type="primary" @click="submit" :loading="submitLoading">{{$t('mxpcweb.client.1529047741736')}}</el-button>
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
            dialogSetList: false, // 设置列表弹框
            rights: '',
            myCtId: [],
            id: '',
            itemData: '',
            submitLoading: false,
            previousRequest: '',
            departments: [],
            transferList: true,
            title: '',
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
            'individualConfigInfo',
            'company'
        ])
    },
    methods: {
        // 打开窗口
        openWindow(obj) {
            let { billId, moduleCode, itemData, optData} = obj
            this.title = optData.optName
            this.select = ''
            this.select2 = ''
            this.departments = []
            this.dialogSetList = true
            this.transferList = true
            this.id = billId
            this.moduleCode = moduleCode
            this.itemData = itemData
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
                optCode: 'otDistribution',
                toCtId: this.select,
                toDept: this.select2
            }
            if (this.moduleCode == 'BF001' && this.transferList) {
                data.transferList = '1'
            }
            let config = {
                before(request) {
                    if (this.previousRequest) {
                        this.previousRequest.abort()
                    }
                    this.previousRequest = request
                }
            }
            _this.submitLoading = true
            _this.$http.put(this.Global.baseURL + this.Global.api.v2.document_operate_detailOpt_put, data, config).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$emit('getListData', true)
                    this.dialogSetList = false
                    _this.submitLoading = false
                     _this.$message.success(_this.msg(res.body))
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
                moduleCode: 'BF001',
                optCode: 'otDistribution',
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
    }
}
</style>
