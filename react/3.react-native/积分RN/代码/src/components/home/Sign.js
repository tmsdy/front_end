/**
 * Created by kerwinliu on 2018/6/26.
 */
/*
*积分连续签到弹框模块  使用注意，只在constructor接收参数，所以必须在有数据的情况下渲染，避免空数据渲染
* */
import React, {Component} from 'react'
import {Animated, Easing, StyleSheet, View, DeviceEventEmitter} from 'react-native'
import {Text} from '@iqiyi/rn-ui'
import LinearGradient from '@iqiyi/rn-gradient-view'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import ConfirmModal from '../ConfirmModal'
import {userCheckin} from '../../api'
import SignScoreList from '../../constants/signScoreList'
import WebImage from '../WebImage'
import px2dp from '../../common/px2dp'
import {changeTotalScore} from '../../actions/TotalScoreActions'
import SignAnimation from './SignAnimation'

@connect(null, dispatch => bindActionCreators({changeTotalScore}, dispatch), null, {withRef: true})
export default class extends Component {
  static defaultProps = {
    signData: {
      score: 0, // 本次签到得分
      continuousValue: 0, // 已经连续签到多少天
    },
    signCb: () => null, // 签到成功回调
    showRuleSignModal: () => null, // 展示签到规则
  }

  constructor(props) {
    super(props)
    const {continuousValue} = this.props.signData
    this.state = {
      continuousValue,
      listValue: this.getScoreList(continuousValue),
      modalVisible: false,
      animationValue: {
        translateY: new Animated.Value(0),
        opacity: new Animated.Value(1),
      },
    }
  }

  componentDidMount() {
    this._checkIn()
    if(!global.USER_INFO.isLogin) {
      this.listenLogin()
    }
  }

  componentWillUnmount() {
    this.listener && this.listener.remove()
  }

  render() {
    const {modalVisible, listValue, continuousValue} = this.state
    return (
      <ConfirmModal
        modalVisible={modalVisible && continuousValue > 0}
        cancelFn={this.cancelFn}
        showCloseButton={true}
      >
        {continuousValue > 0
          ? (
            <View
              style={styles.outerView}
            >
              <WebImage name="101_sign_bg" style={styles.container}>
                <View style={styles.titleContent}>
                  <Text style={styles.title}>签到成功</Text>
                </View>
                <View style={styles.todayScore}>
                  <Text style={styles.todayScoreText}>+{this.getTodayScore()}积分</Text>
                </View>
                <View style={styles.continuous}>
                  {listValue.map((item, i) => (
                    <ContinuousItem
                      key={item.continuousValue}
                      index={i + 1}
                      item={item}
                      continuousValue={continuousValue}
                    />
                  ))}
                </View>
              </WebImage>
              <SignAnimation/>
            </View>
          ) : null
        }
      </ConfirmModal>
    )
  }
  // 登录后需要签到
  listenLogin = () => {
    this.listener = DeviceEventEmitter.addListener('loginChange', (isLogin) => {
      if(isLogin) {
        this._checkIn()
      }
    })
  }
  // 自动签到
  _checkIn = () => {
    const {signCb} = this.props
    const params = {
      channelCode: 'Sign',
      scoreType: 1,
      debugMode: 'mdb',
    }
    userCheckin(params)
      .then((data) => {
        // console.log('userCheckin', data)
        if(!data || !data[0] || data[0].code !== 'A0000') {
          const {showNextModal} = this.props
          showNextModal && showNextModal()
          return false
        }
        const {continuousValue, score} = data[0]
        this.setState({
          continuousValue,
          listValue: this.getScoreList(continuousValue),
        }, () => {
          // 修改积分总数
          this.props.changeTotalScore(score)
          signCb && signCb()
          // 自动签到延迟弹框，优化动画体验，
          setTimeout(this.showModal, 500)
        })
      })
  }

  showModal = () => {
    this.setState({modalVisible: true})
    // InteractionManager.runAfterInteractions(() => {
    //   this.startAnimation(0)
    // })
  }

