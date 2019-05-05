/**
 * 领取礼物
 * @ref http://wiki.qiyi.domain/pages/viewpage.action?pageId=226398062
 * @origin mageGift
 * Created by xushichao on 2018/12/19.
 */
const mageStats = require('./mageStats');
let mageStatsData = mageStats.response.data.data.current;
let gift = mageStatsData.gifts.find(gift => gift.days === mageStatsData.waterDays + 1);

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
        ...gift,
        status: 1, // 已领取
      },
    },
  },
};
