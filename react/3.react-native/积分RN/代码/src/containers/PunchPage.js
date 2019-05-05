/**
 * 打卡赢现金页面
 */
import React from 'react';
import {ScrollView, TouchableOpacity, DeviceEventEmitter, Animated, StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Text, View} from '@iqiyi/rn-ui';
import Swiper from '@iqiyi/rn-swiper-new';
import {Width, isIOS, isLikeX} from '@iqiyi/rn-utils';

import BasePage from '../components/BasePage'
import {GET_ENV, FeedBack} from '../constants/configs'
import {setTotalScore} from '../actions/TotalScoreActions';
import {getUserInfo} from '../api/index';
import ReduxUtil from '../common/ReduxUtil'
import NavBar from '../components/DefaultNavBar'
import {hideLoading} from '../common/QYNativeBridge';
import WebImage from '../components/WebImage';
import {fetchPunchDetail, fetchPunchLast, askToVote, askToPunch, fetchTipsData, fetchPunchResult} from '../model/PunchPage'
import {
  isInComputeTime,
  isAlreayShowCompute,
  setPunchStatus,
  getScoreWithComma,
  setAlreadyShowComuteModal,
  isInPunchTime,
  getPunchStatusFromStory,
  isSendScoreTime,
  isAlreayShowGetScoreModal,
  setGetScoreModal
} from '../model/PunchPageService';
import {goToLogin, getObjectValueSafely} from '../common/util'
import BaseConfirmModal from '../components/BaseConfirmModal'
import TotalScore from '../components/totalScore/TotalScore'
import LackScoreModal from '../components/PunchPage/LackScoreModal'
import VoteSuccessModal from '../components/PunchPage/VoteSuccessModal'
import PunchSuccessModal from '../components/PunchPage/PunchSuccessModal'
import PunchResultModal from '../components/PunchPage/PunchResultModal'
import ScoreGetModal from '../components/PunchPage/ScoreGetModal'
import PunchFailModal from '../components/PunchPage/PunchFailModal'
import YesterdayDetail from '../components/PunchPage/YesterdayDetail'
import Recommend from '../components/PunchPage/Recommend'
import RuleModal from '../components/PunchPage/RuleModal'
import WithSafeView from '../components/WithSafeView';
import px2dp from '../common/px2dp';
import {sendPagePingback, sendClickPingback, sendBlockPingback} from '../common/pingback';

const PAGE = 'daka'

const NoticeText = ({children}) => (
  <View style={styles.tipItemBox}>
    <WebImage name="punch/punch_tips" style={styles.tipWrapper}>
      <Text style={styles.tipText} numberOfLines={1}>{children}</Text>
    </WebImage>
  </View>
)

@connect(
  (state) => {
    let {scoreInfo} = state;
    let {totalScore} = scoreInfo
    return {
      totalScore,
    };
  },
  dispatch => bindActionCreators({
    setTotalScore
  }, dispatch),
  null,
  {withRef: true},
)

export default class PunchPage extends BasePage {

  pageName = 'daka'

  constructor(props) {
    super(props);
    this.state = {
      isLogin: global.USER_INFO.isLogin, // 用户登录状态
      navBarColor: 'transparent',
      punchedBefore: false, // 该用户是否已经打过卡
      userVoteNum: 0, // 该用户投票数
      scorePool: 0, // 奖池分数
      hasVotedYesterday: false, // 用户昨天是否投过票
      topUsers: [], // 获得积分最多的三个用户
      lastSuccess: 0, // 成功打卡人数
      lastFailed: 0, // 失败人数
      tips: [],
      recentVoteUsers: [],
      recommond: [],
      titilecColor: '#ffffff',
      navBarType: 'white'
    };

    this.loginSubscription = DeviceEventEmitter.addListener('loginChange', (isLogin) => {
      this.onLoginChanged(isLogin)
    });
    this.refConfirmModal = ReduxUtil.createRef();
    this.animBtnScale = new Animated.Value(0);
  }

  componentDidMount() {
    this.shakeBtn()
    hideLoading()
    this.getRenderData()
    sendPagePingback(PAGE, {score: getObjectValueSafely(this.props, 'totalScore')})
  }

