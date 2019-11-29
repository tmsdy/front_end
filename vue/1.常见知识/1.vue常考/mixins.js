/*
文档：https://cn.vuejs.org/v2/guide/mixins.html

全局混入：Vue.mixin(mixins) // 每个vue实例都能用到

组件内合并混入：{
     mixins: [mixin],
     data(){
         return { ... }
     }
}

缺点：
    1.全局和局部混入会导致来源不清晰，多个mixin以后再定义可能会重名

*/