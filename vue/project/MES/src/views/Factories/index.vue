<template>
  <div class="factory">
    <div class="factory-bg">
      <img class="factory-bg__img"
        src="../../assets/bg.png"
        alt="">
      <div class="factory-bg__gradient"></div>
    </div>
    <div class="factory-content">
      <section class="factory-intro">
        <div class="factory-intro__content">
          <img class="factory-intro__logo"
            src="../../assets/logo.png"
            alt="">
          <img class="factory-intro__logotext"
            src="../../assets/logo-text.png"
            alt="">
          <span class="factory-intro__name">人工智能经编断纱检测系统</span>
          <span class="factory-intro__info"></span>
        </div>
      </section>
      <section class="factory-form__wrap">
        <span class="factory-form__title">选择工厂</span>
        <div class="factory-form__content"
          v-loading="showLoading">
          <span class="el-tag__wapper"
            v-for="factory in factories"
            :key="factory.id"
            @click="chooseFactory(factory)">
            <el-tag>{{factory.name}}</el-tag>
          </span>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import c from '@/config'

export default Vue.extend({
  data() {
    return {
      showLoading: true,
      factories: [],
    }
  },
  mounted() {
    this.$http
      .get('/mes/factory', {
        params: {
          limit: 99999,
        },
      })
      .then(({ data }) => {
        console.log(data) ;
        // if have only one functory, auto jump
        if (data.totalCount === 1) {
          this.chooseFactory(data.factories[0])
          return
        }
        if (data.totalCount > 0) {
          this.factories = data.factories
        }
      })
      .catch(e => {})
      .finally(() => {
        this.showLoading = false
      })
  },
  methods: {
    chooseFactory(factory: { id: number; name: string }) {
      // @ts-ignore
      this.$store.commit('setFactory', factory)
      this.$router.push({ name: c.ROUTER_NAME_FRAME })
    },
  },
})
</script>

<style lang="stylus">
body {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: white;
  background-image: radial-gradient(rgb(200, 195, 199) 6%, transparent 0);
  background-size: 2rem 2rem;
}

+b('factory') {
  width: base-width;
  height: base-height;
  position: relative;

  +e('bg') {
    width: 100%;
    min-width: base-width;
    height: 100%;
    position: relative;

    +m('img') {
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }

    +m('gradient') {
      width: 100%;
      height: 100%;
      background: base-background;
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  +e('content') {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  +e('intro') {
    width: 826px;
    height: 64rem;
    overflow: hidden;

    +m('content') {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    +m('logo') {
      width: 12rem;
      margin-bottom: 2.5rem;
    }

    +m('logotext') {
      width: 7.666rem;
      margin-bottom: 4rem;
    }

    +m('name') {
      margin: 2rem;
      font-size: 2rem;
      font-weight: lighter;
      color: white;
    }

    +m('info') {
      font-size: 3rem;
    }
  }

  +e('form') {
    width: 100%;

    +m('wrap') {
      width: 420px;
      height: 428px;
      padding: 52px 60px;
      margin: 0 60px;
      border: solid 1px #979797;
      overflow: hidden;
      position: relative;
      background: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    +m('title') {
      font-size: 2rem;
      margin-bottom: 60px;
    }

    +m('content') {
      height: 230px;
      overflow-y: auto;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      flex-wrap: wrap;

      & .el-tag__wapper {
        margin: 5px;
        cursor: pointer;
      }
    }
  }
}

.el-input__suffix {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 0.25rem;
  padding-top: 0.25rem;
}
</style>
