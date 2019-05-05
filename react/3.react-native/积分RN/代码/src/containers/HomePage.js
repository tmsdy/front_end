/**
 * 我的积分主页
 */

import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  StatusBar,
  DeviceEventEmitter
} from 'react-native'
import {
  View,
  Text,
  Image,
  ActivityIndicator
} from '@iqiyi/rn-ui'
import QYPullToRefreshLayout from '@iqiyi/rn-refresh-view'
import {
  isIOS,
  Width as width,
  Height,
  isArray,
} from '@iqiyi/rn-utils'
import Swiper from '@iqiyi/rn-swiper'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {setTotalScore} from '../actions/TotalScoreActions'
import NavBar from '../components/DefaultNavBar'
import WebImage from '../components/WebImage'
import {isCompleted, isDone} from '../components/TaskItem'
import RefreshIcon from '../components/RefreshIcon'

import VerticalAndroidSwiper from '../components/VerticalAndroidSwiper'
import Sign from '../components/home/Sign'
import DailyTasks from '../components/home/DailyTasks'
import TotalScore from '../components/totalScore/TotalScore'
import ShopList from '../components/home/ShopList'
import ProductList from '../components/home/ProductList'
import OneKey from '../components/home/OneKey'
import CardList from '../components/home/CardList'
import {
  getUserInfo,
  executeTask,
  getTaskList,
  getReward,
  getVipRewards,
  getIntegralShopping,
  getCouponList
} from '../api'
import {
  createUrl,
  compare,
  goToDianShangDetail,
  filterNotes,
  saveAsyncStorage,
  goToLogin,
  formatQipuData,
} from '../common/util'
import {
  showToast,
} from '../common/QYNativeBridge'
import {
  GET_ENV,
  BASE_URL,
  COMIC_URL,
  NOVEL_URL,
  READING_URL,
  VIP_TASK_URL,
  GONG_YI_URL,
} from '../constants/configs'
import {sendPagePingback, sendClickPingback, sendBlockPingback} from '../common/pingback'
import {HomePageRuleModal, HomePageRuleSignModal} from '../components/MedalModalBox'
import QRBox from '../components/QRBox'
import TopicBox from '../components/TopicBox'
import NavIcon from '../components/NavIcon'
import MedalInfo from '../components/home/MedalInfo'
import {TOUCH_TEXT_ACTIVE} from '../constants/touchableStyle';
import GetRewardScoreModal from '../components/home/GetRewardScoreModal';
import {navIconPingBack, getRewardPingback} from '../components/home/Pingback';
import {getDaojuByPagination} from '../components/home/GetData'
import EnvChange from '../components/EnvChange'
import WefareBox from '../components/home/WefareBox';
import {handleTaskItemClick} from '../common/handleTaskClick'

import {getAsyncStoragePromise, saveAsyncStoragePromise} from '../common/asyncStorage'
// eslint-disable-next-line import/no-cycle
import Router from '../Router';
import BasePage from '../components/BasePage';

const IS_SHOW_USER_EXPIRE_SCORE = 'IS_SHOW_USER_EXPIRE_SCORE_)))'

const VIP_TASK_MAP = {
  vip_sixcharge: '8a2186bb5f7bedd4',
  vip_wechatmp: '843376c6b3e2bf00',
  vip_autocharge: 'acf8adbb5870eb29',
  vip_memberclub: 'b6e688905d4e7184',
}

const ModalOrderIndex = {
  signOrder: 0,
  getRewardOrder: 1,
  welfareOrder: 2,
}
@connect(null, dispatch => bindActionCreators({setTotalScore}, dispatch), null, {withRef: true})
export default class HomePage extends BasePage {

  static navigationOptions = {
    header: null,
    headerStyle: {
      backgroundColor: 'transparent',
      borderBottomWidth: 0
    }
  }

  static propTypes = {
    uniqueID: PropTypes.string,
  }

  static pageName = 'homeRN'

  pageName = 'homeRN'

  constructor(props) {
    super(props, 'IntegralRn_HomePage')
    this.state = {
      isLogin: global.USER_INFO.isLogin, // 用户登录状态
      loaded: false,
      userIcon: global.USER_INFO.userIcon,
      isVIP: global.USER_INFO.isVIP,
      totalScore: 0,
      lastPeriodScore: 0,
      notice: [],
      navItems: [],
      banner: [],
      daojuHotItems: [],
      dailyTasks: [],
      completedTasks: [],
      topicModalVisible: false,
      loadingModalVisible: false,
      highMedal: {
        channelCode: ''
      },
      integralShopping: [], // 积分购物数据,
      homePageRuleVisble: false, // 规则弹窗modal
      ruleTask: {},
      pk: null,
      coupons: null, // 卡券列表
      lastScore: 0,
      allCode: [], //  商品渠道码列表
      signData: null,
      ModalList: new Array(3), // 签到 --> 可提取积分 --> 福利
      showDoubleCard: false,
      doubleTime: 0,
      welfareEnter: false, // 福利页面右下角入口是否展示
      showlastPeriodScore: false
    }
  }

  // 避免重复请求
  onRequesting = false

  refresher = null

  userInfoId = global.USER_INFO.userId

