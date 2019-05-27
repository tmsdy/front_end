<template>
    <div class="SystemSet">
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
  name: 'SystemSet',
  props: {},
  data () {
    return {
      menuNavList: []
    }
  },
  created () {
    this.getMenuNavList()
    this.toPage()
  },
  computed: {
    ...mapGetters([
      'navigator'
    ])
  },
  methods: {
    // 给系统设置模块导航菜单赋值
    getMenuNavList () {
      if (this.$route.path.indexOf('/main/systemset') > -1) {
        this.navigator.navs.forEach((element) => {
          if (element.naviCode == 'NV004') {
            this.menuNavList = element.subNavis
          }
        }, this)
      }
    },
    toPage () {
      if (this.$route.path == '/main/systemset' || this.$route.path == '/main/systemset/') {
        this.$router.push(this.menuNavList[0].uRI)
      }
    }
  },
  components: {
    'twolevelnav': TwolevelNav
  },
  watch: {
    // 监听导航数据变化
    navigator (val, old) {
      this.getMenuNavList()
    },
    $route () {
      this.toPage()
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
