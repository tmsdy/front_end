import {
    accessToken,
    individualAccessToken
} from './config'
import CryptoJS from 'crypto-js'
import UAParser from 'ua-parser-js'

/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
    try {
        store.set(name, content)
    } catch (e) {
        console.log('setStore error!')
    }
}

/**
 * 获取localStorage
 */
export const getStore = name => {
    try {
        return store.get(name)
    } catch (e) {
        console.log('getStore error!')
        return null
    }
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
    try {
        store.remove(name)
    } catch (e) {
        console.log('removeStore error!')
    }
}

/**
 * 清空localStorage
 */
export const clearStore = () => {
    try {
        store.clearAll()
    } catch (e) {
        console.log('clearStore error!')
    }
}

/**
 * 设置sessionstorage
 */
export const setItem = (key, value) => {
    try {
        // sessionstorage.setItem(key,value);
        sessionStorage.setItem(key, value)
    } catch (e) {
        console.log('setItem error!')
    }
}

/**
 * 获取sessionstorage
 */
export const getItem = (key) => {
    try {
        // return sessionstorage.getItem(key);
        return sessionStorage.getItem(key)
    } catch (e) {
        console.log('getItem error!')
    }
}

/**
 * 删除sessionstorage
 */
export const removeItem = (key) => {
    try {
        // sessionstorage.removeItem(key);
        sessionStorage.removeItem(key)
    } catch (e) {
        console.log('removeItem error!')
    }
}

/**
 * 清空sessionstorage
 */
export const clearItem = () => {
    try {
        // sessionstorage.clear();
        sessionStorage.clear()
    } catch (e) {
        console.log('removeItem error!')
    }
}

/**
 * 获取cookie
 */
export const getCookie = name => {
    try {
        return Cookies.get(name)
    } catch (e) {
        console.log('getCookie error!')
        return null
    }
}

/**
 * 设置cookie
 * 默认0.5天过期
 */
export const setCookie = (name, value, option = {}) => {
    try {
        Cookies.set(name, value, option)
    } catch (e) {
        console.log('setCookie error!')
    }
}

/**
 * 删除cookie
 */
export const removeCookie = (name, option = {}) => {
    try {
        Cookies.remove(name, option)
    } catch (e) {
        console.log('removeCookie error!')
    }
}

/**
 * 清空all cookies
 */
export const clearCookie = function() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
    if (keys) {
        for (var i = keys.length; i--;) {
            document.cookie =
                keys[i] + '=0;expires=' + new Date(0).toUTCString()
        }
    }
}

/**
 * 退出清空cookies，清空storege
 */
export const clearCookiesStorege = function() {
    // clearStore()
    clearItem()
    // clearCookie();
}

/**
 * 获取系统Token
 */
export const getToken = () => {
    return {
        [accessToken]: JSON.parse(getItem(accessToken) || '{}').value || '',
        [individualAccessToken]: JSON.parse(getItem(individualAccessToken) || '{}').value || ''
    }
}

/**
 * 判断是否是合法的url
 */
export const checkUrl = str => {
    var RegUrl = new RegExp()
    RegUrl.compile('^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&?/.=]+$')
    if (!RegUrl.test(str)) {
        return false
    }
    return true
}

/**
 * 判断是否是合法的Email
 */
export const checkEmail = str => {
    var re = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
    return !!re.test(str)
}

/**
 * 判断是否合法的手机号码
 */
export const checkPhone = phone => {
    // phone = trim(phone, 'g')
    // var reg = /^(\+?|0?|86?|086?)?1[356789]\d{9}$/
    // return !!reg.test(phone)
    return true // 不让校验
}

/**
 * 判断是否合法的电话，(外贸国外号居多，放松验证))
 */
export const checkTel = tel => {
    // tel = trim(tel, 'g')
    // var reg = /^(\+?)?[\-0-9]*$/
    // return !!reg.test(tel)
    return true // 2019-1-2 按用户要求，不要验证
}

/**
 * 去掉字符串前后所有空格
 */
export const trim = (str, isglobal) => {
    var result
    result = str.replace(/(^\s+)|(\s+$)/g, '')
    if (isglobal && isglobal.toLowerCase() === 'g') {
        result = result.replace(/\s/g, '')
    }
    return result
}

/**
 * 样式转对象
 */
