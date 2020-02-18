/*
1.搞多个webpack配置文件，一个扩展另一个
  npm i webpack-merge -D

2.大部分的包应该放在devDependencies里面

3.vue中的css样式默认不是热重载的，要用的话装 vue-style-loader

4.es-lint的好处，防止出现低级错误，团队协作保持一种代码风格
安装：
  eslint eslint-config-standard eslint-plugin-standard eslint-plugin-promise
  eslint-plugin-import eslint-plugin-node eslint-plugin-html -D
  eslint-loader babel-eslint

5.出现cannot read property of 'xxx' undefined ，说明xxx的loader有问题

6.postcss-loader里面的options加sourceMap: true的话会导致postcss失效

7.hash一般用来定位的而不是作为路由状态记录，hash路由不会被搜索引擎解析，这样对网站的SEO不好

8.刷新路由404：配置mode: 'history'，因为vue-router设置的路径不是真实存在的路径。它会按照路径去找相应的资源，
但是在服务器中并不存在，所以404，要么不加要么得配置：
  跳转不会报错，刷新就会走请求后端继而报错
  要在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，
    则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面。
  1.webpack的devServer里的配置：historyApiFallback:{index: '/index.html'}
  治标不治本，子路由刷新还是不行，得后端配置了

9.单页应用：路由跳转不会发请求

10.导航守卫，执行顺序：全局的>路由中配的>组件中配的

11.异步路由：components: ()=>import('../views/todo/todo.vue') ,//进入当前路由才加载
需要：npm i babel-plugin-syntax-dynamic-import -D 然后babelrc加一下plugin
好处：不用一上来就全部加载组件，可提高首屏加载速度

12.像...这种没有定稿的语法得装babel-preset-stage-1保证所有语法都能使用,然后babelrc加一下

13.dependencies运行时需要，加-S，devDependencies打包时候用的，加-D
*/
