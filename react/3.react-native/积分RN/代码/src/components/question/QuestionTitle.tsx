import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import {
  View,
  Text,
  Image,
  Touchable
} from '@iqiyi/rn-ui'
import {
  Width,
  isIOS,
  isLikeX
} from '@iqiyi/rn-utils'
import LinearGradient from '@iqiyi/rn-gradient-view'
import px2dp from '../../common/px2dp'
import WebImage from '../WebImage'
import GradientView from '../GradientView'
import {shareUrl} from './ShareFn'
import {sendClickPingback} from '../../common/pingback'
import {ViewStyle} from '../../common/BaseStyleSheet';
import {goToPGC} from '../../common/util'

const isIphoneX = isLikeX()
const getNavHeight = () => {
  if(isIphoneX) return 85
  if(isIOS) return 50
  return 30
}
const HeaderPaddingTop = getNavHeight() + px2dp(25.6)
// const HeaderHeight = getNavHeight() + px2dp(64.4)

interface QtitleProps {
  item: {
    [key: string]: any;
  };
  bgColor: string;
  onPressTitle?(s: object): void;
  fromDetail?: string;
  inputBoxEnable?: boolean;
  children?: React.ReactNode;
  style?: ViewStyle;
  onPress?(): void;
  index?: number;
  openWeb?(): void;
  from?: string;
}

export default class extends PureComponent<QtitleProps, {}> {
  // constructor(props) {
  //   super(props)
  //   this.state = {

  //   }
  // }
  static defaultProps = {
    item: {} // 回答内容
  }

  static propTypes = {
    item: PropTypes.object
  }

  render() {
    const {item, bgColor, onPressTitle = null, fromDetail} = this.props
    const {content} = item
    return (
      <TouchableOpacity onPress={onPressTitle} activeOpacity={1}>
        <TitleBg item={item} bgColor={bgColor} fromDetail={fromDetail}>
          <View style={[styles.content, fromDetail && {paddingTop: HeaderPaddingTop}]}>
          {!fromDetail && <WebImage name="answer/quotation" style={styles.quotation} />}
            <View style={styles.title}>
            {!!fromDetail && <WebImage name="answer/quotation" style={[styles.quotation, {top: 0, left: 0}]} />}
              <Text style={styles.titleText}>{content}</Text>
            </View>
            {
              !fromDetail ? (
                this._renderButton()
              ) : null
            }
          </View>
          <View style={styles.icon}/>
        </TitleBg>
      </TouchableOpacity>
    )
  }

