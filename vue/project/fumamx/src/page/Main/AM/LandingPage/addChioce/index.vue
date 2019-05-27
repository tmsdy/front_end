<template>
    <div class="addPage">
        <page-detail :detailTitle="subtitle" @toList="$emit('changeTabData','1')"></page-detail>
        <div class="list">
            <div class="wrapBox">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="chioceModule" labelPosition="left">
                    <el-form-item label="页面名称" prop="pageName">
                        <el-input type="text" v-model="ruleForm.pageName" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="模块" prop="moduleCode">
                        <el-select v-model="ruleForm.moduleCode" style="width:100%">
                            <el-option label="客户询盘" value="PS001"></el-option>
                            <el-option label="工单中心" value="WO001"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="使用人员" prop="isPublic">
                        <el-select v-model="ruleForm.isPublic" placeholder="请选择使用人员" style="width:100%">
                            <el-option label="仅自己" value="0"></el-option>
                            <el-option label="全体人员" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">下一步</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import PageDetail from '@/components/PageDetail/index' // 大标题
import draggable from 'vuedraggable'

export default {
    name: 'List',
    data() {
        return {
            subtitle: '新建LandingPage',
            ruleForm: {
                pageName: '',
                moduleCode: 'PS001',
                isPublic: ''
            },
            rules: {
                isPublic: [
                    { required: true, message: '请选择使用人员', trigger: 'change' }
                ],
                pageName: [
                    { required: true, message: '页面名称不能为空', trigger: 'blur' },
                    { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
    },
    computed: {
    },
    mounted() { },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$emit('changeTabData', '3')
                    this.$emit('basicForm', this.ruleForm)
                } else {
                    return false
                }
            })
        }
    },
    components: {
        'page-detail': PageDetail,
        'draggable': draggable
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
