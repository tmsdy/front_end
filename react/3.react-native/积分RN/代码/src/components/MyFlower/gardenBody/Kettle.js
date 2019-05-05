/**
 * 水壶
 * Created by xushichao on 2018-12-12.
 */
import React, {PureComponent} from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
  findNodeHandle,
} from 'react-native';
import {connect} from 'react-redux';

import {Text, View, Image} from '@iqiyi/rn-ui';
import {Width} from '@iqiyi/rn-utils';

import {goToLogin} from '../../../common/util';
import ReduxUtil from '../../../common/ReduxUtil';
import {getUserGardenDetail} from '../../../selectors/GardenDetailSelector';

import LottieAnimation from '../../LottieAnimation';

const SIN = degree => Math.sin(2 * Math.PI / 360 * degree);
const COS = degree => Math.cos(2 * Math.PI / 360 * degree);

@connect(
  (state, props) => {
    let {isMasterGarden, theme, wateringInfo} = getUserGardenDetail(state, props);
    return {
      isMasterGarden,
      wateringInfo,
      theme,
    };
  },
  null,
  null,
  {withRef: true},
)
export default class Kettle extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      waterDropVisible: false,
      kettleLayout: null,
      animatedKettleVisible: true, // 是否显示动效水壶, 用于解决小米上蜜蜂飞行导致动效水壶文案被抹除的问题
      watered: false, // 水壶自身是否触发过浇水动作标识, 用于保证及时的修改水壶底部的文案
    };

    this.kettleShakeing = false;

    this.refKettle = ReduxUtil.createRef();
    this.refWaterDrop = ReduxUtil.createRef();

    this.animKettleWateringTrack = new Animated.Value(0);
    this.animKettleScale = new Animated.Value(0);

    this.calculateRelativeCoordination();
  }

  componentWillUnmount() {
    this.animKettleWateringTrack.stopAnimation();
    this.animKettleScale.stopAnimation();
  }

  render() {
    let {kettle} = this.props.theme;
    let {waterDropVisible, kettleLayout, animatedKettleVisible} = this.state;

    return (
      <View style={[styles.container]} pointerEvents="box-none">
        {/* 外部旋转盒 */}
        {!!animatedKettleVisible && (
          <Animated.View
            pointerEvents="box-none"
            style={[styles.outerRotationBox, {
              opacity: kettleLayout ? 1 : 0,
              width: parseInt(this.outerRotationBoxSize),
              height: parseInt(this.outerRotationBoxSize),
              marginRight: parseInt(this.outerRotationBoxOriginRight),
              marginBottom: parseInt(this.outerRotationBoxOriginBottom),
              transform: [{
                rotate: this.animKettleWateringTrack.interpolate({
                  inputRange: [0, 1],
                  outputRange: [`${45 - this.outerRotationBoxOriginDegree}deg`, `${45 - this.outerRotationBoxTargetDegree}deg`],
                }),
              }],
            }]}
          >
            {/* 内部旋转盒 */}
            <Animated.View
              pointerEvents="box-none"
              style={[styles.innerRotationBox, {
                width: parseInt(this.innerRotationBoxSize),
                height: parseInt(this.innerRotationBoxSize),
                transform: [{
                  rotate: this.animKettleWateringTrack.interpolate({
                    inputRange: this.kettleLeanTimeRatio ? [0, this.kettleLeanTimeRatio, 1] : [0, 1],
                    outputRange: this.kettleLeanTimeRatio ? [
                      `${(45 - this.outerRotationBoxOriginDegree) * -1}deg`,
                      `${(45 - (this.rotationTraceDegree * this.kettleLeanTimeRatio + this.outerRotationBoxOriginDegree)) * -1}deg`,
                      `${(45 - this.outerRotationBoxTargetDegree) * -1 + this.kettleTargetLeanDegree}deg`,
                    ] : [
                      `${(45 - this.outerRotationBoxOriginDegree) * -1}deg`,
                      `${(45 - this.outerRotationBoxTargetDegree) * -1 + this.kettleTargetLeanDegree}deg`,
                    ],
                  }),
                }],
              }]}
            >
              {/* 水壶 */}
              {this.renderKettle(false)}
            </Animated.View>
          </Animated.View>
        )}

        {/* 水滴 */}
        {!!kettleLayout && !!animatedKettleVisible && (
          <View
            style={[styles.waterDropBox, {
              bottom: parseInt(this.kettleTargetCenterBottom) - 95 - 10,
              right: parseInt(this.kettleTargetCenterRight + (kettleLayout.width) / 2) - 10,
            }]}
            pointerEvents="none"
          >
            <LottieAnimation
              ref={this.refWaterDrop}
              // style={[styles.waterDrop, {opacity: waterDropVisible ? 1 : 0}]}
              style={[styles.waterDrop]}
              name={kettle.water.name}
            />
          </View>
        )}

        {/* 水壶 */}
        {!!kettleLayout && !animatedKettleVisible && (
          <TouchableWithoutFeedback onPress={this.onKettlePress}>
            <Animated.View
              ref={this.refKettle}
              pointerEvents="box-none"
              style={[styles.kettleWrapper, {
                bottom: this.kettleOriginCenterBottom - (kettleLayout.height) / 2,
                right: this.kettleOriginCenterRight - (kettleLayout.width) / 2,
                transform: [{
                  scale: this.animKettleScale.interpolate({
                    inputRange: [0, 0.4, 0.6, 0.8, 1],
                    outputRange: [1, 1.1, 1, 1.1, 1],
                  }),
                }],
              }]}
            >
              {/* 水壶 */}
              {this.renderKettle(true)}
            </Animated.View>
          </TouchableWithoutFeedback>
        )}
      </View>
    );
  }

  renderKettle = (textVisible) => {
    const {icon, text} = this.props.theme.kettle
    return (
      <View style={styles.kettle} onLayout={this.onKettleLayout}>
        <Image source={{uri: icon.name}} style={{width: icon.width, height: icon.height, top: icon.top}} />
        <Animated.View style={[styles.kettleTitle, {opacity: textVisible ? 1 : 0, backgroundColor: text.backColor}]}>
          <Text style={[styles.kettleTitleText, {color: text.color}]}>{this.getKettleType()}</Text>
        </Animated.View>
      </View>
    );
  };

  getKettleType = () => {
    let {wateringInfo} = this.props,
      {watered} = this.state;

    if(wateringInfo.wateredToday || watered) {
      return '明天再来';
    } else if(!wateringInfo.waterCostScore) {
      return '免费浇水';
    } else {
      return `${wateringInfo.waterCostScore}积分`;
    }
  };

  onKettleLayout = ({nativeEvent}) => {
    if(!this.state.kettleLayout) {
      this.setState({kettleLayout: nativeEvent.layout, animatedKettleVisible: false});
    }
  };

  onKettlePress = () => {
    let {isMasterGarden, wateringInfo, watering, currUserId} = this.props;
    if(isMasterGarden && !parseInt(currUserId)) { // 主态未登录
      goToLogin(); // 跳转登录页
    } else if(!wateringInfo.wateredToday) { // 今天还未浇水, 去浇水
      watering();
    } else { // 今天已浇过水, 摇一摇水壶
      this.shakeKettle();
    }
  };

  watering = () => {
    return new Promise((resolve) => {
      this.setState({animatedKettleVisible: true}, () => {
        this.playWateringEntryAnimated(() => {
          this.setState({waterDropVisible: true, watered: true}, () => {
            this.refWaterDrop.getInstance().then(ref => ref.play());
          });
          this.playWateringExitAnimated(() => {
            this.setState({animatedKettleVisible: false}, resolve);
          });
        });
      });
    });
  };

  shakeKettle = () => {
    if(!this.kettleShakeing) {
      Animated.timing(this.animKettleScale, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start(() => {
        this.animKettleScale.setValue(0);
        this.kettleShakeing = false;
      });

      this.props.showTipBubble({
        target: findNodeHandle(this.refKettle.current),
        tip: '记得明天再来浇水哦',
        offsetY: 0,
        opacityAnimConfig: {from: 0, to: 1, duration: 300, loop: true},
        duration: 1500,
      });
      this.kettleShakeing = true;
    }
  };

  playWateringEntryAnimated = (done) => {
    Animated.timing(this.animKettleWateringTrack, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start(({finished}) => {
      finished && done && done();
    });
  };

  playWateringExitAnimated = (done) => {
    Animated.timing(this.animKettleWateringTrack, {
      toValue: 0,
      duration: 920,
      useNativeDriver: true,
      delay: 800,
    }).start(({finished}) => {
      finished && done && done();
    });
  };

  calculateRelativeCoordination = () => {
    // 以 GardenBody 右下角为坐标原点
    let {
      kettleOriginCenterRight,
      kettleOriginCenterBottom,
      outerRotationBoxOriginDegree,
      outerRotationBoxTargetDegree,
      kettleTargetLeanDegree,
      innerRotationBoxSize,
      kettleTargetCenterOffsetX,
      kettleLeanTimeRatio,
    } = this.props.theme.kettle;

    // 水壶原始的中心坐标点(x1, y1)
    this.kettleOriginCenterRight = kettleOriginCenterRight;
    this.kettleOriginCenterBottom = kettleOriginCenterBottom;

    // 外盒的初始旋转角度(以水平线为零点)
    this.outerRotationBoxOriginDegree = outerRotationBoxOriginDegree;

    // 外盒的目标旋转角度(以水平线为零点)
    this.outerRotationBoxTargetDegree = outerRotationBoxTargetDegree;

    // 水壶在浇水目标位置时的倾斜角度
    this.kettleTargetLeanDegree = kettleTargetLeanDegree;

    // 内部旋转盒的尺寸(保证能包裹住水壶就行)
    this.innerRotationBoxSize = innerRotationBoxSize;

    // 水壶目标位置相对于屏幕中心的横向偏移量
    this.kettleTargetCenterOffsetX = kettleTargetCenterOffsetX;

    // 水壶目标位置相对于屏幕中心的横向偏移量
    this.kettleLeanTimeRatio = kettleLeanTimeRatio;

    // 运动到浇水目标位置时水壶中心坐标点(x2)
    this.kettleTargetCenterRight = Width / 2 + this.kettleTargetCenterOffsetX;

    // 原始位置和目标位置之间的夹角
    this.rotationTraceDegree = this.outerRotationBoxTargetDegree - this.outerRotationBoxOriginDegree;

    // 原始位置和目标位置坐标间的直线距离
    this.kettleRotationTraceDistance = (this.kettleTargetCenterRight - this.kettleOriginCenterRight) / SIN(this.outerRotationBoxOriginDegree + this.rotationTraceDegree / 2);

    // 水壶的运动半径
    this.kettleRotationTraceRadius = this.kettleRotationTraceDistance / 2 / SIN(this.rotationTraceDegree / 2);

    // 运动到浇水目标位置时水壶中心坐标点(y2)
    this.kettleTargetCenterBottom = this.kettleRotationTraceDistance * COS(this.outerRotationBoxOriginDegree + this.rotationTraceDegree / 2) + this.kettleOriginCenterBottom;

    // 外部旋转盒的中心点坐标(x0, y0)
    this.outerRotationBoxCenterRight = this.kettleOriginCenterRight + this.kettleRotationTraceRadius * COS(this.outerRotationBoxOriginDegree);
    this.outerRotationBoxCenterBottom = this.kettleOriginCenterBottom - this.kettleRotationTraceRadius * SIN(this.outerRotationBoxOriginDegree);

    // 外部旋转盒的尺寸
    this.outerRotationBoxSize = (this.kettleRotationTraceRadius + this.innerRotationBoxSize * SIN(45)) * COS(45) * 2;

    // 原始坐标系内非旋转态外盒距离容器右底部的坐标(x3, y3)
    this.outerRotationBoxOriginRight = this.outerRotationBoxCenterRight - this.outerRotationBoxSize / 2;
    this.outerRotationBoxOriginBottom = this.outerRotationBoxCenterBottom - this.outerRotationBoxSize / 2;
  };
}

const styles = BaseStyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    zIndex: 50,
  },

  outerRotationBox: {
  },
  innerRotationBox: {
    position: 'absolute',
    right: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  kettleWrapper: {
    position: 'absolute',
  },
  kettle: {
    alignItems: 'center',
  },
  kettleTitle: {
    height: 25,
    borderRadius: 25 / 2,
    paddingHorizontal: 7,
    minWidth: 70,
    // marginTop: -10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kettleTitleText: {
    fontSize: 14,
    fontWeight: BaseStyleSheet.FontWeight.Medium,
  },

  waterDropBox: {
    position: 'absolute',
  },
  waterDrop: {
    width: 80,
    height: 95,
  },
});

