// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'

Vue.use(infiniteScroll) ;
Vue.use(Vuex) ;
Vue.use(VueLazyLoad,{
  loading:"/static/loading-svg/loading-spin.svg"
});

Vue.config.productionTip = false ;

const store = new Vuex.Store({ //复用多处且包含数据交互的组件需要vuex控制
  state:{
    nickName:'' ,
    cartCount: 0
  },
  mutations:{
    updateUserInfo(state,nickName){
      state.nickName = nickName ;
    },
    updateCartCount(state,cartCount){
      state.cartCount += cartCount ;
    }
  }
});

//设置cookie
Vue.prototype.setCookie = function(c_name,value,expiredays) {
  var exdate=new Date()
  exdate.setDate(exdate.getDate()+expiredays)
  document.cookie=c_name+ "=" +escape(value)+
    ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
};
//获取cookie
Vue.prototype.getCookie=function(c_name) {
  if (document.cookie.length>0)
  {
    var  c_start=document.cookie.indexOf(c_name + "=");
    if (c_start!=-1)
    {
      c_start=c_start + c_name.length+1
      var c_end=document.cookie.indexOf(";",c_start);
      if (c_end==-1) c_end=document.cookie.length;
      return unescape(document.cookie.substring(c_start,c_end))
    }
  }
  return ""
};

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});



