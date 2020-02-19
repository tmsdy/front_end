module.exports = async (ctx, next) => {
    let apiMap = {
        '/api/list': [
            {
                id: 1,
                name: 'feifei'
            },
            {
                id: 2,
                name: 'fangfang'
            }
        ],
        '/api/detail': {
            name: 'feifei',
            country: 'china',
            age: 22,
            like: 'fangfang'
        }
    }
    for (let key in apiMap) {
        if (ctx.path.includes(key)) {
            ctx.body = apiMap[key]
            break
        }
    }
    return next()
}