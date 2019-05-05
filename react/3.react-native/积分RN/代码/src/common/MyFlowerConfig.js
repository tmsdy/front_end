/**
 * 花儿页配置项
 * Created by xushichao on 2018-12-28.
 */

/**
 * 此处是花园各场景 主题/组件 的配置点
 * return require('../components/MyFlower/EmptyComponent').default;
 * 如果在Components配置下组件不存在, 就渲染 EmptyComponent
 * React.Fragment 不支持直接接受key及children以外的其他props，改为包裹在EmptyComponent内部
 */
import {Width} from '@iqiyi/rn-utils'

import {GARDEN_ENUM, DRAW_ENUM} from '../constants/IntegralEnum';

export default {
  // 初代花
  [GARDEN_ENUM.MODE.Primary]: {
    theme: {
      flower: {
        pot: {type: 'pot', name: 'flower_pot', url: 'json/flower_pot.zip', width: 150, height: 200, statusCode: -2, marginBottom: 0, remote: false}, // 花盆变种子
        seed: {type: 'seed', name: 'flower_seed', url: 'json/flower_seed.zip', width: 150, height: 200, statusCode: 0, marginBottom: 0, remote: false}, // 种子变嫩芽
        grass: {type: 'grass', name: 'flower_baby', url: 'json/flower_baby.zip', width: 150, height: 125, statusCode: 1, marginBottom: 0, remote: false}, // 嫩芽
        small: {type: 'small', name: 'flower_kid', url: 'json/flower_kid.zip', width: 150, height: 165, statusCode: 2, marginBottom: 0, remote: false}, // 成长中
        big: {type: 'big', name: 'flower_young', url: 'json/flower_young.zip', width: 150, height: 190, statusCode: 3, marginBottom: 0, remote: false}, // 成熟了
        vip: {type: 'vip', name: 'flower_adult', url: 'json/flower_adult.zip', width: 150, height: 190, statusCode: 9, marginBottom: 0, remote: false}, // 可以收获了
        faded: {type: 'faded', name: 'dead_flower_v1', url: 'json/dead_flower_v1.zip', width: 120, height: 136, statusCode: -1, marginBottom: 0, remote: false}, // 枯萎
      },
      // 日历皮肤
      calendars: {
        topPic: {pic: 'integral_top_soil', height: 18.5},
        bottomPic: 'flower/integral_bottom_soil',
        gifts: {
          checked: {
            small: 'myflower_checked',
            big: 'myflower_gift_checked',
          },
          unchecked: {
            small: 'myflower_gift_uncheck',
            big: 'myflower_big_gift',
          },
          vip: 'myflower_vip'
        },
        backColor: '#E3B085'
      },
      // 水壶icon图片以及title
      kettle: {
        icon: {name: 'integral_myflower_water_kettle', width: 64, height: 50, top: 10},
        water: {name: 'kettle_water_drop', width: 80, height: 95},
        text: {color: '#F6772A', backColor: '#FFFFFF'},
        // 水壶原始的中心坐标点(x1, y1)
        kettleOriginCenterRight: 48,
        kettleOriginCenterBottom: 142,
        // 外盒的初始旋转角度(以水平线为零点)
        outerRotationBoxOriginDegree: 0,
        // 外盒的目标旋转角度(以水平线为零点)
        outerRotationBoxTargetDegree: 90,
        // 水壶在浇水目标位置时的倾斜角度
        kettleTargetLeanDegree: -50,
        // 内部旋转盒的尺寸(保证能包裹住水壶就行)
        innerRotationBoxSize: 100,
        // 水壶目标位置相对于屏幕中心的横向偏移量
        kettleTargetCenterOffsetX: -80,
        // 水壶动画在多久后开始倾斜(0~1之间的比例值)
        kettleLeanTimeRatio: .25,
      },
      newGuide: {name: 'flower/new_guide_modal', rightOffset: -5},
      navBarTitleColor: '#333333',
      navBarBackType: 'black',
      giftBubbleLottie: {name: 'reward_gift', left: 0, bottom: 0},
      reliveBtn: {bottom: 47},
      speedUpBtn: {bottom: 47 + 42 + 12},
      withdrawCardButton: {bottom: 95 + 60},
      replantSeed: {bottom: 80},
      history: {
        small: {name: 'flower/cash_small', width: 72, height: 68, left: Width / 2 - 155, bottom: 10},
        big: {name: 'flower/cash_big', width: 72, height: 68, left: Width / 2 - 155, bottom: 10}
      },
      backHome: {name: 'goHome', width: 58, height: 85, bottom: 0},
      newGuideTip: ['', '如果浇水间断花儿就会枯萎哦', '连续21天后我会长大', '长大后会送你一个VIP大礼'],
      friendList: {
        backColor: '#DDA473'
      }
    },
    Components: {
      get GardenDecorations() {
        return require('../components/MyFlower/gardenBody/GardenDecorations.primary').default;
      },
      get CollectButton() {
        return require('../components/EmptyComponent').default;
      },
      get WithdrawCardButton() {
        return require('../components/EmptyComponent').default;
      },
      get WithdrawButton() {
        return require('../components/EmptyComponent').default;
      },
      get Pig() {
        return require('../components/EmptyComponent').default;
      },
      get HelpButton() {
        return require('../components/EmptyComponent').default;
      },
    },
  },

  // 金钱花
  [GARDEN_ENUM.MODE.Cash]: {
    theme: {
      flower: {
        pot: {type: 'pot', name: 'cash_pot', url: 'json/cash_pot.zip', width: 150, height: 200, statusCode: -2, marginBottom: 28, remote: false}, // 花盆变种子
        seed: {type: 'seed', name: 'cash_seed', url: 'json/cash_seed.zip', width: 165, height: 183, statusCode: 0, marginBottom: 28, remote: false}, // 种子变嫩芽
        grass: {type: 'grass', name: 'cash_grass', url: 'json/cash_grass.zip', width: 177, height: 190, statusCode: 1, marginBottom: 28, remote: false}, // 嫩芽
        small: {type: 'small', name: 'cash_big', url: 'json/cash_big.zip', width: 222, height: 248, statusCode: 2, marginBottom: 28, remote: false}, // 成长中
        big: {type: 'big', name: 'cash_vip', url: 'json/cash_vip.zip', width: 272, height: 260, statusCode: 3, marginBottom: 28, remote: false}, // 成熟了
        vip: {type: 'vip', name: 'cash_vip', url: 'json/cash_vip.zip', width: 272, height: 260, statusCode: 9, marginBottom: 28, remote: false}, // 可以收获了
        faded: {type: 'faded', name: 'cash_dead', url: 'json/cash_dead.zip', width: 170, height: 193, statusCode: -1, marginBottom: 28, remote: false}, // 枯萎
      },
      // 日历皮肤
      calendars: {
        topPic: {pic: 'integral_flower_canlendar_snow', height: 18.5},
        bottomPic: 'flower/integral_bottom_soil',
        gifts: {
          checked: {
            small: 'integral_redbag_get_v2',
            big: 'integral_redbag_get_v2',
          },
          unchecked: {
            small: 'integral_redbag_unget_v2',
            big: 'integral_redbag_unget_v2',
          },
          vip: 'integral_redbag_unget_v2'
        },
        backColor: '#E3B085'
      },
      // 水壶icon图片以及title
      kettle: {
        icon: {name: 'integral_cash_kettle', width: 58, height: 50, top: 10},
        water: {name: 'cash_water_drop', width: 73.5, height: 80},
        text: {color: '#FFFFFF', backColor: '#9277FF'},
        // 水壶原始的中心坐标点(x1, y1)
        kettleOriginCenterRight: 48,
        kettleOriginCenterBottom: 80,
        // 外盒的初始旋转角度(以水平线为零点)
        outerRotationBoxOriginDegree: 65,
        // 外盒的目标旋转角度(以水平线为零点)
        outerRotationBoxTargetDegree: 90,
        // 水壶在浇水目标位置时的倾斜角度
        kettleTargetLeanDegree: -50,
        // 内部旋转盒的尺寸(保证能包裹住水壶就行)
        innerRotationBoxSize: 100,
        // 水壶目标位置相对于屏幕中心的横向偏移量
        kettleTargetCenterOffsetX: -50,
        // 水壶动画在多久后开始倾斜(0~1之间的比例值)
        kettleLeanTimeRatio: 0,
      },
      newGuide: {name: 'flower/cash_water_guide', rightOffset: 6},
      navBarTitleColor: '#FFFFFF',
      navBarBackType: 'white',
      giftBubbleLottie: {name: 'red_bag', left: Width / 2 + 45, bottom: -35},
      reliveBtn: {bottom: 47},
      speedUpBtn: {bottom: 47 + 42 + 12},
      withdrawCardButton: {bottom: 95 + 60},
      replantSeed: {bottom: 32},
      history: {
        small: {name: 'flower/init_small', width: 37, height: 44, left: Width / 2 - 72, bottom: 36},
        big: {name: 'flower/init_big', width: 37, height: 44, left: Width / 2 - 72, bottom: 36}
      },
      backHome: {name: 'flower/integal_back_cash', width: 45, height: 72, bottom: 40},
      newGuideTip: ['', '如果浇水间断花儿就会枯萎哦', '连续21天后我会长大', '我会给主人带来滚滚财运'],
      friendList: {
        backColor: '#DDA473'
      }
    },
    Components: {
      get GardenDecorations() {
        return require('../components/MyFlower/gardenBody/GardenDecorations.cash').default;
      },
      get CollectButton() {
        return require('../components/EmptyComponent').default;
      },
      get WithdrawCardButton() {
        return require('../components/MyFlower/gardenBody/WithdrawCardButton.cash').default;
      },
      get WithdrawButton() {
        return require('../components/MyFlower/WithdrawButton.cash').default;
      },
      get Pig() {
        return require('../components/MyFlower/gardenBody/Pig').default;
      },
      get HelpButton() {
        return require('../components/EmptyComponent').default;
      },
    },
  },
  // 有才花
  [GARDEN_ENUM.MODE.Talent]: {
    theme: {
      flower: {
        pot: {type: 'pot', name: 'talent_pot', url: 'json/talent/talent_pot.zip', width: 275, height: 275, statusCode: -2, marginBottom: 10, remote: false}, // 花盆变种子
        seed: {type: 'seed', name: 'talent_seed', url: 'json/talent/talent_seed.zip', width: 225, height: 150, statusCode: 0, marginBottom: 0, remote: false}, // 种子变嫩芽
        grass: {type: 'grass', name: 'talent_grass', url: 'json/talent/talent_grass.zip', width: 225, height: 145, statusCode: 1, marginBottom: 0, remote: false}, // 嫩芽
        small: {type: 'small', name: 'talent_big', url: 'json/talent/talent_big.zip', width: 225, height: 190, statusCode: 2, marginBottom: 0, remote: false}, // 成长中
        big: {type: 'big', name: 'talent_big', url: 'json/talent/talent_big.zip', width: 225, height: 190, statusCode: 3, marginBottom: 0, remote: false}, // 成熟了
        vip: {type: 'vip', name: 'talent_vip', url: 'json/talent/talent_vip.zip', width: 225, height: 240, statusCode: 9, marginBottom: 0, remote: false}, // 可以收获了
        faded: {type: 'faded', name: 'talent_dead', url: 'json/talent/talent_dead.zip', width: 225, height: 188, statusCode: -1, marginBottom: 0, remote: false}, // 枯萎
      },
     // 日历皮肤∂
     calendars: {
      topPic: {pic: 'flower/genius_soil', height: 52},
      bottomPic: 'flower/talent_bottom_soil',
      gifts: {
        checked: {
          small: 'myflower_checked',
          big: 'myflower_gift_checked',
        },
        unchecked: {
          small: 'myflower_gift_uncheck',
          big: 'myflower_big_gift',
        },
        vip: 'myflower_vip'
        },
        backColor: '#F2CB93'
      },
      // 水壶icon图片以及title
      kettle: {
        icon: {name: 'integral_myflower_water_kettle', width: 64, height: 50, top: 10},
        water: {name: 'kettle_water_drop', width: 80, height: 95},
        text: {color: '#F6772A', backColor: '#FFFFFF'},
        // 水壶原始的中心坐标点(x1, y1)
        kettleOriginCenterRight: 48,
        kettleOriginCenterBottom: 142,
        // 外盒的初始旋转角度(以水平线为零点)
        outerRotationBoxOriginDegree: 0,
        // 外盒的目标旋转角度(以水平线为零点)
        outerRotationBoxTargetDegree: 90,
        // 水壶在浇水目标位置时的倾斜角度
        kettleTargetLeanDegree: -50,
        // 内部旋转盒的尺寸(保证能包裹住水壶就行)
        innerRotationBoxSize: 100,
        // 水壶目标位置相对于屏幕中心的横向偏移量
        kettleTargetCenterOffsetX: -80,
        // 水壶动画在多久后开始倾斜(0~1之间的比例值)
        kettleLeanTimeRatio: .25,
      },
      newGuide: {name: 'flower/new_guide_modal', rightOffset: 6},
      navBarTitleColor: '#333333',
      navBarBackType: 'black',
      giftBubbleLottie: {name: 'reward_gift', left: 0, bottom: 0},
      reliveBtn: {bottom: 47},
      speedUpBtn: {bottom: 47 + 42 + 12},
      withdrawCardButton: {bottom: 95 + 60},
      replantSeed: {bottom: 32},
      history: {
        small: {name: 'flower/init_small', width: 37, height: 44, left: Width / 2 - 72, bottom: 36},
        big: {name: 'flower/init_big', width: 37, height: 44, left: Width / 2 - 72, bottom: 36}
      },
      backHome: {name: 'goHome', width: 58, height: 85, bottom: 0},
      newGuideTip: ['', '如果浇水间断花儿就会枯萎哦', '连续21天后我会长大', '长大后会送你一个VIP大礼'],
      friendList: {
        backColor: '#EBC388'
      }
    },
    Components: {
      get GardenDecorations() {
        return require('../components/MyFlower/gardenBody/GardenDecorations.talent').default;
      },
      get CollectButton() {
        return require('../components/EmptyComponent').default;
      },
      get WithdrawCardButton() {
        return require('../components/EmptyComponent').default;
      },
      get WithdrawButton() {
        return require('../components/EmptyComponent').default;
      },
      get Pig() {
        return require('../components/EmptyComponent').default;
      },
      get HelpButton() {
        return require('../components/MyFlower/HelpButton.primary').default;
      },
    },
  }
};

