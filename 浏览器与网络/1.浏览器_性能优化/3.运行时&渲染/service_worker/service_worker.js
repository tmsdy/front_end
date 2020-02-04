self.addEventListener('install',function(e){
    e.waitUntil(
        cache.open('app-v1').then(cache=>{
            console.log('open cache') ;
            return cache.addAll([ //扔到cacheStorage缓存
                './app.js' ,
                './main.js'
            ])
        })
    )
})

self.addEventListener('fetch',function(e){ //拦截请求，伪造响应把缓存放进去
    e.respondWith(
        caches.match(e.request).then(res=>{ //如果请求的资源在cacheStorage中有
            if(res){
                return res 
            }else{ //没有的话就正常发起请求
                // fetch请求... 请求到可以用Cache.add添加到缓存
            }
        })
    )
})

