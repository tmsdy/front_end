<template>
  <div class="header-main">
    <span class="header-item">账号: {{$user.getInfo().username}}</span>
    <router-link :to="{name:'修改密码'}"
      class="header-item">
      <i class="iconfont icon-edit"
        style="color:#159bb3;margin:2px;"></i>
      修改密码
    </router-link>
    <a href="javascript:void(0)"
      class="header-item"
      @click="logOut">
      <i class="iconfont icon-logout"
        style="color:#159bb3;margin:2px;"></i>
      退出
    </a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import c from '@/config'

export default Vue.extend({
  data() {
    return {}
  },
  methods: {
    logOut() {
      this.$user.logout()
      this.$goto(c.URL_LOGIN)
    },
  },
})
</script>

<style lang="stylus">
+b('header') {
  +e('main') {
    width: 100%;
    // background: lime;
    font-size: 14px;
    padding-right: 15px;
    color: #585858;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    box-shadow: 0 2px 4px 0 rgba(217, 217, 217, 0.5);
  }

  +e('item') {
    padding: 0 15px;
    height: 30px;
    display: flex;
    align-items: center;
    border-right: 1px solid #ececec;

    &:last-child {
      border: none;
    }
  }
}
</style>
