<template>
    <div class="mainWrap GroupStructure" ref="GroupStructure">
        <!--标题-->
        <page-title :title="$t('mxpcweb.systemset.groupstructure.1529400054992')" iconfont="icon-groups"></page-title>
        <!-- <el-tabs v-model="tabs.activeName" class="subTabs-pullRight G-main-tabs">
            <el-tab-pane :label="$t('mxpcweb.systemset.groupstructure.1529400114391')" name="first">

            </el-tab-pane>
            <el-tab-pane :label="$t('mxpcweb.systemset.groupstructure.1529406740388')" name="second">
                <excel-import></excel-import>
            </el-tab-pane>
        </el-tabs> -->
        <div class="Window" ref="Window">
            <div class="navBox MXscroll">
                <tree ref="treeRef" :list="navList" @operation="operation" @treeOpen="treeOpen"></tree>
            </div>
            <div class="navWindow MXscroll" ref="navWindow">
                <div class="table-head">
                    <div class="development">{{ actionTreeItem.deptName }}</div>
                    <div class="btn">
                        <el-button type="primary" @click="quickAddDepartment()">{{ $t('mxpcweb.systemset.groupstructure.1529400181007') }}</el-button>
                        <el-button type="primary" @click="openAddMembersDialog()">{{ $t('mxpcweb.systemset.groupstructure.1529400256195') }}</el-button>
                        <!-- <el-button type="primary" @click="adjustmentDepartmentMethods()">{{ $t('mxpcweb.systemset.groupstructure.1529400302543') }}</el-button> -->
                    </div>
                </div>
                <table-component ref="table_component" :tableData="personnelTable" :treeData="adjustmentDepartment.treeData" :treeprops="adjustmentDepartment.defaultProps" :rolesList="rolesList" @getTable="getTable" @checkAllChange="checkAllChange"></table-component>
                <batch-operation ref="batch-operation" @batchOperationChange="batchOperationChange" @adjustmentDepartment="adjustmentDepartmentMethods"></batch-operation>
            </div>
        </div>

        <!--添加-->
        <el-dialog v-dialogDrag :title="tree.title" :visible.sync="tree.addDialogVisible" custom-class="width420" :before-close="handleClose">
            <el-row :gutter="15" style="margin-top:10px;" v-for="(item,index) in tree.addDepartments" :key="index">
                <el-col :span="17">
                    <el-input v-model="item.deptName"></el-input>
                </el-col>
                <el-col :span="7">
                    <el-button type="primary" @click="addDepartment(index)">+</el-button>
                    <el-button type="primary" @click="deleteDepartment(item)">-</el-button>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <div class="middle-content">
                    <el-button @click="cancelAddDepartment()">{{$t('mxpcweb.systemset.groupstructure.1529400479326')}}</el-button>
                    <el-button type="primary" @click="confirmAddDepartment()" :loading="subLoading">{{$t('mxpcweb.systemset.groupstructure.1529400540818')}}</el-button>
                </div>
            </span>
        </el-dialog>
        <!--编辑-->
        <el-dialog v-dialogDrag :title="tree.title" :visible.sync="tree.editDialogVisible" size="tiny" :before-close="handleClose">
            <br>
            <el-input v-model="tree.editDepartment"></el-input>
            <span slot="footer" class="dialog-footer">
                <div class="middle-content">
                    <el-button @click="tree.editDialogVisible = false">{{$t('mxpcweb.systemset.groupstructure.1529400479326')}}</el-button>
                    <el-button type="primary" @click="confirmEditDepartment" :loading="subLoading">{{$t('mxpcweb.systemset.groupstructure.1529400540818')}}</el-button>
                </div>
            </span>
        </el-dialog>
        <!--删除-->
        <el-dialog v-dialogDrag :title="tree.title" :visible.sync="tree.deleteDialogVisible" size="tiny" :before-close="handleClose">
            <p>

                <!-- 确认删除z 吗? -->{{$t('mxpcweb.systemset.groupstructure.1530588490786',[tree.deleteDepartment])}}

            </p>
            <span slot="footer" class="dialog-footer">
                <div class="middle-content">
                    <el-button @click="tree.deleteDialogVisible = false">{{$t('mxpcweb.systemset.groupstructure.1529400479326')}}</el-button>
                    <el-button type="primary" @click="confirmDeleteDepartment" :loading="subLoading">{{$t('mxpcweb.systemset.groupstructure.1529400540818')}}</el-button>
                </div>
            </span>
        </el-dialog>

        <!--添加成员-->
        <el-dialog v-dialogDrag class="addMembers" :title="$t('mxpcweb.systemset.groupstructure.1529401035592')" :visible.sync="addMembers.addMembersDialogVisible" custom-class="width420" :before-close="handleClose" @close="resetForm('addMembersForm')" :close-on-click-modal="false">
            <el-tabs v-model="addMembers.activeName" style="margin-top:-10px;">
                <el-tab-pane :label="$t('mxpcweb.systemset.groupstructure.1529401266904')" name="addMember">
                    <p class="addMembersTitle">{{$t('mxpcweb.systemset.groupstructure.1529401081728')}}</p>
                    <el-form :model="addMembers.form" :rules="addMembers.rules" ref="addMembersForm" label-width="95px">
                        <el-form-item label="" label-width="0" class="addSelect" prop="selectInput">
                            <el-input :placeholder="selectThis == 'mobile' ? $t('mxpcweb.ejs.mobileRegistration.1530865433104') : $t('mxpcweb.systemset.accountsettings.1530583916311')" v-model="addMembers.form.selectInput">
                                <el-select v-model="selectThis" slot="prepend" :placeholder="$t('mxpcweb.systemset.groupstructure.1529401150392')" style="width:93px; color:#48576a;">
                                    <el-option :label="$t('mxpcweb.systemset.groupstructure.1529401194301')" value="mobile"></el-option>
                                    <el-option :label="$t('mxpcweb.systemset.groupstructure.1529401219953')" value="email"></el-option>
                                </el-select>
                            </el-input>
                        </el-form-item>
                        <el-form-item :label="$t('mxpcweb.systemset.groupstructure.1529401397234')" prop="realName">
                            <el-input v-model="addMembers.form.realName" :placeholder="$t('mxpcweb.systemset.groupstructure.1529401422742')"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('mxpcweb.systemset.groupstructure.1529401464355')" prop="nickName">
                            <el-input v-model="addMembers.form.nickName" :placeholder="$t('mxpcweb.systemset.groupstructure.1529401482257')"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('mxpcweb.systemset.groupstructure.1529401518586')" prop="userName">
                            <el-input v-model="addMembers.form.userName" :placeholder="$t('mxpcweb.systemset.groupstructure.1529401568760')"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('mxpcweb.systemset.groupstructure.1529401644991')" prop="contactRoles">
                            <el-select v-model="addMembers.form.contactRoles" :placeholder="$t('mxpcweb.systemset.groupstructure.1529401618759')" multiple style="width:100%;">
                                <el-option v-for="(item,index) in rolesList" :key="index" :label="item.roleName" :value="item.roleId+''"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('mxpcweb.systemset.groupstructure.1529401704881')" prop="empId">
                            <el-input v-model="addMembers.form.empId" :placeholder="$t('mxpcweb.systemset.groupstructure.1529401759578')"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('mxpcweb.systemset.groupstructure.1529401798905')">
                            <tag-tree class="depTree" ref="tagTree" :data="adjustmentDepartment.treeData" :treeprops="adjustmentDepartment.defaultProps" @change="tagTreeChange"></tag-tree>
                        </el-form-item>
                        <div class="text-center">
                            <el-button type="primary widthFull" :loading="subLoading" @click="confirmAddMembers('addMembersForm')" :disabled="isConfirmAdd">{{$t('mxpcweb.systemset.groupstructure.1529400540818')}}</el-button>
                        </div>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane :label="$t('mxpcweb.systemset.groupstructure.1529401928734')" name="mailInvitation">
                    <p class="addMembersTitle">{{$t('mxpcweb.systemset.groupstructure.1529401988713')}}</p>
                    <el-form :inline="true" :model="mailInvitation" ref="mailInvitationForm">
                        <el-row :gutter="0" v-for="(item,index) in mailInvitation.form" :key="index">
                            <el-col :span="6">
                                <el-form-item label="" prop="">
                                    <el-input v-model="item.name" :placeholder="$t('mxpcweb.systemset.groupstructure.1529401397234')" size="small"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="" prop="">
                                    <el-input v-model="item.email" :placeholder="$t('mxpcweb.systemset.groupstructure.1529402052494')" size="small"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="" prop="">
                                    <el-button type="primary" @click="addNewMember(index)" size="small" style="width:28px;">+</el-button>
                                    <el-button type="primary" @click="deleteNewMember(item)" size="small" style="width:28px;">-</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <div class="text-center">
                            <el-button class="widthFull" type="primary" @click="sendMailInvitation('mailInvitationForm')" :loading="subLoading">{{$t('mxpcweb.systemset.groupstructure.1529402253248')}}</el-button>
                        </div>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane :label="$t('mxpcweb.systemset.groupstructure.1529402282168')" name="inviteLinks">
                    <p class="addMembersTitle">{{$t('mxpcweb.systemset.groupstructure.1529402317996')}}&nbsp;&nbsp;
                        <span class="text-blue text-hover" @click="getCreateLink()">{{$t('mxpcweb.systemset.groupstructure.1529402343193')}}</span>
                    </p>
                    <el-row :gutter="15">
                        <el-col :span="20"><input type="text" :value="registerLink" class="registerLink" ref="registerLink" id="foo" readonly></el-col>
                        <el-col :span="4">
                            <button class="copyButton" ref="copyButton" @click="CopyRegisterLink()" data-clipboard-action="copy" data-clipboard-target="#foo">{{$t('mxpcweb.systemset.groupstructure.1529402371677')}}</button>
                        </el-col>
                    </el-row>
                    <img :src="registerLinkSrc" class="QRCode" ref="registerLinkSrc">
                </el-tab-pane>
            </el-tabs>
        </el-dialog>

        <!--调整部门对话框-->
        <el-dialog v-dialogDrag :title="$t('mxpcweb.systemset.groupstructure.1529400302543')" :visible.sync="adjustmentDepartment.deleteDialogVisible" size="tiny" :before-close="handleClose">
            <el-input :placeholder="$t('mxpcweb.systemset.groupstructure.1529402659216')" v-model="filterText">
            </el-input>
            <el-tree class="filter-tree" :data="adjustmentDepartment.treeData" :props="adjustmentDepartment.defaultProps" default-expand-all show-checkbox :check-strictly="true" :filter-node-method="filterNode" ref="adjustmentDepartmentRef" highlight-current>
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <div class="middle-content">
                    <el-button @click="adjustmentDepartment.deleteDialogVisible = false">{{$t('mxpcweb.systemset.groupstructure.1529400479326')}}</el-button>
                    <el-button type="primary" @click="confirmAdjustmentDepartment()" :loading="subLoading">{{$t('mxpcweb.systemset.groupstructure.1529400540818')}}</el-button>
                </div>
            </span>
        </el-dialog>
    </div>
