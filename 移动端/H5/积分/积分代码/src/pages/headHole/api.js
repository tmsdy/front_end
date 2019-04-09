/**
 * Created by hanfei.
 * @date 2019/3/11
 * @description
 */

import {isIos} from 'Common/utils';
import {
  paramsGenerator,
  signPostGenerator,
  responseGenerator
} from 'Common/request';

// 公用参数
const getReqParamsByKeys = paramsGenerator({
  verticalCode: 'iQIYI',
  typeCode: 'point',
  agenttype: isIos() ? 20 : 21,
  srcplatform: isIos() ? 20 : 21,
  appKey: 'basic_h5',
  agentversion: '9.9.5',
  appver: '9.9.5'
});
const getResponse = responseGenerator({
  A00001: '请登录后查看',
  A00101: '请登录后查看',
  A00401: '请登录后查看'
});

export const signPost = signPostGenerator(getReqParamsByKeys, getResponse);

const apis = {
  excute: 'task/execute'
};
// 执行任务
export const executeAJAX = (data = {}, params = {}, keys, extra) => signPost(apis.excute, data, params, keys, extra);

export const getMoreAnswers = (data = {}, params = {}) => {
  // 更多答案列表
  const _data = {
    sphinx_answer_list: {
      qid: data.qid,
      uid: data.uid
    },
    ...data
  };
  const _params = {
    task_code: 'sphinx_answer_list',
    timestamp: Date.now(),
    appKey: 'basic_h5',
    ...params
  };

  return executeAJAX(_data, _params);
};
