/**
 *
 * @ref
 * @origin mageHistory
 * Created by linnyli on 2019/01/08.
 */
module.exports = {
  delay: 0, // 延迟(ms)
  pipe: (params, response) => { // 响应返回前的处理管道
    return response;
  },
  response: {
    'code': 'A00000',
    'data': {
      'message': null,
      'code': 'A0000',
      'data': [
        {
          'channelCode': 'rose',// 花儿channelCode
          'completes': 1,// 总计养成次数
          'bees': 1,// 最近一次养成捕获的蜜蜂
          'earnings': [ // 收益统计
            {
              'type': 0,  // 收益类型: 0=积分, 1=金币
              'score': 20, // 收益值
            },
            {
              'type': 1,
              'score': 0,
            },
          ],
          'latestTime': 1546938257349,  // 最近一次养成时间
        },
        {
          'channelCode': 'money',
          'completes': 1,
          'bees': 0,
          'earnings': [
            {
              'type': 0,
              'score': 0,
            },
            {
              'type': 1,
              'score': 0,
            },
          ],
          'latestTime': 1546950429143,
        },
      ],
    },
  },
};
