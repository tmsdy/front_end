
class Product {
  constructor(name){
    this.name = name ;
  }
  init() {
    console.log('init')
  }
  fun1(){
    console.log('fun1')
  }
  fun2(){
    console.log('fun2')
  }
}
class Creater {
  create(name){
    return new Product(name) ;
  }
}
let creater = new Creater() ;
let p1 = creater.create('p1') ;
p1.init() ;
p1.fun1() ;