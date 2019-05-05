/*
 * @Author: duyanren
 * @LastEditors: duyanren
 * @Description: 宝箱相关的接口数据逻辑处理
 * @Date: 2019-04-21 15:24:14
 * @LastEditTime: 2019-04-26 20:43:51
 */
import {AwardInfo, DrawBoxData, RewardItem} from '../../typings/apis/homePage';
import {formatQipuDataElementsSummary} from '../../common/util';

/**
 * @description: 抽奖走马灯氛围信息数据处理
 * 1.「用户昵称」已抽到「商品名称」（用户昵称=爱奇艺用户昵称，商品名称=后端给到的对应商品名称）
 * 2.「用户昵称1」帮「用户昵称2」翻了一倍（（用户昵称1=微信用户昵称，用户昵称2=用户在爱奇艺的昵称，均由后端返回给前段）
 * 3.备注：用户昵称最多占5个字符，其中前3位为昵称，后2位为"***"，昵称不足5个字则全部展示；举例 花生酱**已抽到……；商品名称完整展示
 * @param {list} array
 * @return: {array} array
 */
export function handleAwardsList(list: AwardInfo[]) {
  const MAX_LENGTH = 5; // 用户昵称最多5个字符
  return list.map(v => {
    let value = '';
    let newHelperWeChatNickName = '';
    let newUserName = '';
    const {helperWeChatNickName = '', username = ''} = v;
    const WeChatNickNameExceedMaxLength = helperWeChatNickName && helperWeChatNickName.length >= MAX_LENGTH;
    const usernameExceedMaxLength = username && username.length >= MAX_LENGTH;
    if(WeChatNickNameExceedMaxLength) {
      newHelperWeChatNickName = v.helperWeChatNickName.substring(0, 3).concat('**');
    } else {
      newHelperWeChatNickName = v.helperWeChatNickName || '';
    }
    if(usernameExceedMaxLength) {
      newUserName = v.username.substring(0, 3).concat('**');
    } else {
      newUserName = v.username || '';
    }
    if(v.infoType === 'BOOST') {
      // 助力
      value = `${newHelperWeChatNickName}帮${newUserName}翻了一倍`;
    }
    if(v.infoType === 'LOTTERY') {
      // 抽奖
      value = `${newUserName}已抽到【${v.product}】`;
    }
    return {value};
  });
}

// 奖品列表数据处理 最多展示3个奖品
function getRewards(rewards) {
  interface PhotosItem {
    key: string;
    url: string;
  }
  let newRewards: RewardItem[] = [];
  // 默认奖品图片
  const defalutPic = {
    key: 'smallpic',
    url: 'treasurebox/default-reward'
  };
  // rewards不存在
  if(!(rewards && rewards.length)) {
    newRewards.push({rewardPic: defalutPic.url});
  }
  if(rewards && rewards.length) {
    newRewards = rewards.filter(Boolean)
      .map(v => {
        if(v) {
          const name = v.name || '';
          const smallPicObj: PhotosItem = v.photos && v.photos.find(l => l.key === 'smallpic') || {};
          return {
            rewardName: name.substring(0, 5),
            rewardPic: smallPicObj.url || defalutPic.url,
            rewardId: v.item_id || 0
          };
        }
      })
      .slice(0, 3);
  }
  return newRewards;
}
/**
 * @description: 宝箱抽取按钮文案
 * 1.未登录展示「X积分开箱」
 * 2.用户当前是否有免费抽奖次数，如果有，文案显示为：「每日首开免费」；没有免费次数则显示为「X积分开箱」
 * 3.用户是否有翻倍概率，如果有开箱按钮增加翻倍标志：文案「大奖概率*X」（X根据当前用户被助力的次数计算）；如果没有则不加翻倍标志
 * @param {price} price: number
 * @param {userFreeLotteryTimes} userFreeLotteryTimes: number
 * @return: string
 */
