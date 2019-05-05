/**
 * KeyboardAvoidingView 在ios运行良好，android兼容性很差，只能显示输入框，不能显示其他按钮，
 * android 解决方案，在键盘弹出后，在input输入框下方放置一个键盘等高的空白容器占位，把输入框抬起来
*/
import React, {PureComponent} from 'react'
import {
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard
} from 'react-native'
import {
  Input,
  Text,
} from '@iqiyi/rn-ui'
import {
  Width,
  Height,
  isIOS
} from '@iqiyi/rn-utils'
import {publish} from '../../model/question/index'
import {showToast} from '../../common/QYNativeBridge'
import {sendClickPingback} from '../../common/pingback'
import WebImage from '../WebImage'
import {goToLogin} from '../../common/util'
import {shareWxChannel, shareUrl} from './ShareFn'
import BaseStyleSheet from '../../common/BaseStyleSheet'


const WrapContent = isIOS ? KeyboardAvoidingView : View
const MaxTextNum = 140

interface InputBoxProps {
  showKeyBoard?: boolean;
  isLogin?: boolean;
  inputBoxEnable?: boolean;
  data?: {
    [key: string]: any;
  };
  qid?: number | string;
  afterAnswerSuccess?(any): void;
}

interface InputBoxState {
  textNum: number;
  behavior: "height" | "position" | "padding";
  visiable: boolean;
  text: string;
  height: number;
  keyboardHeight: number;
}

export default class extends PureComponent<InputBoxProps, InputBoxState> {
  private input = null;
  private androidTextInput = null;
  private keyboardDidShowListener = null;
  private keyboardDidHideListener = null;

  constructor(props) {
    super(props)
    const {showKeyBoard, isLogin} = this.props
    this.state = {
      textNum: MaxTextNum, // 最多可以输入的字数
      behavior: 'padding',
      visiable: showKeyBoard && isLogin, // 输入框是否可见
      text: '',
      height: 20,
      keyboardHeight: 0
    }
    if(!isIOS) this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.hideInput);
    if(!isLogin && showKeyBoard) {
      goToLogin()
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener && this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener && this.keyboardDidHideListener.remove()
  }

  render() {
    const {visiable, textNum, text, height, keyboardHeight} = this.state
    const {inputBoxEnable} = this.props
    const showNum = textNum <= 10
    if(!visiable) {
      return (
        <View style={[styles.footer, styles.androidShadow]}>
          {
            inputBoxEnable
            ? (
              <TouchableOpacity style={styles.footerInput} activeOpacity={1} onPress={this.clickInputButton}>
                <WebImage name="answer/qs_write" style={styles.qs_write}/>
                <Text style={styles.defalutText}>快来抢答吧~</Text>
              </TouchableOpacity>
            )
            : (
              <View style={styles.footerInput}>
                <WebImage name="answer/disable_pen" style={styles.qs_write}/>
                <Text style={[styles.defalutText, {color: '#ccc'}]}>暂时不能抢答，点击右侧分享吧</Text>
              </View>
            )
          }
          <View style={styles.footerButtonList}>
            <TouchableOpacity activeOpacity={1} onPress={this.sharewx}>
              <WebImage name="answer/wx_share" style={styles.button}/>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} onPress={this.shareurl}>
              <WebImage name="answer/share_icon" style={styles.button}/>
            </TouchableOpacity>
          </View>
        </View>
      )
    }

