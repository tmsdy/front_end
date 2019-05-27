<template>
    <el-dialog title="账号绑定" :visible.sync="dialogVisible" size="tiny" :before-close="handleClose">
        <el-form ref="form" label-width="120px">
            <el-form-item label="企业名称" style="width: 85%;">
                <!-- <el-input v-model="enterpriseName"></el-input> -->
                <span>{{enterpriseName}}</span>
            </el-form-item>
            <el-form-item label="name" style="width: 85%;">
                <el-input v-model="userName"></el-input>
            </el-form-item>
            <el-form-item label="apiUser" style="width: 85%;">
                <el-input v-model="apiUser"></el-input>
            </el-form-item>
            <el-form-item label="apiKey" style="width: 85%;">
                <el-input v-model="apiKey"></el-input>
            </el-form-item>
            <el-form-item label="appKey" style="width: 85%;">
                <el-input v-model="appKey"></el-input>
            </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <!-- 立即绑定  重新绑定 -->
            <el-button type="primary" @click="submit()">{{types=='edit'?'重新绑定':'立即绑定'}}</el-button>
        </span>
    </el-dialog>

</template>
<script>
import { isObject } from '@/libs/utils.js'
export default {
    name: '',
    props: {

    },
    data() {
        return {
            dialogVisible: false,
            enterpriseName: '',
            corpId: '',
            userName: '',
            apiUser: '',
            apiKey: '',
            appKey: '',
            types: 'get'
        }
    },
    computed: {

    },
    created() {

    },
    methods: {
        showDialog(item) {
            this.userName = ''
            this.apiUser = ''
            this.apiKey = ''
            this.appKey = ''
            this.dialogVisible = true
            this.enterpriseName = item.enterprise
            this.corpId = item.cid
            this.getAccount()
        },
        handleClose() {
            this.dialogVisible = false
        },
        submit() {
            if (this.types == 'add') {
                this.addAccount()
            } else {
                this.updatedAccount()
            }
        },
        updatedAccount() {
            let _this = this
            let params = {
                'corpId': _this.corpId,
                'userName': _this.userName,
                'defaultApiUser': _this.apiUser,
                'defaultApiKey': _this.apiKey,
                'appKey': _this.appKey
            }
            _this.$http.put(_this.Global.baseURL + _this.Global.api.v2.misAccount, params).then(
                function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.dialogVisible = false
                        _this.$message.success(_this.msg(res.body))
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                })
        },
        addAccount() {
            let _this = this
            let params = {
                'corpId': _this.corpId,
                'userName': _this.userName,
                'defaultApiUser': _this.apiUser,
                'defaultApiKey': _this.apiKey,
                'appKey': _this.appKey
            }
            _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.misAccount, params).then(
                function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        _this.dialogVisible = false
                        _this.$message.success(_this.msg(res.body))
                    } else {
                        _this.$message.error(_this.msg(res.body))
                    }
                })
        },
        getAccount() {
            let _this = this
            let params = {
                'corpId': _this.corpId,
                'userName': _this.userName,
                'defaultApiUser': _this.apiUser,
                'defaultApiKey': _this.apiKey,
                'appKey': _this.appKey
            }
            _this.$http.post(_this.Global.baseURL + _this.Global.api.v2.misAccount, params).then(
                function (res) {
                    if (res.body.code.toString() == _this.Global.RES_OK) {
                        if (isObject(res.body.data)) {
                            this.userName = res.body.data.userName
                            this.apiUser = res.body.data.defaultApiUser
                            this.apiKey = res.body.data.defaultApiKey
                            this.appKey = res.body.data.appKey
                            this.types = 'edit'
                        } else {
                            this.userName = ''
                            this.apiUser = ''
                            this.apiKey = ''
                            this.appKey = ''
                            this.types = 'add'
                        }
                    } else {
                        this.types = 'add'
                    }

                    // else if (this.types != 'get') {
                    //     _this.$message.error(_this.msg(res.body))
                    //     // 没添加过
                    // }
                })
        }

    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
</style>
