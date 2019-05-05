/**
 * 项目路由
 * 注册页面，新添加页面请在这里注册！
 */

// eslint-disable-next-line import/no-cycle
import IntegralCenter from './containers/IntegralCenter'
import MiddlePage from './containers/MiddlePage'
import QOE_NAME_CONFIG from './constants/qoenameconfig'

export interface IRouteConfig {
  title: string;
  screen: any;
  needLogin: boolean;
  UNIQUE_BUSINESS_NAME?: string;
}
export interface IRoute {
  [propsName: string]: IRouteConfig;
}

// 升级版本中间落地页
export const MIDDLE_PAGE = 'MiddlePage'

const RouterList: IRoute = {
  HomePage: {
    title: '积分中心',
    needLogin: false,
    screen: IntegralCenter,
  },
  IntegralRule: {
    title: '积分规则',
    needLogin: false,
    get screen() {
      return require('./containers/IntegralRule').default
    },
  },
  IntegralDetail: {
    title: '积分明细',
    needLogin: true,
    get screen() {
      return require('./containers/IntegralDetail').default
    },
  },
  IntegralMedalv2: {
    title: '我的勋章',
    needLogin: false,
    get screen() {
      return require('./containers/IntegralMedalv2').default
    },
  },
  IntegralMedalv2Guest: {
    title: '积分勋章',
    needLogin: false,
    get screen() {
      return require('./containers/IntegralMedalv2Guest').default
    },
  },
  MedalDetail: {
    title: '勋章详情',
    needLogin: false,
    get screen() {
      return require('./containers/MedalDetail').default
    },
  },
  CouponCenter: {
    title: '兑券中心',
    needLogin: false,
    get screen() {
      return require('./containers/CouponCenter').default
    },
  },
  IntegralShopping: {
    title: '积分购物',
    needLogin: false,
    get screen() {
      return require('./containers/IntegralShopping').default
    },
  },
  GoodsDetail: {
    title: '商品详情',
    needLogin: false,
    get screen() {
      return require('./containers/GoodsDetail').default
    },
  },
  PurchaseResult: {
    title: '兑换结果',
    needLogin: true,
    get screen() {
      return require('./containers/PurchaseResult').default
    },
  },
  IntegralPark: {
    title: '积分中心',
    needLogin: false,
    screen: IntegralCenter
  },
  LeaderBoard: {
    title: '乐园排行榜',
    needLogin: true,
    get screen() {
      return require('./containers/LeaderBoard').default
    },
  },
  TaskList: {
    title: '任务列表',
    needLogin: false,
    get screen() {
      return require('./containers/TaskList').default
    },
  },
  ShoppingMall: {
    title: '商品整合',
    needLogin: false,
    get screen() {
      return require('./containers/ShoppingMall').default
    },
  },
  FeatureCoupon: {
    title: '精选好券',
    needLogin: false,
    get screen() {
      return require('./containers/FeatureCoupon').default
    },
  },
  MyFlower: {
    title: '我的Fa儿',
    needLogin: false,
    get screen() {
      return require('./containers/MyFlower').default
    },
  },
  TopicPk: {
    title: '话题PK',
    needLogin: false,
    get screen() {
      return require('./containers/TopicPk').default
    },
  },
  Welfare: {
    title: '福利活动',
    needLogin: false,
    get screen() {
      return require('./containers/Welfare').default
    },
  },
  MyGain: {
    title: '我的收获',
    needLogin: true,
    get screen() {
      return require('./containers/MyGain').default
    },
  },
  QuestionList: {
    title: '脑洞大赏',
    needLogin: false,
    get screen() {
      return require('./containers/QuestionList').default
    },
  },
  QuestionDetail: {
    title: '脑洞大赏',
    needLogin: false,
    get screen() {
      return require('./containers/QuestionDetail').default
    },
  },
  // 中间落地页
  MiddlePage: {
    title: '',
    needLogin: false,
    screen: MiddlePage
  },
  PunchPage: {
    title: '每日打卡',
    needLogin: false,
    get screen() {
      return require('./containers/PunchPage').default
    },
  },
  MyPunchRecord: {
    title: '我的战绩',
    needLogin: false,
    get screen() {
      return require('./containers/MyPunchRecord').default
    },
  },
  QuestionSubmit: {
    title: '脑洞投稿',
    needLogin: false,
    get screen() {
      return require('./containers/QuestionSubmit').default
    }
  },
  MySubmitList: {
    title: '我的投稿',
    needLogin: false,
    get screen() {
      return require('./containers/MySubmitList').default
    }
  },
  QuestionPreview: {
    title: '预览效果',
    needLogin: false,
    get screen() {
      return require('./containers/QuestionPreview').default
    }
  }
}
// 设置统计名称
for(const key in RouterList) {
  if(RouterList.hasOwnProperty(key) && QOE_NAME_CONFIG[key]) {
    RouterList[key].UNIQUE_BUSINESS_NAME = QOE_NAME_CONFIG[key]
  }
}

export default RouterList
