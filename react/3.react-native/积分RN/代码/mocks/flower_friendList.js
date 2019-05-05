/**
 * http://wiki.qiyi.domain/pages/viewpage.action?pageId=161068034#id-%E8%A7%84%E5%88%99%E5%BC%95%E6%93%8E%E6%96%B0%E6%8E%A5%E5%8F%A3WIKI-10.2%E8%8E%B7%E5%8F%96%E5%A5%BD%E5%8F%8B%E4%BF%A1%E6%81%AF%E5%88%97%E8%A1%A8/openApi/flower/friendList
 * @ref 花园页好友列表
 * @origin openApi/flower/friendList
 * Created by xushichao on 2018/12/21.
 */
const STATUS_CODES = [1, 2, 3, 9, -1];

module.exports = {
  delay: 0, // 延迟(ms)
  pipe: (params, response) => { // 响应返回前的处理管道
    return response;
  },
  response: {
    "code": "A00000",
    "message": "成功执行.",
    "data": {
      "code": "A00000",
        "total": 0,
        "size": 0,
        "offset": 0,
        "contents":  Array.from({length: 8}).map((_, i) => ({
          "verticalCode": "iQIYI",        //垂线编码
          "typeCode": "point",            //积分线编码
          "userId": 100 + i,                  //用户uid
          "statusCode": STATUS_CODES[i % STATUS_CODES.length],   //状态码: 0=种子, 1=发芽, 2=成长中, 3=成熟了, 9=可以收获了, -1=死掉了
          "wateredToday": i % 2 ? true : false,           //是否浇过花
          "appeared": i % 3 ? false : true,               //蜜蜂是否出现
          "avatar": '',
          "nickname": `好友${i + 1}`,
          "new": i % 5 ? false : true,
          "channelCode": i % 5 ? 'rose' : 'money'
        })),
    }
  },
};
