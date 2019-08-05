/*
参考：https://reactnative.cn/docs/panresponder/#docsNav
用法：用PanResponder.create创建一个_panResponder给上层的view挂上就能收到响应了
<View style={styles.wrapper} {..._panResponder.panHandlers}></View>

let _panResponder = PanResponder.create({
    // 要求成为响应者,四个一开不管下面是点击还是移动都能响应到
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

    onPanResponderGrant: (evt, gestureState) => {
      // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
      console.log('onPanResponderGrant', evt.nativeEvent)
      // gestureState.{x,y} 现在会被设置为0
    },
    onPanResponderMove: (evt, gestureState) => {
      // 最近一次的移动距离为gestureState.move{X,Y}
      console.log('onPanResponderMove', evt.nativeEvent)
      // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
    },
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {
      // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
      // 一般来说这意味着一个手势操作已经成功完成。
      console.log('onPanResponderRelease', evt.nativeEvent)
    },
    onPanResponderTerminate: (evt, gestureState) => {
      // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
      console.log('onPanResponderTerminate', evt.nativeEvent)
    },
    onShouldBlockNativeResponder: (evt, gestureState) => {
      // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
      scrollRef.current.scrollToEnd()
      console.log('onShouldBlockNativeResponder', evt.nativeEvent)
      return true;
    },
  });

*/
