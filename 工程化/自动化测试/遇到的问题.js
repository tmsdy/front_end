/*
1.jest本身不支持es6语法，需要使用babel-jest插件进行转换,babel-jest不支持babel7版本
解决：npm i babel-core@bridge

2.require('@static/images/xxx.jpg')报错
moduleNameMapper给@static设别名并且重新启动测试
moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@static/(.*)$': '<rootDir>/static/$1'
}

3.开始去引入一个Vue组件，里面的this.$http还有mixins里面的数据方法等拿不到

4.用vue的Vuex: 自己造store

5.调用ref组件的方法: 用mount代替shallowMount

6.this.$route.params: 自己mock定

7.遇到自定义指令: 照常导入

8.element-ui:Cannot read property '$el' of undefined
https://github.com/ElemeFE/element/issues/12158
https://github.com/ElemeFE/element/issues/11811
解决：https://github.com/vuejs/vue-test-utils/issues/958

9.

*/