export const SHARE_PARAM = {
  // 自己的花死掉分享
  iDead: {
    smallPic: 'flower_dead@3x',
    largePic: 'flower_dead_xcx@3x',
    entityId: '13277662912',
    title: '我的花儿离复活只缺你的点击！帮帮我吧TAT',
    text: '登录奇妙乐园就能送我一袋复活肥！',
  },
  // 好友的花死掉分享
  friendsDead: {
    smallPic: 'flower_dead@3x',
    largePic: 'flower_dead_xcx@3x',
    entityId: '13823009512',
    title: '你的花儿喊你回来救命啦！快点复活它吧',
    text: '多久没给你的花儿浇水了，TA都渴死啦',
  },
  // 送种子分享
  giveSeed: {
    smallPic: 'flower_zhongxi_share@3x',
    largePic: 'flower_zhongzi_xcx@3x',
    entityId: '13271174612',
    title: '送你颗种子，快来奇妙乐园种花吧~',
    text: '你的好友额外送你一袋复活肥呢！登录后自动领取~',
  },
  // 邀请好友助力自己复活（相当于于原初代花自己的花儿死去后分享）
  cashRevive: {
    smallPic: 'flower/flower_cash_invite_friends_to_revive@3x',
    largePic: 'flower/flower_cash_invite_friends_to_revive_mini_program@3x',
    entityId: '13823225612',
    title: '我的花儿离复活，只缺你的点击！',
    text: '登录奇妙乐园就能送我一袋复活肥！',
  },
  // 好友金钱花死掉分享
  cashInviteFriends: {
    smallPic: 'flower/flower_cash_invite_friends_to_revive@3x',
    largePic: 'flower/flower_cash_invite_friends_to_revive_mini_program@3x',
    entityId: '13823009512',
    title: '你的花儿喊你回来救命啦！它还不想死!!!~~',
    text: '你的花儿要渴死了，红包也要跑路啦，快去浇水吧！~',
  },
  // 金钱花养成炫耀
  cashComplete: {
    smallPic: 'flower/flower_cash_grown_share@3x',
    largePic: 'flower/flower_cash_grown_share_mini_program@3x',
    entityId: '13823111512',
    title: '我的金钱花长大了，还给我带来惊人财运~', // 没获取过红包的情况
    text: '兄dei，快来看一看！',
  },
  // 获取提现卡分享
  cashGetWithdraw: {
    smallPic: 'flower/flower_cash_withdraw_card_share@3x',
    largePic: 'flower/flower_cash_withdraw_card_share_mini_program@3x',
    entityId: '13823402412',
    title: '我的红包离提现，只缺你的点击！',
    text: '世上最远的，是红包和提现卡的距离~点击帮我获取提现卡！',
  },
  // 获取金钱花碎片（集宝卡）邀请
  cashSuiPianJiHuo: {
    smallPic: 'flower/flower_cash_collection_activate_share@3x',
    largePic: 'flower/flower_cash_collection_activate_share_mini_program@3x',
    entityId: '13823503412',
    title: '帮我激活金钱花吧，据说养它有惊人运气~',
    text: '春节金钱花，种下它，来年运气福气齐来临~',
  }
}

