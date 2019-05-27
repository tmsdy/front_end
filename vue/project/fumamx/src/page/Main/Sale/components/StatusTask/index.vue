<template>
    <div class="StatusTask">
        <!-- 跟单 -->
        <el-dialog :title="$t('mxpcweb.sale.components.1557564916910')" v-dialogDrag :visible.sync="dialogVisible" :closeOnClickModal="false" custom-class="width420" :modal-append-to-body="false">
            <div class="formBox">
                <div class="fieldList">
                    <!-- 流程环节 -->
                    <span class="labelBox">{{$t('mxpcweb.sale.components.1557564596388')}}</span>
                    <el-select style="width:300px;" disabled v-model="step">
                        <el-option :label="itemData.nodeName" value="1"></el-option>
                    </el-select>
                </div>
                <div class="fieldList">
                    <!-- 当前状态 -->
                    <span class="labelBox">{{$t('mxpcweb.sale.components.1557564918395')}}</span>
                    <el-select style="width:300px;" v-model="itemData.taskStatus">
                        <!-- 未开始 -->
                        <el-option :label="$t('mxpcweb.sale.components.1557564915723')" value="1"></el-option>
                        <!-- 进行中 -->
                        <el-option :label="$t('mxpcweb.sale.components.1557564915950')" value="2"></el-option>
                        <!-- 已完成 -->
                        <el-option :label="$t('mxpcweb.sale.components.1557564916151')" value="3"></el-option>
                        <!-- 跳过 -->
                        <el-option :label="$t('mxpcweb.sale.components.1557564916333')" value="4"></el-option>
                        <!-- 逾期 -->
                        <el-option v-show="false" :label="$t('mxpcweb.sale.components.1557564841949')" value="5"></el-option>
                    </el-select>
                </div>
                <div class="fieldList">
                    <!-- 跟单描述 -->
                    <span class="labelBox">{{$t('mxpcweb.sale.components.1557564918593')}}</span>
                    <!-- 请填写跟单描述 -->
                    <el-input style="width:300px;" type="textarea" size="small" :rows="4" :placeholder="$t('mxpcweb.sale.components.1557564961541')" v-model="itemData.followDesc"></el-input>
                </div>
                <div class="fieldList">
                    <!-- 跟单时间 -->
                    <span class="labelBox">{{$t('mxpcweb.sale.components.1557564961757')}}</span>
                    <el-date-picker style="width:300px;" v-model="itemData.followDate" type="datetime" size="small" format="yyyy-MM-dd HH:mm" align="right"></el-date-picker>
                </div>
            </div>
            <div class="text-center">
                <el-button type="primary" @click="submitForm()" :loading="subLoading">
                    <!-- 保 存 -->
                    {{$t('mxpcweb.sale.components.1557564616847')}}
                </el-button>
                <el-button @click="dialogVisible = false">
                    <!-- 取 消 -->
                    {{$t('mxpcweb.sale.components.1557564617043')}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'StatusTask',
    props: {

    },
    data() {
        return {
            itemData: {
                nodeName: '',
                taskStatus: '',
                followDesc: '',
                followDate: '',
                doctryId: '',
                orderId: ''
            },
            dialogVisible: false,
            step: '1',
            subLoading: false
        }
    },
    created() {
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        getData() {
            this.$emit('getData')
        },
        showDialog(item) {
            this.itemData = {
                nodeName: '',
                taskStatus: '',
                followDesc: '',
                followDate: new Date(),
                doctryNodeId: '',
                doctryId: '',
                orderId: ''
            }
            if (item) {
                this.itemData.doctryNodeId = item.doctryNodeId || ''
                this.itemData.nodeName = item.nodeName || ''
                this.itemData.taskStatus = item.taskStatus + '' || ''
                this.itemData.doctryId = item.doctryId + '' || ''
                this.itemData.orderId = item.orderId + '' || ''
            }
            this.dialogVisible = true
        },
        // 提交表单
        submitForm() {
            let obj = JSON.parse(JSON.stringify(this.itemData))
            obj.followDate = this.$m_unifiedTime(obj.followDate, {format: 'YYYY-MM-DD HH:mm:ss'}) || ''
            obj.moduleCode = 'SC003'
            obj.strucId = '2'
            this.subLoading = true
            this.$http.post(this.Global.baseURL + this.Global.api.v2.document_documentaryNode_taskRecord, obj).then((res) => {
                this.subLoading = false
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.$emit('getData')
                    this.$message.success(this.msg(res.body))
                    this.dialogVisible = false
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                this.subLoading = false
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        // 重置表单
        resetForm() {
        }
    },
    components: {
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
.more {
  text-align: center;
  color: grey;
  margin-bottom: 10px;
}
</style>
