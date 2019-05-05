/*
 * @Author: duyanren
 * @LastEditors: duyanren
 * @Description: 活动卡片资源位
 * @Date: 2019-04-23 14:06:58
 * @LastEditTime: 2019-04-23 14:46:15
 */

module.exports = {
  delay: 0, // 延迟(ms)
  pipe: (params, response) => {
    // 响应返回前的处理管道
    return response;
  },
  response: {
    code: 'A00000',
    message: '成功执行.',
    validateResult: true,
    data: {
      elements_summary: [
        {
          update_time: 1542350068000,
          key_value_pair: [
            {
              name: 'platform',
              value: '1,2,3,4,5,6'
            },
            {
              name: 'announcement',
              value: '新版勋章上线了，更多勋章更多特权等你来体验！'
            },
            {
              name: 'clickEvent',
              value: 'H5'
            },
            {
              name: 'H5',
              value:
                'iqiyi://mobile/register_business/qyclient?pluginParams=%257B%2522biz_params%2522%253A%257B%2522biz_params%2522%253A%2522bizId%253DIntegralRN%2526componentName%253DRNIntegral%2522%252C%2522biz_statistics%2522%253A%2522%2522%252C%2522biz_extend_params%2522%253A%2522%2522%252C%2522biz_sub_id%2522%253A%2522106%2522%252C%2522biz_dynamic_params%2522%253A%2522initParams%253D%25257B%252522pageName%252522%25253A%252522IntegralMedalv2%252522%25257D%2522%257D%252C%2522biz_plugin%2522%253A%2522qiyibase%2522%252C%2522biz_id%2522%253A%2522100%2522%257D'
            }
          ],
          entity_id: -6490125512,
          title: {
            proper_title: 'huati,naodong,huati,baoxiang'
          },
          order: 1
        }
      ],
      id: 616719912
    }
  }
};
