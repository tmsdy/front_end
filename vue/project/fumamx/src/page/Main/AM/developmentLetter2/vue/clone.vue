<template>
    <div class="setclone">
        <!-- 复制模板 -->
        <el-dialog :title="$t('mxpcweb.am.1531896777597')" v-dialogDrag :visible.sync="dialogVisible1" custom-class="width520" :closeOnClickModal="false" class="addRemindDialog" :modal-append-to-body="false">
            <div class="contentBox">
                <div>
                    <!-- 模板名称 -->
                    <el-input v-model="clone" :placeholder="$t('mxpcweb.am.1531893007933')" style="width:400px"></el-input>
                </div>
                <div class="text-center foot">
                    <!-- 取消 -->
                    <el-button @click="dialogVisible1 = false">{{$t('mxpcweb.am.1531893140621')}}</el-button>
                    <!-- 确定 -->
                    <el-button type="primary" @click="submitForm()" :loading="submitLoading">{{$t('mxpcweb.am.1531893129621')}}</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'setclone',
    props: {

    },
    data() {
        return {
            clone: '',
            dialogVisible1: false,
            itemData: {
                domain_name: ''
            },
submitLoading: false
        }
    },
    methods: {
        showDialog(item) {
            let _this = this
            this.itemData = item
            // 复制
            this.clone = this.itemData.name + '_' + this.$t('mxpcweb.am.1531893077381')
            _this.dialogVisible1 = true
        },
        submitForm() {
            this.submitLoading = true
            let _this = this
            if (_this.clone.replace(/(^\s*)|(\s*$)/g, '') == '') {
                // 新模板不能为空
                _this.$message(this.$t('mxpcweb.am.1531896908167'))
                return false
            };
            _this.$http.post(this.Global.baseURL + this.Global.api.v2.tmplClone_Add, {
                invokeNameToCopy: this.itemData.invokeName,
                newName: _this.clone.replace(/(^\s*)|(\s*$)/g, '')
            }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    this.dialogVisible1 = false
                    this.submitLoading = false
                    _this.$emit('getListData')
                    _this.$message.success(_this.msg(res.body))
                } else if (res.body.code.toString() != '-3') {
                    this.submitLoading = false
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        }
    },
    components: {
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.setclone {
    .contentBox {
        color: #3d425e;
        padding: 0 20px;
        .content1 {
            font-size: 22px;
        }
        .content2 {
            font-size: 12px;
            margin-top: 26px;
        }
        .content3 {
            font-size: 14px;
            margin-top: 36px;
            margin-bottom: 15px;
        }
        .foot {
            margin-top: 50px;
        }
    }
}
</style>
