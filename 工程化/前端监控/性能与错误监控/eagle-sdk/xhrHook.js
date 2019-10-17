export default {
    init: (cb) => {
        let xhr = window.XMLHttpRequest
        if (xhr._eagle_monitor_flag === true) { //防止多次引用
            return void 0
        }
        xhr._eagle_monitor_flag = true;

        let _originOpen = xhr.prototype.open
        xhr.prototype.open = function (method, url, async, user, password) {
            this._eagle_xhr_info = {
                method, url, status: null
            }
            return _originOpen.apply(this, arguments)
        }

        let _originSend = xhr.prototype.send
        xhr.prototype.send = function (value) { // post的时候value才有值
            let _self = this
            this._eagle_start_time = Date.now()

            let ajaxEnd = (eventType) => () => {
                if (_self.response) {
                    debugger
                    let responseSize = null
                    switch (_self.responseType) {
                        case 'json':
                            // TODO JSON的兼容性问题 && stringify报错
                            responseSize = JSON.stringify(_self.response).length
                            break;
                        case 'arraybuffer':
                            responseSize = _self.response.byteLength
                            break;
                        default:
                            responseSize = _self.responseText.length
                            break;
                    }
                    _self._eagle_xhr_info.event = eventType
                    _self._eagle_xhr_info.status = _self.status
                    _self._eagle_xhr_info.success = _self.status === 200
                    _self._eagle_xhr_info.duration = Date.now() - _self._eagle_start_time
                    _self._eagle_xhr_info.responseSize = responseSize
                    // TODO value.length一定有length吗
                    _self._eagle_xhr_info.requestSize = value ? value.length : 0
                    _self._eagle_xhr_info.type = 'xhr'
                    cb(_self._eagle_xhr_info)
                }
            }

            // 这三种都代表这请求已经结束了，需要统计一些信息，并上报上去
            if (this.addEventListener) {
                this.addEventListener('load', ajaxEnd('load'), false);
                this.addEventListener('error', ajaxEnd('error'), false);
                this.addEventListener('abort', ajaxEnd('abort'), false);
            } else {
                let _origin_onreadystatechange = this.onreadystatechange;
                this.onreadystatechange = function (event) {
                    if (_origin_onreadystatechange) {
                        _originOpen.apply(this, arguments);
                    }
                    if (this.readyState === 4) {
                        ajaxEnd('end')();
                    }
                };
            }

            return _originSend.apply(this, arguments)
        }

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
            }
        }
    }
}