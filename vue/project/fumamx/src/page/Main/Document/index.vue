<template>
    <div class="Document">

        <!-- 树菜单 -->
        <folders-tree class="MXscroll rightNav" :list="menuNavList"></folders-tree>

        <!-- 右侧动态路由 -->
        <keep-alive>
            <router-view class="childrenWindow"></router-view>
        </keep-alive>

    </div>
</template>

<script>
import FoldersTree from './Vue/FoldersTree/index.vue'

import { mapGetters } from 'vuex'
export default {
    name: 'Document',
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
        ...mapGetters(['navigator'])
    },
    methods: {
        // 给客户模块导航菜单赋值
        getMenuNavList() {
            if (this.$route.path.indexOf('/main/document') > -1) {
                this.navigator.navs.forEach(element => {
                    if (element.naviCode == 'NV006') {
                        this.menuNavList = element.subNavis
                    }
                }, this)
            }
        },
        toPage() {
            if (this.$route.path == '/main/document' || this.$route.path == '/main/document/') {
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
        'folders-tree': FoldersTree
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
