import React, {PureComponent} from 'react';
import {
  StyleSheet,
  Image,
  CameraRoll,
  PermissionsAndroid
} from 'react-native'
import {
  View,
  Text
} from '@iqiyi/rn-ui'
import {isIOS} from '@iqiyi/rn-utils'
import {takeSnapshot} from '@iqiyi/rn-view-shot';
import GradientView from '../GradientView'
import WebImage from '../WebImage'
import {sharePic} from './ShareFn'
import {showToast} from '../../common/QYNativeBridge'
import RNQoe from '../../qoe'

const ANDROID_WRITE_EXTERNAL_STORAGE = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE


class SharePng extends PureComponent {
  static defaultProps = {
    data: {
      isLike: 0,
      uname: '',
      content: '',
      likeTotal: 0,
      userSelfName: '',
      userSelfAvatar: '',
      questionTitle: '',
      wxaCode: '',
      qid: ''
    }
  }
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data,
      visiable: false,
      hasAndroidPermission: false // 默认没有android权限
      // shareStatus: 0 // 0 表示不需要调起分享，1需要调起
    }
    this.posterShareImage = React.createRef();
    // 记录图片加载完成状态（不论失败成功）
    this.userImageLoadEnd = false
    this.wxaCodeImageLoadEnd = false
  }
  render() {
    const {data, visiable} = this.state
    if(!visiable) return null
    return (
      <View
        style={styles.hideView}
        ref={this.posterShareImage}
        collapsable={false}
      >
        <GradientView
          style={styles.content}
          startColor="#FF8D76"
          endColor="#FF4A40"
          rowDirection={2}
        >
          <View style={styles.userInfo}>
            <Image source={{uri: data.userSelfAvatar || 'default_icon'}} style={styles.avatar} onLoadEnd={() => { this.loadEndImage('userImageLoadEnd') }}/>
            <Text style={styles.nickname} numberOfLines={1}>
              {data.userSelfName && data.userSelfName !== 0 && data.userSelfName !== '0' ? data.userSelfName : '我'} 分享了一个脑洞
            </Text>
          </View>
          <View style={styles.colorBg}>
            <GradientView
              style={{width: 200.5, height: 145}}
              startColor="#FF9866"
              endColor="#FFA300"
              rowDirection={2}
            />
          </View>
          <View style={styles.footer}>
            <Image style={styles.qrcode} source={{uri: data.wxaCode}} onLoadEnd={() => { this.loadEndImage('wxaCodeImageLoadEnd') }}/>
            <View style={{paddingVertical: 12}}>
              <Text style={styles.text}>扫一扫 </Text>
              <Text style={styles.text}>开启你的脑洞之旅吧</Text>
            </View>
          </View>
          <WebImage name="answer/share_right" style={styles.hot_bg_right} />
          <View style={styles.detail}>
            <View style={{height: 40}}>
              <Text numberOfLines={2} style={styles.title}>{data.questionTitle}</Text>
            </View>
            <View style={styles.line}/>
            <View style={{height: 33}}>
              <Text numberOfLines={2} style={styles.answer}>{data.content}</Text>
            </View>
            <View style={styles.answerInfo}>
              <Text style={styles.uname}>{data.uname}</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <WebImage name={data.isLike ? 'answer/star' : 'answer/unstar'} style={styles.icon}/>
                <Text style={[styles.name, {color: data.isLike ? '#FF6353' : '#666'}]}>{data.likeTotal > 0 ? data.likeTotal : ''}</Text>
              </View>
            </View>
          </View>
        </GradientView>
      </View>
    );
  }
  // 获取android存储权限
  requestCameraPermission = async (data) => {
    try {
      const hasGranted = await PermissionsAndroid.check(ANDROID_WRITE_EXTERNAL_STORAGE)
      if(hasGranted) {
        this.setPngData(data)
        this.setState({hasAndroidPermission: true})
      } else {
        const granted = await PermissionsAndroid.request(ANDROID_WRITE_EXTERNAL_STORAGE)
        if(granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.setPngData(data)
          this.setState({hasAndroidPermission: true})
        } else {
          showToast('拒绝存储权限，无法生成图片分享')
        }
      }
    } catch(err) {
      showToast('获取存储权限失败，请在设置中手动修改')
    }
  }
  share = (data) => {
    const {hasAndroidPermission} = this.state
    if(isIOS) {
     return this.setPngData(data)
    }
    if(hasAndroidPermission) {
      this.setPngData(data)
    } else {
      this.requestCameraPermission(data)
    }
  }
  setPngData = (data) => {
    RNQoe.sendInterface('uri', 'step_one')
    this.setState({
      data,
      visiable: true
    })
    // , () => {
    //   RNQoe.sendInterface('uri', 'step_two')
    //   if(isIOS) {
    //     RNQoe.sendInterface('uri', 'step_three');
    //     this._savePoster()
    //   } else {
    //     InteractionManager.runAfterInteractions(() => {
    //       RNQoe.sendInterface('uri', 'step_three');
    //       this._savePoster()
    //     })
    //   }
    // }
  }
  loadEndImage(keyName) {
    RNQoe.sendInterface('uri', 'loadend')
    this[keyName] = true
    // 头像和二维码都加载完成再截图分享
    if(this.userImageLoadEnd && this.wxaCodeImageLoadEnd) {
      setTimeout(this._savePoster, 300)
    }
  }
  // 截图分享
  _savePoster = () => {
    RNQoe.sendInterface('uri', 'save')
    const options = {
      format: 'jpeg',
      quality: 0.8,
    }
    // setState之后，update 之前 由于组件重新渲染，posterShareImage.current 可能会得到null
    takeSnapshot(this.posterShareImage.current, options).then(
      (uri) => {
        RNQoe.sendInterface('uri', uri)
        this.startShare(uri)
        CameraRoll.saveToCameraRoll(uri).then(() => {}).catch(() => {});
      },
      (e) => {
        RNQoe.sendInterface('urierror', e)
        this.endShare()
        showToast('生成图片失败')
      }
    )
  }
  startShare = (pic) => {
    this.endShare()
    const {qid, questionTitle} = this.state.data
    sharePic({pic, qid, title: questionTitle})
  }
  endShare() {
    this.setState({
      visiable: false
    })
    this.userImageLoadEnd = false
    this.wxaCodeImageLoadEnd = false
  }
}

