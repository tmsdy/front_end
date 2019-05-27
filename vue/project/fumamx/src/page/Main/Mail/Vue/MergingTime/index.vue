<template>
    <div class="MergingTime">
        <!-- 归并-->
        <!-- @close="resetForm('dialogUserForm')" -->
        <el-dialog v-dialogDrag :title="$t('mxpcweb.mail.1528702678326')" :visible.sync="isOpen" custom-class="width620" @close="resetForm('dialogUserForm')" :close-on-click-modal="false" >
            <el-form ref="dialogUserForm" label-width="150px">
                <!-- <el-form-item> -->
                <div class="text-list">
                    <el-radio-group v-model="radio">
                        <el-radio class="radio" v-model="radio" label="3">{{$t('mxpcweb.mail.1533353309279')}}</el-radio>
                        <el-radio class="radio" v-model="radio" label="5">{{$t('mxpcweb.mail.1533353328932')}}</el-radio>
                        <el-radio class="radio" v-model="radio" label="7">{{$t('mxpcweb.mail.1533353341306')}}</el-radio>
                        <el-radio class="radio" v-model="radio" label="15">{{$t('mxpcweb.mail.1533353356445')}}</el-radio>
                        <el-radio class="radio" v-model="radio" label="30">{{$t('mxpcweb.mail.1533353368388')}}</el-radio>
                        <el-radio class="radio" v-model="radio" label="0">{{$t('mxpcweb.mail.1533353380357')}}</el-radio>
                    </el-radio-group>
                </div>
                <div class="text-list">
                    <!-- 仅归并符合规则的邮件 -->
                    <el-checkbox v-model="checkedmerging">{{$t('mxpcweb.mail.1542767332906')}}</el-checkbox>
                </div>
                <!-- </el-form-item> -->
                <div class="text-center">
                    <!-- 取消 -->
                    <el-button @click="cancelClick()">{{$t('mxpcweb.mail.1528942364802')}}</el-button>
                    <!-- 确定 -->
                    <el-button @click="submit('dialogUserForm')" :loading="submitLoading" type="primary">{{$t('mxpcweb.mail.1528942374762')}}</el-button>
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

export default {
    name: 'MergingTime',
    props: {

    },
    data() {
        return {
            isOpen: false, // 弹窗开关
            radio: '',
            checkedmerging: false,
            beforeSelect: '',
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
    created() {
        ep.tail('isDialogShow', (to) => {
            if (to == 'open') {
                this.isOpen = true
                this.radio = '3'
            } else {
                this.isOpen = false
            }
        })
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
        submit() {
            this.submitLoading = true
            let _this = this
            let data = {
                'boxId': 0,
                'dateRange': _this.radio,
                'includeAll': _this.checkedmerging != true
            }
            _this.$http.post(this.Global.baseURL + this.Global.api.Mail.mailsMergePost, data).then(function (res) {
                _this.isOpen = false
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.submitLoading = false
                    _this.$message.success(res.body.msg)
                } else {
                    _this.submitLoading = false
                    _this.$message.error(_this.msg(res.body))
                }
            },
                function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                }
            )
        },
        // 取消
        cancelClick() {
            this.isOpen = false
        }

    }
    // watch: {
    //     checkedmerging: {
    //         handler(curVal, oldvalue) {
    //             if (curVal) {
    //                 this.beforeSelect = this.radio
    //                 this.radio = ''
    //             } else {
    //                 this.radio = this.beforeSelect
    //                 this.beforeSelect = ''
    //             }
    //         },
    //         deep: true
    //     }
    // }

}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
