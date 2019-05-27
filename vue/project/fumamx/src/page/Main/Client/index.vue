<template>
    <div class="Client">
        <twolevelnav :list="menuNavList"></twolevelnav>
        <div class="mainWindow">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import TwolevelNav from '@/components/TwolevelNav/index'
import { mapGetters } from 'vuex'
export default {
    name: 'Client',
    props: {

    },
    data() {
        return {
            menuNavList: []
        }
    },
    created() {
        this.getMenuNavList()
        this.toPage()
    },
    computed: {
        ...mapGetters([
            'navigator'
        ])
    },
    methods: {
        // 给客户模块导航菜单赋值
        getMenuNavList() {
            if (this.$route.path.indexOf('/main/client') > -1) {
                this.navigator.navs.forEach((element) => {
                    if (element.naviCode == 'NV002') {
                        this.menuNavList = element.subNavis
                    }
                }, this)
            }
        },
        toPage() {
            if (this.$route.path == '/main/client' || this.$route.path == '/main/client/') {
                this.$router.push(this.menuNavList[1].uRI)
            }
        }
    },
    watch: {
        // 监听导航数据变化
        navigator(val, old) {
            this.getMenuNavList()
        },
        $route() {
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