function getDrawBoxBtnText(price, userFreeLotteryTimes) {
  const btnTextMap = {
    0: `${price}积分开箱`, // 未登录|已登录 && 有免费机会|已登录 && 无免费机会| 已获得翻倍
    1: '免费开箱' // 已登录 && 有免费机会
  };
  if(userFreeLotteryTimes) return btnTextMap[1];
  return btnTextMap[0];
}
/**
 * @description: 引导分享区 提示文案
 *1.用户未登录：「登录分享，翻倍大奖概率！」； 分享按钮文案【去翻倍】
 *2.已登录-用户当前被助力次数等于0：「拉好友助力，大奖概率翻倍！」；分享按钮文案【去翻倍】
 *3.已登录-用户当前被助力次数小于5：「倍率每天6点清零」； 分享按钮文案【去翻倍】
 *4.已登录-用户当前被助力次数等于5：「倍率每天6点清零」； 分享按钮文案【去分享】
 * @return: string
 */
function getHintText(userBoostedTimes = 0) {
  const boostHintTextMap = {
    0: {
      boostHintText: '登录分享，翻倍大奖概率！',
      shareBtnText: '去翻倍'
    }, // 未登录
    1: {
      boostHintText: '拉好友助力，大奖概率翻倍！',
      shareBtnText: '去翻倍'
    }, // 已登录-用户当前被助力次数等于0
    2: {
      boostHintText: '倍率每天6点清零',
      shareBtnText: '去翻倍'
    }, // 已登录-用户当前被助力次数小于5
    3: {
      boostHintText: '倍率每天6点清零',
      shareBtnText: '去分享'
    } // 已登录-用户当前被助力次数等于5
  };
  if(!global.USER_INFO.isLogin) {
    return boostHintTextMap[0];
  }
  if(userBoostedTimes === 0) {
    return boostHintTextMap[1];
  }
  if(userBoostedTimes < 5) {
    return boostHintTextMap[2];
  }
  if(userBoostedTimes === 5) {
    return boostHintTextMap[3];
  }
}
// 点击宝箱时气泡文案
function getBubbleText(exts) {
  const qipao = exts.find(v => {
    return v.name === 'qipao' || v.key === 'qipao';
  });
  const bubbles = qipao && qipao.value && qipao.value.split(/,|，/);
  return bubbles;
}
/**
 * 对宝箱返回的数据进行处理，只返回组件需要用到的字段
 * @description: 默认展示大奖信息（大奖只有一个）：大奖图片（取smallpic）、大奖名称（名称需要最少能展示6个字，超过为奖品名称前6个字+省略号，请视觉同学注意排布）、大奖角标、展开按钮
 * @param {data} data object
 * @return: {object}
 */
export function handleDrawBoxData(data: DrawBoxData) {
  const {price = 0, rewards = [], user_free_lottery_times: userFreeLotteryTimes = 0, user_boosted_times: userBoostedTimes = 0} = data;
  const newRewards = getRewards(rewards);
  const drawBoxBtnText = getDrawBoxBtnText(price, userFreeLotteryTimes);
  const boostHintTextObj = getHintText(userBoostedTimes);
  const bubbleText = getBubbleText(data.exts);

  return {
    ...data,
    userFreeLotteryTimes,
    newRewards,
    userBoostedTimes,
    drawBoxBtnText,
    bubbleText,
    ...boostHintTextObj,
    newPrice: price
  };
}
// 宝箱资源位数据处理
export function getDrawBoxResource(data) {
  let baoxiangSize = 0;
  let baoxiangIndex = 0;
  let naodongSize = 0;
  let naodongIndex = 0;
  let huatiSize = 0;
  let huatiIndex = 0;
  const formatData = formatQipuDataElementsSummary(data);
  const properTitle = formatData.length && formatData[0] && formatData[0].properTitle;
  const cardList = properTitle.split(/,|，/).map(v => v.toLocaleLowerCase());
  /* eslint array-callback-return : off */
  cardList.map(v => {
    if(v === 'baoxiang') {
      baoxiangSize += 1;
    }
    if(v === 'naodong') {
      naodongSize += 1;
    }
    if(v === 'huati') {
      huatiSize += 1;
    }
  });
  const array = Array.from(new Set(cardList));
  naodongIndex = array.indexOf('naodong');
  huatiIndex = array.indexOf('huati');
  baoxiangIndex = array.indexOf('baoxiang');
  return {
    baoxiangSize,
    baoxiangIndex,
    naodongSize,
    naodongIndex,
    huatiSize,
    huatiIndex
  };
}
