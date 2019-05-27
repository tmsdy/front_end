<template>
    <div class="SocialSel">
        <el-dialog title="账号绑定" :visible.sync="dialogVisible" size="tiny">
            <span>注意事项：</span>
            <p>1、请先启用vpn;</p>
            <p>2、登陆您需要绑定的Facebook、Twitter、Linkedin、Pinterest账号;</p>
            <p>3、选择平台，系统会自动跳转到您所登录的账号，进行授权操作</p>
            <el-form label-position="left" label-width="80px" class="Form">
                <el-form-item label="平 台:">
                    <el-select v-model="accountType" placeholder="请选择平台">
                        <el-option v-for="(item,index) in socials" :key="index" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类 型:">
                    <el-select v-model="isPublic" placeholder="请选择类型">
                        <el-option v-for="(val,key) in accountSubordinate" :key="key" :label="val" :value="key"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" :loading="isLoading" @click="bindAccount()">立即授权</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'SocialSel',
    data() {
        return {
            dialogVisible: false,
            isLoading: false,
            socials: ['Facebook', 'Twitter', 'Linkedin', 'Pinterest'],
            accountType: 'Facebook',
            accountSubordinate: { '0': '个人账号', '1': '公共账号' },
            isPublic: '0'
        }
    },

    methods: {
        open() {
            this.dialogVisible = true
        },
        async bindAccount() {
            try {
                this.isLoading = true
                let reData = await this.getReqUrl(this.accountType, this.isPublic)
                if (reData.flag) {
                    //  let url = await this.$http.get(reData.url)
                    //   window.open(reData.url)
                    this.dialogVisible = false
                    this.$emit('sure', reData.url)
                }
            } catch (error) {
                console.log(error)
            }
            this.isLoading = false
        },

        async reBindAccount(accountType, isPublic) {
            let reData = await this.getReqUrl(accountType, isPublic)
            if (reData.flag) {
                this.$emit('sure', reData.url)
            }
        },
        async getReqUrl(accountType, isPublic) {
            let reData = { flag: false }
            try {
                let url = this.Global.baseURL + this.Global.api.v2.find_socialAccount
                let data = {
                    accountType: accountType,
                    isPublic: isPublic
                }
                let res = await this.$http.post(url, data)
                if (res.body.code.toString() == this.Global.RES_OK) {
                    reData = { flag: true, url: res.body.data.url }
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            return reData
        },
        commit() {
            this.$emit('sure', this.accountType)
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
