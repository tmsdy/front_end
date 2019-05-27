<template>
    <div class="setWebsite">
        <!-- 修改域名 -->
        <el-dialog :close-on-click-modal="false" :title="$t('mxpcweb.am.1531903786509')" v-dialogDrag :visible.sync="dialogVisible1" custom-class="width620" :closeOnClickModal="false" class="addRemindDialog" :modal-append-to-body="false">
            <div class="contentBox">
                <div>
                    <!-- 原域名地址： -->
                    {{$t('mxpcweb.am.1531903792083')}}{{itemData.domainName}}
                </div>
                <br>
                <div>
                    <!-- 新域名地址： -->
                    {{$t('mxpcweb.am.1531903793250')}}<el-input v-model="website" placeholder="mywebsite.com" style="width:400px"></el-input>
                </div>
                <div class="text-right foot">
                    <!-- 取消修改 -->
                    <el-button @click="dialogVisible1 = false">{{$t('mxpcweb.am.1531903793434')}}</el-button>
                    <!-- 保存 -->
                    <el-button type="primary" @click="submitForm()" :loading="submitLoading">{{$t('mxpcweb.am.1531903711523')}}</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'setWebsite',
    props: {

    },
    data() {
        return {
            website: '',
            dialogVisible1: false,
            itemData: {
                domainName: ''
            },
            submitLoading: false
        }
    },
    methods: {
        showDialog(item) {
            let _this = this
            this.itemData = item
            this.website = ''
            _this.dialogVisible1 = true
        },
        submitForm() {
            this.submitLoading = true
            let _this = this
            if (_this.website.replace(/(^\s*)|(\s*$)/g, '') == '') {
                // 新域名地址不能为空
                _this.$message(this.$t('mxpcweb.am.1531903807298'))
                _this.submitLoading = false
                return false
            };
            if (_this.website.replace(/(^\s*)|(\s*$)/g, '') == this.itemData.domainName) {
                // 新域名地址不能与原域名地址重复
                _this.$message(this.$t('mxpcweb.am.1531903811153'))
                _this.submitLoading = false
                return false
            }
            _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.domainManage_Edit, {
                domainId: _this.itemData.domainid,
                newDomainName: _this.website.replace(/(^\s*)|(\s*$)/g, '')
            }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    // _this.$message.success(_this.msg(res.body));
                    _this.dialogVisible1 = false
                    _this.submitLoading = false
                    _this.$emit('getListData')
                } else if (res.body.code.toString() != '-3') {
                    _this.submitLoading = false
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
.setWebsite {
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
