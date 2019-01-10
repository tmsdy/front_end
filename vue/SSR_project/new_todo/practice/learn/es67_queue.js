import Vue from 'vue'
import 'babel-polyfill'

new Vue({
  el:'#app' ,
  template: `
  <div>
    123
  </div>
  ` ,
  created(){
    // async function aaa(){
    //   await setTimeout(() => { // await后面可以接异步操作或者Promise
    //     console.log('aaa')
    //   }, 2000);
    // }
    // aaa()
    // var eventArr = [
    //   {
    //     value: 111,
    //     interval: 1000
    //   },
    //   {
    //     value: 222,
    //     interval: 3000
    //   },
    //   {
    //     value: 333,
    //     interval: 2000
    //   }
    // ];

    // function setEvent(value,interval){
    //     return new Promise((resolve,reject)=>{
    //         setTimeout(()=>{
    //           console.log(value)
    //           resolve()
    //         },interval)
    //     })
    // }
    // async function makaPromiseList(dataArr,handler){
    //     var result = [];
    //     for(let item of dataArr){
    //         var ret = await handler(item.value,item.interval);
    //         result.push(ret);
    //     }
    //     return result;
    // }
    // makaPromiseList(eventArr,setEvent).then(()=>{
    //     console.log('完成')
    // });

    class Queue{
      constructor(){
        this.PromiseArr = []
      }
      addTask(value,interval){
        this.PromiseArr.push(
          ()=>{
            return new Promise((resolve,reject)=>{
              setTimeout(()=>{
                console.log(value)
                resolve()
              },interval)
            })
          }
        )
        return this
      }
     async start(){
        for(let item of this.PromiseArr){
          await item()
        }
      }

    }
    let q= new Queue()
      .addTask('111',1000)
      .addTask('222',3000)
      .addTask('333',2000)

      setTimeout(()=>{
        q.start()
      },2000)


  }

})
