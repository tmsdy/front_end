let str = `ReferenceError: vue is not defined
at a.mounted (http://localhost:3003/vue-test/dist/bundle.js:7:69416)
at zt (http://localhost:3003/vue-test/dist/bundle.js:7:11101)
at en (http://localhost:3003/vue-test/dist/bundle.js:7:24641)
at Object.insert (http://localhost:3003/vue-test/dist/bundle.js:7:19872)
at x (http://localhost:3003/vue-test/dist/bundle.js:7:55482)
at An.__patch__ (http://localhost:3003/vue-test/dist/bundle.js:7:56842)
at An.t._update (http://localhost:3003/vue-test/dist/bundle.js:7:33757)
at An.r (http://localhost:3003/vue-test/dist/bundle.js:7:63670)
at pn.get (http://localhost:3003/vue-test/dist/bundle.js:7:26015)
at new pn (http://localhost:3003/vue-test/dist/bundle.js:7:25933)`
let matchUrl = str.match(/https?:\/\/[^\n]+/)
let urlFirstStack = matchUrl ? matchUrl[0] : ''
let regUrlCheck = /https?:\/\/(\S)*\.js/

let resourceUrl = '' //报错url
if (regUrlCheck.test(urlFirstStack)) {
    resourceUrl = urlFirstStack.match(regUrlCheck)[0]
}
console.log(resourceUrl)
let posStack = urlFirstStack.match(/:(\d+):(\d+)/)
if (posStack && posStack.length >= 3) {
    [, stackCol, stackRow] = posStack
}
console.log(stackCol, stackRow)