  _renderButton = () => {
    const {item, inputBoxEnable, onPress, openWeb} = this.props
    if(inputBoxEnable) {
      return (
        <View style={[styles.buttonList, item.uid !== 10000 && {justifyContent: 'space-between'}]}>
          {item.uid !== 10000 && (
            <Touchable containerStyle={{flexDirection: 'row', alignItems: 'flex-end'}} onPress={() => { goToPGC({openWeb, uid: item.uid}) }}>
              <GradientView
                style={[{width: 27, height: 27, borderRadius: 13.5, alignItems: 'center', justifyContent: 'center'}]}
                endColor="#FFA400"
                startColor="#FF7E00"
                direction={2}
              >
                <View style={{width: 25, height: 25, borderRadius: 12.5, backgroundColor: '#ffffff'}}>
                <WebImage uri={item.avatar} style={{width: 25, height: 25, borderRadius: 12.5}}/>
                </View>
              </GradientView>

              <View style={{marginLeft: px2dp(-13.5)}}>
                <GradientView
                  style={styles.voteBox}
                  endColor="#FF7E00"
                  startColor="#FF8300"
                  direction={2}
                >
                  <Text style={{color: '#ffffff', fontSize: 7}}>投稿人</Text>
                </GradientView>
              </View>
              <Text style={{marginLeft: 5, fontSize: 12, color: '#ffffff'}}>{item.uname}</Text>
            </Touchable>

          )}
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={onPress}
              activeOpacity={1}
              style={styles.button}
            >
              <GradientView
                style={[styles.button, {borderRadius: px2dp(17.5)}]}
                endColor="#FFA400"
                startColor="#FF7E00"
                direction={2}
              >
                <WebImage
                  name="answer/answer_edit"
                  style={{width: px2dp(11), height: px2dp(11.5), marginRight: px2dp(5)}}
                />
                <Text style={styles.buttonText}>抢答</Text>
              </GradientView>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} onPress={this.share}>
              <WebImage style={styles.shareButton} name="answer/title_share"/>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
    return (
      <View
        style={[styles.button, {backgroundColor: 'rgba(255,255,255, 0.3)', borderRadius: px2dp(17.5), alignItems: 'center', justifyContent: 'center'}]}
      >
        <WebImage
          name="answer/answer_edit"
          style={{width: px2dp(11), height: px2dp(11.5), marginRight: px2dp(5), opacity: 0.5}}
        />
        <Text style={[styles.buttonText, {color: 'rgba(255,255,255, 0.5)'}]}>抢答</Text>
      </View>
    )
  }

  share = () => {
    const {index, item} = this.props
    sendClickPingback('hole', '', `hole_share${index + 1}`)
    const {id, wxaPic, content} = item
    shareUrl({wxaPic, qid: id, title: content})
  }

}

// 无图或者有图的标题背景 android 底线 #e6e6e6 2px
class TitleBg extends PureComponent<QtitleProps, {}> {
  render() {
    const {children, item, bgColor, style, fromDetail} = this.props
    const detailStyle = fromDetail ? {height: px2dp(140) + HeaderPaddingTop} : null
    if(item.pic) {
      return (
        <Image source={{uri: item.pic}} style={[styles.titleBg, style, detailStyle]}>
          <View style={styles.opacityBg}>
            {children}
          </View>
        </Image>
      )
    }
    return (
      <LinearGradient
        colors={bgColor}
        start={{x: 1, y: 0}}
        end={{x: 0, y: 1}}
        style={[styles.titleBg, style, detailStyle]}
      >{children}
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    width: Width,
    overflow: 'hidden',
    paddingLeft: px2dp(25),
    paddingRight: px2dp(25),
    // paddingTop: px2dp(25.6),
    paddingBottom: px2dp(15),
    // justifyContent: 'space-between',
    // alignItems: 'flex-end'
  },
  title: {
    // paddingLeft: px2dp(8.5),
    // paddingTop: px2dp(9.4),
    width: '100%',
    minHeight: px2dp(64.4),
    height: px2dp(90),
    justifyContent: 'center'
  },
  titleText: {
    fontSize: px2dp(20),
    color: '#fff',
    lineHeight: px2dp(28),
    fontFamily: 'PingFangSC-Medium',
    fontWeight: '700',
  },
  button: {
    width: px2dp(71.5),
    height: px2dp(35),
    flexDirection: 'row'
  },
  buttonText: {
    fontSize: px2dp(14),
    color: '#fff',
    fontFamily: 'PingFangSC-Medium',
    fontWeight: '700'
  },
  titleBg: {
    marginBottom: px2dp(10)
  },
  quotation: {
    width: px2dp(26),
    height: px2dp(19.5),
    position: 'absolute',
    top: px2dp(13),
    left: px2dp(16)
  },
  icon: {
    position: 'absolute',
    left: px2dp(35),
    bottom: isIOS ? 0 : -1,
    borderTopWidth: px2dp(7),
    borderBottomWidth: px2dp(7),
    borderLeftWidth: px2dp(5.3),
    borderRightWidth: px2dp(5.3),
    borderLeftColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: '#F1F1F1',
    borderRightColor: 'transparent',
  },
  opacityBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)'
  },
  buttonList: {
    flex: 1,
    height: px2dp(35),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  shareButton: {
    width: px2dp(35),
    height: px2dp(35),
    marginLeft: px2dp(10)
  },
  voteBox: {
    width: px2dp(26),
    height: px2dp(11),
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: px2dp(5.5),
    borderTopRightRadius: px2dp(5.5),
    borderBottomRightRadius: px2dp(5.5),
  }
})
