/**
 * Created by liuzhimeng.
 * @date 2019-03-19
 * @description 摩天轮
 */

import React, {PureComponent} from 'react'
import Animation from '@iqiyi/rn-lottie'
import {View} from '@iqiyi/rn-ui';

import {getCDNUrl} from '../../../../constants/configs'
import ReduxUtil from '../../../../common/ReduxUtil'


export default class AnimRocker extends PureComponent {
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
        <Animation
          style={{width: 110, height: 110}}
          ref={this.refLottie}
          url={getCDNUrl('json/flower/hebe.zip')}
          loop={true}
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
    bottom: 146,
    left: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: 110,
    height: 110,
  },
})
