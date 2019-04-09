/**
 * Created by liuzhimeng.
 * @date 2018/8/14
 * @description
 */

export function genetateDOMAttr(obj) {
  let str = ''
  for (let k in obj) {
    str += `${k}="${obj[k]}" `
  }
  return str.slice(0, -1)
}