  componentDidMount() {
    sendPagePingback(this.pageName, {score: this.props.totalScore});
    isIOS && StatusBar.setBarStyle('dark-content', true);
    global.from = (this.props.navigation.state.params && this.props.navigation.state.params.from) || global.from
    this._getData()
    this._setModalList(ModalOrderIndex.signOrder, true)
    this._setModalList(ModalOrderIndex.welfareOrder, true)
    this.listenLogin()
  }

  componentWillUnmount() {
    this.listener.remove() // 解除绑定的事件
  }

  listenLogin = () => {
    const _this = this
    this.listener = DeviceEventEmitter.addListener('loginChange', (isLogin) => {
      _this.setState({
        isLogin,
        isVIP: global.USER_INFO.isVIP,
        userId: global.USER_INFO.userId,
        userIcon: global.USER_INFO.userIcon || 'default_icon',
      }, () => {
        _this._getData()
      })
    })
  }

  onShow() {
    super.onShow();
    this._getData()
  }

  _refreshTask() {
    setTimeout(() => {
      this._getUserInfo();
      this._getTasks();
    }, 2000)
  }

  // TODO 数据太混乱了， 看的头疼
  _getData = (flag) => {
    if(this.onRequesting) return false
    this.setState({
      loaded: true
    })
    this.onRequesting = true
    // 刷新深度任务
    this.dailyTasksRef && this.dailyTasksRef.getDeepTask()
    Promise.all([
      this._getUserInfo(),
      this._getTasks(),
      this._getQiPuData(),
      this.getDaojuQudaoCode(), // 获取渠道号 取数组第一个为热门兑换的渠道号 产品约定  龚腾
      this._getIntegralShoppingData(),
      this.getScore(),
    ]).catch(() => {
        this.onRequesting = false
      })
      .finally(() => {
        if(flag) {
          this.refresher.finishRefresh()
        }
        this.hideNativeLoading()
        this.onRequesting = false
      })
  }

  _setModalList = (key, status) => {
    const {ModalList} = this.state
    ModalList[key] = {
      status
    }
    if(key === 1 && !status) { // 提取积分弹窗同一个生命周期只展示一次
      this.hideReward = true
    }
    this.setState({
      ModalList
    })
  }

  // 多个弹框弹出需要排序
  renderMixModal = () => {
    if(!this.checkIsFirstPage()) return false
    const {ModalList} = this.state
    //
    for(let index = 0; index < ModalList.length; index++) {
      const item = ModalList[index]
      if(item) {
        if(item.status) {
          return this._renderModalByIndex(index)
        }
      } else {
        break
      }
    }
  }

  // 检查当前页面是否在第一个，用来显示弹框
  checkIsFirstPage() {
    try {
      const {navigation} = this.props
      const {routes} = navigation.dangerouslyGetParent().state
      // 判断乐园页面是否是栈内正在显示的页面
      if(routes[routes.length - 1].routeName === 'HomePage') {
        return true
      }
      return false
    } catch(e) {
      return true
    }
  }

  renderGetRewardModal = () => {
    const {isLogin} = this.state
    if(!!this.state.lastScore && isLogin && !this.hideReward) {
      return (
        <GetRewardScoreModal
          lastScore={this.state.lastScore}
          isLogin={this.state.isLogin}
          showNextModal={() => {
            this._setModalList(ModalOrderIndex.getRewardOrder, false)
          }}
        />
      )
    }
    return null
  }

  _renderModalByIndex = (index) => {
    const {hideAllModal} = this.state
    if(hideAllModal) {
      return false
    }
    // 签到弹窗
    if(index === 0) {
      // 签到弹框需要常驻 ，并且由于签到弹框是第一个展示（且是内部数据满足条件才展示），所以不影响顺序，只需要加 hideAllModal 判断
      return null
    }
    // 提取积分弹窗
    if(index === 1) {
      return this.renderGetRewardModal()
    }
    // 福利弹窗
    if(index === 2) {
      return this._renderWelfareBox()
    }
  }

  _renderWelfareBox = () => {
    return (
      <WefareBox
        showNextModal={() => {
          this._setModalList(ModalOrderIndex.welfareOrder, false)
        }}
        goTo={this.goTo}
      />
    )
  }

  getDaojuQudaoCode = () => {
    const requestHeader = {
      task_code: 'daojuPartnerList',
      timestamp: Date.now(),
    }
    const requestBody = {
      daojuPartnerList: {
        vertical_code: 'iQIYI',
        tag: '移动端任务中心'
      }
    }
    executeTask(requestHeader, requestBody).then((param) => {
      if(param.code === 'A00000' && !!param.data.length) {
        const {data} = param
        this.setState({
          allCode: data
        })
        // this._getDaojuItems(data[0].partnerCode)
        getDaojuByPagination({size: 8, page: 1, partnerCode: data[0].partnerCode}).then((result) => {
          if(result && result.length) {
            this.setState({
              daojuHotItems: result
            })
          }
        })
      }
    })
  }

