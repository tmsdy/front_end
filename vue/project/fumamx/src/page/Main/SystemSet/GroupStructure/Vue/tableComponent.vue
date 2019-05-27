<template>
    <div class="tableComponent">
        <copy-link ref="copyLink"></copy-link>
        <el-row :gutter="0" class="thead">
            <el-col :span="1" style="text-align: left;">
                <div style="height:32px;padding:0px 30px;">
                    <el-checkbox v-model="checkAll" @change="checkAllChange" v-show="isShowCheckAll"></el-checkbox>
                </div>
            </el-col>
            <el-col :span="2">&nbsp;&nbsp;</el-col>
            <el-col :span="4">{{ $t('mxpcweb.systemset.groupstructure.1529401397234') }}</el-col>
            <el-col :span="5">{{ $t('mxpcweb.systemset.groupstructure.1529401644991') }}</el-col>
            <el-col :span="4">{{ $t('mxpcweb.systemset.groupstructure.1529407903730') }}</el-col>
            <el-col :span="4">{{ $t('mxpcweb.systemset.groupstructure.1529401219953') }}</el-col>
            <el-col :span="4">{{ $t('mxpcweb.systemset.groupstructure.1529407845178') }}</el-col>
        </el-row>
        <div class="tbodyBox MXscroll" :style="{height:initTableHeigh+'px'}">
            <el-row :gutter="0" class="tbody-tr" v-for="(item,index) in tableData" :key="index">
                <div @mouseover="rowMouseover(item,index)" @mouseout="rowMouseout(item,index)">
                    <el-col :span="1">
                        <div style="height:55px;padding:0px 30px;">
                            <el-checkbox v-model="item.check" v-show="item.checkShow" @change="itemCheckChange"></el-checkbox>
                        </div>
                    </el-col>
                    <el-col :span="2">
                        <img v-imgsrc="avatarUrl(item.avatar)" width="32" height="32" style="float:right;margin-top: 10px;margin-right: 10px;">
                    </el-col>
                    <el-col :span="4">{{ item.realName || "&nbsp;&nbsp;" }}</el-col>
                    <el-col :span="5"><span class="textOverflow" :title="getRealName(item.contactRoles)">{{ getRealName(item.contactRoles) || '&nbsp;&nbsp;' }}</span></el-col>
                    <el-col :span="4">{{ item.mobile || "&nbsp;&nbsp;" }}</el-col>
                    <el-col :span="4">
                        <el-tooltip placement="top" v-if="item.email && item.email !== ''">
                            <div slot="content">
                                <div style="max-width:300px;word-break:break-all">{{item.email}}</div>
                            </div>
                            <div class="Gmail">{{ item.email || "&nbsp;&nbsp;" }}</div>
                        </el-tooltip>
                        <template v-else>
                            &nbsp;&nbsp;
                        </template>
                    </el-col>
                    <el-col :span="4">
                        <span class="text">{{ item.empId || "&nbsp;&nbsp;" }}</span>
                        <div class="operation">
                            <el-dropdown @command="commandChange">
                                <span class="el-dropdown-link">
                                    <span class="iconBox">
                                        <i class="iconfont icon-setting"></i>
                                    </span>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="a">{{$t('mxpcweb.systemset.groupstructure.1529407746343')}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <span class="iconBox" @click="activation(index,item)" v-if="showStatus(index,item) != ''" :title="(item.status === 1 || item.status === -1) ? $t('mxpcweb.systemset.groupstructure.1532681573115') : $t('mxpcweb.systemset.groupstructure.1532681840194')">
                                <i class="iconfont" :class="showStatus(index,item)"></i>
                            </span>
                        </div>
                    </el-col>
                </div>
            </el-row>
        </div>

        <!--修改密码-->
        <el-dialog v-dialogDrag :title="$t('mxpcweb.systemset.groupstructure.1529408043371')" :visible.sync="modifyPasswordDialogVisible" size="tiny" :before-close="handleClose">
            <br>
            <el-form :model="modifyPasswordForm" :rules="modifyPasswordRules" ref="modifyPasswordForm" label-width="100px">
                <el-form-item :label="$t('mxpcweb.systemset.groupstructure.1529408070002')" prop="password">
                    <el-input v-model="modifyPasswordForm.password"></el-input>
                </el-form-item>
                <el-form-item :label="$t('mxpcweb.systemset.groupstructure.1529408225737')" prop="confirmPassword">
                    <el-input v-model="modifyPasswordForm.confirmPassword"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveModifyPassword()">{{$t('mxpcweb.systemset.groupstructure.1529408246993')}}</el-button>
                    <el-button @click="resetForm('modifyPasswordForm')">{{$t('mxpcweb.systemset.groupstructure.1530948500806')}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!--修改资料-->
        <el-dialog v-dialogDrag :title="$t('mxpcweb.systemset.groupstructure.1529407746343')" :visible.sync="editProfileDialogVisible" size="tiny" :before-close="handleClose" @close="resetForm('editProfileForm')" :close-on-click-modal="false" :modal-append-to-body="false">
            <el-form :model="editProfileForm" :rules="editProfileRules" ref="editProfileForm" label-width="100px">
                <el-form-item :label="$t('mxpcweb.systemset.groupstructure.1529408293848')" prop="realName">
                    <el-input v-model="editProfileForm.realName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item :label="$t('mxpcweb.systemset.groupstructure.1529401464355')" prop="nickName">
                    <el-input v-model="editProfileForm.nickName"></el-input>
                </el-form-item>
                <el-form-item :label="$t('mxpcweb.systemset.groupstructure.1529401644991')" prop="contactRoles">
                    <el-select v-model="editProfileForm.contactRoles" :placeholder="$t('mxpcweb.systemset.groupstructure.1529401618759')" multiple>
                        <el-option v-for="(item,index) in rolesList" :key="index" :label="item.roleName" :value="item.roleId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('mxpcweb.systemset.groupstructure.1529401704881')" prop="empId">
                    <el-input v-model="editProfileForm.empId"></el-input>
                </el-form-item>
                <el-form-item :label="$t('mxpcweb.systemset.groupstructure.1529401798905')">
                    <tag-tree ref="tagTree" :data="treeData" :treeprops="treeprops" @change="treeChange"></tag-tree>
                </el-form-item>
            </el-form>
            <div class="middle-content">
                <el-button @click="editProfileDialogVisible = false">{{$t('mxpcweb.systemset.groupstructure.1529400479326')}}</el-button>
                <el-button type="primary" @click="saveEditProfileForm()" :loading="subLoading">{{$t('mxpcweb.systemset.groupstructure.1529408437503')}}</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import tagTree from '@/components/tagTree/index.vue'
import copyLink from './copyLink.vue'
import { getByte, isArray } from '@/libs/utils.js'
export default {
    name: 'tableComponent',
    props: {
        tableData: {
            type: Array,
            default: function () {
                return []
            }
        },
        treeData: {
            type: Array,
            default: function () {
                return []
            }
        },
        treeprops: {
            type: Object,
            default: function () {
                return {}
            }
        },
        rolesList: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    data() {
        var validatorRoles = (rule, value, callback) => {
            if (isArray(value) && value.length > 0) {
                callback()
            } else {
                return callback(new Error(this.$t('mxpcweb.systemset.groupstructure.1529401618759')))
            }
        }
        return {
            rowIndex: -1,
            rowData: {},
            modifyPasswordDialogVisible: false,
            modifyPasswordForm: {
                password: '',
                confirmPassword: ''
            },
            modifyPasswordRules: {
                password: [
                    { required: true, message: this.$t('mxpcweb.systemset.groupstructure.1530948704981'), trigger: 'blur' }
                ],
                confirmPassword: [
                    { required: true, message: this.$t('mxpcweb.systemset.groupstructure.1529408503497'), trigger: 'blur' }
                ]
            },
            editProfileDialogVisible: false,
            editProfileForm: {
                realName: '',
                nickName: '',
                contactRoles: [],
                empId: '',
                departments: []
            },
            editProfileRules: {
                realName: [
                    { required: true, message: this.$t('mxpcweb.systemset.groupstructure.1529408521047'), trigger: 'blur' }
                ],
                nickName: [
                    { required: true, message: this.$t('mxpcweb.systemset.groupstructure.1529408536905'), trigger: 'blur' }
                ],
                contactRoles: [
                    { validator: validatorRoles, trigger: 'blur' }
                ]
                // empId: [
                /* 请输入员工编号 */
                //     { required: true, message: this.$t('mxpcweb.mai.sys.gro.empIdTip'), trigger: 'blur' },
                //     { type: 'number', message: '员工编号为数字值' }
                // ]
            },
            initTableHeigh: 500,
            cell: null, // 保存临时dom对象
            checkAll: false,
            isMouseover: false,
            isShowCheckAll: false,
            subLoading: false
        }
    },
    created() {
        this.initTableHeigh = window.innerHeight - 175 - 65
    },
    methods: {
        avatarUrl(id) {
            return id && id !== '' ? this.getGlobalImgSrc(id, '32x32') : 'https://sf.fumamx.com/img/orig/3,31e390ebcbc1'
        },
        isActive(flags) {
            return getByte(flags, 3).toString()
        },
        showStatus(rowIndex, rowData) {
            if (this.isActive(rowData.flags) == '1') {
                return 'icon-link'
            } else { // 禁用启用
                if (rowData.status == 1) {
                    return 'icon-disabled'
                } else if (rowData.status == -1) {
                    return 'icon-hook'
                }
            }
            return ''
        },
        // 点击操作
        activation(rowIndex, rowData) {
            let _this = this
            if (this.isActive(rowData.flags) == '1') {
                // 生成
                _this.$http.post(this.Global.baseURL + this.Global.api.SystemSet.groupstructure.invitation, { type: 'active', aId: rowData.aId }).then(function (res) {
                    if (res.body && res.body.code.toString() == _this.Global.RES_OK) {
                        _this.$refs.copyLink.copyLinkShow(res.body.data)
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
                })
            } else { // 禁用启用
                let newRowData = Object.assign({}, rowData)
                if (newRowData.status == 1) {
                    newRowData.status = -1// 把正常变成禁用的
                } else if (newRowData.status == -1) {
                    newRowData.status = 1// 把禁用的变成正常的
                }
                _this.$http.post(this.Global.baseURL + this.Global.api.SystemSet.groupstructure.disableEnable, newRowData).then(function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.$message.success(_this.msg(res.body))
                        _this.$emit('getTable')
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                }, function (res) {
                    _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
                })
            }
        },
        // 树菜单被勾选
        treeChange(treeData) {
            this.editProfileForm.departments = treeData
        },
        // 修改密码
        modifyPassword() {
            this.modifyPasswordDialogVisible = true
        },
        // 修改资料
        editProfile() {
            var _this = this
            this.editProfileDialogVisible = true
            Object.assign(this.editProfileForm, this.rowData)
            // 实现树菜单默认勾选
            setTimeout(function () {
                _this.$refs.tagTree.setCheckedNodes(_this.rowData.departments)
            }, 200)
        },
        handleClose(done) {
            done()
        },
        resetForm(formName) {
            // 表单重置
            this.$refs[formName].resetFields()
            // 清空树菜单
            this.$refs.tagTree.close()
        },
        // 保存修改密码
        saveModifyPassword() {
            this.$refs.modifyPasswordForm.validate((valid) => {
                if (valid) {
                    // console.log(this.rowData);
                    // console.log(this.modifyPasswordForm);
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 保存编辑资料
        saveEditProfileForm() {
            var _this = this
            this.$refs.editProfileForm.validate((valid) => {
                if (valid) {
                    // api
                    _this.subLoading = true
                    _this.$http.post(this.Global.baseURL + this.Global.api.SystemSet.groupstructure.contactUpdate, _this.editProfileForm).then(function (res) {
                        _this.subLoading = false
                        if (res.body && res.body.code.toString() == _this.Global.RES_OK) {
                            _this.$message.success(_this.msg(res.body))
                            this.$emit('getTable')
                            _this.editProfileDialogVisible = false
                        } else {
                            _this.$message.error(_this.msg(res.body))
                        }
                    }, function (res) {
                        _this.subLoading = false
                        _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        commandChange(command) {
            if (command == 'a') {
                this.editProfile()
            }
        },
        isCheckAll(is) {
            this.checkAll = is
            this.isShowCheckAll = is
            this.tableData.forEach((item) => {
                item.checkShow = is
                item.check = is
            })
        },
        checkAllChange() {
            this.isCheckAll(this.checkAll)
            this.$emit('checkAllChange', this.checkAll, this.checkAll)
        },
        rowMouseover(item, index) {
            this.rowData = item
            item.checkShow = true
        },
        rowMouseout(item, index) {
            if (!item.check) {
                item.checkShow = false
            }
        },
        itemCheckChange() {
            let all = this.getCheck()
            // 全选
            if (all.length == this.tableData.length) {
                this.$emit('checkAllChange', true, true)
                this.checkAll = true
                this.isShowCheckAll = true
            } else {
                this.checkAll = false
                // 不全选
                if (all.length > 0) {
                    this.isShowCheckAll = true
                    this.$emit('checkAllChange', true, false)
                } else if (all.length == 0) {
                    this.isShowCheckAll = false
                    this.$emit('checkAllChange', false, false)
                }
            }
        },
        // 获取已勾选
        getCheck() {
            let all = []
            for (let item of this.tableData) {
                if (item.check) {
                    all.push(item)
                }
            }
            return all
        },
        // 获取角色
        getRealName (contactRoles) {
            let roleName = ''
            for (let item of contactRoles) {
                for (let item2 of this.rolesList) {
                    if (item === item2.roleId) {
                        roleName += item2.roleName + ','
                    }
                }
            }
            roleName = roleName.substr(0, roleName.length - 1)
            return roleName
        }
    },
    components: {
        'tag-tree': tagTree,
        'copy-link': copyLink
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.tableComponent {
  position: relative;
  .textOverflow{
    //   border:1px solid red;
      display: block;
      max-width: 160px;
      height: 55px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
  }
  .el-select {
    width: 100%;
  }
  .iconBox {
    display: inline-block;
    text-align: center;
    border-radius: 50px;
    width: 24px;
    height: 24px;
    line-height: 24px;
    background: linear-gradient(
      135deg,
      rgba(255, 105, 124, 1),
      rgba(208, 2, 27, 1)
    );
    color: #ffffff;
    cursor: pointer;
    margin-right: 10px;
  }
  .setBox {
    width: 110px;
    height: auto;
    background-color: #fff;
    position: fixed;
    z-index: 10;
    box-shadow: 0 0 10px #ccc;
    left: 0px;
    top: 0px; //display: none;
    li {
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 14px;
      cursor: pointer;
    }
    li:hover {
      background-color: #e5e5e5;
    }
  }

  .thead {
    height: 32px;
    line-height: 32px;
    text-align: left;
    background-color: #eff2f4;
  }
  .tbodyBox {
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
    .tbody-tr {
      height: 55px;
      line-height: 55px;
      text-align: left;
      background-color: #ffffff;
      border-bottom: 1px #eaedef solid;
      .Gmail {
          max-width: 160px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
      }
      .text{
        //   border:1px solid blue;
          display:block;
          max-width:100px;
          overflow:hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
      }
      .operation {
        width: 100%;
        height: 100%;
        display: none;
        .iconBox {
          width: 24px;
          height: 24px;
          display: inline-block;
          background: linear-gradient(
            135deg,
            rgba(255, 105, 124, 1),
            rgba(208, 2, 27, 1)
          );
          border-radius: 50px;
        }
      }
      &:hover {
        background-color: #fcf2f3;
        .text {
          display: none;
        }
        .operation {
          display: block;
        }
      }
    }
  }
}
</style>
