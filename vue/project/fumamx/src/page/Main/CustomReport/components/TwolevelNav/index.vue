<template>
    <div>
        <div class="TwolevelNav">
            <div class="addReportClass">
                <el-button type="primary" @click="addReportLabel"><i class="iconfont icon-plus-file"></i>添加报表分类</el-button>
            </div>
            <loading v-if="!menuNavList.length"></loading>
            <menu-nav :list="menuNavList" class="menuNavList  MXscroll" @editName="editName" @delItem="delItem" @move="move"></menu-nav>
            <div class="delReportClass">
                <el-button type="primary" @click="toDelList"><i class="iconfont icon-del"></i>已删除的报表</el-button>
            </div>
        </div>
        <el-dialog title="请输入" :visible.sync="dialogFormVisible" size="tiny" :before-close="handleClose">
            <!-- 添加报表分类 -->
            <div v-show="dialogShow=='addLabel'">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="85px" style="padding: 0 15px;">
                    <el-form-item label="分类名称" prop="name">
                        <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer" style="text-align: center">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm')" :loading="loadingBtn">确 定</el-button>
                </div>
            </div>
            <!-- 编辑报表分类 -->
            <div v-show="dialogShow=='editLabel'">
                <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="85px" style="padding: 0 15px;">
                    <el-form-item label="编辑名称" prop="name">
                        <el-input v-model="ruleForm2.editname"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer" style="text-align: center">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="submitEditForm('ruleForm2')" :loading="loadingBtn">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Loading from '@/basecomponents/Loading/index'
import MenuNav from './MenuNav/index'
export default {
    name: 'TwolevelNav',
    props: {
        // list: {
        //   type: Array,
        //   default: function () {
        //     return []
        //   }
        // }
    },
    data() {
        return {
            dialogShow: '',
            menuNavList: [
            ],
            dialogFormVisible: false,
            ruleForm: {
                name: ''
            },
            ruleForm2: {
                editname: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
                ]
            },
            rules2: {
                editname: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
                ]
            },
            loadingBtn: false,
            folderid: '' // 需要修改的分类id
        }
    },
    created() {
        this.getReportPackage()
        this.ruleForm.name = ''
    },
    components: {
        'loading': Loading,
        'menu-nav': MenuNav
    },
    methods: {
        // 编辑报表分类
        submitEditForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loadingBtn = true
                    this.$http.put(this.Global.baseURL + this.Global.api.v1.reportPackage, {
                        type: 'name',
                        name: this.ruleForm2.editname,
                        folderId: this.folderid
                    })
                        .then(res => {
                            this.loadingBtn = false
                            if (res.body.code.toString() == this.Global.RES_OK) {
                                this.$message.success(this.msg(res.body))
                                this.handleClose()
                                this.getReportPackage()
                            } else {
                                this.$message.error(this.msg(res.body))
                            }
                        },
                            res => {
                                this.loadingBtn = false
                                this.$message.error(this.$t(this.Global.errorTitle))
                            }
                        )
                } else {
                    return false
                }
            })
        },
        // 提交新增报表分类
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loadingBtn = true
                    this.$http.post(this.Global.baseURL + this.Global.api.v1.reportPackage, {
                        name: this.ruleForm.name,
                        order: this.menuNavList.length - 2
                    })
                        .then(res => {
                            this.loadingBtn = false
                            if (res.body.code.toString() == this.Global.RES_OK) {
                                this.$message.success(this.msg(res.body))
                                this.handleClose()
                                this.getReportPackage()
                            } else {
                                this.$message.error(this.msg(res.body))
                            }
                        },
                            res => {
                                this.loadingBtn = false
                                this.$message.error(this.$t(this.Global.errorTitle))
                            }
                        )
                } else {
                    return false
                }
            })
        },
        handleClose() {
            this.dialogShow = ''
            this.dialogFormVisible = false
        },
        addReportLabel() {
            if (this.menuNavList.length > 0) {
                this.dialogShow = 'addLabel' // 添加报表分类
                this.dialogFormVisible = true
            } else {
                this.$message.error('系统繁忙，请稍后再试')
            }
        },
        toDelList() {
            this.$router.push('/main/customReport/delete')
        },
        // 获取列表菜单
        getReportPackage() {
            // this.loading = true
            let data = {
                type: 'all'
            }
            this.$http.get(this.Global.baseURL + this.Global.api.v1.reportPackage, { params: data })
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.menuNavList = res.body.data.packageList
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        editName(x) {
            this.dialogShow = 'editLabel' // 编辑报表分类
            this.folderid = x.folderId
            this.ruleForm2.editname = x.name
            this.dialogFormVisible = true
        },
        // 删除列表分类
        delItem(x) {
            let params = {
                folderid: x
            }
            this.$http.delete(this.Global.baseURL + this.Global.api.v1.reportPackage, { params })
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.$message.success(this.msg(res.body))
                        this.getReportPackage()
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.loadingBtn = false
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        // 上移下移
        move(i, t) {
            this.$http.put(this.Global.baseURL + this.Global.api.v1.reportPackage, {
                type: 'order',
                folderId: i,
                targetFolderId: t
            })
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.$message.success(this.msg(res.body))
                        this.getReportPackage()
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
