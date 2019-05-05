/**
 * 通用工具集
 * Created by xushichao on 2017/7/19.
 */
let Util = {
  formatTime(timestamp) {
    return ~~(timestamp / 1000 / 60) + '分' + ~~(timestamp / 1000 % 60) + '秒';
  },

  formatDate(date, formatStr) {
    let format = datePart => match => (`0${datePart}`).substr(-1 * (match.length > 1 ? match.length : String(datePart).length)),
      weekMap = ['日', '一', '二', '三', '四', '五', '六'];
    date = isNaN(date) ? date : new Date(date); // 兼容时间戳
    return formatStr.replace(/(YY){1,2}/, format(date.getFullYear()))
      .replace(/M{1,2}/, format(date.getMonth() + 1))
      .replace(/D{1,2}/, format(date.getDate()))
      .replace(/h{1,2}/, format(date.getHours()))
      .replace(/m{1,2}/, format(date.getMinutes()))
      .replace(/s{1,2}/, format(date.getSeconds()))
      .replace(/W/, weekMap[date.getDay()]); // 周
  },
};

module.exports = {Util};
