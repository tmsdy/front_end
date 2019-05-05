/**
 *
 * @ref
 * @origin daojuOrderStatusQuery
 */
module.exports = {
  delay: 0, // 延迟(ms)
  pipe: (params, response) => {
    // 响应返回前的处理管道
    return response
  },
  response: {
    interval: 118,
    data: [
      {
        orderCode: '810089513134030195', //订单号
        redeemCodes: 'adsaddfsdfsfsf232', //券码
        type: 5, //商品类型
        subType: 10, //商品子类型
        intro: '', //商品简介
        name: '复活化肥', //商品名称
        num: 1, //订单兑换数量
        orderPrice: 0, //实付价格（单位人民币分）
        orderScore: 1, //实付积分
        productsPrice: 0, //商品现金总价格
        productsScore: 1, //商品积分总价格
        status: 1, //订单状态
        productStatus: 2, //商品使用状态
        rules: '兑换规则兑换规则兑换规则兑换规则兑换规则兑换规则兑换规则兑换规则兑换规则兑换规则兑换规则兑换规则兑换规则兑换规则兑换规则兑换规则兑换规则兑换规则兑换规则兑换规则兑换规则兑换规则兑换规则兑换规则兑换规则兑换规则', //兑换规则
        photoList: [], //图片
        addressInfo: null, //地址
        payTime: 1545123125000, //支付时间
        expiredTime: 1576684799000, //过期时间
        productId: 3022, //商品ID
        addressInfo: {
          name: 'ewq',
          address: 'adsadadada',
          phone: '132332323232'
        }
      }
    ],
    code: 'A00000',
    msg: 'success'
  }
}
