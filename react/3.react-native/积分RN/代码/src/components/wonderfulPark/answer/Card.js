import React, {PureComponent} from 'react'
import {
  View,
  StyleSheet,
  findNodeHandle,
  // PanResponder,
  TouchableOpacity
} from 'react-native'
import {
  Text,
  Image
} from '@iqiyi/rn-ui'
import {
  isIOS
} from '@iqiyi/rn-utils'
import LinearGradient from '@iqiyi/rn-gradient-view'
import WebImage from '../../WebImage'
import px2dp from '../../../common/px2dp'
import NoAnswer from '../../question/NoAnswer'
import GradientView from '../../GradientView'
import {sendClickPingback} from '../../../common/pingback'


// let _previousLeft = 0;
// let _previousTop = 0;

export default class extends PureComponent {
  // constructor(props) {
  //   super(props)
  //   this.isMoveing = false
  //   if(isIOS) {
  //     this._panResponder = PanResponder.create({
  //       // 要求成为响应者：
  //       onStartShouldSetPanResponder: () => true,
  //       onStartShouldSetPanResponderCapture: () => true,
  //       onMoveShouldSetPanResponder: () => true,
  //       onMoveShouldSetPanResponderCapture: () => true,

  //       onPanResponderGrant: () => {
  //         this.setScroll(false)
  //       },
  //       onPanResponderMove: (evt, gestureState) => {
  //         this.setScroll(false)
  //         _previousLeft = gestureState.dx;
  //         _previousTop = gestureState.dy;
  //         this.isMoveing = true
  //       },
  //       onPanResponderTerminationRequest: () => true,
  //       onPanResponderRelease: (evt) => {
  //         // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
  //         // 一般来说这意味着一个手势操作已经成功完成。
  //         this.setScroll(true)
  //         // if(!this.isMoveing) {
  //         if(_previousLeft < 10 && _previousTop < 10) {
  //           this.handleClickEvent(evt.target)
  //         }
  //         _previousLeft = 0;
  //         _previousTop = 0;
  //         this.isMoveing = false
  //       },
  //       onPanResponderTerminate: () => {
  //         this.setScroll(true)
  //       },
  //     });
  //   } else {
  //     // android对应嵌套的 PanResponder 响应不好，放在外层处理，体验稍微差一点
  //     this._panResponder = PanResponder.create({
  //       // 要求成为响应者：
  //       onStartShouldSetPanResponder: () => true,
  //       onStartShouldSetPanResponderCapture: () => true,
  //       onMoveShouldSetPanResponder: () => true,
  //       onMoveShouldSetPanResponderCapture: () => false,
  //       onPanResponderMove: (evt, gestureState) => {
  //         // android上 onPanResponderMove 只要点击就会触发，所以记录真实滚动距离，发生位移才认为是滚动
  //         // this.isMoveing = true
  //         _previousLeft = gestureState.dx;
  //         _previousTop = gestureState.dy;
  //       },
  //       onPanResponderRelease: (evt) => {
  //         if(_previousLeft < 10 && _previousTop < 10) {
  //           this.handleClickEvent(evt.target)
  //         }
  //         _previousLeft = 0;
  //         _previousTop = 0;
  //         // this.isMoveing = false
  //       }
  //     });
  //   }
  // }
  render() {
    const {item} = this.props
    const data = item.answerList[0]
    return (
      <LinearGradient
        colors={['#FFF6E7', '#FFFFFF']}
        start={{x: 1, y: 0}}
        end={{x: 1, y: 1}}
        style={[styles.bg, isIOS ? styles.iosShadow : styles.androidShadow]}
      >
        <TouchableOpacity
          onPress={this.handleClickEvent}
          style={styles.bg}
          activeOpacity={1}
        >
          {this._renderInner(item, data)}
        </TouchableOpacity>
      </LinearGradient>
    )
  }
  _renderInner = (item, data) => {
    return (
      <View style={styles.inner} activeOpacity={1}>
        <View style={styles.title}>
          <Text style={styles.titleText} numberOfLines={1}>{item.content}</Text>
        </View>
        {
          !data ?
          <NoAnswer
            outStyle={{paddingBottom: 0, marginTop: px2dp(15)}}
            onPress={this._answer}
            style={styles.empty}
            textColor={{fontSize: px2dp(12), color: '#999'}}
            text="高票回答虚位以待!"
          /> :
          <View style={{marginTop: px2dp(5), paddingTop: px2dp(10), paddingRight: px2dp(7.5)}}>
            <View style={styles.firstContent}>
              <View>
                <Image source={{uri: data.avatar}} style={styles.avatar}/>
                <View ref={(avatarbutton) => { this.avatarbutton = avatarbutton }} style={styles.mask}/>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.text} numberOfLines={1}>{data.content}</Text>
              </View>
            </View>
            <WebImage name="answer/crown" style={styles.crown}/>
          </View>
        }
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            <Text style={{color: '#ff6600'}}>{item.answerCount}</Text>人已答题领积分
          </Text>
          <View>
            {
              !item.hasAnswered ?
              <GradientView style={styles.joinButton} startColor="#FF7E00" endColor="#FFA400">
                <Text style={{fontSize: px2dp(14), color: '#fff'}}>去抢答</Text>
              </GradientView> :
              <GradientView style={styles.joinButton} startColor="#FF7E00" endColor="#FFA400">
                <Text style={{fontSize: px2dp(14), color: '#fff'}}>去点赞</Text>
              </GradientView>
            }
            <View ref={(answerbutton) => { this.answerbutton = answerbutton }} style={styles.mask}/>
          </View>
        </View>
      </View>
    )
  }
  setScroll = (status = true) => {
    const {setScrollEnabled} = this.props
    try {
      setScrollEnabled && setScrollEnabled(status)
    } catch(e) {
      setScrollEnabled && setScrollEnabled(true)
    }
  }
  handleClickEvent = ({target}) => {
    try {
      if(target === findNodeHandle(this.answerbutton)) {
        // 点击回答或者点赞
        return this._viewDetail()
      }
      if(target === findNodeHandle(this.avatarbutton)) {
        // 点击头像
        const {goToPGC, item} = this.props
        const data = item.answerList[0]
        return goToPGC({uid: data.uid})
      }
      this._lookMore()
    } catch(e) {
      this._lookMore()
    }
  }
  _lookMore = () => {
    const {index} = this.props
    sendClickPingback('paradise', '296011', `holehit_${index + 1}`)
    const {_lookMore} = this.props
    _lookMore && _lookMore(index)
  }
  _viewDetail = () => {
    const {index, item} = this.props
    sendClickPingback('paradise', '296011', `hole${index + 1}_answer`)
    this._answer({showKeyBoard: !item.hasAnswered})
  }
  _answer = ({showKeyBoard = true}) => {
    const {goToDetail, item} = this.props
    goToDetail && goToDetail(item.id, showKeyBoard)
  }
}

