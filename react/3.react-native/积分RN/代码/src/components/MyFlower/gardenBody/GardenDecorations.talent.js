/**
 * 花儿页主场景
 * Created by xushichao on 2018-12-20.
 */
import React, {PureComponent} from 'react';

import {isLikeX} from '@iqiyi/rn-utils';

import WebImage from '../../WebImage';
import AnimGassLeft, {AnimGassRight} from '../decorations/talent/AnimGrass';
import AnimBalloon from '../decorations/talent/AnimBalloon';
import AnimHebe from '../decorations/talent/AnimHebe';
import AnimCloud from '../decorations/talent/AnimCloud';

export default class GardenDecorations extends PureComponent {
  render() {
    return (
      <React.Fragment>
        {/* 天空 */}
        <WebImage name={isLikeX ? 'iosx_talent_sky' : 'talent_sky'} style={styles.sky}/>
        {/* 云层 */}
        <AnimCloud/>
        {/* 山 */}
        <WebImage name="flower/talent_mountain" style={styles.mountain}/>
        {/* 摩天轮 */}
        <AnimHebe/>
        {/* 藤蔓 */}
        <WebImage name="flower/talent_vine" style={styles.vine}/>
        {/* 河 */}
        <WebImage name="flower/talent_river" style={styles.river}/>
        {/* 热气球 */}
        <AnimBalloon/>
        {/* 左侧小草 */}
        <AnimGassLeft/>
        {/* 栅栏 */}
        <WebImage name="flower/talent_fence" style={styles.fence}/>
        {/* 右侧小草 */}
        <AnimGassRight/>
      </React.Fragment>
    )
  }
}

const styles = BaseStyleSheet.create({
  sky: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  mountain: {
    position: 'absolute',
    left: 0,
    bottom: 110,
    width: '100%',
    height: 254,
  },
  vine: {
    position: 'absolute',
    left: -20,
    top: 0,
    width: '100%',
    height: 215,
  },
  river: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '100%',
    height: 425,
  },
  fence: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: 135,
  },
})
