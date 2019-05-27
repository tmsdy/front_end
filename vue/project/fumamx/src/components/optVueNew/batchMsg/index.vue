<template>
<!-- 批量操作结果 -->
    <el-dialog v-dialogDrag :title="$t('mxpcweb.client.1529050702347')" :visible.sync="dialogBatchMsg" :closeOnClickModal="false" custom-class="width420"  :modal-append-to-body="false">
        <div class="setList MXscroll"  style="max-height:600px;min-height:100px;overflow-y:scroll;">
             <!-- 成功 -->
             <!-- 条 -->
             <!-- 失败 -->
             <!-- 条 -->
            <div class="list" style="text-align:center">{{$t('mxpcweb.client.1529050837698')}}<span style="color:#00FF00">{{list.successNum}}</span>{{$t('mxpcweb.client.1529050859097')}},{{$t('mxpcweb.client.1529050891969')}}<span style="color:red">{{list.failNum}}</span>{{$t('mxpcweb.client.1529050859097')}}。</div>
            <!-- 失败原因 -->
            <div class="list" v-if="list.failNum != 0">{{$t('mxpcweb.client.1529050891969')}}</div>
            <template v-if="list.failNum != 0">
                <el-row class="list listTit">
                    <el-col :span="12">单据名称</el-col>
                    <el-col :span="12">失败原因</el-col>
                </el-row>
                <el-row class="list"  v-for="(item,index) in list.handleList" :key="index" >
                    <el-col class="custName" :span="12">{{item.titleName}}</el-col>
                    <el-col class="content" :span="12">{{itemMsg(item.lMsg)}}</el-col>
                </el-row>
            </template>
        </div>
    </el-dialog>
</template>
<script>
/**
 * 描述：客户管理-客户列表-设置列表字段
 * 作者：何俊峰
 * 时间：2017/11/10
 */
export default {
    name: 'batchMsg',
    props: {
    },
    data() {
        return {
            list: {
                failNum: 0,
                handleList: [],
                successNum: 0
            },
            dialogBatchMsg: false
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
        openWindow(list) {
            if (list) {
                if (list.data.failNum == 0) {
                    this.$message.success(this.msg(list))
                    return false
                }
                this.list = list.data
                this.dialogBatchMsg = true
            }
        },
        itemMsg (data) {
            if (data && data.key) {
                let d = {}
                d = data.data
                Object.keys(d).forEach(key => {
                    if (d[key].toString().substring(0, 6) === 'const.') {
                        d[key] = this.$t(d[key])
                    }
                })
                return this.$t(data.key, d)
            }
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
