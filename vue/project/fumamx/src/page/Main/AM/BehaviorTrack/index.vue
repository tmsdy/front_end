<template>
    <div class="BehaviorTrack" style="height:100%;">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>

<script>
export default {
  name: 'BehaviorTrack',
  created() {
    this.toList()
  },
  methods: {
    toList() {
      // console.log('jjj')
      let path = this.$route.path
      if (
        path === '/main/am/behaviorTrack' ||
        path === '/main/am/behaviorTrack/'
      ) {
        this.$router.push({ path: '/main/am/behaviorTrack/list' })
      }
    }
  },
  watch: {
    $route() {
      this.toList()
    }
  }
}
</script>