  // 设备积分转移
  getScore = () => {
    // 未登录不需要查询此接口
    if(!this.state.isLogin) return false
    const requestBody = {
      getDeviceUidAndScore: {
        need_ext: true,
        agentversion: global.CLIENT_INFO.appVersion,
        srcplatform: isIOS ? '20' : '21',
        agenttype: isIOS ? '20' : '21',
        qyid: global.CLIENT_INFO.qyId || global.CLIENT_INFO.deviceId,
        appver: global.CLIENT_INFO.appVersion,
        verticalCode: 'iQIYI',
        typeCode: 'point',
        userId: global.USER_INFO.userId
      }
    }

    const requestHeader = {
      task_code: 'getDeviceUidAndScore',
      timestamp: Date.now(),
    }
    executeTask(requestHeader, requestBody).then((data) => {
      /*
       "verticalCode": "CMPTest",// 垂线编码
        "typeCode": "CMP_point",// 积分类型编码
        "userId": 1361652163,// 用户ID
        "userDfpId": "ttmcptp", //userId匹配的qyid
        "dfpUserId": 81105797,  //qyid匹配的userId
        "matched": false,// 传入的userId和qyid是否匹配
        "qyid": "mctcttr"// 设备ID
        如果无积分，前端不弹提示同步的弹框
        如果有积分，matched=true，弹出弹框
        如果有积分，matched=false，且【userDfpId 、dfpUserId】都为空，弹弹框
        如果有积分，matched=false，且【userDfpId 、dfpUserId】任意一种有值，不弹
      * */
     try {
      const {growthDfpExtRelation, device_scores: deviceScores} = data
      const {userDfpId, dfpUserId, matched} = growthDfpExtRelation
      let showModal = false
      if(deviceScores <= 0 || !deviceScores) {
        showModal = false
      } else if(matched) {
        showModal = true
      } else if(!userDfpId && !dfpUserId) {
        showModal = true
      }
      if(showModal) {
        this.setState({
          lastScore: deviceScores
        })
        this._setModalList(ModalOrderIndex.getRewardOrder, true)
      } else {
        this._setModalList(ModalOrderIndex.getRewardOrder, false)
      }
     } catch(e) {} // eslint-disable-line
    }).catch(() => {

    })
  }

  // 获取卡券列表
  _getCouponList = () => {
    const params = {
      pageNo: 1, // 接口分页 (默认值1)
      limit: 4, // 每页条数
      platform: isIOS ? 'ios' : 'android',
      userId: this.userInfoId,
      enterId: 3, // 用户领券入口编码
    }

    getCouponList(params).then((data) => {
      const {coupons} = data
      this.setState({
        coupons
      })
    }).catch(() => {
    })
  }

  _getUserInfo = () => {
    const {isLogin} = this.state
    if(!isLogin) {
      return
    }
    return getUserInfo({needExpire: 1}).then((data) => {
      const {totalScore, lastPeriodScore} = data[0]
      this.setState({
        totalScore,
        lastPeriodScore,
      })
      this.props.setTotalScore(totalScore)
      this.isShowScoreNotice(lastPeriodScore).then((showlastPeriodScore) => {
        this.setState({showlastPeriodScore})
      })

    }).catch(err => Promise.reject(err))
  }

  _getQiPuData = () => {
    if(this.state.navItems.length) return

    const requestHeader = {
      task_code: 'qipu_page_task_center_new',
      timestamp: Date.now(),
    }

    return executeTask(requestHeader)
      .then((data) => {

        if(data.resource_container) {
          const resourceContainer = formatQipuData(data.resource_container);

          // console.log('resourceContainer', resourceContainer)

          const notice = resourceContainer[0];
          this.setState({
            notice
          })

          const navItems = resourceContainer[1];
          navItems.sort(compare('order')).reverse()
          this.setState({
            navItems
          })

          const banner = resourceContainer[2]
          this.setState({
            banner
          })

          const welfareEnter = resourceContainer[3]
          const showWelfareEnter = welfareEnter && welfareEnter.filter(fv => fv.order === '1')
          if(showWelfareEnter.length) {
            this.setState({
              welfareEnter: true
            })
          }
        }
      }).catch(err => Promise.reject(err))
  }

  _getDaojuItems = (code) => {
    const requestBody = {
      daojuProductList: {
        vertical_code: 'iQIYI',
        partner_code: code,
        platform: isIOS ? '2_22_221' : '2_22_222',
        need_ext: true,
      }
    }

    const requestHeader = {
      task_code: 'daojuProductList',
      timestamp: Date.now(),
    }

    return executeTask(requestHeader, requestBody).then((data) => {
      if(data.code === 'A00000') {
        const daojuHotItems = data.data
        this.setState({
          daojuHotItems,
        })
      }
    }).catch(err => Promise.reject(err))
  }

  // 积分商城商品
  _getIntegralShoppingData = () => {
    if(this.state.integralShopping.length) return

    return getIntegralShopping().then((data) => {
      if(data.code === 'A00000') {
        this.setState({
          integralShopping: data.data
        })
      }
    }).catch(() => {})
  }

