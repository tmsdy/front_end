<template>
    <div class="Discovery">
        <!-- 树目录 -->
        <right-nav class="rightNav" :list="menuNavList"></right-nav>
        <!-- 右侧动态路由 -->
        <keep-alive>
            <router-view class="childrenWindow"></router-view>
        </keep-alive>
    </div>
</template>

<script>
import RightNav from './Vue/RightNav'
import { mapGetters } from 'vuex'
export default {
    name: 'Discovery',
    data() {
        return {
            menuNavList: []
        }
    },
    computed: {
        ...mapGetters(['navigator'])
    },
    created() {
        this.getMenuNavList()
        this.toPage()
    },
    methods: {
        getMenuNavList() {
            if (this.$route.path.indexOf('/main/discovery') > -1) {
                this.navigator.navs.forEach(element => {
                    if (element.naviCode == 'NV010') {
                        this.menuNavList = element.subNavis
                    }
                })
            }
        },
        toPage() {
            if (this.$route.path == '/main/discovery' || this.$route.path == '/main/discovery/') {
                this.$router.push('/main/discovery/fumaSearch')
            }
        }
    },
    watch: {
        $route() {
            this.toPage()
        }
    },
    components: {
        'right-nav': RightNav
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