export const styleToObj = (styleStr) => {
    if (!styleStr || styleStr == '') {
        return
    }
    var Arr = styleStr.split(';')
    Arr = Arr.filter(item => {
        return item != ''
    })
    let str = ''
    Arr.forEach(item => {
        let test = ''
        trim(item).split(':').forEach(item2 => {
            test += '"' + trim(item2) + '":'
        })
        str += test + ','
    })
    str = str.replace(/:,/g, ',')
    str = str.substring(0, str.lastIndexOf(','))
    str = '{' + str + '}'
    return JSON.parse(str)
}
/**
 * 全角转半角
 */
export const toSBC = (str) => {
    if (!str) {
        return
    }
    var result = ''
    var len = str.length
    for (var i = 0; i < len; i++) {
        var cCode = str.charCodeAt(i)
        cCode = (cCode >= 0xFF01 && cCode <= 0xFF5E) ? (cCode - 65248) : cCode
        cCode = (cCode == 0x03000) ? 0x0020 : cCode
        result += String.fromCharCode(cCode)
    }
    return result
}

/**
 * 判断class是否存在
 */
export const hasClass = function(ele, cls) {
    cls = cls || ''
    if (cls.replace(/\s/g, '').length === 0) return false // 当cls没有参数时，返回false
    return new RegExp(' ' + cls + ' ').test(' ' + ele.className + ' ')
}

/**
 * 添加class
 */
export const addClass = function(ele, cls) {
    if (!hasClass(ele, cls)) {
        ele.className = ele.className === '' ? cls : ele.className + ' ' + cls
    }
}

/**
 * 移除class
 */
export const removeClass = function(ele, cls) {
    if (hasClass(ele, cls)) {
        var newClass = ' ' + ele.className.replace(/[\t\r\n]/g, '') + ' '
        while (newClass.indexOf(' ' + cls + ' ') >= 0) {
            newClass = newClass.replace(' ' + cls + ' ', ' ')
        }
        ele.className = newClass.replace(/^\s+|\s+$/g, '')
    }
}

/**
 * 过滤html标签，只留文本
 */
export const clearHtml = function(html) {
    return html.replace(/<[^<>]+>/g, '')
}

/**
 * 判断对象是否有属性
 */
export const isEmptyObject = function(e) {
    var t
    for (t in e) return !1
    return !0
}

/**
 * 文件大小 k 转 M
 * 带有单位，可用于展示
 */
export const byteCalc = function(size) {
    if (size > 1048576) {
        return (size / 1048576).toFixed(2) + ' M'
    } else {
        return (size / 1024).toFixed(2) + ' KB'
    }
}

/**
 * js获取文件后缀
 */
export const getSuffix = function(fileName) {
    var fileNameArray = fileName.split('.')
    return fileNameArray[fileNameArray.length - 1]
}

/**
 * 已知flags值 取得标识位修改后的flags(srt为flags,index为第几位,value为改之后标识)例：getNewFlags(3,1,0)
 */
export const getNewFlags = function(str, index, value) {
    var a = '00000000' + str.toString(2)
    a = a.split('')
    a.splice(a.length - index, 1, value)
    return parseInt(a.join(''), 2)
}

/**
 * 二进制取位（如：getByte(2, 1)为数字2的第1位，得到0。位1给手机，位2给邮箱）
 */
export const getByte = function(str, index) {
    var a = '00000000' + str.toString(2)
    return a.substr(a.length - index, 1)
}

/**
 * 输入 用户名/二级域名 检验，首位为字母，长度4位到20位，用户名的话，要加上不能为邮箱
 */
export const checkInitial = function(str) {
    str = trim(str, 'g') // 先去空格
    str = str.substr(0, 1) // 截取首字母
    if (!/^[A-Za-z]+$/.test(str)) {
        return false
    }
    return true
}

/**
 * 输入密码检验，密码长度至少6位，需要含有数字和字母
 */
/**
 * 输入密码检验，密码长度至少6位，需要含有数字和字母
 */
export const checkPWD = function(str) {
    if (str === '' || str === null || str.length < 6) {
        return false
    }
    var reg = /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z]|(~!@#$%^&*-_){6,}$/
    if (!reg.test(str)) {
        return false
    }
    return true
}

/**
 * IP列表，IP加英文逗号，某尾不能有符号
 */
