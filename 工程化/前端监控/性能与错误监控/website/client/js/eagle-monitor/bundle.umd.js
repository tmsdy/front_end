(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}(function () { 'use strict';

    let formatStack = (stack) => {
        let matchUrl = stack.match(/https?:\/\/[^\n]+/); //报错url和报错位置
        // console.log(matchUrl)
        let urlFirstStack = matchUrl ? matchUrl[0] : '';
        let regUrlCheck = /https?:\/\/(\S)*\.js/;

        let resourceUrl = ''; //报错url
        if (regUrlCheck.test(urlFirstStack)) {
            resourceUrl = urlFirstStack.match(regUrlCheck)[0];
        }

        let stackCol = null; //报错信息列
        let stackRow = null; //报错信息行
        let posStack = urlFirstStack.match(/:(\d+):(\d+)/);
        if (posStack && posStack.length >= 3) {
            [, stackCol, stackRow] = posStack;
        }
        return {
            resourceUrl,
            stackCol,
            stackRow
        }
    };
    let formatError = (errorObj) => {
        // console.log(errorObj)
        let col = errorObj.column || errorObj.columnNumber;
        let row = errorObj.line || errorObj.lineNumber;
        let errorType = errorObj.name;
        let message = errorObj.message;

        let { stack } = errorObj;
        if (stack) {
            // console.log(stack)
            let { resourceUrl, stackCol, stackRow } = formatStack(stack);

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
    };

    var errorCatch = {
        init: (cb) => {
            let _origin_error = window.onerror;
            console.log('errorCatch 开始监听');
            window.onerror = function (message, source, lineno, colno, error) {
                let errorInfo = formatError(error);
                errorInfo._message = message;
                errorInfo._source = source;
                errorInfo._lineno = lineno;
                errorInfo._colno = colno;

                cb(errorInfo);

                errorInfo.type = 'error';
                _origin_error && _origin_error.apply(window, arguments);

            };
            // 针对 vue 报错重写 console.error
            // TODO
            console.error = (function (origin) {
                return function (info) {
                    let stack = info.stack;
                    let { resourceUrl, stackCol, stackRow } = formatStack(stack);
                    console.log(resourceUrl, stackCol, stackRow);
                    origin.call(console, info);
                }
            })(console.error);
        }
    };

    var xhrHook = {
        init: (cb) => {
            let xhr = window.XMLHttpRequest;
            if (xhr._eagle_monitor_flag === true) { //防止多次引用
                return void 0
            }
            xhr._eagle_monitor_flag = true;

            let _originOpen = xhr.prototype.open;
            xhr.prototype.open = function (method, url, async, user, password) {
                this._eagle_xhr_info = {
                    method, url, status: null
                };
                return _originOpen.apply(this, arguments)
            };

            let _originSend = xhr.prototype.send;
            xhr.prototype.send = function (value) { // post的时候value才有值
                let _self = this;
                this._eagle_start_time = Date.now();

                let ajaxEnd = (eventType) => () => {
                    if (_self.response) {
                        let responseSize = null;
                        switch (_self.responseType) {
                            case 'json':
                                // TODO JSON的兼容性问题 && stringify报错
                                responseSize = JSON.stringify(_self.response).length;
                                break;
                            case 'arraybuffer':
                                responseSize = _self.response.byteLength;
                                break;
                            default:
                                responseSize = _self.responseText.length;
                                break;
                        }
                        _self._eagle_xhr_info.event = eventType;
                        _self._eagle_xhr_info.status = _self.status;
                        _self._eagle_xhr_info.success = _self.status === 200;
                        _self._eagle_xhr_info.duration = Date.now() - _self._eagle_start_time;
                        _self._eagle_xhr_info.responseSize = responseSize;
                        // TODO value.length一定有length吗
                        _self._eagle_xhr_info.requestSize = value ? value.length : 0;
                        _self._eagle_xhr_info.type = 'xhr';
                        cb(_self._eagle_xhr_info);
                    }
                };

                // 这三种都代表这请求已经结束了，需要统计一些信息，并上报上去
                this.addEventListener('load', ajaxEnd('load'), false);
                this.addEventListener('error', ajaxEnd('error'), false);
                this.addEventListener('abort', ajaxEnd('abort'), false);

                return _originSend.apply(this, arguments)
            };

            if (window.fetch) {
                let _origin_fetch = window.fetch;
                window.fetch = function () {
                    let startTime = Date.now();
                    let args = [].slice.call(arguments);

                    let fetchInput = args[0];
                    let method = 'GET';
                    let url;

                    if (typeof fetchInput === 'string') {
                        url = fetchInput;
                    } else if ('Request' in window && fetchInput instanceof window.Request) {
                        url = fetchInput.url;
                        if (fetchInput.method) {
                            method = fetchInput.method;
                        }
                    } else {
                        url = '' + fetchInput;
                    }

                    if (args[1] && args[1].method) {
                        method = args[1].method;
                    }

                    // TODO eagle check
                    let fetchData = {
                        method: method,
                        url: url,
                        status: null,
                    };

                    return _origin_fetch.apply(this, args).then(function (response) {
                        fetchData.status = response.status;
                        fetchData.type = 'fetch';
                        fetchData.duration = Date.now() - startTime;
                        cb(fetchData);
                        return response;
                    });
                };
            }
        }
    };

    // import perf from './perf'
    errorCatch.init(errorInfo => {
        console.log('errorInfo', errorInfo);
    });

    xhrHook.init((xhrInfo) => {
        console.log(xhrInfo);
    });

    throw new Error('抛出的错误')

    try {
        console.log('try catch====');
        aaa = 'bbb' + 'ccc';
    } catch (err) {
        // console.log(err)
        throw err
    }

}));
//# sourceMappingURL=bundle.umd.js.map
