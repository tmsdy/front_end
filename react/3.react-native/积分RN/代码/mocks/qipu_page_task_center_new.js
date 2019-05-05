/**
 *
 * @ref
 * @origin qipu_page_task_center_new
 * Created by liuzhimeng on 2019/04/17.
 */
module.exports = {
  delay: 0, // 延迟(ms)
  pipe: (params, response) => { // 响应返回前的处理管道
    return response;
  },
  response: {
    code: 'A00000',
    message: '成功执行.',
    validateResult: true,
    data: {
      rpc_status_info: {
        rpc_status: 'OK'
      },
      resource_container: [{
        elements_summary: [{
          update_time: 1542350068000,
          key_value_pair: [{
            name: 'platform',
            value: '1,2,3,4,5,6'
          }, {
            name: 'announcement',
            value: '新版勋章上线了，更多勋章更多特权等你来体验！'
          }, {
            name: 'clickEvent',
            value: 'H5'
          }, {
            name: 'H5',
            value: 'iqiyi://mobile/register_business/qyclient?pluginParams=%257B%2522biz_params%2522%253A%257B%2522biz_params%2522%253A%2522bizId%253DIntegralRN%2526componentName%253DRNIntegral%2522%252C%2522biz_statistics%2522%253A%2522%2522%252C%2522biz_extend_params%2522%253A%2522%2522%252C%2522biz_sub_id%2522%253A%2522106%2522%252C%2522biz_dynamic_params%2522%253A%2522initParams%253D%25257B%252522pageName%252522%25253A%252522IntegralMedalv2%252522%25257D%2522%257D%252C%2522biz_plugin%2522%253A%2522qiyibase%2522%252C%2522biz_id%2522%253A%2522100%2522%257D'
          }],
          entity_id: -6490125512,
          title: {
            proper_title: '勋章改版公告'
          },
          order: 1
        }],
        id: 616719912
      }, {
        elements_summary: [{
          update_time: 1552915491000,
          key_value_pair: [{
            name: 'platform',
            value: '1,2,3,4,5,6'
          }, {
            name: 'clickEvent',
            value: 'IntegralPark'
          }, {
            name: 'tips',
            value: 'new'
          }],
          entity_id: -16253374512,
          title: {
            proper_title: '乐园'
          },
          thumbnail_url: 'http://pic3.iqiyipic.com/common/lego/20180717/cf817a35aafb49dbad8c84cd8027d265.png',
          order: 1
        }, {
          update_time: 1555296714000,
          entity_url: 'http://statics-web.iqiyi.com/common/lottery/lottery_index.html?lotteryCode=freetest&ext=true&hideshare=0&from=homepage',
          key_value_pair: [{
            name: 'platform',
            value: '1,2,3,4,5,6'
          }, {
            name: 'clickEvent',
            value: ''
          }, {
            name: 'tips',
            value: ''
          }],
          entity_id: -16253429812,
          title: {
            proper_title: '抽奖'
          },
          thumbnail_url: 'http://m.iqiyipic.com/common/lego/20190102/53a9819f592b4176bbeafe26adf95bb8.png',
          order: 2
        }, {
          update_time: 1553154316000,
          entity_url: 'iqiyi://mobile/register_business/qyclient?pluginParams=%257B%2522biz_params%2522%253A%257B%2522biz_params%2522%253A%2522url%253Dhttp%25253A%25252F%25252Fcards.iqiyi.com%25252Fviews_category%25252F3.0%25252Fcategory_home%25253Fpage_st%25253D1%252526card_v%25253D3.0%2526cid%253D1%2522%252C%2522biz_statistics%2522%253A%2522%2522%252C%2522biz_extend_params%2522%253A%2522%2522%252C%2522biz_sub_id%2522%253A%2522101%2522%252C%2522biz_dynamic_params%2522%253A%2522%2522%257D%252C%2522biz_plugin%2522%253A%2522qiyibase%2522%252C%2522biz_id%2522%253A%2522100%2522%257D',
          key_value_pair: [{
            name: 'platform',
            value: '1,2,3,4,5,6'
          }, {
            name: 'clickEvent',
            value: ''
          }, {
            name: 'tips',
            value: ''
          }],
          entity_id: -16554170912,
          title: {
            proper_title: '注册制测试'
          },
          order: 3
        }, {
          update_time: 1553154383000,
          key_value_pair: [{
            name: 'platform',
            value: '1,2,3,4,5,6'
          }, {
            name: 'clickEvent',
            value: 'MiddlePage'
          }, {
            name: 'tips',
            value: ''
          }],
          entity_id: -16554208212,
          title: {
            proper_title: '积分App内部页面'
          },
          order: 5
        }, {
          update_time: 1553154336000,
          entity_url: 'https://baidu.com',
          key_value_pair: [{
            name: 'platform',
            value: '1,2,3,4,5,6'
          }, {
            name: 'clickEvent',
            value: ''
          }, {
            name: 'tips',
            value: ''
          }],
          entity_id: -16554191112,
          title: {
            proper_title: 'H5测试'
          },
          order: 4
        }, {
          update_time: 1554796904000,
          key_value_pair: [{
            name: 'platform',
            value: '1,2,3,4,5,6'
          }, {
            name: 'clickEvent',
            value: 'PunchPage'
          }, {
            name: 'tips',
            value: ''
          }],
          entity_id: -17283592112,
          title: {
            proper_title: '打卡'
          },
          thumbnail_url: 'http://m.iqiyipic.com/common/lego/20190102/53a9819f592b4176bbeafe26adf95bb8.png',
          order: 6
        }],
        id: 16253294612
      }, {
        id: 3001184112
      }, {
        elements_summary: [{
          update_time: 1548927601000,
          key_value_pair: [{
            name: 'platform',
            value: '1,2,3,4,5,6'
          }, {
            name: 'defImg_webp',
            value: 'http://m.iqiyipic.com/common/lego/20181219/e100c8eddae348f482e70cd3dbb6f576.webp'
          }, {
            name: 'key',
            value: ''
          }, {
            name: 'URL',
            value: 'iqiyi://mobile/register_business/qyclient?pluginParams=%257B%2522biz_params%2522%253A%257B%2522biz_params%2522%253A%2522bizId%253DIntegralRN%2526componentName%253DRNIntegral%2522%252C%2522biz_statistics%2522%253A%2522%2522%252C%2522biz_extend_params%2522%253A%2522%2522%252C%2522biz_sub_id%2522%253A%2522106%2522%252C%2522biz_dynamic_params%2522%253A%2522initParams%253D%25257B%252522pageName%252522%25253A%252522Welfare%252522%25257D%2522%257D%252C%2522biz_plugin%2522%253A%2522qiyibase%2522%252C%2522biz_id%2522%253A%2522100%2522%257D'
          }, {
            name: 'text',
            value: ''
          }, {
            name: 'beizhu',
            value: ''
          }, {
            name: 'platforms',
            value: 'android,ios'
          }],
          entity_id: -13005616712,
          thumbnail_url: 'http://m.iqiyipic.com/common/lego/20181219/e100c8eddae348f482e70cd3dbb6f576.png',
          order: 1
        }],
        id: 13005260712
      }]
    }
  },
};
