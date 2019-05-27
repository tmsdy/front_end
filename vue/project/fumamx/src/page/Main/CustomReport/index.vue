<template>
    <div class="CustomReport">
        <twolevelnav v-show="pageRoute!='/main/customReport/reportdetail'"></twolevelnav>
        <div :class="[pageRoute=='/main/customReport/reportdetail' ? 'detailWindow' : 'mainWindow']">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import TwolevelNav from './components/TwolevelNav/index'
export default {
    name: 'CustomReport',
    props: {

    },
    data() {
        return {
            dialogFormVisible: true,
            pageRoute: '',
            menuList: []
        }
    },
    created() {
        // this.getMenuNavList()
        this.pageRoute = this.$route.path
        this.toPage()
    },
    methods: {
        // 给客户模块导航菜单赋值//12212
        // getMenuNavList() {
        //     if (this.$route.path.indexOf('/main/client') > -1) {
        //         this.navigator.navs.forEach((element) => {
        //             if (element.naviCode == 'NV002') {
        //                 this.menuNavList = element.subNavis
        //             }
        //         }, this)
        //     }
        // },
        toPage() {
            if (this.$route.path == '/main/customReport' || this.$route.path == '/main/customReport/') {
                this.$router.push('/main/customReport/list/1')
            }
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done()
                })
                .catch(_ => { })
        },
        addReportLabel() {
            this.dialogFormVisible = true
        }
    },
    watch: {
        // 监听导航数据变化
        // 路由变化时
        $route(to, from) {
            this.pageRoute = this.$route.path
            this.toPage()
        }
    },
    components: {
        'twolevelnav': TwolevelNav
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
