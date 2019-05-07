
function sleep(ms){

    return new Promise((resolve)=>{
        console.log(111);
        setTimeout(resolve,ms)
    });
}
sleep(2000).then(function(){
    console.log(222)
})



