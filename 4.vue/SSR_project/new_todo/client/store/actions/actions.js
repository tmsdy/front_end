export default { //mutations里面都是同步操作，异步操作都放到actions里面
  undateCountAsync(store,{num,time=1000}){
    setTimeout(()=>{
      store.commit('updateCount',{i:num}) ;
    }, time)
  }
}
