<template>
    <div id="app">
        <div id="cover"></div>
        <my-header></my-header>
        <router-link to="/todo">to todo</router-link>
        <router-link to="/login">to login</router-link>
        <router-view/>
        <Footer></Footer>
        <p>vuex基本-----</p>
        <div>counter:{{counter}}</div>
        <div>fullName:{{fullName}}</div>
        <p>vuex模块-----</p>
        <p>textA: {{aText}}</p>
        <p>textB: {{bText}}</p>
        <p>textPlus: {{textPlus}}</p>
        <p>textC: {{cText}}</p>
    </div>
</template>

<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex' //让我们非常方便的在组件中使用vuex中的数据
import MyHeader from './layout/header.vue'
import Footer from './layout/footer.jsx'

export default {
    components:{
        MyHeader,
        Footer,
    },
    mounted() {
      console.log(this.$store) ;
      let i = 0 ;
      // setInterval(()=>{
      //   this.$store.commit('updateCount',{ i : ++ i ,num2 : 999 })
      // },1000)
      // setInterval(()=>{
      //   this.updateCount({ i : ++ i ,num2 : 999 })
      // },1000)
      // this.$store.dispatch('undateCountAsync',{num:200,time:1000}) ;
      // this.undateCountAsync({num:200}) ;//简写 不知道为啥挂了,可能命名空间的问题
      this['a/add']() ;
      // this.updateTextA('111aaa')
      // this['a/updateTextA']('111aaa') ;
      this['b/testAction']()
    },
    computed:{
      // count(){return this.$store.state.count },
      ...mapState({
        // counter: 'count'
        counter:(state)=> state.count ,//这么写要灵活写
        bText:(state) => state.b.text ,
        cText:(state) => state.c.text
      }) ,
      ...mapGetters({
        fullName: 'fullName',
        textPlus: 'a/textPlus'
      }),
      aText(){
        return this.$store.state.a.text ;
      }
    },
    methods:{
      ...mapActions(['updateCountAsync','a/add','b/testAction']) ,
      ...mapMutations(['updateCount','a/updateTextA']) ,

    }
}
</script>

<style lang="less" scoped>
    #app {
        position: absolute ;
        left: 0 ;
        right:0;
        top: 0 ;
        bottom: 0 ;
    }
    #cover {
        position: absolute ;
        left: 0 ;
        right:0;
        top: 0 ;
        bottom: 0 ;
        background-color: #555 ;
        opacity:0.5 ;
        z-index:-1 ;
    }
</style>
