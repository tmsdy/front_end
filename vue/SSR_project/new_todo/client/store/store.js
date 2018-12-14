import Vuex from 'vuex'

import defaultState from './state/state'
import mutations from './mutations/mutations'
import getters from './getters/getters'
import actions from './actions/actions'

// export default store 服务端渲染每次都要新生成store不然可能内存溢出
export default () => {
  const store = new Vuex.Store({
    state: defaultState, //默认数据，可能拿到真实数据后会覆盖这个
    mutations ,
    getters,
    actions,
    plugins:[ //自定义的插件 初始化就调用了
      (store) => {
        console.log('my plugin')
      }
    ],
    modules:{ // 分不同的模块，vuex的命名空间,当成全局state的子对象
      a:{
        //vuex默认把mutations全放到全局的mutations里面,设置了这个则就只在当前模块。好处是就可以写同名的mutations了
        namespaced:true ,
        state:{
          text: 111
        },
        mutations:{
          updateTextA(state,newText){
            state.text = newText ;
          }
        },
        getters:{
          textPlus(state,getters,rootState){
            return state.text + 'Plus' +rootState.count;
          }
        },
        actions:{
          add({state,commit,rootState}){
            console.log('add',rootState.count)
            commit('updateTextA',rootState.count) ; //调模块间的
            commit('updateCount',{i:777},{root: true}) //调全局的
          }
        }
      },
      b:{
        namespaced:true ,
        state:{
          text: 222
        },
        actions:{
          testAction({ commit }){
            commit('a/updateTextA','b changeee Atext',{root:true})
          }
        }
      }
    }
  })

  if(module.hot){ //做动态热更替
    module.hot.accept([
      './state/state' ,
      './mutations/mutations' ,
      './actions/actions' ,
      './getters/getters'
    ],()=>{

      store.hotUpdate({
        state: require('./state/state').default ,
        mutations: require('./mutations/mutations').default,
        actions: require('./actions/actions').default,
        getters: require('./getters/getters').default,
      })
    })
  }
  return store
}
