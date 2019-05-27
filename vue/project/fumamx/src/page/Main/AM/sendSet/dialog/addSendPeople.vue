<template>
    <div class="addSendPeople">
        <!-- 添加发件人 -->
        <!-- 添加回复人 -->
        <el-dialog :close-on-click-modal="false" :title="type=='0'?$t('mxpcweb.am.1531903046900'):$t('mxpcweb.am.1531903052274')" v-dialogDrag :visible.sync="dialogVisible" custom-class="width720" :closeOnClickModal="false" class="addRemindDialog" :modal-append-to-body="false">
            <div class="contentBox">
                <div class="content1">
                    <!-- 发件人 -->
                    <!-- 回复人 -->
                    <!-- 地址: -->
                    <span class="title">{{type=='0'?$t('mxpcweb.am.1531897635637'):$t('mxpcweb.am.1531903061906')}}{{$t('mxpcweb.am.1531903395163')}}</span>
                    <!-- 输入接收邮箱地址 -->
                    <el-input :style="{width:type=='0'?'188px':'385px'}" v-model="website" :placeholder="$t('mxpcweb.am.1543212718290')"></el-input>
                    <!-- 选择地址后缀 -->
                    <el-select v-if="type=='0'" v-model="people1" style="width:188px;margin-left:6px;" :placeholder="$t('mxpcweb.am.1531903128379')">
                        <el-option v-for="(item,index) in domainList" v-show="item.domainVerify >6" :key="index" :value="item.domainName" :label="'@'+item.domainName"></el-option>
                    </el-select>
                </div>
                <div class="content1">
                    <!-- 发件人 -->
                    <!-- 回复人 -->
                    <!-- 名称: -->
                    <span class="title">{{type=='0'?$t('mxpcweb.am.1531897635637'):$t('mxpcweb.am.1531903061906')}}{{$t('mxpcweb.am.1531903376434')}}</span>
                    <!-- 输入显示名称 -->
                    <el-input :maxlength="20" style="width:385px" v-model="websiteName" :placeholder="$t('mxpcweb.am.1531903076643')"></el-input>
                </div>
                <div class="content1">
                    <!-- 使用人员： -->
                    <span class="title">{{$t('mxpcweb.am.1531903082331')}}</span>
                    <!-- 选择使用人员 -->
                    <el-select v-model="people" filterable style="width:385px" :placeholder="$t('mxpcweb.am.1531903094938')">
                        <!-- 全部人员 -->
                        <el-option value="0" :label="$t('mxpcweb.am.1531903437658')"></el-option>
                        <el-option v-for="(item,index) in owners" :key="index" :label="item.realName" :value="item.ctId+''"></el-option>
                    </el-select>
                </div>
                <div class="text-center foot">
                    <!-- 取消 -->
                    <el-button @click="dialogVisible = false">{{$t('mxpcweb.am.1531893140621')}}</el-button>
                    <!-- 确认创建 -->
                    <el-button type="primary" @click="submitForm()" :loading="submitLoading">{{$t('mxpcweb.am.1531903095139')}}</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'addSendPeople',
    props: {
        owners: {
            type: Array,
            default: function () {
                return []
            }
        },
        domainList: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    data() {
        return {
            website: '',
            websiteName: '',
            dialogVisible: false,
            people: '',
            people1: '',
            type: '1',
            submitLoading: false
        }
    },
    methods: {
        showDialog(type) {
            this.people = this.company.ctId + ''
            this.people1 = ''
            this.website = ''
            this.websiteName = ''
            this.type = type
            this.dialogVisible = true
        },
        submitForm() {
            let _this = this
            if (this.website == 'mxpcweb.am.1531903109035') {
                // 请输入地址
                this.$message(this.$t(''))
                return false
            };
            if (this.websiteName == '') {
                // 请输入显示名称
                this.$message(this.$t('mxpcweb.am.1531903113330'))
                return false
            };
            if (this.people == '') {
                // 请选择使用人员
                this.$message(this.$t('mxpcweb.am.1531903118698'))
                return false
            };
            let data = {
                'name': this.websiteName,
                'ownerCtId': this.people,
                'type': this.type == '1' ? 'replyTo' : 'send'
            }
            let url = this.Global.api.v2.sendAndReply_Add
            if (this.type == '1') {
                url = this.Global.api.v2.sendAndReply_Add
                let reg = /^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/
                if (!reg.test(this.website)) {
                    // 请输入正确的地址！
                    this.$message(this.$t('mxpcweb.am.1531903123554'))
                    return false
                }
                data.address = this.website
            } else {
                if (this.people1 == '') {
                    // 请选择地址后缀
                    this.$message(this.$t('mxpcweb.am.1531903128379'))
                    return false
                };
                data.address = this.website + '@' + this.people1
                this.domainList.forEach(element => {
                    if (element.domain_name == this.people1) {
                        data.domain_id = element.id
                    }
                })
            };
            this.submitLoading = true
            this.$http.post(this.Global.baseURL + url, data).then((res) => {
                if (res.body.code.toString() === this.Global.RES_OK) {
                    this.$message.success(_this.msg(res.body))
                    this.$emit('getListDatas')
                    this.submitLoading = false
                    this.dialogVisible = false
                } else if (res.body.code.toString() != '-3') {
                    this.$message.error(_this.msg(res.body))
                    this.submitLoading = false
                } else {
                    this.submitLoading = false
                }
            }, function (res) {
                this.$message.error(_this.$t(_this.Global.errorTitle))
                this.submitLoading = false
            })
        }
    },
    computed: {
        ...mapGetters(['company'])
    },
    components: {
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.addSendPeople {
    .contentBox {
        color: #3d425e;
        padding: 0 70px;
        font-size: 12px;
        .content1 {
            margin-top: 25px;
            .title {
                display: inline-block;
                width: 100px;
                text-align: right;
            }
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
