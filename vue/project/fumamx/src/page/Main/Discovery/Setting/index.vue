<template>
    <div class="Setting">
        <page-title></page-title>
        <div class="main MXscroll">
            <div class="toolBar">
                <div class="pull-right">
                    <!--  <a class="link" href="">如何绑定社交账号？</a> -->
                    <el-button @click="addAccount" type="primary">绑定社交账号</el-button>
                </div>
            </div>
            <div class="tableBox">
                <el-row class="tableHeader">
                    <el-col class="item" :span="4">
                        账号名
                    </el-col>
                    <el-col class="item" :span="3">
                        类型
                    </el-col>
                    <el-col class="item" :span="3">
                        平台
                    </el-col>
                    <el-col class="item" :span="5">
                        授权时效
                    </el-col>
                    <el-col class="item" :span="4">
                        授权状态
                    </el-col>
                    <!-- <el-col class="item" :span="4">
                        产品专区
                    </el-col> -->
                    <el-col class="item" :span="5">
                        操作
                    </el-col>
                </el-row>
                <div class="tableBody">
                    <template v-if="accountList.length>0&&!isLoading">
                        <el-row v-for="(item, index) in accountList" :key="index" class="row">
                            <el-col class="item ellipsis" :span="4">
                                {{item.account||'&nbsp;'}}
                            </el-col>
                            <el-col class="item ellipsis" :span="3">
                                {{item.is_public==='0'?'个人':'公共'}}
                            </el-col>
                            <el-col class="item ellipsis" :span="3">
                                {{item.account_type||'&nbsp;'}}
                            </el-col>
                            <el-col class="item ellipsis" :span="5">
                                {{transferDate(item.authoration_date)}} - {{transferDate(item.authoration_endtime)}}
                            </el-col>
                            <el-col class="item ellipsis" :span="4">已授权
                            </el-col>
                            <!--  <el-col class="item" :span="4">&nbsp;
                        </el-col> -->
                            <el-col class="item" :span="5">
                                <el-button type="text" @click="reBind(item.account_type,item.is_public)">重新绑定</el-button>
                                <el-button type="primary" @click="delItem(item,index)">删除</el-button>
                            </el-col>
                        </el-row>
                    </template>
                    <!-- loading -->
                    <transition name="el-fade-in-linear">
                        <loading v-show="isLoading" class="atCenter"></loading>
                    </transition>
                    <!-- 没有记录 -->
                    <transition name="el-fade-in-linear">
                        <no-data v-show="accountList.length<=0&&!isLoading" class="noDataBox atCenter"></no-data>
                    </transition>
                </div>
            </div>
        </div>
        <social-sel ref="socialSel" @sure="reqAuthSuccess"></social-sel>
        <el-dialog title="注意" :visible.sync="dialogVisible" size="tiny">
            <p>是否授权成功？</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">否</el-button>
                <el-button type="primary" @click="sureBind()">是</el-button>
            </span>
        </el-dialog>
        <iframe class="authFrame" :src="url" frameborder="0"></iframe>
    </div>
</template>

<script>
import Dropdown from '@/components/Dropdown'
import PageTitle from '@/components/PageTitle/index'
import SocialSel from './SocialSel'
import NoData from '@/basecomponents/NoData/index'
import Loading from '@/basecomponents/Loading/index'
export default {
    name: 'Setting',
    data() {
        return {
            url: '',
            isLoading: false,
            dialogVisible: false,
            accountList: [],
            socialsMap: { fb: 'Facebook', 'fb-pages': 'Facebook', twitter: 'Twitter', linkedin: 'Linkedin', pinterest: 'Pinterest' }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        sureBind() {
            this.dialogVisible = false
            this.getList()
        },
        reqAuthSuccess(url) {
            this.url = url
            this.dialogVisible = true
        },
        addAccount() {
            this.$refs.socialSel.open()
        },
        transferDate(time) {
            return time ? time.split(' ')[0] : ''
        },
        dateFormat(time, format) {
            var t = new Date(time)
            var tf = function (i) {
                return (i < 10 ? '0' : '') + i
            }
            return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
                switch (a) {
                    case 'yyyy':
                        return tf(t.getFullYear())
                        break
                    case 'MM':
                        return tf(t.getMonth() + 1)
                        break
                    case 'mm':
                        return tf(t.getMinutes())
                        break
                    case 'dd':
                        return tf(t.getDate())
                        break
                    case 'HH':
                        return tf(t.getHours())
                        break
                    case 'ss':
                        return tf(t.getSeconds())
                        break
                }
            })
        },
        delItem(item, index) {
            let url = this.Global.baseURL + this.Global.api.v2.find_socialAccount
            let data = {
                body: {
                    accountType: item.account_type,
                    accountOuterId: item.outer_id
                }
            }
            this.$http.delete(url, data)
                .then(res => {
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.accountList.splice(index, 1)
                    } else {
                        this.$message.error(this.msg(res.body))
                    }
                })
                .catch(err => {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        reBind(accountType, isPublic) {
            if (accountType.toLowerCase() == 'youtube') {
                this.accountList.forEach(item => {
                    if (item.account_type.toLowerCase() == 'youtube') {
                        this.$message.error('一家公司只能绑定一个youtube账号')
                        return false
                    }
                })
            }
            let account_type = this.socialsMap[accountType.toLowerCase()]
            this.$refs.socialSel.reBindAccount(account_type, isPublic)
        },
        getList() {
            let url = this.Global.baseURL + this.Global.api.v2.find_socialAccount
            this.isLoading = true
            this.$http.get(url)
                .then(res => {
                    if (res.body.code.toString() === this.Global.RES_OK) {
                        this.accountList = res.body.data
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
    watch: {
        $route() {
            if (this.$route.path !== '/main/discovery/setting' && this.url != '') {
                this.url = ''
            }
        }
    },
    components: {
        'drop-down': Dropdown,
        'no-data': NoData,
        'loading': Loading,
        'page-title': PageTitle,
        'social-sel': SocialSel
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
