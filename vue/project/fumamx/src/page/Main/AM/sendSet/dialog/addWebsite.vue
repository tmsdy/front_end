<template>
    <div class="addWebsite">
        <!-- 新增域名 -->
        <el-dialog :close-on-click-modal="false" :title="$t('mxpcweb.am.1531903655421')" v-dialogDrag :visible.sync="dialogVisible" custom-class="width620" :closeOnClickModal="false" class="addRemindDialog" :modal-append-to-body="false">
            <div class="contentBox">
                <div class="content1">
                    <!-- 输入发信域名： -->
                    {{$t('mxpcweb.am.1531903482197')}}
                    <el-input style="width:345px" v-model="website" placeholder="mywebsite.com"></el-input>
                    <div class="content2">
                        <!-- 请填写您的自有域名，并支持域名DNS的配置，以便后期完成域名的验证！ -->
                        {{$t('mxpcweb.am.1531903497587')}}
                    </div>
                    <div class="content2">
                        <!-- 追踪选项： -->
                        {{$t('mxpcweb.am.1531903500538')}}
                        <el-checkbox v-model="open"></el-checkbox>
                        <!-- 打开追踪 -->
                        <span style="margin:0 10px;">{{$t('mxpcweb.am.1531903513067')}}</span>
                        <el-checkbox v-model="click"></el-checkbox>
                        <!-- 点击追踪 -->
                        <span style="margin:0 10px;">{{$t('mxpcweb.am.1531903520355')}}</span>
                        <el-checkbox v-model="unsubscribe"></el-checkbox>
                        <span style="margin:0 10px;">退订追踪</span>
                    </div>
                </div>
                <!-- 注意事项： -->
                <div class="content3">{{$t('mxpcweb.am.1531903528562')}}<br>
                    <!-- 提示：域名可由英文字母、数字、-（中横线）构成，不能使用空格及特殊字符（如！、$、&、?、_等），不能含有中文。 -->
                    {{$t('mxpcweb.am.1531903528930')}}<br>
                    <!-- 新建的域名请确认未配置mx记录，否则该域名必配项mx记录将出现冲突。 -->
                    {{$t('mxpcweb.am.1531903529123')}}<br>
                    <!-- 由于企业邮箱域名的特殊性，不建议您创建企业邮箱域名作为发信域名，可以创建与企业邮箱域名不同的子域。 -->
                    {{$t('mxpcweb.am.1531903529330')}}
                </div>
                <div class="text-right foot">
                    <!-- 取消 -->
                    <el-button @click="dialogVisible = false" class="buttonStyle1">{{$t('mxpcweb.am.1531893140621')}}</el-button>
                    <!-- 确认创建 -->
                    <el-button type="primary" @click="submitForm()" :loading="submitLoading">{{$t('mxpcweb.am.1531903095139')}}</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'addWebsite',
    props: {

    },
    data() {
        return {
            website: '',
            dialogVisible: false,
            open: true,
            click: true,
            unsubscribe: false,
            submitLoading: false
        }
    },
    methods: {
        showDialog() {
            this.website = ''
            this.dialogVisible = true
            this.open = true
            this.click = true
            this.unsubscribe = false
        },
        submitForm() {
            this.submitLoading = true
            let _this = this
            let nameCheck = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/
            if (_this.website.replace(/(^\s*)|(\s*$)/g, '') == '') {
                _this.submitLoading = false
                return false
            }
            if (!nameCheck.test(_this.website)) {
                // 请输入正确的域名地址
                _this.$message(this.$t('mxpcweb.am.1531903553506'))
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
                    _this.dialogVisible = false
                    _this.submitLoading = false
                    _this.$emit('getListData')
                } else {
                    let mess = res.body.data.message != undefined ? res.body.data.message : res.body.msg
                    _this.$message.error(mess)
                    _this.dialogVisible = false
                    _this.submitLoading = false
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
.addWebsite {
    .contentBox {
        color: #3d425e;
        padding: 5px 45px 0;
        font-size: 12px;
        .content2 {
            padding-left: 90px;
            margin-top: 15px;
        }
        .content3 {
            margin-top: 36px;
            margin-bottom: 15px;
            color: #6b6b6b;
        }
        .foot {
            margin-top: 50px;
        }

        .buttonStyle {
            height: 30px;
            background: #6ca2ff;
            border: 0;
            font-size: 13px;
        }
        .buttonStyle1 {
            height: 30px;
            font-size: 13px;
        }
    }
}
</style>
