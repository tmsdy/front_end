/**
 * 新手引导提示
 */
import React, {PureComponent} from 'react';
import {Text} from '@iqiyi/rn-ui';
import {GARDEN_ENUM} from '../../../constants/IntegralEnum';

const TIPLISTGROUP = [GARDEN_ENUM.MODE.Primary, GARDEN_ENUM.MODE.Talent, GARDEN_ENUM.MODE.Cash]
const TIP_LIST = {
  primary: ['', '如果浇水间断花儿就会枯萎哦', '连续21天后我会长大', '长大后会送你一个VIP大礼'],
  cash: ['', '如果浇水间断花儿就会枯萎哦', '连续21天后我会长大', '我会给主人带来滚滚财运'],
  talent: ['', '如果浇水间断花儿就会枯萎哦', '连续21天后我会长大', '长大后会送你一个VIP大礼']
};

export default class NewUserGuideTip extends PureComponent {
  static TIP_COUNT = TIPLISTGROUP.length;

  render() {
    let {index, gardenMode} = this.props;
    if(index === 0) {
      return <Text style={styles.tipText}>每天花<Text style={styles.tipTextActive}>5积分</Text>帮我浇水</Text>;
    }
    return <Text style={styles.tipText}>{TIP_LIST[gardenMode][index]}</Text>;
  }
}

const styles = BaseStyleSheet.create({
  tipText: {
    color: '#B56C00',
    fontSize: 12,
  },
  tipTextActive: {
    color: '#FF5900',
  },
})
