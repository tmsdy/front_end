import io from 'socket.io-client'
import { socketUrl, accessToken } from './config'
import { getToken, getStore, setStore } from './utils'

let weatherStr = new Date() * 1 + ''
let socket
window.MXsocket = () => {
    window.createSocketTime = new Date() * 1 // 创建Socket时间
    setStore('createSocketTime', window.createSocketTime)
    // socket连接逻辑
    socket = io(socketUrl, {
        reconnectionDelay: 50000
    })
    /**
     * 1 :连接中
     * 2 ：连接成功
     * 3 ：连接失败
     */
    // 正在连接
    socket.on('connecting', () => {
        console.log('socket正在连接')
        ep.emit('socketStatusChange', 1)
    })
    // 连接成功
    socket.on('connect', () => {
        console.log('socket连接成功 socket.id: ' + socket.id)
        ep.emit('socketStatusChange', 2)
        // 去登录
        var jsonObject = {
            messageType: 'L01', // 登录
            accessToken: getToken()[accessToken],
            sourceId: 'pc',
            body: '消息主体'
        }
        socket.emit('loginEvent', JSON.stringify(jsonObject))
        console.log('连接成功，触发登录')
    })

    // 监听socket登录成功事件。登录成功后在处理业务逻辑
    socket.on('loginSuccess', () => {
        console.log('socket登录成功')
    })
    // 弹出效果
    socket.on('weather', data => {
        // 去重
        if (JSON.stringify(data) != weatherStr) {
            weatherStr = JSON.stringify(data)
            console.log('weather')
            ep.emit('weather', data)
        }
    })
    // 消息推送
    socket.on('messageStats', data => {
        // console.log("messageStats", data);
        ep.emit('messageStats', data)
    })

    // 邮件事件
    socket.on('mailEvent', data => {
        ep.emit('mailEvent', data)
    })

    // 踢掉
    socket.on('offsiteLogin', data => {
        console.log('被踢掉:offsiteLogin')
        closeMXsocketLoginEnterprise()
    })

    // let number = 0
    // 断开
    socket.on('disconnect', reason => {
        console.log('socket断开', reason)
        if (reason === 'io server disconnect') { // 服务端断开，Token过期
            console.log(getStore('createSocketTime'))

            /* if (getStore('createSocketTime') !== window.createSocketTime) {
                console.log('被踢掉')
                closeMXsocketLoginEnterprise()
            } else {
                setTimeout(() => {
                    number++
                    if (number < 2) {
                        console.log('最后创建的页面不被踢掉退出')
                        socket.connect()
                    } else {
                        closeMXsocketLoginEnterprise()
                    }
                }, 5000)
            } */
            socket.connect()
        } else if (reason === 'io client disconnect') { // 客户端端断开
            socket.disconnect()
            socket.close()
        } else {
            socket.connect()
        }
    })

    // 重新连接到服务器
    socket.on('reconnect', attemptNumber => {
        ep.emit('socketStatusChange', 2)
        console.log(`socket重新连接到服务器 ,尝试重连次数:${attemptNumber}`)
    })
    // 重新连接中
    socket.on('reconnecting', () => {
        ep.emit('socketStatusChange', 1)
        console.log('socket重新连接中')
    })
    // 重新连接错误
    socket.on('reconnect_error', error => {
        console.log('socket重新连接错误,请稍后重试', error)
        ep.emit('socketStatusChange', 3)
        socket.disconnect()
        socket.close()
    })
    // 重新连接失败
    socket.on('reconnect_failed', () => {
        console.log('socket重新连接失败,请稍后重试')
        ep.emit('socketStatusChange', 3)
        socket.disconnect()
        socket.close()
    })
    // 连接错误
    socket.on('connect_error', error => {
        console.log('socket连接错误', error)
        ep.emit('socketStatusChange', 3)
        socket.disconnect()
        socket.close()
    })
    // 连接超时
    socket.on('connect_timeout', timeout => {
        console.log('socket连接超时', timeout)
        ep.emit('socketStatusChange', 3)
        socket.disconnect()
        socket.close()
    })
    // 连接出错
    socket.on('error', error => {
        console.log('连接出错', error)
        ep.emit('socketStatusChange', 3)
        socket.disconnect()
        socket.close()
    })
}
// MXsocket()
// 断开连接
window.closeMXsocket = () => {
    socket.disconnect()
    socket.close()
}
// 断开连接并退出
window.closeMXsocketLoginEnterprise = () => {
    closeMXsocket()
    ep.emit('loginEnterprise')
}
ep.tail('handleSocketConnect', () => {
    console.log('触发手动连接')
    socket.connect()
})
// online网络连接事件
window.addEventListener('online', () => {
    console.log('网络连接已建立')
    socket.connect()
})

// offline网络连接事件
window.addEventListener('offline', () => {
    console.log('网络连接已断开')
})
