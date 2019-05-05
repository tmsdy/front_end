/**
 * 签到动效
 */

import React, {PureComponent} from 'react';
import {View} from '@iqiyi/rn-ui';
import Animation from '@iqiyi/rn-lottie'
import BaseStyleSheet from '../../../common/BaseStyleSheet'
import {CDN_URL} from '../../../constants/configs'

export default class SignAnimation extends PureComponent {
  render() {
    const jsonUrl = `${CDN_URL}json/signAni.zip`
    if(jsonUrl) {
      return (
        <View style={styles.wrapper}>
          <View>
            <Animation
              ref={(el) => el && el.play()}
              style={{width: 240, height: 290}}
              url={jsonUrl}
              loop={false}
            />
          </View>
        </View>
      )
    }
    return null
  }
}

const styles = BaseStyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
