<template>
    <div>
        <el-dialog title="添加快速筛选项" :visible.sync="dialogVisible" size="small" :close-on-click-modal="false">
            <div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="活动名称" prop="cnFilterName">
                        <el-input v-model="ruleForm.cnFilterName" style="width:300px;"></el-input>
                    </el-form-item>
                    <div class="MXscroll conditionBox">
                        <div style="width:85%;">
                            <span>设置匹配条件</span>
                            <condition-edit ref="conditionEdit" :modules="modules" @isFinish="isFinish" @getFilters='getFilters'></condition-edit>
                        </div>
                    </div>
                    <el-form-item style="text-align:center;margin-left:-100px;">
                        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
                        <el-button @click="cancel">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import ConditionEdit from '../../ConditionEdit'
export default {
    name: 'currency',
    props: {
        modules: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            dialogVisible: false
        }
    },
    components: {
        'condition-edit': ConditionEdit
    },
    methods: {
        filterChange(value) {
            this.fieldFilters = value
            this.$emit('fieldFilters', this.fieldFilters)
        }
    }
}

</script>
