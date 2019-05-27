/*
 * Discription: mx socket连接
 * -----
 * Created Date: 2019-05-23 07:02:44
 * Author: 郭兵 (guobing93@163.com)
 * -----
 * Last Modified: 2019-05-25 10:04:18
 * Modified By: name (email)
 */

import io from 'socket.io-client'
import {
    socketUrl,
    accessToken as accessTokenKey
} from './config'
import { getToken } from './utils'

/* const field */
const SERVER_DISCONNECT = 'io server disconnect'
const CLIENT_DISCONNECT = 'io client disconnect'
const MAX_CONNECT_COUNT = 10

/* connect status  enum */
const socketStatus = (function(status) {
    status[status['notconnect'] = 0] = 'notconnect'
    status[status['connecting'] = 1] = 'connecting'
    // status[status['reconnecting'] = 2] = 'reconnecting'
    status[status['success'] = 2] = 'success'
    status[status['failed'] = -1] = 'failed'
    return status
}({}))

/* singleton  socket object */
const MXsocket = (function() {
    function _MXsocket () {
        this.connectCount = 0 // 定时重连的次数
        this._listeners = {}
        this.socket = null
        this.isClosed = false
        this.connectTimer = null
        this._initOberverStatus()
    }

    _MXsocket.prototype._initOberverStatus = function() {
        let value = socketStatus.notconnect
        Object.defineProperty(_MXsocket.prototype, 'status', {
            get: () => value,
            set: (newVal) => {
                if (newVal !== value) {
                    value = newVal

                    if (value === socketStatus.success) {
                        this.connectCount = 0
                    }
                    this._dispatch('statusChange', value)
                }
            },
            enumerable: true,
            configurable: true
        })
    }

    _MXsocket.prototype.getStatus = function() {
        return this.status
    }

    _MXsocket.prototype.connect = function() {
        this.isClosed = false

        this.socket = io(socketUrl, {
            reconnectionDelay: 50000
        })
        this._ListenerSocket()
    }

    /* 外部重连 */
    _MXsocket.prototype.reconnect = function() {
        if (this.isClosed) { return }
        this.connectCount = 0
        this._reconnect(this.status, true)
    }
    /**
     * @param  status  socketStatus
     */
    _MXsocket.prototype._reconnect = function(status, isManually = false) {
        if (this.isClosed) { return }

        if (this.connectCount > MAX_CONNECT_COUNT) {
            this.status = status
            return
        }

        this.status = socketStatus.connecting

        this.connectCount++

        let duration = isManually
            ? 0
            : (5 + this.connectCount * 2) * 1000

        if (this.connectTimer) {
            clearTimeout(this.connectTimer)
        }

        this.connectTimer = setTimeout(() => {
            this.socket.connect()
        }, duration)
    }

    _MXsocket.prototype.on = function(type, fn, ctx = this) {
        if (!this._listeners[type]) {
            this._listeners[type] = []
        }
        this._listeners[type].push([fn, ctx])
    }

    _MXsocket.prototype.close = function() {
        this.isClosed = true
        this.status = socketStatus.notconnect
        if (this.connectTimer) {
            clearTimeout(this.connectTimer)
        }
        this.socket.close()
    }

    _MXsocket.prototype._dispatch = function(type) {
        let events = this._listeners[type]

        if (!events) { return }
        let len = events.length
        let copyEvents = [...events]
        for (let index = 0; index < len; index++) {
            const event = copyEvents[index]
            let [fn, ctx] = event
            if (fn) {
                fn.apply(ctx, [].slice.call(arguments, 1))
            }
        }
    }

    _MXsocket.prototype._login = function() {
        const jsonObject = {
            messageType: 'L01',
            accessToken: getToken()[accessTokenKey],
            sourceId: 'pc',
            body: '消息主体'
        }
        this.socket.emit('loginEvent', JSON.stringify(jsonObject))
    }

    _MXsocket.prototype._ListenerSocket = function() {
        // 连接中
        this.socket.on('connecting', () => {
            this.status = socketStatus.connecting
        })

        // 连接成功
        this.socket.on('connect', () => {
            this.status = socketStatus.success
            this._login()
        })

        // 连接错误
        this.socket.on('connect_error', (err) => {
            this._reconnect(socketStatus.failed)
        })

        // 连接超时
        this.socket.on('connect_timeout', () => {
            this._reconnect(socketStatus.failed)
        })
        /*  =============== custom event ================  */
        this.socket.on('loginSuccess', () => {
            console.log('socket登录成功')
        })

        // 弹出效果
        this.socket.on('weather', data => {
            let thisWeather = JSON.stringify(data)
            if (thisWeather != this._prevWeather) {
                this._prevWeather = thisWeather
                this._dispatch('weather', data)
            }
        })
        // 消息推送
        this.socket.on('messageStats', data => {
            this._dispatch('messageStats', data)
        })

        // 邮件事件
        this.socket.on('mailEvent', data => {
            this._dispatch('mailEvent', data)
        })
        // 踢掉
        this.socket.on('offsiteLogin', data => {
            console.log('被踢掉:offsiteLogin')
            this.status = socketStatus.notconnect
            this.close()
            // 退出登陆
            this._dispatch('offsiteLogin')
        })
        /*  =============== custom event end ================  */

        // 重连中
        this.socket.on('reconnecting', () => {
            this.status = socketStatus.connecting
        })

        // 重连成功
        this.socket.on('reconnect', () => {
            this.status = socketStatus.success
        })

        // 重连出错
        this.socket.on('reconnect_error', () => {
            this._reconnect(socketStatus.failed)
        })

        // 重连失败
        this.socket.on('reconnect_failed', () => {
            this._reconnect(socketStatus.failed)
        })

        // 断开
        this.socket.on('disconnect', reason => {
            if (reason === CLIENT_DISCONNECT) {
                this.socket.close()
                return
            }
            if (reason === SERVER_DISCONNECT) {
                this._reconnect(socketStatus.failed)
                return
            }
            this._reconnect(socketStatus.failed)
        })

        // 连接错误
        this.socket.on('error', (err) => {
            this._reconnect(socketStatus.failed)
        })
    }
    return new _MXsocket()
}())

export {
    socketStatus,
    MXsocket
}
