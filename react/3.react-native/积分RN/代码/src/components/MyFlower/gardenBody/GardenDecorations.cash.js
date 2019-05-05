/**
 * 花儿页主场景
 * Created by xushichao on 2018-12-20.
 */
import React, {PureComponent} from 'react';
import {Image, View} from '@iqiyi/rn-ui';
import {connect} from 'react-redux';
import LinearGradient from '@iqiyi/rn-gradient-view';
import WebImage from '../../WebImage';
import {getUserGardenDetail} from '../../../selectors/GardenDetailSelector';

@connect(
  (state, props) => {
    let {flowerInfo} = getUserGardenDetail(state, props);
    return {
      flowerInfo,
    };
  },
  null,
)
export default class GardenDecorations extends PureComponent {
  render() {
    let {flowerInfo} = this.props;
    return (
      <React.Fragment>
        {/* 背景图案 云 树 等 */}
        {/* <Image source={{uri: 'integral_flower_screen_cash'}} style={styles.background}/> */}
        <LinearGradient
          colors={['#FF4E80', '#FFD267']}
          style={styles.background}
        />
        <WebImage name="flower/integral_cash_left_cloud" style={styles.leftCloud}/>
        <WebImage name="flower/integral_flower_fireworks" style={styles.fireworksUp}/>
        <WebImage name="flower/integral_flower_fireworks_up" style={styles.fireworks}/>
        <WebImage name="flower/integral_flower_left_lantern" style={styles.leftLantern}/>
        <WebImage name="flower/integral_flower_fireworks" style={[styles.fireworksUp, {left: 170, top: 270}]}/>
        <WebImage name="flower/integral_flower_mount" style={styles.mount}/>
        <WebImage name="flower/integral_cash_house" style={styles.house}/>
        <WebImage name="flower/integral_flower_snow_back" style={styles.backSnow}/>
        <WebImage name="flower/integral_flower_right_lantern" style={styles.rightLantern}/>

        <View style={styles.foreGround} pointerEvents="none">
          <WebImage name="flower/integral_flower_snow_forward" style={styles.foreGroundDecoration}/>
          {!!flowerInfo && flowerInfo.type === 'faded' ? (
            <WebImage name="flower/integral_flower_leaf" resizeMode="contain" style={styles.foreGroundDecoration}/>
          ) : (
            <Image source={{uri: 'integral_flower_cannon'}} resizeMode="contain" style={styles.foreGroundDecoration}/>
          )}
        </View>
      </React.Fragment>
    );
  }
}

const styles = BaseStyleSheet.create({
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  house: {
    width: '100%',
    height: 190,
    position: 'absolute',
    bottom: 15
  },
  leftLantern: {
    width: 175,
    height: 118,
    position: 'absolute',
    bottom: 250
  },
  mount: {
    width: 485,
    height: 234,
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center'
  },
  backSnow: {
    width: '100%',
    height: 130,
    position: 'absolute',
    bottom: -34
  },
  foreGround: {
    width: '100%',
    height: 70,
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
  },
  foreGroundDecoration: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  leftCloud: {
    width: 174,
    height: 114,
    position: 'absolute',
    top: 100
  },
  rightLantern: {
    width: 65,
    height: 80,
    position: 'absolute',
    right: 0,
    top: 220
  },
  fireworksUp: {
    width: 90,
    height: 93,
    position: 'absolute',
    alignSelf: 'center',
    top: 120,
    left: 150,
  },
  fireworks: {
    width: 73,
    height: 66,
    position: 'absolute',
    right: 140,
    top: 230
  }
});
