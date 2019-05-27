<template>
    <el-dialog :title="$t('mxpcweb.components.1547629706981')" :visible.sync="editProfileDialogVisible" size="tiny" :before-close="handleClose">
        <el-form :model="editProfileForm" :rules="editProfileRules" ref="editProfileForm" label-width="100px">
            <el-form-item :label="$t('mxpcweb.systemset.groupstructure.1529408293848')" prop="realName">
                <el-input v-model="editProfileForm.realName" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item :label="$t('mxpcweb.systemset.groupstructure.1529401464355')" prop="nickName">
                <el-input v-model="editProfileForm.nickName"></el-input>
            </el-form-item>

            <el-form-item :label="$t('mxpcweb.components.1530947327404')" prop="contactRoles">
                <!-- 请选择角色 -->
                <el-select v-model="editProfileForm.contactRoles" :placeholder="$t('mxpcweb.components.1530946919907')" multiple style="width:100%;">
                    <el-option v-for="(item,index) in rolesList" :key="index" :label="item.roleName" :value="item.roleId"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item :label="$t('mxpcweb.components.1530947356742')" prop="empId">
                <el-input v-model="editProfileForm.empId"></el-input>
            </el-form-item>

            <el-form-item :label="$t('mxpcweb.components.1530947386002')" prop="empId">
                <tag-tree class="depTree" ref="tagTree" :data="adjustmentDepartment.treeData" :treeprops="adjustmentDepartment.defaultProps" @change="tagTreeChange"></tag-tree>
            </el-form-item>

        </el-form>
        <div class="text-center">
            <el-button type="primary" @click="saveEditProfileForm()">{{ $t('mxpcweb.components.1530947408426') }}</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import { isArray } from '@/libs/utils'
import tagTree from '@/components/tagTree/index.vue'
export default {
    data() {
        var validatorRoles = (rule, value, callback) => {
            if (isArray(value) && value.length > 0) {
                callback()
            } else {
                /* 请选择角色 */
                return callback(new Error(this.$t('mxpcweb.mai.sys.gro.selectRole')))
            }
        }
        return {
            editProfileDialogVisible: false,
            // editProfileDialogVisible: true,
            editProfileForm: {
                realName: '',
                nickName: '',
                contactRoles: [],
                departments: [],
                empId: ''
            },
            editProfileRules: {
                realName: [
                    {
                        required: true,
                        /* 请输入真实姓名 */
                        message: this.$t('mxpcweb.components.1530946713661'),
                        trigger: 'blur'
                    }
                ],
                nickName: [
                    {
                        required: true,
                        /* 请输入昵称 */
                        message: this.$t('mxpcweb.components.1530946790387'),
                        trigger: 'blur'
                    }
                ],
                contactRoles: [{ validator: validatorRoles, trigger: 'blur' }]
                // empId: [
                /* 请输入员工编号 */
                //     { required: true, message: this.$t('mxpcweb.mai.sys.gro.empIdTip'), trigger: 'blur' },
                //     { type: 'number', message: '员工编号为数字值' }
                // ]
            },
            adjustmentDepartment: {
                treeData: [],
                defaultProps: {
                    children: 'children',
                    label: 'deptName'
                }
            },
            rolesList: [],
            actionData: {}
        }
    },
    computed: {
        ...mapGetters(['company'])
    },
    methods: {
        async show(data) {
            this.actionData = data
            // 获取树菜单
            let getTree = await this.$http.get(
                this.Global.baseURL +
                this.Global.api.SystemSet.groupstructure.getTree,
                { params: {} }
            )
            if (getTree.body.code == this.Global.RES_OK) {
                this.adjustmentDepartment.treeData = getTree.body.data
            }
            let roles = await this.$http.get(
                this.Global.baseURL + this.Global.api.SystemSet.rolemanag.roles,
                { params: { type: 'all' } }
            )
            if (roles.body.code == this.Global.RES_OK) {
                this.rolesList = roles.body.data
            }
            // 获取默认信息
            let account_get = await this.$http.get(
                this.Global.baseURL + this.Global.api.v2.account_get,
                {
                    params: {
                        type: 'complex',
                        targetCtId: data.billId
                    }
                }
            )
            if (account_get.body.code == this.Global.RES_OK) {
                let accountList = account_get.body.data.accountList || []
                if (accountList.length > 0 && accountList[0]) {
                    let account = accountList[0]
                    this.editProfileForm.realName = account.realName
                    this.editProfileForm.ctId = data.billId
                    if (
                        account.companies &&
                        Array.isArray(account.companies) &&
                        account.companies.length > 0
                    ) {
                        this.editProfileForm.nickName =
                            account.companies[0].nickName
                        this.editProfileForm.contactRoles =
                            account.companies[0].contactRoles
                        this.editProfileForm.empId = account.companies[0].empId
                        setTimeout(() => {
                            this.$refs['tagTree'].setCheckedNodes(
                                account.companies[0].departments
                            )
                        }, 200)
                    }
                }
            } else {
                return
            }
            this.editProfileDialogVisible = true
        },
        handleClose(done) {
            done()
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    alert('submit!')
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        tagTreeChange(treeData) {
            this.editProfileForm.departments = treeData
        },
        saveEditProfileForm() {
            var _this = this
            this.$refs.editProfileForm.validate((valid) => {
                if (valid) {
                    let data = { ..._this.editProfileForm, ..._this.actionData }
                    _this.$http.post(this.Global.baseURL + this.Global.api.SystemSet.groupstructure.contactUpdate, data).then(function (res) {
                        if (res.body && res.body.code.toString() == _this.Global.RES_OK) {
                            _this.$message.success(_this.msg(res.body))
                            _this.editProfileDialogVisible = false
                        } else {
                            _this.$message.error(_this.msg(res.body))
                        }
                    }, function (res) {
                        /* 网络异常 */
                        _this.$message.error(this.$t('mxpcweb.mai.sys.gro.networkAnomaly'))
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        }
    },
    components: {
        'tag-tree': tagTree
    }
}
</script>
