/*

1.redux = reducer + flux

2.redux工作流：
  1>页面去取store中的数据，并派发一个action给store
  2>store：把action和之前的数据一起给reducer
  3>reducer：根据action和之前的数据返回一个新的数据给store
  4>store：数据跟新并告诉页面重新刷新

3.reducer必须得是纯函数：
  1)给定固定的输入，就一定会有固定的输出:
    有了state和action其实输出就已经确定了，如果里面有new Date()之类的就不是纯函数了，因为输出不再由state/action固定
  2)不会有任何副作用:
    比如去改state就是副作用，不要去改

4.immutable确保reducer中state不会被误改，immutable对象是不可改变的

*/