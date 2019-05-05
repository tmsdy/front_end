/**
 * Created by liuzhimeng.
 * @date 2019-03-15
 * @description 摇杆
 */

import React, {PureComponent} from 'react'
import Animation from '@iqiyi/rn-lottie'
import {View} from '@iqiyi/rn-ui'
import {getCDNUrl} from '../../../constants/configs'
import ReduxUtil from '../../../common/ReduxUtil'

export default class AnimRocker extends PureComponent {
  constructor(props) {
    super(props)

    this.refLottie = ReduxUtil.createRef()
  }

  render() {
    return (
      <View style={styles.container}>
        <Animation
          style={styles.lottie}
          ref={this.refLottie}
          url={getCDNUrl('json/flower/rocker.zip')}
          loop={false}
        />
      </View>
    )
  }

  play = () => {
    this.refLottie.getInstance().then(ref => ref.play())
  }

  reset = () => {
    this.refLottie.getInstance().then(ref => ref.reset())
  }
}

const styles = BaseStyleSheet.create({
  container: {
    position: 'absolute',
    top: 54,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 60,
    height: 120,
  }
})
