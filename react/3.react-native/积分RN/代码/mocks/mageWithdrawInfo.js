/**
 *
 * @ref 查询提现信息
 * @origin mageWithdrawInfo
 * Created by liuzhimeng on 2019/01/24.
 */
module.exports = {
  delay: 0, // 延迟(ms)
  pipe: (params, response) => { // 响应返回前的处理管道
    return response;
  },
  response: {
    code: 'A00000',
    message: null,
    data: {
      hasWithdrawn: false, // 是否提现
      withdrawnAmount: 88888, // 累计提现金额
      remainAmount: 10000, // 未提现金额
    },
  },
};
