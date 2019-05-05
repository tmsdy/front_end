/*
 * @Author: duyanren
 * @LastEditors: duyanren
 * @Description: 商品详情页新增查询商品氛围信息mock接口
 * http://wiki.qiyi.domain/pages/viewpage.action?pageId=145492225#id-%E6%96%B0%E9%81%93%E5%85%B7%E7%B3%BB%E7%BB%9F%E6%8E%A5%E5%8F%A3-26%E3%80%81%E6%9F%A5%E8%AF%A2%E5%95%86%E5%93%81%E6%B0%9B%E5%9B%B4%E4%BF%A1%E6%81%AF%E6%8E%A5%E5%8F%A3%EF%BC%88%E9%9C%80%E8%A6%81%E7%AD%BE%E5%90%8D,%E7%AD%BE%E5%90%8D%E8%A7%84%E5%88%99%E8%A7%81%E9%A1%B5%E9%9D%A2%E9%A1%B6%E9%83%A8%EF%BC%89
 */

module.exports = {
  delay: 0, // 延迟(ms)
  pipe: (params, response) => {
    // 响应返回前的处理管道
    return response;
  },
  response: {
    interval: 65, // 随机数
    data: {
      recentViewCount: 17, // 1分钟内浏览用户总数
      recentExchangeUsers: [
        // 最近20个订单完成的用户列表
        '这是默认的测试昵称1122',
        '这是默认的测试昵称1122',
        '这是默认的测试昵称1122',
        '这是默认的测试昵称1122',
        '这是默认的测试昵称1122',
        '这是默认的测试昵称1122',
        '这是默认的测试昵称1122',
        '这是默认的测试昵称1122',
        '这是默认的测试昵称1122',
        '这是默认的测试昵称1122',
        '默默无闻的乔丹埃希1251508937',
        '默默无闻的乔丹埃希1251508937'
      ]
    },
    code: 'A00000', // 正确状态码
    msg: 'success' // 正确信息
  }
};
