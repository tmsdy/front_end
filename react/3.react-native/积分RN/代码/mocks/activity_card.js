/*
 * @Author: duyanren
 * @LastEditors: duyanren
 * @Description: 首页活动卡片轮播数据
 * @Date: 2019-04-20 16:41:39
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
      huati: [
        {
          reward_valid_time: 1556553600000,
          draw_mode: 'MANUAL',
          code: 'tpc_012401',
          reward_type: 'SPLIT',
          vertical_code: 'iQIYI',
          end_time: 1556553600000,
          limit_number: 100,
          user_vote_number: 0,
          view_complete_votes: false,
          total_reward: 4310,
          start_time: 1554714066000,
          user_reward_given: false,
          price: 5,
          draw_time: 1556553600000,
          name: 'test',
          options: [
            {
              vote_number: 39,
              title: 't',
              option_code: '1',
              content: 'sada',
              picture: 'http://pic3.iqiyipic.com/common/20190131/ruleEngine1548901840.jpg'
            },
            {
              vote_number: 23,
              title: 't2',
              option_code: '2',
              content: 'dsda'
            }
          ],
          exts: [],
          order: 99,
          type_code: 'point'
        },
        {
          reward_valid_time: 1556553600000,
          draw_mode: 'MANUAL',
          code: 'asdasda',
          reward_type: 'SPLIT',
          vertical_code: 'iQIYI',
          end_time: 1556553600000,
          limit_number: 100,
          user_vote_number: 0,
          view_complete_votes: false,
          total_reward: 4020,
          start_time: 1554714066000,
          user_reward_given: false,
          price: 5,
          draw_time: 1556553600000,
          name: 'test',
          options: [
            {
              vote_number: 4,
              title: '1',
              option_code: '1',
              content: '1',
              picture: 'http://pic3.iqiyipic.com/common/20190123/ruleEngine1548225793.png'
            }
          ],
          exts: [],
          order: 99,
          type_code: 'point'
        },
        {
          reward_valid_time: 1556553600000,
          draw_mode: 'MANUAL',
          code: 'tpc_010802',
          reward_type: 'SPLIT',
          vertical_code: 'iQIYI',
          end_time: 1556553600000,
          limit_number: 100,
          user_vote_number: 0,
          view_complete_votes: false,
          total_reward: 4050,
          start_time: 1554714066000,
          user_reward_given: false,
          price: 5,
          draw_time: 1556553600000,
          name: '复古风毛衣',
          options: [
            {
              vote_number: 10,
              title: 'x1',
              option_code: '1',
              content: 'sda',
              picture: 'http://static-s.iqiyi.com/ext/common/ruleEngine1548901892.jpeg'
            }
          ],
          exts: [],
          order: 99,
          type_code: 'point'
        }
      ],
      baoxiang: {
        template: 'SUDOKU_9',
        free_lottery_tips: '',
        user_free_lottery_times: 0,
        user_boosted_times: 2,
        thumbnail: '',
        code: 'freetest',
        total_times_type: 'NONE',
        vertical_code: 'iQIYI',
        end_time: '2029-03-29 10:46:16',
        description:'1.消耗X积分一次<br>\n2.奖品数量有限<br>\n3.最终解释权归XX所有<br>\n奖品介绍<br>\n1.门票，共100张<br>\n2.2积分，共500份<br>\n3.XXXXX，共7000份\n',
        free_times: 1,
        type: 1,
        publicity_image: '',
        start_time: '2019-03-29 10:46:12',
        line_code: 'point',
        free_times_type: 'DAY',
        price: 1,
        name: '积分抽大奖',
        not_wins: [
          {
            image: 'http://pic0.iqiyipic.com/common/20190403/ruleEngine1554256834.png',
            location: 7,
            tips: '还差一点点'
          }
        ],
        partner_code: 'QxAmLwi2HuQCaI17',
        banner_image: '',
        exts: [
          {
            name: 'myawards',
            value:
              'iqiyi://mobile/register_business/qyclient?pluginParams=%257B%2522biz_params%2522%253A%257B%2522biz_params%2522%253A%2522bizId%253DIntegralRN%2526componentName%253DRNTemplate%2522%252C%2522biz_statistics%2522%253A%2522%2522%252C%2522biz_extend_params%2522%253A%2522%2522%252C%2522biz_sub_id%2522%253A%2522106%2522%252C%2522biz_dynamic_params%2522%253A%2522initParams%253D%25257B%252522pageName%252522%25253A%252522MyGain%252522%25257D%2522%257D%252C%2522biz_plugin%2522%253A%2522qiyibase%2522%252C%2522biz_id%2522%253A%2522100%2522%257D'
          },
          {
            name: 'qipao',
            value:'产品优化说, 333333'
          }
        ],
        rewards: [
          {
            item_id: 3054,
            remain: 0,
            name: '商品券-爱奇艺商城直发',
            description: '商品券-爱奇艺商城直发',
            type: 'DAOJU',
            exts: [],
            photos: [
              {
                // url: '',
                key: 'smallpic'
              }
            ]
          },
          {
            item_id: 2779,
            remain: 376,
            name: '碳酸饮料330ML*7瓶券',
            description: '原价20元，券后0元付邮即享！\n夏天跟碳酸饮料更配哦~',
            type: 'DAOJU',
            exts: [],
            photos: [
              {
                url: 'http://m.iqiyipic.com/common/lego/20181107/2f50c642ba2e4cf0a216befada35f6b6.png',
                key: 'smallpic'
              }
            ]
          },
          {
            item_id: 2777,
            remain: 707,
            name: 'BeatsX蓝牙耳机50元券',
            description: '原价688元，券后价638元！\n纯正音质，伴你左右，听多了耳朵会怀孕哟~',
            type: 'DAOJU',
            exts: [],
            photos: [
              {
                url: 'http://m.iqiyipic.com/common/lego/20181107/2f50c642ba2e4cf0a216befada35f6b6.png',
                key: 'smallpic'
              }
            ]
          },
          {
            item_id: 2776,
            remain: 9926,
            name: 'i71定制茶饼30元券',
            description: '原价59元，券后29元！\n醇香普洱，从源头精选原料！',
            type: 'DAOJU',
            exts: [],
            photos: [
              {
                url: 'http://m.iqiyipic.com/common/lego/20181107/2f50c642ba2e4cf0a216befada35f6b6.png',
                key: 'movepic'
              }
            ]
          },
          {
            item_id: 2773,
            remain: 0,
            name: '沃力仕男士腕表20元券',
            description: '原价54元，券后34元！\n尊贵气质，非凡品味，经典男士石英表！',
            type: 'DAOJU',
            exts: [],
            photos: [
              {
                url: 'http://pic2.iqiyipic.com/common/lego/20180705/47b760e0b86c4da48cfed348d13a3b6b.jpg',
                key: 'largepic'
              },
              {
                url: 'http://pic1.iqiyipic.com/common/lego/20180705/457556b4ec204e5a89c48c018859d679.jpg',
                key: 'smallpic'
              }
            ]
          },
          {
            item_id: 2772,
            remain: 0,
            name: '米菲焖烧罐20元券',
            description: '原价77元，券后价57元！\n私人移动小厨房～晚上闷一闷，早上就能吃！',
            type: 'DAOJU',
            exts: [],
            photos: [
              {
                url: 'http://pic3.iqiyipic.com/common/lego/20180705/90f7572316c84474be0239380d94664b.jpg',
                key: 'largepic'
              },
              {
                url: 'http://pic3.iqiyipic.com/common/lego/20180705/d30dc0928a6943d5a05928bc7232c84c.jpg',
                key: 'smallpic'
              }
            ]
          },
          {
            item_id: 2771,
            remain: 0,
            name: '纳米补水仪20元券',
            description: '原价41.9元，券后价21.9元！\n时尚小巧，随身携带，随时补水！',
            type: 'DAOJU',
            exts: [],
            photos: [
              {
                url: 'http://pic3.iqiyipic.com/common/lego/20180705/aa9f7df52eef4a70a2be8d2ad122adb1.jpg',
                key: 'largepic'
              },
              {
                url: 'http://pic3.iqiyipic.com/common/lego/20180705/07f0ba526ea94890bc07939024b5c380.jpg',
                key: 'smallpic'
              }
            ]
          }
        ],
        status: 1
      },
      naodong: [
        {
          utime: 1555503222154,
          ip: '0.0.0.0',
          hasMore: false,
          verticalCode: 'iQIYI',
          content: '喜欢你个头',
          typeCode: 'point',
          wxaCode: 'http://www.iqiyipic.com/common/fix/wxa_code_5548230483301401.jpg',
          answerList: [],
          uid: 10000,
          answerCount: 0,
          ctime: 1555482304841,
          hasAnswered: false,
          id: 5548230483301401,
          status: 0,
          order: 1
        },
        {
          utime: 1555470717816,
          ip: '0.0.0.0',
          hasMore: false,
          description: '我是运营发的一个问题',
          pic: 'http://www.iqiyipic.com/common/fix/1555421288.png',
          verticalCode: 'iQIYI',
          content: '我是运营发的一个问题',
          typeCode: 'point',
          wxaCode: 'http://www.iqiyipic.com/common/fix/wxa_code_5542129035000601.jpg',
          answerList: [
            {
              uid: 990604403,
              isLike: 0,
              uname: '用户3b0b6c73',
              utime: 1555481501977,
              ctime: 1555421374480,
              avatar: 'http://www.iqiyipic.com/common/fix/headicons/male-130.png',
              id: 5542137439600200,
              qid: 5542129035000601,
              content: '我是一个答案',
              likeTotal: 1,
              status: 0
            }
          ],
          uid: 10000,
          answerCount: 1,
          ctime: 1555421290358,
          hasAnswered: false,
          id: 5542129035000601,
          group: '分组001',
          status: 0,
          order: 1
        },
        {
          utime: 1555470717756,
          ip: '0.0.0.0',
          hasMore: false,
          description: '审核消息发的对不',
          verticalCode: 'iQIYI',
          content: '审核消息发的对不',
          typeCode: 'point',
          wxaCode: 'http://www.iqiyipic.com/common/fix/wxa_code_5542264829300901.jpg',
          answerList: [],
          uid: 10000,
          answerCount: 0,
          ctime: 1555422648301,
          hasAnswered: false,
          id: 5542264829300901,
          group: '分组001',
          status: 0,
          order: 1
        }
      ],
      order: 'huati,baoxiang,naodong'
    }
  }
};
