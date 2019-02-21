
function promisify(fn){
  return function (...args) {
    return new Promise(function(resolve,reject){
      args.push(function(err,data){
        err ? reject(err) : resolve(data)
      })
      fn.apply(null,args)
    })
  }
}
module.exports = {
  promisify
}