  _getTasks = (params = {
    typeCode: 'point',
    page: 1,
    pageSize: 5,
    channelGroup: '20,21'
  }) => {
    const {isLogin} = this.state
    if(isLogin) {
      const requestHeader = {
        task_code: 'task_center_list',
        timestamp: Date.now()
      }
      const requestBody = {
        growth_task_list: {
          agentversion: global.CLIENT_INFO.appVersion,
          appver: global.CLIENT_INFO.appVersion,
          srcplatform: isIOS ? '20' : '21',
          agenttype: isIOS ? '20' : '21',
          userId: global.USER_INFO.userId,
          pageSize: 5,
          verticalCode: 'iQIYI',
          typeCode: 'point',
          need_ext: true,
          page: 1,
          channelGroup: '20,21'
        },
        daoju_double_card: {
          vertical_code: 'iQIYI',
          user_id: global.USER_INFO.userId
        }
      }
      return executeTask(requestHeader, requestBody).then((data) => {
        this.setTaskData(data.taskList)
        if(data.hasDoubleCard) {
          this.setState({
            showDoubleCard: true,
            expireTime: data.expireTime
          })
        }
      }).catch(() => {

      })
    }
    return getTaskList(params).then((data) => {
      this.setTaskData(data)
    }).catch(() => {})
  }

  // 任务列表数据
  setTaskData = (data) => {
    const tasks = data.taskList;
    const dailyTasks = tasks.filter(t => t.exts && (t.channelGroup === 20 || t.channelGroup === 21))
    const signData = data
    const completedTasks = tasks.filter(t => isCompleted(t) && !isDone(t))
    this.setState({
      dailyTasks,
      signData,
      completedTasks
    })
  }

  // TODO 列表页有改变需要刷新 任务列表
  refreshDailyTask = () => {
    this._getData()
  }

  _goDetails = () => {
    const {isLogin} = this.state
    if(!isLogin) {
      goToLogin()
    } else {
      sendClickPingback('homeRN', 200100, 'detailbtn');
      this.goTo('IntegralDetail')
    }
  }

  getDressed = (item) => {
    this.setState({
      dress: item
    })
  }

  _goMedals = () => {
    sendClickPingback('homeRN', '', 'medal')
    this.goTo('IntegralMedalv2', {getDressed: this.getDressed})
  }

  getUrl(url) {
    const params = {
      uid: this.userInfoId,
      credits: this.state.totalScore,
      timestamp: Date.now(),
      appKey: 'basic_h5',
      dbredirect: url,
    };
    const exemptUrl = `${BASE_URL.community[GET_ENV()]}/score/exemptLogin`;
    return createUrl(exemptUrl, params);
  }

  // 点击通知栏
  clickNotice = (n) => {
    const clickEvent = n.key_value_pair.filter(kv => kv.name === 'clickEvent')[0]
      && n.key_value_pair.filter(kv => kv.name === 'clickEvent')[0].value

    const url = n.key_value_pair.filter(kv => kv.name === 'H5')[0]
      && n.key_value_pair.filter(kv => kv.name === 'H5')[0].value

    switch (clickEvent) {
      case 'novel':
        return this.openWeb(NOVEL_URL);
      case 'reading':
        return this.openWeb(READING_URL);
      case 'manhua':
        return this.openWeb(COMIC_URL);
      case 'H5':
        return this.openWeb(url)
      default:
    }
  }

  updateNotice = (notice) => {
    this.setState({notice, showlastPeriodScore: false});
    saveAsyncStoragePromise(IS_SHOW_USER_EXPIRE_SCORE, {
      isShow: 0,
      time: Date.now()
    });
  }

  // 点击顶部导航栏 TODO中文比较
  clickIcon = (item, index, isIconVisable, iconName) => {
    navIconPingBack(index)
    if(isIconVisable) {
      const keyValuePairs = [[`${iconName}${item.entity_id}${this.userInfoId}`, 'true']];
      saveAsyncStorage(keyValuePairs)
    }
    const {isLogin: needLogin, clickEvent, type, fullscreen} = item.values;
    const {isLogin} = this.state
    if((needLogin === 1 || needLogin === '1') && !isLogin) {
      goToLogin()
      return
    }

    // 积分内的页面建议clickEvent 与Router保持一致， 区分大小写；其他页面，根据url跳转
    if(clickEvent && Router[clickEvent]) {
      return this.navigate(clickEvent, {from: 'homepage'});
    } else {
      // 积分外的页面，统一处理
      // 会员任务跳转
      if(clickEvent === 'viptask') {
        return this.openWeb(VIP_TASK_URL)
      } else if(clickEvent === 'gongyi') {
        return this.openWeb(GONG_YI_URL)
      }

      const {entity_url: entityUrl} = item;

      // TODO 游戏不建议配置在导航栏，
      if(type === 'ball') {
        const url = `${entityUrl}?userIcon=${encodeURIComponent(global.USER_INFO.userIcon)}&userId=${encodeURIComponent(this.userInfoId)}`
        this.openWeb(JSON.stringify(isIOS ? {
          url,
          uiMode: 9,
        } : {
          url,
          have_operation_view: false,
          disable_hardware_acceleration: true
        }));
        return
      }

      // H5页面链接
      if(/^http/.test(entityUrl)) {
        const _url = this.getUrl(entityUrl)
        if(fullscreen === '1') {
          if(isIOS) {
            this.openWeb(JSON.stringify({
              url: _url,
              isFullScreen: '1'
            }))
          } else {
            this.openWeb(JSON.stringify({
              url: _url,
              orientation: 'landscape'
            }))
          }
        } else {
          this.openWeb(_url)
        }
      }


      // 注册制链接
      if(/^iqiyi:\/\//.test(item.entity_url)) {
        this.openWeb(item.entity_url);
      }
    }
  }

