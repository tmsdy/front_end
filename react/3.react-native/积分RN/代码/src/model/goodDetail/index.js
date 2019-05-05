/**
 * @description: 商品详情页api调用
 */
import {executeTask} from '../../api';

// 记录秒杀资格
export function fetchSecKillRecord(productId) {
  const requestHead = {
    task_code: 'daojuUserSecKillRecord',
    timestamp: Date.now()
  };
  const requestBody = {
    daojuUserSecKillRecord: {
      user_id: global.USER_INFO.userId,
      product_id: productId
    }
  };
  return executeTask(requestHead, requestBody);
}

// 查询秒杀资格
export function fetchCheckSecKillRecord(productId) {
  const requestHead = {
    task_code: 'daojuGetSecKillRecord',
    timestamp: Date.now(),
  };
  const requestBody = {
    daojuGetSecKillRecord: {
      user_id: global.USER_INFO.userId,
      product_id: productId
    }
  };
  return executeTask(requestHead, requestBody);
}
// 查询查询商品氛围信息
export function fetchAtmosphereInfo(productId) {
  const requestHead = {
    task_code: 'daojuProductAtmosphere',
    timestamp: Date.now(),
    product_id: productId
  };
  const requestBody = {
    daojuProductAtmosphere: {
      product_id: productId
    }
  };
  return executeTask(requestHead, requestBody);
}
