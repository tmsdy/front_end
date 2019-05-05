/**
 * 福利活动页
 */
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  DeviceEventEmitter,
  TouchableOpacity,
  StatusBar,
  TouchableWithoutFeedback
} from 'react-native'
import {
  Image,
  Text,
  View
} from '@iqiyi/rn-ui';
import {
  Width,
  isIOS
} from '@iqiyi/rn-utils'
import {executeTask} from '../api'
import {goToLogin, shareSNS} from '../common/util'
import {showToast} from '../common/QYNativeBridge'
import DefaultNavBar from '../components/DefaultNavBar';
import WebImage from '../components/WebImage'
import WelfarePurePart from '../components/welfare/welfarePurePart'
import LoadingPage from '../components/LoadingPage'
import ShadowButton from '../components/welfare/shadowButton'
import {SuccessModal} from '../components/SuccessModal'
import {sendPagePingback, sendBlockPingback, sendClickPingback} from '../common/pingback'
import {GET_ENV} from '../constants/configs'
import BasePage from '../components/BasePage';

const bgHeight = 0.7327 * Width
// 用于分享列表占位
const shareListPlaceHolder = [
  {isempty: true}, {isempty: true}, {isempty: true}, {isempty: true}, {isempty: true},
  {isempty: true}, {isempty: true}, {isempty: true}, {isempty: true}, {isempty: true}
]
// 领取积分文案图片
const statusImageName = ['912_laotie', '912_qzs', '912_khd', '912_fjzf']
const SHAREID = {
  pro: '13004835212',
  test: '10636362212'
}
const RESOURCEID = {
  pro: 'qKExkgtwvbuReBQI',
  test: 'evXkxKu1MIoxup4n'
}
export default class extends BasePage {
  pageName = 'huixue'

  constructor(props) {
    super(props)
    const {isLogin} = global.USER_INFO
    this.state = {
      isLogin,
      sharerUid: this.props.screenProps ? this.props.screenProps.sharerUid : '',
      sharedSize: 0, // 分享的人数
      sharedTo: [], // 分享的人数
      qipuList: [], // 资源位数据
      userStatus: 3, // 0  已登录－可领 , 2 已登录－不可领，1 已登录－已领取,3 未登录
      loading: isLogin, // 网络状态  未登录就不请求状态数据
      productList: [] // 商品数据
    }
  }

  componentDidMount() {
    try {
      const from = this.props.screenProps.from || this.props.navigation.state.params.from || 'share'
      sendPagePingback(this.pageName, {from})
    } catch(e) {
      // do nothing
    }
    this.hideNativeLoading()
    isIOS && StatusBar.setBarStyle('light-content', true);
    this.getQiPu()
    this._getDaojuItems()
    if(this.state.isLogin) {
      this.initData(() => {
        this.setHeaderColor('transparent')
      })
    } else {
      sendBlockPingback('huixue', '160100')
      this.listenLogin()
    }
  }

  render() {
    const {qipuList, productList} = this.state
    return (
      <View style={{flex: 1, backgroundColor: '#8580FF'}}>
        <View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={this.onScroll}
            scrollEventThrottle={10}
          >
            <WebImage style={styles.topBg} name="912_welfare_bg" />
            {
              this._renderGetReward()
            }
            {
              this._renderShareList()
            }
            {!!qipuList.length && <WelfarePurePart qipuList={qipuList} openWeb={this.openWeb} productList={productList} goTo={this.goTo} partnerCode={RESOURCEID[GET_ENV()]} />}
          </ScrollView>
          {this._renderLoading()}
        </View>
        <SuccessModal
          ref={(successModal) => {
            this.successModal = successModal
          }}
        />
        <DefaultNavBar
          backgroundColor="rgba(0,0,0,0)"
          backPress={this.back}
          ref={(headerview) => {
            this.headerview = headerview
          }}
          style={{position: 'absolute', top: 0, left: 0}}
        />
      </View>
    )
  }

