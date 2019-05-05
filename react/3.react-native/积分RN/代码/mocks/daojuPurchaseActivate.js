/**
 *
 * @ref
 * @origin daojuPurchaseActivate
 */
module.exports = {
    delay: 0, // 延迟(ms)
    pipe: (params, response) => {
      // 响应返回前的处理管道
      return response
    },
    response: {
      interval: 118,
      code: 'A00000',
      msg: 'success'
    }
  }
  