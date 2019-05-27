<template>
    <div class="dialog">
        <el-dialog :visible.sync="dialogTableVisible" :title="dialogTitle" :close-on-click-modal="false" size="tiny">
            <el-form ref="form" label-width="80px" :rules="rules">
                <el-form-item label="字段名" prop="name">
                    <el-input v-model="data.cnFieldCaption"></el-input>
                </el-form-item>
                <el-form-item label="活动性质" class="checkboxWrap">
                    <el-checkbox v-model="data.hideFlag" v-show="!data.isNotNull" @change="changehide">标记为隐藏字段</el-checkbox>
                    <div class="hidelabel" v-show="defaultShow">
                        <div>默认值</div>
                        <div style="overflow:hiden">
                            <el-input v-if="data.controlTypeId != 2" v-model="defaultLabel" class="defaultLabel" style="width:70%;"></el-input>
                            <el-select v-if="data.controlTypeId == 2" placeholder="请选择" v-model="defaultLabel">
                                <el-option v-for="item in data.options" :key="item.dictItemCode" :label="item.itemName" :value="item.dictItemCode">
                                </el-option>
                            </el-select>
                            <el-tooltip class="tips" effect="dark" content="在表单提交时，输入的默认值将和其他值一起被发送到 CRM。" placement="bottom-start">
                                <span><i class="iconfont icon-ask-mark"></i></span>
                            </el-tooltip>
                        </div>
                    </div>
                    <el-checkbox v-model="data.isNotNull" v-show="!data.hideFlag">标记为必填字段</el-checkbox>
                    <el-checkbox v-model="helpLink" v-show="!data.hideFlag">包括帮助链接</el-checkbox>
                    <div class="helplabel" v-show="helpLink">
                        <el-radio-group @change="changeradio" v-model="radio">
                            <el-radio class="radio" label="1">链接和文字</el-radio>
                            <el-radio class="radio" label="2">仅文字</el-radio>
                        </el-radio-group>
                        <div v-show="radio==1">
                            <el-tooltip class="item" effect="dark" content="帮助链接文字" placement="bottom">
                                <el-input v-model="helpText" placeholder="帮助"></el-input>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="帮助链接URL" placement="bottom">
                                <el-input v-model="helpUrl" class="helpurl" placeholder="Https://">
                                    <!-- <template slot="prepend">Https://</template> -->
                                </el-input>
                            </el-tooltip>
                        </div>
                        <div v-show="radio==2">
                            <el-input v-model="helpText" placeholder="请输入文字"></el-input>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :loading="submitLoading" @click="onSubmit()">完成</el-button>
                    <el-button @click="dialogTableVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'Dialog',
    data() {
        var checkName = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('年龄不能为空'))
            }
        }
        return {
            dialogTableVisible: false,
            helpLink: false,
            helpUrl: '', // 帮助链接
            helpText: '', // 帮助文字说明
            defaultLabel: '', // 默认值
            radio: '1',
            data: {
                'cnFieldCaption': [{ validator: checkName, trigger: 'blur' }]
            },
            oldData: {},
            dialogTitle: '字段属性',
            // data.hideFlag: false, // 标记隐藏字段
            defaultShow: false, // 默认值显示隐藏
            rules: {
                name: [
                    { required: true, message: '字段名不能为空', trigger: 'blur' }
                ]
            },
            submitLoading: false
        }
    },
    created() {
        // this.fieldProperty = this.settingData
        // this.fieldProperty.isNotNull = Boolean(this.settingData.isNotNull)
        // this.fieldProperty.data.hideFlag = Boolean(this.settingData.data.hideFlag)
    },
    mounted() { },
    methods: {
        open(data) {
            this.dialogTableVisible = true
            this.data.hideFlag = false
            this.defaultShow = false
            this.oldData = data
            this.data = JSON.parse(JSON.stringify(data))
            this.data.isNotNull = Boolean(data.isNotNull)
            // 初始化数据
            if (data.helpUrl) {
                this.helpUrl = data.helpUrl
            } else {
                this.helpUrl = ''
            }
            if (data.helpText) {
                this.helpText = data.helpText
            } else {
                this.helpText = ''
            }
            if (data.defaultLabel) {
                this.data.hideFlag = true
                this.defaultLabel = data.defaultLabel
            } else {
                this.defaultLabel = ''
            }
            if (data.hideFlag == undefined) {
                this.data.hideFlag = false
            } else if (data.hideFlag === true) {
                this.data.hideFlag = true
                this.defaultShow = true
            } else {
                this.data.hideFlag = false
                this.defaultShow = false
            }
            if (data.helpText || data.helpUrl) {
                this.helpLink = true
            } else {
                this.helpLink = false
            }
        },
        changehide() { // 帮助链接何隐藏字段不能同时选中
            if (this.helpLink) {
                this.helpLink = false
            }
            this.defaultShow = !this.defaultShow
        },
        onSubmit() {
            this.submitLoading = true
            if (this.helpLink) { // 帮助校验文本
                if (this.radio == 1) {
                    if (!this.helpText || !this.helpUrl) {
                        this.$message.error('链接和文字都必须填写！')
                        this.submitLoading = false
                        return false
                    } else {
                        if (!this.checkUrl(this.helpUrl)) {
                            this.$message.error('链接格式错误！')
                            this.submitLoading = false
                            return false
                        }
                    }
                    this.$set(this.oldData, 'helpUrl', this.helpUrl)
                } else {
                    if (!this.helpText) {
                        this.$message.error('文字必须填写！')
                        this.submitLoading = false
                        return false
                    }
                    this.$set(this.oldData, 'helpUrl', '')
                }
            }
            this.submitLoading = false
            this.dialogTableVisible = false
            this.$set(this.oldData, 'defaultLabel', this.defaultLabel)
            this.$set(this.oldData, 'value', this.defaultLabel)
            this.$set(this.oldData, 'helpText', this.helpText)
            this.$set(this.oldData, 'isNotNull', this.data.isNotNull)
            this.$set(this.oldData, 'hideFlag', this.data.hideFlag)
            this.$set(this.oldData, 'cnFieldCaption', this.data.cnFieldCaption)
        },
        checkUrl(urlString) {
            if (urlString !== '') {
                var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
                if (!reg.test(urlString)) {
                    return false
                }
            }
            return true
        },
        changeradio() { // 切换帮助radio时 清空帮助内容
            this.helpText = ''
            this.helpUrl = ''
        }
    }
}
</script>
<style lang="less">
.helpurl .el-input-group__prepend {
    background: #fff !important;
}
</style>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