</template>
<script>
/**
 * 组织架构
 * 作者：高俊峰
 * 时间：2017/7/17
 * */
import { checkEmail, checkInitial, trim, isArray, isString } from '@/libs/utils'
import PageTitle from '@/components/PageTitle/index'
import Loading from '@/basecomponents/Loading/index.vue'
import Tree from './Vue/tree.vue'
import tagTree from '@/components/tagTree/index.vue'
import excelImport from './Vue/excelImport.vue'
import tableComponent from './Vue/tableComponent.vue'
import batchOperation from './Vue/batchOperation.vue'
import QRCode from 'qrcode'
import Clipboard from 'clipboard'
import { mapGetters, mapActions } from 'vuex'
// 发送邮件邀请状态
var mailInvitation = {
    form: [
        {
            name: '',
            email: ''
        }
    ]
}
export default {
    name: 'GroupStructure',
    props: {

    },
    data() {
        var _this = this
        // 用户名验证
        var validatorUsername = (rule, value, callback) => {
            value = trim(value, 'g') // 去所有空格
            if (!checkInitial(value)) {
                callback(new Error(this.$t('mxpcweb.systemset.groupstructure.1529402978167')))
            } else if (checkEmail(value)) {
                callback(new Error(this.$t('mxpcweb.systemset.groupstructure.1529403002570')))
            } else {
                callback()
            }
        }
        var validateMobileEmail = (rule, value, callback) => {
            if (_this.selectThis == 'mobile') {
                value = trim(value, 'g')
                var reg = /^(\+?|0?|86?|086?)?1[356789]\d{9}$/
                if (!reg.test(value)) {
                    return callback(new Error(this.$t('mxpcweb.systemset.groupstructure.1529403020058')))
                } else {
                    callback()
                }
            }
            if (_this.selectThis == 'email') {
                if (!checkEmail(value)) {
                    return callback(new Error(this.$t('mxpcweb.systemset.groupstructure.1529403053705')))
                } else {
                    callback()
                }
            }
        }
        var validatorRoles = (rule, value, callback) => {
            if (Object.prototype.toString.call(value) == '[object Array]' && value.length > 0) {
                callback()
            } else {
                return callback(new Error(this.$t('mxpcweb.systemset.groupstructure.1529401618759')))
            }
        }
        return {
            selectThis: 'mobile',
            tabs: {
                activeName: 'first'
            },
            personnelTable: [], // 表格数据
            multipleSelection: [], // 表格勾选的数据
            // 左侧导航列表
            navList: [],
            tree: {
                addDialogVisible: false,
                editDialogVisible: false,
                deleteDialogVisible: false,
                title: '',
                dCode: '',
                addDepartments: [
                    {
                        'deptName': '',
                        'sortorder': 0
                    }
                ],
                editDepartment: ''
            },
            // 用户选择的部门信息
            actionTreeItem: {},
            addMembers: {
                isShow: true,
                addMembersDialogVisible: false,
                activeName: 'addMember',
                form: {
                    selectInput: '',
                    realName: '',
                    nickName: '',
                    userName: '',
                    contactRoles: [],
                    empId: '',
                    departments: []// 所选部门
                },
                rules: {
                    selectInput: [
                        { required: true, message: this.$t('mxpcweb.systemset.groupstructure.1529403104335'), trigger: 'blur' },
                        { validator: validateMobileEmail, trigger: 'blur' }
                    ],
                    realName: [
                        { required: true, message: this.$t('mxpcweb.systemset.groupstructure.1529403143272'), trigger: 'blur' },
                        { min: 1, max: 25, message: this.$t('mxpcweb.systemset.groupstructure.1529405275432'), trigger: 'blur' }
                    ],
                    nickName: [
                        { required: true, message: this.$t('mxpcweb.systemset.groupstructure.1529405317818'), trigger: 'blur' },
                        { min: 1, max: 25, message: this.$t('mxpcweb.systemset.groupstructure.1529405275432'), trigger: 'blur' }
                    ],
                    userName: [
                        { required: true, message: this.$t('mxpcweb.systemset.groupstructure.1529405404994'), trigger: 'blur' },
                        { min: 1, max: 25, message: this.$t('mxpcweb.systemset.groupstructure.1529405275432'), trigger: 'blur' },
                        { validator: validatorUsername, trigger: 'blur' }
                    ],
                    contactRoles: [
                        { validator: validatorRoles, trigger: 'blur' }
                    ],
                    empId: [
                        { required: !true, message: this.$t('mxpcweb.systemset.groupstructure.1529401759578'), trigger: 'blur' },
                        { min: 1, max: 25, message: this.$t('mxpcweb.systemset.groupstructure.1529405275432'), trigger: 'blur' }
                    ],
                    subordinateSector: [
                        { required: !true, message: this.$t('mxpcweb.systemset.groupstructure.1529405511984'), trigger: 'blur' },
                        { min: 1, max: 25, message: this.$t('mxpcweb.systemset.groupstructure.1529405275432'), trigger: 'blur' }
                    ]
                }
            },
            isConfirmAdd: false,
            mailInvitation: mailInvitation,
            registerLink: '', // 注册链接
            registerLinkSrc: '', // 注册链接二维码
            selectText: '',
            adjustmentDepartment: {// 调整部门
                deleteDialogVisible: false,
                treeData: [],
                defaultProps: {
                    children: 'children',
                    label: 'deptName'
                }
            },
            filterText: '', // 过滤文本
            dCode: -1, // 记录部门dCode
            currentPage: 1, // 默认分页
            getTableOption: {}, // 获取表格默认参数
            sdjustmentDepartmentStyle: {// 是否显示调整部门
                visibility: 'visible'
            },
            subLoading: false,
            rolesList: []// 角色列表
        }
    },
    computed: {
        // 使用对象展开运算符将 getters 混入 computed 对象中
        ...mapGetters([
            'companyConfigInfo',
            'company'
        ])
    },
    created() {
        this.getTree()
        this.getCreateLink()
        this.getRolesList()
    },
    mounted() {
        // 设置roleWindow高度
        setTimeout(() => {
            this.setWindowHeight()
        }, 20)
        $(window).resize(() => {
            this.setWindowHeight()
        })
    },
    methods: {
        // 异步实现
        ...mapActions([
            'setDepartmentList' // 获取企业全部部门
        ]),
        filterNode(value, data) {
            if (!value) return true
            return data.deptName.indexOf(value) !== -1
        },
        // 点击树菜单
        treeOpen(item) {
            var _this = this
            this.actionTreeItem = item
            if (item.dCode == '-2') {
                _this.sdjustmentDepartmentStyle = {
                    visibility: 'hidden'
                }
            } else {
                _this.sdjustmentDepartmentStyle = {
                    visibility: 'visible'
                }
            }
            this.getTable(item.dCode)
        },
        // 获取表格数据
        getTable(dCode) {
            let _this = this
            let data
            if (dCode) { // 传dCode的了
                data = {
                    dCode: dCode
                }
                _this.getTableOption = data
            } else {
                data = _this.getTableOption
            }
            this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.groupstructure.getTable, { params: data }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data.tableList)) {
                    _this.addMembers.addMembersDialogVisible = false
                    let tableList = res.body.data.tableList
                    tableList.forEach((item) => {
                        item.checkShow = false
                        item.check = false
                    })
                    _this.personnelTable = [...tableList]
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 设置roleWindow高度
        setWindowHeight() {
            let height = this.$refs.GroupStructure.offsetHeight - 40
            this.$refs.Window.style.height = `${height}px`
        },
        // 关闭对话框
        handleClose(done) {
            // 清空对话框状态
            this.mailInvitation = mailInvitation// 清空发送邮件邀请状态
            this.getTree()
            done()
        },
        // 点击调整部门
        adjustmentDepartmentMethods() {
            let all = this.$refs['table_component'].getCheck()
            if (all.length == 0) {
                this.$message(this.$t('mxpcweb.systemset.groupstructure.1529405567648'))
            } else {
                this.multipleSelection = all
                this.adjustmentDepartment.deleteDialogVisible = true
            }
        },
        // 确认添加
        confirmAdjustmentDepartment() {
            let _this = this
            let data = {
                tebleData: _this.multipleSelection, // 勾选表格数据
                departments: _this.$refs.adjustmentDepartmentRef.getCheckedNodes()// 选择树菜单样式
            }
            // api
            _this.subLoading = true
            this.$http.post(this.Global.baseURL + this.Global.api.SystemSet.groupstructure.accountUpdate, data).then(function (res) {
                _this.subLoading = false
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message.success(_this.msg(res.body))
                    // 清空勾选
                    try {
                        _this.$refs.adjustmentDepartmentRef.setCheckedKeys([])
                    } catch (e) {

                    }
                    // 清空表格勾选
                    this.$refs['table_component'].isCheckAll(false)
                    // 更新表格数据
                    _this.getTable(_this.actionTreeItem.dCode)
                    // 关闭对话框
                    _this.adjustmentDepartment.deleteDialogVisible = false
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.subLoading = false
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 获取树菜单
        getTree() {
            let _this = this
            _this.setDepartmentList() // 更新部门store
            this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.groupstructure.getTree, { params: {} }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                    // 合并数组
                    _this.navList = res.body.data.concat([{
                        createDate: 1502899200000,
                        dCode: '-1',
                        deptName: _this.$t('mxpcweb.systemset.groupstructure.1529405593258'),
                        modifyDate: 1502899200000,
                        sortorder: '0',
                        children: []
                    }, {
                        createDate: 1502899200000,
                        dCode: '-2',
                        deptName: _this.$t('mxpcweb.systemset.groupstructure.1529405635953'),
                        modifyDate: 1502899200000,
                        sortorder: '0',
                        children: []
                    }])
                    _this.adjustmentDepartment.treeData = res.body.data
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },
        // 点击操作树菜单
        operation(obj) {
            this.tree.dCode = obj.dCode
            this.tree.title = obj.title
            if (obj.action == 'add') {
                this.tree.addDialogVisible = true
            } else if (obj.action == 'edit') {
                this.tree.editDialogVisible = true
                this.tree.editDepartment = obj.title
            } else if (obj.action == 'delete') {
                this.tree.deleteDialogVisible = true
                this.tree.deleteDepartment = obj.title
            }
        },
        // 添加树菜单
        addDepartment(index) {
            this.tree.addDepartments.splice(index + 1, 0, {
                'deptName': '',
                'sortorder': index + 1
            })
        },
        // 删除树菜单
        deleteDepartment(item) {
            var index = this.tree.addDepartments.indexOf(item)
            if (index !== -1 && index !== 0) {
                this.tree.addDepartments.splice(index, 1)
            }
        },
        // 取消添加
        cancelAddDepartment() {
            let _this = this
            // 关闭对话框
            _this.tree.addDialogVisible = false
            _this.tree.addDepartments = [
                {
                    'deptName': '',
                    'sortorder': 0
                }
            ]
        },
        // 确认添加
        confirmAddDepartment() {
            let _this = this
            let parentDCode = this.tree.dCode
            let deptList = this.tree.addDepartments
            let isAdd = true
            for (let i = 0; i < deptList.length; i++) {
                if (deptList[i].deptName.length > 20) {
                    _this.$message.error(_this.$t('mxpcweb.systemset.groupstructure.1529405788530'))
                    isAdd = false
                    return
                }
            }
            if (!isAdd) {
                return
            }
            this.subLoading = true
            this.$http.post(this.Global.baseURL + this.Global.api.SystemSet.groupstructure.departmentAdd, { parentDCode: parentDCode, deptList: deptList }).then(function (res) {
                _this.subLoading = false
                if (res.body && res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message.success(_this.msg(res.body))
                    _this.getTree()
                    _this.cancelAddDepartment()
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.subLoading = false
                _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
            })
        },
        // 确定编辑
        confirmEditDepartment() {
            let _this = this
            if (_this.tree.editDepartment.length > 20) {
                _this.$message.error(_this.$t('mxpcweb.systemset.groupstructure.1529405788530'))
                return
            }
            let data = {
                dCode: _this.tree.dCode,
                deptName: _this.tree.editDepartment
            }
            this.subLoading = true
            this.$http.post(this.Global.baseURL + this.Global.api.SystemSet.groupstructure.departmentPut, data).then(function (res) {
                _this.subLoading = false
                if (res.body && res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message.success(_this.msg(res.body))
                    // 关闭对话框
                    _this.tree.editDialogVisible = false
                    _this.getTree()
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.subLoading = false
                _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
            })
        },
        // 确定删除
        confirmDeleteDepartment() {
            let _this = this
            let data = {
                dCode: _this.tree.dCode
            }
            _this.subLoading = true
            this.$http.post(this.Global.baseURL + this.Global.api.SystemSet.groupstructure.departmentDelete, data).then(function (res) {
                _this.subLoading = false
                if (res.body && res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message.success(_this.msg(res.body))
                    // 关闭对话框
                    _this.tree.deleteDialogVisible = false
                    _this.getTree()
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.subLoading = false
                _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
            })
        },
        // 确定添加成员
        confirmAddMembers(formName) {
            let _this = this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    _this.isConfirmAdd = true
                    let selectThis = _this.selectThis
                    let selectInput = _this.addMembers.form.selectInput
                    let form = Object.assign({}, _this.addMembers.form)
                    form[selectThis] = selectInput// 手机/邮箱
                    _this.subLoading = true
                    _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.groupstructure.quickAddAccount, form).then((res) => {
                        _this.isConfirmAdd = false
                        _this.subLoading = false
                        if (res.body.code.toString() == _this.Global.RES_OK) {
                            _this.$message.success(_this.msg(res.body))
                            // 清空表单
                            _this.$refs.addMembersForm.resetFields()// 清空表单
                            _this.$refs.tagTree.close() // 重置部门树
                            _this.getTable() // 刷新表格列表
                        } else {
                            _this.$message.error(_this.msg(res.body))
                        }
                    }, (res) => {
                        _this.subLoading = false
                        _this.isConfirmAdd = false
                        _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 添加新成员
        addNewMember(index) {
            this.mailInvitation.form.splice(index + 1, 0, {
                name: '',
                mail: ''
            })
        },
        // 删除新成员
        deleteNewMember(item) {
            var index = this.mailInvitation.form.indexOf(item)
            if (index !== -1 && index !== 0) {
                this.mailInvitation.form.splice(index, 1)
            }
        },
        // 发送邮件
        sendMailInvitation(formName) {
            let _this = this
            // 遍历元素，检查是否有不复核邮件格式的邮箱
            let isSuccess = true
            this.mailInvitation.form.forEach(function (element) {
                if (element.name == '') {
                    _this.$message(_this.$t('mxpcweb.systemset.groupstructure.1529405986070'))
                    isSuccess = false
                }
                if (!checkEmail(element.email)) {
                    _this.$message(_this.$t('mxpcweb.systemset.groupstructure.1529406020279'))
                    isSuccess = false
                }
            }, this)
            if (!isSuccess) {
                return
            }
            let sendData = {
                accountList: _this.mailInvitation.form,
                type: 'email'
            }
            // 发送邮件
            _this.subLoading = true
            _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.groupstructure.invitation, sendData).then(function (res) {
                _this.subLoading = false
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message.success(_this.msg(res.body))
                    _this.mailInvitation.form = [
                        {
                            name: '',
                            email: ''
                        }
                    ]
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.subLoading = false
                _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
            })
        },
        // 获取生成链接方法
        getCreateLink() {
            let _this = this
            _this.$http.post(_this.Global.baseURL + _this.Global.api.SystemSet.groupstructure.invitation, { type: 'link' }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK && isString(res.body.data)) {
                    _this.registerLink = res.body.data
                    QRCode.toDataURL(res.body.data, function (err, url) {
                        _this.registerLinkSrc = url
                    })
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
            })
        },
        // 拷贝邀请链接
        CopyRegisterLink() {
            // let clipboard = new Clipboard('.copyButton')
            let clipboard = new Clipboard(this.$refs.copyButton)
            clipboard.on('success', (e) => {
                this.$message.success(this.$t('mxpcweb.am.1531904029672')) // 复制成功
            })
        },
        // 添加成员树菜单被选中,内部返回的数据
        tagTreeChange(treeData) {
            this.addMembers.form.departments = treeData
        },
        resetForm(formName) {
            // 表单重置
            this.$refs[formName].resetFields()
            // 清空树菜单
            this.$refs.tagTree.close()
        },
        // 获取角色
        getRolesList() {
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.rolemanag.roles, { params: { type: 'all' } }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                    _this.rolesList = res.body.data
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.$t(_this.Global.errorTitle)))
            })
        },
        // 快速添加部门
        quickAddDepartment() {
            let { deptName, dCode } = this.actionTreeItem
            this.operation({
                action: 'add',
                title: deptName,
                dCode: dCode
            })
        },
        // 点击添加成员
        openAddMembersDialog() {
            this.addMembers.addMembersDialogVisible = true
            setTimeout(() => {
                this.$refs.tagTree.setCheckedKeys([this.actionTreeItem.dCode])
            }, 200)
        },
        // 表格是否全选
        checkAllChange(is1, is2) {
            this.$refs['batch-operation'].action(is1, is2)
        },
        // 操作表格
        batchOperationChange(is) {
            this.$refs['table_component'].isCheckAll(is)
        }
    },
    watch: {
        filterText(val) {
            this.$refs.adjustmentDepartmentRef.filter(val)
        },
        $route() {
            if (this.$route.path == '/main/systemset/groupstructure') {
                this.getTree()
                this.getCreateLink()
                this.getRolesList()
            }
        }
    },
    components: {
        'page-title': PageTitle,
        'tree': Tree,
        'loading': Loading,
        'tag-tree': tagTree,
        'excel-import': excelImport,
        'table-component': tableComponent,
        'batch-operation': batchOperation
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
