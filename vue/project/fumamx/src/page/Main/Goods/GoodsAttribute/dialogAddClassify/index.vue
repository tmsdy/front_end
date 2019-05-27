<template>
    <el-dialog v-dialogDrag title="添加一级分类" :visible.sync="isOpen" custom-class="width420" @close="resetForm('ruleForm')">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="80px">
            <el-form-item label="目录名称" prop="catgName">
                <el-input v-model="ruleForm.catgName" placeholder="请输入目录名称"></el-input>
            </el-form-item>
            <el-form-item label="英文名称" prop="enCatgName">
                <el-input v-model="ruleForm.enCatgName" placeholder="请输入英文名称"></el-input>
            </el-form-item>
            <el-form-item style="margin-top:25px;">
                <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
export default {
  name: 'GoodsCatalog',
  props: {},
  data() {
    return {
        isOpen: false,
        ruleForm: {
          catgName: '',
          enCatgName: ''
        },
        rules: {
          catgName: [
            { required: true, message: '请输入目录名称', trigger: 'blur' },
            { min: 2, max: 22, message: '长度在 2 到 22 个字符', trigger: 'blur' }
          ]
        }
    }
  },
  created() {},
  methods: {
    // 提交表单
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
                this.submitApi()
            } else {
                console.log('error submit!!')
                return false
            }
        })
    },
    submitApi() {
        // console.log(this.ruleForm)
        // 先取左大类菜单
        let data = {
            catgName: this.ruleForm.catgName,
            enCatgName: this.ruleForm.enCatgName
        }
        this.$http.post(this.Global.baseURL + this.Global.api.v2.document_product_category, data).then(res => {
          if (res.body.code.toString() == this.Global.RES_OK) {
            // console.log('********************')
            // console.log(res.body.data)
            // console.log('********************')
            this.isOpen = false
            this.$message.success('添加成功')
            this.$emit('success')
          } else {
            this.$message.error(this.msg(res.body))
          }
        }, res => {
          this.$message.error(this.$t(this.Global.errorTitle))
        })
    },
    // 清空表单
    resetForm(formName) {
        this.$refs[formName].resetFields()
    },
    open() {
        this.isOpen = true
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
</style>
