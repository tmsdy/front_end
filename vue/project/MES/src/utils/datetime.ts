import Moment from 'moment'

export function isAAfterB(a: string, b: string): boolean {
  let millisecondA: number = 0
  let millisecondB: number = 0
  try {
    millisecondA = new Date(a).getTime()
  } catch (e) {
    Error(a + ' is not a valid time format string')
  }
  try {
    millisecondB = new Date(b).getTime()
  } catch (e) {
    Error(b + ' is not a valid time format string')
  }

  return millisecondA > millisecondB
}

/**
 * 判断时间是否过期
 * @param time 待比较的时间字符串
 * @return boolean
 */
export function isExpired(time: string): boolean {
  let millisecondA: number = 0
  try {
    millisecondA = new Date(time).getTime()
  } catch (e) {
    Error(time + ' is not a valid time format string')
  }

  return millisecondA < new Date().getTime()
}

/**
 * 判断传入时间是否为今天
 * @param dateTime Date
 * return boolean
 */
export function isToday(dateTime: Date): boolean {
  return dateTime.toDateString() === new Date().toDateString()
}

/**
 * Convert other format of date to moment object
 * @param datetime
 * return Moment
 */
export function toMoment(
  datetime: Date | string | number | undefined,
): Moment.Moment {
  let dateObj: Moment.Moment = Moment()
  switch (Object.prototype.toString.call(datetime)) {
    case '[object Date]':
      dateObj = Moment(datetime as Date)
      break
    case '[object String]':
      switch ((datetime as string).length) {
        case 8:
          dateObj = Moment(datetime as string, 'YYYYMMDD')
          break
        case 14:
          dateObj = Moment(datetime as string, 'YYYYMMDDHHmmss')
          break
        default:
      }
      break
    case '[object Number]':
      dateObj = toMoment((datetime as number).toString())
      break
    default:
  }
  return dateObj
}

/**
 * format time to chinese readable string
 * @param dateTime Date
 * return string
 */
export function getDateString(datetime: Date | string | undefined): string {
  const momentObj = toMoment(datetime)

  if (isToday(new Date(momentObj.valueOf()))) {
    return '今日'
  }
  if (momentObj.year() === Moment().year()) {
    return momentObj.format('M月D日')
  }
  return momentObj.format('YYYY年M月D日')
}

/**
 * Get readable date string. e.g. 20180927
 * @param date
 * @param format
 */
export function getReadableTime(date: Date, format = 'YYYYMMDD') {
  return Moment(date).format(format)
}