  componentWillUnmount() {
    this.loginSubscription && this.loginSubscription.remove();
    this.animBtnScale.stopAnimation()
  }

  render() {
    const {navBarColor, scorePool, lastSuccess, lastFailed, topUsers, recommond, titilecColor, navBarType} = this.state
    const bgImage = topUsers.length > 2 ? 'punch/punch_bg' : 'punch/firstday_bg'
    const bgHeight = topUsers.length > 2 ? 718 : 503
    const likeXStyle = isLikeX() ? {marginTop: 50, paddingTop: 50} : {paddingTop: 50}
    return (
      <WithSafeView>
        <View style={styles.container}>
          <View style={{backgroundColor: '#21B6FF', position: 'absolute', top: 0, height: 300, width: Width}}/>
          <ScrollView
            style={{flex: 1}}
            onScroll={this._onScroll}
            onScrollEndDrag={this._onScroll}
            scrollEventThrottle={50}
          >
            <WebImage name={bgImage} style={[{width: Width, height: px2dp(bgHeight), paddingTop: 74, backgroundColor: '#ffffff'}, likeXStyle]}>
              <View style={{flex: 1, alignItems: 'center'}}>
                {this.renderTitle()}
                <Text style={styles.totalScore}>{getScoreWithComma(scorePool)}</Text>
                {this.renderAnnouncement()}
                {this.renderParticentBtn()}
                <YesterdayDetail
                  lastSuccess={lastSuccess}
                  lastFailed={lastFailed}
                  topUsers={topUsers}
                />
              </View>
            </WebImage>
            <Recommend recommond={recommond} openWeb={this.openWeb}/>
            {this.renderBottom()}
          </ScrollView>
          <NavBar
            style={styles.navBar}
            type={navBarType}
            title="每日打卡挑战"
            titleColor={titilecColor}
            backgroundColor={navBarColor}
            rightViewWidth={55}
            backPress={this.back}
            ref={(headerView) => { this.headerView = headerView }}
          />
          {/* 弹框容器 */}
          <BaseConfirmModal ref={this.refConfirmModal}/>
          {this.renderGotoRecordBtn()}
        </View>
      </WithSafeView>
    )
  }

  renderGotoRecordBtn = () => {
    return (
      <TouchableOpacity style={styles.recordBtnBox} activeOpacity={1} onPress={this.goToMyPunchRecord}>
        <WebImage name="punch/my_record" style={{width: 90, height: 32}}/>
      </TouchableOpacity>
    )
  }

