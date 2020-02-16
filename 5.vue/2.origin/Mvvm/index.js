import _Vue from './mvvm/_Vue'

window.vue = new _Vue({
    el: '#app',
    data: {
        a: {
            a: 'aaa'
        },
        b: 'bbb'
        // person: {
        //     name: 'feifei',
        //     age: 22
        // }
    }
})