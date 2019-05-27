<template>
    <div class="MX">
        <twolevelnav :list="menuNavList"></twolevelnav>
        <div class="mainWindow">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </div>
    </div>
</template>

<script>
import TwolevelNav from '@/components/TwolevelNav/index'
import { mapGetters } from 'vuex'
export default {
    name: 'MX',
    props: {},
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
            if (this.$route.path.indexOf('/main/mx') > -1) {
                this.navigator.navs.forEach((element) => {
                    if (element.naviCode == 'NV008') {
                        this.menuNavList = element.subNavis
                    }
                }, this)
            }
        },
        toPage() {
            if (this.$route.path == '/main/mx' || this.$route.path == '/main/mx/') {
                this.menuNavList.length > 0 && this.$router.push(this.menuNavList[0].uRI)
            }
        }
    },
    components: {
        'twolevelnav': TwolevelNav
    },
    watch: {
        $route() {
            this.toPage()
        }
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
