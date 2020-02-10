/*

1.webpack是只支持es5及.js文件的，别的文件或者es6语法都需要相应的loader去处理

2.用cross-env可以跑在mac和windows上

3.babelrc里的transform-vue-jsx可支持vue写jsx语法
  npm i babel-preset-env babel-plugin-transform-vue-jsx
  npm i babel-helper-vue-jsx-merge-props@^2.0.0 babel-helper-vue-jsx-merge-props@^2.0.0 babel-plugin-syntax-jsx

4.v-for或者jsx里面的循环一定要绑定一个key这样出现变动时候只要key不变的就会复用之前的，不然会重新生成影响性能

5.一般css打包后是以js形式在bundle.js里面，不利于css放到head和浏览器缓存。需要单独抽离。
 用extract-text-webpack-plugin@next

6.3.x版本使用extract-text-webpack-plugin来提取CSS文件，4.x中则应该使用mini-css-extract-plugin

7.style-loader是把css-loader生成css以style标签生成到html里面

8.需要单独打包vue等第三方框架类库代码，让浏览器一直缓存。减少流量和加载更快

*/