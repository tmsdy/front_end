/* 生成组件随机id */
export const generateComponentId = (component, length) => {
  const prefix = component ? component : ''
  const originalStr = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'

  if(!length) {
    length = originalStr.length
  }
  let date = Date.now()
  const uuid = originalStr.replace(/[xy]/g, c => {
    const r = (date + Math.random() * 16) % 16 | 0
    date = Math.floor(date / 16)
    return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16)
  })

  return `${prefix}${uuid.slice(0, length)}`
}

function _formatTime(time, split = '') {
  const t = time < 10 ? `0${time}` : time
  return `${t}${split}`
}

/**
 * 时间&时间戳相互转换工具
 * @param type {String} 要转换的类型 timestamp：转换成时间戳；datetime：转换成时间日期
 * @param value {String or Number} 时间日期 or 时间戳
 * @param split {String} 日期分隔符
 * @param oppositeTime {Boolean} 48小时内显示相对时间
 * @returns {*}
 */
export function transferTimeTo(type, value, split = '-') {
  if(type === 'timestamp') {
    return new Date(value).getTime()
  }
  if(type === 'datetime') {
    const date = new Date(value);
    const yy = date.getFullYear() + split;
    const mm = _formatTime(date.getMonth() + 1, split);
    const dd = _formatTime(date.getDate(), ' ');
    const hh = _formatTime(date.getHours(), ':');
    const mmi = _formatTime(date.getMinutes(), ':');
    const ss = _formatTime(date.getSeconds());
    return yy + mm + dd + hh + mmi + ss
  }
  return null
}

export function splitTime(datetime = '', split = '-') {
  const _dt = datetime.split(' ')
  if(_dt.length === 2) {
    const [year, month, day] = _dt[0].split(split)
    const [hour, minute, second] = _dt[1].split(':')
    const fixMonth = month.slice(0, 1) === '0' ? month.slice(1) : month
    const fixDay = day.slice(0, 1) === '0' ? day.slice(1) : day
    return [year, fixMonth, fixDay, hour, minute, second]
  }
  return []
}

/**
 * 格式化为相对时间
 * @param targetTime {number} 目标时间
 * @param split {string} 分隔符
 * @returns {string} 相对时间
 */
export function formatRelativeTime(targetTime, split = '-') {
  const nowTime = Date.now()
  const formatTime = transferTimeTo('datetime', targetTime, split)
  const [,,, hour, minute] = splitTime(formatTime, split)
  // 开始时间所在当天的00:00:00时间
  const dayStart = new Date(targetTime).setHours(0, 0, 0, 0)
  const oneDay = 24 * 3600 * 1000

  // 当前时间早于目标零点时间一天 或 当前时间超过目标时间
  if(nowTime < dayStart - oneDay || nowTime >= targetTime) {
    return formatTime.slice(5, -3)
  }
  // 当前时间早于目标零点时间，表示明天
  if(nowTime >= dayStart - oneDay && nowTime < dayStart) {
    return `明天 ${hour}:${minute}`
  }
  // 当前时间晚于目标零点时间，表示已经处于【今天】
  if(nowTime >= dayStart) {
    return `今天 ${hour}:${minute}`
  }
}
