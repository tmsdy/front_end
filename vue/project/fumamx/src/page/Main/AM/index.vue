<template>
    <div class="AM">
        <twolevelnav :list="menuNavList"></twolevelnav>
        <div class="mainWindow MXscroll">
            <template>
                <keep-alive>
                    <router-view v-if="$route.meta.keepAlive"></router-view>
                </keep-alive>
                    <router-view v-if="!$route.meta.keepAlive"></router-view>
            </template>
        </div>
    </div>
</template>

<script>
import TwolevelNav from '@/components/TwolevelNav/index'
import { mapGetters } from 'vuex'
export default {
    name: 'AM',
    props: {},
    data() {
        return {
            menuNavList: []
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
        // 给客户模块导航菜单赋值
        getMenuNavList() {
            if (this.$route.path.indexOf('/main/am') > -1) {
                this.navigator.navs.forEach((element) => {
                    if (element.naviCode == 'NV007') {
                        let menuNavList = []
                        element.subNavis.forEach(function(item) {
                            if (item.moduleCode != 'AM007') {
                                menuNavList.push(item)
                            }
                        })
                        this.menuNavList = menuNavList
                    }
                }, this)
            }
        },
        toPage() {
            if (this.$route.path == '/main/am' || this.$route.path == '/main/am/') {
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
