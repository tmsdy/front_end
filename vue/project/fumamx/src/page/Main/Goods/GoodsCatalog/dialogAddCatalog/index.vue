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
  name: 'dialogAddCatalog',
  props: {},
  data() {
    return {
        isOpen: false,
        ruleForm: {
          groupName: '',
          enGroupName: ''
        },
        itemData: {},
        rules: {
          groupName: [
            { required: true, message: '请输入目录名称', trigger: 'blur' },
            { min: 2, max: 22, message: '长度在 2 到 22 个字符', trigger: 'blur' }
          ]
        },
        titleTxt: ''
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
            groupName: this.ruleForm.groupName,
            enGroupName: this.ruleForm.enGroupName
        }
        // console.log(this.parGroupId)
        // 有值，则为添加子目录
        if (this.itemData && this.itemData.groupId) {
            data['parGroupId'] = this.itemData.groupId
        }
        // console.log(data)
        // return
        this.$http.post(this.Global.baseURL + this.Global.api.v2.document_product_group, data).then(res => {
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
    open(item) {
        // 若传来，则证明此项要添加子目录
        this.itemData = item || {}
        this.titleTxt = item ? '添加子目录' : '添加目录'
        this.isOpen = true
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
</style>