  // 点击banner
  clickBanner = (b, index) => {
    sendClickPingback('homeRN', 200600, `banner_${index + 1}`)
    const entityUrl = b.entity_url
    const url = `${entityUrl}?userIcon=${encodeURIComponent(global.USER_INFO.userIcon)}&userId=${encodeURIComponent(this.userInfoId)}`

    if(isIOS) {
      this.openWeb(JSON.stringify({
        url,
        uiMode: 9,
      }))
    } else {
      this.openWeb(JSON.stringify({
        url,
        have_operation_view: false,
        disable_hardware_acceleration: true,
      }))
    }
  }

  // 做任务赚积分
  handleTaskClick = (task) => {
    handleTaskItemClick(task, this.state.isLogin, this.openWeb, this.props.screenProps.uniqueID, {rpage: 'homeRN', popCallBack: this.showQRBox})
  }

  // 领取奖励
  _getTaskReward = ({channelCode, dataList}) => {
    this.setState({
      loadingModalVisible: true
    })
    getRewardPingback(channelCode)
    let temp = channelCode
    if(!channelCode) {
      // 一键领取的数据从一键领取key传递
      temp = dataList.map(t => t.channelCode).join(',')
    }

    const params = {
      channelCode: temp
    }

    if(channelCode && VIP_TASK_MAP[channelCode]) {
      getVipRewards({
        taskCode: VIP_TASK_MAP[channelCode]
      }).then().catch(err => showToast(err.message))
    }

    getReward(params).then(() => {
      this.setState({
        loadingModalVisible: false
      })

      this._refreshTask();

      if(channelCode) {
        showToast('领取奖励成功~')
      } else {
        showToast('一键领取成功~')
      }
    }).catch(() => {
      this.setState({
        loadingModalVisible: false
      })
      showToast('系统繁忙，请稍后再试')
    })
  }

  _goToHistory = () => {
    this.goTo('MyGain')
    // this.openWeb(ORDERLIST[GET_ENV()])
  }

  // NavBar 右侧内容区域
  _renderRightView = () => {
    return (
      <View style={{height: 44, justifyContent: 'center', alignItems: 'flex-end'}}>
        <TouchableHighlight {...TOUCH_TEXT_ACTIVE} onPress={this._goToHistory} style={{marginRight: 15}}>
          <Text style={{color: '#666', fontSize: 14}} numberOfLines={1}>我的收获</Text>
        </TouchableHighlight>
      </View>
    )
  }

