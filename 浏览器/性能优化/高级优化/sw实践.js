
if(navigator.serviceWorker){
    navigator.serviceWorker.register('./service_worker.js')
        .then(reg=>{
            console.log(reg)
        }).catch(err=>{
            console.log(err)
        })
}else{
    console.log('不支持service ',{scope:'./'})
}