// 1.算时间差
let Moment = require('moment')
let t1 = Moment('2019-03-27 14:36:36');
let t2 = Moment('2019-04-02 14:33:33');

// console.log(Moment)
console.log(parseTime(t2.diff(t1)))
function T(timestamp) {
    var mistiming = Math.round(new Date() / 1000) - timestamp;
    var arrr = ['年', '个月', '星期', '天', '小时', '分钟', '秒'];
    var arrn = [31536000, 2592000, 604800, 86400, 3600, 60, 1];
    for (var i = 6; i >= 0; i--) {
        var inm = Math.floor(mistiming / arrn[i]);
        if (inm != 0) {
            return inm + arrr[i] + '前';
        }
    }
}
