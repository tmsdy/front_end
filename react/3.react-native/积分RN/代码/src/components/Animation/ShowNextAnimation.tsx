/**
 * 深度任务/通知切换动效
 *  */
import React, {PureComponent} from 'react'
import {Animated, View, Easing} from 'react-native'

interface ShowNextAnimationProps {
  listCount?: number; // 列表数量
  duration?: number; // 滑动时间
  distance?: number; // 单行高度，即单行移动距离
  direction?: -1 | 1; // 移动方向
  displayHeight?: number; // 展示区域高度
  moveDistance?: number; // 容器移动距离，负数为向上移动，正数为向下移动
  style?: any;
  animatedDisappear?: boolean; // 是否展示结束后容器消失动画

  onAnimatedDisappeared?(): Promise<boolean>; // true: 展示完消失动画后移除容器
}

interface ShowNextAnimationState {
  animContainer: Animated.Value;
  translateY: Animated.Value;
  visiable: boolean;
}

export default class ShowNextAnimation extends PureComponent<ShowNextAnimationProps, ShowNextAnimationState> {
  private pageNum: number;
  private hasMoved: number;

  static defaultProps = {
    listCount: 1,
    duration: 200,
    distance: 40, // 距离
    style: {},
    direction: -1, // 默认方向往上滚动
    displayHeight: 40,
    animatedDisappear: false,

    onAnimatedDisappeared: global.NOOP,
  }

  constructor(props: ShowNextAnimationProps) {
    super(props)

    this.state = {
      animContainer: new Animated.Value(0),
      translateY: new Animated.Value(0),
      visiable: true,
    }

    this.pageNum = 1
    this.hasMoved = 0

  }

  render() {
    const {children, style, displayHeight, listCount, distance} = this.props
    const {animContainer, translateY, visiable} = this.state

    if(!visiable) return null

    return (
      <Animated.View
        style={[style, {
          transform: [{
            translateY: animContainer,
          }]}
        ]}
      >
        <View style={{height: displayHeight, overflow: 'hidden'}}>
          <Animated.View
            style={{
              height: listCount * distance,
              transform: [{
                translateY,
              }]
            }}
          >
            {children}
          </Animated.View>
        </View>
      </Animated.View>
    )
  }

  // 展示动画
  public showNext = (): Promise<{pageNum: number}> => {
    return new Promise((resolve, reject) => {
      const {direction, distance, displayHeight, duration, animatedDisappear, listCount} = this.props
      const {translateY} = this.state
      const toValue = this.hasMoved + distance * direction

      // 限制最大滚动距离
      if(Math.abs(toValue) + displayHeight > listCount * distance) {
        if(animatedDisappear) {
          this.moveContainer().then(() => {
            this.props.onAnimatedDisappeared().then((visiable) => {
              if(visiable === false) {
                this.setState({visiable: false})
              }
            })
          })
        }
        return reject()
      }

      Animated.timing(translateY, {
        toValue,
        duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start(({finished}) => {
        if(finished) {
          this.hasMoved = toValue
          this.pageNum++
          resolve({pageNum: this.pageNum})
        }
      })
    })
  }

  // 移动容器
  public moveContainer = (): Promise<{finished: boolean}> => {
    return new Promise((resolve) => {
      const {moveDistance, duration} = this.props
      const {animContainer} = this.state

      Animated.timing(animContainer, {
        toValue: moveDistance,
        duration,
        useNativeDriver: true,
      }).start(({finished}) => {
        if(finished) {
          resolve({finished: true})
        }
        resolve({finished: false})
      })
    })
  }

}
