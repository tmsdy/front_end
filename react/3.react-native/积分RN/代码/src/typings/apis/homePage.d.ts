
export interface QipuDataItem {
  entityId: string; // 任务id
  imgUrl: string; // 图片url
  entityUrl: string; // 跳转url
  properTitle: string; // 任务标题
  order: number;
  values: { // 取之 key_value_pair
    name: string;
    tips?: string;
    isLogin?: number;
    clickEvent?: string;
    type?: string;
    fullscreen?: number;
    platform?: string;
  };
}

export interface FetchQiPuData {
  menuList: QipuDataItem[];
  advList: QipuDataItem[];
}

export interface FetchPropCodeItem {
  code: string;
  title: string;
  isLimitedSale: boolean;
  offlineTime: number;
}

export interface FetchPropsProductItem {
  title: string;
  name: string;
  itemId: string;
  imgUrl: string;
  tagOptions?: {
    url: string;
    size: {
      width: number;
      height: number;
    };
  };
  productTagColor: string;
  productTag: string;
  url: string;
  credits: number;
  score: number;
  infinity: number;
  remain: number;
  photoMap: {
    movepic?: string;
    smallpic?: string;
    largepic?: string;
    [propName: string]: string;
  };
  extMap: {
    [propName: string]: string;
  };
  desc?: string;
}
// 首页card轮播
export interface DrawBoxData {
  activityCardType?: string; // 卡片类型
  cardOrder?: number; // 卡片位置
  description?: string; // 抽奖规则说明
  rewards?: RewardItem[]; // 奖品列表
  userFreeLotteryTimes?: number; // 用户拥有的免费抽奖次数
  userBoostedTimes?: number; // 用户被助力次数，目前最多为5次，默认值为0
  drawBoxBtnText?: string; // 免费开宝箱按钮文案
  gainBigRewardProbability?: number; // 大奖概率
  shareBtnText?: string; // 分享按钮文案
  boostHintText?: string; // 好友助力文案
  newPrice?: number; // 抽奖价格，消耗积分数(当type=1时生效)
  bubbleText?: string[]; // 气泡文案
  [key: string]: any;
}
// 奖品列表
export interface RewardItem {
  rewardName?: string; // 奖品名称
  rewardPic?: string; // 奖品图片
  rewardId?: number; // 奖品id
  [key: string]: any;
}
// 宝箱获奖信息
 export interface AwardInfo {
  username: string; // 爱奇艺用户名
  product: string; // 商品名称
  helperWeChatNickName: string; // 助力者微信名称
  infoType: string; // 信息类型  LOTTERY 为抽奖结果信息， BOOST为助力氛围信息
 }
// 宝箱获奖结果信息
 export interface AwardResultInfo {
  winReward?: boolean; // 是否中奖，true为中奖，false为未中奖
  rewardInfo?: {
    rewardType: string;
    itemId: number;
    rewardDescription: string; // 若中奖，则为中奖文案
    redeemCode: string; // 若中奖且奖励未道具或会员天数，则为卡券和商品券
    picture: string; // 当奖励类型为DAOJU时，返回道具商品key为”flowerLotteryPic“的图片地址
  };
  totalScore?: number; // 积分消耗抽奖，抽奖后，用户剩余总积分
 }

 // 花儿顶部状态栏信息
 export interface FlowerMageStatusBarResult {
  code: string;
  data?: FlowerMageStatusBarInfo;
 }

export interface FlowerMageStatusBarInfo {
  channelCode?: string; // <--- 当前种的什么花，没种就没有。
  status?: number; // <--- 花儿生长状态 状态码: 0=种子, 1=发芽, 2=成长中, 3=成熟了, 9=可以收获了, -1=死掉了
  waterToday?: boolean; // <--- 今天是否浇过水
  hasLottery?: boolean; // <--- 有没有没领取的礼物
  daysWhenLottery?: number; // <--- 下一次礼物天数
}

export interface FetchTaskList {
  taskList: any[];
  completedList: any[];
  signData: {
    lastScore: number;
    signScore: number;
    signDay: number;
  };
  hasDoubleCard: number;
  expireTime: number;
}

// 宝箱资源位
export interface BaoxiangResource {
  baoxiangSize: number;
  baoxiangIndex: number;
  naodongSize: number;
  naodongIndex: number;
  huatiSize: number;
  huatiIndex: number;
 }
export interface HomePageNotice {
  billboard: QipuDataItem[];
  notice: NoticeData[];
}

export interface NoticeData {
  productId: string;
  nickName: string;
  name: string;
  userId: number;
}

export interface FetchFLowerData {
  newborn: boolean;
}

export interface FetchAuctionData {
  cost: number;
  needNotice: boolean;
  productName: string;
}

export interface AskToSignIn {
  continuousValue: number;
  score: number;
}

export interface FetchDeviceScoreInfo {
  totalScore: number;
  todayScore?: number;
  lastPeriodScore?: number;
}

export interface AskToTransferDeviceScore {
  score: number;
  finished: boolean;
}

export interface FetchIntegralShopping {
  [propName: string]: any;
}
