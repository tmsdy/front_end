// lodash中的after指定一个函数被调用多少次才会真正的执行

function eat(){
  console.log('吃完了')
}
function after(times,fn){
  return function(){
    !--times ? fn() : console.log('正在吃')
  }
}

let newEat = after(3,eat)
newEat() //正在吃
newEat() //正在吃
newEat() //吃完了