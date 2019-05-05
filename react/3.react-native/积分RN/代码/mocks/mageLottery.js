/**
 *
 * @ref 花儿抽奖后领取接口
 * @origin mageLottery
 * Created by liuzhimeng on 2019/03/27.
 */
module.exports = {
  delay: 0, // 延迟(ms)
  pipe: (params, response) => { // 响应返回前的处理管道
    return response;
  },
  response: {
    code: 'A00000',
    message: null,
  },
};
