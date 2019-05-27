<template>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" size="tiny" :before-close="handleClose" :modal-append-to-body="false" class="emailBox">
        <div>
            <el-form :model="form">
                <el-form-item label="文件名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="发送文件作为" :label-width="formLabelWidth">
                    <el-select v-model="form.region" placeholder="请选择活动区域">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">发 送</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>

export default {
    name: 'DialogInset',
    data() {
        return {
            dialogVisible: false,
            dialogTitle: '发送邮件选项',
            params: '',
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            formLabelWidth: '120px'
        }
    },
    // props: {
    //     itemData: {
    //         type: Object,
    //         default: function () {
    //             return {

    //             }
    //         }
    //     }
    // },
    created() {
        // this.getDetailPage()
    },
    mounted() { },
    computed: {
    },
    methods: {
        open(data) {
            this.dialogVisible = true
        },
        handleClose() {
            this.dialogVisible = false
        },
        handleSelect() {
            // console.log(this.textarea)
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
