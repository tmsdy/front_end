<template>
    <el-dialog title="新增区域" class="PreviewArticle" custom-class="PreviewArticle-myDialog" :visible.sync="dialogTableVisible" :before-close="beforeClose">
        <div class="bulletinItem" v-loading="isLoading">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="区域名称" :label-width="formLabelWidth" prop="areaName">
                    <el-input v-model="form.areaName" auto-complete="off" style="width: 300px;"></el-input>
                </el-form-item>
                <el-form-item label="部门" :label-width="formLabelWidth" prop="deptKey">
                    <el-select v-model="form.deptKey" multiple placeholder="请选择" style="width: 300px;">
                        <el-option v-for="item in departOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submit('form')">确 定</el-button>
            </div>
        </div>
    </el-dialog>
</template>
<script>
export default {
    name: 'ImgEdit',
    props: {
    },
    data() {
        return {
            dialogTableVisible: false,
            isLoading: false,
            form: {
                areaName: '',
                deptKey: []
            },
            formLabelWidth: '120px',
            departOptions: [],
            rules: {
                areaName: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ]
            },
            isEdit: false,
            cloneForm: '',
            areaId: ''
        }
    },
    created() { },
    mounted() { },
    methods: {
        cancel() {
            this.dialogTableVisible = false
            this.form.areaName = ''
            this.form.deptKey = []
        },
        beforeClose() {
            this.dialogTableVisible = false
        },
        submit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.form.deptKey.length == 0) {
                        this.$message.error('请选择部门')
                        return
                    }
                    let data = {
                        deptKey: this.form.deptKey.join(','),
                        areaName: this.form.areaName
                    }
                    if (this.isEdit) { // 编辑时
                        let currentForm = JSON.stringify(this.form)
                        if (currentForm == this.cloneForm) { // 如果编辑时没有修改
                            this.$message.error('暂时没有需要保持的字段')
                        } else {
                            data.areaId = this.areaId
                            this.$http
                                .put(this.Global.baseURL + this.Global.api.v2.activityArea, data)
                                .then(
                                    res => {
                                        this.submiting = false
                                        if (res.body.code.toString() == this.Global.RES_OK) {
                                            this.$message.success(res.body.msg)
                                            this.cancel()
                                            this.$emit('getListData')
                                        } else {
                                            this.$message.error(res.body.msg)
                                        }
                                    },
                                    res => {
                                        this.$message.error(this.$t(this.Global.errorTitle))
                                    }
                                )
                        }
                    } else { // 新建时
                        this.$http
                            .post(this.Global.baseURL + this.Global.api.v2.activityArea, data)
                            .then(
                                res => {
                                    this.submiting = false
                                    if (res.body.code.toString() == this.Global.RES_OK) {
                                        this.$message.success(res.body.msg)
                                        this.cancel()
                                        this.$emit('getListData')
                                    } else {
                                        this.$message.error(res.body.msg)
                                    }
                                },
                                res => {
                                    this.$message.error(this.$t(this.Global.errorTitle))
                                }
                            )
                    }
                } else {
                    return false
                }
            })
        },
        show() {
            this.dialogTableVisible = true
        },
        open(x, ele) {
            this.dialogTableVisible = true
            this.departOptions = []
            this.areaId = ''
            for (let ele in x) {
                let obj = {}
                obj.value = ele
                obj.label = x[ele]
                this.departOptions.push(obj)
            }
            if (ele != undefined) {
                this.form.areaName = ele.areaName
                this.form.deptKey = ele.areaKey.split(',')
                this.isEdit = true
                this.cloneForm = JSON.stringify(this.form)
                this.areaId = ele.areaId
            } else {
                this.isEdit = false
            }
        }
    }
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
