/**
 * Created by xushichao on 2018-12-25.
 */
import React, {PureComponent} from 'react';

import Animation from '@iqiyi/rn-lottie';
import {isIOS} from '@iqiyi/rn-utils';

import {getCDNUrl} from '../constants/configs';

export default class LottieAnimation extends PureComponent {
  constructor(props) {
    super(props);

    this.refLottie = React.createRef();
  }

  render() {
    let {name, loop, remote, ...otherProps} = this.props,
      platformProps = {};

    if(remote) {
      platformProps.url = getCDNUrl(`json/${name}.zip`);
    } else if(isIOS) {
      // platformProps.source = `${name}/data.json`;
      // platformProps.imageAssetsFolder = name;
      // platformProps.sourceBundleName = 'lottie-integral.bundle';
      platformProps.lottieName = name;
    } else {
      // platformProps.source = `lottie-integral/${name}/data.json`;
      // platformProps.imageAssetsFolder = `lottie-integral/${name}/images`;
      // android 测试包调试需要
      platformProps.bizId = 'IntegralRN';

      platformProps.lottieName = name;

      // backup , 如果lottieName失效， 使用url下载
      platformProps.url = getCDNUrl(`inapp/${name}.zip`);
    }

    return (
      <Animation
        ref={this.refLottie}
        loop={loop || false}
        {...platformProps}
        {...otherProps}
      />
    );
  }

  start = () => {
    return this.refLottie.current ? this.refLottie.current.start() : Promise.resolve();
  }

  play = () => {
    this.refLottie.current && this.refLottie.current.play();
  }

  reset = () => {
    this.refLottie.current && this.refLottie.current.reset();
  }
}
