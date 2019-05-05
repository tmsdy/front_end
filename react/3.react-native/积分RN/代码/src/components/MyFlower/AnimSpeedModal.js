/**
 * Created by liuzhimeng.
 * @date 2019-04-04
 * @description 加速态全屏弹窗
 */

import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {View} from '@iqiyi/rn-ui'
import {Width as DEVICE_WIDTH, Height as DEVICE_HEIGHT} from '@iqiyi/rn-utils'
import ReduxUtil from '../../common/ReduxUtil'
import LottieAnimation from '../LottieAnimation'

export default class AnimSpeedModal extends PureComponent {
  static propTypes = {
    onAnimationEnd: PropTypes.func,
  }

  static defaultProps = {
    onAnimationEnd: global.NOOP,
  }

  constructor(props) {
    super(props)

    this.refLottie = ReduxUtil.createRef()
  }

  componentDidMount() {
    this.play()
  }

  render() {
    return (
      <View style={styles.container}>
        <LottieAnimation
          style={styles.lottie}
          ref={this.refLottie}
          remote={true}
          name="flower/speed-up"
          loop={false}
          onAnimationEnd={this.props.onAnimationEnd}
        />
      </View>
    )
  }

  play = () => {
    this.refLottie.getInstance().then(ref => ref.play())
  }

}

const styles = BaseStyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
  }
})
