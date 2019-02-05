import Vue from "vue";
import "babel-polyfill";

new Vue({
  el: "#app",
  template: `
  <div> </div>
  `,
  mounted() {
    async function async1() {
      console.log("async1 start");
      await async2();
      /*
      await是个运算符，会阻塞后面代码
      浏览器：新版本v8 await 转化为 promise 需要异步时间，async1 end在微任务后执行
      node: async1 end先与微任务执行
      绝大部分时候Node的V8会比同时期的Chrome的V8要落后
     */
      console.log("async1 end");
    }

    async function async2() {
      console.log("async2");
    }

    console.log("script start");

    setTimeout(function() {
      console.log("setTimeout");
    }, 0);

    async1();

    new Promise(function(resolve) {
      console.log("promise1");

      resolve();
    }).then(function() {
      console.log("promise2");
    });

    console.log("script end");
    async function async111(){
      console.log('async111')
      console.log(await new Promise((resolve,reject)=>{
        resolve('resolveppp')
      })) // resolveppp
      console.log(await setTimeout(()=>{ //setTimeout
        console.log('setTimeout')
      },1000))
    }
    console.log(async111()) //Promise对象
  }
});
