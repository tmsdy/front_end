const person = {
  namea: 'menglinghua',
  say1: function (){
    return function (){
      console.log(this.namea);
    };
  },
  say2: function (){
    return () => {
      console.log(this.namea);
    };
  }
};
person.say1()(); // undefined
person.say2()(); // menglinghua

var obj = {
  b: ()=> {console.log(this);}, 
  c: function() {console.log(this);}
}
obj.b(); // window
obj.c(); // obj