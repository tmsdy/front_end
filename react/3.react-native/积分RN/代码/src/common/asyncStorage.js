/**
 * Created by liuzhimeng.
 * @date 2018-12-15
 * @description
 */
import {getAsyncStorage, saveAsyncStorage} from './util'

export const getAsyncStoragePromise = (key) => {
  return new Promise((resolve, reject) => {
    getAsyncStorage([key], (err, result) => {
      if(err) {
        return reject(err)
      }
      return resolve(JSON.parse(result[0][1]))
    })
  })
}

export const saveAsyncStoragePromise = (key, value) => saveAsyncStorage([[key, JSON.stringify(value)]])