  // 领取奖励
  _renderGetReward() {
    const {isLogin, userStatus} = this.state
    return (
      <View style={styles.itemBg}>
        <WebImage style={[styles.itemBgImage, styles.itemBg]} name="912_wefare_item_bg" />
        <TouchableOpacity activeOpacity={1} onPress={this.pressImageBg}>
          <WebImage style={styles.itemTitle} name={statusImageName[userStatus]} />
          <View style={styles.itemContent}>
            <TouchableWithoutFeedback onPress={this.pressLeftImage}>
              <WebImage name="912_jfbt_new" style={styles.rewardImage} />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this.pressRightImage}>
              <WebImage name="912_welfare_rwjl" style={styles.rewardImage} />
            </TouchableWithoutFeedback>
          </View>
        </TouchableOpacity>
        {(!isLogin || userStatus === 0)
          && <ShadowButton onPress={this.getTaskReward} style={{top: 220}} text="点击领取" />
        }
        {(isLogin && userStatus === 2)
          && <ShadowButton onPress={this.consumePoint} style={{top: 220}} text="花掉积分，再领礼包!" />
        }
        {(isLogin && userStatus === 1) && (
          <View style={styles.doubleButton}>
            <ShadowButton onPress={this.consumePoint} style={{width: 90, position: 'relative'}} text="去花掉!" />
            <ShadowButton onPress={this.goToGetPoint} style={{width: 90, position: 'relative'}} text="赚更多!" />
          </View>
        )}
      </View>
    )
  }

  // 分享的列表
  _renderShareList() {
    const {sharedTo, sharedSize} = this.state
    const len = sharedTo.length
    return (
      <TouchableOpacity activeOpacity={1} onPress={this.share} style={[styles.itemBg, {height: bgHeight + 25}]}>
        <View style={[styles.itemBg, {paddingTop: 22, marginTop: 8}]}>
          <View style={styles.shareContent}>
            <View style={styles.shareTotal}>
              {sharedSize > 0
                ? (
                  <React.Fragment>
                    <Text style={styles.shareScore}>已领<Text style={{color: '#dcca9a'}}> {sharedSize} </Text>人</Text>
                    <Text style={styles.shareScore} numberOfLines={1}>88积分/人，共{sharedSize * 88}分</Text>
                  </React.Fragment>
                )
                : <Text style={[styles.shareScore, {flex: 1, textAlign: 'center'}]} numberOfLines={1}>每位好友成功领取即可得88积分，每日最多完成10次</Text>
              }
            </View>
            <View style={styles.shareFriends}>
              {
                sharedTo.concat(shareListPlaceHolder.slice(0, 10 - len)).map(this._renderShareItem)
              }
            </View>
          </View>
          <View style={[styles.rewardButton, styles.hideBg, {top: 235}]} />
          <View style={[styles.rewardButton, {top: 232}]}>
            <Text style={styles.rewardButtonText}>分享得积分</Text>
          </View>
        </View>
        <WebImage style={[styles.itemTitle, {position: 'absolute', top: 1}]} name="912_zlb" />
      </TouchableOpacity>
    )
  }

  // 分享item
  _renderShareItem(item, index) {
    if(item && item.isempty) {
      return (
        <View style={styles.friendItem} key={index}>
          <WebImage name="912_add" style={styles.add} />
          <Text style={styles.addText} numberOfLines={1}>虚位以待</Text>
        </View>
      )
    }
    return (
      <View style={styles.friendItem} key={index}>
        <Image source={{uri: item.avatar}} style={styles.add} />
        <Text style={[styles.addText, {color: '#FFFFFF'}]} numberOfLines={1}>{item.nickname}</Text>
      </View>
    )
  }

  _renderLoading() {
    if(this.state.loading) {
      return <LoadingPage />
    }
  }

  listenLogin = () => {
    this.listener = DeviceEventEmitter.addListener('loginChange', (isLogin) => {
      this.setState({
        isLogin
      }, () => {
        this.initData()
      })
    })
  }

  // 初始化状态
  initData() {
    this.getUserProcess()
  }

  // 资源位获取数据
  getQiPu() {
    const requestHeader = {
      task_code: 'qipu_welfare_links',
      timestamp: Date.now(),
    }

    executeTask(requestHeader)
      .then((data) => {
        if(data.elements_summary) {
          this.setState({
            qipuList: data.elements_summary.slice(0, 3)
          })
        }
      }).catch(err => Promise.reject(err))
  }

  _getDaojuItems = () => {
    const requestBody = {
      daojuProductList: {
        vertical_code: 'iQIYI',
        partner_code: RESOURCEID[GET_ENV()],
        platform: isIOS ? '2_22_221' : '2_22_222',
        need_ext: true,
        user_id: global.USER_INFO.userId
      }
    }

    const requestHeader = {
      task_code: 'daojuProductList',
      timestamp: Date.now(),
    }

    return executeTask(requestHeader, requestBody).then((data) => {
      if(data.code === 'A00000') {
        this.setState({
          productList: data.data
        })
      }
    }).catch(err => Promise.reject(err))
  }

  // 获取任务状态
  getUserProcess() {
    const requestHeader = {
      task_code: 'welfare_gift',
      timestamp: Date.now(),
    }
    const requestBody = {
      growth_taskProcess: {
        agentversion: global.CLIENT_INFO.appVersion,
        srcplatform: isIOS ? '20' : '21',
        agenttype: isIOS ? '20' : '21',
        qyid: global.CLIENT_INFO.qyid,
        appver: global.CLIENT_INFO.appVersion,
        verticalCode: 'iQIYI',
        userId: global.USER_INFO.userId,
        typeCode: 'point',
        channelCode: 'gift'
      }
    }

    executeTask(requestHeader, requestBody)
      .then((data) => {
        const {sharedTo, status, sharedSize} = data
        this.setState({
          userStatus: status,
          sharedTo,
          sharedSize,
          loading: false
        })
        if(this.state.isLogin && status === 0) {
          if(status === 0) {
            // 领取礼包已登录－符合
            sendBlockPingback('huixue', 160200)
          } else if(status === 1) {
            // 领取礼包已领取
            sendBlockPingback('huixue', 160300)
          } else if(status === 2) {
            // 领取礼包已登录－不符合
            sendBlockPingback('huixue', 160400)
          }
        }
      }).catch(() => showToast('活动太火爆了，稍后再来吧～'))
  }

  // 点击大背景
  pressImageBg = () => {
    const {isLogin, userStatus} = this.state
    if(!isLogin || userStatus === 0) {
      sendClickPingback('huixue', 160200, 'hx_ge1')
      this.getTaskReward()
    } else if(userStatus === 2) {
      sendClickPingback('huixue', 160400, 'hx_huajf1')
      this.consumePoint()
    }
  }

  pressLeftImage = () => {
    const {userStatus} = this.state
    if(userStatus === 1) {
      sendClickPingback('huixue', 160300, 'hx_hua1')
      this.consumePoint()
    } else {
      this.pressImageBg()
    }
  }

  pressRightImage = () => {
    const {userStatus} = this.state
    if(userStatus === 1) {
      sendClickPingback('huixue', 160300, 'hx_zhuanjf1')
      this.goToGetPoint()
    } else {
      this.pressImageBg()
    }
  }

  // 领取积分奖励
  getTaskReward = () => {
    sendClickPingback('huixue', 160200, 'hx_get')
    const {isLogin, userStatus} = this.state
    if(!isLogin) {
      return goToLogin()
    }
    // 已登录可领取
    if(userStatus === 0) {
      this.addScoreWithSharers()
    }
  }

  // 领取积分并且给分享者加积分
  addScoreWithSharers() {
    const {sharerUid} = this.state
    const requestHeader = {
      task_code: 'welfare_getGift',
      timestamp: Date.now(),
    }
    const requestBody = {
      growth_score_getReward: {
        channelCode: 'gift',
        agentversion: global.CLIENT_INFO.appVersion,
        srcplatform: isIOS ? '20' : '21',
        agenttype: isIOS ? '20' : '21',
        qyid: global.CLIENT_INFO.qyid,
        appver: global.CLIENT_INFO.appVersion,
        verticalCode: 'iQIYI',
        userId: global.USER_INFO.userId,
        typeCode: 'point',
      },
      sharerUid
    }

    executeTask(requestHeader, requestBody)
      .then((d) => {
        if(d.code === 'A0000') {
          // 领取成功
          this.setState({
            userStatus: 1
          })
          this.successModal && this.successModal.showModal({
            title: '恭喜领取成功',
            content: '积分发放到账户中，翻倍卡即时生效！'
          })
        }
      }).catch(() => showToast('活动太火爆了，稍后再来吧～'))
  }

  // 去花掉积分
  consumePoint = () => {
    if(this.state.userStatus === 1) {
      sendClickPingback('huixue', 160300, 'hx_hua')
    } else {
      sendClickPingback('huixue', 160400, 'hx_huajf')
    }
    this.navigate('IntegralPark')
  }

  goToGetPoint = () => {
    sendClickPingback('huixue', 160300, 'hx_zhuanjf')
    this.navigate('HomePage')
  }

  onScroll = ({nativeEvent}) => {
    isIOS && StatusBar.setBarStyle('light-content', true);
    const {y} = nativeEvent.contentOffset
    // 65 个滚动数值内 颜色逐渐变化
    const percent = y / 65
    this.setHeaderColor(`rgba(0,0,0,${percent})`)
    if(y >= -50 && y <= 115) {
      if(y < 10) {
        this.setTitle(null);
      } else {
        this.setTitle('爱奇艺助你发家致富！');
      }
    }
  }

  setTitle(title) {
    if(this.headerview) {
      const navBar = this.headerview
      navBar.setTitle(title)
    }
  }

  setHeaderColor = (color) => {
    if(this.headerview) {
      this.headerview.getNavBar().then(ref => ref.setBackgroundColor(color))
    }
  }

  // 分享
  share = () => {
    sendClickPingback('huixue', 160400, 'hx_sharetx')
    const {isLogin} = this.state
    if(!isLogin) {
      return goToLogin()
    }
    const queryParams = `?qipuid=${SHAREID[GET_ENV()]}&extInfo=${encodeURIComponent(JSON.stringify({sharerUid: global.USER_INFO.userId}))}&channel=integral`
    shareSNS({
      title: '剁手吃土？爱奇艺助你发家致富！',
      text: '老铁，速点...',
      pic: 'https://statics-web.iqiyi.com/patch_bundle/rn/IntegralRN/assets/912_share.png',
      url: `http://h5.m.iqiyi.com/integralh5/rnshare/index${queryParams}`,
      mp_path: `pages/rnShare/rnShare${queryParams}`,
      mp_imageUrl: 'https://statics-web.iqiyi.com/patch_bundle/rn/IntegralRN/assets/912_xcx_share.png',
      rpage: '',
      shareType: 5
    });
  }

}

