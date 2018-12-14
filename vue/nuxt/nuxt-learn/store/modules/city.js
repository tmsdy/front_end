
const state = ()=>({
    list: ['vuex01','vuex02','vuex03']
})

const mutations = {
    add(state,text){
        state.list.push(text) ;
    }
}

const actions = {
    add:({commit},text)=>{
        commit('add',text) ;
    }
}

export default {
    namespaced: true ,
    state,
    mutations ,
    actions
}