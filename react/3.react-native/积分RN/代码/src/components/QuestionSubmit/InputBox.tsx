/**
脑洞投稿站
 */

import React, {Component} from 'react'
import {TouchableOpacity} from 'react-native'
import {EventModule} from '@iqiyi/rn-base-modules';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Text, View, Input} from '@iqiyi/rn-ui'
import {Width as DEVICE_WIDTH, isIOS} from '@iqiyi/rn-utils'

import WebImage from '../WebImage';
import {showToast} from '../../common/QYNativeBridge';
import {askToPublish} from '../../model/question/questionSubmit'
import SubmitModal from './SubmitModal'
import {goToLogin} from '../../common/util';
import {setUserSelectPic} from '../../actions/QuestionActions'
import BaseStyleSheet from '../../common/BaseStyleSheet';

//  以下宽度设置参考UI稿会比较明了
const INPUT_BOX_WRAPPER_WIDTH = DEVICE_WIDTH - 33
const INPUT_BOX_WRAPPER_HEIGHT = (INPUT_BOX_WRAPPER_WIDTH * 369) / 684
const INPUT_BOX_WIDTH = INPUT_BOX_WRAPPER_WIDTH - 9
const INPUT_BOX_HEIGHT = INPUT_BOX_WRAPPER_HEIGHT - 10

const PLACEHOLDER = '打开你的脑洞，秀出有趣的灵魂…' // placeholder内容
const INPUT_MAXLENGTH = 30 // 最多可以输入的字符个数


const SUCCESS = 'question/submit_success'
const FAIL = 'question/submit_fail'

const EVENT_NAME = isIOS ? 'key_movie_comment_target_picture_path' : 'com.qiyi.video.rn.image.pick'
interface InputBoxState {
  inputText: string; // 文本框输入内容
  textNum: number;// 文本框内容长度
  isSubmiting: boolean; // 是否正在发送中
}
interface InputBoxProps {
  goTo(p: any, o?: object): void;
  isLogin: boolean;
  showConfirmModal(s: object): void;
  hideConfirmModal(): any;
  openWeb(s: string): void;
  setUserSelectPic?(s: string): void;
  selectImage?: string;
}
@(connect(
  ({questionInfo}) => {
    const {selectImage} = questionInfo
    return {
      selectImage
    };
  },
  dispatch => bindActionCreators({
    setUserSelectPic
  }, dispatch),
  null,
  {withRef: true},
) as any)
export default class InputBox extends Component<InputBoxProps, InputBoxState> {
  private requestLock: boolean;

  public constructor(props) {
    super(props)

    this.state = {
      inputText: '',
      textNum: 0, // 用户已经输入的值
      isSubmiting: false,
    }
    this.requestLock = false
  }

  componentDidMount() {
    EventModule.addNativeNotificationObserver(EVENT_NAME, (response) => {
      if(response && (response.imagePath || response.localImgPath)) {
        let {imagePath, localImgPath} = response
        imagePath = imagePath || localImgPath
        imagePath = /$file:\/\//.test(imagePath) ? imagePath : `file://${imagePath}`
        this.props.setUserSelectPic(imagePath)
      }
    })
  }

  render() {
    const {inputText, textNum, isSubmiting} = this.state
    const {selectImage} = this.props
    const submitPicName = textNum > 7 ? 'question/picture_focus' : 'question/picture_grey'
    const btnColor = textNum > 7 ? isSubmiting ? '#E1E1E1' : '#FF5300' : '#E1E1E1'
    const btnText = isSubmiting ? '发送中' : '发送'
    return (
      <WebImage name="question/input_box" style={styles.inputBoxWrapper}>
        <View style={styles.inputBox}>
          <Input
            style={{}}
            placeholder={PLACEHOLDER}
            placeholderTextColor="#C2C2C2"
            selectionColor="#00C025"
            multiline={true}
            onChangeText={this.onChangeText}
            value={inputText}
            underlineColorAndroid="transparent"
            textAlignVertical="center"
            // ref={(input) => { this.input = input }}
            maxLength={INPUT_MAXLENGTH}
          />
        <View style={styles.bottomMenu}>
          {/* 添加背景图片按钮 */}
          {selectImage ? (
            <TouchableOpacity activeOpacity={1} onPress={this.goToPreview} style={[styles.submitPic, {alignItems: 'center', justifyContent: 'center'}]}>
              <WebImage uri={selectImage} style={[styles.submitPic, {position: 'absolute', top: 0}]}/>
              <View style={[styles.submitPic, {position: 'absolute', top: 0, opacity: 0.4, backgroundColor: '#000000'}]}/>
              <Text style={[{fontSize: 12, color: '#ffffff', fontWeight: BaseStyleSheet.FontWeight.Medium}]}>预览效果</Text>

            </TouchableOpacity>
            ) : (
            <TouchableOpacity activeOpacity={1} onPress={this.addPic}>
              < WebImage name={submitPicName} style={styles.submitPic}/>
            </TouchableOpacity>
            )
          }
          <View style={styles.inputStatusBox}>
            {/* 字数提示 */}
            <Text style={styles.textLengt}>{textNum}/30</Text>
            {/* 发送按钮 */}
            <TouchableOpacity style={[styles.submitBtnBox, {backgroundColor: btnColor}]} onPress={this.submit} activeOpacity={1}>
              <Text style={styles.submitBtnText}>{btnText}</Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>
      </WebImage>
    )
  }

