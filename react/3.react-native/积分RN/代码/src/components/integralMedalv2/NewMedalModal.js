/**
 * Created by liuzhimeng.
 * @date 2018/11/7
 * @description 获得新勋章弹窗
 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet, TouchableOpacity,
} from 'react-native'
import Animation from '@iqiyi/rn-lottie'
import {
  View,
  Text,
} from '@iqiyi/rn-ui'
import {Width as DEVICE_WIDTH} from '@iqiyi/rn-utils'
import {getCDNUrl} from '../../constants/configs'
import ConfirmModal from '../ConfirmModal'
import WebImage from '../WebImage'
import {withAnimation} from '../mixins/withAnimation'

const getSource = level => getCDNUrl(`json/get_new_medal_v${level}.zip`)

const AnimatedText = withAnimation(Text)

export default class extends Component {
  static propTypes = {
    modalVisible: PropTypes.bool,
    title: PropTypes.string,
    level: PropTypes.oneOf([0, 1, 2, 3]),
    loop: PropTypes.bool,
    autoPlay: PropTypes.bool,
    onClose: PropTypes.func,
    onAnimationEnd: PropTypes.func,
    onAnimationStateChange: PropTypes.func,
  }

  static defaultProps = {
    modalVisible: false,
    title: '',
    level: 0,
    loop: false,
    autoPlay: false,
    onClose: () => null,
    onAnimationEnd: () => null,
    onAnimationStateChange: () => null,
  }

  animationRef = null

  componentDidMount() {
    if (this.props.autoPlay) {
      this.play()
    }
  }

  render() {
    return (
      <ConfirmModal modalVisible={this.props.modalVisible}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.modalClose} activeOpacity={1} onPress={this.props.onClose}>
            <WebImage style={styles.modalCloseIcon} name="integralmedal/modal_close"/>
          </TouchableOpacity>
          <View>
            {this.props.level > 0 && (
              <Animation
                style={styles.animation}
                ref={el => this.animationRef = el}
                url={getSource(this.props.level)}
                loop={this.props.loop}
                onAnimationEnd={event => this.props.onAnimationEnd(event)}
                onAnimationStateChange={event => this.props.onAnimationStateChange(event)}
              />
            )}
            <View style={styles.medalTextWrapper}>
              <AnimatedText
                style={styles.medalText}
                animatedType={['opacity']}
                duration={0.4}
                delay={1}
                numberOfLines={1}
              >
                {this.props.title}
              </AnimatedText>
            </View>
          </View>
        </View>
      </ConfirmModal>
    )
  }

  play = () => !!this.animationRef && this.animationRef.play()
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 40,
    right: 33,
    zIndex: 9,
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
    marginBottom: 22,
  },
  modalCloseIcon: {
    width: 44,
    height: 44,
  },
  animation: {
    width: DEVICE_WIDTH,
    height: DEVICE_WIDTH,
  },
  medalTextWrapper: {
    position: 'absolute',
    left: 0,
    bottom: Math.round(DEVICE_WIDTH * 103 / 375),
    width: '100%',
    alignItems: 'center',
  },
  medalText: {
    maxWidth: 200,
    fontSize: 20,
    color: '#ffffff',
  },
})
