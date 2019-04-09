/**
 * Created by liuzhimeng.
 * @date 2019-03-04
 * @description
 */

// 从缓存获取当前环境
export function GET_ENV() {
  return process.env.NODE_ENV // development || test || production
}

export function isDev() {
  return process.env.NODE_ENV === 'development'
}

export function isTest() {
  return process.env.NODE_ENV === 'test'
}

export function isPro() {
  return process.env.NODE_ENV === 'production'
}

export const INTEGRAL_HOST = {
  development: 'http://h5-test.m.iqiyi.com',
  test: 'http://h5-test.m.iqiyi.com',
  production: 'https://h5.m.iqiyi.com',
}
