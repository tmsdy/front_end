/**
 * Created by lzj on 2017/11/15.
 * 一些公用的方法函数
 * */

import {EventModule, QYRNBridge} from '@iqiyi/rn-base-modules';

// 隐藏loading
export function hideLoading() {
  EventModule.emitHideLoading(global.uniqueID)
}

// 展示loading
export function showLoading() {
  EventModule.emitShowLoading(global.uniqueID)
}

// 展示一个轻提示, TODO
export function showToast(msg) {
  try {
    QYRNBridge.showToast(msg)
  } catch(e) {
    console.log(e)
  }
}