    return (
      <WrapContent style={styles.container} behavior={this.state.behavior}>
        <View style={{flex: 1}}>
          <TouchableOpacity onPress={this._pressBg} style={{flex: 1}}>
            <View style={styles.transparentBg}/>
          </TouchableOpacity>
        </View>
        <View style={[styles.inputContent, isIOS ? styles.iosShadow : styles.androidShadow]} ref={(androidTextInput) => { this.androidTextInput = androidTextInput }}>
            <View style={[styles.inputOut, showNum && styles.inputWithNum]}>
              <Input
                style={[styles.input, {height}]}
                placeholderTextColor="#999"
                selectionColor="#00C025"
                ref={(input) => { this.input = input; if(input) { this.autoShowKeyBoard() } }}
                value={text}
                multiline={true}
                onChangeText={this.textChange}
                underlineColorAndroid="transparent"
                textAlignVertical="center"
                onContentSizeChange={this.cauculateHeight}
              />
              {
                showNum ? <Text style={[styles.textNum, textNum < 0 && {color: 'red'}]}>{textNum}</Text> : null
              }
            </View>
            <TouchableOpacity style={styles.inputFooter} activeOpacity={1} onPress={this.publishAnswer}>
              <Text style={[styles.sendText, {color: textNum <= MaxTextNum ? '#FF7E00' : '#999'}]}>发送</Text>
            </TouchableOpacity>
        </View>
        {isIOS ? null : <View style={{height: keyboardHeight}} />}
      </WrapContent>
    )
  }

  sharewx = () => {
    sendClickPingback('holex', '', 'holex_wechatshare')
    const {id, wxaPic, content} = this.props.data
    shareWxChannel({wxaPic, qid: id, title: content})
  }

  shareurl = () => {
    sendClickPingback('holex', '', 'holex_share')
    const {id, wxaPic, content} = this.props.data
    shareUrl({wxaPic, qid: id, title: content})
  }

  clickInputButton = () => {
    if(!this.props.isLogin) {
      return goToLogin()
    }
    this.showInput()
  }

  autoShowKeyBoard = () => {
    // 由于首页有很多循环动画，很有可能导致 InteractionManager 不执行
    // InteractionManager.runAfterInteractions(this.clickInputButton)
    setTimeout(this.clickInputButton, isIOS ? 1000 : 500)
  }

  textChange = (text) => {
    this.setState({
      text,
      textNum: MaxTextNum - text.length
    })
  }

  publishAnswer = () => {
    sendClickPingback('holex', '', 'send')
    const {text} = this.state
    if(text.length > MaxTextNum) {
      return showToast('你输入的字数超过限制啦')
    }
    if(text.length === 0) {
      return showToast('你还什么都没写呢')
    }
    this.sendAnswer()
  }

  sendAnswer = async () => {
    const {text} = this.state
    const {qid} = this.props
    try {
      const result = await publish({content: encodeURI(text), qid})
      const {code, data} = result
      if(code === 'A00000') {
        // 发布成功
        if(data.firstAnswer) {
          showToast('回答已发送，2积分已发放~')
        } else {
          showToast('回答已发送~')
        }
        this.hideSuccessInput()
        this.sendSuccessCb(data, text, false)
        return
      } else if(code === 'B00002') {
        return showToast('答案包含敏感信息，请重新回答')
      } else if(code === 'B00003') {
        if(data.firstAnswer) {
          showToast('2积分已发放，答案需审核后显示哦')
        } else {
          showToast('答案审核中，请耐心等待~')
        }
        this.hideSuccessInput()
        this.sendSuccessCb(data, text, true)
        return
      }
      showToast('网络错误，请稍后再试')
    } catch(e) {
      showToast('网络错误，请稍后再试')
    }
  }

  showInput = () => {
    // 云控
    if(!this.props.inputBoxEnable) return false
    if(this.state.visiable) {
      this.input && this.input.focus()
    } else {
      this.setState({
          visiable: true
        }, () => {
          this.input && this.input.focus()
        })
    }
  }

  hideSuccessInput = () => {
    this.setState({
      visiable: false,
      text: '',
      height: 20,
      textNum: MaxTextNum
    })
  }

  hideInput = () => {
    this.setState({
      visiable: false
    })
  }

  _pressBg = () => {
    sendClickPingback('holex', '', 'quit')
    this.hideInput()
  }

  keyboardDidShow = (e) => {
    if(isIOS) return false
    try {
      if(this.state.keyboardHeight) {
        this.showAndroidInput()
      } else {
        this.setState({
            keyboardHeight: e.endCoordinates.height
        }, this.showAndroidInput)
      }
    }catch(e){} // eslint-disable-line
  }

  showAndroidInput = () => {
    if(isIOS) return false
    this.androidTextInput && this.androidTextInput.setNativeProps({
      opacity: 1
    })
  }

  cauculateHeight = (e) => {
    const contentHeight = e.nativeEvent.contentSize.height <= 20 ? 20 : e.nativeEvent.contentSize.height;
    let height = 20
    if(contentHeight > 20 && contentHeight <= 80) {
      height = contentHeight
    } else if(contentHeight > 80) {
      height = 80
    }
    this.setState({height});
  }

  // 发布成功后回调信息
  sendSuccessCb(data, text, needFake) {
    const {qid, afterAnswerSuccess} = this.props
    afterAnswerSuccess && afterAnswerSuccess({
      qid,
      content: text,
      firstAnswer: data.firstAnswer,
      needFake,
      id: data.id
    })
  }
}

const styles = BaseStyleSheet.create({
  container: {
    flex: 1,
    width: Width,
    minHeight: Height,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 0,
    bottom: 0
  },
  transparentBg: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  inputContent: {
    width: Width,
    backgroundColor: '#FFF',
    minHeight: 50,
    justifyContent: 'center',
    paddingTop: 6.5,
    paddingBottom: 8.5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  input: {
    width: Width - 135,
    backgroundColor: 'transparent',
    fontSize: 14,
    justifyContent: 'center',
    height: 20,
    lineHeight: 20,
    padding: 0,
  },
  inputOut: {
    width: Width - 80,
    minHeight: 35,
    backgroundColor: '#F0F0F0',
    borderRadius: 17.5,
    paddingHorizontal: 17.5,
    paddingVertical: 7.5,
  },
  inputWithNum: {
    paddingTop: 0,
    paddingBottom: 15
  },
  iosShadow: {
    shadowColor: '#999',
    shadowOffset: {h: 10, w: 10},
    shadowRadius: 3,
    shadowOpacity: 0.5,
  },
  androidShadow: {
    borderTopColor: '#e6e6e6',
    borderTopWidth: 1
  },
  inputFooter: {
    width: 50,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  sendText: {
    fontSize: 15,
    color: '#999'
  },
  footer: {
    width: Width,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingHorizontal: 15,
    paddingTop: 6.5,
    paddingBottom: 8.5,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0
  },
  footerInput: {
    flexGrow: 1,
    height: 35,
    paddingLeft: 8,
    borderRadius: 17.5,
    backgroundColor: '#F8F8F8',
    flexDirection: 'row',
    alignItems: 'center',
  },
  qs_write: {
    width: 20,
    height: 20,
    marginRight: 4.5
  },
  defalutText: {
    fontSize: 14,
    color: '#333',
  },
  footerButtonList: {
    width: 100,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  button: {
    width: 30,
    height: 30,
    marginLeft: 15
  },
  textNum: {
    fontSize: 12,
    color: '#ccc',
    position: 'absolute',
    bottom: 5,
    right: 11
  }
})
