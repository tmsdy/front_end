/**
 *
 * @ref
 * @origin daojuUserOrders
 * Created by linnyli on 2018/12/20.
 */
module.exports = {
  delay: 0, // 延迟(ms)
  pipe: (params, response) => {
    // 响应返回前的处理管道
    return response
  },
  response: {
    msg: 'success',
    code: 'A00000',
    data: {
      data: {
        total: 4,
        size: 4,
        offset: 0,
        contents: [
          //订单列表
          {
            orderCode: '810089513134030195',
            partnerCode: 'wOg49j214Y3PuIME',
            name: '复活化肥',
            type: 8,
            subType: 18,
            status: 1,
            productStatus: 1,
            photoList: [
              {
                photoKey: 'movepic',
                url:
                  'http://pic1.iqiyipic.com/common/20181120/daoju1542711333.png'
              }
            ],
            payTime: 1545123125000,
            expiredTime: 1547629665014,
            productId: 3022
          },
          {
            orderCode: '810088980916698471',
            partnerCode: 'wOg49j214Y3PuIMEa',
            name: '复活化肥',
            type: 8,
            subType: 18,
            status: 1,
            productStatus: 1,
            photoList: [
              {
                photoKey: 'movepic',
                url:
                  'http://pic1.iqiyipic.com/common/20181120/daoju1542711333.png'
              }
            ],
            payTime: 1545122110000,
            expiredTime: 1547629665014,
            productId: 3022
          },
          {
            orderCode: 'dx3906_test_121800',
            partnerCode: 'wOg49j214Y3PuIME',
            name: '复活化肥',
            type: 8,
            subType: 18,
            status: 1,
            productStatus: 1,
            photoList: [
              {
                photoKey: 'movepic',
                url:
                  'http://pic1.iqiyipic.com/common/20181120/daoju1542711333.png'
              }
            ],
            payTime: 1545123460000,
            expiredTime: 1547455976062,
            productId: 3022
          },
          {
            orderCode: '810089522245107496',
            partnerCode: 'wOg49j214Y3PuIME',
            name: '复活化肥',
            type: 8,
            subType: 18,
            status: 1,
            productStatus: 1,
            photoList: [],
            payTime: 1545123142000,
            expiredTime: 1547455976062,
            productId: 3022
          }
        ],
        partnerSwitchInfo: {
          //渠道信息Map，key为partnerCode，value为渠道信息
          wOg49j214Y3PuIME: {
            nickname: 'zzz', //简称
            switchAddress: 'this is switch address!' //跳转地址
          },
          wOg49j214Y3PuIMEa: {
            nickname: '', //简称
            switchAddress: 'this is switch address!' //跳转地址
          }
        },
        productSource: {
          //商品来源Map，key为productID，value为来源链接
          '3022':
            'iqiyi://mobile/register_business/qyclient?pluginParams=%257B%2522biz_params%2522%253A%257B%2522biz_params%2522%253A%2522%2522%252C%2522biz_statistics%2522%253A%2522block%253Djifenlibao%2522%252C%2522biz_extend_params%2522%253A%2522%2522%252C%2522biz_sub_id%2522%253A%25222%2522%252C%2522biz_dynamic_params%2522%253A%2522roomId%253D0%2526anchorId%253D0%2526showGiftPanel%253D999%2522%257D%252C%2522biz_plugin%2522%253A%2522com.iqiyi.ishow%2522%252C%2522biz_id%2522%253A%25222%2522%257D'
        }
      },
      interval: 94
    }
  }
}
