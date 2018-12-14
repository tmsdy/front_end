
function http(options){
    return new Promise((resolve,reject)=>{
        let xhr = new XMLHttpRequest() ;
    
        xhr.open(options.method,options.url,true) ;

        xhr.onload = function(){
            resolve( JSON.parse(xhr.responseText)) ;
        }

        xhr.onerror = function(){
            reject({
                code: xhr.response.code ,
                message: '出错了'
            })
        }

        xhr.send() ;
    })
}
http('url').then(res =>{
    console.log(res)
})