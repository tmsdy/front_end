<template>
    <div class="setWebsite">
        <!-- 设置域名 -->
        <el-dialog :close-on-click-modal="false" :title="$t('mxpcweb.am.1531903693735')" v-dialogDrag :visible.sync="dialogVisible" custom-class="width620" :closeOnClickModal="false" class="addRemindDialog" :modal-append-to-body="false">
            <div class="contentBox">
                <!-- 提供您的网站域名 -->
                <div class="content1">{{$t('mxpcweb.am.1531903698979')}}</div>
                <div class="content2">
                    <!-- 加入网站域名可以改善邮件到达率。 -->
                    {{$t('mxpcweb.am.1531903699218')}}
                </div>
                <!-- 网站域名 -->
                <div class="content3">{{$t('mxpcweb.am.1531903699484')}}</div>
                <el-input v-model="website" placeholder="mywebsite.com"></el-input>
                <div class="text-right foot">
                    <!-- 暂时不要 -->
                    <el-button @click="dialogVisible = false">{{$t('mxpcweb.am.1531903711354')}}</el-button>
                    <!-- 保存 -->
                    <el-button type="primary" :loading="submitLoading" @click="submitForm()">{{$t('mxpcweb.am.1531903711523')}}</el-button>
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
            dialogVisible: false,
            submitLoading: false
        }
    },
    methods: {
        showDialog() {
            let _this = this
            _this.website = ''
            this.DialogVisible = true
        },
        submitForm() {
            this.submitLoading = true
            let _this = this
            if (_this.website.replace(/(^\s*)|(\s*$)/g, '') == '') {
                _this.submitLoading = false
                return false
            }
            _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.domainManage_Add, {
                domainName: _this.website.replace(/(^\s*)|(\s*$)/g, ''),
                openTrack: _this.open ? '1' : '0',
                clickTrack: _this.click ? '1' : '0',
                unsubscribeTrack: _this.unsubscribe ? '1' : '0',
                emailType: '1'
            }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message.success(_this.msg(res.body))
                    _this.submitLoading = false
                    _this.dialogVisible = false
                } else {
                    let mess = res.body.data.message != '' ? res.body.data.message : res.body.msg
                    _this.submitLoading = false
                    _this.$message.error(mess)
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
