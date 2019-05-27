<template>
    <div class="StrategyDes MXscroll">
        <el-form class="formBox" ref="ruleForm" :rules="rules" :model="strategyDesForm" label-position="left" label-width="80px">
            <el-form-item label="模块" prop="moduleCode">
                <el-select :disabled="isModify" style="width:100%" :loading="isLoading" v-model="strategyDesForm.moduleCode" @change="moduleChange" placeholder="请选择">
                    <el-option v-for="item in options" :key="item.moduleCode" :label="item.showName" :value="item.moduleCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="策略名" prop="strategyName">
                <el-input v-model="strategyDesForm.strategyName"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description">
                <el-input type="textarea" :rows="5" v-model="strategyDesForm.description"></el-input>
            </el-form-item>
            <el-form-item label="">
                <el-button type="primary" @click="commitData()" :loading="isSaving">下一步</el-button>
                <el-button v-if="isModify" @click="$emit('nextStep',false)">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'StrategyDes',
    props: {
        strategyDesForm: {
            type: Object,
            default: () => ({})
        },
        isModify: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isSaving: false,
            options: [],
            rules: {
                moduleCode: [{ required: true, message: '请选择', trigger: 'change' }],
                strategyName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                description: [{ required: true, message: '请输入描述', trigger: 'blur' }]
            },
            isLoading: false
        }
    },
    created() {
        this.getData()
    },
    mounted() {

    },
    methods: {
        async _validate() {
            return new Promise((resolve, reject) => {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                })
            })
        },
        async commitData() {
            let isValidate = await this._validate()
            if (!isValidate) { return }

            this.isSaving = true
            let flag = await this.saveData()
            this.isSaving = false

            if (flag) {
                this.$emit('nextStep', true)
            }
        },
        moduleChange(moduleCode) {
            this.options.forEach(item => {
                if (item.moduleCode == moduleCode) {
                    this.strategyDesForm['moduleName'] = item.showName
                }
            })
        },
        async saveData() {
            try {
                let url = this.Global.baseURL + this.Global.api.v2.autoStrategy_strategy
                let data = {
                    userStrategy: this.strategyDesForm
                }
                let res = this.isModify
                    ? await this.$http.put(url, data)
                    : await this.$http.post(url, data)
                if (res.body.code.toString() == this.Global.RES_OK) {
                    let { identKey, identValue } = res.body.data
                    Object.assign(this.strategyDesForm, { [identKey]: identValue })
                    return true
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            return false
        },
        getData() {
            this.isLoading = true
            let url = this.Global.baseURL + this.Global.api.v2.autoStrategy_controlTypeV2
            let data = {
                params: {
                    dataType: 'modules',
                    placeHolderFlag: 0,
                    actionId: 0
                }
            }
            this.$http.get(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.options = res.body.data.list
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                    this.isLoading = false
                })
                .catch(err => {
                    this.isLoading = false
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        }

    },
    components: {

    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
