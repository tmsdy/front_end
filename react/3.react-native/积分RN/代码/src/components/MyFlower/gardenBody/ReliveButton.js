/**
 * 复活化肥按钮
 */
import React, {PureComponent} from 'react';
import {Animated} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Width} from '@iqiyi/rn-utils'
import {Text, View} from '@iqiyi/rn-ui'

import {fetchNewPropsInfo, fetchReliveInfo} from '../../../model/MyFlower'
import {sendBlockPingback, sendClickPingback} from '../../../common/pingback';
import ReduxUtil from '../../../common/ReduxUtil';
import {getUserGardenDetail} from '../../../selectors/GardenDetailSelector';
import {updateReviveNum, updateSpeederNum} from '../../../actions/GardenDetailActions';
import {showToast} from '../../../common/QYNativeBridge'

import {GARDEN_ENUM} from '../../../constants/IntegralEnum';
import LottieAnimation from '../../LottieAnimation'
import WebImage from '../../WebImage'
import FadeInBtn from '../../FadeInBtn'
import ReliveModal from './ReliveModal'

import CollectProcessModal from '../CollectGainModals'
import PingbackConfig from '../../../common/PingbackConfig'

@connect(
  (state, props) => {
    let {gardenMode, reviveNum, speederNum, flowerInfo, propInfo, theme, channelCode} = getUserGardenDetail(state, props);
    return {
      gardenMode,
      theme,
      reviveNum,
      speederNum,
      channelCode,
      flowerInfo,
      propInfo,
    };
  },
  dispatch => bindActionCreators({
    updateReviveNum,
    updateSpeederNum,
  }, dispatch),
  null,
  {withRef: true},
)
export default class ReliveButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      reviveButtonVisible: true,
    }

    this.reviveList = []

    this.refReviveBtn = ReduxUtil.createRef()
    this.refRevive = ReduxUtil.createRef()

    this.animReviveButtonScale = new Animated.Value(0);

    this.disableShakeButtonOnFirstUpdate = true
  }

  componentDidMount() {
    if(!parseInt(this.props.currUserId)) {
      return
    }
    this.fetchFertilizerInfo()
    this.fetchNewPropsInfo()
  }

  componentDidUpdate(prevProps) {
    if(!this.disableShakeButtonOnFirstUpdate && prevProps.reviveNum !== this.props.reviveNum) {
      this.disableShakeButtonOnFirstUpdate = false
      this.shakeReviveButton()
    }
  }

  componentWillUnmount() {
    this.animReviveButtonScale.stopAnimation();
  }

  render() {
    const {theme} = this.props
    const {reviveButtonVisible} = this.state

    return (
      <View style={styles.wrapper} pointerEvents="box-none">
        {this.renderReviveActive()}
        {reviveButtonVisible && (
          <FadeInBtn
            ref={this.refReviveBtn}
            style={[styles.container, {
              bottom: theme.reliveBtn.bottom,
              transform: [{
                scale: this.animReviveButtonScale.interpolate({
                  inputRange: [0, 0.4, 0.6, 0.8, 1],
                  outputRange: [1, 1.1, 1, 1.1, 1],
                }),
              }],
            }]}
            onPress={this.clickReviveBtn}
          >
            <View style={styles.totalNumWrapper}>
              <Text style={styles.totalNum}>x{this.props.reviveNum}</Text>
            </View>
            <WebImage name="flower/icon-reviver-new" style={styles.helpIcon}/>
          </FadeInBtn>
        )}
      </View>
    );
  }

  renderReviveActive = () => {
    return (
      <View style={{marginLeft: 110}} pointerEvents="none">
        <LottieAnimation
          ref={this.refRevive}
          style={{width: 155, height: 245}}
          name="revive_v2"
          onAnimationEnd={this.onAnimationEnd}
        />
      </View>
    )
  }

  playReviveAnimation = () => {
    this.setState({reviveButtonVisible: false})
    this.refRevive.getInstance().then(ref => ref.play())
  }

  fetchFertilizerInfo = () => {
    fetchReliveInfo().then(({totalNum, reviveList}) => {
      this.reviveList = reviveList
      this.props.updateReviveNum(totalNum)
      const {flowerInfo} = this.props
      if(flowerInfo.type === 'faded' && !!totalNum) {
        this.shakeReviveButton()
      }
    })
  }

  fetchNewPropsInfo = () => {
    fetchNewPropsInfo(this.props.channelCode)
      .then(({newReviverNum, newCollectionNum, newWithdrawNum, newSpeederNum}) => {
        if(!newReviverNum && !newCollectionNum && !newWithdrawNum && !newSpeederNum) {
          return
        }

        let collectProcessModalProps = {
          cards: {
            fertilizer: {count: newReviverNum},
            collection: {count: newCollectionNum},
            withdraw: {count: newWithdrawNum},
            speeder: {count: newSpeederNum},
          },
          hide: this.props.hideConfirmModal,
        }

        if(newReviverNum || newSpeederNum) {
          sendBlockPingback('flower_page', '800609')
          // 关闭弹窗后展示获得复活肥按钮动效
          collectProcessModalProps.hide = () => {
            return this.props.hideConfirmModal().then(() => {
              if(newReviverNum) {
                this.shakeReviveButton()
              }
              if(newSpeederNum) {
                this.props.shakeSpeederButton()
              }
            })
          }
        }

        if(newCollectionNum) {
          collectProcessModalProps.channelCode = GARDEN_ENUM.CHANNEL_CODE.Money
          collectProcessModalProps.show = this.props.showConfirmModal
        }

        this.props.showConfirmModal({
          showCloseButton: false,
          content: <CollectProcessModal {...collectProcessModalProps}/>,
        })
      })
  }

  onAnimationEnd = () => {
    this.setState({reviveButtonVisible: true})
  }

  clickReviveBtn = () => {
    const {page} = PingbackConfig[this.props.gardenMode]
    sendClickPingback(page, 'revive_pop', 'revive_btn')

    this.props.showConfirmModal({
      showCloseButton: false,
      content: (
        <ReliveModal
          gardenMode={this.props.gardenMode}
          reviveNum={this.props.reviveNum}
          hideConfirmModal={this.props.hideConfirmModal}
          openWeb={this.props.openWeb}
          onRelive={this.onRelive}
        />
      ),
    })
  }

  onRelive = () => {
    const {flowerInfo, propInfo} = this.props

    sendBlockPingback('flower_page', '800610')

    if(flowerInfo.type !== 'faded') {
      return showToast('我还没枯萎呢，别咒我！')
    }
    if(propInfo && propInfo.reviveTotalCount >= propInfo.reviveTotalLimit) {
      return showToast('不能再复活了，另请高明吧...')
    }

    this.props.hideConfirmModal().then(() => {
      this.props.revive(this.reviveList[0])
    })
  }

  shakeReviveButton = () => {
    this.animReviveButtonScale.setValue(0);
    Animated.timing(this.animReviveButtonScale, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    })
      .start();
  }
}

const CONTAINER_WIDTH = 100
const ICON_SIZE = 42
const styles = BaseStyleSheet.create({
  wrapper: {
    width: Width,
    height: 245,
    bottom: 0,
    position: 'absolute',
    left: 0,
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
    color: '#AB7600',
    fontSize: 12,
    fontWeight: BaseStyleSheet.FontWeight.Bold,
  },
});
