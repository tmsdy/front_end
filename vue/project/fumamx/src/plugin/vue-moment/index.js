import Vue from 'vue'
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'

Vue.use(VueMoment, {
    moment
})
Vue.moment.locale(window.LOCALE || 'zh-cn')
// console.log(Vue.moment().locale())

// 在原生js上添加把 - 转换成 / 的方法
window.String.prototype.toSlash = function() {
    return this.replace(new RegExp(/-/gm), '/')
}

// 统一正8区时间,提交到后台
Vue.prototype.$m_unifiedTime = (time) => {
    if (time === '' || time === null || time === undefined || time === 'undefined') {
        return ''
    } else {
        return Vue.moment(time).utc().utcOffset(+8).format('YYYY-MM-DD HH:mm:ss')
    }
}

function ToLocal(date, deviation = 0) {
    date = date.replace(new RegExp(/-/gm), '/')
    let YMD = date.split(' ')[0].split('/')
    let Hms = date.split(' ')[1].split(':')
    let Y = parseInt(YMD[0])
    let M = parseInt(YMD[1])
    let D = parseInt(YMD[2])
    let H = parseInt(Hms[0])
    let m = parseInt(Hms[1])
    let s = parseInt(Hms[2])
    let T = parseInt(new Date().toString().split('GMT')[1].split(' ')[0]) / 100 + (parseInt(deviation))
    let h = H + T
    // 处理小时
    if (h >= 24) {
        D = D + 1 // 向前添加一天
        H = h - 24 // 更正小时
        // 处理日
        if ([1, 3, 5, 7, 8, 10, 12].indexOf(M)) { // 31天
            if (D > 31) {
                M = M + 1 // 月份加1
                D = D - 31 // 更正天数
            }
        } else if ([4, 6, 9, 11].indexOf(M)) { // 30天
            if (D > 30) {
                M = M + 1 // 月份加1
                D = D - 30 // 更正天数
            }
        } else if ([2].indexOf(M) != -1) { // 29/28天
            // 闰年/平年 求2月天数
            if (((Y % 4 == 0) && (Y % 100 != 0)) || (Y % 400 == 0)) {
                if (D > 29) {
                    M = M + 1 // 月份加1
                    D = D - 29 // 更正天数
                }
            } else {
                if (D > 28) {
                    M = M + 1 // 月份加1
                    D = D - 28 // 更正天数
                }
            }
        }
        // 处理月
        if (M > 12) {
            Y = Y + 1
            M = M - 12
        }
    } else if (h < 24 && h >= 0) {
        H = h
    } else if (h < 0) {
        D = D - 1 // 向后添加一天0
        H = 24 + h // 更正小时
        if (D === 0) { // 回到上个月的最后一天
            M = M - 1
            if (M === 0) { // 回到上一年
                Y = Y - 1
                M = 12
            }
            // 根据年份，月份决定天
            if ([1, 3, 5, 7, 8, 10, 12].indexOf(M) != -1) {
                D = 31
            } else if ([4, 6, 9, 11].indexOf(M) != -1) {
                D = 30
            } else if ([2].indexOf(M) != -1) {
                if (((Y % 4 == 0) && (Y % 100 != 0)) || (Y % 400 == 0)) {
                    D = 29
                } else {
                    D = 28
                }
            }
        }
    }

    let t = new Date(Y + '/' + M + '/' + D + ' ' + H + ':' + m + ':' + s)
    return t
}
// let xdtime = ToLocal('2018/7/9 18:55:33', -8)
// console.log(xdtime)
// console.log(Vue.moment(xdtime).utc().format('YYYY/MM/DD HH:mm:ss'))
// console.log(Vue.moment(xdtime).utc().utcOffset(8).format('YYYY/MM/DD HH:mm:ss'))
function utcToLocal(date) {
    return ToLocal(date, 0)
}
// 把utc时间转换成相对本地的相对时间
Vue.prototype.$utcToLocal = utcToLocal

