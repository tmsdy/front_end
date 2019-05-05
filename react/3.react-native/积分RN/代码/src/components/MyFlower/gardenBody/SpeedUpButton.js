/**
 * Created by liuzhimeng.
 * @date 2019-04-01
 * @description 加速肥按钮
 */

import React, {PureComponent} from 'react'
import {Animated, findNodeHandle} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {Text, View} from '@iqiyi/rn-ui'
import {Width as DEVICE_WIDTH, Height as DEVICE_HEIGHT} from '@iqiyi/rn-utils'

import {getUserGardenDetail} from '../../../selectors/GardenDetailSelector'
import {updateSpeederNum} from '../../../actions/GardenDetailActions'
import {fetchSpeederInfo} from '../../../model/MyFlower'
import {showToast} from '../../../common/QYNativeBridge'
import {sendClickPingback} from '../../../common/pingback'

import WebImage from '../../WebImage'
import FadeInBtn from '../../FadeInBtn'
import SpeedUpModal from './SpeedUpModal'
import AnimSpeedModal from '../AnimSpeedModal'

import PingbackConfig from '../../../common/PingbackConfig'
import ReduxUtil from '../../../common/ReduxUtil'

@connect(
  (state, props) => {
    const {gardenMode, theme, speederNum, flowerInfo, wateringInfo, propInfo, gifts} = getUserGardenDetail(state, props)
    return {
      gardenMode,
      theme,
      speederNum,
      flowerInfo,
      wateringInfo,
      propInfo,
      gifts,
    }
  },
  dispatch => bindActionCreators({
    updateSpeederNum,
  }, dispatch),
  null,
  {withRef: true},
)
export default class SpeedUpButton extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      buttonVisible: true,
    }

    this.speederList = []

    this.animReviveButtonScale = new Animated.Value(0)
    this.refFadeInBtn = ReduxUtil.createRef()

    this.disableShakeButtonOnFirstUpdate = true
  }

  componentDidMount() {
    if(!parseInt(this.props.currUserId)) {
      return
    }
    this.getSpeederInfo()
  }

  componentDidUpdate(prevProps) {
    if(!this.disableShakeButtonOnFirstUpdate && prevProps.speederNum !== this.props.speederNum) {
      this.disableShakeButtonOnFirstUpdate = false
      this.shakeButton()
    }
  }

  componentWillUnmount() {
    this.animReviveButtonScale.stopAnimation()
  }

  render() {
    const {theme} = this.props
    const {buttonVisible} = this.state

    return (
      <View style={styles.wrapper} pointerEvents="box-none">
        {buttonVisible && (
          <FadeInBtn
            ref={this.refFadeInBtn}
            style={[styles.container, {
              bottom: theme.speedUpBtn.bottom,
              transform: [{
                scale: this.animReviveButtonScale.interpolate({
                  inputRange: [0, 0.4, 0.6, 0.8, 1],
                  outputRange: [1, 1.1, 1, 1.1, 1],
                }),
              }],
            }]}
            onPress={this.showModal}
          >
            <View style={styles.totalNumWrapper}>
              <Text style={styles.totalNum}>x{this.props.speederNum}</Text>
            </View>
            <WebImage name="flower/icon-speed-up-screen" style={styles.helpIcon} />
          </FadeInBtn>
        )}
      </View>
    )
  }

  getSpeederInfo = async () => {
    const {totalNum, speederList} = await fetchSpeederInfo()
    this.props.updateSpeederNum(totalNum)
    this.speederList = speederList
  }

  shakeButton = () => {
    this.animReviveButtonScale.setValue(0)
    Animated.timing(this.animReviveButtonScale, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    })
      .start()
  }

  showSpeedBubble = () => {
    this.props.showTipBubble({
      target: findNodeHandle(this.refFadeInBtn.current),
      tip: '使用加速肥可以加速花儿生长哦',
      tipColor: 'blue',
      duration: 3000,
    })
  }

  showModal = () => {
    const {page} = PingbackConfig[this.props.gardenMode]
    sendClickPingback(page, 'speed_pop', 'speed_btn')
    this.props.showConfirmModal({
      showCloseButton: false,
      content: (
        <SpeedUpModal
          gardenMode={this.props.gardenMode}
          speederNum={this.props.speederNum}
          onButtonPress={this.onSpeedUp}
          hideConfirmModal={this.props.hideConfirmModal}
          openWeb={this.props.openWeb}
        />
      ),
    })
  }

  onSpeedUp = () => {
    const {
      wateringInfo: {
        wateredToday,
        waterDays,
      },
      flowerInfo,
      propInfo,
      gifts = [],
    } = this.props

    if(flowerInfo && flowerInfo.type === 'faded') {
      return showToast('花儿已经枯啦，先用复活肥吧')
    }

    if(!wateredToday) {
      return showToast('浇完水才能加速哦')
    } else if(gifts.find(i => (i.days === waterDays && i.status === 1))) {
      return showToast('礼物忘记领啦！')
    }

    if(propInfo) {
      const {speedTotalCount, speedTotalLimit, speedDayCount, speedDayLimit} = propInfo

      if(speedTotalCount >= speedTotalLimit) {
        return showToast('不能再拔苗助长了...')
      }

      if(speedDayCount >= speedDayLimit) {
        return showToast('今天不能再加速啦，明天再来吧')
      }

      this.props.hideConfirmModal().then(() => {
        this.playAnimation()
      })
    }
  }

  playAnimation = () => {
    this.setState({buttonVisible: false})
    this.props.updateSpeederNum(this.props.speederNum - 1)
    this.props.showConfirmModal({
      showCloseButton: false,
      content: <AnimSpeedModal onAnimationEnd={this.onAnimationEnd}/>,
    })
  }

  onAnimationEnd = () => {
    this.props.hideConfirmModal().then(() => {
      const speeder = this.speederList[0]
      if(speeder && speeder.orderCode) {
        this.props.watering({speedUp: true}, speeder.orderCode)
      } else {
        showToast('无法获取加速液信息，请稍后再试')
      }
    })
  }

  onWaterDone = () => {
    this.setState({buttonVisible: true})
  }

}

const CONTAINER_WIDTH = 100
const ICON_SIZE = 42
const styles = BaseStyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: DEVICE_WIDTH,
    height: 245,
  },
  container: {
    position: 'absolute',
    left: 4,
    justifyContent: 'center',
    width: CONTAINER_WIDTH,
    height: ICON_SIZE,
    paddingLeft: 13,
    overflow: 'hidden',
  },
  helpIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  totalNumWrapper: {
    position: 'absolute',
    top: 0.5,
    left: 21 + 13,
    backgroundColor: '#ffffff',
    paddingLeft: 21 - 3,
    paddingRight: 4,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  totalNum: {
    lineHeight: 16,
    color: '#419C00',
    fontSize: 12,
    fontWeight: BaseStyleSheet.FontWeight.Bold,
  },
})
