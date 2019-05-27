<template>
    <div class="Goods">
        <twolevelnav :list="menuNavList" @setactiveId="setactiveId" :activeId="activeId" :rootData="rootData" @setRootData="setRootData"></twolevelnav>
        <div class="mainWindow MXscroll">
            <div class="mainWindowBox">
                <keep-alive>
                    <router-view :activeId="activeId" :rootData="rootData"></router-view>
                </keep-alive>
            </div>
        </div>
    </div>
</template>

<script>
import TwolevelNav from './Vue/MenuNav/index'
import { mapGetters } from 'vuex'
export default {
    name: 'Goods',
    props: {},
    data() {
        return {
            menuNavList: [],
            rootData: [],
            activeId: ''
        }
    },
    async created() {
        this.getMenuNavList()
        this.toPage()
    },
    computed: {
        ...mapGetters([
            'navigator'
        ])
    },
    methods: {
        setRootData(list) {
            this.rootData = list
        },
        setactiveId(id) {
            this.activeId = id
        },
        // 给客户模块导航菜单赋值
        getMenuNavList() {
            if (this.$route.path.indexOf('/main/goods') > -1) {
                this.navigator.navs.forEach((element) => {
                    if (element.naviCode == 'NV009') {
                        this.menuNavList = element.subNavis
                    }
                }, this)
            }
        },
        toPage() {
            if (this.$route.path == '/main/goods' || this.$route.path == '/main/goods/') {
                this.$router.push(this.menuNavList[0].uRI)
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
