<template>
    <!--  拼命加载中...  -->
    <div class="mainWrap RoleManag" ref="RoleManag" v-loading="windowLoading" :element-loading-text="$t('mxpcweb.systemset.rolemanag.1530594839030')">
        <!--大标题-->
        <!--角色管理  -->
        <page-title :title="$t('mxpcweb.systemset.rolemanag.1530594900261')" iconfont="icon-role-set"></page-title>
        <hr class="no-el-tabs">
        <div class="Window" ref="Window">
            <div class="menu">
                <div class="text-center">
                    <!-- 添加角色 -->
                    <el-button type="primary" size="small" @click="addRoleDialogVisible = true; addRoleStyle='addRole'; addRoleDialogTitle = $t('mxpcweb.systemset.rolemanag.1530594935440')">
                        <!-- 添加角色 -->{{$t('mxpcweb.systemset.rolemanag.1530594935440')}}</el-button>
                </div>
                <ul class="MXscroll">
                    <li :class="actionIndex == index ? 'current':''" v-for="(item,index) in roleNames" :key="index" @click="switchMenu(index)">
                        <!-- <i class="iconfont icon-account-set"></i> -->
                        <span class="roleName" :title="item.roleName">
                            {{item.roleName}}
                        </span>
                        <div class="roleBtns">
                            <!-- 删除角色 -->
                            <span :title="$t('mxpcweb.systemset.rolemanag.1530594965043')" v-if="item.isSysDefine != 1" @click.prevent="delRoleThis(item.roleId, item.roleName, index)">
                                <i class="iconfont icon-del"></i>
                            </span>
                            <!-- 复制角色 -->
                            <span :title="$t('mxpcweb.systemset.rolemanag.1530595000385')" @click.prevent="addRoleDialogVisible = true; addRoleStyle='copyRole'; addRoleDialogTitle = $t('mxpcweb.systemset.rolemanag.1530595000385')">
                                <i class="iconfont icon-copy"></i>
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="navWindow" v-if="roleNames.length > 0">
                <p>
                    <span class="roleName">{{ roleNames[actionIndex].roleName }}</span>
                    <span>{{ roleNames[actionIndex].desc }}</span>
                    <!-- 修改角色 -->
                    <!-- 修改 -->
                    <span class="text-red text-hover" @click="updateRoleBtn(roleNames[actionIndex]); addRoleStyle='modifyRole'; addRoleDialogTitle = $t('mxpcweb.systemset.rolemanag.1530595036134')">{{$t('mxpcweb.systemset.rolemanag.1530595058837')}}</span>
                </p>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <!-- <div style="heigh:300px; overflow:auto; border:1px solid red;"> -->
                    <!-- 角色成员 -->
                    <el-tab-pane v-if="tabsRight.length > 0" :label="$t('mxpcweb.systemset.rolemanag.1530595112029')" name="roleMembers">
                        <roleMembers class="mainTab" :roleId="roleNames[actionIndex].roleId"></roleMembers>
                    </el-tab-pane>

                    <el-tab-pane v-for="(item) in tabsRight" :key="item.tabCode" :label="item.tabName" :name="item.tabCode">
                        <component class="mainTab" :thisRoleId='roleNames[actionIndex].roleId' :itemTab="item" :thisIsSysDefine="roleNames[actionIndex].isSysDefine" v-bind:is="whichShow(item.tabCode)"></component>
                    </el-tab-pane>
                    <!-- 孚盟邮权限 -->
                    <!--<el-tab-pane :label="$t('mxpcweb.systemset.rolemanag.1530595132605')" name="mailPower">
                        <mailPower ref="mailPower"></mailPower>
                    </el-tab-pane>-->
                    <!-- </div> -->
                </el-tabs>
            </div>
        </div>

        <el-dialog :title="addRoleDialogTitle" :visible.sync="addRoleDialogVisible" custom-class="width420" @close="resetForm('editRoleForm')" v-dialogDrag>
            <el-form :model="editRoleForm" :rules="addRoleRules" ref="editRoleForm" label-width="90px">
                    <!-- //角色名称 -->
                <el-form-item :label="$t('mxpcweb.systemset.rolemanag.1530595170589')" prop="roleName">
                    <!-- //请输入角色名称 -->
                    <el-input v-model="editRoleForm.roleName" :placeholder="$t('mxpcweb.systemset.rolemanag.1532331185875')"></el-input>
                </el-form-item>
                <!-- //英文名称 -->
                <el-form-item :label="$t('mxpcweb.systemset.rolemanag.1530595242483')" prop="roleEnName">
                    <!-- //请输入英文名称 -->
                    <el-input v-model="editRoleForm.roleEnName" :placeholder="$t('mxpcweb.systemset.rolemanag.1530595264190')"></el-input>
                </el-form-item>
                <!-- //角色描述 -->
                <el-form-item :label="$t('mxpcweb.systemset.rolemanag.1530595303460')" prop="desc">
                    <!-- //请输入角色描述 -->
                    <el-input v-model="editRoleForm.desc" :placeholder="$t('mxpcweb.systemset.rolemanag.1530595327420')"></el-input>
                </el-form-item>
                <!-- //英文描述 -->
                <el-form-item :label="$t('mxpcweb.systemset.rolemanag.1530595355982')" prop="enDesc">
                    <!-- //请输入英文描述 -->
                    <el-input v-model="editRoleForm.enDesc" :placeholder="$t('mxpcweb.systemset.rolemanag.1530595424516')"></el-input>
                </el-form-item>

                <div class="text-center">
                    <el-button type="primary" v-show="addRoleStyle == 'addRole'" @click="submitRoleAdd('editRoleForm')" style="width:200px;">
                        <!-- //确定添加 -->
                        {{$t('mxpcweb.systemset.rolemanag.1530595453844')}}</el-button>
                    <el-button type="primary" v-show="addRoleStyle == 'modifyRole'" @click="updateRoleThis('editRoleForm')" style="width:200px;">
                        <!-- //确定修改 -->
                        {{$t('mxpcweb.systemset.rolemanag.1530595480244')}}</el-button>
                    <el-button type="primary" v-show="addRoleStyle == 'copyRole'" @click="copyRoleSubmit('editRoleForm')" style="width:200px;">
                        <!-- //确定复制 -->
                        {{$t('mxpcweb.systemset.rolemanag.1530595504877')}}</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