  shakeBtn = () => {
    Animated.timing(this.animBtnScale, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      this.animBtnScale.setValue(0);
      this.shakeBtn()
    });
  };

  _goToFeedBack = () => {
    const feedbackUrl = FeedBack[GET_ENV()]
    this.openWeb(feedbackUrl)
  }

  renderBottom = () => {
    if(!isIOS) {
      return (
      <View style={styles.bottomBox}>
        <TouchableOpacity activeOpacity={1} onPress={this._goToFeedBack}>
          <Text style={styles.feedBackText}>意见反馈</Text>
        </TouchableOpacity>
      </View>
      )
    }
    return (
      <View style={styles.bottomBox}>
        <TouchableOpacity activeOpacity={1} onPress={this._goToFeedBack}>
          <Text style={styles.feedBackText}>意见反馈</Text>
        </TouchableOpacity>
        <View style={styles.feedBottomBox}>
          <View style={styles.line}/>
          <Text style={styles.greyText}>本活动与Apple Inc.无关</Text>
          <View style={styles.line}/>
        </View>
      </View>
    )
  }

  renderAnnouncement = () => {
    const list = this.state.tips
    const {recentVoteUsers} = this.state
    const renderList = list.concat(recentVoteUsers)
    return (
      <View style={{width: Width, height: 24, marginTop: 5}}>
        <View style={{width: Width, height: 24}}>
          <Swiper
            loop={true}
            autoplay={true}
            height={24}
            removeClippedSubviews={false}
            showsPagination={false}
            horizontal={false}
          >
            {renderList.map(item => <NoticeText key={item}>{item}</NoticeText>)}
          </Swiper>
        </View>
        <View style={styles.transparentBg}/>
      </View>
    )
  }

  renderTitle = () => {
    return (
      <View style={styles.titleBox}>
        <Text style={styles.title}>明天20:00前打卡瓜分积分</Text>
        <TouchableOpacity onPress={this.showRuleModal} activeOpacity={1}>
          <WebImage name="punch/ic_wenhao" style={{width: 21, height: 21}}/>
        </TouchableOpacity>
      </View>
    )
  }

  renderParticentBtn = () => {
    const {isLogin, userVoteNum} = this.state
    if(isLogin) {
      return (
        <View style={{marginTop: 17.5}}>
          {userVoteNum !== 88
          ? (
          <TouchableOpacity activeOpacity={1} onPress={this.askToVote}>
            <Animated.View
              ref={this.scaleBtn}
              style={[{width: 240, height: 75, alignSelf: 'center'}, {
                transform: [{
                  scale: this.animBtnScale.interpolate({
                    inputRange: [0, 0.4, 0.6, 0.8, 1],
                    outputRange: [1, 1.1, 1, 1.1, 1],
                  }),
                }],
              }]}
            >
              <WebImage name="punch/login_participate" style={styles.btnBox}>
               <Text style={styles.voteText}>今日已投{userVoteNum}次</Text>
              </WebImage>
            </Animated.View>
          </TouchableOpacity>
          )
          : (
          <WebImage name="punch/vote_full" style={styles.btnBox}>
            <Text style={[styles.voteText, {color: '#2994FE'}]}>今日已投88次</Text>
          </WebImage>
          )}
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10}}>
            <Text style={styles.myScoreText}>我的积分: </Text>
            <TotalScore textStyle={styles.myScoreText} from="punch"/>
            <TouchableOpacity style={styles.centerBox} onPress={this.gotoHomePage} activeOpacity={1}>
              <Text style={styles.myScoreText}>  赚更多</Text>
              <WebImage name="punch/arrow_icon" style={{width: 10, height: 10}}/>
            </TouchableOpacity>

          </View>
        </View>
      )
    }
    return (
      <TouchableOpacity activeOpacity={1} onPress={goToLogin}>
        <Animated.View
          ref={this.scaleBtn}
          style={[{width: 240, height: 75, alignSelf: 'center'}, {
            transform: [{
              scale: this.animBtnScale.interpolate({
                inputRange: [0, 0.4, 0.6, 0.8, 1],
                outputRange: [1, 1.1, 1, 1.1, 1],
              }),
            }],
          }]}
        >
          <WebImage name="punch/unlogin_participate" style={styles.unloginVotePic}/>
        </Animated.View>
        <TouchableOpacity activeOpacity={1} onPress={goToLogin} style={styles.centerBox}>
          <Text style={styles.loginText}>登录查看积分</Text>
          <WebImage name="punch/arrow_icon" style={{width: 10, height: 10}}/>
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  _onScroll = ({nativeEvent}) => {
    const {y} = nativeEvent.contentOffset
    if(this.headerView) {
      // 65 个滚动数值内 颜色逐渐变化
      const percent = y / 65
      this.headerView.getNavBar().then(ref => ref.setBackgroundColor(`rgba(255,255,255,${percent})`))
      if(y > 10) {
        this.setState({
          titilecColor: '#333333',
          navBarType: 'black'
        })
        StatusBar.setBarStyle('dark-content', true)
      } else {
        this.setState({
          titilecColor: '#ffffff',
          navBarType: 'white'
        })
        StatusBar.setBarStyle('light-content', true)
      }
    }
  }

  onLoginChanged = (isLogin) => {
    this.setState({
      isLogin
    }, () => {
      this.getRenderData()
    })
  };

  getRenderData = () => {
    this.getDetailData()
    this._getUserInfo()
    this.getTipData()
    this.fetchPunchLast()
  }

  getTipData = () => {
    fetchTipsData().then(({tips, recommond}) => {
      this.setState({
        tips,
        recommond
      })
    })
  }

  getDetailData = (async () => {
    const {
      punchedBefore,
      userVoteNumber,
      scorePool,
      votedBefore,
      timestamp,
      recentVoteUsers
    } = await fetchPunchDetail({}); //
    this.setState({
      punchedBefore,
      userVoteNum: userVoteNumber,
      scorePool,
      hasVotedYesterday: votedBefore,
      recentVoteUsers
    })
    if(votedBefore && punchedBefore) {
      // 已经打卡了的情况， 根据时间显示奖励计算中弹框（只显示一次）
      const isShowModalAlreay = await isAlreayShowCompute(timestamp);
      if(isInComputeTime(timestamp) && !isShowModalAlreay) {
        this.showComputeModal();
        setAlreadyShowComuteModal(timestamp);
      } else if(isSendScoreTime(timestamp)) {
        isAlreayShowGetScoreModal(timestamp).then((data) => {
          if(!data) {
            this.fetchPunchResult()
          }
        })
      }
    } else if(votedBefore && !punchedBefore) {
      // 如果昨天没投票, 且今天再打卡时间范围内  今天可以投票
      if(isInPunchTime(timestamp)) {
        this.goToPunch()
      } else if(!isInPunchTime(timestamp)) { // 过了打卡时间展示来晚了一步
        getPunchStatusFromStory(timestamp).then((status) => {
          if(!status) {
            this.showPunchFailModal().then(() => setPunchStatus(timestamp));
          }
        })
      }
    }
  })

  goToPunch = (async () => {
    const {
      punchSuccessfully,
      punchedNumber,
      scorePool
    } = await askToPunch({});
      if(punchSuccessfully) { // 打卡成功展示成功弹窗
        this.showPunchSuccessModal({punchedNumber, scorePool});
      } else { // 打卡失败展示失败弹窗 这时候的失败是过了打卡时间 所以失败
        this.showPunchFailModal()
      }
  })

  fetchPunchResult = () => {
    fetchPunchResult({}).then(({reward, scorePool, punchSuccess, finished, timestamp}) => {
      if(finished) {
        this.showGetScoreModal({
          reward, scorePool, punchSuccess, finished
        })
        setGetScoreModal(timestamp)
      }
    })
  }

  fetchPunchLast = () => {
    fetchPunchLast().then(({topUsers, lastPunched, lastFailed}) => {
      this.setState({
        topUsers,
        lastSuccess: lastPunched,
        lastFailed
      })
    })
  }

  _getUserInfo = () => {
    const {isLogin} = this.state
    if(!isLogin) {
      return
    }
    return getUserInfo({needExpire: 1}).then((data) => {
      const {totalScore} = data[0]
      this.props.setTotalScore(totalScore)
    }).catch(err => Promise.reject(err))
  }

  // 投票
  askToVote = () => {
    sendClickPingback(PAGE, '', 'compete', {score: getObjectValueSafely(this.props, 'totalScore')})
    if(this.props.totalScore - 10 < 0) {
     this.showScoreModal();
    } else {
      askToVote({nickname: global.USER_INFO.userName}).then(({voteSuccessfully, totalScore, userVoteNumber, scorePool}) => {
        this.props.setTotalScore(totalScore)
        this.setState({
          userVoteNum: userVoteNumber,
          scorePool,
        })
        voteSuccessfully && this.showVoteSuccessModal(userVoteNumber)
      })
    }
  }

  showVoteSuccessModal = (userVoteNumber) => {
    if(userVoteNumber < 88) {
      sendBlockPingback(PAGE, '200002', {score: getObjectValueSafely(this.props, 'totalScore')})
    }
    this.showConfirmModal({
      content: <VoteSuccessModal
        hide={this.hideConfirmModal}
        askToVote={this.askToVote}
        userVoteNumber={userVoteNumber}
        score={this.props.totalScore}
      />,
      showCloseButton: true,
    })
  }

  showScoreModal = () => {
    sendBlockPingback(PAGE, '200001', {score: getObjectValueSafely(this.props, 'totalScore')})
    this.showConfirmModal({
      content: <LackScoreModal
        hide={this.hideConfirmModal}
        gotoHomePage={this.gotoHomePage}
        score={this.props.totalScore}
      />,
      showCloseButton: true,
    })
  }


  showPunchFailModal = () => {
    return this.showConfirmModal({
      content: <PunchFailModal
        hide={this.hideConfirmModal}
      />,
      showCloseButton: true,
    });
  }

  showPunchSuccessModal = ({punchedNumber, scorePool}) => {
    sendBlockPingback(PAGE, '200003', {score: getObjectValueSafely(this.props, 'totalScore')})
    this.showConfirmModal({
      content: <PunchSuccessModal
        hide={this.hideConfirmModal}
        punchedNumber={punchedNumber}
        scorePool={scorePool}
      />,
      showCloseButton: true,
    })
  }


  showComputeModal = () => {
    this.showConfirmModal({
      content: <PunchResultModal
        hide={this.hideConfirmModal}
      />,
      showCloseButton: true,
    });
  }

  showGetScoreModal = ({reward, scorePool, punchSuccess, finished}) => {
    this.showConfirmModal({
      content: <ScoreGetModal
        reward={reward}
        scorePool={scorePool}
        punchSuccess={punchSuccess}
        finished={finished}
        hide={this.hideConfirmModal}
      />,
      showCloseButton: true,
    });
  }

  showRuleModal = () => {
    this.showConfirmModal({
      content: <RuleModal
        hide={this.hideConfirmModal}
      />,
      showCloseButton: false,
    })
  }

  showConfirmModal = (config) => {
    return this.refConfirmModal.getInstance().then((ref) => {
      ref.queueToShow(config, true)
    });
  };

  hideConfirmModal = () => {
    return this.refConfirmModal.getInstance().then(ref => ref.positiveHide());
  };

  gotoHomePage = () => {
    this.goTo('HomePage')
  }

  goToMyPunchRecord = () => {
    // 我的战绩按钮，未登录的话跳转登录页面
    sendClickPingback(PAGE, '', 'myexploits', {score: getObjectValueSafely(this.props, 'totalScore')})
    const {isLogin} = this.state
    if(isLogin) {
      this.goTo('MyPunchRecord')
    } else {
      goToLogin()
    }
  }
}

