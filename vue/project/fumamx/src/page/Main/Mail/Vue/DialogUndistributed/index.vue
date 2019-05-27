<template>
    <div class="DialogInDistribute">
        <!-- 内部分发 -->
        <el-dialog v-dialogDrag :title="$t('mxpcweb.mail.1528955361707')" :visible.sync="isOpen" custom-class="width620" @close="resetForm('dialogForm')" :modal-append-to-body="false" :close-on-click-modal="false">
            <el-form :model="dialog" :rules="dialogRules" ref="dialogForm" label-width="95px">
                <!-- 内部分发给 -->
                <el-form-item :label="$t('mxpcweb.mail.1528955399340')" prop="member">
                    <el-tag :closable="true" v-for="(item,index) in dialog.member" :key="index" @close="deleteThisEmployee(index)" style="margin-right:10px;">{{item.name}}</el-tag>
                    <!-- 内部接收人员 -->
                    <el-button size="small" style="padding:5px 9px;" @click="openEmployeeDialog">+ {{$t('mxpcweb.mail.1528955420502')}}</el-button>
                </el-form-item>
                <el-form-item label="处理" prop="" class="marginTop-10">
                    <div>
                        <!-- 标记为已分发 -->
                        <el-checkbox v-model="dialog.isLabelDistributed">{{$t('mxpcweb.systemset.mailset.mailaccount.1533539699899')}}</el-checkbox>
                    </div>
                    <div>
                        <!-- 发件人"vibowl@fumasoft.com"以后再来信自动分发给以上人员 -->
                        <el-checkbox v-if="address" v-model="dialog.isAutoDistributed">{{$t('mxpcweb.mail.1534229299675',{a:address})}}</el-checkbox>
                        <!-- 当前选中邮件的发件人以后再来信自动分发给以上人员  -->
                        <el-checkbox v-else v-model="dialog.isAutoDistributed">{{$t('mxpcweb.mail.1556421117075')}}</el-checkbox>

                    </div>
                </el-form-item>
                <!-- 提醒@ -->
                <el-form-item :label="$t('mxpcweb.mail.1528955451253')" prop="" class="marginTop-10">
                    <!-- 提醒接收人员 -->
                    <el-checkbox v-model="dialog.isRemind">{{$t('mxpcweb.mail.1528955477022')}}</el-checkbox>
                </el-form-item>
                <el-form-item label="" prop="content" class="marginTop-10">
                    <!-- 请填写提醒内容 -->
                    <el-input v-model="dialog.content" type="textarea" :rows="3" :placeholder="$t('mxpcweb.mail.1528954577829')"></el-input>
                </el-form-item>
                <br>
                <br>
                <br>
                <div class="text-center">
                    <el-button class="footerButton" @click="isOpen = false">{{$t('mxpcweb.mail.1528942364802')}}</el-button>
                    <!-- 保存 -->
                    <el-button type="primary" :loading="submitLoading" @click="submit('dialogForm')">{{$t('mxpcweb.mail.1528786401856')}}</el-button>
                </div>
            </el-form>
        </el-dialog>
        <dialog-employee ref="DialogEmployee"></dialog-employee>
    </div>
</template>

<script>
/**
 * 描述：邮件部分
 * 作者：向士健(CSS) / ***(API)
 * 时间：2017/12/11
 */
import DialogEmployee from '../DialogEmployee/index.vue'
import { isArray } from '@/libs/utils.js'
import { mapGetters } from 'vuex'
export default {
    name: 'DialogInDistribute',
    props: {},
    data() {
        var _this = this
        /**
         * 提醒内容验证
         */
        var validContent = (rule, value, callback) => {
            if (this.dialog.isRemind && value === '') {
                //  请输入提醒内容
                callback(new Error(_this.$t('mxpcweb.mail.1528955558828')))
            } else {
                callback()
            }
        }
        return {
            isOpen: false, // 弹窗开关
            mailIds: [],
            dialog: {
                member: [],
                isLabelDistributed: false,
                isAutoDistributed: false,
                isRemind: false,
                content: ''
            },
            dialogRules: {
                member: [
                    {
                        type: 'array',
                        required: true,
                        // "请选择内部分发给谁"
                        message: _this.$t('mxpcweb.mail.1528955598924'),
                        trigger: 'change'
                    }
                ],
                content: [{ validator: validContent, trigger: 'blur' }]
            },
            address: '',
            submitLoading: false
        }
    },
    created() {
        let _this = this
        ep.tail('selectEmployee', function (data) {
            _this.updateEmployee(data) // 更新选择人员列表
        })
    },
    computed: {
        ...mapGetters([
            'company'
        ]),
        ...mapGetters('mail', [
            'subordinateCtid'
        ])
    },
    watch: {

    },
    methods: {
        /**
         * 删除当前人员
         */
        deleteThisEmployee(index) {
            if (
                index >= 0 &&
                this.dialog.member != null &&
                this.dialog.member.length > 0
            ) {
                this.dialog.member.splice(index, 1)
            }
        },
        /**
         * 更新选择人员列表
         */
        updateEmployee(employee) {
            var isExist = false
            this.dialog.member.forEach(element => {
                if (element.ctid == employee.ctid) {
                    // 判断是否存在
                    isExist = true
                }
            })
            if (!isExist) {
                this.dialog.member.push(employee)
            }
        },
        // 父组件来调用
        isDialog(to, mailList, address) {
            console.log(address)
            this.mailIds = []
            if (to == 'open') {
                if (isArray(mailList)) {
                    mailList.forEach(element => {
                        this.mailIds.push(element)
                    })
                    // this.mailIds = this.mailIds.substring(0, this.mailIds.length - 1)
                }
                this.address = address
                // 写死 11795
                this.isOpen = true
            } else {
                this.isOpen = false
            }
        },
        // 提交
        submit(formName) {
            this.submitLoading = true
            let _this = this
            this.$refs[formName].validate(valid => {
                if (valid) {
                    // 为下属操作才有ctid
                    var ctids = []
                    if (isArray(_this.dialog.member)) {
                        _this.dialog.member.forEach(element => {
                            // ctids = ctids + element.ctid + ','
                            ctids.push(element.ctid)
                        })
                        // ctids = ctids.substring(0, ctids.length - 1)
                    }
                    let data = {
                        mIds: _this.mailIds,
                        noticeFlag: _this.dialog.isRemind,
                        content: _this.dialog.content,
                        recCtids: ctids,
                        autoDist: _this.dialog.isAutoDistributed,
                        assignMark: _this.dialog.isLabelDistributed == true ? 1 : 0
                    }
                    if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                        data.ctid = this.subordinateCtid
                    } else {
                        delete data.ctid
                    }
                    _this.$http.post(_this.Global.baseURL + this.Global.api.Mail.mailPublicMailDistPost, data)
                        .then(
                            function (res) {
                                if (res.body.code.toString() == _this.Global.RES_OK) {
                                    // 内分发成功
                                    _this.$message.success(_this.$t('mxpcweb.mail.1528955638058'))
                                    _this.isOpen = false
                                    _this.submitLoading = false
                                    _this.$emit('LastListCenter', [1, 2, 3, 4], 'DialogInDistribute')
                                } else {
                                    _this.submitLoading = false
                                    _this.$message.error(_this.msg(res.body))
                                }
                            },
                            function (res) {
                                _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
                            }
                        )
                } else {
                    return false
                }
            })
        },
        // 清空表单
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        /**
         * 选择人员
         */
        openEmployeeDialog() {
            this.$refs.DialogEmployee.isDialogs('open')
        }
    },
    components: {
        'dialog-employee': DialogEmployee
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
