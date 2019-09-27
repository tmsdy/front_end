let formatStack = (stack) => {
    let matchUrl = stack.match(/https?:\/\/[^\n]+/) //报错url和报错位置
    // console.log(matchUrl)
    let urlFirstStack = matchUrl ? matchUrl[0] : ''
    let regUrlCheck = /https?:\/\/(\S)*\.js/

    let resourceUrl = '' //报错url
    if (regUrlCheck.test(urlFirstStack)) {
        resourceUrl = urlFirstStack.match(regUrlCheck)[0]
    }

    let stackCol = null //报错信息列
    let stackRow = null //报错信息行
    let posStack = urlFirstStack.match(/:(\d+):(\d+)/)
    if (posStack && posStack.length >= 3) {
        [, stackCol, stackRow] = posStack
    }
    return {
        resourceUrl,
        stackCol,
        stackRow
    }
}
let formatError = (errorObj) => {
    // console.log(errorObj)
    let col = errorObj.column || errorObj.columnNumber
    let row = errorObj.line || errorObj.lineNumber
    let errorType = errorObj.name
    let message = errorObj.message

    let { stack } = errorObj
    if (stack) {
        // console.log(stack)
        let { resourceUrl, stackCol, stackRow } = formatStack(stack)

        return {
            content: stack,
            col: Number(col || stackCol),
            row: Number(row || stackRow),
            errorType,
            message,
            resourceUrl
        }
        // debugger
    }
    // debugger
}

export default {
    init: (cb) => {
        let _origin_error = window.onerror
        console.log('errorCatch 开始监听')
        window.onerror = function (message, source, lineno, colno, error) {
            let errorInfo = formatError(error)
            errorInfo._message = message
            errorInfo._source = source
            errorInfo._lineno = lineno
            errorInfo._colno = colno

            cb(errorInfo)

            errorInfo.type = 'error'
            _origin_error && _origin_error.apply(window, arguments)

        }
        // 针对 vue 报错重写 console.error
        // TODO
        console.error = (function (origin) {
            return function (info) {
                let stack = info.stack
                let { resourceUrl, stackCol, stackRow } = formatStack(stack)
                console.log(resourceUrl, stackCol, stackRow)
                origin.call(console, info);
            }
        })(console.error);
    }
}
