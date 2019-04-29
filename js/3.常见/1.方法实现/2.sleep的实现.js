function sleep(ms){
    var temple=new Promise(
    (resolve)=>{
        console.log(111);setTimeout(resolve,ms)
    });
    return temple
}
sleep(2000).then(function(){
    console.log(222)
})
console.log(333) //这种睡不了啊 感觉只能while做