function beijingToLocal(date) {
    return ToLocal(date, -8)
}
// console.log(beijingToLocal('2018-07-20 18:47:00'))
//  + (-8) 把北京时间转换成相对本地的相对时间
Vue.prototype.$beijingToLocal = beijingToLocal

// 把服务器下发的北京时间，变成相对本地时间的日期对象
Vue.prototype.$m_utcOffset = (date, option = {}) => {
    date = beijingToLocal(date)
    let { timezone } = Object.assign({
        timezone: '+8'
    }, option)
    return Vue.moment(date).utc().utcOffset(parseInt(timezone))
}

// 制定时间
function $m_formulateTime(time, option = {}) {
    if (!time) {
        return ''
    }
    time = beijingToLocal(time)
    let {
        just,
        minuteFront,
        yesterday,
        daybefore,
        monthFront,
        yearFront,
        format
    } = Object.assign({
        just: '刚刚',
        minuteFront: '分钟前',
        yesterday: '昨天',
        daybefore: '天前',
        monthFront: '个月前',
        yearFront: '年前',
        format: 'YYYY/MM/DD HH:mm:ss'
    }, option)
    time = new Date(Vue.moment(time).format('YYYY/MM/DD HH:mm:ss')) * 1
    let date = new Date() * 1

    // 计算当前月有多少天
    // 1.获取年份
    let Y = parseInt(Vue.moment(date).format('YYYY'))
    let M = parseInt(Vue.moment(date).format('MM'))
    let d = 31
    if ([1, 3, 5, 7, 8, 10, 12].indexOf(M)) {
        d = 31
    } else if ([4, 6, 9, 11].indexOf(M)) {
        d = 30
    } else if ([2].indexOf(M)) {
        if (((Y % 4 == 0) && (Y % 100 != 0)) || (Y % 400 == 0)) {
            d = 29
        } else {
            d = 28
        }
    }
    // 一分钟以内  t > 当前时间（毫秒） -  60000
    if (time > date - 60000 && time <= date) {
        return just
        // 一小时以内
    } else if (time > date - 3600000 && time <= date) {
        return parseInt((date - time) / 60000) + minuteFront
        // 今天
    } else if (Vue.moment(time).format('YYYY/MM/DD') === Vue.moment(date).format('YYYY/MM/DD')) {
        return Vue.moment(time).format('HH:mm')
        // 昨天
    } else if (Vue.moment(time).format('YYYY/MM/DD') === Vue.moment(date + 3600 * 1000 * 24 * -1).format('YYYY/MM/DD')) {
        return yesterday + Vue.moment(time).format('HH:mm')
        // 一个月之内
    } else if (time > date - d * 86400000 && time <= date) {
        return parseInt((date - time) / 86400000) + ' ' + daybefore
        // 一年之内
    } else if (time > date - 31536000000 && time <= date) {
        // 年份相同
        if (parseInt(Vue.moment(time).format('YY')) === parseInt(Vue.moment(date).format('YY'))) {
            return parseInt(Vue.moment(date).format('MM')) - parseInt(Vue.moment(time).format('MM')) + ' ' + monthFront
            // 年份不同
        } else if (parseInt(Vue.moment(time).format('YY')) < parseInt(Vue.moment(date).format('YY'))) {
            return 12 - parseInt(Vue.moment(time).format('MM')) + parseInt(Vue.moment(date).format('MM')) + ' ' + monthFront
        }
        // 一年以外
    } else if (time < date - 31536000000) {
        return parseInt((date - time) / 31536000000) + ' ' + yearFront
    } else {
        return Vue.moment(time).format(format)
    }
}
// console.log(moment('2018-07-20 18:47:00').format('YY-MM-DD'))
// console.log($m_formulateTime('2018-07-20 18:47:00'.toSlash()))
Vue.prototype.$m_formulateTime = $m_formulateTime
