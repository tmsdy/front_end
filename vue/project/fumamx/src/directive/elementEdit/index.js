import Vue from 'vue'
Vue.directive('elementEdit', {
  bind (el, binding, vnode, oldVnode) {
    binding.value(123)
    console.log(el)
    $(el).hover((e) => {
      console.log('进入')
    }, (e) => {
      console.log('离开')
    })
  }
})
