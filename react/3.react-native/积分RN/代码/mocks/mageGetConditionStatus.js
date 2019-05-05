/**
 * Created by liuzhimeng.
 * @date 2019-01-04
 * @ref http://wiki.qiyi.domain/pages/viewpage.action?pageId=226398062
 * @origin mageGetConditionStatus
 * @description 养花收集碎片数据
 */

module.exports = {
  delay: 0, // 延迟(ms)
  pipe: (params, response) => { // 响应返回前的处理管道
    return response;
  },
  response: {
    code: 'A00000',
    data: {
      code: 'A0000',
      message: null,
      data: {
        'complete': 2, // 已集成碎片数量
        'total': 3, // 碎片总数
        'show': true, // 是否展示碎片集成动效
        'channel': 'preMoneyFlower', // 碎片任务编码
      },
    },
  },
};