const styles = StyleSheet.create({
  bg: {
    width: px2dp(335),
    height: px2dp(150),
    borderRadius: px2dp(8),
  },
  iosShadow: {
    shadowColor: '#000',
    shadowOffset: {h: 0.5, w: 0},
    // shadowRadius: 2,
    shadowOpacity: 0.06,
  },
  androidShadow: {
    borderColor: '#FFE4C8',
    borderWidth: 1,
  },
  inner: {
    paddingTop: px2dp(23.5),
    paddingHorizontal: px2dp(15),
    paddingBottom: px2dp(15)
  },
  title: {
    height: px2dp(19),
    justifyContent: 'center',
    // alignItems: 'center',
    marginRight: px2dp(15)
  },
  titleText: {
    fontSize: px2dp(16),
    color: '#333',
    fontWeight: '700',
    fontFamily: 'PingFangSC-Medium'
  },
  empty: {
    width: px2dp(290),
    height: px2dp(30),
    borderRadius: px2dp(50),
    borderColor: '#FFD6AB',
    marginRight: px2dp(15)
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: px2dp(30),
    marginTop: px2dp(20),
    alignItems: 'center'
  },
  footerText: {
    color: '#999',
    fontSize: px2dp(12),
    fontFamily: 'PingFangSC-Regular'
  },
  joinButton: {
    height: px2dp(30),
    width: px2dp(70),
    borderRadius: px2dp(6)
  },
  icon: {
    width: px2dp(15),
    height: px2dp(15),
    marginRight: px2dp(2),
  },
  firstContent: {
    width: px2dp(290),
    height: px2dp(30),
    borderColor: '#FFD6AB',
    backgroundColor: '#FFF1DB',
    marginRight: px2dp(15),
    borderWidth: StyleSheet.hairlineWidth,
    borderTopLeftRadius: px2dp(2),
    borderTopRightRadius: px2dp(15),
    borderBottomRightRadius: px2dp(15),
    borderBottomLeftRadius: px2dp(15),
    paddingHorizontal: px2dp(6.5),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflow: 'hidden'
  },
  crown: {
    width: px2dp(28),
    height: px2dp(28),
    position: 'absolute',
    top: 0,
    right: 0
  },
  avatar: {
    width: px2dp(20),
    height: px2dp(20),
    borderRadius: px2dp(10),
    marginRight: px2dp(8)
  },
  text: {
    fontSize: px2dp(12),
    color: '#333',
    fontFamily: 'PingFangSC-Regular',
  },
  mask: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
    backgroundColor: 'transparent'
  }
})
