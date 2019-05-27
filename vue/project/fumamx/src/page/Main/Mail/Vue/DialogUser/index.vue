<template>
    <div class="DialogUser">
        <!-- 请选择移交人 -->
        <el-dialog v-dialogDrag :title="$t('mxpcweb.mail.1528942304139')" :visible.sync="isOpen" custom-class="width620" @close="resetForm('dialogUserForm')" :close-on-click-modal="false" >
            <el-form ref="dialogUserForm" label-width="150px">
                <!-- 移交人名称 -->
                <el-form-item :label="$t('mxpcweb.mail.1528942306374')">
                    <el-select filterable v-model="svalue">
                        <el-option v-for="(item,index) in options" :key="index" :label="item.realName" :value="item.ctId+''"> </el-option>
                    </el-select>
                </el-form-item>
                <div class="text-center">
                    <!-- 取消 -->
                    <el-button @click="cancelClick()">{{$t('mxpcweb.mail.1528942364802')}}</el-button>
                    <!-- 确定 -->
                    <el-button @click="submitUser('dialogUserForm')" :loading="submitLoading" type="primary">{{$t('mxpcweb.mail.1528942374762')}}</el-button>
                </div>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>
/**
 * 描述：邮件部分
 * 作者：向士健(CSS) / ***(API)
 * 时间：2017/12/11
 */
import { mapGetters, mapMutations } from 'vuex'
import { isObject } from '@/libs/utils.js'

export default {
    name: 'DialogUser',
    props: {

    },
    data() {
        return {
            isOpen: false, // 弹窗开关
            options: [],
            svalue: '',
            boxId: 0,
            targetBoxId: 0,
            containSubBox: false,
            submitLoading: false

        }
    },
    computed: {
        ...mapGetters('mail', [
            'treeMenu', // getters.js文件中personalInfo
            'subordinateCtid'
        ]),
        ...mapGetters([
            'company'

        ])
    },
    methods: {
        ...mapMutations('mail', {
            set_refurbishBool: 'SET_REFURBISHBOOL'
        }),
        // 清空表单
        resetForm(formName) {
            if (this.isOpen) {
                this.$refs[formName].resetFields()
            }
        },
        // 父组件来调用
        isDialogs(to) {
            if (to == 'open') {
                this.isOpen = true
                this.svalue = ''
            } else {
                this.isOpen = false
            }
        },

        // 确定移交人
        submitUser() {
            this.isOpen = false
            this.submitLoading = true
            let _this = this
            let data = { recCtid: _this.svalue, boxId: _this.boxId, targetBoxId: _this.targetBoxId, containSubBox: _this.containSubBox }
            if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                data.ctid = this.subordinateCtid
            } else {
                delete data.ctid
            }
            _this.$http.post(_this.Global.baseURL + _this.Global.api.Mail.mailBoxTransferPost, data).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message.success(_this.$t('mxpcweb.mail.1528970661318'))// '移交成功!'
                    _this.isOpen = false
                    _this.submitLoading = false
                    this.set_refurbishBool(1)
                } else {
                    _this.submitLoading = false
                    _this.$message.error(_this.msg(res.body))
                }
            },
                function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
        },
        // 取消
        cancelClick() {
            this.isOpen = false
        },
        // 获取页面数据
        getPersonalData() {
            let _this = this
            let url = this.Global.baseURL + this.Global.api.SystemSet.personaldata.accountIndividualInf// 当前企业所有账户
            this.$http.get(url, { params: { type: 'allUserList' } }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK && isObject(res.body.data)) {
                    let data = res.body.data.accountList
                    let list = []
                    for (let i = 0; i < data.length; i++) {
                        list.push({ realName: data[i].realName, ctId: data[i].companies[0].ctId })
                    }
                    this.options = list
                } else {
                    _this.$message.error(res.data.msg)
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        }
    },
    watch: {
        treeMenu: function (newValue, oldValue) {
            if (newValue.type == 'HandOverTo') {
                this.getPersonalData()
                this.isDialogs('open')
                this.boxId = newValue.data.boxId
                this.targetBoxId = newValue.data.targetBoxId
                this.containSubBox = newValue.data.containSubBox
            }
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
