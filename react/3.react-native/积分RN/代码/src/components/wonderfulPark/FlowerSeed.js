/**
 * 积分乐园获得种子提示
 */
import React, {PureComponent} from 'react'
import {Animated, Easing, StyleSheet, TouchableOpacity} from 'react-native'
import PropTypes from 'prop-types'
import {View} from '@iqiyi/rn-ui'
import {Height as DEVICE_HEIGHT, Width as DEVICE_WIDTH, isIOS} from '@iqiyi/rn-utils'
import WebImage from '../WebImage'
import ConfirmModal from '../../components/ConfirmModal'
import {getCDNUrl} from '../../constants/configs'

const TIMES = 2
const SEED_TITLE_IMAGE = isIOS ? 'flower_cash_replant_title_guide_ios' : 'flower_cash_replant_title_guide_android'

export default class FlowerSeed extends PureComponent {
  static propTypes = {
    isVisible: PropTypes.bool,
    onPress: PropTypes.func,
    close: PropTypes.func,
  }

  static defaultProps = {
    isVisible: false,
    onPress: () => null,
    close: () => null,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.isVisible !== prevState.isVisible) {
      return {
        isVisible: nextProps.isVisible,
      }
    }
    return null
  }

  constructor(props) {
    super(props)
    this.state = {
      rotateValue: new Animated.Value(0),
      isVisible: false,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.isVisible && this.props.isVisible !== prevState.isVisible) {
      this.showActive()
    }
  }

  render() {
    return (
      <ConfirmModal modalVisible={this.props.isVisible} cancelFn={this.props.close}>
        <View style={styles.container}>
          <View style={styles.animateBox}>
            <Animated.Image
              source={{uri: getCDNUrl('flower_faguang')}}
              style={[styles.shineImage, {
                transform: [{
                  rotate: this.state.rotateValue.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  }),
                }],
              }]}
            />
            <WebImage name="flower/flower_star_v2" style={styles.starImage}/>
            <WebImage name="myflower_duzi_1" style={styles.duziImage}/>
          </View>
          <WebImage name={SEED_TITLE_IMAGE} style={styles.titleImage}/>
          <TouchableOpacity onPress={this._onPress} style={{marginTop: 52}}>
            <WebImage name="flower_zhongxia_btn" style={{width: 112, height: 46}}/>
          </TouchableOpacity>
        </View>
      </ConfirmModal>
    )
  }

  showActive = () => {
    this.state.rotateValue.setValue(0)
    Animated.timing(this.state.rotateValue, {
      toValue: 90 * TIMES,
      duration: 800 * TIMES,
      easing: Easing.linear,
      useNativeDriver: true,
    })
      .start(() => {
        if(this.props.isVisible) {
          this.showActive()
        }
      })
  }

  _onPress = () => {
    this.props.onPress()
  }
}

const styles = StyleSheet.create({
  container: {
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animateBox: {
    width: 204,
    height: 204,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  starImage: {
    width: 88,
    height: 73,
    position: 'absolute',
    top: 58,
    left: 66,
  },
  duziImage: {
    width: 59,
    height: 50,
    position: 'absolute',
  },
  titleImage: {
    position: 'absolute',
    top: 240,
    left: (DEVICE_WIDTH - 255) / 2,
    width: 255,
    height: 50,
  },
  shineImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 204,
    height: 204,
  },
})