export const checkIpList = function(ips) {
    var reg = new RegExp(
        /^(?:(?:^|,)(?:[*]|[0-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(?:\.(?:[*]|[0-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3})+$/
    )

    if (ips !== '' && !reg.test(ips)) {
        return false
        // 把 ips 按逗号拆成 IP 数组，分别进行验证
        // every 表示每个 ip 验证通过才算通过
        // return ips.split(",")
        // .every(ip => {
        //     // 把每个 IP 拆成几段
        //     const segments = ip.split(".");
        //     // 如果是精确的 4 段而且每段转换成数字都在 1~255 就对了
        //     return segments.length === 4
        //         && segments
        //             .map(segment => parseInt(segment, 10) || 0)
        //             .every(n => n >= 0 && n <= 255);
        // });
    }
    return true
}

/**
 * 动态加载js文件
 */
export const loadScript = (url, callback) => {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    if (typeof callback !== 'undefined') {
        if (script.readyState) {
            script.onreadystatechange = function() {
                if (
                    script.readyState === 'loaded' ||
                    script.readyState === 'complete'
                ) {
                    script.onreadystatechange = null
                    callback()
                }
            }
        } else {
            script.onload = function() {
                callback()
            }
        }
    }
    script.src = url
    document.body.appendChild(script)
}
// loadScript("static/language/zh-cn.js",function(){
//     alert(languagePack.title);
// })

/**
 * 判断是否是对象
 */
export const isObject = (obj, isEffective = false) => {
    if (Object.prototype.toString.call(obj) === '[object Object]') {
        if (isEffective) {
            return !!Object.keys(obj).length
        } else {
            return true
        }
    } else {
        return false
    }
}

/**
 * 判断是否是数组类型，
 * 并且是否是有效数组
 */
export const isArray = (array, isEffective = false) => {
    if (Object.prototype.toString.call(array) === '[object Array]') {
        if (isEffective) {
            return array.length > 0
        } else {
            return true
        }
    } else {
        return false
    }
}

/**
 * 判断是否是字符串类型
 */
export const isString = (str, isEffective = false) => {
    if (Object.prototype.toString.call(str) === '[object String]') {
        if (isEffective) {
            return !!str
        } else {
            return true
        }
    } else {
        return false
    }
}

/**
 * 判断是否是数值类型
 */
export const isNumber = num => {
    if (Object.prototype.toString.call(num) === '[object Number]') {
        return true
    } else {
        return false
    }
}

/**
 * 判断是否是布尔类型
 */
export const isBoolean = boolean => {
    if (Object.prototype.toString.call(boolean) === '[object Boolean]') {
        return true
    } else {
        return false
    }
}

/**
 * 判断是否有效
 */
// export const isEffective = (data) => {
//     if(Object.prototype.toString.call(data) !== "[object Null]" && Object.prototype.toString.call(data) !== "[object Undefined]"){
//         return true;
//     }else{
//         return false;
//     }
// }

/**
 * 去除对象里的空字符串，或空对象
 */
export const isEmpty = function(obj) {
    return typeof obj === 'object' && Object.keys(obj).length === 0
}
export const delEmptyStr = function(content, recurse) {
    for (var i in content) {
        if (content[i] === '') {
            delete content[i]
        } else if (recurse && typeof content[i] === 'object') {
            delEmptyStr(content[i], recurse)
        }
    }
}
export const delEmptyObj = function(content, recurse) {
    for (var i in content) {
        if (isEmpty(content[i])) {
            delete content[i]
        } else if (recurse && typeof content[i] === 'object') {
            delEmptyObj(content[i], recurse)
        }
    }
}
export const delEmptyStrObj = function(content, recurse) {
    delEmptyStr(content, recurse)
    delEmptyObj(content, recurse)
}

/**
 * 检查文件后缀，是否有这个图标，没有的话，给unknow
 * console.log(isHasSuffix('doc'))
 */
export const isHasSuffix = suffix => {
    let suffixArray = ['xls', 'doc', 'docx', 'ppt', 'pptx', 'avi', 'rar', 'mp3', 'mp4', 'zip', 'html', 'pdf', 'eps', 'xlsx']
    suffix = suffix.toLowerCase()
    return suffixArray.indexOf(suffix) === -1 ? 'unknow' : suffix
}

/**
 * 标签背景色
 */
let tagsBgColors = [
    // "#808000",
    // "#f60",
    // "#5c6bc0",
    // "#090",
    // "#f00",
    // "#008cee",
    // "#800080"
    '#FF7165',
    '#5EA3F6',
    '#FFB735',
    '#37CBE3',
    '#8BD867',
    '#9B80F2',
    '#763626',
    '#FD8EC4',
    '#BFBF17',
    '#909399',
    '#D0021B'
]
export const tagsBgColor = colorId => {
    let str = 'color:#fff;background-color:'
    return str + tagsBgColors[colorId - 1]
}
export const tagsBgColorsList = () => {
    return tagsBgColors
}

/**
 * 批注圆点色彩
 */
export const commentsColor = flag => {
    let colors = [
        '#909399',
        '#FF7165',
        '#5EA3F6',
        '#FFB735',
        '#37CBE3',
        '#8BD867',
        '#9B80F2',
        '#763626',
        '#FD8EC4',
        '#BFBF17'

        // "#666",
        // "#f00",
        // "#f60",
        // "#090",
        // "#008cee",
        // "#800080",
        // "#630",
        // "#808000",
        // "#5c6bc0",
        // "#00f",
        // "#30f"
    ]
    return 'color:' + colors[flag - 1]
}

/**
 * 文件和数据一起提交
 */
// 接口数据和文件上传
export const sendDataFile = _option => {
    let {
        data,
        files,
        fileKey,
        method,
        url,
        onprogress,
        onloadstart,
        onload,
        onerror,
        onabort,
        onloadend
    } = Object.assign({
            data: {},
            files: [],
            fileKey: '',
            method: 'post',
            url: '',
            onprogress(event) {},
            onloadstart(event) {},
            onload(res) {},
            onerror(event) {},
            onabort(event) {},
            onloadend(event) {}
        },
        _option
    )
    let fd = new FormData()
    Object.keys(data).forEach(key => {
        fd.append(key, data[key])
    })
    for (let i = 0; i < files.length; i++) {
        fd.append(`${fileKey}${i + 1}`, files[i], files[i].name)
    }
    let xhr = new XMLHttpRequest()
    // 监听状态，实时响应
    // xhr 和 xhr.upload 都有progress事件，xhr.progress是下载进度，xhr.upload.progress是上传进度
    // 这里监听上传进度事件，文件在上次的过程中，会多次触发该事件，返回一个event事件对象
    xhr.upload.onprogress = function(event) {
        if (event.lengthComputable) {
            // 返回一个  长度可计算的属性，文件特别小时，监听不到，返回false
            // 四舍五入
            var percent = Math.round(event.loaded * 100 / event.total) // event.loaded:表示当前已经传输完成的字节数。
            // event.total:当前要传输的一个总的大小.通过传输完成的除以总的，就得到一个传输比率
            event['percent'] = percent
            onprogress(event)
        }
    }

    // 传输开始事件
    xhr.onloadstart = function(event) {
        onloadstart(event)
    }
    // xhr.abort();//调用该方法停止ajax上传，停止当前的网络请求

    // 文件上传成功
    xhr.onload = function(event) {
        try {
            if (typeof event.target.response === 'string') {
                onload(JSON.parse(event.target.response))
            } else {
                onload(event.target.response)
            }
        } catch (e) {
            onload(event.target.response)
        }
    }

    // ajax过程发生错误事件
    xhr.onerror = function(event) {
        onerror(event)
    }

    // ajax被取消，文件上传被取消，说明调用了 xhr.abort();  方法，所触发的事件
    xhr.onabort = function(event) {
        onabort(event)
    }

    // loadend传输结束，不管成功失败都会被触发
    xhr.onloadend = function(event) {
        onloadend(event)
    }

    // 发起ajax请求传送数据
    xhr.open(method, url, true)
    xhr.send(fd) // 发送文件
    return xhr
}

/**
 * 加密
 */
export const encrypt = data => {
    var ciphertext = CryptoJS.AES.encrypt(data, 'laifuyun.com')
    return ciphertext.toString()
}

/**
 * 解密
 */
export const decrypt = data => {
    var bytes = CryptoJS.AES.decrypt(data, 'laifuyun.com')
    var plaintext = bytes.toString(CryptoJS.enc.Utf8)
    return plaintext
}

/**
 * 新加密
 */
export const goodsEncrypt = data => {
    var key = CryptoJS.enc.Utf8.parse('fumasoftsoftfuma')
    var srcs = CryptoJS.enc.Utf8.parse(data)
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.toString().replace(/\+/g, '%2B')
}

/**
 * 新解密
 */
export const goodsDecrypt = data => {
    var key = CryptoJS.enc.Utf8.parse('fumasoftsoftfuma')
    var decrypt = CryptoJS.AES.decrypt(data, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    })
    return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

/**
 * 简体中文，繁体中文，转拼音，转首字母缩写
 * @PinyinHelper挂载全局
 */
export const toPinyin = (data = [], _option = {}) => {
    let option = Object.assign({
            usekey: 'label'
        },
        _option
    )
    let {
        usekey
    } = option
    data.forEach(element => {
        element.alias =
            element[usekey] +
            ',' +
            PinyinHelper.convertToPinyinString(
                element[usekey],
                '',
                PinyinFormat.WITHOUT_TONE
            ) +
            ',' +
            PinyinHelper.convertToPinyinString(
                element[usekey],
                '',
                PinyinFormat.FIRST_LETTER
            )
    })
    return data
}

/**
 * 文件下载
 * @param {*} sUrl
 */
export const downloadFile = function(sUrl) {
    // iOS devices do not support downloading. We have to inform user about this.
    if (/(iP)/g.test(navigator.userAgent)) {
        alert('Your device does not support files downloading. Please try again in desktop browser.')
        return false
    }
    // If in Chrome or Safari - download via virtual link click
    var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1
    var isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1
    if (isChrome || isSafari) {
        // Creating new link node.
        var link = document.createElement('a')
        link.href = sUrl

        if (link.download !== undefined) {
            // Set HTML5 download attribute. This will prevent file from opening if supported.
            link.download = ''
        }

        // Dispatching click event.
        if (document.createEvent) {
            var e = document.createEvent('MouseEvents')
            e.initEvent('click', true, true)
            link.dispatchEvent(e)
            return true
        }
    }
    // Force file download (whether supported by server).
    if (sUrl.indexOf('?') === -1) {
        sUrl += '?download'
    }
    window.open(sUrl, '_self')
    return true
}

// 截取url参数
export const getQueryString = function(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) {
        return unescape(r[2])
    } else {
        return ''
    }
}

// 转义html，转服务端了，这里作废
export const escape2Html = function(html) {
    // let arrEntities = {'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"'}
    // html = html.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t] })

    // if (html.indexOf('style=') == -1) {
    //     html = html.replace(/\n/igm, '<div></div>') // 换行
    //     html = html.replace(/\r/igm, '<div>&nbsp;</div>') // 回车
    // }

    html = html.replace(/\n/g, '<br/>')
    return html
}
/**
 *  判断是否包含中文
 * @param {String} str
 * @returns {Boolean}
 */
export const hasHan = function(str) {
    let reg = /[\u4e00-\u9fa5]/g
    return reg.test(str)
}

/**
 * 延时
 * @param {number} duration
 * @returns {Promise}
 */
export const sleep = function(duration = 0) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, duration)
    })
}
/**
 * 数组移除某项 比 Array.splice高效
 * @param {Array} list
 * @param {Number} index
 */
export const ArraySpliceOne = function(list, index) {
    for (; index + 1 < list.length; index++) {
        list[index] = list[index + 1]
    }
    list.pop()
}

/**
 * 获取浏览器UA信息
 * @param {*} url
 */

export const getUAResult = function() {
    return new UAParser().getResult()
}

/**
 * 判断字符串是否被编码
 */
export const AddressCharacterJudgment = function(url) {
    let isEncode = true
    if (url.match('.*[\\ \"\\<\\>\\{\\}|\\\\^~\\[\\]].*')) {
        isEncode = false
    }
    if (url.match('.*[^\\x00-\\xff].*')) {
        isEncode = false
    }
    try {
        let decodeUrl = URLDecoder.decode(url, 'UTF-8')
        if (decodeUrl == url) {
            isEncode = false
        }
    } catch (error) {
        isEncode = false
    }
    if (isEncode) {
        return url
    }
    return encodeURI(url).replace(/\#/ig, '%23').replace(/\+/ig, '%2B')
}