  hideModal = () => {
    this.setState({modalVisible: false})
    // InteractionManager.runAfterInteractions(() => {
    //   this.startAnimation(30)
    // })
  }

  startAnimation = (value) => {
    Animated.sequence([
      Animated.timing(this.state.animationValue.translateY, {
        toValue: value,
        duration: 500,
        easing: Easing.out(Easing.back()),
      }),
    ]).start()
  }

  getTodayScore = () => {
    const {listValue, continuousValue} = this.state
    let todayScore = 0
    if(listValue && listValue.length) {
      listValue.map((item) => {
        if(item.continuousValue === continuousValue) {
          todayScore = item.score
        }
        return null
      })
    }
    return todayScore
  }

  cancelFn = () => {
    this.hideModal()
    const {showNextModal} = this.props
    showNextModal && showNextModal()
  }

  getScoreList = (continuousValue) => {
    // 需要显示五条数据，
    const index = continuousValue - 1
    // 连续签到不满3天
    if(index <= 2) {
      return SignScoreList.slice(0, 5)
    }
    // 连续签到大于3天 小于等于 31天 ，需要显示 30天，29天的数据
    if(index > 2 && index <= 30) {
      return SignScoreList.slice(index - 2, index + 3)
    }
    // 连续签到 32 天之后，全部显示30分即可
    if(index > 30) {
      return [-1, 0, 1, 2, 3].map((item) => {
        return {
          continuousValue: index + item,
          score: 30,
        }
      })
    }
  }
}

// 连续icon
class ContinuousItem extends Component {
  render() {
    const {item, continuousValue} = this.props
    const isCurrent = continuousValue === item.continuousValue
    return (
      <View style={styles.item}>
        <View style={styles.itemContent}>
          {
            isCurrent
              ? (
                <React.Fragment>
                  <View style={styles.radiusContent}>
                    <LinearGradient
                      start={{x: 1, y: 0}}
                      end={{x: 0, y: 1}}
                      colors={['#FF6143', '#FF38E8']}
                      style={styles.radiusContent}
                    >
                      <Text style={{fontSize: px2dp(16), color: '#fff'}}>+{item.score}</Text>
                    </LinearGradient>
                  </View>
                </React.Fragment>
              )
              : (
                <View style={styles.radiusContent}>
                  <Text style={{fontSize: px2dp(16), color: '#FEAC01'}}>+{item.score}</Text>
                </View>
              )
          }
        </View>
        <View style={styles.dayText}>
          <Text style={{fontSize: 12, color: isCurrent ? '#FF4EA1' : '#999999'}}>{item.continuousValue}天</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: px2dp(300),
    height: px2dp(260),
    paddingTop: px2dp(80),
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  outerView: {
    width: px2dp(300),
    height: px2dp(360),
    paddingTop: px2dp(100),
    alignItems: 'center',
  },
  titleContent: {
    height: px2dp(35),
    justifyContent: 'center',
  },
  title: {
    color: '#333333',
    fontSize: px2dp(22.5),
  },
  todayScore: {
    height: px2dp(25),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayScoreText: {
    color: '#FF7E00',
    fontSize: px2dp(17.5),
  },
  continuous: {
    height: px2dp(56),
    marginTop: px2dp(34.5),
    width: px2dp(255),
    flexDirection: 'row',
  },
  item: {
    height: px2dp(56),
    width: px2dp(36),
    marginHorizontal: px2dp(7.5),
    alignItems: 'center',
  },
  itemContent: {
    height: px2dp(40),
    width: px2dp(36),
  },
  radiusContent: {
    height: px2dp(36),
    width: px2dp(36),
    borderRadius: px2dp(18),
    backgroundColor: 'rgba(254,194,1,0.2)',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    height: px2dp(17),
    marginTop: px2dp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  getMoreScore: {
    height: 20,
    marginTop: px2dp(45),
    alignItems: 'center',
    flexDirection: 'row',
  },
})
