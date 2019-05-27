<template>
    <!-- 分配客户 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="dialogSetList" :closeOnClickModal="false" custom-class="width620" :modal-append-to-body="false">
        <div class="addShare">
            <div style="font-size:16px;" v-if="itemData && itemData.enterprise">
                <!-- 将 -->
                <span class="customerTitles">{{$t('mxpcweb.client.1529051259904')}}：</span>
                <span style="color:#ff943e;margin-left:64px;">{{itemData.enterprise}}</span>
            </div>
            <div class="customer">
                <!-- 分配给 -->
                <span class="customerTitle">{{$t('mxpcweb.client.1529051310810')}}：</span>
                <el-select v-model="select" filterable placeholder=""  style="width:380px;margin-left:100px;">
                    <!-- 暂无人员可选 -->
                    <el-option v-if="personnelTable.length==0" :label="$t('mxpcweb.client.1529050598359')" value="-1">
                    </el-option>

                    <div v-for="(item,index) in personnelTable" :key="index">
                        <el-option :label="item.realname" :value="item.ctid+''">
                        </el-option>
                    </div>
                </el-select>
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
import { isArray } from '@/libs/utils.js'
export default {
    name: 'otDistribute',
    props: {
    },
    data() {
        return {
            select: '',
            dialogSetList: false,
            itemData: {},
            submitLoading: false,
            personnelTable: [],
            title: '分配'
        }
    },
    created() {
        this.getData()
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        getData() {
            let _this = this
            let data = {
                dataType: 'contact',
                funType: 'all'
            }
            _this.$http.get(_this.Global.baseURL + _this.Global.api.mx.service_list, { params: data }).then(function(res) {
                if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                    _this.personnelTable = res.body.data
                } else {
                    _this.personnelTable = []
                    _this.$message.error(_this.msg(res.body))
                }
            }, function(res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 打开窗口
        openWindow(itemData) {
            if (this.personnelTable.length == 0) {
                // 您当前没有可供分配的人员
                this.$message(this.$t('mxpcweb.client.1529051381198'))
                return false
            };
            this.select = ''
            this.itemData = itemData
            this.dialogSetList = true
        },
        // 提交表单
        submit() {
            let _this = this
            if (_this.select == '') {
                // 目标人员不能为空
                _this.$message.error(_this.$t('mxpcweb.client.detail.1535438481594'))
                return false
            }
            let data = {
                cid: _this.itemData.cid + '',
                ctid: _this.select
            }
            _this.submitLoading = true
            _this.$http.put(this.Global.baseURL + this.Global.api.mx.enterprise_list, data).then(function(res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.dialogSetList = false
                    _this.submitLoading = false
                    _this.$emit('getData')
                     _this.$message.success(_this.msg(res.body))
                } else {
                    _this.submitLoading = false
                    _this.$message.error(_this.msg(res.body))
                }
            }, function(res) {
                _this.submitLoading = false
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 关闭窗口
        cancel() {
            this.dialogSetList = false
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
