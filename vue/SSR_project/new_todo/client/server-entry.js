import createApp from './create-app'

export default context => {
    return new Promise((resolve,reject) =>{
        const { app , router } = createApp()

        router.push(context.url) //推进路由记录

        router.onReady(()=>{ //路由中的异步加载组件完事后调这个
            const matchedComponents = router.getMatchedComponents()
            if (!matchedComponents.length){
                return reject(new Error('no component matched'))
            }
            resolve(app)
        })
    })
}