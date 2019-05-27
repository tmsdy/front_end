<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" :modal-append-to-body="false" :closeOnClickModal="false" custom-class="width520" v-dialogDrag size="tiny">
        <div class="labelBox">
            <div>
                <div>保留的标签</div>
                <span class="label text-hover" v-if="mainItem.labelId" :style="setBgColor(mainItem.color)">
                    <span>{{mainItem.labelName}}</span>
                </span>
            </div>
            <div>
                <div>将要合并的标签</div>
                <template v-for="(tag,index) in labelIds">
                    <span :key="index" v-if="tag.color!=11" class="label text-hover" @click="mainItem = tag"  :style="setBgColor(tag.color)">
                        <span>{{tag.labelName}}</span>
                    </span>
                </template>
            </div>
        </div>
        <div slot="footer">
            <div style="width: 320px;
                display: inline-block;
                text-align: left;
                font-size: 12px;
                color:red;">
                合并之后无法撤销，请谨慎操作!
            </div>
            <!-- 取消 -->
            <el-button @click="dialogVisible = false">{{$t('mxpcweb.client.1529047588840')}}</el-button>
            <!-- 确定 -->
            <el-button type="primary" @click="submit" :loading="subLoading">{{$t('mxpcweb.client.1529047741736')}}</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { tagsBgColor } from '@/libs/utils.js'
export default {
    name: 'addShare',
    props: {
    },
    data() {
        return {
            title: '标签合并',
            dialogVisible: false,
            labelIds: [],
            billId: [],
            mainItem: {},
            subLoading: false,
            moduleCode: '',
            getListData: function() {}
        }
    },
    created () {
    },
    methods: {
        setBgColor(labelId) {
            return tagsBgColor(labelId)
        },
        submit() {
            this.$confirm('合并之后无法撤销，确定要进行合并操作？', this.$t('mxpcweb.client.1529047715824'), {
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                this.subLoading = true
                if (!this.mainItem.labelId) {
                    this.$message('请选择保留的标签')
                    this.subLoading = false
                    return false
                }
                this.$http.put(this.Global.baseURL + this.Global.api.v2.labelManage, {
                    targetLabelId: this.mainItem.labelId,
                    mergedLabelIds: this.billId,
                    moduleCode: this.moduleCode
                }).then((res) => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.$message.success(this.msg(res.body))
                        this.subLoading = false
                        this.dialogVisible = false
                        this.getListData()
                    } else {
                        this.subLoading = false
                        this.$message.error(this.msg(res.body))
                    }
                }, (res) => {
                    this.subLoading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
            }).catch(() => {
            })
        },
        openWindow(obj) {
            // this.$message('敬请期待！')
            // return false
            this.labelIds = []
            let { billId, customerLists, next } = obj
            if (billId.length > 1) {
                this.mainItem = {}
                this.dialogVisible = true
                this.moduleCode = obj.optData.optModuleCode
                if (this.moduleCode == 'BF001') {
                    this.title = '客户管理 - 标签合并'
                } else if (this.moduleCode == 'EM001') {
                    this.title = '孚盟邮 - 标签合并'
                }
                this.billId = billId
                this.billId.forEach((item) => {
                    customerLists.forEach((items) => {
                        if (items.labelId == item) {
                            this.labelIds.push(items)
                        }
                    })
                })
                if (next) {
                    this.getListData = next
                } else {
                    this.getListData = function() {}
                }
            } else {
                // 请选中两位客户进行合并操作!
                // 提示
                // 我知道了
                this.$confirm('请选中两个及以上标签进行合并操作!', this.$t('mxpcweb.client.1529047715824'), {
                    confirmButtonText: this.$t('mxpcweb.client.1529052329386'),
                    type: 'warning'
                }).then(() => {
                }).catch(() => {
                })
            }
        }
    },
    watch: {
    },
    components: {
    }
}
</script>
<style lang="less" scoped>
.labelBox{
    min-height: 200px;
    padding: 20px 16px 0;
    >div{
        min-height: 80px;
        >div{
            height: 30px;
        }
        .label{
            height: 26px;
            display: inline-block;
            padding: 4px 12px;
            margin: 0 10px 10px 0;
            white-space: nowrap;
            position: relative;
            border-radius: 16px;
            background-color: #008cee;
            font-size: 12px;
            transform: scale(0.9);
            -webkit-transform: scale(0.9);
            color: #fff;
            opacity: 1;
            font-size: 12px;
        }
    }
}
</style>
