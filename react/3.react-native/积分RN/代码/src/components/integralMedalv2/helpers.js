/**
 * Created by liuzhimeng.
 * @date 2018/11/13
 * @description
 */

import {
  getAsyncStorage,
  saveAsyncStorage,
} from '../../common/util'

export const getAsyncStoragePromise = (key) =>
  new Promise((resolve, reject) => {
    getAsyncStorage([key], (err, result) => {
      if (err) {
        return reject(err)
      }
      return resolve({result: result[0][1]})
    })
  })

export const saveAsyncStoragePromise = (key, value) => saveAsyncStorage([[key, value]])
