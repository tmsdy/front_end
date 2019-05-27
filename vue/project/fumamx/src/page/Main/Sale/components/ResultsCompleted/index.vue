<template>
    <div class="ResultsCompleted">
        <!-- 跟单 -->
        <el-dialog :title="$t('mxpcweb.sale.components.1557564916910')" v-dialogDrag :visible.sync="dialogVisible" :closeOnClickModal="false" custom-class="width420" :modal-append-to-body="false">
            <div class="formBox">
                <div class="fieldList">
                    <!-- 完成结果 -->
                    <span class="labelBox">{{$t('mxpcweb.sale.components.1557564917115')}}</span>
                    <el-select style="width:300px;" v-model="itemData.finStatus">
                        <!-- 订单结案 -->
                        <el-option :label="$t('mxpcweb.sale.components.1557564917311')" value="2"></el-option>
                        <!-- 进行中 -->
                        <el-option label="进行中" value="1"></el-option>
                        <!-- 订单取消 -->
                        <el-option :label="$t('mxpcweb.sale.components.1557564917530')" value="-1"></el-option>
                    </el-select>
                </div>
                <div class="fieldList">
                    <!-- 操作日期 -->
                    <span class="labelBox">{{$t('mxpcweb.sale.components.1557564917690')}}</span>
                    <el-date-picker style="width:300px;" v-model="itemData.finDate" type="datetime" size="small" format="yyyy-MM-dd HH:mm" align="right"></el-date-picker>
                </div>
                <div class="fieldList">
                    <!-- 说明 -->
                    <span class="labelBox">{{$t('mxpcweb.sale.components.1557564917891')}}</span>
                    <!-- 请填写说明 -->
                    <el-input style="width:300px;" type="textarea" size="small" :rows="4" :placeholder="$t('mxpcweb.sale.components.1557564918189')" v-model="itemData.finDesc"></el-input>
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
    name: 'ResultsCompleted',
    props: {

    },
    data() {
        return {
            itemData: {
                'finStatus': '2',
                'finDate': '',
                'finDesc': '',
                'doctryId': '',
                'moduleCode': 'SC003',
                'strucId': '1'
            },
            dialogVisible: false,
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
                'finStatus': '2',
                'finDate': '',
                'finDesc': '',
                'doctryId': item.doctryId || '',
                'moduleCode': 'SC003',
                'strucId': '1'
            }
            this.dialogVisible = true
        },
        // 提交表单
        submitForm() {
            let obj = JSON.parse(JSON.stringify(this.itemData))
            obj.finDate = this.$m_unifiedTime(obj.finDate, {format: 'YYYY-MM-DD HH:mm:ss'}) || ''
            this.subLoading = true
            this.$http.put(this.Global.baseURL + this.Global.api.v2.document_documentary_put, obj).then((res) => {
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
