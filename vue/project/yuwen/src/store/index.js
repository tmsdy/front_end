import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex) ;

export default new Vuex.Store({
  state:{
    name:'feifei',
    token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHQiOjE1MzU0NDAzNTMyOTksInVpZCI6IjVkYzM3MzhkOGE5MTQxNDRiODE1MDlkNDY0ZmU2NjE1IiwiaWF0IjoxNTM0ODM1NTUzMjk5fQ.jzrTHhe2wtu4-izD9q12etwt7YpRasswf4q-Zq5vu4w',
    ex_course:[]
  },

  mutations:{
    save_ex_course(state,payload){
      state.ex_course = payload ;
    }
  }


})
