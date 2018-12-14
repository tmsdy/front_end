<template>
  <div class="sidebar-main">
    <img class="sidebar-logo"
      src="../../assets/logo.png"
      alt="">
    <img class="sidebar-logotext"
      src="../../assets/logo-text.png"
      alt="">
    <ul class="sidebar-menu">
      <li v-for="(menu,idx) in menus"
        :key="idx">
        <router-link :to="menu.to"
          class="sidebar-menuitem"
          v-permission="{rules:$user.getInfo().privileges,key:menu.permission}">
          {{menu.label}}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: ['menus'],
})
</script>

<style lang="stylus">
+b('sidebar') {
  +e('main') {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-image: radial-gradient(circle at 0 -5%, #664998, #0ba7b8);
    box-shadow: 0 2px 4px 0 rgba(78, 78, 78, 0.5);
  }

  +e('logo') {
    width: 50px;
    margin-top: 24px;
  }

  +e('logotext') {
    width: 50px;
    margin-top: 5px;
  }

  +e('menu') {
    width: 100%;
    text-align: center;
    font-size: 1.5rem;
    color: white;
    margin-top: 20px;
  }

  +e('menuitem') {
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;

    &.router-link-active {
      background: rgba(255, 255, 255, 0.36);
      border-left: 3px solid white;
    }

    &:hover, &:active, &:link, &:visited {
      color: inherit;
      text-decoration: none;
    }
  }
}
</style>