/**
 * 角色管理
 * 作者：向士健
 * 时间：2017/10/11
 * */
import PageTitle from '@/components/PageTitle/index.vue'
import roleMembers from './Tabs/roleMembers/index.vue'
import functionPower from './Tabs/functionPower/index.vue'
import bizDict from './Tabs/bizDict/index.vue'
import bizPower from './Tabs/bizPower/index.vue'
import customerPower from './Tabs/customerPower/index.vue'
import highseasPower from './Tabs/highseasPower/index.vue'
import mailPower from './Tabs/mailPower/index.vue'
import { isArray } from '@/libs/utils'
export default {
    name: 'RoleManag',
    props: {

    },
    data() {
        return {
            windowLoading: true, // 加载中开关
            roleNames: [],
            actionIndex: 0,
            activeName: 'roleMembers', // 当前活动的tab
            // activeName: "T05",   //当前活动的tab
            addRoleDialogVisible: false, // 弹窗开关
            addRoleDialogTitle: '',
            addRoleStyle: '', // 用于判断当前弹窗
            tabsRight: [],
            editRoleForm: {
                roleName: '',
                roleEnName: '',
                desc: '',
                enDesc: ''
            },
            addRoleRules: {
                roleName: [
                    /* 请输入英文名称 */
                    { required: true, message: this.$t('mxpcweb.systemset.rolemanag.1530595264190'), trigger: 'blur' },
                    /* 长度在 2 到 50 个字符 */
                    { min: 2, max: 50, message: this.$t('mxpcweb.systemset.rolemanag.1530595504877'), trigger: 'blur' }
                ],
                desc: [
                    /* 请输入角色描述 */
                    { required: true, message: this.$t('mxpcweb.systemset.rolemanag.1530595327420'), trigger: 'blur' },
                    /* 长度在 2 到 50 个字符 */
                    { min: 2, max: 50, message: this.$t('mxpcweb.systemset.rolemanag.1530595504877'), trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.getRoles() // 获取初始角色菜单
    },
    mounted() {
    },
    methods: {
        whichShow(tabId) {
            switch (tabId) {
                case 'T01':
                    return 'functionPower'
                    break
                case 'T02':
                    return 'bizDict'
                    break
                case 'T03':
                    return 'bizPower'
                    break
                case 'T04':
                    return 'customerPower'
                    break
                case 'T05':
                    return 'highseasPower'
                case 'T06':
                    return 'mailPower'
                    break
            }
        },
        // 获取初始角色菜单
        getRoles() {
            let _this = this
            // 接口名称: 获取角色
            var p1 = new Promise((resolve, reject) => {
                _this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.rolemanag.roles, { params: { type: 'all' } }).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                        resolve(res.body.data)
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            // 接口名称: 获取权限页
            var p2 = new Promise((resolve, reject) => {
                _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.rolemanag.permissionsGet, { params: { type: 'rightTab' } }).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                        resolve(res.body.data)
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.Global.errorTitle))
                })
            })
            Promise.all([p1, p2]).then(function (results) {
                // console.log(" _______________________ ");
                // console.log(results);
                _this.roleNames = results[0]
                _this.tabsRight = results[1]
                _this.windowLoading = false
            })
        },
        // 添加角色
        submitRoleAdd(formName) {
            let _this = this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    _this.editRoleForm.type = 'add' // 类型为添加角色
                    _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.rolemanag.rolesPost, _this.editRoleForm).then(function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            _this.$message.success(_this.msg(res.body))
                            _this.addRoleDialogVisible = false // 关闭
                            _this.getRoles() // 获取初始角色菜单
                        } else {
                            _this.$message.error(_this.msg(res.body))
                        }
                    }, function (res) {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 复制角色提交
        copyRoleSubmit(formName) {
            let _this = this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    _this.editRoleForm.type = 'copy' // 类型为添加角色
                    _this.editRoleForm.roleId = _this.roleNames[_this.actionIndex].roleId // 被复制的ID
                    _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.rolemanag.rolesPost, _this.editRoleForm).then(function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            _this.$message.success(_this.msg(res.body))
                            _this.addRoleDialogVisible = false // 关闭
                            _this.getRoles() // 获取初始角色菜单
                        } else {
                            _this.$message.error(_this.msg(res.body))
                        }
                    }, function (res) {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 删除角色
        delRoleThis(objId, objName, index) {
            let _this = this
            _this.windowLoading = true
            _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.rolemanag.rolesId, { params: { id: objId, type: 'alert' } }).then(function (res) {
                _this.windowLoading = false
                if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                    let msg
                    if (res.body.data.length > 1) {
                        /* 删除角色【 */
                        /* 】后，以下人员： */
                        /* 将无法进入本系统，确定删除吗？ */

                        let names = ''
                        res.body.data.forEach(function (item) {
                            if (item.realName != '') {
                                names += item.realName + '，'
                            }
                        })

                        msg = this.$t('mxpcweb.systemset.rolemanag.1530595659974', [objName, names])
                    } else {
                        /* 确定删除角色【 */
                        /* 】吗？ */

                        msg = this.$t('mxpcweb.systemset.rolemanag.1530595764668', [objName])
                    }
                    /* 提示  */
                    let t = this.$t('mxpcweb.systemset.rolemanag.1530595863629')

                    /* 确定 */
                    let s = this.$t('mxpcweb.systemset.rolemanag.1530595915980')

                    /* 取消 */
                    let n = this.$t('mxpcweb.systemset.rolemanag.1530595955452')

                    this.$confirm(msg, t, {
                        confirmButtonText: s,
                        cancelButtonText: n,
                        type: 'warning'
                    }).then(() => {
                        _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.rolemanag.rolesDelete, { roleId: objId }).then(function (res) {
                            if (res.body.code.toString() == _this.Global.RES_OK) {
                                /* 删除成功 */
                                _this.$message({ message: this.$t('mxpcweb.systemset.rolemanag.1530596003455'), type: 'success' })
                                _this.actionIndex = 0 // 移除高亮角色到0位置
                                _this.getRoles() // 获取初始角色菜单
                                let thisRoleID = _this.roleNames[_this.actionIndex].roleId// 找到roleID
                                let thisIsSysDefine = _this.roleNames[_this.actionIndex].isSysDefine// 找到是否系统定义好的
                                _this.$refs[_this.activeName].getData(thisRoleID, thisIsSysDefine)// 获取当前活动tab的页面数据
                            } else {
                                _this.$message.error(_this.msg(res.body))
                            }
                        }, function (res) {
                            _this.$message.error(_this.$t(_this.Global.errorTitle))
                        })
                    }).catch(() => {

                    })
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 弹窗打开,修改当前角色
        updateRoleBtn(roleObj) {
            // console.log(roleObj);
            this.addRoleDialogVisible = true
            this.editRoleForm.roleName = roleObj.roleName
            this.editRoleForm.roleEnName = roleObj.roleEnName
            this.editRoleForm.desc = roleObj.desc
            this.editRoleForm.enDesc = roleObj.enDesc
        },
        // 修改角色
        updateRoleThis(formName) {
            let _this = this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    _this.editRoleForm.roleId = _this.roleNames[_this.actionIndex].roleId
                    _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.rolemanag.rolesPut, _this.editRoleForm).then(function (res) {
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            _this.$message.success(_this.msg(res.body))
                            _this.addRoleDialogVisible = false // 关闭
                            _this.getRoles() // 获取初始角色菜单
                        } else {
                            _this.$message.error(_this.msg(res.body))
                        }
                    }, function (res) {
                        _this.$message.error(_this.$t(_this.Global.errorTitle))
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 点击切换角色
        switchMenu(index) {
            let _this = this
            _this.actionIndex = index
            // let thisRoleID = _this.roleNames[_this.actionIndex].roleId;//找到roleID
            // let thisIsSysDefine = _this.roleNames[_this.actionIndex].isSysDefine;//找到是否系统定义好的
            // _this.$refs[_this.activeName].getData(thisRoleID, thisIsSysDefine);//获取当前活动tab的页面数据
        },
        // 点击tab
        handleClick(tab, event) {

        },
        // 清空表单
        resetForm(formName) {
            this.$refs[formName].resetFields()
            this.editRoleForm = {
                roleName: '',
                desc: ''
            }
        }
    },
    components: {
        'page-title': PageTitle,
        'roleMembers': roleMembers,
        'functionPower': functionPower,
        'bizDict': bizDict,
        'bizPower': bizPower,
        'customerPower': customerPower,
        'highseasPower': highseasPower,
        'mailPower': mailPower
    }
}
</script>

<style lang="less" rel="stylesheet/less">
@import "./zh-cn.less";
@import "./en.less";
</style>
