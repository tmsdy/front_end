<template>
    <el-dialog v-dialogDrag :title="titleTxt" :visible.sync="isOpen" custom-class="width420" @close="resetForm('ruleForm')">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="80px">
            <el-form-item label="目录名称" prop="groupName">
                <el-input v-model="ruleForm.groupName" placeholder="请输入目录名称"></el-input>
            </el-form-item>
            <el-form-item label="英文名称" prop="enGroupName">
                <el-input v-model="ruleForm.enGroupName" placeholder="请输入英文名称"></el-input>
            </el-form-item>
        </el-form>

        <div class="text-center" style="margin-top:25px;">
            <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
  name: 'dialogEditCatalog',
  props: {},
  data() {
    return {
        isOpen: false,
        ruleForm: {
          groupName: '',
          enGroupName: ''
        },
        rules: {
          groupName: [
            { required: true, message: '请输入目录名称', trigger: 'blur' },
            { min: 2, max: 22, message: '长度在 2 到 22 个字符', trigger: 'blur' }
          ]
        },
        titleTxt: '修改目录'
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
        let data = {
            operate: 'edit',
            groupId: this.ruleForm.groupId,
            groupName: this.ruleForm.groupName,
            enGroupName: this.ruleForm.enGroupName
        }
        // console.log(data)
        this.isOpen = false
        this.$emit('success', data)
    },
    // 清空表单
    resetForm(formName) {
        this.$refs[formName].resetFields()
        this.ruleForm = {
          groupName: '',
          enGroupName: ''
        }
    },
    open(item) {
        let data = JSON.parse(JSON.stringify(item))
        this.ruleForm = data
        this.isOpen = true
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
</style>
