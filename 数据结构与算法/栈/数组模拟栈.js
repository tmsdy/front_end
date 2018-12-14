class Stack {
  // 五个操作时间复杂度都是o(1)的
  constructor (max = 1000) {
    this.stack = new Array(1000) ; //最大空间
    this.top = -1 ; //栈顶（栈指针）
  }
  push(x){
    if(this.top === this.max-1) throw 'starkoverflow' ;
    this.top ++ ;
    this.stack[this.top] = x ;
  }
  pop(){
    if(this.top === -1) throw 'starkunderflow' ;
    const x = this.data[this.top] ;
    this.top-- ;
  }


}