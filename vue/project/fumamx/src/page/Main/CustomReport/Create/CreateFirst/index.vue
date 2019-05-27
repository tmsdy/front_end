<template>
    <div class="createfirst" v-loading='isLoading2' :class="{ areaH: isLoading2}">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="报表名称" prop="cnName">
                <el-input v-model="ruleForm.cnName"></el-input>
            </el-form-item>
            <el-form-item label="所属分类" prop="folderId">
                <el-select v-model="ruleForm.folderId" placeholder="报表所属分类">
                    <el-option v-for="item in menuNavList" :key="item.folderId" :label="item.name" :value="item.folderId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择报表类型">
                <el-radio-group v-model="ruleForm.reportType">
                    <div>
                        <img v-bind:src="tableDemo1" />
                        <el-radio :label="0" :disabled="isEdit">0</el-radio>
                        <h2>表格报表</h2>
                        <p style="text-align:center">表格报表以较简单的表单列出数据</p>
                    </div>
                    <div>
                        <img v-bind:src="tableDemo2" />
                        <el-radio :label="1" :disabled="isEdit">1</el-radio>
                        <h2>汇总报表</h2>
                        <p>汇总报表允许查看数据和小计、分 组及其他</p>
                    </div>
                    <div>
                        <img v-bind:src="tableDemo3" />
                        <el-radio :label="2" :disabled="isEdit">2</el-radio>
                        <h2>交叉报表</h2>
                        <p>交叉报表允许针对横向和纵向列表查看 在窗</p>
                    </div>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="报表描述" prop="cnDescribe">
                <el-input type="textarea" v-model="ruleForm.cnDescribe"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="isEdit? nextStep():submitForm('ruleForm')" :loading="isLoading">下一步</el-button>
                <el-button type="primary" @click="save('ruleForm')" v-show="this.$route.query.hasOwnProperty('reportId')">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    name: 'createfirst',
    data() {
        return {
            tableDemo1: '/static/customReport/report1.jpg',
            tableDemo2: '/static/customReport/report3.png',
            tableDemo3: '/static/customReport/report2.png',
            menuNavList: [], // 所属分类下拉
            isLoading: false,
            ruleForm: {
                cnName: '',
                reportType: 0,
                cnDescribe: '',
                folderId: ''
            },
            rules: {
                cnName: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ]
                // cnDescribe: [
                //     { required: true, message: '请填写报表描述', trigger: 'blur' }
                // ]
            },
            returnData1: {},
            isLoading2: false,
            isEdit: false // 是否编辑状态
        }
    },
    created() {
        this.getReportPackage()
        this.getReportPage1()
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        async checkName(loading) {
            this[loading] = true
            let checkRepeat = false
            let data = {
                reportName: this.ruleForm.cnName
            }
            await this.$http.get(this.Global.baseURL + this.Global.api.v1.reportCheck, { params: data })
                .then(res => {
                    this[loading] = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        checkRepeat = true
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this[loading] = false
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
            return checkRepeat
        },
        async submitForm(formName) {
            let flag = await this.checkName('isLoading')
            this.$refs[formName].validate((valid) => {
                if (valid && flag) {
                    if (this.ruleForm.cnDescribe == '') {
                        delete this.ruleForm.cnDescribe
                    }
                    if (this.ruleForm.folderId == '') {
                        this.ruleForm.folderId = 0
                    }
                    this.$emit('createData', this.ruleForm) // 传值新建数据到父组件
                    this.$emit('changeTabData', '2') // 传值到父组件 下一步
                } else {
                    return false
                }
            })
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
                        let list = res.body.data.packageList
                        this.menuNavList = list.splice(3, list.length)
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        getReportPage1() {
            let { reportId } = this.$route.query
            if (reportId) {
                this.isEdit = true
                this.isLoading2 = true
                this.$http.get(this.Global.baseURL + this.Global.api.v1.reportPage1, { params: { reportId: reportId } })
                    .then(res => {
                        this.isLoading2 = false
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            var arr = Object.keys(res.body.data) // 对象非空校验
                            if (arr.length > 0) {
                                this.returnData1 = res.body.data
                                this.setReportPage1()
                            }
                        } else {
                            this.$message.error(this.msg(res.body))
                        }
                    },
                        res => {
                            this.isLoading2 = false
                            this.$message.error(this.$t(this.Global.errorTitle))
                        }
                    )
            }
        },
        setReportPage1() {
            this.ruleForm.cnName = this.returnData1.name
            if (this.returnData1.folderId == 0) {
                this.ruleForm.folderId = ''
            } else {
                this.ruleForm.folderId = this.returnData1.folderId
            }
            this.ruleForm.reportType = this.returnData1.reportType
            this.ruleForm.cnDescribe = this.returnData1.describe
        },
        save(formName) {
            let { reportId } = this.$route.query
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let currentData = {}
                    currentData.name = this.ruleForm.cnName
                    if (this.ruleForm.folderId == '') {
                        currentData.folderId = 0
                    } else {
                        currentData.folderId = this.ruleForm.folderId
                    }
                    currentData.reportType = this.ruleForm.reportType
                    currentData.describe = this.ruleForm.cnDescribe
                    console.log(currentData)
                    // 检查有无修改数据
                    let isAmend = false
                    let info = {}
                    for (let key in this.returnData1) {
                        if (this.returnData1[key] != currentData[key]) {
                            isAmend = true
                            if (key == 'name') {
                                info.cnName = currentData[key]
                            }
                            if (key == 'describe') {
                                info.cnDescribe = currentData[key]
                            }
                            if (key == 'folderId') {
                                info.folderId = currentData[key]
                            }
                        }
                    }
                    if (!isAmend) { // 如果没修改
                        this.$message.error('您暂时没有需要保存的字段！')
                    } else {
                        this.putReportPage(reportId, info)
                    }
                } else {
                    return false
                }
            })
        },
        putReportPage(id, info) {
            this.isLoading2 = true
            this.$http.put(this.Global.baseURL + this.Global.api.v1.reportPage1, { reportId: id, info: info })
                .then(res => {
                    this.isLoading2 = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.$message.success(this.msg(res.body))
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                },
                    res => {
                        this.isLoading2 = false
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        nextStep() {
            this.$emit('changeTabData', '2') // 传值到父组件 下一步
            this.$emit('createData', this.ruleForm) // 传值新建数据到父组件
        }
    },
    watch: {
    }
}
</script>
<style lang="less">
.createfirst {
    .el-radio__label {
        display: none;
    }
}
</style>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