export const DRAW_CONFIG = {
  [DRAW_ENUM.MODE.Score]: {
    theme: {
      title: {name: 'flower/title-score'},
      button: {
        [DRAW_ENUM.PERIOD.Before]: {name: 'flower/button-start'},
        [DRAW_ENUM.PERIOD.In]: {name: 'flower/button-drawing'},
        [DRAW_ENUM.PERIOD.After]: {name: 'flower/button-get'},
        activate: {name: 'flower/button-get-light'},
      },
    },
  },

  [DRAW_ENUM.MODE.Vip]: {
    theme: {
      title: {name: 'flower/title-vip'},
      button: {
        [DRAW_ENUM.PERIOD.Before]: {name: 'flower/button-start'},
        [DRAW_ENUM.PERIOD.In]: {name: 'flower/button-drawing'},
        [DRAW_ENUM.PERIOD.After]: {name: 'flower/button-activate'},
        activate: {name: 'flower/button-activate-light'},
      },
    },
  },
}

export const IllustrationflowerPic = {
  rose: {
    '-1': 'ill_primary_seed',
    0: 'ill_primary_seed',
    1: 'ill_primary_green',
    2: 'ill_primary_grow',
    3: 'ill_primary_grow',
    9: 'ill_primary_big',
    unget: 'unget_rose'
  },
  money: {
    '-1': 'ill_cash_seed',
    0: 'ill_cash_seed',
    1: 'ill_cash_green',
    2: 'ill_cash_grow',
    3: 'ill_cash_grow',
    9: 'ill_cash_big',
    unget: 'flower/unget_cash'
  },
  genius: {
    '-1': 'flower/ill_talent_seed',
    0: 'flower/ill_talent_seed',
    1: 'flower/ill_talent_green',
    2: 'flower/ill_talent_grow',
    3: 'flower/ill_talent_grow',
    9: 'flower/ill_talent_big',
    unget: 'flower/unget_genius'
  }
}
