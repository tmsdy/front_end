/**
 * NativeBridge 通讯类
 * Created by xushichao on 2017/5/17.
 */
import {DeviceEventEmitter} from 'react-native';
import {EventModule} from '@iqiyi/rn-base-modules';
import {isAndroid} from '@iqiyi/rn-utils'

// 在java语言里安全整型的最大值/最小值
const MAX_SAFE_INTEGER_IN_JAVA = Math.pow(2, 31) - 1;
const MIN_SAFE_INTEGER_IN_JAVA = -Math.pow(2, 31);

// native广播池(相同名称的广播只会在native注册一份, 并在该池中更新其对因的计数值)
let ObserverKeyPool = {};

/**
 * 遍历json, 转换非安全的整型到字符串, 用于安全的将长整型字段传递给android native端
 * 注: 考虑到性能原因, 该过程不做深度递归
 * @param json {JSON} 待转换的json串
 * @returns {JSON} 转换完成的json串
 */
const covertUnsafeIntegerToStringForAndroid = (json) => {
  if(isAndroid && json && typeof json === 'object') {
    Object.entries(json).forEach(([key, val]) => {
      if(Number.isInteger(val) && (val > MAX_SAFE_INTEGER_IN_JAVA || val < MIN_SAFE_INTEGER_IN_JAVA)) {
        json[key] = String(val);
      }
    });
  }
  return json;
};

/* eslint-disable no-console */
const logger = (success, module, action, params, response) => {
  let functionName = (module ? `${module}.` : '') + action;
  console.group(`CallNative: %c ${success ? 'success' : 'fail'} %c${functionName}`, `color:${success ? 'green' : 'red'};`, 'color:purple;');
  console.log('%c params', 'color:#9E9E9E;font-weight:bold;', params);
  console.log('%c response', 'color:#03A9F4;font-weight:bold;', response);
  console.groupEnd();
};
/* eslint-enable no-console */

const callNativeDone = (success, module, action, params, responseData, options) => {
  // QYRequestRejectPool.removeFromRequestRejectPool(`${module || ''}.${action}`, params, options.rejectLevel);
  logger(success, module, action, params, responseData);
};

function callNative({uniqueID, action, params = {}, success, fail, options}) {
  callNativeWithModule({uniqueID, action, params, success, fail, options});
}
/**
 * 与native的通讯
 * @param {String} uniqueID - 模块唯一标识
 * @param {String} module - 模块名称
 * @param {String} action - 功能名称
 * @param {Object} [params] - 参数
 * @param {Function} [success] - 成功回调
 * @param {Function} [fail] - 失败回调
 * @param {Object} [options] - 可选配置项: {rejectLevel: '互斥级别'}
 * @param {Array} [asyncPool] - 异步池, 传入当前组件的异步池, 用于在组件销毁时中断异步请求
 */
function callNativeWithModule({uniqueID, module, action, params = {}, success, fail, options = {}, asyncPool}) {
  if(!uniqueID || typeof uniqueID !== 'string') {
    throw new Error('Could not find valid "uniqueID"');
  }

  // TODO: 临时方案, 暂时兼容老的PGC actions, 后续每个action都自己带上频道名称
  if(module && !/^(SV|IM|Paopao|PP|VP|MDB)/i.test(module)) {
    module = 'PGC' + module;
  }
  //
  // if(QYRequestRejectPool.existsInRequestRejectPool(`${module || ''}.${action}`, params, options.rejectLevel, 1000)) {
  //   return;
  // }

  try {
    let mounted = true;
    let routeParams = {
      action,
      params: {...covertUnsafeIntegerToStringForAndroid(params), from: 'pgc'},
    };
    if(module) {
      routeParams.module = module;
    }
    EventModule.emit(uniqueID, routeParams).then(
      (data) => {
        callNativeDone(true, module, action, params, data, options);
        if(mounted) {
          success && success(data);
        }
      },
      (code) => {
        callNativeDone(false, module, action, params, code, options);
        if(mounted) {
          fail && fail(code);
        }
      }
    );

    if(Array.isArray(asyncPool)) {
      asyncPool.push({
        toString: () => 'NativeBridge',
        abort: () => (mounted = false),
      });
    }
  } catch(e) {
    // console.warn(e);
    setTimeout(() => fail && fail(), 0);
  }
}

/**
 * 监听native事件(目前一个事件只支持一个回调)
 * @param action -- native事件名称
 * @param callback
 */
function addListener(uniqueID, action, callback) {
  if(isAndroid) {
    return DeviceEventEmitter.addListener(action, (params) => {
      if(params && params.uniqueID === uniqueID) {
        delete params.uniqueID;
        callback(params);
      }
    });
  }
  return EventModule.addEventListener(uniqueID, action, (resp) => {
    callback(resp && resp.event && resp.event.param);
  });
}

/*
   * 监听Native广播
   */
function registObserverForKey(uniqueID, key, callback) {
  let poolKey = `${key}_${uniqueID}`;
  if(!ObserverKeyPool[poolKey]) {
    callNativeWithModule({
      uniqueID,
      module: 'Common',
      action: 'registObserver',
      params: {key},
      // options: {rejectLevel: QYEnum.REQUEST_REJECT_LEVEL.Weak},
    });
    ObserverKeyPool[poolKey] = 0; // 初始化
  }
  ObserverKeyPool[poolKey]++;

  let eventSubscription = addListener(uniqueID, `observer_${key}`, callback);
  return {
    remove() { // 移除Native广播监听
      eventSubscription.remove();
      ObserverKeyPool[poolKey]--;
      if(!ObserverKeyPool[poolKey]) {
        callNativeWithModule({
          uniqueID,
          module: 'Common',
          action: 'removeObserver',
          params: {key},
          // options: {rejectLevel: QYEnum.REQUEST_REJECT_LEVEL.None},
        });
      }
    },
  };
}

export default {
  callNativeWithModule,
  addListener,
  registObserverForKey
};
