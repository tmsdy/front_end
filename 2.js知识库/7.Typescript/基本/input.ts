let input: HTMLInputElement = document.querySelector('.val') ;
let btn:HTMLButtonElement = document.querySelector('button') ;

btn.onclick = function(){
  // let value:number = input.value + 10 ; //input.value是string类型会有问题
  let value:number = Number(input.value) + 10 ; //这样能很快发现问题并解决问题

}
