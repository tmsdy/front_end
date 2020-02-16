const person = {
  name: 'menglinghua',
  say1: function (){
    return function (){
      console.log(this.name); 
    };
  },
  say2: function (){
    return () => {
      console.log(this.name);
    };
  }
};
person.say1()(); // undefined -> this在普通函数的环境
person.say2()(); // menglinghua -> this在person的环境
let say2 = person.say2
say2()()  // undefined -> this在普通函数的环境

var obj = {
  b: ()=> {console.log(this);}, 
  c: function() {console.log(this);}
}
obj.b(); // this在window的环境
obj.c(); // obj