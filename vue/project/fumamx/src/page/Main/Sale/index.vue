<template>
    <div class="Sale">
        <twolevelnav :list="menuNavList" :recycle="recycle"></twolevelnav>
        <div class="mainWindow">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import TwolevelNav from './TwolevelNav/index'
import { mapGetters } from 'vuex'
export default {
    name: 'Sale',
    props: {

    },
    data() {
        return {
            menuNavList: [],
            recycle: {}
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
            if (this.$route.path.indexOf('/main/sale') > -1) {
                this.navigator.navs.forEach((element) => {
                    if (element.naviCode == 'NV011') {
                        let menuNavList = []
                        element.subNavis.forEach(item => {
                            if (item.sortOrder == 99) {
                                this.recycle = item
                            } else {
                                menuNavList.push(item)
                            }
                        })
                        this.menuNavList = menuNavList
                    }
                }, this)
            }
        },
        toPage() {
            if (this.$route.path == '/main/sale' || this.$route.path == '/main/sale/') {
                this.$router.push(this.menuNavList[0].uRI)
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