  onChangeText = (inputText) => {
    this.setState({
      inputText,
      textNum: inputText.length,
    })
  }

  addPic = () => {
    const {textNum} = this.state
    if(textNum < 8) {
      showToast('写够8字才能添加背景图呦~')
    } else {
      this.openSelectPage()
    }
  }

  openSelectPage = () => {
    this.props.openWeb(JSON.stringify({
      biz_params: {
        biz_params: '',
        biz_statistics: 'from_type=integral',
        biz_extend_params: '',
        biz_sub_id: '13',
        biz_dynamic_params: 'aspectRatios=2.4'
      },
      biz_plugin: 'qiyimp',
      biz_id: '113'
    }))
  }

  goToPreview = () => {
    this.props.goTo('QuestionPreview', {inputText: this.state.inputText})
  }

  submit = () => {
    const {textNum, inputText} = this.state
    const {isLogin, selectImage} = this.props
    if(this.requestLock) {
      return
    }
    if(!isLogin) {
      goToLogin()
    } else {
      if(textNum < 8) {
        showToast('写够8字哟~')
        return false
      }
      this.requestLock = true
      this.setState({
        isSubmiting: true
      })
      askToPublish(inputText, selectImage).then((data) => {
        this.setState({
          inputText: '',
          textNum: 0,
          isSubmiting: false
        }, () => {
          this.requestLock = false
          this.props.showConfirmModal({
            content: <SubmitModal
              hide={this.props.hideConfirmModal}
              goTo={this.props.goTo}
              iconName={SUCCESS}
            />,
            isTransparent: true,
            showCloseButton: false
          })
          setTimeout(() => {
            this.props.hideConfirmModal().then(this.props.goTo('MySubmitList'))
            this.props.setUserSelectPic('')
          }, 2000)
        })
      }).catch(() => {
        this.requestLock = false
        this.setState({
          isSubmiting: false
        })
        this.props.showConfirmModal({
          content: <SubmitModal
            hide={this.props.hideConfirmModal}
            goTo={this.props.goTo}
            iconName={FAIL}
          />,
          isTransparent: true,
          showCloseButton: false
        })
      })
    }
  }

}

const styles = global.BaseStyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 90
  },
  leftDot: {
    width: 46.5,
    height: 27.5,
    marginTop: 6
  },
  headCloud: {
    width: 244,
    height: 92,
    position: 'absolute',
    top: 0,
    alignSelf: 'center'
  },
  inputBoxWrapper: {
    width: INPUT_BOX_WRAPPER_WIDTH,
    height: INPUT_BOX_WRAPPER_HEIGHT,
    alignSelf: 'center',
    marginTop: -6
  },
  cheese: {
    width: 205,
    height: 90,
    position: 'absolute',
    right: 0,
    bottom: 0
  },
  inputBox: {
    width: INPUT_BOX_WIDTH,
    height: INPUT_BOX_HEIGHT,
    position: 'absolute',
    bottom: 0,
    left: 0,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 15,
  },
  bottomMenu: {
    position: 'absolute',
    flex: 1,
    paddingHorizontal: 15,
    bottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: INPUT_BOX_WIDTH,
    alignItems: 'flex-end'
  },
  submitBtnBox: {
    width: 70,
    height: 35,
    justifyContent: 'center',
    marginLeft: 8
  },
  submitBtnText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#ffffff'
  },
  inputStatusBox: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textLengt: {
    fontSize: 12,
    color: '#999999'
  },
  submitPic: {
    width: 135,
    height: 56
  }
});
