/**
 * 花儿页主场景
 * Created by xushichao on 2018-12-20.
 */
import React, {PureComponent} from 'react';

import {Image} from '@iqiyi/rn-ui';
import {Width} from '@iqiyi/rn-utils';

import MyFlowerScene from '../MyFlowerScene';
import AnimCloud from '../decorations/primary/AnimCloud';
import AnimLight from '../decorations/primary/AnimLight';
import AnimGrass from '../decorations/primary/AnimGrass';

export default class GardenDecorations extends PureComponent {
  render() {
    return (
      <React.Fragment>
        {/* 背景图案 云 树 等 */}
        <Image source={{uri: 'integral_screen_flower'}} style={styles.background}/>
        {/* 浮动的云朵 */}
        <AnimCloud/>
        {/* 闪动的光线 */}
        <AnimLight/>
        <Image source={{uri: 'integral_tree'}} name="tree" style={styles.treePic}/>
        <Image source={{uri: 'integral_leaf_small'}} name="leaf_small" style={styles.leafPic}/>
        <Image source={{uri: 'integral_fence'}} name="fence" style={styles.fencePic}/>
        <Image source={{uri: 'integral_stone_left'}} name="stone_left" style={styles.stonePic}/>
        <Image source={{uri: 'integral_stone_mushroom'}} name="stone_mushroom" style={styles.mushRoomPic}/>
        {/* 左下方摇曳的小草 */}
        <AnimGrass/>
        <Image source={{uri: 'integral_grass'}} name="grass" style={styles.grassPic}/>
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
  grassPic: {
    height: 35,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  cloudBigPic: {
    width: 230,
    height: 150,
    position: 'absolute',
    top: 65,
    left: -70,
  },
  treePic: {
    width: 225,
    height: 225,
    position: 'absolute',
  },
  cloudSmallPic: {
    width: 90,
    height: 55,
    position: 'absolute',
    right: -40,
    top: 200,
  },
  leafPic: {
    width: 102,
    height: 123,
    position: 'absolute',
    top: 160,
  },
  stonePic: {
    width: 71,
    height: 41,
    position: 'absolute',
    bottom: 0,
    left: (MyFlowerScene.DEFAULT_ZOOM - 1) * Width / 2,
    zIndex: 9,
  },
  mushRoomPic: {
    width: '100%',
    height: 100,
    position: 'absolute',
    bottom: 0,
  },
  fencePic: {
    width: '100%',
    height: 113,
    position: 'absolute',
    bottom: 0,
  },
});
