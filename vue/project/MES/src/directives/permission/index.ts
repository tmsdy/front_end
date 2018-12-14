import { VueConstructor } from 'vue'

export default {
  install(Vue: VueConstructor, options: any) {
    Vue.directive('permission', {
      inserted(el: any, binding: any, vnode: any, oldVnode: any) {
        // console.log(Vue.$store.state.user);
        if (binding.value && binding.value.key !== undefined) {
          const keyIndex = binding.value.rules.findIndex(
            (item:any) => item.ID === binding.value.key,
          )
          if (keyIndex === -1) {
            el.remove()
          }
        }
      },
    })
  },
}