export default SharePng

const styles = StyleSheet.create({
  hideView: {
    position: 'absolute',
    opacity: 1,
    top: -1100,
    left: -1100,
    width: 235,
    height: 284,
  },
  content: {
    width: 235,
    height: 284,
    borderRadius: 10,
    paddingTop: 17,
    paddingBottom: 12,
    paddingLeft: 15.5,
    paddingRight: 10.5
  },
  userInfo: {
    width: 209,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 22,
    overflow: 'hidden'
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    overflow: 'hidden',
    marginRight: 6
  },
  nickname: {
    fontSize: 12,
    fontFamily: 'PingFangSC-Semibold',
    fontWeight: 'bold',
    color: '#fff',
    flex: 1
  },
  colorBg: {
    width: 200.5,
    height: 145,
    marginTop: 17,
    marginLeft: 8.5
  },
  hot_bg_right: {
    position: 'absolute',
    width: 118,
    height: 36,
    bottom: 37,
    right: 10.5
  },
  footer: {
    width: '100%',
    height: 45,
    marginTop: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  qrcode: {
    width: 45,
    height: 45,
    marginRight: 7.5
  },
  text: {
    fontSize: 12,
    color: '#FFFFFF'
  },
  detail: {
    width: 200,
    height: 150,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    left: 15.5,
    top: 65,
    paddingHorizontal: 9,
    paddingTop: 15,
    paddingBottom: 14
  },
  title: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    lineHeight: 20
  },
  line: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    marginVertical: 10,
    backgroundColor: '#ccc'
  },
  answer: {
    color: '#333',
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
    lineHeight: 16.5
  },
  answerInfo: {
    width: '100%',
    height: 16.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  icon: {
    width: 15,
    height: 15,
    marginRight: 2,
  },
  name: {
    fontSize: 12
  },
  uname: {
    color: '#999',
    fontSize: 12
  }
})