const styles = BaseStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  navBar: {
    position: 'absolute',
    top: 0
  },
  recordBtnBox: {
    position: 'absolute',
    height: 32,
    width: 90,
    right: 0,
    top: isLikeX() ? 104 : 64
  },
  totalScore: {
    color: '#FFF758',
    fontSize: 48,
    fontWeight: BaseStyleSheet.FontWeight.bold,
    fontFamily: 'DINAlternate-Bold',
    textAlign: 'center',
    lineHeight: 56
  },
  title: {
    fontWeight: BaseStyleSheet.FontWeight.Medium,
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 17,
    marginRight: 5
  },
  tipWrapper: {
    width: 220,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipText: {
    color: '#70EDFF',
    fontSize: 10,
    textAlign: 'center',
    alignSelf: 'center'
  },
  tipItemBox: {
    flex: 1,
    alignItems: 'center'
  },
  titleBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 48,
    alignItems: 'center'
  },
  voteText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 46,
    fontSize: 10,
    fontWeight: BaseStyleSheet.FontWeight.Medium
  },
  myScoreText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: BaseStyleSheet.FontWeight.Medium,
    textAlign: 'center',
    lineHeight: 20
  },
  unloginVotePic: {
    width: 240,
    height: 70
  },
  loginText: {
    color: '#FFFFFF',
    textAlign: 'center'
  },
  transparentBg: {
    width: Width,
    height: 24,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'transparent',
  },
  bottomBox: {
    marginTop: 35,
    marginBottom: 20
  },
  feedBackText: {
    color: '#999999',
    fontSize: 12,
    textAlign: 'center'
  },
  feedBottomBox: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff'
  },
  line: {
    backgroundColor: '#CCCCCC',
    width: 50,
    height: 1
  },
  greyText: {
    color: '#CCCCCC',
    fontSize: 9
  },
  centerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnBox: {
    width: 240,
    height: 75,
    alignSelf: 'center'
  }
})