const styles = StyleSheet.create({
  topBg: {
    width: Width,
    height: 0.8971 * Width,
  },
  itemBg: {
    width: Width,
    minHeight: bgHeight,
    alignItems: 'center',
    marginTop: 0.067 * Width
  },
  itemBgImage: {
    position: 'absolute',
    top: -(0.067 * Width),
    left: 0,
  },
  itemTitle: {
    width: 320,
    height: 30
  },
  itemContent: {
    width: 320,
    height: 210,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#3030B5',
    paddingTop: 25,
    paddingHorizontal: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#6A64FE'
  },
  rewardImage: {
    width: 104,
    height: 150
  },
  rewardButton: {
    width: 180,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#3030B5',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 220,
    backgroundColor: '#FFE97D'
  },
  hideBg: {
    backgroundColor: '#3030B5',
    top: 223
  },
  rewardButtonText: {
    color: '#3030B5',
    fontSize: 16,
    fontWeight: '600'
  },
  shareContent: {
    width: 320,
    height: 232,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#3030B5',
    paddingTop: 12,
    alignItems: 'center',
    backgroundColor: '#6A64FE'
  },
  shareTotal: {
    width: 320,
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    height: 15,
    alignItems: 'center'
  },
  shareScore: {
    color: '#3030B5',
    fontSize: 11,
    fontWeight: '600'
  },
  shareFriends: {
    paddingVertical: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 300
  },
  friendItem: {
    width: 45,
    height: 62.5,
    marginHorizontal: 7.5,
    marginVertical: 12.5,
    alignItems: 'center',
  },
  add: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  addText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.28)',
    marginTop: 4
  },
  doubleButton: {
    width: 236,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 220,
    height: 43
  }
})
