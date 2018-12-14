// console.log(a) ; //不行

declare var $ ; //外部引入jq等库，在里面用需要声明$

$(function(){
    $('#div1').css('width','200px') ;
})

window.onload = function(){ //不过ts内部对window和document都有声明过的，直接用就是了

}