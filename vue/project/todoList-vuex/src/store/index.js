import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'

Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        todos: []
    },
    mutations: {
        updateAll(state, payload) {
            state.todos = payload;
        },
        add(state, playload) {
            state.todos.unshift(playload);
        },
        remove(state, playload) {
            state.todos = state.todos.filter(todo => todo.id != playload.id );
        }
    },
    actions: {
        getAll(store) {
            // console.log(store)
            return axios.get('/api/getall').then(response => {
                store.commit('updateAll', response.data);

            }).catch(err => {
                return Promise.reject(err);
            });
        },

        // 添加新任务
        postNewTask(store, {title}) {
            return axios.post('/api/add', {
                title
            }).then( response => {
                if (!response.data.error) {
                    store.commit('add', response.data);
                    return Promise.resolve(response);
                } else {
                    return Promise.reject(response);
                }
            } );
        },

        // 删除
        remove(store, payload) {
            return axios.post('/api/remove', {
                id: payload.id
            }).then( response => {
                if (!response.data.error) {
                    store.commit('remove', {id: payload.id});
                    return Promise.resolve();
                } else {
                    return Promise.reject();
                }
            } );
        }
    }
});