  _renderTop = () => {
    const {
      userIcon, isLogin
    } = this.state
    return (
      <View style={styles.topContainer}>
        <View style={styles.topBox}>
          <View style={{
            width: 80, height: 80, alignItems: 'center', justifyContent: 'center'
          }}
          >
            {isLogin
              ? <Image source={{uri: userIcon}} style={styles.avatar}/>
              : <WebImage name="default_icon" style={styles.avatar}/>
            }
          </View>
          <TouchableOpacity onPress={this._goDetails}>
            <TotalScore
              from="home"
              style={{marginLeft: 10}}
              textStyle={{fontSize: 30, color: '#333', lineHeight: 35}}
            />
          </TouchableOpacity>
          {isLogin && (
            <MedalInfo
              _goMedals={this._goMedals}
              ref={(updateMedal) => {
                this.updateMedal = updateMedal
              }}
            />
          )}
          {!isLogin && (
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => {
                goToLogin()
              }}
            >
              <Text style={{fontSize: 16, color: '#FF7E00'}}>登录</Text>
            </TouchableOpacity>
          )}
        </View>
        {this._renderNav()}
      </View>
    )
  }

  _getNewNotice() {
    const {lastPeriodScore, notice, showlastPeriodScore} = this.state
    let newNotice = isArray(notice) ? notice.concat() : []

    // SWIPER 对 null 的子组件也会渲染，所以把过期提醒包装成新的 深拷贝数组形式,
    if(lastPeriodScore > 0 && showlastPeriodScore && !newNotice.find(t => t && t.showlastPeriodScore)) {
      // 去重， 防止用户人为修改时间的时候多存了一份
      newNotice = newNotice.concat([{showlastPeriodScore: true}])
    }

    return newNotice;
  }

  _renderNotice = () => {
    const {lastPeriodScore, completedTasks, showDoubleCard} = this.state
    let newNotice = this._getNewNotice();
    const newNoticeLength = newNotice.length > 0,
      hasCompletedTask = completedTasks.length > 0;
    if(newNoticeLength || hasCompletedTask) {
      return (
        <React.Fragment>
          <View style={{backgroundColor: '#fff'}}>
            {newNoticeLength
              ? (
                <WebImage name="bg_news_new" style={styles.swiper_box}>
                  <WebImage name="ic_news" style={styles.speaker} />
                  <VerticalAndroidSwiper
                    newNotice={newNotice}
                    lastPeriodScore={lastPeriodScore}
                    clickNotice={this.clickNotice}
                    updateNotice={this.updateNotice}
                  />

                </WebImage>
              )
              : null
            }
            {hasCompletedTask && (
              <OneKey
                showDoubleCard={showDoubleCard}
                completedTasks={completedTasks}
                hasNotice={newNoticeLength}
                _getTaskReward={this._getTaskReward}
                style={[newNoticeLength ? {position: 'absolute', top: 0, left: 0} : null]}
              />
            )}
          </View>
        </React.Fragment>
      )
    }
  }

  _renderNav = () => {
    const {
      completedTasks, navItems
    } = this.state
    let newNotice = this._getNewNotice();
    const newNoticeLength = newNotice.length > 0,
      hasCompletedTask = completedTasks.length > 0,
      hasBorder = !newNoticeLength && !hasCompletedTask;
    return (
      <View style={[{marginTop: 18}, hasBorder ? {
        paddingBottom: 15,
        borderBottomColor: '#eee',
        borderBottomWidth: StyleSheet.hairlineWidth
      } : null]}
      >
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {
            // TODO 使用时增加校验， 或者处理数据时将无效数据剔除
            navItems.map((item, index) => (
              <NavIcon
                key={item.order}
                item={item}
                clickIcon={this.clickIcon}
                index={index}
              />
            ))
          }
        </ScrollView>
      </View>

    )
  }

  _renderBanner = () => {
    const {banner} = this.state
    return !!banner.length && (
      <View style={[styles.taskContainer, {marginTop: 18}]}>
        <Swiper
          showsHorizontalScrollIndicator={false}
          loop={true}
          autoplay={true}
          width={width - 24}
          height={110}
        >
          {
            banner.map((b, index) => (
              <TouchableOpacity
                key={b.order}
                activeOpacity={1}
                onPress={() => this.clickBanner(b, index)}
              >
                <Image source={{uri: b.thumbnail_url}} style={styles.banner_img} />
              </TouchableOpacity>
            ))
          }
        </Swiper>
      </View>
    )
  }

  _renderHotItems = () => {
    const {daojuHotItems, isVIP, allCode} = this.state
    const hotItems = [...daojuHotItems]
    const filteredItems = hotItems.filter((item) => {
      const isvip = item.exts && item.exts.filter(e => e.name === 'isvip')[0]
      if(isvip) {
        return (isVIP && isvip.value === '1') || (!isVIP && isvip.value === '0')
      }
      return true
    }).slice(0, 6)
    return (!!allCode.length && !!filteredItems.length) && (
      <CardList
        index={-1}
        allCode={allCode}
        list={filteredItems}
        goTo={this.goTo}
        openWeb={this.openWeb}
        getUrl={this.getUrl}
      />
    )
  }

  _hideRuleModal = () => {
    this.setState({
      homePageRuleVisble: false
    })
  }

  // 签到规则弹框
  showHomePageRuleSignModal = () => {
    this.touchRuleBtnClick({signRule: true})
  }

  _renderRuleModal = () => {
    if(!this.state.homePageRuleVisble) return

    if(filterNotes(this.state.ruleTask) !== '1' && filterNotes(this.state.ruleTask) !== 1) {
      return (
        <HomePageRuleModal
          homePageRuleVisble={this.state.homePageRuleVisble}
          _hideRuleModal={this._hideRuleModal}
          ruleTask={this.state.ruleTask}
        />
      )
    }
    // 签到弹窗特殊处理
    return (
      <HomePageRuleSignModal
        homePageRuleVisble={this.state.homePageRuleVisble}
        _hideRuleModal={this._hideRuleModal}
      />
    )
  }

  touchRuleBtnClick = (task) => {
    this.setState({
      homePageRuleVisble: true,
      ruleTask: task
    })
  }

  // 打开任务列表页面
  openTaskList = () => {
    sendClickPingback('homeRN', '', 'gotasklist')
    this.goTo('TaskList', {
      refreshDailyTask: this.refreshDailyTask
    })
  }

  // 每日任务
  _renderDaily = () => {
    const {dailyTasks, isVIP, signData, showDoubleCard, expireTime} = this.state
    const newlist = this.filterDailyTask(dailyTasks)
    const signTask = dailyTasks.filter(t => t.channelCode === 'Sign')[0]
    return !!dailyTasks.length && (
      <DailyTasks
        ref={(dailyTasksRef) => { this.dailyTasksRef = dailyTasksRef }}
        isVIP={isVIP}
        dailyTasks={newlist}
        signTask={signTask}
        touchRuleBtnClick={this.touchRuleBtnClick}
        handleTaskClick={this.handleTaskClick}
        onRewardBack={this.onRewardBack}
        openTaskList={this.openTaskList}
        showSignModal={this.showSignModal}
        goTo={this.goTo}
        signData={signData}
        showDoubleCard={showDoubleCard}
        expireTime={expireTime}
      />
    )
  }

  // 领取奖励成功回调，更新领取奖励的任务数据
  onRewardBack = ({channelCode}) => {
    const {completedTasks} = this.state
    const newCompletedTasks = completedTasks.filter(({channelCode: c}) => c !== channelCode)

    this.setState({completedTasks: newCompletedTasks})
  }

  // 过滤每日任务  会员任务有特殊逻辑不展示
  filterDailyTask = (list) => {
    const {isVIP} = this.state
    const newlist = list.concat([])
    return newlist.filter((task) => {
      // if(isDone(task)){
      //   return false
      // }
      const {channelGroup} = task
      if(channelGroup === 21) {
        // 挑战任务
        const isvip = task.exts.filter(e => e.name === 'isvip')[0]
        if(isvip) {
          if((isVIP && isvip.value === '1') || (!isVIP && isvip.value === '0') || (isVIP && isvip.value === '0' && isCompleted(task))) {
            return true
          }
          return false
        }
        return true
      }
      return true
    })
  }

  _renderGuideBuble = () => {
    return this.state.guideVisible && (
      <WebImage name="buble_9_5" style={styles.buble}>
        <Text style={styles.bubleTxt}>勋章挪到这咯，快去看看吧~</Text>
      </WebImage>
    )
  }

  _goToDetailPage = (itemId, index) => {
    this.openWeb(goToDianShangDetail(itemId))
    const rseat = `shopgoods_${index + 1}`;
    sendClickPingback('homeRN', '200800', rseat)
  }

  _renderIntegralShopping = () => {
    const {integralShopping} = this.state
    // 展示商品不超过6个
    if(integralShopping.length > 0) {
      return (
        <ShopList
          list={integralShopping.slice(0, 3)}
          goToDetail={this._goToDetailPage}
          hasMore={integralShopping.length > 6}
          goTo={this.goTo}
        />
      )
    }
  }

  // 展示签到弹框
  showSignModal = () => {
    // redux connect 组件获取refs特殊处理
    this.signContainer && this.signContainer.getWrappedInstance() && this.signContainer.getWrappedInstance().showModal()
  }

  // 连续签到
  _renderCheckInModal = () => {
    const {isLogin, signData, hideAllModal} = this.state
    if(!signData || hideAllModal) {
      return null
    }
    signData.continuousValue = signData.signDay
    return (
      <Sign
        showNextModal={() => {
          this._setModalList(ModalOrderIndex.signOrder, false)
        }}
        isLogin={isLogin}
        signData={{...signData}}
        ref={(signContainer) => {
          this.signContainer = signContainer;
        }}
        showRuleSignModal={this.showHomePageRuleSignModal}
      />
    )
    //
    // return null
  }

  _hideTopicModal = () => {
    this.setState({
      topicModalVisible: false
    })
  }

  viewMoreTopic = (url) => {
    this.setState({
      topicModalVisible: false,
    })
    return this.openWeb(url)
  }

  _renderTopicModal = () => {
    const {topicModalVisible} = this.state
    return topicModalVisible && (
      <TopicBox
        topicModalVisible={topicModalVisible}
        hideTopicModal={this._hideTopicModal}
        viewMore={this.viewMoreTopic}
        totalScore={this.state.totalScore}
      />
    )
  }

  _renderQRBox = () => {
    return <QRBox ref={(qrBoxRef) => { this.qrBoxRef = qrBoxRef }}/>
  }

  // 展示二维码弹框
  showQRBox = () => {
    this.qrBoxRef && this.qrBoxRef.showQRBox()
  }

  goToFeatureCoupon = (item, index) => {
    this.goTo('FeatureCoupon', {
      item,
      index,
      pageNo: index + 1
    })
  }

  _renderLoading = () => {
    if(!this.state.loaded) {
      return (
        <View style={styles.unLinkBox}>
          <ActivityIndicator text="内容即将呈现..."/>
        </View>
      )
    }
  }

  gotoWelfare = () => {
    sendClickPingback('homeRN', 200600, 'hx_fuchuang1')
    this.goTo('Welfare', {from: 'renwu'})
  }

  _renderWelfareEnter = () => {
    const {welfareEnter} = this.state
    if(!welfareEnter) {
      return null
    }
    sendBlockPingback('homeRN', 200600)
    return (
      <TouchableHighlight
        {...TOUCH_TEXT_ACTIVE}
        onPress={this.gotoWelfare}
        style={{
          width: 85, height: 85, position: 'absolute', bottom: 100, right: 15
        }}
      >
        <WebImage name="welfare_icon" style={{width: 85, height: 85}}/>
      </TouchableHighlight>
    )
  }


  isShowScoreNotice = async (score) => {
    let isShowScore = false;
    const current = new Date();
    const showConfigs = ['1/1', '5/1', '5/26'];

    const data = await getAsyncStoragePromise(IS_SHOW_USER_EXPIRE_SCORE) || {};

    // 为1或者null时，显示
    isShowScore = data.isShow !== 0;

    if(showConfigs.indexOf(`${current.getMonth() + 1}/${current.getDate()}`) >= 0) {
      isShowScore = true;
      // 判断当天是否点击过
      if(data.time) {
        const clickDate = new Date(data.time);
        if(clickDate.getMonth() === current.getMonth() && clickDate.getDate() === current.getDate()) {
          isShowScore = false;
        }
      }

      // 用户触发更新的时候才添加time
      saveAsyncStoragePromise(IS_SHOW_USER_EXPIRE_SCORE, {
        isShow: isShowScore ? 1 : 0
      });
    }
    return score > 0 && isShowScore;

  }

  // 任务中心页，滑至最下方，增加文字bth,文案“点击查看更多商品
  _renderBottomBtn() {
    return (
      <TouchableOpacity onPress={() => this.goTo('ShoppingMall')}>
        <View style={styles.bottomBtn}>
          <Text style={styles.bottomBtnText}>点击查看更多商品</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const {isLogin, allCode} = this.state
    return (
      <View style={styles.container}>
        <NavBar
          title="任务中心"
          backPress={this.back}
          renderRightView={this._renderRightView}
          rightViewWidth={90}
          backgroundColor="#fff"
          titleColor="#333"
          type="black"
        />
        <View style={styles.pullContainer}>
          <QYPullToRefreshLayout
            ref={(component) => {
              this.refresher = component
            }}
            orientation={0}
            enabledPullDown={true}
            renderHeader={() => <RefreshIcon />}
            onRefresh={() => {
              this._getData(true)
              // 增加判断
              isLogin && this.ProductList && this.ProductList._getData()
            }}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
            >
              {this._renderTop()}
              <View style={{backgroundColor: '#ffffff'}}>
                {this._renderNotice()}
                {this._renderBanner()}
                {this._renderDaily()}
                {this._renderHotItems()}
                {this._renderIntegralShopping()}
                {!!allCode.length && (
                  <ProductList
                    goTo={this.goTo}
                    openWeb={this.openWeb}
                    getUrl={this.getUrl}
                    ref={(ProductListRef) => {
                      this.ProductList = ProductListRef
                    }}
                    allCode={allCode}
                  />
                )}
                {this._renderBottomBtn()}
                <EnvChange />
              </View>
            </ScrollView>
          </QYPullToRefreshLayout>
          {this._renderLoading()}
        </View>
        {this._renderCheckInModal()}
        {this._renderRuleModal()}
        {this._renderTopicModal()}
        {this._renderQRBox()}
        {/* {this.renderGetRewardModal()} */}
        {this.renderMixModal()}
        {this._renderWelfareEnter()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  unLinkBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width,
    height: Height,
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 280
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    height: Height,
  },
  pullContainer: {
    flex: 1,
  },
  topContainer: {},
  topBox: {
    flexDirection: 'row',
    // paddingTop: 10,
    height: 80,
    alignItems: 'center',
    flexGrow: 1,
    paddingHorizontal: 15,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  numbermedal: {
    width: 110,
    height: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: 14.5,
    borderBottomLeftRadius: 14.5,
    position: 'absolute',
    top: 23.5,
    right: 0
  },
  dressing: {
    position: 'absolute',
    width: 80,
    height: 80,
    top: 0,
    left: 0,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
  },
  shoppingBox: {
    width: 160,
    height: 80,
    backgroundColor: '#FFF9F0',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 10,
    paddingVertical: 12,
    paddingHorizontal: 13,
  },
  hotMore: {
    width: 160,
    height: 80,
    backgroundColor: '#FFF9F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 13,
  },
  text: {
    fontSize: 14,
    backgroundColor: 'transparent',
    color: '#ffffff',
  },
  taskContainer: {
    paddingHorizontal: 12,
    paddingBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
  },
  checkInBox: {
    width,
    height: width * 1.35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalWrapper: {
    width: 270,
    padding: 0,
    borderRadius: 11,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  modalText: {
    marginTop: 30,
    alignItems: 'center',
  },
  modalButton: {
    flex: 1,
    height: 46,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#FF9100',
    backgroundColor: '#FF9100',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  swiper_box: {
    width,
    height: width * 0.186667,
    paddingLeft: 27,
    paddingRight: 18.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  notice_bar: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 10,
  },
  notice_text: {
    fontSize: 13,
    color: '#ff6600',
  },
  speaker: {
    width: 20,
    height: 20,
  },
  discountText: {
    color: '#FD7E23',
    fontSize: 12,
    marginTop: 14,
    textAlign: 'center'
  },
  integralPrice: {
    color: '#666666',
    fontSize: 12,
    marginTop: 6,
    marginBottom: 23,
    textAlign: 'center',
  },
  moreShopping: {
    width: 120,
    height: 68.5,
    backgroundColor: '#FFF9EC',
    justifyContent: 'center',
    borderRadius: 5
  },
  buble: {
    width: 194,
    height: 42,
    position: 'absolute',
    left: (width / 2) - 16,
    top: 98,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubleTxt: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 4,
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 46,
    marginBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#FEFDFB',
    borderRadius: 5,
  },
  task_button: {
    width: 82,
    height: 30,
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: '#FF7E00',
    borderColor: '#FF7E00',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner_img: {
    width: width - 24,
    height: 110,
    borderRadius: 5,
  },
  pk_area: {
    flex: 1,
    position: 'absolute',
    bottom: 100,
    right: 20,
  },
  loginBtn: {
    width: 75,
    height: 35,
    borderRadius: 20,
    borderColor: '#FF7E00',
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
  },
  bottomBtn: {
    flex: 1,
    width: 180,
    height: 40,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    paddingHorizontal: 30,
    marginTop: 10,
    alignSelf: 'center'
  },
  bottomBtnText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'PingFangSC-Regular',
  }

})
